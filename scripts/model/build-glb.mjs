// Blender'dan chiqqan xom massivlar -> siqilgan GLB (Y-up, metr, markazlashtirilgan, meshopt + kvantlash)
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { Document, NodeIO } from '@gltf-transform/core';
import { EXTMeshoptCompression, KHRMeshQuantization } from '@gltf-transform/extensions';
import { meshopt, quantize, reorder, dedup, prune } from '@gltf-transform/functions';
import { MeshoptEncoder } from 'meshoptimizer';

const [dir, out] = process.argv.slice(2);
const man = JSON.parse(readFileSync(join(dir, 'manifest.json'), 'utf8'));
const doc = new Document();
const buf = doc.createBuffer();
const scene = doc.createScene('body');

// umumiy chegaralar: Blender Z-up -> glTF Y-up (x, z, -y), oyoq tagi y=0, markaz x/z = 0
const raw = {};
let min = [Infinity, Infinity, Infinity], max = [-Infinity, -Infinity, -Infinity];
for (const key of Object.keys(man.groups)) {
  const p = new Float32Array(readFileSync(join(dir, key + '.pos')).buffer.slice(0));
  const q = new Float32Array(p.length);
  for (let i = 0; i < p.length; i += 3) {
    q[i] = p[i];
    q[i + 1] = p[i + 2];
    q[i + 2] = -p[i + 1];
    for (let k = 0; k < 3; k++) {
      min[k] = Math.min(min[k], q[i + k]);
      max[k] = Math.max(max[k], q[i + k]);
    }
  }
  raw[key] = { pos: q, idx: new Uint32Array(readFileSync(join(dir, key + '.idx')).buffer.slice(0)) };
}
const height = max[1] - min[1];
const s = 1.75 / height; // metrga (bo'y ~1.75 m)
const cx = (min[0] + max[0]) / 2, cz = (min[2] + max[2]) / 2;
console.log('raw bounds', min, max, 'height', height, 'scale', s);

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
  const box = new Map(); // `${side}:${bin}` -> [xmin, xmax]
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

for (const [key, { pos, idx }] of Object.entries(raw)) {
  // degenerat uchburchaklarni olib tashlash
  const keep = [];
  for (let t = 0; t < idx.length; t += 3) {
    const a = idx[t], b = idx[t + 1], c = idx[t + 2];
    if (a !== b && b !== c && a !== c) keep.push(a, b, c);
  }
  // silliq normallar: uchburchak yuzasi bo'yicha vaznlangan
  const nrm = new Float32Array(pos.length);
  for (let t = 0; t < keep.length; t += 3) {
    const a = keep[t] * 3, b = keep[t + 1] * 3, c = keep[t + 2] * 3;
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
  const prim = doc
    .createPrimitive()
    .setAttribute('POSITION', doc.createAccessor().setType('VEC3').setArray(pos).setBuffer(buf))
    .setAttribute('NORMAL', doc.createAccessor().setType('VEC3').setArray(nrm).setBuffer(buf))
    .setIndices(doc.createAccessor().setType('SCALAR').setArray(new Uint32Array(keep)).setBuffer(buf));
  const mesh = doc.createMesh(key).addPrimitive(prim);
  scene.addChild(doc.createNode(key).setMesh(mesh));
}

await MeshoptEncoder.ready;
doc.createExtension(EXTMeshoptCompression).setRequired(true).setEncoderOptions({ method: EXTMeshoptCompression.EncoderMethod.QUANTIZE });
await doc.transform(
  dedup(),
  prune(),
  reorder({ encoder: MeshoptEncoder }),
  quantize({ quantizePosition: 14, quantizeNormal: 8 }),
  meshopt({ encoder: MeshoptEncoder, level: 'high' }),
);
const io = new NodeIO().registerExtensions([EXTMeshoptCompression, KHRMeshQuantization]).registerDependencies({ 'meshopt.encoder': MeshoptEncoder });
await io.write(out, doc);
let tris = 0;
for (const m of doc.getRoot().listMeshes()) for (const p of m.listPrimitives()) tris += (p.getIndices()?.getCount() ?? 0) / 3;
console.log('written', out, 'meshes', doc.getRoot().listMeshes().length, 'tris', tris);
