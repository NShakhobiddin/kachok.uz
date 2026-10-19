# Kachok — zal uchun aqlli murabbiy

Telefonda ishlaydigan veb-ilova (PWA): sizga moslangan mashq dasturi, har bir mashqning animatsiyali texnikasi, ilmiy asoslangan ovqatlanish va natijalar statistikasi. Internetsiz ham ishlaydi, telefonga ilova kabi o'rnatiladi. Keyinchalik shu kod asosida App Store / Google Play ilovasi chiqariladi.

## Imkoniyatlar

| Bo'lim | Nima qiladi |
|---|---|
| **Dastur tuzish** | Maqsad (massa, ozish, shakl, kuch, sog'liq), tajriba, haftasiga 2–6 kun, mashg'ulot vaqti (30–90 daq), zaldagi jihozlar va jarohatlarga qarab haftalik reja tuzadi. Har mushak haftasiga 2 marta, 10–20 set oralig'ida avtomatik muvozanatlanadi. |
| **Jihozga moslash** | 24 turdagi jihozdan belgilaysiz (yoki "To'liq zal / Oddiy zal / Uy / O'z vaznim") — faqat bor jihozdagi mashqlar tanlanadi. |
| **63 ta mashq, ~40 animatsiya** | Har bir mashq: qaysi mushak ishlaydi (asosiy — qizil, yordamchi — sariq), bosqichma-bosqich texnika, nafas, maslahatlar. Animatsiyada kuch fazasi va nazoratli faza ko'rsatiladi, sekinlashtirish mumkin. |
| **Xatolardan ogohlantirish** | Har bir mashqda keng tarqalgan xatolar: noto'g'ri va to'g'ri bajarilish yonma-yon animatsiyada, nega xavfli va qanday tuzatish. Jarohatingizga zid mashqlar belgilanadi va dasturga kiritilmaydi. |
| **Tibbiy foyda** | Har bir mashq tanaga qayerda foyda berishi (suyak, yurak, qand, bel, kayfiyat...) tana siluetida animatsiyada ko'rsatiladi — manbasi bilan. |
| **Kunlik tavsiya** | Har set uchun bugungi vazn va takror: "ikki bosqichli progressiya" (avval takror, keyin vazn), sababi bilan ("+2.5 kg: o'tgan safar barcha setlarda 12 takror"). Yengillashtirish (deload) haftasi va kunlik tayyorgarlik so'rovi yuklamani moslaydi. |
| **Mashg'ulot jurnali** | Har bir set vazn × takror bilan saqlanadi (darhol, yo'qolmaydi). O'tgan safargi natija ko'rinadi, ✓ bosilganda dam olish taymeri ishga tushadi (ovoz + tebranish), rekord darhol tabriklanadi, isinish setlari va shtanga disklari kalkulyatori bor. |
| **Statistika** | Haftalik mashq vaqti grafigi va tahlili (JSST me'yori bilan solishtirish), mushak guruhlari bo'yicha hajm, kuch o'sishi (1RM), rekordlar, mushak tiklanish xaritasi, tarix. |
| **Ovqatlanish** | Mifflin–St Jeor + faollik bo'yicha kunlik kaloriya, oqsil/yog'/uglevod, suv, tola; mahalliy mahsulotlardan namunaviy kun; milliy taomlar kaloriyasi va maslahatlar; vazn trendi va kaloriyani avtomatik moslash taklifi; qo'shimchalar dalil darajasi bilan. |
| **Animatsion darsliklar** | 10 ta dars (ozish, massa olish, progressiya va RIR, oqsil, kaloriya va milliy taomlar, xavfsizlik, kuch mashqi — dori, miflar, uyqu, qo'shimchalar) — har birida animatsiyali sahnalar, manbalar va test. |
| **Motivatsiya** | Haftalik seriya (kunlik emas — dam olish kunlari ham mashqning qismi), 19 ta yutuq (disk shaklida), kunlik maqol va ilmiy fakt, qaytish xabari, mashg'ulotdan keyingi xulosa va ulashish. |
| **PDF** | Haftalik dasturni chop etish uchun PDF: har kun jadvali, vazn/takror yoziladigan bo'sh kataklar, haftalik hajm, ovqatlanish rejasi va qoidalar. |
| **Xavfsizlik** | Boshlashdan oldin xalqaro PAR-Q+ sog'liq so'rovnomasi; og'riq qoidasi; jarohatlarga mos mashq tanlash. |

## Ilmiy asos

Har bir raqam xalqaro pozitsiyalar va meta-tahlillardan olingan: ACSM 2026, ISSN (oqsil, parhez, kreatin, kofein), JSST/WHO 2020, EFSA 2010, Schoenfeld, Pelland 2026, Morton 2018, Refalo 2023, Helms, Garthe va boshqalar. To'liq ro'yxat (DOI bilan) ilovada **Profil → Ilmiy manbalar** bo'limida va [`src/data/sources.ts`](src/data/sources.ts) faylida. Raqobatchi ilovalar tahlili: [`docs/RESEARCH.md`](docs/RESEARCH.md).

## Dizayn

Ranglar musobaqa disklari kodidan olingan va ma'no tashiydi: **ko'k** (20 kg) — asosiy harakat, **qizil** (25 kg) — ishlayotgan mushak va ogohlantirish, **sariq** (15 kg) — rekord va yutuq, **yashil** (10 kg) — bajarildi va sog'liq. Imzo elementi — mashg'ulot progressi shtangaga disk taqish ko'rinishida. Shriftlar: Big Shoulders Display (sarlavhalar), Manrope (matn), JetBrains Mono (belgilar). Qorong'i mavzu zal yoritilishi uchun.

## Ishga tushirish

```bash
npm install
npm run dev        # http://localhost:5173
npm test           # dvigatellar testlari (2 700+ profil kombinatsiyasi)
npm run build      # dist/ — istalgan statik hostingga (Vercel, Netlify, Nginx)
```

**GitHub Pages:** `main` ga har push'da ilova avtomatik `https://nshakhobiddin.github.io/kachok.uz/` manziliga joylanadi (`.github/workflows/pages.yml`). Bir martalik sozlash: repo **Settings → Pages → Source: GitHub Actions**.

`vercel.json` va `public/_redirects` SPA marshrutlash uchun tayyor. Ma'lumotlar foydalanuvchi qurilmasida saqlanadi (localStorage); Profil bo'limida JSON zaxira nusxa olish/tiklash bor.

## Texnologiyalar

React 19 · TypeScript · Vite 6 · Zustand (offline holat) · Framer Motion · jsPDF · vite-plugin-pwa (Workbox). Animatsiyalar — o'zimizning SVG skelet dvigateli (`src/lib/figure.ts`: to'g'ridan-to'g'ri va teskari kinematika, langar nuqtalar), shuning uchun video yoki GIF yuklanmaydi va hammasi internetsiz ishlaydi.

```
src/
  data/        mashqlar, animatsiyalar, darslar, manbalar, katalog
  engine/      dastur generatori, progressiya, ovqatlanish, statistika, PDF (+ testlar)
  lib/         figura geometriyasi, sana, hooklar
  components/  Figure, BodyMap, Barbell, charts, Scenes, ...
  pages/       Bugun, Dastur, Mashqlar, Ovqat, Natija, Mashg'ulot, Darslar, Profil
```

## Mobil ilovaga yo'l

1. **Capacitor** bilan shu kodni iOS/Android'ga o'rash (kod o'zgarmaydi), push-bildirishnomalar va fon taymeri qo'shish.
2. Hisob va bulutli sinxronizatsiya (Supabase yoki Firebase) — telefonlar orasida ma'lumot.
3. Rus tili va o'zbek kirill yozuvi.
4. To'lov: Click/Payme orqali premium (murabbiy bilan chat, kengaytirilgan tahlil).

---

Tavsiyalar ma'lumot uchun, tibbiy maslahat o'rnini bosmaydi.
