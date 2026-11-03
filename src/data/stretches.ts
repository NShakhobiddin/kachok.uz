// Cho‘zilish va harakatchanlik mashqlari: kuch mashqi emas — dasturga va hajm hisobiga kirmaydi.
// primary — asosan cho‘ziladigan mushaklar, secondary — qo‘shimcha cho‘ziladiganlar.
import type { AnimSpec, Exercise, FrontPose, KeyFrame, SidePose } from '../types';
import { AY, CX, F } from './anims';
import { BREATH_STRETCH } from './exerciseText';

/* ===================== ANIMATSIYALAR ===================== */
// Statik cho‘zilish: A holatda turish → nafas chiqarishda sekin chuqurlashish (B) → B da ushlash → biroz bo‘shashish.

type S = SidePose;

function deepen<P>(a: P, b: P, t: { a?: number; move?: number; b?: number; back?: number } = {}): KeyFrame<P>[] {
  return [
    { pose: a, dur: t.a ?? 1200, phase: 'hold' },
    { pose: a, dur: t.move ?? 2500, phase: 'down' },
    { pose: b, dur: t.b ?? 2600, phase: 'hold' },
    { pose: b, dur: t.back ?? 2000, phase: 'down' },
  ];
}

/** Dinamik: ikki holat orasida ritmik almashinish */
function alternate<P>(a: P, b: P, hold = 900, move = 2100): KeyFrame<P>[] {
  return [
    { pose: a, dur: hold, phase: 'hold' },
    { pose: a, dur: move, phase: 'down' },
    { pose: b, dur: hold, phase: 'hold' },
    { pose: b, dur: move, phase: 'down' },
  ];
}

const MAT = (x = 10, w = 210) => ({ kind: 'mat' as const, x, y: 0, w });
/** devor yoki eshik romi: kadr tepasidan polgacha baland yassi ustun */
const WALL = (x: number, w = 40) => ({ kind: 'box' as const, x, y: -120, w, h: F + 120 });

/** To‘rt oyoqlab: tizza va kaftlar polda */
const QUAD: S = { torso: 76, head: 94, ua: 180, fa: 180, th: 180, sh: 270, ft: 262, hand: { x: 140, y: 204 } };

export function catCow(): AnimSpec {
  const cow: S = { ...QUAD, head: 58, curve: -0.38 };
  const cat: S = { ...QUAD, head: 150, curve: 0.55 };
  return {
    view: 'side',
    anchor: { joint: 'knee', x: 86, y: 206 },
    props: [MAT(20, 180)],
    frames: alternate(cow, cat, 900, 2200),
    frame: { x: 10, y: 90, w: 200, h: 130 },
  };
}

export function childsPose(): AnimSpec {
  const a: S = { torso: 99, head: 110, curve: 0.25, ua: 100, fa: 98, th: 120, sh: 270, ft: 262, hand: { x: 160, y: 206.5 } };
  const b: S = { ...a, torso: 101, head: 103, th: 113, hand: { x: 163, y: 206.5 } };
  return {
    view: 'side',
    anchor: { joint: 'knee', x: 92, y: 206 },
    props: [MAT(10, 200)],
    frames: deepen(a, b),
    frame: { x: 10, y: 110, w: 200, h: 110 },
  };
}

export function downDog(): AnimSpec {
  const a: S = { torso: 131, head: 146, ua: 0, fa: 0, th: 213, sh: 213, ft: 108, hand: { x: 175, y: 205.5 } };
  const b: S = { ...a, torso: 136, head: 152, th: 212, sh: 212, ft: 100 };
  return {
    view: 'side',
    anchor: { joint: 'toe', x: 60, y: F },
    props: [MAT(20, 190)],
    frames: deepen(a, b),
    frame: { x: 20, y: 70, w: 200, h: 150 },
  };
}

export function cobra(): AnimSpec {
  const legs = { th: 268, sh: 265, ft: 266 };
  const a: S = { ...legs, torso: 62, head: 70, ua: 180, fa: 180, hand: { x: 146, y: 204 } };
  const b: S = { ...a, torso: 50, head: 58 };
  return {
    view: 'side',
    anchor: { joint: 'hip', x: 100, y: 201 },
    props: [MAT(-10, 200)],
    frames: deepen(a, b),
    frame: { x: -20, y: 100, w: 210, h: 120 },
  };
}

export function pigeon(): AnimSpec {
  // yaqin oyoq — oldinga bukilgan; uzoq oyoq — orqaga to‘g‘ri cho‘zilgan
  const legs = { th: 100, sh: 271, ft: 300, th2: 262, sh2: 268, ft2: 266 };
  const a: S = { ...legs, torso: 10, head: 6, ua: 180, fa: 180, hand: { x: 112, y: 203 } };
  const b: S = { ...legs, torso: 38, head: 48, ua: 180, fa: 180, hand: { x: 150, y: 204 } };
  return {
    view: 'side',
    anchor: { joint: 'hip', x: 90, y: 196 },
    props: [MAT(20, 190)],
    frames: deepen(a, b),
    frame: { x: 20, y: 70, w: 200, h: 150 },
  };
}

export function hipFlexorStretch(): AnimSpec {
  // yaqin oyoq — orqadagi (tizza polda), uzoq oyoq — oldinda (kaft polda)
  const base = { head: 0, sh: 270, ft: 262, foot2: { x: 128, y: AY }, ft2: 90 };
  const a: S = { ...base, torso: 0, th: 188, ua: 0, fa: 0, hand: { x: 116, y: 156 } };
  const b: S = { ...base, torso: -3, head: -2, th: 200, ua: 0, fa: 0, hand: { x: 122, y: 160 } };
  return {
    view: 'side',
    anchor: { joint: 'knee', x: 60, y: 206 },
    props: [MAT(10, 200)],
    frames: deepen(a, b),
    frame: { x: 10, y: 60, w: 200, h: 160 },
  };
}

export function hamstringStretch(): AnimSpec {
  const base = { torso: 270, head: 272, ua: 0, fa: 0, foot2: { x: 152, y: AY }, ft2: 90 };
  const a: S = { ...base, th: 3, sh: 3, ft: 263, hand: { x: 88, y: 158 } };
  const b: S = { ...base, th: -3, sh: -3, ft: 255, hand: { x: 84, y: 166 } };
  return {
    view: 'side',
    anchor: { joint: 'hip', x: 110, y: 202 },
    held: { kind: 'band', from: { x: 102, y: 107 } },
    props: [MAT(20, 180)],
    frames: deepen(a, b),
    frame: { x: 10, y: 60, w: 200, h: 160 },
  };
}

export function butterfly(): AnimSpec {
  const a: FrontPose = { ua: 0, fa: 0, fwd: 30, hipY: 198, th: 80, sh: 250, hand: { x: CX + 13, y: 202 } };
  const b: FrontPose = { ...a, th: 87, sh: 256 };
  return {
    view: 'front',
    props: [MAT(20, 200)],
    frames: deepen(a, b),
    frame: { x: 20, y: 90, w: 200, h: 130 },
  };
}

export function figureFour(): AnimSpec {
  // uzoq oyoq — tayanch (son ko‘krakka tortiladi), yaqin oyoq — to‘pig‘i uzoq tizza ustida
  const base = { torso: 270, head: 272 };
  const a: S = { ...base, th: 88, sh: 300, ft: 210, th2: 40, sh2: 167, ft2: 90, ua: 92, fa: 90 };
  const b: S = { ...base, th: 58, sh: 292, ft: 200, th2: 2, sh2: 92, ft2: 2, ua: 50, fa: 70 };
  return {
    view: 'side',
    anchor: { joint: 'hip', x: 110, y: 202 },
    props: [MAT(20, 180)],
    frames: deepen(a, b),
    frame: { x: 20, y: 80, w: 200, h: 140 },
  };
}

export function quadStretch(): AnimSpec {
  const base = { torso: 0, head: 0, th2: 180, sh2: 180, ft2: 90, hand2: { x: 152, y: 86 } };
  const a: S = { ...base, th: 182, sh: 350, ft: 310, ua: 0, fa: 0, hand: { x: 92, y: 124 } };
  const b: S = { ...base, th: 190, sh: 356, ft: 316, ua: 0, fa: 0, hand: { x: 92, y: 124 } };
  return {
    view: 'side',
    anchor: { joint: 'hip', x: 100, y: 120 },
    props: [WALL(158)],
    frames: deepen(a, b),
  };
}

export function doorwayChest(): AnimSpec {
  const base = { head: 0, th: 168, sh: 182, ft: 90, th2: 200, sh2: 200, ft2: 105, fa: 0, ua2: 178, fa2: 172 };
  const a: S = { ...base, torso: 2, ua: 270 };
  const b: S = { ...base, torso: 7, head: 4, ua: 266 };
  return {
    view: 'side',
    anchor: { joint: 'ankle', x: 120, y: AY },
    props: [WALL(84, 9)],
    frames: deepen(a, b),
  };
}

export function crossBodyShoulder(): AnimSpec {
  const base = { head: 0, th: 180, sh: 180, ft: 90, th2: 180, sh2: 180 };
  const a: S = { ...base, torso: 0, ua: 96, fa: 96, hand2: { x: 140, y: 68 } };
  const b: S = { ...base, torso: 0, ua: 92, fa: 92, hand2: { x: 139, y: 66 } };
  return {
    view: 'side',
    anchor: ankle0(),
    frames: deepen(a, b),
  };
}

export function neckStretch(): AnimSpec {
  const base = { th: 180, sh: 180, ft: 90, ua: 0, fa: 0, ua2: 182, fa2: 182 };
  const a: S = { ...base, torso: 0, head: 6, hand: { x: 112, y: 37 } };
  const b: S = { ...base, torso: 0, head: 18, hand: { x: 116, y: 39 } };
  return {
    view: 'side',
    anchor: ankle0(),
    frames: deepen(a, b),
  };
}

export function supineTwist(): AnimSpec {
  // tizzalar kamera tomonga yonga tushadi: yon ko‘rinishda sonlar pastga, oyoq kaftlari tos yoniga siljiydi
  const base = { torso: 270, head: 272, ua: 92, fa: 90 };
  const a: S = { ...base, th: 38, sh: 164, ft: 90 };
  const mid: S = { ...base, th: 34, sh: 200, ft: 90, th2: 32, sh2: 196, ft2: 90 };
  const b: S = { ...base, th: 78, sh: 252, ft: 90, th2: 66, sh2: 236, ft2: 90 };
  return {
    view: 'side',
    anchor: { joint: 'hip', x: 110, y: 202 },
    props: [MAT(20, 180)],
    frames: [
      { pose: a, dur: 1200, phase: 'hold' },
      { pose: a, dur: 1100, phase: 'down' },
      { pose: mid, dur: 1600, phase: 'down' },
      { pose: b, dur: 2600, phase: 'hold' },
      { pose: b, dur: 1500, phase: 'down' },
      { pose: mid, dur: 1000, phase: 'down' },
    ],
    frame: { x: 20, y: 100, w: 200, h: 120 },
  };
}

export function calfStretch(): AnimSpec {
  const base = { ft: 90, ft2: 90, foot2: { x: 130, y: AY }, ua: 0, fa: 0, hand: { x: 178, y: 76 } };
  const a: S = { ...base, torso: 25, head: 20, th: 206, sh: 206 };
  const b: S = { ...base, torso: 29, head: 24, th: 211, sh: 211 };
  return {
    view: 'side',
    anchor: { joint: 'ankle', x: 60, y: AY },
    props: [WALL(186)],
    frames: deepen(a, b),
  };
}

export function threadNeedle(): AnimSpec {
  const support = { hand: undefined, hand2: { x: 140, y: 204 } };
  const open: S = { ...QUAD, ...support, head: 40, ua: -5, fa: -5 };
  // oraliq: qo‘l ko‘krak oldidan pastga tushib, tayanch qo‘l yonidan o‘tadi (pol ichidan o‘tmasligi uchun tirsak bukik)
  const mid: S = { ...QUAD, ...support, torso: 90, head: 110, ua: 160, fa: 250 };
  const thread: S = { ...QUAD, ...support, torso: 112, head: 150, ua: 228, fa: 268 };
  return {
    view: 'side',
    anchor: { joint: 'knee', x: 86, y: 206 },
    props: [MAT(20, 180)],
    frames: [
      { pose: open, dur: 900, phase: 'hold' },
      { pose: open, dur: 1300, phase: 'down' },
      { pose: mid, dur: 1100, phase: 'down' },
      { pose: thread, dur: 1100, phase: 'hold' },
      { pose: thread, dur: 1100, phase: 'down' },
      { pose: mid, dur: 1300, phase: 'down' },
    ],
    frame: { x: 10, y: 50, w: 200, h: 170 },
  };
}

function ankle0() {
  return { joint: 'ankle' as const, x: 110, y: AY };
}


/* ===================== MASHQLAR ===================== */

export const STRETCHES: Exercise[] = [
  /* ---------- Umurtqa va bel ---------- */
  {
    id: 'cat-cow',
    name: 'Mushuk–sigir',
    en: 'Cat-Cow',
    kind: 'stretch',
    pattern: 'mobility',
    mechanics: 'isolation',
    primary: ['lowerBack'],
    secondary: ['abs', 'upperBack'],
    equipment: [],
    level: 1,
    score: 8,
    loadType: 'bodyweight',
    increment: 0,
    timed: true,
    hold: 60,
    caution: ['wrist'],
    setup: [
      'Gilamchada to‘rt oyoqlab turing: kaftlar yelka ostida, tizzalar tos ostida.',
      'Tizza og‘risa, ostiga buklangan sochiq qo‘ying.',
    ],
    steps: [
      '«Sigir»: nafas olib, qorinni pastga tushiring, ko‘krakni oldinga cho‘zing va biroz oldinga qarang.',
      '«Mushuk»: nafas chiqarib, orqani shiftga qarab dumaloqlang, iyakni ko‘krakka yaqinlashtiring, tosni ostiga buring.',
      'Ikki holat orasida sekin, nafas bilan birga almashing — har biriga 3–5 soniya.',
      '45–60 soniya (8–10 marta) davom ettiring.',
    ],
    cues: [
      'Harakat umurtqa bo‘ylab to‘lqin kabi o‘tsin — dumdan boshgacha',
      'Qo‘llar to‘g‘ri, yelkalar quloqdan uzoqda',
      'Faqat qulay amplitudada — chekka nuqtaga zo‘rlamang',
    ],
    breathing: 'Sigir holatiga o‘tishda burun orqali nafas oling, mushuk holatiga o‘tishda og‘iz orqali uzoq chiqaring.',
    mistakes: [
      { title: 'Shoshilish', why: 'Tez tebranishda umurtqa nazoratsiz harakatlanadi va cho‘zilish sezilmaydi.', fix: 'Har bir holatga 3–5 soniya ajrating, nafas bilan birga harakatlaning.' },
      { title: 'Belni haddan tashqari egish', why: '«Sigir» holatida bel bo‘g‘imlari siqilib, noqulaylik berishi mumkin.', fix: 'Qorinni yengil tarang ushlang, egilishni ko‘krak qismidan boshlang.' },
      { title: 'Yelkalarni quloqqa ko‘tarish', why: 'Bo‘yin va yelka usti zo‘riqadi.', fix: 'Kaftlar bilan polni itarib, yelkalarni pastga tushiring.' },
    ],
    benefits: [
      { id: 'backHealth', text: 'Umurtqani yuklamasiz, butun amplitudada harakatlantiradi — uzoq o‘tirgandan keyin belni «yumshatish» uchun qulay.' },
      { id: 'joints', text: 'Bel va ko‘krak qismi harakatchanligini mashq qildiradi; isinish sifatida ham yaxshi.' },
    ],
    anim: catCow(),
  },
  {
    id: 'childs-pose',
    name: 'Bola pozasi',
    en: "Child's Pose",
    kind: 'stretch',
    pattern: 'mobility',
    mechanics: 'isolation',
    primary: ['lowerBack', 'lats'],
    secondary: ['glutes', 'upperBack'],
    equipment: [],
    level: 1,
    score: 7,
    loadType: 'bodyweight',
    increment: 0,
    timed: true,
    hold: 30,
    caution: ['knee'],
    setup: [
      'Gilamchada tiz cho‘king: oyoq bosh barmoqlari bir-biriga tegsin, tizzalar tos kengligida yoki biroz kengroq.',
      'Tizza qattiq bukilganda og‘risa, tovon va dumba orasiga yostiq qo‘ying.',
    ],
    steps: [
      'Dumbani tovonlar tomon tushirib, gavdani sonlar ustiga oldinga engashtiring.',
      'Qo‘llarni oldinga cho‘zib, kaftlarni polga qo‘ying; peshonani polga yoki yostiqqa qo‘ying.',
      'Har nafas chiqarishda dumbani tovonga, kaftlarni esa oldinga biroz uzoqroq cho‘zing.',
      '30 soniya ushlang, so‘ng sekin, umurtqani pastdan yuqoriga «o‘rab» o‘tiring.',
    ],
    cues: [
      'Yelka va bo‘yinni butunlay bo‘shashtiring',
      'Nafasni orqa va qovurg‘alar tomonga yo‘naltiring — bel kengayayotganini his qiling',
      'Tizza yoki to‘piq og‘risa — yostiq qo‘ying yoki tizzalarni kengroq qo‘ying',
    ],
    breathing: BREATH_STRETCH,
    mistakes: [
      { title: 'Dumbani tovondan uzoq ushlash', why: 'Og‘irlik qo‘llarga tushadi, bel va orqa cho‘zilmaydi.', fix: 'Dumbani tovonga tomon tushiring; yetmasa — orasiga yostiq qo‘ying.' },
      { title: 'Yelkalarni qisish', why: 'Bo‘yin va yelka usti taranglashadi — dam o‘rniga zo‘riqish bo‘ladi.', fix: 'Qo‘llarni bo‘sh qoldiring, yelkalarni quloqdan uzoqlashtiring.' },
      { title: 'Nafasni ushlash', why: 'Tana tarang qoladi va cho‘zilish chuqurlashmaydi.', fix: 'Sekin, uzoq nafas chiqaring — har chiqarishda biroz bo‘shashing.' },
    ],
    benefits: [
      { id: 'mood', text: 'Tinchlantiruvchi holat: sekin nafas bilan ko‘pchilik buni yoqimli dam deb his qiladi.' },
      { id: 'backHealth', text: 'Bel va orqa mushaklarini yuklamasiz, yumshoq cho‘zadi.' },
    ],
    anim: childsPose(),
  },
  {
    id: 'down-dog',
    name: 'Pastga qaragan it',
    en: 'Downward Dog',
    kind: 'stretch',
    pattern: 'mobility',
    mechanics: 'isolation',
    primary: ['hamstrings', 'calves'],
    secondary: ['lats'],
    equipment: [],
    level: 1,
    score: 7,
    loadType: 'bodyweight',
    increment: 0,
    timed: true,
    hold: 30,
    caution: ['wrist', 'shoulder'],
    setup: [
      'To‘rt oyoqlab turing: kaftlar yelkadan biroz oldinda, barmoqlar keng yoyilgan.',
      'Oyoq barmoqlariga tayanib, tizzalarni poldan uzing.',
    ],
    steps: [
      'Tosni yuqoriga va orqaga itarib, tanani teskari «V» shakliga keltiring.',
      'Avval tizzalarni biroz bukik qoldiring va belni to‘g‘rilang; so‘ng tovonlarni polga tomon tushirib, tizzalarni asta yozing.',
      'Kaftlar bilan polni itaring, ko‘krakni sonlarga tomon yo‘naltiring, bosh qo‘llar orasida erkin.',
      '30 soniya ushlang, so‘ng tizzalarni polga tushirib dam oling.',
    ],
    cues: [
      'Tovonlar polga tegmasa — bu normal, to‘g‘ri bel muhimroq',
      'Og‘irlikni butun kaftga, ayniqsa barmoq asoslariga taqsimlang',
      'Yelkalar quloqdan uzoq, bo‘yin bo‘sh',
    ],
    breathing: BREATH_STRETCH,
    mistakes: [
      { title: 'Belni dumaloqlash', why: 'Tizzani to‘g‘rilashga intilib orqa bukchayadi — son orqasi o‘rniga bel cho‘ziladi.', fix: 'Tizzalarni bukib tosni yuqoriga yo‘naltiring; bel to‘g‘rilangach tizzalarni asta yozing.' },
      { title: 'Og‘irlikni bilaklarga tashlash', why: 'Bilak bo‘g‘imi zo‘riqadi.', fix: 'Kaftlar bilan polni itarib, og‘irlikni oyoqlar tomonga suring.' },
      { title: 'Tovonni zo‘rlab bosish', why: 'Boldir va Axill payi keskin tortiladi.', fix: 'Yoqimli taranglik (10 dan taxminan 4–6) yetarli — tovonlarni asta tushiring.' },
    ],
    benefits: [
      { id: 'joints', text: 'Son orqasi, boldir va yelka harakat amplitudasini birvarakayiga oshiradi.' },
      { id: 'posture', text: 'Qo‘llar bosh ustida — kun bo‘yi oldinga yig‘ilgan yelka va ko‘krak uchun teskari harakat.' },
    ],
    anim: downDog(),
  },
  {
    id: 'cobra',
    name: 'Kobra',
    en: 'Cobra',
    kind: 'stretch',
    pattern: 'mobility',
    mechanics: 'isolation',
    primary: ['abs'],
    secondary: ['chest'],
    equipment: [],
    level: 1,
    score: 6,
    loadType: 'bodyweight',
    increment: 0,
    timed: true,
    hold: 30,
    caution: ['lowerBack'],
    setup: [
      'Gilamchada qorin bilan yoting: oyoqlar tos kengligida, oyoq kaftining usti polda.',
      'Kaftlarni yelka yoniga qo‘ying, tirsaklar tanaga yaqin.',
    ],
    steps: [
      'Nafas olib, kaftlarga yengil tayanib ko‘krakni poldan ko‘taring — tos va sonlar polda qoladi.',
      'Tirsaklarni biroz bukik qoldiring va faqat belda qulay bo‘lgan balandlikkacha ko‘tariling.',
      'Yelkalarni pastga-orqaga tushiring, oldinga va biroz pastga qarang.',
      '20–30 soniya ushlang, so‘ng sekin tushing; xohlasangiz 2–3 marta takrorlang.',
    ],
    cues: [
      'Balandlik muhim emas: belda siqilish emas, qorin old tomonida cho‘zilish sezilsin',
      'Dumbani qattiq qismang — oyoqlarni polga yengil bosing',
      'Iyak biroz ichkarida, ensa uzun',
    ],
    breathing: BREATH_STRETCH,
    mistakes: [
      { title: 'Haddan tashqari baland ko‘tarilish', why: 'Bel bo‘g‘imlari siqilib, og‘riq berishi mumkin.', fix: 'Tirsaklarni bukik qoldiring yoki bilaklarga tayangan pastroq («sfinks») variantni bajaring.' },
      { title: 'Boshni orqaga tashlash', why: 'Bo‘yin umurtqalari ortiqcha egiladi.', fix: 'Oldinga qarang, ensani uzun tuting.' },
      { title: 'Yelkalarni quloqqa ko‘tarish', why: 'Bo‘yin va yelka usti zo‘riqadi.', fix: 'Yelkalarni pastga tushirib, ko‘krakni oldinga «oching».' },
    ],
    benefits: [
      { id: 'posture', text: 'Kun bo‘yi oldinga bukchayib o‘tirishga teskari harakat — ko‘krak va qorin old tomoni ochiladi.' },
      { id: 'backHealth', text: 'Umurtqani orqaga yumshoq egishni o‘rgatadi; bel og‘risa — faqat og‘riqsiz amplitudada bajaring.' },
    ],
    anim: cobra(),
  },
  {
    id: 'thread-needle',
    name: 'Ignaga ip o‘tkazish',
    en: 'Thread the Needle',
    kind: 'stretch',
    pattern: 'mobility',
    mechanics: 'isolation',
    primary: ['upperBack'],
    secondary: ['rearDelts', 'obliques'],
    equipment: [],
    level: 1,
    score: 7,
    loadType: 'bodyweight',
    increment: 0,
    timed: true,
    hold: 45,
    perSide: true,
    caution: ['wrist', 'shoulder'],
    setup: ['Gilamchada to‘rt oyoqlab turing: kaftlar yelka ostida, tizzalar tos ostida.'],
    steps: [
      'Nafas olib, o‘ng qo‘lni yon tomondan shiftga ko‘taring — ko‘krakni oching va qo‘lga qarang.',
      'Nafas chiqarib, o‘ng qo‘lni chap qo‘l ostidan chap tomonga «ip kabi» o‘tkazing; o‘ng yelka va quloq polga yaqinlashsin.',
      'Pastda 2–3 soniya turib, yana ochilishga qayting.',
      '45 soniya davomida sekin takrorlang, so‘ng tomonni almashtiring.',
    ],
    cues: [
      'Burilish ko‘krak qismidan — tos tizzalar ustida, joyida qoladi',
      'Tayanch qo‘l bilan polni itaring',
      'Pastki holatda yelka va bo‘yinni bo‘shashtiring',
    ],
    breathing: 'Qo‘lni ko‘tarib ochilishda nafas oling, qo‘lni o‘tkazayotganda sekin chiqaring.',
    mistakes: [
      { title: 'Tosni yon tomonga surish', why: 'Burilish beldan bo‘ladi — orqa o‘rtasi ishlamaydi.', fix: 'Tosni tizzalar ustida, joyida ushlang.' },
      { title: 'Shoshilish', why: 'Tez burilishda amplituda nazoratsiz bo‘ladi.', fix: 'Nafas bilan sekin harakatlaning: ochilishda nafas oling, o‘tkazishda chiqaring.' },
      { title: 'Boshga og‘irlik tashlash', why: 'Bosh polga bosilsa bo‘yin zo‘riqadi.', fix: 'Og‘irlik yelkada bo‘lsin, bosh polga yengil tegsin.' },
    ],
    benefits: [
      { id: 'posture', text: 'Orqa o‘rtasi (ko‘krak umurtqalari) burilish harakatchanligini oshiradi — bukchayib o‘tirishda eng ko‘p «qotadigan» joy.' },
      { id: 'backHealth', text: 'Burilishni beldan emas, ko‘krak qismidan qilishni o‘rgatadi.' },
    ],
    anim: threadNeedle(),
  },
  {
    id: 'supine-twist',
    name: 'Yotib burilish',
    en: 'Supine Spinal Twist',
    kind: 'stretch',
    pattern: 'mobility',
    mechanics: 'isolation',
    primary: ['lowerBack', 'obliques'],
    secondary: ['glutes', 'chest'],
    equipment: [],
    level: 1,
    score: 7,
    loadType: 'bodyweight',
    increment: 0,
    timed: true,
    hold: 30,
    perSide: true,
    caution: ['lowerBack'],
    setup: ['Gilamchada chalqancha yoting, tizzalar bukik, oyoq kaftlari polda. Qo‘llarni yelka sathida yon tomonlarga yoying.'],
    steps: [
      'Ikkala tizzani birga, sekin o‘ng tomonga polga tushiring; ikkala yelka polda qoladi.',
      'Bo‘yinga qulay bo‘lsa, boshni chap tomonga burib qarang.',
      'Har nafas chiqarishda bel va ko‘krak qafasini biroz ko‘proq bo‘shashtiring.',
      '30 soniya ushlang, tizzalarni markazga qaytarib, tomonni almashtiring.',
    ],
    cues: [
      'Tizzalar polga yetmasa — ostiga yostiq qo‘ying',
      'Yelkalar poldan uzilmasin — burilish ko‘krak qismidan',
      'Bel og‘risa — tizzalarni kamroq tushiring',
    ],
    breathing: BREATH_STRETCH,
    mistakes: [
      { title: 'Yelkani poldan ko‘tarish', why: 'Tana butunlay ag‘dariladi va burilish yo‘qoladi.', fix: 'Tizzalarni kamroq tushirib, ikkala yelkani polga bosib qoldiring.' },
      { title: 'Tizzalarni pastga zo‘rlash', why: 'Bel bo‘g‘imlari keskin buraladi.', fix: 'Og‘irlik kuchiga qo‘yib bering, kerak bo‘lsa tizza ostiga yostiq qo‘ying.' },
      { title: 'Nafasni ushlash', why: 'Ko‘krak qafasi qotib qoladi va burilish chuqurlashmaydi.', fix: 'Sekin, uzoq nafas chiqaring — har chiqarishda biroz bo‘shashing.' },
    ],
    benefits: [
      { id: 'backHealth', text: 'Umurtqani yuklamasiz, yumshoq buraydi — kun oxirida belni bo‘shashtirish uchun qulay.' },
      { id: 'mood', text: 'Sokin, chuqur nafas bilan ushlanadigan tinchlantiruvchi holat.' },
    ],
    anim: supineTwist(),
  },

  /* ---------- Tos, dumba va son ---------- */
  {
    id: 'hip-flexor-stretch',
    name: 'Tiz cho‘kib son bukuvchisini cho‘zish',
    en: 'Half-Kneeling Hip Flexor Stretch',
    kind: 'stretch',
    pattern: 'mobility',
    mechanics: 'isolation',
    primary: ['quads'],
    secondary: [],
    equipment: [],
    level: 1,
    score: 9,
    loadType: 'bodyweight',
    increment: 0,
    timed: true,
    hold: 30,
    perSide: true,
    caution: ['knee'],
    setup: [
      'Bir tizzada tiz cho‘king: orqadagi tizza polda (ostiga sochiq qo‘ying), oldingi oyoq kafti polda, tizza taxminan 90°.',
      'Gavda tik, qo‘llar oldingi son ustida yoki belda.',
    ],
    steps: [
      'Dumbani qisib, tosni ostiga buring («dumni ichkariga») — orqa oyoq sonining old qismida taranglik paydo bo‘ladi.',
      'Gavdani tik saqlab, tosni asta 2–5 sm oldinga suring; belni egmang.',
      'Kuchaytirish uchun orqadagi oyoq tomonidagi qo‘lni boshdan yuqoriga cho‘zing.',
      '30 soniya ushlang, so‘ng oyoqlarni almashtiring.',
    ],
    cues: [
      'Cho‘zilish son va qorin pastining old qismida (yonbosh-bel mushagi — iliopsoas) sezilsin, belda emas',
      'Tosni oldinga surishdan ko‘ra dumbani qisish muhimroq',
      'Oldingi tizza oyoq uchidan uzoq chiqib ketmasin',
    ],
    breathing: BREATH_STRETCH,
    mistakes: [
      { title: 'Belni egish', why: 'Cho‘zilish son bukuvchisidan belga o‘tadi va bel bo‘g‘imlari siqiladi.', fix: 'Qovurg‘alarni pastga tushirib, dumbani qisib tosni ostiga buring.' },
      { title: 'Juda uzoqqa surilish', why: 'Tos oldinga ag‘dariladi — taranglik yo‘qoladi, oldingi tizzaga bosim oshadi.', fix: 'Avval tosni buring, keyin 2–5 sm oldinga suring — shu yetarli.' },
      { title: 'Tizzani qattiq polga qo‘yish', why: 'Tizza qopqog‘i ostida og‘riq beradi.', fix: 'Orqadagi tizza ostiga buklangan sochiq yoki yostiq qo‘ying.' },
    ],
    benefits: [
      { id: 'posture', text: 'Uzoq o‘tirishda qisqa holatda qoladigan son bukuvchilarini (iliopsoas) cho‘zadi.' },
      { id: 'joints', text: 'Tos-son bo‘g‘imining orqaga yozilish amplitudasini oshiradi.' },
    ],
    anim: hipFlexorStretch(),
  },
  {
    id: 'pigeon',
    name: 'Kaptar pozasi',
    en: 'Pigeon Pose',
    kind: 'stretch',
    pattern: 'mobility',
    mechanics: 'isolation',
    primary: ['glutes'],
    secondary: ['quads'],
    equipment: [],
    level: 2,
    score: 6,
    loadType: 'bodyweight',
    increment: 0,
    timed: true,
    hold: 30,
    perSide: true,
    caution: ['knee', 'hip'],
    setup: [
      'To‘rt oyoqlab turing. Dumba ostiga qo‘yish uchun yostiq yoki buklangan adyolni yoningizda tayyorlang.',
    ],
    steps: [
      'O‘ng tizzani oldinga, o‘ng kaft orqasiga olib keling; boldirni gilamchaga qiya qo‘ying (tovon chap son oldida).',
      'Chap oyoqni orqaga to‘g‘ri cho‘zing, oyoq kaftining usti polda; tos tekis — ikkala yonbosh oldinga qarasin.',
      'Qo‘llarga tayanib gavdani tik tuting, so‘ng xohlasangiz belni to‘g‘ri saqlab oldinga engashing.',
      '30 soniya ushlang, so‘ng tomonni almashtiring.',
    ],
    cues: [
      'Cho‘zilish oldingi oyoq dumbasida (noksimon mushak) sezilsin, tizzada emas',
      'Dumba ostida bo‘shliq bo‘lsa — yostiq qo‘ying, tos qiyshaymasin',
      'Orqa oyoq sonining old qismi ham yengil cho‘ziladi',
    ],
    breathing: BREATH_STRETCH,
    mistakes: [
      { title: 'Tizzaga og‘riq berish', why: 'Boldir burchagi tizzani buradi — tizza bo‘g‘imi zo‘riqadi.', fix: 'Tovonni tosga yaqinroq olib keling, oyoq panjasini o‘zingizga torting yoki «4» raqami variantini tanlang.' },
      { title: 'Tosning bir tomonga qulashi', why: 'Og‘irlik bir dumbaga tushib, cho‘zilish belga o‘tadi.', fix: 'Oldingi oyoq dumbasi ostiga yostiq qo‘yib, tosni tekislang.' },
      { title: 'Og‘riqqacha zo‘rlash', why: 'Mushak himoya refleksi bilan qisqaradi va cho‘zilish kamayadi.', fix: 'Yoqimli taranglik — 10 dan taxminan 4–6 — yetarli.' },
    ],
    benefits: [
      { id: 'joints', text: 'Tos-son bo‘g‘imining tashqariga burilish harakatchanligi va dumba cho‘ziluvchanligini oshiradi.' },
      { id: 'mood', text: 'Uzoq, sekin nafas bilan ushlanadigan tinchlantiruvchi holat.' },
    ],
    anim: pigeon(),
  },
  {
    id: 'figure-four',
    name: '«4» raqami (chalqancha)',
    en: 'Supine Figure-Four Stretch',
    kind: 'stretch',
    pattern: 'mobility',
    mechanics: 'isolation',
    primary: ['glutes'],
    secondary: [],
    equipment: [],
    level: 1,
    score: 8,
    loadType: 'bodyweight',
    increment: 0,
    timed: true,
    hold: 30,
    perSide: true,
    caution: ['knee'],
    setup: [
      'Gilamchada chalqancha yoting, tizzalar bukik, oyoq kaftlari polda.',
      'O‘ng to‘piqni chap tizzaning biroz pastiga, son ustiga qo‘ying; o‘ng tizzani yon tomonga oching.',
    ],
    steps: [
      'O‘ng oyoq panjasini o‘zingizga torting — bu tizzani himoya qiladi.',
      'O‘ng dumbada taranglik sezilmasa, chap oyoqni poldan uzing va chap son orqasidan ushlab ko‘krakka torting.',
      'Bosh, yelka va bel polda; o‘ng tizzani tirsak bilan yengil uzoqlashtirish mumkin.',
      '30 soniya ushlang, so‘ng oyoqlarni almashtiring.',
    ],
    cues: [
      'Cho‘zilish dumba va son tashqi qismida sezilsin, tizzada emas',
      'Dumba poldan ko‘tarilmasin, tos to‘g‘ri',
      'Kaptar pozasining tizza uchun yengilroq, bel uchun qulay muqobili',
    ],
    breathing: BREATH_STRETCH,
    mistakes: [
      { title: 'Boshni ko‘tarish', why: 'Bo‘yin va yelka zo‘riqadi, tana bo‘shashmaydi.', fix: 'Bosh polda qolsin; qo‘l yetmasa — son orqasiga sochiq ilib torting.' },
      { title: 'Oyoq panjasini bo‘sh qoldirish', why: 'To‘piq qayrilib, tizzaga buruvchi kuch tushadi.', fix: 'Oyoq panjasini o‘zingizga torting, to‘piqni tizza ustidan biroz o‘tkazing.' },
      { title: 'Og‘riqqacha tortish', why: 'Mushak himoya refleksi bilan qisqaradi va cho‘zilish kamayadi.', fix: 'Yoqimli taranglikda (10 dan 4–6) ushlang, chuqurlashtirishni nafas chiqarishda qiling.' },
    ],
    benefits: [
      { id: 'backHealth', text: 'Bel polga tayanib turadi — beli sezgir odamlar uchun dumbani cho‘zishning qulay usuli.' },
      { id: 'joints', text: 'Tos-son bo‘g‘imining tashqariga burilish harakatchanligini oshiradi.' },
    ],
    anim: figureFour(),
  },
  {
    id: 'butterfly',
    name: 'Kapalak',
    en: 'Butterfly Stretch',
    kind: 'stretch',
    pattern: 'mobility',
    mechanics: 'isolation',
    primary: ['adductors'],
    secondary: [],
    equipment: [],
    level: 1,
    score: 6,
    loadType: 'bodyweight',
    increment: 0,
    timed: true,
    hold: 30,
    caution: ['knee'],
    setup: [
      'Polga o‘tiring, oyoq kaftlarini bir-biriga tegizib, tovonlarni chovga tomon torting.',
      'Bel bukchaysa — dumba ostiga buklangan adyol yoki yostiq qo‘ying.',
    ],
    steps: [
      'Oyoq kaftlarini qo‘llar bilan ushlang, umurtqani tik cho‘zing.',
      'Tizzalarni yon tomonlarga erkin tushiring — og‘irlik kuchi ishlasin.',
      'Chuqurlashtirish uchun belni to‘g‘ri saqlab, tosdan biroz oldinga engashing.',
      '30 soniya ushlang.',
    ],
    cues: [
      'Tizzalarni qo‘l bilan pastga bosmang — o‘z-o‘zidan tushsin',
      'Engashganda ko‘krak oyoqlarga emas, oldinga yo‘nalsin',
      'Tovonlar chovdan uzoqroq bo‘lsa — cho‘zilish yengilroq',
    ],
    breathing: BREATH_STRETCH,
    mistakes: [
      { title: 'Tizzalarni kuch bilan bosish', why: 'Tizza va chov sohasi paylariga ortiqcha kuch tushadi.', fix: 'Qo‘llarni oyoq kaftlarida qoldiring, tizzalar o‘z og‘irligi bilan tushsin.' },
      { title: 'Belni dumaloqlash', why: 'Engashish belga o‘tib, son ichki qismi cho‘zilmaydi.', fix: 'Dumba ostiga yostiq qo‘ying va tosdan, bel to‘g‘ri holda engashing.' },
      { title: 'Tizzalarni silkitish', why: '«Kapalak qanoti» kabi tez silkitish cho‘zilishni kuchaytirmaydi, chovni tortib yuborishi mumkin.', fix: 'Tizzalarni qimirlatmay ushlang, nafas bilan bo‘shashing.' },
    ],
    benefits: [
      { id: 'joints', text: 'Son ichki qismi va tos-son bo‘g‘imi harakatchanligini oshiradi.' },
      { id: 'mood', text: 'Uyda kechqurun bajarish uchun qulay, sokin holat.' },
    ],
    anim: butterfly(),
  },
  {
    id: 'hamstring-stretch',
    name: 'Son orqasini cho‘zish (chalqancha)',
    en: 'Supine Hamstring Stretch',
    kind: 'stretch',
    pattern: 'mobility',
    mechanics: 'isolation',
    primary: ['hamstrings'],
    secondary: ['calves'],
    equipment: [],
    level: 1,
    score: 8,
    loadType: 'bodyweight',
    increment: 0,
    timed: true,
    hold: 30,
    perSide: true,
    setup: [
      'Gilamchada chalqancha yoting. Bir oyoq kaftiga sochiq, kamar yoki rezina lentani ilib, uchlarini ikki qo‘lda ushlang.',
      'Ikkinchi oyoq tizzadan bukik, kafti polda — bel uchun eng qulay holat.',
    ],
    steps: [
      'Lentali oyoqni tizzasini to‘g‘ri saqlab yuqoriga ko‘taring — son orqasida yoqimli taranglik sezilguncha.',
      'Oyoq panjasini o‘zingizga torting; lentani qo‘llar bilan yengil tortib, oyoqni asta yaqinlashtiring.',
      'Bel va tos polda, yelka va bo‘yin bo‘sh.',
      '30 soniya ushlang, so‘ng oyoqni almashtiring.',
    ],
    cues: [
      'Tizza to‘liq yozilmasa — biroz bukik qoldiring va oyoqni pastroq tuting',
      'Lenta yordam beradi — qo‘l kuchi bilan zo‘rlamang',
      'Cho‘zilish tizza ostida emas, son orqasining o‘rtasida sezilsin',
    ],
    breathing: BREATH_STRETCH,
    mistakes: [
      { title: 'Tosni poldan ko‘tarish', why: 'Oyoq yuqoriroq ko‘rinadi, ammo cho‘zilish belga o‘tadi.', fix: 'Oyoqni pastroq tuting — dumba va bel polga bosilgan bo‘lsin.' },
      { title: 'Silkitish (prujinalash)', why: 'Keskin tortish mushakni himoya refleksi bilan qisqartiradi.', fix: 'Holatni bir tekis ushlang, chuqurlashtirishni faqat nafas chiqarishda asta qiling.' },
      { title: 'Og‘riqqacha tortish', why: 'Tizza orqasida achishish yoki oyoqqa tarqaluvchi og‘riq asab tortilganini bildirishi mumkin.', fix: 'Taranglikni 10 dan 4–6 darajada saqlang; achishsa — oyoqni pastroq tushiring.' },
    ],
    benefits: [
      { id: 'joints', text: 'Son orqasi cho‘ziluvchanligini oshiradi — oyoqni ko‘tarish va engashish amplitudasi kengayadi.' },
      { id: 'backHealth', text: 'Bel polga tayanadi — beli sezgir odamlar uchun turib engashishdan qulayroq variant.' },
    ],
    anim: hamstringStretch(),
  },
  {
    id: 'quad-stretch',
    name: 'Tik turib son oldini cho‘zish',
    en: 'Standing Quad Stretch',
    kind: 'stretch',
    pattern: 'mobility',
    mechanics: 'isolation',
    primary: ['quads'],
    secondary: [],
    equipment: [],
    level: 1,
    score: 7,
    loadType: 'bodyweight',
    increment: 0,
    timed: true,
    hold: 30,
    perSide: true,
    caution: ['knee'],
    setup: ['Devorga yoki stul suyanchig‘iga yuzma-yuz turing va bir qo‘l bilan tayaning.'],
    steps: [
      'O‘ng tizzani bukib, o‘ng qo‘l bilan to‘piqni yoki oyoq kafti ustini ushlang.',
      'Tovonni dumbaga torting: tizzalar yonma-yon, bukilgan tizza polga qarasin.',
      'Dumbani qisib, tosni biroz oldinga suring — son oldidagi taranglik kuchayadi.',
      '30 soniya ushlang, so‘ng oyoqni almashtiring.',
    ],
    cues: [
      'Belni egmang — tos to‘g‘ri, qorin yengil tarang',
      'Qo‘l yetmasa — to‘piqqa sochiq ilib torting',
      'Tayanch oyoq tizzasi biroz yumshoq',
    ],
    breathing: BREATH_STRETCH,
    mistakes: [
      { title: 'Belni egish', why: 'Tos oldinga ag‘dariladi — son oldi cho‘zilmaydi, belga yuk tushadi.', fix: 'Dumbani qisib, tosni ostiga buring.' },
      { title: 'Tizzani yonga ochish', why: 'Tizzaga buruvchi kuch tushadi, cho‘zilish kamayadi.', fix: 'Ikkala tizzani yonma-yon ushlang, bukilgan tizza polga qarasin.' },
      { title: 'Tovonni kuch bilan tortish', why: 'Tizza haddan tashqari bukilib, og‘riq berishi mumkin.', fix: 'Tovon dumbaga tegishi shart emas — son oldida taranglik sezilsa yetarli.' },
    ],
    benefits: [
      { id: 'joints', text: 'Son oldi va tos oldi cho‘ziluvchanligini oshiradi.' },
      { id: 'balance', text: 'Bir oyoqda turish muvozanatni ham mashq qildiradi.' },
    ],
    anim: quadStretch(),
  },
  {
    id: 'calf-stretch',
    name: 'Boldirni devorda cho‘zish',
    en: 'Wall Calf Stretch',
    kind: 'stretch',
    pattern: 'mobility',
    mechanics: 'isolation',
    primary: ['calves'],
    secondary: [],
    equipment: [],
    level: 1,
    score: 6,
    loadType: 'bodyweight',
    increment: 0,
    timed: true,
    hold: 30,
    perSide: true,
    setup: ['Devorga yuzma-yuz turing, kaftlarni yelka sathida devorga qo‘ying.'],
    steps: [
      'Bir oyoqni orqaga katta qadam qo‘ying: tizza to‘g‘ri, tovon polga bosilgan, oyoq uchi oldinga qaragan.',
      'Oldingi tizzani bukib, tos va gavdani devorga tomon suring — orqa oyoq boldirida taranglik paydo bo‘ladi.',
      'Tovon poldan uzilmasin; boshdan orqa tovongacha bir tekis chiziq.',
      '30 soniya ushlang, so‘ng oyoqni almashtiring.',
    ],
    cues: [
      'Orqa tizzani biroz bukib ushlasangiz — boldirning chuqurroq qismi (kambalasimon mushak) cho‘ziladi',
      'Oyoq uchlari tashqariga emas, to‘g‘ri oldinga qarasin',
      'Taranglik kuchli bo‘lsa — orqa oyoqni devorga yaqinroq qo‘ying',
    ],
    breathing: BREATH_STRETCH,
    mistakes: [
      { title: 'Tovonni ko‘tarish', why: 'Boldir bo‘shashadi va cho‘zilish yo‘qoladi.', fix: 'Orqa oyoqni yaqinroq qo‘yib, tovonni polga bosing.' },
      { title: 'Belni egish', why: 'Tos oldinga tushib, cho‘zilish o‘rniga belga yuk tushadi.', fix: 'Qorinni yengil tarang tuting — tana tovondan boshgacha to‘g‘ri chiziq.' },
      { title: 'Silkitish (prujinalash)', why: 'Axill payiga keskin, takroriy kuch tushadi.', fix: 'Holatni bir tekis ushlang, chuqurlashtirishni sekin qiling.' },
    ],
    benefits: [
      { id: 'joints', text: 'To‘piq bo‘g‘imi harakatchanligini oshiradi — chuqur o‘tirishda tovonni polda ushlash osonlashadi.' },
    ],
    anim: calfStretch(),
  },

  /* ---------- Ko‘krak, yelka va bo‘yin ---------- */
  {
    id: 'doorway-chest',
    name: 'Eshik romida ko‘krakni cho‘zish',
    en: 'Doorway Chest Stretch',
    kind: 'stretch',
    pattern: 'mobility',
    mechanics: 'isolation',
    primary: ['chest'],
    secondary: ['frontDelts', 'biceps'],
    equipment: [],
    level: 1,
    score: 8,
    loadType: 'bodyweight',
    increment: 0,
    timed: true,
    hold: 30,
    perSide: true,
    caution: ['shoulder'],
    setup: ['Ochiq eshik ostonasida turing. Bilak va kaftni eshik romiga qo‘ying: tirsak yelka balandligida, 90° bukik.'],
    steps: [
      'Bir oyoqni oldinga qo‘yib, gavdani asta oldinga — eshikdan o‘tish tomonga suring.',
      'Ko‘krak va yelka oldida yoqimli taranglik sezilganda to‘xtang; yelkani quloqqa ko‘tarmang.',
      'Kuchaytirish uchun gavdani romga qarama-qarshi tomonga biroz buring.',
      '30 soniya ushlang, so‘ng qo‘lni almashtiring.',
    ],
    cues: [
      'Tirsak yelka sathida yoki biroz pastroq — balandroq ko‘tarmang',
      'Qo‘lda uvishish yoki chimchilash sezilsa — tirsakni pastroq tushiring',
      'Bel egilmasin — qorin yengil tarang',
    ],
    breathing: BREATH_STRETCH,
    mistakes: [
      { title: 'Tirsakni juda baland ko‘tarish', why: 'Yelka bo‘g‘imining old qismi zo‘riqadi, qo‘lda uvishish paydo bo‘lishi mumkin.', fix: 'Tirsakni yelka sathida yoki biroz pastroq ushlang.' },
      { title: 'Belni egib oldinga chiqish', why: 'Cho‘zilish ko‘krakdan belga o‘tadi.', fix: 'Qorinni tarang tutib, butun gavda bilan bir tekis oldinga suriling.' },
      { title: 'Keskin tortish', why: 'Yelka bo‘g‘imiga bir zumda katta kuch tushadi.', fix: 'Asta suriling va yoqimli taranglikda (10 dan 4–6) to‘xtang.' },
    ],
    benefits: [
      { id: 'posture', text: 'Kompyuter va telefon ortida oldinga yig‘ilgan yelka va ko‘krakni ochadi.' },
    ],
    anim: doorwayChest(),
  },
  {
    id: 'cross-body-shoulder',
    name: 'Qo‘lni ko‘krak oldidan tortish',
    en: 'Cross-Body Shoulder Stretch',
    kind: 'stretch',
    pattern: 'mobility',
    mechanics: 'isolation',
    primary: ['rearDelts'],
    secondary: ['upperBack'],
    equipment: [],
    level: 1,
    score: 6,
    loadType: 'bodyweight',
    increment: 0,
    timed: true,
    hold: 30,
    perSide: true,
    caution: ['shoulder'],
    setup: ['Tik turing yoki o‘tiring, yelkalar bo‘sh va pastda.'],
    steps: [
      'O‘ng qo‘lni to‘g‘ri holda ko‘krak oldidan chap tomonga o‘tkazing.',
      'Chap qo‘l bilan uni tirsakdan yuqoriroq ushlab, ko‘krakka yaqinlashtiring.',
      'O‘ng yelkani pastda saqlang — quloqqa ko‘tarilmasin.',
      '30 soniya ushlang, so‘ng qo‘lni almashtiring.',
    ],
    cues: [
      'Cho‘zilish yelkaning orqa qismida sezilsin',
      'Tirsak bo‘g‘imiga emas, yelka suyagiga bosing',
      'Gavda oldinga qaragan holda qolsin — faqat qo‘l harakatlanadi',
    ],
    breathing: BREATH_STRETCH,
    mistakes: [
      { title: 'Tirsakdan bosish', why: 'Tirsak bo‘g‘imi haddan tashqari yoziladi va zo‘riqadi.', fix: 'Qo‘lni tirsakdan yuqoriroq, yelka suyagi ustidan ushlang.' },
      { title: 'Yelkani ko‘tarish', why: 'Trapetsiya ishga tushadi, yelka orqasi cho‘zilmaydi.', fix: 'Yelkani pastga tushirib, bo‘yinni uzun tuting.' },
      { title: 'Gavdani burish', why: 'Qo‘l bilan tana birga aylanadi — taranglik yo‘qoladi.', fix: 'Ko‘krak oldinga qaragan holda qolsin.' },
    ],
    benefits: [
      { id: 'joints', text: 'Yelka bo‘g‘imining orqa qismi harakatchanligini oshiradi.' },
    ],
    anim: crossBodyShoulder(),
  },
  {
    id: 'neck-stretch',
    name: 'Bo‘yinni yonga cho‘zish',
    en: 'Neck Side Stretch',
    kind: 'stretch',
    pattern: 'mobility',
    mechanics: 'isolation',
    primary: ['traps'],
    secondary: [],
    equipment: [],
    level: 1,
    score: 7,
    loadType: 'bodyweight',
    increment: 0,
    timed: true,
    hold: 30,
    perSide: true,
    caution: ['neck'],
    setup: [
      'Stulda o‘tiring yoki tik turing, qaddingizni rostlang; yelkalar bo‘sh va pastda.',
      'Chap qo‘lni son yoniga tushiring yoki stul chetidan ushlang.',
    ],
    steps: [
      'Boshni o‘ngga egib, o‘ng quloqni o‘ng yelkaga yaqinlashtiring — yelkani ko‘tarmang.',
      'O‘ng kaftni boshning chap tomoniga yengil qo‘ying: tortmang, qo‘lning og‘irligi yetarli.',
      'Chap yelkani pastga tushirib, bo‘yinning chap yon tomonida (trapetsiyaning yuqori qismi) taranglikni his qiling.',
      '30 soniya ushlang, boshni sekin tik holatga qaytarib, tomonni almashtiring.',
    ],
    cues: [
      'Qo‘l tortmaydi — faqat og‘irlik qo‘shadi',
      'Iyakni biroz pastga tushirsangiz — cho‘zilish bo‘yin ortiga o‘tadi',
      'Uvishish, bosh aylanishi yoki qo‘lga tarqaluvchi og‘riq bo‘lsa — to‘xtating',
    ],
    breathing: BREATH_STRETCH,
    mistakes: [
      { title: 'Boshni qo‘l bilan kuch bilan tortish', why: 'Bo‘yin umurtqalari va paylari kichik — ortiqcha kuch ularni zo‘riqtiradi.', fix: 'Kaftni faqat qo‘yib qo‘ying, cho‘zilish mushak bo‘shashgani sari o‘zi chuqurlashsin.' },
      { title: 'Qarama-qarshi yelkani ko‘tarish', why: 'Yelka bosh bilan birga ko‘tarilsa, trapetsiya cho‘zilmaydi.', fix: 'Bo‘sh qo‘lni pastga tushiring yoki stul chetidan ushlang.' },
      { title: 'Boshni aylantirish', why: 'Boshni orqaga tashlab aylantirish bo‘yin bo‘g‘imlarini siqadi.', fix: 'Boshni faqat yonga egib, sekin markazga qaytaring.' },
    ],
    benefits: [
      { id: 'mood', text: 'Kompyuterda uzoq ishlagandan keyin bo‘yin va yelka ustidagi taranglik hissini yengillashtiradi.' },
      { id: 'posture', text: 'Yelkalarni pastga tushirib, boshni tik ushlashni eslatadi.' },
    ],
    anim: neckStretch(),
  },
];
