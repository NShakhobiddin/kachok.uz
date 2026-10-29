// Ilova holati: qurilmada saqlanadi (offline). Har bir set darhol saqlanadi — ma’lumot yo‘qolmaydi.
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { exById } from '../data/exercises';
import { estimateMinutes, generateProgram, manualPlanned, weeklyVolume } from '../engine/program';
import { mesoPerWeek, mesoState, setChange, type MuscleFeedback } from '../engine/meso';
import { clampKcalAdjust } from '../engine/nutrition';
import { detectPRs } from '../engine/stats';
import { isoDate } from '../lib/date';
import type { BodyEntry, ExerciseLog, FoodEntry, MuscleGroup, PlannedExercise, Profile, Program, SetLog, WorkoutDay, WorkoutLog } from '../types';
import { MUSCLES, mrvAt } from '../data/catalog';
import type { PR } from '../engine/stats';
import { DEFAULT_SETTINGS, sanitizeData } from './sanitize';

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
  /** boshlanishdagi mashqlar (dasturga faqat shu mashg'ulotda qilingan o'zgarishlar yoziladi) */
  startIds?: string[];
  /** qaysi dastur bo'yicha boshlangan (qayta tuzilgan dasturga eski reja yozilmasin) */
  programId?: string;
  /** mashg'ulot paytidagi almashtirishlar va qo'shimchalar */
  swaps?: { from: string; to: string }[];
  added?: string[];
  /** oxirgi bajarilgan set vaqti (unutilgan mashg'ulot davomiyligi uchun) */
  lastSetAt?: number;
}

/** Mashg'ulotda qilingan, dasturga yozish mumkin bo'lgan o'zgarishlar */
export interface WorkoutEdits {
  swaps: { from: string; to: string }[];
  added: PlannedExercise[];
}

/** Faqat almashtirish va qo'shimchalar; dastur kunidagi boshqa tahrirlar (o'chirish, tartib) tegilmaydi */
export function workoutEdits(a: ActiveWorkout, program: Program | null): WorkoutEdits | null {
  if (!a.startIds || !a.log.dayId || !program || (a.programId && program.id !== a.programId)) return null;
  const day = program.days.find((d) => d.id === a.log.dayId);
  if (!day) return null;
  // a→b, b→c zanjiri: a→c; qo'shilgan mashq almashtirilsa — yangisi qo'shilgan hisoblanadi
  const addedIds = new Set(a.added ?? []);
  const map = new Map<string, string>();
  for (const { from, to } of a.swaps ?? []) {
    if (addedIds.has(from)) {
      addedIds.delete(from);
      addedIds.add(to);
      continue;
    }
    const origin = [...map].find(([, v]) => v === from)?.[0] ?? from;
    map.set(origin, to);
  }
  const has = (id: string) => day.exercises.some((p) => p.exerciseId === id);
  const swaps = [...map].filter(([from, to]) => from !== to && has(from) && !has(to)).map(([from, to]) => ({ from, to }));
  const added = a.plan.filter((p) => addedIds.has(p.exerciseId) && !has(p.exerciseId) && !swaps.some((s) => s.to === p.exerciseId));
  const uniqAdded = [...new Map(added.map((p) => [p.exerciseId, p])).values()];
  return swaps.length || uniqAdded.length ? { swaps, added: uniqAdded } : null;
}

/** Unutilgan mashg'ulot: oxirgi setdan keyin shuncha vaqt o'tsa, davomiylik shu yerda kesiladi */
const FORGOT_AFTER_MS = 10 * 60 * 1000;
const MAX_WORKOUT_MS = 4 * 3600 * 1000;

export function workoutEnd(a: Pick<ActiveWorkout, 'log' | 'lastSetAt'>, now = Date.now()): number {
  const start = new Date(a.log.startedAt).getTime();
  let end = now;
  if (a.lastSetAt && now - a.lastSetAt > FORGOT_AFTER_MS) end = a.lastSetAt + FORGOT_AFTER_MS;
  return Math.max(start, Math.min(end, start + MAX_WORKOUT_MS));
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
  /** qaysi akkauntniki (boshqa akkauntga kirilsa — boshidan) */
  uid?: string;
  /** serverdagi oxirgi o'qilgan o'zgarish raqami */
  cursor: number;
  /** har bir hujjatning oxirgi sinxronlangan xeshi */
  hashes: Record<string, string>;
  /** hujjat versiyasi vaqti (ziddiyatda eng yangisi yutadi) */
  stamps: Record<string, number>;
  /** qurilmada oxirgi marta qachon o'zgartirilgan (oflayn tahrir ham to'g'ri vaqt bilan yuborilsin) */
  edited?: Record<string, number>;
  /** serverdagi oxirgi ko'rilgan nusxa (ovqat: yozuv id lari, meta: qiymatlar) — uch tomonlama birlashtirish uchun */
  base?: Record<string, unknown>;
  /** zaxiradan tiklangandan keyin: birinchi o'qishda qurilmadagi nusxa ustun */
  forceLocal?: boolean;
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
  /** tuzatish oxirgi marta qachon o'zgartirilgan (YYYY-MM-DD) — haftalik tekshiruv shundan keyingi vaznga qaraydi */
  kcalAdjustAt?: string;
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
  /** qo'lda yangi kun: bo'sh, mashqlari keyin tanlanadi; id qaytaradi */
  addDay: (weekday: number, title: string) => string | null;
  removeDay: (dayId: string) => void;

  startWorkout: (day: WorkoutDay | null, plan: PlannedExercise[], readiness?: number, initial?: ExerciseLog[]) => void;
  setActiveIndex: (i: number) => void;
  updateSet: (exIdx: number, setIdx: number, patch: Partial<SetLog>) => void;
  addSet: (exIdx: number, set?: Partial<SetLog>) => void;
  removeSet: (exIdx: number, setIdx: number) => void;
  swapActive: (exIdx: number, newId: string) => void;
  /** mashg'ulot paytida bo'g'imda og'riq — tarixga yoziladi, keyingi safar ogohlantirish chiqadi */
  markPain: (exerciseId: string) => void;
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
  applyWorkoutToDay: (dayId: string, edits: WorkoutEdits) => void;
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
  kcalAdjustAt: undefined as string | undefined,
  setDelta: {},
  setDeltaMeso: undefined as number | undefined,
  seenAchievements: [] as string[],
  lastPRs: [] as PR[],
  settings: { ...DEFAULT_SETTINGS } as Settings,
  account: null as Account | null,
  sync: { cursor: 0, hashes: {}, stamps: {}, status: 'idle' } as SyncState,
  seenNotes: [] as string[],
  programAck: undefined as string | undefined,
  exNotes: {} as Record<string, string>,
};

export const INITIAL_SYNC: SyncState = { cursor: 0, hashes: {}, stamps: {}, status: 'idle' };

const uid = () => Math.random().toString(36).slice(2, 10);
const rotated = (program: Program | null, day: WorkoutDay | null) => {
  const stored = day && program?.days.find((d) => d.id === day.id);
  return !!stored && stored.exercises.map((e) => e.exerciseId).join() !== day.exercises.map((e) => e.exerciseId).join();
};

function mapDay(program: Program | null, dayId: string, fn: (d: WorkoutDay) => WorkoutDay): Program | null {
  if (!program) return program;
  return {
    ...program,
    days: program.days.map((d) => {
      if (d.id !== dayId) return d;
      const nd = fn(d);
      return { ...nd, estMin: estimateMinutes(nd.exercises) };
    }),
  };
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
      swapExercise: (dayId, index, newId) => set({ program: mapDay(get().program, dayId, (d) => ({ ...d, exercises: d.exercises.map((e, i) => (i === index ? { ...e, exerciseId: newId } : e)) })) }),
      updatePlanned: (dayId, index, patch) => set({ program: mapDay(get().program, dayId, (d) => ({ ...d, exercises: d.exercises.map((e, i) => (i === index ? { ...e, ...patch } : e)) })) }),
      removePlanned: (dayId, index) => set({ program: mapDay(get().program, dayId, (d) => ({ ...d, exercises: d.exercises.filter((_, i) => i !== index) })) }),
      addPlanned: (dayId, exId) => {
        const ex = exById(exId);
        if (!ex) return;
        const pe = manualPlanned(ex, get().profile);
        set({ program: mapDay(get().program, dayId, (d) => ({ ...d, exercises: [...d.exercises, pe] })) });
      },
      // shu hafta kunida boshqa kun bo'lsa — o'rin almashadi (ikki kun bitta kunga tushmasin)
      moveDay: (dayId, weekday) => {
        const program = get().program;
        const moving = program?.days.find((d) => d.id === dayId);
        if (!program || !moving || moving.weekday === weekday) return;
        set({ program: { ...program, days: program.days.map((d) => (d.id === dayId ? { ...d, weekday } : d.weekday === weekday ? { ...d, weekday: moving.weekday } : d)) } });
      },
      addDay: (weekday, title) => {
        const program = get().program;
        if (!program) return null;
        const day: WorkoutDay = { id: uid(), title, focus: 'O‘zim tanlagan mashqlar', weekday, exercises: [], estMin: estimateMinutes([]) };
        set({ program: { ...program, days: [...program.days, day] } });
        return day.id;
      },
      removeDay: (dayId) => {
        const program = get().program;
        if (program && program.days.length > 1) set({ program: { ...program, days: program.days.filter((d) => d.id !== dayId) } });
      },

      startWorkout: (day, plan, readiness, initialEx) => {
        const exercises: ExerciseLog[] = initialEx ?? plan.map((pe) => ({ exerciseId: pe.exerciseId, sets: Array.from({ length: pe.sets }, () => ({ kg: 0, reps: 0, done: false })) }));
        set({
          active: {
            log: { id: uid(), dayId: day?.id, title: day?.title ?? 'Erkin mashg‘ulot', startedAt: new Date().toISOString(), durationMin: 0, exercises, readiness },
            index: 0,
            restEndsAt: null,
            restTotal: 0,
            readiness,
            plan,
            // A/B navbati bilan almashgan kun (chiziqli dastur) — shablondan farq qiladi, dasturga yozilmaydi
            startIds: rotated(get().program, day) ? undefined : plan.map((p) => p.exerciseId),
            programId: day ? get().program?.id : undefined,
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
        set({ active: { ...a, log: { ...a.log, exercises }, ...(patch.done ? { lastSetAt: Date.now() } : {}) } });
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
      // bajarilgan setlar o'chmaydi: eski mashq shu setlar bilan qoladi, yangisi qolgan setlar bilan undan keyin qo'yiladi
      swapActive: (exIdx, newId) => {
        const a = get().active;
        const cur = a?.log.exercises[exIdx];
        if (!a || !cur || cur.exerciseId === newId) return;
        const done = cur.sets.filter((s) => s.done);
        const fresh = (n: number) => Array.from({ length: Math.max(1, n) }, () => ({ kg: 0, reps: 0, done: false }));
        const pe = a.plan[exIdx] ?? manualPlanned(exById(newId)!, get().profile);
        const swaps = [...(a.swaps ?? []), { from: cur.exerciseId, to: newId }];
        if (!done.length) {
          const exercises = a.log.exercises.map((e, i) => (i !== exIdx ? e : { exerciseId: newId, sets: fresh(e.sets.length) }));
          const plan = a.plan.map((p, i) => (i === exIdx ? { ...p, exerciseId: newId } : p));
          set({ active: { ...a, plan, swaps, log: { ...a.log, exercises } } });
          return;
        }
        const left = cur.sets.length - done.length;
        const exercises = [...a.log.exercises];
        exercises.splice(exIdx, 1, { ...cur, sets: done }, { exerciseId: newId, sets: fresh(left) });
        const plan = [...a.plan];
        plan.splice(exIdx + 1, 0, { ...pe, exerciseId: newId, sets: Math.max(1, left) });
        set({ active: { ...a, plan, swaps, index: exIdx + 1, log: { ...a.log, exercises } } });
      },
      markPain: (exerciseId) => {
        const a = get().active;
        if (!a || a.log.painEx?.includes(exerciseId)) return;
        set({ active: { ...a, log: { ...a.log, painEx: [...(a.log.painEx ?? []), exerciseId] } } });
      },
      addActiveExercise: (exId) => {
        const a = get().active;
        const ex = exById(exId);
        if (!a || !ex) return;
        const pe = manualPlanned(ex, get().profile);
        set({
          active: {
            ...a,
            plan: [...a.plan, pe],
            added: [...(a.added ?? []), exId],
            index: a.log.exercises.length,
            log: { ...a.log, exercises: [...a.log.exercises, { exerciseId: exId, sets: Array.from({ length: pe.sets }, () => ({ kg: 0, reps: 0, done: false })) }] },
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
        const exercises = a.log.exercises.map((e) => ({ ...e, sets: e.sets.filter((s) => s.done) })).filter((e) => e.sets.length > 0);
        if (!exercises.length) {
          set({ active: null });
          return null;
        }
        // unutilgan mashg'ulot: oxirgi setdan ko'p o'tgan bo'lsa davomiylik shu yerda kesiladi (ko'pi bilan 4 soat)
        const end = workoutEnd(a);
        const finishedAt = new Date(end).toISOString();
        const durationMin = Math.max(1, Math.round((end - new Date(a.log.startedAt).getTime()) / 60000));
        const program = get().program;
        const profile = get().profile;
        const perWeek = program ? mesoPerWeek(program, profile) : 1;
        // yengillashtirish haftasida bajarilgan dastur mashg'uloti (shu mashg'ulotdan oldingi blok holati) — keyingi blok uchun tayanch bo'lmaydi
        const msNow = program && profile ? mesoState(program, get().logs, profile.level, perWeek) : null;
        const inProgram = !!(a.log.dayId && program?.days.some((d) => d.id === a.log.dayId));
        const log: WorkoutLog = {
          ...a.log,
          exercises,
          finishedAt,
          durationMin,
          muscleFb: fb?.muscles,
          painEx: fb ? (fb.pain.length ? fb.pain : undefined) : a.log.painEx,
          deload: msNow?.deload && inProgram ? true : undefined,
        };
        const prs = detectPRs(log, get().logs);
        const logs = [...get().logs, log];
        // RP uslubidagi moslashuv: har mushak uchun alohida — kam pump/oson/tez tiklanish → set qo'shiladi,
        // hali og'riyotgan yoki juda og'ir → kamayadi. Haftalik hajm MRV dan oshmaydi.
        const meso = program && profile ? mesoState(program, logs, profile.level, perWeek).meso : 0;
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
      setKcalAdjust: (n) => set({ kcalAdjust: clampKcalAdjust(n), kcalAdjustAt: isoDate() }),
      markAchievements: (ids) => set({ seenAchievements: Array.from(new Set([...get().seenAchievements, ...ids])) }),
      setSettings: (patch) => set({ settings: { ...get().settings, ...patch } }),
      // akkaunt va sinxron holati saqlanadi: tiklangan ma'lumot "hozir tahrirlangan" deb belgilanadi va bulutga yuboriladi,
      // bulutdagi (zaxirada yo'q) mashg'ulotlar o'chirilmaydi — qayta o'qilib qo'shiladi
      importData: (json) => {
        let d: unknown;
        try {
          d = JSON.parse(json);
        } catch {
          return false;
        }
        const res = sanitizeData(d, true);
        if (!res) return false;
        const data = res.data;
        const now = Date.now();
        const keys = [
          'profile:me',
          'program:current',
          'meta:state',
          ...data.logs.filter((l) => l.finishedAt).map((l) => `log:${l.id}`),
          ...data.body.map((b) => `body:${b.date}`),
          ...new Set(data.food.map((f) => `food:${f.date}`)),
        ];
        const sync = get().sync;
        set({
          ...data,
          active: null,
          lastPRs: [],
          sync: { ...sync, cursor: 0, hashes: {}, stamps: {}, base: {}, forceLocal: true, edited: { ...sync.edited, ...Object.fromEntries(keys.map((k) => [k, now])) } },
        });
        return true;
      },
      // qurilmadagi ma'lumotlar o'chiriladi; akkauntdan ham chiqiladi — bulutdagi nusxa saqlanib qoladi
      reset: () => set({ ...initial }),
      // chiqishda sinxron holati saqlanadi: qayta kirilganda oflayn yozilganlar yo'qolmaydi. Boshqa akkaunt — boshidan.
      setAccount: (a) => {
        const { sync, account } = get();
        if (!a) return set({ account: null, sync: { ...sync, uid: sync.uid ?? account?.user.id, status: 'idle', error: undefined } });
        const same = !sync.uid || sync.uid === a.user.id;
        set({ account: a, sync: same ? { ...sync, uid: a.user.id } : { ...INITIAL_SYNC, uid: a.user.id } });
      },
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
      // faqat mashq tanlovi saqlanadi (almashtirish va qo'shimcha): kunlik moslashuvlar (yengillashtirish, mushak fikri,
      // haftalik RIR) dasturga yozilmaydi, mashg'ulot paytida dasturda qilingan boshqa tahrirlar bosib ketilmaydi
      applyWorkoutToDay: (dayId, edits) =>
        set({
          program: mapDay(get().program, dayId, (d) => {
            let exercises = d.exercises.map((slot) => {
              const sw = edits.swaps.find((x) => x.from === slot.exerciseId);
              if (!sw) return slot;
              const keepScheme = slot.scheme && exById(slot.exerciseId)?.pattern === exById(sw.to)?.pattern;
              return { ...slot, exerciseId: sw.to, scheme: keepScheme ? slot.scheme : undefined };
            });
            for (const p of edits.added) if (!exercises.some((x) => x.exerciseId === p.exerciseId)) exercises = [...exercises, { ...p }];
            return { ...d, exercises };
          }),
        }),
    }),
    {
      name: 'kachok-v1',
      version: 1,
      // eski versiyada saqlangan haddan tashqari tuzatish chegaraga keltiriladi
      merge: (persisted, current) => {
        const p = (persisted ?? {}) as Partial<State>;
        return { ...current, ...p, kcalAdjust: clampKcalAdjust(typeof p.kcalAdjust === 'number' ? p.kcalAdjust : 0) };
      },
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
    kcalAdjustAt: s.kcalAdjustAt,
    setDelta: s.setDelta,
    setDeltaMeso: s.setDeltaMeso,
    seenAchievements: s.seenAchievements,
    settings: s.settings,
    exNotes: s.exNotes,
  };
  return JSON.stringify(data, null, 1);
}
