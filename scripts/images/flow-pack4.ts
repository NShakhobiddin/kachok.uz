// Flow-7 to‘plami: Flow-6 tekshiruvida rad etilgan kadrlar va yetishmayotgan ikkinchi kadrlar (fixesFlow7.ts).
// Ishlatish: npx vite-node scripts/images/flow-pack4.ts -- <chiqish> <flow6-natijalar>
//   <flow6-natijalar> — Flow-6 zip ochilgan papka (aFromB ishlarida yaxshi chiqqan B kadr shu yerdan olinadi).
// Natijalar: python3 scripts/images/place_flow.py <papka>
import { copyFileSync, existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { ILLUSTRATIONS } from '../../src/data/illustrations';
import { FLOW7 } from './fixesFlow7';
import { AUDIT_FIXES } from './fixesAudit3';
import { NEW_SPECS } from './specsNew';

const [out, flow6] = process.argv.slice(2).filter((a) => a !== '--');
if (!out || !flow6) throw new Error('chiqish va flow6 natijalar papkasi kerak');

const prompts: Record<string, { prompt: string }> = Object.fromEntries(
  JSON.parse(readFileSync('scripts/images/prompts.json', 'utf8'))
    .filter((j: { kind: string }) => j.kind === 'exercise')
    .map((j: { id: string; prompt: string }) => [j.id, j]),
);
const file = (src: string) => 'public/illustrations/' + src.split('/illustrations/')[1];
const STYLE_MALE = 'public/illustrations/db-rdl.webp';
const STYLE_FEMALE = 'public/illustrations/glute-bridge.webp';
const NO_TEXT = 'Absolutely no text, letters, numbers, labels, arrows, logos or watermarks. No extra limbs or fingers, no floating or disconnected equipment. Square 1:1.';
const STYLE_EN =
  'Image 1 is ONLY a style reference: match its rendering style, lighting, charcoal-black background, lime-green glow and level of detail exactly, but do NOT copy its pose, person, exercise or equipment.';
const BODY_MALE =
  'Body: écorché style — skin removed (also on the head and face), realistic deep-red striated muscle fibers, pearly white tendons, anatomically accurate muscle shapes. Plain opaque dark grey compression shorts fully covering the hips. Black flat-soled training shoes.';
const BODY_FEMALE =
  'Body: an athletic adult WOMAN with clearly female proportions, rendered in écorché style — skin removed (also on the head and face), realistic deep-red striated muscle fibers, pearly white tendons; hair pulled back into a neat low bun. Plain opaque dark grey sports bra and dark grey compression shorts fully covering chest and hips. Black flat-soled training shoes.';
const keep = (female: boolean) =>
  `Keep EVERYTHING else identical: the same camera viewpoint, angle, lens and zoom (the equipment and the floor stay in exactly the same place and size), the same ${female ? 'woman' : 'athlete'} (écorché style, same proportions, same ${female ? 'sports bra and shorts' : 'shorts'} and shoes), the same equipment, the same charcoal-black background and lighting, and the same lime-green muscle glow.`;
const pairText = (female: boolean, change: string, base: string) =>
  [`Image 1 is ${base}. Create the SAME scene at the other end of the movement. The camera must NOT move.`, keep(female), `Change ONLY the body pose (and whatever the athlete holds, pushes or rides moves with the body) to: ${change}.`, NO_TEXT].join('\n\n');

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
    'Composition: square 1:1, the whole figure and equipment fully visible with generous empty margins, centered.',
    '',
    NO_TEXT,
  ].join('\n');
}

/** Flow-6 natijalar papkasidan id bo‘yicha fayl */
function flow6File(group: string, id: string, name: string): string | null {
  const g = `${flow6}/${group}`;
  if (!existsSync(g)) return null;
  const d = readdirSync(g).find((x) => x.replace(/^\d+_/, '') === id);
  const p = d ? `${g}/${d}/${name}` : null;
  return p && existsSync(p) ? p : null;
}

const md: string[] = [
  '# GYMbos — Flow-7: qayta chiziladigan kadrlar',
  '',
  'Flow-6 tekshiruvida rad etilgan rasmlar va yetishmayotgan ikkinchi kadrlar. Tartib Flow-6 dagidek:',
  '1. **A-prompt.txt** bor papkada: `1-…` rasmni yuklang, matnni qo‘ying, eng to‘g‘risini `natija-A.png` deb saqlang.',
  '2. **B-prompt.txt**: 1-rasm sifatida `natija-A.png` ni (A-prompt yo‘q papkada — `1-hozirgi.webp` ni) yuklang, eng yaxshisini `natija-B.png` deb saqlang.',
  '3. `natija-B.png` allaqachon bor papkada (tizzada otjimaniya, press roligi) — u Flow-6 da yaxshi chiqqan; A uni 1-rasm qilib yaratiladi.',
  '4. Hammasini zip qilib yuboring.',
  '',
  'E’tibor: yuz ham terisiz (mushaklari ko‘rinadigan) bo‘lsin, ayol figurada — sport ko‘ylagi va shortik; oyoq-qo‘l soni, jihoz butunligi.',
  '',
];
let n = 0;
for (const j of FLOW7) {
  const d = `${out}/${String(++n).padStart(2, '0')}_${j.id}`;
  mkdirSync(d, { recursive: true });
  const ill = ILLUSTRATIONS[j.id];
  const female = j.female ?? (j.group === 'new' ? NEW_SPECS[j.id]?.female ?? false : false);
  const style = female ? STYLE_FEMALE : STYLE_MALE;
  let pair = j.b;
  let what = '';
  if (j.aFromB) {
    const b = flow6File('2_tuzatish', j.id, 'natija-B.jpg');
    if (!b) throw new Error(`Flow-6 B yo‘q: ${j.id}`);
    copyFileSync(b, `${d}/1-tayanch-B.jpg`);
    copyFileSync(b, `${d}/natija-B.jpg`);
    writeFileSync(`${d}/A-prompt.txt`, pairText(female, j.a!, 'the finished illustration 1-tayanch-B.jpg (the START of the movement)'));
    const fix = AUDIT_FIXES.find((f) => f.id === j.id);
    pair = { phaseUz: fix?.pair?.phaseUz ?? 'Boshlang‘ich holat', change: '' };
    what = 'A: tayyor B dan';
  } else if (j.a) {
    if (ill) copyFileSync(file(ill.src), `${d}/0-hozirgi.webp`);
    copyFileSync(style, `${d}/1-uslub.webp`);
    const base = j.group === 'new' ? newPrompt(j.id) : prompts[j.id]?.prompt;
    if (!base) throw new Error(`prompt yo‘q: ${j.id}`);
    const prev = j.group === 'old' ? AUDIT_FIXES.find((f) => f.id === j.id)?.main : undefined;
    const fixes = [prev, j.a].filter(Boolean).join('\n');
    writeFileSync(`${d}/A-prompt.txt`, [STYLE_EN, base, `CORRECTIONS — these override anything above:\n${fixes}`].join('\n\n'));
    pair = pair ?? (j.group === 'new' ? NEW_SPECS[j.id].pair : AUDIT_FIXES.find((f) => f.id === j.id)?.pair);
    if (pair) writeFileSync(`${d}/B-prompt.txt`, pairText(female, pair.change, 'natija-A — the finished illustration you generated in step A'));
    what = pair ? 'A va B' : 'A';
  } else if (j.bFrom === 'current' && j.b) {
    if (!ill) throw new Error(`ilovada rasm yo‘q: ${j.id}`);
    copyFileSync(file(ill.src), `${d}/1-hozirgi.webp`);
    writeFileSync(`${d}/B-prompt.txt`, pairText(female, j.b.change, 'the finished illustration 1-hozirgi.webp'));
    what = `faqat B: ${j.b.phaseUz.toLowerCase()}`;
  }
  const main = j.aFromB || j.a ? { phaseUz: ill?.phase ?? NEW_SPECS[j.id]?.phaseUz } : undefined;
  writeFileSync(`${d}/job.json`, JSON.stringify({ id: j.id, group: j.group === 'new' && !ill ? 'new' : 'old', main, pair: pair && pair.change !== undefined ? { phaseUz: pair.phaseUz } : undefined }, null, 1));
  md.push(`${n}. \`${j.id}\` — ${j.problem} (${what})`);
}
writeFileSync(`${out}/ROYXAT.md`, md.join('\n') + '\n');
console.log(`tayyor: ${out} (${FLOW7.length} ish)`);
