// Poza namunasi: ilovadagi to'g'ri texnikali animatsiyaning bitta kadri (rasm generatoriga "aynan shu poza" deb beriladi).
// Ishlatish: /scripts/images/pose.html?id=bench-press&t=1200 — t (ms) berilmasa, window.__frames(id) kadrlar vaqtini qaytaradi.
import { createRoot } from 'react-dom/client';
import '../../src/styles/global.css';
import { Figure } from '../../src/components/figure/Figure';
import { EXERCISES } from '../../src/data/exercises';

const q = new URLSearchParams(location.search);
const ex = EXERCISES.find((e) => e.id === q.get('id'));

(window as unknown as { __frames: (id: string) => { t: number; phase: string }[] }).__frames = (id) => {
  const e = EXERCISES.find((x) => x.id === id)!;
  let t = 0;
  return e.anim.frames.map((f) => {
    const r = { t, phase: f.phase };
    t += f.dur;
    return r;
  });
};

createRoot(document.getElementById('root')!).render(
  ex ? (
    <div id="pose" style={{ width: 640, height: 640, background: '#f2f2f2' }}>
      <Figure spec={ex.anim} primary={ex.primary} secondary={ex.secondary} playing={false} at={Number(q.get('t') ?? 0)} hero={1} title={ex.name} />
    </div>
  ) : (
    <div id="ready">ready</div>
  ),
);
