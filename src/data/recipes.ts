// Sog‘lom retseptlar: o‘zbek oshxonasiga yaqin, oqsilga boy, oddiy mahsulotlardan.
// Kaloriya va makrolar masalliqlardan hisoblanadi (1 porsiya): xom mahsulotlar — USDA FoodData Central,
// qolganlari — ovqat kundaligi bazasidan (foods.ts). Shuning uchun kundalikdagi raqamlar bilan bir xil.
import { FOOD_MAP, portion, type FoodItem } from './foods';

export type MealSlot = 0 | 1 | 2 | 3;

/** Retseptlar uchun xom mahsulotlar (100 g) — kundalik qidiruvida ko‘rinmaydi */
const RAW: Record<string, { name: string; kcal: number; p: number; f: number; c: number; meat?: boolean }> = {
  'r-chicken': { name: 'Tovuq ko‘kragi', kcal: 120, p: 22.5, f: 2.6, c: 0, meat: true },
  'r-chicken-thigh': { name: 'Tovuq soni, terisiz', kcal: 121, p: 19.7, f: 4.1, c: 0, meat: true },
  'r-beef': { name: 'Mol go‘shti, yog‘siz', kcal: 140, p: 22, f: 5.5, c: 0, meat: true },
  'r-mince': { name: 'Qiyma (mol, 10%)', kcal: 176, p: 20, f: 10, c: 0, meat: true },
  'r-fish': { name: 'Oq baliq filesi', kcal: 85, p: 18, f: 1, c: 0, meat: true },
  'r-rice': { name: 'Guruch', kcal: 365, p: 7.1, f: 0.7, c: 80 },
  'r-buckwheat': { name: 'Grechka', kcal: 343, p: 13.3, f: 3.4, c: 71.5 },
  'r-pasta': { name: 'Makaron (yoki lag‘mon cho‘zmasi)', kcal: 371, p: 13, f: 1.5, c: 75 },
  'r-lentil': { name: 'Qizil yasmiq', kcal: 352, p: 24.6, f: 1.1, c: 63 },
  'r-mung': { name: 'Mosh', kcal: 347, p: 23.9, f: 1.2, c: 62.6 },
  'r-potato': { name: 'Kartoshka', kcal: 77, p: 2, f: 0.1, c: 17.5 },
  onion: { name: 'Piyoz', kcal: 40, p: 1.1, f: 0.1, c: 9.3 },
  pepper: { name: 'Bulg‘or qalampiri', kcal: 31, p: 1, f: 0.3, c: 6 },
  cabbage: { name: 'Karam', kcal: 25, p: 1.3, f: 0.1, c: 5.8 },
  zucchini: { name: 'Qovoqcha', kcal: 17, p: 1.2, f: 0.3, c: 3.1 },
  eggplant: { name: 'Baqlajon', kcal: 25, p: 1, f: 0.2, c: 5.9 },
  spinach: { name: 'Ismaloq', kcal: 23, p: 2.9, f: 0.4, c: 3.6 },
  greens: { name: 'Ko‘katlar (ukrop, kashnich)', kcal: 36, p: 3, f: 0.8, c: 6.3 },
  lemon: { name: 'Limon sharbati', kcal: 22, p: 0.4, f: 0.2, c: 6.9 },
  garlic: { name: 'Sarimsoq', kcal: 149, p: 6.4, f: 0.5, c: 33 },
};

/** Masalliq: hisobga kiradigani (id, 1 porsiyaga gramm) yoki faqat matn (tuz, ziravorlar) */
type Ing = { id: string; g: number; name?: string; unit?: readonly [string, number]; note?: string } | { text: string };

export interface Recipe {
  id: string;
  name: string;
  icon: string;
  /** qaysi ovqat mahaliga mos: 0 nonushta · 1 tushlik · 2 kechki · 3 tamaddi */
  meals: MealSlot[];
  /** tayyorlash vaqti, daqiqa */
  min: number;
  /** odatda necha kishiga pishiriladi (masalliqlar shunga ko‘paytirib ko‘rsatiladi) */
  people?: number;
  ing: Ing[];
  steps: string[];
  tip?: string;
}

const DONA = (g: number) => ['dona', g] as const;
const ML = ['ml', 1] as const;
const SPOON = ['qoshiq', 0] as const; // choy/osh qoshiq — miqdorga qarab
const SALT: Ing = { text: 'Tuz, qora murch' };

const LIST: Recipe[] = [
  // ——— Nonushta ———
  {
    id: 'oat-tvorog',
    name: 'Tvorogli suli bo‘tqasi',
    icon: '🥣',
    meals: [0],
    min: 10,
    ing: [
      { id: 'oats', g: 60, name: 'Suli yormasi' },
      { id: 'milk', g: 200, name: 'Sut 2.5%', unit: ML },
      { id: 'tvorog-0', g: 100, name: 'Tvorog 0–2%' },
      { id: 'banana', g: 60, name: 'Banan', unit: DONA(120) },
      { text: 'Doljin (ixtiyoriy)' },
    ],
    steps: ['Suli yormasini sutda past olovda 5–7 daqiqa qaynating.', 'Olovdan olib, tvorogni aralashtiring — bo‘tqa kremsimon bo‘ladi.', 'Ustiga banan to‘g‘rab, xohlasangiz doljin seping.'],
    tip: 'Oddiy bo‘tqadan farqi — tvorog oqsilni ikki barobar oshiradi va uzoq to‘q tutadi.',
  },
  {
    id: 'omelet-tomato',
    name: 'Pomidorli omlet',
    icon: '🍳',
    meals: [0, 2],
    min: 10,
    ing: [
      { id: 'egg', g: 165, name: 'Tuxum', unit: DONA(55) },
      { id: 'tomato', g: 120, name: 'Pomidor', unit: DONA(120) },
      { id: 'greens', g: 10 },
      { id: 'oil', g: 5, name: 'O‘simlik yog‘i', unit: SPOON },
      { id: 'bread-rye', g: 30, name: 'Qora non', unit: ['bo‘lak', 30] },
      SALT,
    ],
    steps: ['Pomidorni to‘g‘rab, yog‘da 2 daqiqa qovuring.', 'Tuxumni tuz bilan ko‘pirtirib, ustidan quying.', 'Qopqog‘ini yopib, past olovda 4–5 daqiqa pishiring. Ko‘kat sepib, qora non bilan torting.'],
  },
  {
    id: 'syrniki',
    name: 'Tvorogli sirniki (pechda)',
    icon: '🥞',
    meals: [0, 3],
    min: 25,
    ing: [
      { id: 'tvorog', g: 200, name: 'Tvorog 5%' },
      { id: 'egg', g: 55, name: 'Tuxum', unit: DONA(55) },
      { id: 'oats', g: 30, name: 'Suli yormasi (maydalangan)' },
      { id: 'honey', g: 8, name: 'Asal', unit: SPOON },
      { id: 'oil', g: 3, name: 'Yog‘ (tovaga surtish uchun)', unit: SPOON },
    ],
    steps: [
      'Suli yormasini blenderda unga aylantiring.',
      'Tvorog, tuxum va suli unini aralashtirib, 6 ta kulcha yasang.',
      'Yog‘ surtilgan pergamentda 180°C pechda 20 daqiqa pishiring (yoki tovada har tomonini 3 daqiqadan).',
      'Asal yoki grek yogurti bilan torting.',
    ],
  },
  {
    id: 'greek-bowl',
    name: 'Grek yogurti, olma va yong‘oq',
    icon: '🍎',
    meals: [0, 3],
    min: 5,
    ing: [
      { id: 'yogurt-greek', g: 200, name: 'Grek yogurti' },
      { id: 'apple', g: 100, name: 'Olma', unit: DONA(160) },
      { id: 'walnut', g: 15, name: 'Yong‘oq' },
      { id: 'honey', g: 8, name: 'Asal', unit: SPOON },
    ],
    steps: ['Olmani mayda to‘g‘rang.', 'Yogurtga olma, maydalangan yong‘oq va asal qo‘shing.'],
  },
  {
    id: 'egg-cheese-bread',
    name: 'Tuxum, pishloq va non',
    icon: '🥚',
    meals: [0],
    min: 10,
    ing: [
      { id: 'egg', g: 110, name: 'Tuxum', unit: DONA(55) },
      { id: 'cheese', g: 20, name: 'Pishloq' },
      { id: 'non', g: 60, name: 'Non', unit: ['chorak', 60] },
      { id: 'cucumber', g: 100, name: 'Bodring', unit: DONA(100) },
      { id: 'tomato', g: 120, name: 'Pomidor', unit: DONA(120) },
    ],
    steps: ['Tuxumni 8–9 daqiqa qaynatib, sovuq suvga soling.', 'Pomidor va bodringni to‘g‘rang.', 'Pishloq va chorak non bilan torting, choyni shakarsiz iching.'],
  },
  {
    id: 'lavash-roll',
    name: 'Tuxumli lavash rulet',
    icon: '🌯',
    meals: [0, 3],
    min: 10,
    ing: [
      { id: 'lavash', g: 80, name: 'Lavash', unit: DONA(80) },
      { id: 'egg', g: 110, name: 'Tuxum', unit: DONA(55) },
      { id: 'cheese', g: 20, name: 'Pishloq' },
      { id: 'tomato', g: 60, name: 'Pomidor', unit: DONA(120) },
      { id: 'greens', g: 10 },
      { id: 'oil', g: 3, name: 'O‘simlik yog‘i', unit: SPOON },
    ],
    steps: ['Tuxumni ko‘kat va tuz bilan ko‘pirtirib, tovada yupqa omlet qiling.', 'Lavashga omlet, pishloq va pomidorni qo‘yib, o‘rang.', 'Quruq tovada har tomonini 1 daqiqadan qizdiring.'],
  },
  {
    id: 'protein-shake',
    name: 'Banan-protein kokteyli',
    icon: '🥤',
    meals: [0, 3],
    min: 3,
    ing: [
      { id: 'milk', g: 300, name: 'Sut 2.5%', unit: ML },
      { id: 'banana', g: 120, name: 'Banan', unit: DONA(120) },
      { id: 'whey', g: 30, name: 'Protein kukuni', unit: ['o‘lchov', 30] },
      { id: 'oats', g: 20, name: 'Suli yormasi' },
    ],
    steps: ['Hammasini blenderda 30 soniya aylantiring.', 'Mashg‘ulotdan keyin yoki shoshilinch nonushta o‘rniga iching.'],
    tip: 'Protein kukuni bo‘lmasa — 150 g tvorog qo‘shing: oqsil deyarli o‘sha.',
  },

  // ——— Tushlik ———
  {
    id: 'chicken-buckwheat',
    name: 'Tovuq ko‘kragi va grechka',
    icon: '🍗',
    meals: [1, 2],
    min: 25,
    ing: [
      { id: 'r-chicken', g: 180, note: 'xom' },
      { id: 'r-buckwheat', g: 70, note: 'quruq' },
      { id: 'salad', g: 200, name: 'Pomidor-bodring salati' },
      { id: 'oil', g: 7, name: 'O‘simlik yog‘i', unit: SPOON },
      { text: 'Sarimsoq, tuz, murch' },
    ],
    steps: [
      'Grechkani yuvib, 1:2 nisbatda suvda 15 daqiqa pishiring.',
      'Tovuqni tuz, murch va sarimsoq bilan ishqalab, tovada har tomonini 5–6 daqiqadan qovuring (ichi oq bo‘lguncha).',
      'Pomidor-bodring salati bilan torting.',
    ],
  },
  {
    id: 'light-plov',
    name: 'Tovuqli yengil osh',
    icon: '🍚',
    meals: [1],
    min: 50,
    people: 4,
    ing: [
      { id: 'r-rice', g: 70, name: 'Guruch (lazer, devzira)', note: 'quruq' },
      { id: 'r-chicken', g: 150, note: 'xom' },
      { id: 'carrot', g: 120, name: 'Sabzi' },
      { id: 'onion', g: 40 },
      { id: 'chickpea', g: 40, name: 'No‘xat', note: 'pishgan' },
      { id: 'oil', g: 10, name: 'O‘simlik yog‘i', unit: SPOON },
      { text: 'Zira, tuz' },
    ],
    steps: [
      'Qozonda yog‘ni qizdirib, piyozni oltin rangga qadar qovuring.',
      'Tovuqni bo‘laklab qo‘shing, 5 daqiqa qovuring; somoncha qilingan sabzini solib, 7–8 daqiqa dimlang.',
      'No‘xat, zira va tuz qo‘shing, ustidan 2 barmoq suv quyib, 10 daqiqa qaynating (zirvak).',
      'Yuvilgan guruchni tekis yoying, suv guruch ustidan 1 barmoq chiqsin. Suv singgach, qopqoqni yopib, past olovda 20 daqiqa dimlang.',
    ],
    tip: 'Oddiy osh likopchasi (~350 g) — ~800 kkal va 24 g oqsil. Bu porsiya — kam yog‘ va yog‘siz go‘sht hisobiga oqsil deyarli 2 barobar ko‘p.',
  },
  {
    id: 'lentil-soup',
    name: 'Yasmiqli sho‘rva',
    icon: '🍲',
    meals: [1, 2],
    min: 40,
    people: 4,
    ing: [
      { id: 'r-lentil', g: 60, note: 'quruq' },
      { id: 'r-beef', g: 80, note: 'xom' },
      { id: 'r-potato', g: 100 },
      { id: 'carrot', g: 60, name: 'Sabzi' },
      { id: 'onion', g: 40 },
      { id: 'tomato', g: 60, name: 'Pomidor' },
      { id: 'oil', g: 5, name: 'O‘simlik yog‘i', unit: SPOON },
      { text: 'Zira, tuz, ko‘kat' },
    ],
    steps: [
      'Go‘shtni mayda to‘g‘rab, piyoz bilan yog‘da qovuring.',
      'Sabzi va pomidorni qo‘shib, 5 daqiqa dimlang.',
      'Yuvilgan yasmiq va suv qo‘shing (4 kishiga ~1 L), 20 daqiqa qaynating.',
      'Kubik qilingan kartoshkani solib, yana 15 daqiqa pishiring. Zira va ko‘kat bilan torting.',
    ],
  },
  {
    id: 'mastava-light',
    name: 'Yengil mastava',
    icon: '🥣',
    meals: [1, 2],
    min: 45,
    people: 4,
    ing: [
      { id: 'r-rice', g: 40, note: 'quruq' },
      { id: 'r-beef', g: 100, note: 'xom' },
      { id: 'r-potato', g: 80 },
      { id: 'carrot', g: 50, name: 'Sabzi' },
      { id: 'onion', g: 40 },
      { id: 'tomato', g: 60, name: 'Pomidor' },
      { id: 'oil', g: 7, name: 'O‘simlik yog‘i', unit: SPOON },
      { id: 'qatiq', g: 50, name: 'Qatiq (ustiga)', unit: ML },
    ],
    steps: [
      'Go‘sht va piyozni yog‘da qovuring, sabzi va pomidor qo‘shib, 5 daqiqa dimlang.',
      'Suv quying (4 kishiga ~1.2 L), qaynagach kartoshka va yuvilgan guruchni soling.',
      'Past olovda 20 daqiqa pishiring. Qatiq va ko‘kat bilan torting.',
    ],
  },
  {
    id: 'dimlama',
    name: 'Mol go‘shtli dimlama',
    icon: '🥘',
    meals: [1, 2],
    min: 60,
    people: 4,
    ing: [
      { id: 'r-beef', g: 150, note: 'xom' },
      { id: 'r-potato', g: 150 },
      { id: 'cabbage', g: 150 },
      { id: 'carrot', g: 60, name: 'Sabzi' },
      { id: 'onion', g: 50 },
      { id: 'pepper', g: 60 },
      { id: 'tomato', g: 80, name: 'Pomidor' },
      { id: 'oil', g: 5, name: 'O‘simlik yog‘i', unit: SPOON },
      { text: 'Tuz, zira, qalampir' },
    ],
    steps: [
      'Qozon tagiga yog‘ surtib, go‘shtni bir qavat qilib tering.',
      'Ustiga piyoz, sabzi, kartoshka, qalampir, pomidor va oxirida karamni qatlab qo‘ying (har qatlamga ozgina tuz va ziravor).',
      'Suv qo‘shmang — sabzavotlar o‘z sharbatini beradi. Qopqog‘ini zich yopib, past olovda 50–60 daqiqa dimlang.',
    ],
  },
  {
    id: 'chicken-lagman',
    name: 'Tovuqli qovurma lag‘mon (yengil)',
    icon: '🍜',
    meals: [1],
    min: 30,
    ing: [
      { id: 'r-pasta', g: 80, note: 'quruq' },
      { id: 'r-chicken', g: 150, note: 'xom' },
      { id: 'pepper', g: 80 },
      { id: 'onion', g: 40 },
      { id: 'tomato', g: 80, name: 'Pomidor' },
      { id: 'garlic', g: 5 },
      { id: 'oil', g: 8, name: 'O‘simlik yog‘i', unit: SPOON },
      SALT,
    ],
    steps: [
      'Makaronni tuzli suvda pishirib, suzib oling.',
      'Tovuqni yupqa to‘g‘rab, yog‘da 5 daqiqa qovuring.',
      'Piyoz, qalampir, sarimsoq va pomidorni qo‘shib, yana 5 daqiqa qovuring.',
      'Makaronni qo‘shib aralashtiring va 2 daqiqa birga qizdiring.',
    ],
  },
  {
    id: 'moshxorda-light',
    name: 'Go‘shtli moshxo‘rda',
    icon: '🍲',
    meals: [1, 2],
    min: 50,
    people: 4,
    ing: [
      { id: 'r-mung', g: 50, note: 'quruq' },
      { id: 'r-rice', g: 30, note: 'quruq' },
      { id: 'r-beef', g: 80, note: 'xom' },
      { id: 'r-potato', g: 80 },
      { id: 'carrot', g: 50, name: 'Sabzi' },
      { id: 'onion', g: 40 },
      { id: 'oil', g: 5, name: 'O‘simlik yog‘i', unit: SPOON },
      { id: 'qatiq', g: 50, name: 'Qatiq (ustiga)', unit: ML },
    ],
    steps: [
      'Moshni yuvib, suvda (4 kishiga ~1 L) 20 daqiqa qaynating.',
      'Alohida go‘sht, piyoz va sabzini yog‘da qovurib, moshga qo‘shing.',
      'Kartoshka va guruchni solib, yana 20 daqiqa pishiring. Qatiq bilan torting.',
    ],
  },
  {
    id: 'beans-chicken-salad',
    name: 'Loviya va tovuqli salat',
    icon: '🥗',
    meals: [1, 2],
    min: 20,
    ing: [
      { id: 'beans', g: 150, name: 'Loviya', note: 'pishgan' },
      { id: 'r-chicken', g: 120, note: 'xom' },
      { id: 'cucumber', g: 100, name: 'Bodring', unit: DONA(100) },
      { id: 'tomato', g: 100, name: 'Pomidor' },
      { id: 'greens', g: 10 },
      { id: 'oil', g: 7, name: 'O‘simlik yog‘i', unit: SPOON },
      { id: 'lemon', g: 15 },
      SALT,
    ],
    steps: ['Tovuqni qaynatib yoki qovurib, tolalarga ajrating.', 'Bodring, pomidor va ko‘katni to‘g‘rang.', 'Loviya va tovuqni qo‘shib, yog‘, limon sharbati va tuz bilan aralashtiring.'],
  },

  // ——— Kechki ovqat ———
  {
    id: 'baked-fish',
    name: 'Pechda baliq va sabzavotlar',
    icon: '🐟',
    meals: [1, 2],
    min: 35,
    ing: [
      { id: 'r-fish', g: 200, note: 'xom' },
      { id: 'r-potato', g: 150 },
      { id: 'zucchini', g: 150 },
      { id: 'pepper', g: 80 },
      { id: 'oil', g: 7, name: 'O‘simlik yog‘i', unit: SPOON },
      { id: 'lemon', g: 15 },
      SALT,
    ],
    steps: [
      'Kartoshkani yupqa doira, qovoqcha va qalampirni bo‘lak qilib to‘g‘rang; yog‘ va tuz bilan aralashtirib, 200°C pechda 15 daqiqa pishiring.',
      'Baliqqa tuz, murch va limon sharbati surting.',
      'Sabzavotlar ustiga baliqni qo‘yib, yana 15–18 daqiqa pishiring.',
    ],
  },
  {
    id: 'oven-kebab',
    name: 'Pechda tovuq kabob va achchiq-chuchuk',
    icon: '🍢',
    meals: [1, 2],
    min: 40,
    ing: [
      { id: 'r-chicken-thigh', g: 200, note: 'xom' },
      { id: 'qatiq', g: 50, name: 'Qatiq (marinad)', unit: ML },
      { id: 'achchiq-chuchuk', g: 150, name: 'Achchiq-chuchuk' },
      { id: 'non', g: 60, name: 'Non', unit: ['chorak', 60] },
      { text: 'Sarimsoq, zira, tuz, qalampir' },
    ],
    steps: [
      'Tovuqni bo‘laklab, qatiq, sarimsoq, zira va tuz bilan kamida 30 daqiqa marinadlang.',
      'Sixlarga terib (yoki pergamentga yoyib), 220°C pechda 20–25 daqiqa pishiring.',
      'Achchiq-chuchuk va chorak non bilan torting.',
    ],
    tip: 'Ko‘mirdagi qo‘y shashlikdan farqi — yog‘ 3 barobar kam, oqsil o‘sha.',
  },
  {
    id: 'stuffed-zucchini',
    name: 'Qiymali qovoqcha (pechda)',
    icon: '🫑',
    meals: [2],
    min: 45,
    ing: [
      { id: 'zucchini', g: 300 },
      { id: 'r-mince', g: 150, note: 'xom' },
      { id: 'r-rice', g: 20, note: 'quruq' },
      { id: 'onion', g: 40 },
      { id: 'tomato', g: 80, name: 'Pomidor' },
      { id: 'cheese', g: 20, name: 'Pishloq' },
      SALT,
    ],
    steps: [
      'Qovoqchani uzunasiga kesib, o‘rtasini qoshiq bilan oling.',
      'Qiyma, maydalangan piyoz, yuvilgan guruch va tuzni aralashtirib, qovoqchaga to‘ldiring.',
      'Ustiga pomidor bo‘laklari va qirg‘ichdan o‘tgan pishloq seping.',
      'Folga bilan yopib 190°C pechda 30 daqiqa, folgasiz yana 10 daqiqa pishiring.',
    ],
  },
  {
    id: 'chicken-stirfry',
    name: 'Tovuq va sabzavot qovurmasi',
    icon: '🥡',
    meals: [1, 2],
    min: 25,
    ing: [
      { id: 'r-chicken', g: 180, note: 'xom' },
      { id: 'pepper', g: 100 },
      { id: 'zucchini', g: 100 },
      { id: 'carrot', g: 50, name: 'Sabzi' },
      { id: 'onion', g: 40 },
      { id: 'r-rice', g: 50, note: 'quruq' },
      { id: 'garlic', g: 5 },
      { id: 'oil', g: 8, name: 'O‘simlik yog‘i', unit: SPOON },
      SALT,
    ],
    steps: [
      'Guruchni pishirib qo‘ying.',
      'Tovuqni yupqa to‘g‘rab, juda qizigan tovada 4–5 daqiqa qovuring va olib qo‘ying.',
      'Sabzavotlarni somoncha qilib to‘g‘rab, 4 daqiqa qovuring (qarsildoq qolsin).',
      'Tovuqni qaytarib, sarimsoq va tuz qo‘shing; guruch bilan torting.',
    ],
  },
  {
    id: 'herb-tvorog',
    name: 'Ko‘katli tvorog va bodring',
    icon: '🥒',
    meals: [2, 3],
    min: 5,
    ing: [
      { id: 'tvorog-0', g: 200, name: 'Tvorog 0–2%' },
      { id: 'cucumber', g: 150, name: 'Bodring', unit: DONA(100) },
      { id: 'greens', g: 15 },
      { id: 'smetana', g: 20, name: 'Smetana', unit: SPOON },
      { id: 'garlic', g: 3 },
      { id: 'bread-rye', g: 30, name: 'Qora non', unit: ['bo‘lak', 30] },
    ],
    steps: ['Ko‘kat va sarimsoqni mayda to‘g‘rang.', 'Tvorog, smetana va ozgina tuz bilan aralashtiring.', 'Bodring va bir bo‘lak qora non bilan torting.'],
    tip: 'Kechki uchun qulay: oqsil ko‘p, kaloriya kam, tayyorlash — 5 daqiqa.',
  },
  {
    id: 'beef-buckwheat',
    name: 'Go‘shtli grechka',
    icon: '🍖',
    meals: [1, 2],
    min: 40,
    people: 2,
    ing: [
      { id: 'r-buckwheat', g: 70, note: 'quruq' },
      { id: 'r-beef', g: 150, note: 'xom' },
      { id: 'onion', g: 40 },
      { id: 'carrot', g: 50, name: 'Sabzi' },
      { id: 'tomato', g: 60, name: 'Pomidor' },
      { id: 'oil', g: 7, name: 'O‘simlik yog‘i', unit: SPOON },
      SALT,
    ],
    steps: [
      'Go‘shtni mayda to‘g‘rab, piyoz va sabzi bilan yog‘da qovuring.',
      'Pomidor qo‘shib, 5 daqiqa dimlang.',
      'Yuvilgan grechka va 2 barobar suv qo‘shib, qopqoq ostida past olovda 20 daqiqa pishiring.',
    ],
  },
  {
    id: 'tuna-salad',
    name: 'Tunets va tuxumli salat',
    icon: '🥗',
    meals: [1, 2],
    min: 15,
    ing: [
      { id: 'tuna', g: 130, name: 'Tunets (o‘z sharbatida)', unit: ['banka', 130] },
      { id: 'egg', g: 55, name: 'Tuxum', unit: DONA(55) },
      { id: 'beans', g: 80, name: 'Loviya', note: 'pishgan' },
      { id: 'cucumber', g: 100, name: 'Bodring', unit: DONA(100) },
      { id: 'tomato', g: 100, name: 'Pomidor' },
      { id: 'oil', g: 7, name: 'O‘simlik yog‘i', unit: SPOON },
      { id: 'lemon', g: 10 },
    ],
    steps: ['Tuxumni qaynatib, to‘rtga bo‘ling.', 'Bodring va pomidorni to‘g‘rang.', 'Tunets (suvini to‘kib), loviya va sabzavotlarni yog‘, limon sharbati va tuz bilan aralashtiring; ustiga tuxumni qo‘ying.'],
  },

  // ——— Go‘shtsiz ———
  {
    id: 'lentil-patties',
    name: 'Yasmiq kotletlari',
    icon: '🧆',
    meals: [1, 2],
    min: 40,
    ing: [
      { id: 'r-lentil', g: 80, note: 'quruq' },
      { id: 'egg', g: 55, name: 'Tuxum', unit: DONA(55) },
      { id: 'onion', g: 40 },
      { id: 'oats', g: 20, name: 'Suli yormasi' },
      { id: 'oil', g: 7, name: 'O‘simlik yog‘i', unit: SPOON },
      { id: 'yogurt-greek', g: 100, name: 'Grek yogurti (sous)' },
      { text: 'Zira, tuz, sarimsoq' },
    ],
    steps: [
      'Yasmiqni 15–20 daqiqa qaynatib, suvini to‘kib, sovuting.',
      'Maydalangan piyoz, tuxum, suli yormasi, zira va tuz bilan aralashtirib, ezing.',
      '6 ta kotlet yasab, ozgina yog‘da har tomonini 4 daqiqadan qovuring.',
      'Sarimsoqli grek yogurti bilan torting.',
    ],
  },
  {
    id: 'veg-frittata',
    name: 'Pechda sabzavotli omlet',
    icon: '🥬',
    meals: [0, 2],
    min: 25,
    ing: [
      { id: 'egg', g: 165, name: 'Tuxum', unit: DONA(55) },
      { id: 'spinach', g: 60 },
      { id: 'pepper', g: 80 },
      { id: 'cheese', g: 20, name: 'Pishloq' },
      { id: 'milk', g: 50, name: 'Sut', unit: ML },
      { id: 'oil', g: 3, name: 'Yog‘ (qolipga)', unit: SPOON },
    ],
    steps: ['Ismaloq va qalampirni to‘g‘rab, yog‘ surtilgan qolipga soling.', 'Tuxum, sut va tuzni ko‘pirtirib, ustidan quying, pishloq seping.', '180°C pechda 18–20 daqiqa pishiring.'],
  },
  {
    id: 'mung-salad',
    name: 'Moshli salat',
    icon: '🫛',
    meals: [1, 3],
    min: 10,
    ing: [
      { id: 'mung', g: 150, name: 'Mosh', note: 'pishgan' },
      { id: 'tomato', g: 100, name: 'Pomidor' },
      { id: 'cucumber', g: 100, name: 'Bodring', unit: DONA(100) },
      { id: 'onion', g: 20 },
      { id: 'greens', g: 10 },
      { id: 'egg', g: 55, name: 'Tuxum', unit: DONA(55) },
      { id: 'oil', g: 7, name: 'O‘simlik yog‘i', unit: SPOON },
    ],
    steps: ['Moshni oldindan pishirib sovuting (kechagisi ham bo‘ladi).', 'Sabzavotlar va ko‘katni to‘g‘rang.', 'Yog‘, tuz va murch bilan aralashtirib, ustiga qaynatilgan tuxum qo‘ying.'],
  },
  {
    id: 'chickpea-eggplant',
    name: 'No‘xatli baqlajon ragu',
    icon: '🍆',
    meals: [1, 2],
    min: 35,
    ing: [
      { id: 'chickpea', g: 150, name: 'No‘xat', note: 'pishgan' },
      { id: 'eggplant', g: 150 },
      { id: 'tomato', g: 120, name: 'Pomidor' },
      { id: 'onion', g: 40 },
      { id: 'pepper', g: 60 },
      { id: 'oil', g: 8, name: 'O‘simlik yog‘i', unit: SPOON },
      { id: 'yogurt-greek', g: 100, name: 'Grek yogurti (ustiga)' },
    ],
    steps: [
      'Baqlajonni kubik qilib to‘g‘rang, tuzlab 10 daqiqa qo‘ying va siqib oling.',
      'Piyoz, qalampir va baqlajonni yog‘da 8 daqiqa qovuring.',
      'Pomidor va pishgan no‘xatni qo‘shib, 15 daqiqa dimlang. Grek yogurti va ko‘kat bilan torting.',
    ],
  },

  {
    id: 'lentil-soup-veg',
    name: 'Go‘shtsiz yasmiq sho‘rva',
    icon: '🥕',
    meals: [1, 2],
    min: 35,
    people: 4,
    ing: [
      { id: 'r-lentil', g: 80, note: 'quruq' },
      { id: 'r-potato', g: 100 },
      { id: 'carrot', g: 60, name: 'Sabzi' },
      { id: 'onion', g: 40 },
      { id: 'tomato', g: 60, name: 'Pomidor' },
      { id: 'oil', g: 7, name: 'O‘simlik yog‘i', unit: SPOON },
      { id: 'lemon', g: 10 },
      { text: 'Zira, tuz, ko‘kat' },
    ],
    steps: [
      'Piyoz va sabzini yog‘da 5 daqiqa qovuring, pomidor qo‘shing.',
      'Yuvilgan qizil yasmiq, kubik qilingan kartoshka va suv (4 kishiga ~1.2 L) qo‘shing.',
      '20–25 daqiqa past olovda pishiring — yasmiq erib, sho‘rva quyuqlashadi. Limon sharbati va zira bilan torting.',
    ],
  },
  {
    id: 'moshkichiri',
    name: 'Moshkichiri (tuxum bilan)',
    icon: '🍛',
    meals: [1, 2],
    min: 40,
    people: 4,
    ing: [
      { id: 'r-mung', g: 50, note: 'quruq' },
      { id: 'r-rice', g: 40, note: 'quruq' },
      { id: 'onion', g: 40 },
      { id: 'carrot', g: 50, name: 'Sabzi' },
      { id: 'oil', g: 8, name: 'O‘simlik yog‘i', unit: SPOON },
      { id: 'egg', g: 55, name: 'Tuxum (ustiga)', unit: DONA(55) },
      { text: 'Zira, tuz' },
    ],
    steps: [
      'Moshni yuvib, suvda 15 daqiqa qaynating.',
      'Alohida piyoz va sabzini yog‘da qovurib, moshga qo‘shing, yuvilgan guruch va zira soling.',
      'Suv bo‘tqa quyuqligida bo‘lsin; qopqoq ostida past olovda 20 daqiqa pishiring.',
      'Har porsiya ustiga qovurilgan yoki qaynatilgan tuxum qo‘ying.',
    ],
  },

  // ——— Tamaddi va yengil ———
  {
    id: 'qatiq-almond',
    name: 'Qatiq, bodom va olma',
    icon: '🥛',
    meals: [3],
    min: 2,
    ing: [
      { id: 'qatiq', g: 250, name: 'Qatiq / kefir', unit: ML },
      { id: 'almond', g: 15, name: 'Bodom' },
      { id: 'apple', g: 160, name: 'Olma', unit: DONA(160) },
    ],
    steps: ['Bir stakan qatiq, bir hovuchning yarmi bodom va bitta olma — tayyorlash shart emas.'],
  },
  {
    id: 'tvorog-honey',
    name: 'Tvorog, asal va yong‘oq',
    icon: '🍯',
    meals: [3, 0],
    min: 3,
    ing: [
      { id: 'tvorog', g: 150, name: 'Tvorog 5%' },
      { id: 'honey', g: 8, name: 'Asal', unit: SPOON },
      { id: 'walnut', g: 10, name: 'Yong‘oq' },
    ],
    steps: ['Tvorogga asal va maydalangan yong‘oq qo‘shib aralashtiring.'],
  },
  {
    id: 'suzma-toast',
    name: 'Suzmali qora non va bodring',
    icon: '🥪',
    meals: [3, 0],
    min: 5,
    ing: [
      { id: 'bread-rye', g: 60, name: 'Qora non', unit: ['bo‘lak', 30] },
      { id: 'suzma', g: 60, name: 'Suzma' },
      { id: 'cucumber', g: 100, name: 'Bodring', unit: DONA(100) },
      { id: 'greens', g: 5 },
    ],
    steps: ['Nonga suzma surting, ustiga yupqa bodring va ko‘kat qo‘ying.'],
  },
  {
    id: 'eggs-cucumber',
    name: 'Qaynatilgan tuxum va bodring',
    icon: '🥚',
    meals: [3],
    min: 10,
    ing: [
      { id: 'egg', g: 110, name: 'Tuxum', unit: DONA(55) },
      { id: 'cucumber', g: 150, name: 'Bodring', unit: DONA(100) },
      SALT,
    ],
    steps: ['Tuxumni 9 daqiqa qaynatib, bodring bilan yeng.'],
  },
  {
    id: 'chalop',
    name: 'Chalop (sovuq qatiqli sho‘rva)',
    icon: '🥒',
    meals: [3, 2],
    min: 5,
    ing: [
      { id: 'qatiq', g: 150, name: 'Qatiq', unit: ML },
      { id: 'cucumber', g: 150, name: 'Bodring', unit: DONA(100) },
      { id: 'greens', g: 10 },
      { text: 'Sovuq suv (150 ml), tuz' },
    ],
    steps: ['Bodring va ko‘katni mayda to‘g‘rang.', 'Qatiqni sovuq suv bilan suyultirib, tuz va sabzavotlarni qo‘shing.'],
    tip: 'Kaloriya tugagan kechqurun ochlikni bosish uchun eng yengil variant.',
  },
  {
    id: 'egg-white-omelet',
    name: 'Tuxum oqidan yengil omlet',
    icon: '🍳',
    meals: [2, 3],
    min: 8,
    ing: [
      { id: 'egg-white', g: 132, name: 'Tuxum oqi', unit: ['tuxumdan', 33] },
      { id: 'spinach', g: 50 },
      { id: 'tomato', g: 60, name: 'Pomidor' },
      { id: 'oil', g: 3, name: 'O‘simlik yog‘i', unit: SPOON },
      SALT,
    ],
    steps: ['Ismaloq va pomidorni yog‘da 2 daqiqa qovuring.', 'Tuxum oqini tuz bilan ko‘pirtirib, ustidan quying va qopqoq ostida 3–4 daqiqa pishiring.'],
  },
];

/* ---------------- Hisob-kitob ---------------- */

const DAIRY = new Set(['milk', 'qatiq', 'suzma', 'tvorog', 'tvorog-0', 'yogurt-greek', 'yogurt-sweet', 'cheese', 'brynza', 'qaymoq', 'smetana', 'whey', 'butter', 'ayran']);

function source(id: string) {
  const raw = RAW[id];
  if (raw) return raw;
  const f = FOOD_MAP[id];
  return f ? { name: f.name, kcal: f.kcal, p: f.p, f: f.f, c: f.c, meat: f.cat === 'meat' && !id.startsWith('egg') } : null;
}

export interface RecipeInfo extends Recipe {
  /** 1 porsiya */
  kcal: number;
  p: number;
  f: number;
  c: number;
  /** oqsilga boy (kaloriyaning ≥ 30% yoki ≥ 35 g) */
  protein: boolean;
  quick: boolean;
  meatFree: boolean;
  dairyFree: boolean;
  /** ≤ 250 kkal */
  light: boolean;
}

const r1 = (n: number) => Math.round(n * 10) / 10;

function info(r: Recipe): RecipeInfo {
  let kcal = 0,
    p = 0,
    f = 0,
    c = 0,
    meat = false,
    dairy = false;
  for (const i of r.ing) {
    if (!('id' in i)) continue;
    const s = source(i.id);
    if (!s) throw new Error(`Retsept ${r.id}: noma’lum masalliq ${i.id}`);
    const v = portion(s, i.g);
    kcal += v.kcal;
    p += v.p;
    f += v.f;
    c += v.c;
    meat ||= !!s.meat;
    dairy ||= DAIRY.has(i.id);
  }
  return {
    ...r,
    kcal: Math.round(kcal),
    p: r1(p),
    f: r1(f),
    c: r1(c),
    protein: p * 4 >= kcal * 0.3 || p >= 35,
    quick: r.min <= 15,
    meatFree: !meat,
    dairyFree: !dairy,
    light: kcal <= 250,
  };
}

export const RECIPES: RecipeInfo[] = LIST.map(info);
export const RECIPE_MAP: Record<string, RecipeInfo> = Object.fromEntries(RECIPES.map((r) => [r.id, r]));

/** Kundalikda: retsept — "porsiya" birligidagi taom (100 g ga emas, porsiyaga) */
export const RECIPE_PREFIX = 'rcp-';
export const RECIPE_FOODS: FoodItem[] = RECIPES.map((r) => ({
  id: RECIPE_PREFIX + r.id,
  name: r.name,
  alt: 'retsept',
  cat: 'recipe',
  // 1 porsiya = 100 "birlik": PortionStep porsiyani ko‘paytiradi
  kcal: r.kcal,
  p: r.p,
  f: r.f,
  c: r.c,
  units: [{ name: 'porsiya', g: 100 }],
  noGram: true,
}));

const FRAC: Record<number, string> = { 0.25: '¼', 0.5: '½', 0.75: '¾' };
/** 1.5 → "1½", 0.5 → "½" */
export function fmtQty(n: number): string {
  const whole = Math.floor(n);
  const frac = Math.round((n - whole) * 4) / 4;
  if (frac === 1) return String(whole + 1);
  return frac ? `${whole || ''}${FRAC[frac]}` : String(whole);
}

/** Masalliq qatori: nomi va miqdori (people kishiga) */
export function ingredientLine(i: Ing, people: number): { name: string; amount: string } {
  if (!('id' in i)) return { name: i.text, amount: '' };
  const s = source(i.id);
  const name = i.name ?? s?.name ?? i.id;
  const g = i.g * people;
  const note = i.note ? ` (${i.note})` : '';
  if (i.unit?.[0] === 'qoshiq') {
    // 1 osh qoshiq ≈ 14 g, 1 choy qoshiq ≈ 5 g (yog‘, asal, smetana)
    const big = g >= 12;
    return { name, amount: `${fmtQty(Math.max(0.5, Math.round((g / (big ? 14 : 5)) * 2) / 2))} ${big ? 'osh' : 'choy'} qoshiq` };
  }
  if (i.unit && i.unit[0] === 'ml') return { name, amount: `${Math.round(g / 10) * 10} ml${note}` };
  if (i.unit) {
    const q = Math.max(0.5, Math.round((g / i.unit[1]) * 2) / 2);
    return { name, amount: `${fmtQty(q)} ${i.unit[0]}${note}` };
  }
  return { name, amount: `${g >= 50 ? Math.round(g / 5) * 5 : Math.round(g)} g${note}` };
}
