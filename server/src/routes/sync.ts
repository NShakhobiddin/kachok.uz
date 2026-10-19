// Sinxronlash: mijoz o'zgargan hujjatlarni yuboradi va `since` dan keyingi o'zgarishlarni oladi.
// Ziddiyat qoidasi — eng so'nggi o'zgarish yutadi (updatedAt bo'yicha).
import { Hono } from 'hono';
import { z } from 'zod';
import { requireAuth, type AppEnv, type Deps } from '../app.js';

export const DOC_KINDS = ['profile', 'program', 'log', 'body', 'food', 'meta'] as const;
const MAX_DOC_BYTES = 256 * 1024;
const PAGE = 500;

const change = z.object({
  kind: z.enum(DOC_KINDS),
  id: z.string().min(1).max(64),
  updatedAt: z.number().int().nonnegative(),
  deleted: z.boolean().optional(),
  data: z.unknown().optional(),
});

const body = z.object({ since: z.number().int().nonnegative().default(0), changes: z.array(change).max(PAGE).default([]) });

export function syncRoutes({ db, env }: Deps) {
  const r = new Hono<AppEnv>();
  r.use('*', requireAuth(env));

  r.post('/', async (c) => {
    const parsed = body.safeParse(await c.req.json());
    if (!parsed.success) return c.json({ error: 'bad_request', message: parsed.error.issues[0]?.message }, 400);
    const { since, changes } = parsed.data;
    const uid = c.get('uid');
    // kelajakdagi vaqt bilan yozib, boshqa qurilmalarni "yutib" qo'yishning oldini olish
    const maxTs = Date.now() + 5 * 60 * 1000;
    for (const ch of changes) {
      if (!ch.deleted && JSON.stringify(ch.data ?? null).length > MAX_DOC_BYTES) return c.json({ error: 'too_large', message: `${ch.kind}/${ch.id} juda katta` }, 413);
    }
    await db.tx(async (q) => {
      for (const ch of changes) {
        await q.query(
          `INSERT INTO docs (user_id, kind, id, data, updated_at, deleted, seq)
           VALUES ($1, $2, $3, $4, $5, $6, nextval('docs_seq'))
           ON CONFLICT (user_id, kind, id) DO UPDATE
             SET data = EXCLUDED.data, updated_at = EXCLUDED.updated_at, deleted = EXCLUDED.deleted, seq = nextval('docs_seq')
             WHERE docs.updated_at <= EXCLUDED.updated_at`,
          [uid, ch.kind, ch.id, ch.deleted ? null : JSON.stringify(ch.data ?? null), Math.min(ch.updatedAt, maxTs), !!ch.deleted],
        );
      }
    });
    const { rows } = await db.query<{ kind: string; id: string; data: unknown; updated_at: number; deleted: boolean; seq: number }>(
      `SELECT kind, id, data, updated_at, deleted, seq FROM docs WHERE user_id = $1 AND seq > $2 ORDER BY seq LIMIT $3`,
      [uid, since, PAGE + 1],
    );
    const more = rows.length > PAGE;
    const page = rows.slice(0, PAGE);
    return c.json({
      docs: page.map((d) => ({ kind: d.kind, id: d.id, data: d.data, updatedAt: Number(d.updated_at), deleted: d.deleted })),
      cursor: page.length ? Number(page[page.length - 1].seq) : since,
      more,
    });
  });

  return r;
}
