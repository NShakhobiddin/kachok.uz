// Mezotsikl (blok) periodizatsiyasi — Renaissance Periodization (Israetel, Hoffmann) va Helms uslubida:
// har hafta zaxira (RIR) kamayadi va setlar mushak fikriga qarab oshadi, blok oxirida yengillashtirish (deload).
// Hafta kalendar bo'yicha emas, bajarilgan mashg'ulotlar soni bo'yicha o'tadi — o'tkazib yuborilgan hafta blokni buzmaydi.
import type { Level, MuscleGroup, Program, WorkoutLog } from '../types';

export interface MesoState {
  /** nechanchi blok (0 dan) */
  meso: number;
  /** blok ichidagi hafta (0 dan) */
  week: number;
  /** dastur boshidan beri to'liq haftalar */
  absWeek: number;
  deload: boolean;
  /** shu haftada bajarilgan mashg'ulotlar */
  sessionsInWeek: number;
  perWeek: number;
  /** shu hafta uchun maqsadli zaxira (RIR) */
  rir: number;
}

/** Bloklardagi haftalik RIR: 3 dan boshlanib darajaga qarab 2/1/0 gacha tushadi, oxirgi hafta — deload */
export function weekRir(week: number, mesoWeeks: number, level: Level): number {
  const acc = Math.max(1, mesoWeeks - 1);
  if (week >= acc) return 4;
  const end = level === 'beginner' ? 2 : level === 'intermediate' ? 1 : 0;
  if (acc === 1) return 3;
  return Math.round(3 - ((3 - end) * week) / (acc - 1));
}

export function mesoPlan(mesoWeeks: number, level: Level) {
  return Array.from({ length: mesoWeeks }, (_, w) => ({ week: w, rir: weekRir(w, mesoWeeks, level), deload: w === mesoWeeks - 1 }));
}

export function programSessions(program: Program, logs: WorkoutLog[]) {
  const ids = new Set(program.days.map((d) => d.id));
  const start = program.startDate;
  return logs.filter((l) => l.finishedAt && l.dayId && ids.has(l.dayId) && l.startedAt.slice(0, 10) >= start).length;
}

export function mesoState(program: Program, logs: WorkoutLog[], level: Level): MesoState {
  const perWeek = Math.max(1, program.days.length);
  const done = programSessions(program, logs);
  const absWeek = Math.floor(done / perWeek);
  const meso = Math.floor(absWeek / program.mesoWeeks);
  const week = absWeek % program.mesoWeeks;
  return { meso, week, absWeek, deload: week === program.mesoWeeks - 1, sessionsInWeek: done % perWeek, perWeek, rir: weekRir(week, program.mesoWeeks, level) };
}

/* ---------------- Mushak bo'yicha fikr (RP qoidalari) ---------------- */

export interface MuscleFeedback {
  /** 1 kam · 2 o'rtacha · 3 kuchli */
  pump: 1 | 2 | 3;
  /** 1 oson · 2 me'yor · 3 og'ir */
  work: 1 | 2 | 3;
  /** o'tgan mashg'ulotdan keyin: 1 og'rimadi · 2 erta o'tdi · 3 vaqtida o'tdi · 4 hali og'riyapti */
  recovery: 1 | 2 | 3 | 4;
}

/** Keyingi haftada shu mushak uchun set o'zgarishi: −1..+2 */
export function setChange(f: MuscleFeedback): number {
  if (f.recovery === 4) return -1;
  const score = (f.recovery <= 2 ? 1 : 0) + (f.pump === 1 ? 1 : 0) + (f.work === 1 ? 1 : f.work === 3 ? -1 : 0);
  if (score >= 2) return 2;
  if (score === 1) return 1;
  if (score === 0) return 0;
  return -1;
}

export const FB_TEXT = {
  pump: ['Kam', 'O‘rtacha', 'Kuchli'],
  work: ['Oson', 'Me’yor', 'Og‘ir'],
  recovery: ['Og‘rimadi', 'Erta o‘tdi', 'Vaqtida o‘tdi', 'Hali og‘riydi'],
} as const;

export type GroupDelta = Partial<Record<MuscleGroup, number>>;
