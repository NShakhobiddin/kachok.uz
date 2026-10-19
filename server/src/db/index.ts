// Ma'lumotlar bazasi: production — PostgreSQL (pg), ishlab chiqish va testlar — PGlite (WASM Postgres).
import { readFileSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

export interface Queryable {
  query<T = Record<string, unknown>>(sql: string, params?: unknown[]): Promise<{ rows: T[] }>;
}

export interface Db extends Queryable {
  /** Tranzaksiya: xato bo'lsa hammasi bekor qilinadi */
  tx<T>(fn: (q: Queryable) => Promise<T>): Promise<T>;
  close(): Promise<void>;
}

export async function createDb(opts: { url?: string; pgliteDir?: string }): Promise<Db> {
  if (opts.url) {
    const { default: pg } = await import('pg');
    // bigint (seq) qiymatlarini son sifatida qaytarish
    pg.types.setTypeParser(20, (v) => Number(v));
    const pool = new pg.Pool({ connectionString: opts.url, max: 10 });
    return {
      query: (sql, params) => pool.query(sql, params as unknown[]) as never,
      async tx(fn) {
        const client = await pool.connect();
        try {
          await client.query('BEGIN');
          const out = await fn({ query: (s, p) => client.query(s, p as unknown[]) as never });
          await client.query('COMMIT');
          return out;
        } catch (e) {
          await client.query('ROLLBACK');
          throw e;
        } finally {
          client.release();
        }
      },
      close: () => pool.end(),
    };
  }
  const { PGlite } = await import('@electric-sql/pglite');
  const lite = new PGlite(opts.pgliteDir);
  const norm = (r: { rows: unknown[] }) => ({ rows: r.rows.map(fixBigint) });
  return {
    query: async (sql, params) => norm(await lite.query(sql, params as unknown[])) as never,
    tx: async <T>(fn: (q: Queryable) => Promise<T>) => (await lite.transaction((t) => fn({ query: async (s, p) => norm(await t.query(s, p as unknown[])) as never }))) as T,
    close: () => lite.close(),
  };
}

function fixBigint(row: unknown) {
  if (!row || typeof row !== 'object') return row;
  for (const [k, v] of Object.entries(row)) if (typeof v === 'bigint') (row as Record<string, unknown>)[k] = Number(v);
  return row;
}

/** migrations/*.sql fayllarini tartib bilan bir marta qo'llash */
export async function migrate(db: Db): Promise<string[]> {
  await db.query('CREATE TABLE IF NOT EXISTS _migrations (name text PRIMARY KEY, applied_at timestamptz NOT NULL DEFAULT now())');
  const dir = join(dirname(fileURLToPath(import.meta.url)), 'migrations');
  const files = readdirSync(dir).filter((f) => f.endsWith('.sql')).sort();
  const done = new Set((await db.query<{ name: string }>('SELECT name FROM _migrations')).rows.map((r) => r.name));
  const applied: string[] = [];
  for (const f of files) {
    if (done.has(f)) continue;
    const sql = readFileSync(join(dir, f), 'utf8');
    await db.tx(async (q) => {
      for (const stmt of sql.split(/;\s*$/m).map((s) => s.trim()).filter(Boolean)) await q.query(stmt);
      await q.query('INSERT INTO _migrations (name) VALUES ($1)', [f]);
    });
    applied.push(f);
  }
  return applied;
}
