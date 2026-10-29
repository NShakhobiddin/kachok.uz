// Animatsion darsliklar: har bir slayd — animatsiyali sahna + qisqa matn + manba.
export type SceneId =
  | 'balance-deficit'
  | 'balance-surplus'
  | 'tdee'
  | 'fat-cells'
  | 'spot'
  | 'fiber'
  | 'mps'
  | 'stairs'
  | 'dose'
  | 'rir'
  | 'deload'
  | 'plate'
  | 'protein-day'
  | 'trend'
  | 'sleep'
  | 'brace'
  | 'warmup'
  | 'health'
  | 'bone'
  | 'heart'
  | 'brain'
  | 'grades'
  | 'water'
  | 'pain'
  | 'cardio'
  | `fig:${string}`
  | `wrong:${string}`;

export interface LessonSlide {
  title: string;
  text: string;
  scene: SceneId;
  source?: string;
  caption?: string;
}

export interface Quiz {
  q: string;
  options: string[];
  correct: number;
  explain: string;
}

export interface Lesson {
  id: string;
  title: string;
  category: string;
  minutes: number;
  icon: string;
  plate: 'red' | 'blue' | 'yellow' | 'green' | 'white';
  summary: string;
  slides: LessonSlide[];
  quiz: Quiz[];
}

export const LESSONS: Lesson[] = [
  {
    id: 'fat-loss',
    title: 'Ozishning yagona qonuni',
    category: 'Ozish',
    minutes: 4,
    icon: 'flame',
    plate: 'red',
    summary: "Kaloriya taqchilligi, to‘g‘ri tezlik va mushakni saqlash.",
    slides: [
      {
        title: 'Energiya balansi',
        text: "Yog‘ faqat bitta holatda yo‘qoladi: tana kuniga sarflaganidan kamroq energiya olganda. Bu farq — kaloriya taqchilligi. Parhezning nomi muhim emas: kaloriya teng bo‘lsa, natija deyarli bir xil.",
        scene: 'balance-deficit',
        source: 'aragon2017',
      },
      {
        title: 'Energiya qayerga ketadi?',
        text: "Kunlik sarfning ~60–70% i — tinch holatdagi metabolizm. Keyin kundalik harakat (qadam, ish), ovqat hazmi va eng kichik qismi — mashq. Shuning uchun kuniga 8–10 ming qadam zaldagi 1 soatdan ham ko‘p yoqishi mumkin.",
        scene: 'tdee',
        source: 'mifflin1990',
      },
      {
        title: 'Shoshilmang: haftasiga 0.5–0.7%',
        text: "Sekin ozganlar (haftasiga ~0.7%) mushakni saqlab, hatto oshirgan; tez ozganlar (1.4%) mushak yo‘qotgan. 80 kg odam uchun bu haftasiga ~0.5 kg.",
        scene: 'fat-cells',
        source: 'garthe2011',
      },
      {
        title: "Qorindan 'nuqtali' ozish yo‘q",
        text: "6 hafta har kuni press mashqi qorin yog‘ini kamaytirmagan. Yog‘ butun tanadan bir vaqtda ketadi — qayerdan birinchi ketishini genetika belgilaydi, mashq emas.",
        scene: 'spot',
        source: 'vispute2011',
      },
      {
        title: "Mushakni saqlash — og‘irlik va oqsil",
        text: "Ozish davrida kuch mashqini davom ettiring va oqsilni ~2 g/kg ga oshiring. Aks holda yo‘qotilgan vaznning katta qismi mushak bo‘ladi va metabolizm sekinlashadi.",
        scene: 'fig:back-squat',
        source: 'helms2014',
      },
      {
        title: 'Tarozi aldaydi — trendga qarang',
        text: "Vazn kundan-kunga suv, tuz va ovqat hisobiga 1–2 kg o‘zgaradi. Har kuni ertalab tortiling va haftalik o‘rtacha (trend) bo‘yicha baho bering. Kachok buni avtomatik hisoblaydi.",
        scene: 'trend',
      },
    ],
    quiz: [
      { q: 'Yog‘ yo‘qotishning asosiy sharti nima?', options: ["Ko‘p ter to‘kish", 'Kaloriya taqchilligi', 'Kechqurun ovqat yemaslik'], correct: 1, explain: "Faqat energiya taqchilligi yog‘ni kamaytiradi; ter — bu suv." },
      { q: '80 kg odam uchun optimal ozish tezligi?', options: ['Haftasiga 2 kg', 'Haftasiga ~0.5 kg', 'Oyiga 10 kg'], correct: 1, explain: "Haftasiga vaznning 0.5–0.7% i mushakni saqlaydi." },
      { q: "Press mashqi qorin yog‘ini ketkazadimi?", options: ['Ha, aynan o‘sha joydan', "Yo‘q, yog‘ butun tanadan ketadi"], correct: 1, explain: "Nuqtali ozish tadqiqotlarda tasdiqlanmagan." },
    ],
  },
  {
    id: 'muscle-growth',
    title: "Mushak qanday o‘sadi",
    category: 'Massa olish',
    minutes: 4,
    icon: 'dumbbell',
    plate: 'blue',
    summary: 'Mexanik taranglik, oqsil sintezi va progressiya.',
    slides: [
      {
        title: 'Signal: mexanik taranglik',
        text: "Og‘ir set oxirida mushak tolalari maksimal taranglikda ishlaydi. Bu tanaga signal: 'Bu yuk takrorlanadi — kuchliroq bo‘l'. Yengil vazn ham ishlaydi, faqat set charchoqqa yaqin bo‘lishi kerak.",
        scene: 'fiber',
        source: 'schoenfeld2017load',
      },
      {
        title: "Qurilish mashg‘ulotdan keyin",
        text: "Mashqdan keyin 24–48 soat davomida mushak oqsil sintezi ko‘tariladi. Aynan shu oynada oqsil va uyqu 'g‘isht' vazifasini bajaradi. Shuning uchun har mushakni haftasiga 2 marta ishlatish samaraliroq.",
        scene: 'mps',
        source: 'schoenfeld2016freq',
      },
      {
        title: 'Progressiv yuklama',
        text: "Tana faqat yangi talabga moslashadi. Har hafta ozgina ko‘proq: +1 takror yoki +2.5 kg. Kachok har bir set uchun buni o‘zi hisoblab beradi.",
        scene: 'stairs',
        source: 'acsm2026',
      },
      {
        title: 'Qancha set kerak?',
        text: "Haftasiga har mushak guruhiga ~10–20 set eng ko‘p sinalgan oraliq. Ko‘proq — ko‘proq o‘sish, lekin foyda kamayib boradi va tiklanish qiyinlashadi.",
        scene: 'dose',
        source: 'pelland2026',
      },
      {
        title: "Massa: ozgina ortiqcha, 'iflos massa' emas",
        text: "Me’yordan 10–20% ko‘p kaloriya va haftasiga vaznning 0.25–0.5% ortishi — mushak uchun yetarli. Ko‘prog‘i asosan yog‘ bo‘ladi.",
        scene: 'balance-surplus',
        source: 'iraki2019',
      },
      {
        title: 'Uyqu — eng arzon qo‘shimcha',
        text: "Kattalar uchun 7–9 soat. Uyquda o‘sish gormoni chiqadi va asab tizimi tiklanadi. Kam uyqu bilan har qanday dastur sekin ishlaydi.",
        scene: 'sleep',
        source: 'hirshkowitz2015',
      },
    ],
    quiz: [
      { q: "Mushak o‘sishining asosiy signali?", options: ['Og‘riq va zo‘riqish', 'Mexanik taranglik', "Ko‘p ter"], correct: 1, explain: "Charchoqqa yaqin setlardagi taranglik — asosiy stimul." },
      { q: 'Haftalik tavsiya etilgan hajm (har mushak)?', options: ['2–4 set', '10–20 set', '40+ set'], correct: 1, explain: "10–20 set eng ko‘p o‘rganilgan samarali oraliq." },
      { q: 'Massa olishda kaloriya ortiqchasi?', options: ["Imkon qadar ko‘p", "Me’yordan 10–20% ko‘p", "Ortiqcha kerak emas"], correct: 1, explain: "Kichik ortiqcha — mushak, katta ortiqcha — yog‘." },
    ],
  },
  {
    id: 'overload-rir',
    title: 'Progressiya, RIR va yengil hafta',
    category: 'Mashq ilmi',
    minutes: 3,
    icon: 'chart',
    plate: 'yellow',
    summary: 'Qachon vazn oshirish kerak va nega har set «oxirigacha» emas.',
    slides: [
      {
        title: 'Ikki bosqichli progressiya',
        text: "Masalan 3×8–12. Avval vaznni o‘zgartirmay takrorlarni oshirasiz: 8, 9, 10... Barcha setlarda 12 bo‘lsa — vazn +2.5 kg va yana 8 dan boshlanadi.",
        scene: 'stairs',
        source: 'acsm2026',
      },
      {
        title: 'RIR — zaxiradagi takrorlar',
        text: "RIR 2 — setni yana 2 marta qila oladigan holatda tugatish. Bu sizni xavfsiz, lekin samarali zonada ushlaydi.",
        scene: 'rir',
        source: 'helms2016rir',
      },
      {
        title: "To‘liq charchoq shart emas",
        text: "Har setni muvaffaqiyatsizlikkacha olib borish mushak o‘sishiga deyarli qo‘shimcha foyda bermaydi, lekin charchoq va jarohat xavfini oshiradi. 1–3 takror zaxira — oltin o‘rtalik.",
        scene: 'rir',
        source: 'refalo2023',
      },
      {
        title: 'Yengillashtirish (deload) haftasi',
        text: "Har 5–6 haftada bir hafta kamroq set va yengilroq vazn. Charchoq ketadi, kuch esa 'yashirin' holatdan chiqib keyingi blokda o‘sadi.",
        scene: 'deload',
      },
    ],
    quiz: [
      { q: '3×8–12 da qachon vazn oshiriladi?', options: ['Har mashg‘ulotda', "Barcha setlarda 12 takror bo‘lganda", 'Bir oyda bir marta'], correct: 1, explain: 'Ikki bosqichli progressiya: avval takror, keyin vazn.' },
      { q: 'RIR 2 nima degani?', options: ['2 daqiqa dam', 'Yana 2 marta qila olardingiz', '2 ta set'], correct: 1, explain: 'RIR — zaxirada qolgan takrorlar.' },
    ],
  },
  {
    id: 'rpe-autoreg',
    title: 'RPE va avtoregulyatsiya',
    category: 'Mashq ilmi',
    minutes: 4,
    icon: 'bolt',
    plate: 'blue',
    summary: 'Har setdan keyin «yana nechta qila olardim?» — ilova shu javobdan ertangi vaznni hisoblaydi.',
    slides: [
      {
        title: 'RPE = 10 − RIR',
        text: "Set tugagach o‘zingizdan so‘rang: yana nechta takror qila olardim? 0 — boshqa bo‘lmaydi (RPE 10), 2 — yana ikkitasi bor edi (RPE 8). Bu oddiy savol og‘irlikni ob’ektiv o‘lchaydi.",
        scene: 'rir',
        source: 'zourdos2016',
      },
      {
        title: 'Bitta setdan — 1RM',
        text: "100 kg × 5 takror, 2 zaxira bilan — bu sizning maksimumingizning ~81%. Demak 1RM ≈ 123 kg. Ilova har setni shunday jadval (Tuchscherer/Helms) orqali taxminiy 1RM ga aylantiradi.",
        scene: 'stairs',
        source: 'helms2016rir',
      },
      {
        title: 'Nega foiz emas, zaxira?',
        text: "Uyqu, stress, ovqat — kuch har kuni ±5–10% o‘zgaradi. Qat’iy «80%» yomon kunda juda og‘ir, yaxshi kunda juda yengil. Zaxira bo‘yicha tanlangan vazn kuchni kamida shunchalik, ko‘pincha biroz ko‘proq oshirdi.",
        scene: 'dose',
        source: 'helms2018rpe',
      },
      {
        title: 'Ilovada qanday ishlaydi',
        text: "Setdan keyin zaxirani belgilaysiz → o‘tgan mashg‘ulotlar bo‘yicha silliqlangan 1RM → bugungi takror va zaxira uchun vazn. Sakrash cheklangan: +5% dan ko‘p oshmaydi, −10% dan ko‘p tushmaydi.",
        scene: 'trend',
      },
      {
        title: 'Halol baho',
        text: "Boshlovchilar zaxirani odatda 1–2 ta ko‘p deb o‘ylaydi. Vaqti-vaqti bilan oxirgi setni xavfsiz mashqda (trenajyor, gantel) chegaragacha qilib ko‘ring — «ko‘zingiz» tez sozlanadi.",
        scene: 'rir',
        source: 'zourdos2016',
      },
    ],
    quiz: [
      { q: 'RPE 8 nimani bildiradi?', options: ['8 ta takror', 'Yana 2 ta takror qila olardim', '80% vazn'], correct: 1, explain: 'RPE = 10 − zaxira: 10 − 2 = 8.' },
      { q: 'Nega zaxira bo‘yicha vazn tanlash foydali?', options: ['Kuch har kuni bir xil', 'Kunlik holatni hisobga oladi', 'Vazn doim oshadi'], correct: 1, explain: 'Avtoregulyatsiya — bugungi tayyorgarlikka moslash.' },
      { q: '100 kg × 5 takror, 2 zaxira bilan. Taxminiy 1RM?', options: ['~105 kg', '~123 kg', '~150 kg'], correct: 1, explain: '5 + 2 = 7 takror chegarasi ≈ 81% → 100 / 0.81 ≈ 123 kg.' },
    ],
  },
  {
    id: 'periodization',
    title: 'Dastur uslublari: qaysi biri sizga?',
    category: 'Mashq ilmi',
    minutes: 4,
    icon: 'calendar',
    plate: 'red',
    summary: 'Gipertrofiya bloki, kuch bloki, chiziqli progressiya va powerbuilding — kim uchun va nega.',
    slides: [
      {
        title: 'Reja — tasodifdan kuchli',
        text: "Yuklamasi rejali o‘zgarib boradigan (periodizatsiyalangan) dastur bir xil dasturga qaraganda kuchni ko‘proq oshiradi. Asosiysi — charchoqni boshqarish: og‘ir haftalar va yengillashtirish navbatlashadi.",
        scene: 'stairs',
        source: 'williams2017',
      },
      {
        title: 'Gipertrofiya bloki',
        text: "Mushak uchun: 1-hafta 3 zaxira bilan boshlanadi, har hafta zaxira kamayadi (3 → 2 → 1), mushak fikringizga qarab setlar qo‘shiladi. 4–5 haftadan keyin — yengillashtirish. Ko‘pchilik uchun eng yaxshi tanlov.",
        scene: 'rir',
        source: 'israetel2021',
      },
      {
        title: 'Kuch bloki (%1RM)',
        text: "Asosiy shtanga mashqlarida har hafta og‘irroq va kamroq takror: 4×6 @75% → 4×5 @80% → 4×4 @85% → 3×3 @88%, keyin yengillashtirish. Yordamchi mashqlar hajmni ushlab turadi.",
        scene: 'stairs',
        source: 'issurin2010',
      },
      {
        title: 'Chiziqli progressiya',
        text: "Yangi boshlovchi tanasi 2–3 kunda tiklanadi — shuning uchun har mashg‘ulotda vazn oshadi: oyoq +5 kg, yuqori tana +2.5 kg. Ikki marta yetmasa — vazn 10% tushadi va yana chiqiladi. Bir necha oy davom etadi.",
        scene: 'stairs',
        source: 'rippetoe2014',
      },
      {
        title: 'Powerbuilding',
        text: "Haftada ikki og‘ir kun (4–6 takror) va ikki hajm kuni (8–15). Og‘ir va yengilroq vazn mushakni deyarli bir xil o‘stiradi, lekin maksimal kuch og‘ir vaznda ko‘proq oshadi — ikkalasini birlashtiramiz.",
        scene: 'dose',
        source: 'schoenfeld2017load',
      },
      {
        title: 'Eng yaxshi uslub — bajariladigani',
        text: "Farqlar o‘rtacha kichik; muntazamlik esa hamma narsani hal qiladi. Maqsad «mushak» bo‘lsa — gipertrofiya, «kuch» va tajriba bo‘lsa — kuch bloki, endi boshlagan bo‘lsangiz — chiziqli. «Dastur» bo‘limida istalgan payt almashtirasiz.",
        scene: 'grades',
      },
    ],
    quiz: [
      { q: 'Kim uchun chiziqli progressiya eng mos?', options: ['10 yillik sportchi', 'Yangi boshlovchi', 'Faqat ayollar'], correct: 1, explain: 'Yangi boshlovchi tez tiklanadi — har mashg‘ulot +vazn ishlaydi.' },
      { q: 'Kuch blokining oxirgi haftasi nima?', options: ['Eng og‘ir hafta', 'Yengillashtirish', 'Dam olish — mashq yo‘q'], correct: 1, explain: 'Charchoq ketadi, kuch keyingi blokda namoyon bo‘ladi.' },
      { q: 'Gipertrofiya blokida har hafta nima kamayadi?', options: ['Zaxira takror (RIR)', 'Oqsil', 'Mashq kunlari'], correct: 0, explain: 'RIR 3 → 2 → 1: hafta sayin og‘irlashadi.' },
    ],
  },
  {
    id: 'protein',
    title: 'Oqsil: qancha, qachon, qayerdan',
    category: 'Ovqatlanish',
    minutes: 3,
    icon: 'food',
    plate: 'green',
    summary: "1.6–2.2 g/kg, 4 mahalga bo‘lib, mahalliy mahsulotlardan.",
    slides: [
      {
        title: 'Qancha?',
        text: "Kuniga ~1.6 g/kg dan keyin mushak o‘sishiga qo‘shimcha foyda deyarli yo‘q; xavfsizlik uchun 2.2 g/kg gacha. 75 kg odam uchun — 120–165 g.",
        scene: 'plate',
        source: 'morton2018',
      },
      {
        title: 'Qachon?',
        text: "Bir mahalda hammasini emas: kamida 4 mahalga ~0.4 g/kg dan (75 kg uchun ~30 g). Mashqdan keyingi '30 daqiqalik oyna' — mif emas, lekin kunlik jami muhimroq.",
        scene: 'protein-day',
        source: 'schoenfeld2018meal',
      },
      {
        title: 'Qayerdan?',
        text: "3 tuxum ≈ 19 g · 150 g tovuq ≈ 46 g · 200 g tvorog ≈ 34 g · 150 g mol go‘shti ≈ 40 g · 1 kosa mosh ≈ 15 g. Oqsil kukuni — faqat qulaylik, majburiy emas.",
        scene: 'plate',
        source: 'jager2017',
      },
      {
        title: 'Buyrak uchun xavflimi?',
        text: "Sog‘lom odamlarda sport darajasidagi oqsil buyrakka zarar yetkazishi isbotlanmagan. Buyrak kasalligi bo‘lsa — albatta shifokor bilan.",
        scene: 'health',
        source: 'jager2017',
      },
    ],
    quiz: [
      { q: '80 kg odam uchun kunlik oqsil?', options: ['40 g', '130–175 g', '400 g'], correct: 1, explain: '1.6–2.2 g/kg × 80 ≈ 130–175 g.' },
      { q: "Oqsilni qanday taqsimlash yaxshi?", options: ['Bir mahalda', '4 mahalga bo‘lib'], correct: 1, explain: 'Har mahalda ~0.4 g/kg.' },
    ],
  },
  {
    id: 'calories-macros',
    title: 'Kaloriya, makrolar va milliy taomlar',
    category: 'Ovqatlanish',
    minutes: 4,
    icon: 'scale',
    plate: 'white',
    summary: 'Osh va somsadan voz kechmasdan maqsadga yetish.',
    slides: [
      {
        title: 'Kunlik sarf qanday hisoblanadi',
        text: "Mifflin–St Jeor formulasi tinch holatdagi sarfni hisoblaydi, keyin faollik koeffitsienti va mashq qo‘shiladi. Bu boshlang‘ich nuqta — 2–3 haftalik vazn trendi uni aniqlashtiradi.",
        scene: 'tdee',
        source: 'mifflin1990',
      },
      {
        title: 'Makrolar',
        text: "Oqsil — mushak uchun, yog‘ — gormonlar uchun (kaloriyaning 20–35%), uglevod — mashq uchun yoqilg‘i. Ozishda ham uglevodni butunlay olib tashlash shart emas.",
        scene: 'plate',
        source: 'helms2014',
      },
      {
        title: 'Osh mumkinmi?',
        text: "Ha. 1 likopcha osh ~800 kkal. Guruchni kamroq, go‘sht va achchiq-chuchukni ko‘proq oling — va kunning qolgan qismini yengilroq qiling. Hech qaysi taom 'taqiqlangan' emas, faqat miqdor muhim.",
        scene: 'balance-deficit',
      },
      {
        title: "Non — ko‘rinmas kaloriya",
        text: "Bitta non ~660 kkal. Choy bilan 'bilmasdan' yarim non — 330 kkal. Bir mahalda chorak non yetarli.",
        scene: 'trend',
      },
    ],
    quiz: [
      { q: 'Ozishda oshni butunlay tashlash kerakmi?', options: ['Ha', "Yo‘q, porsiyani nazorat qilish yetarli"], correct: 1, explain: 'Kunlik jami kaloriya hal qiladi.' },
      { q: "Yog‘lar kaloriyaning qancha qismi bo‘lishi tavsiya etiladi?", options: ['5%', '20–35%', '70%'], correct: 1, explain: 'Gormonlar salomatligi uchun kamida ~20%.' },
    ],
  },
  {
    id: 'tdee-body',
    title: 'Haqiqiy sarf, bel va yog‘ foizi',
    category: 'Ovqatlanish',
    minutes: 4,
    icon: 'scale',
    plate: 'green',
    summary: 'Formula — boshlang‘ich taxmin. Kundalik va tarozi esa sizning haqiqiy raqamingizni topadi.',
    slides: [
      {
        title: 'Formula ±10% xato qiladi',
        text: "Mifflin–St Jeor eng aniq formulalardan biri, lekin bir xil bo‘y-vazndagi ikki odamning sarfi 200–300 kkal farq qilishi mumkin. Shuning uchun formula — faqat boshlanish nuqtasi.",
        scene: 'tdee',
        source: 'mifflin1990',
      },
      {
        title: 'Energiya balansi',
        text: "Sarf = o‘rtacha iste’mol − 7 700 × (vazn o‘zgarishi / kun). Masalan, 3 haftada kuniga 2 000 kkal yedingiz va 0.6 kg yo‘qotdingiz: 2 000 + 7 700 × 0.6 / 21 ≈ 2 220 kkal — bu sizning haqiqiy sarfingiz.",
        scene: 'balance-deficit',
        source: 'hall2008',
      },
      {
        title: 'Nima kerak?',
        text: "Ovqatni kun bo‘yi to‘liq yozish (chala kunlar hisobga olinmaydi) va haftasiga 4+ marta ertalab tortilish. Kunlik tebranish (suv, tuz) — normal: trend chizig‘iga qarang.",
        scene: 'trend',
      },
      {
        title: 'Ozishda sarf kamayadi',
        text: "Parhez davomida tana tejamkor bo‘lib qoladi — sarf formula kutganidan ko‘proq tushadi. Moslashuvchan hisob buni har hafta ushlaydi va kaloriyangizni o‘zi to‘g‘rilaydi.",
        scene: 'tdee',
        source: 'trexler2014',
      },
      {
        title: 'Bel — bo‘yning yarmidan kam',
        text: "Bel o‘lchami vazndan ko‘ra ko‘proq aytadi: bel/bo‘y < 0.5 bo‘lsa, yurak-qon tomir xavfi past. 180 sm bo‘y uchun bel 90 sm dan kam bo‘lsin. Kindik sathida, nafas chiqargach o‘lchang.",
        scene: 'health',
        source: 'ashwell2012',
      },
      {
        title: 'Yog‘ foizi lenta bilan',
        text: "Bel va bo‘yin (ayollarda son ham) o‘lchamidan yog‘ foizi hisoblanadi. Aniqligi ±3–4% — bitta raqam emas, oy sayin o‘zgarish muhim: bel kichrayib vazn o‘zgarmasa — yog‘ ketib, mushak qo‘shilmoqda.",
        scene: 'fat-cells',
        source: 'hodgdon1984',
      },
    ],
    quiz: [
      { q: 'Kuniga 2 500 kkal yeysiz, vazn 3 hafta o‘zgarmadi. Sarfingiz?', options: ['~2 000', '~2 500', '~3 000'], correct: 1, explain: 'Vazn o‘zgarmasa — iste’mol sarfga teng.' },
      { q: 'Bel/bo‘y nisbatining oddiy chegarasi?', options: ['0.3', '0.5', '0.8'], correct: 1, explain: 'Bel bo‘yingizning yarmidan kam bo‘lsin (Ashwell 2012).' },
      { q: 'Nega kunlik tortilishdagi sakrashlarga e’tibor bermaslik kerak?', options: ['Tarozi buzuq', 'Suv va tuz vaznni kunda 0.5–1 kg o‘zgartiradi', 'Vazn muhim emas'], correct: 1, explain: 'Trend (silliqlangan chiziq) haqiqiy o‘zgarishni ko‘rsatadi.' },
    ],
  },
  {
    id: 'safety',
    title: 'Jarohatsiz mashq qilish',
    category: 'Xavfsizlik',
    minutes: 6,
    icon: 'alert',
    plate: 'red',
    summary: 'Razminka, nafas, to‘sinlar va sug‘urta, og‘riq shkalasi.',
    slides: [
      {
        title: 'Kuch mashqi — xavfsiz sport',
        text: "Og‘ir atletikada jarohat 1000 soat mashg‘ulotga bir necha ta — ko‘p jamoaviy sport turlaridan kam. Aksincha, kuch mashqlari boshqa sport jarohatlarini qariyb uch barobar kamaytiradi. Ko‘p jarohat yelka, bel va tizzada — va deyarli hammasi texnika, charchoq yoki shoshilib vazn qo‘shishdan.",
        scene: 'health',
        source: 'lauersen2014',
      },
      {
        title: 'Razminka — 5–8 daqiqa',
        text: "Yengil kardio + birinchi mashqda 2–3 ta isinish seti (masalan 40%, 60%, 80%). Razminka o‘lchangan natijalarning ~80% ida samaradorlikni oshirgan.",
        scene: 'warmup',
        source: 'fradkin2010',
      },
      {
        title: "Mashqdan oldin uzoq cho‘zilish — yo‘q",
        text: "60 soniyadan uzoq statik cho‘zilish kuchni ~5% ga pasaytiradi. Mashqdan oldin dinamik harakatlar, statik cho‘zilish — mashqdan keyin.",
        scene: 'cardio',
        source: 'behm2016',
      },
      {
        title: "Nafas va 'korset'",
        text: "Og‘ir setdan oldin chuqur nafas olib, qorinni 360° tarang qiling — bu umurtqani ichidan ushlab turadi. Eng qiyin nuqtadan o‘tgach nafas chiqaring.",
        scene: 'brace',
      },
      {
        title: 'Texnika — vazndan muhim',
        text: "Dumaloq bel bilan og‘ir tortish — eng xavfli xato. Har bir mashq sahifasida 'Xatolar' bo‘limida noto‘g‘ri va to‘g‘ri bajarilish animatsiyada ko‘rsatilgan.",
        scene: 'wrong:deadlift',
      },
      {
        title: 'To‘sinlar, qisqich, sug‘urtachi',
        text: "Og‘ir o‘tirish, yotib jim va boshdan yuqori jim — ramada, to‘sinlar eng past nuqtangizdan biroz pastda. Shtanga bosh barmoq bilan o‘rab ushlanadi, disklar qisqich bilan. Setdan oldin bilib oling: ko‘tara olmasangiz shtangani qayerga tashlaysiz — har mashq sahifasidagi «Xavfsizlik» bo‘limida yozilgan.",
        scene: 'fig:bench-press',
        source: 'haff2016',
      },
      {
        title: "Og‘riq shkalasi 0–10",
        text: "Mushakdagi «yonish» va ertasi kungi og‘riq — normal. Bo‘g‘imdagi og‘riqni baholang: 0–2 — davom eting; 3–5 — vazn yoki amplitudani kamaytiring, og‘riq ertasi tongga o‘tishi kerak; 6 va undan yuqori — to‘xtang va almashtiring. Uvishish, tarqaluvchi og‘riq yoki «qars» etish — darhol to‘xtang.",
        scene: 'pain',
        source: 'silbernagel2007',
      },
    ],
    quiz: [
      { q: 'Mashqdan oldin nima yaxshiroq?', options: ["Uzoq statik cho‘zilish", 'Dinamik razminka va isinish setlari'], correct: 1, explain: "Statik cho‘zilish kuchni vaqtincha pasaytiradi." },
      { q: "Bo‘g‘imda o‘tkir og‘riq bo‘lsa?", options: ['Davom etish', "To‘xtash va mashqni almashtirish"], correct: 1, explain: "O‘tkir og‘riq — ogohlantirish signali." },
      {
        q: 'Yolg‘iz, to‘sinsiz skameykada yotib jim qilyapsiz. Qisqich taqasizmi?',
        options: ['Ha, har doim', 'Yo‘q — ko‘tara olmasam disklarni to‘kib yuborish uchun'],
        correct: 1,
        explain: 'To‘sin va sug‘urtachi bo‘lmasa, shtangani qiyshaytirib disklarni tushirish — ostida qolmaslikning yagona yo‘li. Eng yaxshisi — ramada, to‘sinlar bilan.',
      },
      { q: 'Og‘riq 4/10 edi va ertasi tongga o‘tib ketdi. Nima qilasiz?', options: ['Mashqni butunlay tashlayman', 'Davom etaman, vazn va amplitudani nazorat qilaman'], correct: 1, explain: 'Og‘riq nazorati modeli: 5/10 gacha, ertasiga o‘tib ketsa va haftadan-haftaga kuchaymasa — davom etish mumkin.' },
    ],
  },
  {
    id: 'medicine',
    title: 'Kuch mashqi — dori',
    category: "Sog‘liq",
    minutes: 3,
    icon: 'heart',
    plate: 'green',
    summary: 'Yurak, suyak, qand, kayfiyat — raqamlarda.',
    slides: [
      {
        title: 'Uzoq umr',
        text: "Haftasiga atigi 30–60 daqiqa kuch mashqi umumiy o‘lim, yurak kasalliklari, saraton va diabet xavfini 10–17% ga kamaytiradi.",
        scene: 'health',
        source: 'momma2022',
      },
      {
        title: 'Suyaklar',
        text: "Og‘ir kuch mashqlari suyakka bosim berib, zichlikni oshiradi: osteopeniyali ayollarda 8 oyda bel umurtqalari +2.9%.",
        scene: 'bone',
        source: 'watson2018',
      },
      {
        title: 'Yurak va qon bosimi',
        text: "Dinamik kuch mashqlari qon bosimini pasaytiradi. 2-tur diabetda HbA1c ~0.6% ga kamayadi — bu ba’zi dorilar ta’siriga yaqin.",
        scene: 'heart',
        source: 'cornelissen2013',
      },
      {
        title: 'Kayfiyat',
        text: "33 ta tadqiqot: kuch mashqi depressiya alomatlarini sezilarli kamaytiradi, xavotirni pasaytiradi.",
        scene: 'brain',
        source: 'gordon2018',
      },
      {
        title: 'Yosh — to‘siq emas',
        text: "50 yoshdan oshganlar ham 20 haftada o‘rtacha 1.1 kg mushak qo‘shgan. Mushak — keksalikda mustaqil hayotning kafolati.",
        scene: 'fig:goblet-squat',
        source: 'peterson2011',
      },
    ],
    quiz: [
      { q: "Haftasiga qancha kuch mashqi o‘lim xavfini sezilarli kamaytiradi?", options: ['10 soat', '30–60 daqiqa'], correct: 1, explain: 'Eng katta foyda 30–60 daqiqada (Momma, 2022).' },
    ],
  },
  {
    id: 'myths',
    title: 'Miflar va haqiqatlar',
    category: 'Miflar',
    minutes: 3,
    icon: 'info',
    plate: 'yellow',
    summary: 'Zaldagi eng mashhur 5 ta noto‘g‘ri tushuncha.',
    slides: [
      {
        title: "«Ayollar og‘ir ko‘tarsa, erkakdek bo‘lib qoladi»",
        text: "Yo‘q. Testosteron darajasi past bo‘lgani uchun ayollar mushakni sekinroq yig‘adi. Og‘irlik bilan shug‘ullanish shakl, kuch va suyak salomatligi beradi.",
        scene: 'fig:hip-thrust',
      },
      {
        title: "«Ko‘p ter — ko‘p yog‘ yoqildi»",
        text: "Ter — tana sovishi uchun chiqqan suv. Yo‘qotilgan vazn ichilgan suv bilan qaytadi. Yog‘ faqat kaloriya taqchilligida ketadi.",
        scene: 'water',
        source: 'sawka2007',
      },
      {
        title: "«Kardio mushakni yeydi»",
        text: "O‘rtacha kardio (haftasiga 2–3 marta, 20–40 daqiqa) mushak o‘sishiga sezilarli xalaqit bermaydi va yurakka juda foydali.",
        scene: 'cardio',
        source: 'wilson2012',
      },
      {
        title: "«Press kubiklari press mashqidan chiqadi»",
        text: "Press mushaklari hammada bor — ular yog‘ qatlami ostida. Kubiklarni ko‘rinadigan qiladigan narsa — tana yog‘ining kamayishi.",
        scene: 'spot',
        source: 'vispute2011',
      },
      {
        title: "«Og‘riq bo‘lmasa, natija yo‘q»",
        text: "Ertasi kungi og‘riq o‘sish ko‘rsatkichi emas. Tajriba oshgani sari og‘riq kamayadi, mushak esa o‘sishda davom etadi. Ko‘rsatkich — progressiya.",
        scene: 'stairs',
      },
    ],
    quiz: [
      { q: "Ter ko‘p chiqsa ko‘p yog‘ yoqilgan bo‘ladimi?", options: ['Ha', "Yo‘q, ter — suv"], correct: 1, explain: "Yo‘qotilgan suv qaytadi." },
      { q: 'Press kubiklarini nima ko‘rinadigan qiladi?', options: ['Har kuni 500 marta press', "Tana yog‘ining kamayishi"], correct: 1, explain: "Kubiklar yog‘ qatlami ostida." },
    ],
  },
  {
    id: 'recovery',
    title: 'Uyqu, suv va tiklanish',
    category: "Sog‘liq",
    minutes: 3,
    icon: 'moon',
    plate: 'blue',
    summary: 'Mushak zalda emas, dam olishda o‘sadi.',
    slides: [
      {
        title: '7–9 soat uyqu',
        text: "Kattalar uchun tavsiya. Bir xil vaqtda yotish, yotishdan 6 soat oldin kofein yo‘q, xona salqin va qorong‘i.",
        scene: 'sleep',
        source: 'hirshkowitz2015',
      },
      {
        title: 'Suv',
        text: "Kunlik umumiy suv: ayollar ~2.0 L, erkaklar ~2.5 L (ovqatdagi suv bilan birga) + mashq kunlari qo‘shimcha. Siydik rangi och sariq bo‘lsa — yetarli.",
        scene: 'water',
        source: 'efsa2010',
      },
      {
        title: '2% qoidasi',
        text: "Mashq paytida suvsizlanish tufayli vaznning 2% idan ko‘pini yo‘qotmang — kuch va diqqat pasayadi.",
        scene: 'water',
        source: 'sawka2007',
      },
      {
        title: 'Dam olish kunlari',
        text: "Bir mushak guruhini qayta og‘ir ishlatishdan oldin ~48 soat. Kachok 'Mushaklar tiklanishi' xaritasida buni ko‘rsatadi.",
        scene: 'mps',
      },
    ],
    quiz: [{ q: 'Kattalar uchun tavsiya etilgan uyqu?', options: ['5–6 soat', '7–9 soat', '10–12 soat'], correct: 1, explain: 'National Sleep Foundation tavsiyasi.' }],
  },
  {
    id: 'supplements',
    title: "Qo‘shimchalar: nima ishlaydi?",
    category: 'Ovqatlanish',
    minutes: 2,
    icon: 'spark',
    plate: 'white',
    summary: 'Pulni isrof qilmaslik uchun dalillar darajasi.',
    slides: [
      {
        title: 'A daraja: kreatin',
        text: "Eng ko‘p o‘rganilgan qo‘shimcha. Kuniga 3–5 g, har kuni — kuch va mushak o‘sishini oshiradi. Sog‘lom odamlar uchun xavfsiz.",
        scene: 'grades',
        source: 'kreider2017',
      },
      {
        title: 'A daraja: kofein',
        text: "3–6 mg/kg mashqdan ~60 daqiqa oldin. 70 kg uchun ~200–400 mg (2–4 chashka qahva). Kechki mashqdan oldin — uyquni buzadi.",
        scene: 'grades',
        source: 'guest2021',
      },
      {
        title: 'Pul isrofi',
        text: "Yetarli oqsil iste’mol qilganda BCAA foyda bermaydi. 'Yog‘ yoqardilar' va 'testosteron kuchaytirgichlar' ishonchli dalilga ega emas — ba’zilarida taqiqlangan moddalar topilgan.",
        scene: 'grades',
      },
    ],
    quiz: [{ q: 'Eng isbotlangan sport qo‘shimchasi?', options: ['BCAA', 'Kreatin monogidrat', "Yog‘ yoqardi"], correct: 1, explain: 'Kreatin — A daraja.' }],
  },
];

export const lessonById = (id: string) => LESSONS.find((l) => l.id === id);
