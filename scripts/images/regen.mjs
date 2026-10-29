// Tekshiruvda xato chiqqan rasmlarni qayta yaratish (docs/image-regen.md): regen.json dagi ishlar.
//   edit — mavjud rasmni tahrirlash (faqat ko'rsatilgan narsa o'zgaradi);
//   new  — uslub namunasi bilan yangidan (prompts.json dagi tavsif + tuzatishlar);
//   pair — asosiy kadrdan harakatning ikkinchi cheti (o'sha kamera, odam, jihoz).
// Ishlatish: GEMINI_API_KEY=... node scripts/images/regen.mjs [--stage main|pair] [--only id1,id2] [--n 2] [--conc 3]
//   pair ishlarida base: "NEW_MAIN" — out/regen/picks.json dagi tanlangan yangi asosiy kadr ({ "<id>": "<fayl>" }).
// Flow uchun qo'lda: node scripts/images/regen.mjs --export <papka> — har ish uchun rasm(lar) va prompt.txt.
import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';

const arg = (n, d) => {
  const i = process.argv.indexOf(`--${n}`);
  return i < 0 ? d : process.argv[i + 1];
};
const DIR = 'scripts/images';
const OUT = `${DIR}/out/regen`;
mkdirSync(OUT, { recursive: true });
const { jobs } = JSON.parse(readFileSync(`${DIR}/regen.json`, 'utf8'));
const prompts = Object.fromEntries(JSON.parse(readFileSync(`${DIR}/prompts.json`, 'utf8')).map((p) => [p.id, p.prompt]));
const picks = existsSync(`${OUT}/picks.json`) ? JSON.parse(readFileSync(`${OUT}/picks.json`, 'utf8')) : {};
// uslub namunasi: tekshiruvdan toza o'tgan rasm
const STYLE = 'public/illustrations/bench-press.webp';

const NO_TEXT = 'Absolutely no text, letters, numbers, labels, arrows, logos or watermarks. No extra limbs or fingers, no floating or disconnected equipment. Square 1:1.';
const KEEP =
  'Keep EVERYTHING else identical: the same camera viewpoint, angle, lens and zoom (the equipment and the floor stay in exactly the same place and size), the same athlete (écorché anatomical render style — skin removed, deep-red striated muscles, white tendons — same body proportions, same dark grey shorts and black shoes), the same equipment, the same charcoal-black background and lighting, and the same lime-green muscle glow.';

function textFor(j) {
  if (j.mode === 'edit') return [`Image 1 is a finished illustration. Edit it. Change ONLY ${j.change}.`, j.ref2 ? 'Image 2 is a reference for that detail only.' : '', KEEP, NO_TEXT].filter(Boolean).join('\n\n');
  if (j.mode === 'pair')
    return ['Image 1 is a finished illustration. Create the SAME scene at the other end of the movement. The camera must NOT move.', KEEP, `Change ONLY the body pose (and whatever the athlete holds or pushes moves with the body) to: ${j.change}.`, NO_TEXT].join('\n\n');
  return [
    'The attached image is ONLY a style reference: match its rendering style (écorché anatomical render), lighting, charcoal-black background, lime-green muscle glow and level of detail exactly, but do NOT copy its pose, exercise or equipment.',
    prompts[j.id],
    `CORRECTIONS — these override anything above:\n${j.change}`,
  ].join('\n\n');
}

const baseOf = (j) => (j.mode === 'new' ? STYLE : j.base === 'NEW_MAIN' ? picks[j.id] : j.base);
const key = (j, i) => `${j.id}-${j.frame}-${i}`;

// ---- Flow uchun eksport ----
const exp = arg('export', null);
if (exp) {
  const md = ['# Qayta yaratish ishlari', ''];
  jobs.forEach((j, i) => {
    const d = `${exp}/${String(i + 1).padStart(2, '0')}_${j.id}_${j.frame === 'main' ? 'asosiy' : 'ikkinchi'}`;
    mkdirSync(d, { recursive: true });
    const base = baseOf(j);
    const refs = [];
    if (base) {
      copyFileSync(base, `${d}/1-rasm.${base.split('.').pop()}`);
      refs.push('1-rasm');
    } else refs.push(`1-rasm: ${j.id} uchun tanlangan YANGI asosiy kadr`);
    if (j.ref2) {
      copyFileSync(j.ref2, `${d}/2-rasm.${j.ref2.split('.').pop()}`);
      refs.push('2-rasm');
    }
    writeFileSync(`${d}/prompt.txt`, textFor(j));
    md.push(`${i + 1}. ${j.id} — ${j.frame === 'main' ? 'asosiy kadr' : 'ikkinchi kadr'} (${j.phaseUz}); rasmlar: ${refs.join(', ')}`);
  });
  writeFileSync(`${exp}/ROYXAT.md`, md.join('\n') + '\n');
  console.log(`${jobs.length} ta ish → ${exp}`);
  process.exit(0);
}

// ---- Gemini API ----
const KEY = process.env.GEMINI_API_KEY;
if (!KEY) throw new Error('GEMINI_API_KEY yo‘q');
const STAGE = arg('stage', null);
const only = arg('only', '') ? arg('only').split(',') : null;
const N = Number(arg('n', 2));
const CONC = Number(arg('conc', 3));
const img = (p) => ({ inlineData: { mimeType: p.endsWith('.webp') ? 'image/webp' : p.endsWith('.jpg') ? 'image/jpeg' : 'image/png', data: readFileSync(p).toString('base64') } });

async function call(model, body, tries = 8) {
  for (let t = 0; ; t++) {
    const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, { method: 'POST', headers: { 'x-goog-api-key': KEY, 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    if (r.ok) return r.json();
    const text = await r.text();
    if ((r.status === 429 || r.status >= 500) && t < tries) {
      await new Promise((ok) => setTimeout(ok, Math.min(60000, 3000 * 2 ** t)));
      continue;
    }
    throw new Error(`${r.status}: ${text.slice(0, 300)}`);
  }
}

const todo = jobs.map((j, i) => [j, i]).filter(([j]) => (!STAGE || (STAGE === 'main' ? j.frame === 'main' : j.frame === 'pair')) && (!only || only.includes(j.id)));
let next = 0;
async function worker() {
  while (next < todo.length) {
    const [j, i] = todo[next++];
    const base = baseOf(j);
    if (!base) {
      console.log(`- ${key(j, i)}: yangi asosiy kadr hali tanlanmagan`);
      continue;
    }
    const parts = [img(base), ...(j.ref2 ? [img(j.ref2)] : []), { text: textFor(j) }];
    const model = j.model ?? process.env.IMAGE_MODEL ?? (j.mode === 'new' ? 'gemini-3-pro-image' : 'gemini-3.1-flash-image');
    try {
      let n = 0;
      for (let k = 0; k < N; k++) {
        const r = await call(model, { contents: [{ parts }], generationConfig: { responseModalities: ['TEXT', 'IMAGE'], imageConfig: { aspectRatio: '1:1' } } });
        const part = r.candidates?.[0]?.content?.parts?.find((p) => p.inlineData);
        if (part) writeFileSync(`${OUT}/${key(j, i)}-${++n}.png`, Buffer.from(part.inlineData.data, 'base64'));
      }
      console.log(`+ ${key(j, i)}: ${n}`);
    } catch (e) {
      console.error(`! ${key(j, i)}: ${e.message}`);
    }
  }
}
await Promise.all(Array.from({ length: CONC }, worker));
console.log('Tayyor');
