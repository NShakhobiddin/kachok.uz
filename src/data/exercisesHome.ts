// Uyda bajariladigan kuch mashqlari (asosan ayollar uchun: dumba, son, tana markazi) — jihozsiz, gantel, lenta yoki fitbol bilan.
// Animatsiyalar shu faylda: yon ko'rinishda frontal tekislikdagi harakatlar (yonboshlab yotib, «gidrant») soddalashtirilgan holda ko'rsatiladi.
import type { AnimSpec, Exercise, FrontPose, KeyFrame, Prop, SidePose } from '../types';
import { AY, CX, F, con, ecc } from './anims';
import { BREATH_BRACE, BREATH_PRESS, BREATH_PULL } from './exerciseText';

type S = SidePose;
type Fp = FrontPose;

const mat = (x: number, w: number): Prop => ({ kind: 'mat', x, y: 0, w });

/** Qadam bilan bajariladigan mashq: tik turish -> oraliq (oyoq havoda) -> pastki nuqta -> qaytish */
function stepCycle(stand: S, mid: S, bottom: S): KeyFrame<S>[] {
  return [
    { pose: stand, dur: 400, phase: 'hold' },
    { pose: stand, dur: 700, phase: 'down' },
    { pose: mid, dur: 1100, phase: 'down' },
    { pose: bottom, dur: 350, phase: 'hold' },
    { pose: bottom, dur: 800, phase: 'up' },
    { pose: mid, dur: 600, phase: 'up' },
  ];
}

/* ===================== ANIMATSIYALAR ===================== */

/** Old ko'rinish: keng turish, gantel oyoqlar orasida. Oraliq kadr oyoqlarni polda ushlaydi (son kamera tomon buriladi). */
function sumoSquatAnim(): AnimSpec {
  const top: Fp = { ua: 0, fa: 0, fwd: 30, th: 159.5, sh: 159.5, hipY: 123.7, hand: { x: CX + 1, y: 126 } };
  const mid: Fp = { ua: 0, fa: 0, fwd: 30, th: 154.5, sh: 165, legFwd: 30, hipY: 129.5, hand: { x: CX + 1, y: 132 } };
  const bottom: Fp = { ua: 0, fa: 0, fwd: 30, th: 142.5, sh: 175, legFwd: 77, hipY: 156, hand: { x: CX + 1, y: 158 } };
  return {
    view: 'front',
    held: { kind: 'dumbbell' },
    frames: [
      { pose: top, dur: 450, phase: 'hold' },
      { pose: top, dur: 700, phase: 'down' },
      { pose: mid, dur: 1500, phase: 'down' },
      { pose: bottom, dur: 350, phase: 'hold' },
      { pose: bottom, dur: 900, phase: 'up' },
      { pose: mid, dur: 450, phase: 'up' },
    ],
  };
}

/** Old ko'rinish: yarim o'tirishda qadamni yonga kengaytirish va qaytarish, qo'llar belda */
function lateralWalkAnim(): AnimSpec {
  const narrow: Fp = { ua: 155, fa: 215, th: 172, sh: 180, legFwd: 45, hipY: 131.8 };
  const wide: Fp = { ...narrow, th: 158, sh: 172, hipY: 134.2 };
  return { view: 'front', frames: con(narrow, wide, { hold1: 250, move1: 700, hold2: 300, move2: 900 }) };
}

const STAND: S = { torso: 2, ua: 180, fa: 180, th: 0, sh: 0, ft: 90, ft2: 90, foot: { x: 128, y: AY }, foot2: { x: 124, y: AY }, at: { x: 127, y: 119 } };

function reverseLungeAnim(): AnimSpec {
  const mid: S = { ...STAND, torso: 6, ft2: 120, foot2: { x: 92, y: 192 }, at: { x: 118, y: 132 } };
  const bottom: S = { ...STAND, torso: 10, head: 6, ft2: 140, foot2: { x: 50, y: 200 }, at: { x: 92, y: 158 } };
  return { view: 'side', anchor: { joint: 'hip', x: 127, y: 119 }, frames: stepCycle(STAND, mid, bottom) };
}

/** Yon ko'rinishda kesishgan qadam qisqaroq orqaga hamla bo'lib ko'rinadi */
function curtsyLungeAnim(): AnimSpec {
  const mid: S = { ...STAND, torso: 3, ft2: 120, foot2: { x: 100, y: 194 }, at: { x: 121, y: 132 } };
  const bottom: S = { ...STAND, torso: 6, head: 4, ft2: 140, foot2: { x: 66, y: 200 }, at: { x: 97, y: 154 } };
  return { view: 'side', anchor: { joint: 'hip', x: 127, y: 119 }, frames: stepCycle(STAND, mid, bottom) };
}

/** To'rt oyoqlab: tizzalar tos ostida, mushtlar yelka ostida */
const QUAD: S = { torso: 72, head: 80, ua: 180, fa: 180, ua2: 180, fa2: 180, th: 180, sh: 270, ft: 270, th2: 180, sh2: 270, ft2: 270 };
const QUAD_FRAME = { x: 20, y: 80, w: 200, h: 140 };

function gluteKickbackAnim(): AnimSpec {
  return {
    view: 'side',
    anchor: { joint: 'wrist', x: 143.4, y: 201.3 },
    props: [mat(30, 180)],
    frames: con(QUAD, { ...QUAD, th: 268, sh: 358, ft: 268 }, { move1: 1000, hold2: 600, move2: 1500 }),
    frame: QUAD_FRAME,
  };
}

/** Son yonga (kamera tomon) ko'tariladi: yon ko'rinishda bukilgan oyoq tos balandligida, tana yonida */
function fireHydrantAnim(): AnimSpec {
  return {
    view: 'side',
    anchor: { joint: 'wrist', x: 143.4, y: 201.3 },
    props: [mat(30, 180)],
    frames: con(QUAD, { ...QUAD, th: 98, sh: 268, ft: 268 }, { move1: 1000, hold2: 600, move2: 1500 }),
    frame: QUAD_FRAME,
  };
}

/** Qarama-qarshi qo'l (yaqin) va oyoq (uzoq) cho'ziladi */
function birdDogAnim(): AnimSpec {
  return {
    view: 'side',
    anchor: { joint: 'knee', x: 104, y: 206 },
    props: [mat(10, 214)],
    frames: con(QUAD, { ...QUAD, ua: 82, fa: 84, th2: 262, sh2: 262, ft2: 175 }, { move1: 1400, hold2: 900, move2: 1600 }),
    frame: { x: 0, y: 80, w: 230, h: 140 },
  };
}

/** Yonboshlab yotish: pastki qo'l tirsakda, kaft boshni ushlaydi, ustki qo'l tosda; ustki (yaqin) oyoq ko'tariladi */
function sideLegRaiseAnim(): AnimSpec {
  const base = { torso: 86, head: 40, ua2: 121, fa2: 341, ua: 265, fa: 275, th2: 267, sh2: 267, ft2: 267 };
  return {
    view: 'side',
    anchor: { joint: 'hip', x: 118, y: 200 },
    props: [mat(20, 200)],
    frames: con({ ...base, th: 266, sh: 266, ft: 266 }, { ...base, th: 302, sh: 302, ft: 302 }, { move1: 1000, hold2: 500, move2: 1600 }),
    frame: { x: 10, y: 90, w: 210, h: 130 },
  };
}

/** Yonboshlab, tizzalar bukik; ustki tizza ochiladi (yon ko'rinishda ustki oyoq kafti pastki oyoq ustida qoladi) */
function clamshellAnim(): AnimSpec {
  const base = { torso: 280, head: 330, ua2: 236, fa2: 20, ua: 96, fa: 92, th2: 58, sh2: 134, ft2: 95 };
  return {
    view: 'side',
    anchor: { joint: 'hip', x: 110, y: 199 },
    props: [mat(20, 190)],
    frames: con({ ...base, foot: { x: 176, y: 196 }, ft: 95 }, { ...base, foot: { x: 164, y: 180 }, ft: 72 }, { move1: 1000, hold2: 500, move2: 1600 }),
    frame: { x: 10, y: 90, w: 210, h: 130 },
  };
}

function singleLegBridgeAnim(): AnimSpec {
  const base = { head: 270, ua: 92, fa: 90, th: 0, sh: 0, foot: { x: 140, y: AY }, ft2: 350, at: { x: 52, y: 202 } };
  return {
    view: 'side',
    anchor: { joint: 'shoulder', x: 52, y: 202 },
    props: [mat(20, 170)],
    frames: con({ ...base, torso: 270, th2: 36, sh2: 36 }, { ...base, torso: 244, head: 258, th2: 72, sh2: 72 }, { move1: 1000, hold2: 800, move2: 1500 }),
    frame: { x: 10, y: 70, w: 200, h: 150 },
  };
}

function wallSitAnim(): AnimSpec {
  const p: S = { torso: 0, head: 2, ua: 88, fa: 90, th: 90, sh: 180, ft: 90 };
  return {
    view: 'side',
    anchor: { joint: 'hip', x: 92, y: 164 },
    props: [{ kind: 'box', x: 70, y: 24, w: 10, h: 190 }],
    frames: [
      { pose: p, dur: 2200, phase: 'up' },
      { pose: { ...p, torso: 0.6, head: 3 }, dur: 2200, phase: 'down' },
    ],
  };
}

function kneePushUpAnim(): AnimSpec {
  const top: S = { torso: 58, head: 62, ua: 180, fa: 180, th: 238, sh: 300, ft: 300, hand: { x: 150, y: 207 } };
  const bottom: S = { ...top, torso: 82, head: 84, th: 262 };
  return {
    view: 'side',
    anchor: { joint: 'knee', x: 62, y: 206 },
    props: [mat(30, 180)],
    frames: ecc(top, bottom, { move1: 1700, move2: 1000 }),
    frame: { x: 20, y: 70, w: 200, h: 150 },
  };
}

function supermanAnim(): AnimSpec {
  const down: S = { torso: 87, head: 92, ua: 94, fa: 92, th: 267, sh: 267, ft: 267 };
  const up: S = { torso: 77, head: 80, ua: 76, fa: 78, th: 279, sh: 281, ft: 281 };
  return {
    view: 'side',
    anchor: { joint: 'hip', x: 96, y: 202 },
    props: [mat(10, 220)],
    frames: con(down, up, { move1: 1000, hold2: 900, move2: 1500 }),
    frame: { x: 0, y: 100, w: 230, h: 120 },
  };
}

/** Yon ko'rinishda: tirsakda tayanish, ustki qo'l shiftga */
function sidePlankAnim(): AnimSpec {
  const p: S = { torso: 82, head: 86, ua: 180, fa: 90, ua2: 2, fa2: 0, th: 262, sh: 262, ft: 168 };
  return {
    view: 'side',
    anchor: { joint: 'toe', x: 44, y: F },
    props: [mat(24, 196)],
    frames: [
      { pose: p, dur: 2200, phase: 'up' },
      { pose: { ...p, torso: 81.2, head: 85 }, dur: 2200, phase: 'down' },
    ],
    frame: { x: 24, y: 50, w: 200, h: 170 },
  };
}

function reverseCrunchAnim(): AnimSpec {
  const base = { head: 274, ua: 93, fa: 92, at: { x: 62, y: 202 } };
  const start: S = { ...base, torso: 270, th: 2, sh: 92, ft: 40 };
  const end: S = { ...base, torso: 257, head: 268, curve: 0.25, th: -34, sh: 58, ft: 10 };
  return {
    view: 'side',
    anchor: { joint: 'shoulder', x: 62, y: 202 },
    props: [mat(20, 180)],
    frames: con(start, end, { move1: 1000, hold2: 500, move2: 1600 }),
    frame: { x: 10, y: 80, w: 200, h: 140 },
  };
}

/** Oyoqlar navbatma-navbat: bir tizza ko'krakka, ikkinchi oyoq cho'zilgan */
function bicycleCrunchAnim(): AnimSpec {
  const base = { torso: 296, head: 314, curve: 0.3, ua: 340, fa: 205 };
  const a: S = { ...base, th: -25, sh: 60, ft: 40, th2: 72, sh2: 72, ft2: 40 };
  const b: S = { ...base, torso: 294, th: 72, sh: 72, ft: 40, th2: -25, sh2: 60, ft2: 40 };
  return {
    view: 'side',
    anchor: { joint: 'hip', x: 118, y: 202 },
    props: [mat(20, 190)],
    frames: [
      { pose: a, dur: 300, phase: 'squeeze' },
      { pose: a, dur: 800, phase: 'up' },
      { pose: b, dur: 300, phase: 'squeeze' },
      { pose: b, dur: 800, phase: 'up' },
    ],
    frame: { x: 20, y: 80, w: 200, h: 140 },
  };
}

/** Planka holatida tizzalar navbatma-navbat; oraliq kadrlar oyoqlarni poldan ushlab o'tkazadi */
function mountainClimberAnim(): AnimSpec {
  const base = { torso: 81, head: 84, ua: 180, fa: 180 };
  const inn = { th: 112, sh: 266, ft: 222 };
  const out = { th: 246, sh: 246, ft: 168 };
  const pass = { th: 182, sh: 292, ft: 262 };
  const a: S = { ...base, ...inn, th2: out.th, sh2: out.sh, ft2: out.ft };
  const b: S = { ...base, ...out, th2: inn.th, sh2: inn.sh, ft2: inn.ft };
  const m1: S = { ...base, ...pass, th2: pass.th - 6, sh2: pass.sh, ft2: pass.ft };
  const m2: S = { ...base, th: pass.th - 6, sh: pass.sh, ft: pass.ft, th2: pass.th, sh2: pass.sh, ft2: pass.ft };
  return {
    view: 'side',
    anchor: { joint: 'wrist', x: 190, y: 207 },
    props: [mat(30, 190)],
    frames: [
      { pose: a, dur: 130, phase: 'squeeze' },
      { pose: a, dur: 190, phase: 'up' },
      { pose: m1, dur: 190, phase: 'up' },
      { pose: b, dur: 130, phase: 'squeeze' },
      { pose: b, dur: 190, phase: 'up' },
      { pose: m2, dur: 190, phase: 'up' },
    ],
    frame: { x: 30, y: 80, w: 200, h: 140 },
  };
}

/** Polda o'tirib, oyoq kaftlari ostidan o'tgan lentani belga tortish */
function bandRowAnim(): AnimSpec {
  const base = { head: 0, ua: 0, fa: 0, th: 90, sh: 90, ft: 12, foot: { x: 164, y: 203 } };
  return {
    view: 'side',
    anchor: { joint: 'hip', x: 78, y: 198 },
    held: { kind: 'band', from: { x: 172, y: 198 } },
    props: [mat(30, 180)],
    frames: con({ ...base, torso: 8, head: 10, hand: { x: 132, y: 162 } }, { ...base, torso: -4, head: -2, hand: { x: 86, y: 170 } }, { move1: 1100, hold2: 500, move2: 1800 }),
    frame: { x: 20, y: 70, w: 200, h: 150 },
  };
}

/** Fitbol — dumaloq yostiq (pad, uzunligi ~0). Kichik nuqta sahna ramkasi to'pni to'liq qamrashi uchun. */
function ballLegCurlAnim(): AnimSpec {
  const base = { head: 270, ua: 92, fa: 90, th: 0, sh: 0, at: { x: 52, y: 202 } };
  return {
    view: 'side',
    anchor: { joint: 'shoulder', x: 52, y: 202 },
    props: [mat(20, 200), { kind: 'pad', x: 205, y: 184, w: 0.01, h: 1 }, { kind: 'pad', x: 180, y: 184, w: 0.01, h: 54 }],
    frames: con(
      { ...base, torso: 249, head: 262, ft: 345, foot: { x: 186, y: 151 } },
      { ...base, torso: 238, head: 256, ft: 70, foot: { x: 170, y: 152 } },
      { move1: 1200, hold2: 500, move2: 1800 },
    ),
    frame: { x: 10, y: 80, w: 220, h: 140 },
  };
}

/* ===================== MASHQLAR ===================== */

export const HOME_EXERCISES: Exercise[] = [
  /* ---------- OYOQLAR: O‘TIRISH VA HAMLA ---------- */
  {
    id: 'sumo-squat',
    name: 'Sumo o‘tirish',
    en: 'Sumo Squat',
    pattern: 'squat',
    mechanics: 'compound',
    primary: ['quads', 'glutes', 'adductors'],
    secondary: ['hamstrings', 'abs'],
    equipment: [],
    equipmentAny: ['dumbbells', 'kettlebell'],
    level: 1,
    score: 6,
    loadType: 'dumbbell',
    increment: 2,
    caution: ['knee', 'hip'],
    setup: [
      'Oyoqlarni yelkadan ancha keng qo‘ying, oyoq uchlari 30–45° tashqariga qaragan.',
      'Gantelni bir uchidan (yoki girya dastasidan) ikki qo‘llab ushlang — qo‘llar to‘g‘ri, yuk oyoqlar orasida osilib tursin.',
    ],
    steps: [
      'Tizzalarni oyoq uchlari yo‘nalishida yonga ochib, tosni to‘g‘ri pastga tushiring.',
      'Son polga parallel bo‘lguncha (yoki og‘riqsiz chuqurlikkacha) tushing — gavda tik, bel tekis.',
      'Tovonlar orqali polni itarib turing, tepada dumbani qising.',
    ],
    cues: ['Tizzalar oyoq uchlari ustida — ichkariga qulamasin', 'Yuk tos ostida tik pastga-yuqoriga yursin', 'Osonlashsa — og‘irroq gantel yoki pastda 2 soniya pauza'],
    breathing: BREATH_BRACE,
    mistakes: [
      {
        title: 'Tizzalar ichkariga qulaydi',
        why: 'Tizzaga yonlama bosim tushadi, dumba va son ichki mushaklari kamroq ishlaydi.',
        fix: 'Tizzalarni oyoq uchlari tomon ochib turing; kerak bo‘lsa oyoqlarni biroz torroq qo‘ying.',
      },
      { title: 'Gavda oldinga engashadi', why: 'Yuk belga o‘tadi, gantel oyoqlardan oldinga chiqadi.', fix: 'Ko‘krakni ko‘tarib, gantelni tos ostida tik tushiring.' },
      { title: 'Yarim amplituda', why: 'Dumba va son ichki mushaklari to‘liq cho‘zilmaydi.', fix: 'Son polga parallel bo‘lguncha tushing.', demo: { rom: 0.45 } },
    ],
    benefits: [
      { id: 'joints', text: 'Son ichki mushaklari va dumbani mustahkamlaydi — tos va tizza barqarorligi uchun foydali.' },
      { id: 'metabolic', text: 'Katta mushaklar birga ishlaydi — energiya sarfi yuqori.' },
    ],
    anim: sumoSquatAnim(),
    tempo: '3-1-1',
  },
  {
    id: 'reverse-lunge',
    name: 'Orqaga hamla',
    en: 'Reverse Lunge',
    pattern: 'lunge',
    mechanics: 'compound',
    primary: ['glutes', 'quads'],
    secondary: ['hamstrings', 'adductors'],
    equipment: [],
    level: 1,
    score: 5,
    loadType: 'bodyweight',
    increment: 0,
    unilateral: true,
    caution: ['knee'],
    setup: ['Oyoqlarni tos kengligida qo‘yib tik turing, qo‘llar belda yoki yonda.'],
    steps: [
      'Bir oyoq bilan katta qadam orqaga tashlang — oyoq uchiga tushing.',
      'Orqa tizza polga yaqinlashguncha ikkala tizzani bukib to‘g‘ri pastga tushing.',
      'Old oyoq tovoni orqali itarib, boshlang‘ich holatga qayting. Barcha takrorlardan so‘ng oyoqni almashtiring.',
    ],
    cues: ['Old boldir deyarli tik — tizza oyoq uchidan oshib ketmasin', 'Gavdani biroz oldinga engashtirsangiz — dumba ko‘proq ishlaydi', 'Orqaga qadam oldinga hamladan tizzaga yengilroq'],
    breathing: BREATH_BRACE,
    mistakes: [
      { title: 'Old tizza ichkariga qulaydi', why: 'Tizzaga yonlama bosim tushadi.', fix: 'Tizzani ikkinchi-uchinchi barmoq yo‘nalishida ushlang.' },
      {
        title: 'Qadam juda qisqa',
        why: 'Tizza oldinga ketib, son oldi va tizza ortiqcha yuklanadi, dumba kam ishlaydi.',
        fix: 'Pastda ikkala tizza taxminan 90° bo‘ladigan uzunlikda qadam tashlang.',
      },
    ],
    benefits: [
      { id: 'balance', text: 'Bir oyoqda tushish muvozanat va tos barqarorligini yaxshilaydi.' },
      { id: 'joints', text: 'O‘ng va chap oyoq kuchidagi farqni tekislaydi.' },
    ],
    anim: reverseLungeAnim(),
  },
  {
    id: 'curtsy-lunge',
    name: 'Reverans hamla',
    en: 'Curtsy Lunge',
    pattern: 'lunge',
    mechanics: 'compound',
    primary: ['glutes', 'quads'],
    secondary: ['adductors', 'hamstrings'],
    equipment: [],
    level: 2,
    score: 4,
    loadType: 'bodyweight',
    increment: 0,
    unilateral: true,
    caution: ['knee', 'hip'],
    setup: ['Oyoqlarni tos kengligida qo‘yib tik turing, qo‘llar belda.'],
    steps: [
      'Bir oyoqni orqaga va diagonal bo‘ylab ikkinchi oyoq ortiga o‘tkazing — xuddi reverans qilgandek.',
      'Tos old tomonga qaragan holda ikkala tizzani bukib pastga tushing, orqa tizza polga yaqinlashsin.',
      'Old oyoq tovoni orqali itarib qayting. Barcha takrorlardan so‘ng tomonni almashtiring.',
    ],
    cues: [
      'Tos va yelkalar to‘g‘ri oldinga qarasin — burilmasin',
      'Old tizza oyoq uchi yo‘nalishida qoladi',
      'Kesishuvni kichikdan boshlang — tizza yoki son bo‘g‘imida noqulaylik bo‘lsa, kamaytiring',
    ],
    breathing: BREATH_BRACE,
    mistakes: [
      { title: 'Old tizza ichkariga buraladi', why: 'Tizzaga burama yuklama tushadi.', fix: 'Orqa oyoqni kamroq kesishtiring, old tizzani oyoq uchi ustida ushlang.' },
      { title: 'Tos buriladi', why: 'Yuk dumbadan belga va tizzaga o‘tadi.', fix: 'Tos va yelkalarni old tomonga qaratib, sekinroq tushing.' },
    ],
    benefits: [
      { id: 'balance', text: 'Muvozanat va tos barqarorligi.' },
      { id: 'joints', text: 'Oddiy hamladan ko‘ra dumbaning yon (o‘rta) mushagini ko‘proq ishlatadi.' },
    ],
    anim: curtsyLungeAnim(),
  },
  {
    id: 'wall-sit',
    name: 'Devorga suyanib o‘tirish',
    en: 'Wall Sit',
    pattern: 'squat',
    mechanics: 'compound',
    primary: ['quads'],
    secondary: ['glutes', 'adductors'],
    equipment: [],
    level: 1,
    score: 3,
    loadType: 'bodyweight',
    increment: 0,
    timed: true,
    caution: ['knee'],
    setup: ['Devorga orqa bilan suyaning, oyoqlarni devordan taxminan bir qadam oldinga, tos kengligida qo‘ying.'],
    steps: [
      'Orqani devor bo‘ylab sirpantirib, son polga parallel bo‘lguncha tushing — tizzalar taxminan 90°.',
      'Tizzalar to‘piq ustida, orqa va bosh devorda. 20–60 soniya ushlang.',
      'Devor bo‘ylab sirpanib turing.',
    ],
    cues: [
      'Tizzalar oyoq uchidan oldinga chiqsa — oyoqlarni devordan uzoqroq qo‘ying',
      'Qo‘llar sonlarga tiralmasin — oldinga cho‘zing yoki ko‘krakda chalishtiring',
      'Tizza og‘risa — balandroq ushlang (tizza 45–60°)',
    ],
    breathing: 'Nafasni ushlamang — qisqa, bir tekis nafas oling.',
    mistakes: [
      { title: 'Tizzalar oldinga chiqib ketadi', why: 'Tizza qopqog‘i ostiga bosim oshadi.', fix: 'Oyoqlarni devordan uzoqroq qo‘ying — boldir tik bo‘lsin.' },
      { title: 'Qo‘llar bilan sonlarga tirash', why: 'Yuk qo‘llarga o‘tadi, son kam ishlaydi.', fix: 'Qo‘llarni oldinga cho‘zing.' },
    ],
    benefits: [{ id: 'joints', text: 'Son oldi mushaklarini harakatsiz ushlab kuchaytiradi — tizzani takroriy bukmasdan.' }],
    anim: wallSitAnim(),
  },

  /* ---------- DUMBA ---------- */
  {
    id: 'single-leg-bridge',
    name: 'Bir oyoqda ko‘prikcha',
    en: 'Single-Leg Glute Bridge',
    pattern: 'glute',
    mechanics: 'isolation',
    primary: ['glutes'],
    secondary: ['hamstrings'],
    equipment: [],
    level: 1,
    score: 6,
    loadType: 'bodyweight',
    increment: 0,
    unilateral: true,
    caution: ['lowerBack'],
    setup: ['Chalqancha yoting, bir oyoq kafti polda tosga yaqin, ikkinchi oyoq tizzada to‘g‘rilangan.', 'Qo‘llar yonda, kaftlar polda.'],
    steps: [
      'Polda turgan oyoq tovoni orqali itarib, tosni yelka va tizza bilan bir chiziqqa ko‘taring.',
      'Erkin oyoq tayanch son bilan bir burchakda qolsin; tepada dumbani 1–2 soniya qising.',
      'Sekin tushiring. Barcha takrorlardan so‘ng oyoqni almashtiring.',
    ],
    cues: [
      'Tos ikki tomonda bir xil balandlikda — erkin oyoq tomonga tushmasin',
      'Tovon tosga yaqin bo‘lsa son oldi, uzoq bo‘lsa son orqasi ko‘proq ishlaydi',
      'Qovurg‘alar pastga — bel egilmasin',
    ],
    breathing: BREATH_PRESS,
    mistakes: [
      { title: 'Tos bir tomonga tushadi', why: 'Dumbaning yon mushaklari ishni bajarmaydi, bel buraladi.', fix: 'Amplitudani kamaytiring; avval ikki oyoqli ko‘prikcha bilan kuch to‘plang.' },
      {
        title: 'Belni egib ko‘tarish',
        why: 'Harakat dumbadan belga o‘tadi.',
        fix: 'Qorinni taranglang, tos tizza-yelka chizig‘iga yetganda to‘xtang.',
        demo: { set: [{ kf: 2, pose: { torso: 234, head: 262 } }, { kf: 3, pose: { torso: 234, head: 262 } }] },
      },
    ],
    benefits: [
      { id: 'backHealth', text: 'Dumbani o‘z vazni bilan, belga kam yuklama bilan kuchaytiradi.' },
      { id: 'balance', text: 'Tosni bir oyoqda barqaror ushlashni o‘rgatadi.' },
    ],
    anim: singleLegBridgeAnim(),
  },
  {
    id: 'glute-kickback',
    name: 'To‘rt oyoqlab orqaga tepish',
    en: 'Quadruped Glute Kickback',
    pattern: 'glute',
    mechanics: 'isolation',
    primary: ['glutes'],
    secondary: ['hamstrings', 'abs'],
    equipment: [],
    level: 1,
    score: 5,
    loadType: 'bodyweight',
    increment: 0,
    unilateral: true,
    caution: ['lowerBack', 'wrist'],
    setup: ['To‘rt oyoqlab turing: kaftlar yelka ostida, tizzalar tos ostida.', 'Belni tekis ushlang, qorinni yengil taranglang.'],
    steps: [
      'Bir oyoqni tizzada 90° bukik holda orqaga-yuqoriga itaring — tovon shiftga qarasin.',
      'Son pol bilan parallel bo‘lganda dumbani 1 soniya qising.',
      'Sekin qaytaring, tizza polga tegmasin. Barcha takrorlardan so‘ng oyoqni almashtiring.',
    ],
    cues: ['Harakat son bo‘g‘imidan — bel egilmaydi', 'Son gavda chizig‘idan yuqoriga chiqmasin', 'Osonlashsa — tizzalar ustidan mini-lenta yoki to‘piqqa yengil yuk'],
    breathing: BREATH_PRESS,
    mistakes: [
      {
        title: 'Belni egib ko‘tarish',
        why: 'Harakat dumbadan belga o‘tadi, bel bo‘g‘imchalari siqiladi.',
        fix: 'Qorinni taranglang, oyoqni faqat gavda chizig‘igacha ko‘taring.',
      },
      { title: 'Tos yon tomonga buriladi', why: 'Dumba o‘rniga bel va sonning yon mushaklari ishlaydi.', fix: 'Ikkala son suyagi pol tomonga qaragan holda qolsin — amplitudani kamaytiring.' },
    ],
    benefits: [{ id: 'posture', text: 'Kuchli dumba tosning to‘g‘ri holatini qo‘llab-quvvatlaydi.' }],
    anim: gluteKickbackAnim(),
  },
  {
    id: 'fire-hydrant',
    name: 'Tizzani yonga ko‘tarish («gidrant»)',
    en: 'Fire Hydrant',
    pattern: 'glute',
    mechanics: 'isolation',
    primary: ['glutes'],
    secondary: ['abs', 'obliques'],
    equipment: [],
    level: 1,
    score: 4,
    loadType: 'bodyweight',
    increment: 0,
    unilateral: true,
    caution: ['wrist'],
    setup: ['To‘rt oyoqlab turing: kaftlar yelka ostida, tizzalar tos ostida, bel tekis.'],
    steps: [
      'Tizzani 90° bukik holda yon tomonga ko‘taring — son pol bilan parallelga yaqinlashsin.',
      'Tepada 1 soniya ushlang, tos va gavda qimirlamasin.',
      'Sekin tushiring. Barcha takrorlardan so‘ng tomonni almashtiring.',
    ],
    cues: ['Gavda ko‘tarilgan oyoq tomonga og‘masin', 'Og‘irlik ikki kaft va tayanch tizzada teng', 'Qiyinlashtirish: tizzalar ustidan mini-lenta'],
    breathing: BREATH_PRESS,
    mistakes: [
      { title: 'Gavdani qiyshaytirish', why: 'Oyoq tos aylanishi hisobiga ko‘tariladi, dumba kam ishlaydi.', fix: 'Amplitudani kamaytiring — tos pol bilan parallel qolsin.' },
      { title: 'Belni egish yoki bukish', why: 'Bel holati buzilib, yuk belga o‘tadi.', fix: 'Qorinni yengil taranglab, belni tekis ushlang.' },
    ],
    benefits: [{ id: 'joints', text: 'Son bo‘g‘imini barqarorlashtiruvchi dumba o‘rta mushagini mashq qildiradi.' }],
    anim: fireHydrantAnim(),
  },
  {
    id: 'clamshell',
    name: '«Chig‘anoq» (yonboshlab tizzani ochish)',
    en: 'Clamshell',
    pattern: 'glute',
    mechanics: 'isolation',
    primary: ['glutes'],
    secondary: [],
    equipment: [],
    level: 1,
    score: 4,
    loadType: 'bodyweight',
    increment: 0,
    unilateral: true,
    setup: [
      'Yonboshlab yoting: bosh pastki qo‘lda, sonlar oldinga taxminan 45°, tizzalar taxminan 90° bukik.',
      'Tovonlar, tizzalar va son suyaklari bir-birining ustida; ustki qo‘l tos ustida.',
    ],
    steps: [
      'Tovonlarni bir-biridan ajratmay, ustki tizzani yuqoriga oching.',
      'Tos orqaga ag‘darilmasdan qancha ochilsa — shuncha; tepada 1 soniya ushlang.',
      'Sekin yoping. Barcha takrorlardan so‘ng ikkinchi tomonga yoting.',
    ],
    cues: ['Tos orqaga ochilmasin — ustki son suyagi biroz oldinga «qulagan» holda qoladi', 'Harakat kichik — muhimi dumbaning yon qismini his qilish', 'Qiyinlashtirish: tizzalardan biroz yuqoriga mini-lenta'],
    breathing: BREATH_PRESS,
    mistakes: [
      { title: 'Tos orqaga ag‘dariladi', why: 'Tizza dumba emas, tos aylanishi hisobiga ochiladi.', fix: 'Amplitudani kamaytiring, ustki qo‘l bilan tosni ushlab turing.' },
      { title: 'Tez va silkitib bajarish', why: 'Mushak yuklamasi kamayadi.', fix: 'Ochishda 1 soniya, tepada 1 soniya, yopishda 2 soniya.' },
    ],
    benefits: [{ id: 'joints', text: 'Dumba o‘rta mushagini kuchaytiradi — bu mushak bir oyoqda turganda tos va tizzani to‘g‘ri ushlaydi.' }],
    anim: clamshellAnim(),
  },
  {
    id: 'side-leg-raise',
    name: 'Yonboshlab oyoq ko‘tarish',
    en: 'Side-Lying Leg Raise',
    pattern: 'glute',
    mechanics: 'isolation',
    primary: ['glutes'],
    secondary: ['obliques'],
    equipment: [],
    level: 1,
    score: 4,
    loadType: 'bodyweight',
    increment: 0,
    unilateral: true,
    setup: [
      'Yonboshlab yoting, pastki tizza biroz bukik, ustki oyoq to‘g‘ri.',
      'Bosh pastki qo‘lda, tos va yelkalar bir tekislikda — oldinga ham, orqaga ham ag‘darilmasin.',
    ],
    steps: [
      'Ustki oyoqni to‘g‘ri holda yuqoriga ko‘taring — tovon yo‘l boshlasin, oyoq uchi oldinga qaragan.',
      'Taxminan 30–40° ga ko‘tarib, tepada 1 soniya ushlang.',
      'Sekin tushiring. Barcha takrorlardan so‘ng ikkinchi tomonga yoting.',
    ],
    cues: ['Oyoq gavda chizig‘ida yoki undan biroz orqada', 'Oyoq uchini shiftga burmang — aks holda son oldi ishlaydi', 'Baland emas — sekin va nazoratli'],
    breathing: BREATH_PRESS,
    mistakes: [
      {
        title: 'Oyoq oldinga ketadi',
        why: 'Son bukuvchilari va sonning yon mushagi ishni oladi, dumba o‘rta mushagi kam ishlaydi.',
        fix: 'Oyoqni gavda chizig‘ida yoki biroz orqada ko‘taring.',
      },
      { title: 'Juda baland ko‘tarish', why: 'Tos qiyshayib, harakat beldan bo‘ladi.', fix: '30–40° yetarli — tos qimirlamaguncha ko‘taring.' },
      { title: 'Oyoq uchi shiftga qaraydi', why: 'Son tashqariga buriladi, ish son oldiga o‘tadi.', fix: 'Oyoq uchini oldinga yoki biroz pastga qarating.' },
    ],
    benefits: [
      { id: 'joints', text: 'Son bo‘g‘imini yon tomondan barqarorlashtiruvchi mushaklarni kuchaytiradi.' },
      { id: 'balance', text: 'Kuchli dumba o‘rta mushagi bir oyoqda turganda tosni tekis ushlaydi.' },
    ],
    anim: sideLegRaiseAnim(),
  },
  {
    id: 'banded-lateral-walk',
    name: 'Mini-lenta bilan yonga yurish',
    en: 'Banded Lateral Walk',
    pattern: 'glute',
    mechanics: 'isolation',
    primary: ['glutes'],
    secondary: ['quads'],
    equipment: ['miniBand'],
    level: 1,
    score: 5,
    loadType: 'band',
    increment: 0,
    caution: ['knee'],
    setup: [
      'Mini-lentani to‘piqlar ustiga (yoki tizzalardan biroz pastga) kiying.',
      'Oyoqlar tos kengligida, tizzalar biroz bukik, tos orqada — yarim o‘tirish holati.',
    ],
    steps: [
      'Bir oyoq bilan yon tomonga kichik qadam tashlang — lenta tarang bo‘lsin.',
      'Ikkinchi oyoqni nazorat bilan yaqinlashtiring, lenta bo‘shab qolmasin.',
      'Bir tomonga 10–15 qadam, so‘ng shuncha qaytib.',
    ],
    cues: ['Gavda chayqalmasin, tos bir balandlikda yursin', 'Oyoq uchlari oldinga qaragan, tizzalar ichkariga qulamaydi', 'Lenta qanchalik pastda bo‘lsa (to‘piq, oyoq kafti) — shunchalik qiyin'],
    breathing: 'Bir tekis nafas oling — har qadamda nafasni ushlamang.',
    mistakes: [
      { title: 'Gavda yonga chayqaladi', why: 'Harakat dumba o‘rniga gavda tebranishidan bo‘ladi.', fix: 'Qadamni qisqartiring, qorinni taranglang.' },
      {
        title: 'Tizzalar ichkariga qulaydi',
        why: 'Lenta tizzalarni ichkariga tortadi — tizzaga yonlama bosim tushadi.',
        fix: 'Tizzalarni faol ravishda tashqariga ochib turing; yengilroq lenta oling.',
      },
    ],
    benefits: [{ id: 'joints', text: 'Tos va tizzani barqarorlashtiruvchi dumba mushaklarini mashq qildiradi — razminkada ham qulay.' }],
    anim: lateralWalkAnim(),
  },

  /* ---------- SON ORQASI ---------- */
  {
    id: 'ball-leg-curl',
    name: 'Fitbolda oyoq bukish',
    en: 'Stability Ball Leg Curl',
    pattern: 'hamIso',
    mechanics: 'isolation',
    primary: ['hamstrings'],
    secondary: ['glutes', 'calves'],
    equipment: ['fitball'],
    level: 2,
    score: 5,
    loadType: 'bodyweight',
    increment: 0,
    caution: ['lowerBack'],
    setup: [
      'Chalqancha yoting, tovonlarni fitbol ustiga qo‘ying, qo‘llar yonda kaftlar bilan polda.',
      'Tosni ko‘tarib, tanani yelkadan tovongacha to‘g‘ri chiziqqa keltiring.',
    ],
    steps: [
      'Tosni tushirmasdan tizzalarni bukib, fitbolni tovonlar bilan tosga tomon dumalating.',
      'Oxirida oyoq kaftlari to‘p ustida, tos yuqorida — 1 soniya ushlang.',
      'Nazorat bilan oyoqlarni yozib, to‘pni qaytaring.',
    ],
    cues: ['Tos butun set davomida yuqorida', 'Qo‘llar polni bosib muvozanatni ushlaydi', 'Qiyinlashtirish: bir oyoqda'],
    breathing: BREATH_PULL,
    mistakes: [
      { title: 'Tos tushib ketadi', why: 'Son orqasi va dumba yuklamasi kamayadi.', fix: 'Dumbani qisib, tosni yuqorida ushlang; amplitudani kamaytiring.' },
      { title: 'Belni egish', why: 'Harakat beldan bo‘ladi, bel bo‘g‘imchalari siqiladi.', fix: 'Qovurg‘alarni pastga tushiring, tosni biroz orqaga «burang».' },
    ],
    benefits: [
      { id: 'joints', text: 'Son orqasi kuchi tizzani barqaror qiladi.' },
      { id: 'balance', text: 'Beqaror to‘p tos va tana stabilizatorlarini ishlatadi.' },
    ],
    anim: ballLegCurlAnim(),
  },

  /* ---------- BEL ---------- */
  {
    id: 'superman',
    name: '«Supermen» (qorinda yotib ko‘tarilish)',
    en: 'Superman',
    pattern: 'hinge',
    mechanics: 'compound',
    primary: ['lowerBack', 'glutes'],
    secondary: ['hamstrings', 'upperBack'],
    equipment: [],
    level: 1,
    score: 3,
    loadType: 'bodyweight',
    increment: 0,
    caution: ['lowerBack', 'neck'],
    setup: ['Qorin bilan polga yoting, qo‘llar boshdan oldinga cho‘zilgan, oyoqlar to‘g‘ri.', 'Peshona polga yaqin, nigoh pastda.'],
    steps: [
      'Dumbani qisib, qo‘llar, ko‘krak va oyoqlarni poldan bir necha santimetr ko‘taring.',
      'Tepada 2–3 soniya ushlang, bo‘yin uzun — boshni orqaga tashlamang.',
      'Sekin tushiring.',
    ],
    cues: ['Balandlik emas, cho‘zilish muhim: qo‘llar oldinga, oyoqlar orqaga «uzayadi»', 'Nigoh polda — iyak biroz ichkarida', 'Belda noqulaylik bo‘lsa — faqat qo‘llarni yoki faqat oyoqlarni ko‘taring'],
    breathing: 'Ko‘tarilayotganda nafas chiqaring, tepada bir tekis nafas oling.',
    mistakes: [
      { title: 'Juda baland ko‘tarish', why: 'Bel haddan ortiq egilib, bel bo‘g‘imchalari siqiladi.', fix: 'Bir necha santimetr yetarli — uzunlikka intiling.' },
      {
        title: 'Boshni orqaga tashlash',
        why: 'Bo‘yin umurtqalari siqiladi.',
        fix: 'Nigohni polga qarating, iyakni biroz ichkariga torting.',
        demo: { set: [{ kf: 2, pose: { head: 48 } }, { kf: 3, pose: { head: 48 } }] },
      },
    ],
    benefits: [
      { id: 'posture', text: 'Umurtqani tik ushlovchi orqa mushaklarini kuchaytiradi.' },
      { id: 'backHealth', text: 'Bel va dumba mushaklarining chidamliligini oshiradi.' },
    ],
    anim: supermanAnim(),
  },

  /* ---------- KO‘KRAK VA ORQA ---------- */
  {
    id: 'knee-push-up',
    name: 'Tizzada otjimaniya',
    en: 'Knee Push-up',
    pattern: 'hPush',
    mechanics: 'compound',
    primary: ['chest'],
    secondary: ['triceps', 'frontDelts', 'abs'],
    equipment: [],
    level: 1,
    score: 4,
    loadType: 'bodyweight',
    increment: 0,
    caution: ['wrist'],
    setup: ['Tizzalarga tayaning (ostiga yumshoq gilam), kaftlar yelkadan biroz keng.', 'Tana tizzadan boshgacha to‘g‘ri chiziq — tos bukilmasin.'],
    steps: ['Ko‘krak polga 2–3 sm qolguncha tushing — tirsaklar tanaga 30–45°.', 'Polni itarib qayting, tana chizig‘ini buzmang.'],
    cues: ['Dumba va qorin tarang — tana tizzadan boshgacha «taxta»', 'Oddiy otjimaniyaga o‘tishdagi oraliq bosqich', '15 ta toza takror oson bo‘lsa — oddiy otjimaniyani sinab ko‘ring'],
    breathing: BREATH_PRESS,
    mistakes: [
      {
        title: 'Tos bukiladi',
        why: 'Tana chizig‘i buziladi, ko‘krak kam ishlaydi.',
        fix: 'Dumbani qisib, tosni yelka-tizza chizig‘iga keltiring.',
      },
      {
        title: 'Bel osilib qoladi',
        why: 'Bel umurtqalari egiladi, press ishlamaydi.',
        fix: 'Dumba va qorinni qising — tana taxta kabi.',
        demo: {
          set: [
            { kf: 0, pose: { torso: 52, th: 244 } },
            { kf: 1, pose: { torso: 52, th: 244 } },
            { kf: 2, pose: { torso: 78, th: 268 } },
            { kf: 3, pose: { torso: 78, th: 268 } },
          ],
        },
      },
      { title: 'Yarim amplituda', why: 'Ko‘krak kam ishlaydi.', fix: 'To‘liq tushing.', demo: { rom: 0.4 } },
    ],
    benefits: [
      { id: 'bone', text: 'Qo‘l va yelka suyaklariga o‘z vazni bilan yuklama beradi.' },
      { id: 'core', text: 'Tanani to‘g‘ri chiziqda ushlash press mushaklarini ham ishlatadi.' },
    ],
    anim: kneePushUpAnim(),
  },
  {
    id: 'band-row',
    name: 'O‘tirib rezina lentani tortish',
    en: 'Seated Band Row',
    pattern: 'hPull',
    mechanics: 'compound',
    primary: ['lats', 'upperBack'],
    secondary: ['rearDelts', 'biceps'],
    equipment: ['bands'],
    level: 1,
    score: 5,
    loadType: 'band',
    increment: 0,
    setup: [
      'Polda o‘tiring, oyoqlar oldinga cho‘zilgan, tizzalar biroz bukik.',
      'Uzun lentani oyoq kaftlari ostidan o‘tkazib, uchlarini qo‘llar cho‘zilgan holda ushlang. Gavda tik.',
    ],
    steps: [
      'Kuraklarni orqaga-pastga tushirib, tirsaklarni tanaga yaqin orqaga torting — qo‘llar belga kelsin.',
      'Kuraklarni 1 soniya qising.',
      'Nazorat bilan qo‘llarni oldinga qaytaring.',
    ],
    cues: ['Gavda orqaga yiqilmasin — tortish qo‘l va orqa bilan', 'Yelkalar quloqdan uzoqda', 'Qiyinlashtirish: lentani qisqaroq ushlang yoki qalinroq lenta oling'],
    breathing: BREATH_PULL,
    mistakes: [
      { title: 'Gavda bilan orqaga silkinish', why: 'Ish orqa mushaklaridan belga o‘tadi.', fix: 'Gavdani tik qotirib, faqat qo‘llar va kuraklar bilan torting.' },
      { title: 'Yelkalarni ko‘tarish', why: 'Trapetsiyaning yuqori qismi ishni oladi.', fix: 'Avval kuraklarni pastga tushiring, keyin torting.' },
      { title: 'Bel dumaloqlanadi', why: 'Son orqasi tarang bo‘lsa tos orqaga ag‘dariladi, bel bukiladi.', fix: 'Tizzalarni ko‘proq buking yoki buklangan sochiq ustida o‘tiring.' },
    ],
    benefits: [{ id: 'posture', text: 'Kuraklar orasidagi mushaklar — bukchayishga qarshi.' }],
    anim: bandRowAnim(),
  },

  /* ---------- TANA MARKAZI (KOR) ---------- */
  {
    id: 'bird-dog',
    name: '«Qush-it» (qarama-qarshi qo‘l va oyoq)',
    en: 'Bird Dog',
    pattern: 'core',
    mechanics: 'isolation',
    primary: ['lowerBack', 'glutes'],
    secondary: ['abs', 'obliques', 'frontDelts'],
    equipment: [],
    level: 1,
    score: 5,
    loadType: 'bodyweight',
    increment: 0,
    caution: ['wrist'],
    setup: ['To‘rt oyoqlab turing: kaftlar yelka ostida, tizzalar tos ostida, bel tabiiy tekis.'],
    steps: [
      'Qorinni yengil taranglab, bir qo‘lni oldinga va qarama-qarshi oyoqni orqaga gavda chizig‘igacha cho‘zing.',
      'Uchida 2–3 soniya ushlang — tos va yelkalar pol bilan parallel.',
      'Sekin qaytib, ikkinchi tomonni bajaring.',
    ],
    cues: ['Belga bir stakan suv qo‘yilgandek — to‘kilmasin', 'Oyoqni balandga emas, uzoqqa cho‘zing', 'Qiyin bo‘lsa — avval faqat oyoq yoki faqat qo‘l'],
    breathing: 'Cho‘zayotganda sekin nafas chiqaring.',
    mistakes: [
      { title: 'Oyoqni baland ko‘tarib belni egish', why: 'Bel bo‘g‘imchalari siqiladi, stabilizatsiya maqsadi yo‘qoladi.', fix: 'Oyoqni faqat gavda chizig‘igacha ko‘taring.' },
      { title: 'Tos burilib ketadi', why: 'Chuqur qorin mushaklari ishni bajarmaydi.', fix: 'Sekinroq bajaring, harakat kichikroq bo‘lsin.' },
    ],
    benefits: [
      { id: 'backHealth', text: 'Bel og‘rig‘ida keng qo‘llaniladigan stabilizatsiya mashqi — umurtqaga yuklama kam.' },
      { id: 'balance', text: 'Qarama-qarshi qo‘l va oyoq bilan muvozanat va koordinatsiya.' },
    ],
    anim: birdDogAnim(),
  },
  {
    id: 'side-plank',
    name: 'Yon planka',
    en: 'Side Plank',
    pattern: 'core',
    mechanics: 'isolation',
    primary: ['obliques', 'glutes'],
    secondary: ['abs', 'lowerBack'],
    equipment: [],
    level: 1,
    score: 6,
    loadType: 'bodyweight',
    increment: 0,
    unilateral: true,
    timed: true,
    caution: ['shoulder'],
    setup: ['Yonboshlab yoting: tirsak to‘g‘ri yelka ostida, bilak oldinga qaragan, oyoqlar ustma-ust.'],
    steps: [
      'Tosni ko‘tarib, tanani to‘piqdan boshgacha to‘g‘ri chiziqqa keltiring.',
      'Ustki qo‘lni tosga qo‘ying yoki shiftga cho‘zing. 20–45 soniya ushlang.',
      'Sekin tushib, ikkinchi tomonni bajaring.',
    ],
    cues: ['Tos tushib ketmasin va orqaga ag‘darilmasin', 'Qiyin bo‘lsa — tizzalarni bukib, tizzaga tayanib bajaring', 'Tayanch yelkani quloqdan uzoqlashtiring'],
    breathing: 'Nafasni ushlamang — qisqa, bir tekis nafas oling.',
    mistakes: [
      {
        title: 'Tos tushib ketadi',
        why: 'Yon mushaklar bo‘shashadi, yuk yelka va belga tushadi.',
        fix: 'Tosni yuqoriga «itarib», tanani to‘g‘ri chiziqda ushlang.',
        demo: { set: [{ kf: 0, pose: { torso: 72, th: 268, sh: 268 } }, { kf: 1, pose: { torso: 72, th: 268, sh: 268 } }] },
      },
      { title: 'Yelka quloqqa yopishadi', why: 'Tayanch yelka bo‘g‘imi zo‘riqadi.', fix: 'Tirsakni polga itarib, yelkani pastga tushiring.' },
    ],
    benefits: [
      { id: 'core', text: 'Qiyshiq qorin mushaklari va dumbaning yon qismini birga ishlatadi.' },
      { id: 'backHealth', text: 'Umurtqaga kam yuklama bilan tananing yon tomonini kuchaytiradi.' },
    ],
    anim: sidePlankAnim(),
  },
  {
    id: 'reverse-crunch',
    name: 'Teskari qisqarish',
    en: 'Reverse Crunch',
    pattern: 'core',
    mechanics: 'isolation',
    primary: ['abs'],
    secondary: ['obliques'],
    equipment: [],
    level: 1,
    score: 5,
    loadType: 'bodyweight',
    increment: 0,
    caution: ['lowerBack'],
    setup: ['Chalqancha yoting, qo‘llar yonda, kaftlar polda.', 'Son tik, tizzalar 90° bukik — boldirlar polga parallel.'],
    steps: [
      'Qorinning pastki qismini qisib, tosni poldan ko‘taring — tizzalar ko‘krakka yaqinlashsin.',
      'Tepada 1 soniya qising: belning pastki qismi poldan ozgina uziladi.',
      'Tosni umurtqama-umurtqa sekin tushiring — oyoqlar tushib ketmasin.',
    ],
    cues: ['Harakat — tosning «o‘ralishi», oyoqlarni silkitmang', 'Qo‘llar polni itarmaydi — faqat muvozanat uchun', 'Tizzalar burchagi o‘zgarmaydi'],
    breathing: 'Tosni ko‘tarayotganda nafas chiqaring.',
    mistakes: [
      { title: 'Oyoqlarni silkitish', why: 'Inersiya ishlaydi, press emas.', fix: 'Sekin bajaring, pastda 1 soniya to‘xtang.' },
      { title: 'Tizzalarni yozib yuborish', why: 'Richag uzayadi, bel ko‘tarilib zo‘riqadi.', fix: 'Tizzalarni 90° bukik ushlang.' },
    ],
    benefits: [{ id: 'core', text: 'To‘g‘ri qorin mushagini bo‘yinga yuklamasiz ishlatadi.' }],
    anim: reverseCrunchAnim(),
  },
  {
    id: 'bicycle-crunch',
    name: '«Velosiped»',
    en: 'Bicycle Crunch',
    pattern: 'core',
    mechanics: 'isolation',
    primary: ['abs', 'obliques'],
    secondary: [],
    equipment: [],
    level: 1,
    score: 5,
    loadType: 'bodyweight',
    increment: 0,
    caution: ['neck', 'lowerBack'],
    setup: [
      'Chalqancha yoting, barmoq uchlari chakkada (boshni ushlamang), kuraklar poldan biroz ko‘tarilgan.',
      'Bel polga bosilgan, oyoqlar poldan ko‘tarilgan.',
    ],
    steps: [
      'Bir tizzani ko‘krakka torting va gavdani unga buring — qarama-qarshi yelka tizzaga intiladi.',
      'Bir vaqtda ikkinchi oyoqni oldinga cho‘zing.',
      'Tomonlarni sekin almashtiring — har tomonga bir takror.',
    ],
    cues: ['Burilish yelkadan: tirsak emas, ko‘krak tizzaga yo‘naladi', 'Bel poldan uzilmaydi — cho‘zilgan oyoq qanchalik past bo‘lsa, shunchalik qiyin', 'Tezlik emas, to‘liq burilish muhim'],
    breathing: 'Har burilishda nafas chiqaring.',
    mistakes: [
      { title: 'Boshni qo‘llar bilan tortish', why: 'Bo‘yin umurtqalari zo‘riqadi.', fix: 'Barmoq uchlari faqat chakkaga tegib tursin, nigoh shiftda.' },
      { title: 'Tez «pedal aylantirish»', why: 'Gavda burilmaydi, qiyshiq mushaklar kam ishlaydi.', fix: 'Har tomonda 1 soniya to‘xtab, to‘liq buriling.' },
      { title: 'Bel poldan ko‘tariladi', why: 'Bel zo‘riqadi.', fix: 'Cho‘zilgan oyoqni balandroq ushlang.' },
    ],
    benefits: [{ id: 'core', text: 'To‘g‘ri va qiyshiq qorin mushaklarini birga ishlatadi.' }],
    anim: bicycleCrunchAnim(),
  },
  {
    id: 'mountain-climber',
    name: '«Alpinist»',
    en: 'Mountain Climber',
    pattern: 'core',
    mechanics: 'compound',
    primary: ['abs'],
    secondary: ['obliques', 'frontDelts', 'quads'],
    equipment: [],
    level: 1,
    score: 3,
    loadType: 'bodyweight',
    increment: 0,
    timed: true,
    caution: ['wrist', 'shoulder'],
    setup: ['Otjimaniyaning yuqori holatida turing: kaftlar yelka ostida, tana boshdan tovongacha to‘g‘ri.'],
    steps: [
      'Bir tizzani ko‘krakka torting, so‘ng orqaga qaytaring va shu zahoti ikkinchi tizzani torting.',
      'Oyoqlarni navbatma-navbat almashtiring, tos va yelkalar bir balandlikda qolsin. 20–40 soniya.',
    ],
    cues: ['Avval sekin; texnika barqaror bo‘lsa — tezroq', 'Tos tepaga ko‘tarilmasin, bel osilmasin', 'Yelkalar kaftlar ustida'],
    breathing: 'Ritm bilan nafas oling — nafasni ushlamang.',
    mistakes: [
      { title: 'Tos baland ko‘tariladi', why: 'Qorin mushaklari yuklamasi kamayadi.', fix: 'Tanani planka chizig‘ida ushlang.' },
      { title: 'Bel osilib qoladi', why: 'Bel umurtqalari zo‘riqadi.', fix: 'Qorinni taranglang, tezlikni kamaytiring.' },
    ],
    benefits: [
      { id: 'heart', text: 'Yurak urishini tez oshiradi — kuch va kardio birga.' },
      { id: 'core', text: 'Harakat paytida tanani planka holatida ushlashni o‘rgatadi.' },
    ],
    anim: mountainClimberAnim(),
  },
];
