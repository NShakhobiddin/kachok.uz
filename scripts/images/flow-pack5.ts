// Flow-8 to‘plami: Flow-6 yakuniy tekshiruvida rad etilgan kadrlar (fixesFlow8.ts).
// Ishlatish: npx vite-node scripts/images/flow-pack5.ts -- <chiqish> <flow6-yakuniy-papka> [flow9|flow10]
//   <flow6-yakuniy-papka> — 4 qismli yakuniy zip birlashtirilib ochilgan papka (1_yangi/, 2_tuzatish/).
// Natijalar: python3 scripts/images/place_flow.py <papka>
import { copyFileSync, existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { ILLUSTRATIONS } from '../../src/data/illustrations';
import { AUDIT_FIXES } from './fixesAudit3';
import { FLOW8, type Flow8Frame, type Flow8Job } from './fixesFlow8';
import { FLOW9 } from './fixesFlow9';
import { FLOW10 } from './fixesFlow10';
import { NEW_SPECS } from './specsNew';

const [out, yak, set = 'flow8'] = process.argv.slice(2).filter((a) => a !== '--');
if (!out || !yak) throw new Error('chiqish va flow6-yakuniy papkasi kerak');
const JOBS = set === 'flow10' ? FLOW10 : set === 'flow9' ? FLOW9 : FLOW8;
const TITLE = set === 'flow10' ? 'Flow-10: ekran rasmlari tahlili va Flow-9 (bitta to‘plam)' : set === 'flow9' ? 'Flow-9: murabbiy auditida topilgan rasm xatolari' : 'Flow-8: rad etilgan kadrlar';

const prompts: Record<string, { prompt: string }> = Object.fromEntries(
  JSON.parse(readFileSync('scripts/images/prompts.json', 'utf8'))
    .filter((j: { kind: string }) => j.kind === 'exercise')
    .map((j: { id: string; prompt: string }) => [j.id, j]),
);
const appFile = (src: string) => 'public/illustrations/' + src.split('/illustrations/')[1];
const STYLE_MALE = 'public/illustrations/db-rdl.webp';
const STYLE_FEMALE = 'public/illustrations/glute-bridge.webp';
const NO_TEXT = 'Absolutely no text, letters, numbers, labels, arrows, logos or watermarks. No extra limbs, hands or feet, no floating or disconnected equipment. Square 1:1.';
const HEAD = (female: boolean) =>
  female
    ? 'The head and FACE are écorché like the body: skin removed, facial muscles visible, with a neat low hair bun — never a realistic skin face.'
    : 'The head and FACE are écorché like the body: skin removed, facial muscles visible, completely bald — no hair and no realistic skin.';
const STYLE_EN =
  'Image 1 is ONLY a style reference: match its rendering style, lighting, charcoal-black background, lime-green glow and level of detail exactly, but do NOT copy its pose, person, exercise or equipment.';
const keep = (female: boolean) =>
  `Keep EVERYTHING else identical: the same camera viewpoint, angle, lens and zoom (the equipment and the floor stay in exactly the same place and size), the same ${female ? 'woman' : 'athlete'} (écorché style, same proportions, same ${female ? 'sports bra and shorts' : 'shorts'} and shoes), the same equipment, the same charcoal-black background and lighting, and the same lime-green muscle glow.`;

/** Flow-6 yakuniy natijasi (id bo‘yicha papka) */
function yakFile(id: string, which: 'A' | 'B'): string {
  for (const g of ['1_yangi', '2_tuzatish']) {
    const dir = existsSync(`${yak}/${g}`) ? readdirSync(`${yak}/${g}`).find((x) => x.replace(/^\d+_/, '') === id) : undefined;
    const p = dir ? `${yak}/${g}/${dir}/natija-${which}.png` : '';
    if (p && existsSync(p)) return p;
  }
  throw new Error(`yakuniy natija yo‘q: ${id} ${which}`);
}

/** asos rasmni papkaga ko‘chiradi; prompt uchun tavsif qaytaradi */
function base(job: Flow8Job, f: Flow8Frame, dir: string, step: 'A' | 'B'): string {
  const ill = ILLUSTRATIONS[job.id];
  switch (f.from) {
    case 'A':
      return 'natija-A — the finished illustration you generated in step A';
    case 'yakA':
    case 'yakB': {
      const name = `${step}-asos.png`;
      copyFileSync(yakFile(job.id, f.from === 'yakA' ? 'A' : 'B'), `${dir}/${name}`);
      return `the finished illustration ${name}`;
    }
    case 'current':
    case 'currentPair': {
      const src = f.from === 'current' ? ill?.src : ill?.pair?.src;
      if (!src) throw new Error(`ilovada rasm yo‘q: ${job.id} ${f.from}`);
      const name = `${step}-asos.webp`;
      copyFileSync(appFile(src), `${dir}/${name}`);
      return `the finished illustration ${name}`;
    }
    default:
      return '';
  }
}

function frameText(job: Flow8Job, f: Flow8Frame, dir: string, step: 'A' | 'B'): string {
  const female = !!job.female || !!NEW_SPECS[job.id]?.female;
  const refLine = job.ref ? `Image 2 (2-namuna.webp) is ONLY a reference for ${job.ref.note}; copy nothing else from it.` : '';
  if (f.mode === 'fresh') {
    copyFileSync(female ? STYLE_FEMALE : STYLE_MALE, `${dir}/${step}-uslub.webp`);
    const ill = ILLUSTRATIONS[job.id];
    if (ill) copyFileSync(appFile(ill.src), `${dir}/0-hozirgi.webp`);
    const basePrompt = prompts[job.id]?.prompt;
    if (!basePrompt) throw new Error(`prompt yo‘q: ${job.id}`);
    const prev = AUDIT_FIXES.find((x) => x.id === job.id)?.main;
    return [STYLE_EN.replace('Image 1', `Image 1 (${step}-uslub.webp)`), basePrompt, `CORRECTIONS — these override anything above:\n${[prev, f.change].filter(Boolean).join('\n')}`, HEAD(female), NO_TEXT]
      .filter(Boolean)
      .join('\n\n');
  }
  const b = base(job, f, dir, step);
  const head =
    f.mode === 'edit'
      ? `Image 1 is ${b}. EDIT this illustration: fix ONLY what is listed below — everything not listed stays exactly as it is. The camera must NOT move.`
      : `Image 1 is ${b}. Create the SAME scene at the other end of the movement. The camera must NOT move.`;
  const what = f.mode === 'edit' ? `Change ONLY: ${f.change}.` : `Change ONLY the body pose (and whatever the athlete holds, pushes or rides moves with the body) to: ${f.change}.`;
  return [head, refLine, keep(female), what, HEAD(female), NO_TEXT].filter(Boolean).join('\n\n');
}

const md: string[] = [
  `# GYMbos — ${TITLE}`,
  '',
  'Har papkada:',
  '- **A-prompt.txt** bo‘lsa — avval A: `A-asos.*` (yoki `A-uslub.webp`) ni 1-rasm qilib yuklang, matnni qo‘ying, eng to‘g‘risini `natija-A.png` deb saqlang.',
  '- **B-prompt.txt** — keyin B: prompt qaysi rasmni 1-rasm deb aytsa, o‘shani yuklang (`natija-A.png` yoki `B-asos.*`), eng to‘g‘risini `natija-B.png` deb saqlang.',
  '- `2-namuna.webp` bo‘lsa — uni 2-rasm qilib qo‘shing (faqat bitta detal uchun namuna).',
  '- `natija-A.png` yoki `natija-B.png` allaqachon bor bo‘lsa — u tayyor (Flow-6 da to‘g‘ri chiqqan), o‘zgartirmang.',
  '- Saqlashdan oldin **«Tekshiring»** qatoriga qarang. Flow ikki urinishda chiqarmasa — xuddi shu fayllar bilan ChatGPT’da sinab ko‘ring.',
  '- Hammasini zip qilib yuboring.',
  '',
  ...(set === 'flow10' ? ['**Flow-9 ham shu to‘plamda (16–21-papkalar)** — uni alohida qilish shart emas. Flow-9 dan tayyor natijangiz bo‘lsa, uni ham yuboring.', ''] : []),
  'Umumiy: yuz ham terisiz (mushaklari ko‘rinadi), ayol figurada — sport ko‘ylagi va shortik, soch past tugunda; oyoq-qo‘l soni to‘g‘ri; kamera ikki kadrda bir xil.',
  '',
];
let n = 0;
for (const job of JOBS) {
  const dir = `${out}/${String(++n).padStart(2, '0')}_${job.id}`;
  mkdirSync(dir, { recursive: true });
  if (job.ref) copyFileSync(`public/illustrations/${job.ref.src}`, `${dir}/2-namuna.webp`);
  if (job.keepA) copyFileSync(yakFile(job.id, job.keepA === 'yakA' ? 'A' : 'B'), `${dir}/natija-A.png`);
  if (job.keepB) copyFileSync(yakFile(job.id, job.keepB === 'yakA' ? 'A' : 'B'), `${dir}/natija-B.png`);
  if (job.a) writeFileSync(`${dir}/A-prompt.txt`, frameText(job, job.a, dir, 'A'));
  if (job.b) writeFileSync(`${dir}/B-prompt.txt`, frameText(job, job.b, dir, 'B'));
  const ill = ILLUSTRATIONS[job.id];
  const mainPhase = job.a?.phaseUz ?? ill?.phase ?? NEW_SPECS[job.id]?.phaseUz;
  const pairPhase = job.b?.phaseUz ?? (job.keepB ? ill?.pair?.phase ?? NEW_SPECS[job.id]?.pair.phaseUz : undefined);
  writeFileSync(
    `${dir}/job.json`,
    JSON.stringify({ id: job.id, group: ill ? 'old' : 'new', main: mainPhase ? { phaseUz: mainPhase } : undefined, pair: pairPhase ? { phaseUz: pairPhase } : undefined }, null, 1),
  );
  const SRC: Record<string, string> = { A: 'yangi natija-A dan', yakA: 'Flow-6 A kadridan', yakB: 'Flow-6 B kadridan', current: 'ilovadagi asosiy kadrdan', currentPair: 'ilovadagi ikkinchi kadrdan', fresh: 'noldan' };
  const desc = (k: string, f?: Flow8Frame) => f && `${k}: ${f.mode === 'edit' ? 'tahrir' : f.mode === 'fresh' ? 'yangi rasm' : 'boshqa holat'} — ${SRC[f.from]}`;
  const what = [desc('A', job.a), desc('B', job.b), job.keepA && 'A tayyor', job.keepB && 'B tayyor'].filter(Boolean).join('; ');
  md.push(`### ${n}. \`${job.id}\` — ${what}`, `- Muammo: ${job.problem}`, `- Tekshiring: ${job.check}`, '');
}
writeFileSync(`${out}/ROYXAT.md`, md.join('\n'));
console.log(`tayyor: ${out} (${JOBS.length} ish)`);
