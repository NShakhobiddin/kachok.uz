// Kirish: telefon raqami → SMS kod → JWT (15 daq) + yangilash tokeni (60 kun, har safar almashtiriladi).
import { Hono } from 'hono';
import { z } from 'zod';
import { rateLimit, requireAuth, type AppEnv, type Deps } from '../app.js';
import { entitlements } from '../billing/subscription.js';
import { hmac, otpCode, randomToken, safeEqual, sha256 } from '../lib/crypto.js';
import { signAccess } from '../lib/jwt.js';
import { normalizePhone } from '../lib/phone.js';

const OTP_TTL_MS = 5 * 60 * 1000;
const RESEND_MS = 60 * 1000;
const MAX_PER_HOUR = 5;
const MAX_ATTEMPTS = 5;
const REFRESH_DAYS = 60;

interface UserRow {
  id: string;
  phone: string;
  name: string;
  role: 'athlete' | 'coach';
  created_at: Date;
}

export function publicUser(u: UserRow) {
  return { id: u.id, phone: u.phone, name: u.name, role: u.role };
}

async function issueTokens(deps: Deps, user: UserRow) {
  const access = await signAccess(deps.env.JWT_SECRET, { sub: user.id, role: user.role });
  const refresh = randomToken();
  await deps.db.query(`INSERT INTO refresh_tokens (token_hash, user_id, expires_at) VALUES ($1, $2, now() + make_interval(days => $3))`, [
    sha256(refresh),
    user.id,
    REFRESH_DAYS,
  ]);
  return { access, refresh };
}

/** `meOnly` — /me, /notes kabi ildiz marshrutlar uchun alohida guruh */
export function authRoutes(deps: Deps, meOnly = false) {
  const r = new Hono<AppEnv>();
  const { db, env } = deps;

  if (meOnly) {
    r.use('/me', requireAuth(env));
    r.use('/notes', requireAuth(env));

    r.get('/me', async (c) => {
      const uid = c.get('uid');
      const { rows } = await db.query<UserRow>('SELECT * FROM users WHERE id = $1', [uid]);
      if (!rows[0]) return c.json({ error: 'not_found' }, 404);
      const coach = await db.query<{ id: string; name: string }>(
        `SELECT u.id, u.name FROM coach_links l JOIN users u ON u.id = l.coach_id WHERE l.client_id = $1 AND l.status = 'active' LIMIT 1`,
        [uid],
      );
      return c.json({ user: publicUser(rows[0]), entitlements: await entitlements(db, uid), coach: coach.rows[0] ?? null });
    });

    r.patch('/me', async (c) => {
      const body = z.object({ name: z.string().trim().max(60).optional(), role: z.enum(['athlete', 'coach']).optional() }).parse(await c.req.json());
      const uid = c.get('uid');
      const { rows } = await db.query<UserRow>(
        `UPDATE users SET name = COALESCE($2, name), role = COALESCE($3, role) WHERE id = $1 RETURNING *`,
        [uid, body.name ?? null, body.role ?? null],
      );
      // rol o'zgarsa yangi access token kerak
      const access = await signAccess(env.JWT_SECRET, { sub: uid, role: rows[0].role });
      return c.json({ user: publicUser(rows[0]), access });
    });

    r.delete('/me', async (c) => {
      await db.query('DELETE FROM users WHERE id = $1', [c.get('uid')]);
      return c.json({ ok: true });
    });

    r.get('/notes', async (c) => {
      const { rows } = await db.query(
        `SELECT n.id, n.text, n.created_at, u.name AS coach_name FROM coach_notes n JOIN users u ON u.id = n.coach_id
          WHERE n.client_id = $1 ORDER BY n.created_at DESC LIMIT 20`,
        [c.get('uid')],
      );
      return c.json({ notes: rows });
    });
    return r;
  }

  r.post('/otp', rateLimit(20, 60 * 60 * 1000), async (c) => {
    const { phone: raw } = z.object({ phone: z.string().max(32) }).parse(await c.req.json());
    const phone = normalizePhone(raw);
    if (!phone) return c.json({ error: 'bad_phone', message: "Raqam noto'g'ri. Masalan: +998 90 123 45 67" }, 400);
    const now = Date.now();
    const prev = (await db.query<{ last_sent_at: Date; window_start: Date; sent_count: number }>('SELECT * FROM otp_codes WHERE phone = $1', [phone])).rows[0];
    if (prev && now - new Date(prev.last_sent_at).getTime() < RESEND_MS)
      return c.json({ error: 'too_soon', message: 'Kod yaqinda yuborildi. 1 daqiqadan so‘ng qayta so‘rang.' }, 429);
    const inWindow = prev && now - new Date(prev.window_start).getTime() < 60 * 60 * 1000;
    if (inWindow && prev.sent_count >= MAX_PER_HOUR) return c.json({ error: 'too_many', message: "Bir soatda 5 martadan ko'p kod so'raldi. Keyinroq urinib ko'ring." }, 429);

    const code = otpCode();
    await db.query(
      `INSERT INTO otp_codes (phone, code_hash, expires_at, attempts, sent_count, window_start, last_sent_at)
       VALUES ($1, $2, $3, 0, 1, now(), now())
       ON CONFLICT (phone) DO UPDATE SET code_hash = $2, expires_at = $3, attempts = 0, last_sent_at = now(),
         sent_count = CASE WHEN $4 THEN otp_codes.sent_count + 1 ELSE 1 END,
         window_start = CASE WHEN $4 THEN otp_codes.window_start ELSE now() END`,
      [phone, hmac(env.JWT_SECRET, `${phone}:${code}`), new Date(now + OTP_TTL_MS), !!inWindow],
    );
    await deps.sms.send(phone, `GYMbos: tasdiqlash kodi ${code}. Hech kimga bermang.`);
    return c.json({ ok: true, phone, ...(env.SMS_PROVIDER === 'console' ? { devCode: code } : {}) });
  });

  r.post('/verify', rateLimit(60, 60 * 60 * 1000), async (c) => {
    const body = z.object({ phone: z.string().max(32), code: z.string().regex(/^\d{6}$/) }).safeParse(await c.req.json());
    if (!body.success) return c.json({ error: 'bad_code', message: 'Kod 6 ta raqamdan iborat' }, 400);
    const phone = normalizePhone(body.data.phone);
    if (!phone) return c.json({ error: 'bad_phone', message: "Raqam noto'g'ri" }, 400);
    const row = (await db.query<{ code_hash: string; expires_at: Date; attempts: number }>('SELECT * FROM otp_codes WHERE phone = $1', [phone])).rows[0];
    if (!row || new Date(row.expires_at).getTime() < Date.now()) return c.json({ error: 'expired', message: 'Kod eskirgan. Yangi kod so‘rang.' }, 400);
    if (row.attempts >= MAX_ATTEMPTS) return c.json({ error: 'locked', message: "Urinishlar tugadi. Yangi kod so'rang." }, 429);
    if (!safeEqual(row.code_hash, hmac(env.JWT_SECRET, `${phone}:${body.data.code}`))) {
      await db.query('UPDATE otp_codes SET attempts = attempts + 1 WHERE phone = $1', [phone]);
      return c.json({ error: 'wrong_code', message: "Kod noto'g'ri" }, 400);
    }
    await db.query('DELETE FROM otp_codes WHERE phone = $1', [phone]);
    let user = (await db.query<UserRow>('SELECT * FROM users WHERE phone = $1', [phone])).rows[0];
    const isNew = !user;
    if (!user) {
      user = (
        await db.query<UserRow>(`INSERT INTO users (phone, trial_until) VALUES ($1, now() + make_interval(days => $2)) RETURNING *`, [phone, env.TRIAL_DAYS])
      ).rows[0];
    }
    return c.json({ ...(await issueTokens(deps, user)), user: publicUser(user), isNew });
  });

  r.post('/refresh', async (c) => {
    const { refresh } = z.object({ refresh: z.string().min(10).max(200) }).parse(await c.req.json());
    const hash = sha256(refresh);
    const row = (
      await db.query<{ user_id: string; expires_at: Date; revoked_at: Date | null }>('SELECT * FROM refresh_tokens WHERE token_hash = $1', [hash])
    ).rows[0];
    if (!row || row.revoked_at || new Date(row.expires_at).getTime() < Date.now()) return c.json({ error: 'unauthorized', message: 'Qaytadan kiring' }, 401);
    await db.query('UPDATE refresh_tokens SET revoked_at = now() WHERE token_hash = $1', [hash]);
    const user = (await db.query<UserRow>('SELECT * FROM users WHERE id = $1', [row.user_id])).rows[0];
    if (!user) return c.json({ error: 'unauthorized' }, 401);
    return c.json({ ...(await issueTokens(deps, user)), user: publicUser(user) });
  });

  r.post('/logout', async (c) => {
    const { refresh } = z.object({ refresh: z.string().max(200) }).parse(await c.req.json());
    await db.query('UPDATE refresh_tokens SET revoked_at = now() WHERE token_hash = $1', [sha256(refresh)]);
    return c.json({ ok: true });
  });

  return r;
}

