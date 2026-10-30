// Progressiv yuklama: "ikki bosqichli progressiya" (avval takror, keyin vazn), yengillashtirish
// haftasi va kunlik tayyorgarlikka moslash. Har bir tavsiya sababi bilan ko‘rsatiladi.
import { MUSCLES } from '../data/catalog';
import type { EquipmentId, Exercise, Level, PlannedExercise, Program, Sex, SetLog, WorkoutLog } from '../types';
import { deloadLogIds } from './meso';
import { blockWeek, LOWER_GROUPS } from './methods';
import { e1rmFromSet, loadFor, pct1rm, refE1rm, sessionE1rm } from './rpe';

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

export const KETTLEBELLS = [4, 6, 8, 10, 12, 14, 16, 20, 24, 28, 32, 36, 40, 48];
export const DEFAULT_BAR_KG = 20;

/** Shtanga mashqidagi eng yengil yuk — grif (sozlamadagi og'irlik; bitseps/EZ grifi ~10 kg) */
export function barFor(ex: Exercise, barKg = DEFAULT_BAR_KG): number {
  const bar = barKg > 0 ? barKg : DEFAULT_BAR_KG;
  return ex.id.includes('curl') || ex.id.includes('skull') ? Math.min(10, bar) : bar;
}

/** Jihozda bor yukka yaxlitlash: shtanga — grif + 2×1.25 kg qadam, girya — mavjud o'lchamlar, gantel — 1/2 kg */
export function roundLoad(ex: Exercise, kg: number, barKg = DEFAULT_BAR_KG): number {
  if (ex.loadType === 'kettlebell') return KETTLEBELLS.reduce((a, b) => (Math.abs(b - kg) < Math.abs(a - kg) ? b : a));
  if (ex.loadType === 'barbell') {
    const bar = barFor(ex, barKg);
    return Math.max(bar, bar + roundTo(kg - bar, 2.5));
  }
  if (ex.loadType === 'dumbbell') return Math.max(1, kg < 10 ? roundTo(kg, 1) : roundTo(kg, 2));
  return Math.max(ex.increment || 1, roundTo(kg, ex.increment || 2.5));
}

/** from dan kamida inc og'irroq eng yaqin mavjud yuk; og'irrog'i bo'lmasa (eng og'ir girya) — from */
export function nextLoad(ex: Exercise, from: number, inc: number, barKg = DEFAULT_BAR_KG): number {
  if (ex.loadType === 'kettlebell') return KETTLEBELLS.find((k) => k >= from + inc - 1e-9) ?? KETTLEBELLS.find((k) => k > from) ?? from;
  const step = Math.max(ex.increment, 0.5);
  for (let i = 0; i < 12; i++) {
    const kg = roundLoad(ex, from + inc + i * step, barKg);
    if (kg > from) return kg;
  }
  return from;
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

/** Boshlang'ich vazn taxmini, yaxlitlanmagan (kg) — hisob-kitoblar shundan, yaxlitlash faqat yakuniy yukda */
export function startEstimate(ex: Exercise, bodyKg: number, sex: Sex, level: Level): number | null {
  const r = START_RATIO[ex.id];
  if (!r || ex.loadType === 'bodyweight' || ex.loadType === 'band') return null;
  const ratio = sex === 'male' ? r[0] : r[1];
  if (!ratio) return null;
  const mult = level === 'beginner' ? 1 : level === 'intermediate' ? 1.25 : 1.5;
  return bodyKg * ratio * mult;
}

export function startingWeight(ex: Exercise, bodyKg: number, sex: Sex, level: Level, barKg = DEFAULT_BAR_KG): number | null {
  const est = startEstimate(ex, bodyKg, sex, level);
  return est === null ? null : roundLoad(ex, est, barKg);
}

/** Ushbu mashq bo‘yicha oxirgi mashg‘ulotlar (eng yangisi birinchi); exclude — tashlab ketiladigan log id lari */
export function exerciseHistory(exId: string, logs: WorkoutLog[], exclude?: ReadonlySet<string>) {
  return logs
    .filter((l) => l.finishedAt && !exclude?.has(l.id))
    .map((l) => ({ date: l.startedAt, ex: l.exercises.find((e) => e.exerciseId === exId) }))
    .filter((x) => x.ex && x.ex.sets.some((s) => s.done && !s.warmup))
    .sort((a, b) => b.date.localeCompare(a.date))
    .map((x) => ({ date: x.date, sets: x.ex!.sets.filter((s) => s.done && !s.warmup) }));
}

type History = ReturnType<typeof exerciseHistory>;

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
  /** blok ichidagi hafta (0 dan) va blok uzunligi — kuch blokidagi %1RM uchun */
  week?: number;
  mesoWeeks?: number;
  /** joriy dastur va blokdagi haftalik mashg'ulotlar soni (MesoState.perWeek) — yengillashtirish haftasidagi
   *  mashg'ulotlarni tayanchdan chiqarish uchun (logdagi `deload` belgisi har doim hisobga olinadi) */
  program?: Pick<Program, 'days' | 'startDate' | 'mesoWeeks'>;
  perWeek?: number;
  /** sozlamadagi grif og'irligi (kg) */
  barKg?: number;
  /** foydalanuvchi jihozlari: gantelsiz bo'lsa, jihozsiz mashqlar (boldir ko'tarish) tana vazni bilan */
  equipment?: EquipmentId[];
}

/**
 * Progressiya tayanchi: yengillashtirish (deload) haftasidagi mashg'ulotlarsiz tarix — aks holda yengil vazn
 * keyingi blokning boshlang'ich nuqtasiga aylanib qoladi. Faqat deload mashg'ulotlari bo'lsa — to'liq tarix.
 */
export function baselineHistory(exId: string, logs: WorkoutLog[], ctx: Pick<SuggestCtx, 'program' | 'perWeek'> = {}): History {
  const skip = ctx.program ? deloadLogIds(ctx.program, logs, ctx.perWeek) : new Set(logs.filter((l) => l.deload).map((l) => l.id));
  const all = exerciseHistory(exId, logs);
  if (!skip.size) return all;
  const base = exerciseHistory(exId, logs, skip);
  return base.length ? base : all;
}

/**
 * Ishchi vazn: kamida repMin takror bilan bajarilgan eng og'ir vazn (bir necha setda takrorlangani ustun) —
 * bitta og'ir "sinov" seti (masalan 100×1) tayanch bo'lmaydi. Hech bir set repMin ga yetmasa — eng ko'p ishlatilgan vazn.
 */
export function workingWeight(sets: Pick<SetLog, 'kg' | 'reps'>[], repMin: number): number {
  if (!sets.length) return 0;
  const count = (kg: number, list: Pick<SetLog, 'kg' | 'reps'>[]) => list.filter((s) => s.kg === kg).length;
  const ok = sets.filter((s) => s.reps >= repMin);
  if (ok.length) {
    const multi = ok.filter((s) => count(s.kg, ok) >= 2);
    return Math.max(...(multi.length ? multi : ok).map((s) => s.kg));
  }
  const maxReps = (kg: number) => Math.max(...sets.filter((s) => s.kg === kg).map((s) => s.reps));
  const kgs = [...new Set(sets.map((s) => s.kg))];
  return kgs.sort((a, b) => count(b, sets) - count(a, sets) || maxReps(b) - maxReps(a) || b - a)[0];
}

/** Setlardagi eng yaxshi 1RM bo'yicha: repMin takrorni rir zaxira bilan bajarish mumkin bo'lgan vazn (yozilmagan RIR — 1) */
function e1rmCap(sets: Pick<SetLog, 'kg' | 'reps' | 'rir'>[], repMin: number, rir: number): number | null {
  const valid = sets.filter((s) => s.kg > 0 && s.reps > 0);
  const pool = valid.filter((s) => s.reps <= 12);
  const list = pool.length ? pool : valid;
  if (!list.length) return null;
  return Math.max(...list.map((s) => e1rmFromSet(s.kg, s.reps, s.rir))) * pct1rm(repMin, rir);
}

/** Shu takror soni va %1RM uchun taxminiy zaxira (RPE jadvali bo'yicha, 0.5 qadam) */
export function rirAt(reps: number, pct: number): number {
  let best = 0;
  for (let r = 0; r <= 6; r += 0.5) if (Math.abs(pct1rm(reps, r) - pct) < Math.abs(pct1rm(reps, best) - pct)) best = r;
  return best;
}

/** Tarixdan ishonchli 1RM: RIR yozilgan bo'lsa — RPE jadvali (EMA), bo'lmasa — eng yaxshi set (Epley) */
function historyE1rm(hist: History): number | null {
  if (!hist.length) return null;
  const rpe = refE1rm(hist.map((h) => h.sets));
  if (rpe) return rpe;
  const best = Math.max(...hist[0].sets.filter((x) => x.reps <= 12).map((x) => e1rm(x.kg, x.reps)), 0);
  return best || null;
}

/** Kuch bloki: asosiy mashq haftaga qarab %1RM bilan (Issurin; Helms) */
function suggestBlock(ex: Exercise, pe: PlannedExercise, hist: History, ctx: SuggestCtx, out: Suggestion): Suggestion {
  const bar = ctx.barKg;
  const w = blockWeek(ctx.week ?? 0, ctx.mesoWeeks ?? 5);
  let e1 = historyE1rm(hist);
  let estimated = false;
  if (!e1) {
    // boshlang'ich vazn ~10 takror 3 zaxira bilan — undan 1RM (yaxlitlanmagan taxmindan)
    const start = startEstimate(ex, ctx.bodyKg, ctx.sex, ctx.level);
    e1 = start ? start / pct1rm(10, 3) : null;
    estimated = true;
  }
  // vaqt cheklangan bo'lsa dasturdagi set soni — yuqori chegara
  out.sets = Math.min(w.sets, Math.max(2, pe.sets));
  out.reps = w.reps;
  out.rir = rirAt(w.reps, w.pct);
  let barOnly = false;
  if (e1) {
    out.kg = roundLoad(ex, e1 * w.pct, bar);
    out.e1rm = Math.round(e1 * 10) / 10;
    out.estimated = estimated;
    barOnly = estimated && out.kg > e1 * w.pct * 1.15;
  }
  const prevTop = hist[0] ? workingWeight(hist[0].sets, 1) : 0;
  out.kind = w.deload ? 'deload' : !hist.length ? 'first' : (out.kg ?? 0) > prevTop ? 'up' : (out.kg ?? 0) < prevTop ? 'down' : 'same';
  out.reason = w.deload
    ? `Kuch bloki — yengillashtirish: ${w.sets}×${w.reps} @ ${Math.round(w.pct * 100)}%. Charchoq ketadi, kuch keyingi blokda namoyon bo‘ladi.`
    : barOnly
      ? `Kuch bloki, ${(ctx.week ?? 0) + 1}-hafta: taxminiy hisob grifdan yengil chiqdi — bo‘sh grif (${fmtKg(out.kg ?? 0)} kg) bilan ${w.sets}×${w.reps}. Texnikani o‘rnating; keyingi vazn natijangizdan hisoblanadi.`
      : `Kuch bloki, ${(ctx.week ?? 0) + 1}-hafta: ${w.sets}×${w.reps} @ ${Math.round(w.pct * 100)}% 1RM${e1 ? ` (1RM ≈ ${Math.round(e1)} kg${estimated ? ', taxminiy' : ''})` : ''}. Har set ~${out.rir} takror zaxira bilan tugashi kerak.`;
  if (!w.deload && ctx.readiness !== undefined && ctx.readiness < 2.6) {
    out.sets = Math.max(1, out.sets - 1);
    if (out.kg) out.kg = roundLoad(ex, out.kg * 0.95, bar);
    out.kind = 'easy';
    out.reason = `Bugun tana charchagan: ${out.sets}×${w.reps}, vazn 5% yengilroq. Blok rejasi buzilmaydi.`;
  }
  out.warmups = warmupSets(ex, out.kg, out.reps, bar);
  return out;
}

/** Bitta og'ir set (sinov) yoki hech bir set repMin ga yetmagan bo'lsa — vazn 1RM taxminidan oshmasin */
function capLone(ex: Exercise, last: History[number], repMin: number, rir: number, out: Suggestion, w: number, bar?: number) {
  const lone = last.sets.filter((s) => s.kg === w).length === 1 && !last.sets.some((s) => s.reps >= repMin);
  if (!lone || !out.kg) return;
  const cap = e1rmCap(last.sets, repMin, rir);
  if (cap === null) return;
  const kg = roundLoad(ex, cap, bar);
  if (kg >= out.kg) return;
  out.kg = kg;
  out.kind = 'down';
  out.reason = `O‘tgan safar ${fmtKg(w)} kg bilan atigi bitta set (${Math.max(...last.sets.filter((s) => s.kg === w).map((s) => s.reps))} takror). ${repMin} takror uchun taxminiy 1RM bo‘yicha — ${fmtKg(kg)} kg.`;
}

/** Chiziqli progressiya: barcha takrorlar bajarilsa — har mashg'ulot +vazn (Rippetoe) */
function suggestLinear(ex: Exercise, pe: PlannedExercise, hist: History, ctx: SuggestCtx, out: Suggestion): Suggestion {
  const bar = ctx.barKg;
  const lower = LOWER_GROUPS.includes(MUSCLES[ex.primary[0]].group) || ex.pattern === 'hinge';
  const step = ex.loadType === 'barbell' ? (lower ? 5 : 2.5) : Math.max(ex.increment, 1);
  const last = hist[0];
  out.reps = pe.repMin;
  if (!last) {
    const start = startEstimate(ex, ctx.bodyKg, ctx.sex, ctx.level);
    // ~10 takrorli boshlang'ich vazndan 5 takror 3 zaxira bilan — birinchi kun oson bo'lsin (yaxlitlash faqat oxirida)
    out.kg = start ? roundLoad(ex, (start / pct1rm(10, 3)) * pct1rm(pe.repMin, 3), bar) : null;
    out.estimated = out.kg !== null;
    out.kind = 'first';
    out.reason = 'Birinchi kun ataylab yengil: texnikani o‘rnating. Keyingi har mashg‘ulotda vazn oshadi.';
  } else {
    const top = workingWeight(last.sets, pe.repMin);
    const work = last.sets.filter((x) => x.kg === top);
    const done = work.length >= pe.sets && work.every((x) => x.reps >= pe.repMin);
    const missPrev = hist[1] && workingWeight(hist[1].sets, pe.repMin) === top && hist[1].sets.some((x) => x.kg === top && x.reps < pe.repMin);
    // oxirgi set chegaragacha bo'lgan bo'lsa (RIR 0) — qadamni yarmiga tushiramiz: o'sish sekinlashmoqda
    const grind = work.some((x) => x.rir !== undefined && x.rir <= 0.5);
    if (done) {
      const inc = grind ? step / 2 : step;
      out.kg = nextLoad(ex, top, inc, bar);
      out.kind = out.kg > top ? 'up' : 'same';
      out.reason =
        out.kg <= top
          ? `Bu eng og‘ir yuk (${fmtKg(top)} kg) — takrorlarni oshiring.`
          : grind
            ? `+${fmtKg(out.kg - top)} kg: barcha takrorlar bajarildi, lekin chegarada — qadam kichraytirildi.`
            : `+${fmtKg(out.kg - top)} kg: o‘tgan safar ${work.length}×${pe.repMin} to‘liq bajarildi. Chiziqli progressiya — har safar og‘irroq.`;
    } else if (missPrev) {
      out.kg = roundLoad(ex, top * 0.9, bar);
      out.kind = 'down';
      out.reason = 'Ikki marta ketma-ket yetmadi — vazn 10% ga tushirildi (reset). 2–3 mashg‘ulotda yana o‘tib ketasiz.';
    } else {
      out.kg = top;
      out.kind = 'same';
      out.reason = `Shu vaznni takrorlang: maqsad — barcha setlarda ${pe.repMin} takror.`;
      capLone(ex, last, pe.repMin, pe.rir, out, top, bar);
    }
  }
  return out;
}

export function suggest(ex: Exercise, pe: PlannedExercise, logs: WorkoutLog[], ctx: SuggestCtx): Suggestion {
  const bar = ctx.barKg;
  const hist = baselineHistory(ex.id, logs, ctx);
  let sets = Math.max(1, pe.sets + (ctx.setDelta ?? 0));
  let rir = ctx.rir ?? pe.rir;
  const out: Suggestion = { kg: null, reps: pe.repMin, sets, rir, kind: 'first', reason: '', warmups: [] };
  const last = hist[0];
  if (last) out.last = { date: last.date, sets: last.sets.map((s) => ({ kg: s.kg, reps: s.reps, rir: s.rir })) };

  // jihozsiz bajariladigan, gantel bilan og'irlashtiriladigan mashq (boldir ko'tarish): gantel bo'lmasa
  // yoki o'tgan safar yuksiz bajarilgan bo'lsa — tana vazni bilan takror progressiyasi
  const freeWeight = ex.equipment.length === 0 && !ex.equipmentAny?.length && ex.loadType === 'dumbbell';
  const unloaded = freeWeight && ((!!ctx.equipment && !ctx.equipment.includes('dumbbells')) || (!!last && last.sets.every((s) => !s.kg)));
  // tortilish, brusya kabi mashqlar: qo'shimcha yuk (kamar bilan) faqat foydalanuvchi o'zi yozgan bo'lsa hisoblanadi —
  // aks holda takror progressiyasi (aks holda "+2.5 kg" tavsiyasi yuksiz setga ham yozilib qolardi)
  const noAdded = !last || last.sets.every((s) => !s.kg);
  const bodyweight = (ex.loadType === 'bodyweight' && (ex.increment === 0 || noAdded)) || unloaded;
  const unit = ex.timed ? 'soniya' : 'takror';

  if (pe.scheme === 'block' && !bodyweight && ex.loadType !== 'band') return suggestBlock(ex, pe, hist, ctx, out);
  const linear = pe.scheme === 'linear' && !bodyweight && ex.loadType !== 'band';
  if (linear) suggestLinear(ex, pe, hist, ctx, out);
  else if (!last) {
    const est = bodyweight ? null : startingWeight(ex, ctx.bodyKg, ctx.sex, ctx.level, bar);
    out.kg = est;
    out.estimated = est !== null;
    out.reps = pe.repMin;
    out.kind = bodyweight ? 'bodyweight' : 'first';
    out.reason = bodyweight
      ? `Birinchi marta: ${pe.repMin}–${pe.repMax} ${unit}. Texnikaga e’tibor bering.`
      : est
        ? 'Taxminiy boshlang‘ich vazn. Birinchi setdan so‘ng moslang: yana 2–3 marta bemalol qila olsangiz — to‘g‘ri tanlov.'
        : 'Birinchi marta: yengil vazn bilan texnikani sinang, 2–3 takror zaxira qoldiring.';
  } else {
    const w = workingWeight(last.sets, pe.repMin);
    // ishchi vazndan og'ir, lekin repMin ga yetmagan setlar (sinov) — "barcha setlar" sanog'iga kirmaydi
    const considered = last.sets.filter((s) => !(s.kg > w && s.reps < pe.repMin));
    const work = last.sets.filter((s) => s.kg === w);
    const allTop = work.length >= Math.min(pe.sets, considered.length) && work.every((s) => s.reps >= pe.repMax);
    const anyMiss = work.some((s) => s.reps < pe.repMin);
    const prevMiss = hist[1]?.sets.some((s) => s.kg === w && s.reps < pe.repMin);
    const minReps = Math.min(...work.map((s) => s.reps));

    if (bodyweight || ex.loadType === 'band') {
      out.kg = null;
      const stepR = ex.timed ? 5 : 1;
      if (allTop) {
        out.reps = pe.repMax;
        out.kind = 'up';
        out.reason = `Barcha setlarda ${pe.repMax}+ ${unit} — qiyinroq variantga o‘ting${ex.timed ? '' : ' yoki og‘irlik qo‘shing'}.`;
      } else {
        out.reps = Math.min(pe.repMax, minReps + stepR);
        out.kind = 'reps';
        out.reason = `O‘tgan safar ${minReps} ${unit}. Bugun har setda +${stepR} ${unit}ga harakat qiling.`;
      }
    } else if (allTop) {
      const kg = nextLoad(ex, w, Math.max(ex.increment, w * 0.025), bar);
      if (kg > w) {
        out.kg = kg;
        out.reps = pe.repMin;
        out.kind = 'up';
        out.reason = `+${fmtKg(kg - w)} kg: o‘tgan safar barcha setlarda ${pe.repMax} takror bajarildi.`;
      } else {
        // og'irroq snaryad yo'q (eng og'ir girya) — takror va sur'at bilan og'irlashtiramiz
        out.kg = w;
        out.reps = pe.repMax;
        out.kind = 'reps';
        out.reason = `Bu eng og‘ir yuk (${fmtKg(w)} kg) — ${pe.repMax}+ takror qiling yoki harakatni sekinlashtiring.`;
      }
    } else if (anyMiss && prevMiss) {
      out.kg = roundLoad(ex, w * 0.9, bar);
      out.reps = pe.repMin;
      out.kind = 'down';
      out.reason = 'Ikki marta ketma-ket takrorlar yetmadi — vazn 10% kamaytirildi. Bu orqaga qadam emas, sakrash uchun tayyorgarlik.';
    } else if (anyMiss) {
      out.kg = w;
      out.reps = pe.repMin;
      out.kind = 'same';
      out.reason = `Shu vaznda qoling va ${pe.repMin} takrorga yeting.`;
      capLone(ex, last, pe.repMin, rir, out, w, bar);
    } else {
      out.kg = w;
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
  if (!linear && last && lastE1 && !bodyweight && ex.loadType !== 'band' && out.kg) {
    const best = last.sets.filter((x) => x.rir !== undefined).reduce((a, b) => (e1rmFromSet(b.kg, b.reps, b.rir) > e1rmFromSet(a.kg, a.reps, a.rir) ? b : a));
    // ±5% chegara — bitta og'ir setdan emas, ishchi vazndan
    const prevTop = workingWeight(last.sets, pe.repMin);
    const raw = loadFor(lastE1, out.reps, rir);
    // haddan tashqari sakrash bo'lmasin: +5% / −10% (Helms, RTS amaliyoti)
    let kg = roundLoad(ex, Math.min(Math.max(prevTop * 1.05, prevTop + ex.increment), Math.max(prevTop * 0.9, raw)), bar);
    // o'tgan safar reja bajarilgan bo'lsa (takror yetdi, zaxira maqsaddan kam emas) — vazn tushirilmaydi
    const topSets = last.sets.filter((x) => x.kg === prevTop);
    const met = topSets.every((x) => x.reps >= pe.repMin && (x.rir === undefined || x.rir >= rir - 0.5));
    if (met && kg < prevTop) kg = prevTop;
    out.kg = kg;
    out.e1rm = Math.round(lastE1 * 10) / 10;
    out.auto = true;
    out.kind = kg > prevTop ? 'up' : kg < prevTop ? 'down' : out.reps > Math.min(...topSets.map((x) => x.reps)) ? 'reps' : 'same';
    out.reason = `O‘tgan safar: ${fmtKg(best.kg)}×${best.reps}, zaxira ${best.rir} → taxminiy 1RM ${Math.round(lastE1)} kg. Bugun ${out.reps} takror ${rir} zaxira bilan — ${fmtKg(kg)} kg.`;
  }

  // Yengillashtirish (deload) haftasi
  if (ctx.deload) {
    sets = Math.max(1, Math.round(sets * 0.5));
    rir = Math.max(4, rir + 2);
    if (out.kg) out.kg = roundLoad(ex, out.kg * 0.85, bar);
    out.kind = 'deload';
    out.reason = 'Yengillashtirish haftasi: kamroq set va yengilroq vazn. Charchoq ketadi, kuch keyingi bloklarda o‘sadi.';
  } else if (ctx.readiness !== undefined && ctx.readiness < 2.6) {
    sets = Math.max(1, sets - 1);
    rir = rir + 1;
    if (out.kg) out.kg = roundLoad(ex, out.kg * 0.95, bar);
    out.kind = 'easy';
    out.reason = 'Bugun tana charchagan: bitta set kamroq va biroz yengilroq. Mashqni o‘tkazib yubormaslikning o‘zi g‘alaba.';
  }
  out.sets = sets;
  out.rir = rir;
  out.warmups = warmupSets(ex, out.kg, out.reps, bar);
  return out;
}

/**
 * Isinish zinapoyasi: og'ir setlar (≤5 takror) oldidan ko'proq, qisqa qadamlar; takrorlar ishchi setdan oshmaydi.
 * Har bir isinish seti ish vaznidan yengil (ish vazni bo'sh grif bo'lsa — isinish seti yo'q).
 * NSCA umumiy → maxsus isinish; RTS amaliyoti.
 */
export function warmupSets(ex: Exercise, kg: number | null, reps = 8, barKg = DEFAULT_BAR_KG): SetTarget[] {
  if (!kg || ex.mechanics !== 'compound') return [];
  if (ex.loadType === 'barbell') {
    const bar = barFor(ex, barKg);
    if (kg <= bar) return [];
    if (kg < bar + 10) return [{ kg: bar, reps: 10 }];
    const ladder =
      reps <= 5
        ? [
            [0.4, 5],
            [0.6, 3],
            [0.75, 2],
            [0.85, 1],
          ]
        : [
            [0.5, 5],
            [0.7, 3],
            [0.85, 2],
          ];
    const w = ladder.map(([p, r]) => ({ kg: roundLoad(ex, kg * p, barKg), reps: Math.min(r, reps) }));
    // qadam kamida 5 kg: 20 → 22.5 kabi deyarli bir xil setlar tashlanadi (yengil vaznda zinapoya qisqaradi)
    const out: SetTarget[] = [];
    for (const s of dedupe([{ kg: bar, reps: 10 }, ...w])) if ((s.kg ?? 0) < kg && (!out.length || (s.kg ?? 0) - (out[out.length - 1].kg ?? 0) >= 5)) out.push(s);
    return out;
  }
  if (ex.loadType === 'machine' || ex.loadType === 'cable') {
    return dedupe([0.5, 0.75].map((p, i) => ({ kg: roundLoad(ex, kg * p), reps: [10, 5][i] }))).filter((s) => (s.kg ?? 0) < kg);
  }
  if (ex.loadType === 'dumbbell' && kg >= 8) return [{ kg: roundLoad(ex, kg * 0.5), reps: 10 }].filter((s) => s.kg < kg);
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
