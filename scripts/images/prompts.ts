// Barcha rasm promptlarini yig'ish: mashqlar (EMG bo'yicha mushak yorqinligi bilan) va zal jihozlari.
// Ishlatish: npx vite-node scripts/images/prompts.ts → scripts/images/prompts.json va docs/image-prompts.md
import { writeFileSync } from 'node:fs';
import { EQUIPMENT } from '../../src/data/catalog';
import { EXERCISES } from '../../src/data/exercises';
import { activationFor } from '../../src/engine/activation';
import { EQUIPMENT_SPECS, EXERCISE_SPECS, M3_EN } from './specs';

export interface PromptJob {
  id: string;
  kind: 'exercise' | 'equipment';
  /** public/ ichidagi yo'l (webp) */
  file: string;
  title: string;
  /** ilovadagi holat yozuvi (mashqlar uchun) */
  phase?: string;
  prompt: string;
}

const NO_TEXT = 'Absolutely no text, letters, numbers, labels, arrows, logos, watermarks or UI.';

function exercisePrompt(id: string): string | null {
  const ex = EXERCISES.find((e) => e.id === id)!;
  const s = EXERCISE_SPECS[id];
  if (!s) return null;
  const list = activationFor(ex).list;
  const max = Math.max(...list.map((a) => a.mvic));
  const tier = (lo: number, hi: number) =>
    list
      .filter((a) => a.mvic >= lo * max && a.mvic < hi * max && a.mvic >= 12)
      .map((a) => M3_EN[a.key])
      .join(', ');
  const top = tier(0.8, 9);
  const mid = tier(0.45, 0.8);
  const low = tier(0.2, 0.45);
  return [
    `Photorealistic anatomical render of a muscular male athlete performing the ${ex.en.toLowerCase()}, captured at ${s.phase}. Camera: ${s.camera}.`,
    '',
    'Body: écorché style — skin removed, realistic deep-red striated muscle fibers, pearly white tendons, anatomically accurate muscle shapes. Plain opaque dark grey compression shorts fully covering the hips. Black flat-soled training shoes.',
    '',
    'Correct technique (must be exact):',
    ...s.technique.map((t) => `- ${t}`),
    '',
    'Muscle activation shown as a neon lime-green glow (#D4FA50) from within the muscles, brightness proportional to effort:',
    `- brightest (100%): ${top};`,
    ...(mid ? [`- clearly dimmer, about half as bright: ${mid};`] : []),
    ...(low ? [`- very faint: ${low};`] : []),
    '- all other muscles: no glow, natural deep red.',
    '',
    `Equipment: ${s.equipment}`,
    'Scene: pure charcoal-black background (#0B0B0C), soft top-left key light, subtle lime-green rim light from behind, soft contact shadow, no floor texture.',
    'Composition: square 1:1, the whole figure and equipment fully visible with generous empty margins on the left and right, centered.',
    '',
    `${NO_TEXT} No extra limbs or fingers, no floating or disconnected equipment.`,
  ].join('\n');
}

const EQUIPMENT_STYLE = `Camera: three-quarter front view from slightly above eye level, turned about 35° to the left, 50mm lens; the whole equipment fully in frame and centered with generous empty margins on all sides.
Materials: matte black powder-coated steel, dark graphite upholstery, brushed-steel details, black rubber; one small neon lime-green (#D4FA50) accent detail.
Scene: seamless charcoal-black background (#0B0B0C), soft top key light, thin lime-green rim light outlining the silhouette, soft contact shadow, no floor texture, no other objects.
Square 1:1, high detail, clean premium look. No people.
${NO_TEXT} Weight plates and weight stacks have no numbers.`;

const jobs: PromptJob[] = [];
for (const ex of EXERCISES) {
  const p = exercisePrompt(ex.id);
  if (!p) throw new Error(`specs.ts: ${ex.id} uchun tavsif yo'q`);
  jobs.push({
    id: ex.id,
    kind: 'exercise',
    file: `illustrations/${ex.id}.webp`,
    title: `${ex.name} (${ex.en}) — ${EXERCISE_SPECS[ex.id].phaseUz.toLowerCase()}`,
    phase: EXERCISE_SPECS[ex.id].phaseUz,
    prompt: p,
  });
}
for (const e of EQUIPMENT_SPECS) {
  const info = EQUIPMENT.find((x) => x.id === e.id)!;
  jobs.push({
    id: e.id,
    kind: 'equipment',
    file: `illustrations/equipment/${e.id}.webp`,
    title: info.name,
    prompt: `Photorealistic studio product render of one piece of commercial gym equipment: ${e.desc}.\n${EQUIPMENT_STYLE}`,
  });
}
if (EQUIPMENT_SPECS.length !== EQUIPMENT.length) throw new Error('specs.ts: jihozlar ro‘yxati catalog bilan mos emas');

writeFileSync('scripts/images/prompts.json', JSON.stringify(jobs, null, 2));

const md: string[] = [
  '# Rasm generatsiyasi uchun promptlar',
  '',
  'Avtomatik yaratilgan: `npx vite-node scripts/images/prompts.ts` (tavsiflar — `scripts/images/specs.ts`, mushak yorqinligi — ilovadagi EMG jadvali).',
  'Rasmlarda matn bo‘lmaydi: nomlar, foizlar va belgilar ilovaning o‘zida ustiga qo‘yiladi.',
  '',
  'Gemini API kaliti bo‘lsa, hammasi bitta buyruq bilan yaratiladi: `node scripts/images/generate.mjs` (README).',
  '',
];
let n = 0;
for (const kind of ['exercise', 'equipment'] as const) {
  md.push(kind === 'exercise' ? '## Mashqlar' : '## Zal jihozlari', '');
  for (const j of jobs.filter((x) => x.kind === kind)) {
    n++;
    md.push(`### ${n}. ${j.title} — \`${j.id}\``, '', '```', j.prompt, '```', '');
  }
}
writeFileSync('docs/image-prompts.md', md.join('\n'));
console.log(`${jobs.length} ta prompt: ${jobs.filter((j) => j.kind === 'exercise').length} mashq, ${jobs.filter((j) => j.kind === 'equipment').length} jihoz`);
