// Tayyor mashg'ulotlar: uyda (kam jihoz bilan, asosan dumba, son, qorin va qomat) va cho'zilish.
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

export interface Routine {
  id: string;
  kind: 'home' | 'stretch';
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
