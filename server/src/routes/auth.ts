// Kirish: telefon raqami → SMS kod → JWT (15 daq) + yangilash tokeni (60 kun, har safar almashtiriladi).
import { Hono } from 'hono';
import { z } from 'zod';
import { rateLimit, requireAuth, type AppEnv, type Deps } from '../app.js';
import { entitlements } from '../billing/subscription.js';
import type { Queryable } from '../db/index.js';
import type { Env } from '../env.js';
import { hmac, otpCode, randomToken, safeEqual, sha256 } from '../lib/crypto.js';
import { ApiError, readBody, readJson, scrubError } from '../lib/http.js';
import { signAccess } from '../lib/jwt.js';
import { normalizePhone } from '../lib/phone.js';

const HOUR_MS = 60 * 60 * 1000;
const OTP_TTL_MS = 5 * 60 * 1000;
const RESEND_SEC = 60;
/** Bitta raqamga SMS: soatiga va kuniga */
export const SMS_PER_HOUR = 5;
export const SMS_PER_DAY = 10;
/** Bitta kod uchun urinishlar */
const MAX_ATTEMPTS = 5;
/** Bitta raqam uchun kunlik xato urinishlar (kod qayta yuborilsa ham nolga tushmaydi) */
export const MAX_FAILS_PER_DAY = 10;
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

/** Bepul sinov belgisi uchun kalit: raqamning o'zi saqlanmaydi */
const trialKey = (env: Env, phone: string) => hmac(env.JWT_SECRET, `trial:${phone}`);

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

/** Foydalanuvchini topish yoki yaratish. Sinov faqat shu raqamga hali berilmagan bo'lsa beriladi (akkaunt o'chirib qayta ochilsa — yo'q) */
async function findOrCreateUser(deps: Deps, phone: string): Promise<{ user: UserRow; isNew: boolean }> {
  const { db, env } = deps;
  const existing = (await db.query<UserRow>('SELECT * FROM users WHERE phone = $1', [phone])).rows[0];
  if (existing) return { user: existing, isNew: false };
  return db.tx(async (q) => {
    const fresh = await q.query('INSERT INTO trial_used (phone_hash) VALUES ($1) ON CONFLICT DO NOTHING RETURNING 1', [trialKey(env, phone)]);
    // bir vaqtdagi ikkinchi so'rov unique xatosi bilan 500 bermasin — mavjud qatorni qaytaradi
    const { rows } = await q.query<UserRow & { inserted: boolean }>(
      `INSERT INTO users (phone, trial_until) VALUES ($1, CASE WHEN $3 THEN now() + make_interval(days => $2) END)
       ON CONFLICT (phone) DO UPDATE SET phone = EXCLUDED.phone
       RETURNING *, (xmax = 0) AS inserted`,
      [phone, env.TRIAL_DAYS, fresh.rows.length > 0],
    );
    const { inserted, ...user } = rows[0];
    return { user, isNew: inserted };
  });
}

/** Eskirgan cheklov yozuvlarini vaqti-vaqti bilan tozalash (raqamlar keragidan ortiq saqlanmasin) */
async function cleanup(q: Queryable) {
  await q.query(`DELETE FROM phone_limits WHERE day < current_date - 1 AND (last_sent_at IS NULL OR last_sent_at < now() - interval '2 days')`);
  await q.query(`DELETE FROM otp_codes WHERE expires_at < now() - interval '1 day'`);
  await q.query(`DELETE FROM sms_budget WHERE hour < now() - interval '2 days'`);
}

class Rollback extends Error {}

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
      const body = await readBody(c, z.object({ name: z.string().trim().max(60).optional(), role: z.enum(['athlete', 'coach']).optional() }));
      const uid = c.get('uid');
      const { rows } = await db.query<UserRow>(`UPDATE users SET name = COALESCE($2, name), role = COALESCE($3, role) WHERE id = $1 RETURNING *`, [
        uid,
        body.name ?? null,
        body.role ?? null,
      ]);
      if (!rows[0]) return c.json({ error: 'unauthorized', message: 'Qaytadan kiring' }, 401);
      // rol o'zgarsa yangi access token kerak
      const access = await signAccess(env.JWT_SECRET, { sub: uid, role: rows[0].role });
      return c.json({ user: publicUser(rows[0]), access });
    });

    r.delete('/me', async (c) => {
      const uid = c.get('uid');
      await db.tx(async (q) => {
        const u = (await q.query<{ phone: string }>('SELECT phone FROM users WHERE id = $1 FOR UPDATE', [uid])).rows[0];
        if (!u) return;
        // qayta ro'yxatdan o'tganda yangi bepul sinov berilmasin
        await q.query('INSERT INTO trial_used (phone_hash) VALUES ($1) ON CONFLICT DO NOTHING', [trialKey(env, u.phone)]);
        // to'lovlar (orders) o'chmaydi: user_id = NULL bo'ladi
        await q.query('DELETE FROM users WHERE id = $1', [uid]);
      });
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

  let otpRequests = 0;

  r.post('/otp', rateLimit(env, 20, HOUR_MS), async (c) => {
    const { phone: raw } = await readBody(c, z.object({ phone: z.string().max(32) }));
    const phone = normalizePhone(raw);
    if (!phone) return c.json({ error: 'bad_phone', message: 'Raqam noto‘g‘ri. Masalan: +998 90 123 45 67' }, 400);
    if (++otpRequests % 100 === 0) await cleanup(db);

    const code = otpCode();
    let sent: boolean;
    try {
      sent = await db.tx(async (q) => {
        // Atomik: 60 soniyalik oraliq va soatlik/kunlik chegaralar bir so'rovda tekshirilib, hisoblagich oshiriladi.
        // Bir vaqtda kelgan so'rovlardan faqat bittasi qator oladi.
        const gate = await q.query(
          `INSERT INTO phone_limits (phone, day, sms_day, hour_start, sms_hour, last_sent_at) VALUES ($1, current_date, 1, now(), 1, now())
           ON CONFLICT (phone) DO UPDATE SET
             sms_day = CASE WHEN phone_limits.day = current_date THEN phone_limits.sms_day + 1 ELSE 1 END,
             fails_day = CASE WHEN phone_limits.day = current_date THEN phone_limits.fails_day ELSE 0 END,
             day = current_date,
             sms_hour = CASE WHEN phone_limits.hour_start > now() - interval '1 hour' THEN phone_limits.sms_hour + 1 ELSE 1 END,
             hour_start = CASE WHEN phone_limits.hour_start > now() - interval '1 hour' THEN phone_limits.hour_start ELSE now() END,
             last_sent_at = now()
           WHERE (phone_limits.last_sent_at IS NULL OR phone_limits.last_sent_at <= now() - make_interval(secs => $2))
             AND (phone_limits.day <> current_date OR phone_limits.sms_day < $3)
             AND (phone_limits.hour_start <= now() - interval '1 hour' OR phone_limits.sms_hour < $4)
           RETURNING 1`,
          [phone, RESEND_SEC, SMS_PER_DAY, SMS_PER_HOUR],
        );
        if (!gate.rows.length) return false;
        const budget = await q.query(
          `INSERT INTO sms_budget (hour, n) VALUES (date_trunc('hour', now()), 1)
           ON CONFLICT (hour) DO UPDATE SET n = sms_budget.n + 1 WHERE sms_budget.n < $1 RETURNING n`,
          [env.SMS_GLOBAL_PER_HOUR],
        );
        if (!budget.rows.length) throw new Rollback();
        await q.query(
          `INSERT INTO otp_codes (phone, code_hash, expires_at, attempts, last_sent_at) VALUES ($1, $2, now() + make_interval(secs => $3), 0, now())
           ON CONFLICT (phone) DO UPDATE SET code_hash = EXCLUDED.code_hash, expires_at = EXCLUDED.expires_at, attempts = 0, last_sent_at = now()`,
          [phone, hmac(env.JWT_SECRET, `${phone}:${code}`), OTP_TTL_MS / 1000],
        );
        return true;
      });
    } catch (e) {
      if (!(e instanceof Rollback)) throw e;
      return c.json({ error: 'sms_busy', message: 'Hozir SMS yuborish vaqtincha cheklangan. Birozdan so‘ng qayta urinib ko‘ring.' }, 503);
    }
    if (!sent) {
      const st = (
        await db.query<{ soon: boolean; hour: boolean }>(
          `SELECT last_sent_at > now() - make_interval(secs => $2) AS soon, (hour_start > now() - interval '1 hour' AND sms_hour >= $3) AS hour
             FROM phone_limits WHERE phone = $1`,
          [phone, RESEND_SEC, SMS_PER_HOUR],
        )
      ).rows[0];
      if (st?.soon) return c.json({ error: 'too_soon', message: 'Kod yaqinda yuborildi. 1 daqiqadan so‘ng qayta so‘rang.' }, 429);
      if (st?.hour) return c.json({ error: 'too_many', message: `Bir soatda ${SMS_PER_HOUR} martadan ko‘p kod so‘raldi. Keyinroq urinib ko‘ring.` }, 429);
      return c.json({ error: 'too_many', message: 'Bugun bu raqamga juda ko‘p kod yuborildi. Ertaga urinib ko‘ring.' }, 429);
    }

    try {
      await deps.sms.send(phone, `Kachok: tasdiqlash kodi ${code}. Hech kimga bermang.`);
    } catch (e) {
      console.error(`[sms] yuborilmadi: ${scrubError(e)}`);
      return c.json({ error: 'sms_failed', message: 'SMS yuborilmadi. Birozdan so‘ng qayta urinib ko‘ring.' }, 502);
    }
    // devCode — faqat ishlab chiqish rejimida (loadEnv production'da DEV_MODE=1 ga yo'l qo'ymaydi)
    return c.json({ ok: true, phone, ...(env.DEV_MODE === '1' && env.SMS_PROVIDER === 'console' ? { devCode: code } : {}) });
  });

  r.post('/verify', rateLimit(env, 60, HOUR_MS), async (c) => {
    const body = z.object({ phone: z.string().max(32), code: z.string().regex(/^\d{6}$/) }).safeParse(await readJson(c));
    if (!body.success) return c.json({ error: 'bad_code', message: 'Kod 6 ta raqamdan iborat' }, 400);
    const phone = normalizePhone(body.data.phone);
    if (!phone) return c.json({ error: 'bad_phone', message: 'Raqam noto‘g‘ri' }, 400);

    // 1) Kunlik xato urinishlar uchun joy band qilinadi (atomik). Kod to'g'ri chiqsa yoki tekshirilmasa — qaytariladi.
    const slot = await db.query(
      `INSERT INTO phone_limits (phone, day, fails_day) VALUES ($1, current_date, 1)
       ON CONFLICT (phone) DO UPDATE SET
         fails_day = CASE WHEN phone_limits.day = current_date THEN phone_limits.fails_day + 1 ELSE 1 END,
         sms_day = CASE WHEN phone_limits.day = current_date THEN phone_limits.sms_day ELSE 0 END,
         day = current_date
       WHERE phone_limits.day <> current_date OR phone_limits.fails_day < $2
       RETURNING 1`,
      [phone, MAX_FAILS_PER_DAY],
    );
    if (!slot.rows.length) return c.json({ error: 'locked', message: 'Bugun urinishlar tugadi. Ertaga qayta urinib ko‘ring.' }, 429);
    const release = () => db.query(`UPDATE phone_limits SET fails_day = greatest(fails_day - 1, 0) WHERE phone = $1 AND day = current_date`, [phone]);

    // 2) Urinish avval hisoblanadi, keyin solishtiriladi: bir vaqtdagi so'rovlar ham 5 tadan ortiq taxmin qila olmaydi
    const row = (
      await db.query<{ code_hash: string }>(
        `UPDATE otp_codes SET attempts = attempts + 1 WHERE phone = $1 AND attempts < $2 AND expires_at > now() RETURNING code_hash`,
        [phone, MAX_ATTEMPTS],
      )
    ).rows[0];
    if (!row) {
      await release();
      const live = (await db.query<{ attempts: number }>('SELECT attempts FROM otp_codes WHERE phone = $1 AND expires_at > now()', [phone])).rows[0];
      if (live && live.attempts >= MAX_ATTEMPTS) return c.json({ error: 'locked', message: 'Urinishlar tugadi. Yangi kod so‘rang.' }, 429);
      return c.json({ error: 'expired', message: 'Kod eskirgan. Yangi kod so‘rang.' }, 400);
    }
    if (!safeEqual(row.code_hash, hmac(env.JWT_SECRET, `${phone}:${body.data.code}`))) return c.json({ error: 'wrong_code', message: 'Kod noto‘g‘ri' }, 400);
    await release();

    // 3) Kod bir martalik: faqat uni o'chira olgan so'rov davom etadi
    const used = await db.query('DELETE FROM otp_codes WHERE phone = $1 AND code_hash = $2 RETURNING 1', [phone, row.code_hash]);
    if (!used.rows.length) return c.json({ error: 'expired', message: 'Kod eskirgan. Yangi kod so‘rang.' }, 400);
    const { user, isNew } = await findOrCreateUser(deps, phone);
    return c.json({ ...(await issueTokens(deps, user)), user: publicUser(user), isNew });
  });

  r.post('/refresh', async (c) => {
    const { refresh } = await readBody(c, z.object({ refresh: z.string().min(10).max(200) }));
    const hash = sha256(refresh);
    // Atomik almashtirish: bitta token faqat bir marta ishlatiladi
    const rot = (
      await db.query<{ user_id: string }>(
        `UPDATE refresh_tokens SET revoked_at = now() WHERE token_hash = $1 AND revoked_at IS NULL AND expires_at > now() RETURNING user_id`,
        [hash],
      )
    ).rows[0];
    if (!rot) {
      // Bekor qilingan token qayta ishlatildi — o'g'irlangan bo'lishi mumkin: foydalanuvchining barcha sessiyalari yopiladi
      const reused = (await db.query<{ user_id: string }>('SELECT user_id FROM refresh_tokens WHERE token_hash = $1 AND revoked_at IS NOT NULL', [hash])).rows[0];
      if (reused) await db.query('UPDATE refresh_tokens SET revoked_at = now() WHERE user_id = $1 AND revoked_at IS NULL', [reused.user_id]);
      throw new ApiError(401, 'unauthorized', 'Qaytadan kiring');
    }
    const user = (await db.query<UserRow>('SELECT * FROM users WHERE id = $1', [rot.user_id])).rows[0];
    if (!user) throw new ApiError(401, 'unauthorized', 'Qaytadan kiring');
    return c.json({ ...(await issueTokens(deps, user)), user: publicUser(user) });
  });

  r.post('/logout', async (c) => {
    const { refresh } = await readBody(c, z.object({ refresh: z.string().max(200) }));
    await db.query('UPDATE refresh_tokens SET revoked_at = now() WHERE token_hash = $1 AND revoked_at IS NULL', [sha256(refresh)]);
    return c.json({ ok: true });
  });

  return r;
}
