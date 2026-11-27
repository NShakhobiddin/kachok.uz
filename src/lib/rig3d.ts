// 3D mushak modelini harakatlantirish: skelet (17 suyak), har bir uchning suyaklarga «vazni» va 2D animatsiyadan poza.
// Model (Z-Anatomy, anatomik holat): metr, Y — yuqoriga, yuz +Z ga, modelning chap tomoni +X. Bo‘g‘im markazlari
// suyaklar mesh’idagi bo‘g‘im atrofidagi suyaklar kesimidan olingan (scripts/model, 2026-11-27).
// Harakat: mavjud 2D animatsiya (src/data/anims.ts) → solveSide → har bir bo‘g‘imning sagittal burchagi → X o‘qi atrofida aylanish.
// Yaqin (kameraga) oyoq-qo‘l — chap (+X), uzoqdagisi — o‘ng.
import * as THREE from 'three';
import { solveSide, type SideSkeleton } from './figure';
import type { AnimSpec, SidePose } from '../types';

type V3 = [number, number, number];
const mirror = (p: V3): V3 => [-p[0], p[1], p[2]];

/** bo‘g‘im markazlari (model koordinatalari, chap tomon) */
const J = {
  pelvis: [0, 0.95, -0.03] as V3,
  spine: [0, 1.06, -0.05] as V3,
  chest: [0, 1.22, -0.05] as V3,
  neck: [0, 1.5, -0.05] as V3,
  head: [0, 1.6, -0.02] as V3,
  headTop: [0, 1.74, 0] as V3,
  shoulder: [0.18, 1.41, -0.04] as V3,
  elbow: [0.228, 1.115, -0.045] as V3,
  wrist: [0.275, 0.87, 0.015] as V3,
  fingers: [0.29, 0.7, 0.03] as V3,
  hip: [0.09, 0.9, -0.02] as V3,
  knee: [0.083, 0.455, -0.03] as V3,
  ankle: [0.085, 0.075, -0.04] as V3,
  toe: [0.095, 0.01, 0.13] as V3,
};

interface BoneDef {
  name: string;
  parent: number;
  /** bo‘g‘im (suyak boshi) va uchi — masofa va burchak uchun */
  a: V3;
  b: V3;
  /** qo‘shni suyak bilan aralashish oralig‘i (m) */
  blend: number;
  side: 0 | 1 | -1;
}

const DEFS: BoneDef[] = [
  { name: 'pelvis', parent: -1, a: J.pelvis, b: J.spine, blend: 0.06, side: 0 },
  { name: 'spine', parent: 0, a: J.spine, b: J.chest, blend: 0.07, side: 0 },
  { name: 'chest', parent: 1, a: J.chest, b: J.neck, blend: 0.08, side: 0 },
  { name: 'neck', parent: 2, a: J.neck, b: J.head, blend: 0.04, side: 0 },
  { name: 'head', parent: 3, a: J.head, b: J.headTop, blend: 0.04, side: 0 },
];
const LIMBS: [string, number | 'chest' | 'pelvis', V3, V3, number][] = [
  ['upperArm', 'chest', J.shoulder, J.elbow, 0.06],
  ['foreArm', -1, J.elbow, J.wrist, 0.04],
  ['hand', -2, J.wrist, J.fingers, 0.025],
  ['thigh', 'pelvis', J.hip, J.knee, 0.07],
  ['shin', -1, J.knee, J.ankle, 0.05],
  ['foot', -2, J.ankle, J.toe, 0.03],
];
for (const side of [1, -1] as const) {
  let prev = -1;
  for (const [n, par, a, b, blend] of LIMBS) {
    const parent = par === 'chest' ? 2 : par === 'pelvis' ? 0 : prev;
    DEFS.push({ name: `${n}.${side === 1 ? 'L' : 'R'}`, parent, a: side === 1 ? a : mirror(a), b: side === 1 ? b : mirror(b), blend, side });
    prev = DEFS.length - 1;
  }
}
const IDX = Object.fromEntries(DEFS.map((d, i) => [d.name, i])) as Record<string, number>;

/** mesh guruhi → ruxsat etilgan suyaklar va ularga masofa koeffitsienti (katta = kamroq tortadi) */
const TORSO = ['pelvis', 'spine', 'chest', 'neck', 'head'];
const ARM = ['upperArm', 'foreArm', 'hand'];
const LEG = ['thigh', 'shin', 'foot'];
const ARM_MESHES = ['biceps', 'brachialis', 'tricepsMedial', 'tricepsLateral', 'tricepsLong', 'forearmFlexors', 'forearmExtensors', 'brachioradialis', 'deltAnt', 'deltLat', 'deltPost'];
function allowed(mesh: string): Record<string, number> {
  const t = (k = 1) => Object.fromEntries(TORSO.map((n) => [n, k]));
  const limb = (names: string[], k = 1) =>
    Object.fromEntries(
      names.flatMap((n) => [
        [`${n}.L`, k],
        [`${n}.R`, k],
      ]),
    );
  if (['biceps', 'brachialis', 'tricepsMedial', 'tricepsLateral', 'tricepsLong', 'forearmFlexors', 'forearmExtensors', 'brachioradialis'].includes(mesh)) return { ...limb(ARM), chest: 1.6 };
  if (['deltAnt', 'deltLat', 'deltPost', 'infraspinatus', 'teresMajor'].includes(mesh)) return { chest: 1, ...limb(['upperArm'], 0.8) };
  if (['pecUpper', 'pecMid', 'pecLower', 'lats', 'serratus', 'trapUpper', 'trapMid', 'trapLower', 'rhomboids'].includes(mesh)) return { ...t(), ...limb(['upperArm'], 1.7) };
  if (['erectors', 'rectusAbdominis', 'externalOblique'].includes(mesh)) return t();
  if (['gluteMax', 'gluteMed', 'iliopsoas'].includes(mesh)) return { pelvis: 1, spine: 1.2, ...limb(['thigh'], 1.15) };
  if (['rectusFemoris', 'vastusLateralis', 'vastusMedialis', 'adductors', 'bicepsFemoris', 'medialHamstrings'].includes(mesh)) return { pelvis: 1.4, ...limb(['thigh', 'shin']) };
  if (['tibialisAnterior', 'gastrocnemius', 'soleus'].includes(mesh)) return limb(['thigh', 'shin', 'foot']);
  return { ...t(), ...limb([...ARM, ...LEG]) }; // other, tendon, bones
}

const v3 = (p: V3) => new THREE.Vector3(...p);
const SEG = DEFS.map((d) => ({ a: v3(d.a), b: v3(d.b), d: v3(d.b).sub(v3(d.a)) }));
for (const s of SEG) (s as { len?: number }).len = s.d.length();

/** nuqtadan suyak kesmasigacha masofa */
function segDist(p: THREE.Vector3, i: number, tmp: THREE.Vector3) {
  const s = SEG[i];
  const t = Math.max(0, Math.min(1, tmp.copy(p).sub(s.a).dot(s.d) / s.d.lengthSq()));
  return tmp.copy(s.a).addScaledVector(s.d, t).distanceTo(p);
}
const smooth = (e0: number, e1: number, x: number) => {
  const t = Math.max(0, Math.min(1, (x - e0) / (e1 - e0)));
  return t * t * (3 - 2 * t);
};
const children = DEFS.map((_, i) => DEFS.map((d, j) => (d.parent === i ? j : -1)).filter((j) => j >= 0));

/** bitta uch uchun vaznlar: eng yaqin ruxsat etilgan suyak, so‘ng ota va bola suyak bilan bo‘g‘im atrofida silliq aralashtirish */
/** gavda o‘zagi: qovurg‘a, ko‘krak qafasi va bel — qo‘l suyaklariga bog‘lanmaydi (qo‘l ko‘tarilganda qovurg‘a cho‘zilib ketmasin) */
const inTorsoCore = (p: THREE.Vector3) => p.y > 0.9 && p.y < 1.47 && Math.abs(p.x) < 0.155;

function weightsFor(p: THREE.Vector3, allow: Record<string, number>, tmp: THREE.Vector3, armMesh: boolean): [number[], number[]] {
  let best = -1;
  let bd = Infinity;
  const core = !armMesh && inTorsoCore(p);
  for (const [name, k] of Object.entries(allow)) {
    const i = IDX[name];
    const d = DEFS[i];
    if (d.side !== 0 && Math.sign(p.x) !== d.side && Math.abs(p.x) > 0.01) continue;
    if (core && /^(upperArm|foreArm|hand)\./.test(name)) continue;
    const dist = segDist(p, i, tmp) * k;
    if (dist < bd) {
      bd = dist;
      best = i;
    }
  }
  const w = new Map<number, number>([[best, 1]]);
  const along = (i: number) => tmp.copy(p).sub(SEG[i].a).dot(SEG[i].d) / SEG[i].d.length();
  // ota bilan: suyak boshi atrofida
  const par = DEFS[best].parent;
  if (par >= 0) {
    const s = along(best);
    const wb = smooth(-DEFS[best].blend, DEFS[best].blend, s);
    if (wb < 1) {
      w.set(best, wb);
      w.set(par, 1 - wb);
    }
  }
  // bola bilan: suyak uchi atrofida (yon tomondagi bolani tanlash)
  for (const c of children[best]) {
    if (DEFS[c].side !== 0 && Math.sign(p.x) !== DEFS[c].side) continue;
    if (core && /^(upperArm|foreArm|hand)\./.test(DEFS[c].name)) continue;
    if (allow[DEFS[c].name] === undefined) continue;
    const s = along(c);
    const wc = smooth(-DEFS[c].blend, DEFS[c].blend, s);
    if (wc > 0 && segDist(p, c, tmp) < 0.16) {
      const rest = w.get(best)!;
      w.set(best, rest * (1 - wc));
      w.set(c, (w.get(c) ?? 0) + rest * wc);
    }
  }
  const arr = [...w.entries()].sort((x, y) => y[1] - x[1]).slice(0, 4);
  const sum = arr.reduce((a, x) => a + x[1], 0) || 1;
  const idx = [0, 0, 0, 0];
  const wt = [0, 0, 0, 0];
  arr.forEach(([i, x], k) => {
    idx[k] = i;
    wt[k] = x / sum;
  });
  return [idx, wt];
}

export interface Rig {
  root: THREE.Bone;
  bones: THREE.Bone[];
  skeleton: THREE.Skeleton;
  meshes: THREE.SkinnedMesh[];
  /** dinamik snaryad (gantel va h.k.) ilinadigan suyaklar */
  hand: { L: THREE.Bone; R: THREE.Bone };
}

/**
 * Model guruhidagi har bir Mesh’ni SkinnedMesh bilan almashtiradi (geometriya va material o‘sha), vaznlarni hisoblaydi.
 * `model` — loadModel() klonidan (updateMatrixWorld qilingan); natija o‘sha guruh ichida.
 */
export function buildRig(model: THREE.Object3D): Rig {
  model.updateMatrixWorld(true);
  const inv = new THREE.Matrix4().copy(model.matrixWorld).invert();
  // suyaklar: har biri bo‘g‘imida, ota-ona bo‘yicha nisbiy
  const bones = DEFS.map((d) => {
    const b = new THREE.Bone();
    b.name = d.name;
    return b;
  });
  DEFS.forEach((d, i) => {
    const pos = v3(d.a);
    if (d.parent >= 0) {
      pos.sub(v3(DEFS[d.parent].a));
      bones[d.parent].add(bones[i]);
    }
    bones[i].position.copy(pos);
  });
  const root = bones[0];
  model.add(root);
  model.updateMatrixWorld(true);
  const skeleton = new THREE.Skeleton(bones);

  const meshes: THREE.SkinnedMesh[] = [];
  const list: THREE.Mesh[] = [];
  model.traverse((o) => {
    if ((o as THREE.Mesh).isMesh && !(o as THREE.SkinnedMesh).isSkinnedMesh) list.push(o as THREE.Mesh);
  });
  const p = new THREE.Vector3();
  const tmp = new THREE.Vector3();
  const toModel = new THREE.Matrix4();
  for (const m of list) {
    const g = m.geometry;
    if (!g.getAttribute('skinIndex')) {
      const pos = g.getAttribute('position');
      const n = pos.count;
      const si = new Uint16Array(n * 4);
      const sw = new Float32Array(n * 4);
      toModel.multiplyMatrices(inv, m.matrixWorld);
      const mname = m.name || m.parent?.name || '';
      const allow = allowed(mname);
      const armMesh = ARM_MESHES.includes(mname);
      for (let i = 0; i < n; i++) {
        p.fromBufferAttribute(pos, i).applyMatrix4(toModel);
        const [idx, wt] = weightsFor(p, allow, tmp, armMesh);
        si.set(idx, i * 4);
        sw.set(wt, i * 4);
      }
      g.setAttribute('skinIndex', new THREE.BufferAttribute(si, 4));
      g.setAttribute('skinWeight', new THREE.BufferAttribute(sw, 4));
    }
    const s = new THREE.SkinnedMesh(g, m.material);
    s.name = m.name;
    s.position.copy(m.position);
    s.quaternion.copy(m.quaternion);
    s.scale.copy(m.scale);
    s.frustumCulled = false;
    m.parent!.add(s);
    m.parent!.remove(m);
    s.updateMatrixWorld(true);
    s.bind(skeleton, s.matrixWorld.clone());
    meshes.push(s);
  }
  return { root, bones, skeleton, meshes, hand: { L: bones[IDX['hand.L']], R: bones[IDX['hand.R']] } };
}

/* ---------------- 2D animatsiyadan 3D poza ---------------- */

/** "soat" burchagi (0 — tepaga, 90 — oldinga) — 2D vektordan (y pastga) */
const clock2 = (dx: number, dy: number) => (Math.atan2(dx, -dy) * 180) / Math.PI;
/** model sagittal tekisligida (z — oldinga, y — tepaga) dam holatidagi burchak */
const REST = DEFS.map((d) => (Math.atan2(d.b[2] - d.a[2], d.b[1] - d.a[1]) * 180) / Math.PI);

/** 2D birligi → metr; 2D pol (F) → y = 0 */
const S = 0.0096;
const FOOT_LIFT = 0.017;

function worldAngles(k: SideSkeleton): Record<string, number> {
  const seg = (a: { x: number; y: number }, b: { x: number; y: number }) => clock2(b.x - a.x, b.y - a.y);
  const torso = clock2(k.torsoDir.x, k.torsoDir.y);
  const head = seg(k.neck, k.head);
  const out: Record<string, number> = { pelvis: torso, spine: torso, chest: torso, neck: (torso + head) / 2, head };
  const limb = (tag: 'L' | 'R', arm: SideSkeleton['arm'], hand: { x: number; y: number }, leg: SideSkeleton['leg'], foot: SideSkeleton['foot']) => {
    out[`upperArm.${tag}`] = seg(arm.a, arm.b);
    out[`foreArm.${tag}`] = seg(arm.b, arm.c);
    out[`hand.${tag}`] = seg(arm.c, hand);
    out[`thigh.${tag}`] = seg(leg.a, leg.b);
    out[`shin.${tag}`] = seg(leg.b, leg.c);
    out[`foot.${tag}`] = clock2(foot.fdir.x, foot.fdir.y);
  };
  limb('L', k.arm, k.hand, k.leg, k.foot);
  limb('R', k.arm2, k.hand2, k.leg2, k.foot2);
  return out;
}

export interface PoseCtx {
  /** birinchi kadrdagi 2D tos x — gorizontal markaz */
  x0: number;
  floor: number;
}
export const poseCtx = (spec: AnimSpec): PoseCtx => {
  const k = solveSide(spec.frames[0].pose as SidePose, spec.anchor);
  return { x0: k.hip.x, floor: spec.floorY ?? 214 };
};

const _q = new THREE.Quaternion();
const X = new THREE.Vector3(1, 0, 0);
const _v = new THREE.Vector3();

/** Yon ko‘rinishdagi 2D pozani skeletga qo‘llaydi; langar bo‘g‘imi 2D dagi joyiga mos keladi */
export function applySidePose(rig: Rig, model: THREE.Object3D, spec: AnimSpec, pose: SidePose, ctx: PoseCtx) {
  const k = solveSide(pose, spec.anchor);
  const W = worldAngles(k);
  DEFS.forEach((d, i) => {
    const world = (W[d.name] ?? REST[i]) - REST[i];
    const parentWorld = d.parent >= 0 ? (W[DEFS[d.parent].name] ?? REST[d.parent]) - REST[d.parent] : 0;
    rig.bones[i].quaternion.copy(_q.setFromAxisAngle(X, ((world - parentWorld) * Math.PI) / 180));
  });
  // langar: 2D dagi bo‘g‘im → 3D maqsad; 3D dagi o‘sha bo‘g‘im shu nuqtaga suriladi
  const joint = spec.anchor?.joint ?? 'ankle';
  const p2 = joint === 'ankle' ? k.leg.c : joint === 'toe' ? k.foot.toe : joint === 'knee' ? k.leg.b : joint === 'shoulder' ? k.shoulder : joint === 'wrist' ? k.arm.c : k.hip;
  const target = new THREE.Vector3(0, (ctx.floor - p2.y) * S + FOOT_LIFT, (p2.x - ctx.x0) * S);
  rig.root.position.set(...J.pelvis);
  model.updateMatrixWorld(true);
  const bi =
    joint === 'ankle' ? IDX['foot.L'] : joint === 'toe' ? -1 : joint === 'knee' ? IDX['shin.L'] : joint === 'shoulder' ? IDX['upperArm.L'] : joint === 'wrist' ? IDX['hand.L'] : IDX['thigh.L'];
  if (bi >= 0) rig.bones[bi].getWorldPosition(_v);
  else
    _v.set(J.toe[0] - J.ankle[0], J.toe[1] - J.ankle[1], J.toe[2] - J.ankle[2])
      .applyQuaternion(rig.bones[IDX['foot.L']].getWorldQuaternion(_q))
      .add(rig.bones[IDX['foot.L']].getWorldPosition(new THREE.Vector3()));
  model.worldToLocal(_v);
  target.x = _v.x;
  rig.root.position.add(target.sub(_v));
}
