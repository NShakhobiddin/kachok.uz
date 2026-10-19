// Statistika: haftalik tahlil, rekordlar, mushak tiklanishi, tushunchalar (insights).
import { EXERCISE_MAP } from '../data/exercises';
import { GROUPS, GROUP_ORDER, MUSCLES, WEEKLY_TARGET } from '../data/catalog';
import { addDays, fmtDuration, startOfWeek } from '../lib/date';
import type { MuscleGroup, MuscleId, Profile, WorkoutLog } from '../types';
import { addVolume } from './program';
import { e1rm } from './progression';

export const finished = (logs: WorkoutLog[]) => logs.filter((l) => l.finishedAt);

export function logVolume(l: WorkoutLog): number {
  return l.exercises.reduce((a, e) => a + e.sets.filter((s) => s.done && !s.warmup).reduce((b, s) => b + s.kg * s.reps, 0), 0);
}

export function logSets(l: WorkoutLog): number {
  return l.exercises.reduce((a, e) => a + e.sets.filter((s) => s.done && !s.warmup).length, 0);
}

export interface WeekSummary {
  start: Date;
  workouts: number;
  minutes: number;
  volume: number;
  sets: number;
  groups: Record<MuscleGroup, number>;
  days: Set<number>;
}

export function weekSummary(logs: WorkoutLog[], start: Date): WeekSummary {
  const end = addDays(start, 7);
  const inWeek = finished(logs).filter((l) => {
    const d = new Date(l.startedAt);
    return d >= start && d < end;
  });
  const groups = Object.fromEntries(GROUP_ORDER.map((g) => [g, 0])) as Record<MuscleGroup, number>;
  for (const l of inWeek)
    for (const e of l.exercises) {
      const ex = EXERCISE_MAP[e.exerciseId];
      const n = e.sets.filter((s) => s.done && !s.warmup).length;
      if (ex && n) addVolume(groups, ex, n);
    }
  return {
    start,
    workouts: inWeek.length,
    minutes: inWeek.reduce((a, l) => a + l.durationMin, 0),
    volume: inWeek.reduce((a, l) => a + logVolume(l), 0),
    sets: inWeek.reduce((a, l) => a + logSets(l), 0),
    groups,
    days: new Set(inWeek.map((l) => (new Date(l.startedAt).getDay() + 6) % 7)),
  };
}

export function lastWeeks(logs: WorkoutLog[], n: number, now = new Date()): WeekSummary[] {
  const cur = startOfWeek(now);
  return Array.from({ length: n }, (_, i) => weekSummary(logs, addDays(cur, -7 * (n - 1 - i))));
}

/** Haftalik seriya: kamida (rejadagi kunlar − 1) mashg‘ulot bo‘lgan ketma-ket haftalar */
export function weekStreak(logs: WorkoutLog[], daysPerWeek: number, now = new Date()): number {
  const need = Math.max(1, daysPerWeek - 1);
  let streak = 0;
  let w = startOfWeek(now);
  const cur = weekSummary(logs, w);
  if (cur.workouts >= need) streak++;
  for (let i = 0; i < 520; i++) {
    w = addDays(w, -7);
    if (weekSummary(logs, w).workouts >= need) streak++;
    else break;
  }
  return streak;
}

export interface PR {
  exerciseId: string;
  kind: 'e1rm' | 'weight';
  kg: number;
  reps: number;
  value: number;
  date: string;
}

/** Mashg‘ulotdagi yangi rekordlar (avvalgi barcha mashg‘ulotlarga nisbatan) */
export function detectPRs(log: WorkoutLog, previous: WorkoutLog[]): PR[] {
  const out: PR[] = [];
  for (const e of log.exercises) {
    const ex = EXERCISE_MAP[e.exerciseId];
    if (!ex || ex.loadType === 'bodyweight' || ex.loadType === 'band') continue;
    const prevSets = finished(previous)
      .filter((l) => l.id !== log.id)
      .flatMap((l) => l.exercises.filter((x) => x.exerciseId === e.exerciseId).flatMap((x) => x.sets.filter((s) => s.done && !s.warmup)));
    if (!prevSets.length) continue; // birinchi marta — rekord emas, boshlang‘ich nuqta
    const bestE = Math.max(...prevSets.map((s) => e1rm(s.kg, s.reps)));
    const bestKg = Math.max(...prevSets.map((s) => s.kg));
    const done = e.sets.filter((s) => s.done && !s.warmup && s.kg > 0);
    if (!done.length) continue;
    const top = done.reduce((a, b) => (e1rm(b.kg, b.reps) > e1rm(a.kg, a.reps) ? b : a));
    const topE = e1rm(top.kg, top.reps);
    const heaviest = done.reduce((a, b) => (b.kg > a.kg ? b : a));
    if (heaviest.kg > bestKg) out.push({ exerciseId: e.exerciseId, kind: 'weight', kg: heaviest.kg, reps: heaviest.reps, value: heaviest.kg, date: log.startedAt });
    else if (topE > bestE * 1.005) out.push({ exerciseId: e.exerciseId, kind: 'e1rm', kg: top.kg, reps: top.reps, value: Math.round(topE * 10) / 10, date: log.startedAt });
  }
  return out;
}

export function allPRs(logs: WorkoutLog[]): PR[] {
  const sorted = finished(logs).sort((a, b) => a.startedAt.localeCompare(b.startedAt));
  const out: PR[] = [];
  sorted.forEach((l, i) => out.push(...detectPRs(l, sorted.slice(0, i))));
  return out;
}

export function exerciseSeries(exId: string, logs: WorkoutLog[]) {
  return finished(logs)
    .sort((a, b) => a.startedAt.localeCompare(b.startedAt))
    .map((l) => {
      const e = l.exercises.find((x) => x.exerciseId === exId);
      const sets = e?.sets.filter((s) => s.done && !s.warmup) ?? [];
      if (!sets.length) return null;
      return {
        date: l.startedAt,
        e1rm: Math.round(Math.max(...sets.map((s) => e1rm(s.kg, s.reps))) * 10) / 10,
        topKg: Math.max(...sets.map((s) => s.kg)),
        reps: Math.max(...sets.map((s) => s.reps)),
        volume: sets.reduce((a, s) => a + s.kg * s.reps, 0),
      };
    })
    .filter((x): x is NonNullable<typeof x> => x !== null);
}

/**
 * Mushak tiklanishi (Fitbod g‘oyasi): har bir set mushakda "charchoq" qoldiradi,
 * u ~36 soatlik yarim yemirilish bilan kamayadi. 1 = to‘liq tiklangan.
 */
export function muscleRecovery(logs: WorkoutLog[], now = new Date()): Record<MuscleId, number> {
  const fatigue = Object.fromEntries(Object.keys(MUSCLES).map((m) => [m, 0])) as Record<MuscleId, number>;
  const HALF = 36;
  for (const l of finished(logs)) {
    const hours = (now.getTime() - new Date(l.finishedAt!).getTime()) / 3600000;
    if (hours > 24 * 6 || hours < 0) continue;
    const decay = Math.pow(0.5, hours / HALF);
    for (const e of l.exercises) {
      const ex = EXERCISE_MAP[e.exerciseId];
      const n = e.sets.filter((s) => s.done && !s.warmup).length;
      if (!ex || !n) continue;
      ex.primary.forEach((m) => (fatigue[m] += n * decay));
      ex.secondary.forEach((m) => (fatigue[m] += n * 0.4 * decay));
    }
  }
  const out = {} as Record<MuscleId, number>;
  (Object.keys(fatigue) as MuscleId[]).forEach((m) => (out[m] = Math.max(0, 1 - fatigue[m] / 8)));
  return out;
}

export interface Insight {
  tone: 'good' | 'warn' | 'info';
  title: string;
  text: string;
}

/** Haftalik mashq vaqti va hajmi tahlili */
export function weeklyInsights(logs: WorkoutLog[], profile: Profile, now = new Date()): Insight[] {
  const weeks = lastWeeks(logs, 5, now);
  const cur = weeks[weeks.length - 1];
  const prev = weeks[weeks.length - 2];
  const out: Insight[] = [];
  const planned = profile.daysPerWeek;

  if (cur.workouts === 0 && prev.workouts === 0) {
    out.push({ tone: 'info', title: 'Boshlash vaqti', text: "Bu va o‘tgan haftada mashg‘ulot yo‘q. 30 daqiqalik qisqa mashq ham hisobga kiradi — bugun boshlang." });
    return out;
  }
  const dayIdx = (now.getDay() + 6) % 7;
  if (cur.workouts === 0 && prev.workouts > 0) {
    out.push({
      tone: 'info',
      title: dayIdx <= 1 ? 'Yangi hafta boshlandi' : `Bu hafta hali mashq yo‘q`,
      text: `O‘tgan hafta: ${prev.workouts} ta mashg‘ulot, ${fmtDuration(prev.minutes)}. Shu sur’atni saqlang.`,
    });
  } else if (prev.minutes > 0) {
    const diff = Math.round(((cur.minutes - prev.minutes) / prev.minutes) * 100);
    out.push({
      tone: diff >= 0 ? 'good' : 'info',
      title: `Bu hafta ${fmtDuration(cur.minutes)}`,
      text: diff >= 0 ? `O‘tgan haftadan ${diff}% ko‘p. Barqarorlik — natijaning asosi.` : `O‘tgan haftadan ${Math.abs(diff)}% kam. Hafta hali tugamagan — ulgurasiz.`,
    });
  } else {
    out.push({ tone: 'good', title: `Bu hafta ${fmtDuration(cur.minutes)}`, text: `${cur.workouts} ta mashg‘ulot. Davom eting!` });
  }

  out.push(
    cur.workouts >= 2
      ? { tone: 'good', title: 'JSST me’yori bajarildi', text: "Haftasiga kamida 2 kun kuch mashqi — Jahon sog‘liqni saqlash tashkiloti tavsiyasi. Bu o‘lim xavfini 10–17% kamaytiradi." }
      : { tone: dayIdx >= 4 ? 'warn' : 'info', title: 'JSST me’yoriga yana ' + (2 - cur.workouts) + ' mashq', text: "Kattalar uchun haftasiga kamida 2 kun kuch mashqi tavsiya etiladi (WHO, 2020)." },
  );

  if (cur.workouts >= planned) out.push({ tone: 'good', title: 'Reja 100% bajarildi', text: `${planned} ta rejalashtirilgan mashg‘ulotning barchasi bajarildi.` });

  // Mushak guruhlari bo‘yicha hajm (oxirgi to‘liq hafta yoki joriy)
  const ref = cur.workouts >= Math.max(1, planned - 1) ? cur : prev;
  const low = GROUP_ORDER.filter((g) => ref.groups[g] > 0 && ref.groups[g] < WEEKLY_TARGET[g][0] * 0.7);
  const none = GROUP_ORDER.filter((g) => ref.groups[g] === 0 && g !== 'calves' && g !== 'core');
  const high = GROUP_ORDER.filter((g) => ref.groups[g] > WEEKLY_TARGET[g][1] * 1.2);
  if (none.length && ref.workouts > 0)
    out.push({ tone: 'warn', title: 'Ishlatilmagan mushaklar', text: `${none.map((g) => GROUPS[g].name).join(', ')} — bu hafta umuman ishlamadi. Muvozanat uchun qo‘shing.` });
  if (low.length)
    out.push({ tone: 'info', title: 'Hajm kam', text: `${low.map((g) => `${GROUPS[g].name} (${Math.round(ref.groups[g])} set)`).join(', ')}. O‘sish uchun haftasiga ~10 set tavsiya etiladi.` });
  if (high.length)
    out.push({ tone: 'warn', title: 'Hajm juda yuqori', text: `${high.map((g) => GROUPS[g].name).join(', ')}: tiklanishga e’tibor bering — ko‘proq har doim yaxshiroq emas.` });

  const avg = cur.workouts ? cur.minutes / cur.workouts : 0;
  if (avg > profile.sessionMin + 20)
    out.push({ tone: 'info', title: "Mashg‘ulot cho‘zilmoqda", text: `O‘rtacha ${Math.round(avg)} daqiqa (reja ${profile.sessionMin}). Dam olishni taymer bilan nazorat qiling.` });

  const avg4 = weeks.slice(0, 4).reduce((a, w) => a + w.workouts, 0) / 4;
  if (avg4 >= planned * 0.75 && weeks.slice(0, 4).every((w) => w.workouts > 0))
    out.push({ tone: 'good', title: 'Ajoyib barqarorlik', text: `So‘nggi 4 haftada o‘rtacha ${avg4.toFixed(1)} mashg‘ulot/hafta.` });
  return out;
}

export function totals(logs: WorkoutLog[]) {
  const f = finished(logs);
  return {
    workouts: f.length,
    minutes: f.reduce((a, l) => a + l.durationMin, 0),
    volume: f.reduce((a, l) => a + logVolume(l), 0),
    sets: f.reduce((a, l) => a + logSets(l), 0),
  };
}

/** Umumiy ko‘tarilgan og‘irlikni tanish narsalar bilan solishtirish */
export function volumeComparison(kg: number): { text: string; next?: string } {
  const items: [number, string][] = [
    [830, 'Damas'],
    [1500, 'Cobalt'],
    [6000, 'fil'],
    [12000, 'avtobus'],
    [40000, 'yuk mashinasi (fura)'],
    [150000, "ko‘k kit"],
    [400000, 'Boeing 747'],
  ];
  let best: [number, string] | null = null;
  for (const it of items) if (kg >= it[0]) best = it;
  const nxt = items.find((it) => kg < it[0]);
  if (!best) return { text: `${Math.round(kg)} kg`, next: nxt ? `${nxt[1]} — ${Math.round(nxt[0] - kg)} kg qoldi` : undefined };
  const times = kg / best[0];
  return {
    text: times >= 2 ? `${Math.floor(times)} ta ${best[1]}` : `bitta ${best[1]}`,
    next: nxt ? `${nxt[1]} — ${Math.round((nxt[0] - kg) / 100) / 10} t qoldi` : undefined,
  };
}
