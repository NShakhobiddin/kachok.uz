// Bitta mushak haqida qo'llanma: 3D modelda ajratilgan holda, anatomiya, vazifa va EMG bo'yicha eng yaxshi mashqlar.
import { lazy, Suspense, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ExerciseThumb } from '../components/ExerciseThumb';
import type { View3D } from '../components/Muscle3D';
import { Icon } from '../components/ui/Icon';
import { EXERCISE_MAP } from '../data/exercises';
import { ATLAS_ORDER, bestExercises, MUSCLE_GUIDE, REGIONS } from '../data/muscleGuide';
import { isM3, M3_INFO } from '../data/muscles3d';
import { heatColor } from '../engine/activation';

const Muscle3D = lazy(() => import('../components/Muscle3D'));

export default function MuscleDetail() {
  const { key = '' } = useParams();
  const nav = useNavigate();
  const [viewOverride, setViewOverride] = useState<{ key: string; view: View3D } | null>(null);
  if (!isM3(key)) return <div className="page empty">Mushak topilmadi.</div>;
  const info = M3_INFO[key];
  const g = MUSCLE_GUIDE[key];
  const view = viewOverride?.key === key ? viewOverride.view : info.view;
  const best = bestExercises(key, 6);
  const scaleMax = Math.max(100, ...best.map((b) => b.mvic));
  const i = ATLAS_ORDER.indexOf(key);
  const prev = ATLAS_ORDER[(i - 1 + ATLAS_ORDER.length) % ATLAS_ORDER.length];
  const next = ATLAS_ORDER[(i + 1) % ATLAS_ORDER.length];
  const region = REGIONS.find((r) => r.id === g.region)?.name;

  return (
    <div className="page">
      <div className="back-bar">
        <button className="icon-btn" onClick={() => nav(-1)} aria-label="Orqaga">
          <Icon name="left" />
        </button>
        <span className="eyebrow">Mushaklar atlasi · {region}</span>
      </div>
      <h1 className="display display-l">{info.name}</h1>
      <p className="small muted mt-8">
        <i>{info.latin}</i>
      </p>

      <div className="card glow atlas-hero mt-16">
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
            acts={[{ key, mvic: 100 }]}
            selected={key}
            focus
            view={view}
            onSelect={(k) => k && k !== key && nav(`/muscle/${k}`, { replace: true })}
            className="atlas-3d"
            label={`3D model: ${info.name} ajratib ko‘rsatilgan`}
          />
        </Suspense>
        <div className="m3d-top">
          <span className="tag stage-tag">Boshqa mushakka bosing — unga o‘tasiz</span>
        </div>
        <div className="m3d-controls">
          <div className="segmented m3d-seg" role="radiogroup" aria-label="Ko‘rinish">
            {(['front', 'side', 'back'] as const).map((v) => (
              <button key={v} role="radio" aria-checked={view === v} className={view === v ? 'on' : ''} onClick={() => setViewOverride({ key, view: v })}>
                {v === 'front' ? 'Old' : v === 'side' ? 'Yon' : 'Orqa'}
              </button>
            ))}
          </div>
        </div>
      </div>

      <p className="lead mt-16">{g.short}</p>

      <section className="section">
        <div className="card stack gap-14">
          <div>
            <div className="eyebrow">Qayerda</div>
            <p className="mt-6">{g.where}</p>
          </div>
          <div className="attach">
            <div className="attach-row">
              <span className="attach-dot" aria-hidden="true" />
              <span>
                <span className="eyebrow">Boshlanishi</span>
                <span className="attach-text">{g.origin}</span>
              </span>
            </div>
            <div className="attach-row">
              <span className="attach-dot end" aria-hidden="true" />
              <span>
                <span className="eyebrow">Birikishi</span>
                <span className="attach-text">{g.insertion}</span>
              </span>
            </div>
          </div>
          <p className="tiny faint">Mushak qisqarganda birikish nuqtasi boshlanish nuqtasiga yaqinlashadi — harakat shu.</p>
        </div>
      </section>

      <section className="section">
        <div className="section-head">
          <h2>Vazifasi</h2>
        </div>
        <ul className="safe-list card">
          {g.actions.map((a) => (
            <li key={a}>
              <Icon name="check" size={16} stroke={3} />
              <span>{a}</span>
            </li>
          ))}
        </ul>
        <p className="small muted mt-12">
          <b style={{ color: 'var(--text)' }}>Hayotda:</b> {g.daily}
        </p>
      </section>

      <section className="section">
        <div className="section-head">
          <h2>Eng ko‘p ishlatadigan mashqlar</h2>
          <span className="small muted">EMG, % MVIC</span>
        </div>
        <div className="stack gap-8">
          {best.map((b) => {
            const ex = EXERCISE_MAP[b.id];
            if (!ex) return null;
            return (
              <Link key={b.id} to={`/exercise/${b.id}`} className="ex-row">
                <ExerciseThumb ex={ex} size={48} />
                <span className="grow" style={{ minWidth: 0 }}>
                  <span className="ex-name">{ex.name}</span>
                  <span className="act-bar mt-6" aria-hidden="true" style={{ display: 'block' }}>
                    <i style={{ width: `${(Math.min(b.mvic, scaleMax) / scaleMax) * 100}%`, background: heatColor(b.mvic) }} />
                  </span>
                </span>
                <span className="ex-meta num" style={{ color: heatColor(b.mvic) }} title={b.est ? 'Baho (to‘g‘ridan-to‘g‘ri o‘lchanmagan)' : 'Tadqiqotda o‘lchangan'}>
                  {b.est ? '≈' : ''}
                  {Math.round(b.mvic)}%
                </span>
              </Link>
            );
          })}
        </div>
        <p className="tiny faint mt-8">Mushakning shu mashqdagi elektr faolligi, maksimal ixtiyoriy qisqarishga nisbatan. ≈ — o‘xshash mashq yoki tadqiqotlar oralig‘i asosidagi baho.</p>
      </section>

      <section className="section">
        <div className="card stack gap-14">
          <div>
            <div className="eyebrow accent">Mashqda his qilish</div>
            <p className="mt-6">{g.feel}</p>
          </div>
          <div className="divider" style={{ margin: 0 }} />
          <div>
            <div className="eyebrow">Cho‘zish</div>
            <p className="mt-6">{g.stretch}</p>
          </div>
        </div>
        <div className="notice gold mt-12">
          <Icon name="alert" />
          <span>
            <b>E’tibor bering:</b> {g.watch}
          </span>
        </div>
        {g.fact && (
          <div className="card mt-12 stack gap-6">
            <span className="eyebrow accent">Bilasizmi?</span>
            <p>{g.fact}</p>
          </div>
        )}
      </section>

      <nav className="grid-2 section" aria-label="Boshqa mushaklar">
        <Link to={`/muscle/${prev}`} replace className="card tight stack gap-4" style={{ color: 'inherit' }}>
          <span className="eyebrow">← Oldingi</span>
          <span className="small strong">{M3_INFO[prev].name}</span>
        </Link>
        <Link to={`/muscle/${next}`} replace className="card tight stack gap-4" style={{ color: 'inherit', textAlign: 'right' }}>
          <span className="eyebrow">Keyingi →</span>
          <span className="small strong">{M3_INFO[next].name}</span>
        </Link>
      </nav>
      <p className="tiny faint mt-16">
        Anatomiya: OpenStax «Anatomy and Physiology 2e» (2022). Mashqlar reytingi — ilovadagi EMG tadqiqotlar jadvali.{' '}
        <Link to="/sources">Manbalar</Link>
      </p>
    </div>
  );
}
