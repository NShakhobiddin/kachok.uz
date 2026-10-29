// Ikki kadrli harakat: asosiy rasmni tahrirlab, harakatning ikkinchi chetini yaratish (o'sha odam, kamera, jihoz, uslub).
// Ishlatish: GEMINI_API_KEY=... node scripts/images/alt.mjs <alt.json> <poza-papka> [--only id1,id2] [--n 2] [--tag a]
// alt.json: npx vite-node scripts/images/alt-export.ts (ALT tavsiflari); natija — scripts/images/out/<id>-<tag>-<n>.png
import { existsSync, readFileSync, writeFileSync } from 'node:fs';

const KEY = process.env.GEMINI_API_KEY;
if (!KEY) throw new Error('GEMINI_API_KEY yo‘q');
const [, , altFile, poseDir] = process.argv;
const arg = (n, d) => {
  const i = process.argv.indexOf(`--${n}`);
  return i < 0 ? d : process.argv[i + 1];
};
const only = arg('only', '') ? arg('only').split(',') : null;
const N = Number(arg('n', 2));
const TAG = arg('tag', 'a');
const MODEL = process.env.IMAGE_MODEL ?? 'gemini-3.1-flash-image';
const CONC = Number(arg('conc', 3));
const { alt, textOnly } = JSON.parse(readFileSync(altFile, 'utf8'));
const img = (p) => ({ inlineData: { mimeType: p.endsWith('.webp') ? 'image/webp' : 'image/png', data: readFileSync(p).toString('base64') } });

async function call(body, tries = 8) {
  for (let t = 0; ; t++) {
    const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`, { method: 'POST', headers: { 'x-goog-api-key': KEY, 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    if (r.ok) return r.json();
    const text = await r.text();
    if ((r.status === 429 || r.status >= 500) && t < tries) {
      await new Promise((ok) => setTimeout(ok, Math.min(60000, 3000 * 2 ** t)));
      continue;
    }
    throw new Error(`${r.status}: ${text.slice(0, 300)}`);
  }
}

const ids = Object.keys(alt).filter((id) => !only || only.includes(id));
let next = 0;
async function worker() {
  while (next < ids.length) {
    const id = ids[next++];
    const base = existsSync(`public/illustrations/${id}.webp`) ? `public/illustrations/${id}.webp` : `public/illustrations/${id}-bottom.webp`;
    const pose = !textOnly.includes(id) && existsSync(`${poseDir}/${id}.png`) ? `${poseDir}/${id}.png` : null;
    const text = [
      'Image 1 is a finished illustration. Create the SAME scene at the other end of the movement. The camera must NOT move: identical viewpoint, angle, lens and zoom, so the equipment and the floor appear in exactly the same place and size as in image 1. Keep exactly the same athlete (same écorché anatomical render style, same body proportions, same shorts and shoes), the same camera angle and framing, the same equipment in the same place, the same black background and lighting, and the same muscles glowing lime-green with the same intensity.',
      pose ? 'Image 2 is a simple pose guide from a fitness app: copy its joint angles and limb positions, but NOT its flat drawing style, colors or camera.' : '',
      `Change ONLY the body pose (and whatever the athlete holds moves with the hands) to: ${alt[id]}.`,
      'Absolutely no text, letters, numbers, labels, arrows, logos or watermarks. No extra limbs or fingers. Square 1:1.',
    ]
      .filter(Boolean)
      .join('\n\n');
    const parts = [img(base), ...(pose ? [img(pose)] : []), { text }];
    try {
      let n = 0;
      for (let i = 0; i < N; i++) {
        const r = await call({ contents: [{ parts }], generationConfig: { responseModalities: ['TEXT', 'IMAGE'], imageConfig: { aspectRatio: '1:1' } } });
        const part = r.candidates?.[0]?.content?.parts?.find((p) => p.inlineData);
        if (part) writeFileSync(`scripts/images/out/${id}-${TAG}-${++n}.png`, Buffer.from(part.inlineData.data, 'base64'));
      }
      console.log(`+ ${id}: ${n}`);
    } catch (e) {
      console.error(`! ${id}: ${e.message}`);
    }
  }
}
await Promise.all(Array.from({ length: CONC }, worker));
console.log('Tayyor');
