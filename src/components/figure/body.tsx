// Tana geometriyasi (yon va old/orqa ko'rinish): kontur, soyalash o'qlari, anatomik chiziqlar va mushak shakllari.
import { add, cw, mul, norm, sub, type FrontSkeleton, type SideLimb, type SideSkeleton } from '../../lib/figure';
import type { MuscleId, Pt } from '../../types';
import { PROF, bulge, edge, fistSide, geo, groove, headSide, lens, outline, profAt, shadeAxis, shoeSide, smoothClosed, smoothOpen, type Geo, type MuscleGeo, type Prof } from './anatomy';

export type Shade = 'skin' | 'far' | 'shorts' | 'cyl' | 'shoe';

export interface Part {
  d: string;
  shade: Shade;
  axis?: { p1: Pt; p2: Pt };
  /** kesim chizig'i (oldingi a'zoni orqadagidan ajratish) */
  cut?: boolean;
  /** to'g'ridan-to'g'ri rang (soch, quloq, taglik) */
  fill?: string;
}

export interface BodyLayer {
  parts: Part[];
  grooves: string[];
  muscles: Partial<Record<MuscleId, MuscleGeo[]>>;
}

const angleBetween = (a: Pt, b: Pt) => {
  const c = (a.x * b.x + a.y * b.y) / ((Math.hypot(a.x, a.y) || 1) * (Math.hypot(b.x, b.y) || 1));
  return (Math.acos(Math.max(-1, Math.min(1, c))) * 180) / Math.PI;
};
const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

/** Mushak qisqarishi: bo'g'im burchagiga va faollikka qarab "qorin" qalinlashadi */
export interface Pump {
  /** faol (asosiy) mushaklar */
  active: Set<MuscleId>;
  /** 0..1 */
  activation: number;
  breath: number;
}

const NO_PUMP: Pump = { active: new Set(), activation: 0, breath: 0 };

function armGeo(l: SideLimb, pump: Pump, front: 'ccw' | 'cw' = 'ccw', profs = { ua: PROF.upperArm as Prof, fa: PROF.forearm as Prof }) {
  const flex = angleBetween(sub(l.b, l.a), sub(l.c, l.b));
  const p = (m: MuscleId) => (pump.active.has(m) ? 0.06 * pump.activation : 0);
  let ua = profs.ua;
  ua = bulge(ua, 1, 0.3, 0.95, 0.24 * clamp01(flex / 125) + p('biceps'));
  ua = bulge(ua, 2, 0.12, 0.95, 0.07 * (1 - clamp01(flex / 140)) + p('triceps'));
  ua = bulge(ua, 1, -0.12, 0.34, p('frontDelts') + p('sideDelts'));
  ua = bulge(ua, 2, -0.12, 0.34, p('rearDelts'));
  const fa = bulge(profs.fa, 1, 0, 0.7, p('forearms') + 0.05 * clamp01(flex / 120));
  return { ua: geo(l.a, l.b, ua, front), fa: geo(l.b, l.c, fa, front) };
}

function legGeo(l: SideLimb, pump: Pump, heel: number, front: 'ccw' | 'cw' = 'ccw', profs = { th: PROF.thigh as Prof, sh: PROF.shin as Prof }) {
  const flex = angleBetween(sub(l.b, l.a), sub(l.c, l.b));
  const p = (m: MuscleId) => (pump.active.has(m) ? 0.06 * pump.activation : 0);
  let th = profs.th;
  th = bulge(th, 1, 0.1, 0.95, 0.05 * (1 - clamp01(flex / 120)) + p('quads'));
  th = bulge(th, 2, 0.1, 0.92, 0.1 * clamp01(flex / 120) + p('hamstrings'));
  const sh = bulge(profs.sh, 2, 0.02, 0.7, 0.16 * heel + p('calves'));
  return { th: geo(l.a, l.b, th, front), sh: geo(l.b, l.c, sh, front) };
}

const limbParts = (g: Geo, shade: Shade, cut: boolean, shadeKind: 'side' | 'cyl' = 'side'): Part => ({
  d: outline(g),
  shade,
  axis: shadeKind === 'side' ? shadeAxis(g) : cylAxis(g),
  cut,
});

/** Old ko'rinish: silindr kabi yoritiladi — o'qi a'zoning kengligi bo'ylab */
function cylAxis(g: Geo, t = 0.45) {
  const an = profAt(g.prof, t, 1);
  const po = profAt(g.prof, t, 2);
  return { p1: g.at(t, an), p2: g.at(t, -po) };
}

/* ======================= YON KO'RINISH ======================= */

type Seg = 'torso' | 'thigh' | 'shin' | 'ua' | 'fa';
type Spec = [Seg, 1 | -1 | 0, number, number, number];

const SIDE_MUSCLES: Record<MuscleId, Spec[]> = {
  quads: [['thigh', 1, 0.08, 0.95, 0.62]],
  hamstrings: [['thigh', -1, 0.12, 0.9, 0.6]],
  adductors: [['thigh', 0, 0.02, 0.55, 0.42]],
  calves: [['shin', -1, 0.04, 0.68, 0.72]],
  glutes: [['torso', -1, -0.19, 0.15, 0.72]],
  chest: [['torso', 1, 0.6, 0.97, 0.55]],
  abs: [['torso', 1, 0.08, 0.62, 0.36]],
  obliques: [['torso', 0, 0.12, 0.58, 0.42]],
  lats: [['torso', -1, 0.42, 0.88, 0.55]],
  lowerBack: [['torso', -1, 0.1, 0.46, 0.44]],
  upperBack: [['torso', -1, 0.62, 0.93, 0.45]],
  traps: [['torso', -1, 0.84, 1.05, 0.62]],
  frontDelts: [['ua', 1, -0.1, 0.34, 0.8]],
  sideDelts: [['ua', 0, -0.12, 0.32, 0.85]],
  rearDelts: [['ua', -1, -0.1, 0.34, 0.8]],
  biceps: [['ua', 1, 0.3, 0.93, 0.72]],
  triceps: [['ua', -1, 0.14, 0.93, 0.72]],
  forearms: [['fa', 0, 0.02, 0.66, 0.8]],
};

const LEG_IDS: MuscleId[] = ['quads', 'hamstrings', 'adductors', 'calves'];
const ARM_IDS: MuscleId[] = ['frontDelts', 'sideDelts', 'rearDelts', 'biceps', 'triceps', 'forearms'];
const TORSO_IDS: MuscleId[] = ['chest', 'abs', 'obliques', 'lats', 'lowerBack', 'upperBack', 'traps'];

function musclesOn(segs: Partial<Record<Seg, Geo>>, ids: MuscleId[], fibers = 3) {
  const out: Partial<Record<MuscleId, MuscleGeo[]>> = {};
  for (const id of ids) {
    const list: MuscleGeo[] = [];
    for (const [seg, side, t0, t1, depth] of SIDE_MUSCLES[id]) {
      const g = segs[seg];
      if (g) list.push(lens(g, side, t0, t1, depth, fibers));
    }
    if (list.length) out[id] = list;
  }
  return out;
}

const SHORTS_T = 0.34;

function shortsSide(T: Geo, th: Geo) {
  return smoothClosed([
    T.at(0.15, profAt(T.prof, 0.15, 1) + 0.6),
    T.at(0.04, profAt(T.prof, 0.04, 1) + 0.8),
    th.at(0.06, profAt(th.prof, 0.06, 1) + 0.8),
    th.at(SHORTS_T, profAt(th.prof, SHORTS_T, 1) + 0.9),
    th.at(SHORTS_T + 0.02, 0),
    th.at(SHORTS_T, -profAt(th.prof, SHORTS_T, 2) - 0.9),
    T.at(-0.16, -profAt(T.prof, -0.16, 2) - 0.8),
    T.at(-0.04, -profAt(T.prof, -0.04, 2) - 0.9),
    T.at(0.15, -profAt(T.prof, 0.15, 2) - 0.6),
  ]);
}

function shortsSleeve(th: Geo) {
  return smoothClosed([
    th.at(-0.04, profAt(th.prof, -0.04, 1) + 0.6),
    th.at(SHORTS_T, profAt(th.prof, SHORTS_T, 1) + 0.8),
    th.at(SHORTS_T + 0.02, 0),
    th.at(SHORTS_T, -profAt(th.prof, SHORTS_T, 2) - 0.8),
    th.at(-0.04, -profAt(th.prof, -0.04, 2) - 0.6),
  ]);
}

export interface SideBody {
  far: BodyLayer;
  torso: BodyLayer;
  leg: BodyLayer;
  arm: BodyLayer;
  /** dumba (shortidan keyin chiziladi) */
  glutes?: MuscleGeo[];
  outlineNear: string[];
}

export function sideBody(s: SideSkeleton, pump: Pump = NO_PUMP, heel = 0, ids?: Set<MuscleId>): SideBody {
  // son ichki qismi yon tomondan ko'rinmaydi — faqat asosiy mushak bo'lsa ko'rsatamiz
  const want = (list: MuscleId[]) => list.filter((m) => (!ids || ids.has(m)) && (m !== 'adductors' || pump.active.has(m)));
  const hipFlex = angleBetween(sub(s.leg.b, s.leg.a), sub(s.hip, s.shoulder));
  // tana: umurtqa egilishi, nafas va dumba qisqarishi
  let tp: Prof = PROF.torso;
  tp = bulge(tp, 1, 0.52, 1.0, 0.05 * pump.breath);
  tp = bulge(tp, 2, -0.22, 0.16, 0.1 * (1 - clamp01(hipFlex / 110)) + (pump.active.has('glutes') ? 0.05 * pump.activation : 0));
  tp = bulge(tp, 1, 0.58, 0.98, pump.active.has('chest') ? 0.05 * pump.activation : 0);
  tp = bulge(tp, 2, 0.4, 0.9, pump.active.has('lats') || pump.active.has('upperBack') ? 0.05 * pump.activation : 0);
  const curve = s.curve;
  const T = geo(s.hip, s.shoulder, tp, 'cw', (t) => -curve * 13 * Math.sin(Math.PI * clamp01(t)));

  const nearArm = armGeo(s.arm, pump);
  const farArm = armGeo(s.arm2, pump);
  const nearLeg = legGeo(s.leg, pump, heel);
  const farLeg = legGeo(s.leg2, pump, heel);

  /* ---- uzoq tomon ---- */
  const far: BodyLayer = { parts: [], grooves: [], muscles: {} };
  far.parts.push({ d: outline(farArm.ua), shade: 'far' }, { d: outline(farArm.fa), shade: 'far' }, { d: fistSide(s.arm2.c, norm(sub(s.arm2.c, s.arm2.b))), shade: 'far' });
  far.parts.push({ d: outline(farLeg.th), shade: 'far' }, { d: outline(farLeg.sh), shade: 'far' });
  const fs = shoeSide(s.foot2.ankle, s.foot2.fdir);
  far.parts.push({ d: fs.upper, shade: 'shoe', fill: 'var(--shoe-far)' }, { d: fs.sole, shade: 'shoe', fill: 'var(--sole-far)' });
  far.parts.push({ d: shortsSleeve(farLeg.th), shade: 'shorts', fill: 'var(--shorts-far)' });
  far.muscles = {
    ...musclesOn({ ua: farArm.ua, fa: farArm.fa }, want(ARM_IDS), 2),
    ...musclesOn({ thigh: farLeg.th, shin: farLeg.sh }, want(LEG_IDS), 2),
  };

  /* ---- tana, bo'yin, bosh ---- */
  const torso: BodyLayer = { parts: [], grooves: [], muscles: {} };
  const up = norm(sub(s.head, s.neck));
  const neck = geo(s.shoulder, s.head, [
    [-0.15, 6.4, 7.6],
    [0.3, 4.7, 4.9],
    [0.62, 4.4, 4.2],
  ] as Prof, 'cw');
  torso.parts.push({ d: outline(neck), shade: 'skin', axis: shadeAxis(neck, 0.3) });
  torso.parts.push({ d: outline(T), shade: 'skin', axis: shadeAxis(T, 0.55) });
  const head = headSide(s.head, up);
  torso.parts.push({ d: head.face, shade: 'skin', axis: { p1: add(s.head, mul(norm({ x: up.x + cw(up).x * 0.6, y: up.y + cw(up).y * 0.6 }), 10)), p2: add(s.head, mul(norm({ x: up.x + cw(up).x * 0.6, y: up.y + cw(up).y * 0.6 }), -10)) }, cut: true });
  torso.parts.push({ d: head.hair, shade: 'skin', fill: 'var(--hair)' });
  const ear = head.ear;
  const eu = ear.up;
  const ef = cw(eu);
  torso.parts.push({
    d: smoothClosed([add(ear.c, mul(eu, 3.2)), add(ear.c, mul(ef, 1.9)), add(ear.c, mul(eu, -3.2)), add(ear.c, mul(ef, -1.6))]),
    shade: 'skin',
    fill: 'var(--skin-ear)',
  });
  // anatomik chiziqlar: ko'krak osti, qorin bo'laklari, kurak
  const fr = (t: number) => profAt(T.prof, t, 1);
  const bk = (t: number) => profAt(T.prof, t, 2);
  torso.grooves.push(
    smoothOpen([T.at(0.9, fr(0.9) * 0.15), T.at(0.74, fr(0.74) * 0.6), T.at(0.68, fr(0.68) * 0.97)]),
    ...[0.5, 0.4, 0.28].map((t) => smoothOpen([T.at(t, fr(t) * 0.97), T.at(t + 0.01, fr(t) * 0.72)])),
    smoothOpen([T.at(0.86, -bk(0.86) * 0.45), T.at(0.66, -bk(0.66) * 0.78), T.at(0.46, -bk(0.46) * 0.96)]),
    smoothOpen([T.at(0.42, -bk(0.42) * 0.55), T.at(0.12, -bk(0.12) * 0.7)]),
  );
  torso.muscles = musclesOn({ torso: T }, want(TORSO_IDS));

  /* ---- yaqin oyoq va shorti ---- */
  const leg: BodyLayer = { parts: [], grooves: [], muscles: {} };
  leg.parts.push(limbParts(nearLeg.th, 'skin', true), limbParts(nearLeg.sh, 'skin', true));
  const ns = shoeSide(s.foot.ankle, s.foot.fdir);
  leg.parts.push({ d: ns.upper, shade: 'shoe', fill: 'var(--shoe)', cut: true }, { d: ns.sole, shade: 'shoe', fill: 'var(--sole)' });
  leg.parts.push({ d: shortsSide(T, nearLeg.th), shade: 'shorts', axis: shadeAxis(nearLeg.th, 0.1), cut: true });
  leg.grooves.push(
    groove(nearLeg.th, SHORTS_T + 0.04, 0.86, 1, 0.4),
    groove(nearLeg.th, SHORTS_T + 0.04, 0.82, -1, 0.5),
    groove(nearLeg.sh, 0.12, 0.62, -1, 0.42),
    groove(nearLeg.sh, 0.1, 0.85, 1, 0.55),
  );
  leg.muscles = musclesOn({ thigh: nearLeg.th, shin: nearLeg.sh }, want(LEG_IDS));
  const glutes = !ids || ids.has('glutes') ? SIDE_MUSCLES.glutes.map(([, side, t0, t1, depth]) => lens(T, side, t0, t1, depth)) : undefined;

  /* ---- yaqin qo'l ---- */
  const arm: BodyLayer = { parts: [], grooves: [], muscles: {} };
  arm.parts.push(limbParts(nearArm.ua, 'skin', true), limbParts(nearArm.fa, 'skin', true));
  arm.parts.push({ d: fistSide(s.arm.c, norm(sub(s.arm.c, s.arm.b))), shade: 'skin', axis: shadeAxis(nearArm.fa, 1), cut: true });
  const ua = nearArm.ua;
  arm.grooves.push(
    smoothOpen([ua.at(0.04, profAt(ua.prof, 0.04, 1) * 0.9), ua.at(0.36, profAt(ua.prof, 0.36, 1) * 0.05), ua.at(0.08, -profAt(ua.prof, 0.08, 2) * 0.85)]),
    groove(ua, 0.42, 0.92, 1, 0.08),
    groove(nearArm.fa, 0.08, 0.7, 1, 0.3),
  );
  arm.muscles = musclesOn({ ua: nearArm.ua, fa: nearArm.fa }, want(ARM_IDS));

  return { far, torso, leg, arm, glutes, outlineNear: [outline(T), edge(nearLeg.th), edge(nearLeg.sh, 0), edge(nearArm.ua, 0), edge(nearArm.fa, 0)] };
}

/* ======================= OLD / ORQA KO'RINISH ======================= */

/** [t, lateral, medial] */
const FPROF = {
  upperArm: [
    [-0.12, 6.6, 4.6],
    [0.08, 7.3, 5],
    [0.28, 5.7, 5],
    [0.5, 5.3, 5.4],
    [0.75, 4.8, 4.6],
    [0.92, 4.2, 4],
    [1.02, 4, 3.8],
  ],
  forearm: [
    [-0.02, 4.4, 4],
    [0.2, 5.1, 4.6],
    [0.45, 4.3, 4],
    [0.75, 3.2, 3],
    [1.0, 2.8, 2.6],
  ],
  thigh: [
    [-0.04, 9.6, 6],
    [0.14, 10.2, 7.6],
    [0.34, 9.8, 7.4],
    [0.55, 8.6, 6.4],
    [0.75, 7, 6.4],
    [0.9, 6, 5.6],
    [1.02, 5.4, 5],
  ],
  shin: [
    [-0.02, 5.4, 5.2],
    [0.18, 6.3, 6.6],
    [0.34, 5.7, 6.1],
    [0.55, 4.4, 4.5],
    [0.8, 3.6, 3.6],
    [1.0, 3.3, 3.3],
  ],
} satisfies Record<string, Prof>;

type FSpec = ['ua' | 'fa' | 'thigh' | 'shin', 1 | -1 | 0, number, number, number];
const FRONT_LIMB: Partial<Record<MuscleId, FSpec[]>> = {
  frontDelts: [['ua', 0, -0.12, 0.32, 0.9]],
  sideDelts: [['ua', 1, -0.12, 0.32, 0.62]],
  biceps: [['ua', 0, 0.3, 0.9, 0.78]],
  forearms: [['fa', 0, 0.02, 0.62, 0.82]],
  quads: [['thigh', 0, 0.08, 0.92, 0.86]],
  adductors: [['thigh', -1, 0, 0.5, 0.6]],
  calves: [['shin', -1, 0.08, 0.55, 0.62]],
};
const BACK_LIMB: Partial<Record<MuscleId, FSpec[]>> = {
  rearDelts: [['ua', 0, -0.12, 0.3, 0.9]],
  sideDelts: [['ua', 1, -0.12, 0.32, 0.62]],
  triceps: [['ua', 0, 0.2, 0.9, 0.78]],
  forearms: [['fa', 0, 0.02, 0.62, 0.82]],
  hamstrings: [['thigh', 0, 0.18, 0.9, 0.82]],
  adductors: [['thigh', -1, 0, 0.5, 0.6]],
  calves: [
    ['shin', 1, 0.06, 0.55, 0.62],
    ['shin', -1, 0.06, 0.58, 0.66],
  ],
};

function frontTorsoPts(cx: number, y: number, hipY: number): Pt[] {
  const half: Pt[] = [
    { x: 5.2, y: y - 7 },
    { x: 14, y: y - 3.2 },
    { x: 20.5, y: y + 0.5 },
    { x: 19.5, y: y + 9 },
    { x: 18.2, y: y + 19 },
    { x: 15.2, y: y + 31 },
    { x: 13.6, y: y + 41 },
    { x: 14.8, y: hipY - 1 },
    { x: 14.2, y: hipY + 7 },
    { x: 5, y: hipY + 12 },
  ];
  return [...half.map((p) => ({ x: cx + p.x, y: p.y })), ...[...half].reverse().map((p) => ({ x: cx - p.x, y: p.y }))];
}

export function frontTorsoOutline(cx: number, y: number, hipY: number) {
  return smoothClosed(frontTorsoPts(cx, y, hipY));
}

function mirrorBoth(cx: number, half: Pt[]): MuscleGeo[] {
  return [1, -1].map((k) => ({ d: smoothClosed(half.map((p) => ({ x: cx + k * p.x, y: p.y }))), fibers: [] }));
}

function torsoMusclesFront(cx: number, y: number, hipY: number, back: boolean): Partial<Record<MuscleId, MuscleGeo[]>> {
  if (!back) {
    const abs: MuscleGeo[] = [];
    const rows = 3;
    const top = y + 21;
    const h = (hipY - 5 - top) / rows;
    for (let r = 0; r < rows; r++)
      for (const k of [1, -1]) {
        const x0 = cx + k * 1;
        const x1 = cx + k * (6.4 - r * 0.3);
        const y0 = top + r * h + 0.6;
        const y1 = top + (r + 1) * h - 0.6;
        abs.push({ d: smoothClosed([{ x: x0, y: y0 }, { x: x1, y: y0 + 0.4 }, { x: x1, y: y1 }, { x: x0, y: y1 + 0.2 }]), fibers: [] });
      }
    return {
      chest: mirrorBoth(cx, [
        { x: 1.4, y: y + 1 },
        { x: 9, y: y - 0.2 },
        { x: 16.5, y: y + 2.4 },
        { x: 18.6, y: y + 9.5 },
        { x: 14, y: y + 16.6 },
        { x: 6, y: y + 17.4 },
        { x: 1.6, y: y + 15 },
      ]),
      abs,
      obliques: mirrorBoth(cx, [
        { x: 9.5, y: y + 22 },
        { x: 15, y: y + 25 },
        { x: 14, y: hipY - 3 },
        { x: 8.6, y: hipY - 5 },
      ]),
      traps: mirrorBoth(cx, [
        { x: 5, y: y - 8 },
        { x: 14.5, y: y - 3.4 },
        { x: 7.5, y: y - 2.4 },
      ]),
      lats: mirrorBoth(cx, [
        { x: 17.4, y: y + 11 },
        { x: 18.4, y: y + 19 },
        { x: 15.4, y: y + 30 },
        { x: 14.6, y: y + 18 },
      ]),
    };
  }
  return {
    traps: [
      {
        d: smoothClosed([
          { x: cx, y: y - 9 },
          { x: cx + 7, y: y - 6 },
          { x: cx + 18, y: y - 0.6 },
          { x: cx + 6, y: y + 10 },
          { x: cx + 1.5, y: y + 30 },
          { x: cx - 1.5, y: y + 30 },
          { x: cx - 6, y: y + 10 },
          { x: cx - 18, y: y - 0.6 },
          { x: cx - 7, y: y - 6 },
        ]),
        fibers: [],
      },
    ],
    upperBack: mirrorBoth(cx, [
      { x: 3.5, y: y + 6 },
      { x: 13.5, y: y + 4.6 },
      { x: 12, y: y + 20 },
      { x: 3, y: y + 25 },
    ]),
    lats: mirrorBoth(cx, [
      { x: 16, y: y + 8 },
      { x: 18.8, y: y + 18 },
      { x: 14.2, y: y + 39 },
      { x: 6.4, y: y + 42 },
      { x: 9, y: y + 24 },
    ]),
    lowerBack: mirrorBoth(cx, [
      { x: 1.6, y: y + 30 },
      { x: 6.4, y: y + 31 },
      { x: 7, y: hipY - 1 },
      { x: 1.6, y: hipY - 1 },
    ]),
  };
}

function glutesBack(cx: number, hipY: number): MuscleGeo[] {
  return mirrorBoth(cx, [
    { x: 1.2, y: hipY - 4 },
    { x: 11, y: hipY - 4.4 },
    { x: 15.2, y: hipY + 2 },
    { x: 13.6, y: hipY + 11.5 },
    { x: 6, y: hipY + 13.4 },
    { x: 1.4, y: hipY + 11 },
  ]);
}

export interface FrontBody {
  /** qo'llar torsodan oldinda chiziladimi */
  arms: Part[];
  armGrooves: string[];
  legs: Part[];
  torso: Part[];
  head: Part[];
  shorts: Part;
  grooves: string[];
  muscles: Partial<Record<MuscleId, MuscleGeo[]>>;
  /** shortidan keyin chiziladigan (dumba) */
  late: Partial<Record<MuscleId, MuscleGeo[]>>;
  armMuscles: Partial<Record<MuscleId, MuscleGeo[]>>;
}

export function frontBody(s: FrontSkeleton, back: boolean, pump: Pump = NO_PUMP): FrontBody {
  const { cx, shoulderY: y, hipY } = s;
  const legs: Part[] = [];
  const arms: Part[] = [];
  const legG: { th: Geo; sh: Geo }[] = [];
  const armG: { ua: Geo; fa: Geo }[] = [];
  s.legs.forEach((l, i) => {
    const g = legGeo(l, pump, 0, i === 0 ? 'ccw' : 'cw', { th: FPROF.thigh, sh: FPROF.shin });
    legG.push(g);
    legs.push(limbParts(g.th, 'cyl', true, 'cyl'), limbParts(g.sh, 'cyl', true, 'cyl'));
    // poyabzal (old tomondan)
    const c = l.c;
    const dirOut = i === 0 ? 1 : -1;
    legs.push({
      d: smoothClosed([
        { x: c.x - 4.4 * dirOut, y: c.y - 1.5 },
        { x: c.x + 4.6 * dirOut, y: c.y - 1.5 },
        { x: c.x + 6.2 * dirOut, y: c.y + 4.6 },
        { x: c.x + 5 * dirOut, y: c.y + 7 },
        { x: c.x - 4.6 * dirOut, y: c.y + 7 },
        { x: c.x - 5.4 * dirOut, y: c.y + 3 },
      ]),
      shade: 'shoe',
      fill: 'var(--shoe)',
    });
    legs.push({ d: smoothClosed([{ x: c.x - 5.4 * dirOut, y: c.y + 5.6 }, { x: c.x + 6.2 * dirOut, y: c.y + 5.6 }, { x: c.x + 5.6 * dirOut, y: c.y + 7.4 }, { x: c.x - 5 * dirOut, y: c.y + 7.4 }]), shade: 'shoe', fill: 'var(--sole)' });
  });
  s.arms.forEach((l, i) => {
    const g = armGeo(l, pump, i === 0 ? 'ccw' : 'cw', { ua: FPROF.upperArm, fa: FPROF.forearm });
    armG.push(g);
    arms.push(limbParts(g.ua, 'cyl', true, 'cyl'), limbParts(g.fa, 'cyl', true, 'cyl'));
    const h = s.hands[i];
    const fd = norm(sub(l.c, l.b));
    const n = { x: -fd.y, y: fd.x };
    arms.push({
      d: smoothClosed([add(l.c, mul(n, 3)), add(add(l.c, mul(fd, 5)), mul(n, 3.8)), add(h, mul(fd, 3.6)), add(add(l.c, mul(fd, 5)), mul(n, -3.8)), add(l.c, mul(n, -3))]),
      shade: 'cyl',
      axis: { p1: add(h, mul(n, 4)), p2: add(h, mul(n, -4)) },
      cut: true,
    });
  });

  const torso: Part[] = [];
  const neck = smoothClosed([
    { x: cx - 4.6, y: s.head.y + 6 },
    { x: cx + 4.6, y: s.head.y + 6 },
    { x: cx + 6.2, y: y - 4 },
    { x: cx - 6.2, y: y - 4 },
  ]);
  torso.push({ d: neck, shade: 'cyl', axis: { p1: { x: cx - 6, y: y - 6 }, p2: { x: cx + 6, y: y - 6 } } });
  torso.push({ d: frontTorsoOutline(cx, y, hipY), shade: 'cyl', axis: { p1: { x: cx - 20, y: y + 20 }, p2: { x: cx + 20, y: y + 20 } } });

  // bosh
  const R = 10.5;
  const hc = s.head;
  const hp = (u: number, v: number) => ({ x: hc.x + u * R, y: hc.y + v * R });
  const headParts: Part[] = [];
  headParts.push({ d: smoothClosed([hp(-0.86, 0.02), hp(-0.84, -0.2), hp(-0.98, 0.18), hp(-0.82, 0.32)]), shade: 'skin', fill: 'var(--skin-ear)' });
  headParts.push({ d: smoothClosed([hp(0.86, 0.02), hp(0.84, -0.2), hp(0.98, 0.18), hp(0.82, 0.32)]), shade: 'skin', fill: 'var(--skin-ear)' });
  headParts.push({
    d: smoothClosed([hp(0, -1.02), hp(0.64, -0.8), hp(0.86, -0.18), hp(0.8, 0.28), hp(0.6, 0.66), hp(0.28, 0.94), hp(0, 1.02), hp(-0.28, 0.94), hp(-0.6, 0.66), hp(-0.8, 0.28), hp(-0.86, -0.18), hp(-0.64, -0.8)]),
    shade: 'cyl',
    axis: { p1: hp(-0.9, 0), p2: hp(0.9, 0) },
    cut: true,
  });
  headParts.push({
    d: back
      ? smoothClosed([hp(0, -1.08), hp(0.7, -0.84), hp(0.9, -0.2), hp(0.84, 0.36), hp(0.4, 0.5), hp(0, 0.52), hp(-0.4, 0.5), hp(-0.84, 0.36), hp(-0.9, -0.2), hp(-0.7, -0.84)])
      : smoothClosed([hp(0, -1.08), hp(0.7, -0.84), hp(0.9, -0.16), hp(0.74, -0.3), hp(0.5, -0.56), hp(0, -0.62), hp(-0.5, -0.56), hp(-0.74, -0.3), hp(-0.9, -0.16), hp(-0.7, -0.84)]),
    shade: 'skin',
    fill: 'var(--hair)',
  });

  // shorti
  const lat = (g: Geo, t: number) => g.at(t, profAt(g.prof, t, 1) + 0.8);
  const med = (g: Geo, t: number) => g.at(t, -profAt(g.prof, t, 2) - 0.6);
  const [R0, L0] = legG;
  const hem = 0.4;
  const mid = (g: Geo, t: number) => g.at(t, (profAt(g.prof, t, 1) - profAt(g.prof, t, 2)) / 2);
  const shorts: Part = {
    d: smoothClosed([
      { x: cx + 15, y: hipY - 6 },
      lat(R0.th, 0.1),
      lat(R0.th, hem),
      mid(R0.th, hem + 0.015),
      med(R0.th, hem),
      med(R0.th, hem - 0.12),
      { x: cx, y: hipY + 7 },
      med(L0.th, hem - 0.12),
      med(L0.th, hem),
      mid(L0.th, hem + 0.015),
      lat(L0.th, hem),
      lat(L0.th, 0.1),
      { x: cx - 15, y: hipY - 6 },
      { x: cx, y: hipY - 6.4 },
    ]),
    shade: 'shorts',
    axis: { p1: { x: cx - 16, y: hipY }, p2: { x: cx + 16, y: hipY } },
    cut: true,
  };

  const grooves: string[] = [];
  if (!back) {
    grooves.push(
      smoothOpen([{ x: cx - 16, y: y + 3 }, { x: cx - 13, y: y + 15.5 }, { x: cx - 6, y: y + 17.4 }, { x: cx - 1, y: y + 15 }]),
      smoothOpen([{ x: cx + 16, y: y + 3 }, { x: cx + 13, y: y + 15.5 }, { x: cx + 6, y: y + 17.4 }, { x: cx + 1, y: y + 15 }]),
      smoothOpen([{ x: cx, y: y + 18 }, { x: cx, y: hipY - 6 }]),
      ...[0, 1].map((r) => smoothOpen([{ x: cx - 6, y: y + 21 + (r + 1) * ((hipY - 26 - y) / 3) }, { x: cx + 6, y: y + 21 + (r + 1) * ((hipY - 26 - y) / 3) }])),
      smoothOpen([{ x: cx - 8, y: y + 21 }, { x: cx - 8.6, y: hipY - 6 }]),
      smoothOpen([{ x: cx + 8, y: y + 21 }, { x: cx + 8.6, y: hipY - 6 }]),
      smoothOpen([{ x: cx - 4.4, y: y - 6 }, { x: cx - 1.2, y: y - 1 }]),
      smoothOpen([{ x: cx + 4.4, y: y - 6 }, { x: cx + 1.2, y: y - 1 }]),
    );
  } else {
    grooves.push(
      smoothOpen([{ x: cx, y: y - 4 }, { x: cx, y: hipY - 4 }]),
      smoothOpen([{ x: cx - 4, y: y + 4 }, { x: cx - 12, y: y + 6 }, { x: cx - 10, y: y + 20 }, { x: cx - 4, y: y + 22 }]),
      smoothOpen([{ x: cx + 4, y: y + 4 }, { x: cx + 12, y: y + 6 }, { x: cx + 10, y: y + 20 }, { x: cx + 4, y: y + 22 }]),
      smoothOpen([{ x: cx - 17.6, y: y + 18 }, { x: cx - 13.6, y: y + 38 }]),
      smoothOpen([{ x: cx + 17.6, y: y + 18 }, { x: cx + 13.6, y: y + 38 }]),
    );
  }
  const armGrooves: string[] = [];
  armG.forEach((g) => {
    armGrooves.push(groove(g.ua, 0.34, 0.92, 1, back ? 0.2 : 0.35));
  });
  legG.forEach((g) => {
    grooves.push(groove(g.th, 0.46, 0.86, 1, 0.3), groove(g.sh, 0.1, 0.55, -1, 0.3));
  });

  // mushaklar
  const limbSpec = back ? BACK_LIMB : FRONT_LIMB;
  const muscles: Partial<Record<MuscleId, MuscleGeo[]>> = torsoMusclesFront(cx, y, hipY, back);
  const armMuscles: Partial<Record<MuscleId, MuscleGeo[]>> = {};
  for (const [id, specs] of Object.entries(limbSpec) as [MuscleId, FSpec[]][]) {
    for (const [seg, side, t0, t1, depth] of specs) {
      const target = seg === 'ua' || seg === 'fa' ? armMuscles : muscles;
      const geos = seg === 'ua' || seg === 'fa' ? armG.map((g) => g[seg]) : legG.map((g) => (seg === 'thigh' ? g.th : g.sh));
      for (const g of geos) (target[id] ??= []).push(lens(g, side, t0, t1, depth, 2));
    }
  }
  const late = back ? { glutes: glutesBack(cx, hipY) } : {};
  return { arms, armGrooves, legs, torso, head: headParts, shorts, grooves, muscles, late, armMuscles };
}

export function emptyLayer(): BodyLayer {
  return { parts: [], grooves: [], muscles: {} };
}

export { cylAxis };
