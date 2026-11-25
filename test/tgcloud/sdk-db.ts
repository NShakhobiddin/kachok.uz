// Telegram Serverless `sdk/db` ning testlar uchun nusxasi: haqiqiy SQLite (node:sqlite) ustida
// xom so'rovlar (sql`…`, db.run/all/get/values) va schema.js dagi DSL'dan jadval yaratish.
import { DatabaseSync } from 'node:sqlite';

type Sql = { __sql: true; strings: readonly string[]; values: unknown[] };
const isSql = (v: unknown): v is Sql => !!v && typeof v === 'object' && (v as Sql).__sql === true;
const isRaw = (v: unknown): v is { __raw: string } => !!v && typeof v === 'object' && '__raw' in (v as object);

export function sql(strings: TemplateStringsArray, ...values: unknown[]): Sql {
  return { __sql: true, strings, values };
}
sql.raw = (s: string) => ({ __raw: s });

/** sql`…` → { text, params }; ichma-ich sql qo'shiladi, ustun nomi — identifikator */
export function compile(q: Sql): { text: string; params: unknown[] } {
  let text = '';
  const params: unknown[] = [];
  q.strings.forEach((s, i) => {
    text += s;
    if (i >= q.values.length) return;
    const v = q.values[i];
    if (isSql(v)) {
      const c = compile(v);
      text += c.text;
      params.push(...c.params);
    } else if (isRaw(v)) text += v.__raw;
    else if (v instanceof Col) text += v.name;
    else {
      if (typeof v === 'boolean') throw new Error('sdk/db mock: boolean parametr — 0/1 bering');
      text += '?';
      params.push(v === undefined ? null : v);
    }
  });
  return { text, params };
}

let conn = new DatabaseSync(':memory:');
export function resetDb(schema: Record<string, unknown>) {
  conn.close();
  conn = new DatabaseSync(':memory:');
  for (const t of Object.values(schema)) if (t instanceof Table) for (const ddl of t.ddl()) conn.exec(ddl);
}
const prep = (q: Sql) => {
  const c = compile(q);
  return { stmt: conn.prepare(c.text), params: c.params as never[] };
};

export const db = {
  async run(q: Sql) {
    const { stmt, params } = prep(q);
    if (/\breturning\b/i.test(compile(q).text)) {
      const rows = stmt.all(...params);
      return { rowsAffected: rows.length, lastInsertRowid: 0, rows };
    }
    const r = stmt.run(...params);
    return { rowsAffected: Number(r.changes), lastInsertRowid: Number(r.lastInsertRowid), rows: [] };
  },
  async all(q: Sql) {
    const { stmt, params } = prep(q);
    return stmt.all(...params);
  },
  async get(q: Sql) {
    const { stmt, params } = prep(q);
    return stmt.get(...params) ?? null;
  },
  async values(q: Sql) {
    const { stmt, params } = prep(q);
    return stmt.all(...params).map((r) => Object.values(r as object));
  },
};
export default { ...db, sql };

// ---- schema DSL (schema.js ishlatadigan qismi) ----
class Col {
  name: string;
  type: string;
  mods: string[] = [];
  constructor(name: string, type: string) {
    this.name = name;
    this.type = type;
  }
  primaryKey(o?: { autoIncrement?: boolean }) {
    this.mods.push(o?.autoIncrement ? 'PRIMARY KEY AUTOINCREMENT' : 'PRIMARY KEY');
    return this;
  }
  notNull() {
    this.mods.push('NOT NULL');
    return this;
  }
  unique() {
    this.mods.push('UNIQUE');
    return this;
  }
  default(v: unknown) {
    this.mods.push(`DEFAULT ${isSql(v) ? compile(v).text : typeof v === 'string' ? `'${v.replace(/'/g, "''")}'` : String(v)}`);
    return this;
  }
}
export const integer = (name: string) => new Col(name, 'INTEGER');
export const text = (name: string) => new Col(name, 'TEXT');

type Extra = { kind: 'index' | 'unique'; name: string; cols: Col[] } | { kind: 'pk'; cols: Col[] };
const idx = (kind: 'index' | 'unique') => (name: string) => ({ on: (...cols: Col[]): Extra => ({ kind, name, cols }) });
export const index = idx('index');
export const uniqueIndex = idx('unique');
export const primaryKey = (o: { columns: Col[] }): Extra => ({ kind: 'pk', cols: o.columns });

class Table {
  constructor(
    public name: string,
    public cols: Record<string, Col>,
    public extras: Extra[],
  ) {}
  ddl() {
    const cols = Object.values(this.cols).map((c) => [c.name, c.type, ...c.mods].join(' '));
    const pk = this.extras.find((e) => e.kind === 'pk');
    if (pk) cols.push(`PRIMARY KEY (${pk.cols.map((c) => c.name).join(', ')})`);
    const out = [`CREATE TABLE ${this.name} (${cols.join(', ')})`];
    for (const e of this.extras) if (e.kind !== 'pk') out.push(`CREATE ${e.kind === 'unique' ? 'UNIQUE ' : ''}INDEX ${e.name} ON ${this.name} (${e.cols.map((c) => c.name).join(', ')})`);
    return out;
  }
}
export function table(name: string, cols: Record<string, Col>, cb?: (t: Record<string, Col>) => Record<string, Extra>) {
  for (const k of Object.keys(cols)) if ((cols[k] as unknown) === undefined) throw new Error(k);
  return new Table(name, cols, cb ? Object.values(cb(cols)) : []);
}
