# Tana xaritasi tasvirlarini yaratish

Tana xaritasi (`src/components/BodyMap.tsx`) qo'lda chizilmagan: u ilovadagi 3D mushak modelidan (`public/models/muscles-v2.glb`) render qilinadi,
shuning uchun 3D ko'rinish bilan bir xil va mushaklar aniq joyida.

Har bir ko'rinish (old/orqa) uchun:

- `public/bodymap/<view>-base.webp` — tinch tana (Muscle3D bilan bir xil material va yorug'lik);
- `public/bodymap/<view>-glow.webp` — xaritadagi barcha mushaklar lime rangda; ilova uni faol mushak chegarasi bo'yicha kesib ko'rsatadi;
- `src/data/bodymap.ts` — har bir mushak guruhining SVG chegarasi (guruhlar rangli ID renderidan potrace bilan).

Qayta yaratish (model yoki material o'zgarganda):

1. `npm i --no-save potrace@2.1.8`
2. `npx vite --port 5173` (dev server; render sahifasi — `scripts/bodymap/index.html`)
3. `node scripts/bodymap/build.mjs`
