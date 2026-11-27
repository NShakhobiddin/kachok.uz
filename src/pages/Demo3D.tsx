// Sinov sahifasi: 3D mushak modeli harakatda (3 ta mashq). Manzil: /demo3d — menyuda yo‘q.
import { useState } from 'react';
import Body3DMotion from '../components/Body3DMotion';
import { PageBack } from '../components/PageBack';
import { EXERCISE_MAP } from '../data/exercises';
import { activationFor } from '../engine/activation';
import type { M3 } from '../data/muscles3d';

const LIST = [
  { id: 'bw-squat', held: null },
  { id: 'db-curl', held: 'dumbbell' as const },
  { id: 'push-up', held: null },
];

export default function Demo3D() {
  const q = new URLSearchParams(location.search);
  const [i, setI] = useState(Number(q.get('i') ?? 0) || 0);
  const fixed = q.get('t') !== null ? Number(q.get('t')) : undefined;
  const [stats, setStats] = useState({ fps: 0, rigMs: 0 });
  const item = LIST[i];
  const ex = EXERCISE_MAP[item.id];
  const acts = activationFor(ex).list.map((a) => ({ key: a.key as M3, mvic: a.mvic }));
  return (
    <main className="page stack gap-12">
      <PageBack fallback="/library" />
      <h1 className="h2">3D harakat (sinov)</h1>
      <div className="row gap-8 wrap">
        {LIST.map((l, k) => (
          <button key={l.id} className={`chip${k === i ? ' on' : ''}`} aria-pressed={k === i} onClick={() => setI(k)}>
            {EXERCISE_MAP[l.id].name}
          </button>
        ))}
      </div>
      <div className="card" style={{ height: '62vh', minHeight: 420, padding: 0, overflow: 'hidden' }}>
        <Body3DMotion key={item.id} spec={ex.anim} acts={acts} held={item.held} time={fixed} onStats={(s) => setStats((p) => ({ fps: s.fps || p.fps, rigMs: s.rigMs >= 0 ? s.rigMs : p.rigMs }))} />
      </div>
      <p className="small muted">
        Model: Z-Anatomy (CC BY-SA 4.0). Barmoq bilan aylantiring. Tezlik: {stats.fps || '…'} kadr/s · skelet {stats.rigMs} ms
      </p>
    </main>
  );
}
