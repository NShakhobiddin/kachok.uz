// Google Flow uchun to'liq to'plam: boshlang'ich va oxirgi nuqta kadrlari (ilovada rasm asosidagi harakat).
//   1_yangi  — yangi mashqlar: A (asosiy kadr) → B (o'sha sahnada harakatning boshqa cheti, A natijasidan);
//   2_eski   — eski rasmlardagi xatolar (ustuvorlik bo'yicha) va yetishmayotgan ikkinchi kadrlar;
//   3_jihoz  — rasmi yo'q jihozlar.
// Oldin: npx vite-node scripts/images/prompts.ts; poza namunalari (dev server ishlab turganda):
//   node scripts/images/poses.mjs <poza-A> <idlar>;  node scripts/images/poses.mjs <poza-B> <idlar> alt
// Ishlatish: npx vite-node scripts/images/flow-pack2.ts -- <chiqish> <poza-A> <poza-B>
import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { ILLUSTRATIONS } from '../../src/data/illustrations';
import { EQUIPMENT_WITH_IMG } from '../../src/data/equipmentImages';
import { EQUIPMENT } from '../../src/data/catalog';
import { OLD_FIXES } from './fixesOld';
import { NEW_PAIRS } from './pairsNew';

// qo'shimcha: --only id1,id2 (faqat shu ishlar), --skipA id (A qayta qilinmaydi, B hozirgi rasmdan), --skipB id
const argv = process.argv.slice(2).filter((a) => a !== '--');
const flag = (n: string) => {
  const i = argv.indexOf(`--${n}`);
  return i < 0 ? null : new Set(argv.splice(i, 2)[1].split(','));
};
const ONLY = flag('only');
const SKIP_A = flag('skipA') ?? new Set<string>();
const SKIP_B = flag('skipB') ?? new Set<string>();
const want = (id: string) => !ONLY || ONLY.has(id);
const [out, posesA, posesB] = argv;
if (!out || !posesA || !posesB) throw new Error('chiqish va poza papkalari kerak');

const prompts: Record<string, { id: string; kind: string; title: string; phase?: string; prompt: string }> = Object.fromEntries(
  JSON.parse(readFileSync('scripts/images/prompts.json', 'utf8')).map((j: { kind: string; id: string }) => [`${j.kind}:${j.id}`, j]),
);
const file = (src: string) => 'public/illustrations/' + src.split('/illustrations/')[1];

const STYLE_EX = 'public/illustrations/glute-bridge.webp';
const STYLE_EQ = 'public/illustrations/equipment/legCurl.webp';
// figura chiza olmaydigan harakatlar: poza namunasi chalg'itadi, faqat matn
const NO_POSE = new Set(['fire-hydrant', 'clamshell', 'side-leg-raise', 'side-plank', 'curtsy-lunge', 't-bar-row', 'supine-twist', 'pigeon', 'cross-body-shoulder', 'neck-stretch']);
// ikkinchi kadr animatsiyaning boshlanishi emas (boshqa tomon, chuqurroq poza) — B uchun poza namunasi yo'q
const NO_POSE_B = new Set([...NO_POSE, 'cat-cow', 'thread-needle', 'butterfly', 'bicycle-crunch', 'mountain-climber']);

const NO_TEXT = 'Absolutely no text, letters, numbers, labels, arrows, logos or watermarks. No extra limbs or fingers, no floating or disconnected equipment. Square 1:1.';
const STYLE_EN =
  'Image 1 is ONLY a style reference: match its rendering style, lighting, charcoal-black background, lime-green glow and level of detail exactly, but do NOT copy its pose, person, exercise or equipment.';
const POSE_EN = (n: number) =>
  `Image ${n} is a simple figure POSE reference made from the app animation: copy the exact body position, joint angles and contact points (floor, wall, bench, machine) from it, but NOT its drawing style or colors.`;
const keep = (female: boolean) =>
  `Keep EVERYTHING else identical: the same camera viewpoint, angle, lens and zoom (the equipment and the floor stay in exactly the same place and size), the same ${female ? 'woman' : 'athlete'} (écorché anatomical render style — skin removed, deep-red striated muscles, white tendons — same body proportions, same ${female ? 'dark grey sports bra and shorts' : 'dark grey shorts'} and black shoes), the same equipment, the same charcoal-black background and lighting, and the same lime-green muscle glow.`;
const pairText = (female: boolean, change: string, base: string, pose: boolean) =>
  [
    `Image 1 is ${base}. Create the SAME scene at the other end of the movement. The camera must NOT move.`,
    pose ? POSE_EN(2) : '',
    keep(female),
    `Change ONLY the body pose (and whatever the athlete holds, pushes or rides moves with the body) to: ${change}.`,
    NO_TEXT,
  ]
    .filter(Boolean)
    .join('\n\n');
const editText = (change: string) => [`Image 1 is a finished illustration. Edit it. Change ONLY ${change}.`, keep(false), NO_TEXT].join('\n\n');

const md: string[] = [
  '# GYMbos — Flow uchun rasm ishlari',
  '',
  'Maqsad: har mashq uchun **boshlang‘ich va oxirgi nuqta** rasmi — ilova ularni harakatga aylantiradi (chizma-animatsiya o‘rniga).',
  '',
  '## Qanday bajariladi',
  '',
  '1. labs.google/flow → yangi loyiha → rasm yaratish. Model: **Nano Banana Pro** (2.1 tahrirlarni deyarli bajarmadi).',
  '2. **A-prompt.txt** (bo‘lsa): papkadagi `1-…` va `2-…` rasmlarini namuna sifatida yuklang, matnni to‘liq qo‘ying, 2–4 variant yarating. Texnikasi eng to‘g‘ri chiqqanini shu papkaga `natija-A.png` deb saqlang.',
  '3. **B-prompt.txt**: 1-rasm sifatida **natija-A** ni (A bo‘lmasa — `1-hozirgi.webp` ni), bo‘lsa `3-poza-B.png` ni 2-rasm sifatida yuklang. Kamera, odam va jihoz o‘zgarmasligi kerak — faqat poza. Eng yaxshisini `natija-B.png` deb saqlang.',
  '4. Hammasini bitta zip qilib chatga yuboring — tekshirib, ilovaga joylayman (yorliqlar va harakat avtomatik).',
  '',
  '`0-` bilan boshlanadigan fayllar (`0-hozirgi…`) — faqat solishtirish uchun hozirgi rasm, Flow\'ga yuklanmaydi.',
  '',
  'Tekshirish: qo‘l-oyoq soni, ushlash, tizza yo‘nalishi, jihoz to‘g‘riligi; B kadrida kamera va odam A bilan bir xil.',
  '',
];

let n = 0;
const dirOf = (group: string, id: string) => `${out}/${group}/${String(++n).padStart(2, '0')}_${id}`;

/* ---------- 1. yangi mashqlar ---------- */
md.push('## 1. Yangi mashqlar (ayol figurasi) — A va B', '');
n = 0;
for (const [id, pair] of Object.entries(NEW_PAIRS)) {
  if (!want(id)) continue;
  const job = prompts[`exercise:${id}`];
  if (!job) throw new Error(`prompt yo'q: ${id}`);
  const d = dirOf('1_yangi', id);
  mkdirSync(d, { recursive: true });
  const placed = ILLUSTRATIONS[id];
  if (SKIP_A.has(id) && placed) {
    // asosiy kadr ilovada bor — faqat ikkinchi kadr undan
    copyFileSync(file(placed.src), `${d}/1-hozirgi.webp`);
    const pB0 = !NO_POSE_B.has(id) && existsSync(`${posesB}/${id}.png`);
    if (pB0) copyFileSync(`${posesB}/${id}.png`, `${d}/3-poza-B.png`);
    writeFileSync(`${d}/B-prompt.txt`, pairText(true, pair.change, 'the finished illustration 1-hozirgi.webp', pB0));
    writeFileSync(`${d}/job.json`, JSON.stringify({ id, group: 'new', main: { phaseUz: placed.phase }, pair: { phaseUz: pair.phaseUz } }, null, 1));
    md.push(`${n}. \`${id}\` — ${job.title} → faqat B: ${pair.phaseUz.toLowerCase()}`);
    continue;
  }
  if (placed) copyFileSync(file(placed.src), `${d}/0-hozirgi.webp`);
  copyFileSync(STYLE_EX, `${d}/1-uslub.webp`);
  const pA = !NO_POSE.has(id) && existsSync(`${posesA}/${id}.png`);
  const pB = !NO_POSE_B.has(id) && existsSync(`${posesB}/${id}.png`);
  if (pA) copyFileSync(`${posesA}/${id}.png`, `${d}/2-poza-A.png`);
  if (pB) copyFileSync(`${posesB}/${id}.png`, `${d}/3-poza-B.png`);
  writeFileSync(`${d}/A-prompt.txt`, [STYLE_EN, pA ? POSE_EN(2) : '', job.prompt].filter(Boolean).join('\n\n'));
  if (!SKIP_B.has(id)) writeFileSync(`${d}/B-prompt.txt`, pairText(true, pair.change, 'natija-A — the finished illustration you generated in step A', pB));
  writeFileSync(`${d}/job.json`, JSON.stringify({ id, group: 'new', main: { phaseUz: job.phase }, pair: { phaseUz: pair.phaseUz } }, null, 1));
  md.push(`${n}. \`${id}\` — ${job.title} → B: ${pair.phaseUz.toLowerCase()}`);
}

/* ---------- 2. eski rasmlar ---------- */
if (OLD_FIXES.some((f) => want(f.id)))
  md.push('', '## 2. Eski rasmlar: xatolarni tuzatish va ikkinchi kadr', '', 'Ustuvorlik: **1** — noto‘g‘ri texnika, **2** — harakat yo‘q yoki noto‘g‘ri kadr, **3** — kosmetik.', '');
n = 0;
for (const f0 of [...OLD_FIXES].sort((a, b) => a.priority - b.priority)) {
  if (!want(f0.id)) continue;
  const f = { ...f0, main: SKIP_A.has(f0.id) ? undefined : f0.main, pair: SKIP_B.has(f0.id) ? undefined : f0.pair };
  const ill = ILLUSTRATIONS[f.id];
  const job = prompts[`exercise:${f.id}`];
  const d = dirOf('2_eski', f.id);
  mkdirSync(d, { recursive: true });
  // tahrir va ikkinchi kadr uchun 1-rasm — hozirgi rasm; yangidan chizilsa u faqat solishtirish uchun (0-)
  const cur = ill ? file(ill.src) : 'public/illustrations/dead-bug.webp';
  copyFileSync(cur, `${d}/${f.main?.mode === 'new' ? '0' : '1'}-hozirgi.webp`);
  if (ill?.pair) copyFileSync(file(ill.pair.src), `${d}/0-hozirgi-B.webp`);
  if (f.main?.mode === 'edit') writeFileSync(`${d}/A-prompt.txt`, editText(f.main.change));
  if (f.main?.mode === 'new') {
    copyFileSync(STYLE_EX, `${d}/1-uslub.webp`);
    writeFileSync(`${d}/A-prompt.txt`, [STYLE_EN, job.prompt, `CORRECTIONS — these override anything above:\n${f.main.change}`].join('\n\n'));
  }
  if (f.pair) writeFileSync(`${d}/B-prompt.txt`, pairText(false, f.pair.change, f.main ? 'natija-A — the corrected illustration from step A' : 'the finished illustration 1-hozirgi.webp', false));
  writeFileSync(`${d}/job.json`, JSON.stringify({ id: f.id, group: 'old', priority: f.priority, main: f.main ? { phaseUz: ill?.phase ?? job.phase } : undefined, pair: f.pair }, null, 1));
  const what = [f.main ? (f.main.mode === 'new' ? 'A: yangidan' : 'A: tahrir') : '', f.pair ? `B: ${f.pair.phaseUz.toLowerCase()}` : ''].filter(Boolean).join(', ');
  md.push(`${n}. [${f.priority}] \`${f.id}\` — ${f.problem} (${what})`);
}

/* ---------- 3. jihozlar ---------- */
const eqTodo = EQUIPMENT.filter((x) => !EQUIPMENT_WITH_IMG.includes(x.id) && want(x.id));
if (eqTodo.length) md.push('', '## 3. Jihozlar (faqat A)', '');
n = 0;
for (const e of eqTodo) {
  const job = prompts[`equipment:${e.id}`];
  const d = dirOf('3_jihoz', e.id);
  mkdirSync(d, { recursive: true });
  copyFileSync(STYLE_EQ, `${d}/1-uslub.webp`);
  writeFileSync(`${d}/A-prompt.txt`, [STYLE_EN, job.prompt].join('\n\n'));
  writeFileSync(`${d}/job.json`, JSON.stringify({ id: e.id, group: 'equipment' }, null, 1));
  md.push(`${n}. \`${e.id}\` — ${e.name}`);
}

writeFileSync(`${out}/ROYXAT.md`, md.join('\n') + '\n');
console.log(`tayyor: ${out}`);
