import { useMemo } from 'react';
import { EXERCISE_MAP } from '../data/exercises';
import { MUSCLES } from '../data/catalog';
import { mesoState, type MesoState } from '../engine/meso';
import { suggest, type Suggestion } from '../engine/progression';
import { useStore } from '../store/useStore';
import type { PlannedExercise, WorkoutDay } from '../types';
import { isoDate, startOfWeek, weekdayIdx } from './date';

export function useMeso(): MesoState | null {
  const program = useStore((s) => s.program);
  const logs = useStore((s) => s.logs);
  const level = useStore((s) => s.profile?.level ?? 'beginner');
  return useMemo(() => (program ? mesoState(program, logs, level) : null), [program, logs, level]);
}

export function useToday() {
  const program = useStore((s) => s.program);
  const logs = useStore((s) => s.logs);
  const readiness = useStore((s) => s.readiness);
  const meso = useMeso();
  return useMemo(() => {
    const today = weekdayIdx();
    const ws = startOfWeek();
    const weekLogs = logs.filter((l) => l.finishedAt && new Date(l.startedAt) >= ws);
    const doneDays = new Set(weekLogs.map((l) => weekdayIdx(new Date(l.startedAt))));
    const doneDayIds = new Set(weekLogs.map((l) => l.dayId).filter(Boolean) as string[]);
    const days = [...(program?.days ?? [])].sort((a, b) => a.weekday - b.weekday);
    const todayDay = days.find((d) => d.weekday === today) ?? null;
    const doneToday = logs.some((l) => l.finishedAt && isoDate(new Date(l.startedAt)) === isoDate());
    // bugun reja bo‘lmasa — shu haftada hali bajarilmagan birinchi kun (o‘tkazib yuborilganini tiklash)
    const missed = days.find((d) => d.weekday < today && !doneDayIds.has(d.id)) ?? null;
    const nextDay = days.find((d) => d.weekday > today) ?? days[0] ?? null;
    const week = meso ? meso.week + 1 : 1;
    const deload = meso?.deload ?? false;
    const readinessToday = readiness[isoDate()];
    return { today, todayDay, doneToday, doneDays, doneDayIds, days, missed, nextDay, week, deload, readinessToday, weekLogs, meso };
  }, [program, logs, readiness, meso]);
}

/** Mashg‘ulot uchun har bir mashq bo‘yicha bugungi tavsiya */
export function useDayPlan(day: WorkoutDay | null): { pe: PlannedExercise; sug: Suggestion }[] {
  const logs = useStore((s) => s.logs);
  const profile = useStore((s) => s.profile);
  const setDeltaRaw = useStore((s) => s.setDelta);
  const setDeltaMeso = useStore((s) => s.setDeltaMeso);
  const readiness = useStore((s) => s.readiness[isoDate()]);
  const meso = useMeso();
  return useMemo(() => {
    if (!day || !profile) return [];
    // mushak fikri faqat shu blok ichida amal qiladi; har mushakka sessiyada bitta set qo'shiladi/olinadi
    const setDelta = meso && setDeltaMeso === meso.meso ? setDeltaRaw : {};
    const used = new Set<string>();
    return day.exercises
      .filter((pe) => EXERCISE_MAP[pe.exerciseId])
      .map((pe) => {
        const ex = EXERCISE_MAP[pe.exerciseId];
        const g = MUSCLES[ex.primary[0]].group;
        const delta = used.has(g) ? 0 : (setDelta[g] ?? 0);
        used.add(g);
        const sug = suggest(ex, pe, logs, {
          bodyKg: profile.weightKg,
          sex: profile.sex,
          level: profile.level,
          deload: meso?.deload ?? false,
          rir: meso && !meso.deload ? meso.rir : undefined,
          readiness,
          setDelta: delta,
        });
        return { pe, sug };
      });
  }, [day, profile, logs, setDeltaRaw, setDeltaMeso, readiness, meso]);
}
