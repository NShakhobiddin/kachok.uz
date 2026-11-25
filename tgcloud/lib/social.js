// Do'stlar lentasi mantig'i: foydalanuvchi, taklif kodi, do'stlik, yozuvlar va «💪».
// Faqat xom SQL (sql`…`) — shu sababli testlarda haqiqiy SQLite bilan tekshiriladi (src/__tests__/tgcloud.test.ts).
// Telefon raqami yo'q; do'stlarga faqat ism va ichki id ko'rinadi.
import { db, EndpointError } from 'sdk';
import { sql } from 'sdk/db';
import { validatePost } from './validate.js';

export const MAX_FRIENDS = 300;
export const FEED_LIMIT = 30;
const CODE_LEN = 8;
const ALPHA = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

const fail = (description, code) => {
  throw new EndpointError(description, { code });
};

/** Chaqiruvchi foydalanuvchi (birinchi murojaatda yaratiladi, ismi Telegram'dan yangilanadi) */
export async function me(ctx) {
  const u = ctx && ctx.initData && ctx.initData.user;
  if (!u || !Number.isSafeInteger(u.id) || u.id <= 0) fail('Ilovani Telegram ichida oching', 'NO_USER');
  const name = [u.first_name, u.last_name].filter((s) => typeof s === 'string' && s.trim()).join(' ').trim().slice(0, 60);
  // parallel birinchi chaqiruvlar to'qnashmasligi uchun: DO NOTHING, keyin o'qish
  await db.run(sql`INSERT INTO users (tg_id, name, created_at) VALUES (${u.id}, ${name}, ${now() / 1000 | 0}) ON CONFLICT(tg_id) DO NOTHING`);
  const row = await db.get(sql`SELECT id, tg_id, name, friend_code, phone, registered_at, remind, tz_offset, remind_hour FROM users WHERE tg_id = ${u.id}`);
  if (name && row.name !== name) {
    await db.run(sql`UPDATE users SET name = ${name} WHERE id = ${row.id}`);
    row.name = name;
  }
  return row;
}

export const now = () => Date.now();
const iso = (ms) => (ms == null ? null : new Date(Number(ms)).toISOString());

function randomCode() {
  const bytes = new Uint8Array(CODE_LEN);
  if (globalThis.crypto && globalThis.crypto.getRandomValues) globalThis.crypto.getRandomValues(bytes);
  else for (let i = 0; i < CODE_LEN; i++) bytes[i] = Math.floor(Math.random() * 256);
  let s = '';
  for (const b of bytes) s += ALPHA[b % ALPHA.length];
  return s;
}

/** Kalit bo'yicha oynada `max` martadan ortiq chaqirilsa — rad etadi */
export async function limit(key, max, windowSec) {
  const t = (now() / 1000) | 0;
  const win = t - (t % windowSec);
  const r = await db.run(
    sql`INSERT INTO hits (key, window_start, count) VALUES (${key}, ${win}, 1)
        ON CONFLICT(key) DO UPDATE SET count = CASE WHEN hits.window_start = ${win} THEN hits.count + 1 ELSE 1 END, window_start = ${win}
        RETURNING count`,
  );
  const count = r.rows && r.rows[0] ? Number(r.rows[0].count) : 1;
  if (count > max) fail('Juda ko‘p urinish — birozdan keyin qayta urinib ko‘ring', 'RATE_LIMIT');
}

/** Taklif kodi (bo'lmasa — yaratiladi) */
export async function friendCode(user) {
  if (user.friend_code) return user.friend_code;
  for (let i = 0; i < 5; i++) {
    const code = randomCode();
    try {
      await db.run(sql`UPDATE users SET friend_code = ${code} WHERE id = ${user.id} AND friend_code IS NULL`);
    } catch {
      continue; // boshqa foydalanuvchida shunday kod bor (UNIQUE)
    }
    const row = await db.get(sql`SELECT friend_code FROM users WHERE id = ${user.id}`);
    if (row && row.friend_code) return row.friend_code;
  }
  fail('Kod yaratilmadi, qayta urinib ko‘ring', 'BUSY');
}

export async function listFriends(uid) {
  const rows = await db.all(
    sql`SELECT u.id AS id, u.name AS name, f.created_at AS since,
               (SELECT max(p.created_at) FROM posts p WHERE p.user_id = u.id) AS last_post
          FROM friendships f JOIN users u ON u.id = f.friend_id
         WHERE f.user_id = ${uid} ORDER BY f.created_at DESC`,
  );
  return rows.map((r) => ({ id: String(r.id), name: r.name || '', since: iso(r.since), last_post: iso(r.last_post) }));
}

export async function addFriend(user, rawCode) {
  const code = typeof rawCode === 'string' ? rawCode.trim().toUpperCase() : '';
  if (!/^[A-Z0-9]{6,12}$/.test(code)) fail('Kod noto‘g‘ri', 'BAD_CODE');
  // cheklov Telegram id bo'yicha: ma'lumotlarni o'chirib qayta kirish uni nolga tushirmaydi
  await limit(`add:${user.tg_id}`, 30, 3600);
  const friend = await db.get(sql`SELECT id, name FROM users WHERE friend_code = ${code}`);
  if (!friend) fail('Bunday kod topilmadi', 'NOT_FOUND');
  if (friend.id === user.id) fail('Bu o‘zingizning kodingiz', 'SELF');
  const already = await db.get(sql`SELECT 1 AS x FROM friendships WHERE user_id = ${user.id} AND friend_id = ${friend.id}`);
  if (!already) {
    for (const id of [user.id, friend.id]) {
      const n = await db.get(sql`SELECT count(*) AS n FROM friendships WHERE user_id = ${id}`);
      if (Number(n.n) >= MAX_FRIENDS) fail(`Do‘stlar soni ${MAX_FRIENDS} tadan oshmaydi`, 'TOO_MANY');
    }
    const t = now();
    // bitta so'rov — ikkala yo'nalish birga yoziladi
    await db.run(sql`INSERT INTO friendships (user_id, friend_id, created_at) VALUES (${user.id}, ${friend.id}, ${t}), (${friend.id}, ${user.id}, ${t}) ON CONFLICT DO NOTHING`);
  }
  return { id: String(friend.id), name: friend.name || '' };
}

export async function removeFriend(user, rawId) {
  const id = Number(rawId);
  if (!Number.isSafeInteger(id)) return;
  await db.run(sql`DELETE FROM friendships WHERE (user_id = ${user.id} AND friend_id = ${id}) OR (user_id = ${id} AND friend_id = ${user.id})`);
  // eski kod bilan darhol qayta qo'shilib olmasin: kod yangilanadi (keyingi so'rovda yangisi yaratiladi)
  await db.run(sql`UPDATE users SET friend_code = NULL WHERE id = ${user.id}`);
}

export async function savePost(user, input) {
  const p = validatePost(input);
  await limit(`post:${user.tg_id}`, 60, 3600);
  const r = await db.run(
    sql`INSERT INTO posts (user_id, client_id, kind, data, created_at) VALUES (${user.id}, ${p.clientId}, ${p.kind}, ${JSON.stringify(p.data)}, ${now()})
        ON CONFLICT(user_id, client_id) DO UPDATE SET data = excluded.data, kind = excluded.kind
        RETURNING id`,
  );
  return { id: String(r.rows[0].id) };
}

export async function deletePost(user, rawId) {
  const id = Number(rawId);
  if (!Number.isSafeInteger(id)) return;
  const own = await db.get(sql`SELECT id FROM posts WHERE id = ${id} AND user_id = ${user.id}`);
  if (!own) return;
  await db.run(sql`DELETE FROM kudos WHERE post_id = ${id}`);
  await db.run(sql`DELETE FROM posts WHERE id = ${id}`);
}

export async function feed(user, before) {
  const t = typeof before === 'string' && Number.isFinite(Date.parse(before)) ? Date.parse(before) : null;
  const uid = user.id;
  const rows = await db.all(
    sql`SELECT p.id AS id, p.kind AS kind, p.data AS data, p.created_at AS created_at, p.user_id AS author_id, u.name AS author,
               (SELECT count(*) FROM kudos k WHERE k.post_id = p.id) AS kudos,
               EXISTS (SELECT 1 FROM kudos k WHERE k.post_id = p.id AND k.user_id = ${uid}) AS kudoed
          FROM posts p JOIN users u ON u.id = p.user_id
         WHERE (p.user_id = ${uid} OR p.user_id IN (SELECT friend_id FROM friendships WHERE user_id = ${uid}))
           AND (${t} IS NULL OR p.created_at < ${t})
         ORDER BY p.created_at DESC, p.id DESC LIMIT ${FEED_LIMIT}`,
  );
  const posts = rows.map((r) => ({
    id: String(r.id),
    kind: r.kind,
    data: safeJson(r.data),
    created_at: iso(r.created_at),
    author_id: String(r.author_id),
    author: r.author || '',
    own: Number(r.author_id) === uid,
    kudos: Number(r.kudos) || 0,
    kudoed: Boolean(Number(r.kudoed)),
  }));
  return { posts: posts.filter((p) => p.data), more: rows.length === FEED_LIMIT };
}

function safeJson(s) {
  try {
    return JSON.parse(s);
  } catch {
    return null;
  }
}

/** «💪» faqat ko'rinadigan (o'zining yoki do'stining) yozuvga */
export async function setKudos(user, rawId, on) {
  const id = Number(rawId);
  if (!Number.isSafeInteger(id)) fail('Yozuv topilmadi', 'NOT_FOUND');
  if (on) {
    await limit(`kudos:${user.tg_id}`, 300, 3600);
    const visible = await db.get(
      sql`SELECT 1 AS x FROM posts p WHERE p.id = ${id} AND (p.user_id = ${user.id} OR EXISTS (SELECT 1 FROM friendships f WHERE f.user_id = ${user.id} AND f.friend_id = p.user_id))`,
    );
    if (!visible) fail('Yozuv topilmadi', 'NOT_FOUND');
    await db.run(sql`INSERT INTO kudos (post_id, user_id, created_at) VALUES (${id}, ${user.id}, ${now()}) ON CONFLICT DO NOTHING`);
  } else {
    await db.run(sql`DELETE FROM kudos WHERE post_id = ${id} AND user_id = ${user.id}`);
  }
}

/**
 * Foydalanuvchining lentadagi hamma ma'lumoti: yozuvlar, ularga «💪», do'stliklar va taklif kodi.
 * Akkaunt (ro'yxat, raqam, bulutdagi ma'lumotlar) qoladi — u account.js deleteAccount da o'chiriladi.
 * So'rov cheklovlari (hits) o'chirilmaydi: aks holda o'chirib-qayta kirib cheklovni chetlab o'tish mumkin edi.
 */
export async function deleteSocial(user) {
  const uid = user.id;
  await db.run(sql`DELETE FROM kudos WHERE user_id = ${uid} OR post_id IN (SELECT id FROM posts WHERE user_id = ${uid})`);
  await db.run(sql`DELETE FROM posts WHERE user_id = ${uid}`);
  await db.run(sql`DELETE FROM friendships WHERE user_id = ${uid} OR friend_id = ${uid}`);
  await db.run(sql`UPDATE users SET friend_code = NULL WHERE id = ${uid}`);
}
