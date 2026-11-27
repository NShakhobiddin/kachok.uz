// 2026-11 auditi: bo‘shliqlarni to‘ldiruvchi yangi mashqlar (rasmlari Flow-6 da yaratilgan).
// Zal — erkak figura, uy — ayol figura (rasmlarda). Mushak faolligi: docs/emg/extra.json (o‘xshash mashqlar asosida baho).
import type { AnimSpec, Exercise, FrontPose, SidePose } from '../types';
import * as A from './anims';
import { con } from './anims';
import { BREATH_PRESS, BREATH_PULL } from './exerciseText';

const ankle = { joint: 'ankle' as const, x: 112, y: 208 };

/** Blokda to‘g‘ri qo‘l bilan pastga tortish: qo‘llar ko‘z sathidan sonlargacha yoy bo‘ylab */
function straightArmPulldownAnim(): AnimSpec {
  const start: SidePose = { torso: 24, head: 18, ua: 62, fa: 62, th: 176, sh: 182 };
  const end: SidePose = { ...start, ua: 170, fa: 170 };
  return {
    view: 'side',
    anchor: ankle,
    held: { kind: 'cable', from: { x: 186, y: 6 } },
    props: [{ kind: 'cableTower', x: 192, y: 6 }],
    frames: con(start, end, { move1: 1100, hold2: 450, move2: 1900 }),
    frame: { x: 20, y: -10, w: 200, h: 230 },
  };
}

/** Pallof press: qo‘llar ko‘krakdan oldinga to‘g‘rilanadi (gavda burilmaydi) */
function pallofAnim(): AnimSpec {
  const start: SidePose = { torso: 2, head: 2, ua: 168, fa: 40, th: 182, sh: 178 };
  const end: SidePose = { ...start, ua: 92, fa: 92 };
  return { view: 'side', anchor: ankle, frames: con(start, end, { move1: 1000, hold2: 1500, move2: 1500 }) };
}

/** Turnikda tizza ko‘tarish: son oldinga-yuqoriga, boldir pastga osilgan */
function hangingKneeRaiseAnim(): AnimSpec {
  const base = A.hangingLegRaise();
  const start: SidePose = { torso: 0, head: 0, ua: 0, fa: 0, th: 180, sh: 180, ft: 90 };
  const end: SidePose = { torso: -4, head: -2, ua: 0, fa: 0, th: 80, sh: 178, ft: 92 };
  return { ...base, frames: con(start, end, { move1: 1100, hold2: 400, move2: 1700 }) };
}

/** Fermer yurishi (yon ko‘rinish): joyida qadam — oyoqlar navbatma-navbat, qo‘llar to‘g‘ri, gavda tik */
export function farmersCarryAnim(): AnimSpec {
  const arms = { torso: 1, head: 1, ua: 180, fa: 180, ua2: 180, fa2: 180 };
  const a: SidePose = { ...arms, th: 162, sh: 174, ft: 84, th2: 199, sh2: 214, ft2: 128, at: { x: 116, y: 123 } };
  const b: SidePose = { ...arms, th: 199, sh: 214, ft: 128, th2: 162, sh2: 174, ft2: 84, at: { x: 116, y: 123 } };
  const p1: SidePose = { ...arms, th: 182, sh: 180, ft: 90, th2: 168, sh2: 206, ft2: 110, at: { x: 116, y: 119 } };
  const p2: SidePose = { ...arms, th: 168, sh: 206, ft: 110, th2: 182, sh2: 180, ft2: 90, at: { x: 116, y: 119 } };
  return {
    view: 'side',
    anchor: { joint: 'hip', x: 116, y: 121 },
    held: { kind: 'dumbbell' },
    frames: [
      { pose: a, dur: 420, phase: 'hold' },
      { pose: p1, dur: 420, phase: 'hold' },
      { pose: b, dur: 420, phase: 'hold' },
      { pose: p2, dur: 420, phase: 'hold' },
    ],
  };
}

/** Nordik bukilish: tiz cho‘kib, to‘piqlar divan ostida; tizzadan boshgacha tekis tana nazorat bilan oldinga tushadi */
export function nordicCurlAnim(): AnimSpec {
  const top: SidePose = { torso: 0, head: 0, ua: 168, fa: 34, th: 180, sh: 270, ft: 200 };
  const bottom: SidePose = { torso: 52, head: 50, ua: 118, fa: 96, th: 232, sh: 270, ft: 200 };
  return {
    view: 'side',
    anchor: { joint: 'knee', x: 100, y: 207 },
    props: [
      { kind: 'mat', x: 22, y: 0, w: 190 },
      { kind: 'box', x: 0, y: 176, w: 58, h: 38 },
    ],
    frames: A.ecc(top, bottom, { hold1: 400, move1: 2600, hold2: 250, move2: 1400 }),
    frame: { x: -6, y: 40, w: 230, h: 180 },
  };
}

/** Yotib oyoq bukish: qorin bilan qiya yostiqda, tos yostiqda qoladi, tovonlar dumbaga tortiladi */
export function lyingLegCurlAnim(): AnimSpec {
  const base = { torso: 96, head: 104, ua: 176, fa: 120, th: 268 };
  const start: SidePose = { ...base, sh: 262, ft: 175 };
  const end: SidePose = { ...base, sh: 18, ft: 290 };
  return {
    view: 'side',
    anchor: { joint: 'hip', x: 112, y: 140 },
    footGear: { kind: 'anklePad' },
    props: [{ kind: 'bench', x: 46, y: 144, w: 112 }],
    frames: con(start, end, { move1: 1100, hold2: 450, move2: 1900 }),
    frame: { x: 10, y: 50, w: 220, h: 170 },
  };
}

/** Yonga hamla (old ko‘rinish): keng turishdan tos bir oyoq tomonga surilib o‘tiradi, ikkinchi oyoq to‘g‘ri; oyoq kaftlari joyida */
export function lateralLungeAnim(): AnimSpec {
  const hands = { ua: 172, fa: 50, fwd: 80 };
  const wide: FrontPose = { ...hands, th: 158, sh: 158, hipY: 124.6 };
  const low: FrontPose = { ...hands, th: 166, sh: 178, legFwd: 52, th2: 142.5, sh2: 142.5, legFwd2: 0, shift: 21, hipY: 136.5, lean: 28 };
  return { view: 'front', frames: A.ecc(wide, low, { move1: 1700, move2: 1100 }) };
}

/** Orqa delta (orqadan): gavda engashgan, qo‘llar pastdan yon tomonlarga yelka sathigacha («T») */
function rearDeltBentAnim(): AnimSpec {
  const down: FrontPose = { ua: 186, fa: 184, th: 172, sh: 186, legFwd: 30, hipY: 132, lean: 70 };
  const up: FrontPose = { ...down, ua: 96, fa: 100 };
  return { view: 'back', held: { kind: 'dumbbell' }, frames: con(down, up, { move1: 1100, hold2: 500, move2: 1800 }) };
}

/** Batterflayda orqa delta (orqadan): o‘tirib, qo‘llar yelka sathida oldindan yon tomonlarga */
function reversePecDeckAnim(): AnimSpec {
  const start: FrontPose = { ua: 90, fa: 92, fwd: 82, hipY: 156, legFwd: 76 };
  const end: FrontPose = { ...start, fwd: 0 };
  return {
    view: 'back',
    held: { kind: 'handle' },
    props: [{ kind: 'seatFront', x: 120, y: 164, w: 46 }],
    frames: con(start, end, { move1: 1100, hold2: 500, move2: 1800 }),
    frame: { x: 18, y: 10, w: 204, h: 210 },
  };
}

/** Bir oyoqda rumincha tortish: tayanch oyoq biroz bukik, ikkinchi oyoq gavda bilan bir chiziqda orqaga, gantel qarama-qarshi qo‘lda */
export function singleLegRdlAnim(): AnimSpec {
  const top: SidePose = { torso: 2, ua: 180, fa: 180, ua2: 180, fa2: 180, th: 180, sh: 180, th2: 186, sh2: 206, ft2: 120, hand: { x: 116, y: 123 } };
  const bottom: SidePose = { torso: 80, head: 66, ua: 180, fa: 180, ua2: 182, fa2: 180, th: 172, sh: 186, th2: 262, sh2: 262, ft2: 176, hand: { x: 128, y: 170 } };
  return { view: 'side', anchor: ankle, held: { kind: 'dumbbell', single: true }, frames: A.ecc(top, bottom, { move1: 2300, move2: 1300 }) };
}

/** Qiya otjimaniya: qo‘llar skameyka chetida, tana tovondan boshgacha tekis */
export function inclinePushUpAnim(): AnimSpec {
  const top: SidePose = { torso: 50, head: 54, ua: 180, fa: 180, th: 230, sh: 230, ft: 150, hand: { x: 168, y: 165 } };
  const bottom: SidePose = { ...top, torso: 62, head: 64, th: 242, sh: 242, ft: 162 };
  return {
    view: 'side',
    anchor: { joint: 'toe', x: 40, y: 214 },
    props: [{ kind: 'bench', x: 150, y: 166, w: 58 }],
    frames: A.ecc(top, bottom, { move1: 1700, move2: 1000 }),
    frame: { x: 20, y: 50, w: 210, h: 170 },
  };
}

/** Sakrab o‘tirish: yarim o‘tirish -> portlovchi sakrash (oyoqlar poldan uziladi) -> yumshoq qo‘nish */
export function jumpSquatAnim(): AnimSpec {
  const stand: SidePose = { torso: 3, ua: 196, fa: 196, th: 180, sh: 180, ft: 90, at: { x: 112, y: 208 } };
  const dip: SidePose = { torso: 30, head: 18, ua: 214, fa: 214, th: 112, sh: 204, ft: 90, at: { x: 112, y: 208 } };
  const air: SidePose = { torso: -2, head: -2, ua: 24, fa: 18, th: 182, sh: 184, ft: 136, at: { x: 112, y: 186 } };
  return {
    view: 'side',
    anchor: { joint: 'ankle', x: 112, y: 208 },
    frames: [
      { pose: stand, dur: 350, phase: 'hold' },
      { pose: stand, dur: 650, phase: 'down' },
      { pose: dip, dur: 160, phase: 'hold' },
      { pose: dip, dur: 260, phase: 'up' },
      { pose: air, dur: 260, phase: 'up' },
      { pose: stand, dur: 380, phase: 'down' },
    ],
    frame: { x: 10, y: -44, w: 220, h: 264 },
  };
}

const ALL_EXTRA: Exercise[] = [
  /* ---------- zal ---------- */
  {
    id: 'straight-arm-pulldown',
    name: 'Blokda to‘g‘ri qo‘l bilan pastga tortish',
    en: 'Straight-Arm Cable Pulldown',
    pattern: 'vPull',
    mechanics: 'isolation',
    primary: ['lats'],
    secondary: ['triceps', 'rearDelts'],
    equipment: [],
    equipmentAny: ['cable', 'latPulldown'],
    level: 1,
    score: 6,
    loadType: 'cable',
    increment: 2.5,
    caution: ['shoulder'],
    setup: [
      'Yuqori blokka to‘g‘ri dasta (yoki arqon) iling, blokdan bir qadam orqaga chiqing.',
      'Dastani yelka kengligida ushlang, tizzalar yumshoq, tosni biroz orqaga surib gavdani ~30° oldinga engashtiring — bel tekis.',
    ],
    steps: [
      'Qo‘llarni deyarli to‘g‘ri tutib (tirsak biroz bukik va qotgan), dastani yoy bo‘ylab sonlarga qadar pastga torting.',
      'Pastda kuraklarni pastga tushirib, keng orqani 1 soniya qising.',
      'Nazorat bilan ko‘z sathigacha qaytaring — keng orqa cho‘zilganini his qiling.',
    ],
    cues: ['Tirsak burchagi o‘zgarmasin — bu blokda triseps (pastga itarish) emas', 'Yelkalar quloqdan uzoq, pastda', 'Gavda qimirlamaydi: faqat qo‘llar yoy chizadi'],
    breathing: BREATH_PULL,
    mistakes: [
      { title: 'Tirsaklarni bukib itarish', why: 'Harakat blokda triseps mashqiga aylanadi, keng orqa kam ishlaydi.', fix: 'Vaznni kamaytiring, tirsakni bir burchakda qotiring.' },
      { title: 'Gavda bilan tebranish', why: 'Og‘irlikni tana inersiyasi ko‘taradi.', fix: 'Gavdani bir burchakda ushlab, sekin bajaring.' },
    ],
    benefits: [{ id: 'posture', text: 'Keng orqani bitseps charchamasdan alohida ishlatadi — tortilishga yordamchi mashq.' }],
    anim: straightArmPulldownAnim(),
  },
  {
    id: 'reverse-pec-deck',
    name: 'Batterflayda orqa delta',
    en: 'Reverse Pec Deck',
    pattern: 'rearDelt',
    mechanics: 'isolation',
    primary: ['rearDelts'],
    secondary: ['upperBack', 'sideDelts'],
    equipment: ['pecDeck'],
    level: 1,
    score: 7,
    loadType: 'machine',
    increment: 2.5,
    setup: ['Trenajyorga yuzingiz bilan qarab o‘tiring, ko‘krak suyanchiqqa tegsin.', 'O‘rindiqni dastalar yelka sathida bo‘ladigan qilib sozlang; dastalarni neytral ushlang.'],
    steps: [
      'Qo‘llarni deyarli to‘g‘ri tutib, yonlarga keng yoy bo‘ylab gavda chizig‘igacha oching.',
      'Oxirida 1 soniya ushlang.',
      'Nazorat bilan oldinga qaytaring — og‘irlik to‘liq tushib qolmasin.',
    ],
    cues: ['Qo‘llar gavda chizig‘idan orqaga ketmasin', 'Yelkani ko‘tarmang — trapetsiya emas, orqa delta ishlasin', 'Ko‘krak suyanchiqdan uzilmaydi'],
    breathing: BREATH_PULL,
    mistakes: [
      { title: 'Juda og‘ir vazn bilan silkitish', why: 'Orqa delta kichik mushak: yuk trapetsiya va belga o‘tadi.', fix: 'Yengil vazn, 12–20 takror, sekin.' },
      { title: 'Yelkalarni qisish', why: 'Trapetsiya yuqorisi ishni oladi.', fix: 'Yelkalarni pastga tushirib bajaring.' },
    ],
    benefits: [{ id: 'joints', text: 'Yelka bo‘g‘imining orqa tomonini mustahkamlaydi — ko‘krak mashqlari bilan muvozanat.' }],
    anim: reversePecDeckAnim(),
  },
  {
    id: 'db-reverse-fly',
    name: 'Engashib gantel yoyish (orqa delta)',
    en: 'Bent-Over Dumbbell Reverse Fly',
    pattern: 'rearDelt',
    mechanics: 'isolation',
    primary: ['rearDelts'],
    secondary: ['upperBack', 'lowerBack'],
    equipment: ['dumbbells'],
    level: 1,
    score: 6,
    loadType: 'dumbbell',
    increment: 1,
    caution: ['lowerBack'],
    setup: [
      'Yengil gantellarni oling, oyoqlar tos kengligida, tizzalar biroz bukik.',
      'Tosni orqaga surib gavdani 45° dan polga deyarli parallelgacha engashtiring (qancha past — orqa delta shuncha ko‘p ishlaydi); bel tekis, bosh umurtqa bilan bir chiziqda.',
    ],
    steps: ['Gantellarni yonlarga keng yoy bo‘ylab yelka sathigacha ko‘taring («T» shakli).', '1 soniya ushlang.', 'Sekin pastga tushiring.'],
    cues: ['Tirsak biroz bukik va qotgan', 'Gavda ko‘tarilmaydi — faqat qo‘llar harakatlanadi', 'Kaftlar bir-biriga qaragan'],
    breathing: BREATH_PULL,
    mistakes: [
      { title: 'Gavdani ko‘tarib silkitish', why: 'Belga yuk tushadi, orqa delta kam ishlaydi.', fix: 'Yengilroq gantel; kerak bo‘lsa — peshonani qiya skameykaga qo‘ying.' },
      { title: 'Qo‘llarni juda baland ko‘tarish', why: 'Trapetsiya ishlay boshlaydi.', fix: 'Yelka sathida to‘xtang.' },
    ],
    benefits: [{ id: 'posture', text: 'Kurak va yelka orqasini kuchaytiradi — bukchayishga qarshi.' }],
    anim: rearDeltBentAnim(),
  },
  {
    id: 'lying-leg-curl',
    name: 'Yotib oyoq bukish',
    en: 'Lying Leg Curl',
    pattern: 'hamIso',
    mechanics: 'isolation',
    primary: ['hamstrings'],
    secondary: ['calves'],
    equipment: ['legCurl'],
    level: 1,
    score: 7,
    loadType: 'machine',
    increment: 2.5,
    setup: ['Trenajyorda yuzingiz bilan yoting: tizzalar yostiq chetidan biroz tashqarida.', 'Rolikni boldirning pastki qismiga, tovondan biroz yuqoriga qo‘ying; old dastalarni ushlang.'],
    steps: ['Tovonlarni dumbaga tomon tortib, tizzalarni iloji boricha buking.', '1 soniya ushlang.', 'Sekin, nazorat bilan deyarli to‘g‘ri holatgacha tushiring.'],
    cues: ['Tos yostiqdan ko‘tarilmasin', 'Pastga tushirish — 2–3 soniya', 'Oyoq uchlari o‘zingizga qaragan'],
    breathing: BREATH_PULL,
    mistakes: [
      { title: 'Tosni ko‘tarish', why: 'Bel egilib, son orqasi kam ishlaydi.', fix: 'Vaznni kamaytiring, qorin va tosni yostiqqa bosing.' },
      { title: 'Og‘irlikni tashlab yuborish', why: 'Eng foydali (cho‘zilish) qismi yo‘qoladi.', fix: 'Pastga sekin tushiring.' },
    ],
    benefits: [{ id: 'joints', text: 'Son orqasini alohida kuchaytiradi — tizza atrofi muvozanatlashadi.' }],
    anim: lyingLegCurlAnim(),
  },
  {
    id: 'db-lunge',
    name: 'Gantel bilan oldinga hamla',
    en: 'Dumbbell Forward Lunge',
    pattern: 'lunge',
    mechanics: 'compound',
    primary: ['quads', 'glutes'],
    secondary: ['adductors', 'hamstrings', 'calves'],
    equipment: ['dumbbells'],
    level: 2,
    score: 8,
    loadType: 'dumbbell',
    increment: 2,
    unilateral: true,
    caution: ['knee'],
    setup: ['Gantellarni yonda to‘g‘ri qo‘llarda ushlang, oyoqlar tos kengligida, gavda tik.'],
    steps: [
      'Bir oyoq bilan oldinga uzun qadam tashlang va pastga tushing: ikkala tizza ~90°, orqa tizza poldan bir necha santimetr yuqorida.',
      'Old oyoq tovoni orqali itarib, boshlang‘ich holatga qayting.',
      'Oyoqlarni navbat bilan almashtiring (yoki yurib bajaring).',
    ],
    cues: ['Old tovon poldan uzilmasin', 'Tizza oyoq uchi yo‘nalishida, ichkariga qulamaydi', 'Gavda tik, yelkalar pastda'],
    breathing: 'Pastga tushayotganda nafas oling, ko‘tarilayotganda chiqaring.',
    mistakes: [
      { title: 'Qisqa qadam', why: 'Tizza haddan oldinga ketib, tovon ko‘tariladi.', fix: 'Qadamni uzaytiring — old boldir deyarli tik.' },
      { title: 'Orqa tizzani polga urish', why: 'Tizza qopqog‘i jarohatlanishi mumkin.', fix: 'Pastga nazorat bilan tushing, polga tegmang.' },
    ],
    benefits: [
      { id: 'balance', text: 'Bir oyoqda muvozanat va tos barqarorligi.' },
      { id: 'bone', text: 'Son va tos suyaklariga yuklama beradi.' },
    ],
    anim: A.splitSquat('dumbbell'),
  },
  {
    id: 'single-leg-rdl',
    name: 'Bir oyoqda rumincha tortish',
    en: 'Single-Leg Romanian Deadlift',
    pattern: 'hinge',
    mechanics: 'compound',
    primary: ['hamstrings', 'glutes'],
    secondary: ['lowerBack', 'adductors'],
    equipment: [],
    equipmentAny: ['dumbbells', 'kettlebell'],
    level: 2,
    score: 7,
    loadType: 'dumbbell',
    increment: 2,
    unilateral: true,
    caution: ['lowerBack'],
    setup: ['Gantelni tayanch oyoqqa qarama-qarshi qo‘lda ushlang.', 'Tayanch oyoq tizzasi biroz bukik va qotgan.'],
    steps: [
      'Tosdan engashib, ikkinchi oyoqni orqaga uzating — gavda va oyoq bir chiziqda «T» hosil qiladi.',
      'Gantel tayanch oyoq yonida boldir o‘rtasigacha tushadi; son orqasi cho‘zilganini his qiling.',
      'Tayanch oyoq dumbasi bilan tosni oldinga surib, tik holatga qayting.',
    ],
    cues: ['Tos kvadrat — ko‘tarilgan oyoq uchi pastga qaraydi', 'Bel tekis, bosh umurtqa bilan bir chiziqda', 'Muvozanat qiyin bo‘lsa — bo‘sh qo‘l bilan devorga tegib turing'],
    breathing: 'Tepada nafas olib qorinni qotiring, ko‘tarilgach nafas chiqaring.',
    mistakes: [
      { title: 'Tos ochilib ketadi', why: 'Gavda buriladi, son orqasi o‘rniga bel ishlaydi.', fix: 'Ko‘tarilgan oyoq uchini polga qarating, sekin bajaring.' },
      { title: 'Bel dumaloq', why: 'Umurtqaga keraksiz yuklama.', fix: 'Faqat bel tekis qoladigan chuqurlikkacha tushing.' },
    ],
    benefits: [
      { id: 'balance', text: 'Bir oyoqda muvozanat — yiqilishning oldini olishga yordam beradi.' },
      { id: 'joints', text: 'Son orqasi va dumbani har oyoqda alohida kuchaytiradi.' },
    ],
    anim: singleLegRdlAnim(),
  },
  {
    id: 'cable-overhead-extension',
    name: 'Blokda bosh ortidan triseps (arqon)',
    en: 'Cable Overhead Triceps Extension',
    pattern: 'triceps',
    mechanics: 'isolation',
    primary: ['triceps'],
    secondary: [],
    equipment: ['cable'],
    level: 1,
    score: 8,
    loadType: 'cable',
    increment: 2.5,
    avoid: ['shoulder'],
    caution: ['elbow'],
    setup: [
      'Pastki blokka arqon iling va unga orqa o‘girib turing: bir oyoq oldinda, gavda ~20–30° oldinga.',
      'Arqonni bosh ortida ushlang: qo‘llarning yuqori qismi (tirsakdan yelkagacha) quloq yonida, yuqoriga qaragan.',
    ],
    steps: ['Tirsaklarni to‘g‘rilab, arqonni bosh ustidan oldinga-yuqoriga itaring.', 'Tepada arqon uchlarini biroz yoying.', 'Sekin, bosh ortiga chuqur tushiring — triseps cho‘zilsin.'],
    cues: ['Yelkalar qimirlamaydi — faqat tirsak bo‘g‘imi', 'Pastda chuqur cho‘zilish — eng foydali qismi', 'Qorin tarang, bel egilmasin'],
    breathing: BREATH_PRESS,
    mistakes: [
      { title: 'Tirsaklar yonga yoyiladi', why: 'Yuk yelkaga o‘tadi, triseps kam ishlaydi.', fix: 'Tirsaklarni bosh yonida, oldinga qaratib tuting.' },
      { title: 'Belni egib itarish', why: 'Bel bo‘g‘imchalari siqiladi.', fix: 'Qorinni qotiring, vaznni kamaytiring.' },
    ],
    benefits: [{ id: 'joints', text: 'Trisepsning uzun boshini cho‘zilgan holatda ishlatadi — tirsak atrofi mustahkamlanadi.' }],
    anim: A.overheadExtension(),
  },
  {
    id: 'farmers-carry',
    name: 'Fermer yurishi',
    en: "Farmer's Carry",
    pattern: 'traps',
    mechanics: 'compound',
    primary: ['traps'],
    secondary: ['forearms', 'obliques', 'lowerBack', 'abs', 'glutes'],
    equipment: [],
    equipmentAny: ['dumbbells', 'kettlebell'],
    level: 1,
    score: 5,
    loadType: 'dumbbell',
    increment: 2,
    timed: true,
    caution: ['lowerBack'],
    setup: ['Ikki og‘ir gantel yoki giryani yonda, to‘g‘ri qo‘llarda ushlang.', 'Gavda tik, yelkalar pastga va orqaga, nigoh oldinda.'],
    steps: ['Qisqa, nazoratli qadamlar bilan to‘g‘ri yuring.', 'Belgilangan vaqt (odatda 30–60 soniya) yoki masofadan so‘ng yukni sekin polga qo‘ying.'],
    cues: ['Gavda yonga qiyshaymasin', 'Dastani mahkam siqing', 'Qorin tarang, nafas bir maromda'],
    breathing: 'Yukni ko‘tarishdan oldin chuqur nafas olib qorinni qotiring; yurganda qorinni tarang tutib, qisqa va bir maromda nafas oling — nafasni ushlab turmang.',
    mistakes: [
      { title: 'Yelkalar oldinga osiladi', why: 'Bel va bo‘yin zo‘riqadi.', fix: 'Ko‘krakni ko‘tarib, kuraklarni pastga tushiring.' },
      { title: 'Yukni polga «tashlash»', why: 'Bel jarohatlanishi mumkin.', fix: 'Cho‘kkalab, bel tekis holda qo‘ying.' },
    ],
    benefits: [
      { id: 'grip', text: 'Qo‘l siqish kuchi — kundalik hayot va keksalikda muhim.' },
      { id: 'core', text: 'Qorin va bel mushaklari tanani tik ushlashni o‘rganadi.' },
    ],
    anim: farmersCarryAnim(),
  },
  {
    id: 'pallof-press',
    name: 'Pallof press (burilishga qarshi)',
    en: 'Pallof Press',
    pattern: 'core',
    mechanics: 'isolation',
    primary: ['obliques', 'abs'],
    secondary: ['glutes'],
    equipment: ['cable'],
    level: 1,
    score: 6,
    loadType: 'cable',
    increment: 2.5,
    unilateral: true,
    setup: [
      'Blokni ko‘krak balandligiga qo‘ying va unga yon tomoningiz bilan turing; tros taranglashguncha blokdan 1–2 qadam yonga chiqing.',
      'Dastani ikki qo‘l bilan ko‘krak o‘rtasida ushlang; oyoqlar yelka kengligida, tizzalar yumshoq.',
    ],
    steps: [
      'Qo‘llarni ko‘krakdan oldinga to‘liq to‘g‘rilang — gavda blok tomon burilmasin.',
      '2–3 soniya ushlang.',
      'Sekin ko‘krakka qaytaring. Barcha takrorlardan so‘ng ikkinchi tomonga o‘giriling.',
    ],
    cues: ['Yelka va tos oldinga qaragan — burilishga qarshi turing', 'Dumba va qorin qotgan', 'Qancha uzoq itarsangiz — shuncha qiyin'],
    breathing: 'Itarayotganda nafas chiqaring, ushlab turganda bir maromda nafas oling.',
    mistakes: [
      { title: 'Gavda blok tomon buriladi', why: 'Mashqning maqsadi — burilishga qarshi turish — yo‘qoladi.', fix: 'Vaznni kamaytiring yoki blokdan yaqinroq turing.' },
      { title: 'Belni egish', why: 'Bel bo‘g‘imchalari siqiladi.', fix: 'Qovurg‘alarni pastga tushirib, dumbani qising.' },
    ],
    benefits: [
      { id: 'backHealth', text: 'Umurtqani burilishdan himoya qiluvchi mushaklar — bel og‘rig‘ida xavfsiz kor mashqi.' },
      { id: 'core', text: 'Qiyshiq mushaklarni harakatsiz ushlab kuchaytiradi.' },
    ],
    anim: pallofAnim(),
  },
  {
    id: 'hanging-knee-raise',
    name: 'Turnikda tizza ko‘tarish',
    en: 'Hanging Knee Raise',
    pattern: 'core',
    mechanics: 'isolation',
    primary: ['abs'],
    secondary: ['obliques', 'forearms'],
    equipment: ['pullupBar'],
    level: 1,
    score: 6,
    loadType: 'bodyweight',
    increment: 0,
    caution: ['shoulder'],
    setup: ['Turnikda yelka kengligida, to‘g‘ri qo‘llarda osiling; yelkalarni biroz pastga torting.'],
    steps: ['Tizzalarni bukib, sonlarni pol bilan parallel yoki yuqoriroq ko‘taring — tepada tosni ko‘krak tomon «o‘rang».', '1 soniya ushlang.', 'Tebranmasdan sekin tushiring.'],
    cues: ['Tebranmang — har takror to‘xtab boshlanadi', 'Tepada tos ko‘krak tomon buraladi', 'Oson bo‘lsa — oyoqlarni to‘g‘ri ko‘tarishga o‘ting'],
    breathing: 'Ko‘tarayotganda nafas chiqaring, tushirayotganda nafas oling.',
    mistakes: [
      { title: 'Tebranib ko‘tarish', why: 'Inersiya ishlaydi, press emas.', fix: 'Pastda to‘liq to‘xtab, sekin ko‘taring.' },
      { title: 'Faqat sonni ko‘tarish', why: 'Asosan son bukuvchilar ishlaydi, press kam.', fix: 'Tepada tosni o‘zingizga «o‘rang».' },
    ],
    benefits: [{ id: 'core', text: 'Press va son bukuvchilarni kuchaytiradi — oyoq ko‘tarishga tayyorlov.' }],
    anim: hangingKneeRaiseAnim(),
  },
  {
    id: 'sumo-deadlift',
    name: 'Sumo o‘lik tortish',
    en: 'Sumo Deadlift',
    pattern: 'hinge',
    mechanics: 'compound',
    primary: ['glutes', 'quads', 'adductors'],
    secondary: ['hamstrings', 'lowerBack', 'traps', 'forearms'],
    equipment: ['barbell'],
    level: 2,
    score: 8,
    loadType: 'barbell',
    increment: 5,
    avoid: ['lowerBack'],
    caution: ['hip', 'knee'],
    setup: [
      'Oyoqlarni yelkadan ikki barobar keng qo‘ying, uchlari ~45° tashqariga; boldirlar shtangaga tegib turadi.',
      'Shtangani tizzalar ichidan yelka kengligida ushlang, qo‘llar tik.',
      'Tosni tushirib, ko‘krakni ko‘taring: bel tekis, tizzalar oyoq uchlari yo‘nalishida tashqariga.',
    ],
    steps: [
      'Chuqur nafas olib qorinni qotiring va polni oyoqlar bilan «yoyib» itaring.',
      'Shtanga sonlar bo‘ylab yuqoriga sirpanadi; tos va tizza birga to‘g‘rilanadi.',
      'Tepada dumbani qisib tik turing, so‘ng nazorat bilan tushiring.',
    ],
    cues: ['Tizzalarni tashqariga suring', 'Shtanga tanaga yaqin', 'Belni orqaga egmang — tepada tik turish yetarli'],
    breathing: 'Har takrordan oldin pastda nafas olib qorinni qotiring; tepada nafas chiqaring.',
    mistakes: [
      { title: 'Tizzalar ichkariga qulaydi', why: 'Tizza va tos-son bo‘g‘imi zo‘riqadi.', fix: 'Oyoqlarni biroz torroq qo‘ying, tizzalarni oyoq uchi yo‘nalishida suring.' },
      { title: 'Tos tez ko‘tarilib ketadi', why: 'Rumincha tortishga aylanib, bel yuklanadi.', fix: 'Ko‘krak va tos birga ko‘tarilsin; vaznni kamaytiring.' },
    ],
    benefits: [
      { id: 'bone', text: 'Og‘ir yuklama — son va umurtqa suyaklarini mustahkamlaydi.' },
      { id: 'grip', text: 'Qo‘l siqish kuchi.' },
    ],
    anim: A.deadlift(),
  },

  /* ---------- uyda ---------- */
  {
    id: 'incline-push-up',
    name: 'Qiya otjimaniya (skameyka yoki stolga)',
    en: 'Incline Push-up',
    pattern: 'hPush',
    mechanics: 'compound',
    primary: ['chest'],
    secondary: ['frontDelts', 'triceps', 'abs'],
    equipment: [],
    level: 1,
    score: 6,
    loadType: 'bodyweight',
    increment: 0,
    caution: ['wrist'],
    setup: ['Kaftlarni mustahkam skameyka, stol yoki deraza tokchasi chetiga yelkadan biroz kengroq qo‘ying.', 'Oyoqlarni orqaga qo‘yib, tanani boshdan tovongacha to‘g‘ri chiziq qiling.'],
    steps: ['Tirsaklarni ~45° yonga bukib, ko‘krakni chetga deyarli tekkizguncha tushing.', 'Kaftlar bilan itarib, qo‘llarni to‘g‘rilang.'],
    cues: ['Tos osilmasin va ko‘tarilmasin', 'Tayanch qancha baland — shuncha oson; pastlatib boring', 'Qorin va dumba tarang'],
    breathing: BREATH_PRESS,
    mistakes: [
      { title: 'Tos osilib qoladi', why: 'Bel egilib, ko‘krak kam ishlaydi.', fix: 'Qorin va dumbani qisib, tanani to‘g‘ri tuting.' },
      { title: 'Tirsaklar yonga keng yoyilgan', why: 'Yelka bo‘g‘imi zo‘riqadi.', fix: 'Tirsaklarni tanaga ~45° burchakda tuting.' },
    ],
    benefits: [{ id: 'bone', text: 'Qo‘l va yelka suyaklariga yuklama — oddiy otjimaniyaga tayyorlov.' }],
    anim: inclinePushUpAnim(),
  },
  {
    id: 'nordic-curl',
    name: 'Nordik bukilish',
    en: 'Nordic Hamstring Curl',
    pattern: 'hamIso',
    mechanics: 'isolation',
    primary: ['hamstrings'],
    secondary: ['glutes', 'calves'],
    equipment: [],
    level: 3,
    score: 5,
    repRange: [3, 6],
    loadType: 'bodyweight',
    increment: 0,
    caution: ['knee'],
    setup: ['Yumshoq gilamda tiz cho‘king, to‘piqlarni og‘ir divan ostiga qistiring (yoki sherik ushlab tursin).', 'Gavda tizzadan boshgacha to‘g‘ri, qo‘llar ko‘krak oldida.'],
    steps: [
      'Tanani to‘g‘ri chiziqda ushlab, son orqasi bilan qarshilik qilib, iloji boricha sekin oldinga engashing.',
      'Ushlab tura olmay qolganda qo‘llar bilan polga «yiqiling».',
      'Qo‘llar bilan itarib, boshlang‘ich holatga qayting.',
    ],
    cues: ['Tos bukilmasin — tizzadan boshgacha bitta chiziq', 'Tushish 3–5 soniya: asosiy foyda shu qismda', 'Haftasiga 1–2 marta, 2–3 set × 3–6 takror yetarli'],
    breathing: 'Tushayotganda bir maromda nafas chiqaring, nafasni ushlamang.',
    mistakes: [
      { title: 'Tosni bukib engashish', why: 'Tana richagi qisqaradi — son orqasiga tushadigan yuk kamayib, mashq osonlashadi va foydasi pasayadi.', fix: 'Dumbani qisib, tanani to‘g‘ri ushlang.' },
      { title: 'Tez «yiqilish»', why: 'Ekssentrik yuklama — mashqning asosiy foydasi — yo‘qoladi.', fix: 'Imkon qadar sekin tushing, amplitudani asta oshiring.' },
    ],
    benefits: [{ id: 'joints', text: 'Son orqasi jarohatlarini qariyb ikki barobar kamaytiradi (van Dyk va boshq., 2019 meta-tahlili).' }],
    anim: nordicCurlAnim(),
  },
  {
    id: 'lateral-lunge',
    name: 'Yonga hamla',
    en: 'Lateral Lunge',
    pattern: 'lunge',
    mechanics: 'compound',
    primary: ['quads', 'glutes', 'adductors'],
    secondary: ['hamstrings'],
    equipment: [],
    level: 1,
    score: 6,
    loadType: 'bodyweight',
    increment: 0,
    unilateral: true,
    caution: ['knee', 'hip'],
    setup: ['Oyoqlarni keng qo‘ying (yelkadan ~2 barobar), uchlari oldinga yoki biroz tashqariga.', 'Qo‘llarni ko‘krak oldida birlashtiring.'],
    steps: ['Tosni orqaga-pastga surib, bir oyoqqa o‘tiring: bu tizza ~90°, ikkinchi oyoq to‘g‘ri.', 'Bukilgan oyoq tovoni bilan itarib, o‘rtaga qayting.', 'Tomonlarni almashtiring.'],
    cues: ['Bukilgan tizza oyoq uchi yo‘nalishida', 'Ikkala tovon polda', 'Ko‘krak ko‘tarilgan, bel tekis'],
    breathing: 'Pastga tushayotganda nafas oling, qaytayotganda chiqaring.',
    mistakes: [
      { title: 'Tovon ko‘tariladi', why: 'Tizzaga bosim oshadi.', fix: 'Kamroq chuqur tushing, og‘irlik tovonda.' },
      { title: 'Gavda oldinga yiqiladi', why: 'Bel yuklanadi.', fix: 'Ko‘krakni ko‘taring, qo‘llarni oldinga cho‘zing.' },
    ],
    benefits: [
      { id: 'joints', text: 'Yon tekislikdagi harakat — son ichki mushaklari va tos-son bo‘g‘imi harakatchanligi.' },
      { id: 'balance', text: 'Yonga yurish va burilishlarda barqarorlik.' },
    ],
    anim: lateralLungeAnim(),
  },
  {
    id: 'jump-squat',
    name: 'Sakrab o‘tirib-turish',
    en: 'Jump Squat',
    pattern: 'squat',
    mechanics: 'compound',
    primary: ['quads', 'glutes'],
    secondary: ['calves', 'hamstrings'],
    equipment: [],
    level: 2,
    score: 3,
    loadType: 'bodyweight',
    increment: 0,
    avoid: ['knee'],
    setup: ['Oyoqlar yelka kengligida, uchlari biroz tashqariga; ostida yumshoq gilam.'],
    steps: [
      'Yarim o‘tirish chuqurligigacha (son polga parallel bo‘lmasdan) tez tushing.',
      'Qo‘llarni silkitib, yuqoriga portlovchi sakrang.',
      'Oyoq uchida yumshoq qo‘nib, darhol keyingi o‘tirishga o‘ting.',
    ],
    cues: ['Qo‘nishda tizzalar yumshoq va tashqariga', 'Ovozsiz qo‘ning — oyoq uchidan tovonga', 'Sifat kamaysa — to‘xtang'],
    breathing: 'Sakrashdan oldin nafas oling, sakrayotganda chiqaring.',
    mistakes: [
      { title: 'Qattiq, tik oyoqda qo‘nish', why: 'Tizza va umurtqaga zarb.', fix: 'Oyoq uchida qo‘nib, cho‘kish bilan yumshating.' },
      { title: 'Tizzalar ichkariga qulaydi', why: 'Tizza paylari zo‘riqadi.', fix: 'Pastroq sakrang, tizzalarni oyoq uchi yo‘nalishida tuting.' },
    ],
    benefits: [
      { id: 'heart', text: 'Yurak urishini tez oshiradi — qisqa intervalli mashg‘ulotlar uchun.' },
      { id: 'bone', text: 'Sakrash suyak zichligini oshiradi.' },
    ],
    anim: jumpSquatAnim(),
  },
];

/** Rasmi tekshirilib, ilovaga joylangan mashqlar (yangi mashq rasmi tasdiqlanmaguncha shu ro‘yxatga kirmaydi). */
const READY = new Set([
  'straight-arm-pulldown',
  'reverse-pec-deck',
  'db-reverse-fly',
  'lying-leg-curl',
  'db-lunge',
  'cable-overhead-extension',
  'farmers-carry',
  'pallof-press',
  'hanging-knee-raise',
  'sumo-deadlift',
  'jump-squat',
  'nordic-curl',
  'single-leg-rdl',
  'lateral-lunge',
  'incline-push-up',
]);

export const EXTRA_EXERCISES: Exercise[] = ALL_EXTRA.filter((e) => READY.has(e.id));
