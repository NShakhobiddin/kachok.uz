// Ilova holati: qurilmada saqlanadi (offline). Har bir set darhol saqlanadi — ma’lumot yo‘qolmaydi.
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { exById } from '../data/exercises';
import { generateProgram, weeklyVolume } from '../engine/program';
import { mesoState, setChange, type MuscleFeedback } from '../engine/meso';
import { detectPRs } from '../engine/stats';
import { isoDate } from '../lib/date';
import type { BodyEntry, ExerciseLog, FoodEntry, MuscleGroup, PlannedExercise, Profile, Program, SetLog, WorkoutDay, WorkoutLog } from '../types';
import { MUSCLES, mrvAt } from '../data/catalog';
import type { PR } from '../engine/stats';

export interface FinishFeedback {
  muscles: Partial<Record<MuscleGroup, MuscleFeedback>>;
  pain: string[];
}

export interface ActiveWorkout {
  log: WorkoutLog;
  /** hozirgi mashq indeksi */
  index: number;
  restEndsAt: number | null;
  restTotal: number;
  readiness?: number;
  plan: PlannedExercise[];
}

export interface AccountUser {
  id: string;
  phone: string;
  name: string;
  role: 'athlete' | 'coach';
}

export interface Entitlements {
  pro: { active: boolean; until: string | null; trial: boolean };
  coach: { active: boolean; until: string | null };
}

export interface Account {
  user: AccountUser;
  access: string;
  refresh: string;
  entitlements?: Entitlements;
  coach?: { id: string; name: string } | null;
}

export interface SyncState {
  /** serverdagi oxirgi o'qilgan o'zgarish raqami */
  cursor: number;
  /** har bir hujjatning oxirgi sinxronlangan xeshi */
  hashes: Record<string, string>;
  /** hujjat versiyasi vaqti (ziddiyatda eng yangisi yutadi) */
  stamps: Record<string, number>;
  /** qurilmada oxirgi marta qachon o'zgartirilgan (oflayn tahrir ham to'g'ri vaqt bilan yuborilsin) */
  edited?: Record<string, number>;
  lastSyncAt?: number;
  status: 'idle' | 'syncing' | 'error';
  error?: string;
}

export interface Settings {
  sound: boolean;
  vibrate: boolean;
  showRir: boolean;
  barKg: number;
  /** kaloriya rejasida formula o'rniga kundalik va vazn asosidagi sarf (TDEE) */
  adaptiveTdee?: boolean;
}

interface State {
  profile: Profile | null;
  program: Program | null;
  logs: WorkoutLog[];
  active: ActiveWorkout | null;
  body: BodyEntry[];
  /** ovqat kundaligi */
  food: FoodEntry[];
  water: Record<string, number>;
  readiness: Record<string, number>;
  lessonsDone: string[];
  kcalAdjust: number;
  setDelta: Partial<Record<MuscleGroup, number>>;
  /** setDelta qaysi blokka tegishli (yangi blokda qayta boshlanadi) */
  setDeltaMeso?: number;
  seenAchievements: string[];
  lastPRs: PR[];
  settings: Settings;
  account: Account | null;
  sync: SyncState;
  /** ko'rilgan murabbiy xabarlari va dastur yangilanishi */
  seenNotes: string[];
  programAck?: string;
  /** mashq bo'yicha doimiy eslatmalar ("o'rindiq 4-teshik, keng ushlash") */
  exNotes: Record<string, string>;

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
  finishWorkout: (fb?: FinishFeedback) => WorkoutLog | null;
  discardWorkout: () => void;
  deleteLog: (id: string) => void;

  addBody: (e: BodyEntry) => void;
  addFood: (e: FoodEntry) => void;
  removeFood: (id: string) => void;
  addWater: (ml: number) => void;
  setReadiness: (score: number) => void;
  completeLesson: (id: string) => void;
  setKcalAdjust: (n: number) => void;
  markAchievements: (ids: string[]) => void;
  setSettings: (patch: Partial<Settings>) => void;
  importData: (json: string) => boolean;
  reset: () => void;
  setAccount: (a: Account | null) => void;
  patchAccount: (patch: Partial<Account>) => void;
  setSync: (patch: Partial<SyncState>) => void;
  markNote: (id: string) => void;
  ackProgram: (at: string) => void;
  setExNote: (exId: string, text: string) => void;
  /** mashg'ulotdagi almashtirish/qo'shimchalarni dastur kuniga yozish */
  applyWorkoutToDay: (dayId: string, plan: PlannedExercise[]) => void;
}

const initial = {
  profile: null,
  program: null,
  logs: [] as WorkoutLog[],
  active: null,
  body: [] as BodyEntry[],
  food: [] as FoodEntry[],
  water: {} as Record<string, number>,
  readiness: {} as Record<string, number>,
  lessonsDone: [] as string[],
  kcalAdjust: 0,
  setDelta: {},
  seenAchievements: [] as string[],
  lastPRs: [] as PR[],
  settings: { sound: true, vibrate: true, showRir: true, barKg: 20 },
  account: null as Account | null,
  sync: { cursor: 0, hashes: {}, stamps: {}, status: 'idle' } as SyncState,
  seenNotes: [] as string[],
  programAck: undefined as string | undefined,
  exNotes: {} as Record<string, string>,
};

export const INITIAL_SYNC: SyncState = { cursor: 0, hashes: {}, stamps: {}, status: 'idle' };

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
      finishWorkout: (fb) => {
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
        const log: WorkoutLog = { ...a.log, exercises, finishedAt, durationMin, muscleFb: fb?.muscles, painEx: fb?.pain?.length ? fb.pain : undefined };
        const prs = detectPRs(log, get().logs);
        const logs = [...get().logs, log];
        // RP uslubidagi moslashuv: har mushak uchun alohida — kam pump/oson/tez tiklanish → set qo'shiladi,
        // hali og'riyotgan yoki juda og'ir → kamayadi. Haftalik hajm MRV dan oshmaydi.
        const program = get().program;
        const profile = get().profile;
        const meso = program && profile ? mesoState(program, logs, profile.level).meso : 0;
        const setDelta = get().setDeltaMeso === meso ? { ...get().setDelta } : {};
        if (fb?.muscles && program) {
          const vol = weeklyVolume(program);
          for (const [g, f] of Object.entries(fb.muscles) as [MuscleGroup, MuscleFeedback][]) {
            const freq = Math.max(1, program.days.filter((d) => d.exercises.some((pe) => exById(pe.exerciseId)?.primary.some((m) => MUSCLES[m].group === g))).length);
            const maxUp = Math.max(0, Math.floor((mrvAt(g, freq) - vol[g]) / freq));
            setDelta[g] = Math.max(-2, Math.min(maxUp, (setDelta[g] ?? 0) + setChange(f)));
          }
        }
        set({ logs, active: null, lastPRs: prs, setDelta, setDeltaMeso: meso });
        return log;
      },
      discardWorkout: () => set({ active: null }),
      deleteLog: (id) => set({ logs: get().logs.filter((l) => l.id !== id) }),

      addBody: (e) => {
        const rest = get().body.filter((b) => b.date !== e.date);
        const prev = get().body.find((b) => b.date === e.date);
        set({ body: [...rest, { ...prev, ...e }].sort((a, b) => a.date.localeCompare(b.date)) });
        // profil vazni — faqat eng so'nggi o'lchov bo'yicha
        if (e.weightKg && !get().body.some((b) => b.weightKg && b.date > e.date)) {
          const p = get().profile;
          if (p) set({ profile: { ...p, weightKg: e.weightKg } });
        }
      },
      addFood: (e) => set({ food: [...get().food, e] }),
      removeFood: (id) => set({ food: get().food.filter((x) => x.id !== id) }),
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
      // qurilmadagi ma'lumotlar o'chiriladi; akkauntdan ham chiqiladi — bulutdagi nusxa saqlanib qoladi
      reset: () => set({ ...initial }),
      setAccount: (a) => set(a ? { account: a } : { account: null, sync: { ...INITIAL_SYNC } }),
      patchAccount: (patch) => {
        const a = get().account;
        if (a) set({ account: { ...a, ...patch } });
      },
      setSync: (patch) => set({ sync: { ...get().sync, ...patch } }),
      markNote: (id) => set({ seenNotes: Array.from(new Set([...get().seenNotes, id])).slice(-50) }),
      ackProgram: (at) => set({ programAck: at }),
      setExNote: (exId, text) => {
        const next = { ...get().exNotes };
        if (text.trim()) next[exId] = text.trim().slice(0, 200);
        else delete next[exId];
        set({ exNotes: next });
      },
      // faqat mashq tanlovi saqlanadi: kunlik moslashuvlar (yengillashtirish, mushak fikri, haftalik RIR) dasturga yozilmaydi
      applyWorkoutToDay: (dayId, plan) =>
        set({
          program: mapDay(get().program, dayId, (d) => ({
            ...d,
            exercises: plan.map((p, i) => {
              const same = d.exercises.find((x) => x.exerciseId === p.exerciseId);
              if (same) return { ...same };
              const slot = d.exercises[i];
              if (!slot) return { ...p };
              const keepScheme = slot.scheme && exById(slot.exerciseId)?.pattern === exById(p.exerciseId)?.pattern;
              return { ...slot, exerciseId: p.exerciseId, scheme: keepScheme ? slot.scheme : undefined };
            }),
          })),
        }),
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
    food: s.food,
    water: s.water,
    readiness: s.readiness,
    lessonsDone: s.lessonsDone,
    kcalAdjust: s.kcalAdjust,
    setDelta: s.setDelta,
    seenAchievements: s.seenAchievements,
    settings: s.settings,
    exNotes: s.exNotes,
  };
  return JSON.stringify(data, null, 1);
}
