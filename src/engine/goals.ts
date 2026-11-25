// Maqsadlar: joriy qiymat, progress, trend bo'yicha bashorat (qachon yetiladi) va holat.
//  • lift — taxminiy 1RM (oxirgi 6 haftadagi eng yaxshisi), trend — 8 haftalik chiziqli regressiya
//  • weight — tana vazni (oxirgi o'lchov), trend — 4 haftalik regressiya; xavfsiz tezlik nazorati
//  • workouts — shu oyda bajarilgan mashg'ulotlar, oy oxirigacha kerakli sur’at
import { EXERCISE_MAP } from '../data/exercises';
import { isoDate } from '../lib/date';
import type { BodyEntry, Profile, UserGoal, WorkoutLog } from '../types';
import { fmtKg } from './progression';
import { exerciseSeries } from './stats';

export type GoalState = 'done' | 'ahead' | 'on' | 'behind' | 'stalled' | 'nodata';

export interface GoalStatus {
  /** sarlavha: "O‘tirib-turish — 100 kg" */
  title: string;
  current: number | null;
  /** 0..1 */
  progress: number;
  state: GoalState;
  /** bashorat qilingan sana (YYYY-MM-DD) */
  eta?: string;
  /** qisqa holat matni */
  text: string;
  /** nima qilish kerak (ortda qolsa / to'xtasa) */
  tip?: string;
  unit: string;
}

const DAY = 86_400_000;
const clamp01 = (x: number) => Math.max(0, Math.min(1, x));

/** Chiziqli regressiya: kuniga o'zgarish (kamida 3 nuqta va 10 kunlik oraliq) */
export function slopePerDay(pts: { t: number; y: number }[]): number | null {
  if (pts.length < 3) return null;
  const span = (pts[pts.length - 1].t - pts[0].t) / DAY;
  if (span < 10) return null;
  const xs = pts.map((p) => (p.t - pts[0].t) / DAY);
  const mx = xs.reduce((a, b) => a + b, 0) / xs.length;
  const my = pts.reduce((a, p) => a + p.y, 0) / pts.length;
  const sxx = xs.reduce((a, x) => a + (x - mx) ** 2, 0);
  if (!sxx) return null;
  return xs.reduce((a, x, i) => a + (x - mx) * (pts[i].y - my), 0) / sxx;
}

const MONTHS_SHORT = ['yanvar', 'fevral', 'mart', 'aprel', 'may', 'iyun', 'iyul', 'avgust', 'sentabr', 'oktabr', 'noyabr', 'dekabr'];
export const fmtDay = (iso: string) => {
  const d = new Date(iso + 'T12:00:00');
  return `${d.getDate()}-${MONTHS_SHORT[d.getMonth()]}`;
};

/** Trend bo'yicha bashorat va muddatga nisbatan holat */
function forecast(current: number, target: number, slope: number | null, now: Date, deadline?: string): Pick<GoalStatus, 'state' | 'eta'> & { needPerWeek?: number } {
  const left = target - current;
  const dir = Math.sign(left);
  const daysLeft = deadline ? Math.max(1, Math.round((new Date(deadline + 'T12:00:00').getTime() - now.getTime()) / DAY)) : null;
  const needPerWeek = daysLeft ? (left / daysLeft) * 7 : undefined;
  if (slope === null) return { state: 'nodata', needPerWeek };
  // to'g'ri yo'nalishda, sezilarli tezlikda emas — to'xtagan
  if (slope * dir <= Math.abs(left) * 0.0005 + 1e-6) return { state: 'stalled', needPerWeek };
  const days = left / slope;
  const eta = isoDate(new Date(now.getTime() + days * DAY));
  if (!daysLeft) return { state: 'on', eta, needPerWeek };
  if (days <= daysLeft * 0.85) return { state: 'ahead', eta, needPerWeek };
  if (days <= daysLeft) return { state: 'on', eta, needPerWeek };
  return { state: 'behind', eta, needPerWeek };
}

export interface GoalCtx {
  logs: WorkoutLog[];
  body: BodyEntry[];
  profile: Pick<Profile, 'weightKg' | 'daysPerWeek'> | null;
  now?: Date;
}

/** Kuch maqsadi uchun joriy taxminiy 1RM: oxirgi 6 haftadagi eng yaxshisi (bitta yomon kun pasaytirmaydi) */
export function liftCurrent(exId: string, logs: WorkoutLog[], now = new Date()): number | null {
  const pts = exerciseSeries(exId, logs).filter((p) => now.getTime() - new Date(p.date).getTime() <= 42 * DAY);
  return pts.length ? Math.max(...pts.map((p) => p.e1rm)) : null;
}

/** Hozirgi tana vazni: oxirgi o'lchov, bo'lmasa — profildagi */
export function weightCurrent(body: BodyEntry[], profile: Pick<Profile, 'weightKg'> | null): number | null {
  const w = [...body].filter((b) => b.weightKg).sort((a, b) => a.date.localeCompare(b.date));
  return w.length ? w[w.length - 1].weightKg! : (profile?.weightKg ?? null);
}

export function goalStatus(g: UserGoal, ctx: GoalCtx): GoalStatus {
  const now = ctx.now ?? new Date();
  if (g.kind === 'workouts') {
    const y = now.getFullYear();
    const m = now.getMonth();
    const count = ctx.logs.filter((l) => {
      if (!l.finishedAt) return false;
      const d = new Date(l.startedAt);
      return d.getFullYear() === y && d.getMonth() === m;
    }).length;
    const daysInMonth = new Date(y, m + 1, 0).getDate();
    const day = now.getDate();
    const expected = (g.target * day) / daysInMonth;
    const left = Math.max(0, g.target - count);
    const daysRemain = daysInMonth - day;
    const state: GoalState = count >= g.target ? 'done' : count >= expected ? (count >= expected + 1 ? 'ahead' : 'on') : 'behind';
    return {
      title: `Oyiga ${g.target} ta mashg‘ulot`,
      current: count,
      progress: clamp01(count / g.target),
      state,
      text: state === 'done' ? `Shu oy ${count} ta — maqsad bajarildi!` : `Shu oy: ${count}/${g.target}`,
      tip: state === 'behind' && left ? `Oy oxirigacha ${daysRemain} kun: yana ${left} ta mashg‘ulot — haftasiga ~${Math.ceil((left / Math.max(1, daysRemain)) * 7)} ta.` : undefined,
      unit: 'ta',
    };
  }

  if (g.kind === 'lift') {
    const name = EXERCISE_MAP[g.exerciseId ?? '']?.name ?? 'Mashq';
    const title = `${name} — ${fmtKg(g.target)} kg`;
    const current = liftCurrent(g.exerciseId!, ctx.logs, now);
    if (current === null) return { title, current: null, progress: 0, state: 'nodata', text: 'Bu mashqni bajarganingizdan keyin hisoblanadi', unit: 'kg' };
    if (current >= g.target) return { title, current, progress: 1, state: 'done', text: `Taxminiy 1RM ${fmtKg(Math.round(current * 2) / 2)} kg — maqsadga yetdingiz!`, unit: 'kg' };
    const pts = exerciseSeries(g.exerciseId!, ctx.logs)
      .filter((p) => now.getTime() - new Date(p.date).getTime() <= 56 * DAY)
      .map((p) => ({ t: new Date(p.date).getTime(), y: p.e1rm }));
    // yangi boshlaganlarda har mashg'ulot +2.5 kg — bu sur'at uzoq davom etmaydi: bashorat haftasiga 2.5% bilan cheklanadi
    const raw = slopePerDay(pts);
    const slope = raw === null ? null : Math.min(raw, (current * 0.025) / 7);
    const f = forecast(current, g.target, slope, now, g.deadline);
    const base = `Taxminiy 1RM: ${fmtKg(Math.round(current * 2) / 2)} / ${fmtKg(g.target)} kg`;
    return {
      title,
      current,
      progress: clamp01(g.target > g.start ? (current - g.start) / (g.target - g.start) : current / g.target),
      state: f.state,
      eta: f.eta,
      text: f.eta ? `${base} · ~${fmtDay(f.eta)}` : base,
      tip:
        f.state === 'stalled'
          ? 'O‘sish to‘xtagan: yengillashtirish haftasi qiling yoki takror diapazonini almashtiring (masalan, 5 → 8 takror). Uyqu va oqsilni ham tekshiring.'
          : f.state === 'behind' && f.needPerWeek
            ? `Muddatga yetish uchun haftasiga ~${fmtKg(Math.round(f.needPerWeek * 10) / 10)} kg o‘sish kerak — hozirgi sur’at sekinroq. Muddatni uzaytirish yoki mashqni haftasiga 2 marta qilish mumkin.`
            : f.state === 'nodata'
              ? 'Bashorat uchun 2 hafta ichida kamida 3 ta mashg‘ulot kerak.'
              : undefined,
      unit: 'kg',
    };
  }

  // weight
  const current = weightCurrent(ctx.body, ctx.profile);
  const dir = Math.sign(g.target - g.start) || -1;
  const title = `Vazn — ${fmtKg(g.target)} kg`;
  if (current === null) return { title, current: null, progress: 0, state: 'nodata', text: 'Vazningizni kiriting', unit: 'kg' };
  if ((dir < 0 && current <= g.target) || (dir > 0 && current >= g.target)) return { title, current, progress: 1, state: 'done', text: `${fmtKg(current)} kg — maqsadga yetdingiz!`, unit: 'kg' };
  const pts = ctx.body
    .filter((b) => b.weightKg && now.getTime() - new Date(b.date + 'T12:00:00').getTime() <= 28 * DAY)
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((b) => ({ t: new Date(b.date + 'T12:00:00').getTime(), y: b.weightKg! }));
  const slope = slopePerDay(pts);
  const f = forecast(current, g.target, slope, now, g.deadline);
  // xavfsiz tezlik: ozish — haftasiga 0.5–1%, vazn olish — 0.25–0.5% (o'lchov shovqini uchun 20% zaxira bilan)
  const weekly = slope !== null ? slope * 7 : null;
  const safe = dir < 0 ? [0.005, 0.01] : [0.0025, 0.005];
  const tooFast = weekly !== null && weekly * dir > current * safe[1] * 1.2;
  const r1 = (x: number) => fmtKg(Math.round(x * 10) / 10);
  const wrongWay = weekly !== null && weekly * dir < 0 && Math.abs(weekly) > 0.1;
  const base = `${fmtKg(current)} kg → ${fmtKg(g.target)} kg`;
  return {
    title,
    current,
    progress: clamp01((current - g.start) / (g.target - g.start)),
    state: wrongWay ? 'behind' : f.state,
    eta: f.eta,
    text: f.eta && !wrongWay ? `${base} · ~${fmtDay(f.eta)}` : base,
    tip: tooFast
      ? `Juda tez: haftasiga ~${r1(Math.abs(weekly!))} kg. Xavfsiz sur’at — haftasiga ${r1(current * safe[0])}–${r1(current * safe[1])} kg, ${dir < 0 ? 'aks holda mushak ham yo‘qoladi' : 'aks holda ko‘proq yog‘ to‘planadi'}.`
      : wrongWay
        ? dir < 0
          ? 'Vazn ortib bormoqda: «Ovqat» bo‘limidagi kunlik kaloriyadan oshmang va mashg‘ulotni qoldirmang.'
          : 'Vazn kamaymoqda: kaloriyani ~200 kkal oshiring, oqsilni kunlik me’yorda saqlang.'
        : f.state === 'nodata'
          ? 'Bashorat uchun 2 hafta ichida kamida 3 marta vazn kiriting (Natija → Tana).'
          : f.state === 'stalled'
            ? dir < 0
              ? 'Vazn bir joyda: kunlik kaloriyani 100–200 kkal kamaytiring yoki qadamlar sonini oshiring.'
              : 'Vazn bir joyda: kaloriyani 150–200 kkal oshiring.'
            : f.state === 'behind' && f.needPerWeek
              ? `Muddatga yetish uchun haftasiga ${fmtKg(Math.round(Math.abs(f.needPerWeek) * 10) / 10)} kg kerak — xavfsiz sur’atdan tez bo‘lsa, muddatni uzaytiring.`
              : undefined,
    unit: 'kg',
  };
}

/** Yangi maqsad uchun boshlang'ich va taklif qilinadigan qiymatlar */
export function goalDefaults(kind: UserGoal['kind'], ctx: GoalCtx & { goal?: Profile['goal'] }, exerciseId?: string): { start: number; target: number } {
  if (kind === 'workouts') {
    const n = (ctx.profile?.daysPerWeek ?? 3) * 4;
    return { start: 0, target: n };
  }
  if (kind === 'weight') {
    const cur = weightCurrent(ctx.body, ctx.profile) ?? 70;
    const delta = ctx.goal === 'fatLoss' ? -5 : ctx.goal === 'muscle' ? 3 : -3;
    return { start: cur, target: Math.round((cur + delta) * 2) / 2 };
  }
  const cur = exerciseId ? liftCurrent(exerciseId, ctx.logs, ctx.now) : null;
  if (!cur) return { start: 0, target: 60 };
  return { start: Math.round(cur * 2) / 2, target: Math.ceil((cur * 1.1) / 2.5) * 2.5 };
}
