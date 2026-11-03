// Qo‘shimcha trenajyor va jihozlardagi mashqlar: abduktor/adduktor, blok, o‘tirib boldir, gravitron, Skott skameykasi, T-shtanga, press roligi.
import type { AnimSpec, Exercise, FrontPose, SidePose } from '../types';
import { AY, CX, ankle, con, ecc } from './anims';
import { BREATH_BRACE, BREATH_PRESS, BREATH_PULL } from './exerciseText';
import { add, cw, dir, mul } from '../lib/figure';

type S = SidePose;
type Fp = FrontPose;

/* ===================== ANIMATSIYALAR ===================== */

/** O‘tirib sonni ochish: orqadan ko‘rinish — dumba ko‘rinib turadi, tizzalar tashqariga ochiladi */
function hipAbduction(): AnimSpec {
  const base = { hipY: 150, legFwd: 76, ua: 166, fa: 174 };
  const closed: Fp = { ...base, th: 178, sh: 179 };
  const open: Fp = { ...base, th: 146, sh: 170 };
  return {
    view: 'back',
    props: [{ kind: 'seatFront', x: CX, y: 158, w: 50 }],
    frames: con(closed, open, { move1: 1100, hold2: 600, move2: 1900 }),
    frame: { x: 18, y: 30, w: 204, h: 190 },
  };
}

/** O‘tirib sonni yopish: old ko‘rinish — son ichki qismi ko‘rinadi */
function hipAdduction(): AnimSpec {
  const base = { hipY: 150, legFwd: 76, ua: 166, fa: 174 };
  const open: Fp = { ...base, th: 144, sh: 170 };
  const closed: Fp = { ...base, th: 178, sh: 179 };
  return {
    view: 'front',
    props: [{ kind: 'seatFront', x: CX, y: 158, w: 50 }],
    frames: con(open, closed, { move1: 1100, hold2: 600, move2: 1900 }),
    frame: { x: 18, y: 30, w: 204, h: 190 },
  };
}

/** Blokda oyoqni orqaga uzatish: blokka yuzlanib, to‘piq manjeti bilan */
function cableKickback(): AnimSpec {
  const base = { torso: 24, head: 34, ua: 0, fa: 0, hand: { x: 166, y: 100 }, foot2: { x: 100, y: AY }, ft2: 90 };
  const start: S = { ...base, th: 150, sh: 196, ft: 110 };
  const end: S = { ...base, th: 212, sh: 226, ft: 140 };
  return {
    view: 'side',
    anchor: { joint: 'hip', x: 100, y: 120 },
    footGear: { kind: 'anklePad' },
    props: [{ kind: 'cableTower', x: 178, y: 200 }],
    frames: con(start, end, { move1: 1000, hold2: 600, move2: 1800 }),
    frame: { x: 14, y: 16, w: 206, h: 204 },
  };
}

/** Blokda oyoq orasidan tortish: blokka orqa o‘girib, arqon oyoqlar orasidan */
function cablePullThrough(): AnimSpec {
  const top: S = { torso: 2, head: 2, ua: 180, fa: 180, th: 180, sh: 180, hand: { x: 124, y: 132 } };
  const bottom: S = { torso: 66, head: 52, ua: 180, fa: 180, th: 150, sh: 190, hand: { x: 110, y: 154 } };
  return {
    view: 'side',
    anchor: ankle(118),
    held: { kind: 'cable', from: { x: 34, y: 200 } },
    props: [{ kind: 'cableTower', x: 30, y: 200 }],
    frames: ecc(top, bottom, { move1: 2000, move2: 1200 }),
    frame: { x: 14, y: 16, w: 206, h: 204 },
  };
}

/** O‘tirib boldir ko‘tarish: oyoq uchi platformada qotgan, tizza yostig‘i son ustida */
function seatedCalfRaise(): AnimSpec {
  const toe = { x: 150, y: 196 };
  const pose = (ft: number): S => {
    const d = dir(ft);
    // oyoq uchi joyida qolishi uchun to‘piqni hisoblaymiz (footFrom teskarisi)
    const foot = add(add(toe, mul(d, -15)), mul(cw(d), -6));
    return { torso: 6, head: 8, ua: 0, fa: 0, th: 90, sh: 180, ft, foot, hand: { x: foot.x - 14, y: foot.y - 52 } };
  };
  return {
    view: 'side',
    anchor: { joint: 'hip', x: 84, y: 150 },
    footGear: { kind: 'kneePad' },
    props: [
      { kind: 'seat', x: 56, y: 158, w: 52, h: 8 },
      { kind: 'box', x: 138, y: 196, w: 24, h: 18 },
    ],
    frames: ecc(pose(122), pose(72), { hold1: 500, move1: 1600, hold2: 1100, move2: 1100 }),
    frame: { x: 30, y: 50, w: 190, h: 170 },
  };
}

/** Gravitronda tortilish: tizzalar yostiqda, yostiq tanani pastdan itaradi */
function assistedPullUp(): AnimSpec {
  const base = { ua: 0, fa: 0, th: 180, sh: 268, ft: 245, hand: { x: 120, y: 32 } };
  const bottom: S = { ...base, torso: -2, head: 0, at: { x: 112, y: 142 } };
  const top: S = { ...base, torso: -8, head: -6, at: { x: 114, y: 98 } };
  return {
    view: 'side',
    anchor: { joint: 'hip', x: 112, y: 142 },
    footGear: { kind: 'anklePad' },
    props: [
      { kind: 'cableTower', x: 30, y: 30 },
      { kind: 'pullupBar', x: 120, y: 30, w: 28 },
    ],
    frames: con(bottom, top, { hold1: 500, move1: 1300, hold2: 400, move2: 2000 }),
    frame: { x: 14, y: -6, w: 206, h: 226 },
  };
}

/** Skott skameykasida bitseps: qo‘lning yuqori qismi qiya yostiqda qotgan */
function preacherCurl(): AnimSpec {
  const base = { torso: 14, head: 22, ua: 138, th: 92, sh: 180, foot: { x: 128, y: AY } };
  const bottom: S = { ...base, fa: 160 };
  const top: S = { ...base, fa: 30 };
  return {
    view: 'side',
    anchor: { joint: 'hip', x: 84, y: 148 },
    held: { kind: 'ezbar' },
    props: [
      { kind: 'legPressFrame', x: 150, y: 212, w: 86, angle: 111 },
      { kind: 'seat', x: 60, y: 156, w: 46, h: 8 },
      { kind: 'pad', x: 94, y: 104, w: 36, h: 9, angle: 48 },
    ],
    frames: con(bottom, top, { move1: 1100, hold2: 400, move2: 2400 }),
    frame: { x: 30, y: 40, w: 190, h: 180 },
  };
}

/** T-shtanga tortish: engashgan holat, grif oyoqlar orasida, V-tutqich */
function tBarRow(): AnimSpec {
  const base = { torso: 52, head: 40, ua: 0, fa: 0, th: 156, sh: 190 };
  return {
    view: 'side',
    anchor: ankle(),
    held: { kind: 'barbell' },
    frames: con({ ...base, hand: { x: 147, y: 150 } }, { ...base, hand: { x: 124, y: 120 } }),
  };
}

/** Press roligi: tiz cho‘kib, tanani oldinga cho‘zish va qaytish */
function abWheel(): AnimSpec {
  const base = { ua: 180, fa: 180, sh: 270, ft: 200 };
  const start: S = { ...base, torso: 66, head: 100, curve: 0.25, th: 182, hand: { x: 106, y: 198 } };
  const end: S = { ...base, torso: 68, head: 80, th: 244, hand: { x: 196, y: 198 } };
  return {
    view: 'side',
    anchor: { joint: 'knee', x: 58, y: 207 },
    held: { kind: 'plate' },
    props: [{ kind: 'mat', x: 0, y: 0, w: 220 }],
    frames: ecc(start, end, { hold1: 400, move1: 2000, hold2: 400, move2: 1500 }),
    frame: { x: 0, y: 90, w: 220, h: 130 },
  };
}


/* ===================== MASHQLAR ===================== */

export const MACHINE_EXERCISES: Exercise[] = [
  /* ---------- Dumba va son: abduktor / adduktor ---------- */
  {
    id: 'hip-abduction',
    name: 'Trenajyorda sonni ochish',
    en: 'Machine Hip Abduction',
    pattern: 'glute',
    mechanics: 'isolation',
    primary: ['glutes'],
    secondary: [],
    equipment: ['hipAbAd'],
    level: 1,
    score: 5,
    loadType: 'machine',
    increment: 5,
    caution: ['hip'],
    setup: [
      'O‘rindiqqa orqangizni suyanchiqqa tirab o‘tiring, oyoqlarni tayanchlarga qo‘ying.',
      'Yostiqlar sonning tashqi tomonida, tizzadan biroz yuqorida tursin; boshlang‘ich holatda tizzalar deyarli yopiq.',
    ],
    steps: [
      'Tizzalarni yostiqlarga qarshi tashqariga iloji boricha keng oching.',
      'Eng keng nuqtada 1 soniya ushlang — dumbaning yon-yuqori qismi qisqarganini his qiling.',
      '2–3 soniyada nazorat bilan yoping, og‘irlik bloki taqillab tushmasin.',
    ],
    cues: [
      'Asosan dumbaning o‘rta mushagi (gluteus medius) ishlaydi — yurganda tosni barqaror ushlovchi mushak',
      'Gavdani biroz oldinga engashtirsangiz, dumba katta mushagining yuqori qismi ko‘proq qatnashadi',
      'Tutqichlarni ushlab, tosni o‘rindiqqa bosib turing',
    ],
    breathing: BREATH_PRESS,
    mistakes: [
      {
        title: 'Vaznni silkitib ochish',
        why: 'Inersiya ishlaydi, mushak emas; eng keng nuqtada yuklama yo‘qoladi.',
        fix: 'Yengilroq vazn, oxirida 1 soniya ushlang va sekin yoping.',
      },
      {
        title: 'Yarim amplituda',
        why: 'Dumba mushagi qisqargan holatgacha yetib bormaydi.',
        fix: 'Vaznni kamaytirib, tizzalarni oxirigacha oching.',
        demo: { rom: 0.45 },
      },
      {
        title: 'Tos o‘rindiqdan ko‘tariladi',
        why: 'Gavda bilan «yordam berasiz» — ish dumbadan belga o‘tadi.',
        fix: 'Tutqichlarni mahkam ushlab, dumbani o‘rindiqqa bosing.',
      },
    ],
    benefits: [
      { id: 'balance', text: 'Dumbaning o‘rta mushagi bir oyoqda turish, yurish va zinapoyaga chiqishda tosni tekis ushlaydi.' },
      { id: 'joints', text: 'Son bo‘g‘imini yon tomondan barqarorlashtiruvchi mushaklarni kuchaytiradi.' },
    ],
    anim: hipAbduction(),
  },
  {
    id: 'hip-adduction',
    name: 'Trenajyorda sonni yopish',
    en: 'Machine Hip Adduction',
    pattern: 'adduction',
    mechanics: 'isolation',
    primary: ['adductors'],
    secondary: [],
    equipment: ['hipAbAd'],
    level: 1,
    score: 5,
    loadType: 'machine',
    increment: 5,
    caution: ['hip'],
    setup: [
      'O‘rindiqqa orqangizni suyanchiqqa tirab o‘tiring, oyoqlarni tayanchlarga qo‘ying.',
      'Yostiqlar sonning ichki tomonida, tizzadan biroz yuqorida tursin.',
      'Boshlang‘ich kenglikni chovda yengil cho‘zilish seziladigan, lekin og‘riqsiz qilib sozlang.',
    ],
    steps: [
      'Sonlarni yostiqlarga qarshi bir-biriga yaqinlashtiring.',
      'Yostiqlar deyarli tekkanda 1 soniya qising.',
      '2–3 soniyada nazorat bilan oching — keng nuqtada «sakramang».',
    ],
    cues: [
      'Son ichki mushaklari (adduktorlar) ishlaydi — ular tosni barqaror ushlaydi va o‘tirib-turishda ham qatnashadi',
      'Boshlang‘ich kenglikni haftalar davomida asta oshiring',
      'Gavda tik, tos o‘rindiqqa bosilgan',
    ],
    breathing: BREATH_PRESS,
    mistakes: [
      {
        title: 'Juda keng boshlash',
        why: 'Chov paylari va son ichki mushaklari og‘irlik ostida haddan ortiq cho‘ziladi — tortilish xavfi.',
        fix: 'Boshlang‘ich holatni og‘riqsiz kenglikka sozlang, chuqurlikni asta oshiring.',
      },
      {
        title: 'Vaznni silkitib yopish',
        why: 'Yostiqlar bir-biriga urilib to‘xtaydi, mushak qisqarishi qisqa bo‘ladi.',
        fix: 'Yopilganda 1 soniya ushlang, ochishni 2–3 soniyada bajaring.',
        demo: { rom: 0.5 },
      },
    ],
    benefits: [
      { id: 'joints', text: 'Son ichki mushaklarining zaifligi chov tortilishi bilan bog‘liq — ularni kuchaytirish chovni himoya qilishga yordam beradi.' },
      { id: 'balance', text: 'Tos va son bo‘g‘imini barqaror ushlovchi mushaklar muvozanatli rivojlanadi.' },
    ],
    anim: hipAdduction(),
  },

  /* ---------- Dumba: blok ---------- */
  {
    id: 'cable-kickback',
    name: 'Blokda oyoqni orqaga uzatish',
    en: 'Cable Glute Kickback',
    pattern: 'glute',
    mechanics: 'isolation',
    primary: ['glutes'],
    secondary: ['hamstrings'],
    equipment: ['cable'],
    level: 1,
    score: 6,
    loadType: 'cable',
    unilateral: true,
    increment: 2.5,
    caution: ['lowerBack'],
    setup: [
      'Ishchi oyoqqa to‘piq manjetini (tasmasini) taqib, uni pastki blokka ulang.',
      'Blokka yuzlanib, 1–2 qadam orqaga chiqing; ramani ikki qo‘l bilan ushlab, gavdani 20–30° oldinga engashtiring.',
      'Tayanch oyoq tizzasi yengil bukik, qorin tarang.',
    ],
    steps: [
      'Ishchi oyoqni sondan orqaga uzating — tizza deyarli qimirlamaydi, harakat son bo‘g‘imida.',
      'Oyoq gavda chizig‘iga yetganda dumbani 1 soniya qising.',
      'Nazorat bilan oldinga qaytaring — tros bo‘shab qolmasin.',
      'Bir tomonni tugatib, ikkinchi oyoqqa o‘ting.',
    ],
    cues: [
      'Oyoqni baland ko‘tarish uchun belni egmang — dumba qisqarishi tugagan joyda to‘xtang',
      'Tos blokka qaragan holda qolsin, yon tomonga burilmasin',
      'Tovon bilan orqaga «itaring»',
    ],
    breathing: BREATH_PRESS,
    mistakes: [
      {
        title: 'Bel egilib ketadi',
        why: 'Oyoq tos chizig‘idan yuqoriga «otilsa», harakat dumbadan belga o‘tadi — bel bo‘g‘imchalari siqiladi.',
        fix: 'Amplitudani gavda chizig‘igacha cheklang, qorinni tarang qiling, vaznni kamaytiring.',
        demo: { set: [{ kf: 2, pose: { torso: 8, head: 12, th: 236, sh: 246 } }, { kf: 3, pose: { torso: 8, head: 12, th: 236, sh: 246 } }] },
      },
      {
        title: 'Tos yon tomonga buraladi',
        why: 'Oyoq yonga ketadi, dumba katta mushagi kamroq ishlaydi.',
        fix: 'Ikkala son parallel, tos blokka qaragan bo‘lsin.',
      },
    ],
    benefits: [
      { id: 'balance', text: 'Bir oyoqda turib bajariladi — tayanch oyoqda muvozanat ham mashq qilinadi.' },
      { id: 'backHealth', text: 'Har bir dumbani alohida kuchaytiradi; kuchli dumba belni yengillashtiradi.' },
    ],
    anim: cableKickback(),
  },
  {
    id: 'cable-pull-through',
    name: 'Blokda oyoq orasidan tortish',
    en: 'Cable Pull-Through',
    pattern: 'hinge',
    mechanics: 'compound',
    primary: ['glutes', 'hamstrings'],
    secondary: ['lowerBack', 'forearms'],
    equipment: ['cable'],
    level: 1,
    score: 6,
    loadType: 'cable',
    increment: 2.5,
    caution: ['lowerBack'],
    setup: [
      'Arqonni pastki blokka ulang. Blokka orqa o‘girib, arqonni oyoqlar orasidan ikki qo‘l bilan ushlang.',
      '2 qadam oldinga chiqing — tros taranglashsin. Oyoqlar yelkadan biroz keng, tizzalar yengil bukik.',
    ],
    steps: [
      'Tosni orqaga surib engashing — qo‘llar oyoqlar orasidan orqaga ketadi, bel tekis.',
      'Son orqasi cho‘zilganini sezganda (gavda taxminan 45°) to‘xtang.',
      'Tosni oldinga itarib tik turing va tepada dumbani 1 soniya qising.',
    ],
    cues: [
      'Qo‘llar faqat ilgak — arqonni qo‘l bilan emas, tos bilan torting',
      'Tepada belni orqaga egmang: tik turish yetarli',
      'Shtangali tortishlardan oldin «tosdan bukilish»ni o‘rganish uchun qulay',
    ],
    breathing: BREATH_BRACE,
    mistakes: [
      {
        title: 'Bel dumaloqlanadi',
        why: 'Engashish tosdan emas, umurtqadan bo‘ladi — bel disklariga yuklama oshadi.',
        fix: 'Ko‘krakni ochiq tuting, faqat bel tekis qoladigan chuqurlikkacha engashing.',
        demo: { set: [{ kf: 2, pose: { curve: 0.65 } }, { kf: 3, pose: { curve: 0.65 } }] },
      },
      {
        title: 'O‘tirib-turishga aylanadi',
        why: 'Tizzalar ko‘p bukilsa, ish son oldiga o‘tadi — dumba va son orqasi kam cho‘ziladi.',
        fix: 'Tizzalar yengil bukik qolsin, harakatni tosni orqaga surishdan boshlang.',
      },
    ],
    benefits: [
      { id: 'backHealth', text: 'Tosdan bukilish ko‘nikmasini o‘rgatadi — yerdan narsa ko‘targanda belni asraydi.' },
      { id: 'posture', text: 'Dumba va son orqasi — tanani tik ushlovchi orqa zanjir mushaklari kuchayadi.' },
    ],
    anim: cablePullThrough(),
  },

  /* ---------- Boldir ---------- */
  {
    id: 'seated-calf-raise',
    name: 'O‘tirib boldir ko‘tarish',
    en: 'Seated Calf Raise',
    pattern: 'calf',
    mechanics: 'isolation',
    primary: ['calves'],
    secondary: [],
    equipment: ['seatedCalf'],
    level: 1,
    score: 5,
    loadType: 'machine',
    increment: 5,
    setup: [
      'O‘tirib, oyoq panjalarini (kaftning old qismini) platforma chetiga qo‘ying — tovonlar havoda.',
      'Tizza yostig‘ini sonning pastki qismiga, tizzadan biroz yuqoriga mahkam tushiring.',
      'Tovonni biroz ko‘tarib, ushlagichni (stoporni) oling.',
    ],
    steps: [
      'Tovonlarni pastga tushirib boldirni to‘liq cho‘zing, pastda 1–2 soniya to‘xtang.',
      'Panjalarda iloji boricha baland ko‘tariling.',
      'Tepada 1 soniya qisib, sekin tushiring. Set oxirida ushlagichni qaytaring.',
    ],
    cues: [
      'Tizza bukik — asosan kambalasimon mushak ishlaydi; tik turib boldir ko‘tarish bilan birga bajaring',
      'Pastki cho‘zilgan nuqtadagi pauza «prujina» effektini yo‘qotadi',
      'Og‘irlik bosh barmoq tomonda — oyoq tashqariga ag‘darilmasin',
    ],
    breathing: BREATH_PRESS,
    mistakes: [
      {
        title: 'Tez «prujina» qilish',
        why: 'Axill payi elastikligi ishni oladi, mushak emas.',
        fix: 'Pastda 1–2 soniya to‘xtang, sekin ko‘tariling.',
        demo: { rom: 0.5 },
      },
      {
        title: 'Faqat yuqori yarmida ishlash',
        why: 'Boldir cho‘zilgan holatda ishlamaydi — o‘sish stimuli kamayadi.',
        fix: 'Tovonni platformadan pastga to‘liq tushiring.',
        demo: { rom: 0.4 },
      },
    ],
    benefits: [
      { id: 'balance', text: 'Kambalasimon mushak yurish va yugurishda oyoqni itaradi va tik turganda muvozanatni ushlaydi.' },
      { id: 'heart', text: 'Boldir mushaklari qisqarganda oyoqdagi venoz qonni yuqoriga haydaydi.' },
    ],
    anim: seatedCalfRaise(),
  },

  /* ---------- Orqa ---------- */
  {
    id: 'assisted-pull-up',
    name: 'Gravitronda tortilish',
    en: 'Assisted Pull-up (Gravitron)',
    pattern: 'vPull',
    mechanics: 'compound',
    primary: ['lats'],
    secondary: ['biceps', 'upperBack', 'rearDelts', 'forearms'],
    equipment: ['assistedPullup'],
    level: 1,
    score: 7,
    loadType: 'machine',
    assisted: true,
    increment: 5,
    caution: ['shoulder', 'elbow'],
    setup: [
      'Yordam og‘irligini tanlang: blokdagi kg sizni yuqoriga itaradi — qancha ko‘p bo‘lsa, mashq shuncha oson.',
      'Zinapoyaga chiqib tutqichlarni ushlang, so‘ng tizzalarni birin-ketin yostiqqa qo‘ying (ba’zi trenajyorlarda oyoq bilan turiladi).',
      'Qo‘llar to‘liq cho‘zilguncha sekin pastga tushing.',
    ],
    steps: [
      'Kuraklarni pastga tushirib, tirsaklarni pastga va orqaga tortib ko‘tariling.',
      'Iyak tutqichlardan oshguncha torting.',
      '2–3 soniyada nazorat bilan tushing, pastda qo‘llarni to‘liq yozing.',
    ],
    cues: [
      'Maqsad — yordamni kamaytirish: rejadagi takrorlar oson bo‘lsa, keyingi safar yordam og‘irligini 5 kg ga kamaytiring',
      'Tortiladigan yuk = tana vazni − yordam: 60 kg vaznda 25 kg yordam bilan taxminan 35 kg tortasiz',
      'Yordamsiz 3–5 marta tortila olsangiz — turnikka o‘ting',
    ],
    breathing: BREATH_PULL,
    mistakes: [
      { title: 'Yarim amplituda', why: 'Keng orqa mushagi to‘liq cho‘zilmaydi va qisqarmaydi.', fix: 'Pastda qo‘llarni to‘liq yozing, tepada iyak tutqichdan oshsin.', demo: { rom: 0.45 } },
      { title: 'Pastga «tushib ketish»', why: 'Tez tushganda yelka bo‘g‘imi pastda zarba oladi, tushirish fazasidagi foyda yo‘qoladi.', fix: 'Pastga 2–3 soniyada tushing, yelkalar pastda biroz faol.' },
      { title: 'Juda katta yordam', why: 'Mashq juda oson bo‘lib qoladi — orqa mushaklari yetarli yuklama olmaydi.', fix: 'Yordamni 8–12 takror qiyin bo‘ladigan darajaga tushiring.' },
    ],
    benefits: [
      { id: 'posture', text: 'Turnikda mustaqil tortilishga bosqichma-bosqich tayyorlaydi, keng orqa va tik qaddi-qomat.' },
      { id: 'grip', text: 'Qo‘l siqish kuchi.' },
    ],
    anim: assistedPullUp(),
  },
  {
    id: 't-bar-row',
    name: 'T-shtanga tortish',
    en: 'T-Bar Row',
    pattern: 'hPull',
    mechanics: 'compound',
    primary: ['lats', 'upperBack'],
    secondary: ['rearDelts', 'biceps', 'lowerBack', 'forearms'],
    equipment: ['tbar'],
    level: 2,
    score: 8,
    loadType: 'barbell',
    increment: 2.5,
    avoid: ['lowerBack'],
    setup: [
      'Grifning bir uchi burchakka yoki tayanchga (landmine) qotirilgan; disklarni ikkinchi uchiga taqib, qisqich bilan mahkamlang.',
      'Grifni oyoqlar orasiga olib turing (T-tortish trenajyorida — platformaga chiqing), V-tutqichni disklar yonida grif ostiga ilib ushlang.',
      'Tosni orqaga surib engashing: gavda polga nisbatan taxminan 45°, tizzalar bukik, bel tekis.',
    ],
    steps: [
      'Grifni qorinning yuqori qismiga torting, tirsaklar tana yonidan orqaga.',
      'Kuraklarni qisib 1 soniya ushlang.',
      'Qo‘llar to‘liq cho‘zilguncha nazorat bilan tushiring — disklar polga urilmasin.',
    ],
    cues: [
      'Gavda burchagi o‘zgarmasin — ko‘krak bilan grifga «yetib bormang»',
      'Neytral ushlash (kaftlar bir-biriga qaragan) bilakka qulay',
      'Grif bir uchidan qotirilgan: yo‘li yoy bo‘ylab, shtanga bilan tortishdan muvozanat osonroq',
    ],
    breathing: BREATH_PULL,
    mistakes: [
      {
        title: 'Gavda bilan silkitish',
        why: 'Bel yuklanadi, orqa mushaklari kam ishlaydi.',
        fix: 'Vaznni kamaytiring, gavdani qotiring.',
        demo: { set: [{ kf: 2, pose: { torso: 30, head: 20 } }, { kf: 3, pose: { torso: 30, head: 20 } }] },
      },
      {
        title: 'Bel dumaloq',
        why: 'Engashgan holatda umurtqaga xavfli yuklama.',
        fix: 'Ko‘krakni oldinga chiqarib belni tekislang, kerak bo‘lsa vaznni kamaytiring.',
        demo: { set: [{ kf: 0, pose: { curve: 0.7 } }, { kf: 1, pose: { curve: 0.7 } }, { kf: 2, pose: { curve: 0.7 } }, { kf: 3, pose: { curve: 0.7 } }] },
      },
    ],
    benefits: [
      { id: 'posture', text: 'Kuraklarni orqaga tortuvchi mushaklar — tik qaddi-qomat.' },
      { id: 'grip', text: 'Qo‘l siqish kuchi.' },
    ],
    anim: tBarRow(),
  },

  /* ---------- Bitseps ---------- */
  {
    id: 'preacher-curl',
    name: 'Skott skameykasida bitseps',
    en: 'Preacher Curl',
    pattern: 'biceps',
    mechanics: 'isolation',
    primary: ['biceps'],
    secondary: ['forearms'],
    equipment: ['preacher'],
    equipmentAny: ['ezBar', 'dumbbells'],
    level: 1,
    score: 7,
    loadType: 'barbell',
    increment: 2.5,
    caution: ['elbow'],
    setup: [
      'O‘rindiq balandligini shunday sozlangki, qo‘ltiq yostiqning yuqori chetiga tegib tursin.',
      'Qo‘lning yuqori qismini (tirsakdan qo‘ltiqqacha) yostiqqa to‘liq qo‘ying.',
      'EZ-shtangani yelka kengligida, kaftlar yuqoriga qaragan holda ushlang (yoki bir qo‘lda gantel).',
    ],
    steps: [
      'Shtangani yelka tomon bukib ko‘taring — qo‘l yostiqdan uzilmasin.',
      'Bilak tik holatga yetmasdan to‘xtang va 1 soniya qising.',
      '3 soniyada tushiring; pastda tirsakni keskin to‘g‘rilamay, nazorat bilan to‘xtang.',
    ],
    cues: [
      'Yelka qimirlamaydi — faqat tirsak bo‘g‘imi ishlaydi',
      'Eng og‘ir qismi — pastki yarmi: aynan shu yerda sekin ishlang',
      'Tirsakka yaqin (pastki) qism o‘sishi uchun yaxshi qo‘shimcha — qiya skameykadagi bitseps bilan almashtirib turing',
    ],
    breathing: BREATH_PULL,
    mistakes: [
      {
        title: 'Pastda tirsakni «tashlab» yuborish',
        why: 'Bitseps payi cho‘zilgan holatda zarba oladi — jarohat xavfi.',
        fix: 'Vaznni kamaytiring, pastda 1 soniya nazorat bilan to‘xtang.',
      },
      {
        title: 'Yarim amplituda',
        why: 'Eng foydali pastki (cho‘zilgan) qism tashlab ketiladi.',
        fix: 'Qo‘lni deyarli to‘liq yozing, lekin tirsakni qulflamang.',
        demo: { rom: 0.5 },
      },
      {
        title: 'O‘rindiqdan turib yelka bilan yordam',
        why: 'Ish yelka va gavdaga o‘tadi.',
        fix: 'Qo‘ltiq yostiqqa bosilgan, dumba o‘rindiqda qolsin.',
      },
    ],
    benefits: [
      { id: 'grip', text: 'Qo‘l va bilak kuchi.' },
      { id: 'joints', text: 'Tirsakni bukuvchi mushaklarni yelka qimirlamagan holda, nazoratli kuchaytiradi.' },
    ],
    anim: preacherCurl(),
  },

  /* ---------- Kor ---------- */
  {
    id: 'ab-wheel',
    name: 'Rolikda press (tiz cho‘kib)',
    en: 'Ab Wheel Rollout (Kneeling)',
    pattern: 'core',
    mechanics: 'isolation',
    primary: ['abs'],
    secondary: ['obliques', 'lats'],
    equipment: ['abWheel'],
    level: 2,
    score: 7,
    loadType: 'bodyweight',
    increment: 0,
    caution: ['lowerBack', 'shoulder'],
    setup: [
      'Tizzalarni yumshoq gilam yoki yostiqqa qo‘yib tiz cho‘king.',
      'Rolikni yelkalar ostida, polda ikki qo‘l bilan ushlang.',
      'Qorinni tarang qilib, dumbani qising — tos biroz orqaga «buraladi».',
    ],
    steps: [
      'Rolikni sekin oldinga dumalatib, tanani tizzadan yelkagacha to‘g‘ri chiziqda tushiring.',
      'Bel egilmaydigan eng uzoq nuqtada to‘xtang.',
      'Qorin bilan tortib, rolikni tizzalarga tomon qaytaring.',
    ],
    cues: [
      'Boshida qisqa masofa: devorga qarab dumalatsangiz, rolik devorga tegib to‘xtaydi',
      'Bel pastga osila boshlasa — masofa siz uchun hali katta',
      'Qo‘llar to‘g‘ri, tirsaklar bukilmaydi',
    ],
    breathing: 'Oldinga ketayotganda qorinni qotirib nafasni sekin chiqaring, qaytib kelgach nafas oling.',
    mistakes: [
      {
        title: 'Bel osilib qoladi',
        why: 'Press tanani ushlay olmay qoladi — bel umurtqalari orqaga egilib siqiladi.',
        fix: 'Masofani qisqartiring, dumbani qisib tosni «burang».',
        demo: { set: [{ kf: 2, pose: { torso: 58, th: 254 } }, { kf: 3, pose: { torso: 58, th: 254 } }] },
      },
      {
        title: 'Faqat qo‘l bilan dumalatish',
        why: 'Tos joyida qoladi, tana cho‘zilmaydi — press kam ishlaydi.',
        fix: 'Tos ham oldinga ketsin: tizzadan yelkagacha bir chiziq.',
        demo: { rom: 0.45 },
      },
    ],
    benefits: [
      { id: 'core', text: 'Press va qiyshiq mushaklarni eng kuchli ishlatadigan mashqlardan — tanani egilishga qarshi ushlab turadi.' },
      { id: 'posture', text: 'Qorin mushaklari kuchi tos va belning to‘g‘ri holatini qo‘llab-quvvatlaydi.' },
    ],
    anim: abWheel(),
  },
];
