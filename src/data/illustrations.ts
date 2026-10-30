// Mashq illyustratsiyalari: AI yordamida yaratilgan, texnikasi va mushak yoritilishi EMG jadvali bilan tekshirilgan rasmlar.
// Rasmlarda matn yo'q — mushak nomlari, foizlar va texnika belgilari ilovada ustiga qo'yiladi (koordinatalar — rasmning %).
// Generatsiya: scripts/images (README) — ilova animatsiyasidagi to'g'ri poza namunasi bilan; har biri ko'zdan kechirilgan.
// Foizlar shu yerda yozilmaydi: activationFor(mashq) dan olinadi, shuning uchun jadval bilan doim bir xil.
import type { M3 } from './muscles3d';

export interface IlluLabel {
  key: M3;
  /** qisqa nom (rasm ustida); berilmasa — M3_INFO nomi */
  name?: string;
  /** mushakdagi nuqta, % */
  x: number;
  y: number;
  /** yorliq ustuni va balandligi */
  side: 'l' | 'r';
  ly: number;
}

export interface IlluCheck {
  text: string;
  x: number;
  y: number;
  side: 'l' | 'r';
  ly: number;
}

export interface Illustration {
  src: string;
  /** qaysi holat tasvirlangan */
  phase: string;
  alt: string;
  /** mushak yorliqlari rasmdagi joyi bilan; berilmasa — EMG bo'yicha eng faol mushaklar burchakdagi ro'yxatda */
  labels?: IlluLabel[];
  /** texnika belgilari rasmdagi joyi bilan; berilmasa — mashqning asosiy maslahatlari rasm ostida */
  checks?: IlluCheck[];
  /** harakatning ikkinchi cheti (o'sha kamera va odam) — ikki kadrli harakat uchun.
   *  mainSrc — asosiy kadrning ikkinchi kadr masshtabiga moslangan nusxasi (faqat harakatda; yorliqlar asl rasmda) */
  pair?: { src: string; phase: string; mainSrc?: string };
}

const img = (f: string) => `${import.meta.env.BASE_URL}illustrations/${f}`;

export const ILLUSTRATIONS: Partial<Record<string, Illustration>> = {
  'back-squat': {
    src: img('back-squat-bottom.webp'),
    phase: 'Pastki nuqta',
    pair: { src: img('alt/back-squat.webp'), phase: 'Yuqori nuqta', mainSrc: img('alt/back-squat-bottom-m.webp') },
    alt: 'Shtanga bilan o‘tirib-turish, pastki nuqta: shtanga trapetsiya ustida, son pol bilan parallel; son oldi, dumba va bel mushaklari lime rangda yonmoqda',
    labels: [
      { key: 'rectusFemoris', name: 'To‘g‘ri son', x: 37, y: 56, side: 'l', ly: 42 },
      { key: 'vastusLateralis', name: 'Tashqi son', x: 34, y: 59, side: 'l', ly: 56 },
      { key: 'gastrocnemius', name: 'Boldir', x: 35, y: 72, side: 'l', ly: 77 },
      { key: 'erectors', name: 'Bel rostlovchi', x: 53, y: 40, side: 'r', ly: 42 },
      { key: 'gluteMax', name: 'Katta dumba', x: 55, y: 57, side: 'r', ly: 56 },
      { key: 'adductors', name: 'Ichki son', x: 53, y: 64, side: 'r', ly: 70 },
    ],
    checks: [
      { text: 'Nigoh 2 m oldinga, bo‘yin tabiiy', x: 37, y: 19, side: 'l', ly: 6 },
      { text: 'Shtanga trapetsiya ustida', x: 47, y: 27.5, side: 'r', ly: 36 },
      { text: 'Ushlash yelkadan biroz keng, tirsaklar pastga', x: 41, y: 40, side: 'l', ly: 42 },
      { text: 'Bel tekis, tabiiy egilish saqlangan', x: 53, y: 44, side: 'r', ly: 54 },
      { text: 'Son pol bilan parallel', x: 46, y: 59, side: 'l', ly: 57 },
      { text: 'Tizza oyoq uchi yo‘nalishida', x: 27, y: 63, side: 'l', ly: 71 },
      { text: 'Tovonlar yerda, og‘irlik oyoq kafti o‘rtasida', x: 40, y: 86, side: 'r', ly: 85 },
    ],
  },
  'bench-press': {
    src: img('bench-press.webp'),
    phase: 'Pastki nuqta',
    pair: { src: img('alt/bench-press.webp'), phase: 'Yuqori nuqta' },
    alt: 'Shtanga bilan yotib jim, pastki nuqta: to‘g‘ri texnika; ishlayotgan mushaklar lime rangda yonmoqda',
    labels: [
      { key: 'pecMid', name: 'Ko‘krak (o‘rta)', x: 55, y: 44, side: 'l', ly: 14 },
      { key: 'deltAnt', name: 'Old delta', x: 62, y: 47, side: 'r', ly: 12 },
      { key: 'tricepsLong', name: 'Triseps', x: 64, y: 55, side: 'r', ly: 74 },
    ],
    checks: [
      { text: 'Shtanga ko‘krakka tegadi', x: 50, y: 41, side: 'l', ly: 28 },
      { text: 'Bilaklar tik, tirsak 45–70°', x: 71.5, y: 46, side: 'r', ly: 30 },
      { text: 'Kuraklar yig‘ilgan, dumba skameykada', x: 47, y: 52, side: 'l', ly: 72 },
      { text: 'Oyoqlar polda', x: 33, y: 85, side: 'r', ly: 88 },
    ],
  },
  deadlift: {
    src: img('deadlift.webp'),
    phase: 'Boshlang‘ich holat',
    pair: { src: img('alt/deadlift.webp'), phase: 'Yuqori nuqta' },
    alt: 'O‘lik tortish, boshlang‘ich holat: to‘g‘ri texnika; ishlayotgan mushaklar lime rangda yonmoqda',
    labels: [
      { key: 'erectors', name: 'Bel rostlovchi', x: 42, y: 57, side: 'l', ly: 36 },
      { key: 'gluteMax', name: 'Katta dumba', x: 35, y: 63, side: 'l', ly: 50 },
      { key: 'medialHamstrings', name: 'Son orqasi', x: 45, y: 68, side: 'l', ly: 74 },
      { key: 'forearmFlexors', name: 'Bilak', x: 55.5, y: 68.5, side: 'r', ly: 60 },
    ],
    checks: [
      { text: 'Bel tekis', x: 42, y: 57, side: 'r', ly: 40 },
      { text: 'Tos tizzadan baland, yelkadan past', x: 36, y: 60, side: 'l', ly: 24 },
      { text: 'Qo‘llar tik, tirsak to‘g‘ri', x: 57, y: 64, side: 'r', ly: 56 },
      { text: 'Shtanga oyoq kafti o‘rtasi ustida', x: 53.5, y: 82, side: 'r', ly: 82 },
    ],
  },
  rdl: {
    src: img('rdl.webp'),
    phase: 'Pastki nuqta',
    pair: { src: img('alt/rdl.webp'), phase: 'Yuqori nuqta' },
    alt: 'Rumincha o‘lik tortish, pastki nuqta: to‘g‘ri texnika; ishlayotgan mushaklar lime rangda yonmoqda',
    labels: [
      { key: 'erectors', name: 'Bel rostlovchi', x: 40, y: 35, side: 'l', ly: 22 },
      { key: 'medialHamstrings', name: 'Son orqasi', x: 41, y: 56, side: 'l', ly: 66 },
      { key: 'forearmFlexors', name: 'Bilak', x: 58, y: 52, side: 'r', ly: 40 },
    ],
    checks: [
      { text: 'Bel tekis', x: 47, y: 29, side: 'r', ly: 14 },
      { text: 'Tos orqaga, tizza yengil bukilgan', x: 30, y: 42, side: 'l', ly: 44 },
      { text: 'Shtanga oyoqqa yaqin, tizzadan pastda', x: 53, y: 62, side: 'r', ly: 84 },
    ],
  },
  ohp: {
    src: img('ohp.webp'),
    phase: 'Itarish',
    alt: 'Turib shtanga jimi, itarish: to‘g‘ri texnika; ishlayotgan mushaklar lime rangda yonmoqda',
    labels: [
      { key: 'deltAnt', name: 'Old delta', x: 44.5, y: 30, side: 'l', ly: 44 },
      { key: 'deltLat', name: 'O‘rta delta', x: 58.5, y: 29, side: 'r', ly: 44 },
    ],
    checks: [
      { text: 'Shtanga oyoq kafti o‘rtasi ustida', x: 50, y: 17, side: 'r', ly: 6 },
      { text: 'Qorin va dumba tarang, orqaga egilmaydi', x: 48, y: 48, side: 'l', ly: 62 },
      { text: 'Oyoqlar tos kengligida', x: 45, y: 88, side: 'r', ly: 84 },
    ],
  },
  'pull-up': {
    src: img('pull-up.webp'),
    phase: 'Yuqori nuqta',
    pair: { src: img('alt/pull-up.webp'), phase: 'Pastki nuqta' },
    alt: 'Turnikda tortilish, yuqori nuqta: to‘g‘ri texnika; ishlayotgan mushaklar lime rangda yonmoqda',
    labels: [
      { key: 'teresMajor', name: 'Katta yumaloq', x: 42.5, y: 20.5, side: 'l', ly: 18 },
      { key: 'lats', name: 'Orqaning keng mushagi', x: 44, y: 26, side: 'l', ly: 32 },
      { key: 'infraspinatus', name: 'Qirra osti', x: 56, y: 17, side: 'r', ly: 20 },
    ],
    checks: [
      { text: 'Ushlash yelkadan biroz keng', x: 35, y: 12, side: 'l', ly: 6 },
      { text: 'Iyak turnikdan yuqori', x: 50, y: 10, side: 'r', ly: 6 },
      { text: 'Yelkalar pastda, ko‘krak oldinga', x: 50, y: 19, side: 'r', ly: 34 },
      { text: 'Tana tik, oyoqlar silkinmaydi', x: 50, y: 62, side: 'l', ly: 62 },
    ],
  },
  'barbell-row': {
    src: img('barbell-row.webp'),
    phase: 'Yuqori nuqta',
    pair: { src: img('alt/barbell-row.webp'), phase: 'Pastki nuqta' },
    alt: 'Engashib shtanga tortish, yuqori nuqta: to‘g‘ri texnika; ishlayotgan mushaklar lime rangda yonmoqda',
    labels: [
      { key: 'trapMid', name: 'Trapetsiya o‘rtasi', x: 54, y: 18, side: 'r', ly: 8 },
      { key: 'deltPost', name: 'Orqa delta', x: 56, y: 22, side: 'r', ly: 34 },
      { key: 'erectors', name: 'Bel rostlovchi', x: 34, y: 28, side: 'l', ly: 18 },
      { key: 'lats', name: 'Orqaning keng mushagi', x: 50, y: 26, side: 'l', ly: 32 },
    ],
    checks: [
      { text: 'Bel tekis, tana oldinga egilgan', x: 34, y: 28, side: 'l', ly: 56 },
      { text: 'Shtanga qorin pastiga tortiladi', x: 48, y: 40, side: 'r', ly: 48 },
      { text: 'Tirsak orqaga, ~45°', x: 39, y: 21.5, side: 'r', ly: 62 },
      { text: 'Tizzalar yengil bukilgan', x: 42, y: 60, side: 'l', ly: 72 },
    ],
  },
  'hip-thrust': {
    src: img('hip-thrust.webp'),
    phase: 'Yuqori nuqta',
    alt: 'Shtanga bilan tos ko‘tarish, yuqori nuqta: to‘g‘ri texnika; ishlayotgan mushaklar lime rangda yonmoqda',
    labels: [
      { key: 'gluteMax', name: 'Katta dumba', x: 60, y: 72, side: 'r', ly: 40 },
      { key: 'vastusLateralis', name: 'Son: tashqi', x: 76, y: 64, side: 'r', ly: 52 },
      { key: 'erectors', name: 'Bel rostlovchi', x: 46, y: 71, side: 'l', ly: 48 },
    ],
    checks: [
      { text: 'Kurak pasti skameyka chetida', x: 30, y: 70, side: 'l', ly: 36 },
      { text: 'Yelka–tos–tizza bir chiziqda', x: 60, y: 71, side: 'r', ly: 26 },
      { text: 'Boldirlar tik', x: 85, y: 80, side: 'r', ly: 52 },
    ],
  },
  'push-up': {
    src: img('push-up.webp'),
    phase: 'Yuqori nuqta',
    alt: 'Otjimaniya, yuqori nuqta: to‘g‘ri texnika; ishlayotgan mushaklar lime rangda yonmoqda',
    labels: [
      { key: 'pecMid', name: 'Ko‘krak (o‘rta)', x: 73, y: 48, side: 'l', ly: 26 },
      { key: 'deltAnt', name: 'Old delta', x: 70, y: 42, side: 'r', ly: 18 },
      { key: 'tricepsLateral', name: 'Triseps', x: 66, y: 55, side: 'r', ly: 46 },
    ],
    checks: [
      { text: 'Qo‘llar yelka ostida, biroz kengroq', x: 70, y: 72, side: 'r', ly: 66 },
      { text: 'Tana boshdan tovongacha tekis', x: 42, y: 52, side: 'l', ly: 44 },
      { text: 'Oyoq uchlari yerda', x: 12, y: 63, side: 'l', ly: 76 },
      { text: 'Bosh tabiiy, nigoh polga', x: 86, y: 40, side: 'r', ly: 26 },
    ],
  },
  'front-squat': {
    src: img('front-squat.webp'),
    phase: 'Pastki nuqta',
    pair: { src: img('alt/front-squat.webp'), phase: 'Yuqori nuqta' },
    alt: 'Old o‘tirish, pastki nuqta: to‘g‘ri texnika; ishlayotgan mushaklar lime rangda yonmoqda',
    labels: [
      { key: 'vastusLateralis', name: 'Son: tashqi', x: 38, y: 60, side: 'l', ly: 56 },
      { key: 'vastusMedialis', name: 'Son: ichki bosh', x: 47, y: 62, side: 'l', ly: 70 },
      { key: 'rectusFemoris', name: 'Son: to‘g‘ri', x: 62, y: 58, side: 'r', ly: 50 },
    ],
    checks: [
      { text: 'Shtanga old deltada, o‘mrov oldida', x: 36, y: 34, side: 'l', ly: 18 },
      { text: 'Tana deyarli tik', x: 50, y: 42, side: 'r', ly: 30 },
      { text: 'Son pol bilan parallel', x: 64, y: 60, side: 'r', ly: 62 },
      { text: 'Tovonlar yerda', x: 40, y: 86, side: 'l', ly: 88 },
    ],
  },
  'lat-pulldown': {
    src: img('lat-pulldown.webp'),
    phase: 'Qisqargan holat',
    pair: { src: img('alt/lat-pulldown.webp'), phase: 'Boshlang‘ich holat' },
    alt: 'Yuqori blokni ko‘krakka tortish, qisqargan holat: to‘g‘ri texnika; ishlayotgan mushaklar lime rangda yonmoqda',
    labels: [{ key: 'lats', name: 'Orqaning keng mushagi', x: 60, y: 45, side: 'r', ly: 50 }],
    checks: [
      { text: 'Shtanga yuz oldidan ko‘krak yuqorisiga', x: 50, y: 30, side: 'l', ly: 22 },
      { text: 'Tirsaklar pastga, biroz orqaga', x: 37, y: 43, side: 'l', ly: 34 },
      { text: 'Ko‘krak oldinga, biroz orqaga egilish', x: 50, y: 36, side: 'l', ly: 56 },
    ],
  },
  'goblet-squat': {
    src: img('goblet-squat.webp'),
    phase: 'Pastki nuqta',
    alt: 'Gantel bilan «kubok» o‘tirish, pastki nuqta: to‘g‘ri texnika; ishlayotgan mushaklar lime rangda yonmoqda',
    labels: [
      { key: 'vastusLateralis', name: 'Son: tashqi', x: 53, y: 68, side: 'r', ly: 74 },
      { key: 'gluteMax', name: 'Katta dumba', x: 37, y: 70, side: 'l', ly: 70 },
      { key: 'erectors', name: 'Bel rostlovchi', x: 41.5, y: 58, side: 'l', ly: 48 },
    ],
    checks: [
      { text: 'Tana tik, ko‘krak ochiq', x: 47, y: 45, side: 'l', ly: 30 },
      { text: 'Gantel ko‘krak oldida', x: 58, y: 52, side: 'r', ly: 44 },
      { text: 'Son pol bilan parallel', x: 54, y: 69, side: 'r', ly: 62 },
      { text: 'Tovonlar yerda', x: 50, y: 90, side: 'r', ly: 88 },
    ],
  },
  'smith-squat': {
    src: img('smith-squat.webp'),
    phase: 'Pastki nuqta',
    pair: { src: img('alt/smith-squat.webp'), phase: 'Yuqori nuqta' },
    alt: 'Smit mashinasida o‘tirish, pastki nuqta: to‘g‘ri texnika; ishlayotgan mushaklar lime rangda yonmoqda',
    labels: [
      { key: 'vastusLateralis', name: 'Son: tashqi', x: 52, y: 69, side: 'r', ly: 74 },
      { key: 'gluteMax', name: 'Katta dumba', x: 39, y: 69, side: 'l', ly: 70 },
      { key: 'erectors', name: 'Bel rostlovchi', x: 44, y: 62, side: 'l', ly: 50 },
    ],
    checks: [
      { text: 'Bel tekis', x: 44, y: 62, side: 'l', ly: 40 },
      { text: 'Shtanga trapetsiya ustida', x: 54, y: 48, side: 'r', ly: 30 },
      { text: 'Son pol bilan parallel', x: 52, y: 69, side: 'r', ly: 60 },
    ],
  },
  'leg-press': {
    src: img('leg-press.webp'),
    phase: 'Pastki nuqta',
    pair: { src: img('alt/leg-press.webp'), phase: 'Yozilgan holat' },
    alt: 'Oyoq press, pastki nuqta: to‘g‘ri texnika; ishlayotgan mushaklar lime rangda yonmoqda',
    labels: [
      { key: 'vastusLateralis', name: 'Son: tashqi', x: 36, y: 55, side: 'r', ly: 20 },
      { key: 'rectusFemoris', name: 'Son: to‘g‘ri', x: 37, y: 47, side: 'l', ly: 20 },
      { key: 'gluteMax', name: 'Katta dumba', x: 37, y: 68, side: 'l', ly: 62 },
    ],
    checks: [
      { text: 'Bel va tos o‘rindiqda', x: 30, y: 64, side: 'l', ly: 76 },
      { text: 'Oyoqlar platforma o‘rtasida', x: 57, y: 44, side: 'r', ly: 52 },
      { text: 'Tizza oyoq uchi yo‘nalishida', x: 38.5, y: 43, side: 'r', ly: 70 },
    ],
  },
  'hack-squat': {
    src: img('hack-squat.webp'),
    phase: 'Pastki nuqta',
    alt: 'Gakk-mashinada o‘tirish, pastki nuqta: to‘g‘ri texnika; ishlayotgan mushaklar lime rangda yonmoqda',
    labels: [
      { key: 'rectusFemoris', name: 'Son: to‘g‘ri', x: 38, y: 46, side: 'l', ly: 34 },
      { key: 'vastusLateralis', name: 'Son: tashqi', x: 41, y: 50, side: 'l', ly: 50 },
      { key: 'gluteMax', name: 'Katta dumba', x: 55, y: 52, side: 'r', ly: 60 },
    ],
    checks: [
      { text: 'Yelkalar yostiq ostida', x: 63, y: 29, side: 'r', ly: 12 },
      { text: 'Bel yostiqqa tegib', x: 66, y: 36, side: 'r', ly: 30 },
      { text: 'Tovonlar platformada', x: 30, y: 71, side: 'l', ly: 80 },
    ],
  },
  'bw-squat': {
    src: img('bw-squat.webp'),
    phase: 'Pastki nuqta',
    pair: { src: img('alt/bw-squat.webp'), phase: 'Yuqori nuqta' },
    alt: 'O‘z vazni bilan o‘tirish, pastki nuqta: to‘g‘ri texnika; ishlayotgan mushaklar lime rangda yonmoqda',
    labels: [
      { key: 'rectusFemoris', name: 'Son: to‘g‘ri', x: 48, y: 68, side: 'r', ly: 62 },
      { key: 'vastusLateralis', name: 'Son: tashqi', x: 43, y: 67, side: 'r', ly: 76 },
      { key: 'gluteMax', name: 'Katta dumba', x: 32, y: 70, side: 'l', ly: 70 },
    ],
    checks: [
      { text: 'Ko‘krak ochiq, bel tekis', x: 40, y: 52, side: 'l', ly: 40 },
      { text: 'Qo‘llar oldinga cho‘zilgan', x: 70, y: 47, side: 'r', ly: 34 },
      { text: 'Son pol bilan parallel', x: 46, y: 67, side: 'r', ly: 60 },
      { text: 'Tovonlar yerda', x: 40, y: 89, side: 'r', ly: 88 },
    ],
  },
  'db-rdl': {
    src: img('db-rdl.webp'),
    phase: 'Pastki nuqta',
    pair: { src: img('alt/db-rdl.webp'), phase: 'Yuqori nuqta' },
    alt: 'Gantel bilan rumincha tortish, pastki nuqta: to‘g‘ri texnika; ishlayotgan mushaklar lime rangda yonmoqda',
    labels: [
      { key: 'erectors', name: 'Bel rostlovchi', x: 40, y: 45, side: 'l', ly: 34 },
      { key: 'medialHamstrings', name: 'Son orqasi', x: 38, y: 61, side: 'l', ly: 70 },
      { key: 'forearmFlexors', name: 'Bilak', x: 53, y: 64, side: 'r', ly: 56 },
    ],
    checks: [
      { text: 'Bel tekis', x: 47, y: 43, side: 'r', ly: 24 },
      { text: 'Tos orqaga, tizza yengil bukilgan', x: 33, y: 52, side: 'l', ly: 50 },
      { text: 'Gantellar oyoqqa yaqin', x: 53, y: 72, side: 'r', ly: 74 },
    ],
  },
  'kb-swing': {
    src: img('kb-swing.webp'),
    phase: 'Yuqori nuqta',
    pair: { src: img('alt/kb-swing.webp'), phase: 'Pastki nuqta' },
    alt: 'Girya silkitish, yuqori nuqta: to‘g‘ri texnika; ishlayotgan mushaklar lime rangda yonmoqda',
    labels: [
      { key: 'gluteMax', name: 'Katta dumba', x: 36, y: 47, side: 'l', ly: 46 },
      { key: 'medialHamstrings', name: 'Son orqasi', x: 38.5, y: 61, side: 'l', ly: 66 },
      { key: 'forearmFlexors', name: 'Bilak', x: 62, y: 20, side: 'r', ly: 30 },
    ],
    checks: [
      { text: 'Qo‘llar to‘g‘ri, girya ko‘krak balandligida', x: 75, y: 24, side: 'r', ly: 12 },
      { text: 'Tana bir tik chiziqda', x: 40, y: 30, side: 'r', ly: 44 },
      { text: 'Dumba qisilgan, tos to‘liq yozilgan', x: 40, y: 47, side: 'r', ly: 58 },
      { text: 'Oyoqlar yerda', x: 42, y: 89, side: 'l', ly: 80 },
    ],
  },
  'back-extension': {
    src: img('back-extension.webp'),
    phase: 'Yuqori nuqta',
    pair: { src: img('alt/back-extension.webp'), phase: 'Pastki nuqta' },
    alt: 'Giperekstenziya, yuqori nuqta: to‘g‘ri texnika; ishlayotgan mushaklar lime rangda yonmoqda',
    labels: [
      { key: 'gluteMax', name: 'Katta dumba', x: 53, y: 40, side: 'l', ly: 22 },
      { key: 'bicepsFemoris', name: 'Son orqasi', x: 42, y: 55, side: 'l', ly: 40 },
      { key: 'erectors', name: 'Bel rostlovchi', x: 61, y: 31, side: 'r', ly: 50 },
    ],
    checks: [
      { text: 'Tana bir chiziqda, belni ortiqcha egmang', x: 62, y: 32, side: 'l', ly: 8 },
      { text: 'Yostiq son bo‘g‘imidan pastda', x: 60, y: 47, side: 'r', ly: 60 },
      { text: 'Oyoqlar rolik ostida', x: 18, y: 75, side: 'l', ly: 58 },
    ],
  },
  'split-squat': {
    src: img('split-squat.webp'),
    phase: 'Pastki nuqta',
    pair: { src: img('alt/split-squat.webp'), phase: 'Yuqori nuqta' },
    alt: 'Gantel bilan split-o‘tirish, pastki nuqta: to‘g‘ri texnika; ishlayotgan mushaklar lime rangda yonmoqda',
    labels: [
      { key: 'gluteMax', name: 'Katta dumba', x: 47, y: 66, side: 'l', ly: 56 },
      { key: 'vastusLateralis', name: 'Son: tashqi', x: 64, y: 63, side: 'r', ly: 60 },
    ],
    checks: [
      { text: 'Tana tik', x: 55, y: 40, side: 'l', ly: 30 },
      { text: 'Old tizza oyoq uchi ustida', x: 73, y: 68, side: 'r', ly: 46 },
      { text: 'Orqa tizza yerga yaqin', x: 48, y: 88, side: 'l', ly: 76 },
      { text: 'Old tovon yerda', x: 65, y: 90, side: 'r', ly: 86 },
    ],
  },
  bulgarian: {
    src: img('bulgarian.webp'),
    phase: 'Pastki nuqta',
    pair: { src: img('alt/bulgarian.webp'), phase: 'Yuqori nuqta' },
    alt: 'Bolgarcha split-o‘tirish, pastki nuqta: to‘g‘ri texnika; ishlayotgan mushaklar lime rangda yonmoqda',
    labels: [
      { key: 'gluteMax', name: 'Katta dumba', x: 52, y: 63, side: 'l', ly: 40 },
      { key: 'vastusLateralis', name: 'Son: tashqi', x: 70, y: 63, side: 'r', ly: 54 },
    ],
    checks: [
      { text: 'Orqa oyoq skameykada', x: 27, y: 65, side: 'l', ly: 24 },
      { text: 'Tana biroz oldinga, bel tekis', x: 56, y: 40, side: 'r', ly: 24 },
      { text: 'Old son parallel', x: 71, y: 63, side: 'r', ly: 42 },
      { text: 'Old tovon yerda', x: 74, y: 90, side: 'r', ly: 86 },
    ],
  },
  'step-up': {
    src: img('step-up.webp'),
    phase: 'Boshlang‘ich holat',
    pair: { src: img('alt/step-up.webp'), phase: 'Yuqori nuqta' },
    alt: 'Platformaga chiqish, boshlang‘ich holat: old oyoq butun kafti bilan qutida, orqa oyoq yerda; ishlayotgan mushaklar lime rangda yonmoqda',
    labels: [
      { key: 'gluteMax', name: 'Katta dumba', x: 41, y: 50, side: 'l', ly: 40 },
      { key: 'vastusLateralis', name: 'Son: tashqi', x: 56, y: 53, side: 'r', ly: 46 },
    ],
    checks: [
      { text: 'Tana biroz oldinga, bel tekis', x: 43, y: 34, side: 'l', ly: 22 },
      { text: 'Tizza oyoq uchi yo‘nalishida', x: 66, y: 57, side: 'r', ly: 60 },
      { text: 'Butun oyoq kafti qutida', x: 58, y: 74, side: 'r', ly: 80 },
      { text: 'Orqa oyoq bilan itarmang', x: 31, y: 88, side: 'l', ly: 84 },
    ],
  },
  'bw-split-squat': {
    src: img('bw-split-squat.webp'),
    phase: 'Pastki nuqta',
    pair: { src: img('alt/bw-split-squat.webp'), phase: 'Yuqori nuqta' },
    alt: 'O‘z vazni bilan split-o‘tirish, pastki nuqta: to‘g‘ri texnika; ishlayotgan mushaklar lime rangda yonmoqda',
    labels: [
      { key: 'gluteMax', name: 'Katta dumba', x: 47, y: 66, side: 'l', ly: 56 },
      { key: 'rectusFemoris', name: 'Son: to‘g‘ri', x: 62, y: 62, side: 'r', ly: 56 },
      { key: 'vastusLateralis', name: 'Son: tashqi', x: 64, y: 66, side: 'r', ly: 70 },
    ],
    checks: [
      { text: 'Tana tik, qo‘llar belda', x: 52, y: 42, side: 'l', ly: 30 },
      { text: 'Old tizza oyoq uchi ustida', x: 72, y: 68, side: 'r', ly: 44 },
      { text: 'Orqa tizza yerga yaqin', x: 49, y: 87, side: 'r', ly: 86 },
    ],
  },
  'leg-extension': {
    src: img('leg-extension.webp'),
    phase: 'Yuqori nuqta',
    pair: { src: img('alt/leg-extension.webp'), phase: 'Boshlang‘ich holat' },
    alt: 'Oyoq yozish trenajyori, yuqori nuqta: to‘g‘ri texnika; ishlayotgan mushaklar lime rangda yonmoqda',
    labels: [
      { key: 'rectusFemoris', name: 'Son: to‘g‘ri', x: 47, y: 49, side: 'l', ly: 26 },
      { key: 'vastusLateralis', name: 'Son: tashqi', x: 50, y: 53, side: 'l', ly: 40 },
    ],
    checks: [
      { text: 'Oyoqlar to‘liq yozilgan', x: 37, y: 55, side: 'l', ly: 30 },
      { text: 'Rolik boldir pastida', x: 22, y: 53, side: 'l', ly: 70 },
      { text: 'Orqa suyanchiqda, qo‘llar dastakda', x: 66, y: 58, side: 'r', ly: 70 },
    ],
  },
  'leg-curl': {
    src: img('leg-curl.webp'),
    phase: 'Qisqargan holat',
    pair: { src: img('alt/leg-curl.webp'), phase: 'Boshlang‘ich holat' },
    alt: 'Oyoq bukish trenajyori, qisqargan holat: to‘g‘ri texnika; ishlayotgan mushaklar lime rangda yonmoqda',
    labels: [
      { key: 'bicepsFemoris', name: 'Son orqasi', x: 47, y: 55.5, side: 'r', ly: 30 },
    ],
    checks: [
      { text: 'Son yostiq ostida mahkam', x: 62, y: 45, side: 'r', ly: 14 },
      { text: 'Orqa suyanchiqda', x: 26, y: 30, side: 'l', ly: 24 },
      { text: 'Tizza ~90° bukilgan', x: 66, y: 51, side: 'r', ly: 46 },
      { text: 'Rolik tovon ustida', x: 64, y: 72, side: 'r', ly: 66 },
    ],
  },
  'glute-bridge': {
    src: img('glute-bridge.webp'),
    phase: 'Yuqori nuqta',
    alt: 'Ko‘prikcha, yuqori nuqta: to‘g‘ri texnika; ishlayotgan mushaklar lime rangda yonmoqda',
    labels: [
      { key: 'gluteMax', name: 'Katta dumba', x: 58, y: 72, side: 'l', ly: 40 },
      { key: 'vastusLateralis', name: 'Son: tashqi', x: 72, y: 59, side: 'r', ly: 40 },
    ],
    checks: [
      { text: 'Yelka–tos–tizza bir chiziqda', x: 60, y: 62, side: 'r', ly: 22 },
      { text: 'Oyoq kaftlari yerda, tovon dumbaga yaqin', x: 82, y: 90, side: 'r', ly: 86 },
      { text: 'Qo‘llar yerda', x: 61, y: 86, side: 'r', ly: 72 },
    ],
  },
  'calf-raise': {
    src: img('calf-raise.webp'),
    phase: 'Yuqori nuqta',
    alt: 'Boldir ko‘tarish, yuqori nuqta: to‘g‘ri texnika; ishlayotgan mushaklar lime rangda yonmoqda',
    labels: [
      { key: 'gastrocnemius', name: 'Boldir', x: 44, y: 75, side: 'l', ly: 70 },
      { key: 'soleus', name: 'Kambalasimon', x: 46, y: 83, side: 'r', ly: 80 },
    ],
    checks: [
      { text: 'Tana tik', x: 48, y: 35, side: 'r', ly: 30 },
      { text: 'Tizzalar to‘g‘ri', x: 47, y: 67, side: 'r', ly: 60 },
      { text: 'Oyoq uchlari zina chetida', x: 52, y: 90, side: 'r', ly: 88 },
    ],
  },
  'db-bench': {
    src: img('alt/db-bench.webp'),
    phase: 'Yuqori nuqta',
    alt: 'Gantel bilan yotib jim, yuqori nuqta: qo‘llar yozilgan, gantellar ko‘krak ustida; ishlayotgan mushaklar lime rangda yonmoqda',
    labels: [
      { key: 'pecMid', name: 'Ko‘krak (o‘rta)', x: 39, y: 55, side: 'r', ly: 40 },
      { key: 'tricepsLateral', name: 'Triseps', x: 31, y: 51, side: 'l', ly: 40 },
    ],
    checks: [
      { text: 'Qo‘llar yozilgan, gantellar ko‘krak ustida', x: 32, y: 30, side: 'r', ly: 20 },
      { text: 'Kuraklar yig‘ilgan', x: 28, y: 62, side: 'l', ly: 72 },
      { text: 'Oyoqlar polda', x: 85, y: 88, side: 'r', ly: 84 },
    ],
  },
  'machine-chest-press': {
    src: img('machine-chest-press.webp'),
    phase: 'Boshlang‘ich holat',
    alt: 'Ko‘krak press trenajyori, boshlang‘ich holat: to‘g‘ri texnika; ishlayotgan mushaklar lime rangda yonmoqda',
    labels: [
      { key: 'pecMid', name: 'Ko‘krak (o‘rta)', x: 45, y: 32, side: 'l', ly: 14 },
      { key: 'pecUpper', name: 'Ko‘krak (yuqori)', x: 50, y: 27, side: 'r', ly: 14 },
      { key: 'deltAnt', name: 'Old delta', x: 62, y: 30, side: 'r', ly: 30 },
    ],
    checks: [
      { text: 'Dastaklar ko‘krak o‘rtasi sathida', x: 23, y: 34, side: 'l', ly: 46 },
      { text: 'Kuraklar yostiqda', x: 63, y: 26, side: 'r', ly: 46 },
      { text: 'Oyoqlar polda', x: 22, y: 86, side: 'l', ly: 76 },
    ],
  },
  dips: {
    src: img('dips.webp'),
    phase: 'Pastki nuqta',
    alt: 'Brusyada qo‘l bukish, pastki nuqta: to‘g‘ri texnika; ishlayotgan mushaklar lime rangda yonmoqda',
    labels: [
      { key: 'tricepsLateral', name: 'Triseps', x: 43, y: 31, side: 'l', ly: 40 },
      { key: 'pecLower', name: 'Ko‘krak (past)', x: 57, y: 31, side: 'r', ly: 30 },
      { key: 'deltAnt', name: 'Old delta', x: 53, y: 26, side: 'r', ly: 16 },
    ],
    checks: [
      { text: 'Tana ~20–30° oldinga', x: 50, y: 33, side: 'l', ly: 14 },
      { text: 'Yelkalar quloqdan uzoq, pastda', x: 52, y: 23, side: 'r', ly: 48 },
      { text: 'Tizzalar bukilgan', x: 46, y: 65, side: 'l', ly: 80 },
    ],
  },
  'incline-db-press': {
    src: img('incline-db-press.webp'),
    phase: 'Pastki nuqta',
    pair: { src: img('alt/incline-db-press.webp'), phase: 'Yuqori nuqta' },
    alt: 'Qiya skameykada gantel jimi, pastki nuqta: to‘g‘ri texnika; ishlayotgan mushaklar lime rangda yonmoqda',
    labels: [
      { key: 'pecUpper', name: 'Ko‘krak (yuqori)', x: 30, y: 47, side: 'r', ly: 30 },
      { key: 'deltAnt', name: 'Old delta', x: 24.5, y: 48.5, side: 'l', ly: 30 },
    ],
    checks: [
      { text: 'Skameyka ~30–45°', x: 33, y: 61, side: 'l', ly: 62 },
      { text: 'Gantellar ko‘krak yuqorisi yonida', x: 37, y: 37, side: 'r', ly: 14 },
      { text: 'Oyoqlar polda', x: 76, y: 88, side: 'r', ly: 84 },
    ],
  },
  'incline-bench': {
    src: img('incline-bench.webp'),
    phase: 'Pastki nuqta',
    pair: { src: img('alt/incline-bench.webp'), phase: 'Yuqori nuqta' },
    alt: 'Qiya skameykada shtanga jimi, pastki nuqta: to‘g‘ri texnika; ishlayotgan mushaklar lime rangda yonmoqda',
    labels: [
      { key: 'pecUpper', name: 'Ko‘krak (yuqori)', x: 31.5, y: 50, side: 'r', ly: 30 },
      { key: 'deltAnt', name: 'Old delta', x: 27, y: 53, side: 'l', ly: 30 },
    ],
    checks: [
      { text: 'Shtanga o‘mrov ostiga tushadi', x: 33, y: 40, side: 'r', ly: 14 },
      { text: 'Skameyka ~30–45°', x: 33, y: 61, side: 'l', ly: 62 },
      { text: 'Oyoqlar polda', x: 73, y: 90, side: 'r', ly: 84 },
    ],
  },
  'cable-fly': {
    src: img('alt/cable-fly.webp'),
    phase: 'Boshlang‘ich holat',
    alt: 'Krossoverda qo‘l birlashtirish, boshlang‘ich holat: qo‘llar keng ochilgan, tirsak biroz bukilgan; ishlayotgan mushaklar lime rangda yonmoqda',
    labels: [
      { key: 'pecMid', name: 'Ko‘krak (o‘rta)', x: 45, y: 28, side: 'l', ly: 40 },
      { key: 'pecLower', name: 'Ko‘krak (past)', x: 55, y: 31, side: 'r', ly: 42 },
      { key: 'deltAnt', name: 'Old delta', x: 37, y: 25, side: 'l', ly: 22 },
    ],
    checks: [
      { text: 'Tirsaklar biroz bukilgan, qotgan', x: 28, y: 30, side: 'l', ly: 46 },
      { text: 'Dastaklar ko‘krak sathida, keng', x: 82, y: 33, side: 'r', ly: 46 },
      { text: 'Tana tik, ko‘krak ochiq', x: 50, y: 40, side: 'r', ly: 64 },
    ],
  },
  'pec-deck': {
    src: img('pec-deck.webp'),
    phase: 'Boshlang‘ich holat',
    pair: { src: img('alt/pec-deck.webp'), phase: 'Qisqargan holat' },
    alt: 'Batterflay trenajyori, boshlang‘ich holat: to‘g‘ri texnika; ishlayotgan mushaklar lime rangda yonmoqda',
    labels: [
      { key: 'pecMid', name: 'Ko‘krak (o‘rta)', x: 54, y: 32, side: 'r', ly: 30 },
      { key: 'deltAnt', name: 'Old delta', x: 40, y: 30, side: 'l', ly: 16 },
    ],
    checks: [
      { text: 'Orqa yostiqqa tegib', x: 58, y: 20, side: 'r', ly: 16 },
      { text: 'Tirsaklar yelka sathida', x: 32, y: 34, side: 'r', ly: 36 },
      { text: 'Oyoqlar polda', x: 28, y: 86, side: 'l', ly: 80 },
    ],
  },
  'db-fly': {
    src: img('db-fly.webp'),
    phase: 'Pastki nuqta',
    alt: 'Gantel bilan qo‘l yoyish, pastki nuqta: to‘g‘ri texnika; ishlayotgan mushaklar lime rangda yonmoqda',
    labels: [
      { key: 'pecMid', name: 'Ko‘krak (o‘rta)', x: 56, y: 35, side: 'l', ly: 36 },
      { key: 'deltAnt', name: 'Old delta', x: 48, y: 28.5, side: 'l', ly: 22 },
    ],
    checks: [
      { text: 'Qo‘llar keng yoyilgan, tirsak ~20° bukilgan', x: 37, y: 25, side: 'l', ly: 8 },
      { text: 'Gantellar ko‘krak sathida', x: 82, y: 57, side: 'r', ly: 50 },
      { text: 'Oyoqlar polda', x: 38, y: 86, side: 'l', ly: 86 },
    ],
  },
  'db-shoulder-press': {
    src: img('db-shoulder-press.webp'),
    phase: 'Boshlang‘ich holat',
    pair: { src: img('alt/db-shoulder-press.webp'), phase: 'Yuqori nuqta' },
    alt: 'O‘tirib gantel jimi, boshlang‘ich holat: to‘g‘ri texnika; ishlayotgan mushaklar lime rangda yonmoqda',
    labels: [
      { key: 'deltAnt', name: 'Old delta', x: 37, y: 40.5, side: 'l', ly: 48 },
      { key: 'deltLat', name: 'O‘rta delta', x: 62, y: 37, side: 'r', ly: 48 },
    ],
    checks: [
      { text: 'Gantellar quloq sathida, bilak tik', x: 30, y: 30, side: 'l', ly: 14 },
      { text: 'Orqa suyanchiqda, tik', x: 50, y: 50, side: 'r', ly: 64 },
      { text: 'Oyoqlar polda', x: 46, y: 92, side: 'l', ly: 84 },
    ],
  },
  'machine-shoulder-press': {
    src: img('machine-shoulder-press.webp'),
    phase: 'Boshlang‘ich holat',
    pair: { src: img('alt/machine-shoulder-press.webp'), phase: 'Yuqori nuqta' },
    alt: 'Yelka press trenajyori, boshlang‘ich holat: to‘g‘ri texnika; ishlayotgan mushaklar lime rangda yonmoqda',
    labels: [
      { key: 'deltAnt', name: 'Old delta', x: 63, y: 32, side: 'r', ly: 40 },
      { key: 'deltLat', name: 'O‘rta delta', x: 36, y: 31, side: 'l', ly: 40 },
      { key: 'tricepsLateral', name: 'Triseps', x: 71, y: 33, side: 'r', ly: 56 },
    ],
    checks: [
      { text: 'Dastaklar yelka sathida', x: 32, y: 21, side: 'l', ly: 14 },
      { text: 'Orqa yostiqqa tegib', x: 45, y: 45, side: 'l', ly: 58 },
      { text: 'Oyoqlar polda', x: 18, y: 86, side: 'l', ly: 80 },
    ],
  },
  'pike-push-up': {
    src: img('pike-push-up.webp'),
    phase: 'Pastki nuqta',
    pair: { src: img('alt/pike-push-up.webp'), phase: 'Yuqori nuqta' },
    alt: 'Pike otjimaniya, pastki nuqta: to‘g‘ri texnika; ishlayotgan mushaklar lime rangda yonmoqda',
    labels: [
      { key: 'deltAnt', name: 'Old delta', x: 65, y: 60, side: 'l', ly: 44 },
      { key: 'tricepsLateral', name: 'Triseps', x: 62, y: 71, side: 'r', ly: 52 },
    ],
    checks: [
      { text: 'Tos baland — teskari V', x: 47, y: 30, side: 'l', ly: 14 },
      { text: 'Bosh polga tomon tushadi', x: 75, y: 77, side: 'r', ly: 70 },
      { text: 'Oyoqlar tik', x: 30, y: 75, side: 'l', ly: 62 },
    ],
  },
  'lateral-raise': {
    src: img('lateral-raise.webp'),
    phase: 'Yuqori nuqta',
    pair: { src: img('alt/lateral-raise.webp'), phase: 'Boshlang‘ich holat' },
    alt: 'Gantelni yonga ko‘tarish, yuqori nuqta: to‘g‘ri texnika; ishlayotgan mushaklar lime rangda yonmoqda',
    labels: [
      { key: 'deltLat', name: 'O‘rta delta', x: 36, y: 22, side: 'l', ly: 40 },
      { key: 'trapUpper', name: 'Trapetsiya (yuqori)', x: 47, y: 21, side: 'r', ly: 40 },
    ],
    checks: [
      { text: 'Qo‘llar aynan yelka sathida', x: 85, y: 26, side: 'r', ly: 10 },
      { text: 'Yelka ko‘tarilmaydi', x: 54, y: 17, side: 'r', ly: 58 },
      { text: 'Tana tik, silkinmaydi', x: 50, y: 55, side: 'l', ly: 62 },
    ],
  },
  'cable-lateral-raise': {
    src: img('cable-lateral-raise.webp'),
    phase: 'Yuqori nuqta',
    pair: { src: img('alt/cable-lateral-raise.webp'), phase: 'Boshlang‘ich holat' },
    alt: 'Blokda yonga ko‘tarish, yuqori nuqta: to‘g‘ri texnika; ishlayotgan mushaklar lime rangda yonmoqda',
    labels: [
      { key: 'deltLat', name: 'O‘rta delta', x: 41, y: 21.5, side: 'r', ly: 30 },
      { key: 'trapUpper', name: 'Trapetsiya (yuqori)', x: 46, y: 20.5, side: 'l', ly: 40 },
    ],
    checks: [
      { text: 'Qo‘l yelka sathigacha', x: 28, y: 23, side: 'l', ly: 14 },
      { text: 'Ikkinchi qo‘l ramada', x: 72, y: 33, side: 'r', ly: 46 },
      { text: 'Tana tik', x: 50, y: 48, side: 'l', ly: 60 },
    ],
  },
  'face-pull': {
    src: img('face-pull.webp'),
    phase: 'Qisqargan holat',
    pair: { src: img('alt/face-pull.webp'), phase: 'Boshlang‘ich holat' },
    alt: 'Arqonni yuzga tortish, qisqargan holat: to‘g‘ri texnika; ishlayotgan mushaklar lime rangda yonmoqda',
    labels: [
      { key: 'deltPost', name: 'Orqa delta', x: 38, y: 24, side: 'l', ly: 30 },
      { key: 'trapMid', name: 'Trapetsiya o‘rtasi', x: 46.5, y: 24.5, side: 'l', ly: 46 },
    ],
    checks: [
      { text: 'Arqon yuz tomon, qo‘llar quloq yonida', x: 55, y: 13, side: 'r', ly: 16 },
      { text: 'Tirsaklar baland va keng', x: 35, y: 21, side: 'l', ly: 14 },
      { text: 'Kuraklar yig‘ilgan', x: 47, y: 26, side: 'r', ly: 36 },
      { text: 'Tana tik', x: 47, y: 38, side: 'r', ly: 64 },
    ],
  },
  'reverse-fly': {
    src: img('reverse-fly.webp'),
    phase: 'Qisqargan holat',
    alt: 'Lentani yoyish, qisqargan holat: to‘g‘ri texnika; ishlayotgan mushaklar lime rangda yonmoqda',
    labels: [
      { key: 'deltPost', name: 'Orqa delta', x: 38, y: 19.5, side: 'l', ly: 36 },
      { key: 'trapMid', name: 'Trapetsiya o‘rtasi', x: 50, y: 25, side: 'r', ly: 36 },
      { key: 'rhomboids', name: 'Rombsimon', x: 47, y: 30, side: 'l', ly: 50 },
    ],
    checks: [
      { text: 'Qo‘llar to‘g‘ri, yelka sathida', x: 85, y: 23, side: 'r', ly: 10 },
      { text: 'Kuraklar yig‘ilgan', x: 50, y: 28, side: 'r', ly: 52 },
      { text: 'Tana tik', x: 50, y: 50, side: 'l', ly: 66 },
    ],
  },
  'db-row': {
    src: img('db-row.webp'),
    phase: 'Yuqori nuqta',
    pair: { src: img('alt/db-row.webp'), phase: 'Pastki nuqta' },
    alt: 'Bir qo‘llab gantel tortish, yuqori nuqta: to‘g‘ri texnika; ishlayotgan mushaklar lime rangda yonmoqda',
    labels: [
      { key: 'lats', name: 'Orqaning keng mushagi', x: 62, y: 33, side: 'l', ly: 14 },
      { key: 'trapMid', name: 'Trapetsiya o‘rtasi', x: 72, y: 29, side: 'r', ly: 14 },
      { key: 'deltPost', name: 'Orqa delta', x: 72, y: 33, side: 'r', ly: 30 },
    ],
    checks: [
      { text: 'Tana polga parallel, bel tekis', x: 51, y: 31, side: 'l', ly: 30 },
      { text: 'Gantel songa tortiladi', x: 57, y: 45, side: 'r', ly: 46 },
      { text: 'Tirsak tanaga yaqin', x: 56.5, y: 24.5, side: 'l', ly: 46 },
      { text: 'Tizza va qo‘l skameykada', x: 35, y: 66, side: 'l', ly: 62 },
    ],
  },
  'cable-row': {
    src: img('cable-row.webp'),
    phase: 'Qisqargan holat',
    pair: { src: img('alt/cable-row.webp'), phase: 'Boshlang‘ich holat' },
    alt: 'O‘tirib blok tortish, qisqargan holat: to‘g‘ri texnika; ishlayotgan mushaklar lime rangda yonmoqda',
    labels: [
      { key: 'lats', name: 'Orqaning keng mushagi', x: 22, y: 52, side: 'r', ly: 36 },
      { key: 'trapMid', name: 'Trapetsiya o‘rtasi', x: 17, y: 47, side: 'r', ly: 20 },
    ],
    checks: [
      { text: 'Tana tik, qimirlamaydi', x: 25, y: 45, side: 'r', ly: 18 },
      { text: 'Dastak kindikka tortiladi', x: 36, y: 58, side: 'r', ly: 36 },
      { text: 'Tizzalar biroz bukilgan', x: 50, y: 66, side: 'r', ly: 54 },
    ],
  },
  'chest-supported-row': {
    src: img('chest-supported-row.webp'),
    phase: 'Yuqori nuqta',
    pair: { src: img('alt/chest-supported-row.webp'), phase: 'Pastki nuqta' },
    alt: 'Ko‘krak tayanchli gantel tortish, yuqori nuqta: to‘g‘ri texnika; ishlayotgan mushaklar lime rangda yonmoqda',
    labels: [
      { key: 'trapMid', name: 'Trapetsiya o‘rtasi', x: 64, y: 17, side: 'r', ly: 8 },
      { key: 'deltPost', name: 'Orqa delta', x: 61, y: 17.5, side: 'r', ly: 24 },
      { key: 'lats', name: 'Orqaning keng mushagi', x: 57, y: 27, side: 'l', ly: 22 },
    ],
    checks: [
      { text: 'Ko‘krak yostiqda', x: 72, y: 24, side: 'r', ly: 44 },
      { text: 'Tirsaklar orqaga ~45°', x: 47, y: 20, side: 'l', ly: 10 },
      { text: 'Bo‘yin tabiiy', x: 74, y: 19, side: 'r', ly: 60 },
    ],
  },
  'inverted-row': {
    src: img('inverted-row.webp'),
    phase: 'Yuqori nuqta',
    alt: 'Avstraliyacha tortilish, yuqori nuqta: to‘g‘ri texnika; ishlayotgan mushaklar lime rangda yonmoqda',
    labels: [
      { key: 'lats', name: 'Orqaning keng mushagi', x: 62, y: 45, side: 'r', ly: 58 },
      { key: 'deltPost', name: 'Orqa delta', x: 66, y: 36, side: 'r', ly: 16 },
    ],
    checks: [
      { text: 'Ko‘krak shtangaga tortiladi', x: 62, y: 37, side: 'l', ly: 18 },
      { text: 'Tana boshdan tovongacha tekis', x: 45, y: 55, side: 'l', ly: 48 },
      { text: 'Tovonlar yerda', x: 14, y: 82, side: 'l', ly: 70 },
    ],
  },
  'chin-up': {
    src: img('chin-up.webp'),
    phase: 'Yuqori nuqta',
    pair: { src: img('alt/chin-up.webp'), phase: 'Pastki nuqta' },
    alt: 'Teskari ushlab tortilish, yuqori nuqta: to‘g‘ri texnika; ishlayotgan mushaklar lime rangda yonmoqda',
    labels: [
      { key: 'lats', name: 'Orqaning keng mushagi', x: 43, y: 26, side: 'l', ly: 30 },
      { key: 'teresMajor', name: 'Katta yumaloq', x: 59.5, y: 21, side: 'r', ly: 30 },
    ],
    checks: [
      { text: 'Kaftlar o‘zingizga, yelka kengligida', x: 33, y: 10, side: 'l', ly: 2 },
      { text: 'Iyak turnikdan yuqori', x: 53, y: 8, side: 'r', ly: 4 },
      { text: 'Tana tik, oyoqlar birga', x: 50, y: 60, side: 'r', ly: 58 },
    ],
  },
  'db-shrug': {
    src: img('db-shrug.webp'),
    phase: 'Yuqori nuqta',
    pair: { src: img('alt/db-shrug.webp'), phase: 'Pastki nuqta' },
    alt: 'Gantel bilan yelka qisish, yuqori nuqta: to‘g‘ri texnika; ishlayotgan mushaklar lime rangda yonmoqda',
    labels: [
      { key: 'trapUpper', name: 'Trapetsiya (yuqori)', x: 45, y: 17, side: 'l', ly: 20 },
      { key: 'trapMid', name: 'Trapetsiya o‘rtasi', x: 50, y: 28, side: 'r', ly: 30 },
    ],
    checks: [
      { text: 'Yelkalar tik yuqoriga, aylantirilmaydi', x: 58, y: 18, side: 'r', ly: 14 },
      { text: 'Qo‘llar to‘g‘ri', x: 37, y: 40, side: 'l', ly: 40 },
      { text: 'Bo‘yin tabiiy', x: 50, y: 14, side: 'l', ly: 6 },
    ],
  },
  'barbell-curl': {
    src: img('barbell-curl.webp'),
    phase: 'Yuqori nuqta',
    pair: { src: img('alt/barbell-curl.webp'), phase: 'Pastki nuqta' },
    alt: 'Shtanga bilan bitseps, yuqori nuqta: to‘g‘ri texnika; ishlayotgan mushaklar lime rangda yonmoqda',
    labels: [
      { key: 'biceps', name: 'Bitseps', x: 47, y: 28, side: 'l', ly: 30 },
      { key: 'brachioradialis', name: 'Yelka-bilak', x: 48, y: 30, side: 'r', ly: 30 },
    ],
    checks: [
      { text: 'Tirsaklar tana yonida', x: 43, y: 35, side: 'l', ly: 46 },
      { text: 'Bilak to‘g‘ri', x: 51, y: 25, side: 'r', ly: 12 },
      { text: 'Tana orqaga egilmaydi', x: 45, y: 50, side: 'r', ly: 56 },
    ],
  },
  'db-curl': {
    src: img('db-curl.webp'),
    phase: 'Yuqori nuqta',
    pair: { src: img('alt/db-curl.webp'), phase: 'Pastki nuqta' },
    alt: 'Gantel bilan bitseps, yuqori nuqta: to‘g‘ri texnika; ishlayotgan mushaklar lime rangda yonmoqda',
    labels: [
      { key: 'biceps', name: 'Bitseps', x: 48.5, y: 29, side: 'l', ly: 30 },
      { key: 'brachialis', name: 'Brakhialis', x: 46, y: 32.5, side: 'r', ly: 36 },
    ],
    checks: [
      { text: 'Kaft yelkaga qaragan', x: 55, y: 26, side: 'r', ly: 14 },
      { text: 'Tirsak tana yonida', x: 47, y: 35, side: 'l', ly: 48 },
      { text: 'Silkinmasdan', x: 49, y: 60, side: 'r', ly: 58 },
    ],
  },
  'hammer-curl': {
    src: img('hammer-curl.webp'),
    phase: 'Boshlang‘ich holat',
    pair: { src: img('alt/hammer-curl.webp'), phase: 'Yuqori nuqta' },
    alt: 'Bolg‘a bukish, boshlang‘ich holat: gantel neytral ushlangan, kaft songa qaragan; ishlayotgan mushaklar lime rangda yonmoqda',
    labels: [
      { key: 'biceps', name: 'Bitseps', x: 46, y: 31, side: 'r', ly: 26 },
      { key: 'brachialis', name: 'Brakhialis', x: 46, y: 37, side: 'l', ly: 34 },
      { key: 'brachioradialis', name: 'Yelka-bilak', x: 47.5, y: 45, side: 'r', ly: 44 },
    ],
    checks: [
      { text: 'Kaftlar bir-biriga qaragan', x: 50, y: 51, side: 'r', ly: 58 },
      { text: 'Tirsak tana yonida', x: 46, y: 41, side: 'l', ly: 48 },
      { text: 'Tana tik', x: 44, y: 28, side: 'l', ly: 20 },
    ],
  },
  'incline-curl': {
    src: img('incline-curl.webp'),
    phase: 'Yuqori nuqta',
    pair: { src: img('alt/incline-curl.webp'), phase: 'Pastki nuqta' },
    alt: 'Qiya skameykada bitseps, yuqori nuqta: to‘g‘ri texnika; ishlayotgan mushaklar lime rangda yonmoqda',
    labels: [
      { key: 'biceps', name: 'Bitseps', x: 22, y: 48, side: 'r', ly: 58 },
      { key: 'brachialis', name: 'Brakhialis', x: 17.5, y: 51, side: 'r', ly: 72 },
    ],
    checks: [
      { text: 'Skameyka ~45–60°', x: 10, y: 32, side: 'l', ly: 24 },
      { text: 'Yelka pastga osilgan, qimirlamaydi', x: 22, y: 45, side: 'r', ly: 22 },
    ],
  },
  'cable-curl': {
    src: img('cable-curl.webp'),
    phase: 'Yuqori nuqta',
    pair: { src: img('alt/cable-curl.webp'), phase: 'Pastki nuqta' },
    alt: 'Blokda bitseps, yuqori nuqta: to‘g‘ri texnika; ishlayotgan mushaklar lime rangda yonmoqda',
    labels: [
      { key: 'biceps', name: 'Bitseps', x: 39, y: 32, side: 'l', ly: 30 },
      { key: 'brachialis', name: 'Brakhialis', x: 35.5, y: 32.5, side: 'l', ly: 44 },
    ],
    checks: [
      { text: 'Tirsaklar tana yonida', x: 37, y: 37, side: 'l', ly: 60 },
      { text: 'Tutqich yelka sathigacha', x: 46.5, y: 20, side: 'r', ly: 14 },
      { text: 'Tana tik', x: 36, y: 60, side: 'r', ly: 58 },
    ],
  },
  pushdown: {
    src: img('pushdown.webp'),
    phase: 'Pastki nuqta',
    pair: { src: img('alt/pushdown.webp'), phase: 'Boshlang‘ich holat' },
    alt: 'Blokda triseps, pastki nuqta: to‘g‘ri texnika; ishlayotgan mushaklar lime rangda yonmoqda',
    labels: [
      { key: 'tricepsLateral', name: 'Triseps: tashqi', x: 40, y: 40, side: 'l', ly: 36 },
      { key: 'tricepsLong', name: 'Triseps: uzun', x: 39.5, y: 42, side: 'l', ly: 50 },
    ],
    checks: [
      { text: 'Tirsaklar tanaga yopishgan', x: 41, y: 45, side: 'r', ly: 30 },
      { text: 'Qo‘llar to‘liq yozilgan', x: 42, y: 53, side: 'r', ly: 46 },
      { text: 'Tana tik, qorin tarang', x: 38, y: 62, side: 'l', ly: 66 },
    ],
  },
  'overhead-extension': {
    src: img('overhead-extension.webp'),
    phase: 'Pastki nuqta',
    pair: { src: img('alt/overhead-extension.webp'), phase: 'Yuqori nuqta' },
    alt: 'Bosh ortidan triseps, pastki nuqta: to‘g‘ri texnika; ishlayotgan mushaklar lime rangda yonmoqda',
    labels: [
      { key: 'tricepsLong', name: 'Triseps: uzun', x: 48.5, y: 27, side: 'r', ly: 22 },
      { key: 'tricepsMedial', name: 'Triseps: ichki', x: 49.5, y: 20.5, side: 'r', ly: 38 },
    ],
    checks: [
      { text: 'Tirsaklar tepaga, bosh yonida', x: 51, y: 18, side: 'l', ly: 10 },
      { text: 'Gantel bosh orqasiga tushadi', x: 38, y: 32, side: 'l', ly: 30 },
      { text: 'Qovurg‘alar pastda', x: 50, y: 40, side: 'r', ly: 56 },
    ],
  },
  'skull-crusher': {
    src: img('skull-crusher.webp'),
    phase: 'Pastki nuqta',
    pair: { src: img('alt/skull-crusher.webp'), phase: 'Yuqori nuqta' },
    alt: 'Fransuzcha jim, pastki nuqta: to‘g‘ri texnika; ishlayotgan mushaklar lime rangda yonmoqda',
    labels: [
      { key: 'tricepsLateral', name: 'Triseps: tashqi', x: 33, y: 52, side: 'l', ly: 36 },
      { key: 'tricepsLong', name: 'Triseps: uzun', x: 30, y: 57, side: 'r', ly: 40 },
    ],
    checks: [
      { text: 'Shtanga bosh tepasi ortiga tushadi', x: 13, y: 48, side: 'l', ly: 22 },
      { text: 'Tirsaklar tepaga, yoyilmaydi', x: 30, y: 48, side: 'r', ly: 24 },
      { text: 'Oyoqlar polda', x: 82, y: 89, side: 'r', ly: 84 },
    ],
  },
  'close-grip-bench': {
    src: img('close-grip-bench.webp'),
    phase: 'Pastki nuqta',
    pair: { src: img('alt/close-grip-bench.webp'), phase: 'Yuqori nuqta' },
    alt: 'Tor ushlab yotib jim, pastki nuqta: to‘g‘ri texnika; ishlayotgan mushaklar lime rangda yonmoqda',
    labels: [
      { key: 'tricepsLateral', name: 'Triseps', x: 37, y: 68, side: 'r', ly: 56 },
      { key: 'pecUpper', name: 'Ko‘krak (yuqori)', x: 30, y: 58, side: 'r', ly: 40 },
    ],
    checks: [
      { text: 'Ushlash yelka kengligida', x: 38, y: 48, side: 'l', ly: 24 },
      { text: 'Tirsak tanaga yaqin, ~20–30°', x: 43, y: 68, side: 'l', ly: 80 },
      { text: 'Oyoqlar polda', x: 80, y: 88, side: 'r', ly: 84 },
    ],
  },
  'bench-dip': {
    src: img('bench-dip.webp'),
    phase: 'Pastki nuqta',
    pair: { src: img('alt/bench-dip.webp'), phase: 'Yuqori nuqta' },
    alt: 'Skameykada orqa tayanch, pastki nuqta: to‘g‘ri texnika; ishlayotgan mushaklar lime rangda yonmoqda',
    labels: [
      { key: 'tricepsLateral', name: 'Triseps', x: 31, y: 49.5, side: 'l', ly: 40 },
      { key: 'deltAnt', name: 'Old delta', x: 41, y: 49.5, side: 'r', ly: 36 },
    ],
    checks: [
      { text: 'Qo‘llar skameyka chetida', x: 32, y: 68, side: 'l', ly: 62 },
      { text: 'Yelka pol bilan parallel', x: 31, y: 50, side: 'l', ly: 24 },
      { text: 'Orqa skameykaga yaqin', x: 34, y: 63, side: 'r', ly: 54 },
      { text: 'Oyoqlar oldinda, tovon yerda', x: 86, y: 86, side: 'r', ly: 70 },
    ],
  },
  plank: {
    src: img('plank.webp'),
    phase: 'Ushlab turish',
    alt: 'Planka, ushlab turish: to‘g‘ri texnika; ishlayotgan mushaklar lime rangda yonmoqda',
    labels: [
      { key: 'rectusAbdominis', name: 'Qorin to‘g‘ri mushagi', x: 64, y: 85.5, side: 'l', ly: 60 },
      { key: 'externalOblique', name: 'Qiyshiq mushaklar', x: 62, y: 81.5, side: 'r', ly: 58 },
    ],
    checks: [
      { text: 'Tirsak yelka ostida', x: 76, y: 91, side: 'r', ly: 76 },
      { text: 'Boshdan tovongacha bir chiziq', x: 50, y: 78, side: 'l', ly: 44 },
      { text: 'Bel osilmaydi, tos ko‘tarilmaydi', x: 57, y: 77.5, side: 'r', ly: 44 },
    ],
  },
  'hanging-leg-raise': {
    src: img('hanging-leg-raise.webp'),
    phase: 'Yuqori nuqta',
    pair: { src: img('alt/hanging-leg-raise.webp'), phase: 'Pastki nuqta' },
    alt: 'Turnikda oyoq ko‘tarish, yuqori nuqta: to‘g‘ri texnika; ishlayotgan mushaklar lime rangda yonmoqda',
    labels: [
      { key: 'rectusAbdominis', name: 'Qorin to‘g‘ri mushagi', x: 41, y: 42, side: 'r', ly: 30 },
      { key: 'iliopsoas', name: 'Son bukuvchi', x: 40.5, y: 48, side: 'l', ly: 56 },
      { key: 'externalOblique', name: 'Qiyshiq mushaklar', x: 37.5, y: 43, side: 'l', ly: 40 },
    ],
    checks: [
      { text: 'Qo‘llar to‘g‘ri, yelka faol', x: 37, y: 12, side: 'r', ly: 10 },
      { text: 'Oyoqlar to‘g‘ri, gorizontal', x: 62, y: 47, side: 'r', ly: 50 },
      { text: 'Silkinmasdan, tana tik', x: 34, y: 30, side: 'l', ly: 22 },
    ],
  },
  'cable-crunch': {
    src: img('cable-crunch.webp'),
    phase: 'Qisqargan holat',
    pair: { src: img('alt/cable-crunch.webp'), phase: 'Boshlang‘ich holat' },
    alt: 'Blokda press, qisqargan holat: to‘g‘ri texnika; ishlayotgan mushaklar lime rangda yonmoqda',
    labels: [
      { key: 'rectusAbdominis', name: 'Qorin to‘g‘ri mushagi', x: 42, y: 52, side: 'l', ly: 40 },
      { key: 'externalOblique', name: 'Qiyshiq mushaklar', x: 37, y: 50, side: 'l', ly: 56 },
    ],
    checks: [
      { text: 'Arqon boshga yaqin ushlangan', x: 66, y: 32, side: 'r', ly: 22 },
      { text: 'Qovurg‘a tosga tomon bukilgan', x: 44, y: 46, side: 'r', ly: 44 },
      { text: 'Tos tizza ustida qimirlamaydi', x: 35, y: 62, side: 'l', ly: 72 },
    ],
  },
  crunch: {
    src: img('crunch.webp'),
    phase: 'Yuqori nuqta',
    pair: { src: img('alt/crunch.webp'), phase: 'Pastki nuqta' },
    alt: 'Pressga qisqarish, yuqori nuqta: to‘g‘ri texnika; ishlayotgan mushaklar lime rangda yonmoqda',
    labels: [
      { key: 'rectusAbdominis', name: 'Qorin to‘g‘ri mushagi', x: 48, y: 78, side: 'r', ly: 50 },
      { key: 'externalOblique', name: 'Qiyshiq mushaklar', x: 43, y: 81, side: 'l', ly: 56 },
    ],
    checks: [
      { text: 'Kuraklar yerdan ko‘tarilgan', x: 24, y: 78, side: 'l', ly: 30 },
      { text: 'Bel yerda qoladi', x: 45, y: 88, side: 'r', ly: 62 },
      { text: 'Tizzalar bukilgan, oyoq yerda', x: 80, y: 88, side: 'r', ly: 80 },
    ],
  },
  'dead-bug': {
    src: img('dead-bug.webp'),
    phase: 'Cho‘zilgan holat',
    alt: '«O‘lik qo‘ng‘iz», cho‘zilgan holat: to‘g‘ri texnika; ishlayotgan mushaklar lime rangda yonmoqda',
    labels: [
      { key: 'externalOblique', name: 'Qiyshiq mushaklar', x: 38, y: 58, side: 'l', ly: 72 },
      { key: 'rectusAbdominis', name: 'Qorin to‘g‘ri mushagi', x: 40, y: 55, side: 'r', ly: 22 },
    ],
    checks: [
      { text: 'Bel polga bosilgan', x: 45, y: 58, side: 'l', ly: 80 },
      { text: 'Tizza 90°, son ustida', x: 57, y: 37, side: 'r', ly: 38 },
      { text: 'Qo‘l tik yuqoriga', x: 36, y: 25, side: 'l', ly: 22 },
    ],
  },
  // <auto> scripts/images/place.py — generatsiya qilingan va tekshirilgan rasmlar (yorliqlar EMG ro'yxatida)
  // </auto>
};
