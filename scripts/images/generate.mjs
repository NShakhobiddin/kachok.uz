// Barcha rasmlarni Gemini API (Imagen yoki Gemini image) bilan yaratish: prompts.json dagi har bir ish uchun bir nechta variant.
// Ishlatish: GEMINI_API_KEY muhitda bo'lsa — node scripts/images/generate.mjs [--only id1,id2] [--kind exercise|equipment] [--n 2] [--force]
// Variantlar scripts/images/out/ ga tushadi; eng to'g'risi tekshirilib public/illustrations/ ga webp qilib qo'yiladi (README).
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';

const KEY = process.env.GEMINI_API_KEY;
if (!KEY) {
  console.error('GEMINI_API_KEY topilmadi: uni muhit sozlamalariga qo‘shing (README).');
  process.exit(1);
}
const API = 'https://generativelanguage.googleapis.com/v1beta';
const arg = (name, def) => {
  const i = process.argv.indexOf(`--${name}`);
  return i < 0 ? def : (process.argv[i + 1] ?? true);
};
const only = arg('only', '') ? String(arg('only')).split(',') : null;
const kind = arg('kind', null);
const N = Number(arg('n', 2));
const TAG = arg('tag', null); // boshqa model bilan qayta urinish natijalari alohida nomlanadi: <id>-<tag>-<n>.png
const SKIP = String(arg('skip', '')).split(',').filter(Boolean);
const CONC = Number(arg('conc', 3));
// poza namunasi: ilova animatsiyasining kerakli kadri (poses.mjs) — model aynan shu pozani va kamera burchagini chizadi
const POSE = arg('pose', null);
const POSE_TEXT =
  'The attached image is a POSE AND CAMERA GUIDE — a simple flat diagram from a fitness app showing the correct technique. Reproduce EXACTLY its body position, joint angles, limb placement, contact points with the equipment and its viewpoint. Ignore its flat drawing style and colors (a red circle there is just a weight plate). Render the scene as described below.';
const force = process.argv.includes('--force');
// uslub namunasi (masalan, tasdiqlangan rasm): faqat Gemini image modellarida — rasmlar bir oila bo'lib chiqadi
const ref = arg('ref', null);
const refPart = ref ? { inlineData: { mimeType: ref.endsWith('.webp') ? 'image/webp' : ref.endsWith('.png') ? 'image/png' : 'image/jpeg', data: readFileSync(ref).toString('base64') } } : null;
const OUT = 'scripts/images/out';
mkdirSync(OUT, { recursive: true });

const call = async (path, body, tries = 8) => {
  for (let t = 0; ; t++) {
    const r = await fetch(`${API}/${path}`, { method: body ? 'POST' : 'GET', headers: { 'x-goog-api-key': KEY, 'Content-Type': 'application/json' }, body: body && JSON.stringify(body) });
    if (r.ok) return r.json();
    const text = await r.text();
    if ((r.status === 429 || r.status >= 500) && t < tries) {
      const wait = Math.min(60000, 3000 * 2 ** t);
      console.warn(`  ${r.status}, ${wait / 1000} s kutamiz…`);
      await new Promise((ok) => setTimeout(ok, wait));
      continue;
    }
    throw new Error(`${r.status}: ${text.slice(0, 400)}`);
  }
};

// mavjud modellardan eng yaxshisini tanlash (yoki IMAGE_MODEL bilan aniq ko'rsatish)
const models = (await call('models?pageSize=200')).models.map((m) => m.name.replace('models/', ''));
const PREF = [
  process.env.IMAGE_MODEL,
  'gemini-3-pro-image',
  'gemini-3-pro-image-preview',
  'imagen-4.0-ultra-generate-001',
  'imagen-4.0-generate-001',
  'gemini-3.1-flash-image',
  'gemini-2.5-flash-image',
].filter(Boolean);
const model = PREF.find((m) => models.includes(m));
if (!model) {
  console.error('Rasm modeli topilmadi. Mavjud modellar:', models.filter((m) => /imag/.test(m)).join(', ') || '—');
  process.exit(1);
}
console.log('Model:', model);

async function generate(prompt, n, id) {
  const poseFile = POSE && existsSync(`${POSE}/${id}.png`) ? `${POSE}/${id}.png` : null;
  if (model.startsWith('imagen')) {
    const r = await call(`models/${model}:predict`, { instances: [{ prompt }], parameters: { sampleCount: n, aspectRatio: '1:1', personGeneration: 'allow_adult' } });
    return (r.predictions ?? []).map((p) => p.bytesBase64Encoded).filter(Boolean);
  }
  const out = [];
  for (let i = 0; i < n; i++) {
    let text = prompt;
    const parts = [];
    if (poseFile) {
      parts.push({ inlineData: { mimeType: 'image/png', data: readFileSync(poseFile).toString('base64') } });
      text = `${POSE_TEXT}\n\n${prompt.replace(/ Camera: [^\n]*/, ' Camera: the same viewpoint as the guide image, 50mm lens.')}`;
    } else if (refPart) {
      parts.push(refPart);
      text = `The attached image is ONLY a style reference: match its rendering style, lighting, black background, lime glow and level of detail exactly, but do NOT copy its pose, exercise or equipment.\n\n${prompt}`;
    }
    parts.push({ text });
    const r = await call(`models/${model}:generateContent`, { contents: [{ parts }], generationConfig: { responseModalities: ['TEXT', 'IMAGE'], imageConfig: { aspectRatio: '1:1' } } });
    const part = r.candidates?.[0]?.content?.parts?.find((p) => p.inlineData);
    if (part) out.push(part.inlineData.data);
  }
  return out;
}

const jobs = JSON.parse(readFileSync('scripts/images/prompts.json', 'utf8')).filter((j) => (!only || only.includes(j.id)) && (!kind || j.kind === kind) && !SKIP.includes(j.id));
const name = (id, n) => `${OUT}/${id}-${TAG ? `${TAG}-` : ''}${n}.png`;
let done = 0;
let next = 0;
// bir vaqtda bir nechta so'rov (CONC), har biri o'z navbatida
async function worker() {
  while (next < jobs.length) {
    const j = jobs[next++];
    if (existsSync(name(j.id, 1)) && !force) {
      console.log(`= ${j.id} (bor)`);
      continue;
    }
    try {
      const imgs = await generate(j.prompt, N, j.id);
      imgs.forEach((b64, i) => writeFileSync(name(j.id, i + 1), Buffer.from(b64, 'base64')));
      console.log(`+ ${j.id}: ${imgs.length} ta variant`);
      done++;
    } catch (e) {
      console.error(`! ${j.id}: ${e.message}`);
    }
  }
}
await Promise.all(Array.from({ length: CONC }, worker));
console.log(`Tayyor: ${done} ta ish, natija — ${OUT}/`);
