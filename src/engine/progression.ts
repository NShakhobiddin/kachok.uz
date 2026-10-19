// Progressiv yuklama: "ikki bosqichli progressiya" (avval takror, keyin vazn), yengillashtirish
// haftasi va kunlik tayyorgarlikka moslash. Har bir tavsiya sababi bilan ko‘rsatiladi.
import type { Exercise, Level, PlannedExercise, Sex, WorkoutLog } from '../types';
import { e1rmFromSet, loadFor, refE1rm, sessionE1rm } from './rpe';

export interface SetTarget {
  kg: number | null;
  reps: number;
}

export type SuggestKind = 'up' | 'same' | 'reps' | 'down' | 'first' | 'deload' | 'easy' | 'bodyweight';

export interface Suggestion {
  kg: number | null;
  reps: number;
  sets: number;
  rir: number;
  kind: SuggestKind;
  reason: string;
  estimated?: boolean;
  warmups: SetTarget[];
  last?: { date: string; sets: (SetTarget & { rir?: number })[] };
  /** o'tgan safar zaxira (RIR) yozilgan bo'lsa — taxminiy 1RM va vazn shu asosda hisoblangan */
  e1rm?: number;
  auto?: boolean;
}

/** Epley formulasi bo‘yicha 1 takrorli maksimum taxmini */
export function e1rm(kg: number, reps: number): number {
  if (!kg || reps <= 0) return 0;
  if (reps === 1) return kg;
  return kg * (1 + Math.min(reps, 12) / 30);
}

export function roundTo(kg: number, step: number): number {
  if (step <= 0) return Math.round(kg);
  return Math.round(kg / step) * step;
}

const KETTLEBELLS = [4, 6, 8, 10, 12, 14, 16, 20, 24, 28, 32, 36, 40, 48];

export function roundLoad(ex: Exercise, kg: number): number {
  if (ex.loadType === 'kettlebell') return KETTLEBELLS.reduce((a, b) => (Math.abs(b - kg) < Math.abs(a - kg) ? b : a));
  if (ex.loadType === 'barbell') return Math.max(ex.id.includes('curl') || ex.id.includes('skull') ? 10 : 20, roundTo(kg, 2.5));
  if (ex.loadType === 'dumbbell') return Math.max(1, kg < 10 ? roundTo(kg, 1) : roundTo(kg, 2));
  return Math.max(ex.increment || 1, roundTo(kg, ex.increment || 2.5));
}

/** Boshlang‘ich vazn taxmini (tana vazniga nisbatan, ~10 takror, 3 takror zaxira bilan) */
const START_RATIO: Record<string, [number, number]> = {
  'back-squat': [0.5, 0.35],
  'front-squat': [0.4, 0.28],
  'smith-squat': [0.4, 0.3],
  'goblet-squat': [0.15, 0.1],
  'leg-press': [1.0, 0.75],
  'hack-squat': [0.5, 0.35],
  deadlift: [0.6, 0.45],
  rdl: [0.45, 0.32],
  'db-rdl': [0.15, 0.1],
  'kb-swing': [0.16, 0.11],
  'back-extension': [0, 0],
  'split-squat': [0.08, 0.06],
  bulgarian: [0.07, 0.05],
  'step-up': [0.07, 0.05],
  'leg-extension': [0.3, 0.22],
  'leg-curl': [0.25, 0.18],
  'hip-thrust': [0.6, 0.5],
  'calf-raise': [0.1, 0.07],
  'bench-press': [0.45, 0.25],
  'db-bench': [0.15, 0.08],
  'machine-chest-press': [0.4, 0.22],
  'incline-db-press': [0.13, 0.07],
  'incline-bench': [0.38, 0.2],
  'cable-fly': [0.07, 0.04],
  'pec-deck': [0.3, 0.18],
  'db-fly': [0.07, 0.04],
  ohp: [0.3, 0.17],
  'db-shoulder-press': [0.1, 0.06],
  'machine-shoulder-press': [0.3, 0.17],
  'lateral-raise': [0.05, 0.03],
  'cable-lateral-raise': [0.04, 0.025],
  'face-pull': [0.18, 0.12],
  'barbell-row': [0.4, 0.25],
  'db-row': [0.18, 0.1],
  'cable-row': [0.45, 0.3],
  'chest-supported-row': [0.12, 0.07],
  'lat-pulldown': [0.5, 0.33],
  'db-shrug': [0.22, 0.14],
  'barbell-curl': [0.2, 0.12],
  'db-curl': [0.08, 0.05],
  'hammer-curl': [0.09, 0.05],
  'incline-curl': [0.06, 0.04],
  'cable-curl': [0.15, 0.1],
  pushdown: [0.25, 0.15],
  'overhead-extension': [0.15, 0.09],
  'skull-crusher': [0.2, 0.12],
  'close-grip-bench': [0.38, 0.2],
  'cable-crunch': [0.35, 0.25],
};

export function startingWeight(ex: Exercise, bodyKg: number, sex: Sex, level: Level): number | null {
  const r = START_RATIO[ex.id];
  if (!r || ex.loadType === 'bodyweight' || ex.loadType === 'band') return null;
  const ratio = sex === 'male' ? r[0] : r[1];
  if (!ratio) return null;
  const mult = level === 'beginner' ? 1 : level === 'intermediate' ? 1.25 : 1.5;
  return roundLoad(ex, bodyKg * ratio * mult);
}

/** Ushbu mashq bo‘yicha oxirgi mashg‘ulotlar (eng yangisi birinchi) */
export function exerciseHistory(exId: string, logs: WorkoutLog[]) {
  return logs
    .filter((l) => l.finishedAt)
    .map((l) => ({ date: l.startedAt, ex: l.exercises.find((e) => e.exerciseId === exId) }))
    .filter((x) => x.ex && x.ex.sets.some((s) => s.done && !s.warmup))
    .sort((a, b) => b.date.localeCompare(a.date))
    .map((x) => ({ date: x.date, sets: x.ex!.sets.filter((s) => s.done && !s.warmup) }));
}

export interface SuggestCtx {
  bodyKg: number;
  sex: Sex;
  level: Level;
  deload?: boolean;
  /** 1..5 — kunlik tayyorgarlik */
  readiness?: number;
  /** RP uslubidagi fikr-mulohaza asosida set o‘zgarishi */
  setDelta?: number;
  /** blok haftasiga ko'ra maqsadli zaxira (RIR) — rejadagidan ustun */
  rir?: number;
}

export function suggest(ex: Exercise, pe: PlannedExercise, logs: WorkoutLog[], ctx: SuggestCtx): Suggestion {
  const hist = exerciseHistory(ex.id, logs);
  let sets = Math.max(1, pe.sets + (ctx.setDelta ?? 0));
  let rir = ctx.rir ?? pe.rir;
  const out: Suggestion = { kg: null, reps: pe.repMin, sets, rir, kind: 'first', reason: '', warmups: [] };
  const last = hist[0];
  if (last) out.last = { date: last.date, sets: last.sets.map((s) => ({ kg: s.kg, reps: s.reps, rir: s.rir })) };

  const bodyweight = ex.loadType === 'bodyweight' && ex.increment === 0;

  if (!last) {
    const est = startingWeight(ex, ctx.bodyKg, ctx.sex, ctx.level);
    out.kg = est;
    out.estimated = est !== null;
    out.reps = pe.repMin;
    out.kind = bodyweight ? 'bodyweight' : 'first';
    out.reason = bodyweight
      ? `Birinchi marta: ${pe.repMin}–${pe.repMax} takror. Texnikaga e’tibor bering.`
      : est
        ? "Taxminiy boshlang‘ich vazn. Birinchi setdan so‘ng moslang: yana 2–3 marta bemalol qila olsangiz — to‘g‘ri tanlov."
        : "Birinchi marta: yengil vazn bilan texnikani sinang, 2–3 takror zaxira qoldiring.";
  } else {
    const top = last.sets.reduce((a, b) => (b.kg > a.kg || (b.kg === a.kg && b.reps > a.reps) ? b : a), last.sets[0]);
    const work = last.sets.filter((s) => s.kg === top.kg);
    const allTop = work.length >= Math.min(pe.sets, last.sets.length) && work.every((s) => s.reps >= pe.repMax);
    const anyMiss = work.some((s) => s.reps < pe.repMin);
    const prevMiss = hist[1]?.sets.some((s) => s.kg === top.kg && s.reps < pe.repMin);
    const minReps = Math.min(...work.map((s) => s.reps));

    if (bodyweight || ex.loadType === 'band') {
      out.kg = null;
      if (allTop) {
        out.reps = pe.repMax;
        out.kind = 'up';
        out.reason = `Barcha setlarda ${pe.repMax}+ takror — qiyinroq variantga o‘ting yoki og‘irlik qo‘shing.`;
      } else {
        out.reps = Math.min(pe.repMax, minReps + 1);
        out.kind = 'reps';
        out.reason = `O‘tgan safar ${minReps} takror. Bugun har setda +1 takrorga harakat qiling.`;
      }
    } else if (allTop) {
      const inc = Math.max(ex.increment, top.kg * 0.025);
      out.kg = roundLoad(ex, top.kg + inc);
      if (out.kg <= top.kg) out.kg = top.kg + ex.increment;
      out.reps = pe.repMin;
      out.kind = 'up';
      out.reason = `+${fmtKg(out.kg - top.kg)} kg: o‘tgan safar barcha setlarda ${pe.repMax} takror bajarildi.`;
    } else if (anyMiss && prevMiss) {
      out.kg = roundLoad(ex, top.kg * 0.9);
      out.reps = pe.repMin;
      out.kind = 'down';
      out.reason = "Ikki marta ketma-ket takrorlar yetmadi — vazn 10% kamaytirildi. Bu orqaga qadam emas, sakrash uchun tayyorgarlik.";
    } else if (anyMiss) {
      out.kg = top.kg;
      out.reps = pe.repMin;
      out.kind = 'same';
      out.reason = `Shu vaznda qoling va ${pe.repMin} takrorga yeting.`;
    } else {
      out.kg = top.kg;
      out.reps = Math.min(pe.repMax, minReps + 1);
      out.kind = 'reps';
      out.reason = `Vazn o‘sha — har setda +1 takror (maqsad ${pe.repMax}). Shunda keyingi safar vazn oshadi.`;
    }
  }

  // Avtoregulyatsiya: o'tgan safar har set qanchalik og'ir bo'lgani (RIR) ma'lum bo'lsa,
  // vazn taxminiy 1RM va RPE jadvalidan hisoblanadi (Helms 2016, Zourdos 2016)
  // 1RM: o'tgan mashg'ulot asosiy, lekin u "yomon kun" bo'lsa (o'rtachadan past) oxirgi 1–3 mashg'ulot EMA si olinadi
  const lastSession = last ? sessionE1rm(last.sets) : null;
  const lastE1 = lastSession ? Math.max(lastSession, refE1rm(hist.map((h) => h.sets)) ?? 0) : null;
  if (last && lastE1 && !bodyweight && ex.loadType !== 'band' && out.kg) {
    const best = last.sets.filter((x) => x.rir !== undefined).reduce((a, b) => (e1rmFromSet(b.kg, b.reps, b.rir) > e1rmFromSet(a.kg, a.reps, a.rir) ? b : a));
    const prevTop = Math.max(...last.sets.map((x) => x.kg));
    const raw = loadFor(lastE1, out.reps, rir);
    // haddan tashqari sakrash bo'lmasin: +5% / −10% (Helms, RTS amaliyoti)
    let kg = roundLoad(ex, Math.min(Math.max(prevTop * 1.05, prevTop + ex.increment), Math.max(prevTop * 0.9, raw)));
    // o'tgan safar reja bajarilgan bo'lsa (takror yetdi, zaxira maqsaddan kam emas) — vazn tushirilmaydi
    const topSets = last.sets.filter((x) => x.kg === prevTop);
    const met = topSets.every((x) => x.reps >= pe.repMin && (x.rir === undefined || x.rir >= rir - 0.5));
    if (met && kg < prevTop) kg = prevTop;
    out.kg = kg;
    out.e1rm = Math.round(lastE1 * 10) / 10;
    out.auto = true;
    out.kind = kg > prevTop ? 'up' : kg < prevTop ? 'down' : out.reps > Math.min(...last.sets.map((x) => x.reps)) ? 'reps' : 'same';
    out.reason = `O‘tgan safar: ${fmtKg(best.kg)}×${best.reps}, zaxira ${best.rir} → taxminiy 1RM ${Math.round(lastE1)} kg. Bugun ${out.reps} takror ${rir} zaxira bilan — ${fmtKg(kg)} kg.`;
  }

  // Yengillashtirish (deload) haftasi
  if (ctx.deload) {
    sets = Math.max(1, Math.round(sets * 0.5));
    rir = Math.max(4, rir + 2);
    if (out.kg) out.kg = roundLoad(ex, out.kg * 0.85);
    out.kind = 'deload';
    out.reason = "Yengillashtirish haftasi: kamroq set va yengilroq vazn. Charchoq ketadi, kuch keyingi bloklarda o‘sadi.";
  } else if (ctx.readiness !== undefined && ctx.readiness < 2.6) {
    sets = Math.max(1, sets - 1);
    rir = rir + 1;
    if (out.kg) out.kg = roundLoad(ex, out.kg * 0.95);
    out.kind = 'easy';
    out.reason = "Bugun tana charchagan: bitta set kamroq va biroz yengilroq. Mashqni o‘tkazib yubormaslikning o‘zi g‘alaba.";
  }
  out.sets = sets;
  out.rir = rir;
  out.warmups = warmupSets(ex, out.kg, out.reps);
  return out;
}

/**
 * Isinish zinapoyasi: og'ir setlar (≤5 takror) oldidan ko'proq, qisqa qadamlar; takrorlar ishchi setdan oshmaydi.
 * NSCA umumiy → maxsus isinish; RTS amaliyoti.
 */
export function warmupSets(ex: Exercise, kg: number | null, reps = 8): SetTarget[] {
  if (!kg || ex.mechanics !== 'compound') return [];
  if (ex.loadType === 'barbell') {
    if (kg < 30) return [{ kg: 20, reps: 10 }];
    const ladder = reps <= 5 ? [[0.4, 5], [0.6, 3], [0.75, 2], [0.85, 1]] : [[0.5, 5], [0.7, 3], [0.85, 2]];
    const w = ladder.map(([p, r]) => ({ kg: Math.max(20, roundTo(kg * p, 2.5)), reps: Math.min(r, reps) }));
    return dedupe([{ kg: 20, reps: 10 }, ...w]).filter((s) => (s.kg ?? 0) < kg);
  }
  if (ex.loadType === 'machine' || ex.loadType === 'cable') {
    return dedupe([0.5, 0.75].map((p, i) => ({ kg: roundLoad(ex, kg * p), reps: [10, 5][i] }))).filter((s) => (s.kg ?? 0) < kg);
  }
  if (ex.loadType === 'dumbbell' && kg >= 8) return [{ kg: roundLoad(ex, kg * 0.5), reps: 10 }];
  return [];
}

function dedupe(list: SetTarget[]): SetTarget[] {
  const seen = new Set<number>();
  return list.filter((s) => (s.kg === null || seen.has(s.kg) ? false : (seen.add(s.kg), true)));
}

export function fmtKg(n: number): string {
  return String(Math.round(n * 100) / 100);
}

export const PLATE_SET = [25, 20, 15, 10, 5, 2.5, 1.25] as const;

/** Shtanga disk kalkulyatori: bir tomonga qaysi disklar */
export function platesPerSide(total: number, bar = 20): { plates: number[]; rest: number } {
  let side = Math.max(0, (total - bar) / 2);
  const plates: number[] = [];
  for (const p of PLATE_SET) {
    while (side >= p - 1e-9) {
      plates.push(p);
      side -= p;
    }
  }
  return { plates, rest: Math.round(side * 2 * 100) / 100 };
}
