// Zaxira fayli va qurilmada saqlangan holatni tekshirish: noto'g'ri tuzilma (qo'lda tahrirlangan yoki boshqa
// versiyadagi fayl) ilovani buzib qo'ymasin. Faqat exportData yozadigan kalitlar qabul qilinadi.
import { clampKcalAdjust } from '../engine/nutrition';
import type { BodyEntry, ExerciseLog, FoodEntry, PlannedExercise, Profile, Program, SetLog, WorkoutDay, WorkoutLog } from '../types';

type Obj = Record<string, unknown>;
export const isObj = (v: unknown): v is Obj => !!v && typeof v === 'object' && !Array.isArray(v);
const isStr = (v: unknown): v is string => typeof v === 'string';
const isNum = (v: unknown): v is number => typeof v === 'number' && Number.isFinite(v);
const strs = (v: unknown): string[] => (Array.isArray(v) ? v.filter(isStr) : []);
const optNum = (v: unknown) => (isNum(v) ? v : undefined);
const optStr = (v: unknown) => (isStr(v) ? v : undefined);
const isDate = (v: unknown): v is string => isStr(v) && !Number.isNaN(Date.parse(v));

/** Zaxirada saqlanadigan (exportData yozadigan) kalitlar */
export const BACKUP_KEYS = [
  'profile',
  'program',
  'logs',
  'body',
  'food',
  'water',
  'readiness',
  'lessonsDone',
  'kcalAdjust',
  'kcalAdjustAt',
  'setDelta',
  'setDeltaMeso',
  'seenAchievements',
  'settings',
  'exNotes',
] as const;

export const DEFAULT_SETTINGS = { sound: true, vibrate: true, showRir: true, barKg: 20 };

export function sanitizeProfile(v: unknown): Profile | undefined {
  if (!isObj(v)) return undefined;
  if (!isNum(v.weightKg) || !isNum(v.heightCm) || !isNum(v.age) || !isStr(v.sex) || !isStr(v.goal) || !isStr(v.level) || !isNum(v.daysPerWeek)) return undefined;
  const diet = isObj(v.dietPrefs) ? v.dietPrefs : {};
  return {
    ...(v as unknown as Profile),
    name: isStr(v.name) ? v.name : '',
    sessionMin: isNum(v.sessionMin) ? v.sessionMin : 60,
    trainingDays: Array.isArray(v.trainingDays) ? v.trainingDays.filter((d): d is number => Number.isInteger(d) && d >= 0 && d <= 6) : [],
    equipment: strs(v.equipment) as Profile['equipment'],
    injuries: strs(v.injuries) as Profile['injuries'],
    focus: strs(v.focus) as Profile['focus'],
    healthFlags: strs(v.healthFlags),
    activity: (isStr(v.activity) ? v.activity : 'light') as Profile['activity'],
    dietPrefs: { noPork: diet.noPork !== false, lactoseFree: diet.lactoseFree === true, vegetarian: diet.vegetarian === true },
    bodyFat: optNum(v.bodyFat),
    createdAt: isDate(v.createdAt) ? v.createdAt : new Date().toISOString(),
  };
}

function sanitizePlanned(v: unknown): PlannedExercise | null {
  if (!isObj(v) || !isStr(v.exerciseId) || !isNum(v.sets) || !isNum(v.repMin) || !isNum(v.repMax)) return null;
  return {
    ...(v as unknown as PlannedExercise),
    rir: isNum(v.rir) ? v.rir : 2,
    restSec: isNum(v.restSec) ? v.restSec : 90,
    scheme: v.scheme === 'block' || v.scheme === 'linear' ? v.scheme : undefined,
  };
}

export function sanitizeProgram(v: unknown): Program | undefined {
  if (!isObj(v) || !Array.isArray(v.days)) return undefined;
  const days: WorkoutDay[] = [];
  for (const d of v.days) {
    if (!isObj(d) || !isStr(d.id) || !Number.isInteger(d.weekday) || (d.weekday as number) < 0 || (d.weekday as number) > 6 || !Array.isArray(d.exercises)) continue;
    days.push({
      ...(d as unknown as WorkoutDay),
      title: isStr(d.title) ? d.title : 'Mashg‘ulot',
      focus: isStr(d.focus) ? d.focus : '',
      exercises: d.exercises.map(sanitizePlanned).filter((x): x is PlannedExercise => !!x),
      estMin: isNum(d.estMin) ? d.estMin : 45,
    });
  }
  if (!days.length) return undefined;
  const createdAt = isDate(v.createdAt) ? v.createdAt : new Date().toISOString();
  return {
    ...(v as unknown as Program),
    id: isStr(v.id) ? v.id : `p${Date.now().toString(36)}`,
    name: isStr(v.name) ? v.name : 'Dastur',
    split: isStr(v.split) ? v.split : '',
    splitWhy: isStr(v.splitWhy) ? v.splitWhy : '',
    createdAt,
    days,
    mesoWeeks: isNum(v.mesoWeeks) && v.mesoWeeks >= 1 ? Math.round(v.mesoWeeks) : 5,
    startDate: isStr(v.startDate) && /^\d{4}-\d{2}-\d{2}$/.test(v.startDate) ? v.startDate : createdAt.slice(0, 10),
  };
}

function sanitizeSet(v: unknown): SetLog | null {
  if (!isObj(v) || !isNum(v.kg) || !isNum(v.reps)) return null;
  return {
    kg: v.kg,
    reps: v.reps,
    done: v.done === true,
    ...(isNum(v.rir) ? { rir: v.rir } : {}),
    ...(v.warmup === true ? { warmup: true } : {}),
    ...(v.kind === 'drop' || v.kind === 'failure' ? { kind: v.kind } : {}),
  };
}

function sanitizeExerciseLog(v: unknown): ExerciseLog | null {
  if (!isObj(v) || !isStr(v.exerciseId) || !Array.isArray(v.sets)) return null;
  return { exerciseId: v.exerciseId, sets: v.sets.map(sanitizeSet).filter((s): s is SetLog => !!s), ...(isStr(v.note) ? { note: v.note } : {}) };
}

export function sanitizeLog(v: unknown): WorkoutLog | null {
  if (!isObj(v) || !isStr(v.id) || !isDate(v.startedAt) || !Array.isArray(v.exercises)) return null;
  const out: WorkoutLog = {
    ...(v as unknown as WorkoutLog),
    title: isStr(v.title) ? v.title : 'Mashg‘ulot',
    durationMin: isNum(v.durationMin) ? v.durationMin : 0,
    finishedAt: isDate(v.finishedAt) ? v.finishedAt : undefined,
    dayId: optStr(v.dayId),
    readiness: optNum(v.readiness),
    exercises: v.exercises.map(sanitizeExerciseLog).filter((e): e is ExerciseLog => !!e),
    painEx: Array.isArray(v.painEx) ? strs(v.painEx) : undefined,
    muscleFb: isObj(v.muscleFb) ? (v.muscleFb as WorkoutLog['muscleFb']) : undefined,
    feedback: isObj(v.feedback) && isNum(v.feedback.pump) && isNum(v.feedback.soreness) && isNum(v.feedback.joints) ? (v.feedback as WorkoutLog['feedback']) : undefined,
  };
  return out;
}

const BODY_FIELDS = ['weightKg', 'waistCm', 'neckCm', 'hipCm', 'chestCm', 'armCm', 'thighCm'] as const;
export function sanitizeBody(v: unknown): BodyEntry | null {
  if (!isObj(v) || !isStr(v.date) || !/^\d{4}-\d{2}-\d{2}$/.test(v.date)) return null;
  const out: BodyEntry = { date: v.date };
  for (const f of BODY_FIELDS) if (isNum(v[f])) out[f] = v[f] as number;
  return out;
}

export function sanitizeFood(v: unknown): FoodEntry | null {
  if (!isObj(v) || !isStr(v.id) || !isStr(v.date) || !/^\d{4}-\d{2}-\d{2}$/.test(v.date) || !isNum(v.kcal)) return null;
  const meal = [0, 1, 2, 3].includes(v.meal as number) ? (v.meal as FoodEntry['meal']) : 3;
  return {
    id: v.id,
    date: v.date,
    meal,
    name: isStr(v.name) ? v.name : 'Ovqat',
    kcal: v.kcal,
    p: isNum(v.p) ? v.p : 0,
    f: isNum(v.f) ? v.f : 0,
    c: isNum(v.c) ? v.c : 0,
    ...(isStr(v.foodId) ? { foodId: v.foodId } : {}),
    ...(isNum(v.g) ? { g: v.g } : {}),
    ...(isStr(v.label) ? { label: v.label } : {}),
  };
}

const numRecord = (v: Obj) => Object.fromEntries(Object.entries(v).filter(([, x]) => isNum(x))) as Record<string, number>;
const strRecord = (v: Obj) => Object.fromEntries(Object.entries(v).filter(([, x]) => isStr(x))) as Record<string, string>;

export function sanitizeSettings(v: unknown) {
  const s = isObj(v) ? v : {};
  return {
    sound: typeof s.sound === 'boolean' ? s.sound : DEFAULT_SETTINGS.sound,
    vibrate: typeof s.vibrate === 'boolean' ? s.vibrate : DEFAULT_SETTINGS.vibrate,
    showRir: typeof s.showRir === 'boolean' ? s.showRir : DEFAULT_SETTINGS.showRir,
    barKg: isNum(s.barKg) && s.barKg >= 0 && s.barKg <= 50 ? s.barKg : DEFAULT_SETTINGS.barKg,
    ...(typeof s.adaptiveTdee === 'boolean' ? { adaptiveTdee: s.adaptiveTdee } : {}),
  };
}

export interface BackupData {
  profile: Profile | null;
  program: Program | null;
  logs: WorkoutLog[];
  body: BodyEntry[];
  food: FoodEntry[];
  water: Record<string, number>;
  readiness: Record<string, number>;
  lessonsDone: string[];
  kcalAdjust: number;
  kcalAdjustAt: string | undefined;
  setDelta: Record<string, number>;
  setDeltaMeso: number | undefined;
  seenAchievements: string[];
  settings: ReturnType<typeof sanitizeSettings>;
  exNotes: Record<string, string>;
}

/**
 * Zaxira ma'lumotini tekshirish. strict: kalit bor-u, turi noto'g'ri bo'lsa (massiv o'rniga obyekt va h.k.) — butun fayl rad etiladi
 * (aks holda tarix jimgina o'chib ketadi). Massiv ichidagi buzuq yozuvlar tashlab yuboriladi.
 * strict=false — qurilmadagi buzilgan holatni tiklash: noto'g'ri qism standart qiymatga almashtiriladi.
 */
export function sanitizeData(d: unknown, strict = true): { data: BackupData; dropped: number } | null {
  if (!isObj(d)) return null;
  if (strict && !('profile' in d)) return null;
  let dropped = 0;
  const bad = () => {
    if (strict) throw new Error('bad');
  };
  const list = <T>(k: string, fn: (v: unknown) => T | null): T[] => {
    const v = d[k];
    if (v === undefined || v === null) return [];
    if (!Array.isArray(v)) return bad(), [];
    const out = v.map(fn).filter((x): x is T => x !== null);
    dropped += v.length - out.length;
    return out;
  };
  const rec = <T>(k: string, fn: (v: Obj) => T, empty: T): T => {
    const v = d[k];
    if (v === undefined || v === null) return empty;
    if (!isObj(v)) return bad(), empty;
    return fn(v);
  };
  try {
    let profile: Profile | null = null;
    if (d.profile !== null && d.profile !== undefined) {
      profile = sanitizeProfile(d.profile) ?? null;
      if (!profile) bad();
    }
    let program: Program | null = null;
    if (d.program !== null && d.program !== undefined) {
      program = sanitizeProgram(d.program) ?? null;
      if (!program) bad();
    }
    if (d.kcalAdjust !== undefined && !isNum(d.kcalAdjust)) bad();
    if (d.settings !== undefined && !isObj(d.settings)) bad();
    const logs = list('logs', sanitizeLog);
    // bir xil id — oxirgisi qoladi
    const uniq = <T>(arr: T[], k: (x: T) => string) => [...new Map(arr.map((x) => [k(x), x])).values()];
    const data: BackupData = {
      profile,
      program,
      logs: uniq(logs, (l) => l.id),
      body: uniq(list('body', sanitizeBody), (b) => b.date).sort((a, b) => a.date.localeCompare(b.date)),
      food: uniq(list('food', sanitizeFood), (f) => f.id),
      water: rec('water', numRecord, {}),
      readiness: rec('readiness', numRecord, {}),
      lessonsDone: list('lessonsDone', (x) => (isStr(x) ? x : null)),
      kcalAdjust: isNum(d.kcalAdjust) ? clampKcalAdjust(d.kcalAdjust) : 0,
      kcalAdjustAt: isStr(d.kcalAdjustAt) && /^\d{4}-\d{2}-\d{2}/.test(d.kcalAdjustAt) ? d.kcalAdjustAt.slice(0, 10) : undefined,
      setDelta: rec('setDelta', numRecord, {}),
      setDeltaMeso: isNum(d.setDeltaMeso) ? d.setDeltaMeso : undefined,
      seenAchievements: list('seenAchievements', (x) => (isStr(x) ? x : null)),
      settings: sanitizeSettings(d.settings),
      exNotes: rec('exNotes', strRecord, {}),
    };
    return { data, dropped };
  } catch {
    return null;
  }
}

/**
 * Qurilmadagi buzilgan holatni tiklash (ErrorBoundary dan): to'g'ri qismlar qoladi, buzuqlari tashlanadi.
 * Akkaunt, sinxron holati va (tuzilmasi to'g'ri bo'lsa) faol mashg'ulot ham saqlanadi.
 */
export function repairState(st: unknown): Record<string, unknown> {
  const s = isObj(st) ? st : {};
  const out: Record<string, unknown> = { ...sanitizeData(s, false)!.data };
  const acc = s.account;
  if (isObj(acc) && isObj(acc.user) && isStr(acc.user.id) && isStr(acc.access) && isStr(acc.refresh)) out.account = acc;
  const sync = s.sync;
  if (isObj(sync) && isNum(sync.cursor) && isObj(sync.hashes) && isObj(sync.stamps)) out.sync = { ...sync, status: 'idle', error: undefined };
  out.seenNotes = strs(s.seenNotes);
  if (isStr(s.programAck)) out.programAck = s.programAck;
  out.active = null;
  const a = s.active;
  if (isObj(a) && Array.isArray(a.plan) && isNum(a.index)) {
    const log = sanitizeLog(a.log);
    const plan = a.plan.map(sanitizePlanned);
    if (log && log.exercises.length === plan.length && plan.every(Boolean) && log.exercises.length > 0)
      out.active = { ...a, log, plan, restEndsAt: isNum(a.restEndsAt) ? a.restEndsAt : null, restTotal: isNum(a.restTotal) ? a.restTotal : 0, index: Math.min(Math.max(0, a.index), plan.length - 1) };
  }
  return out;
}
