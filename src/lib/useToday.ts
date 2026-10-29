import { useEffect, useMemo, useState } from 'react';
import { EXERCISE_MAP } from '../data/exercises';
import { MUSCLES } from '../data/catalog';
import { mesoPerWeek, mesoState, type MesoState } from '../engine/meso';
import { rotateLinear } from '../engine/program';
import { suggest, type Suggestion } from '../engine/progression';
import { useStore } from '../store/useStore';
import type { PlannedExercise, Program, WorkoutDay } from '../types';
import { isoDate, startOfWeek, weekdayIdx } from './date';

export function useMeso(): MesoState | null {
  const program = useStore((s) => s.program);
  const logs = useStore((s) => s.logs);
  const level = useStore((s) => s.profile?.level ?? 'beginner');
  const daysPerWeek = useStore((s) => s.profile?.daysPerWeek);
  return useMemo(() => (program ? mesoState(program, logs, level, mesoPerWeek(program, daysPerWeek ? { daysPerWeek } : null)) : null), [program, logs, level, daysPerWeek]);
}

/** Shu haftadagi kunlar: chiziqli dasturda A/B navbati haftadan haftaga almashadi (id va hafta kuni o'zgarmaydi) */
export function weekDays(program: Program | null, meso: MesoState | null): WorkoutDay[] {
  return (program?.days ?? []).map((d) => (program && meso ? rotateLinear(program, d, meso.absWeek) : d));
}

/**
 * Bugungi sana (YYYY-MM-DD): yarim tunda va ilovaga qaytilganda (fon rejimidan) yangilanadi —
 * ilova kechasi ochiq qolsa ham "bugun" eskirmaydi.
 */
export function useDateKey(): string {
  const [key, setKey] = useState(() => isoDate());
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const update = () => setKey(isoDate());
    const arm = () => {
      clearTimeout(timer);
      const now = new Date();
      const next = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 1);
      timer = setTimeout(() => {
        update();
        arm();
      }, next.getTime() - now.getTime());
    };
    const onVisible = () => {
      if (document.visibilityState !== 'visible') return;
      update();
      arm();
    };
    arm();
    document.addEventListener('visibilitychange', onVisible);
    window.addEventListener('focus', onVisible);
    return () => {
      clearTimeout(timer);
      document.removeEventListener('visibilitychange', onVisible);
      window.removeEventListener('focus', onVisible);
    };
  }, []);
  return key;
}

export function useToday() {
  const program = useStore((s) => s.program);
  const logs = useStore((s) => s.logs);
  const readiness = useStore((s) => s.readiness);
  const createdAt = useStore((s) => s.profile?.createdAt);
  const meso = useMeso();
  const dateKey = useDateKey();
  return useMemo(() => {
    const now = new Date(dateKey + 'T12:00:00');
    const today = weekdayIdx(now);
    const ws = startOfWeek(now);
    const weekLogs = logs.filter((l) => l.finishedAt && new Date(l.startedAt) >= ws);
    const doneDays = new Set(weekLogs.map((l) => weekdayIdx(new Date(l.startedAt))));
    const doneDayIds = new Set(weekLogs.map((l) => l.dayId).filter(Boolean) as string[]);
    const days = weekDays(program, meso).sort((a, b) => a.weekday - b.weekday);
    const todayDay = days.find((d) => d.weekday === today) ?? null;
    const todayLogs = logs.filter((l) => l.finishedAt && isoDate(new Date(l.startedAt)) === dateKey);
    // bugun dastur kuni bo'lsa — erkin mashg'ulot uni "bajarilgan" qilmaydi (rejadagi mashq ko'rinib turadi)
    const doneToday = todayDay ? todayLogs.some((l) => !!l.dayId) : todayLogs.length > 0;
    const trainedToday = todayLogs.length > 0;
    // bugun reja bo‘lmasa — shu haftada hali bajarilmagan birinchi kun (o‘tkazib yuborilganini tiklash).
    // Faqat ro'yxatdan o'tish / dastur boshlanishidan keyingi kunlar: yangi foydalanuvchiga "o'tkazib yubordingiz" deyilmaydi.
    const start = [program?.startDate, createdAt ? isoDate(new Date(createdAt)) : undefined].filter(Boolean).sort().pop() ?? '';
    const dayDate = (w: number) => isoDate(new Date(ws.getFullYear(), ws.getMonth(), ws.getDate() + w));
    const missed = days.find((d) => d.weekday < today && !doneDayIds.has(d.id) && dayDate(d.weekday) >= start) ?? null;
    const nextDay = days.find((d) => d.weekday > today) ?? days[0] ?? null;
    const week = meso ? meso.week + 1 : 1;
    const deload = meso?.deload ?? false;
    const readinessToday = readiness[dateKey];
    return { today, todayDay, doneToday, trainedToday, doneDays, doneDayIds, days, missed, nextDay, week, deload, readinessToday, weekLogs, meso, dateKey };
  }, [program, logs, readiness, meso, createdAt, dateKey]);
}

/** Blok holatidan tavsiya konteksti: hafta, blok uzunligi va (chiziqli progressiyadan tashqari) haftalik RIR */
export function mesoCtx(meso: MesoState | null, program: Program | null) {
  return {
    deload: meso?.deload ?? false,
    rir: meso && !meso.deload && program?.method !== 'linear' ? meso.rir : undefined,
    week: meso?.week,
    mesoWeeks: program?.mesoWeeks,
    program: program ?? undefined,
    perWeek: meso?.perWeek,
  };
}

/** Mashg‘ulot uchun har bir mashq bo‘yicha bugungi tavsiya */
export function useDayPlan(day: WorkoutDay | null): { pe: PlannedExercise; sug: Suggestion }[] {
  const logs = useStore((s) => s.logs);
  const profile = useStore((s) => s.profile);
  const setDeltaRaw = useStore((s) => s.setDelta);
  const setDeltaMeso = useStore((s) => s.setDeltaMeso);
  const dateKey = useDateKey();
  const readiness = useStore((s) => s.readiness[dateKey]);
  const program = useStore((s) => s.program);
  const barKg = useStore((s) => s.settings.barKg);
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
        // %1RM / chiziqli sxemadagi asosiy mashqlarning seti blok rejasi bo'yicha — fikr yordamchi mashqqa tushadi
        const delta = pe.scheme || used.has(g) ? 0 : (setDelta[g] ?? 0);
        if (!pe.scheme) used.add(g);
        const sug = suggest(ex, pe, logs, {
          bodyKg: profile.weightKg,
          sex: profile.sex,
          level: profile.level,
          ...mesoCtx(meso, program),
          readiness,
          setDelta: delta,
          barKg,
          equipment: profile.equipment,
        });
        return { pe, sug };
      });
  }, [day, profile, logs, setDeltaRaw, setDeltaMeso, readiness, meso, program, barKg]);
}
