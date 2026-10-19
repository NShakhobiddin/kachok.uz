// Mashq animatsiyalari: har bir harakat bir nechta kalit pozadan iborat.
// Burchaklar: 0 = tepaga, 90 = oldinga, 180 = pastga, 270 = orqaga.
import type { AnimSpec, FrontPose, KeyFrame, SidePose } from '../types';

const F = 214; // pol
const AY = F - 6; // turgan holatda to‘piq balandligi
const CX = 120; // old ko‘rinish markazi

interface Timing {
  hold1?: number;
  move1?: number;
  hold2?: number;
  move2?: number;
}

/** Ekssentrik birinchi: yuqori -> pastga (nazorat) -> pastda pauza -> yuqoriga (kuch) */
function ecc<P>(top: P, bottom: P, t: Timing = {}): KeyFrame<P>[] {
  return [
    { pose: top, dur: t.hold1 ?? 450, phase: 'hold' },
    { pose: top, dur: t.move1 ?? 2000, phase: 'down' },
    { pose: bottom, dur: t.hold2 ?? 350, phase: 'hold' },
    { pose: bottom, dur: t.move2 ?? 1200, phase: 'up' },
  ];
}

/** Konsentrik birinchi: boshlang‘ich -> kuch bilan -> qisish -> nazorat bilan qaytish */
function con<P>(start: P, end: P, t: Timing = {}): KeyFrame<P>[] {
  return [
    { pose: start, dur: t.hold1 ?? 400, phase: 'hold' },
    { pose: start, dur: t.move1 ?? 1200, phase: 'up' },
    { pose: end, dur: t.hold2 ?? 450, phase: 'squeeze' },
    { pose: end, dur: t.move2 ?? 2000, phase: 'down' },
  ];
}

const ankle = (x = 112, y = AY) => ({ joint: 'ankle' as const, x, y });

type S = SidePose;
type Fp = FrontPose;

/* ===================== OYOQLAR ===================== */

export function backSquat(smith = false): AnimSpec {
  const top: S = { torso: 6, head: 2, ua: 226, fa: 22, th: 180, sh: 180 };
  const bottom: S = { torso: 42, head: 24, ua: 262, fa: 58, th: 98, sh: 206 };
  return {
    view: 'side',
    anchor: ankle(),
    held: { kind: 'barbell' },
    frames: ecc(top, bottom, { move1: 2200, move2: 1300 }),
    props: smith ? [{ kind: 'rack', x: 104, y: 4, h: 30 }] : undefined,
    frame: { x: 20, y: 12, w: 200, h: 208 },
  };
}

export function frontSquat(): AnimSpec {
  const top: S = { torso: 4, head: 2, ua: 86, fa: 304, th: 180, sh: 180 };
  const bottom: S = { torso: 20, head: 12, ua: 102, fa: 320, th: 96, sh: 210 };
  return { view: 'side', anchor: ankle(), held: { kind: 'barbell' }, frames: ecc(top, bottom) };
}

export function gobletSquat(): AnimSpec {
  const top: S = { torso: 4, head: 2, ua: 166, fa: 20, th: 180, sh: 180 };
  const bottom: S = { torso: 26, head: 14, ua: 188, fa: 42, th: 96, sh: 210 };
  return { view: 'side', anchor: ankle(), held: { kind: 'dumbbell', single: true }, frames: ecc(top, bottom) };
}

export function bodyweightSquat(): AnimSpec {
  const top: S = { torso: 3, ua: 176, fa: 176, th: 180, sh: 180 };
  const bottom: S = { torso: 32, head: 20, ua: 92, fa: 90, th: 98, sh: 208 };
  return { view: 'side', anchor: ankle(), frames: ecc(top, bottom, { move1: 1800, move2: 1000 }) };
}

export function hackSquat(): AnimSpec {
  const top: S = { torso: -6, head: -4, ua: 194, fa: 334, th: 178, sh: 184 };
  const bottom: S = { torso: 8, head: 6, ua: 208, fa: 348, th: 100, sh: 212 };
  return { view: 'side', anchor: ankle(118), frames: ecc(top, bottom) };
}

export function legPress(): AnimSpec {
  const base = { torso: -48, head: -40, ua: 132, fa: 100, th: 60, sh: 120, ft: -38 };
  const top: S = { ...base, foot: { x: 160, y: 105 } };
  const bottom: S = { ...base, foot: { x: 137, y: 123 } };
  return {
    view: 'side',
    anchor: { joint: 'hip', x: 92, y: 158 },
    footGear: { kind: 'platform' },
    props: [
      { kind: 'legPressFrame', x: 128, y: 178, w: 84, angle: 38 },
      { kind: 'inclineBench', x: 92, y: 167, w: 64, angle: 42 },
    ],
    frames: ecc(top, bottom, { move1: 2000, move2: 1200 }),
    frame: { x: 14, y: 40, w: 200, h: 180 },
  };
}

export function deadlift(): AnimSpec {
  const bottom: S = { torso: 63, head: 44, ua: 180, fa: 180, th: 102, sh: 199, hand: { x: 120, y: 189 } };
  const top: S = { torso: -2, head: 0, ua: 180, fa: 180, th: 182, sh: 178, hand: { x: 118, y: 124 } };
  return {
    view: 'side',
    anchor: ankle(),
    held: { kind: 'barbell' },
    frames: con(bottom, top, { hold1: 600, move1: 1500, hold2: 500, move2: 1800 }),
  };
}

export function rdl(kind: 'barbell' | 'dumbbell' = 'barbell'): AnimSpec {
  const top: S = { torso: 2, ua: 180, fa: 180, th: 180, sh: 180, hand: { x: 116, y: 123 } };
  const bottom: S = { torso: 72, head: 56, ua: 196, fa: 192, th: 145, sh: 186, hand: { x: 126, y: 168 } };
  return { view: 'side', anchor: ankle(), held: { kind }, frames: ecc(top, bottom, { move1: 2400, move2: 1300 }) };
}

export function kettlebellSwing(): AnimSpec {
  const bottom: S = { torso: 62, head: 42, ua: 205, fa: 208, th: 150, sh: 186 };
  const top: S = { torso: -4, head: -2, ua: 92, fa: 90, th: 182, sh: 180 };
  return {
    view: 'side',
    anchor: ankle(),
    held: { kind: 'kettlebell' },
    frames: [
      { pose: bottom, dur: 150, phase: 'hold' },
      { pose: bottom, dur: 520, phase: 'up' },
      { pose: top, dur: 260, phase: 'squeeze' },
      { pose: top, dur: 680, phase: 'down' },
    ],
  };
}

export function backExtension(): AnimSpec {
  const top: S = { torso: 45, head: 50, ua: 200, fa: 15, th: 225, sh: 225, ft: 135 };
  const bottom: S = { torso: 158, head: 168, ua: 313, fa: 128, th: 225, sh: 225, ft: 135 };
  return {
    view: 'side',
    anchor: ankle(70, 196),
    props: [
      { kind: 'pad', x: 143, y: 146, w: 22, h: 11, angle: 135 },
      { kind: 'pad', x: 58, y: 206, w: 18, h: 6, angle: 45 },
      { kind: 'legPressFrame', x: 54, y: 212, w: 110, angle: 34 },
    ],
    frames: ecc(top, bottom, { move1: 2000, move2: 1400 }),
    frame: { x: 24, y: 40, w: 200, h: 180 },
  };
}

export function splitSquat(kind: 'dumbbell' | 'none' = 'dumbbell'): AnimSpec {
  const base = { torso: 3, ua: 180, fa: 180, th: 0, sh: 0, ft: 90, ft2: 138, foot: { x: 134, y: AY }, foot2: { x: 60, y: 200 } };
  const top: S = { ...base, at: { x: 100, y: 128 } };
  const bottom: S = { ...base, torso: 6, at: { x: 101, y: 162 } };
  return {
    view: 'side',
    anchor: { joint: 'hip', x: 100, y: 128 },
    held: kind === 'none' ? undefined : { kind },
    frames: ecc(top, bottom),
  };
}

export function bulgarianSplitSquat(): AnimSpec {
  const base = { torso: 6, ua: 180, fa: 180, th: 0, sh: 0, ft: 90, ft2: 265, foot: { x: 142, y: AY }, foot2: { x: 50, y: 162 } };
  const top: S = { ...base, at: { x: 110, y: 126 } };
  const bottom: S = { ...base, torso: 14, head: 8, at: { x: 103, y: 162 } };
  return {
    view: 'side',
    anchor: { joint: 'hip', x: 110, y: 126 },
    held: { kind: 'dumbbell' },
    props: [{ kind: 'bench', x: 12, y: 168, w: 56 }],
    frames: ecc(top, bottom),
  };
}

export function stepUp(): AnimSpec {
  const bottom: S = { torso: 10, ua: 180, fa: 180, th: 0, sh: 0, ft: 90, ft2: 90, foot: { x: 140, y: 166 }, foot2: { x: 88, y: AY }, at: { x: 108, y: 126 } };
  const top: S = { torso: 2, ua: 180, fa: 180, th: 0, sh: 0, ft: 90, ft2: 112, foot: { x: 140, y: 166 }, foot2: { x: 124, y: 138 }, at: { x: 136, y: 86 } };
  return {
    view: 'side',
    anchor: { joint: 'hip', x: 108, y: 126 },
    held: { kind: 'dumbbell' },
    props: [{ kind: 'box', x: 118, y: 172, w: 54, h: 42 }],
    frames: con(bottom, top, { move1: 1300 }),
    frame: { x: 20, y: 0, w: 210, h: 220 },
  };
}

export function legExtension(): AnimSpec {
  const start: S = { torso: -8, head: -4, ua: 172, fa: 112, th: 88, sh: 182, ft: 92 };
  const end: S = { ...start, sh: 96, ft: 6 };
  return {
    view: 'side',
    anchor: { joint: 'hip', x: 96, y: 150 },
    footGear: { kind: 'anklePad' },
    props: [{ kind: 'seat', x: 70, y: 158, w: 56, h: 52, angle: -8 }],
    frames: con(start, end, { move1: 1100, move2: 1900 }),
    frame: { x: 30, y: 46, w: 190, h: 174 },
  };
}

export function legCurl(): AnimSpec {
  const start: S = { torso: -14, head: -8, ua: 168, fa: 110, th: 88, sh: 96, ft: 6 };
  const end: S = { ...start, sh: 198, ft: 108 };
  return {
    view: 'side',
    anchor: { joint: 'hip', x: 96, y: 150 },
    footGear: { kind: 'shinPad' },
    props: [
      { kind: 'seat', x: 70, y: 158, w: 56, h: 52, angle: -14 },
      { kind: 'pad', x: 124, y: 133, w: 8, h: 11 },
    ],
    frames: con(start, end, { move1: 1100, move2: 1900 }),
    frame: { x: 30, y: 46, w: 190, h: 174 },
  };
}

export function hipThrust(): AnimSpec {
  const base = { head: 300, ua: 0, fa: 0, th: 0, sh: 0, foot: { x: 158, y: AY }, at: { x: 58, y: 165 } };
  const bottom: S = { ...base, torso: 306, hand: { x: 104, y: 187 } };
  const top: S = { ...base, torso: 270, hand: { x: 114, y: 155 } };
  return {
    view: 'side',
    anchor: { joint: 'shoulder', x: 58, y: 165 },
    held: { kind: 'barbell' },
    props: [{ kind: 'bench', x: 2, y: 173, w: 60 }],
    frames: con(bottom, top, { move1: 1100, hold2: 700, move2: 1600 }),
    frame: { x: 0, y: 70, w: 200, h: 150 },
  };
}

export function gluteBridge(): AnimSpec {
  const base = { head: 270, ua: 92, fa: 90, th: 0, sh: 0, foot: { x: 140, y: AY }, at: { x: 52, y: 202 } };
  const bottom: S = { ...base, torso: 270 };
  const top: S = { ...base, torso: 244, head: 258 };
  return {
    view: 'side',
    anchor: { joint: 'shoulder', x: 52, y: 202 },
    props: [{ kind: 'mat', x: 20, y: 0, w: 170 }],
    frames: con(bottom, top, { move1: 1000, hold2: 800, move2: 1500 }),
    frame: { x: 10, y: 90, w: 190, h: 130 },
  };
}

export function calfRaise(kind: 'dumbbell' | 'none' = 'dumbbell'): AnimSpec {
  const base: S = { torso: 2, ua: 180, fa: 180, th: 180, sh: 180, ft: 90 };
  return {
    view: 'side',
    anchor: { joint: 'toe', x: 127, y: F },
    held: kind === 'none' ? undefined : { kind },
    frames: con({ ...base, heel: 0 }, { ...base, heel: 1 }, { move1: 900, hold2: 800, move2: 1500 }),
  };
}

/* ===================== KO‘KRAK ===================== */

export function benchPress(kind: 'barbell' | 'dumbbell' = 'barbell', grip: 'normal' | 'close' = 'normal'): AnimSpec {
  const base = { torso: 270, head: 268, ua: 0, fa: 0, th: 100, sh: 180, foot: { x: 172, y: AY } };
  const top: S = { ...base, hand: { x: 80, y: 106 } };
  const bottom: S = { ...base, hand: kind === 'dumbbell' ? { x: 86, y: 150 } : grip === 'close' ? { x: 95, y: 147 } : { x: 92, y: 146 } };
  return {
    view: 'side',
    anchor: { joint: 'hip', x: 130, y: 162 },
    held: { kind },
    props: [{ kind: 'bench', x: 40, y: 170, w: 112 }],
    frames: ecc(top, bottom),
    frame: { x: 20, y: 56, w: 200, h: 164 },
  };
}

export function inclinePress(kind: 'barbell' | 'dumbbell' = 'dumbbell'): AnimSpec {
  const base = { torso: 305, head: 310, ua: 0, fa: 0, th: 95, sh: 180, foot: { x: 162, y: AY } };
  const top: S = { ...base, hand: { x: 70, y: 79 } };
  const bottom: S = { ...base, hand: { x: 84, y: 126 } };
  return {
    view: 'side',
    anchor: { joint: 'hip', x: 112, y: 166 },
    held: { kind },
    props: [{ kind: 'inclineBench', x: 114, y: 175, w: 70, angle: 35 }],
    frames: ecc(top, bottom),
    frame: { x: 10, y: 30, w: 200, h: 190 },
  };
}

export function machineChestPress(): AnimSpec {
  const base = { torso: 354, head: 0, ua: 0, fa: 0, th: 88, sh: 180 };
  const start: S = { ...base, hand: { x: 108, y: 118 } };
  const end: S = { ...base, hand: { x: 146, y: 112 } };
  return {
    view: 'side',
    anchor: { joint: 'hip', x: 96, y: 160 },
    held: { kind: 'handle' },
    props: [{ kind: 'seat', x: 72, y: 169, w: 50, h: 58, angle: -6 }],
    frames: con(start, end),
    frame: { x: 30, y: 30, w: 190, h: 190 },
  };
}

export function pushUp(): AnimSpec {
  const top: S = { torso: 72, head: 76, ua: 180, fa: 180, th: 252, sh: 252, ft: 170, hand: { x: 202, y: 209 } };
  const bottom: S = { ...top, torso: 88, head: 90, th: 268, sh: 268 };
  return {
    view: 'side',
    anchor: { joint: 'toe', x: 60, y: F },
    frames: ecc(top, bottom, { move1: 1700, move2: 1000 }),
    frame: { x: 40, y: 70, w: 196, h: 150 },
  };
}

export function dips(): AnimSpec {
  const base = { ua: 0, fa: 0, th: 192, sh: 238, hand: { x: 114, y: 130 } };
  const top: S = { ...base, torso: 12, head: 10, at: { x: 110, y: 72 } };
  const bottom: S = { ...base, torso: 24, head: 18, at: { x: 103, y: 104 } };
  return {
    view: 'side',
    anchor: { joint: 'shoulder', x: 110, y: 72 },
    props: [{ kind: 'dipBars', x: 116, y: 134 }],
    floorY: 238,
    frames: ecc(top, bottom, { move1: 1800, move2: 1100 }),
    frame: { x: 20, y: 20, w: 200, h: 216 },
  };
}

export function cableFly(): AnimSpec {
  const start: Fp = { ua: 72, fa: 76, fwd: 0 };
  const end: Fp = { ua: 118, fa: 118, fwd: 100 };
  return {
    view: 'front',
    held: { kind: 'cable', from: { x: CX + 80, y: 34 } },
    props: [
      { kind: 'cableTower', x: CX + 80, y: 34 },
      { kind: 'cableTower', x: CX - 80, y: 34 },
    ],
    frames: con(start, end, { move1: 1300 }),
    frame: { x: 18, y: 14, w: 204, h: 206 },
  };
}

export function pecDeck(): AnimSpec {
  const base = { hipY: 150, legFwd: 76 };
  const start: Fp = { ...base, ua: 90, fa: 92, fwd: 0 };
  const end: Fp = { ...base, ua: 92, fa: 94, fwd: 96 };
  return {
    view: 'front',
    props: [{ kind: 'seatFront', x: CX, y: 158, w: 46 }],
    frames: con(start, end, { move1: 1200 }),
    frame: { x: 18, y: 30, w: 204, h: 190 },
  };
}

export function dumbbellFly(): AnimSpec {
  const base = { hipY: 150 };
  const top: Fp = { ...base, ua: 94, fa: 96, fwd: 94 };
  const wide: Fp = { ...base, ua: 90, fa: 98, fwd: 8 };
  return {
    view: 'front',
    held: { kind: 'dumbbell' },
    floorY: 400,
    props: [{ kind: 'benchTop', x: CX, y: 70, w: 32, h: 150 }],
    frames: ecc(top, wide),
    frame: { x: 18, y: 40, w: 204, h: 180 },
  };
}

/* ===================== YELKA ===================== */

export function overheadPress(): AnimSpec {
  const bottom: S = { torso: -3, head: -10, ua: 0, fa: 0, th: 180, sh: 180, hand: { x: 123, y: 62 } };
  const top: S = { torso: 1, head: 4, ua: 0, fa: 0, th: 180, sh: 180, hand: { x: 113, y: 8 } };
  return {
    view: 'side',
    anchor: ankle(),
    held: { kind: 'barbell' },
    frames: con(bottom, top, { move1: 1200 }),
    frame: { x: 20, y: -22, w: 200, h: 242 },
  };
}

export function dumbbellShoulderPress(): AnimSpec {
  const base = { hipY: 150, legFwd: 76, ua: 0, fa: 0 };
  const bottom: Fp = { ...base, hand: { x: CX + 36, y: 86 } };
  const top: Fp = { ...base, hand: { x: CX + 17, y: 44 } };
  return {
    view: 'front',
    held: { kind: 'dumbbell' },
    props: [{ kind: 'seatFront', x: CX, y: 158, w: 46 }],
    frames: con(bottom, top),
    frame: { x: 18, y: 14, w: 204, h: 206 },
  };
}

export function machineShoulderPress(): AnimSpec {
  const base = { torso: 352, head: 356, ua: 0, fa: 0, th: 88, sh: 180 };
  return {
    view: 'side',
    anchor: { joint: 'hip', x: 96, y: 160 },
    held: { kind: 'handle' },
    props: [{ kind: 'seat', x: 72, y: 169, w: 50, h: 62, angle: -8 }],
    frames: con({ ...base, hand: { x: 102, y: 100 } }, { ...base, hand: { x: 96, y: 52 } }),
    frame: { x: 30, y: 20, w: 190, h: 200 },
  };
}

export function pikePushUp(): AnimSpec {
  const top: S = { torso: 120, head: 130, ua: 0, fa: 0, th: 215, sh: 215, ft: 170, hand: { x: 176, y: 209 } };
  const bottom: S = { ...top, torso: 142, head: 160 };
  return {
    view: 'side',
    anchor: { joint: 'toe', x: 64, y: F },
    frames: ecc(top, bottom, { move1: 1700, move2: 1000 }),
    frame: { x: 34, y: 60, w: 190, h: 160 },
  };
}

export function lateralRaise(kind: 'dumbbell' | 'cable' = 'dumbbell'): AnimSpec {
  const start: Fp = { ua: 174, fa: 172 };
  const top: Fp = { ua: 94, fa: 100 };
  return {
    view: 'front',
    held: kind === 'cable' ? { kind: 'cable', from: { x: CX - 48, y: 206 } } : { kind: 'dumbbell' },
    frames: con(start, top, { move1: 1100, hold2: 300, move2: 1800 }),
  };
}

export function facePull(): AnimSpec {
  const start: Fp = { ua: 88, fa: 90, fwd: 82 };
  const end: Fp = { ua: 96, fa: 8, fwd: 0 };
  return {
    view: 'back',
    held: { kind: 'cable', from: { x: CX, y: 54 } },
    frames: con(start, end, { move1: 1100, hold2: 600 }),
  };
}

export function reverseFly(): AnimSpec {
  const start: Fp = { ua: 90, fa: 92, fwd: 80 };
  const end: Fp = { ua: 90, fa: 92, fwd: 0 };
  return { view: 'back', held: { kind: 'band', both: true }, frames: con(start, end, { move1: 1100, hold2: 500 }) };
}

/* ===================== ORQA ===================== */

export function barbellRow(): AnimSpec {
  const base = { torso: 65, head: 50, ua: 0, fa: 0, th: 158, sh: 188 };
  return {
    view: 'side',
    anchor: ankle(),
    held: { kind: 'barbell' },
    frames: con({ ...base, hand: { x: 148, y: 156 } }, { ...base, hand: { x: 125, y: 128 } }),
  };
}

export function dumbbellRow(): AnimSpec {
  const base = { torso: 82, head: 80, ua: 0, fa: 0, ua2: 180, fa2: 180, th: 170, sh: 185, th2: 180, sh2: 270, ft2: 250 };
  return {
    view: 'side',
    anchor: ankle(120),
    held: { kind: 'dumbbell', single: true },
    props: [{ kind: 'bench', x: 50, y: 170, w: 134 }],
    frames: con({ ...base, hand: { x: 166, y: 166 } }, { ...base, hand: { x: 128, y: 124 } }),
  };
}

export function seatedCableRow(): AnimSpec {
  const base = { head: 0, ua: 0, fa: 0, th: 80, sh: 100, ft: 20, foot: { x: 166, y: 182 } };
  const start: S = { ...base, torso: 14, head: 18, hand: { x: 146, y: 128 } };
  const end: S = { ...base, torso: -6, head: -4, hand: { x: 97, y: 144 } };
  return {
    view: 'side',
    anchor: { joint: 'hip', x: 78, y: 172 },
    held: { kind: 'cable', from: { x: 200, y: 176 } },
    props: [
      { kind: 'box', x: 40, y: 180, w: 72, h: 34 },
      { kind: 'pad', x: 178, y: 162, w: 30, h: 7, angle: 90 },
      { kind: 'cableTower', x: 204, y: 176 },
    ],
    frames: con(start, end),
    frame: { x: 24, y: 60, w: 200, h: 160 },
  };
}

export function chestSupportedRow(): AnimSpec {
  const base = { torso: 52, head: 58, ua: 0, fa: 0, th: 0, sh: 0, ft: 104, foot: { x: 64, y: AY } };
  return {
    view: 'side',
    anchor: { joint: 'hip', x: 100, y: 128 },
    held: { kind: 'dumbbell' },
    props: [
      { kind: 'legPressFrame', x: 96, y: 214, w: 66, angle: 62 },
      { kind: 'pad', x: 108, y: 140, w: 60, h: 9, angle: -38 },
    ],
    frames: con({ ...base, hand: { x: 147, y: 150 } }, { ...base, hand: { x: 121, y: 118 } }),
  };
}

export function invertedRow(): AnimSpec {
  const bottom: S = { torso: 290, head: 288, ua: 0, fa: 0, th: 110, sh: 110, ft: 20, hand: { x: 66, y: 104 } };
  const top: S = { torso: 308.7, head: 300, ua: 0, fa: 0, th: 128.7, sh: 128.7, ft: 38.7, hand: { x: 66, y: 104 } };
  return {
    view: 'side',
    anchor: ankle(196),
    props: [{ kind: 'dipBars', x: 58, y: 100 }],
    frames: con(bottom, top),
    frame: { x: 20, y: 60, w: 200, h: 160 },
  };
}

export function pullUp(grip: 'wide' | 'chin' = 'wide'): AnimSpec {
  const hx = grip === 'wide' ? CX + 38 : CX + 22;
  const base = { ua: 0, fa: 0, th: 182, sh: 176, hand: { x: hx, y: 24 } };
  return {
    view: 'back',
    floorY: 250,
    props: [{ kind: 'pullupBar', x: CX, y: 22, w: 120 }],
    frames: con({ ...base, hipY: 132 }, { ...base, hipY: 86 }, { hold1: 500, move1: 1300, hold2: 400, move2: 1800 }),
    frame: { x: 20, y: -8, w: 200, h: 236 },
  };
}

export function latPulldown(): AnimSpec {
  const base = { hipY: 156, legFwd: 76, ua: 0, fa: 0 };
  return {
    view: 'back',
    held: { kind: 'barbell', both: true, from: { x: CX, y: -12 } },
    props: [{ kind: 'seatFront', x: CX, y: 164, w: 46 }],
    frames: con({ ...base, hand: { x: CX + 38, y: 52 } }, { ...base, hand: { x: CX + 40, y: 100 } }),
    frame: { x: 18, y: -4, w: 204, h: 224 },
  };
}

export function shrug(): AnimSpec {
  return {
    view: 'back',
    held: { kind: 'dumbbell' },
    frames: con({ ua: 177, fa: 177, shrug: 0 }, { ua: 177, fa: 177, shrug: 9 }, { move1: 800, hold2: 700, move2: 1400 }),
  };
}

/* ===================== QO‘LLAR ===================== */

export function curl(kind: 'barbell' | 'ezbar' | 'dumbbell' | 'cable' = 'dumbbell'): AnimSpec {
  const start: S = { torso: 2, ua: 178, fa: 176, th: 180, sh: 180 };
  const end: S = { torso: 1, ua: 170, fa: 26, th: 180, sh: 180 };
  return {
    view: 'side',
    anchor: ankle(),
    held: kind === 'cable' ? { kind: 'cable', from: { x: 160, y: 206 } } : { kind: kind === 'ezbar' ? 'ezbar' : kind },
    props: kind === 'cable' ? [{ kind: 'cableTower', x: 168, y: 206 }] : undefined,
    frames: con(start, end, { move1: 1100, hold2: 350, move2: 2000 }),
  };
}

export function inclineCurl(): AnimSpec {
  const base = { torso: 320, head: 326, th: 95, sh: 180, foot: { x: 162, y: AY } };
  return {
    view: 'side',
    anchor: { joint: 'hip', x: 112, y: 166 },
    held: { kind: 'dumbbell' },
    props: [{ kind: 'inclineBench', x: 114, y: 175, w: 74, angle: 50 }],
    frames: con({ ...base, ua: 184, fa: 182 }, { ...base, ua: 178, fa: 22 }, { move1: 1100, move2: 2100 }),
    frame: { x: 10, y: 30, w: 200, h: 190 },
  };
}

export function pushdown(): AnimSpec {
  const start: S = { torso: 10, head: 6, ua: 182, fa: 52, th: 180, sh: 180 };
  const end: S = { ...start, fa: 178 };
  return {
    view: 'side',
    anchor: ankle(),
    held: { kind: 'cable', from: { x: 162, y: 4 } },
    props: [{ kind: 'cableTower', x: 168, y: 4 }],
    frames: con(start, end, { move1: 1000, hold2: 400, move2: 1800 }),
    frame: { x: 20, y: -10, w: 200, h: 230 },
  };
}

export function overheadExtension(): AnimSpec {
  const top: S = { torso: 2, head: 4, ua: 354, fa: 358, th: 180, sh: 180 };
  const bottom: S = { ...top, ua: 352, fa: 200 };
  return {
    view: 'side',
    anchor: ankle(),
    held: { kind: 'dumbbell', single: true },
    frames: ecc(top, bottom, { move1: 2000, move2: 1100 }),
    frame: { x: 20, y: -26, w: 200, h: 246 },
  };
}

export function skullCrusher(): AnimSpec {
  const base = { torso: 270, head: 268, th: 100, sh: 180, foot: { x: 172, y: AY } };
  const top: S = { ...base, ua: 348, fa: 2 };
  const bottom: S = { ...base, ua: 344, fa: 258 };
  return {
    view: 'side',
    anchor: { joint: 'hip', x: 130, y: 162 },
    held: { kind: 'ezbar' },
    props: [{ kind: 'bench', x: 40, y: 170, w: 112 }],
    frames: ecc(top, bottom),
    frame: { x: 20, y: 56, w: 200, h: 164 },
  };
}

export function benchDip(): AnimSpec {
  const base = { ua: 0, fa: 0, th: 0, sh: 0, ft: 20, hand: { x: 66, y: 164 }, foot: { x: 144, y: AY } };
  const top: S = { ...base, torso: 4, head: 4, at: { x: 70, y: 110 } };
  const bottom: S = { ...base, torso: 12, head: 10, at: { x: 72, y: 140 } };
  return {
    view: 'side',
    anchor: { joint: 'shoulder', x: 70, y: 110 },
    props: [{ kind: 'bench', x: 8, y: 168, w: 64 }],
    frames: ecc(top, bottom, { move1: 1600, move2: 1000 }),
    frame: { x: 10, y: 50, w: 190, h: 170 },
  };
}

/* ===================== KOR (PRESS) ===================== */

export function plank(): AnimSpec {
  const p: S = { torso: 82, head: 86, ua: 180, fa: 90, th: 262, sh: 262, ft: 168 };
  return {
    view: 'side',
    anchor: { joint: 'toe', x: 52, y: F },
    props: [{ kind: 'mat', x: 30, y: 0, w: 190 }],
    frames: [
      { pose: p, dur: 2200, phase: 'up' },
      { pose: { ...p, torso: 81.2, head: 84 }, dur: 2200, phase: 'down' },
    ],
    frame: { x: 30, y: 90, w: 200, h: 130 },
  };
}

export function hangingLegRaise(): AnimSpec {
  const start: S = { torso: 0, head: 0, ua: 0, fa: 0, th: 180, sh: 180, ft: 90 };
  const end: S = { torso: -6, head: -2, ua: 0, fa: 0, th: 86, sh: 92, ft: 2 };
  return {
    view: 'side',
    anchor: { joint: 'wrist', x: 110, y: 28 },
    props: [{ kind: 'pullupBar', x: 110, y: 26, w: 60 }],
    floorY: 260,
    frames: con(start, end, { move1: 1300, hold2: 400, move2: 1900 }),
    frame: { x: 20, y: 0, w: 200, h: 220 },
  };
}

export function cableCrunch(): AnimSpec {
  const start: S = { torso: 8, head: 10, ua: 173, fa: 343, th: 180, sh: 270, ft: 200 };
  const end: S = { torso: 108, head: 140, curve: 0.5, ua: 273, fa: 83, th: 180, sh: 270, ft: 200 };
  return {
    view: 'side',
    anchor: { joint: 'knee', x: 118, y: 207 },
    held: { kind: 'cable', from: { x: 96, y: 2 } },
    props: [{ kind: 'cableTower', x: 90, y: 2 }, { kind: 'mat', x: 40, y: 0, w: 150 }],
    frames: con(start, end, { move1: 1200, hold2: 500, move2: 1800 }),
    frame: { x: 20, y: 0, w: 200, h: 220 },
  };
}

export function crunch(): AnimSpec {
  const base = { th: 0, sh: 0, foot: { x: 166, y: AY } };
  const start: S = { ...base, torso: 270, head: 274, ua: 60, fa: 240 };
  const end: S = { ...base, torso: 298, head: 318, curve: 0.35, ua: 88, fa: 268 };
  return {
    view: 'side',
    anchor: { joint: 'hip', x: 118, y: 202 },
    props: [{ kind: 'mat', x: 30, y: 0, w: 170 }],
    frames: con(start, end, { move1: 900, hold2: 500, move2: 1500 }),
    frame: { x: 30, y: 100, w: 190, h: 120 },
  };
}

export function deadBug(): AnimSpec {
  const start: S = { torso: 270, head: 272, ua: 0, fa: 0, ua2: 0, fa2: 0, th: 0, sh: 90, th2: 0, sh2: 90, ft: 0, ft2: 0 };
  const end: S = { ...start, ua: 266, fa: 266, th: 84, sh: 86, ft: 356 };
  return {
    view: 'side',
    anchor: { joint: 'hip', x: 120, y: 202 },
    props: [{ kind: 'mat', x: 20, y: 0, w: 190 }],
    frames: con(start, end, { hold1: 500, move1: 2000, hold2: 500, move2: 1500 }),
    frame: { x: 20, y: 70, w: 200, h: 150 },
  };
}
