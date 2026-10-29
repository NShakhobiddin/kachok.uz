// Hujjat sxemalari. Ilova turlari: src/types.ts (Profile, Program, WorkoutLog, BodyEntry, FoodEntry).
import { z } from 'zod';

// --- Sinxronlash: yumshoq tekshiruv ---
// Faqat tuzilma va turlar tekshiriladi (massiv/obyekt/satr/son), chegaralar emas: ilovaning haqiqiy hujjati hech qachon
// rad etilmasligi kerak (aks holda butun paket va keyingi barcha sinxronlashlar to'xtaydi). Noma'lum maydonlar saqlanadi.
// Maqsad — murabbiy sahifasi va serverdagi hisob-kitoblar kutilmagan shakldan yiqilmasligi.

/** NaN/Infinity JSON'da null bo'lib keladi — shuning uchun null ham qabul qilinadi */
const num = z.number().nullish();
const str = (max: number) => z.string().max(max).nullish();
const date = z
  .string()
  .max(40)
  .refine((s) => Number.isFinite(Date.parse(s)), 'sana noto‘g‘ri');

const syncPlanned = z.object({ exerciseId: z.string().max(64), sets: num, repMin: num, repMax: num, rir: num, restSec: num, note: str(2000) }).passthrough();
const syncDay = z.object({ id: str(64), title: str(500), weekday: num, exercises: z.array(syncPlanned).max(100) }).passthrough();
const syncProgram = z.object({ days: z.array(syncDay).max(14), mesoWeeks: num, startDate: str(40), split: str(500), name: str(500) }).passthrough();

const syncSet = z.object({ kg: num, reps: num, rir: num, done: z.boolean().nullish(), warmup: z.boolean().nullish() }).passthrough();
const syncLog = z
  .object({
    id: str(64),
    title: str(500),
    startedAt: date,
    finishedAt: str(40),
    durationMin: num,
    exercises: z
      .array(z.object({ exerciseId: z.string().max(64), sets: z.array(syncSet).max(100), note: str(2000) }).passthrough())
      .max(100)
      .nullish(),
  })
  .passthrough();

const syncBody = z
  .object({ date: z.string().max(20), weightKg: num, waistCm: num, neckCm: num, hipCm: num, chestCm: num, armCm: num, thighCm: num })
  .passthrough();

const syncFood = z
  .array(z.object({ id: z.string().max(64), date: z.string().max(20), meal: num, name: str(500), g: num, kcal: num, p: num, f: num, c: num }).passthrough())
  .max(500);

const syncProfile = z
  .object({
    name: str(200),
    goal: str(40),
    level: str(40),
    age: num,
    heightCm: num,
    weightKg: num,
    daysPerWeek: num,
    sessionMin: num,
    trainingDays: z.array(z.number()).max(14).nullish(),
    equipment: z.array(z.string().max(64)).max(200).nullish(),
    injuries: z.array(z.string().max(64)).max(50).nullish(),
    focus: z.array(z.string().max(64)).max(50).nullish(),
  })
  .passthrough();

export const SYNC_DOC_SCHEMAS = {
  profile: syncProfile,
  program: syncProgram,
  log: syncLog,
  body: syncBody,
  food: syncFood,
  meta: z.object({}).passthrough(),
} as const;

// --- Murabbiy yuborgan dastur: qat'iy tekshiruv (ilova muharriri chegaralaridan biroz kengroq) ---

const plannedExercise = z
  .object({
    exerciseId: z.string().min(1).max(64),
    sets: z.number().int().min(1).max(10),
    repMin: z.number().int().min(1).max(100),
    repMax: z.number().int().min(1).max(100),
    rir: z.number().min(0).max(10),
    restSec: z.number().int().min(0).max(900),
    note: z.string().max(500).optional(),
    scheme: z.enum(['block', 'linear']).optional(),
  })
  .passthrough()
  .refine((e) => e.repMin <= e.repMax, { message: 'repMin repMax dan katta bo‘lmasligi kerak', path: ['repMin'] });

const workoutDay = z
  .object({
    id: z.string().min(1).max(64),
    title: z.string().max(120),
    focus: z.string().max(300).optional(),
    weekday: z.number().int().min(0).max(6),
    exercises: z.array(plannedExercise).max(30),
    estMin: z.number().min(0).max(600).optional(),
  })
  .passthrough();

export const programSchema = z
  .object({
    id: z.string().min(1).max(64),
    name: z.string().max(120),
    split: z.string().max(120),
    splitWhy: z.string().max(2000).optional(),
    createdAt: z.string().max(40).optional(),
    days: z.array(workoutDay).min(1).max(7),
    mesoWeeks: z.number().int().min(1).max(52),
    method: z.enum(['hypertrophy', 'strength', 'linear', 'powerbuilding']).optional(),
    startDate: z.string().max(40),
  })
  .passthrough();
