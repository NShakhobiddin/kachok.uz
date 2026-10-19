import { useMemo } from 'react';
import { EXERCISE_MAP } from '../data/exercises';
import { MUSCLES } from '../data/catalog';
import { isDeloadWeek, programWeek } from '../engine/program';
import { suggest, type Suggestion } from '../engine/progression';
import { useStore } from '../store/useStore';
import type { PlannedExercise, WorkoutDay } from '../types';
import { isoDate, startOfWeek, weekdayIdx } from './date';

export function useToday() {
  const program = useStore((s) => s.program);
  const logs = useStore((s) => s.logs);
  const readiness = useStore((s) => s.readiness);
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
    const week = program ? programWeek(program) + 1 : 1;
    const deload = program ? isDeloadWeek(program) : false;
    const readinessToday = readiness[isoDate()];
    return { today, todayDay, doneToday, doneDays, doneDayIds, days, missed, nextDay, week, deload, readinessToday, weekLogs };
  }, [program, logs, readiness]);
}

/** Mashg‘ulot uchun har bir mashq bo‘yicha bugungi tavsiya */
export function useDayPlan(day: WorkoutDay | null): { pe: PlannedExercise; sug: Suggestion }[] {
  const logs = useStore((s) => s.logs);
  const profile = useStore((s) => s.profile);
  const program = useStore((s) => s.program);
  const setDelta = useStore((s) => s.setDelta);
  const readiness = useStore((s) => s.readiness[isoDate()]);
  return useMemo(() => {
    if (!day || !profile) return [];
    const deload = program ? isDeloadWeek(program) : false;
    return day.exercises
      .filter((pe) => EXERCISE_MAP[pe.exerciseId])
      .map((pe) => {
        const ex = EXERCISE_MAP[pe.exerciseId];
        const g = MUSCLES[ex.primary[0]].group;
        const sug = suggest(ex, pe, logs, { bodyKg: profile.weightKg, sex: profile.sex, level: profile.level, deload, readiness, setDelta: setDelta[g] });
        return { pe, sug };
      });
  }, [day, profile, logs, program, setDelta, readiness]);
}
