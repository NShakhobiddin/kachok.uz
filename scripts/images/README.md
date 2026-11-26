# Mashq va jihoz rasmlari

Rasmlar AI bilan yaratiladi, ichida matn bo'lmaydi: mushak foizlari (EMG) va texnika maslahatlari ilovada rasm ostida yoki ustida ko'rsatiladi (`src/data/illustrations.ts`).

1. Promptlar: `npx vite-node scripts/images/prompts.ts`
   - texnika tavsiflari — `specs.ts` (har mashq uchun bitta, eng ko'p o'rgatadigan holat);
   - mushaklar yorqinligi — ilovadagi EMG jadvalidan (`activationFor`), shuning uchun foizlar bilan mos;
   - natija: `prompts.json` (skript uchun) va `docs/image-prompts.md` (qo'lda ishlatish uchun).
2. Poza namunalari (dev server ishlab turganda): `node scripts/images/poses.mjs <papka>` — ilova animatsiyasining kerakli kadri.
   Model aynan shu pozani chizadi; namunasiz modellar ko'pincha noto'g'ri holatni (masalan, turnikda yerda turgan odam) chizadi.
   Trenajyor namunada chizilmagan mashqlar uchun namuna o'chiriladi — ular matn bo'yicha yaratiladi.
3. Generatsiya: muhitda `GEMINI_API_KEY` bo'lsa —
   `IMAGE_MODEL=gemini-3.1-flash-image node scripts/images/generate.mjs --kind exercise --pose <papka> --n 2 --tag v`
   (jihozlar: `--kind equipment`); qiyin holatlar uchun `IMAGE_MODEL=gemini-3-pro-image`. Natija — `scripts/images/out/` (gitga kirmaydi).
4. Tekshirish: har bir variant texnika (shtanga joyi, qo'llar, tizza, bel, holat) bo'yicha ko'zdan kechiriladi; xatosi bor bo'lsa — qayta yaratiladi.
5. Joylash: `python3 scripts/images/place.py picks.json` — webp (1024 px), ro'yxatlar uchun kichik rasm (192 px), jihozlar (512 px) va ma'lumot fayllari.

## Taom rasmlari (Ovqat → Taomlar va Retseptlar)

1. Promptlar: `npx vite-node scripts/images/food-pack.ts -- <papka>` — 51 ta milliy taom va 34 ta retsept (`foodSpecs.ts`), ilova dizayniga mos (qora fon, lime aksent).
2. Flow’da har papkaga `natija.png` saqlanadi.
3. Joylash: `python3 -I scripts/images/place_food.py <papka>` — `public/food/<id>.webp` (512 px) va `src/data/foodImages.ts` ro‘yxati. Rasmi yo‘q taomda belgi (emoji) ko‘rinadi.
