// Bulutga sinxronlash (server/src/routes/sync.ts bilan bir xil protokol): mijoz o'zgargan hujjatlarni yuboradi,
// `since` dan keyingi o'zgarishlarni oladi. Ziddiyatda eng so'nggi o'zgarish (updatedAt) yutadi.
// seq — foydalanuvchi bo'yicha: har yozuv bitta SQL so'rovda max(seq)+1 oladi (SQLite yozuvlari ketma-ket — kursor sakramaydi).
import { db, EndpointError } from 'sdk';
import { sql } from 'sdk/db';

export const DOC_KINDS = ['profile', 'program', 'log', 'body', 'food', 'meta'];
export const MAX_DOC_BYTES = 256 * 1024;
export const MAX_CHANGES = 400;
const PAGE = 200;
const PAGE_BYTES = 1024 * 1024;
export const USER_QUOTA_BYTES = 20 * 1024 * 1024;

const bad = (description, code = 'BAD_REQUEST') => {
  throw new EndpointError(description, { code });
};

/** UTF-8 bayt soni */
function utf8Len(s) {
  let n = 0;
  for (let i = 0; i < s.length; i++) {
    const c = s.charCodeAt(i);
    if (c < 0x80) n += 1;
    else if (c < 0x800) n += 2;
    else if (c >= 0xd800 && c <= 0xdbff) {
      n += 4;
      i++;
    } else n += 3;
  }
  return n;
}

const isObj = (v) => v !== null && typeof v === 'object' && !Array.isArray(v);

export async function sync(user, input) {
  if (user.registered_at == null) bad('Avval ro‘yxatdan o‘ting', 'NOT_REGISTERED');
  const since = input.since === undefined ? 0 : input.since;
  if (!Number.isSafeInteger(since) || since < 0) bad('since noto‘g‘ri');
  const changes = input.changes === undefined ? [] : input.changes;
  if (!Array.isArray(changes) || changes.length > MAX_CHANGES) bad('changes noto‘g‘ri');
  const uid = user.id;
  // kelajakdagi vaqt bilan yozib, boshqa qurilmalarni "yutib" qo'yishning oldini olish
  const maxTs = Date.now() + 5 * 60 * 1000;
  const prepared = [];
  let incoming = 0;
  for (const ch of changes) {
    if (!isObj(ch) || !DOC_KINDS.includes(ch.kind) || typeof ch.id !== 'string' || ch.id.length < 1 || ch.id.length > 64) bad('hujjat noto‘g‘ri');
    if (!Number.isSafeInteger(ch.updatedAt) || ch.updatedAt < 0) bad(`${ch.kind}/${ch.id}: updatedAt noto‘g‘ri`);
    if (ch.deleted !== undefined && typeof ch.deleted !== 'boolean') bad(`${ch.kind}/${ch.id}: deleted noto‘g‘ri`);
    let json = null;
    let size = 0;
    if (!ch.deleted) {
      const okShape = ch.kind === 'food' ? Array.isArray(ch.data) : isObj(ch.data);
      if (!okShape) bad(`${ch.kind}/${ch.id}: ma’lumot noto‘g‘ri`, 'BAD_DOC');
      json = JSON.stringify(ch.data);
      size = utf8Len(json);
      if (size > MAX_DOC_BYTES) bad(`${ch.kind}/${ch.id} juda katta`, 'TOO_LARGE');
      incoming += size;
    }
    prepared.push({ kind: ch.kind, id: ch.id, json, size, deleted: ch.deleted ? 1 : 0, updatedAt: Math.min(ch.updatedAt, maxTs) });
  }

  if (incoming > 0) {
    // kvota: hozirgi hajm − almashtiriladigan hujjatlar + yangilari
    const rows = await db.all(sql`SELECT kind, doc_id, size FROM docs WHERE user_id = ${uid} AND deleted = 0`);
    const touched = new Set(prepared.map((p) => `${p.kind}:${p.id}`));
    let total = incoming;
    for (const d of rows) if (!touched.has(`${d.kind}:${d.doc_id}`)) total += Number(d.size);
    if (total > USER_QUOTA_BYTES) bad(`Bulutdagi joy tugadi (${USER_QUOTA_BYTES / 1024 / 1024} MB). Eski mashg‘ulot yoki ovqat yozuvlarini o‘chirib, qayta urinib ko‘ring.`, 'QUOTA');
  }

  for (const p of prepared) {
    await db.run(
      sql`INSERT INTO docs (user_id, kind, doc_id, data, updated_at, deleted, seq, size)
          VALUES (${uid}, ${p.kind}, ${p.id}, ${p.json}, ${p.updatedAt}, ${p.deleted}, (SELECT COALESCE(max(seq), 0) + 1 FROM docs WHERE user_id = ${uid}), ${p.size})
          ON CONFLICT(user_id, kind, doc_id) DO UPDATE
            SET data = excluded.data, updated_at = excluded.updated_at, deleted = excluded.deleted, seq = excluded.seq, size = excluded.size
            WHERE docs.updated_at <= excluded.updated_at`,
    );
  }

  // sahifa: ko'pi bilan PAGE hujjat va ~PAGE_BYTES bayt (kamida bitta hujjat)
  const heads = await db.all(sql`SELECT seq, size FROM docs WHERE user_id = ${uid} AND seq > ${since} ORDER BY seq LIMIT ${PAGE + 1}`);
  let n = 0;
  for (let bytes = 0; n < heads.length && n < PAGE; n++) {
    bytes += Number(heads[n].size);
    if (n > 0 && bytes > PAGE_BYTES) break;
  }
  if (!n) return { docs: [], cursor: since, more: false };
  const last = Number(heads[n - 1].seq);
  const rows = await db.all(sql`SELECT kind, doc_id, data, updated_at, deleted, seq FROM docs WHERE user_id = ${uid} AND seq > ${since} AND seq <= ${last} ORDER BY seq`);
  return {
    docs: rows.map((d) => ({ kind: d.kind, id: d.doc_id, data: Number(d.deleted) || d.data == null ? null : JSON.parse(d.data), updatedAt: Number(d.updated_at), deleted: Boolean(Number(d.deleted)) })),
    cursor: last,
    more: heads.length > n,
  };
}
