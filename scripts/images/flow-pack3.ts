// Flow-6 to'plami (2026-11 auditi): 1_yangi — ilovaga qo'shiladigan yangi mashqlar (specsNew.ts), A va B kadr;
// 2_tuzatish — audit topgan rasm xatolari (fixesAudit3.ts). Natijalar: python3 scripts/images/place_flow.py <papka>.
// Ishlatish: npx vite-node scripts/images/flow-pack3.ts -- <chiqish> [--only id1,id2]
import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { ILLUSTRATIONS } from '../../src/data/illustrations';
import { AUDIT_FIXES } from './fixesAudit3';
import { NEW_SPECS } from './specsNew';

const argv = process.argv.slice(2).filter((a) => a !== '--');
const oi = argv.indexOf('--only');
const ONLY = oi < 0 ? null : new Set(argv.splice(oi, 2)[1].split(','));
const want = (id: string) => !ONLY || ONLY.has(id);
const [out] = argv;
if (!out) throw new Error('chiqish papkasi kerak');

const prompts: Record<string, { prompt: string; phase: string }> = Object.fromEntries(
  JSON.parse(readFileSync('scripts/images/prompts.json', 'utf8'))
    .filter((j: { kind: string }) => j.kind === 'exercise')
    .map((j: { id: string; prompt: string; phase: string }) => [j.id, j]),
);
const file = (src: string) => 'public/illustrations/' + src.split('/illustrations/')[1];

// uslub namunalari: erkak — zal mashqlari, ayol — uy mashqlari
const STYLE_MALE = 'public/illustrations/db-rdl.webp';
const STYLE_FEMALE = 'public/illustrations/glute-bridge.webp';
const NO_TEXT = 'Absolutely no text, letters, numbers, labels, arrows, logos or watermarks. No extra limbs or fingers, no floating or disconnected equipment. Square 1:1.';
const STYLE_EN =
  'Image 1 is ONLY a style reference: match its rendering style, lighting, charcoal-black background, lime-green glow and level of detail exactly, but do NOT copy its pose, person, exercise or equipment.';
const BODY_MALE =
  'Body: écorché style — skin removed, realistic deep-red striated muscle fibers, pearly white tendons, anatomically accurate muscle shapes. Plain opaque dark grey compression shorts fully covering the hips. Black flat-soled training shoes.';
const BODY_FEMALE =
  'Body: an athletic adult WOMAN with clearly female proportions (narrower shoulders, wider pelvis, natural female build), rendered in écorché style — skin removed, realistic deep-red striated muscle fibers, pearly white tendons, anatomically accurate muscle shapes; hair pulled back into a neat low bun. Plain opaque dark grey sports bra and dark grey compression shorts fully covering chest and hips. Black flat-soled training shoes.';
const keep = (female: boolean) =>
  `Keep EVERYTHING else identical: the same camera viewpoint, angle, lens and zoom (the equipment and the floor stay in exactly the same place and size), the same ${female ? 'woman' : 'athlete'} (écorché anatomical render style — skin removed, deep-red striated muscles, white tendons — same body proportions, same ${female ? 'dark grey sports bra and shorts' : 'dark grey shorts'} and black shoes), the same equipment, the same charcoal-black background and lighting, and the same lime-green muscle glow.`;
const pairText = (female: boolean, change: string, base: string) =>
  [
    `Image 1 is ${base}. Create the SAME scene at the other end of the movement. The camera must NOT move.`,
    keep(female),
    `Change ONLY the body pose (and whatever the athlete holds, pushes or rides moves with the body) to: ${change}.`,
    NO_TEXT,
  ].join('\n\n');

function newPrompt(id: string): string {
  const s = NEW_SPECS[id];
  return [
    `Photorealistic anatomical render of ${s.female ? 'an athletic woman' : 'a muscular male athlete'} performing the ${s.en.toLowerCase()}, captured at ${s.phase}. Camera: ${s.camera}.`,
    '',
    s.female ? BODY_FEMALE : BODY_MALE,
    '',
    'Correct technique (must be exact):',
    ...s.technique.map((t) => `- ${t}`),
    '',
    'Muscle activation shown as a neon lime-green glow (#D4FA50) from within the muscles, brightness proportional to effort:',
    `- brightest (100%): ${s.glow.top.join(', ')};`,
    ...(s.glow.mid?.length ? [`- clearly dimmer, about half as bright: ${s.glow.mid.join(', ')};`] : []),
    ...(s.glow.low?.length ? [`- very faint: ${s.glow.low.join(', ')};`] : []),
    '- all other muscles: no glow, natural deep red.',
    '',
    `Equipment: ${s.equipment}`,
    'Scene: pure charcoal-black background (#0B0B0C), soft top-left key light, subtle lime-green rim light from behind, soft contact shadow, no floor texture.',
    'Composition: square 1:1, the whole figure and equipment fully visible with generous empty margins on the left and right, centered.',
    '',
    NO_TEXT,
  ].join('\n');
}

const md: string[] = [
  '# GYMbos — Flow-6: yangi mashqlar va audit tuzatishlari',
  '',
  '## Qanday bajariladi',
  '',
  '1. labs.google/flow → yangi loyiha → rasm yaratish, model **Nano Banana Pro**.',
  '2. **A-prompt.txt** bor papkada: `1-uslub.webp` ni namuna sifatida yuklang, matnni to‘liq qo‘ying, 2–4 variant yarating. Texnikasi eng to‘g‘risini shu papkaga `natija-A.png` deb saqlang.',
  '3. **B-prompt.txt**: 1-rasm sifatida `natija-A.png` ni (A-prompt yo‘q papkada — `1-hozirgi.webp` ni) yuklang. Kamera, odam va jihoz o‘zgarmasin — faqat poza. Eng yaxshisini `natija-B.png` deb saqlang.',
  '4. Hammasini bitta zip qilib chatga yuboring — tekshirib, ilovaga joylayman.',
  '',
  '`0-` bilan boshlanadigan fayllar — faqat solishtirish uchun hozirgi rasm, Flow’ga yuklanmaydi.',
  '',
  'Tekshirish: qo‘l-oyoq va barmoqlar soni, ushlash, tizza yo‘nalishi, jihoz butunligi (kabel blokka ulangan, disklar shtangada); B kadrida kamera va odam A bilan bir xil.',
  '',
];

let n = 0;
const dir = (g: string, id: string) => {
  const d = `${out}/${g}/${String(++n).padStart(2, '0')}_${id}`;
  mkdirSync(d, { recursive: true });
  return d;
};

md.push('## 1. Yangi mashqlar (A va B)', '');
for (const [id, s] of Object.entries(NEW_SPECS)) {
  if (!want(id)) continue;
  const d = dir('1_yangi', id);
  copyFileSync(s.female ? STYLE_FEMALE : STYLE_MALE, `${d}/1-uslub.webp`);
  writeFileSync(`${d}/A-prompt.txt`, [STYLE_EN, newPrompt(id)].join('\n\n'));
  writeFileSync(`${d}/B-prompt.txt`, pairText(s.female, s.pair.change, 'natija-A — the finished illustration you generated in step A'));
  writeFileSync(`${d}/job.json`, JSON.stringify({ id, group: 'new', main: { phaseUz: s.phaseUz }, pair: { phaseUz: s.pair.phaseUz } }, null, 1));
  md.push(`${n}. \`${id}\` — ${s.uz} (${s.en}): ${s.why}`);
}

md.push('', '## 2. Audit tuzatishlari', '', 'Ustuvorlik: **1** — noto‘g‘ri texnika yoki buzuq rasm, **2** — harakat (ikkinchi kadr) yo‘q yoki noto‘g‘ri.', '');
n = 0;
for (const f of [...AUDIT_FIXES].sort((a, b) => a.priority - b.priority)) {
  if (!want(f.id)) continue;
  const ill = ILLUSTRATIONS[f.id];
  if (!ill) throw new Error(`rasm yo'q: ${f.id}`);
  const job = prompts[f.id];
  const female = !!f.female;
  const d = dir('2_tuzatish', f.id);
  copyFileSync(file(ill.src), `${d}/${f.main ? '0' : '1'}-hozirgi.webp`);
  if (ill.pair) copyFileSync(file(ill.pair.src), `${d}/0-hozirgi-B.webp`);
  if (f.main) {
    if (!job) throw new Error(`prompts.json da yo'q: ${f.id}`);
    copyFileSync(female ? STYLE_FEMALE : STYLE_MALE, `${d}/1-uslub.webp`);
    writeFileSync(`${d}/A-prompt.txt`, [STYLE_EN, job.prompt, `CORRECTIONS — these override anything above:\n${f.main}`].join('\n\n'));
  }
  if (f.pair) writeFileSync(`${d}/B-prompt.txt`, pairText(female, f.pair.change, f.main ? 'natija-A — the corrected illustration from step A' : 'the finished illustration 1-hozirgi.webp'));
  writeFileSync(`${d}/job.json`, JSON.stringify({ id: f.id, group: 'old', priority: f.priority, main: f.main ? { phaseUz: ill.phase } : undefined, pair: f.pair }, null, 1));
  md.push(`${n}. [${f.priority}] \`${f.id}\` — ${f.problem} (${[f.main ? 'A: yangidan' : '', f.pair ? `B: ${f.pair.phaseUz.toLowerCase()}` : ''].filter(Boolean).join(', ')})`);
}

writeFileSync(`${out}/ROYXAT.md`, md.join('\n') + '\n');
console.log(`tayyor: ${out}`);
