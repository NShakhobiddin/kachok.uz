# Kachok — zal uchun aqlli murabbiy

Telefonda ishlaydigan veb-ilova (PWA): sizga moslangan mashq dasturi, har bir mashqning animatsiyali texnikasi, ilmiy asoslangan ovqatlanish va natijalar statistikasi. Internetsiz ham ishlaydi, telefonga ilova kabi o'rnatiladi. Keyinchalik shu kod asosida App Store / Google Play ilovasi chiqariladi.

## Imkoniyatlar

| Bo'lim | Nima qiladi |
|---|---|
| **Dastur tuzish** | Maqsad (massa, ozish, shakl, kuch, sog'liq), tajriba, haftasiga 2–6 kun, mashg'ulot vaqti (30–90 daq), zaldagi jihozlar va jarohatlarga qarab haftalik reja tuzadi. Har mushak haftasiga 2 marta, 10–20 set oralig'ida avtomatik muvozanatlanadi. |
| **Jihozga moslash** | 24 turdagi jihozdan belgilaysiz (yoki "To'liq zal / Oddiy zal / Uy / O'z vaznim") — faqat bor jihozdagi mashqlar tanlanadi. |
| **63 ta mashq, ~40 animatsiya** | Anatomik sportchi figurasi: mushaklar tana shakliga yopishgan, tolalari ko'rinadi va qisqarganda qalinlashadi (bitseps tirsak bukilganda, boldir tovon ko'tarilganda). Kuch fazasi tez, nazorat fazasi bir tekis — haqiqiy tempoda; nafas olish ham ko'rinadi. Har mashqda tempo chizig'i (soniyalari bilan), shtanga yo'li, sekinlashtirish. Asosiy mushak — qizil, yordamchi — sariq. |
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
| **Akkaunt va bulut** | Telefon raqam + SMS kod bilan kirish. Ilova avval telefonda ishlaydi (internetsiz ham), internet bo'lsa o'zgarishlar bulutga yoziladi. Yangi telefonda kirsangiz profil, dastur va butun tarix qaytadi. Ziddiyatda eng so'nggi tahrir yutadi. |
| **Murabbiy rejimi** | Murabbiy taklif kodi yaratadi, mijoz kodni kiritib ulanadi. Murabbiy mijozlarining haftalik faolligi, vazn grafigi, rekordlari, har bir mashg'ulotdagi kg × takrorlarini ko'radi, dasturini tahrirlab yuboradi va xabar yozadi. Mijoz "Bugun" sahifasida yangi dastur va xabarni ko'radi. |
| **Pro va to'lov** | Payme va Click orqali to'lov (oylik/yillik), 7 kunlik bepul sinov. Hozircha pullik: PDF, kunlik ovqat rejasi, murabbiy uchun 2 tadan ko'p mijoz. `VITE_BILLING` yoqilmaguncha hammasi bepul. |

## Ilmiy asos

Har bir raqam xalqaro pozitsiyalar va meta-tahlillardan olingan: ACSM 2026, ISSN (oqsil, parhez, kreatin, kofein), JSST/WHO 2020, EFSA 2010, Schoenfeld, Pelland 2026, Morton 2018, Refalo 2023, Helms, Garthe va boshqalar. To'liq ro'yxat (DOI bilan) ilovada **Profil → Ilmiy manbalar** bo'limida va [`src/data/sources.ts`](src/data/sources.ts) faylida. Raqobatchi ilovalar tahlili: [`docs/RESEARCH.md`](docs/RESEARCH.md).

## Dizayn

Markazda — zal platformasida turgan "bo'r" rangidagi anatomik sportchi: chap-yuqoridan yorug'lik, orqadan sovuq kontur nuri, ishlayotgan mushak ichidan yonadi. Disklar old tomondan yarim shaffof — orqasidagi tana ko'rinib turadi. Vazn va takrorlar musobaqa tablosidagidek katta raqamlarda. Ranglar musobaqa disklari kodidan olingan va ma'no tashiydi: **ko'k** (20 kg) — asosiy harakat, **qizil** (25 kg) — ishlayotgan mushak va ogohlantirish, **sariq** (15 kg) — rekord va yutuq, **yashil** (10 kg) — bajarildi va sog'liq. Imzo elementi — mashg'ulot progressi shtangaga disk taqish ko'rinishida. Shriftlar: Big Shoulders Display (sarlavhalar), Manrope (matn), JetBrains Mono (belgilar). Qorong'i mavzu zal yoritilishi uchun.

## Ishga tushirish

```bash
npm install
npm run dev        # http://localhost:5173
npm test           # dvigatellar testlari (2 700+ profil kombinatsiyasi)
npm run build      # dist/ — istalgan statik hostingga (Vercel, Netlify, Nginx)
```

**GitHub Pages:** `main` ga har push'da ilova avtomatik `https://nshakhobiddin.github.io/kachok.uz/` manziliga joylanadi (`.github/workflows/pages.yml`). Bir martalik sozlash: repo **Settings → Pages → Source: GitHub Actions**.

`vercel.json` va `public/_redirects` SPA marshrutlash uchun tayyor. Ma'lumotlar avvalo foydalanuvchi qurilmasida saqlanadi (localStorage); Profil bo'limida JSON zaxira nusxa olish/tiklash bor.

Akkaunt, murabbiy va to'lov uchun server kerak. `.env.example` dan `.env.local` yarating:

| O'zgaruvchi | Ma'nosi |
|---|---|
| `VITE_API_URL` | API manzili, masalan `https://api.kachok.uz`. Bo'sh bo'lsa akkaunt bo'limlari yashiriladi, ilova faqat telefonda ishlaydi. |
| `VITE_BILLING` | `1` — Pro imkoniyatlari pullik. Bo'sh — hammasi bepul. Qaysi imkoniyat pullik ekani: [`src/lib/features.ts`](src/lib/features.ts). |

## Server (API)

`server/` — Node 22 + Hono + PostgreSQL. Telefon orqali kirish (SMS kod), bulutli sinxronlash, murabbiy rejimi, Payme va Click to'lovlari.

```bash
cd server
npm install
cp .env.example .env   # JWT_SECRET ni almashtiring
npm run dev            # http://localhost:8787 (kompilyatsiya qilib ishga tushiradi)
npm run watch          # ikkinchi oynada: kod o'zgarsa qayta kompilyatsiya
npm test               # API testlari: kirish, sinxronlash, murabbiy, Payme, Click
```

`DATABASE_URL` bo'sh bo'lsa ichki PGlite (fayl yoki xotira) ishlatiladi — PostgreSQL o'rnatmasdan sinash uchun. `SMS_PROVIDER=console` da kod SMS o'rniga ilovada ko'rsatiladi (faqat sinov; production'da ishga tushmaydi).

Production: `docker compose up -d` (PostgreSQL 16 + API) yoki `npm run build && npm start`. Jadvallar ishga tushganda avtomatik yaratiladi (`server/src/db/migrations`).

**Muhim — ma'lumotlarni lokalizatsiya qilish.** "Shaxsga doir ma'lumotlar to'g'risida"gi qonunning 27¹-moddasiga ko'ra O'zbekiston fuqarolarining shaxsiy ma'lumotlari O'zbekiston hududidagi serverlarda saqlanishi kerak. Shuning uchun server va bazani mahalliy data-markazda (masalan, Uztelecom, UZCLOUD yoki boshqa mahalliy provayder) joylashtiring va ishga tushirishdan oldin yurist bilan tekshiring.

### Ulash uchun kerak bo'ladigan akkauntlar

| Xizmat | Nima qilish kerak | Sozlama |
|---|---|---|
| **Eskiz.uz** (SMS) | Akkaunt ochish, jo'natuvchi nomini tasdiqlatish | `SMS_PROVIDER=eskiz`, `ESKIZ_EMAIL`, `ESKIZ_PASSWORD`, `ESKIZ_FROM` |
| **Payme Business** | Merchant ochish, kabinetda "Endpoint URL" ga `https://<api>/billing/payme` yozish | `PAYME_MERCHANT_ID`, `PAYME_KEY`, sinovda `PAYME_TEST=1` |
| **Click** | Merchant ochish, Prepare URL `https://<api>/billing/click/prepare`, Complete URL `https://<api>/billing/click/complete` | `CLICK_SERVICE_ID`, `CLICK_MERCHANT_ID`, `CLICK_SECRET_KEY` |

Narxlar (`server/src/billing/plans.ts`) hozircha taxminiy: Pro — 29 000 so'm/oy yoki 249 000 so'm/yil, Murabbiy — 99 000 so'm/oy. Obuna avtomatik yangilanmaydi; muddat ichida to'lansa kunlar qo'shiladi. Sinov muddati — `TRIAL_DAYS` (standart 7).

## Texnologiyalar

React 19 · TypeScript · Vite 6 · Zustand (offline holat) · Framer Motion · jsPDF · vite-plugin-pwa (Workbox). Animatsiyalar — o'zimizning SVG dvigatelimiz: skelet (`src/lib/figure.ts`: to'g'ridan-to'g'ri va teskari kinematika, langar nuqtalar, tempo egri chiziqlari) va anatomiya (`src/components/figure/`: suyak bo'ylab profillardan quriladigan tana konturi, mushak shakllari, jihozlar). Video yoki GIF yuklanmaydi — hammasi internetsiz ishlaydi, barcha figuralar bitta umumiy kadr siklida ~60 fps.

```
src/
  api/         server bilan ishlash va oflayn-birinchi sinxronlash
  data/        mashqlar, animatsiyalar, darslar, manbalar, katalog
  engine/      dastur generatori, progressiya, ovqatlanish, statistika, PDF (+ testlar)
  lib/         figura geometriyasi, sana, hooklar, pullik imkoniyatlar
  components/  Figure, BodyMap, Barbell, charts, Scenes, DayEditor, ...
  pages/       Bugun, Dastur, Mashqlar, Ovqat, Natija, Mashg'ulot, Darslar, Profil,
               Akkaunt, Murabbiy, Mijoz, Pro
server/
  src/routes/  auth (SMS kod), sync, coach, billing
  src/billing/ Payme Merchant API, Click SHOP API, tariflar va obuna
  test/        API va ilova sinxronlashi testlari
```

## Mobil ilovaga yo'l

1. ~~Akkaunt va bulutli sinxronlash~~, ~~murabbiy rejimi~~, ~~Payme/Click to'lovi~~ — tayyor (yuqoriga qarang).
2. **Capacitor** bilan shu kodni iOS/Android'ga o'rash (kod o'zgarmaydi), push-bildirishnomalar (murabbiy xabari, mashg'ulot eslatmasi) va fon taymeri qo'shish.
3. Rus tili va o'zbek kirill yozuvi.

---

Tavsiyalar ma'lumot uchun, tibbiy maslahat o'rnini bosmaydi.
