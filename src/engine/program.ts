// Dastur generatori: maqsad, tajriba, kunlar, vaqt, jihoz va jarohatlarga qarab haftalik reja tuzadi.
// Asos: ACSM 2026 (har mushak haftasiga 2+ marta), Schoenfeld 2017 / Pelland 2026 (haftalik hajm),
// Refalo 2023 (1–3 takror zaxira), Schoenfeld 2016 (murakkab mashqlarda uzunroq dam).
import { EXERCISES, EXERCISE_MAP } from '../data/exercises';
import { GROUP_ORDER, MUSCLES, WEEKLY_TARGET } from '../data/catalog';
import type { EquipmentId, Exercise, Goal, Level, MuscleGroup, Pattern, PlannedExercise, Profile, Program, WorkoutDay } from '../types';
import { blockWeek, METHOD_INFO, methodMeso, resolveMethod, type ConcreteMethod } from './methods';

type Role = 'main' | 'secondary' | 'accessory';
interface Slot {
  pattern: Pattern;
  role: Role;
}

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

function methodSplit(method: ConcreteMethod, days: number): { name: string; why: string; days: DayTpl[] } {
  if (method === 'linear' && days <= 3) {
    const A: DayTpl = { title: 'Kuch A', focus: 'O‘tirish · jim · tortish', slots: LIN.A };
    const B: DayTpl = { title: 'Kuch B', focus: 'O‘tirish · yelka · o‘lik tortish', slots: LIN.B };
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
          : [upP, loP, { ...upH, title: 'Itarish — hajm', focus: 'Ko‘krak · yelka · triseps', slots: PB.push }, { ...upH, title: 'Tortish — hajm', focus: 'Orqa · bitseps', slots: PB.pull }, loH, arms];
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
    focus: k === 'A' ? "O‘tirish · jim · tortish" : k === 'B' ? "Tos bukilishi · qiya jim · tortilish" : "Oyoq · yelka · orqa",
    slots: k === 'A' ? T.fbA : k === 'B' ? T.fbB : T.fbC,
  });
  const up = (k: 'A' | 'B'): DayTpl => ({ title: `Yuqori tana ${k}`, focus: "Ko‘krak · orqa · yelka · qo‘llar", slots: k === 'A' ? T.upA : T.upB });
  const lo = (k: 'A' | 'B'): DayTpl => ({ title: `Pastki tana ${k}`, focus: 'Son · dumba · boldir · press', slots: k === 'A' ? T.loA : T.loB });
  const push: DayTpl = { title: 'Itarish', focus: "Ko‘krak · yelka · triseps", slots: T.push };
  const pull: DayTpl = { title: 'Tortish', focus: 'Orqa · orqa delta · bitseps', slots: T.pull };
  const legs: DayTpl = { title: 'Oyoqlar', focus: 'Son · dumba · boldir · press', slots: T.legs };
  switch (days) {
    case 2:
      return { name: 'Butun tana ×2', why: "Haftasiga 2 kunda har bir mushak 2 marta ishlaydi — ACSM tavsiya etgan minimal chastota.", days: [fb('A'), fb('B')] };
    case 3:
      return { name: 'Butun tana ×3', why: "Har mushak haftasiga 3 marta, har mashg‘ulotda kam set — tez o‘rganish va yaxshi tiklanish.", days: [fb('A'), fb('B'), fb('C')] };
    case 4:
      return { name: 'Yuqori / Pastki', why: "Har mushak haftasiga 2 marta, har kuni yetarli hajm. Eng ko‘p sinalgan va muvozanatli tizim.", days: [up('A'), lo('A'), up('B'), lo('B')] };
    case 5:
      return {
        name: 'Yuqori / Pastki + Itarish / Tortish / Oyoq',
        why: "5 kunda har mushak 2 marta — hajm ko‘p, lekin har kun qisqaroq.",
        days: [up('A'), lo('A'), push, pull, { ...legs, title: 'Oyoqlar', slots: T.loB }],
      };
    default:
      return {
        name: 'Itarish / Tortish / Oyoq ×2',
        why: "Tajribali sportchilar uchun: har mushak haftasiga 2 marta, katta hajm.",
        days: [
          { ...push, title: 'Itarish A' },
          { ...pull, title: 'Tortish A' },
          { ...legs, title: 'Oyoqlar A' },
          { ...push, title: 'Itarish B', slots: [s('iPush', 'main'), s('hPush', 'secondary'), s('vPush', 'secondary'), s('lateral', 'accessory'), s('fly', 'accessory'), s('triceps', 'accessory')] },
          { ...pull, title: 'Tortish B', slots: [s('hPull', 'main'), s('vPull', 'secondary'), s('vPull', 'accessory'), s('rearDelt', 'accessory'), s('biceps', 'accessory'), s('biceps', 'accessory')] },
          { ...legs, title: 'Oyoqlar B', slots: T.loB },
        ],
      };
  }
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
  sc -= (ex.caution ?? []).filter((i) => p.injuries.includes(i)).length * 2.5;
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
  if (ex.unilateral) note = "Har tomonga alohida";
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

export function generateProgram(p: Profile): Program {
  const method = resolveMethod(p);
  const mesoWeeks = methodMeso(method, p.level);
  const split = methodSplit(method, Math.min(6, Math.max(2, p.daysPerWeek)));
  const used = new Map<string, number>();
  const weekdays = p.trainingDays.length === split.days.length ? [...p.trainingDays].sort((a, b) => a - b) : DEFAULT_DAYS[split.days.length];

  const days: WorkoutDay[] = split.days.map((tpl, i) => {
    const slots = [...tpl.slots];
    // ustuvor mushaklar uchun qo‘shimcha mashq
    for (const f of method === 'linear' ? [] : p.focus) {
      if (tpl.style === 'power') continue;
      const isUpperDay = /Yuqori|Itarish|Tortish|Butun|Yelka/.test(tpl.title);
      const isLowerDay = /Pastki|Oyoq|Butun/.test(tpl.title);
      const fits = UPPER_FOCUS.includes(f) ? isUpperDay : isLowerDay;
      if (fits && !slots.some((sl) => sl.pattern === FOCUS_SLOT[f] && sl.role === 'accessory')) {
        slots.splice(Math.max(1, slots.length - 1), 0, s(FOCUS_SLOT[f], 'accessory'));
      }
    }
    const chosen: PlannedExercise[] = [];
    const ids = new Set<string>();
    const roles: Role[] = [];
    for (const sl of slots) {
      // chiziqli progressiyada asosiy mashqlar har kuni bir xil bo'lishi kerak — xilma-xillik jarimasi yo'q
      const ex = pick(sl, p, method === 'linear' && sl.role === 'main' ? new Map() : used, method);
      if (!ex || ids.has(ex.id)) continue;
      ids.add(ex.id);
      used.set(ex.id, (used.get(ex.id) ?? 0) + 1);
      chosen.push({ exerciseId: ex.id, ...methodPrescription(method, p.goal, p.level, sl.role, ex, tpl.style, mesoWeeks) });
      roles.push(sl.role);
    }
    fitToTime(chosen, roles, p.sessionMin);
    return {
      id: `d${i + 1}`,
      title: tpl.title,
      focus: tpl.focus,
      weekday: weekdays[i] ?? i,
      exercises: chosen,
      estMin: estimateMinutes(chosen),
    };
  });

  // chiziqli progressiya ataylab minimal: hajm emas, har mashg'ulotdagi vazn o'sishi muhim
  if (method !== 'linear') balanceVolume(days, p.sessionMin, p.level === 'beginner' ? 4 : 5);
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

/**
 * Haftalik hajmni muvozanatlash: tavsiyadan kam guruhlarga set qo‘shiladi (vaqt imkon bersa),
 * juda ko‘p bo‘lganlarida yordamchi mashqlar seti kamaytiriladi.
 */
function balanceVolume(days: WorkoutDay[], minutes: number, maxSets: number) {
  const exs = EX_BY_ID;
  const groupOf = (id: string) => MUSCLES[exs[id].primary[0]].group;
  for (let guard = 0; guard < 24; guard++) {
    const vol = weeklyVolume({ days });
    const low = GROUP_ORDER.filter((g) => vol[g] > 0 && vol[g] < WEEKLY_TARGET[g][0]).sort((a, b) => vol[a] / WEEKLY_TARGET[a][0] - vol[b] / WEEKLY_TARGET[b][0]);
    let changed = false;
    for (const g of low) {
      // eng kam setli mashqqa (barcha kunlar bo'yicha) qo'shamiz — yuklama kunlarga teng taqsimlanadi
      const cands = days
        .filter((d) => estimateMinutes(d.exercises) <= minutes + 6)
        .flatMap((d) => d.exercises.filter((x) => exs[x.exerciseId] && !x.scheme && groupOf(x.exerciseId) === g && x.sets < maxSets))
        .sort((a, b) => a.sets - b.sets);
      if (cands[0]) {
        cands[0].sets++;
        changed = true;
        break;
      }
    }
    if (!changed) break;
  }
  const vol = weeklyVolume({ days });
  for (const g of GROUP_ORDER) {
    let over = vol[g] - WEEKLY_TARGET[g][1] * 1.1;
    for (const d of days)
      for (const pe of d.exercises) {
        const ex = exs[pe.exerciseId];
        if (over <= 0 || !ex || groupOf(pe.exerciseId) !== g || ex.mechanics !== 'isolation' || pe.sets <= 2) continue;
        pe.sets--;
        over -= 1;
      }
  }
}

/** Mashg‘ulotni tanlangan vaqtga moslash */
function fitToTime(list: PlannedExercise[], roles: Role[], minutes: number) {
  const est = () => estimateMinutes(list);
  // 1) yordamchi mashqlarda setlarni kamaytirish
  for (let guard = 0; est() > minutes + 3 && guard < 30; guard++) {
    const acc = list.findIndex((pe, i) => roles[i] === 'accessory' && pe.sets > 2);
    if (acc >= 0) {
      list[acc].sets--;
      continue;
    }
    // 2) oxirgi yordamchi mashqni olib tashlash
    const lastAcc = roles.lastIndexOf('accessory');
    if (lastAcc >= 0 && list.length > 3) {
      list.splice(lastAcc, 1);
      roles.splice(lastAcc, 1);
      continue;
    }
    // 3) ikkinchi darajali mashqlarda set kamaytirish
    const sec = list.findIndex((pe, i) => roles[i] !== 'main' && pe.sets > 2);
    if (sec >= 0) {
      list[sec].sets--;
      continue;
    }
    // 4) kuch sxemasidagi mashqlarda dam qisqaradi (4 → 3 → 2.5 daqiqa); 2.5–3 daqiqa ham kuch uchun yetarli (Schoenfeld 2016)
    const longRest = list.findIndex((pe) => pe.scheme && pe.restSec > 150);
    if (longRest >= 0) {
      list[longRest].restSec = list[longRest].restSec > 180 ? 180 : 150;
      continue;
    }
    const any = list.findIndex((pe) => !pe.scheme && pe.sets > 2);
    if (any >= 0) {
      list[any].sets--;
      continue;
    }
    // 5) oxirgi chora: kuch sxemasida ham set kamayadi (blok rejasi shu sondan oshmaydi)
    const sch = list.findIndex((pe) => pe.scheme && pe.sets > 2);
    if (sch >= 0) list[sch].sets--;
    else break;
  }
  // vaqt ko‘p qolsa — asosiy mashqlarga set qo‘shish
  for (let guard = 0; est() < minutes - 15 && guard < 6; guard++) {
    const i = list.findIndex((pe, k) => roles[k] !== 'accessory' && !pe.scheme && pe.sets < 5);
    if (i < 0) break;
    list[i].sets++;
  }
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
