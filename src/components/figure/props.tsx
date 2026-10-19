// Jihozlar: skameyka, rama, kabel blok, trenajyorlar va qo'ldagi snaryadlar (shtanga, gantel, girya).
import { add, ccw, dir, lerpPt, mul, norm, sub } from '../../lib/figure';
import type { Held, Prop, Pt } from '../../types';
import type { FrontSkeleton, SideSkeleton } from '../../lib/figure';

const K = {
  frame: 'var(--eq-frame)',
  frameHi: 'var(--eq-frame-hi)',
  pad: 'var(--eq-pad)',
  padHi: 'var(--eq-pad-hi)',
  steel: 'var(--eq-steel)',
  steelHi: 'var(--eq-steel-hi)',
  steelLo: 'var(--eq-steel-lo)',
  iron: 'var(--eq-iron)',
  ironHi: 'var(--eq-iron-hi)',
  shadow: 'var(--eq-shadow)',
  plate: 'var(--plate-red)',
  plateDark: 'var(--plate-red-dark)',
};

const tube = (a: Pt, b: Pt, w: number, color = K.frame) => <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={color} strokeWidth={w} strokeLinecap="round" />;
const floorShadow = (x: number, w: number, floorY: number) => <ellipse cx={x} cy={floorY + 0.6} rx={w / 2} ry={2.2} fill={K.shadow} />;

/** Yumshoq yostiq (skameyka, o'rindiq): ustki yorug' qirra va tikuv chizig'i bilan */
function Pad({ a, b, r }: { a: Pt; b: Pt; r: number }) {
  const d = norm(sub(b, a));
  const n = ccw(d);
  const up = n.y < 0 ? n : mul(n, -1);
  const hi1 = add(a, mul(up, r - 1.2));
  const hi2 = add(b, mul(up, r - 1.2));
  const st1 = add(add(a, mul(d, 2.5)), mul(up, -0.6));
  const st2 = add(add(b, mul(d, -2.5)), mul(up, -0.6));
  return (
    <g>
      <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={K.pad} strokeWidth={r * 2} strokeLinecap="round" />
      <line x1={hi1.x} y1={hi1.y} x2={hi2.x} y2={hi2.y} stroke={K.padHi} strokeWidth={1.4} strokeLinecap="round" />
      <line x1={st1.x} y1={st1.y} x2={st2.x} y2={st2.y} stroke={K.padHi} strokeWidth={0.6} strokeDasharray="1.6 1.6" opacity={0.6} />
    </g>
  );
}

export function PropShape({ p, floorY }: { p: Prop; floorY: number }) {
  const w = p.w ?? 60;
  const h = p.h ?? 8;
  switch (p.kind) {
    case 'bench': {
      const top = p.y + h / 2;
      return (
        <g>
          {floorShadow(p.x + w / 2, w * 0.95, floorY)}
          {tube({ x: p.x + 9, y: top + 3 }, { x: p.x + 9, y: floorY - 2 }, 4.2)}
          {tube({ x: p.x + w - 9, y: top + 3 }, { x: p.x + w - 9, y: floorY - 2 }, 4.2)}
          {tube({ x: p.x + 2, y: floorY - 1.6 }, { x: p.x + 16, y: floorY - 1.6 }, 3.2, K.frameHi)}
          {tube({ x: p.x + w - 16, y: floorY - 1.6 }, { x: p.x + w - 2, y: floorY - 1.6 }, 3.2, K.frameHi)}
          {tube({ x: p.x + 6, y: top + 4.5 }, { x: p.x + w - 6, y: top + 4.5 }, 3)}
          <Pad a={{ x: p.x + h / 2, y: top }} b={{ x: p.x + w - h / 2, y: top }} r={h / 2} />
        </g>
      );
    }
    case 'inclineBench': {
      const a = p.angle ?? 35;
      const back = dir(270 + a);
      const end = add({ x: p.x, y: p.y }, mul(back, w));
      return (
        <g>
          {floorShadow(p.x - w * 0.1, w * 1.3, floorY)}
          {tube({ x: p.x + 2, y: p.y + 6 }, { x: p.x + 2, y: floorY - 2 }, 4.4)}
          {tube({ x: p.x - w * 0.55, y: floorY - 2 }, { x: p.x + 36, y: floorY - 2 }, 3.6, K.frameHi)}
          {tube(lerpPt({ x: p.x, y: p.y }, end, 0.7), { x: p.x - w * 0.45, y: floorY - 2 }, 3.4)}
          <Pad a={{ x: p.x + 2, y: p.y + 3 }} b={{ x: p.x + 30, y: p.y + 3 }} r={4} />
          <Pad a={{ x: p.x - 1, y: p.y }} b={end} r={4.2} />
        </g>
      );
    }
    case 'seat': {
      const backH = h > 8 ? h : 0;
      return (
        <g>
          {floorShadow(p.x + w / 2, w + 10, floorY)}
          {tube({ x: p.x + w / 2, y: p.y + 6 }, { x: p.x + w / 2, y: floorY - 2 }, 4.6)}
          {tube({ x: p.x - 4, y: floorY - 2 }, { x: p.x + w + 4, y: floorY - 2 }, 3.6, K.frameHi)}
          <Pad a={{ x: p.x + 4, y: p.y + 4 }} b={{ x: p.x + w - 4, y: p.y + 4 }} r={4} />
          {backH > 0 && <Pad a={{ x: p.x - 3, y: p.y + 2 }} b={add({ x: p.x - 3, y: p.y + 2 }, mul(dir(p.angle ?? -8), backH))} r={4} />}
        </g>
      );
    }
    case 'rack': {
      const hook = p.y + (p.h ?? 40);
      const holes = [];
      for (let y = p.y + 8; y < floorY - 10; y += 7) holes.push(<circle key={y} cx={p.x + 2.5} cy={y} r={0.9} fill={K.shadow} />);
      return (
        <g>
          <rect x={p.x} y={p.y} width={5} height={floorY - p.y} rx={1} fill={K.frame} />
          {holes}
          <path d={`M${p.x + 4} ${hook} h7 v-5 h2.5 v7.5 h-9.5 z`} fill={K.frameHi} />
        </g>
      );
    }
    case 'pullupBar':
      return (
        <g>
          {tube({ x: p.x - w / 2, y: p.y - 32 }, { x: p.x - w / 2, y: p.y }, 4.4)}
          {tube({ x: p.x + w / 2, y: p.y - 32 }, { x: p.x + w / 2, y: p.y }, 4.4)}
          <line x1={p.x - w / 2} y1={p.y} x2={p.x + w / 2} y2={p.y} stroke={K.steel} strokeWidth={3.6} strokeLinecap="round" />
          <line x1={p.x - w / 2} y1={p.y - 0.8} x2={p.x + w / 2} y2={p.y - 0.8} stroke={K.steelHi} strokeWidth={0.9} strokeLinecap="round" />
        </g>
      );
    case 'dipBars':
      return (
        <g>
          {floorShadow(p.x + 10, 22, floorY)}
          {tube({ x: p.x + 10, y: p.y }, { x: p.x + 10, y: floorY - 2 }, 4.6)}
          {tube({ x: p.x + 2, y: floorY - 2 }, { x: p.x + 18, y: floorY - 2 }, 3.4, K.frameHi)}
          <line x1={p.x - 14} y1={p.y} x2={p.x + 14} y2={p.y} stroke={K.steel} strokeWidth={4} strokeLinecap="round" />
        </g>
      );
    case 'cableTower': {
      const top = Math.min(p.y, 30) - 10;
      const stackTop = floorY - 30;
      const plates = [];
      for (let i = 0; i < 8; i++) plates.push(<rect key={i} x={p.x - 4.5} y={stackTop + i * 3.6} width={9} height={3} rx={0.6} fill={i < 2 ? K.ironHi : K.iron} />);
      return (
        <g>
          {floorShadow(p.x, 18, floorY)}
          <rect x={p.x - 6} y={top} width={12} height={floorY - top} rx={2} fill={K.frame} />
          <rect x={p.x - 6} y={top} width={2} height={floorY - top} fill={K.frameHi} opacity={0.6} />
          {plates}
          <circle cx={p.x} cy={p.y} r={5} fill={K.iron} stroke={K.steel} strokeWidth={1.4} />
          <circle cx={p.x} cy={p.y} r={1.4} fill={K.steelHi} />
        </g>
      );
    }
    case 'box':
      return (
        <g>
          {floorShadow(p.x + w / 2, w + 4, floorY)}
          <rect x={p.x} y={p.y} width={w} height={h} rx={2.5} fill={K.pad} />
          <rect x={p.x} y={p.y} width={w} height={2.2} rx={1.1} fill={K.padHi} />
          <rect x={p.x + 4} y={p.y + 6} width={w - 8} height={h - 10} rx={1.5} fill="none" stroke={K.padHi} strokeWidth={0.6} opacity={0.5} />
        </g>
      );
    case 'pad': {
      const a = p.angle ?? 0;
      const d = dir(90 + a);
      return <Pad a={{ x: p.x, y: p.y }} b={add({ x: p.x, y: p.y }, mul(d, w))} r={h / 2} />;
    }
    case 'mat':
      return (
        <g>
          <rect x={p.x} y={floorY - 3} width={w} height={3} rx={1.5} fill="var(--eq-mat)" />
          <rect x={p.x + 1} y={floorY - 3} width={w - 2} height={0.8} rx={0.4} fill="var(--eq-mat-hi)" />
        </g>
      );
    case 'machine':
      return <rect x={p.x} y={p.y} width={w} height={h} rx={4} fill="none" stroke={K.frame} strokeWidth={4} />;
    case 'benchTop':
      return (
        <g>
          <rect x={p.x - w / 2} y={p.y} width={w} height={h} rx={h / 2} fill={K.pad} />
          <rect x={p.x - w / 2 + 2} y={p.y + 0.8} width={w - 4} height={1.2} rx={0.6} fill={K.padHi} />
        </g>
      );
    case 'seatFront':
      return (
        <g>
          {floorShadow(p.x, w * 0.8, floorY)}
          <rect x={p.x - 3} y={p.y + 7} width={6} height={floorY - p.y - 7} fill={K.frame} />
          <rect x={p.x - w / 2} y={p.y} width={w} height={7} rx={3.5} fill={K.pad} />
          <rect x={p.x - w / 2 + 2} y={p.y + 0.8} width={w - 4} height={1.1} rx={0.55} fill={K.padHi} />
        </g>
      );
    case 'legPressFrame': {
      const a = p.angle ?? 45;
      const d = dir(90 - a);
      const end = add({ x: p.x, y: p.y }, mul(d, w));
      return (
        <g>
          {tube({ x: p.x, y: p.y }, end, 5.5)}
          {tube({ x: p.x, y: p.y - 0.4 }, end, 1.2, K.frameHi)}
          {tube({ x: p.x + 10, y: floorY - 1 }, end, 3.4)}
          {tube({ x: p.x - 12, y: floorY - 2 }, { x: end.x + 6, y: floorY - 2 }, 3.6, K.frameHi)}
        </g>
      );
    }
  }
}

/** Disk (yon tomondan — yuzi ko'rinadi). Ichi yarim shaffof: orqasidagi tana ko'rinib tursin */
export function PlateFace({ c, r, color = K.plate, dark = K.plateDark }: { c: Pt; r: number; color?: string; dark?: string }) {
  return (
    <g>
      <circle cx={c.x} cy={c.y} r={r - 1.8} fill={color} opacity={0.22} />
      <circle cx={c.x} cy={c.y} r={r - 1.8} fill="none" stroke={color} strokeWidth={3.8} />
      <circle cx={c.x} cy={c.y} r={r - 3.9} fill="none" stroke={dark} strokeWidth={0.7} opacity={0.8} />
      <path d={`M${c.x - r * 0.7} ${c.y - r * 0.45} A${r - 1.8} ${r - 1.8} 0 0 1 ${c.x + r * 0.2} ${c.y - r + 2.2}`} fill="none" stroke="#fff" strokeWidth={0.9} opacity={0.35} strokeLinecap="round" />
      <circle cx={c.x} cy={c.y} r={5.2} fill={K.steelLo} />
      <circle cx={c.x} cy={c.y} r={4.2} fill={K.steel} />
      <circle cx={c.x} cy={c.y} r={2.2} fill={K.steelLo} />
      <circle cx={c.x - 1.3} cy={c.y - 1.4} r={1} fill={K.steelHi} />
    </g>
  );
}

function hexPts(c: Pt, r: number) {
  return Array.from({ length: 6 }, (_, i) => {
    const a = (Math.PI / 3) * i + Math.PI / 6;
    return `${(c.x + r * Math.cos(a)).toFixed(1)},${(c.y + r * Math.sin(a)).toFixed(1)}`;
  }).join(' ');
}

export function HeldSide({ held, s, near }: { held: Held; s: SideSkeleton; near: boolean }) {
  const arm = near ? s.arm : s.arm2;
  const hand = near ? s.hand : s.hand2;
  const fd = norm(sub(arm.c, arm.b));
  const op = near ? 1 : 0.5;
  if (!near && held.single) return null;
  switch (held.kind) {
    case 'barbell':
      return near ? <PlateFace c={hand} r={22} /> : null;
    case 'ezbar':
      return near ? <PlateFace c={hand} r={14.5} color="var(--plate-blue)" dark="var(--plate-blue-dark)" /> : null;
    case 'plate':
      return near ? (
        <g>
          <circle cx={hand.x} cy={hand.y} r={12} fill={K.iron} />
          <circle cx={hand.x} cy={hand.y} r={9} fill="none" stroke={K.ironHi} strokeWidth={0.8} />
          <circle cx={hand.x} cy={hand.y} r={2.6} fill={K.shadow} />
        </g>
      ) : null;
    case 'dumbbell':
      return (
        <g opacity={op}>
          <polygon points={hexPts(hand, 8)} fill={K.iron} />
          <polygon points={hexPts(hand, 6.2)} fill={K.ironHi} opacity={0.5} />
          <circle cx={hand.x} cy={hand.y} r={2.4} fill={K.steel} />
        </g>
      );
    case 'kettlebell': {
      if (!near) return null;
      const c = add(hand, mul(fd, 12));
      return (
        <g>
          <circle cx={hand.x} cy={hand.y} r={4.6} fill="none" stroke={K.iron} strokeWidth={2.6} />
          <circle cx={c.x} cy={c.y} r={9.5} fill={K.iron} />
          <circle cx={c.x - 2.6} cy={c.y - 2.8} r={3} fill={K.ironHi} opacity={0.5} />
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
            <line x1={from.x} y1={from.y} x2={hand.x} y2={hand.y} stroke={held.kind === 'band' ? 'var(--plate-green)' : K.steel} strokeWidth={held.kind === 'band' ? 2.6 : 1.2} strokeLinecap="round" />
          )}
          <circle cx={hand.x} cy={hand.y} r={4.4} fill="none" stroke={K.iron} strokeWidth={2.2} />
        </g>
      );
    }
  }
}

/** Old ko'rinishdagi shtanga diski — chetidan (tor to'rtburchak) */
function PlateEdge({ x, y, h, w, color }: { x: number; y: number; h: number; w: number; color: string }) {
  return (
    <g>
      <rect x={x - w / 2} y={y - h / 2} width={w} height={h} rx={1.6} fill={color} />
      <rect x={x - w / 2 + 0.6} y={y - h / 2 + 1} width={1} height={h - 2} rx={0.5} fill="#fff" opacity={0.25} />
    </g>
  );
}

export function HeldFront({ held, s, cx }: { held: Held; s: FrontSkeleton; cx: number }) {
  const [r, l] = s.hands;
  if (held.kind === 'barbell' && held.both) {
    const y = (l.y + r.y) / 2;
    const xl = l.x - 22;
    const xr = r.x + 22;
    return (
      <g>
        {held.from && <line x1={cx} y1={y} x2={held.from.x} y2={held.from.y} stroke={K.steel} strokeWidth={1.2} />}
        <line x1={xl - 10} y1={y} x2={xr + 10} y2={y} stroke={K.steel} strokeWidth={2.8} strokeLinecap="round" />
        <line x1={xl - 10} y1={y - 0.7} x2={xr + 10} y2={y - 0.7} stroke={K.steelHi} strokeWidth={0.7} strokeLinecap="round" />
        {[xl, xr].map((x, i) => {
          const k = i === 0 ? -1 : 1;
          return (
            <g key={i}>
              <PlateEdge x={x} y={y} h={44} w={6} color={K.plate} />
              <PlateEdge x={x + k * 6.4} y={y} h={34} w={4.6} color="var(--plate-blue)" />
              <rect x={x + k * 10.4 - 1.8} y={y - 4} width={3.6} height={8} rx={1} fill={K.steel} />
            </g>
          );
        })}
      </g>
    );
  }
  if (held.kind === 'band' && held.both) return <line x1={l.x} y1={l.y} x2={r.x} y2={r.y} stroke="var(--plate-green)" strokeWidth={2.8} strokeLinecap="round" />;
  if (held.kind === 'handle' && held.both)
    return (
      <g>
        <line x1={l.x - 12} y1={l.y + 2} x2={r.x + 12} y2={r.y + 2} stroke={K.steel} strokeWidth={3.2} strokeLinecap="round" />
        <line x1={l.x - 12} y1={l.y + 1.2} x2={r.x + 12} y2={r.y + 1.2} stroke={K.steelHi} strokeWidth={0.7} strokeLinecap="round" />
      </g>
    );
  if (held.kind === 'dumbbell')
    return (
      <g>
        {s.hands.map((h, i) => (
          <g key={i}>
            <rect x={h.x - 9} y={h.y - 1.6} width={18} height={3.2} rx={1.4} fill={K.steel} />
            <rect x={h.x - 12.5} y={h.y - 6.5} width={5.5} height={13} rx={1.4} fill={K.iron} />
            <rect x={h.x + 7} y={h.y - 6.5} width={5.5} height={13} rx={1.4} fill={K.iron} />
            <rect x={h.x - 12.5} y={h.y - 6.5} width={5.5} height={2.4} rx={1} fill={K.ironHi} opacity={0.6} />
            <rect x={h.x + 7} y={h.y - 6.5} width={5.5} height={2.4} rx={1} fill={K.ironHi} opacity={0.6} />
          </g>
        ))}
      </g>
    );
  if (held.kind === 'cable' && held.from) {
    const fromR = held.from;
    const fromL = { x: 2 * cx - fromR.x, y: fromR.y };
    return (
      <g>
        <line x1={fromR.x} y1={fromR.y} x2={r.x} y2={r.y} stroke={K.steel} strokeWidth={1.2} />
        <line x1={fromL.x} y1={fromL.y} x2={l.x} y2={l.y} stroke={K.steel} strokeWidth={1.2} />
        <circle cx={r.x} cy={r.y} r={4.2} fill="none" stroke={K.iron} strokeWidth={2.2} />
        <circle cx={l.x} cy={l.y} r={4.2} fill="none" stroke={K.iron} strokeWidth={2.2} />
      </g>
    );
  }
  return null;
}
