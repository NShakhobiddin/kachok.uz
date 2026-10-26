// 3D tanada nimani yoritish: bugungi reja, haftalik yuklama yoki hali tiklanayotgan mushaklar.
import { EXERCISE_MAP } from '../data/exercises';
import { GROUP_TO_M3, M3_INFO, type M3 } from '../data/muscles3d';
import type { MuscleId, WorkoutLog } from '../types';
import { activationFor } from './activation';

export interface BodyLoad {
  key: M3;
  /** yoritish kuchi, 0..100 */
  mvic: number;
  /** haftalik "samarali set" (faollik ulushi bilan) */
  sets?: number;
}

const add = (m: Map<M3, number>, k: M3, v: number) => m.set(k, (m.get(k) ?? 0) + v);

/** Reja: har mashq EMG faolligi × setlar soni, eng ko'p ishlaydigani = 100 */
export function planLoad(items: { exerciseId: string; sets: number }[], min = 18): BodyLoad[] {
  const acc = new Map<M3, number>();
  for (const it of items) {
    const ex = EXERCISE_MAP[it.exerciseId];
    if (!ex) continue;
    for (const a of activationFor(ex).list) add(acc, a.key, (a.mvic / 100) * it.sets);
  }
  const max = Math.max(1e-6, ...acc.values());
  return [...acc]
    .map(([key, v]) => ({ key, mvic: Math.round((v / max) * 100) }))
    .filter((a) => a.mvic >= min)
    .sort((a, b) => b.mvic - a.mvic);
}

/** Hafta: bajarilgan ishchi setlar × faollik ulushi; 12 samarali set = to'liq yorqinlik */
export function weekLoad(logs: WorkoutLog[], since: Date, full = 12): BodyLoad[] {
  const acc = new Map<M3, number>();
  for (const l of logs) {
    if (!l.finishedAt || new Date(l.startedAt) < since) continue;
    for (const e of l.exercises) {
      const ex = EXERCISE_MAP[e.exerciseId];
      if (!ex) continue;
      const n = e.sets.filter((s) => s.done && !s.warmup).length;
      if (!n) continue;
      const act = activationFor(ex);
      for (const a of act.list) add(acc, a.key, (n * a.mvic) / Math.max(60, act.max));
    }
  }
  return [...acc]
    .filter(([, v]) => v >= 0.5)
    .map(([key, v]) => ({ key, sets: Math.round(v * 10) / 10, mvic: Math.round(Math.min(1, v / full) * 100) }))
    .sort((a, b) => b.mvic - a.mvic);
}

/** Tiklanish: hali charchagan mushaklar (tiklanish < 80%) */
export function fatigueLoad(recovery: Partial<Record<MuscleId, number>>): BodyLoad[] {
  const out = new Map<M3, number>();
  for (const [m, r] of Object.entries(recovery) as [MuscleId, number][]) {
    if (r >= 0.8) continue;
    for (const k of GROUP_TO_M3[m] ?? []) out.set(k, Math.max(out.get(k) ?? 0, Math.round((1 - r) * 100)));
  }
  return [...out].map(([key, mvic]) => ({ key, mvic })).sort((a, b) => b.mvic - a.mvic);
}

/** Yoritilgan mushaklarning umumiy guruh nomlari (takrorlanmasdan) */
export function loadGroups(load: BodyLoad[], names: Record<string, { name: string }>, limit = 3): string[] {
  const seen: string[] = [];
  for (const a of load) {
    const g = M3_INFO[a.key].group;
    const n = g ? names[g]?.name : undefined;
    if (n && !seen.includes(n)) seen.push(n);
    if (seen.length >= limit) break;
  }
  return seen;
}
