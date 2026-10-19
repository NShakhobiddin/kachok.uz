// docs/emg/*.json (tadqiqot jadvallari) + docs/emg/uz.json (o'zbekcha izohlar) -> src/data/activation.ts
// Ishga tushirish: node scripts/build-activation.mjs
import { readFileSync, writeFileSync } from 'node:fs';

const root = new URL('../', import.meta.url);
const read = (p) => JSON.parse(readFileSync(new URL(p, root), 'utf8'));
// bir xil kalit turli fayllarda turli maqolani bildirishi mumkin (masalan youdas2010) — kalitlar fayl prefiksi bilan
const parts = [
  ['L', 'docs/emg/lower.json'],
  ['P', 'docs/emg/push.json'],
  ['U', 'docs/emg/pull.json'],
].map(([ns, p]) => ({ ns, ...read(p) }));
const uz = read('docs/emg/uz.json');
const exercisesTs = readFileSync(new URL('src/data/exercises.ts', root), 'utf8');
const ids = new Set([...exercisesTs.matchAll(/\n {4}id: '([^']+)'/g)].map((m) => m[1]));

const KEYS = new Set([
  'pecUpper', 'pecMid', 'pecLower', 'deltAnt', 'deltLat', 'deltPost', 'trapUpper', 'trapMid', 'trapLower', 'rhomboids', 'lats', 'teresMajor',
  'infraspinatus', 'serratus', 'erectors', 'rectusAbdominis', 'externalOblique', 'biceps', 'brachialis', 'brachioradialis', 'tricepsLong',
  'tricepsLateral', 'tricepsMedial', 'forearmFlexors', 'forearmExtensors', 'gluteMax', 'gluteMed', 'rectusFemoris', 'vastusLateralis',
  'vastusMedialis', 'bicepsFemoris', 'medialHamstrings', 'adductors', 'gastrocnemius', 'soleus', 'tibialisAnterior', 'iliopsoas',
]);

const activation = {};
const sources = {};
const problems = [];
for (const part of parts) {
  for (const [k, s] of Object.entries(part.sources)) {
    const cite = s.cite.replace(/^\[Authors not retrieved\]\.?\s*/, 'Mualliflar aniqlanmagan. ');
    sources[`${part.ns}.${k}`] = { cite, ...(s.doi ? { doi: s.doi } : {}) };
  }
  for (const [id, e] of Object.entries(part.exercises)) {
    if (!ids.has(id)) problems.push(`noma'lum mashq: ${id}`);
    const t = uz[id];
    if (!t) problems.push(`o'zbekcha izoh yo'q: ${id}`);
    const muscles = {};
    for (const [m, v] of Object.entries(e.muscles)) {
      if (!KEYS.has(m)) {
        problems.push(`${id}: noma'lum mushak ${m}`);
        continue;
      }
      const mvic = Math.round(v.mvic);
      const range = Array.isArray(v.range) && v.range.length === 2 ? [Math.round(v.range[0]), Math.round(v.range[1])] : undefined;
      if (range && (mvic < range[0] || mvic > range[1])) problems.push(`${id}.${m}: qiymat oraliqdan tashqarida`);
      for (const s of v.src ?? []) if (!part.sources[s]) problems.push(`${id}.${m}: manba yo'q ${s}`);
      const src = (v.src ?? []).map((x) => `${part.ns}.${x}`);
      muscles[m] = { mvic, ...(range && range[0] !== range[1] ? { range } : {}), ...(v.estimate ? { est: true } : {}), ...(src.length ? { src } : {}) };
    }
    const similar = e.basis.startsWith('similar') ? (t?.similar ?? e.basis.slice(8)) : null;
    activation[id] = {
      basis: similar ? `similar:${similar}` : 'direct',
      ...(t?.load ? { load: t.load } : {}),
      metric: e.metric === 'peak' ? 'peak' : 'mean',
      muscles,
      ...(t?.rom ? { rom: t.rom } : {}),
      ...(t?.notes ? { notes: t.notes } : {}),
    };
  }
}
for (const id of ids) if (!activation[id]) problems.push(`EMG ma'lumoti yo'q: ${id}`);
if (problems.length) {
  console.error(problems.join('\n'));
  process.exit(1);
}

const header = `// Mashqlarda mushaklarning EMG faolligi (% MVIC). AVTOMATIK YARATILGAN — qo'lda tahrirlamang:
// manba jadvallar docs/emg/{lower,push,pull}.json, o'zbekcha izohlar docs/emg/uz.json, skript scripts/build-activation.mjs.
// est: true — qiymat to'g'ridan-to'g'ri o'lchanmagan (o'xshash mashq, tadqiqotdagi nisbiy farq yoki oraliq asosida baho).
import type { M3 } from './muscles3d';

export interface ActValue {
  /** o'rtacha (yoki eng yuqori) faollik, maksimal ixtiyoriy izometrik qisqarishga nisbatan % */
  mvic: number;
  range?: [number, number];
  /** to'g'ridan-to'g'ri o'lchanmagan — o'xshash mashq yoki bir nechta tadqiqot asosida baho */
  est?: boolean;
  src?: string[];
}

export interface ExerciseActivation {
  /** 'direct' — shu mashq o'lchangan; 'similar:<mashq>' — o'xshash mashq asosida */
  basis: string;
  load?: string;
  metric?: 'mean' | 'peak';
  muscles: Partial<Record<M3, ActValue>>;
  /** harakat amplitudasi bo'ylab faollik o'zgarishi */
  rom?: string;
  notes?: string;
}

`;
const body =
  `export const ACTIVATION: Record<string, ExerciseActivation> = ${JSON.stringify(activation, null, 2)};\n\n` +
  `export const EMG_SOURCES: Record<string, { cite: string; doi?: string }> = ${JSON.stringify(sources, null, 2)};\n`;
writeFileSync(new URL('src/data/activation.ts', root), header + body);
const vals = Object.values(activation).flatMap((a) => Object.values(a.muscles));
console.log(`mashqlar: ${Object.keys(activation).length}, qiymatlar: ${vals.length} (to'g'ridan-to'g'ri: ${vals.filter((v) => !v.est).length}), manbalar: ${Object.keys(sources).length}`);
