// Anatomik shakllar: a'zolarning tashqi konturi suyak bo'ylab "profil" (oldingi va orqa qalinlik) dan quriladi.
// Mushaklar shu konturga yopishgan linza shaklida chiziladi, shuning uchun harakatda tana bilan birga egiladi.
import { add, ccw, cw, mul, norm, sub } from '../../lib/figure';
import type { Pt } from '../../types';

/** [t (0 = proksimal bo'g'im, 1 = distal), oldingi qalinlik, orqa qalinlik] */
export type Prof = readonly (readonly [number, number, number])[];

const f1 = (n: number) => Math.round(n * 10) / 10;
const P = (p: Pt) => `${f1(p.x)} ${f1(p.y)}`;

/** Yopiq silliq kontur (Catmull-Rom → Bezier) */
export function smoothClosed(pts: Pt[]): string {
  const n = pts.length;
  let d = `M${P(pts[0])}`;
  for (let i = 0; i < n; i++) {
    const p0 = pts[(i - 1 + n) % n];
    const p1 = pts[i];
    const p2 = pts[(i + 1) % n];
    const p3 = pts[(i + 2) % n];
    d += ` C${P({ x: p1.x + (p2.x - p0.x) / 6, y: p1.y + (p2.y - p0.y) / 6 })} ${P({ x: p2.x - (p3.x - p1.x) / 6, y: p2.y - (p3.y - p1.y) / 6 })} ${P(p2)}`;
  }
  return d + 'Z';
}

/** Ochiq silliq chiziq */
export function smoothOpen(pts: Pt[]): string {
  const n = pts.length;
  if (n < 2) return '';
  let d = `M${P(pts[0])}`;
  for (let i = 0; i < n - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[Math.min(n - 1, i + 2)];
    d += ` C${P({ x: p1.x + (p2.x - p0.x) / 6, y: p1.y + (p2.y - p0.y) / 6 })} ${P({ x: p2.x - (p3.x - p1.x) / 6, y: p2.y - (p3.y - p1.y) / 6 })} ${P(p2)}`;
  }
  return d;
}

/** Profildan t nuqtadagi qalinlik (col 1 — old, 2 — orqa) */
export function profAt(prof: Prof, t: number, col: 1 | 2): number {
  if (t <= prof[0][0]) return prof[0][col];
  for (let i = 1; i < prof.length; i++) {
    if (t <= prof[i][0]) {
      const [t0] = prof[i - 1];
      const [t1] = prof[i];
      const k = (t - t0) / (t1 - t0);
      return prof[i - 1][col] + (prof[i][col] - prof[i - 1][col]) * k;
    }
  }
  return prof[prof.length - 1][col];
}

/** Mushak qisqarganda "qorni" qalinlashadi: [t0, t1] oralig'ida col tomonni k marta kattalashtirish */
export function bulge(prof: Prof, col: 1 | 2, t0: number, t1: number, k: number): Prof {
  if (!k) return prof;
  return prof.map((r) => {
    if (r[0] <= t0 || r[0] >= t1) return r;
    const u = (r[0] - t0) / (t1 - t0);
    const s = 1 + k * Math.sin(Math.PI * u);
    return col === 1 ? ([r[0], r[1] * s, r[2]] as const) : ([r[0], r[1], r[2] * s] as const);
  });
}

export interface Geo {
  a: Pt;
  d: Pt;
  /** "old" tomon normal vektori */
  n: Pt;
  L: number;
  prof: Prof;
  at: (t: number, off: number) => Pt;
}

/** Suyak (a → b) va profil. front: 'ccw' — a'zolar, 'cw' — tana (old tomoni boshqa) */
export function geo(a: Pt, b: Pt, prof: Prof, front: 'ccw' | 'cw' = 'ccw', bend?: (t: number) => number): Geo {
  const v = sub(b, a);
  const L = Math.hypot(v.x, v.y) || 1;
  const d = norm(v);
  const n = front === 'ccw' ? ccw(d) : cw(d);
  const at = (t: number, off: number) => add(add(a, mul(d, t * L)), mul(n, off + (bend ? bend(t) : 0)));
  return { a, d, n, L, prof, at };
}

/** A'zoning yopiq tashqi konturi (uchlari yumaloq) */
export function outline(g: Geo): string {
  const { prof, at, d, L } = g;
  const pts: Pt[] = [];
  for (const [t, an] of prof) pts.push(at(t, an));
  const [t1, a1, p1] = prof[prof.length - 1];
  pts.push(add(at(t1, (a1 - p1) / 2), mul(d, ((a1 + p1) / 2) * 0.82)));
  for (let i = prof.length - 1; i >= 0; i--) pts.push(at(prof[i][0], -prof[i][2]));
  const [t0, a0, p0] = prof[0];
  pts.push(add(at(t0, (a0 - p0) / 2), mul(d, -((a0 + p0) / 2) * 0.82)));
  void L;
  return smoothClosed(pts);
}

/** Qirra chizig'i (proksimal qismi tanaga qo'shilib ketishi uchun from dan boshlanadi) */
export function edge(g: Geo, from = 0.18): string {
  const { prof, at, d } = g;
  const rows = prof.filter((r) => r[0] >= from);
  const pts: Pt[] = [at(from, profAt(prof, from, 1))];
  for (const [t, an] of rows) if (t > from) pts.push(at(t, an));
  const [t1, a1, p1] = prof[prof.length - 1];
  pts.push(add(at(t1, (a1 - p1) / 2), mul(d, ((a1 + p1) / 2) * 0.82)));
  for (let i = rows.length - 1; i >= 0; i--) if (rows[i][0] > from) pts.push(at(rows[i][0], -rows[i][2]));
  pts.push(at(from, -profAt(prof, from, 2)));
  return smoothOpen(pts);
}

export interface MuscleGeo {
  d: string;
  fibers: string[];
}

/**
 * Konturga yopishgan mushak "linzasi".
 * side: 1 — old tomon, -1 — orqa, 0 — o'rtada (yon tomondan ko'rinadigan mushak)
 * depth: mushak a'zo qalinligining qancha qismini egallaydi
 */
export function lens(g: Geo, side: 1 | -1 | 0, t0: number, t1: number, depth: number, fibers = 3, steps = 8): MuscleGeo {
  const { prof, at } = g;
  const outer: Pt[] = [];
  const inner: Pt[] = [];
  const shape = (u: number) => Math.pow(Math.sin(Math.PI * u), 0.75);
  const point = (u: number, f: number): Pt => {
    const t = t0 + (t1 - t0) * u;
    const an = profAt(prof, t, 1);
    const po = profAt(prof, t, 2);
    if (side === 0) {
      const c = (an - po) / 2;
      const hw = ((an + po) / 2) * depth * shape(u);
      return at(t, c + hw * f);
    }
    const w = side === 1 ? an : po;
    return at(t, side * w * (0.97 - depth * shape(u) * (1 - f)));
  };
  for (let i = 0; i <= steps; i++) outer.push(point(i / steps, 1));
  for (let i = steps - 1; i >= 1; i--) inner.push(point(i / steps, side === 0 ? -1 : 0));
  const fib: string[] = [];
  for (let k = 1; k <= fibers; k++) {
    const f = side === 0 ? -1 + (2 * k) / (fibers + 1) : k / (fibers + 1);
    const line: Pt[] = [];
    for (let i = 1; i < steps; i++) line.push(point(i / steps, f));
    fib.push(smoothOpen(line));
  }
  return { d: smoothClosed([...outer, ...inner]), fibers: fib };
}

/** Kontur ichidagi anatomik chiziq (mushaklar orasidagi ariqcha) */
export function groove(g: Geo, t0: number, t1: number, side: 1 | -1, frac: number, steps = 5): string {
  const pts: Pt[] = [];
  for (let i = 0; i <= steps; i++) {
    const t = t0 + ((t1 - t0) * i) / steps;
    const w = profAt(g.prof, t, side === 1 ? 1 : 2);
    pts.push(g.at(t, side * w * frac));
  }
  return smoothOpen(pts);
}

/** Yorug'lik (yuqori-old) tomoniga qaragan gradient uchlari */
export const LIGHT = norm({ x: 0.45, y: -1 });
export function shadeAxis(g: Geo, t = 0.5): { p1: Pt; p2: Pt } {
  const an = profAt(g.prof, t, 1);
  const po = profAt(g.prof, t, 2);
  const c = g.at(t, (an - po) / 2);
  const hw = (an + po) / 2;
  const s = g.n.x * LIGHT.x + g.n.y * LIGHT.y >= 0 ? 1 : -1;
  return { p1: add(c, mul(g.n, s * hw)), p2: add(c, mul(g.n, -s * hw)) };
}

/* ================= Profillar (yon ko'rinish, birlik ≈ 1 sm) ================= */

export const PROF = {
  torso: [
    [-0.2, 2, 6.5],
    [-0.12, 6.5, 10.8],
    [-0.02, 8.2, 12],
    [0.1, 9.2, 10.6],
    [0.22, 9.2, 8.2],
    [0.36, 8.9, 7.6],
    [0.48, 8.9, 8.4],
    [0.6, 10.2, 9.6],
    [0.72, 11.8, 10.6],
    [0.82, 12.3, 10.9],
    [0.91, 10.6, 10.2],
    [0.98, 7.2, 8.2],
    [1.03, 4.8, 5.2],
  ],
  thigh: [
    [-0.06, 8.6, 9.4],
    [0.12, 9.6, 9.8],
    [0.32, 9.9, 8.8],
    [0.52, 9, 8],
    [0.72, 7.8, 6.6],
    [0.9, 6.4, 5.4],
    [1.02, 5.4, 4.9],
  ],
  shin: [
    [-0.02, 5.4, 5.2],
    [0.14, 5.1, 7.2],
    [0.3, 4.8, 7.7],
    [0.48, 4.2, 5.8],
    [0.72, 3.6, 3.9],
    [1.0, 3.3, 3.3],
  ],
  upperArm: [
    [-0.1, 6.2, 6.6],
    [0.1, 6.8, 6.4],
    [0.3, 5, 5.7],
    [0.5, 5.4, 5.9],
    [0.72, 5, 4.9],
    [0.9, 4.1, 4.1],
    [1.02, 3.8, 4.3],
  ],
  forearm: [
    [-0.02, 4.2, 4.3],
    [0.18, 5.1, 4.6],
    [0.4, 4.5, 4.1],
    [0.7, 3.3, 3.1],
    [1.0, 2.8, 2.7],
  ],
} satisfies Record<string, Prof>;

/* ================= Bosh, qo'l kafti, poyabzal ================= */

/** Yon ko'rinishdagi bosh: c — markaz, up — boshning "tepa" yo'nalishi; yuz cw(up) tomonga qaragan */
export function headSide(c: Pt, up: Pt, R = 10.5) {
  const f = cw(up);
  const p = (u: number, v: number) => add(add(c, mul(up, u * R)), mul(f, v * R));
  const face = smoothClosed([
    p(1, -0.05),
    p(0.78, 0.6),
    p(0.32, 0.95),
    p(0.08, 1.04),
    p(-0.16, 1.2),
    p(-0.3, 1.02),
    p(-0.48, 1.05),
    p(-0.78, 0.92),
    p(-0.98, 0.5),
    p(-0.86, 0.02),
    p(-0.6, -0.55),
    p(-0.12, -1.0),
    p(0.5, -0.88),
  ]);
  const hair = smoothClosed([p(1.06, -0.1), p(0.86, 0.62), p(0.6, 0.66), p(0.62, 0.05), p(0.3, -0.62), p(-0.2, -0.8), p(-0.08, -1.04), p(0.5, -0.94)]);
  const ear = { c: p(-0.12, -0.12), up };
  const brow = smoothOpen([p(0.3, 0.62), p(0.36, 0.84)]);
  return { face, hair, ear, brow };
}

/** Musht (yon ko'rinish): w — bilak, fd — bilak yo'nalishi */
export function fistSide(w: Pt, fd: Pt): string {
  const n = ccw(fd);
  const p = (a: number, b: number) => add(add(w, mul(fd, a)), mul(n, b));
  return smoothClosed([p(-1, 2.6), p(2.4, 3.8), p(6.4, 4.2), p(9.6, 2.2), p(10.2, -0.8), p(8.6, -3.4), p(4.4, -3.8), p(0, -2.8)]);
}

/** Poyabzal: ankle — to'piq, f — oyoq kafti yo'nalishi */
export function shoeSide(ankle: Pt, f: Pt) {
  const dn = cw(f);
  const p = (a: number, b: number) => add(add(ankle, mul(f, a)), mul(dn, b));
  const upper = smoothClosed([p(-3.6, -2.4), p(2.6, -2.6), p(7.2, 0.6), p(12.6, 2.4), p(15.6, 4.2), p(15.2, 5.8), p(-4.6, 5.8), p(-5.6, 3.2), p(-5, 0)]);
  const sole = smoothClosed([p(-5.4, 4.4), p(15.4, 4.4), p(15.6, 6), p(-5.4, 6)]);
  return { upper, sole };
}
