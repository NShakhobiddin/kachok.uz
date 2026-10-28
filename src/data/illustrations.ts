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
}

const img = (f: string) => `${import.meta.env.BASE_URL}illustrations/${f}`;

export const ILLUSTRATIONS: Partial<Record<string, Illustration>> = {
  'back-squat': {
    src: img('back-squat-bottom.webp'),
    phase: 'Pastki nuqta',
    alt: 'Shtanga bilan o‘tirib-turish, pastki nuqta: shtanga trapetsiya ustida, son pol bilan parallel; son oldi, dumba va bel mushaklari lime rangda yonmoqda',
    labels: [
      { key: 'rectusFemoris', name: 'To‘g‘ri son', x: 43, y: 54.5, side: 'l', ly: 42 },
      { key: 'vastusLateralis', name: 'Tashqi son', x: 34, y: 59, side: 'l', ly: 56 },
      { key: 'gastrocnemius', name: 'Boldir', x: 32, y: 73, side: 'l', ly: 77 },
      { key: 'erectors', name: 'Bel rostlovchi', x: 53, y: 40, side: 'r', ly: 42 },
      { key: 'gluteMax', name: 'Katta dumba', x: 55, y: 57, side: 'r', ly: 56 },
      { key: 'adductors', name: 'Ichki son', x: 53, y: 64, side: 'r', ly: 70 },
    ],
    checks: [
      { text: 'Nigoh 2 m oldinga, bo‘yin tabiiy', x: 37, y: 19, side: 'l', ly: 6 },
      { text: 'Shtanga trapetsiya ustida', x: 47, y: 27.5, side: 'r', ly: 36 },
      { text: 'Ushlash keng, tirsaklar pastga', x: 41, y: 40, side: 'l', ly: 42 },
      { text: 'Bel tekis, tabiiy egilish saqlangan', x: 53, y: 44, side: 'r', ly: 54 },
      { text: 'Son pol bilan parallel', x: 46, y: 59, side: 'l', ly: 57 },
      { text: 'Tizza oyoq uchi yo‘nalishida', x: 27, y: 63, side: 'l', ly: 71 },
      { text: 'Tovonlar yerda, og‘irlik oyoq kafti o‘rtasida', x: 40, y: 90, side: 'r', ly: 85 },
    ],
  },
  // <auto> scripts/images/place.py — generatsiya qilingan va tekshirilgan rasmlar (yorliqlar EMG ro'yxatida)
  'back-extension': { src: img('back-extension.webp'), phase: 'Yuqori nuqta', alt: 'Giperekstenziya, yuqori nuqta: to‘g‘ri texnika; ishlayotgan mushaklar lime rangda yonmoqda' },
  'barbell-curl': { src: img('barbell-curl.webp'), phase: 'Yuqori nuqta', alt: 'Shtanga bilan bitseps, yuqori nuqta: to‘g‘ri texnika; ishlayotgan mushaklar lime rangda yonmoqda' },
  'barbell-row': { src: img('barbell-row.webp'), phase: 'Yuqori nuqta', alt: 'Engashib shtanga tortish, yuqori nuqta: to‘g‘ri texnika; ishlayotgan mushaklar lime rangda yonmoqda' },
  'bench-dip': { src: img('bench-dip.webp'), phase: 'Pastki nuqta', alt: 'Skameykada orqa tayanch, pastki nuqta: to‘g‘ri texnika; ishlayotgan mushaklar lime rangda yonmoqda' },
  'bench-press': { src: img('bench-press.webp'), phase: 'Pastki nuqta', alt: 'Shtanga bilan yotib jim, pastki nuqta: to‘g‘ri texnika; ishlayotgan mushaklar lime rangda yonmoqda' },
  bulgarian: { src: img('bulgarian.webp'), phase: 'Pastki nuqta', alt: 'Bolgarcha split-o‘tirish, pastki nuqta: to‘g‘ri texnika; ishlayotgan mushaklar lime rangda yonmoqda' },
  'bw-split-squat': { src: img('bw-split-squat.webp'), phase: 'Pastki nuqta', alt: 'O‘z vazni bilan split-o‘tirish, pastki nuqta: to‘g‘ri texnika; ishlayotgan mushaklar lime rangda yonmoqda' },
  'bw-squat': { src: img('bw-squat.webp'), phase: 'Pastki nuqta', alt: 'O‘z vazni bilan o‘tirish, pastki nuqta: to‘g‘ri texnika; ishlayotgan mushaklar lime rangda yonmoqda' },
  'cable-crunch': { src: img('cable-crunch.webp'), phase: 'Qisqargan holat', alt: 'Blokda press, qisqargan holat: to‘g‘ri texnika; ishlayotgan mushaklar lime rangda yonmoqda' },
  'cable-curl': { src: img('cable-curl.webp'), phase: 'Yuqori nuqta', alt: 'Blokda bitseps, yuqori nuqta: to‘g‘ri texnika; ishlayotgan mushaklar lime rangda yonmoqda' },
  'cable-fly': { src: img('cable-fly.webp'), phase: 'Qisqargan holat', alt: 'Krossoverda qo‘l birlashtirish, qisqargan holat: to‘g‘ri texnika; ishlayotgan mushaklar lime rangda yonmoqda' },
  'cable-lateral-raise': { src: img('cable-lateral-raise.webp'), phase: 'Yuqori nuqta', alt: 'Blokda yonga ko‘tarish, yuqori nuqta: to‘g‘ri texnika; ishlayotgan mushaklar lime rangda yonmoqda' },
  'cable-row': { src: img('cable-row.webp'), phase: 'Qisqargan holat', alt: 'O‘tirib blok tortish, qisqargan holat: to‘g‘ri texnika; ishlayotgan mushaklar lime rangda yonmoqda' },
  'calf-raise': { src: img('calf-raise.webp'), phase: 'Yuqori nuqta', alt: 'Boldir ko‘tarish, yuqori nuqta: to‘g‘ri texnika; ishlayotgan mushaklar lime rangda yonmoqda' },
  'chest-supported-row': {
    src: img('chest-supported-row.webp'),
    phase: 'Yuqori nuqta',
    alt: 'Ko‘krak tayanchli gantel tortish, yuqori nuqta: to‘g‘ri texnika; ishlayotgan mushaklar lime rangda yonmoqda',
  },
  'chin-up': { src: img('chin-up.webp'), phase: 'Yuqori nuqta', alt: 'Teskari ushlab tortilish, yuqori nuqta: to‘g‘ri texnika; ishlayotgan mushaklar lime rangda yonmoqda' },
  'close-grip-bench': { src: img('close-grip-bench.webp'), phase: 'Pastki nuqta', alt: 'Tor ushlab yotib jim, pastki nuqta: to‘g‘ri texnika; ishlayotgan mushaklar lime rangda yonmoqda' },
  crunch: { src: img('crunch.webp'), phase: 'Yuqori nuqta', alt: 'Pressga qisqarish, yuqori nuqta: to‘g‘ri texnika; ishlayotgan mushaklar lime rangda yonmoqda' },
  'db-bench': { src: img('db-bench.webp'), phase: 'Pastki nuqta', alt: 'Gantel bilan yotib jim, pastki nuqta: to‘g‘ri texnika; ishlayotgan mushaklar lime rangda yonmoqda' },
  'db-curl': { src: img('db-curl.webp'), phase: 'Yuqori nuqta', alt: 'Gantel bilan bitseps, yuqori nuqta: to‘g‘ri texnika; ishlayotgan mushaklar lime rangda yonmoqda' },
  'db-fly': { src: img('db-fly.webp'), phase: 'Pastki nuqta', alt: 'Gantel bilan qo‘l yoyish, pastki nuqta: to‘g‘ri texnika; ishlayotgan mushaklar lime rangda yonmoqda' },
  'db-rdl': { src: img('db-rdl.webp'), phase: 'Pastki nuqta', alt: 'Gantel bilan rumincha tortish, pastki nuqta: to‘g‘ri texnika; ishlayotgan mushaklar lime rangda yonmoqda' },
  'db-row': { src: img('db-row.webp'), phase: 'Yuqori nuqta', alt: 'Bir qo‘llab gantel tortish, yuqori nuqta: to‘g‘ri texnika; ishlayotgan mushaklar lime rangda yonmoqda' },
  'db-shoulder-press': { src: img('db-shoulder-press.webp'), phase: 'Boshlang‘ich holat', alt: 'O‘tirib gantel jimi, boshlang‘ich holat: to‘g‘ri texnika; ishlayotgan mushaklar lime rangda yonmoqda' },
  'db-shrug': { src: img('db-shrug.webp'), phase: 'Yuqori nuqta', alt: 'Gantel bilan yelka qisish, yuqori nuqta: to‘g‘ri texnika; ishlayotgan mushaklar lime rangda yonmoqda' },
  'dead-bug': { src: img('dead-bug.webp'), phase: 'Cho‘zilgan holat', alt: '«O‘lik qo‘ng‘iz», cho‘zilgan holat: to‘g‘ri texnika; ishlayotgan mushaklar lime rangda yonmoqda' },
  deadlift: { src: img('deadlift.webp'), phase: 'Boshlang‘ich holat', alt: 'O‘lik tortish, boshlang‘ich holat: to‘g‘ri texnika; ishlayotgan mushaklar lime rangda yonmoqda' },
  dips: { src: img('dips.webp'), phase: 'Boshlang‘ich holat', alt: 'Brusyada qo‘l bukish, boshlang‘ich holat: to‘g‘ri texnika; ishlayotgan mushaklar lime rangda yonmoqda' },
  'face-pull': { src: img('face-pull.webp'), phase: 'Qisqargan holat', alt: 'Arqonni yuzga tortish, qisqargan holat: to‘g‘ri texnika; ishlayotgan mushaklar lime rangda yonmoqda' },
  'front-squat': { src: img('front-squat.webp'), phase: 'Pastki nuqta', alt: 'Old o‘tirish, pastki nuqta: to‘g‘ri texnika; ishlayotgan mushaklar lime rangda yonmoqda' },
  'glute-bridge': { src: img('glute-bridge.webp'), phase: 'Yuqori nuqta', alt: 'Ko‘prikcha, yuqori nuqta: to‘g‘ri texnika; ishlayotgan mushaklar lime rangda yonmoqda' },
  'goblet-squat': { src: img('goblet-squat.webp'), phase: 'Pastki nuqta', alt: 'Gantel bilan «kubok» o‘tirish, pastki nuqta: to‘g‘ri texnika; ishlayotgan mushaklar lime rangda yonmoqda' },
  'hack-squat': { src: img('hack-squat.webp'), phase: 'Pastki nuqta', alt: 'Gakk-mashinada o‘tirish, pastki nuqta: to‘g‘ri texnika; ishlayotgan mushaklar lime rangda yonmoqda' },
  'hammer-curl': { src: img('hammer-curl.webp'), phase: 'Yuqori nuqta', alt: '«Bolg‘a» bukish, yuqori nuqta: to‘g‘ri texnika; ishlayotgan mushaklar lime rangda yonmoqda' },
  'hanging-leg-raise': { src: img('hanging-leg-raise.webp'), phase: 'Yuqori nuqta', alt: 'Turnikda oyoq ko‘tarish, yuqori nuqta: to‘g‘ri texnika; ishlayotgan mushaklar lime rangda yonmoqda' },
  'hip-thrust': { src: img('hip-thrust.webp'), phase: 'Yuqori nuqta', alt: 'Shtanga bilan tos ko‘tarish, yuqori nuqta: to‘g‘ri texnika; ishlayotgan mushaklar lime rangda yonmoqda' },
  'incline-bench': { src: img('incline-bench.webp'), phase: 'Pastki nuqta', alt: 'Qiya skameykada shtanga jimi, pastki nuqta: to‘g‘ri texnika; ishlayotgan mushaklar lime rangda yonmoqda' },
  'incline-curl': { src: img('incline-curl.webp'), phase: 'O‘rta holat', alt: 'Qiya skameykada bitseps, o‘rta holat: to‘g‘ri texnika; ishlayotgan mushaklar lime rangda yonmoqda' },
  'incline-db-press': { src: img('incline-db-press.webp'), phase: 'Pastki nuqta', alt: 'Qiya skameykada gantel jimi, pastki nuqta: to‘g‘ri texnika; ishlayotgan mushaklar lime rangda yonmoqda' },
  'inverted-row': { src: img('inverted-row.webp'), phase: 'Yuqori nuqta', alt: 'Avstraliyacha tortilish, yuqori nuqta: to‘g‘ri texnika; ishlayotgan mushaklar lime rangda yonmoqda' },
  'kb-swing': { src: img('kb-swing.webp'), phase: 'Yuqori nuqta', alt: 'Girya silkitish, yuqori nuqta: to‘g‘ri texnika; ishlayotgan mushaklar lime rangda yonmoqda' },
  'lat-pulldown': { src: img('lat-pulldown.webp'), phase: 'Qisqargan holat', alt: 'Yuqori blokni ko‘krakka tortish, qisqargan holat: to‘g‘ri texnika; ishlayotgan mushaklar lime rangda yonmoqda' },
  'lateral-raise': { src: img('lateral-raise.webp'), phase: 'Yuqori nuqta', alt: 'Gantelni yonga ko‘tarish, yuqori nuqta: to‘g‘ri texnika; ishlayotgan mushaklar lime rangda yonmoqda' },
  'leg-curl': { src: img('leg-curl.webp'), phase: 'Qisqargan holat', alt: 'Oyoq bukish trenajyori, qisqargan holat: to‘g‘ri texnika; ishlayotgan mushaklar lime rangda yonmoqda' },
  'leg-extension': { src: img('leg-extension.webp'), phase: 'Yuqori nuqta', alt: 'Oyoq yozish trenajyori, yuqori nuqta: to‘g‘ri texnika; ishlayotgan mushaklar lime rangda yonmoqda' },
  'leg-press': { src: img('leg-press.webp'), phase: 'Pastki nuqta', alt: 'Oyoq press, pastki nuqta: to‘g‘ri texnika; ishlayotgan mushaklar lime rangda yonmoqda' },
  'machine-chest-press': {
    src: img('machine-chest-press.webp'),
    phase: 'Boshlang‘ich holat',
    alt: 'Ko‘krak press trenajyori, boshlang‘ich holat: to‘g‘ri texnika; ishlayotgan mushaklar lime rangda yonmoqda',
  },
  'machine-shoulder-press': {
    src: img('machine-shoulder-press.webp'),
    phase: 'Boshlang‘ich holat',
    alt: 'Yelka press trenajyori, boshlang‘ich holat: to‘g‘ri texnika; ishlayotgan mushaklar lime rangda yonmoqda',
  },
  ohp: { src: img('ohp.webp'), phase: 'Yuqori nuqta', alt: 'Turib shtanga jimi, yuqori nuqta: to‘g‘ri texnika; ishlayotgan mushaklar lime rangda yonmoqda' },
  'overhead-extension': { src: img('overhead-extension.webp'), phase: 'Pastki nuqta', alt: 'Bosh ortidan triseps, pastki nuqta: to‘g‘ri texnika; ishlayotgan mushaklar lime rangda yonmoqda' },
  'pec-deck': { src: img('pec-deck.webp'), phase: 'Boshlang‘ich holat', alt: 'Batterflay trenajyori, boshlang‘ich holat: to‘g‘ri texnika; ishlayotgan mushaklar lime rangda yonmoqda' },
  'pike-push-up': { src: img('pike-push-up.webp'), phase: 'Pastki nuqta', alt: 'Pike otjimaniya, pastki nuqta: to‘g‘ri texnika; ishlayotgan mushaklar lime rangda yonmoqda' },
  plank: { src: img('plank.webp'), phase: 'Ushlab turish', alt: 'Planka, ushlab turish: to‘g‘ri texnika; ishlayotgan mushaklar lime rangda yonmoqda' },
  'pull-up': { src: img('pull-up.webp'), phase: 'Yuqori nuqta', alt: 'Turnikda tortilish, yuqori nuqta: to‘g‘ri texnika; ishlayotgan mushaklar lime rangda yonmoqda' },
  'push-up': { src: img('push-up.webp'), phase: 'Pastki nuqta', alt: 'Otjimaniya, pastki nuqta: to‘g‘ri texnika; ishlayotgan mushaklar lime rangda yonmoqda' },
  pushdown: { src: img('pushdown.webp'), phase: 'Pastki nuqta', alt: 'Blokda triseps, pastki nuqta: to‘g‘ri texnika; ishlayotgan mushaklar lime rangda yonmoqda' },
  rdl: { src: img('rdl.webp'), phase: 'Pastki nuqta', alt: 'Rumincha o‘lik tortish, pastki nuqta: to‘g‘ri texnika; ishlayotgan mushaklar lime rangda yonmoqda' },
  'reverse-fly': { src: img('reverse-fly.webp'), phase: 'Qisqargan holat', alt: 'Lentani yoyish, qisqargan holat: to‘g‘ri texnika; ishlayotgan mushaklar lime rangda yonmoqda' },
  'skull-crusher': { src: img('skull-crusher.webp'), phase: 'Pastki nuqta', alt: 'Fransuzcha jim, pastki nuqta: to‘g‘ri texnika; ishlayotgan mushaklar lime rangda yonmoqda' },
  'smith-squat': { src: img('smith-squat.webp'), phase: 'Pastki nuqta', alt: 'Smit mashinasida o‘tirish, pastki nuqta: to‘g‘ri texnika; ishlayotgan mushaklar lime rangda yonmoqda' },
  'split-squat': { src: img('split-squat.webp'), phase: 'Pastki nuqta', alt: 'Gantel bilan split-o‘tirish, pastki nuqta: to‘g‘ri texnika; ishlayotgan mushaklar lime rangda yonmoqda' },
  'step-up': { src: img('step-up.webp'), phase: 'Ko‘tarilish', alt: 'Platformaga chiqish, ko‘tarilish: to‘g‘ri texnika; ishlayotgan mushaklar lime rangda yonmoqda' },
  // </auto>
};
