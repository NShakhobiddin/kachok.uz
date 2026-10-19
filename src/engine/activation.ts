// Mashq uchun mushaklar faolligi: EMG jadvali bo'lsa — undan, bo'lmasa asosiy/yordamchi mushaklardan taxmin.
import { ACTIVATION, type ActValue } from '../data/activation';
import { GROUP_TO_M3, M3_INFO, type M3 } from '../data/muscles3d';
import type { Exercise, Phase } from '../types';

export type ActRole = 'main' | 'synergist' | 'stabilizer';

export interface MuscleAct extends ActValue {
  key: M3;
  role: ActRole;
  est: boolean;
}

export interface ActivationView {
  list: MuscleAct[];
  /** jadvalda yo'q — faqat mashq tavsifidan taxmin */
  fallback: boolean;
  basis: string;
  load?: string;
  metric?: 'mean' | 'peak';
  rom?: string;
  notes?: string;
  max: number;
}

export const ROLE_TEXT: Record<ActRole, string> = { main: 'Asosiy ishchi', synergist: 'Yordamchi', stabilizer: 'Barqarorlashtiruvchi' };

function roleOf(mvic: number, max: number): ActRole {
  if (mvic >= max * 0.6) return 'main';
  if (mvic >= max * 0.3) return 'synergist';
  return 'stabilizer';
}

export function activationFor(ex: Exercise): ActivationView {
  const data = ACTIVATION[ex.id];
  let entries: [M3, ActValue][];
  let fallback = false;
  if (data && Object.keys(data.muscles).length) {
    entries = Object.entries(data.muscles) as [M3, ActValue][];
  } else {
    // taxmin: asosiy guruh ~70%, yordamchi ~30% MVIC
    fallback = true;
    const seen = new Set<M3>();
    entries = [];
    for (const [ids, mvic] of [[ex.primary, 70], [ex.secondary, 30]] as const)
      for (const g of ids)
        for (const [i, k] of (GROUP_TO_M3[g] ?? []).entries()) {
          if (seen.has(k)) continue;
          seen.add(k);
          entries.push([k, { mvic: Math.round(mvic * (i === 0 ? 1 : 0.75)), est: true }]);
        }
  }
  const max = Math.max(1, ...entries.map(([, v]) => v.mvic));
  const list = entries
    .filter(([k]) => k in M3_INFO)
    .map(([key, v]) => ({ ...v, key, est: !!v.est || fallback, role: roleOf(v.mvic, max) }))
    .sort((a, b) => b.mvic - a.mvic);
  return { list, fallback, basis: data?.basis ?? 'estimate', load: data?.load, metric: data?.metric, rom: data?.rom, notes: data?.notes, max };
}

/**
 * Takror fazasiga ko'ra faollik koeffitsienti: konsentrik (ko'tarish) — to'liq,
 * ekssentrik (tushirish) — ~65% (bir xil vaznda EMG past bo'ladi), pauza — ~50%.
 * Izometrik mashqda (faqat ushlab turish) o'lchangan qiymat aynan ushlab turish uchun — 1.
 */
export function phaseFactor(phase: Phase, isometric: boolean): number {
  if (isometric) return 1;
  return phase === 'up' || phase === 'squeeze' ? 1 : phase === 'down' ? 0.65 : 0.5;
}

/** Faollik rangi: sariq (kam) → to'q sariq → qizil (yuqori) */
export function heatColor(mvic: number): string {
  const t = Math.max(0, Math.min(1, mvic / 100));
  const stops: [number, [number, number, number]][] = [
    [0, [242, 201, 76]],
    [0.4, [245, 140, 40]],
    [0.7, [240, 70, 45]],
    [1, [214, 25, 55]],
  ];
  let i = 0;
  while (i < stops.length - 2 && t > stops[i + 1][0]) i++;
  const [t0, c0] = stops[i];
  const [t1, c1] = stops[i + 1];
  const k = (t - t0) / (t1 - t0 || 1);
  const c = c0.map((v, j) => Math.round(v + (c1[j] - v) * Math.max(0, Math.min(1, k))));
  return `rgb(${c[0]}, ${c[1]}, ${c[2]})`;
}
