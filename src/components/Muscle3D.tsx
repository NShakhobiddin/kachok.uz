// 3D mushak ko'rinishi (three.js). Anatomik model: Z-Anatomy (BodyParts3D asosida), CC BY-SA 4.0.
// Realistik ko'rinish: mushak tolalari chiziqlari (har qismning tola yo'nalishi bo'yicha, ikki o'lchamda),
// oldindan hisoblangan atrof soyasi (mushaklar orasidagi chuqurliklar), nam yaltiroqlik (clearcoat) va baxmal (sheen).
// Ishlayotgan mushaklar lime rangda chetidan "yonadi"; takror fazasiga qarab: ko'tarishda kuchli, tushirishda sustroq.
// Rejimlar: 'orbit' — barmoq bilan aylantirish va yaqinlashtirish; 'turntable' — o'zi sekin aylanadi,
// gorizontal surish bilan buriladi, sahifa vertikal aylantirilishi to'silmaydi (bosh sahifa uchun).
import { useEffect, useRef, useState, type ReactNode } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { isM3, M3_INFO, type M3 } from '../data/muscles3d';
import { phaseFactor } from '../engine/activation';
import type { AnimSpec, Phase } from '../types';

const MODEL_URL = `${import.meta.env.BASE_URL}models/muscles-v2.glb`;
let modelPromise: Promise<THREE.Group> | null = null;
export function loadModel(): Promise<THREE.Group> {
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
/** modelni oldindan yuklab qo'yish (masalan, bosh sahifa ochilganda) */
export const preloadBody = () => loadModel().catch(() => {});

export type View3D = 'front' | 'back' | 'side';
export type Mode3D = 'orbit' | 'turntable';
const TARGET = new THREE.Vector3(0, 0.9, 0);
const VIEW_POS: Record<View3D, THREE.Vector3> = {
  front: new THREE.Vector3(0, 1.0, 3.95),
  back: new THREE.Vector3(0, 1.0, -3.95),
  side: new THREE.Vector3(3.95, 1.0, 0.15),
};
const VIEW_ANGLE: Record<View3D, number> = { front: 0, side: -Math.PI / 2, back: Math.PI };

const LIME = new THREE.Color('#d4fa50');
export const PAL = {
  muscle: new THREE.Color('#a3322c'),
  other: new THREE.Color('#93302b'),
  tendon: new THREE.Color('#d9cfbf'),
  bones: new THREE.Color('#cbbfa9'),
};

export type Kind = 'muscle' | 'tendon' | 'bones';
interface Uniforms {
  uGlow: { value: number };
  uDim: { value: number };
  uFiber: { value: number };
  uLime: { value: THREE.Color };
  uLocal: { value: THREE.Matrix4 };
}

/** Fizik material + tola chiziqlari, atrof soyasi va chekka nur (shader qo'shimchalari) */
export function bodyMaterial(kind: Kind, local: THREE.Matrix4) {
  const m = new THREE.MeshPhysicalMaterial({
    color: kind === 'muscle' ? PAL.muscle.clone() : PAL[kind].clone(),
    roughness: kind === 'muscle' ? 0.44 : kind === 'tendon' ? 0.3 : 0.6,
    metalness: 0,
    clearcoat: kind === 'bones' ? 0 : kind === 'tendon' ? 0.55 : 0.32,
    clearcoatRoughness: 0.3,
    sheen: kind === 'muscle' ? 0.55 : 0.2,
    sheenColor: new THREE.Color(kind === 'muscle' ? '#ff9a88' : '#ffffff'),
    sheenRoughness: 0.5,
    specularIntensity: 0.55,
  });
  const u: Uniforms = {
    uGlow: { value: 0 },
    uDim: { value: 0 },
    uFiber: { value: kind === 'muscle' ? 1 : kind === 'tendon' ? 0.55 : 0 },
    uLime: { value: LIME },
    uLocal: { value: local },
  };
  m.userData.u = u;
  m.onBeforeCompile = (sh) => {
    Object.assign(sh.uniforms, u);
    sh.vertexShader = sh.vertexShader
      .replace(
        '#include <common>',
        `#include <common>
attribute vec4 _fibao;
uniform mat4 uLocal;
varying float vAO;
varying vec2 vStripe;
varying vec3 vAcrossV;
varying float vFibK;`,
      )
      .replace(
        '#include <begin_vertex>',
        `#include <begin_vertex>
{
  // tana koordinatalari (metr): kvantlash o'zgarishi qo'llanadi, aylanish emas — chiziqlar sirpanmaydi
  vec3 pB = (uLocal * vec4(position, 1.0)).xyz;
  vec3 fib = normalize(_fibao.xyz + vec3(1e-4));
  vec3 across = cross(normalize(objectNormal), fib);
  vFibK = clamp(length(across) * 1.6, 0.0, 1.0);
  across = normalize(across + vec3(1e-5));
  vStripe = vec2(dot(pB, across), dot(pB, fib));
  vAcrossV = normalMatrix * across;
  vAO = _fibao.w;
}`,
      );
    sh.fragmentShader = sh.fragmentShader
      .replace(
        '#include <common>',
        `#include <common>
uniform float uGlow;
uniform float uDim;
uniform float uFiber;
uniform vec3 uLime;
varying float vAO;
varying vec2 vStripe;
varying vec3 vAcrossV;
varying float vFibK;`,
      )
      .replace(
        '#include <color_fragment>',
        `#include <color_fragment>
// tola chiziqlari: yo'g'on (~14 mm) va ingichka (~5 mm), ekranda juda mayda bo'lsa so'nadi (aliasing yo'q)
float wob = sin(vStripe.y * 23.0) * 1.3 + sin(vStripe.y * 61.0 + vStripe.x * 40.0) * 0.6;
float s1 = vStripe.x * 449.0 + wob;
float s2 = vStripe.x * 1257.0 + wob * 2.1 + sin(vStripe.y * 140.0) * 0.8;
float f1 = (1.0 - smoothstep(0.45, 1.5, fwidth(s1))) * vFibK * uFiber;
float f2 = (1.0 - smoothstep(0.45, 1.5, fwidth(s2))) * vFibK * uFiber;
float fh = f1 * sin(s1) + 0.6 * f2 * sin(s2);
diffuseColor.rgb *= 1.0 - 0.08 * (fh * 0.5 + 0.5) * max(f1, f2);
float aoD = mix(1.0, vAO, 0.85);
diffuseColor.rgb *= mix(1.0, aoD, 0.6);
diffuseColor.rgb *= 1.0 - uDim;`,
      )
      .replace(
        '#include <normal_fragment_maps>',
        `#include <normal_fragment_maps>
{
  float dh = f1 * cos(s1) + 0.6 * f2 * cos(s2);
  normal = normalize(normal - normalize(vAcrossV) * dh * 0.075);
}`,
      )
      .replace(
        '#include <emissivemap_fragment>',
        `#include <emissivemap_fragment>
{
  float fres = pow(1.0 - abs(dot(normal, normalize(vViewPosition))), 2.6);
  totalEmissiveRadiance += uLime * uGlow * (0.07 + 2.1 * fres);
}`,
      )
      .replace(
        '#include <aomap_fragment>',
        `#include <aomap_fragment>
{
  float aoI = mix(1.0, vAO, 0.9);
  reflectedLight.indirectDiffuse *= aoI;
  reflectedLight.indirectSpecular *= aoI * aoI;
}`,
      );
  };
  m.customProgramCacheKey = () => 'kachok-body-v2';
  return m;
}

/** oyoq ostidagi pedestal: yumshoq soya va lime halqa */
function pedestal() {
  const g = new THREE.Group();
  const c = document.createElement('canvas');
  c.width = c.height = 128;
  const x = c.getContext('2d')!;
  const grd = x.createRadialGradient(64, 64, 0, 64, 64, 64);
  grd.addColorStop(0, 'rgba(0,0,0,0.75)');
  grd.addColorStop(0.55, 'rgba(0,0,0,0.35)');
  grd.addColorStop(1, 'rgba(0,0,0,0)');
  x.fillStyle = grd;
  x.fillRect(0, 0, 128, 128);
  const shadow = new THREE.Mesh(new THREE.CircleGeometry(0.5, 48), new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(c), transparent: true, depthWrite: false }));
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.y = 0.002;
  const ring = new THREE.Mesh(new THREE.RingGeometry(0.47, 0.478, 96), new THREE.MeshBasicMaterial({ color: LIME, transparent: true, opacity: 0.75, depthWrite: false }));
  ring.rotation.x = -Math.PI / 2;
  ring.position.y = 0.003;
  const halo = new THREE.Mesh(new THREE.RingGeometry(0.478, 0.62, 96), new THREE.MeshBasicMaterial({ color: LIME, transparent: true, opacity: 0.08, depthWrite: false }));
  halo.rotation.x = -Math.PI / 2;
  halo.position.y = 0.0025;
  g.add(shadow, halo, ring);
  return g;
}

/** Animatsiya kadrlaridan vaqt bo'yicha faza */
function phaseTimeline(anim?: AnimSpec) {
  if (!anim) return { isometric: true, at: (): Phase => 'hold' };
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

export interface BodyAct {
  key: M3;
  /** faollik yoki yuklama, 0..100 (100 dan oshishi mumkin) */
  mvic: number;
}

interface Props {
  acts: BodyAct[];
  anim?: AnimSpec;
  selected?: M3 | null;
  onSelect?: (k: M3 | null) => void;
  view?: View3D;
  mode?: Mode3D;
  playing?: boolean;
  onPhase?: (p: Phase) => void;
  /** 3D tayyor bo'lguncha ko'rsatiladigan rasm (masalan, 2D xarita) */
  placeholder?: ReactNode;
  className?: string;
  label?: string;
  /** tanlangan mushakka kamerani yaqinlashtirish (atlas sahifasi) */
  focus?: boolean;
}

export default function Muscle3D({ acts, anim, selected = null, onSelect, view = 'front', mode = 'orbit', playing = true, onPhase, placeholder, className, label, focus = false }: Props) {
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
  const api = useRef<{ goTo: (v: View3D) => void; focus: (k: M3 | null, v: View3D) => void } | null>(null);

  useEffect(() => {
    const el = host.current;
    if (!el) return;
    let disposed = false;
    let raf = 0;
    let visible = true;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const turntable = mode === 'turntable';

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
    renderer.toneMappingExposure = 1.0;
    el.appendChild(renderer.domElement);
    renderer.domElement.style.touchAction = turntable ? 'pan-y' : 'none';

    const scene = new THREE.Scene();
    const pmrem = new THREE.PMREMGenerator(renderer);
    const envTex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = envTex;
    scene.environmentIntensity = 0.55;
    scene.add(new THREE.HemisphereLight('#f1ecff', '#26120f', 0.35));
    const camera = new THREE.PerspectiveCamera(30, 1, 0.05, 30);
    // studiya yorug'ligi kameraga bog'langan: tana qaysi tomondan ko'rilsa ham bir xil yoritiladi
    const aim = new THREE.Object3D();
    aim.position.set(0, -0.1, -3.9);
    camera.add(aim);
    const light = (color: THREE.ColorRepresentation, intensity: number, x: number, y: number, z: number) => {
      const l = new THREE.DirectionalLight(color, intensity);
      l.position.set(x, y, z);
      l.target = aim;
      camera.add(l);
    };
    light('#fff0e4', 2.2, -1.6, 2.1, 1.2); // asosiy: chap-yuqori-old
    light('#ffcfc4', 0.45, 1.8, -0.2, 1.0); // to'ldiruvchi: iliq qaytgan nur
    light(LIME, 1.35, 2.4, 1.4, -6.0); // orqadan lime kontur
    light('#a9bdff', 1.1, -2.4, 1.6, -6.0); // orqadan sovuq kontur
    scene.add(camera);
    camera.position.copy(turntable ? VIEW_POS.front : VIEW_POS[live.current.view]);
    camera.lookAt(TARGET);
    let controls: OrbitControls | null = null;
    if (!turntable) {
      controls = new OrbitControls(camera, renderer.domElement);
      controls.target.copy(TARGET);
      controls.enablePan = false;
      controls.enableDamping = true;
      controls.dampingFactor = 0.09;
      controls.minDistance = 0.6;
      controls.maxDistance = 5.5;
      controls.minPolarAngle = 0.25;
      controls.maxPolarAngle = Math.PI - 0.25;
      controls.rotateSpeed = 0.8;
      controls.update();
    }

    // tana va pedestal; turntable rejimida aylanadigan guruh
    const spin = new THREE.Group();
    spin.rotation.y = turntable ? VIEW_ANGLE[live.current.view] : 0;
    scene.add(spin);
    spin.add(pedestal());

    // kamerani tana atrofida aylanib ko'chirish (orbit) yoki tanani burish (turntable), 0.7 s
    let fly: { r: number; a0: number; a1: number; p0: number; p1: number; start: number } | null = null;
    let turn: { a0: number; a1: number; start: number } | null = null;
    // kamera va qarash nuqtasini birga ko'chirish (mushakka yaqinlashish)
    let aimTo: { t0: THREE.Vector3; t1: THREE.Vector3; p0: THREE.Vector3; p1: THREE.Vector3; start: number } | null = null;
    const boxes = new Map<string, THREE.Box3>();
    const FOCUS_DIR: Record<View3D, THREE.Vector3> = {
      front: new THREE.Vector3(0, 0.08, 1).normalize(),
      back: new THREE.Vector3(0, 0.08, -1).normalize(),
      side: new THREE.Vector3(1, 0.08, 0.12).normalize(),
    };
    const sph = new THREE.Spherical();
    const shortest = (d: number) => ((((d + Math.PI) % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI)) - Math.PI;
    api.current = {
      goTo(v) {
        if (turntable) {
          turn = { a0: spin.rotation.y, a1: spin.rotation.y + shortest(VIEW_ANGLE[v] - spin.rotation.y), start: performance.now() };
          return;
        }
        if (!controls) return;
        const cur = new THREE.Spherical().setFromVector3(camera.position.clone().sub(controls.target));
        const goal = new THREE.Spherical().setFromVector3(VIEW_POS[v].clone().sub(TARGET));
        fly = { r: cur.radius, a0: cur.theta, a1: cur.theta + shortest(goal.theta - cur.theta), p0: cur.phi, p1: goal.phi, start: performance.now() };
      },
      focus(k, v) {
        if (!controls) return;
        const box = k ? boxes.get(k) : undefined;
        let t1 = TARGET.clone();
        let p1 = VIEW_POS[v].clone();
        if (box) {
          const size = box.getSize(new THREE.Vector3());
          t1 = box.getCenter(new THREE.Vector3());
          const r = THREE.MathUtils.clamp(Math.max(size.x, size.y) * 2.1 + 0.4, 0.9, 3.95);
          p1 = t1.clone().addScaledVector(FOCUS_DIR[v], r);
        }
        fly = null;
        aimTo = { t0: controls.target.clone(), t1, p0: camera.position.clone(), p1, start: performance.now() };
      },
    };

    const mats = new Map<string, THREE.MeshPhysicalMaterial>();
    const meshes: THREE.Mesh[] = [];

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

    // bosish — mushakni tanlash; turntable: gorizontal surish — burish
    const ray = new THREE.Raycaster();
    let down: { x: number; y: number; a: number } | null = null;
    let dragging = false;
    let idleUntil = 0;
    const onDown = (e: PointerEvent) => {
      down = { x: e.clientX, y: e.clientY, a: spin.rotation.y };
      dragging = false;
    };
    const onMove = (e: PointerEvent) => {
      if (!down || !turntable) return;
      const dx = e.clientX - down.x;
      if (!dragging && Math.abs(dx) > 8 && Math.abs(dx) > Math.abs(e.clientY - down.y)) dragging = true;
      if (dragging) {
        turn = null;
        spin.rotation.y = down.a + (dx / el.clientWidth) * Math.PI * 1.6;
        idleUntil = performance.now() + 4000;
      }
    };
    const onUp = (e: PointerEvent) => {
      const d = down;
      down = null;
      if (!d || dragging || Math.hypot(e.clientX - d.x, e.clientY - d.y) > 6) return;
      if (!live.current.onSelect) return;
      const r = renderer.domElement.getBoundingClientRect();
      ray.setFromCamera(new THREE.Vector2(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1), camera);
      const hit = ray.intersectObjects(meshes, false)[0];
      const name = hit?.object.name;
      live.current.onSelect(name && isM3(name) ? name : null);
      idleUntil = performance.now() + 4000;
    };
    const onCancel = () => (down = null);
    renderer.domElement.addEventListener('pointerdown', onDown);
    renderer.domElement.addEventListener('pointermove', onMove);
    renderer.domElement.addEventListener('pointerup', onUp);
    renderer.domElement.addEventListener('pointercancel', onCancel);

    loadModel()
      .then((model) => {
        if (disposed) return;
        const root = model.clone(true);
        root.updateMatrixWorld(true);
        root.traverse((o) => {
          const m = o as THREE.Mesh;
          if (!m.isMesh) return;
          const name = m.name || m.parent?.name || '';
          m.name = name;
          const kind: Kind = name === 'bones' ? 'bones' : name === 'tendon' ? 'tendon' : 'muscle';
          // kvantlash o'zgarishi (tugun matritsasi) — tola koordinatalari metrda bo'lishi uchun
          const mat = bodyMaterial(kind, m.matrixWorld.clone());
          if (name === 'other') mat.color.copy(PAL.other);
          m.material = mat;
          mats.set(name, mat);
          meshes.push(m);
        });
        spin.add(root);
        spin.updateMatrixWorld(true);
        for (const m of meshes) boxes.set(m.name, new THREE.Box3().setFromObject(m));
        setState('ready');
      })
      .catch(() => !disposed && setState('error'));

    let lastPhase: Phase | null = null;
    let isolated: M3 | null | undefined;
    // tanlangan mushakni ajratish: qolganlari yarim shaffof (chuqur mushaklar — masalan umurtqa rostlovchilar — ko'rinsin)
    const isolate = (k: M3 | null) => {
      isolated = k;
      for (const [name, mat] of mats) {
        const ghost = !!k && name !== k;
        mat.transparent = ghost;
        mat.opacity = ghost ? (name === 'bones' ? 0.3 : 0.14) : 1;
        mat.depthWrite = !ghost;
        mat.needsUpdate = true;
      }
      for (const m of meshes) m.renderOrder = k && m.name === k ? 1 : 0;
    };
    let level = 0.6; // silliq faza darajasi
    const t0 = performance.now();
    let last = t0;
    let paused = 0;
    let pausedAt = 0;

    const loop = () => {
      raf = requestAnimationFrame(loop);
      if (!visible || document.hidden) return;
      const L = live.current;
      const now = performance.now();
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
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

      if (aimTo && controls) {
        const k = reduced ? 1 : Math.min(1, (now - aimTo.start) / 800);
        const e = 1 - Math.pow(1 - k, 3);
        controls.target.lerpVectors(aimTo.t0, aimTo.t1, e);
        camera.position.lerpVectors(aimTo.p0, aimTo.p1, e);
        if (k >= 1) aimTo = null;
      }
      if (fly && controls) {
        const k = reduced ? 1 : Math.min(1, (now - fly.start) / 700);
        const e = 1 - Math.pow(1 - k, 3);
        sph.set(fly.r, fly.p0 + (fly.p1 - fly.p0) * e, fly.a0 + (fly.a1 - fly.a0) * e);
        camera.position.setFromSpherical(sph).add(controls.target);
        if (k >= 1) fly = null;
      }
      if (turn) {
        const k = reduced ? 1 : Math.min(1, (now - turn.start) / 700);
        spin.rotation.y = turn.a0 + (turn.a1 - turn.a0) * (1 - Math.pow(1 - k, 3));
        if (k >= 1) {
          turn = null;
          idleUntil = now + 2500;
        }
      } else if (turntable && !reduced && !dragging && now > idleUntil && !L.selected) spin.rotation.y += dt * 0.22;
      controls?.update();

      if (mats.size && isolated !== L.selected) isolate(L.selected);
      const byKey = new Map(L.acts.map((a) => [a.key, a]));
      const any = byKey.size > 0;
      for (const [name, mat] of mats) {
        const u = mat.userData.u as Uniforms;
        if (!isM3(name)) {
          u.uGlow.value = 0;
          u.uDim.value = any && name === 'other' ? 0.25 : 0;
          continue;
        }
        const a = byKey.get(name);
        const strength = a ? Math.min(1.15, a.mvic / 100) : 0;
        const isSel = L.selected === name;
        // kam faollik ham ko'rinsin (yorug'lik pastki chegarasi), kuchlisi — yorqinroq
        u.uGlow.value = a ? (0.34 + 0.66 * strength) * (0.55 + 0.45 * level) : isSel ? 0.35 : 0;
        if (isSel) u.uGlow.value *= 1.05 + 0.25 * Math.sin(t / 180);
        // ishlamayotgan mushaklar biroz xiralashadi — lime qismlar ajralib turadi
        u.uDim.value = any && !a ? 0.3 : 0;
        if (L.selected && !isSel) u.uDim.value = 0.5;
      }
      renderer.render(scene, camera);
    };
    loop();

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      renderer.domElement.removeEventListener('pointerdown', onDown);
      renderer.domElement.removeEventListener('pointermove', onMove);
      renderer.domElement.removeEventListener('pointerup', onUp);
      renderer.domElement.removeEventListener('pointercancel', onCancel);
      controls?.dispose();
      mats.forEach((m) => m.dispose());
      scene.traverse((o) => {
        const m = o as THREE.Mesh;
        if (m.isMesh && !meshes.includes(m)) {
          m.geometry.dispose();
          const mm = m.material as THREE.MeshBasicMaterial;
          mm.map?.dispose();
          mm.dispose();
        }
      });
      envTex.dispose();
      pmrem.dispose();
      renderer.dispose();
      renderer.domElement.remove();
      api.current = null;
    };
  }, [mode]);

  // ko'rinish tugmalari (atlasda — tanlangan mushakka yaqinlashish)
  useEffect(() => {
    if (state !== 'ready') return;
    if (focus) api.current?.focus(selected, view);
    else api.current?.goTo(view);
  }, [view, state, focus, selected]);

  const aria = label ?? `3D anatomik model: ${acts.slice(0, 3).map((a) => `${M3_INFO[a.key].name} ${Math.round(a.mvic)}%`).join(', ')}`;
  return (
    <div ref={host} className={`m3d-host ${className ?? ''}`} role="img" aria-label={aria}>
      {state !== 'ready' && placeholder && <div className="m3d-ph">{placeholder}</div>}
      {state === 'loading' && !placeholder && (
        <div className="m3d-overlay">
          <span className="spinner" aria-hidden="true" />
          <span className="small muted">3D model yuklanmoqda…</span>
        </div>
      )}
      {state === 'error' && !placeholder && (
        <div className="m3d-overlay">
          <span className="small muted">3D ko‘rinish bu qurilmada ochilmadi (WebGL yoki internet). Pastdagi ro‘yxat to‘liq ishlaydi.</span>
        </div>
      )}
    </div>
  );
}
