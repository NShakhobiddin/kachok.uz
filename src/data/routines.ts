// Tayyor mashg'ulotlar: uyda (kam jihoz bilan, asosan dumba, son, qorin va qomat), sog'liq uchun (shifokor va fizioterapevt
// tavsiyalariga asoslangan) va cho'zilish.
// Uydagi mashg'ulot oddiy mashg'ulot sifatida yoziladi (setlar, statistika); cho'zilish — taymerli rejimda.
import { EXERCISE_MAP } from './exercises';
import type { EquipmentId, Exercise } from '../types';

export interface RoutineItem {
  id: string;
  /** uyda: setlar soni */
  sets?: number;
  /** uyda: takror (yoki vaqtli mashqda soniya) oralig'i */
  reps?: [number, number];
  /** cho'zilish: ushlash vaqti (berilmasa — mashqdagi hold) */
  sec?: number;
}

/** Sog'liq uchun mashg'ulot: qaysi holat, kimning tavsiyasi, kimga mumkin emas va qachon to'xtash kerak */
export interface HealthInfo {
  /** holat: "Bel og'rig'i va umurtqa churrasi (grija)" */
  condition: string;
  /** asos: muallif yoki tashkilot, yil */
  source: string;
  who: string[];
  /** avval shifokor bilan maslahatlashing yoki bajarmang */
  caution: string[];
  /** darhol to'xtating */
  stop: string[];
  /** qancha va qancha vaqt */
  freq: string;
  /** mashqdan tashqari: yurish, tos tubi, nafas — matnli ko'rsatma */
  extras?: { title: string; text: string }[];
  /** keyin bajariladigan cho'zilish mashg'uloti */
  stretch?: string;
}

export interface Routine {
  id: string;
  kind: 'home' | 'stretch' | 'health';
  /** sog'liq uchun mashg'ulotlarda */
  health?: HealthInfo;
  title: string;
  /** qisqa tavsif: kimga va nima uchun */
  about: string;
  level: 1 | 2;
  /** shartli jihozlar (bo'lmasa mashg'ulot baribir ochiladi, kartada belgi chiqadi) */
  needs: EquipmentId[];
  items: RoutineItem[];
  /** uyda: setlar orasidagi dam (soniya) */
  rest?: number;
}

export const ROUTINES: Routine[] = [
  /* ===================== SOG'LIQ UCHUN ===================== */
  {
    id: 'health-back',
    kind: 'health',
    title: 'Bel uchun: McGill «Katta uchlik»',
    about:
      'Umurtqani bukmasdan va burmasdan bel atrofidagi mushaklar chidamliligini oshiradi. Asl dasturdagi «McGill qisqarishi» o‘rniga «o‘lik qo‘ng‘iz» olingan — bel ham neytral qoladi.',
    level: 1,
    needs: [],
    rest: 30,
    items: [
      { id: 'bird-dog', sets: 3, reps: [5, 6] },
      { id: 'side-plank', sets: 3, reps: [10, 15] },
      { id: 'dead-bug', sets: 3, reps: [5, 6] },
      { id: 'glute-bridge', sets: 2, reps: [10, 12] },
    ],
    health: {
      condition: 'Bel og‘rig‘i va umurtqa churrasi (grija) — o‘tkir davrdan keyin',
      source: 'Stuart McGill (Vaterloo universiteti, umurtqa biomexanikasi) — «Katta uchlik»; NICE NG59 (Buyuk Britaniya, 2016): bel og‘rig‘ida mashq — birinchi tavsiya',
      who: ['Bel og‘rig‘i yoki churrasi bor, shifokor faollikka ruxsat bergan', 'Uzoq o‘tiradiganlar — belni asrash uchun'],
      caution: [
        'Churra yangi aniqlangan yoki og‘riq oyoqqa tarqalsa — avval nevrolog yoki vertebrolog ko‘rigi',
        'O‘tkir og‘riqning birinchi 1–2 haftasida — faqat yengil yurish',
        'Chov yoki kindik churrasi bu mashqlar bilan davolanmaydi — jarroh bilan maslahatlashing',
      ],
      stop: ['Og‘riq oyoqqa tarqalsa yoki kuchaysa', 'Oyoqda uvishish yoki holsizlik paydo bo‘lsa', 'Siydik yoki axlatni tuta olmaslik, chot sohasi uvishishi — DARHOL tez yordam (103)'],
      freq: 'Har kuni yoki kunora, 6–8 hafta. Uyg‘ongandan keyin kamida 1 soat o‘tib (ertalab disk «shishgan» bo‘ladi). Har ushlash — 8–10 soniya.',
      extras: [
        { title: 'Boshida: mushuk–sigir', text: 'To‘rt oyoqda belni sekin yuqoriga va pastga 6–8 marta — faqat og‘riqsiz amplitudada. Bu cho‘zish emas, yumshoq harakatlantirish.' },
        { title: 'Har kuni yurish', text: 'Kuniga 20–30 daqiqa (bo‘lib bo‘lsa ham) tez yurish — bel og‘rig‘ida eng foydali harakatlardan biri.' },
        { title: 'Qilmang', text: 'Belni bukib press (krunch, «sit-up»), oyoqlarni tik ushlab egilish va burilib og‘ir ko‘tarish — tiklanguncha.' },
      ],
    },
  },
  {
    id: 'health-pregnancy',
    kind: 'health',
    title: 'Homiladorlikda: kuch va qulaylik',
    about: 'Bel og‘rig‘i, shish va charchoqni kamaytiradi, tug‘ruqqa tayyorlaydi. Chalqancha yotib bajariladigan mashqlarsiz — 2–3-trimestrga mos.',
    level: 1,
    needs: ['bands'],
    rest: 60,
    items: [
      { id: 'bw-squat', sets: 2, reps: [10, 12] },
      { id: 'band-row', sets: 2, reps: [12, 15] },
      { id: 'side-leg-raise', sets: 2, reps: [12, 15] },
      { id: 'clamshell', sets: 2, reps: [12, 15] },
      { id: 'bird-dog', sets: 2, reps: [6, 8] },
      { id: 'calf-raise', sets: 2, reps: [12, 15] },
    ],
    health: {
      condition: 'Asoratsiz homiladorlik',
      source: 'Amerika akusher-ginekologlar kolleji (ACOG), 804-xulosa, 2020; JSST (WHO) jismoniy faollik tavsiyasi, 2020',
      who: ['Asoratsiz homiladorlik, shifokor yoki akusher ruxsat bergan', 'Avval ham, endi boshlayotganlar ham — yengil boshlab, asta oshirib'],
      caution: [
        'Yurak yoki o‘pka kasalligi',
        'Bachadon bo‘yni yetishmovchiligi yoki serklyaj',
        '2–3-trimestrda qon ketishi; 26 haftadan keyin yo‘ldosh pastda (previa)',
        'Muddatidan oldin tug‘ruq xavfi yoki suv ketishi',
        'Preeklampsiya yoki homiladorlikdagi yuqori qon bosimi; og‘ir kamqonlik',
      ],
      stop: [
        'Qindan qon ketishi yoki suv kelishi',
        'Muntazam og‘riqli qisqarishlar',
        'Mashqdan oldin ham hansirash, ko‘krak og‘rig‘i',
        'Bosh aylanishi, kuchli bosh og‘rig‘i',
        'Boldir og‘rig‘i yoki shishi, muvozanatni buzadigan holsizlik',
      ],
      freq: 'Haftasiga 2–3 kun kuch mashqi + deyarli har kuni yurish yoki suzish (haftasiga jami 150 daqiqa). Tezlik — «gaplasha oladigan» darajada.',
      extras: [
        {
          title: 'Tos tubi mashqi (Kegel)',
          text: 'Siydikni to‘xtatayotgandek tos tubini siqib torting, 5–10 soniya ushlang, to‘liq bo‘shating. 10 marta, kuniga 3 mahal. Homiladorlikda va tug‘ruqdan keyin siydik tuta olmaslik xavfini kamaytiradi (Cochrane, 2020).',
        },
        { title: 'Qilmang', text: '2-trimestrdan chalqancha uzoq yotib mashq, qorinni bukuvchi press, yiqilish xavfi bor sport (ot, chang‘i), issiq xonada mashq, nafasni ushlab kuchanish.' },
        { title: 'Suv va harorat', text: 'Mashqdan oldin va keyin suv iching, salqin xonada shug‘ullaning — qizib ketmang.' },
      ],
    },
  },
  {
    id: 'health-postpartum',
    kind: 'health',
    title: 'Tug‘ruqdan keyin: tos tubi va qorin',
    about: 'Tos tubi va qorinning chuqur mushaklarini tiklaydi, belni qo‘llab-quvvatlaydi. Krunch va plankasiz — qorin mushaklari ajralgan (diastaz) bo‘lsa ham xavfsiz boshlanish.',
    level: 1,
    needs: [],
    rest: 45,
    items: [
      { id: 'glute-bridge', sets: 2, reps: [10, 12] },
      { id: 'dead-bug', sets: 2, reps: [6, 8] },
      { id: 'bird-dog', sets: 2, reps: [6, 8] },
      { id: 'clamshell', sets: 2, reps: [12, 15] },
      { id: 'side-leg-raise', sets: 2, reps: [12, 15] },
      { id: 'bw-squat', sets: 2, reps: [10, 12] },
    ],
    health: {
      condition: 'Tug‘ruqdan keyingi tiklanish (6 haftadan keyin, ko‘rikdan so‘ng)',
      source: 'Goom, Donnelly, Brockwell — tug‘ruqdan keyin faollikka qaytish bo‘yicha tavsiya (Buyuk Britaniya, 2019); Cochrane sharhi (Woodley va boshq., 2020) — tos tubi mashqlari',
      who: ['Tug‘ruqdan 6–8 hafta o‘tgan, shifokor ko‘rigidan o‘tgan', 'Kesar kesishdan keyin — odatda 8–12 hafta va shifokor ruxsati bilan'],
      caution: [
        'Qorin o‘rtasida bo‘rtiq yoki chuqurcha (diastaz) aniq bo‘lsa — fizioterapevt ko‘rigi',
        'Siydik tuta olmaslik yoki tos sohasida og‘irlik hissi — avval tos tubi mutaxassisi',
      ],
      stop: ['Qon ketishi kuchaysa', 'Siydik oqishi, tos sohasida og‘irlik yoki bosim', 'Chok sohasida og‘riq'],
      freq: 'Haftasiga 3–4 kun, 6–12 hafta. Tos tubi mashqi — har kuni. Yugurish va sakrashga — 12 haftadan oldin emas.',
      extras: [
        { title: 'Tos tubi mashqi (Kegel)', text: 'Siydikni to‘xtatayotgandek siqing, 5–10 soniya ushlang, to‘liq bo‘shating. 10 marta, kuniga 3 mahal. Keyin tez siqib-bo‘shatish ham 10 marta.' },
        { title: 'Qorin nafasi', text: 'Chalqancha, tizzalar bukik. Nafas chiqarganda qorin pastini ichkariga torting va tos tubini ko‘taring, 3–5 soniya. 10 marta — har mashqdan oldin.' },
      ],
    },
  },
  {
    id: 'health-knee',
    kind: 'health',
    title: 'Tizza artrozi: tizzani mustahkamlash',
    about: 'Son, dumba va boldir mushaklari kuchaysa, tizzaga tushadigan yuk kamayadi va og‘riq pasayadi. Artrozda mashq — dorilar bilan teng birinchi davolash.',
    level: 1,
    needs: [],
    rest: 45,
    items: [
      { id: 'bw-squat', sets: 3, reps: [8, 10] },
      { id: 'step-up', sets: 2, reps: [8, 10] },
      { id: 'glute-bridge', sets: 2, reps: [10, 12] },
      { id: 'side-leg-raise', sets: 2, reps: [12, 15] },
      { id: 'calf-raise', sets: 2, reps: [12, 15] },
      { id: 'wall-sit', sets: 2, reps: [20, 30] },
    ],
    health: {
      condition: 'Tizza osteoartrozi (artroz) va tizza og‘rig‘i',
      source: 'OARSI (Xalqaro osteoartrit tadqiqot jamiyati) tavsiyasi, 2019; GLA:D dasturi (Daniya, Skou va Roos)',
      who: ['Tizza artrozi tashxisi bor', 'Tizzasi og‘riydigan, ko‘p o‘tiradigan katta yoshlilar'],
      caution: ['Tizza qizarib shishgan va issiq bo‘lsa — avval shifokor', 'Yaqinda operatsiya yoki jarohat bo‘lgan bo‘lsa'],
      stop: ['Og‘riq mashqdan keyin 24 soatdan ko‘p kuchayib tursa', 'Tizza «qulflanib» qolsa yoki bo‘shab ketsa'],
      freq: 'Haftasiga 2–3 kun, kamida 6–8 hafta. O‘tirib-turishda stuldan foydalaning; zinaga chiqish — past (15–20 sm) pog‘onada, gantelsiz.',
      extras: [
        { title: 'Og‘riq qoidasi', text: 'Mashq paytida yengil og‘riq (10 balldan 2–3) — normal. Ertasi kunga o‘tib ketishi kerak; o‘tmasa — keyingi safar takrorni kamaytiring.' },
        { title: 'Isitish', text: '5–10 daqiqa velotrenajyor yoki yurish — bo‘g‘im suyuqligi «isiydi», harakat yengillashadi.' },
        { title: 'Vazn', text: 'Ortiqcha vazn 5–10% kamaysa, tizza og‘rig‘i sezilarli kamayadi (OARSI).' },
      ],
      stretch: 'stretch-after-legs',
    },
  },
  {
    id: 'health-bp',
    kind: 'health',
    title: 'Qon bosimi uchun: izometrik mashq',
    about: 'Devorga suyanib o‘tirish (izometrik) — tadqiqotlarda qon bosimini eng ko‘p tushirgan mashq turi. 4 marta 2 daqiqadan, haftasiga 3 kun.',
    level: 1,
    needs: [],
    rest: 120,
    items: [{ id: 'wall-sit', sets: 4, reps: [90, 120] }],
    health: {
      condition: 'Qon bosimi biroz yuqori yoki dori bilan nazoratdagi gipertoniya',
      source: 'Edwards va boshq., British Journal of Sports Medicine, 2023 — 270 ta tadqiqot meta-tahlili: izometrik mashqlar (ayniqsa devorga suyanib o‘tirish) qon bosimini eng ko‘p pasaytirgan',
      who: ['Qon bosimi 130–139/85–89 atrofida yoki dori bilan nazoratda', 'Shifokor jismoniy faollikka ruxsat bergan'],
      caution: ['Qon bosimi 160/100 dan yuqori yoki nazoratsiz — avval shifokor', 'Tinch holatda 180/110 dan yuqori bo‘lsa — mashq qilmang', 'Yurak kasalligi yoki insult o‘tkazgan bo‘lsa — faqat shifokor ruxsati bilan'],
      stop: ['Ko‘krak og‘rig‘i, yurak tez urib ketishi', 'Bosh aylanishi, ko‘z oldi qorong‘ilashishi', 'Kuchli bosh og‘rig‘i'],
      freq: 'Haftasiga 3 kun, 4–8 hafta. Pasayish odatda 4–6 haftada seziladi. Tizza burchagini shunday tanlangki, 2 daqiqa zo‘rg‘a chidash mumkin bo‘lsin.',
      extras: [
        { title: 'Nafasni ushlamang', text: 'Butun vaqt bir tekis nafas oling. Nafasni ushlab kuchanish qon bosimini keskin oshiradi.' },
        { title: 'Yurish', text: 'Haftasiga 150 daqiqa tez yurish (JSST) va tuzni kamaytirish — izometrik mashqning ta’sirini kuchaytiradi.' },
      ],
    },
  },
  {
    id: 'health-neck',
    kind: 'health',
    title: 'Bo‘yin va yelka og‘rig‘i (kompyuter ortida)',
    about: 'Ofis xodimlari uchun: yelka va kuraklar mushaklarini kuchaytiruvchi mashqlar bo‘yin–yelka og‘rig‘ini sezilarli kamaytirgan. Keyin — ofis cho‘zilishi.',
    level: 1,
    needs: ['bands', 'dumbbells'],
    rest: 45,
    items: [
      { id: 'band-row', sets: 3, reps: [12, 15] },
      { id: 'reverse-fly', sets: 3, reps: [12, 15] },
      { id: 'lateral-raise', sets: 2, reps: [10, 12] },
      { id: 'bird-dog', sets: 2, reps: [6, 8] },
    ],
    health: {
      condition: 'Ofisda ishlovchilarda bo‘yin va yelka og‘rig‘i',
      source: 'Andersen va boshq. (Daniya, 2008) — ofis xodimlarida maxsus kuch mashqlari bo‘yin og‘rig‘ini sezilarli kamaytirgan',
      who: ['Uzoq kompyuter yoki telefon bilan ishlaydiganlar', 'Surunkali bo‘yin–yelka tarangligi'],
      caution: ['Og‘riq qo‘lga tarqalsa yoki qo‘l uvishsa — avval nevrolog', 'Bo‘yin jarohati bo‘lgan bo‘lsa'],
      stop: ['Bosh aylanishi, ko‘z oldi qorong‘ilashishi', 'Qo‘lda uvishish yoki holsizlik'],
      freq: 'Haftasiga 3 kun, 20 daqiqadan, 10 hafta. Vaznni yengil boshlang: oxirgi 2–3 takror og‘ir, lekin texnika toza.',
      extras: [
        { title: 'Iyakni orqaga tortish', text: 'Boshni to‘g‘ri tutib, iyakni ichkariga torting («ikki qavat iyak»), 5 soniya ushlang. 10 marta, kuniga 2–3 mahal — ish joyida ham.' },
        { title: 'Har 30–45 daqiqada', text: 'Turib, yelkalarni orqaga 10 marta aylantiring va ekrandan uzoqqa qarang.' },
      ],
      stretch: 'stretch-office',
    },
  },

  /* ===================== UYDA ===================== */
  {
    id: 'home-glutes',
    kind: 'home',
    title: 'Dumba va son — jihozsiz',
    about: 'Dumba va sonni shakllantirish uchun asosiy uy mashg‘uloti: o‘tirish, hamla, ko‘prik va dumbaning yon mushagi uchun mashqlar.',
    level: 1,
    needs: [],
    rest: 45,
    items: [
      { id: 'bw-squat', sets: 3, reps: [12, 15] },
      { id: 'reverse-lunge', sets: 3, reps: [8, 12] },
      { id: 'single-leg-bridge', sets: 3, reps: [10, 12] },
      { id: 'side-leg-raise', sets: 2, reps: [15, 20] },
      { id: 'fire-hydrant', sets: 2, reps: [12, 15] },
      { id: 'wall-sit', sets: 2, reps: [30, 45] },
    ],
  },
  {
    id: 'home-band-glutes',
    kind: 'home',
    title: 'Mini-lenta bilan dumba',
    about: 'Halqa lenta dumbaning yon (o‘rta) mushagini ham ishlatadi — son va tos chizig‘i shakli uchun. Uyda ham, zalda ham bo‘ladi.',
    level: 1,
    needs: ['miniBand'],
    rest: 40,
    items: [
      { id: 'banded-lateral-walk', sets: 3, reps: [12, 15] },
      { id: 'glute-bridge', sets: 3, reps: [15, 20] },
      { id: 'clamshell', sets: 3, reps: [15, 20] },
      { id: 'glute-kickback', sets: 3, reps: [12, 15] },
      { id: 'fire-hydrant', sets: 2, reps: [12, 15] },
    ],
  },
  {
    id: 'home-beginner',
    kind: 'home',
    title: 'Butun tana — yangi boshlovchilar',
    about: 'Jihozsiz: oyoq, ko‘krak, orqa va tana markazi. Haftasiga 2–3 marta — kuch mashqlariga birinchi qadam.',
    level: 1,
    needs: [],
    rest: 45,
    items: [
      { id: 'bw-squat', sets: 3, reps: [10, 15] },
      { id: 'knee-push-up', sets: 3, reps: [6, 12] },
      { id: 'glute-bridge', sets: 3, reps: [12, 15] },
      { id: 'superman', sets: 2, reps: [10, 12] },
      { id: 'bird-dog', sets: 2, reps: [8, 10] },
      { id: 'plank', sets: 2, reps: [20, 40] },
    ],
  },
  {
    id: 'home-dumbbells',
    kind: 'home',
    title: 'Gantel bilan butun tana',
    about: 'Bir juft gantel yetarli: son, dumba, ko‘krak va yelka — zalga bormagan kunlar uchun to‘liq mashg‘ulot.',
    level: 2,
    needs: ['dumbbells'],
    rest: 60,
    items: [
      { id: 'sumo-squat', sets: 3, reps: [10, 12] },
      { id: 'db-rdl', sets: 3, reps: [10, 12] },
      { id: 'split-squat', sets: 3, reps: [8, 10] },
      { id: 'knee-push-up', sets: 3, reps: [8, 12] },
      { id: 'lateral-raise', sets: 3, reps: [12, 15] },
      { id: 'side-plank', sets: 2, reps: [20, 40] },
    ],
  },
  {
    id: 'home-core',
    kind: 'home',
    title: 'Qorin va tana markazi',
    about: 'Qorin pressi, yon mushaklar va bel barqarorligi — umurtqa tabiiy holatda qoladigan, belni yuklamaydigan mashqlar.',
    level: 1,
    needs: [],
    rest: 30,
    items: [
      { id: 'dead-bug', sets: 3, reps: [8, 10] },
      { id: 'reverse-crunch', sets: 3, reps: [10, 15] },
      { id: 'side-plank', sets: 2, reps: [20, 40] },
      { id: 'bicycle-crunch', sets: 2, reps: [16, 20] },
      { id: 'bird-dog', sets: 2, reps: [8, 10] },
      { id: 'plank', sets: 2, reps: [30, 45] },
    ],
  },
  {
    id: 'home-posture',
    kind: 'home',
    title: 'Qaddi-qomat — lenta bilan',
    about: 'Kompyuter va telefon ortida bukchayib qolgan yelkalar uchun: kuraklar, orqa delta va bel. Rezina lenta kerak.',
    level: 1,
    needs: ['bands'],
    rest: 40,
    items: [
      { id: 'band-row', sets: 3, reps: [12, 15] },
      { id: 'reverse-fly', sets: 3, reps: [15, 20] },
      { id: 'superman', sets: 2, reps: [10, 12] },
      { id: 'bird-dog', sets: 2, reps: [8, 10] },
      { id: 'glute-bridge', sets: 2, reps: [15, 20] },
    ],
  },

  /* ===================== CHO‘ZILISH ===================== */
  {
    id: 'stretch-morning',
    kind: 'stretch',
    title: 'Ertalabki uyg‘onish',
    about: 'Uyqudan keyin qotgan umurtqa, tos va yelkani yumshatadi. Gilamcha ustida.',
    level: 1,
    needs: [],
    items: [{ id: 'cat-cow' }, { id: 'thread-needle' }, { id: 'down-dog' }, { id: 'hip-flexor-stretch' }, { id: 'cobra', sec: 20 }, { id: 'childs-pose' }],
  },
  {
    id: 'stretch-office',
    kind: 'stretch',
    title: 'Kompyuterdan keyin: bo‘yin va yelka',
    about: 'Uzoq o‘tirgandan keyin bo‘yin, yelka va ko‘krak tarangligini bo‘shatadi — birinchi uchtasini ishxonada ham bajarsa bo‘ladi.',
    level: 1,
    needs: [],
    items: [{ id: 'neck-stretch' }, { id: 'cross-body-shoulder' }, { id: 'doorway-chest' }, { id: 'thread-needle' }, { id: 'cat-cow' }, { id: 'childs-pose' }],
  },
  {
    id: 'stretch-back-hips',
    kind: 'stretch',
    title: 'Bel va tos uchun',
    about: 'Tos old qismi, dumba va son orqasi bo‘shasa, belga tushadigan taranglik kamayadi.',
    level: 1,
    needs: [],
    items: [{ id: 'cat-cow' }, { id: 'childs-pose' }, { id: 'hip-flexor-stretch' }, { id: 'figure-four' }, { id: 'hamstring-stretch' }, { id: 'supine-twist' }, { id: 'butterfly' }],
  },
  {
    id: 'stretch-after-legs',
    kind: 'stretch',
    title: 'Oyoq mashqidan keyin',
    about: 'Son oldi, son orqasi, dumba, son ichki qismi va boldir — oyoq kunidan keyin sekin tinchlanish uchun.',
    level: 1,
    needs: [],
    items: [{ id: 'quad-stretch' }, { id: 'hamstring-stretch' }, { id: 'figure-four' }, { id: 'butterfly' }, { id: 'calf-stretch' }, { id: 'hip-flexor-stretch' }],
  },
  {
    id: 'stretch-evening',
    kind: 'stretch',
    title: 'Uyqudan oldin',
    about: 'Yotib bajariladigan sokin cho‘zilishlar va sekin nafas — kun tarangligini tushirib, uyquga tayyorlaydi.',
    level: 1,
    needs: [],
    items: [{ id: 'childs-pose', sec: 45 }, { id: 'supine-twist' }, { id: 'figure-four' }, { id: 'hamstring-stretch' }, { id: 'butterfly', sec: 45 }],
  },
  {
    id: 'stretch-hips-deep',
    kind: 'stretch',
    title: 'Tos-son harakatchanligi',
    about: 'Chuqurroq cho‘zilishlar: kaptar pozasi, kapalak va tos oldi. O‘tirish chuqurligi va tos erkinligi uchun.',
    level: 2,
    needs: [],
    items: [{ id: 'cat-cow' }, { id: 'down-dog' }, { id: 'hip-flexor-stretch', sec: 40 }, { id: 'pigeon', sec: 40 }, { id: 'butterfly' }, { id: 'figure-four' }],
  },
  {
    id: 'stretch-gentle',
    kind: 'stretch',
    title: 'Og‘ir kunlar uchun yengil',
    about: 'Hayz kunlari yoki charchaganda: qorin va belni bo‘shatadigan sokin pozalar. Ba’zilarga og‘riqni yengillashtiradi; kuchli og‘riqda shifokorga murojaat qiling.',
    level: 1,
    needs: [],
    items: [{ id: 'childs-pose', sec: 45 }, { id: 'cat-cow' }, { id: 'supine-twist' }, { id: 'butterfly', sec: 45 }, { id: 'figure-four' }],
  },
];

export const ROUTINE_MAP: Record<string, Routine> = Object.fromEntries(ROUTINES.map((r) => [r.id, r]));

/** Mashg'ulotdagi mashqlar (mavjudlari) */
export const routineExercises = (r: Routine): { item: RoutineItem; ex: Exercise }[] =>
  r.items.flatMap((item) => (EXERCISE_MAP[item.id] ? [{ item, ex: EXERCISE_MAP[item.id] }] : []));

/** Cho'zilishda bitta ushlash (soniya) */
export const holdSec = (item: RoutineItem, ex: Exercise) => item.sec ?? ex.hold ?? 30;

/** Cho'zilish ketma-ketligi: har tomonga alohida qadam, o'tish uchun 8 soniya */
export const TRANSITION_SEC = 8;
export interface StretchStep {
  ex: Exercise;
  sec: number;
  side?: 'o‘ng' | 'chap';
}
export function stretchSteps(r: Routine): StretchStep[] {
  return routineExercises(r).flatMap(({ item, ex }) => {
    const sec = holdSec(item, ex);
    return ex.perSide ? [{ ex, sec, side: 'o‘ng' as const }, { ex, sec, side: 'chap' as const }] : [{ ex, sec }];
  });
}

/** Taxminiy davomiylik (daqiqa) */
export function routineMinutes(r: Routine): number {
  if (r.kind === 'stretch') {
    const s = stretchSteps(r).reduce((a, st) => a + st.sec + TRANSITION_SEC, 0);
    return Math.max(1, Math.round(s / 60));
  }
  const rest = r.rest ?? 45;
  const s = routineExercises(r).reduce((a, { item, ex }) => {
    const sets = item.sets ?? 3;
    const reps = item.reps ? (item.reps[0] + item.reps[1]) / 2 : 10;
    const work = ex.timed ? reps : reps * 3.2;
    return a + sets * (work * (ex.unilateral ? 2 : 1) + rest) + 30;
  }, 0);
  return Math.max(5, Math.round(s / 60 / 5) * 5);
}

/** Uyda mashq qilsa bo'ladigan jihozlar (jihozsiz mashqlar ham shu bo'limda) */
export const HOME_EQUIPMENT: EquipmentId[] = ['dumbbells', 'kettlebell', 'bands', 'miniBand', 'fitball', 'box', 'pullupBar'];
export const isHomeExercise = (ex: Exercise) =>
  ex.equipment.every((e) => HOME_EQUIPMENT.includes(e)) && (!ex.equipmentAny || ex.equipmentAny.some((e) => HOME_EQUIPMENT.includes(e)));
