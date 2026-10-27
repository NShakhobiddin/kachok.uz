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
const force = process.argv.includes('--force');
const OUT = 'scripts/images/out';
mkdirSync(OUT, { recursive: true });

const call = async (path, body, tries = 5) => {
  for (let t = 0; ; t++) {
    const r = await fetch(`${API}/${path}`, { method: body ? 'POST' : 'GET', headers: { 'x-goog-api-key': KEY, 'Content-Type': 'application/json' }, body: body && JSON.stringify(body) });
    if (r.ok) return r.json();
    const text = await r.text();
    if ((r.status === 429 || r.status >= 500) && t < tries) {
      const wait = 2000 * 2 ** t;
      console.warn(`  ${r.status}, ${wait / 1000} s kutamiz…`);
      await new Promise((ok) => setTimeout(ok, wait));
      continue;
    }
    throw new Error(`${r.status}: ${text.slice(0, 400)}`);
  }
};

// mavjud modellardan eng yaxshisini tanlash (yoki IMAGE_MODEL bilan aniq ko'rsatish)
const models = (await call('models?pageSize=200')).models.map((m) => m.name.replace('models/', ''));
const PREF = [process.env.IMAGE_MODEL, 'imagen-4.0-ultra-generate-001', 'imagen-4.0-generate-001', 'imagen-3.0-generate-002', 'gemini-2.5-flash-image', 'gemini-2.5-flash-image-preview'].filter(
  Boolean,
);
const model = PREF.find((m) => models.includes(m));
if (!model) {
  console.error('Rasm modeli topilmadi. Mavjud modellar:', models.filter((m) => /imag/.test(m)).join(', ') || '—');
  process.exit(1);
}
console.log('Model:', model);

async function generate(prompt, n) {
  if (model.startsWith('imagen')) {
    const r = await call(`models/${model}:predict`, { instances: [{ prompt }], parameters: { sampleCount: n, aspectRatio: '1:1', personGeneration: 'allow_adult' } });
    return (r.predictions ?? []).map((p) => p.bytesBase64Encoded).filter(Boolean);
  }
  const out = [];
  for (let i = 0; i < n; i++) {
    const r = await call(`models/${model}:generateContent`, { contents: [{ parts: [{ text: prompt }] }], generationConfig: { responseModalities: ['IMAGE'], imageConfig: { aspectRatio: '1:1' } } });
    const part = r.candidates?.[0]?.content?.parts?.find((p) => p.inlineData);
    if (part) out.push(part.inlineData.data);
  }
  return out;
}

const jobs = JSON.parse(readFileSync('scripts/images/prompts.json', 'utf8')).filter((j) => (!only || only.includes(j.id)) && (!kind || j.kind === kind));
let done = 0;
for (const j of jobs) {
  const first = `${OUT}/${j.id}-1.png`;
  if (existsSync(first) && !force) {
    console.log(`= ${j.id} (bor)`);
    continue;
  }
  try {
    const imgs = await generate(j.prompt, N);
    imgs.forEach((b64, i) => writeFileSync(`${OUT}/${j.id}-${i + 1}.png`, Buffer.from(b64, 'base64')));
    console.log(`+ ${j.id}: ${imgs.length} ta variant`);
    done++;
  } catch (e) {
    console.error(`! ${j.id}: ${e.message}`);
  }
}
console.log(`Tayyor: ${done} ta ish, natija — ${OUT}/`);
