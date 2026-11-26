// Taom rasmlari uchun Flow to‘plami: har taom va retsept uchun bitta prompt (ilova dizayniga mos — qora fon, lime aksent).
// Ishlatish: npx vite-node scripts/images/food-pack.ts -- <chiqish>
// Natija: har papkaga natija.png → python3 scripts/images/place_food.py <papka> (public/food/<id>.webp va ro‘yxat)
import { mkdirSync, writeFileSync } from 'node:fs';
import { DISHES } from '../../src/data/dishes';
import { FOOD_MAP } from '../../src/data/foods';
import { RECIPES } from '../../src/data/recipes';
import { DISH_SHOTS, RECIPE_SHOTS, type FoodShot } from './foodSpecs';

const [out] = process.argv.slice(2).filter((a) => a !== '--');
if (!out) throw new Error('chiqish papkasi kerak');

const prompt = (s: FoodShot) =>
  [
    `Photorealistic professional food photograph of ${s.dish}.`,
    `Serving: ${s.serve}.`,
    'Camera: 45° angle from above, 50mm lens, shallow depth of field; the dish centered and filling about 70% of the square frame, the whole plate or bowl visible.',
    'Styling: authentic, appetizing, home-style Uzbek presentation; realistic textures and portion size; light natural steam only if the dish is hot.',
    'Scene (matches the app design): deep charcoal-black background (#0B0B0C) and a dark slate table surface, soft warm key light from the top left, a very subtle neon lime-green (#D4FA50) rim light on the edge of the plate, gentle shadows, no clutter.',
    'Square 1:1, high detail. Absolutely no text, letters, numbers, logos, watermarks, hands, people or cutlery other than mentioned.',
  ].join('\n');

const md: string[] = [
  '# GYMbos — taom rasmlari (Flow)',
  '',
  'Har papkadagi **prompt.txt** ni labs.google/flow’ga qo‘ying (Nano Banana Pro yoki Imagen), 2–4 variant yarating.',
  'Eng chiroylisi va haqiqatga yaqinini shu papkaga `natija.png` deb saqlang. Hammasini zip qilib yuboring — ilovaga joylayman.',
  '',
  'Tekshirish: taom o‘ziga o‘xshasin (osh — sabzili guruch, manti — bug‘da pishgan va hokazo), matn va qo‘l bo‘lmasin, fon qora.',
  '',
  '## 1. Milliy taomlar',
  '',
];
let n = 0;
for (const d of DISHES) {
  const s = DISH_SHOTS[d.id];
  if (!s) throw new Error(`foodSpecs: ${d.id} yo‘q`);
  const dir = `${out}/1_taomlar/${String(++n).padStart(2, '0')}_${d.id}`;
  mkdirSync(dir, { recursive: true });
  writeFileSync(`${dir}/prompt.txt`, prompt(s));
  writeFileSync(`${dir}/job.json`, JSON.stringify({ id: d.id }, null, 1));
  md.push(`${n}. \`${d.id}\` — ${FOOD_MAP[d.id].name}`);
}
md.push('', '## 2. Retseptlar', '');
n = 0;
for (const r of RECIPES) {
  const s = RECIPE_SHOTS[r.id];
  if (!s) throw new Error(`foodSpecs: retsept ${r.id} yo‘q`);
  const dir = `${out}/2_retseptlar/${String(++n).padStart(2, '0')}_${r.id}`;
  mkdirSync(dir, { recursive: true });
  writeFileSync(`${dir}/prompt.txt`, prompt(s));
  writeFileSync(`${dir}/job.json`, JSON.stringify({ id: `rcp-${r.id}` }, null, 1));
  md.push(`${n}. \`${r.id}\` — ${r.name}`);
}
writeFileSync(`${out}/ROYXAT.md`, md.join('\n') + '\n');
console.log(`tayyor: ${out} (${DISHES.length} taom, ${RECIPES.length} retsept)`);
