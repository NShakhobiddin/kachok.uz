// Dastur generatori: maqsad, tajriba, kunlar, vaqt, jihoz va jarohatlarga qarab haftalik reja tuzadi.
// Asos: ACSM 2026 (har mushak haftasiga 2+ marta), Schoenfeld 2017 / Pelland 2026 (haftalik hajm),
// Refalo 2023 (1–3 takror zaxira), Schoenfeld 2016 (murakkab mashqlarda uzunroq dam).
import { EXERCISES, EXERCISE_MAP } from '../data/exercises';
import { GROUP_ORDER, GROUPS, MUSCLES, WEEKLY_TARGET } from '../data/catalog';
import type { EquipmentId, Exercise, Goal, Level, MuscleGroup, Pattern, PlannedExercise, Profile, Program, WorkoutDay } from '../types';
import { blockWeek, METHOD_INFO, methodMeso, resolveMethod, type ConcreteMethod } from './methods';
import { personalSafety } from './safety';
import { customSplitOf, splitDayTitle, type DaySplit } from './split';

type Role = 'main' | 'secondary' | 'accessory';
interface Slot {
  pattern: Pattern;
  role: Role;
  /** ustuvor mushak uchun (vaqt tejashda oxirgi navbatda qisqaradi) */
  focus?: boolean;
  /** ustuvor mushak uchun ikkinchi mashq — topilmasa, birinchisiga set qo'shiladi */
  extra?: boolean;
  /** o'z taqsimotida guruhning birinchi mashqi: vaqt yoki hajm tejashda olib tashlanmaydi (tanlangan mushak kundan tushib qolmasin) */
  keep?: boolean;
}

/** Darajaga ko'ra bitta mashqdagi maksimal ishchi setlar (boshlovchi — 3) */
export const LEVEL_MAX_SETS: Record<Level, number> = { beginner: 3, intermediate: 4, advanced: 5 };

const s = (pattern: Pattern, role: Role): Slot => ({ pattern, role });

const T = {
  fbA: [s('squat', 'main'), s('hPush', 'main'), s('hPull', 'main'), s('hamIso', 'secondary'), s('lateral', 'accessory'), s('biceps', 'accessory'), s('core', 'accessory')],
  fbB: [s('hinge', 'main'), s('iPush', 'main'), s('vPull', 'main'), s('lunge', 'secondary'), s('triceps', 'accessory'), s('rearDelt', 'accessory'), s('calf', 'accessory')],
  fbC: [s('squat', 'main'), s('vPush', 'main'), s('hPull', 'main'), s('glute', 'secondary'), s('fly', 'accessory'), s('biceps', 'accessory'), s('core', 'accessory')],
  upA: [s('hPush', 'main'), s('hPull', 'main'), s('vPush', 'secondary'), s('vPull', 'secondary'), s('lateral', 'accessory'), s('biceps', 'accessory'), s('triceps', 'accessory')],
  upB: [s('iPush', 'main'), s('vPull', 'main'), s('hPull', 'secondary'), s('fly', 'accessory'), s('rearDelt', 'accessory'), s('triceps', 'accessory'), s('biceps', 'accessory')],
  loA: [s('squat', 'main'), s('hinge', 'secondary'), s('lunge', 'accessory'), s('quadIso', 'accessory'), s('hamIso', 'accessory'), s('calf', 'accessory'), s('core', 'accessory')],
  loB: [s('hinge', 'main'), s('squat', 'secondary'), s('glute', 'secondary'), s('hamIso', 'accessory'), s('quadIso', 'accessory'), s('calf', 'accessory'), s('core', 'accessory')],
  push: [s('hPush', 'main'), s('vPush', 'secondary'), s('iPush', 'secondary'), s('lateral', 'accessory'), s('fly', 'accessory'), s('triceps', 'accessory')],
  pull: [s('vPull', 'main'), s('hPull', 'secondary'), s('hPull', 'accessory'), s('rearDelt', 'accessory'), s('biceps', 'accessory'), s('traps', 'accessory')],
  legs: [s('squat', 'main'), s('hinge', 'secondary'), s('lunge', 'accessory'), s('quadIso', 'accessory'), s('hamIso', 'accessory'), s('calf', 'accessory'), s('core', 'accessory')],
};

interface DayTpl {
  title: string;
  focus: string;
  slots: Slot[];
  /** 'power' — og'ir kun (powerbuilding), 'hyp' — hajm kuni */
  style?: 'power' | 'hyp';
}

/** Chiziqli progressiya (Starting Strength / GreySkull uslubi): A va B kunlar navbatma-navbat */
const LIN = {
  A: [s('squat', 'main'), s('hPush', 'main'), s('hPull', 'main'), s('core', 'accessory')],
  B: [s('squat', 'main'), s('vPush', 'main'), s('hinge', 'main'), s('vPull', 'secondary'), s('core', 'accessory')],
};

/** Powerbuilding (PHUL): og'ir yuqori/pastki va hajmli yuqori/pastki kunlar */
const PB = {
  upP: [s('hPush', 'main'), s('hPull', 'main'), s('vPush', 'secondary'), s('vPull', 'secondary'), s('biceps', 'accessory'), s('triceps', 'accessory')],
  loP: [s('squat', 'main'), s('hinge', 'main'), s('lunge', 'secondary'), s('hamIso', 'accessory'), s('calf', 'accessory')],
  upH: [s('iPush', 'secondary'), s('hPull', 'secondary'), s('fly', 'accessory'), s('vPull', 'accessory'), s('lateral', 'accessory'), s('biceps', 'accessory'), s('triceps', 'accessory')],
  loH: [s('lunge', 'secondary'), s('glute', 'secondary'), s('quadIso', 'accessory'), s('hamIso', 'accessory'), s('calf', 'accessory'), s('core', 'accessory')],
  arms: [s('vPush', 'secondary'), s('lateral', 'accessory'), s('rearDelt', 'accessory'), s('biceps', 'accessory'), s('triceps', 'accessory'), s('traps', 'accessory')],
  push: [s('hPush', 'secondary'), s('iPush', 'secondary'), s('fly', 'accessory'), s('lateral', 'accessory'), s('triceps', 'accessory')],
  pull: [s('vPull', 'secondary'), s('hPull', 'secondary'), s('rearDelt', 'accessory'), s('biceps', 'accessory'), s('biceps', 'accessory')],
};

function methodSplit(method: ConcreteMethod, days: number, goal?: Goal): { name: string; why: string; days: DayTpl[] } {
  if (method === 'linear' && days <= 3) {
    // massa maqsadida asosiy mashqlardan keyin qo'llar va yelka uchun ikkita yordamchi mashq (vaqt yetmasa — birinchi bo'lib tushadi)
    const accA = goal === 'muscle' ? [s('lateral', 'accessory'), s('biceps', 'accessory')] : [];
    const accB = goal === 'muscle' ? [s('triceps', 'accessory'), s('rearDelt', 'accessory')] : [];
    const A: DayTpl = { title: 'Kuch A', focus: 'O‘tirish · jim · tortish', slots: [...LIN.A.slice(0, -1), ...accA, ...LIN.A.slice(-1)] };
    const B: DayTpl = { title: 'Kuch B', focus: 'O‘tirish · yelka · o‘lik tortish', slots: [...LIN.B.slice(0, -1), ...accB, ...LIN.B.slice(-1)] };
    return {
      name: 'Chiziqli progressiya A/B',
      why: 'Har mashg‘ulotda o‘tirib-turish va navbat bilan ikki xil kun. Kam mashq, ko‘p kuch: boshlovchi organizmi har 48–72 soatda moslashadi.',
      days: days === 2 ? [A, B] : [A, B, { ...A, title: 'Kuch A′' }],
    };
  }
  if (method === 'powerbuilding' && days >= 4) {
    const upP: DayTpl = { title: 'Yuqori — kuch', focus: 'Og‘ir jim va tortish · 4–6 takror', slots: PB.upP, style: 'power' };
    const loP: DayTpl = { title: 'Pastki — kuch', focus: 'Og‘ir o‘tirish va o‘lik tortish · 4–6 takror', slots: PB.loP, style: 'power' };
    const upH: DayTpl = { title: 'Yuqori — hajm', focus: 'Ko‘krak · orqa · yelka · qo‘llar · 8–15 takror', slots: PB.upH, style: 'hyp' };
    const loH: DayTpl = { title: 'Pastki — hajm', focus: 'Son · dumba · boldir · 8–15 takror', slots: PB.loH, style: 'hyp' };
    const arms: DayTpl = { title: 'Yelka va qo‘llar', focus: 'Delta · bitseps · triseps', slots: PB.arms, style: 'hyp' };
    const list =
      days === 4
        ? [upP, loP, upH, loH]
        : days === 5
          ? [upP, loP, upH, loH, arms]
          : [
              upP,
              loP,
              { ...upH, title: 'Itarish — hajm', focus: 'Ko‘krak · yelka · triseps', slots: PB.push },
              { ...upH, title: 'Tortish — hajm', focus: 'Orqa · bitseps', slots: PB.pull },
              loH,
              arms,
            ];
    return {
      name: `Powerbuilding ×${days}`,
      why: 'Haftada ikki og‘ir kun kuchni, ikki hajm kuni mushakni o‘stiradi. Har mushak haftasiga 2 marta, turli takror oralig‘ida (Schoenfeld 2016).',
      days: list,
    };
  }
  return splitFor(days);
}

function splitFor(days: number): { name: string; why: string; days: DayTpl[] } {
  const fb = (k: 'A' | 'B' | 'C'): DayTpl => ({
    title: `Butun tana ${k}`,
    focus: k === 'A' ? 'O‘tirish · jim · tortish' : k === 'B' ? 'Tos bukilishi · qiya jim · tortilish' : 'Oyoq · yelka · orqa',
    slots: k === 'A' ? T.fbA : k === 'B' ? T.fbB : T.fbC,
  });
  const up = (k: 'A' | 'B'): DayTpl => ({ title: `Yuqori tana ${k}`, focus: 'Ko‘krak · orqa · yelka · qo‘llar', slots: k === 'A' ? T.upA : T.upB });
  const lo = (k: 'A' | 'B'): DayTpl => ({ title: `Pastki tana ${k}`, focus: 'Son · dumba · boldir · press', slots: k === 'A' ? T.loA : T.loB });
  const push: DayTpl = { title: 'Itarish', focus: 'Ko‘krak · yelka · triseps', slots: T.push };
  const pull: DayTpl = { title: 'Tortish', focus: 'Orqa · orqa delta · bitseps', slots: T.pull };
  const legs: DayTpl = { title: 'Oyoqlar', focus: 'Son · dumba · boldir · press', slots: T.legs };
  switch (days) {
    case 2:
      return { name: 'Butun tana ×2', why: 'Haftasiga 2 kunda har bir mushak 2 marta ishlaydi — ACSM tavsiya etgan minimal chastota.', days: [fb('A'), fb('B')] };
    case 3:
      return { name: 'Butun tana ×3', why: 'Har mushak haftasiga 3 marta, har mashg‘ulotda kam set — tez o‘rganish va yaxshi tiklanish.', days: [fb('A'), fb('B'), fb('C')] };
    case 4:
      return { name: 'Yuqori / Pastki', why: 'Har mushak haftasiga 2 marta, har kuni yetarli hajm. Eng ko‘p sinalgan va muvozanatli tizim.', days: [up('A'), lo('A'), up('B'), lo('B')] };
    case 5:
      return {
        name: 'Yuqori / Pastki + Itarish / Tortish / Oyoq',
        why: '5 kunda har mushak 2 marta — hajm ko‘p, lekin har kun qisqaroq.',
        days: [up('A'), lo('A'), push, pull, { ...legs, title: 'Oyoqlar', slots: T.loB }],
      };
    default:
      return {
        name: 'Itarish / Tortish / Oyoq ×2',
        why: 'Tajribali sportchilar uchun: har mushak haftasiga 2 marta, katta hajm.',
        days: [
          { ...push, title: 'Itarish A' },
          { ...pull, title: 'Tortish A' },
          { ...legs, title: 'Oyoqlar A' },
          { ...push, title: 'Itarish B', slots: [s('iPush', 'main'), s('hPush', 'secondary'), s('vPush', 'secondary'), s('lateral', 'accessory'), s('fly', 'accessory'), s('triceps', 'accessory')] },
          {
            ...pull,
            title: 'Tortish B',
            slots: [s('hPull', 'main'), s('vPull', 'secondary'), s('vPull', 'accessory'), s('rearDelt', 'accessory'), s('biceps', 'accessory'), s('biceps', 'accessory')],
          },
          { ...legs, title: 'Oyoqlar B', slots: T.loB },
        ],
      };
  }
}

/** Mushak guruhi uchun mashq o'rinlari ustuvorlik tartibida: avval ko'p bo'g'imli, keyin yakkalovchi */
const GROUP_SLOTS: Record<MuscleGroup, Slot[]> = {
  quads: [s('squat', 'main'), s('lunge', 'secondary'), s('quadIso', 'accessory'), s('squat', 'secondary')],
  hamstrings: [s('hinge', 'main'), s('hamIso', 'accessory'), s('hinge', 'secondary')],
  glutes: [s('glute', 'secondary'), s('lunge', 'accessory')],
  chest: [s('hPush', 'main'), s('iPush', 'secondary'), s('fly', 'accessory'), s('fly', 'accessory')],
  back: [s('vPull', 'main'), s('hPull', 'secondary'), s('hPull', 'accessory'), s('traps', 'accessory')],
  shoulders: [s('vPush', 'main'), s('lateral', 'accessory'), s('rearDelt', 'accessory')],
  triceps: [s('triceps', 'accessory'), s('triceps', 'accessory'), s('triceps', 'accessory')],
  biceps: [s('biceps', 'accessory'), s('biceps', 'accessory'), s('biceps', 'accessory')],
  calves: [s('calf', 'accessory'), s('calf', 'accessory')],
  core: [s('core', 'accessory'), s('core', 'accessory'), s('core', 'accessory')],
};
/** kun ichidagi tartib: katta oyoq mashqlari va murakkab harakatlar avval, kichik mushaklar oxirida */
const DAY_ORDER: MuscleGroup[] = ['quads', 'hamstrings', 'glutes', 'chest', 'back', 'shoulders', 'triceps', 'biceps', 'calves', 'core'];
const BIG: MuscleGroup[] = ['quads', 'hamstrings', 'chest', 'back'];
const MID: MuscleGroup[] = ['shoulders', 'glutes'];

/**
 * Foydalanuvchi taqsimlagan kunlar: har guruhga mashqlar soni guruh kattaligi, haftalik chastotasi va kundagi guruhlar
 * soniga qarab (bir marta ishlanadigan katta guruhga — 3 ta, ikki marta yoki ko'p guruhli kunda — 2 ta). Bir kunda
 * eng ko'pi 2 ta "asosiy" (og'ir, uzun damli) mashq. Setlar keyin haftalik hajm tavsiyasiga moslanadi (balanceVolume).
 */
function customDays(split: DaySplit, p: Profile): { name: string; why: string; days: DayTpl[] } {
  const freq = (g: MuscleGroup) => split.filter((d) => d.includes(g)).length;
  // mashg'ulot vaqtiga sig'adigan mashqlar soni: 30 daq — 3, 45 — 4, 60 — 6, 75+ — 8
  const target = Math.max(3, Math.min(8, Math.round((p.sessionMin - 10) / 8.5)));
  const days = split.map((groups): DayTpl => {
    const gs = DAY_ORDER.filter((g) => groups.includes(g));
    const n = gs.length;
    // guruh bo'yicha: qo'shimcha mashq ham o'z guruhi yonida turadi (yelka mashqlari — pressdan oldin)
    const per = new Map<MuscleGroup, Slot[]>();
    const left = new Map<MuscleGroup, Slot[]>();
    let mains = 0;
    for (const g of gs) {
      const f = freq(g);
      const crowded = f >= 2 || n >= 4;
      // kunda yolg'iz katta guruh (masalan, "Ko'krak kuni") — 4 ta mashq, aks holda mashg'ulot juda qisqa bo'ladi
      const k = BIG.includes(g) ? (crowded ? 2 : n === 1 ? 4 : 3) : MID.includes(g) ? (crowded ? 1 : 2) : n <= 2 && f === 1 ? 3 : crowded ? 1 : 2;
      // ko'krak bilan bir kunda delta jimda allaqachon ishlaydi — yelkaga avval yon va orqa delta
      const list = g === 'shoulders' && groups.includes('chest') ? [s('lateral', 'accessory'), s('rearDelt', 'accessory'), s('vPush', 'secondary')] : GROUP_SLOTS[g];
      // son orqasida tos bukish (o'lik tortish) asosan dumbaga tushadi — tizza bukish (oyoq bukish) ham saqlanadi
      const own = list.slice(0, k).map((sl, j): Slot => ({ ...sl, role: sl.role === 'main' && mains++ >= 2 ? 'secondary' : sl.role, keep: j === 0 || sl.pattern === 'hamIso' }));
      if (p.focus.includes(g)) own.push({ ...s(FOCUS_SLOT[g], 'accessory'), focus: true, extra: true });
      per.set(g, own);
      // bir kunda guruhga ko'pi bilan: katta — 4, o'rta — 3, kichik — 3 (haftasiga 2+ marta bo'lsa 2) mashq
      const cap = BIG.includes(g) ? 4 : MID.includes(g) ? 3 : f >= 2 ? 2 : 3;
      left.set(g, list.slice(k, Math.max(k, cap)));
    }
    // vaqt qolsa — kun guruhlariga yana mashq: avval kam mashq olgan va haftada bir marta ishlaydigan katta guruhga
    // (ortig'ini fitToTime qisqartiradi, haftalik hajmni balanceVolume chegaralaydi)
    const weight = (g: MuscleGroup) => (BIG.includes(g) ? 4 : MID.includes(g) ? 3 : 2) / freq(g);
    const total = () => gs.reduce((a, g) => a + per.get(g)!.length, 0);
    while (total() < target) {
      const g = gs.filter((x) => left.get(x)!.length).sort((a, b) => per.get(a)!.length / weight(a) - per.get(b)!.length / weight(b))[0];
      if (!g) break;
      const sl = left.get(g)!.shift()!;
      per.get(g)!.push({ ...sl, role: sl.role === 'main' ? 'secondary' : sl.role });
    }
    const slots = gs.flatMap((g) => per.get(g)!);
    return { title: splitDayTitle(gs), focus: gs.map((g) => GROUPS[g].name).join(' · '), slots };
  });
  return {
    name: 'O‘z taqsimotingiz',
    why: 'Kunlarni mushak guruhlari bo‘yicha o‘zingiz taqsimladingiz. Mashqlar jihozingiz, darajangiz va cheklovlaringizga qarab tanlandi, setlar haftalik tavsiya etilgan hajmga moslandi.',
    days,
  };
}

export const DEFAULT_DAYS: Record<number, number[]> = {
  2: [0, 3],
  3: [0, 2, 4],
  4: [0, 1, 3, 4],
  5: [0, 1, 2, 4, 5],
  6: [0, 1, 2, 3, 4, 5],
};

const FALLBACK: Partial<Record<Pattern, Pattern[]>> = {
  iPush: ['hPush'],
  hPush: ['iPush'],
  fly: ['iPush', 'hPush'],
  vPush: ['iPush', 'hPush'],
  lateral: ['vPush'],
  rearDelt: ['hPull'],
  traps: ['hPull'],
  hPull: ['vPull'],
  vPull: ['hPull'],
  quadIso: ['lunge', 'squat'],
  hamIso: ['hinge', 'glute'],
  glute: ['hinge', 'lunge'],
  hinge: ['glute', 'lunge'],
  lunge: ['squat'],
  squat: ['lunge'],
  biceps: ['vPull'],
  triceps: ['hPush'],
};

export function hasEquipment(ex: Exercise, eq: EquipmentId[]): boolean {
  const have = new Set(eq);
  if (!ex.equipment.every((e) => have.has(e))) return false;
  if (ex.equipmentAny && !ex.equipmentAny.some((e) => have.has(e))) return false;
  return true;
}

export function isSafe(ex: Exercise, p: Pick<Profile, 'injuries'>): boolean {
  return !(ex.avoid ?? []).some((i) => p.injuries.includes(i));
}

function rank(ex: Exercise, role: Role, p: Profile, used: Map<string, number>, method: ConcreteMethod = 'hypertrophy'): number {
  let sc = ex.score;
  const lvl = p.level;
  if (lvl === 'beginner') {
    if (ex.level === 3) sc -= 4;
    if (ex.level === 2) sc -= 1.5;
    if (ex.loadType === 'machine' || ex.loadType === 'dumbbell') sc += 1;
  } else if (lvl === 'advanced') {
    if (role === 'main' && ex.loadType === 'barbell') sc += 1.5;
  } else if (role === 'main' && ex.loadType === 'barbell') sc += 0.5;
  if (role === 'main' && ex.mechanics === 'isolation') sc -= 3;
  // kuch uslublarida asosiy mashq — shtanga bilan (o'lchanadigan, %1RM bilan ishlaydigan)
  if ((p.goal === 'strength' || method !== 'hypertrophy') && role === 'main' && ex.loadType === 'barbell') sc += method === 'hypertrophy' ? 2 : 4;
  if ((p.goal === 'health' || p.goal === 'fatLoss') && ex.level === 3) sc -= 1;
  // ehtiyotkorlik: mashqdagi belgi va bo'g'im xavfsizligi ma'lumotlari (data/safety) — foydalanuvchi cheklovlari bo'yicha
  sc -= personalSafety(ex, p.injuries).caution.length * 2.5;
  // bir haftada xilma-xillik: bir xil mashqni takrorlamaslik
  sc -= (used.get(ex.id) ?? 0) * 5;
  return sc;
}

export function candidates(pattern: Pattern, p: Profile): Exercise[] {
  return EXERCISES.filter((e) => e.pattern === pattern && hasEquipment(e, p.equipment) && isSafe(e, p));
}

function pick(slot: Slot, p: Profile, used: Map<string, number>, method: ConcreteMethod = 'hypertrophy'): Exercise | undefined {
  const chain = [slot.pattern, ...(FALLBACK[slot.pattern] ?? [])];
  for (const pat of chain) {
    const list = candidates(pat, p);
    if (list.length) return [...list].sort((a, b) => rank(b, slot.role, p, used, method) - rank(a, slot.role, p, used, method))[0];
  }
  return undefined;
}

/** Shtanga/trenajyor bilan o'lchab bo'ladigan ko'p bo'g'imli mashq — %1RM va chiziqli sxemaga yaroqli */
const schemeable = (ex: Exercise) => ex.mechanics === 'compound' && !ex.timed && ex.loadType !== 'bodyweight' && ex.loadType !== 'band' && ex.loadType !== 'kettlebell';

/** Uslub, maqsad va rolga ko‘ra set/takror/dam */
export function methodPrescription(method: ConcreteMethod, goal: Goal, level: Level, role: Role, ex: Exercise, style?: DayTpl['style'], mesoWeeks = 5): Omit<PlannedExercise, 'exerciseId'> {
  const r = methodPrescriptionRaw(method, goal, level, role, ex, style, mesoWeeks);
  // boshlovchi — 3 set, o'rta — 4, tajribali — 5 dan oshmaydi (kuch bloki va powerbuilding ham)
  return { ...r, sets: Math.min(r.sets, LEVEL_MAX_SETS[level]) };
}

function methodPrescriptionRaw(method: ConcreteMethod, goal: Goal, level: Level, role: Role, ex: Exercise, style?: DayTpl['style'], mesoWeeks = 5): Omit<PlannedExercise, 'exerciseId'> {
  const base = prescription(style === 'hyp' ? 'muscle' : goal, level, role, ex);
  if (role === 'main' && schemeable(ex)) {
    if (method === 'linear') {
      const hinge = ex.pattern === 'hinge';
      return { ...base, sets: hinge ? 2 : 3, repMin: 5, repMax: 5, rir: 2, restSec: 180, scheme: 'linear', note: hinge ? 'O‘lik tortish — og‘ir, shuning uchun 2 set' : base.note };
    }
    // %1RM bloki — klassik shtanga mashqlari uchun: o'tirish, o'lik tortish, jim (tortishlar va trenajyorlar — hajm uchun)
    if (method === 'strength' && ex.loadType === 'barbell' && ['squat', 'hinge', 'hPush', 'iPush', 'vPush'].includes(ex.pattern)) {
      const w = blockWeek(0, mesoWeeks);
      return { ...base, sets: w.sets, repMin: w.reps, repMax: w.reps, rir: 2, restSec: 240, scheme: 'block' };
    }
  }
  if (method === 'powerbuilding' && style === 'power') {
    if (role === 'main') return { ...base, sets: 4, repMin: 4, repMax: 6, rir: 2, restSec: 210 };
    if (role === 'secondary' && ex.mechanics === 'compound') return { ...base, sets: 3, repMin: 6, repMax: 8, rir: 2, restSec: 150 };
  }
  return base;
}

/** Maqsad va rolga ko‘ra set/takror/dam */
export function prescription(goal: Goal, level: Level, role: Role, ex: Exercise): Omit<PlannedExercise, 'exerciseId'> {
  const table: Record<Goal, Record<Role, [number, number, number, number, number]>> = {
    // [setlar, min takror, max takror, RIR, dam (s)]
    strength: { main: [4, 3, 5, 2, 180], secondary: [3, 5, 8, 2, 150], accessory: [3, 8, 12, 2, 90] },
    muscle: { main: [3, 6, 10, 2, 150], secondary: [3, 8, 12, 2, 120], accessory: [3, 10, 15, 1, 75] },
    recomp: { main: [3, 6, 10, 2, 150], secondary: [3, 8, 12, 2, 120], accessory: [3, 10, 15, 1, 75] },
    fatLoss: { main: [3, 6, 10, 2, 120], secondary: [3, 8, 12, 2, 90], accessory: [2, 12, 15, 1, 60] },
    health: { main: [3, 8, 12, 3, 120], secondary: [2, 10, 12, 3, 90], accessory: [2, 12, 15, 2, 60] },
  };
  let [sets, repMin, repMax, rir, restSec] = table[goal][role];
  if (level === 'beginner') {
    rir = Math.max(rir, 2);
    if (sets > 3) sets = 3;
  }
  if (level === 'advanced' && (goal === 'muscle' || goal === 'recomp') && role !== 'accessory') sets += 1;
  if (ex.mechanics === 'isolation' && repMin < 8) {
    repMin = 8;
    repMax = Math.max(repMax, 12);
  }
  if (ex.loadType === 'bodyweight' && !ex.timed && ex.increment === 0) {
    repMin = Math.max(repMin, 8);
    repMax = Math.max(repMax, 15);
  }
  if (ex.timed) {
    repMin = level === 'beginner' ? 20 : 30;
    repMax = level === 'beginner' ? 40 : 60;
  }
  let note: string | undefined;
  if (ex.unilateral) note = 'Har tomonga alohida';
  if (ex.timed) note = 'Takror o‘rniga soniya';
  return { sets, repMin, repMax, rir, restSec, note };
}

/** Qo'lda tanlangan mashq uchun set/takror: profil maqsadiga ko'ra, asosiy harakat — ikkinchi darajali, yakkalovchi — yordamchi rolida */
export function manualPlanned(ex: Exercise, p?: Pick<Profile, 'goal' | 'level'> | null): PlannedExercise {
  return { exerciseId: ex.id, ...prescription(p?.goal ?? 'muscle', p?.level ?? 'beginner', ex.mechanics === 'compound' ? 'secondary' : 'accessory', ex) };
}

/** Bitta mashq uchun taxminiy vaqt (daqiqa) */
export function exerciseMinutes(pe: PlannedExercise, ex?: Exercise): number {
  const reps = (pe.repMin + pe.repMax) / 2;
  const work = ex?.timed ? reps : reps * 3.2;
  const perSet = work + pe.restSec;
  const sides = ex?.unilateral ? 1.7 : 1;
  return (pe.sets * perSet * sides) / 60 + 1.5;
}

const EX_BY_ID: Record<string, Exercise> = Object.fromEntries(EXERCISES.map((e) => [e.id, e]));

export function estimateMinutes(list: PlannedExercise[]): number {
  return Math.round(8 + list.reduce((a, pe) => a + exerciseMinutes(pe, EX_BY_ID[pe.exerciseId]), 0));
}

const FOCUS_SLOT: Record<MuscleGroup, Pattern> = {
  chest: 'fly',
  back: 'hPull',
  shoulders: 'lateral',
  biceps: 'biceps',
  triceps: 'triceps',
  quads: 'quadIso',
  hamstrings: 'hamIso',
  glutes: 'glute',
  calves: 'calf',
  core: 'core',
};

const UPPER_FOCUS: MuscleGroup[] = ['chest', 'back', 'shoulders', 'biceps', 'triceps'];

interface Built {
  pe: PlannedExercise;
  role: Role;
  focus: boolean;
  keep?: boolean;
}

export function generateProgram(p: Profile): Program {
  const custom = customSplitOf(p);
  const resolved = resolveMethod(p);
  // o'z taqsimotida og'ir/hajm kunlari yo'q — powerbuilding o'rniga gipertrofiya; qolgan uslublar asosiy mashqlarga ta'sir qiladi
  const method = custom && resolved === 'powerbuilding' ? 'hypertrophy' : resolved;
  const mesoWeeks = methodMeso(method, p.level);
  const split = custom ? customDays(custom, p) : methodSplit(method, Math.min(6, Math.max(2, p.daysPerWeek)), p.goal);
  const used = new Map<string, number>();
  const weekdays = p.trainingDays.length === split.days.length ? [...p.trainingDays].sort((a, b) => a - b) : DEFAULT_DAYS[split.days.length];
  const maxSets = LEVEL_MAX_SETS[p.level];

  const built: Built[][] = split.days.map((tpl) => {
    const slots: Slot[] = [...tpl.slots];
    // ustuvor mushaklar uchun qo‘shimcha mashq; shunday mashq kunda bo'lsa — ikkinchi mashq (yoki qo'shimcha set).
    // O'z taqsimotida bu customDays ichida qilingan
    for (const f of custom ? [] : p.focus) {
      if (tpl.style === 'power') continue;
      const isUpperDay = /Yuqori|Itarish|Tortish|Butun|Yelka/.test(tpl.title);
      const isLowerDay = /Pastki|Oyoq|Butun/.test(tpl.title);
      const fits = UPPER_FOCUS.includes(f) ? isUpperDay : isLowerDay;
      if (!fits) continue;
      const at = slots.findIndex((sl) => sl.pattern === FOCUS_SLOT[f] && sl.role === 'accessory');
      if (at < 0) slots.splice(Math.max(1, slots.length - 1), 0, { ...s(FOCUS_SLOT[f], 'accessory'), focus: true });
      else {
        slots[at] = { ...slots[at], focus: true };
        slots.splice(at + 1, 0, { ...s(FOCUS_SLOT[f], 'accessory'), focus: true, extra: true });
      }
    }
    const out: Built[] = [];
    const ids = new Set<string>();
    for (const sl of slots) {
      // chiziqli progressiyada asosiy mashqlar har kuni bir xil bo'lishi kerak — xilma-xillik jarimasi yo'q
      const ex = pick(sl, p, method === 'linear' && sl.role === 'main' ? new Map() : used, method);
      if (!ex || ids.has(ex.id)) {
        // ikkinchi mashq topilmadi — ustuvor mashqqa bitta set qo'shamiz
        const prev = sl.extra ? [...out].reverse().find((b) => b.focus && b.role === 'accessory') : undefined;
        if (prev && prev.pe.sets < maxSets) prev.pe.sets++;
        continue;
      }
      ids.add(ex.id);
      used.set(ex.id, (used.get(ex.id) ?? 0) + 1);
      out.push({ pe: { exerciseId: ex.id, ...methodPrescription(method, p.goal, p.level, sl.role, ex, tpl.style, mesoWeeks) }, role: sl.role, focus: !!sl.focus, keep: sl.keep });
    }
    fitToTime(out, p.sessionMin);
    return out;
  });

  const days: WorkoutDay[] = split.days.map((tpl, i) => ({
    id: `d${i + 1}`,
    title: tpl.title,
    focus: tpl.focus,
    weekday: weekdays[i] ?? i,
    exercises: built[i].map((b) => b.pe),
    estMin: 0,
  }));

  const bound = (g: MuscleGroup) => WEEKLY_TARGET[g][1] * (p.focus.includes(g) ? 1.25 : 1);
  // vaqt ko‘p qolsa — asosiy mashqlarga set qo'shish (daraja chegarasi va haftalik hajm yuqori chegarasigacha)
  for (const [i, list] of built.entries()) {
    for (let guard = 0; estimateMinutes(days[i].exercises) < p.sessionMin - 15 && guard < 6; guard++) {
      const vol = weeklyVolume({ days });
      const b = list.find((x) => x.role !== 'accessory' && !x.pe.scheme && x.pe.sets < maxSets && fitsVolume(vol, x.pe.exerciseId, bound));
      if (!b) break;
      b.pe.sets++;
    }
  }

  // chiziqli progressiya ataylab minimal: hajm qo'shilmaydi (vazn o'sishi muhim), faqat yuqori chegaradan oshgani kamaytiriladi
  balanceVolume(days, built, p.sessionMin, maxSets, bound, p.focus, method !== 'linear');
  days.forEach((d) => (d.estMin = estimateMinutes(d.exercises)));

  return {
    id: `p${Date.now().toString(36)}`,
    name: split.name,
    split: split.name,
    splitWhy: `${METHOD_INFO[method].name}. ${split.why}`,
    createdAt: new Date().toISOString(),
    days,
    mesoWeeks,
    method,
    startDate: new Date().toISOString().slice(0, 10),
  };
}

/** Bitta set qo'shilsa, mashq ta'sir qiladigan guruhlarning haftalik hajmi chegaradan oshmaydimi */
function fitsVolume(vol: Record<MuscleGroup, number>, exId: string, bound: (g: MuscleGroup) => number): boolean {
  const ex = EX_BY_ID[exId];
  if (!ex) return false;
  const add = Object.fromEntries(GROUP_ORDER.map((g) => [g, 0])) as Record<MuscleGroup, number>;
  addVolume(add, ex, 1);
  return GROUP_ORDER.every((g) => !add[g] || vol[g] + add[g] <= bound(g));
}

/**
 * Haftalik hajmni muvozanatlash: tavsiyadan kam guruhlarga set qo‘shiladi (vaqt, daraja chegarasi va boshqa
 * guruhlarning yuqori chegarasi imkon bersa); yuqori chegaradan oshgan guruhlarda setlar kamaytiriladi —
 * avval yakkalovchi, keyin yordamchi/ikkinchi darajali, oxirida asosiy mashqlarda (kamida 2 set qoladi).
 */
function balanceVolume(days: WorkoutDay[], built: Built[][], minutes: number, maxSets: number, bound: (g: MuscleGroup) => number, focus: MuscleGroup[], add = true) {
  const exs = EX_BY_ID;
  const groupOf = (id: string) => MUSCLES[exs[id].primary[0]].group;
  for (let guard = 0; add && guard < 24; guard++) {
    const vol = weeklyVolume({ days });
    const low = GROUP_ORDER.filter((g) => vol[g] > 0 && vol[g] < WEEKLY_TARGET[g][0]).sort((a, b) => vol[a] / WEEKLY_TARGET[a][0] - vol[b] / WEEKLY_TARGET[b][0]);
    let changed = false;
    for (const g of low) {
      // eng kam setli mashqqa (barcha kunlar bo'yicha) qo'shamiz — yuklama kunlarga teng taqsimlanadi
      const cands = days
        .flatMap((d) =>
          d.exercises.filter(
            (x) =>
              exs[x.exerciseId] &&
              !x.scheme &&
              groupOf(x.exerciseId) === g &&
              x.sets < maxSets &&
              fitsVolume(vol, x.exerciseId, bound) &&
              estimateMinutes(d.exercises) + exerciseMinutes({ ...x, sets: 1 }, exs[x.exerciseId]) - 1.5 <= minutes + 5,
          ),
        )
        .sort((a, b) => a.sets - b.sets);
      if (cands[0]) {
        cands[0].sets++;
        changed = true;
        break;
      }
    }
    if (!changed) break;
  }
  // Yuqori chegaradan oshgan guruhlar: shu guruhga hissa qo'shadigan mashqlarda set kamaytiriladi (avval asosiy mushak
  // sifatida — yakkalovchi, keyin yordamchi sifatida 0.5 set beradigan murakkab mashqlar); boshqa guruhlar pastki
  // chegaradan tushmaydi. Yetmasa — ortiqcha yordamchi mashq butunlay olib tashlanadi (kunda kamida 4 mashq qoladi).
  const share = (id: string, g: MuscleGroup) => {
    const out = Object.fromEntries(GROUP_ORDER.map((x) => [x, 0])) as Record<MuscleGroup, number>;
    addVolume(out, exs[id], 1);
    return g ? out[g] : 0;
  };
  // boshqa guruh pastki chegaradan tushmasin, ustuvor guruhning hajmi esa boshqa guruh hisobiga kamaymasin
  const othersOk = (vol: Record<MuscleGroup, number>, id: string, g: MuscleGroup, sets: number) =>
    GROUP_ORDER.every((h) => h === g || !share(id, h) || (!focus.includes(h) && vol[h] - share(id, h) * sets >= WEEKLY_TARGET[h][0]));
  const roleRank: Record<Role, number> = { accessory: 0, secondary: 1, main: 2 };
  for (const g of GROUP_ORDER) {
    for (let guard = 0; guard < 80; guard++) {
      const vol = weeklyVolume({ days });
      if (vol[g] <= bound(g)) break;
      const all = built.flat().filter((b) => exs[b.pe.exerciseId] && share(b.pe.exerciseId, g) > 0);
      const trim = all
        .filter((b) => !b.pe.scheme && b.pe.sets > 2 && othersOk(vol, b.pe.exerciseId, g, 1))
        .sort(
          (a, b) =>
            share(b.pe.exerciseId, g) - share(a.pe.exerciseId, g) ||
            Number(a.focus) - Number(b.focus) ||
            Number(exs[a.pe.exerciseId].mechanics === 'compound') - Number(exs[b.pe.exerciseId].mechanics === 'compound') ||
            roleRank[a.role] - roleRank[b.role] ||
            b.pe.sets - a.pe.sets,
        )[0];
      if (trim) {
        trim.pe.sets--;
        continue;
      }
      const di = built.findIndex((list) => list.some((b) => b.role === 'accessory' && !b.focus && !b.keep && share(b.pe.exerciseId, g) === 1 && list.length > 4 && othersOk(vol, b.pe.exerciseId, g, b.pe.sets)));
      if (di < 0) break;
      const list = built[di];
      const at = list.findIndex((b) => b.role === 'accessory' && !b.focus && !b.keep && share(b.pe.exerciseId, g) === 1 && othersOk(vol, b.pe.exerciseId, g, b.pe.sets));
      list.splice(at, 1);
      days[di].exercises = list.map((b) => b.pe);
    }
  }
}

/** Mashg‘ulotni tanlangan vaqtga moslash (ustuvor mushak mashqlari oxirgi navbatda qisqaradi) */
function fitToTime(list: Built[], minutes: number) {
  const est = () => estimateMinutes(list.map((b) => b.pe));
  const removeAt = (i: number) => list.splice(i, 1);
  const lastIndex = (f: (b: Built) => boolean) => {
    for (let i = list.length - 1; i >= 0; i--) if (f(list[i])) return i;
    return -1;
  };
  // 1) yordamchi mashqlarda setlarni kamaytirish
  for (let guard = 0; est() > minutes + 3 && guard < 40; guard++) {
    const acc = list.findIndex((b) => b.role === 'accessory' && !b.focus && b.pe.sets > 2);
    if (acc >= 0) {
      list[acc].pe.sets--;
      continue;
    }
    const accF = list.findIndex((b) => b.role === 'accessory' && b.pe.sets > 2);
    if (accF >= 0) {
      list[accF].pe.sets--;
      continue;
    }
    // 2) oxirgi yordamchi mashqni olib tashlash (avval ustuvor bo'lmaganini)
    const lastAcc = lastIndex((b) => b.role === 'accessory' && !b.focus && !b.keep);
    const lastAccF = lastIndex((b) => b.role === 'accessory' && !b.keep);
    if ((lastAcc >= 0 || lastAccF >= 0) && list.length > 3) {
      removeAt(lastAcc >= 0 ? lastAcc : lastAccF);
      continue;
    }
    // 3) ikkinchi darajali mashqlarda set kamaytirish
    const sec = list.findIndex((b) => b.role !== 'main' && b.pe.sets > 2);
    if (sec >= 0) {
      list[sec].pe.sets--;
      continue;
    }
    // 4) kuch sxemasidagi mashqlarda dam qisqaradi (4 → 3 → 2.5 daqiqa); 2.5–3 daqiqa ham kuch uchun yetarli (Schoenfeld 2016)
    const longRest = list.findIndex((b) => b.pe.scheme && b.pe.restSec > 150);
    if (longRest >= 0) {
      list[longRest].pe.restSec = list[longRest].pe.restSec > 180 ? 180 : 150;
      continue;
    }
    const any = list.findIndex((b) => !b.pe.scheme && b.pe.sets > 2);
    if (any >= 0) {
      list[any].pe.sets--;
      continue;
    }
    // 5) oxirgi chora: kuch sxemasida ham set kamayadi (blok rejasi shu sondan oshmaydi)
    const sch = list.findIndex((b) => b.pe.scheme && b.pe.sets > 2);
    if (sch >= 0) list[sch].pe.sets--;
    else break;
  }
  // 6) qisqa mashg'ulot (30 daqiqa) hamon sig'masa — ikkinchi darajali/yordamchi mashqlar olib tashlanadi (kamida 2 mashq),
  //    keyin uzun dam 2 daqiqagacha qisqaradi: taxminiy vaqt rejadan 10 daqiqadan oshmasin
  while (est() > minutes + 10 && list.length > 2) {
    const i = [lastIndex((b) => b.role !== 'main' && !b.keep), lastIndex((b) => b.role !== 'main')].find((x) => x >= 0) ?? -1;
    removeAt(i >= 0 ? i : list.length - 1);
  }
  for (const b of list) if (est() > minutes + 10 && b.pe.restSec > 120) b.pe.restSec = 120;
}

/**
 * Chiziqli progressiya A/B (3 kun): haftalar bo'yicha navbat — juft haftada A-B-A, toq haftada B-A-B,
 * shunda A va B kunlar ikki haftada teng (3+3) bo'ladi. absWeek — mesoState().absWeek.
 * Dastur qo'lda o'zgartirilgan bo'lsa (A va A′ bir xil emas) — kun o'zgarishsiz qaytadi.
 */
export function rotateLinear(program: Pick<Program, 'method' | 'days'>, day: WorkoutDay, absWeek: number): WorkoutDay {
  if (program.method !== 'linear' || program.days.length !== 3 || absWeek % 2 === 0) return day;
  const [a, b, a2] = program.days;
  // asosiy (chiziqli sxemadagi) mashqlar bo'yicha: yordamchilar xilma-xillik uchun farq qilishi mumkin
  const key = (d: WorkoutDay) =>
    d.exercises
      .filter((e) => e.scheme === 'linear')
      .map((e) => e.exerciseId)
      .join(',');
  if (!key(a) || key(a) !== key(a2) || key(a) === key(b)) return day;
  const at = program.days.findIndex((d) => d.id === day.id);
  if (at < 0) return day;
  const src = at === 1 ? a : b;
  return { ...day, title: at === 2 ? `${src.title}′` : src.title, focus: src.focus, exercises: src.exercises.map((e) => ({ ...e })), estMin: src.estMin };
}

/** Haftalik setlar har bir mushak guruhi bo‘yicha (asosiy = 1, yordamchi = 0.5) */
export function weeklyVolume(program: Pick<Program, 'days'>): Record<MuscleGroup, number> {
  const out = Object.fromEntries(GROUP_ORDER.map((g) => [g, 0])) as Record<MuscleGroup, number>;
  for (const d of program.days)
    for (const pe of d.exercises) {
      const ex = EX_BY_ID[pe.exerciseId];
      if (!ex) continue;
      addVolume(out, ex, pe.sets);
    }
  return out;
}

export function addVolume(out: Record<MuscleGroup, number>, ex: Exercise, sets: number) {
  const prim = new Set(ex.primary.map((m) => MUSCLES[m].group));
  const sec = new Set(ex.secondary.map((m) => MUSCLES[m].group).filter((g) => !prim.has(g)));
  prim.forEach((g) => (out[g] += sets));
  sec.forEach((g) => (out[g] += sets * 0.5));
}

export function volumeStatus(group: MuscleGroup, sets: number): 'low' | 'ok' | 'high' {
  const [lo, hi] = WEEKLY_TARGET[group];
  if (sets < lo * 0.7) return 'low';
  if (sets > hi) return 'high';
  return 'ok';
}

/** Muqobil mashqlar (almashtirish uchun) */
export function alternatives(exId: string, p: Profile): Exercise[] {
  const ex = EXERCISES.find((e) => e.id === exId);
  if (!ex) return [];
  const same = EXERCISES.filter((e) => e.id !== exId && e.pattern === ex.pattern && isSafe(e, p));
  const prim = new Set(ex.primary);
  const similar = EXERCISES.filter((e) => e.id !== exId && e.pattern !== ex.pattern && e.primary.some((m) => prim.has(m)) && isSafe(e, p));
  const ordered = [...same, ...similar];
  return ordered.sort((a, b) => Number(hasEquipment(b, p.equipment)) - Number(hasEquipment(a, p.equipment)) || b.score - a.score);
}

/** Har mushak guruhi haftasiga necha kun mashq qilinadi (asosiy mushak sifatida) */
export function groupFrequency(program: Pick<Program, 'days'>): Record<MuscleGroup, number> {
  const out = Object.fromEntries(GROUP_ORDER.map((g) => [g, 0])) as Record<MuscleGroup, number>;
  for (const d of program.days) {
    const gs = new Set<MuscleGroup>();
    for (const pe of d.exercises) EXERCISE_MAP[pe.exerciseId]?.primary.forEach((m) => gs.add(MUSCLES[m].group));
    gs.forEach((g) => out[g]++);
  }
  for (const g of GROUP_ORDER) out[g] = Math.max(2, out[g]);
  return out;
}
