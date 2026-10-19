// Ilova holati: qurilmada saqlanadi (offline). Har bir set darhol saqlanadi — ma’lumot yo‘qolmaydi.
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { exById } from '../data/exercises';
import { generateProgram } from '../engine/program';
import { detectPRs } from '../engine/stats';
import { isoDate } from '../lib/date';
import type { BodyEntry, ExerciseLog, MuscleGroup, PlannedExercise, Profile, Program, SetLog, WorkoutDay, WorkoutLog } from '../types';
import { MUSCLES } from '../data/catalog';
import type { PR } from '../engine/stats';

export interface ActiveWorkout {
  log: WorkoutLog;
  /** hozirgi mashq indeksi */
  index: number;
  restEndsAt: number | null;
  restTotal: number;
  readiness?: number;
  plan: PlannedExercise[];
}

export interface Settings {
  sound: boolean;
  vibrate: boolean;
  showRir: boolean;
  barKg: number;
}

interface State {
  profile: Profile | null;
  program: Program | null;
  logs: WorkoutLog[];
  active: ActiveWorkout | null;
  body: BodyEntry[];
  water: Record<string, number>;
  readiness: Record<string, number>;
  lessonsDone: string[];
  kcalAdjust: number;
  setDelta: Partial<Record<MuscleGroup, number>>;
  seenAchievements: string[];
  lastPRs: PR[];
  settings: Settings;

  setProfile: (p: Profile, regenerate?: boolean) => void;
  updateProfile: (patch: Partial<Profile>) => void;
  regenerate: () => void;
  setProgram: (p: Program) => void;
  swapExercise: (dayId: string, index: number, newId: string) => void;
  updatePlanned: (dayId: string, index: number, patch: Partial<PlannedExercise>) => void;
  removePlanned: (dayId: string, index: number) => void;
  addPlanned: (dayId: string, exId: string) => void;
  moveDay: (dayId: string, weekday: number) => void;

  startWorkout: (day: WorkoutDay | null, plan: PlannedExercise[], readiness?: number, initial?: ExerciseLog[]) => void;
  setActiveIndex: (i: number) => void;
  updateSet: (exIdx: number, setIdx: number, patch: Partial<SetLog>) => void;
  addSet: (exIdx: number, set?: Partial<SetLog>) => void;
  removeSet: (exIdx: number, setIdx: number) => void;
  swapActive: (exIdx: number, newId: string) => void;
  addActiveExercise: (exId: string) => void;
  startRest: (sec: number) => void;
  adjustRest: (deltaSec: number) => void;
  stopRest: () => void;
  finishWorkout: (feedback?: WorkoutLog['feedback']) => WorkoutLog | null;
  discardWorkout: () => void;
  deleteLog: (id: string) => void;

  addBody: (e: BodyEntry) => void;
  addWater: (ml: number) => void;
  setReadiness: (score: number) => void;
  completeLesson: (id: string) => void;
  setKcalAdjust: (n: number) => void;
  markAchievements: (ids: string[]) => void;
  setSettings: (patch: Partial<Settings>) => void;
  importData: (json: string) => boolean;
  reset: () => void;
}

const initial = {
  profile: null,
  program: null,
  logs: [] as WorkoutLog[],
  active: null,
  body: [] as BodyEntry[],
  water: {} as Record<string, number>,
  readiness: {} as Record<string, number>,
  lessonsDone: [] as string[],
  kcalAdjust: 0,
  setDelta: {},
  seenAchievements: [] as string[],
  lastPRs: [] as PR[],
  settings: { sound: true, vibrate: true, showRir: true, barKg: 20 },
};

const uid = () => Math.random().toString(36).slice(2, 10);

function mapDay(program: Program | null, dayId: string, fn: (d: WorkoutDay) => WorkoutDay): Program | null {
  if (!program) return program;
  return { ...program, days: program.days.map((d) => (d.id === dayId ? fn(d) : d)) };
}

export const useStore = create<State>()(
  persist(
    (set, get) => ({
      ...initial,

      setProfile: (p, regenerate = true) => {
        set({ profile: p });
        if (regenerate) set({ program: generateProgram(p) });
        const today = isoDate();
        if (!get().body.some((b) => b.date === today)) set({ body: [...get().body, { date: today, weightKg: p.weightKg }] });
      },
      updateProfile: (patch) => {
        const p = get().profile;
        if (p) set({ profile: { ...p, ...patch } });
      },
      regenerate: () => {
        const p = get().profile;
        if (p) set({ program: generateProgram(p), setDelta: {} });
      },
      setProgram: (program) => set({ program }),
      swapExercise: (dayId, index, newId) =>
        set({ program: mapDay(get().program, dayId, (d) => ({ ...d, exercises: d.exercises.map((e, i) => (i === index ? { ...e, exerciseId: newId } : e)) })) }),
      updatePlanned: (dayId, index, patch) =>
        set({ program: mapDay(get().program, dayId, (d) => ({ ...d, exercises: d.exercises.map((e, i) => (i === index ? { ...e, ...patch } : e)) })) }),
      removePlanned: (dayId, index) => set({ program: mapDay(get().program, dayId, (d) => ({ ...d, exercises: d.exercises.filter((_, i) => i !== index) })) }),
      addPlanned: (dayId, exId) => {
        const ex = exById(exId);
        if (!ex) return;
        const pe: PlannedExercise = { exerciseId: exId, sets: 3, repMin: ex.mechanics === 'compound' ? 8 : 10, repMax: ex.mechanics === 'compound' ? 12 : 15, rir: 2, restSec: ex.mechanics === 'compound' ? 120 : 75 };
        set({ program: mapDay(get().program, dayId, (d) => ({ ...d, exercises: [...d.exercises, pe] })) });
      },
      moveDay: (dayId, weekday) => set({ program: mapDay(get().program, dayId, (d) => ({ ...d, weekday })) }),

      startWorkout: (day, plan, readiness, initialEx) => {
        const exercises: ExerciseLog[] =
          initialEx ?? plan.map((pe) => ({ exerciseId: pe.exerciseId, sets: Array.from({ length: pe.sets }, () => ({ kg: 0, reps: 0, done: false })) }));
        set({
          active: {
            log: { id: uid(), dayId: day?.id, title: day?.title ?? "Erkin mashg‘ulot", startedAt: new Date().toISOString(), durationMin: 0, exercises, readiness },
            index: 0,
            restEndsAt: null,
            restTotal: 0,
            readiness,
            plan,
          },
        });
      },
      setActiveIndex: (i) => {
        const a = get().active;
        if (a) set({ active: { ...a, index: i } });
      },
      updateSet: (exIdx, setIdx, patch) => {
        const a = get().active;
        if (!a) return;
        const exercises = a.log.exercises.map((e, i) => (i !== exIdx ? e : { ...e, sets: e.sets.map((s, j) => (j === setIdx ? { ...s, ...patch } : s)) }));
        set({ active: { ...a, log: { ...a.log, exercises } } });
      },
      addSet: (exIdx, s) => {
        const a = get().active;
        if (!a) return;
        const exercises = a.log.exercises.map((e, i) => {
          if (i !== exIdx) return e;
          const last = e.sets[e.sets.length - 1];
          return { ...e, sets: [...e.sets, { kg: last?.kg ?? 0, reps: last?.reps ?? 0, done: false, ...s }] };
        });
        set({ active: { ...a, log: { ...a.log, exercises } } });
      },
      removeSet: (exIdx, setIdx) => {
        const a = get().active;
        if (!a) return;
        const exercises = a.log.exercises.map((e, i) => (i !== exIdx ? e : { ...e, sets: e.sets.filter((_, j) => j !== setIdx) }));
        set({ active: { ...a, log: { ...a.log, exercises } } });
      },
      swapActive: (exIdx, newId) => {
        const a = get().active;
        if (!a) return;
        const exercises = a.log.exercises.map((e, i) => (i !== exIdx ? e : { exerciseId: newId, sets: e.sets.map(() => ({ kg: 0, reps: 0, done: false })) }));
        const plan = a.plan.map((p, i) => (i === exIdx ? { ...p, exerciseId: newId } : p));
        set({ active: { ...a, plan, log: { ...a.log, exercises } } });
      },
      addActiveExercise: (exId) => {
        const a = get().active;
        if (!a) return;
        const ex = exById(exId);
        const pe: PlannedExercise = { exerciseId: exId, sets: 3, repMin: 8, repMax: 12, rir: 2, restSec: ex?.mechanics === 'compound' ? 120 : 75 };
        set({
          active: {
            ...a,
            plan: [...a.plan, pe],
            index: a.log.exercises.length,
            log: { ...a.log, exercises: [...a.log.exercises, { exerciseId: exId, sets: Array.from({ length: 3 }, () => ({ kg: 0, reps: 0, done: false })) }] },
          },
        });
      },
      startRest: (sec) => {
        const a = get().active;
        if (a) set({ active: { ...a, restEndsAt: Date.now() + sec * 1000, restTotal: sec } });
      },
      adjustRest: (d) => {
        const a = get().active;
        if (a?.restEndsAt) set({ active: { ...a, restEndsAt: Math.max(Date.now(), a.restEndsAt + d * 1000), restTotal: Math.max(5, a.restTotal + d) } });
      },
      stopRest: () => {
        const a = get().active;
        if (a) set({ active: { ...a, restEndsAt: null } });
      },
      finishWorkout: (feedback) => {
        const a = get().active;
        if (!a) return null;
        const exercises = a.log.exercises
          .map((e) => ({ ...e, sets: e.sets.filter((s) => s.done) }))
          .filter((e) => e.sets.length > 0);
        if (!exercises.length) {
          set({ active: null });
          return null;
        }
        const finishedAt = new Date().toISOString();
        const durationMin = Math.max(1, Math.round((Date.now() - new Date(a.log.startedAt).getTime()) / 60000));
        const log: WorkoutLog = { ...a.log, exercises, finishedAt, durationMin, feedback };
        const prs = detectPRs(log, get().logs);
        // RP uslubidagi moslashuv: og‘riq/charchoq bo‘lsa — set kamayadi, kuchli "pump" va yengil — oshadi
        const setDelta = { ...get().setDelta };
        if (feedback) {
          const groups = new Set<MuscleGroup>();
          exercises.forEach((e) => exById(e.exerciseId)?.primary.forEach((m) => groups.add(MUSCLES[m].group)));
          let d = 0;
          if (feedback.joints >= 2 || feedback.soreness >= 3) d = -1;
          else if (feedback.pump >= 3 && feedback.soreness <= 1) d = 1;
          groups.forEach((g) => (setDelta[g] = Math.max(-2, Math.min(2, (setDelta[g] ?? 0) + d))));
        }
        set({ logs: [...get().logs, log], active: null, lastPRs: prs, setDelta });
        return log;
      },
      discardWorkout: () => set({ active: null }),
      deleteLog: (id) => set({ logs: get().logs.filter((l) => l.id !== id) }),

      addBody: (e) => {
        const rest = get().body.filter((b) => b.date !== e.date);
        const prev = get().body.find((b) => b.date === e.date);
        set({ body: [...rest, { ...prev, ...e }].sort((a, b) => a.date.localeCompare(b.date)) });
        if (e.weightKg) {
          const p = get().profile;
          if (p) set({ profile: { ...p, weightKg: e.weightKg } });
        }
      },
      addWater: (ml) => {
        const d = isoDate();
        set({ water: { ...get().water, [d]: Math.max(0, (get().water[d] ?? 0) + ml) } });
      },
      setReadiness: (score) => set({ readiness: { ...get().readiness, [isoDate()]: score } }),
      completeLesson: (id) => {
        if (!get().lessonsDone.includes(id)) set({ lessonsDone: [...get().lessonsDone, id] });
      },
      setKcalAdjust: (n) => set({ kcalAdjust: n }),
      markAchievements: (ids) => set({ seenAchievements: Array.from(new Set([...get().seenAchievements, ...ids])) }),
      setSettings: (patch) => set({ settings: { ...get().settings, ...patch } }),
      importData: (json) => {
        try {
          const d = JSON.parse(json);
          if (!d || typeof d !== 'object' || !('profile' in d)) return false;
          set({ ...initial, ...d, active: null });
          return true;
        } catch {
          return false;
        }
      },
      reset: () => set({ ...initial }),
    }),
    {
      name: 'kachok-v1',
      version: 1,
      partialize: (s) => {
        const { lastPRs: _ignored, ...rest } = s;
        void _ignored;
        return rest as unknown as State;
      },
    },
  ),
);

export function exportData(): string {
  const s = useStore.getState();
  const data = {
    app: 'kachok',
    version: 1,
    exportedAt: new Date().toISOString(),
    profile: s.profile,
    program: s.program,
    logs: s.logs,
    body: s.body,
    water: s.water,
    readiness: s.readiness,
    lessonsDone: s.lessonsDone,
    kcalAdjust: s.kcalAdjust,
    setDelta: s.setDelta,
    seenAchievements: s.seenAchievements,
    settings: s.settings,
  };
  return JSON.stringify(data, null, 1);
}
