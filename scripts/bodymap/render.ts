// Tana xaritasi (BodyMap) uchun tasvirlarni 3D modeldan render qilish — faqat dev serverda, render.mjs orqali ishlaydi.
// Har bir ko'rinish (old/orqa) uchun: 'base' — tinch tana, 'glow' — barcha mushaklar lime rangda, 'id' — mushak guruhlari niqobi.
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { bodyMaterial, loadModel, PAL, type Kind } from '../../src/components/Muscle3D';
import { isM3, M3_INFO } from '../../src/data/muscles3d';
import type { MuscleId } from '../../src/types';

export const GROUP_IDS: MuscleId[] = ['chest', 'frontDelts', 'sideDelts', 'rearDelts', 'biceps', 'triceps', 'forearms', 'lats', 'upperBack', 'traps', 'abs', 'obliques', 'lowerBack', 'glutes', 'quads', 'hamstrings', 'adductors', 'calves'];
const LIME = new THREE.Color('#d4fa50');

type Mode = 'base' | 'glow' | 'id';

/** H — chiqish balandligi; base/glow ikki baravar kattaroq render qilinib kichraytiriladi (silliq qirralar) va webp qaytariladi */
async function render(view: 'front' | 'back', mode: Mode, H: number, dim: number) {
  const ss = mode === 'id' ? 1 : 2;
  const outH = H;
  H = H * ss;
  const model = (await loadModel()).clone(true);
  model.updateMatrixWorld(true);
  const box = new THREE.Box3().setFromObject(model);
  const size = box.getSize(new THREE.Vector3());
  const center = box.getCenter(new THREE.Vector3());
  const padX = 0.03;
  const padY = 0.015;
  const halfW = size.x / 2 + padX;
  const halfH = size.y / 2 + padY;
  const outW = Math.round((outH * halfW) / halfH);
  const W = outW * ss;

  const renderer = new THREE.WebGLRenderer({ antialias: mode !== 'id', alpha: true, preserveDrawingBuffer: true });
  renderer.setPixelRatio(1);
  renderer.setSize(W, H, false);
  renderer.setClearColor(0x000000, 0);
  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-halfW, halfW, halfH, -halfH, 0.1, 20);
  const z = view === 'front' ? 6 : -6;
  camera.position.set(center.x, center.y, center.z + z);
  camera.lookAt(center);
  scene.add(camera);

  if (mode === 'id') {
    renderer.toneMapping = THREE.NoToneMapping;
    renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
    model.traverse((o) => {
      const m = o as THREE.Mesh;
      if (!m.isMesh) return;
      const name = m.name || m.parent?.name || '';
      const g = isM3(name) ? M3_INFO[name].group : null;
      const idx = g ? GROUP_IDS.indexOf(g) + 1 : 0;
      // R kanalida guruh raqami (×10), qolganlari qora — chuqurlik testi ko'rinmaydigan qismlarni o'zi kesadi
      m.material = new THREE.MeshBasicMaterial({ color: new THREE.Color(idx * 10 / 255, 0, 0) });
    });
  } else {
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    // tinch tana biroz to'qroq — faol (lime) mushaklar qora fonli ilovada yaqqol ajralsin
    renderer.toneMappingExposure = mode === 'base' ? 0.5 : 1.0;
    const pmrem = new THREE.PMREMGenerator(renderer);
    scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environmentIntensity = 0.55;
    scene.add(new THREE.HemisphereLight('#f1ecff', '#26120f', 0.35));
    const aim = new THREE.Object3D();
    aim.position.set(0, 0, -6);
    camera.add(aim);
    const light = (color: THREE.ColorRepresentation, intensity: number, x: number, y: number, zz: number) => {
      const l = new THREE.DirectionalLight(color, intensity);
      l.position.set(x, y, zz);
      l.target = aim;
      camera.add(l);
    };
    // Muscle3D bilan bir xil studiya yorug'ligi
    light('#fff0e4', 2.2, -1.6, 2.1, 1.2);
    light('#ffcfc4', 0.45, 1.8, -0.2, 1.0);
    light(LIME, 1.35, 2.4, 1.4, -6.0);
    light('#a9bdff', 1.1, -2.4, 1.6, -6.0);
    model.traverse((o) => {
      const m = o as THREE.Mesh;
      if (!m.isMesh) return;
      const name = m.name || m.parent?.name || '';
      const kind: Kind = name === 'bones' ? 'bones' : name === 'tendon' ? 'tendon' : 'muscle';
      const mat = bodyMaterial(kind, m.matrixWorld.clone());
      if (name === 'other') mat.color.copy(PAL.other);
      const u = mat.userData.u as { uGlow: { value: number }; uDim: { value: number } };
      const mapped = isM3(name) && !!M3_INFO[name].group;
      if (mode === 'glow' && mapped) {
        mat.color.set('#9fc43a');
        mat.sheenColor.set('#eaff9a');
        u.uGlow.value = 0.55;
      } else u.uDim.value = dim;
      m.material = mat;
    });
  }
  scene.add(model);
  renderer.render(scene, camera);
  let url: string;
  if (ss === 1) url = renderer.domElement.toDataURL('image/png');
  else {
    const c = document.createElement('canvas');
    c.width = outW;
    c.height = outH;
    const x = c.getContext('2d')!;
    x.imageSmoothingQuality = 'high';
    x.drawImage(renderer.domElement, 0, 0, outW, outH);
    url = c.toDataURL('image/webp', 0.8);
  }
  renderer.dispose();
  return { url, W: outW, H: outH };
}

(window as unknown as { __render: typeof render; __groups: MuscleId[] }).__render = render;
(window as unknown as { __groups: MuscleId[] }).__groups = GROUP_IDS;
document.title = 'ready';
