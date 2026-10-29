// Mezotsikl (blok) periodizatsiyasi — Renaissance Periodization (Israetel, Hoffmann) va Helms uslubida:
// har hafta zaxira (RIR) kamayadi va setlar mushak fikriga qarab oshadi, blok oxirida yengillashtirish (deload).
// Hafta kalendar bo'yicha emas, bajarilgan mashg'ulotlar soni bo'yicha o'tadi — o'tkazib yuborilgan hafta blokni buzmaydi.
import type { Level, MuscleGroup, Profile, Program, WorkoutLog } from '../types';

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

type MesoProgram = Pick<Program, 'days' | 'startDate' | 'mesoWeeks'>;

/** Shu dastur bo'yicha bajarilgan mashg'ulotlar, vaqt tartibida (eng eskisi birinchi) */
function programLogs(program: MesoProgram, logs: WorkoutLog[]): WorkoutLog[] {
  const ids = new Set(program.days.map((d) => d.id));
  const start = program.startDate;
  return logs.filter((l) => l.finishedAt && l.dayId && ids.has(l.dayId) && l.startedAt.slice(0, 10) >= start).sort((a, b) => a.startedAt.localeCompare(b.startedAt));
}

export function programSessions(program: MesoProgram, logs: WorkoutLog[]) {
  return programLogs(program, logs).length;
}

/**
 * Blok haftalarini sanash uchun barqaror "haftadagi mashg'ulotlar soni".
 * Dasturdagi kunlar sonidan olinsa, kun qo'shilganda/olib tashlanganda o'tgan barcha mashg'ulotlar qayta bo'linib,
 * blok haftasi sakraydi. Shuning uchun o'zi tuzilgan dasturda — profildagi kunlar soni (generator shu bo'yicha tuzadi),
 * murabbiy dasturida — dasturdagi kunlar soni.
 */
export function mesoPerWeek(program: Pick<Program, 'days' | 'coach'>, profile?: Pick<Profile, 'daysPerWeek'> | null): number {
  if (!program.coach && profile?.daysPerWeek) return Math.min(6, Math.max(2, Math.round(profile.daysPerWeek)));
  return Math.max(1, program.days.length);
}

/** perWeek berilmasa — dasturdagi kunlar soni (eski xatti-harakat); barqaror qiymat uchun mesoPerWeek() */
export function mesoState(program: Program, logs: WorkoutLog[], level: Level, perWeek?: number): MesoState {
  const pw = Math.max(1, Math.round(perWeek ?? program.days.length) || 1);
  const done = programSessions(program, logs);
  const absWeek = Math.floor(done / pw);
  const meso = Math.floor(absWeek / program.mesoWeeks);
  const week = absWeek % program.mesoWeeks;
  return { meso, week, absWeek, deload: week === program.mesoWeeks - 1, sessionsInWeek: done % pw, perWeek: pw, rir: weekRir(week, program.mesoWeeks, level) };
}

/**
 * Yengillashtirish (deload) haftasida bajarilgan mashg'ulotlar: logdagi `deload` belgisi bo'yicha, belgi bo'lmasa —
 * mesoState bilan bir xil hisob (mashg'ulot tartib raqami → blok haftasi). Bu mashg'ulotlar keyingi blok uchun tayanch bo'lmaydi.
 */
export function deloadLogIds(program: MesoProgram, logs: WorkoutLog[], perWeek?: number): Set<string> {
  const pw = Math.max(1, Math.round(perWeek ?? program.days.length) || 1);
  const out = new Set<string>();
  programLogs(program, logs).forEach((l, i) => {
    if (Math.floor(i / pw) % program.mesoWeeks === program.mesoWeeks - 1) out.add(l.id);
  });
  // saqlangan belgi hisobdan ustun
  for (const l of logs) {
    if (l.deload === true) out.add(l.id);
    else if (l.deload === false) out.delete(l.id);
  }
  return out;
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
