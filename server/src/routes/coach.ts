// Murabbiy rejimi: taklif kodi, mijozlar ro'yxati va natijalari, dastur yuborish, xabarlar.
import { Hono, type Context, type MiddlewareHandler } from 'hono';
import { z } from 'zod';
import { requireAuth, userRateLimit, type AppEnv, type Deps } from '../app.js';
import { COACH_FREE_CLIENTS, COACH_PAID_CLIENTS } from '../billing/plans.js';
import { entitlements } from '../billing/subscription.js';
import type { Queryable } from '../db/index.js';
import { inviteCode } from '../lib/crypto.js';
import { isUuid, readBody, readJson } from '../lib/http.js';
import { maskPhone } from '../lib/phone.js';
import { programSchema } from '../lib/schemas.js';
import { lockUserDocs, MAX_DOC_BYTES } from './sync.js';

const INVITE_DAYS = 7;
const INVITE_LEN = 8;
/** Murabbiyda bir vaqtda faol (ishlatilmagan) taklif kodlari: yangisi yaratilsa, eng eskisi o'chadi */
const MAX_OPEN_INVITES = 10;
const DAY_MS = 24 * 60 * 60 * 1000;
const HOUR_MS = 60 * 60 * 1000;

const LOCKED_MESSAGE = `Murabbiy tarifi faol emas: bepul rejimda faqat dastlabki ${COACH_FREE_CLIENTS} ta mijoz bilan ishlash mumkin. Tarifni yangilang yoki ortiqcha mijozlarni uzing.`;

/** Murabbiyning faol mijozlari ulanish tartibida (birinchi ulanganlar tarif tugasa ham ochiq qoladi) */
async function activeClients(q: Queryable, coachId: string) {
  const { rows } = await q.query<{ client_id: string }>(`SELECT client_id FROM coach_links WHERE coach_id = $1 AND status = 'active' ORDER BY created_at, client_id`, [coachId]);
  return rows.map((r) => r.client_id);
}

async function clientLimit(q: Queryable, coachId: string) {
  return (await entitlements(q, coachId)).coach.active ? COACH_PAID_CLIENTS : COACH_FREE_CLIENTS;
}

/** Murabbiy shu mijozning ma'lumotlarini ko'ra oladimi: tarif tugagan bo'lsa — faqat birinchi COACH_FREE_CLIENTS tasi */
async function clientAccess(q: Queryable, coachId: string, clientId: string): Promise<'ok' | 'not_found' | 'locked'> {
  if (!isUuid(clientId)) return 'not_found';
  const i = (await activeClients(q, coachId)).indexOf(clientId);
  if (i < 0) return 'not_found';
  if (i < COACH_FREE_CLIENTS) return 'ok';
  return i < (await clientLimit(q, coachId)) ? 'ok' : 'locked';
}

const isoDate = (v: unknown): string | null => (typeof v === 'string' && Number.isFinite(Date.parse(v)) ? v : null);

export function coachRoutes({ db, env }: Deps) {
  const r = new Hono<AppEnv>();
  r.use('*', requireAuth(env));

  // --- Murabbiy tomoni: rol har so'rovda bazadan tekshiriladi (sportchiga qaytgan murabbiy mijozlar ma'lumotini ko'rmaydi) ---
  const coachOnly: MiddlewareHandler<AppEnv> = async (c, next) => {
    // mijozni uzish — faqat kirishni kamaytiradi, rolga bog'liq emas
    if (c.req.method === 'DELETE') return next();
    const { rows } = await db.query<{ role: string }>('SELECT role FROM users WHERE id = $1', [c.get('uid')]);
    if (rows[0]?.role !== 'coach') return c.json({ error: 'not_coach', message: 'Avval profilda murabbiy rejimini yoqing' }, 403);
    await next();
  };
  r.use('/invites', coachOnly);
  r.use('/clients', coachOnly);
  r.use('/clients/*', coachOnly);

  const guard = async (c: Context<AppEnv>) => {
    const a = await clientAccess(db, c.get('uid'), c.req.param('id') ?? '');
    if (a === 'not_found') return c.json({ error: 'not_found', message: 'Mijoz topilmadi' }, 404);
    if (a === 'locked') return c.json({ error: 'coach_locked', message: LOCKED_MESSAGE }, 402);
    return null;
  };

  r.post('/invites', async (c) => {
    const uid = c.get('uid');
    let code = '';
    for (let i = 0; i < 5; i++) {
      const candidate = inviteCode(INVITE_LEN);
      const { rows } = await db.query(`INSERT INTO coach_invites (code, coach_id, expires_at) VALUES ($1, $2, now() + make_interval(days => $3)) ON CONFLICT DO NOTHING RETURNING code`, [
        candidate,
        uid,
        INVITE_DAYS,
      ]);
      if (rows.length) {
        code = candidate;
        break;
      }
    }
    if (!code) throw new Error('Taklif kodi yaratilmadi');
    // cheksiz faol kodlar bo'lmasin: eng yangi MAX_OPEN_INVITES tasi qoladi; eskirganlari tozalanadi
    await db.query(
      `DELETE FROM coach_invites WHERE coach_id = $1 AND (expires_at < now() - interval '30 days' OR (used_at IS NULL AND code NOT IN (
         SELECT code FROM coach_invites WHERE coach_id = $1 AND used_at IS NULL ORDER BY created_at DESC, code LIMIT $2)))`,
      [uid, MAX_OPEN_INVITES],
    );
    return c.json({ code, expiresInDays: INVITE_DAYS });
  });

  r.get('/clients', async (c) => {
    const uid = c.get('uid');
    const links = (
      await db.query<{ id: string; name: string; phone: string; linked_at: string }>(
        `SELECT u.id, u.name, u.phone, l.created_at AS linked_at FROM coach_links l JOIN users u ON u.id = l.client_id
          WHERE l.coach_id = $1 AND l.status = 'active' ORDER BY l.created_at, l.client_id`,
        [uid],
      )
    ).rows;
    const limit = await clientLimit(db, uid);
    const open = new Set(links.slice(0, limit).map((x) => x.id));

    // Mijoz hujjatlari ixtiyoriy JSON: SQL'da ::timestamptz/::int qilinmaydi (bitta buzuq yozuv butun ro'yxatni 500 qilmasin) — JS'da tekshiriladi
    const profiles = new Map<string, { goal: string | null; name: string | null }>();
    for (const p of (
      await db.query<{ user_id: string; goal: string | null; name: string | null }>(
        `SELECT d.user_id, d.data->>'goal' AS goal, d.data->>'name' AS name FROM coach_links l JOIN docs d ON d.user_id = l.client_id
          WHERE l.coach_id = $1 AND l.status = 'active' AND d.kind = 'profile' AND d.id = 'me' AND NOT d.deleted`,
        [uid],
      )
    ).rows)
      profiles.set(p.user_id, p);
    const now = Date.now();
    const stats = new Map<string, { last: number; n7: number; min7: number }>();
    for (const g of (
      await db.query<{ user_id: string; started: string | null; dur: string | null }>(
        `SELECT d.user_id, d.data->>'startedAt' AS started, d.data->>'durationMin' AS dur FROM coach_links l JOIN docs d ON d.user_id = l.client_id
          WHERE l.coach_id = $1 AND l.status = 'active' AND d.kind = 'log' AND NOT d.deleted`,
        [uid],
      )
    ).rows) {
      const t = g.started ? Date.parse(g.started) : NaN;
      if (!Number.isFinite(t)) continue;
      const s = stats.get(g.user_id) ?? { last: 0, n7: 0, min7: 0 };
      s.last = Math.max(s.last, t);
      if (t > now - 7 * DAY_MS && t <= now + DAY_MS) {
        const dur = Number(g.dur);
        s.n7 += 1;
        s.min7 += Number.isFinite(dur) && dur > 0 ? Math.min(Math.round(dur), 24 * 60) : 0;
      }
      stats.set(g.user_id, s);
    }

    const rows = links.map((x) => {
      const locked = !open.has(x.id);
      const p = locked ? undefined : profiles.get(x.id);
      const s = locked ? undefined : stats.get(x.id);
      return {
        id: x.id,
        name: x.name || p?.name || '',
        phone: maskPhone(x.phone),
        goal: p?.goal ?? null,
        linkedAt: x.linked_at,
        lastWorkout: s?.last ? new Date(s.last).toISOString() : null,
        workouts7d: s?.n7 ?? 0,
        minutes7d: s?.min7 ?? 0,
        /** murabbiy tarifi tugagan: bu mijoz ma'lumotlari yopiq */
        locked,
      };
    });
    // ochiqlari — oxirgi mashg'ulot bo'yicha, yopiqlari — oxirida
    rows.sort((a, b) => Number(a.locked) - Number(b.locked) || (b.lastWorkout ?? '').localeCompare(a.lastWorkout ?? ''));
    return c.json({ clients: rows, limit });
  });

  r.get('/clients/:id', async (c) => {
    const denied = await guard(c);
    if (denied) return denied;
    const clientId = c.req.param('id');
    const { rows: user } = await db.query<{ id: string; name: string; phone: string }>('SELECT id, name, phone FROM users WHERE id = $1', [clientId]);
    const doc = async (kind: string, id: string) =>
      (await db.query<{ data: unknown }>(`SELECT data FROM docs WHERE user_id = $1 AND kind = $2 AND id = $3 AND NOT deleted`, [clientId, kind, id])).rows[0]?.data ?? null;
    const logs = await db.query<{ data: unknown }>(`SELECT data FROM docs WHERE user_id = $1 AND kind = 'log' AND NOT deleted ORDER BY data->>'startedAt' DESC LIMIT 120`, [clientId]);
    const body = await db.query<{ data: unknown }>(`SELECT data FROM docs WHERE user_id = $1 AND kind = 'body' AND NOT deleted ORDER BY id DESC LIMIT 120`, [clientId]);
    return c.json({
      client: { id: user[0].id, name: user[0].name, phone: maskPhone(user[0].phone) },
      profile: await doc('profile', 'me'),
      program: await doc('program', 'current'),
      logs: logs.rows.map((r) => r.data).filter((d) => isoDate((d as { startedAt?: unknown } | null)?.startedAt)),
      body: body.rows.map((r) => r.data).reverse(),
    });
  });

  r.put('/clients/:id/program', async (c) => {
    const denied = await guard(c);
    if (denied) return denied;
    const uid = c.get('uid');
    const clientId = c.req.param('id');
    const { program } = await readBody(c, z.object({ program: programSchema }));
    const coachName = (await db.query<{ name: string }>('SELECT name FROM users WHERE id = $1', [uid])).rows[0]?.name || 'Murabbiy';
    const data = { ...program, coach: { name: coachName, at: new Date().toISOString() } };
    const json = JSON.stringify(data);
    const size = Buffer.byteLength(json);
    if (size > MAX_DOC_BYTES) return c.json({ error: 'too_large', message: 'Dastur juda katta' }, 413);
    await db.tx(async (q) => {
      // sinxronlash bilan bir xil qulf: seq tartibi buzilmasin
      await lockUserDocs(q, clientId);
      await q.query(
        `INSERT INTO docs (user_id, kind, id, data, updated_at, deleted, seq, size) VALUES ($1, 'program', 'current', $2, $3, false, nextval('docs_seq'), $4)
         ON CONFLICT (user_id, kind, id) DO UPDATE
           SET data = EXCLUDED.data, updated_at = EXCLUDED.updated_at, deleted = false, seq = nextval('docs_seq'), size = EXCLUDED.size`,
        [clientId, json, Date.now(), size],
      );
    });
    return c.json({ ok: true });
  });

  r.post('/clients/:id/notes', async (c) => {
    const denied = await guard(c);
    if (denied) return denied;
    const { text } = await readBody(c, z.object({ text: z.string().trim().min(1).max(1000) }));
    const { rows } = await db.query(`INSERT INTO coach_notes (coach_id, client_id, text) VALUES ($1, $2, $3) RETURNING id, text, created_at`, [c.get('uid'), c.req.param('id'), text]);
    return c.json({ note: rows[0] });
  });

  r.get('/clients/:id/notes', async (c) => {
    const denied = await guard(c);
    if (denied) return denied;
    const { rows } = await db.query(`SELECT id, text, created_at FROM coach_notes WHERE coach_id = $1 AND client_id = $2 ORDER BY created_at DESC LIMIT 50`, [c.get('uid'), c.req.param('id')]);
    return c.json({ notes: rows });
  });

  r.delete('/clients/:id', async (c) => {
    const clientId = c.req.param('id');
    if (!isUuid(clientId)) return c.json({ error: 'not_found', message: 'Mijoz topilmadi' }, 404);
    await db.query(`UPDATE coach_links SET status = 'ended' WHERE coach_id = $1 AND client_id = $2`, [c.get('uid'), clientId]);
    return c.json({ ok: true });
  });

  // --- Mijoz tomoni ---

  // taklif kodlarini terib topishning oldini olish
  r.post('/join', userRateLimit(10, HOUR_MS), async (c) => {
    const uid = c.get('uid');
    const parsed = z
      .object({
        code: z
          .string()
          .trim()
          .toUpperCase()
          .regex(/^[A-Z0-9]{6,8}$/),
      })
      .safeParse(await readJson(c));
    const badCode = () => c.json({ error: 'bad_code', message: 'Kod noto‘g‘ri yoki muddati o‘tgan' }, 400);
    if (!parsed.success) return badCode();
    const { code } = parsed.data;
    const res = await db.tx(async (q): Promise<{ err: 'bad_code' | 'self' | 'coach_full' } | { coachId: string }> => {
      const inv = (await q.query<{ coach_id: string }>(`SELECT coach_id FROM coach_invites WHERE code = $1 AND used_at IS NULL AND expires_at > now() FOR UPDATE`, [code])).rows[0];
      if (!inv) return { err: 'bad_code' };
      if (inv.coach_id === uid) return { err: 'self' };
      // murabbiy qatori qulflanadi: bir vaqtdagi qo'shilishlar limitni chetlab o'ta olmaydi
      const coach = (await q.query<{ role: string }>('SELECT role FROM users WHERE id = $1 FOR UPDATE', [inv.coach_id])).rows[0];
      if (coach?.role !== 'coach') return { err: 'bad_code' };
      const limit = await clientLimit(q, inv.coach_id);
      const count = Number((await q.query<{ n: number }>(`SELECT count(*) AS n FROM coach_links WHERE coach_id = $1 AND status = 'active' AND client_id <> $2`, [inv.coach_id, uid])).rows[0].n);
      if (count >= limit) return { err: 'coach_full' };
      // kod bir martalik
      await q.query('UPDATE coach_invites SET used_at = now(), used_by = $2 WHERE code = $1', [code, uid]);
      // bir vaqtda faqat bitta murabbiy
      await q.query(`UPDATE coach_links SET status = 'ended' WHERE client_id = $1 AND coach_id <> $2 AND status = 'active'`, [uid, inv.coach_id]);
      await q.query(
        `INSERT INTO coach_links (coach_id, client_id, status) VALUES ($1, $2, 'active')
         ON CONFLICT (coach_id, client_id) DO UPDATE SET status = 'active',
           created_at = CASE WHEN coach_links.status = 'active' THEN coach_links.created_at ELSE now() END`,
        [inv.coach_id, uid],
      );
      return { coachId: inv.coach_id };
    });
    if ('err' in res) {
      if (res.err === 'self') return c.json({ error: 'self', message: 'O‘zingizga ulana olmaysiz' }, 400);
      if (res.err === 'coach_full') return c.json({ error: 'coach_full', message: 'Murabbiyning bepul mijozlar soni to‘lgan. Murabbiy tarifini yoqishi kerak.' }, 409);
      return badCode();
    }
    const coach = (await db.query<{ id: string; name: string }>('SELECT id, name FROM users WHERE id = $1', [res.coachId])).rows[0];
    return c.json({ coach });
  });

  r.delete('/link', async (c) => {
    await db.query(`UPDATE coach_links SET status = 'ended' WHERE client_id = $1`, [c.get('uid')]);
    return c.json({ ok: true });
  });

  return r;
}
