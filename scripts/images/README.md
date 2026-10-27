# Mashq va jihoz rasmlari

Rasmlar AI bilan yaratiladi, ichida matn bo'lmaydi: mushak nomlari, EMG foizlari va texnika belgilari ilovada ustiga qo'yiladi (`src/data/illustrations.ts`).

1. Promptlar: `npx vite-node scripts/images/prompts.ts`
   - texnika tavsiflari — `specs.ts` (har mashq uchun bitta, eng ko'p o'rgatadigan holat);
   - mushaklar yorqinligi — ilovadagi EMG jadvalidan (`activationFor`), shuning uchun foizlar bilan mos;
   - natija: `prompts.json` (skript uchun) va `docs/image-prompts.md` (qo'lda, masalan Flow'da ishlatish uchun).
2. Generatsiya: muhitda `GEMINI_API_KEY` bo'lsa — `node scripts/images/generate.mjs` (har ish uchun 2 ta variant, `scripts/images/out/`).
   Faqat bir qismi: `--only bench-press,deadlift` yoki `--kind equipment`; qayta yaratish: `--force`; model: `IMAGE_MODEL=...`.
3. Tekshirish: har bir variant texnika (shtanga joyi, qo'llar, tizza, bel) va mushak yorqinligi bo'yicha ko'zdan kechiriladi; xatosi bor bo'lsa — qayta yaratiladi.
4. Joylash: tanlangan rasm `public/illustrations/<id>.webp` (mashq, 1200 px) yoki `public/illustrations/equipment/<id>.webp` (jihoz, 512 px);
   mashq uchun `src/data/illustrations.ts` ga yorliq koordinatalari, jihoz uchun `src/data/equipmentImages.ts` ga id qo'shiladi.
