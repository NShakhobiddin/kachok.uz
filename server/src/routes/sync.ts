// Sinxronlash: mijoz o'zgargan hujjatlarni yuboradi va `since` dan keyingi o'zgarishlarni oladi.
// Ziddiyat qoidasi — eng so'nggi o'zgarish yutadi (updatedAt bo'yicha).
import { Hono } from 'hono';
import { z } from 'zod';
import { requireAuth, type AppEnv, type Deps } from '../app.js';
import type { Queryable } from '../db/index.js';
import { readJson, zodMessage } from '../lib/http.js';
import { SYNC_DOC_SCHEMAS } from '../lib/schemas.js';

export const DOC_KINDS = ['profile', 'program', 'log', 'body', 'food', 'meta'] as const;
export const MAX_DOC_BYTES = 256 * 1024;
/** Bitta so'rovdagi o'zgarishlar (ilova 400 talik paketlarda yuboradi); baytlar — app.ts dagi SYNC_BODY_LIMIT */
const MAX_CHANGES = 400;
const PAGE = 500;
/** Bitta foydalanuvchining bulutdagi umumiy hajmi */
export const USER_QUOTA_BYTES = 20 * 1024 * 1024;

const change = z.object({
  kind: z.enum(DOC_KINDS),
  id: z.string().min(1).max(64),
  updatedAt: z.number().int().nonnegative(),
  deleted: z.boolean().optional(),
  data: z.unknown().optional(),
});

const body = z.object({ since: z.number().int().nonnegative().default(0), changes: z.array(change).max(MAX_CHANGES).default([]) });

/**
 * Foydalanuvchi hujjatlarini tranzaksiya oxirigacha qulflash. Barcha yozuvchilar (sinxronlash, murabbiy dasturi) va o'quvchilar
 * shu qulf ostida ishlaydi: seq tartibi commit tartibiga mos keladi va kursor hali commit qilinmagan hujjatlardan sakrab o'tmaydi.
 */
export async function lockUserDocs(q: Queryable, userId: string) {
  await q.query('SELECT pg_advisory_xact_lock(7301, hashtext($1))', [userId]);
}

type Row = { kind: string; id: string; data: unknown; updated_at: number; deleted: boolean; seq: number };

export function syncRoutes({ db, env }: Deps) {
  const r = new Hono<AppEnv>();
  r.use('*', requireAuth(env));

  r.post('/', async (c) => {
    const parsed = body.safeParse(await readJson(c));
    if (!parsed.success) return c.json({ error: 'bad_request', message: zodMessage(parsed.error) }, 400);
    const { since, changes } = parsed.data;
    const uid = c.get('uid');
    // kelajakdagi vaqt bilan yozib, boshqa qurilmalarni "yutib" qo'yishning oldini olish
    const maxTs = Date.now() + 5 * 60 * 1000;
    const sizes = new Map<string, number>();
    let incoming = 0;
    for (const ch of changes) {
      if (ch.deleted) continue;
      const bytes = Buffer.byteLength(JSON.stringify(ch.data ?? null));
      if (bytes > MAX_DOC_BYTES) return c.json({ error: 'too_large', message: `${ch.kind}/${ch.id} juda katta` }, 413);
      const v = SYNC_DOC_SCHEMAS[ch.kind].safeParse(ch.data);
      if (!v.success) return c.json({ error: 'bad_doc', message: `${ch.kind}/${ch.id}: ${zodMessage(v.error)}` }, 400);
      sizes.set(`${ch.kind}:${ch.id}`, bytes);
      incoming += bytes;
    }

    const out = await db.tx(async (q): Promise<{ rows: Row[] } | { status: 401 | 413 }> => {
      await lockUserDocs(q, uid);
      // akkaunt o'chirilgan, lekin access token hali amal qilmoqda
      if (!(await q.query('SELECT 1 FROM users WHERE id = $1', [uid])).rows.length) return { status: 401 };
      if (incoming > 0) {
        // kvota: hozirgi hajm − almashtiriladigan hujjatlar + yangilari
        const { rows } = await q.query<{ kind: string; id: string; size: number }>(`SELECT kind, id, size FROM docs WHERE user_id = $1 AND NOT deleted`, [uid]);
        const touched = new Set(changes.map((ch) => `${ch.kind}:${ch.id}`));
        let total = incoming;
        for (const d of rows) if (!touched.has(`${d.kind}:${d.id}`)) total += Number(d.size);
        if (total > USER_QUOTA_BYTES) return { status: 413 };
      }
      for (const ch of changes) {
        await q.query(
          `INSERT INTO docs (user_id, kind, id, data, updated_at, deleted, seq, size)
           VALUES ($1, $2, $3, $4, $5, $6, nextval('docs_seq'), $7)
           ON CONFLICT (user_id, kind, id) DO UPDATE
             SET data = EXCLUDED.data, updated_at = EXCLUDED.updated_at, deleted = EXCLUDED.deleted, seq = nextval('docs_seq'), size = EXCLUDED.size
             WHERE docs.updated_at <= EXCLUDED.updated_at`,
          [uid, ch.kind, ch.id, ch.deleted ? null : JSON.stringify(ch.data ?? null), Math.min(ch.updatedAt, maxTs), !!ch.deleted, sizes.get(`${ch.kind}:${ch.id}`) ?? 0],
        );
      }
      const { rows } = await q.query<Row>(`SELECT kind, id, data, updated_at, deleted, seq FROM docs WHERE user_id = $1 AND seq > $2 ORDER BY seq LIMIT $3`, [
        uid,
        since,
        PAGE + 1,
      ]);
      return { rows };
    });
    if ('status' in out) {
      if (out.status === 401) return c.json({ error: 'unauthorized', message: 'Qaytadan kiring' }, 401);
      return c.json(
        { error: 'quota', message: `Bulutdagi joy tugadi (${USER_QUOTA_BYTES / 1024 / 1024} MB). Eski mashg‘ulot yoki ovqat yozuvlarini o‘chirib, qayta urinib ko‘ring.` },
        413,
      );
    }
    const more = out.rows.length > PAGE;
    const page = out.rows.slice(0, PAGE);
    return c.json({
      docs: page.map((d) => ({ kind: d.kind, id: d.id, data: d.data, updatedAt: Number(d.updated_at), deleted: d.deleted })),
      cursor: page.length ? Number(page[page.length - 1].seq) : since,
      more,
    });
  });

  return r;
}
