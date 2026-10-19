// 3D mushak ko'rinishi (three.js). Anatomik model: Z-Anatomy (BodyParts3D asosida), CC BY-SA 4.0.
// Har mushak EMG faolligiga (% MVIC) qarab bo'yaladi va takror fazasiga qarab "yonadi":
// ko'tarishda (konsentrik) kuchli, tushirishda (ekssentrik) sustroq. Barmoq bilan aylantirish, ikki barmoq bilan yaqinlashtirish,
// mushakka bosilsa — nomi va foizi.
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { isM3, M3_INFO, type M3 } from '../data/muscles3d';
import { heatColor, phaseFactor, type MuscleAct } from '../engine/activation';
import type { AnimSpec, Phase } from '../types';

const MODEL_URL = `${import.meta.env.BASE_URL}models/muscles.glb`;
let modelPromise: Promise<THREE.Group> | null = null;
function loadModel(): Promise<THREE.Group> {
  modelPromise ??= new GLTFLoader()
    .setMeshoptDecoder(MeshoptDecoder)
    .loadAsync(MODEL_URL)
    .then((g) => g.scene)
    .catch((e) => {
      modelPromise = null;
      throw e;
    });
  return modelPromise;
}

export type View3D = 'front' | 'back' | 'side';
const TARGET = new THREE.Vector3(0, 1.0, 0);
const VIEW_POS: Record<View3D, THREE.Vector3> = {
  front: new THREE.Vector3(0, 1.05, 3.6),
  back: new THREE.Vector3(0, 1.05, -3.6),
  side: new THREE.Vector3(3.6, 1.05, 0.15),
};

const BASE = {
  muscle: new THREE.Color('#6e3431'),
  other: new THREE.Color('#5a2f2c'),
  bones: new THREE.Color('#ddd5c6'),
  tendon: new THREE.Color('#cfc7b8'),
};

/** Animatsiya kadrlaridan vaqt bo'yicha faza */
function phaseTimeline(anim: AnimSpec) {
  const segs: { phase: Phase; end: number }[] = [];
  let t = 0;
  for (const f of anim.frames) {
    t += f.dur;
    segs.push({ phase: f.phase, end: t });
  }
  const total = t || 1;
  const isometric = !anim.frames.some((f) => f.phase === 'up' || f.phase === 'down');
  return {
    isometric,
    at(ms: number): Phase {
      const x = ms % total;
      return (segs.find((s) => x < s.end) ?? segs[segs.length - 1]).phase;
    },
  };
}

interface Props {
  acts: MuscleAct[];
  anim: AnimSpec;
  selected: M3 | null;
  onSelect: (k: M3 | null) => void;
  view: View3D;
  playing: boolean;
  onPhase?: (p: Phase) => void;
}

export default function Muscle3D({ acts, anim, selected, onSelect, view, playing, onPhase }: Props) {
  const host = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<'loading' | 'ready' | 'error'>('loading');
  // o'zgaruvchan qiymatlar render siklida o'qiladi (qayta montaj qilmasdan)
  const live = useRef({ acts, selected, playing, view, onSelect, onPhase, timeline: phaseTimeline(anim) });
  live.current.acts = acts;
  live.current.selected = selected;
  live.current.playing = playing;
  live.current.onSelect = onSelect;
  live.current.onPhase = onPhase;
  live.current.timeline = phaseTimeline(anim);
  const api = useRef<{ goTo: (v: View3D) => void } | null>(null);

  useEffect(() => {
    const el = host.current;
    if (!el) return;
    let disposed = false;
    let raf = 0;
    let visible = true;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    } catch {
      setState('error');
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    el.appendChild(renderer.domElement);
    renderer.domElement.style.touchAction = 'none';

    const scene = new THREE.Scene();
    const pmrem = new THREE.PMREMGenerator(renderer);
    const envTex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = envTex;
    scene.add(new THREE.HemisphereLight('#e6ecff', '#1b1e25', 0.55));
    const key = new THREE.DirectionalLight('#fff4e8', 1.6);
    key.position.set(-1.6, 3.2, 2.6);
    scene.add(key);
    const rim = new THREE.DirectionalLight('#8fb0ff', 1.1);
    rim.position.set(2.2, 1.8, -3);
    scene.add(rim);

    const camera = new THREE.PerspectiveCamera(30, 1, 0.05, 30);
    camera.position.copy(VIEW_POS[live.current.view]);
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.copy(TARGET);
    controls.enablePan = false;
    controls.enableDamping = true;
    controls.dampingFactor = 0.09;
    controls.minDistance = 0.9;
    controls.maxDistance = 5.5;
    controls.minPolarAngle = 0.25;
    controls.maxPolarAngle = Math.PI - 0.25;
    controls.rotateSpeed = 0.8;
    controls.update();

    // kamerani tana atrofida aylanib ko'chirish (eng qisqa yo'l, vaqtga bog'liq — sekin qurilmada ham 0.7 s)
    let fly: { r: number; a0: number; a1: number; p0: number; p1: number; start: number } | null = null;
    const sph = new THREE.Spherical();
    api.current = {
      goTo(v) {
        const cur = new THREE.Spherical().setFromVector3(camera.position.clone().sub(controls.target));
        const goal = new THREE.Spherical().setFromVector3(VIEW_POS[v].clone().sub(TARGET));
        let d = goal.theta - cur.theta;
        d = ((((d + Math.PI) % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI)) - Math.PI;
        fly = { r: cur.radius, a0: cur.theta, a1: cur.theta + d, p0: cur.phi, p1: goal.phi, start: performance.now() };
      },
    };

    const mats = new Map<string, THREE.MeshStandardMaterial>();
    const meshes: THREE.Mesh[] = [];
    let root: THREE.Object3D | null = null;

    const resize = () => {
      const w = el.clientWidth;
      const h = el.clientHeight;
      if (!w || !h) return;
      renderer.setSize(w, h, false);
      renderer.domElement.style.width = `${w}px`;
      renderer.domElement.style.height = `${h}px`;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    const ro = new ResizeObserver(resize);
    ro.observe(el);
    resize();

    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(el);

    // bosish — mushakni tanlash (sudrashdan farqlash)
    const ray = new THREE.Raycaster();
    let down: { x: number; y: number } | null = null;
    const onDown = (e: PointerEvent) => (down = { x: e.clientX, y: e.clientY });
    const onUp = (e: PointerEvent) => {
      if (!down || Math.hypot(e.clientX - down.x, e.clientY - down.y) > 6) return;
      down = null;
      const r = renderer.domElement.getBoundingClientRect();
      ray.setFromCamera(new THREE.Vector2(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1), camera);
      const hit = ray.intersectObjects(meshes, false)[0];
      const name = hit?.object.name;
      live.current.onSelect(name && isM3(name) ? name : null);
    };
    renderer.domElement.addEventListener('pointerdown', onDown);
    renderer.domElement.addEventListener('pointerup', onUp);

    loadModel()
      .then((model) => {
        if (disposed) return;
        root = model.clone(true);
        root.traverse((o) => {
          const m = o as THREE.Mesh;
          if (!m.isMesh) return;
          const name = m.name || m.parent?.name || '';
          m.name = name;
          const base = name === 'bones' ? BASE.bones : name === 'tendon' ? BASE.tendon : name === 'other' ? BASE.other : BASE.muscle;
          const mat = new THREE.MeshStandardMaterial({
            color: base.clone(),
            roughness: name === 'bones' ? 0.75 : 0.5,
            metalness: 0,
            envMapIntensity: name === 'bones' || name === 'tendon' ? 0.5 : 0.9,
            emissive: new THREE.Color('#000000'),
          });
          m.material = mat;
          mats.set(name, mat);
          meshes.push(m);
        });
        scene.add(root);
        setState('ready');
      })
      .catch(() => !disposed && setState('error'));

    const tmp = new THREE.Color();
    let lastPhase: Phase | null = null;
    let isolated: M3 | null | undefined;
    // tanlangan mushakni ajratish: qolganlari yarim shaffof (chuqur mushaklar — masalan umurtqa rostlovchilar — ko'rinsin)
    const isolate = (k: M3 | null) => {
      isolated = k;
      for (const [name, mat] of mats) {
        const ghost = !!k && name !== k;
        mat.transparent = ghost;
        mat.opacity = ghost ? (name === 'bones' ? 0.32 : 0.16) : 1;
        mat.depthWrite = !ghost;
        mat.needsUpdate = true;
      }
      for (const m of meshes) m.renderOrder = k && m.name === k ? 1 : 0;
    };
    let level = 0.6; // silliq faza darajasi
    const t0 = performance.now();
    let paused = 0;
    let pausedAt = 0;

    const loop = () => {
      raf = requestAnimationFrame(loop);
      if (!visible || document.hidden) return;
      const L = live.current;
      const now = performance.now();
      if (!L.playing && !pausedAt) pausedAt = now;
      if (L.playing && pausedAt) {
        paused += now - pausedAt;
        pausedAt = 0;
      }
      const t = (pausedAt || now) - t0 - paused;
      const phase = L.timeline.at(t);
      if (phase !== lastPhase) {
        lastPhase = phase;
        L.onPhase?.(phase);
      }
      const goal = reduced ? 1 : phaseFactor(phase, L.timeline.isometric);
      level += (goal - level) * 0.08;

      if (fly) {
        const k = reduced ? 1 : Math.min(1, (now - fly.start) / 700);
        const e = 1 - Math.pow(1 - k, 3);
        sph.set(fly.r, fly.p0 + (fly.p1 - fly.p0) * e, fly.a0 + (fly.a1 - fly.a0) * e);
        camera.position.setFromSpherical(sph).add(controls.target);
        if (k >= 1) fly = null;
      }
      controls.update();

      if (mats.size && isolated !== L.selected) isolate(L.selected);
      const byKey = new Map(L.acts.map((a) => [a.key, a]));
      for (const [name, mat] of mats) {
        if (!isM3(name)) continue;
        const a = byKey.get(name);
        const isSel = L.selected === name;
        if (a) {
          tmp.set(heatColor(a.mvic));
          const strength = Math.min(1.15, a.mvic / 100);
          // asos rangi: faollikka qarab yorqinroq; emissiya — fazaga qarab "nafas"
          mat.color.copy(BASE.muscle).lerp(tmp, 0.35 + 0.6 * Math.min(1, strength));
          mat.emissive.copy(tmp).multiplyScalar((0.12 + 0.55 * strength) * level);
        } else {
          mat.color.copy(BASE.muscle);
          mat.emissive.setRGB(0, 0, 0);
        }
        if (isSel) {
          // tanlangan mushak: o'z rangida yorqinroq "yonadi" (oq bilan yuvilib ketmaydi)
          if (!a) mat.emissive.set('#5f6b80');
          mat.emissive.multiplyScalar(1.12 + 0.3 * Math.sin(t / 180));
          mat.color.multiplyScalar(1.1);
        } else if (L.selected) mat.color.multiplyScalar(0.45);
      }
      const other = mats.get('other');
      if (other) other.color.copy(BASE.other).multiplyScalar(L.selected ? 0.55 : 1);
      renderer.render(scene, camera);
    };
    loop();

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      renderer.domElement.removeEventListener('pointerdown', onDown);
      renderer.domElement.removeEventListener('pointerup', onUp);
      controls.dispose();
      mats.forEach((m) => m.dispose());
      envTex.dispose();
      pmrem.dispose();
      renderer.dispose();
      renderer.domElement.remove();
      api.current = null;
    };
  }, []);

  // ko'rinish tugmalari
  useEffect(() => {
    if (state === 'ready') api.current?.goTo(view);
  }, [view, state]);

  return (
    <div ref={host} className="m3d-host" role="img" aria-label={`3D anatomik model: ${acts.slice(0, 3).map((a) => `${M3_INFO[a.key].name} ${Math.round(a.mvic)}%`).join(', ')}`}>
      {state === 'loading' && (
        <div className="m3d-overlay">
          <span className="spinner" aria-hidden="true" />
          <span className="small muted">3D model yuklanmoqda (1.7 MB)…</span>
        </div>
      )}
      {state === 'error' && (
        <div className="m3d-overlay">
          <span className="small muted">3D ko‘rinish bu qurilmada ochilmadi (WebGL yoki internet). Pastdagi ro‘yxat to‘liq ishlaydi.</span>
        </div>
      )}
    </div>
  );
}
