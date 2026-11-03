// Google Flow uchun qo'lda generatsiya to'plami: har ish — alohida papka (prompt.txt, uslub namunasi, poza namunasi).
// Oldin: npx vite-node scripts/images/prompts.ts; poza namunalari (dev server ishlab turganda):
//   JOBS=scripts/images/prompts.json node scripts/images/poses.mjs <poza-papka> id1,id2
// Ishlatish: node scripts/images/flow-pack.mjs --out <papka> --ids id1,id2 [--poses <poza-papka>]
import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';

const arg = (n, d) => {
  const i = process.argv.indexOf(`--${n}`);
  return i < 0 ? d : process.argv[i + 1];
};
const out = arg('out');
const ids = (arg('ids') ?? '').split(',').filter(Boolean);
const poses = arg('poses', null);
// figura bu harakatni aniq chiza olmaydi (yon tomonga harakat va h.k.) — poza namunasi chalg'itadi, faqat matn
const noPose = new Set((arg('nopose') ?? '').split(',').filter(Boolean));
if (!out || !ids.length) throw new Error('--out va --ids kerak');

const all = Object.fromEntries(JSON.parse(readFileSync('scripts/images/prompts.json', 'utf8')).map((j) => [`${j.kind}:${j.id}`, j]));
// uslub namunalari: tekshiruvdan toza o'tgan rasmlar
const STYLE_EX = 'public/illustrations/glute-bridge.webp';
const STYLE_EQ = 'public/illustrations/equipment/legCurl.webp';

const STYLE_EN =
  'Image 1 is ONLY a style reference: match its rendering style, lighting, charcoal-black background, lime-green glow and level of detail exactly, but do NOT copy its pose, person, exercise or equipment.';
const POSE_EN =
  'Image 2 is a simple stick-figure POSE reference made from the app animation: copy the exact body position, joint angles and contact points (floor, wall, bench) from it, but NOT its drawing style or colors.';

mkdirSync(out, { recursive: true });
const list = [
  '# Flow uchun rasm ishlari',
  '',
  'Har papkada: `prompt.txt` (Flow\'ga qo‘yiladigan matn), `1-uslub` (uslub namunasi), bo‘lsa `2-poza` (poza namunasi).',
  '',
  '## Qanday bajariladi',
  '',
  '1. labs.google/flow → yangi loyiha → rasm yaratish (Nano Banana yoki Imagen).',
  '2. Har papka uchun `1-uslub` va `2-poza` rasmlarini namuna (ingredient) sifatida yuklang, `prompt.txt` matnini to‘liq qo‘ying.',
  '3. 2–4 variant yarating. Texnikasi eng to‘g‘ri chiqqanini (qo‘l-oyoq soni, poza, jihoz) yuklab oling va shu papkaga `natija-1.png` deb saqlang; yaxshi chiqqan yana bitta bo‘lsa — `natija-2.png`.',
  '4. Hammasini bitta zip qilib chatga yuboring — tekshirib, ilovaga joylayman.',
  '',
  '## Ishlar',
  '',
];
let n = 0;
for (const id of ids) {
  const job = all[`exercise:${id}`] ?? all[`equipment:${id}`];
  if (!job) {
    console.error(`prompt topilmadi: ${id}`);
    continue;
  }
  n++;
  const d = `${out}/${String(n).padStart(2, '0')}_${job.kind === 'equipment' ? 'jihoz_' : ''}${id}`;
  mkdirSync(d, { recursive: true });
  const parts = [STYLE_EN];
  copyFileSync(job.kind === 'equipment' ? STYLE_EQ : STYLE_EX, `${d}/1-uslub.webp`);
  const pose = poses && job.kind === 'exercise' && !noPose.has(id) ? `${poses}/${id}.png` : null;
  if (pose && existsSync(pose)) {
    copyFileSync(pose, `${d}/2-poza.png`);
    parts.push(POSE_EN);
  }
  parts.push(job.prompt);
  writeFileSync(`${d}/prompt.txt`, parts.join('\n\n'));
  list.push(`${n}. \`${id}\` — ${job.title}`);
}
writeFileSync(`${out}/ROYXAT.md`, list.join('\n') + '\n');
console.log(`${n} ta ish: ${out}`);
