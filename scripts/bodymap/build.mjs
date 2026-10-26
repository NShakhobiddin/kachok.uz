// Tana xaritasi tasvirlari va mushak chegaralarini 3D modeldan yaratish.
// Ishlatish (README.md): dev server ishlab turganda `node scripts/bodymap/build.mjs`
import { mkdirSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const potrace = require('potrace');
const Jimp = require('jimp');

const BASE = process.env.BASE ?? 'http://localhost:5173';
const H = 800; // xarita ko'pi bilan ~260 px balandlikda, 3× ekranlar uchun yetarli
const H_ID = 600;
const DIM = 0.5; // faol bo'lmagan mushaklar biroz xiraroq — lime ajralib tursin
const MIN_PX = 200; // shu ko'rinishda juda kichik ko'ringan guruh (masalan, orqadan ko'krak cheti) xaritaga kirmaydi

const b = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
const page = await b.newPage();
page.on('pageerror', (e) => console.error('PAGEERROR', e.message));
await page.goto(`${BASE}/scripts/bodymap/index.html`);
await page.waitForFunction(() => document.title === 'ready', null, { timeout: 120000 });
const GROUPS = await page.evaluate(() => window.__groups);
const render = (view, mode, h) => page.evaluate(([v, m, hh, d]) => window.__render(v, m, hh, d), [view, mode, h, DIM]);

mkdirSync('public/bodymap', { recursive: true });
const trace = (img) => new Promise((res, rej) => potrace.trace(img, { turdSize: 6, optTolerance: 0.35, alphaMax: 1, threshold: 128, blackOnWhite: true }, (e, svg) => (e ? rej(e) : res(svg))));
const data = {};
for (const view of ['front', 'back']) {
  let size;
  for (const mode of ['base', 'glow']) {
    const r = await render(view, mode, H);
    writeFileSync(`public/bodymap/${view}-${mode}.webp`, Buffer.from(r.url.split(',')[1], 'base64'));
    size = r;
  }
  // ID niqobi: R kanalida guruh raqami ×10 → har guruh uchun potrace bilan SVG yo'l, base o'lchamiga moslab
  const idr = await render(view, 'id', H_ID);
  const src = await Jimp.read(Buffer.from(idr.url.split(',')[1], 'base64'));
  const { width: w, height: h } = src.bitmap;
  const sx = size.W / w;
  const sy = size.H / h;
  const paths = {};
  const counts = [];
  for (let k = 0; k < GROUPS.length; k++) {
    const val = (k + 1) * 10;
    const m = new Jimp(w, h, 0xffffffff);
    let n = 0;
    src.scan(0, 0, w, h, (x, y, i) => {
      if (src.bitmap.data[i + 3] > 0 && Math.abs(src.bitmap.data[i] - val) <= 2) {
        m.bitmap.data[i] = m.bitmap.data[i + 1] = m.bitmap.data[i + 2] = 0;
        n++;
      }
    });
    counts.push(`${GROUPS[k]}:${n}`);
    if (n < MIN_PX) continue;
    const d = (await trace(m)).match(/ d="([^"]+)"/)?.[1];
    if (!d) continue;
    let j = 0;
    // potrace faqat absolyut M/L/C buyruqlari: sonlar navbatma-navbat x, y
    paths[GROUPS[k]] = d.replace(/-?\d+(\.\d+)?/g, (num) => String(Math.round(Number(num) * (j++ % 2 === 0 ? sx : sy) * 10) / 10)).replace(/\s+/g, ' ').trim();
  }
  data[view] = { w: size.W, h: size.H, paths };
  console.log(view, `${size.W}×${size.H}`, counts.join(' '));
}
await b.close();

const ts = `// Avtomatik yaratilgan: scripts/bodymap/build.mjs — qo'lda tahrirlamang.
// Tana xaritasidagi mushak guruhlari chegaralari (3D modelning ID renderidan, potrace), public/bodymap/*.webp bilan bir xil o'lchamda.
import type { MuscleId } from '../types';

export interface BodyMapView {
  w: number;
  h: number;
  paths: Partial<Record<MuscleId, string>>;
}

export const BODYMAP: Record<'front' | 'back', BodyMapView> = ${JSON.stringify(data, null, 2)};
`;
writeFileSync('src/data/bodymap.ts', ts);
console.log('src/data/bodymap.ts', ts.length, 'bayt');
