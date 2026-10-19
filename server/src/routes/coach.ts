// Murabbiy rejimi: taklif kodi, mijozlar ro'yxati va natijalari, dastur yuborish, xabarlar.
import { Hono } from 'hono';
import { z } from 'zod';
import { requireAuth, type AppEnv, type Deps } from '../app.js';
import { COACH_FREE_CLIENTS, COACH_PAID_CLIENTS } from '../billing/plans.js';
import { entitlements } from '../billing/subscription.js';
import { inviteCode } from '../lib/crypto.js';
import { maskPhone } from '../lib/phone.js';
import type { Queryable } from '../db/index.js';

const INVITE_DAYS = 7;

async function isLinked(q: Queryable, coachId: string, clientId: string) {
  const { rows } = await q.query(`SELECT 1 FROM coach_links WHERE coach_id = $1 AND client_id = $2 AND status = 'active'`, [coachId, clientId]);
  return rows.length > 0;
}

export function coachRoutes({ db, env }: Deps) {
  const r = new Hono<AppEnv>();
  r.use('*', requireAuth(env));

  const coachOnly = async (uid: string) => {
    const { rows } = await db.query<{ role: string }>('SELECT role FROM users WHERE id = $1', [uid]);
    return rows[0]?.role === 'coach';
  };

  // --- Murabbiy tomoni ---

  r.post('/invites', async (c) => {
    const uid = c.get('uid');
    if (!(await coachOnly(uid))) return c.json({ error: 'not_coach', message: 'Avval profilda murabbiy rejimini yoqing' }, 403);
    let code = '';
    for (let i = 0; i < 5; i++) {
      code = inviteCode();
      const { rows } = await db.query(
        `INSERT INTO coach_invites (code, coach_id, expires_at) VALUES ($1, $2, now() + make_interval(days => $3)) ON CONFLICT DO NOTHING RETURNING code`,
        [code, uid, INVITE_DAYS],
      );
      if (rows.length) break;
    }
    return c.json({ code, expiresInDays: INVITE_DAYS });
  });

  r.get('/clients', async (c) => {
    const uid = c.get('uid');
    const { rows } = await db.query<Record<string, unknown>>(
      `SELECT u.id, u.name, u.phone, l.created_at AS linked_at,
         (SELECT d.data->>'goal' FROM docs d WHERE d.user_id = u.id AND d.kind = 'profile' AND d.id = 'me' AND NOT d.deleted) AS goal,
         (SELECT d.data->>'name' FROM docs d WHERE d.user_id = u.id AND d.kind = 'profile' AND d.id = 'me' AND NOT d.deleted) AS profile_name,
         (SELECT max(d.data->>'startedAt') FROM docs d WHERE d.user_id = u.id AND d.kind = 'log' AND NOT d.deleted) AS last_workout,
         (SELECT count(*) FROM docs d WHERE d.user_id = u.id AND d.kind = 'log' AND NOT d.deleted
            AND (d.data->>'startedAt')::timestamptz > now() - interval '7 days') AS workouts_7d,
         (SELECT coalesce(sum((d.data->>'durationMin')::int), 0) FROM docs d WHERE d.user_id = u.id AND d.kind = 'log' AND NOT d.deleted
            AND (d.data->>'startedAt')::timestamptz > now() - interval '7 days') AS minutes_7d
       FROM coach_links l JOIN users u ON u.id = l.client_id
       WHERE l.coach_id = $1 AND l.status = 'active'
       ORDER BY last_workout DESC NULLS LAST`,
      [uid],
    );
    const ent = await entitlements(db, uid);
    return c.json({
      clients: rows.map((x) => ({
        id: x.id,
        name: (x.name as string) || (x.profile_name as string) || '',
        phone: maskPhone(x.phone as string),
        goal: x.goal ?? null,
        linkedAt: x.linked_at,
        lastWorkout: x.last_workout ?? null,
        workouts7d: Number(x.workouts_7d),
        minutes7d: Number(x.minutes_7d),
      })),
      limit: ent.coach.active ? COACH_PAID_CLIENTS : COACH_FREE_CLIENTS,
    });
  });

  r.get('/clients/:id', async (c) => {
    const uid = c.get('uid');
    const clientId = c.req.param('id');
    if (!(await isLinked(db, uid, clientId))) return c.json({ error: 'not_found', message: 'Mijoz topilmadi' }, 404);
    const { rows: user } = await db.query<{ id: string; name: string; phone: string }>('SELECT id, name, phone FROM users WHERE id = $1', [clientId]);
    const doc = async (kind: string, id: string) =>
      (await db.query<{ data: unknown }>(`SELECT data FROM docs WHERE user_id = $1 AND kind = $2 AND id = $3 AND NOT deleted`, [clientId, kind, id])).rows[0]?.data ??
      null;
    const logs = await db.query<{ data: unknown }>(
      `SELECT data FROM docs WHERE user_id = $1 AND kind = 'log' AND NOT deleted ORDER BY data->>'startedAt' DESC LIMIT 120`,
      [clientId],
    );
    const body = await db.query<{ data: unknown }>(`SELECT data FROM docs WHERE user_id = $1 AND kind = 'body' AND NOT deleted ORDER BY id DESC LIMIT 120`, [
      clientId,
    ]);
    return c.json({
      client: { id: user[0].id, name: user[0].name, phone: maskPhone(user[0].phone) },
      profile: await doc('profile', 'me'),
      program: await doc('program', 'current'),
      logs: logs.rows.map((r) => r.data),
      body: body.rows.map((r) => r.data).reverse(),
    });
  });

  r.put('/clients/:id/program', async (c) => {
    const uid = c.get('uid');
    const clientId = c.req.param('id');
    if (!(await isLinked(db, uid, clientId))) return c.json({ error: 'not_found' }, 404);
    const { program } = z.object({ program: z.record(z.unknown()) }).parse(await c.req.json());
    const coachName = (await db.query<{ name: string }>('SELECT name FROM users WHERE id = $1', [uid])).rows[0]?.name || 'Murabbiy';
    const data = { ...program, coach: { name: coachName, at: new Date().toISOString() } };
    if (JSON.stringify(data).length > 256 * 1024) return c.json({ error: 'too_large' }, 413);
    await db.query(
      `INSERT INTO docs (user_id, kind, id, data, updated_at, deleted, seq) VALUES ($1, 'program', 'current', $2, $3, false, nextval('docs_seq'))
       ON CONFLICT (user_id, kind, id) DO UPDATE SET data = EXCLUDED.data, updated_at = EXCLUDED.updated_at, deleted = false, seq = nextval('docs_seq')`,
      [clientId, JSON.stringify(data), Date.now()],
    );
    return c.json({ ok: true });
  });

  r.post('/clients/:id/notes', async (c) => {
    const uid = c.get('uid');
    const clientId = c.req.param('id');
    if (!(await isLinked(db, uid, clientId))) return c.json({ error: 'not_found' }, 404);
    const { text } = z.object({ text: z.string().trim().min(1).max(1000) }).parse(await c.req.json());
    const { rows } = await db.query(`INSERT INTO coach_notes (coach_id, client_id, text) VALUES ($1, $2, $3) RETURNING id, text, created_at`, [uid, clientId, text]);
    return c.json({ note: rows[0] });
  });

  r.get('/clients/:id/notes', async (c) => {
    const uid = c.get('uid');
    const clientId = c.req.param('id');
    if (!(await isLinked(db, uid, clientId))) return c.json({ error: 'not_found' }, 404);
    const { rows } = await db.query(`SELECT id, text, created_at FROM coach_notes WHERE coach_id = $1 AND client_id = $2 ORDER BY created_at DESC LIMIT 50`, [
      uid,
      clientId,
    ]);
    return c.json({ notes: rows });
  });

  r.delete('/clients/:id', async (c) => {
    await db.query(`UPDATE coach_links SET status = 'ended' WHERE coach_id = $1 AND client_id = $2`, [c.get('uid'), c.req.param('id')]);
    return c.json({ ok: true });
  });

  // --- Mijoz tomoni ---

  r.post('/join', async (c) => {
    const uid = c.get('uid');
    const { code } = z.object({ code: z.string().trim().toUpperCase().length(6) }).parse(await c.req.json());
    const inv = (await db.query<{ coach_id: string; expires_at: Date }>('SELECT * FROM coach_invites WHERE code = $1', [code])).rows[0];
    if (!inv || new Date(inv.expires_at).getTime() < Date.now()) return c.json({ error: 'bad_code', message: "Kod noto'g'ri yoki muddati o'tgan" }, 400);
    if (inv.coach_id === uid) return c.json({ error: 'self', message: "O'zingizga ulana olmaysiz" }, 400);
    const ent = await entitlements(db, inv.coach_id);
    const limit = ent.coach.active ? COACH_PAID_CLIENTS : COACH_FREE_CLIENTS;
    const count = Number(
      (await db.query<{ n: number }>(`SELECT count(*) AS n FROM coach_links WHERE coach_id = $1 AND status = 'active' AND client_id <> $2`, [inv.coach_id, uid])).rows[0].n,
    );
    if (count >= limit) return c.json({ error: 'coach_full', message: "Murabbiyning bepul mijozlar soni to'lgan. Murabbiy tarifini yoqishi kerak." }, 409);
    await db.tx(async (q) => {
      // bir vaqtda faqat bitta murabbiy
      await q.query(`UPDATE coach_links SET status = 'ended' WHERE client_id = $1 AND coach_id <> $2`, [uid, inv.coach_id]);
      await q.query(
        `INSERT INTO coach_links (coach_id, client_id, status) VALUES ($1, $2, 'active')
         ON CONFLICT (coach_id, client_id) DO UPDATE SET status = 'active', created_at = now()`,
        [inv.coach_id, uid],
      );
    });
    const coach = (await db.query<{ id: string; name: string }>('SELECT id, name FROM users WHERE id = $1', [inv.coach_id])).rows[0];
    return c.json({ coach });
  });

  r.delete('/link', async (c) => {
    await db.query(`UPDATE coach_links SET status = 'ended' WHERE client_id = $1`, [c.get('uid')]);
    return c.json({ ok: true });
  });

  return r;
}
