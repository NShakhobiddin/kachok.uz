import { memo, useEffect, useId, useMemo, useRef, useState } from 'react';
import type { AnimSpec, FrontPose, MuscleId, Phase, Pt, SidePose } from '../../types';
import { add, ccw, lerpPt, mul, norm, sample, solveFront, solveSide, sub, totalDuration } from '../../lib/figure';
import { usePrefersReducedMotion } from '../../lib/hooks';
import type { MuscleGeo } from './anatomy';
import { frontBody, sideBody, type Part, type Pump } from './body';
import { HeldFront, HeldSide, PropShape } from './props';

/* ---------- umumiy animatsiya sikli: barcha figuralar bitta requestAnimationFrame bilan ---------- */

const subs = new Set<(now: number) => void>();
let rafId = 0;
function loop(now: number) {
  subs.forEach((f) => f(now));
  rafId = subs.size ? requestAnimationFrame(loop) : 0;
}
function subscribe(f: (now: number) => void) {
  subs.add(f);
  if (!rafId) rafId = requestAnimationFrame(loop);
  return () => {
    subs.delete(f);
  };
}

const f2 = (n: number) => Math.round(n * 10) / 10;

/* ---------- chizish yordamchilari ---------- */

const STOPS: Record<string, [number, string][]> = {
  skin: [
    [0, 'var(--skin-hi)'],
    [0.42, 'var(--skin)'],
    [0.86, 'var(--skin-lo)'],
    [1, 'var(--skin-rim)'],
  ],
  cyl: [
    [0, 'var(--skin-lo)'],
    [0.36, 'var(--skin-hi)'],
    [0.62, 'var(--skin)'],
    [1, 'var(--skin-lo)'],
  ],
  shorts: [
    [0, 'var(--shorts-hi)'],
    [1, 'var(--shorts)'],
  ],
};

interface Grad {
  id: string;
  shade: string;
  p1: Pt;
  p2: Pt;
}

/** Avval barcha kesim konturlari, keyin bo'yoqlar: bir qatlam ichidagi a'zolar (son-boldir, yelka-bilak) choksiz qo'shiladi */
function renderParts(parts: Part[], uid: string, key: string, grads: Grad[], wrong?: boolean) {
  const outlines = parts
    .map((p, i) =>
      p.cut ? (
        <path key={`${key}o${i}`} d={p.d} fill="none" stroke={wrong && p.shade !== 'shoe' ? 'var(--danger)' : 'var(--fig-cut)'} strokeWidth={wrong ? 2.2 : 2.4} strokeLinejoin="round" />
      ) : null,
    )
    .filter(Boolean);
  const fills = parts.map((p, i) => {
    let fill = p.fill;
    if (!fill) {
      if (p.shade === 'far') fill = 'var(--skin-far)';
      else if (p.axis && STOPS[p.shade]) {
        const id = `${uid}${key}${i}`;
        grads.push({ id, shade: p.shade, p1: p.axis.p1, p2: p.axis.p2 });
        fill = `url(#${id})`;
      } else fill = p.shade === 'shorts' ? 'var(--shorts)' : 'var(--skin)';
    }
    return <path key={`${key}${i}`} d={p.d} fill={fill} />;
  });
  return [...outlines, ...fills];
}

function Grooves({ list, opacity = 1 }: { list: string[]; opacity?: number }) {
  return (
    <g fill="none" stroke="var(--skin-groove)" strokeWidth={0.7} strokeLinecap="round" opacity={0.75 * opacity}>
      {list.map((d, i) => (
        <path key={i} d={d} />
      ))}
    </g>
  );
}

interface MuscleStyle {
  primary: MuscleId[];
  secondary: MuscleId[];
  act: number;
  uid: string;
  dim?: number;
}

function Muscles({ map, st }: { map: Partial<Record<MuscleId, MuscleGeo[]>>; st: MuscleStyle }) {
  const dim = st.dim ?? 1;
  const pick = (ids: MuscleId[]) => ids.flatMap((id) => map[id] ?? []);
  const prim = pick(st.primary);
  const sec = pick(st.secondary.filter((m) => !st.primary.includes(m)));
  if (!prim.length && !sec.length) return null;
  return (
    <g>
      {prim.length > 0 && (
        <g filter={`url(#${st.uid}glow)`} opacity={0.5 * st.act * dim}>
          {prim.map((m, i) => (
            <path key={i} d={m.d} fill="var(--muscle-primary)" />
          ))}
        </g>
      )}
      <g>
        {sec.map((m, i) => (
          <path key={`s${i}`} d={m.d} fill={`url(#${st.uid}ms)`} opacity={(0.5 + 0.15 * st.act) * dim} />
        ))}
        {prim.map((m, i) => (
          <path key={`p${i}`} d={m.d} fill={`url(#${st.uid}mp)`} opacity={(0.8 + 0.2 * st.act) * dim} />
        ))}
      </g>
      <g fill="none" strokeLinecap="round">
        {prim.flatMap((m, i) => m.fibers.map((f, j) => <path key={`pf${i}-${j}`} d={f} stroke="var(--muscle-fiber)" strokeWidth={0.6} opacity={(0.3 + 0.25 * st.act) * dim} />))}
      </g>
    </g>
  );
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
  /** har kadrda faza ichidagi progress (0..1) */
  onProgress?: (phase: Phase, progress: number) => void;
  title?: string;
  /** kadrni figuraga moslab kesish (kichik rasmlar uchun) */
  fit?: boolean;
  /** shtanga yo'li va boshqa yo'l-yo'riq chiziqlari */
  guides?: boolean;
  /** katta sahna: figura kadrni to'ldiradi (w/h nisbati) */
  hero?: number;
  /** har kadrda vaqt (ms) — React holatisiz DOM yangilash uchun */
  onTick?: (timeMs: number) => void;
}

function FigureInner({ spec, primary = [], secondary = [], playing = true, at, speed = 1, className, wrong, onPhase, onProgress, title, fit, guides, hero, onTick }: FigureProps) {
  const reduced = usePrefersReducedMotion();
  const [time, setTime] = useState(at ?? 0);
  const timeRef = useRef(at ?? 0);
  const ref = useRef<SVGSVGElement>(null);
  const visible = useRef(true);
  const lastPhase = useRef<Phase | null>(null);
  const uid = 'f' + useId().replace(/[^a-zA-Z0-9]/g, '');
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
    let start = performance.now() - timeRef.current / speed;
    let last = 0;
    const minDt = fit ? 32 : 15; // kichik rasmlar ~30 fps, asosiy sahna ~60 fps
    return subscribe((now) => {
      if (!visible.current) {
        start = now - timeRef.current / speed;
        return;
      }
      if (now - last < minDt) return;
      last = now;
      timeRef.current = (now - start) * speed;
      setTime(timeRef.current);
    });
  }, [animate, spec, speed, at, reduced, fit]);

  const smp = sample(spec, time);
  useEffect(() => {
    if (onPhase && smp.phase !== lastPhase.current) {
      lastPhase.current = smp.phase;
      onPhase(smp.phase);
    }
    onProgress?.(smp.phase, smp.progress);
    onTick?.(time);
  });

  const floorY = spec.floorY ?? 214;
  // statik kichik rasm faqat ko'rsatilayotgan holatga moslanadi — figura kattaroq ko'rinadi
  const fr = fit ? fitFrame(spec, animate ? undefined : time) : hero ? heroFrame(spec, hero) : (spec.frame ?? { x: 20, y: 16, w: 200, h: 204 });
  const act = smp.activation;
  const mirror = spec.facing === 'left' ? `translate(${fr.x * 2 + fr.w} 0) scale(-1 1)` : undefined;
  const st: MuscleStyle = { primary, secondary, act, uid };
  const pump: Pump = { active: new Set(primary), activation: act, breath: smp.breath };
  const grads: Grad[] = [];
  const barPath = useBarPath(spec, guides);

  let body: React.ReactNode;
  let shadows: React.ReactNode = null;
  if (spec.view === 'side') {
    const pose = smp.pose as SidePose;
    const s = solveSide(pose, spec.anchor);
    const b = sideBody(s, pump, pose.heel ?? 0, new Set([...primary, ...secondary]));
    const heldNearFront = spec.held && (spec.held.kind === 'barbell' || spec.held.kind === 'ezbar');
    const gear = spec.footGear;
    let gearEl: React.ReactNode = null;
    if (gear) {
      if (gear.kind === 'platform') {
        const mid = lerpPt(s.foot.heel, s.foot.toe, 0.45);
        const sd = norm(sub(s.foot.toe, s.foot.heel));
        const dn = mul({ x: -sd.y, y: sd.x }, 4.5);
        const a = add(add(mid, mul(sd, 26)), dn);
        const c = add(add(mid, mul(sd, -26)), dn);
        gearEl = (
          <g>
            <line x1={a.x} y1={a.y} x2={c.x} y2={c.y} stroke="var(--eq-frame)" strokeWidth={7} strokeLinecap="round" />
            <line x1={a.x} y1={a.y - 2} x2={c.x} y2={c.y - 2} stroke="var(--eq-frame-hi)" strokeWidth={1.2} strokeLinecap="round" />
          </g>
        );
      } else {
        const shinDir = norm(sub(s.leg.c, s.leg.b));
        const side = gear.kind === 'shinPad' ? -1 : 1;
        const base = gear.kind === 'kneePad' ? lerpPt(s.leg.a, s.leg.b, 0.88) : lerpPt(s.leg.b, s.leg.c, 0.9);
        const segDir = gear.kind === 'kneePad' ? norm(sub(s.leg.b, s.leg.a)) : shinDir;
        const c = add(base, mul(ccw(segDir), side * 9));
        gearEl = (
          <g>
            <circle cx={c.x} cy={c.y} r={6.6} fill="var(--eq-pad)" />
            <circle cx={c.x - 1.6} cy={c.y - 1.8} r={2.4} fill="var(--eq-pad-hi)" opacity={0.7} />
          </g>
        );
      }
    }
    const sole = (f: typeof s.foot) => ({ x: (f.heel.x + f.toe.x) / 2, y: Math.max(f.heel.y, f.toe.y) });
    shadows = [s.foot, s.foot2].map((f, i) => {
      const p = sole(f);
      const lift = floorY - p.y;
      if (lift > 22) return null;
      return <ellipse key={i} cx={p.x} cy={floorY + 0.4} rx={13 - lift * 0.2} ry={2.2} fill="var(--fig-shadow)" opacity={(1 - lift / 22) * (i ? 0.6 : 1)} />;
    });
    body = (
      <g transform={mirror}>
        {/* uzoq tomon */}
        {renderParts(b.far.parts, uid, 'f', grads)}
        <Muscles map={b.far.muscles} st={{ ...st, dim: 0.6 }} />
        {spec.held && <HeldSide held={spec.held} s={s} near={false} />}
        {/* tana */}
        {renderParts(b.torso.parts, uid, 't', grads, wrong)}
        <Grooves list={b.torso.grooves} />
        <Muscles map={b.torso.muscles} st={st} />
        {wrong && <path d={b.outlineNear[0]} fill="none" stroke="var(--danger)" strokeWidth={1.2} />}
        {gearEl}
        {/* yaqin oyoq */}
        {renderParts(b.leg.parts, uid, 'l', grads, wrong)}
        <Grooves list={b.leg.grooves} />
        <Muscles map={b.leg.muscles} st={st} />
        {b.glutes && <Muscles map={{ glutes: b.glutes }} st={st} />}
        {guides && barPath && <path d={barPath} fill="none" stroke="var(--guide)" strokeWidth={1} strokeDasharray="1.2 2.6" strokeLinecap="round" />}
        {heldNearFront && <HeldSide held={spec.held!} s={s} near />}
        {/* yaqin qo‘l */}
        {renderParts(b.arm.parts, uid, 'a', grads, wrong)}
        <Grooves list={b.arm.grooves} />
        <Muscles map={b.arm.muscles} st={st} />
        {spec.held && !heldNearFront && <HeldSide held={spec.held} s={s} near />}
      </g>
    );
  } else {
    const back = spec.view === 'back';
    const cx = fr.x + fr.w / 2;
    const s = solveFront(smp.pose as FrontPose, cx, floorY);
    const fb = frontBody(s, back, pump);
    const armsFront = (s.fwd ?? 0) > 25;
    const arms = (
      <g>
        {renderParts(fb.arms, uid, 'a', grads, wrong)}
        <Grooves list={fb.armGrooves} />
        <Muscles map={fb.armMuscles} st={st} />
      </g>
    );
    shadows = s.legs.map((l, i) => {
      const lift = floorY - (l.c.y + 7);
      if (lift > 22) return null;
      return <ellipse key={i} cx={l.c.x + (i ? -1 : 1) * 1.5} cy={floorY + 0.4} rx={9 - lift * 0.15} ry={2} fill="var(--fig-shadow)" opacity={1 - lift / 22} />;
    });
    body = (
      <g>
        {!armsFront && arms}
        {renderParts(fb.legs, uid, 'l', grads, wrong)}
        {renderParts(fb.torso, uid, 't', grads, wrong)}
        <Grooves list={fb.grooves} />
        <Muscles map={fb.muscles} st={st} />
        {renderParts([fb.shorts], uid, 's', grads, wrong)}
        <Muscles map={fb.late} st={st} />
        {renderParts(fb.head, uid, 'h', grads, wrong)}
        {armsFront && arms}
        {spec.held && <HeldFront held={spec.held} s={s} cx={cx} />}
      </g>
    );
  }

  return (
    <svg ref={ref} className={className} viewBox={`${fr.x} ${fr.y} ${fr.w} ${fr.h}`} role="img" aria-label={title} preserveAspectRatio="xMidYMid meet">
      <defs>
        <filter id={`${uid}glow`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2.6" />
        </filter>
        <linearGradient id={`${uid}mp`} x1="0" y1="0" x2="0.4" y2="1">
          <stop offset="0" stopColor="var(--muscle-primary-hi)" />
          <stop offset="0.55" stopColor="var(--muscle-primary)" />
          <stop offset="1" stopColor="var(--muscle-primary-lo)" />
        </linearGradient>
        <linearGradient id={`${uid}ms`} x1="0" y1="0" x2="0.4" y2="1">
          <stop offset="0" stopColor="var(--muscle-secondary-hi)" />
          <stop offset="1" stopColor="var(--muscle-secondary)" />
        </linearGradient>
        <radialGradient id={`${uid}spot`} cx="50%" cy="38%" r="62%">
          <stop offset="0" stopColor="var(--stage-spot)" />
          <stop offset="1" stopColor="var(--stage-spot)" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${uid}floor`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="var(--floor-top)" />
          <stop offset="1" stopColor="var(--floor-bottom)" />
        </linearGradient>
        {grads.map((g) => (
          <linearGradient key={g.id} id={g.id} gradientUnits="userSpaceOnUse" x1={f2(g.p1.x)} y1={f2(g.p1.y)} x2={f2(g.p2.x)} y2={f2(g.p2.y)}>
            {STOPS[g.shade].map(([o, c]) => (
              <stop key={o} offset={o} stopColor={c} />
            ))}
          </linearGradient>
        ))}
      </defs>
      {!fit && <rect x={fr.x} y={fr.y} width={fr.w} height={fr.h} fill={`url(#${uid}spot)`} />}
      <rect x={fr.x - 2} y={floorY} width={fr.w + 4} height={Math.max(2, fr.y + fr.h - floorY + 2)} fill={`url(#${uid}floor)`} />
      <line x1={fr.x} y1={floorY} x2={fr.x + fr.w} y2={floorY} stroke="var(--floor-edge)" strokeWidth={0.8} />
      <g transform={mirror}>{shadows}</g>
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

/** Shtanga/qo'l yo'li: bir sikl davomida yaqin qo'l qayerdan o'tadi (yon ko'rinish) */
function useBarPath(spec: AnimSpec, on?: boolean) {
  return useMemo(() => {
    if (!on || spec.view !== 'side' || !spec.held || !['barbell', 'ezbar', 'dumbbell', 'kettlebell'].includes(spec.held.kind)) return null;
    const total = totalDuration(spec.frames);
    const pts: Pt[] = [];
    for (let i = 0; i <= 48; i++) pts.push(solveSide(sample(spec, (total * i) / 48).pose as SidePose, spec.anchor).hand);
    const xs = pts.map((p) => p.x);
    const ys = pts.map((p) => p.y);
    if (Math.max(...xs) - Math.min(...xs) + Math.max(...ys) - Math.min(...ys) < 6) return null;
    return pts.map((p, i) => `${i ? 'L' : 'M'}${f2(p.x)} ${f2(p.y)}`).join(' ');
  }, [spec, on]);
}

type Box = { x: number; y: number; w: number; h: number };
const fitCache = new WeakMap<AnimSpec, Box>();
const heroCache = new WeakMap<AnimSpec, Map<number, Box>>();

/** Katta sahna kadri: figura, jihozlar va pol to'liq ko'rinadi, ortiqcha bo'shliq yo'q */
export function heroFrame(spec: AnimSpec, aspect: number): Box {
  let byAspect = heroCache.get(spec);
  if (!byAspect) heroCache.set(spec, (byAspect = new Map()));
  const hit = byAspect.get(aspect);
  if (hit) return hit;
  const floorY = spec.floorY ?? 214;
  const base = spec.frame ?? { x: 20, y: 16, w: 200, h: 204 };
  const pts = figurePoints(spec);
  for (const p of spec.props ?? []) {
    const w = p.w ?? 0;
    if (p.kind === 'pullupBar') pts.push({ x: p.x - w / 2, y: p.y - 6, r: 2 }, { x: p.x + w / 2, y: p.y - 6, r: 2 });
    else if (p.kind === 'cableTower') pts.push({ x: p.x, y: p.y, r: 10 });
    else if (p.kind !== 'mat' && p.kind !== 'machine') pts.push({ x: p.x, y: p.y, r: 2 }, { x: p.x + w, y: p.y, r: 2 });
  }
  if (spec.held?.from) pts.push({ ...spec.held.from, r: 6 });
  let x0 = Math.min(...pts.map((p) => p.x - p.r)) - 8;
  let x1 = Math.max(...pts.map((p) => p.x + p.r)) + 8;
  let y0 = Math.min(...pts.map((p) => p.y - p.r)) - 10;
  const y1 = floorY + 10;
  // asl kadrdan chiqib ketmaslik (jihozlarning qolgan qismi kesilib qolmasin)
  x0 = Math.max(x0, base.x - 10);
  x1 = Math.min(x1, base.x + base.w + 10);
  y0 = Math.max(y0, base.y - 10);
  let w = x1 - x0;
  let h = y1 - y0;
  if (w / h < aspect) {
    const nw = h * aspect;
    x0 -= (nw - w) / 2;
    w = nw;
  } else {
    const nh = w / aspect;
    y0 -= nh - h;
    h = nh;
  }
  const out = { x: x0, y: y0, w, h };
  byAspect.set(aspect, out);
  return out;
}

function figurePoints(spec: AnimSpec, poses: (SidePose | FrontPose)[] = spec.frames.map((f) => f.pose)) {
  const floorY = spec.floorY ?? 214;
  const pts: { x: number; y: number; r: number }[] = [];
  for (const pose of poses) {
    const f = { pose };
    if (spec.view === 'side') {
      const s = solveSide(f.pose as SidePose, spec.anchor);
      const heldR = spec.held?.kind === 'barbell' ? 23 : spec.held?.kind === 'ezbar' ? 16 : spec.held ? 10 : 6;
      pts.push({ ...s.head, r: 13 }, { ...s.shoulder, r: 13 }, { ...s.hip, r: 14 }, { ...s.hand, r: heldR }, { ...s.hand2, r: 6 });
      for (const l of [s.leg, s.leg2, s.arm, s.arm2]) pts.push({ ...l.b, r: 8 }, { ...l.c, r: 7 });
      for (const ft of [s.foot, s.foot2]) pts.push({ ...ft.toe, r: 4 }, { ...ft.heel, r: 4 });
    } else {
      const fr0 = spec.frame ?? { x: 20, y: 16, w: 200, h: 204 };
      const s = solveFront(f.pose as FrontPose, fr0.x + fr0.w / 2, floorY);
      const hr = spec.held?.kind === 'dumbbell' ? 13 : spec.held?.kind === 'barbell' ? 26 : 6;
      pts.push({ ...s.head, r: 13 }, { ...s.hands[0], r: hr }, { ...s.hands[1], r: hr });
      for (const l of [...s.arms, ...s.legs]) pts.push({ ...l.b, r: 9 }, { ...l.c, r: 9 });
    }
  }
  return pts;
}

const poseFitCache = new WeakMap<AnimSpec, Map<number, Box>>();

/** Kvadrat kadr (kichik rasmlar uchun): butun harakat yoki faqat at vaqtdagi holat bo'yicha */
export function fitFrame(spec: AnimSpec, at?: number): Box {
  if (at !== undefined) {
    let m = poseFitCache.get(spec);
    if (!m) poseFitCache.set(spec, (m = new Map()));
    const key = Math.round(at);
    const hit = m.get(key);
    if (hit) return hit;
    const box = squareBox(figurePoints(spec, [sample(spec, at).pose]));
    m.set(key, box);
    return box;
  }
  const hit = fitCache.get(spec);
  if (hit) return hit;
  const out = squareBox(figurePoints(spec));
  fitCache.set(spec, out);
  return out;
}

function squareBox(pts: { x: number; y: number; r: number }[]): Box {
  let x0 = Math.min(...pts.map((p) => p.x - p.r));
  const x1 = Math.max(...pts.map((p) => p.x + p.r));
  let y0 = Math.min(...pts.map((p) => p.y - p.r));
  const y1 = Math.max(...pts.map((p) => p.y + p.r));
  const size = Math.max(x1 - x0, y1 - y0) + 4;
  const cx = (x0 + x1) / 2;
  const cy = (y0 + y1) / 2;
  x0 = cx - size / 2;
  y0 = cy - size / 2;
  return { x: x0, y: y0, w: size, h: size };
}

/** Ikki asosiy holat vaqtlari: boshlang‘ich va qarama-qarshi (statik ko‘rinish uchun) */
export function poseTimes(spec: AnimSpec): [number, number] {
  const f = spec.frames;
  if (f.length < 3) return [0, f[0].dur * 0.99];
  return [1, f[0].dur + f[1].dur + 1];
}
