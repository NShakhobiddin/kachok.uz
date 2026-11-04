# Qayta yaratilishi kerak bo'lgan mashq rasmlari

## Holat (2026-10-30)

**Birinchi tekshiruv.** Har bir rasm, uning ikkinchi kadri, mushak yorliqlari va texnika belgilari kattalashtirib tekshirildi. Yorliqlar va rasmga zid matnlar o'shanda tuzatilgan.

**Flow orqali qayta yaratish** (`scripts/images/regen.json`, 66 ta ish) natijasida 30 ta mashq yangilandi.

Asosiy kadri tuzatilganlar:
- chin-up — kaft o'ziga qaragan, yelka kengligida;
- calf-raise — tovon ko'tarilgan;
- shrug — yelka ko'tarilgan;
- bulgarian — orqa oyoq skameykada;
- hip-thrust — iyak ichkariga;
- pike push-up — bilaklar tik;
- goblet-squat va db-row — ortiqcha yorug'lik olib tashlandi;
- pec-deck — qo'llar simmetrik;
- lat-pulldown — ikkala son yostiq ostida;
- push-up — to'g'ri yuqori holat.

Yangidan yaratilganlar:
- front-squat;
- inverted-row;
- cable-crunch (blokka qaragan);
- hack-squat, leg-extension, leg-curl;
- ko'krak va yelka trenajyorlari.

Ikkinchi kadr qo'shildi yoki almashtirildi: chin-up, calf-raise, shrug, pike push-up, db-row, lat-pulldown, front-squat, cable-crunch, leg-extension, leg-curl, yelka trenajyori, step-up, hammer-curl, cable-row, overhead-extension, dips, back-squat, rdl, smith-squat, back-extension, incline-curl, db-fly.

## Hali qolganlari

Flow ham xatoni takrorlagan. Ikkinchi kadri yo'q mashqlarda ilova faqat mushak va texnika rasmini ko'rsatadi.

| Mashq | Muammo |
|---|---|
| ohp | Qo'llar to'liq yozilmagan (lockout yo'q); ikkinchi kadr yo'q |
| lateral-raise | Yuqori kadrda gantel dastasi bilak bo'ylab; qo'llar butunlay tik (matnda — tirsak biroz bukik) |
| reverse-fly | Lenta bel ustidagi qattiq lime tayoq; Flow lentani oyoq ostiga bog'lab chizdi (boshqa mashq) |
| push-up | Faqat yuqori holat; pastki holat (bilak tik, ko'krak poldan 2–3 sm) yo'q |
| incline-bench | Pastki nuqtada shtanga ko'krakka tushmagan |
| goblet-squat | Ikki kadrning kamerasi va masshtabi har xil — ikkinchi kadr olib tashlangan |
| cable-fly, db-bench, hip-thrust, glute-bridge, hack-squat, ko'krak trenajyori, inverted-row | Ikkinchi kadrda harakat chiqmadi |
| deadlift | Ikkinchi kadr masshtabi va kamerasi boshqa |
| leg-press | Platforma harakatlanadi, yuk joyida qoladi; yozilgan holat (tizza 160–170°) kerak |
| db-rdl | Kadrlar orasida gantel ushlashi o'zgaradi |
| hanging-leg-raise | Profilda turnik ko'ndalang |

### 2026-10-30 auditida topilganlar

**Ilovadan olib tashlandi** (rasm yangilangach, `git log` dagi oldingi yozuvdan qaytariladi):
- **dead-bug — butun rasm.** Bir tomondagi qo'l va oyoq cho'zilgan, to'g'risi qarama-qarshi tomonlar. Hozircha chizma-animatsiya ko'rsatiladi (u ham tuzatildi).
- **Ikkinchi kadri olib tashlanganlar:**
  - machine-shoulder-press — "Yuqori nuqta" kadrida tirsaklar hali 90°;
  - db-shrug — ikki kadr deyarli bir xil, harakat ko'rinmaydi;
  - calf-raise, dips, db-fly — haqiqiy ikkinchi chet holati yo'q.
- **chin-up — "Kaftlar o‘zingizga, yelka kengligida" belgisi.** Rasmda ushlash pull-up bilan bir xil: kaft oldinga, yelkadan keng.

**Qayta yaratish kerak:**

| Mashq | Nima kerak |
|---|---|
| chin-up | Kaft o'ziga qaragan, yelka kengligida. Kamera oldidan yoki 3/4 burchakdan (orqadan kaft yo'nalishi ko'rinmaydi) |
| pull-up, chin-up | Iyak turnikdan aniq yuqori (hozir sathida; belgi "sathiga yetadi" deb o'zgartirildi) |
| front-squat | Tirsaklar ikki kadrda ham past; tirsak oldinga va yuqoriga, yelka tokchasi kerak |
| machine-shoulder-press | Yuqori nuqta: qo'llar to'liq yozilgan |
| db-shrug | Yuqori kadr: yelka va gantellar ~5% yuqori |
| barbell-row | Yuqori nuqta: shtanga qorin pastiga tegadi, bilak qiya (hozir son yuqorisida) |
| close-grip-bench | Pastki nuqta: shtanga ko'krak pastiga tegadi (hozir ~15 sm yuqorida) |
| calf-raise | Oyoq uchi zina chetida; tovon pastda va yuqorida — ikki kadr |
| dips | Pastki kadr: yelka tirsak sathida |
| db-fly | Yuqori kadr: tirsak burchagi pastki kadrdagidek |
| back-extension | Pastki kadr: gavda 70–90° pastga, umurtqa tekis |
| leg-extension | Boshlang'ich holatda tizza ~90° bukilgan |
| leg-curl | Qisqargan holatda tizza to'liqroq bukilgan |
| step-up | Orqa oyoq platformaga yaqinroq, orqa oyoqda yorug'lik yo'q |
| glute-bridge | Oyoqdagi ortiqcha naqsh va yoy chizig'i |
| bulgarian | Ikki kadr orasida pol chizig'i miltillaydi |
| db-row | Tayanch qo'lning yelkasida lime yorug'lik qolgan |

Eslatma: back-squat harakatida pastki kadrning masshtabi asosiy kadrga moslangan nusxasi ishlatiladi (`alt/back-squat-bottom-m.webp`, faqat animatsiyada).

## 2026-11-03: yangi bo'limlar (uyda, cho'zilish, yangi trenajyorlar)

Rasmi umuman yo'q mashqlar — **45 ta**:
- **19 ta uy mashqi** (figura ayol): sumo-squat, reverse-lunge, curtsy-lunge, wall-sit, single-leg-bridge, glute-kickback, fire-hydrant, clamshell, side-leg-raise, banded-lateral-walk, ball-leg-curl, superman, knee-push-up, band-row, bird-dog, side-plank, reverse-crunch, bicycle-crunch, mountain-climber.
- **9 ta trenajyor mashqi** (figura ayol): hip-abduction, hip-adduction, cable-kickback, cable-pull-through, seated-calf-raise, assisted-pull-up, preacher-curl, t-bar-row, ab-wheel.
- **16 ta cho'zilish** (figura ayol; yorug'lik — cho'ziladigan mushak): cat-cow, childs-pose, down-dog, cobra, thread-needle, supine-twist, hip-flexor-stretch, pigeon, figure-four, butterfly, hamstring-stretch, quad-stretch, calf-stretch, doorway-chest, cross-body-shoulder, neck-stretch.
- **dead-bug** — qarama-qarshi qo'l va oyoq bilan qayta.

Rasmi yo'q jihozlar — **8 ta**: hipAbAd, seatedCalf, assistedPullup, preacher, tbar, abWheel, fitball, miniBand.

Rasm kelguncha ilovada chizma-animatsiya ko'rsatiladi.

Keyingi bosqich — 28 ta yangi kuch mashqiga ikkinchi kadr (harakat). Cho'zilishlarga kerak emas.

Ikkinchi kadri yo'q eski mashqlar — **16 ta** (plankada kerak emas): goblet-squat, hack-squat, hip-thrust, glute-bridge, calf-raise, db-bench, machine-chest-press, push-up, dips, cable-fly, db-fly, ohp, machine-shoulder-press, reverse-fly, inverted-row, db-shrug.

Flow to'plami: `node scripts/images/flow-pack.mjs --out <papka> --ids … --poses <poza-papka> --nopose …`. Figura aniq chiza olmaydigan harakatlarda poza namunasi berilmaydi (`--nopose`): fire-hydrant, clamshell, side-leg-raise, side-plank, curtsy-lunge, t-bar-row, supine-twist, pigeon, cross-body-shoulder, neck-stretch.

## Rasm asosidagi harakat: to'liq Flow to'plami (2026-11-03)

Har mashq uchun ikki rasm kerak: boshlang'ich va oxirgi nuqta. Ilova ularni almashtirib, harakatni ko'rsatadi (`ExerciseMotion`). Chizma-animatsiya faqat rasm kelguncha ko'rsatiladi.

- **Yaratish:** `npx vite-node scripts/images/flow-pack2.ts -- <chiqish> <poza-A> <poza-B>`. To'plam uch qismdan iborat:
  - `1_yangi` — 44 ta yangi mashq, A va B kadr;
  - `2_eski` — 34 ta eski rasm tuzatishi va ikkinchi kadr (ustuvorlik bilan);
  - `3_jihoz` — 8 ta jihoz.
- **Manbalar:**
  - ikkinchi kadr tavsiflari — `scripts/images/pairsNew.ts`;
  - eski rasmlardagi xatolar va tuzatish matnlari — `scripts/images/fixesOld.ts`.
- **Joylash:** `python3 scripts/images/place_flow.py <natijalar>`. Har ish papkasidagi `natija-A.png` va `natija-B.png` olinadi:
  - webp va kichik rasm yaratiladi;
  - `illustrations.ts` ga yozuv va ikkinchi kadr qo'shiladi;
  - asosiy kadri almashgan eski mashqlar yorliqlarni qayta tekshirish uchun ro'yxatga chiqariladi.

## Flow natijalari joylandi (2026-11-03)

**Joylandi:**
- **44 ta yangi mashq** (ayol figurasi): 40 tasi ikki kadrli harakat bilan. Bir kadrlilari:
  - t-bar-row — pastki nuqta;
  - knee-push-up — yuqori holat;
  - side-plank va doorway-chest — B kadr mos kelmadi.
- **8 ta jihoz.**
- **Eski rasmlar, asosiy kadr:**
  - chin-up — kaft o'ziga, old tomondan; yorliqlar qayta joylandi;
  - front-squat — tirsaklar oldinga;
  - hanging-leg-raise — turnik to'g'ri yo'nalishda;
  - reverse-fly — qattiq tayoq o'rniga ingichka lenta;
  - db-row — tayanch qo'l yoritilmaydi;
  - step-up — orqa oyoq yoritilmaydi;
  - glute-bridge — ortiqcha yoy chizig'i olib tashlandi.
- **Eski rasmlar, ikkinchi kadr:** machine-shoulder-press, dips, db-fly, goblet-squat, hack-squat, hip-thrust, db-bench, cable-fly, inverted-row, back-extension, leg-extension, deadlift, db-rdl, bulgarian, ohp, front-squat.
- **Ikkinchi kadri olib tashlanganlar:** chin-up va hanging-leg-raise — eski kadr yangi asosiy rasmga mos emas.

## Flow-3 natijalari joylandi (2026-11-04)

**Joylandi:**
- **Asosiy kadr:**
  - ohp — to'liq lockout; eski ikkinchi kadr yangi kameraga moslab qayta saqlandi;
  - calf-raise — tovon baland, ikkinchi kadr bilan; yorliqlar qayta joylandi;
  - db-shrug — yelka baland, ikkinchi kadr bilan;
  - knee-push-up — pastki nuqta, ikkinchi kadr bilan;
  - dead-bug — faqat boshlang'ich holat, bitta kadr. Endi ilovada ko'rinadi.
- **Ikkinchi kadr:**
  - hanging-leg-raise, machine-chest-press, doorway-chest;
  - push-up, glute-bridge, side-plank — Flow kamerasi siljigan edi, kadr A ga tekislandi (`align_frames.py`).

**Rad etildi** (hozirgisi qoldi):
- pull-up, incline-bench, close-grip-bench — o'zgarish yo'q;
- barbell-row — shtanga pastroq tushgan, qo'l ko'rinmaydi;
- lateral-raise — gantel dastasi hamon bilak bo'ylab;
- dead-bug A — boshdan orqaga cho'zilgan qo'l yo'q;
- t-bar-row A/B — plastinalar shtangaga ulanmagan;
- chin-up B — figura A dan ~1,6 baravar kichik, ushlash torroq, tekislab bo'lmaydi;
- leg-press B — chanada plastina paydo bo'ladi, A kadrida esa u yo'q.

**Qayta qilish kerak** — Flow-4 to'plami tayyorlandi (2026-11-04):

```
npx vite-node scripts/images/flow-pack2.ts -- <chiqish> <poza-A> <poza-B> \
  --only pull-up,incline-bench,close-grip-bench,barbell-row,lateral-raise,dead-bug,leg-curl,leg-press,chin-up,reverse-fly,t-bar-row \
  --skipA chin-up,reverse-fly,dead-bug
```

Tahrir ikki marta ishlamagani uchun asosiy kadrlar yangidan chiziladi (`fixesOld.ts`, `mode: 'new'`), xato ko'rinadigan kamera bilan. B kadr natija-A dan olinadi.
t-bar-row spetsifikatsiyasi soddalashtirildi: V-dasta yo'q, ikki qo'l shtangada, plastinalar doim shtanga uchida.
Ro'yxat:
- **Asosiy kadr:**
  - pull-up — iyak turnikdan yuqori;
  - incline-bench, close-grip-bench — shtanga ko'krakda;
  - barbell-row — shtanga qoringa;
  - lateral-raise — dasta kaftda ko'ndalang, oldidan bitta disk ko'rinadi;
  - leg-curl — tizza ko'proq bukilgan;
  - t-bar-row — yuk shtanga uchida, ikkala kadr bir kamerada;
  - leg-press — ikkala kadrda yuk chanada.
- **Ikkinchi kadr:**
  - chin-up — A bilan bir xil masshtab va ushlash;
  - reverse-fly;
  - dead-bug — cho'zilgan holat (qarama-qarshi qo'l bosh orqasiga va oyoq), hozirgi boshlang'ich holatdan.

**Kamera siljigan B kadrni tekislash:**
`python3 -I scripts/images/align_frames.py <A> <B> <chiqish.png> "x0,y0,x1,y1;…"`.
ROI — ikki kadrda ham qimirlamaydigan joylar (oyoq uchi, kaft, jihoz), rasm ulushida.
Masshtab, burilish, siljish va ixtiyoriy gorizontal cho'zish (`--k=0.1`) topiladi; bo'sh chetlar fon bilan to'ldiriladi.
Natijani A bilan aralashtirib tekshiring.

Generatsiya tartibi: `scripts/images/README.md` va `scripts/images/regen.mjs`.
