// Do'stlar va lenta: shaxsiy taklif kodi, ikki tomonlama do'stlik, mashg'ulot/hafta natijalari va "💪".
// Lentada faqat o'zining va do'stlarining yozuvlari ko'rinadi; telefon raqami hech qachon qaytarilmaydi.
import { Hono } from 'hono';
import { z } from 'zod';
import { requireAuth, userRateLimit, type AppEnv, type Deps } from '../app.js';
import type { Queryable } from '../db/index.js';
import { inviteCode } from '../lib/crypto.js';
import { ApiError, isUuid, readBody } from '../lib/http.js';

const HOUR_MS = 60 * 60 * 1000;
export const MAX_FRIENDS = 300;
const CODE_LEN = 8;
const FEED_LIMIT = 30;

const text = (max: number) => z.string().trim().max(max);
const row = z.object({ name: text(60).min(1), value: text(24), hot: z.boolean().optional() });
const stat = z.tuple([text(20), text(24)]);
const common = { stats: z.array(stat).max(4), rows: z.array(row).max(6), rowsTitle: text(60) };
export const postSchema = z.discriminatedUnion('kind', [
  z.object({ kind: z.literal('workout'), clientId: text(64).min(1), data: z.object({ title: text(60).min(1), date: text(40), muscles: text(120), ...common }).strict() }),
  z.object({
    kind: z.literal('week'),
    clientId: text(64).min(1),
    data: z
      .object({ label: text(40).min(1), done: z.number().int().min(0).max(14), planned: z.number().int().min(0).max(7), streak: z.number().int().min(0).max(1000), ...common })
      .strict(),
  }),
]);

/** Foydalanuvchining taklif kodi (bo'lmasa — yaratiladi) */
export async function friendCode(q: Queryable, uid: string): Promise<string> {
  const cur = (await q.query<{ friend_code: string | null }>('SELECT friend_code FROM users WHERE id = $1', [uid])).rows[0];
  if (!cur) throw new ApiError(401, 'unauthorized', 'Qaytadan kiring');
  if (cur.friend_code) return cur.friend_code;
  for (let i = 0; i < 5; i++) {
    const code = inviteCode(CODE_LEN);
    const { rows } = await q.query<{ friend_code: string }>(
      `UPDATE users SET friend_code = $2 WHERE id = $1 AND friend_code IS NULL AND NOT EXISTS (SELECT 1 FROM users WHERE friend_code = $2) RETURNING friend_code`,
      [uid, code],
    );
    if (rows[0]) return rows[0].friend_code;
    // parallel so'rov allaqachon yaratgan bo'lishi mumkin
    const again = (await q.query<{ friend_code: string | null }>('SELECT friend_code FROM users WHERE id = $1', [uid])).rows[0];
    if (again?.friend_code) return again.friend_code;
  }
  throw new ApiError(503, 'busy', 'Kod yaratilmadi, qayta urinib ko‘ring');
}

/** Yozuvni shu foydalanuvchi ko'ra oladimi (o'zining yoki do'stining) */
async function visible(q: Queryable, uid: string, postId: string): Promise<boolean> {
  if (!isUuid(postId)) return false;
  const { rows } = await q.query(
    `SELECT 1 FROM posts p WHERE p.id = $2 AND (p.user_id = $1 OR EXISTS (SELECT 1 FROM friendships f WHERE f.user_id = $1 AND f.friend_id = p.user_id))`,
    [uid, postId],
  );
  return rows.length > 0;
}

export function socialRoutes({ db, env }: Deps) {
  const r = new Hono<AppEnv>();
  r.use('*', requireAuth(env));

  r.get('/code', async (c) => c.json({ code: await friendCode(db, c.get('uid')) }));

  r.get('/friends', async (c) => {
    const { rows } = await db.query<{ id: string; name: string; since: string; last_post: string | null }>(
      `SELECT u.id, u.name, f.created_at AS since, (SELECT max(created_at) FROM posts p WHERE p.user_id = u.id) AS last_post
         FROM friendships f JOIN users u ON u.id = f.friend_id WHERE f.user_id = $1 ORDER BY f.created_at DESC`,
      [c.get('uid')],
    );
    return c.json({ friends: rows });
  });

  // kod bo'yicha do'st qo'shish: ikki tomonlama, darhol
  r.post('/friends', userRateLimit(30, HOUR_MS), async (c) => {
    const { code } = await readBody(c, z.object({ code: z.string().trim().toUpperCase().regex(/^[A-Z0-9]{6,12}$/, 'kod noto‘g‘ri') }));
    const uid = c.get('uid');
    const friend = (await db.query<{ id: string; name: string }>('SELECT id, name FROM users WHERE friend_code = $1', [code])).rows[0];
    if (!friend) throw new ApiError(404, 'not_found', 'Bunday kod topilmadi');
    if (friend.id === uid) throw new ApiError(400, 'self', 'Bu o‘zingizning kodingiz');
    await db.tx(async (q) => {
      for (const id of [uid, friend.id]) {
        const n = (await q.query<{ n: number }>('SELECT count(*)::int AS n FROM friendships WHERE user_id = $1', [id])).rows[0].n;
        if (n >= MAX_FRIENDS) throw new ApiError(409, 'too_many', `Do‘stlar soni ${MAX_FRIENDS} tadan oshmaydi`);
      }
      await q.query('INSERT INTO friendships (user_id, friend_id) VALUES ($1, $2), ($2, $1) ON CONFLICT DO NOTHING', [uid, friend.id]);
    });
    return c.json({ friend: { id: friend.id, name: friend.name } });
  });

  r.delete('/friends/:id', async (c) => {
    const id = c.req.param('id');
    if (!isUuid(id)) return c.json({ ok: true });
    await db.query('DELETE FROM friendships WHERE (user_id = $1 AND friend_id = $2) OR (user_id = $2 AND friend_id = $1)', [c.get('uid'), id]);
    return c.json({ ok: true });
  });

  // yozuv: bir mashg'ulot (clientId) — bitta yozuv, qayta yuborilsa yangilanadi
  r.post('/posts', userRateLimit(60, HOUR_MS), async (c) => {
    const body = await readBody(c, postSchema);
    const { rows } = await db.query<{ id: string }>(
      `INSERT INTO posts (user_id, client_id, kind, data) VALUES ($1, $2, $3, $4)
       ON CONFLICT (user_id, client_id) DO UPDATE SET data = EXCLUDED.data, kind = EXCLUDED.kind RETURNING id`,
      [c.get('uid'), body.clientId, body.kind, JSON.stringify(body.data)],
    );
    return c.json({ id: rows[0].id });
  });

  r.delete('/posts/:id', async (c) => {
    const id = c.req.param('id');
    if (isUuid(id)) await db.query('DELETE FROM posts WHERE id = $1 AND user_id = $2', [id, c.get('uid')]);
    return c.json({ ok: true });
  });

  r.get('/feed', async (c) => {
    const before = c.req.query('before');
    const t = before && Number.isFinite(Date.parse(before)) ? new Date(before).toISOString() : null;
    const { rows } = await db.query(
      `SELECT p.id, p.kind, p.data, p.created_at, p.user_id AS author_id, u.name AS author, p.user_id = $1 AS own,
              (SELECT count(*)::int FROM kudos k WHERE k.post_id = p.id) AS kudos,
              EXISTS (SELECT 1 FROM kudos k WHERE k.post_id = p.id AND k.user_id = $1) AS kudoed
         FROM posts p JOIN users u ON u.id = p.user_id
        WHERE (p.user_id = $1 OR p.user_id IN (SELECT friend_id FROM friendships WHERE user_id = $1))
          AND ($2::timestamptz IS NULL OR p.created_at < $2::timestamptz)
        ORDER BY p.created_at DESC LIMIT $3`,
      [c.get('uid'), t, FEED_LIMIT],
    );
    return c.json({ posts: rows, more: rows.length === FEED_LIMIT });
  });

  r.put('/posts/:id/kudos', userRateLimit(300, HOUR_MS), async (c) => {
    const id = c.req.param('id');
    const uid = c.get('uid');
    if (!(await visible(db, uid, id))) throw new ApiError(404, 'not_found', 'Yozuv topilmadi');
    await db.query('INSERT INTO kudos (post_id, user_id) VALUES ($1, $2) ON CONFLICT DO NOTHING', [id, uid]);
    return c.json({ ok: true });
  });

  r.delete('/posts/:id/kudos', async (c) => {
    const id = c.req.param('id');
    if (isUuid(id)) await db.query('DELETE FROM kudos WHERE post_id = $1 AND user_id = $2', [id, c.get('uid')]);
    return c.json({ ok: true });
  });

  return r;
}
