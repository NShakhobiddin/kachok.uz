// Mushaklar atlasi: 3D modelda mushakka bosish yoki mintaqa bo'yicha ro'yxatdan tanlash.
import { lazy, Suspense, useState } from 'react';
import { Link } from 'react-router-dom';
import { ATLAS_ORDER, MUSCLE_GUIDE, REGIONS, type Region } from '../data/muscleGuide';
import { M3_INFO, type M3 } from '../data/muscles3d';
import type { View3D } from './Muscle3D';
import { Icon } from './ui/Icon';

const Muscle3D = lazy(() => import('./Muscle3D'));

export function MuscleAtlas() {
  const [sel, setSel] = useState<M3 | null>(null);
  const [view, setView] = useState<View3D>('front');
  const [region, setRegion] = useState<Region | 'all'>('all');
  const pick = (k: M3 | null) => {
    setSel(k);
    if (k) setView(M3_INFO[k].view);
  };
  const list = region === 'all' ? ATLAS_ORDER : ATLAS_ORDER.filter((k) => MUSCLE_GUIDE[k].region === region);

  return (
    <div className="stack gap-12">
      <div className="card glow atlas-hero">
        <Suspense
          fallback={
            <div className="m3d-host atlas-3d">
              <div className="m3d-overlay">
                <span className="spinner" aria-hidden="true" />
              </div>
            </div>
          }
        >
          <Muscle3D
            acts={sel ? [{ key: sel, mvic: 100 }] : []}
            selected={sel}
            onSelect={pick}
            view={view}
            className="atlas-3d"
            label={sel ? `3D model: ${M3_INFO[sel].name}` : '3D anatomik model — mushakka bosing'}
          />
        </Suspense>
        <div className="m3d-top">
          <span className="tag stage-tag">{sel ? 'Boshqa mushakka bosing yoki bo‘sh joyga — qaytish' : 'Mushakka bosing · barmoq bilan aylantiring'}</span>
        </div>
        {/* ko'rinish tugmalari doim modelda; tanlangan mushak kartasi — model ostida (telefonda yopib qo'ymasin) */}
        <div className="m3d-controls">
          <div className="segmented m3d-seg" role="radiogroup" aria-label="Ko‘rinish">
            {(['front', 'side', 'back'] as const).map((v) => (
              <button key={v} role="radio" aria-checked={view === v} className={view === v ? 'on' : ''} onClick={() => setView(v)}>
                {v === 'front' ? 'Old' : v === 'side' ? 'Yon' : 'Orqa'}
              </button>
            ))}
          </div>
        </div>
      </div>
      {sel && (
        <div className="m3d-card atlas-card" role="status">
          <div className="row between gap-8" style={{ alignItems: 'flex-start' }}>
            <span className="stack" style={{ minWidth: 0 }}>
              <b className="small">{M3_INFO[sel].name}</b>
              <i className="tiny muted">{M3_INFO[sel].latin}</i>
            </span>
            <button className="icon-btn" style={{ width: 32, height: 32 }} onClick={() => pick(null)} aria-label="Yopish">
              <Icon name="x" size={16} />
            </button>
          </div>
          <p className="small mt-4">{MUSCLE_GUIDE[sel].short}</p>
          <Link to={`/muscle/${sel}`} className="btn btn-primary btn-sm btn-block mt-8">
            Batafsil: qanday ishlaydi, mashqlar <Icon name="right" size={16} />
          </Link>
        </div>
      )}

      <div className="hscroll" role="radiogroup" aria-label="Tana qismi">
        {[{ id: 'all' as const, name: 'Hammasi' }, ...REGIONS].map((r) => (
          <button key={r.id} role="radio" aria-checked={region === r.id} className={`chip ${region === r.id ? 'on' : ''}`} onClick={() => setRegion(r.id)}>
            {r.name}
          </button>
        ))}
      </div>

      <div className="tiny faint">{list.length} ta mushak</div>
      <div className="stack gap-8">
        {list.map((k) => (
          <Link key={k} to={`/muscle/${k}`} className="atlas-row">
            <span className="atlas-dot" aria-hidden="true" />
            <span className="grow" style={{ minWidth: 0 }}>
              <b className="small" style={{ display: 'block', lineHeight: 1.3 }}>
                {M3_INFO[k].name}
              </b>
              <span className="tiny muted" style={{ display: 'block', marginTop: 2 }}>
                {MUSCLE_GUIDE[k].short}
              </span>
            </span>
            <Icon name="right" size={18} style={{ color: 'var(--text-3)', flex: 'none' }} />
          </Link>
        ))}
      </div>
    </div>
  );
}
