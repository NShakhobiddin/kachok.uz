// Figura geometriyasi: burchaklardan bo‘g‘in nuqtalarini hisoblash (FK), IK va interpolyatsiya.
import type { AnimSpec, FrontPose, KeyFrame, MistakeDemo, Phase, Pt, SidePose } from '../types';

/** Segment uzunliklari (ilova birliklarida, odam bo‘yi ~180) */
export const L = {
  torso: 54,
  neck: 7,
  headR: 10.5,
  ua: 31,
  fa: 27,
  hand: 7,
  th: 46,
  sh: 44,
  heel: 5,
  toe: 15,
  footH: 6,
};

const rad = (d: number) => (d * Math.PI) / 180;

/** "Soat" burchagidan yo‘nalish vektori: 0 = tepaga, 90 = oldinga (o‘ngga), 180 = pastga */
export function dir(a: number): Pt {
  return { x: Math.sin(rad(a)), y: -Math.cos(rad(a)) };
}
export const add = (a: Pt, b: Pt): Pt => ({ x: a.x + b.x, y: a.y + b.y });
export const sub = (a: Pt, b: Pt): Pt => ({ x: a.x - b.x, y: a.y - b.y });
export const mul = (a: Pt, k: number): Pt => ({ x: a.x * k, y: a.y * k });
export const len = (a: Pt) => Math.hypot(a.x, a.y);
export const norm = (a: Pt): Pt => {
  const l = len(a) || 1;
  return { x: a.x / l, y: a.y / l };
};
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const lerpPt = (a: Pt, b: Pt, t: number): Pt => ({ x: lerp(a.x, b.x, t), y: lerp(a.y, b.y, t) });
/** vektorni ekranda soat strelkasi bo‘yicha 90° burish */
export const cw = (a: Pt): Pt => ({ x: -a.y, y: a.x });
export const ccw = (a: Pt): Pt => ({ x: a.y, y: -a.x });
/** vektordan "soat" burchagi */
export const angleOf = (v: Pt) => (Math.atan2(v.x, -v.y) * 180) / Math.PI;

/** Ikki bo‘g‘inli IK: root dan target ga, tirsak/tizza `bend` tomonga (+1/-1) */
export function solveIK(root: Pt, target: Pt, l1: number, l2: number, bend: 1 | -1): { mid: Pt; end: Pt } {
  const d = sub(target, root);
  let dist = len(d);
  const maxD = l1 + l2 - 0.01;
  const minD = Math.abs(l1 - l2) + 0.01;
  dist = Math.max(minD, Math.min(maxD, dist));
  const base = norm(d);
  const cosA = (l1 * l1 + dist * dist - l2 * l2) / (2 * l1 * dist);
  const a = Math.acos(Math.max(-1, Math.min(1, cosA)));
  const c = Math.cos(a * bend);
  const s = Math.sin(a * bend);
  // ekran koordinatalarida burish
  const r = { x: base.x * c - base.y * s, y: base.x * s + base.y * c };
  const mid = add(root, mul(r, l1));
  const end = add(mid, mul(norm(sub(target, mid)), l2));
  return { mid, end };
}

export interface SideLimb {
  a: Pt; // proksimal (yelka/son bo‘g‘imi)
  b: Pt; // tirsak/tizza
  c: Pt; // bilak/to‘piq
}

export interface SideFoot {
  ankle: Pt;
  heel: Pt;
  toe: Pt;
  fdir: Pt;
}

export interface SideSkeleton {
  hip: Pt;
  shoulder: Pt;
  neck: Pt;
  head: Pt;
  torsoDir: Pt;
  curve: number;
  arm: SideLimb;
  arm2: SideLimb;
  leg: SideLimb;
  leg2: SideLimb;
  foot: SideFoot;
  foot2: SideFoot;
  hand: Pt;
  hand2: Pt;
}

/** uzoq tomondagi oyoq-qo‘llarni biroz siljitish (chuqurlik hissi) */
const FAR_OFFSET: Pt = { x: -3, y: -2 };

function footFrom(ankle: Pt, ft: number, heel: number): SideFoot {
  const a = ft - heel * 38;
  const fdir = dir(a);
  const down = cw(fdir);
  return {
    ankle,
    fdir,
    heel: add(add(ankle, mul(fdir, -L.heel)), mul(down, L.footH)),
    toe: add(add(ankle, mul(fdir, L.toe)), mul(down, L.footH)),
  };
}

export function solveSide(p: SidePose, anchor: AnimSpec['anchor']): SideSkeleton {
  const hip0: Pt = { x: 0, y: 0 };
  const td = dir(p.torso);
  const shoulder0 = add(hip0, mul(td, L.torso));
  const hd = dir(p.head ?? p.torso);
  const neck0 = add(shoulder0, mul(hd, L.neck));
  const head0 = add(add(neck0, mul(hd, L.headR)), mul(cw(hd), 1.5));

  const legFK = (hip: Pt, th: number, sh: number): SideLimb => {
    const b = add(hip, mul(dir(th), L.th));
    return { a: hip, b, c: add(b, mul(dir(sh), L.sh)) };
  };
  const armFK = (sho: Pt, ua: number, fa: number): SideLimb => {
    const b = add(sho, mul(dir(ua), L.ua));
    return { a: sho, b, c: add(b, mul(dir(fa), L.fa)) };
  };

  const ft = p.ft ?? 90;
  const heel = p.heel ?? 0;
  let leg = legFK(hip0, p.th, p.sh);
  let leg2 = legFK(add(hip0, FAR_OFFSET), p.th2 ?? p.th, p.sh2 ?? p.sh);
  let arm = armFK(shoulder0, p.ua, p.fa);
  let arm2 = armFK(add(shoulder0, FAR_OFFSET), p.ua2 ?? p.ua, p.fa2 ?? p.fa);
  let foot = footFrom(leg.c, ft, heel);
  let foot2 = footFrom(leg2.c, p.ft2 ?? ft, heel);

  // langar (anchor): tanlangan bo‘g‘in dunyo koordinatasida qotib turadi
  let off: Pt = { x: 0, y: 0 };
  if (anchor && p.at) anchor = { joint: anchor.joint, x: p.at.x, y: p.at.y };
  if (anchor) {
    const local: Pt =
      anchor.joint === 'ankle'
        ? leg.c
        : anchor.joint === 'toe'
          ? foot.toe
          : anchor.joint === 'knee'
            ? leg.b
            : anchor.joint === 'shoulder'
              ? shoulder0
              : anchor.joint === 'wrist'
                ? arm.c
                : hip0;
    off = sub(anchor, local);
  }
  const T = (q: Pt) => add(q, off);
  const TL = (l: SideLimb): SideLimb => ({ a: T(l.a), b: T(l.b), c: T(l.c) });
  const TF = (f: SideFoot): SideFoot => ({ ...f, ankle: T(f.ankle), heel: T(f.heel), toe: T(f.toe) });

  const hip = T(hip0);
  const shoulder = T(shoulder0);
  leg = TL(leg);
  leg2 = TL(leg2);
  arm = TL(arm);
  arm2 = TL(arm2);
  foot = TF(foot);
  foot2 = TF(foot2);

  // IK: qo‘llar (tirsak orqaga-pastga bukiladi)
  if (p.hand) {
    const r = solveIK(arm.a, p.hand, L.ua, L.fa, 1);
    arm = { a: arm.a, b: r.mid, c: r.end };
  }
  if (p.hand2 || (p.hand && p.ua2 === undefined)) {
    const tgt = add(p.hand2 ?? p.hand!, FAR_OFFSET);
    const r = solveIK(arm2.a, tgt, L.ua, L.fa, 1);
    arm2 = { a: arm2.a, b: r.mid, c: r.end };
  }
  // IK: oyoqlar (tizza oldinga bukiladi)
  if (p.foot) {
    const r = solveIK(leg.a, p.foot, L.th, L.sh, -1);
    leg = { a: leg.a, b: r.mid, c: r.end };
    foot = footFrom(leg.c, ft, heel);
  }
  if (p.foot2 || (p.foot && p.th2 === undefined)) {
    const tgt = add(p.foot2 ?? p.foot!, FAR_OFFSET);
    const r = solveIK(leg2.a, tgt, L.th, L.sh, -1);
    leg2 = { a: leg2.a, b: r.mid, c: r.end };
    foot2 = footFrom(leg2.c, p.ft2 ?? ft, heel);
  }

  const handOf = (l: SideLimb) => add(l.c, mul(norm(sub(l.c, l.b)), L.hand * 0.6));

  return {
    hip,
    shoulder,
    neck: T(neck0),
    head: T(head0),
    torsoDir: td,
    curve: p.curve ?? 0,
    arm,
    arm2,
    leg,
    leg2,
    foot,
    foot2,
    hand: handOf(arm),
    hand2: handOf(arm2),
  };
}

/* ---------------- Old / orqa ko‘rinish ---------------- */

export const FL = {
  shoulderW: 21,
  hipW: 9,
  torso: 54,
  ua: 30,
  fa: 26,
  th: 46,
  sh: 44,
  headR: 10.5,
  neck: 7,
};

export interface FrontSkeleton {
  cx: number;
  hipY: number;
  shoulderY: number;
  head: Pt;
  /** [o‘ng, chap] — ekrandagi o‘ng va chap */
  arms: [SideLimb, SideLimb];
  legs: [SideLimb, SideLimb];
  hands: [Pt, Pt];
  fwd: number;
}

export function solveFront(p: FrontPose, cx: number, floorY: number): FrontSkeleton {
  const standingHip = floorY - 6 - FL.sh - FL.th;
  const hipY = p.hipY ?? standingHip;
  const shrug = p.shrug ?? 0;
  const shoulderY = hipY - FL.torso - shrug * 0.3;
  const shoulderYArm = shoulderY - shrug;
  const head: Pt = { x: cx, y: hipY - FL.torso - FL.neck - FL.headR };
  const fwd = p.fwd ?? 0;
  const proj = (a: number, side: 1 | -1, f: number): Pt => {
    const d = dir(a);
    return { x: d.x * Math.cos(rad(f)) * side, y: d.y };
  };
  const projLeg = (a: number, side: 1 | -1, f: number): Pt => {
    const d = dir(a);
    return { x: d.x * side, y: d.y * Math.cos(rad(f)) };
  };
  const arm = (side: 1 | -1): SideLimb => {
    const a = { x: cx + side * FL.shoulderW, y: shoulderYArm + 3 };
    const b = add(a, mul(proj(p.ua, side, fwd), FL.ua));
    const c = add(b, mul(proj(p.fa, side, fwd), FL.fa));
    return { a, b, c };
  };
  const th = p.th ?? 180;
  const sh = p.sh ?? 180;
  const lf = p.legFwd ?? 0;
  const leg = (side: 1 | -1): SideLimb => {
    const a = { x: cx + side * FL.hipW, y: hipY };
    const b = add(a, mul(projLeg(th, side, lf), FL.th));
    const c = add(b, mul(projLeg(sh, side, 0), FL.sh));
    return { a, b, c };
  };
  let arms: [SideLimb, SideLimb] = [arm(1), arm(-1)];
  if (p.hand) {
    const ra = arms[0].a;
    const r = solveIK(ra, p.hand, FL.ua, FL.fa, 1);
    const mirror = (q: Pt): Pt => ({ x: 2 * cx - q.x, y: q.y });
    arms = [
      { a: ra, b: r.mid, c: r.end },
      { a: arms[1].a, b: mirror(r.mid), c: mirror(r.end) },
    ];
  }
  const hands = arms.map((l) => add(l.c, mul(norm(sub(l.c, l.b)), 4))) as [Pt, Pt];
  return { cx, hipY, shoulderY, head, arms, legs: [leg(1), leg(-1)], hands, fwd };
}

/* ---------------- Interpolyatsiya ---------------- */

export const ease = (t: number) => 0.5 - 0.5 * Math.cos(Math.PI * t);

function lerpOpt(a: number | undefined, b: number | undefined, fa: number | undefined, fb: number | undefined, t: number) {
  const x = a ?? fa;
  const y = b ?? fb;
  if (x === undefined && y === undefined) return undefined;
  return lerp(x ?? y!, y ?? x!, t);
}

/** Uzoq tomon qiymati: ikkalasi ham berilmagan bo‘lsa — aniqlanmagan (yaqin tomonni takrorlaydi yoki IK) */
function far(a: number | undefined, b: number | undefined, fa: number, fb: number, t: number) {
  if (a === undefined && b === undefined) return undefined;
  return lerp(a ?? fa, b ?? fb, t);
}

function lerpPtOpt(a: Pt | undefined, b: Pt | undefined, t: number): Pt | undefined {
  if (!a && !b) return undefined;
  return lerpPt(a ?? b!, b ?? a!, t);
}

export function lerpSide(a: SidePose, b: SidePose, t: number): SidePose {
  return {
    torso: lerp(a.torso, b.torso, t),
    head: lerpOpt(a.head, b.head, a.torso, b.torso, t),
    curve: lerpOpt(a.curve, b.curve, 0, 0, t),
    ua: lerp(a.ua, b.ua, t),
    fa: lerp(a.fa, b.fa, t),
    th: lerp(a.th, b.th, t),
    sh: lerp(a.sh, b.sh, t),
    ft: lerpOpt(a.ft, b.ft, 90, 90, t),
    ua2: far(a.ua2, b.ua2, a.ua, b.ua, t),
    fa2: far(a.fa2, b.fa2, a.fa, b.fa, t),
    th2: far(a.th2, b.th2, a.th, b.th, t),
    sh2: far(a.sh2, b.sh2, a.sh, b.sh, t),
    ft2: lerpOpt(a.ft2, b.ft2, a.ft ?? 90, b.ft ?? 90, t),
    hand: lerpPtOpt(a.hand, b.hand, t),
    hand2: lerpPtOpt(a.hand2, b.hand2, t),
    foot: lerpPtOpt(a.foot, b.foot, t),
    foot2: lerpPtOpt(a.foot2, b.foot2, t),
    heel: lerpOpt(a.heel, b.heel, 0, 0, t),
    at: lerpPtOpt(a.at, b.at, t),
  };
}

export function lerpFront(a: FrontPose, b: FrontPose, t: number): FrontPose {
  return {
    ua: lerp(a.ua, b.ua, t),
    fa: lerp(a.fa, b.fa, t),
    fwd: lerpOpt(a.fwd, b.fwd, 0, 0, t),
    th: lerpOpt(a.th, b.th, 180, 180, t),
    sh: lerpOpt(a.sh, b.sh, 180, 180, t),
    hipY: lerpOpt(a.hipY, b.hipY, undefined, undefined, t),
    shrug: lerpOpt(a.shrug, b.shrug, 0, 0, t),
    legFwd: lerpOpt(a.legFwd, b.legFwd, 0, 0, t),
    hand: lerpPtOpt(a.hand, b.hand, t),
  };
}

export function totalDuration(frames: KeyFrame<unknown>[]) {
  return frames.reduce((s, f) => s + f.dur, 0);
}

export interface Sampled<P> {
  pose: P;
  phase: Phase;
  /** mushak faolligi 0..1 */
  activation: number;
  /** joriy faza ichidagi progress */
  progress: number;
  index: number;
}

/** Vaqt bo‘yicha pozani olish (aylana animatsiya) */
export function sample(spec: AnimSpec, timeMs: number): Sampled<SidePose | FrontPose> {
  const frames = spec.frames;
  const total = totalDuration(frames);
  let t = ((timeMs % total) + total) % total;
  for (let i = 0; i < frames.length; i++) {
    const f = frames[i];
    if (t <= f.dur || i === frames.length - 1) {
      const next = frames[(i + 1) % frames.length];
      const k = f.dur === 0 ? 1 : Math.min(1, t / f.dur);
      const e = f.phase === 'hold' || f.phase === 'squeeze' ? 0 : ease(k);
      const pose =
        spec.view === 'side'
          ? lerpSide(f.pose as SidePose, next.pose as SidePose, e)
          : lerpFront(f.pose as FrontPose, next.pose as FrontPose, e);
      const activation =
        f.phase === 'up' ? 0.75 + 0.25 * Math.sin(Math.PI * k) : f.phase === 'squeeze' ? 1 : f.phase === 'down' ? 0.6 : 0.35;
      return { pose, phase: f.phase, activation, progress: k, index: i };
    }
    t -= f.dur;
  }
  return { pose: frames[0].pose, phase: frames[0].phase, activation: 0.4, progress: 0, index: 0 };
}

/** Xato texnikani ko‘rsatish uchun spetsifikatsiyani o‘zgartirish */
export function applyMistake(spec: AnimSpec, demo: MistakeDemo): AnimSpec {
  let frames = spec.frames.map((f) => ({ ...f, pose: { ...f.pose } }));
  if (demo.rom !== undefined && frames.length > 1) {
    // eng uzoq kadrlarni birinchi kadrga yaqinlashtirish
    const base = frames[0].pose;
    frames = frames.map((f, i) => {
      if (i === 0) return f;
      const pose =
        spec.view === 'side'
          ? lerpSide(base as SidePose, f.pose as SidePose, demo.rom!)
          : lerpFront(base as FrontPose, f.pose as FrontPose, demo.rom!);
      return { ...f, pose, dur: Math.round(f.dur * (0.5 + demo.rom! * 0.5)) };
    });
  }
  if (demo.set) {
    for (const s of demo.set) {
      const f = frames[s.kf];
      if (f) f.pose = { ...f.pose, ...s.pose } as SidePose | FrontPose;
    }
  }
  return { ...spec, frames };
}

/** Xato ko'rinadigan holatda animatsiyani uzoqroq to'xtatish (to'g'ri va noto'g'ri figuralar sinxron qoladi) */
export function emphasizeMistake(spec: AnimSpec, demo: MistakeDemo): AnimSpec {
  const kfs = new Set(demo.set?.map((x) => x.kf) ?? [2]);
  return { ...spec, frames: spec.frames.map((f, i) => (kfs.has(i) && (f.phase === 'hold' || f.phase === 'squeeze') ? { ...f, dur: Math.max(f.dur, 1500) } : f)) };
}

/** Animatsiya ichidagi yuqori va pastki holatlar (statik ko‘rinish uchun) */
export function extremePoses(spec: AnimSpec): [SidePose | FrontPose, SidePose | FrontPose] {
  const f = spec.frames;
  const down = f.find((x) => x.phase === 'up') ?? f[Math.floor(f.length / 2)];
  return [f[0].pose, down.pose];
}
