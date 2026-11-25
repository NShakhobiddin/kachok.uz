// Lentaga yuboriladigan kartochka tekshiruvi (server/src/routes/social.ts dagi postSchema bilan bir xil qoidalar):
// faqat ma'lum maydonlar, uzunlik chegaralari — begona ma'lumot (masalan telefon) saqlanmaydi.
import { EndpointError } from 'sdk';

const bad = (what) => {
  throw new EndpointError(`Noto‘g‘ri ma’lumot: ${what}`, { code: 'INVALID' });
};

const isObj = (v) => v !== null && typeof v === 'object' && !Array.isArray(v);

function str(v, max, what, min = 0) {
  if (typeof v !== 'string') bad(what);
  const s = v.trim();
  if (s.length < min || s.length > max) bad(what);
  return s;
}

function int(v, lo, hi, what) {
  if (!Number.isInteger(v) || v < lo || v > hi) bad(what);
  return v;
}

/** Ob'ektda faqat ruxsat etilgan kalitlar bo'lsin */
function strict(o, keys, what) {
  if (!isObj(o)) bad(what);
  for (const k of Object.keys(o)) if (!keys.includes(k)) bad(`${what}.${k}`);
}

function common(d) {
  if (!Array.isArray(d.stats) || d.stats.length > 4) bad('stats');
  const stats = d.stats.map((s) => {
    if (!Array.isArray(s) || s.length !== 2) bad('stats');
    return [str(s[0], 20, 'stats'), str(s[1], 24, 'stats')];
  });
  if (!Array.isArray(d.rows) || d.rows.length > 6) bad('rows');
  const rows = d.rows.map((r) => {
    strict(r, ['name', 'value', 'hot'], 'rows');
    if (r.hot !== undefined && typeof r.hot !== 'boolean') bad('rows.hot');
    const row = { name: str(r.name, 60, 'rows.name', 1), value: str(r.value, 24, 'rows.value') };
    if (r.hot !== undefined) row.hot = r.hot;
    return row;
  });
  return { stats, rows, rowsTitle: str(d.rowsTitle, 60, 'rowsTitle') };
}

/** { kind, clientId, data } → tozalangan nusxa yoki EndpointError */
export function validatePost(input) {
  strict(input, ['kind', 'clientId', 'data'], 'post');
  const clientId = str(input.clientId, 64, 'clientId', 1);
  const d = input.data;
  if (input.kind === 'workout') {
    strict(d, ['title', 'date', 'muscles', 'stats', 'rows', 'rowsTitle'], 'data');
    return { kind: 'workout', clientId, data: { title: str(d.title, 60, 'title', 1), date: str(d.date, 40, 'date'), muscles: str(d.muscles, 120, 'muscles'), ...common(d) } };
  }
  if (input.kind === 'week') {
    strict(d, ['label', 'done', 'planned', 'streak', 'stats', 'rows', 'rowsTitle'], 'data');
    return {
      kind: 'week',
      clientId,
      data: { label: str(d.label, 40, 'label', 1), done: int(d.done, 0, 14, 'done'), planned: int(d.planned, 0, 7, 'planned'), streak: int(d.streak, 0, 1000, 'streak'), ...common(d) },
    };
  }
  return bad('kind');
}
