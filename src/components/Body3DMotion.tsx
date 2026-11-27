// 3D mushak modeli harakatda (sinov): skelet src/lib/rig3d.ts, harakat — mashqning 2D animatsiyasidan (yon ko‘rinish).
// Ishlayotgan mushaklar lime rangda, kuch fazasida yorqinroq. Barmoq bilan aylantirish mumkin.
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { phaseFactor } from '../engine/activation';
import { sample } from '../lib/figure';
import { applySidePose, buildRig, poseCtx, type Rig } from '../lib/rig3d';
import { isM3 } from '../data/muscles3d';
import type { AnimSpec, SidePose } from '../types';
import { bodyMaterial, loadModel, PAL, type BodyAct, type Kind } from './Muscle3D';

const LIME = new THREE.Color('#d4fa50');

function dumbbell() {
  const g = new THREE.Group();
  const iron = new THREE.MeshStandardMaterial({ color: '#2a2c30', metalness: 0.6, roughness: 0.35 });
  const steel = new THREE.MeshStandardMaterial({ color: '#b9bcc2', metalness: 0.9, roughness: 0.25 });
  const bar = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.014, 0.15, 16), steel);
  bar.rotation.z = Math.PI / 2;
  g.add(bar);
  for (const s of [-1, 1]) {
    const head = new THREE.Mesh(new THREE.CylinderGeometry(0.048, 0.048, 0.06, 6), iron);
    head.rotation.z = Math.PI / 2;
    head.position.x = s * 0.105;
    g.add(head);
  }
  return g;
}

export interface Body3DMotionProps {
  spec: AnimSpec;
  acts: BodyAct[];
  held?: 'dumbbell' | null;
  /** qotirilgan vaqt (ms) — skrinshot va tekshiruv uchun; berilmasa — animatsiya o‘ynaydi */
  time?: number;
  className?: string;
  /** ms: o‘lchash uchun (sinov) — har bir kadr chizish vaqti */
  onStats?: (s: { fps: number; rigMs: number }) => void;
}

export default function Body3DMotion({ spec, acts, held = null, time, className, onStats }: Body3DMotionProps) {
  const host = useRef<HTMLDivElement>(null);
  const live = useRef({ spec, acts, held, time, ctx: poseCtx(spec) });
  live.current = { spec, acts, held, time, ctx: live.current.spec === spec ? live.current.ctx : poseCtx(spec) };
  const [state, setState] = useState<'loading' | 'ready' | 'error'>('loading');

  useEffect(() => {
    const el = host.current!;
    let disposed = false;
    let raf = 0;
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    } catch {
      setState('error');
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    el.appendChild(renderer.domElement);
    renderer.domElement.style.touchAction = 'none';

    const scene = new THREE.Scene();
    const pmrem = new THREE.PMREMGenerator(renderer);
    scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environmentIntensity = 0.55;
    scene.add(new THREE.HemisphereLight('#f1ecff', '#26120f', 0.35));
    const camera = new THREE.PerspectiveCamera(30, 1, 0.05, 30);
    const aim = new THREE.Object3D();
    aim.position.set(0, -0.1, -3.9);
    camera.add(aim);
    const light = (c: THREE.ColorRepresentation, i: number, x: number, y: number, z: number) => {
      const l = new THREE.DirectionalLight(c, i);
      l.position.set(x, y, z);
      l.target = aim;
      camera.add(l);
    };
    light('#fff0e4', 2.2, -1.6, 2.1, 1.2);
    light('#ffcfc4', 0.45, 1.8, -0.2, 1.0);
    light(LIME, 1.35, 2.4, 1.4, -6.0);
    light('#a9bdff', 1.1, -2.4, 1.6, -6.0);
    scene.add(camera);
    // yon-old ko‘rinish (modelning chap tomoni kameraga)
    camera.position.set(3.3, 1.15, 1.9);
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 0.75, 0.25);
    controls.enablePan = false;
    controls.enableDamping = true;
    controls.minDistance = 1.2;
    controls.maxDistance = 6;
    controls.update();

    const floor = new THREE.Mesh(new THREE.CircleGeometry(1.4, 64), new THREE.MeshBasicMaterial({ color: '#141416' }));
    floor.rotation.x = -Math.PI / 2;
    scene.add(floor);

    const resize = () => {
      const w = el.clientWidth;
      const h = el.clientHeight;
      renderer.setSize(w, h, false);
      renderer.domElement.style.width = '100%';
      renderer.domElement.style.height = '100%';
      camera.aspect = w / Math.max(1, h);
      camera.updateProjectionMatrix();
    };
    const ro = new ResizeObserver(resize);
    ro.observe(el);
    resize();

    let model: THREE.Object3D | null = null;
    let rig: Rig | null = null;
    const mats = new Map<string, THREE.MeshPhysicalMaterial>();
    const props: { L: THREE.Object3D; R: THREE.Object3D } = { L: dumbbell(), R: dumbbell() };

    loadModel()
      .then((m) => {
        if (disposed) return;
        const root = m.clone(true);
        root.updateMatrixWorld(true);
        root.traverse((o) => {
          const mesh = o as THREE.Mesh;
          if (!mesh.isMesh) return;
          const name = mesh.name || mesh.parent?.name || '';
          mesh.name = name;
          const kind: Kind = name === 'bones' ? 'bones' : name === 'tendon' ? 'tendon' : 'muscle';
          const mat = bodyMaterial(kind, mesh.matrixWorld.clone());
          if (name === 'other') mat.color.copy(PAL.other);
          mesh.material = mat;
          mats.set(name, mat);
        });
        const t0 = performance.now();
        rig = buildRig(root);
        const rigMs = performance.now() - t0;
        // gantel kaft ichida: qo‘l suyagining o‘qi bo‘ylab, kaft markazida
        for (const s of ['L', 'R'] as const) {
          props[s].position.set(0, -0.075, 0.025);
          rig.hand[s].add(props[s]);
        }
        scene.add(root);
        model = root;
        frame(rig, root);
        setState('ready');
        onStats?.({ fps: 0, rigMs: Math.round(rigMs) });
      })
      .catch(() => !disposed && setState('error'));

    /** kamerani harakatning butun sikliga moslash: suyaklar egallagan hajm markaziga qaraydi, hammasi kadrga sig‘adi */
    const frame = (r: Rig, root: THREE.Object3D) => {
      const L = live.current;
      const box = new THREE.Box3();
      const v = new THREE.Vector3();
      const total = L.spec.frames.reduce((a, f) => a + f.dur, 0) || 1;
      for (let k = 0; k < 16; k++) {
        applySidePose(r, root, L.spec, sample(L.spec, (k / 16) * total).pose as SidePose, L.ctx);
        root.updateMatrixWorld(true);
        for (const b of r.bones) box.expandByPoint(b.getWorldPosition(v));
      }
      box.min.y = Math.min(box.min.y, 0);
      const c = box.getCenter(new THREE.Vector3());
      const size = box.getSize(new THREE.Vector3());
      const dir = camera.position.clone().sub(controls.target).normalize();
      const t = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
      const dist = Math.max((size.y / 2 + 0.12) / t, (size.z / 2 + 0.15) / (t * Math.max(0.3, camera.aspect))) * 1.05;
      controls.target.set(0, c.y, c.z);
      camera.position.copy(controls.target).addScaledVector(dir, Math.min(controls.maxDistance, Math.max(controls.minDistance, dist)));
      controls.update();
    };

    const start = performance.now();
    let frames = 0;
    let fpsT = start;
    const loop = () => {
      raf = requestAnimationFrame(loop);
      const L = live.current;
      controls.update();
      if (model && rig) {
        const s = sample(L.spec, L.time ?? performance.now() - start);
        applySidePose(rig, model, L.spec, s.pose as SidePose, L.ctx);
        props.L.visible = props.R.visible = L.held === 'dumbbell';
        const level = phaseFactor(s.phase, false);
        const byKey = new Map(L.acts.map((a) => [a.key, a]));
        for (const [name, mat] of mats) {
          const u = mat.userData.u as { uGlow: { value: number }; uDim: { value: number } };
          if (!isM3(name)) {
            u.uGlow.value = 0;
            u.uDim.value = name === 'other' ? 0.25 : 0;
            continue;
          }
          const a = byKey.get(name);
          const strength = a ? Math.min(1.15, a.mvic / 100) : 0;
          u.uGlow.value = a ? (0.34 + 0.66 * strength) * (0.5 + 0.5 * level) : 0;
          u.uDim.value = a ? 0 : 0.3;
        }
      }
      renderer.render(scene, camera);
      frames++;
      const now = performance.now();
      if (now - fpsT > 2000) {
        onStats?.({ fps: Math.round((frames * 1000) / (now - fpsT)), rigMs: -1 });
        frames = 0;
        fpsT = now;
      }
    };
    loop();
    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      ro.disconnect();
      controls.dispose();
      mats.forEach((m) => m.dispose());
      renderer.dispose();
      renderer.domElement.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div ref={host} className={className} style={{ position: 'relative', width: '100%', height: '100%' }} aria-label="3D mushak modeli harakatda">
      {state !== 'ready' && (
        <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', color: 'var(--text-2)' }}>{state === 'error' ? '3D ko‘rinish ishlamadi' : 'Yuklanmoqda…'}</div>
      )}
    </div>
  );
}
