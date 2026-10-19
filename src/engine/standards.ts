// Kuch me'yorlari: asosiy mashqlarda tana vazniga nisbatan 1RM bo'yicha daraja.
// Manba: Strength Level (strengthlevel.com) — foydalanuvchilar natijalarining 5/20/50/80/95-persentillari.
// Og'ir odamlar uchun nisbat chegaralari biroz pastroq: kuch tana vazniga ~BW^0.67 bo'yicha o'sadi.
import type { Sex, WorkoutLog } from '../types';
import { e1rm as epley } from './progression';
import { e1rmFromSet } from './rpe';

export type LiftId = 'squat' | 'bench' | 'deadlift' | 'ohp' | 'row' | 'pullup';

export const LEVELS = [
  { id: 'beginner', name: 'Boshlovchi', plate: 'var(--plate-white)', pct: 5 },
  { id: 'novice', name: 'Havaskor', plate: 'var(--plate-green)', pct: 20 },
  { id: 'intermediate', name: 'O‘rta', plate: 'var(--plate-yellow)', pct: 50 },
  { id: 'advanced', name: 'Ilg‘or', plate: 'var(--plate-blue)', pct: 80 },
  { id: 'elite', name: 'Elita', plate: 'var(--plate-red)', pct: 95 },
] as const;

/** [Boshlovchi, Havaskor, O'rta, Ilg'or, Elita] — tana vazniga nisbat (pull-up: takror) */
const RATIOS: Record<LiftId, Record<Sex, number[]>> = {
  squat: { male: [0.75, 1.25, 1.5, 2.25, 2.75], female: [0.5, 0.75, 1.25, 1.75, 2.25] },
  bench: { male: [0.5, 0.75, 1.25, 1.5, 2.0], female: [0.3, 0.5, 0.75, 1.1, 1.45] },
  deadlift: { male: [1.0, 1.5, 2.0, 2.5, 3.0], female: [0.75, 1.0, 1.5, 2.0, 2.5] },
  ohp: { male: [0.4, 0.55, 0.8, 1.05, 1.35], female: [0.2, 0.35, 0.5, 0.7, 0.95] },
  row: { male: [0.5, 0.75, 1.0, 1.5, 1.75], female: [0.3, 0.45, 0.7, 0.95, 1.25] },
  pullup: { male: [1, 7, 13, 21, 30], female: [1, 2, 6, 12, 19] },
};

export const LIFTS: { id: LiftId; name: string; exerciseId: string }[] = [
  { id: 'squat', name: 'O‘tirib-turish', exerciseId: 'back-squat' },
  { id: 'bench', name: 'Yotib jim', exerciseId: 'bench-press' },
  { id: 'deadlift', name: 'O‘lik tortish', exerciseId: 'deadlift' },
  { id: 'ohp', name: 'Tik turib jim', exerciseId: 'ohp' },
  { id: 'row', name: 'Shtanga tortish', exerciseId: 'barbell-row' },
  { id: 'pullup', name: 'Turnikda tortilish', exerciseId: 'pull-up' },
];

export const liftByExercise = (exId: string) => LIFTS.find((l) => l.exerciseId === exId);

/** Shu tana vazni va jins uchun har darajaning chegarasi (kg yoki takror) */
export function thresholds(lift: LiftId, sex: Sex, bodyKg: number): number[] {
  const r = RATIOS[lift][sex];
  if (lift === 'pullup') return r;
  const ref = sex === 'male' ? 80 : 60;
  const k = Math.pow(ref / Math.max(35, bodyKg), 1 / 3);
  return r.map((x) => Math.round(x * k * bodyKg * 2) / 2);
}

export interface LiftLevel {
  lift: LiftId;
  /** taxminiy 1RM (kg) yoki eng ko'p takror (pull-up) */
  value: number;
  /** 0 — Boshlovchidan past, 1..5 — daraja; kasr — keyingisiga qadar yo'l */
  score: number;
  level: number;
  /** foydalanuvchilarning taxminan necha foizidan kuchli */
  percentile: number;
  next?: { name: string; need: number };
  thresholds: number[];
}

export function liftLevel(lift: LiftId, value: number, sex: Sex, bodyKg: number): LiftLevel {
  const th = thresholds(lift, sex, bodyKg);
  let level = 0;
  while (level < th.length && value >= th[level]) level++;
  const lo = level === 0 ? 0 : th[level - 1];
  const hi = level < th.length ? th[level] : th[th.length - 1] * 1.2;
  const frac = Math.max(0, Math.min(1, (value - lo) / Math.max(0.01, hi - lo)));
  const pcts = [0, ...LEVELS.map((l) => l.pct), 99];
  const percentile = Math.round(pcts[level] + (pcts[level + 1] - pcts[level]) * frac);
  return {
    lift,
    value,
    score: level + (level < th.length ? frac : 0),
    level,
    percentile,
    next: level < th.length ? { name: LEVELS[level].name, need: Math.max(0, th[level] - value) } : undefined,
    thresholds: th,
  };
}

/** Oxirgi `days` kundagi eng yaxshi taxminiy 1RM (RIR bo'lsa — RPE jadvali bo'yicha) yoki eng ko'p takror */
export function bestRecent(exId: string, logs: WorkoutLog[], days = 120, now = Date.now()): number {
  const from = now - days * 86400000;
  let best = 0;
  for (const l of logs) {
    if (!l.finishedAt || new Date(l.startedAt).getTime() < from) continue;
    for (const e of l.exercises) {
      if (e.exerciseId !== exId) continue;
      for (const s of e.sets) {
        if (!s.done || s.warmup) continue;
        const v = exId === 'pull-up' ? s.reps : s.reps > 12 ? 0 : s.rir !== undefined ? e1rmFromSet(s.kg, s.reps, s.rir) : epley(s.kg, s.reps);
        if (v > best) best = v;
      }
    }
  }
  return Math.round(best * 10) / 10;
}

export function strengthProfile(logs: WorkoutLog[], sex: Sex, bodyKg: number) {
  return LIFTS.map((l) => {
    const v = bestRecent(l.exerciseId, logs);
    return { ...l, data: v > 0 ? liftLevel(l.id, v, sex, bodyKg) : null, thresholds: thresholds(l.id, sex, bodyKg) };
  });
}
