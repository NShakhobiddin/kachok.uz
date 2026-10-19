import { memo, useEffect, useId, useRef, useState } from 'react';
import type { AnimSpec, FrontPose, Held, MuscleId, Phase, Prop, Pt, SidePose } from '../../types';
import {
  add,
  ccw,
  cw,
  dir,
  lerp,
  lerpPt,
  mul,
  norm,
  sample,
  solveFront,
  solveSide,
  sub,
  totalDuration,
  type FrontSkeleton,
  type SideLimb,
  type SideSkeleton,
} from '../../lib/figure';
import { usePrefersReducedMotion } from '../../lib/hooks';

const C = {
  near: 'var(--fig-near)',
  far: 'var(--fig-far)',
  cut: 'var(--fig-cut)',
  prop: 'var(--fig-prop)',
  propEdge: 'var(--fig-prop-edge)',
  primary: 'var(--muscle-primary)',
  secondary: 'var(--muscle-secondary)',
  plate: 'var(--plate-red)',
  plateDark: 'var(--plate-red-dark)',
  iron: 'var(--iron)',
};

/* ---------- yordamchi chizish funksiyalari ---------- */

const f2 = (n: number) => Math.round(n * 10) / 10;
const P = (p: Pt) => `${f2(p.x)} ${f2(p.y)}`;

/** Ikki uchi har xil qalinlikdagi kapsula (konussimon a’zo) */
export function capsule(a: Pt, ra: number, b: Pt, rb: number): string {
  const d = sub(b, a);
  const u = norm(d);
  const n = ccw(u);
  const p1 = add(a, mul(n, ra));
  const p2 = add(b, mul(n, rb));
  const p3 = add(b, mul(n, -rb));
  const p4 = add(a, mul(n, -ra));
  return `M${P(p1)} L${P(p2)} A${f2(rb)} ${f2(rb)} 0 0 1 ${P(p3)} L${P(p4)} A${f2(ra)} ${f2(ra)} 0 0 1 ${P(p1)} Z`;
}

/** Yopiq silliq kontur (Catmull-Rom -> Bezier) */
function smoothClosed(pts: Pt[]): string {
  const n = pts.length;
  let d = `M${P(pts[0])}`;
  for (let i = 0; i < n; i++) {
    const p0 = pts[(i - 1 + n) % n];
    const p1 = pts[i];
    const p2 = pts[(i + 1) % n];
    const p3 = pts[(i + 2) % n];
    const c1 = { x: p1.x + (p2.x - p0.x) / 6, y: p1.y + (p2.y - p0.y) / 6 };
    const c2 = { x: p2.x - (p3.x - p1.x) / 6, y: p2.y - (p3.y - p1.y) / 6 };
    d += ` C${P(c1)} ${P(c2)} ${P(p2)}`;
  }
  return d + 'Z';
}

/* ---------- Yon ko‘rinish: tana ---------- */

function torsoFrame(s: SideSkeleton) {
  const u = norm(sub(s.shoulder, s.hip));
  const f = cw(u);
  const Lt = Math.hypot(s.shoulder.x - s.hip.x, s.shoulder.y - s.hip.y);
  const at = (along: number, off: number) => {
    const bend = -s.curve * 13 * Math.sin(Math.PI * Math.min(1, Math.max(0, along)));
    return add(add(s.hip, mul(u, along * Lt)), mul(f, off + bend));
  };
  return { u, f, at };
}

function torsoPath(s: SideSkeleton): string {
  const { at } = torsoFrame(s);
  const pts: [number, number][] = [
    [-0.14, -6],
    [-0.02, -11.5],
    [0.2, -8.6],
    [0.5, -10.2],
    [0.78, -11.4],
    [0.96, -8.5],
    [1.05, -2.5],
    [1.0, 6],
    [0.88, 11.5],
    [0.68, 11.2],
    [0.46, 8.4],
    [0.22, 9.2],
    [0.02, 10],
    [-0.12, 5],
  ];
  return smoothClosed(pts.map(([a, o]) => at(a, o)));
}

interface MuscleShape {
  d: string;
}

function segOverlay(l: { a: Pt; b: Pt }, t0: number, t1: number, side: 1 | -1 | 0, off: number, r0: number, r1: number): string {
  const d = norm(sub(l.b, l.a));
  const front = ccw(d);
  const o = mul(front, side * off);
  return capsule(add(lerpPt(l.a, l.b, t0), o), r0, add(lerpPt(l.a, l.b, t1), o), r1);
}

function sideMuscles(s: SideSkeleton, id: MuscleId): MuscleShape[] {
  const { at } = torsoFrame(s);
  const thigh = { a: s.leg.a, b: s.leg.b };
  const shin = { a: s.leg.b, b: s.leg.c };
  const ua = { a: s.arm.a, b: s.arm.b };
  const fa = { a: s.arm.b, b: s.arm.c };
  const tc = (a0: number, o0: number, a1: number, o1: number, r0: number, r1: number) => capsule(at(a0, o0), r0, at(a1, o1), r1);
  switch (id) {
    case 'quads':
      return [{ d: segOverlay(thigh, 0.2, 0.86, 1, 3.4, 6.2, 4) }];
    case 'hamstrings':
      return [{ d: segOverlay(thigh, 0.22, 0.84, -1, 3.6, 5.4, 3.6) }];
    case 'adductors':
      return [{ d: segOverlay(thigh, 0.12, 0.55, 0, 0, 4.4, 2.6) }];
    case 'glutes':
      return [{ d: tc(-0.1, -6.5, 0.06, -7.5, 6.5, 6) }];
    case 'calves':
      return [{ d: segOverlay(shin, 0.1, 0.55, -1, 2.4, 4.8, 3) }];
    case 'chest':
      return [{ d: tc(0.68, 7.4, 0.88, 6.6, 4.6, 4.8) }];
    case 'abs':
      return [{ d: tc(0.16, 6.2, 0.6, 7.2, 3.3, 3.3) }];
    case 'obliques':
      return [{ d: tc(0.16, 1, 0.55, 2.4, 4.2, 4.6) }];
    case 'lats':
      return [{ d: tc(0.42, -4.8, 0.82, -3.8, 4, 5.6) }];
    case 'lowerBack':
      return [{ d: tc(0.06, -7.4, 0.44, -8, 3.4, 3.2) }];
    case 'upperBack':
      return [{ d: tc(0.66, -8.2, 0.9, -7.6, 3.8, 4) }];
    case 'traps':
      return [{ d: tc(0.88, -5.5, 1.05, -1.5, 3.6, 3) }];
    case 'frontDelts':
      return [{ d: segOverlay(ua, -0.04, 0.32, 1, 2.6, 5.2, 3.6) }];
    case 'sideDelts':
      return [{ d: segOverlay(ua, -0.12, 0.28, 0, 0, 6.2, 4.2) }];
    case 'rearDelts':
      return [{ d: segOverlay(ua, -0.04, 0.32, -1, 2.6, 5.2, 3.6) }];
    case 'biceps':
      return [{ d: segOverlay(ua, 0.32, 0.86, 1, 2.1, 3.8, 2.8) }];
    case 'triceps':
      return [{ d: segOverlay(ua, 0.2, 0.86, -1, 2.2, 4, 2.8) }];
    case 'forearms':
      return [{ d: segOverlay(fa, 0.04, 0.6, 0, 0, 3.8, 2.8) }];
  }
}

/* ---------- Old/orqa ko‘rinish ---------- */

export function frontTorsoPath(s: FrontSkeleton): string {
  const { cx, shoulderY: y, hipY } = s;
  const pts: Pt[] = [
    { x: cx - 20, y: y - 1 },
    { x: cx - 8, y: y - 4 },
    { x: cx + 8, y: y - 4 },
    { x: cx + 20, y: y - 1 },
    { x: cx + 17.5, y: y + 16 },
    { x: cx + 13, y: y + 36 },
    { x: cx + 15.5, y: hipY + 3 },
    { x: cx + 6, y: hipY + 9 },
    { x: cx - 6, y: hipY + 9 },
    { x: cx - 15.5, y: hipY + 3 },
    { x: cx - 13, y: y + 36 },
    { x: cx - 17.5, y: y + 16 },
  ];
  return smoothClosed(pts);
}

function poly(pts: Pt[]) {
  return smoothClosed(pts);
}

export function frontMuscles(s: FrontSkeleton, id: MuscleId, back: boolean): MuscleShape[] {
  const { cx, shoulderY: y, hipY } = s;
  const both = (fn: (k: 1 | -1) => string): MuscleShape[] => [{ d: fn(1) }, { d: fn(-1) }];
  const limb = (l: SideLimb, which: 'u' | 'l', t0: number, t1: number, off: number, r0: number, r1: number, k: 1 | -1) => {
    const seg = which === 'u' ? { a: l.a, b: l.b } : { a: l.b, b: l.c };
    const d = norm(sub(seg.b, seg.a));
    const o = mul(ccw(d), off * k);
    return capsule(add(lerpPt(seg.a, seg.b, t0), o), r0, add(lerpPt(seg.a, seg.b, t1), o), r1);
  };
  const arm = (k: 1 | -1) => s.arms[k === 1 ? 0 : 1];
  const leg = (k: 1 | -1) => s.legs[k === 1 ? 0 : 1];
  if (!back) {
    switch (id) {
      case 'chest':
        return both((k) => poly([
          { x: cx + k * 2, y: y + 3 },
          { x: cx + k * 17, y: y + 2 },
          { x: cx + k * 16, y: y + 14 },
          { x: cx + k * 3, y: y + 18 },
        ]));
      case 'abs':
        return [{ d: poly([
          { x: cx - 6, y: y + 21 },
          { x: cx + 6, y: y + 21 },
          { x: cx + 5.5, y: hipY - 2 },
          { x: cx - 5.5, y: hipY - 2 },
        ]) }];
      case 'obliques':
        return both((k) => poly([
          { x: cx + k * 9, y: y + 22 },
          { x: cx + k * 14.5, y: y + 24 },
          { x: cx + k * 14, y: hipY - 3 },
          { x: cx + k * 8, y: hipY - 5 },
        ]));
      case 'frontDelts':
      case 'sideDelts':
        return both((k) => limb(arm(k), 'u', -0.12, 0.3, id === 'sideDelts' ? -1.5 : 1.5, 6.4, 4.4, k));
      case 'biceps':
        return both((k) => limb(arm(k), 'u', 0.34, 0.86, 0, 3.8, 2.8, k));
      case 'forearms':
        return both((k) => limb(arm(k), 'l', 0.05, 0.6, 0, 3.6, 2.6, k));
      case 'quads':
        return both((k) => limb(leg(k), 'u', 0.18, 0.86, 0.5, 6.4, 4.2, k));
      case 'adductors':
        return both((k) => limb(leg(k), 'u', 0.1, 0.55, 3.6, 3.6, 2, -k as 1 | -1));
      case 'calves':
        return both((k) => limb(leg(k), 'l', 0.1, 0.5, 2.4, 3.2, 2.2, k));
      case 'traps':
        return both((k) => poly([
          { x: cx + k * 5, y: y - 9 },
          { x: cx + k * 16, y: y - 2 },
          { x: cx + k * 7, y: y - 2 },
        ]));
      default:
        return [];
    }
  }
  switch (id) {
    case 'traps':
      return [{ d: poly([
        { x: cx, y: y - 9 },
        { x: cx + 17, y: y - 1 },
        { x: cx + 4, y: y + 12 },
        { x: cx, y: y + 30 },
        { x: cx - 4, y: y + 12 },
        { x: cx - 17, y: y - 1 },
      ]) }];
    case 'upperBack':
      return both((k) => poly([
        { x: cx + k * 4, y: y + 6 },
        { x: cx + k * 13, y: y + 6 },
        { x: cx + k * 11, y: y + 22 },
        { x: cx + k * 3, y: y + 25 },
      ]));
    case 'lats':
      return both((k) => poly([
        { x: cx + k * 15, y: y + 9 },
        { x: cx + k * 18, y: y + 20 },
        { x: cx + k * 12.5, y: y + 42 },
        { x: cx + k * 6, y: y + 40 },
        { x: cx + k * 8, y: y + 22 },
      ]));
    case 'lowerBack':
      return both((k) => poly([
        { x: cx + k * 1.5, y: y + 32 },
        { x: cx + k * 6, y: y + 32 },
        { x: cx + k * 6.5, y: hipY - 1 },
        { x: cx + k * 1.5, y: hipY - 1 },
      ]));
    case 'rearDelts':
    case 'sideDelts':
      return both((k) => limb(arm(k), 'u', -0.12, 0.3, 0, 6.4, 4.4, k));
    case 'triceps':
      return both((k) => limb(arm(k), 'u', 0.25, 0.86, 0, 4, 2.8, k));
    case 'forearms':
      return both((k) => limb(arm(k), 'l', 0.05, 0.6, 0, 3.6, 2.6, k));
    case 'glutes':
      return both((k) => poly([
        { x: cx + k * 1.5, y: hipY - 4 },
        { x: cx + k * 14.5, y: hipY - 2 },
        { x: cx + k * 15, y: hipY + 10 },
        { x: cx + k * 2, y: hipY + 12 },
      ]));
    case 'hamstrings':
      return both((k) => limb(leg(k), 'u', 0.25, 0.86, 0, 5.4, 3.8, k));
    case 'adductors':
      return both((k) => limb(leg(k), 'u', 0.1, 0.5, 3.6, 3.4, 2, -k as 1 | -1));
    case 'calves':
      return both((k) => limb(leg(k), 'l', 0.08, 0.52, 0, 4.8, 3, k));
    default:
      return [];
  }
}

/* ---------- Jihozlar ---------- */

function PropShape({ p, floorY }: { p: Prop; floorY: number }) {
  const w = p.w ?? 60;
  const h = p.h ?? 8;
  switch (p.kind) {
    case 'bench':
      return (
        <g>
          <rect x={p.x + 6} y={p.y + h} width={5} height={floorY - p.y - h} fill={C.propEdge} />
          <rect x={p.x + w - 11} y={p.y + h} width={5} height={floorY - p.y - h} fill={C.propEdge} />
          <rect x={p.x} y={p.y} width={w} height={h} rx={3.5} fill={C.prop} />
        </g>
      );
    case 'inclineBench': {
      const a = p.angle ?? 35;
      const back = dir(270 + a);
      const end = add({ x: p.x, y: p.y }, mul(back, w));
      return (
        <g>
          <line x1={p.x} y1={p.y + 4} x2={p.x} y2={floorY} stroke={C.propEdge} strokeWidth={5} />
          <line x1={p.x - w * 0.5} y1={floorY - 2} x2={p.x + 34} y2={floorY - 2} stroke={C.propEdge} strokeWidth={4} />
          <line x1={end.x} y1={end.y} x2={p.x - w * 0.45} y2={floorY} stroke={C.propEdge} strokeWidth={3.5} />
          <path d={capsule({ x: p.x, y: p.y + 3 }, 4, { x: p.x + 30, y: p.y + 3 }, 4)} fill={C.prop} />
          <path d={capsule({ x: p.x - 2, y: p.y }, 4.2, end, 4.2)} fill={C.prop} />
        </g>
      );
    }
    case 'seat': {
      // trenajyor o‘rindig‘i + suyanchiq (h = suyanchiq balandligi)
      const back = h > 8 ? h : 0;
      return (
        <g>
          <line x1={p.x + w / 2} y1={p.y + 4} x2={p.x + w / 2} y2={floorY} stroke={C.propEdge} strokeWidth={5} />
          <line x1={p.x} y1={floorY - 2} x2={p.x + w} y2={floorY - 2} stroke={C.propEdge} strokeWidth={4} />
          <rect x={p.x} y={p.y} width={w} height={8} rx={4} fill={C.prop} />
          {back > 0 && (
            <path
              d={capsule({ x: p.x - 3, y: p.y + 2 }, 4, add({ x: p.x - 3, y: p.y + 2 }, mul(dir(p.angle ?? -8), back)), 4)}
              fill={C.prop}
            />
          )}
        </g>
      );
    }
    case 'rack':
      return (
        <g opacity={0.9}>
          <rect x={p.x} y={p.y} width={5} height={floorY - p.y} fill={C.propEdge} />
          <rect x={p.x + 4} y={p.y + (p.h ?? 40)} width={8} height={4} rx={1} fill={C.propEdge} />
        </g>
      );
    case 'pullupBar':
      return (
        <g>
          <line x1={p.x - (w / 2)} y1={p.y} x2={p.x + w / 2} y2={p.y} stroke={C.iron} strokeWidth={4} strokeLinecap="round" />
          <line x1={p.x - w / 2} y1={p.y} x2={p.x - w / 2} y2={p.y - 30} stroke={C.propEdge} strokeWidth={5} />
          <line x1={p.x + w / 2} y1={p.y} x2={p.x + w / 2} y2={p.y - 30} stroke={C.propEdge} strokeWidth={5} />
        </g>
      );
    case 'dipBars':
      return (
        <g>
          <line x1={p.x - 14} y1={p.y} x2={p.x + 14} y2={p.y} stroke={C.iron} strokeWidth={4.5} strokeLinecap="round" />
          <line x1={p.x + 10} y1={p.y} x2={p.x + 10} y2={floorY} stroke={C.propEdge} strokeWidth={5} />
        </g>
      );
    case 'cableTower':
      return (
        <g>
          <rect x={p.x - 5} y={Math.min(p.y, 30) - 10} width={10} height={floorY - Math.min(p.y, 30) + 10} rx={2} fill={C.propEdge} />
          <circle cx={p.x} cy={p.y} r={4.5} fill={C.prop} stroke={C.iron} strokeWidth={1.5} />
        </g>
      );
    case 'box':
      return <rect x={p.x} y={p.y} width={w} height={h} rx={3} fill={C.prop} />;
    case 'pad': {
      const a = p.angle ?? 0;
      const d = dir(90 + a);
      return <path d={capsule({ x: p.x, y: p.y }, h / 2, add({ x: p.x, y: p.y }, mul(d, w)), h / 2)} fill={C.prop} />;
    }
    case 'mat':
      return <rect x={p.x} y={floorY - 3} width={w} height={3} rx={1.5} fill={C.prop} />;
    case 'machine':
      return (
        <g>
          <rect x={p.x} y={p.y} width={w} height={h} rx={4} fill="none" stroke={C.propEdge} strokeWidth={4} />
        </g>
      );
    case 'benchTop':
      return <rect x={p.x - w / 2} y={p.y} width={w} height={h} rx={5} fill={C.prop} />;
    case 'seatFront':
      return (
        <g>
          <rect x={p.x - w / 2} y={p.y} width={w} height={7} rx={3.5} fill={C.prop} />
          <rect x={p.x - 3} y={p.y + 7} width={6} height={floorY - p.y - 7} fill={C.propEdge} />
        </g>
      );
    case 'legPressFrame': {
      const a = p.angle ?? 45;
      const d = dir(90 - a);
      const end = add({ x: p.x, y: p.y }, mul(d, w));
      return (
        <g>
          <line x1={p.x} y1={p.y} x2={end.x} y2={end.y} stroke={C.propEdge} strokeWidth={5} strokeLinecap="round" />
          <line x1={p.x + 10} y1={floorY} x2={end.x} y2={end.y} stroke={C.propEdge} strokeWidth={3} />
        </g>
      );
    }
  }
}

function HeldSide({ held, s, near }: { held: Held; s: SideSkeleton; near: boolean }) {
  const arm = near ? s.arm : s.arm2;
  const hand = near ? s.hand : s.hand2;
  const fd = norm(sub(arm.c, arm.b));
  const op = near ? 1 : 0.55;
  if (!near && held.single) return null;
  switch (held.kind) {
    case 'barbell':
    case 'ezbar': {
      if (!near) return null;
      const r = held.kind === 'barbell' ? 21 : 14;
      return (
        <g>
          <circle cx={hand.x} cy={hand.y} r={r} fill={C.plate} />
          <circle cx={hand.x} cy={hand.y} r={r - 3.5} fill="none" stroke={C.plateDark} strokeWidth={1.4} />
          <circle cx={hand.x} cy={hand.y} r={5} fill={C.iron} />
          <circle cx={hand.x} cy={hand.y} r={2.2} fill={C.plateDark} />
        </g>
      );
    }
    case 'plate':
      return near ? (
        <g>
          <circle cx={hand.x} cy={hand.y} r={12} fill={C.iron} />
          <circle cx={hand.x} cy={hand.y} r={3} fill={C.plateDark} />
        </g>
      ) : null;
    case 'dumbbell':
      return (
        <g opacity={op}>
          <rect x={hand.x - 7} y={hand.y - 7} width={14} height={14} rx={3.5} fill={C.iron} transform={`rotate(45 ${hand.x} ${hand.y})`} />
          <circle cx={hand.x} cy={hand.y} r={3} fill={C.cut} />
        </g>
      );
    case 'kettlebell': {
      if (!near) return null;
      const c = add(hand, mul(fd, 11));
      return (
        <g>
          <circle cx={hand.x} cy={hand.y} r={4.5} fill="none" stroke={C.iron} strokeWidth={2.5} />
          <circle cx={c.x} cy={c.y} r={9} fill={C.iron} />
        </g>
      );
    }
    case 'cable':
    case 'band':
    case 'handle': {
      const from = held.from ?? { x: hand.x + 40, y: hand.y };
      return (
        <g opacity={op}>
          {held.kind !== 'handle' && (
            <line
              x1={from.x}
              y1={from.y}
              x2={hand.x}
              y2={hand.y}
              stroke={held.kind === 'band' ? 'var(--plate-green)' : C.iron}
              strokeWidth={held.kind === 'band' ? 2.4 : 1.4}
              strokeDasharray={held.kind === 'band' ? undefined : undefined}
            />
          )}
          <circle cx={hand.x} cy={hand.y} r={4} fill={C.iron} />
        </g>
      );
    }
  }
}

function Foot({ f, color }: { f: SideSkeleton['foot']; color: string }) {
  const top = add(f.ankle, mul(f.fdir, 7));
  const d = `M${P(add(f.ankle, mul(f.fdir, -3)))} L${P(f.heel)} L${P(f.toe)} L${P(top)} Z`;
  return <path d={d} fill={color} stroke={color} strokeWidth={4} strokeLinejoin="round" />;
}

/* ---------- Asosiy komponent ---------- */

export interface FigureProps {
  spec: AnimSpec;
  primary?: MuscleId[];
  secondary?: MuscleId[];
  playing?: boolean;
  /** statik ko‘rinish uchun vaqt (ms) */
  at?: number;
  speed?: number;
  className?: string;
  /** xato texnika (qizil kontur) */
  wrong?: boolean;
  onPhase?: (phase: Phase) => void;
  title?: string;
  /** kadrni figuraga moslab kesish (kichik rasmlar uchun) */
  fit?: boolean;
}

function FigureInner({ spec, primary = [], secondary = [], playing = true, at, speed = 1, className, wrong, onPhase, title, fit }: FigureProps) {
  const reduced = usePrefersReducedMotion();
  const [time, setTime] = useState(at ?? 0);
  const raf = useRef(0);
  const ref = useRef<SVGSVGElement>(null);
  const visible = useRef(true);
  const lastPhase = useRef<Phase | null>(null);
  const uid = useId().replace(/:/g, '');
  const animate = playing && !reduced && at === undefined;

  useEffect(() => {
    if (!ref.current || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(([e]) => (visible.current = e.isIntersecting));
    io.observe(ref.current);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!animate) {
      if (at !== undefined) setTime(at);
      else if (reduced) setTime(totalDuration(spec.frames) * 0.55);
      return;
    }
    let start = performance.now() - time / speed;
    let last = 0;
    const tick = (now: number) => {
      raf.current = requestAnimationFrame(tick);
      if (!visible.current) {
        start = now - time / speed;
        return;
      }
      if (now - last < 30) return; // ~33 fps — batareyani tejash
      last = now;
      setTime((now - start) * speed);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [animate, spec, speed, at, reduced]);

  const smp = sample(spec, time);
  useEffect(() => {
    if (onPhase && smp.phase !== lastPhase.current) {
      lastPhase.current = smp.phase;
      onPhase(smp.phase);
    }
  });

  const floorY = spec.floorY ?? 214;
  const fr = fit ? fitFrame(spec) : spec.frame ?? { x: 20, y: 16, w: 200, h: 204 };
  const glow = `glow-${uid}`;
  const act = smp.activation;
  const mirror = spec.facing === 'left' ? `translate(${fr.x * 2 + fr.w} 0) scale(-1 1)` : undefined;

  let body: React.ReactNode;
  if (spec.view === 'side') {
    const s = solveSide(smp.pose as SidePose, spec.anchor);
    const limb = (l: SideLimb, r: [number, number, number, number], color: string) => (
      <>
        <path d={capsule(l.a, r[0], l.b, r[1])} fill={color} stroke={C.cut} strokeWidth={1.6} paintOrder="stroke" />
        <path d={capsule(l.b, r[2], l.c, r[3])} fill={color} stroke={C.cut} strokeWidth={1.6} paintOrder="stroke" />
      </>
    );
    const heldNearFront = spec.held && (spec.held.kind === 'barbell' || spec.held.kind === 'ezbar');
    const muscles = (ids: MuscleId[], color: string, opacity: number) => (
      <g filter={`url(#${glow})`} opacity={opacity}>
        {ids.flatMap((id) => sideMuscles(s, id)).map((m, i) => (
          <path key={i} d={m.d} fill={color} />
        ))}
      </g>
    );
    const gear = spec.footGear;
    let gearEl: React.ReactNode = null;
    if (gear) {
      if (gear.kind === 'platform') {
        const mid = lerpPt(s.foot.heel, s.foot.toe, 0.45);
        const sd = norm(sub(s.foot.toe, s.foot.heel));
        const dn = mul(cw(sd), 4.5);
        const a = add(add(mid, mul(sd, 24)), dn);
        const b = add(add(mid, mul(sd, -24)), dn);
        gearEl = <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={C.iron} strokeWidth={6} strokeLinecap="round" />;
      } else {
        const shinDir = norm(sub(s.leg.c, s.leg.b));
        const side = gear.kind === 'anklePad' ? 1 : gear.kind === 'shinPad' ? -1 : 1;
        const base = gear.kind === 'kneePad' ? lerpPt(s.leg.a, s.leg.b, 0.88) : lerpPt(s.leg.b, s.leg.c, 0.9);
        const segDir = gear.kind === 'kneePad' ? norm(sub(s.leg.b, s.leg.a)) : shinDir;
        const c = add(base, mul(ccw(segDir), side * 8.5));
        gearEl = <circle cx={c.x} cy={c.y} r={6.5} fill={C.prop} stroke={C.iron} strokeWidth={1.5} />;
      }
    }
    body = (
      <g transform={mirror}>
        {/* uzoq tomon */}
        {limb(s.leg2, [9.5, 6.2, 6.2, 4], C.far)}
        <Foot f={s.foot2} color={C.far} />
        {limb(s.arm2, [6.2, 4.6, 4.6, 3.5], C.far)}
        <circle cx={s.hand2.x} cy={s.hand2.y} r={3.8} fill={C.far} />
        {spec.held && <HeldSide held={spec.held} s={s} near={false} />}
        {/* tana */}
        <path d={capsule(s.shoulder, 4.6, s.neck, 4.2)} fill={C.near} />
        <circle cx={s.head.x} cy={s.head.y} r={10.5} fill={C.near} />
        <path d={torsoPath(s)} fill={C.near} stroke={wrong ? 'var(--danger)' : C.cut} strokeWidth={wrong ? 1.4 : 0} />
        {muscles(secondary.filter((m) => !['biceps', 'triceps', 'forearms', 'frontDelts', 'sideDelts', 'rearDelts', 'quads', 'hamstrings', 'calves', 'adductors'].includes(m)), C.secondary, 0.35 + 0.35 * act)}
        {muscles(primary.filter((m) => !['biceps', 'triceps', 'forearms', 'frontDelts', 'sideDelts', 'rearDelts', 'quads', 'hamstrings', 'calves', 'adductors'].includes(m)), C.primary, 0.5 + 0.5 * act)}
        {gearEl}
        {/* yaqin oyoq */}
        {limb(s.leg, [10.5, 6.6, 6.6, 4.2], C.near)}
        <Foot f={s.foot} color={C.near} />
        {muscles(secondary.filter((m) => ['quads', 'hamstrings', 'calves', 'adductors'].includes(m)), C.secondary, 0.35 + 0.35 * act)}
        {muscles(primary.filter((m) => ['quads', 'hamstrings', 'calves', 'adductors'].includes(m)), C.primary, 0.5 + 0.5 * act)}
        {heldNearFront && <HeldSide held={spec.held!} s={s} near />}
        {/* yaqin qo‘l */}
        {limb(s.arm, [6.8, 5, 5, 3.7], C.near)}
        <circle cx={s.hand.x} cy={s.hand.y} r={4} fill={C.near} stroke={C.cut} strokeWidth={1.2} paintOrder="stroke" />
        {muscles(secondary.filter((m) => ['biceps', 'triceps', 'forearms', 'frontDelts', 'sideDelts', 'rearDelts'].includes(m)), C.secondary, 0.35 + 0.35 * act)}
        {muscles(primary.filter((m) => ['biceps', 'triceps', 'forearms', 'frontDelts', 'sideDelts', 'rearDelts'].includes(m)), C.primary, 0.5 + 0.5 * act)}
        {spec.held && !heldNearFront && <HeldSide held={spec.held} s={s} near />}
      </g>
    );
  } else {
    const back = spec.view === 'back';
    const cx = fr.x + fr.w / 2;
    const s = solveFront(smp.pose as FrontPose, cx, floorY);
    const armsFront = (s.fwd ?? 0) > 25;
    const limb = (l: SideLimb, r: [number, number, number, number]) => (
      <>
        <path d={capsule(l.a, r[0], l.b, r[1])} fill={C.near} stroke={C.cut} strokeWidth={1.4} paintOrder="stroke" />
        <path d={capsule(l.b, r[2], l.c, r[3])} fill={C.near} stroke={C.cut} strokeWidth={1.4} paintOrder="stroke" />
      </>
    );
    const muscles = (ids: MuscleId[], color: string, opacity: number) => (
      <g filter={`url(#${glow})`} opacity={opacity}>
        {ids.flatMap((id) => frontMuscles(s, id, back)).map((m, i) => (
          <path key={i} d={m.d} fill={color} />
        ))}
      </g>
    );
    const held = spec.held;
    const arms = (
      <>
        {s.arms.map((a, i) => (
          <g key={i}>
            {limb(a, [6.6, 4.8, 4.8, 3.6])}
            <circle cx={s.hands[i].x} cy={s.hands[i].y} r={4} fill={C.near} />
          </g>
        ))}
      </>
    );
    const feet = s.legs.map((l, i) => {
      const k = i === 0 ? 1 : -1;
      return <ellipse key={i} cx={l.c.x + k * 2} cy={l.c.y + 4} rx={6} ry={3.6} fill={C.near} />;
    });
    let heldEl: React.ReactNode = null;
    if (held) {
      const [r, l] = s.hands;
      if (held.kind === 'barbell' && held.both) {
        heldEl = (
          <g>
            {held.from && <line x1={cx} y1={(l.y + r.y) / 2} x2={held.from.x} y2={held.from.y} stroke={C.iron} strokeWidth={1.4} />}
            <line x1={l.x - 14} y1={l.y} x2={r.x + 14} y2={r.y} stroke={C.iron} strokeWidth={3.4} strokeLinecap="round" />
          </g>
        );
      } else if (held.kind === 'band' && held.both) {
        heldEl = <line x1={l.x} y1={l.y} x2={r.x} y2={r.y} stroke="var(--plate-green)" strokeWidth={2.6} strokeLinecap="round" />;
      } else if (held.kind === 'handle' && held.both) {
        heldEl = <line x1={l.x - 12} y1={l.y + 2} x2={r.x + 12} y2={r.y + 2} stroke={C.iron} strokeWidth={3.4} strokeLinecap="round" />;
      } else if (held.kind === 'dumbbell') {
        heldEl = s.hands.map((h, i) => (
          <g key={i}>
            <rect x={h.x - 9} y={h.y - 3.2} width={18} height={6.4} rx={2} fill={C.iron} />
            <rect x={h.x - 11} y={h.y - 6} width={5} height={12} rx={1.6} fill={C.iron} />
            <rect x={h.x + 6} y={h.y - 6} width={5} height={12} rx={1.6} fill={C.iron} />
          </g>
        ));
      } else if (held.kind === 'cable' && held.from) {
        const fromR = held.from;
        const fromL = { x: 2 * cx - fromR.x, y: fromR.y };
        heldEl = (
          <g>
            <line x1={fromR.x} y1={fromR.y} x2={r.x} y2={r.y} stroke={C.iron} strokeWidth={1.4} />
            <line x1={fromL.x} y1={fromL.y} x2={l.x} y2={l.y} stroke={C.iron} strokeWidth={1.4} />
            <circle cx={r.x} cy={r.y} r={4} fill={C.iron} />
            <circle cx={l.x} cy={l.y} r={4} fill={C.iron} />
          </g>
        );
      }
    }
    body = (
      <g>
        {!armsFront && arms}
        {s.legs.map((l, i) => (
          <g key={i}>{limb(l, [9.8, 6.4, 6.4, 4.2])}</g>
        ))}
        {feet}
        <path d={capsule({ x: cx, y: s.shoulderY - 2 }, 5, { x: cx, y: s.head.y + 6 }, 4.5)} fill={C.near} />
        <path d={frontTorsoPath(s)} fill={C.near} stroke={wrong ? 'var(--danger)' : 'none'} strokeWidth={1.4} />
        <circle cx={s.head.x} cy={s.head.y} r={10.5} fill={C.near} />
        {muscles(secondary, C.secondary, 0.35 + 0.35 * act)}
        {muscles(primary.filter((m) => !['biceps', 'triceps', 'forearms', 'frontDelts', 'sideDelts', 'rearDelts'].includes(m)), C.primary, 0.5 + 0.5 * act)}
        {armsFront && arms}
        {muscles(primary.filter((m) => ['biceps', 'triceps', 'forearms', 'frontDelts', 'sideDelts', 'rearDelts'].includes(m)), C.primary, 0.5 + 0.5 * act)}
        {heldEl}
      </g>
    );
  }

  return (
    <svg
      ref={ref}
      className={className}
      viewBox={`${fr.x} ${fr.y} ${fr.w} ${fr.h}`}
      role="img"
      aria-label={title}
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <filter id={glow} x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="2.2" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <line x1={fr.x} y1={floorY} x2={fr.x + fr.w} y2={floorY} stroke="var(--fig-floor)" strokeWidth={1.2} />
      {(spec.props ?? []).map((p, i) => (
        <g key={i} transform={mirror}>
          <PropShape p={p} floorY={floorY} />
        </g>
      ))}
      {body}
    </svg>
  );
}

export const Figure = memo(FigureInner);

const fitCache = new WeakMap<AnimSpec, { x: number; y: number; w: number; h: number }>();

/** Figuraning ikki chekka holati bo‘yicha kvadrat kadr (kichik rasmlar uchun) */
export function fitFrame(spec: AnimSpec) {
  const hit = fitCache.get(spec);
  if (hit) return hit;
  const floorY = spec.floorY ?? 214;
  const pts: { x: number; y: number; r: number }[] = [];
  for (const f of spec.frames) {
    if (spec.view === 'side') {
      const s = solveSide(f.pose as SidePose, spec.anchor);
      const heldR = spec.held?.kind === 'barbell' ? 22 : spec.held?.kind === 'ezbar' ? 15 : spec.held ? 9 : 5;
      pts.push({ ...s.head, r: 12 }, { ...s.shoulder, r: 12 }, { ...s.hip, r: 12 }, { ...s.hand, r: heldR }, { ...s.hand2, r: 5 });
      for (const l of [s.leg, s.leg2, s.arm, s.arm2]) pts.push({ ...l.b, r: 7 }, { ...l.c, r: 6 });
      for (const ft of [s.foot, s.foot2]) pts.push({ ...ft.toe, r: 3 }, { ...ft.heel, r: 3 });
    } else {
      const fr0 = spec.frame ?? { x: 20, y: 16, w: 200, h: 204 };
      const s = solveFront(f.pose as FrontPose, fr0.x + fr0.w / 2, floorY);
      const hr = spec.held?.kind === 'dumbbell' ? 12 : 5;
      pts.push({ ...s.head, r: 12 }, { ...s.hands[0], r: hr }, { ...s.hands[1], r: hr });
      for (const l of [...s.arms, ...s.legs]) pts.push({ ...l.b, r: 7 }, { ...l.c, r: 7 });
    }
  }
  let x0 = Math.min(...pts.map((p) => p.x - p.r));
  let x1 = Math.max(...pts.map((p) => p.x + p.r));
  let y0 = Math.min(...pts.map((p) => p.y - p.r));
  let y1 = Math.max(...pts.map((p) => p.y + p.r));
  const size = Math.max(x1 - x0, y1 - y0) + 14;
  const cx = (x0 + x1) / 2;
  const cy = (y0 + y1) / 2;
  x0 = cx - size / 2;
  y0 = cy - size / 2;
  x1 = size;
  y1 = size;
  const out = { x: x0, y: y0, w: x1, h: y1 };
  fitCache.set(spec, out);
  return out;
}

/** Ikki asosiy holat vaqtlari: boshlang‘ich va qarama-qarshi (statik ko‘rinish uchun) */
export function poseTimes(spec: AnimSpec): [number, number] {
  const f = spec.frames;
  if (f.length < 3) return [0, f[0].dur * 0.99];
  return [1, f[0].dur + f[1].dur + 1];
}

export { lerp };
