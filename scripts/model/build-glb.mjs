// Blender'dan chiqqan xom massivlar -> siqilgan GLB (Y-up, metr, markazlashtirilgan, meshopt + kvantlash).
// v2: siyrak (past poligonli) mushaklar Loop usulida bir marta bo'linib silliqlanadi, so'ng meshopt bilan
// o'rtacha zichlikka qaytariladi; har uchga _FIBAO = (tola yo'nalishi xyz, atrof soyasi) int8 yoziladi.
// Atrof soyasi (ambient occlusion) butun tana bo'yicha nurlar bilan hisoblanadi — mushaklar orasidagi chuqurliklar.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { Document, NodeIO } from '@gltf-transform/core';
import { EXTMeshoptCompression, KHRMeshQuantization } from '@gltf-transform/extensions';
import { meshopt, quantize, reorder, dedup, prune } from '@gltf-transform/functions';
import { MeshoptEncoder, MeshoptSimplifier } from 'meshoptimizer';
import * as THREE from 'three';
import { MeshBVH } from 'three-mesh-bvh';

const [dir, out] = process.argv.slice(2);
const man = JSON.parse(readFileSync(join(dir, 'manifest.json'), 'utf8'));
await MeshoptSimplifier.ready;

/** kalit bo'yicha zichlik: silliqlanadigan siyrak mushaklar va qisqartiriladigan yashirin/og'ir qismlar */
const SUBDIV_BELOW = 10000;
const CAP = { erectors: 18000, serratus: 20000, externalOblique: 22000, bones: 45000 };
const NOT_MUSCLE = new Set(['other', 'bones', 'tendon']);

// Blender Z-up -> glTF Y-up (x, z, -y)
const zup = (p) => {
  const q = new Float32Array(p.length);
  for (let i = 0; i < p.length; i += 3) {
    q[i] = p[i];
    q[i + 1] = p[i + 2];
    q[i + 2] = -p[i + 1];
  }
  return q;
};
const f32 = (f) => new Float32Array(readFileSync(f).buffer.slice(0));

const raw = {};
let min = [Infinity, Infinity, Infinity], max = [-Infinity, -Infinity, -Infinity];
for (const key of Object.keys(man.groups)) {
  const pos = zup(f32(join(dir, key + '.pos')));
  for (let i = 0; i < pos.length; i += 3)
    for (let k = 0; k < 3; k++) {
      min[k] = Math.min(min[k], pos[i + k]);
      max[k] = Math.max(max[k], pos[i + k]);
    }
  raw[key] = { pos, fib: zup(f32(join(dir, key + '.fib'))), idx: new Uint32Array(readFileSync(join(dir, key + '.idx')).buffer.slice(0)) };
}
const s = 1.75 / (max[1] - min[1]); // metrga (bo'y ~1.75 m)
const cx = (min[0] + max[0]) / 2, cz = (min[2] + max[2]) / 2;
for (const { pos } of Object.values(raw))
  for (let i = 0; i < pos.length; i += 3) {
    pos[i] = (pos[i] - cx) * s;
    pos[i + 1] = (pos[i + 1] - min[1]) * s;
    pos[i + 2] = (pos[i + 2] - cz) * s;
  }

// Qiyshiq mushak aponevrozi to'g'ri qorin mushagini to'liq yopib turadi (qin oldingi varag'i):
// to'g'ri mushak ko'rinishi uchun uning ustidagi aponevroz uchburchaklarini olib tashlaymiz.
{
  const BIN = 0.01;
  const ra = raw.rectusAbdominis.pos;
  const box = new Map();
  for (let i = 0; i < ra.length; i += 3) {
    const k = `${ra[i] < 0 ? 'L' : 'R'}:${Math.floor(ra[i + 1] / BIN)}`;
    const b = box.get(k) ?? [Infinity, -Infinity];
    b[0] = Math.min(b[0], ra[i]);
    b[1] = Math.max(b[1], ra[i]);
    box.set(k, b);
  }
  const eo = raw.externalOblique;
  const keep = [];
  let cut = 0;
  for (let t = 0; t < eo.idx.length; t += 3) {
    const a = eo.idx[t] * 3, b = eo.idx[t + 1] * 3, c = eo.idx[t + 2] * 3;
    const x = (eo.pos[a] + eo.pos[b] + eo.pos[c]) / 3, y = (eo.pos[a + 1] + eo.pos[b + 1] + eo.pos[c + 1]) / 3;
    const bx = box.get(`${x < 0 ? 'L' : 'R'}:${Math.floor(y / BIN)}`);
    if (bx && x >= bx[0] - 0.004 && x <= bx[1] + 0.004) {
      cut++;
      continue;
    }
    keep.push(eo.idx[t], eo.idx[t + 1], eo.idx[t + 2]);
  }
  eo.idx = new Uint32Array(keep);
  console.log('oblique aponeurosis triangles removed over rectus:', cut);
}

const dropDegenerate = (idx) => {
  const keep = [];
  for (let t = 0; t < idx.length; t += 3) {
    const a = idx[t], b = idx[t + 1], c = idx[t + 2];
    if (a !== b && b !== c && a !== c) keep.push(a, b, c);
  }
  return new Uint32Array(keep);
};

/** Loop bo'linishi (bir qadam): har uchburchak 4 ga, uchlar silliqlanadi. Chegara/manifold bo'lmagan qirralar — o'rta nuqta. */
function loopSubdivide({ pos, fib, idx }) {
  const nV = pos.length / 3;
  const edges = new Map(); // a*nV+b (a<b) -> { u, v, opp: [] , id }
  const ek = (a, b) => (a < b ? a * nV + b : b * nV + a);
  for (let t = 0; t < idx.length; t += 3)
    for (let k = 0; k < 3; k++) {
      const u = idx[t + k], v = idx[t + ((k + 1) % 3)], w = idx[t + ((k + 2) % 3)];
      const key = ek(u, v);
      let e = edges.get(key);
      if (!e) edges.set(key, (e = { u, v, opp: [], id: -1 }));
      e.opp.push(w);
    }
  const nE = edges.size;
  const P = new Float32Array((nV + nE) * 3);
  const F = new Float32Array((nV + nE) * 3);
  // eski uchlar: qo'shnilar bo'yicha silliqlash
  const nb = Array.from({ length: nV }, () => []);
  const crease = Array.from({ length: nV }, () => []);
  for (const e of edges.values()) {
    nb[e.u].push(e.v);
    nb[e.v].push(e.u);
    if (e.opp.length !== 2) {
      crease[e.u].push(e.v);
      crease[e.v].push(e.u);
    }
  }
  for (let i = 0; i < nV; i++) {
    for (let k = 0; k < 3; k++) F[i * 3 + k] = fib[i * 3 + k];
    const cr = crease[i];
    if (cr.length === 0 && nb[i].length >= 3) {
      const n = nb[i].length;
      const beta = n === 3 ? 3 / 16 : 3 / (8 * n);
      for (let k = 0; k < 3; k++) {
        let sum = 0;
        for (const j of nb[i]) sum += pos[j * 3 + k];
        P[i * 3 + k] = (1 - n * beta) * pos[i * 3 + k] + beta * sum;
      }
    } else if (cr.length === 2) {
      for (let k = 0; k < 3; k++) P[i * 3 + k] = 0.75 * pos[i * 3 + k] + 0.125 * (pos[cr[0] * 3 + k] + pos[cr[1] * 3 + k]);
    } else for (let k = 0; k < 3; k++) P[i * 3 + k] = pos[i * 3 + k];
  }
  let id = nV;
  for (const e of edges.values()) {
    e.id = id++;
    for (let k = 0; k < 3; k++) {
      const a = pos[e.u * 3 + k], b = pos[e.v * 3 + k];
      P[e.id * 3 + k] = e.opp.length === 2 ? 0.375 * (a + b) + 0.125 * (pos[e.opp[0] * 3 + k] + pos[e.opp[1] * 3 + k]) : 0.5 * (a + b);
      F[e.id * 3 + k] = fib[e.u * 3 + k];
    }
  }
  const I = new Uint32Array(idx.length * 4);
  let o = 0;
  for (let t = 0; t < idx.length; t += 3) {
    const a = idx[t], b = idx[t + 1], c = idx[t + 2];
    const ab = edges.get(ek(a, b)).id, bc = edges.get(ek(b, c)).id, ca = edges.get(ek(c, a)).id;
    I.set([a, ab, ca, b, bc, ab, c, ca, bc, ab, bc, ca], o);
    o += 12;
  }
  return { pos: P, fib: F, idx: I };
}

/** meshopt bilan qisqartirish va ishlatilmagan uchlarni tashlash */
function simplify(g, targetTris) {
  if (g.idx.length / 3 <= targetTris) return g;
  const [ni] = MeshoptSimplifier.simplify(g.idx, g.pos, 3, Math.floor(targetTris) * 3, 0.01, []);
  const remap = new Int32Array(g.pos.length / 3).fill(-1);
  let n = 0;
  for (const v of ni) if (remap[v] < 0) remap[v] = n++;
  const P = new Float32Array(n * 3), F = new Float32Array(n * 3);
  for (let v = 0; v < remap.length; v++)
    if (remap[v] >= 0)
      for (let k = 0; k < 3; k++) {
        P[remap[v] * 3 + k] = g.pos[v * 3 + k];
        F[remap[v] * 3 + k] = g.fib[v * 3 + k];
      }
  return { pos: P, fib: F, idx: Uint32Array.from(ni, (v) => remap[v]) };
}

function smoothNormals({ pos, idx }) {
  const nrm = new Float32Array(pos.length);
  for (let t = 0; t < idx.length; t += 3) {
    const a = idx[t] * 3, b = idx[t + 1] * 3, c = idx[t + 2] * 3;
    const ux = pos[b] - pos[a], uy = pos[b + 1] - pos[a + 1], uz = pos[b + 2] - pos[a + 2];
    const vx = pos[c] - pos[a], vy = pos[c + 1] - pos[a + 1], vz = pos[c + 2] - pos[a + 2];
    const nx = uy * vz - uz * vy, ny = uz * vx - ux * vz, nz = ux * vy - uy * vx;
    for (const v of [a, b, c]) {
      nrm[v] += nx;
      nrm[v + 1] += ny;
      nrm[v + 2] += nz;
    }
  }
  for (let i = 0; i < nrm.length; i += 3) {
    const l = Math.hypot(nrm[i], nrm[i + 1], nrm[i + 2]) || 1;
    nrm[i] /= l;
    nrm[i + 1] /= l;
    nrm[i + 2] /= l;
  }
  return nrm;
}

const geo = {};
for (const [key, g] of Object.entries(raw)) {
  let cur = { ...g, idx: dropDegenerate(g.idx) };
  const tris = cur.idx.length / 3;
  if (!NOT_MUSCLE.has(key) && tris < SUBDIV_BELOW) {
    cur = loopSubdivide(cur);
    cur = simplify(cur, Math.max(tris * 2.2, Math.min(tris * 4, 12000)));
  }
  if (CAP[key]) cur = simplify(cur, CAP[key]);
  cur.nrm = smoothNormals(cur);
  geo[key] = cur;
}

// --- Atrof soyasi: har uchdan normal yarim sferasi bo'ylab nurlar, 5 sm gacha to'siq ulushi ---
const RAYS = 28, FAR = 0.05, NEAR = 0.0008;
{
  const keys = Object.keys(geo);
  let total = 0;
  for (const k of keys) total += geo[k].pos.length / 3;
  const allP = new Float32Array(total * 3);
  const allI = [];
  let off = 0;
  for (const k of keys) {
    allP.set(geo[k].pos, off * 3);
    for (const v of geo[k].idx) allI.push(v + off);
    off += geo[k].pos.length / 3;
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(allP, 3));
  g.setIndex(new THREE.BufferAttribute(new Uint32Array(allI), 1));
  const bvh = new MeshBVH(g);
  // kosinus bo'yicha taqsimlangan yo'nalishlar (Fibonacci spirali), uch bo'yicha tasodifiy burish — chiziqlar bo'lmasin
  const dirs = [];
  for (let i = 0; i < RAYS; i++) {
    const u = (i + 0.5) / RAYS, phi = i * 2.399963;
    const r = Math.sqrt(u);
    dirs.push([r * Math.cos(phi), r * Math.sin(phi), Math.sqrt(1 - u)]);
  }
  const ray = new THREE.Ray();
  const n = new THREE.Vector3(), t1 = new THREE.Vector3(), t2 = new THREE.Vector3(), d = new THREE.Vector3();
  let done = 0;
  const t0 = Date.now();
  for (const k of keys) {
    const { pos, nrm } = geo[k];
    const ao = new Float32Array(pos.length / 3);
    for (let v = 0; v < ao.length; v++) {
      n.set(nrm[v * 3], nrm[v * 3 + 1], nrm[v * 3 + 2]);
      t1.set(Math.abs(n.x) < 0.9 ? 1 : 0, Math.abs(n.x) < 0.9 ? 0 : 1, 0).cross(n).normalize();
      t2.crossVectors(n, t1);
      const rot = (v * 0.618034) % 1 * Math.PI * 2, cr = Math.cos(rot), sr = Math.sin(rot);
      let occ = 0;
      for (const [x0, y0, z] of dirs) {
        const x = x0 * cr - y0 * sr, y = x0 * sr + y0 * cr;
        d.set(t1.x * x + t2.x * y + n.x * z, t1.y * x + t2.y * y + n.y * z, t1.z * x + t2.z * y + n.z * z);
        ray.origin.set(pos[v * 3] + n.x * NEAR, pos[v * 3 + 1] + n.y * NEAR, pos[v * 3 + 2] + n.z * NEAR);
        ray.direction.copy(d);
        const hit = bvh.raycastFirst(ray, THREE.DoubleSide, 0, FAR);
        if (hit) occ += 1 - hit.distance / FAR;
      }
      ao[v] = Math.max(0, 1 - (occ / RAYS) * 1.35);
    }
    geo[k].ao = ao;
    done += ao.length;
    process.stdout.write(`\rAO ${done}/${total} (${((Date.now() - t0) / 1000).toFixed(0)} s)   `);
  }
  console.log();
}

const doc = new Document();
const buf = doc.createBuffer();
const scene = doc.createScene('body');
let tris = 0;
for (const [key, g] of Object.entries(geo)) {
  const nv = g.pos.length / 3;
  // tola (xyz) va soya (w) — bitta normallashgan int8 VEC4
  const fa = new Int8Array(nv * 4);
  for (let v = 0; v < nv; v++) {
    const fx = g.fib[v * 3], fy = g.fib[v * 3 + 1], fz = g.fib[v * 3 + 2];
    const l = Math.hypot(fx, fy, fz) || 1;
    fa[v * 4] = Math.round((fx / l) * 127);
    fa[v * 4 + 1] = Math.round((fy / l) * 127);
    fa[v * 4 + 2] = Math.round((fz / l) * 127);
    fa[v * 4 + 3] = Math.round(g.ao[v] * 127);
  }
  const prim = doc
    .createPrimitive()
    .setAttribute('POSITION', doc.createAccessor().setType('VEC3').setArray(g.pos).setBuffer(buf))
    .setAttribute('NORMAL', doc.createAccessor().setType('VEC3').setArray(g.nrm).setBuffer(buf))
    .setAttribute('_FIBAO', doc.createAccessor().setType('VEC4').setArray(fa).setNormalized(true).setBuffer(buf))
    .setIndices(doc.createAccessor().setType('SCALAR').setArray(g.idx).setBuffer(buf));
  tris += g.idx.length / 3;
  scene.addChild(doc.createNode(key).setMesh(doc.createMesh(key).addPrimitive(prim)));
}

await MeshoptEncoder.ready;
doc.createExtension(EXTMeshoptCompression).setRequired(true).setEncoderOptions({ method: EXTMeshoptCompression.EncoderMethod.QUANTIZE });
await doc.transform(dedup(), prune(), reorder({ encoder: MeshoptEncoder }), quantize({ quantizePosition: 14, quantizeNormal: 8 }), meshopt({ encoder: MeshoptEncoder, level: 'high' }));
const io = new NodeIO().registerExtensions([EXTMeshoptCompression, KHRMeshQuantization]).registerDependencies({ 'meshopt.encoder': MeshoptEncoder });
await io.write(out, doc);
console.log('written', out, 'meshes', doc.getRoot().listMeshes().length, 'tris', tris);
