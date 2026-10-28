// Har bir mashq uchun poza namunasi (ilova animatsiyasining kerakli kadri) — dev server ishlab turganda.
// Ishlatish: node scripts/images/poses.mjs <chiqish-papka> [id1,id2]
import { createRequire } from 'node:module';
import { readFileSync } from 'node:fs';
const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const [, , outDir, onlyArg] = process.argv;
const only = onlyArg ? onlyArg.split(',') : null;
const BASE = process.env.BASE ?? 'http://localhost:5173';
const jobs = JSON.parse(readFileSync('scripts/images/prompts.json', 'utf8')).filter((j) => j.kind === 'exercise' && (!only || only.includes(j.id)));
const phaseOf = (prompt) => prompt.match(/captured at (.+?)\. Camera/)?.[1] ?? '';

// spec'dagi holat matni bo'yicha kadr: boshlanish, pastki (tushish tugashi), yuqori (ko'tarilish tugashi) yoki o'rta
function pickTime(frames, phase) {
  const end = (ph) => {
    const i = frames.findIndex((f, k) => k > 0 && frames[k - 1].phase === ph);
    return i > 0 ? frames[i].t : null;
  };
  const mid = (ph) => {
    const i = frames.findIndex((f) => f.phase === ph);
    return i >= 0 && frames[i + 1] ? (frames[i].t + frames[i + 1].t) / 2 : null;
  };
  if (/start|hold/.test(phase)) return 0;
  if (/halfway|midway/.test(phase)) return mid('up') ?? 0;
  if (/top|contracted|squeeze|lockout|end position|drive/.test(phase)) return frames.find((f) => f.phase === 'squeeze')?.t ?? end('up') ?? 0;
  return end('down') ?? 0; // bottom, lowered, stretched, crunched, extended
}

const b = await chromium.launch();
const page = await b.newPage({ viewport: { width: 640, height: 640 } });
await page.goto(`${BASE}/scripts/images/pose.html`);
await page.waitForSelector('#ready');
for (const j of jobs) {
  const frames = await page.evaluate((id) => window.__frames(id), j.id);
  // qisqarish 'pastda' bo'ladigan mashqlar (pastga bosish) — kerakli kadr 'squeeze'
  const OVERRIDE = { pushdown: 'squeeze' };
  const t = OVERRIDE[j.id] ? frames.find((f) => f.phase === OVERRIDE[j.id]).t : pickTime(frames, phaseOf(j.prompt));
  await page.goto(`${BASE}/scripts/images/pose.html?id=${j.id}&t=${Math.round(t)}`);
  await page.waitForSelector('#pose svg');
  await page.waitForTimeout(150);
  await page.locator('#pose').screenshot({ path: `${outDir}/${j.id}.png` });
  console.log(j.id, phaseOf(j.prompt), '→', Math.round(t), 'ms', frames.map((f) => f.phase).join(','));
}
await b.close();
