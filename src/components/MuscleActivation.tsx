// Mashq sahifasidagi "Mushaklar 3D" bo'limi: anatomik model, EMG foizlari, rol, manbalar.
import { lazy, Suspense, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { EMG_SOURCES } from '../data/activation';
import { M3_INFO, type M3 } from '../data/muscles3d';
import { activationFor, heatColor, ROLE_TEXT } from '../engine/activation';
import type { Exercise, Phase } from '../types';
import { exById } from '../data/exercises';
import type { View3D } from './Muscle3D';
import { Icon } from './ui/Icon';

const Muscle3D = lazy(() => import('./Muscle3D'));

const PHASE_TEXT: Record<Phase, string> = {
  up: 'Ko‘tarish (konsentrik) — faollik eng yuqori',
  down: 'Tushirish (ekssentrik) — faollik ~65%',
  hold: 'Ushlab turish',
  squeeze: 'Qisish — eng yuqori nuqta',
};

export function MuscleActivation({ ex }: { ex: Exercise }) {
  const act = useMemo(() => activationFor(ex), [ex]);
  const top = act.list[0]?.key;
  const [selected, setSelected] = useState<M3 | null>(null);
  const [view, setView] = useState<View3D>(top ? (M3_INFO[top].view === 'side' ? 'front' : M3_INFO[top].view) : 'front');
  const [playing, setPlaying] = useState(true);
  const [phase, setPhase] = useState<Phase>('hold');
  const [showSrc, setShowSrc] = useState(false);
  const sel = selected ? act.list.find((a) => a.key === selected) : null;
  const srcKeys = useMemo(() => Array.from(new Set(act.list.flatMap((a) => a.src ?? []))).filter((k) => EMG_SOURCES[k]), [act]);
  const similar = act.basis.startsWith('similar:') ? act.basis.slice(8) : null;
  const similarName = similar ? (exById(similar)?.name ?? similar) : null;
  // shkala: 100% yoki eng katta qiymat/oraliq chegarasi — chiziqlar katakdan chiqmasin
  const scaleMax = Math.max(100, ...act.list.map((a) => Math.max(a.mvic, a.range?.[1] ?? 0)));
  const measured = act.list.filter((a) => !a.est).length;

  const pick = (k: M3 | null) => {
    setSelected(k);
    if (k) setView(M3_INFO[k].view);
  };

  return (
    <div className="stack gap-12">
      <div className="m3d-wrap">
        <Suspense
          fallback={
            <div className="m3d-host">
              <div className="m3d-overlay">
                <span className="spinner" aria-hidden="true" />
              </div>
            </div>
          }
        >
          <Muscle3D acts={act.list} anim={ex.anim} selected={selected} onSelect={pick} view={view} playing={playing} onPhase={setPhase} />
        </Suspense>
        <div className="m3d-top">
          <span className="tag stage-tag">
            <i className="dot" style={{ background: phase === 'up' || phase === 'squeeze' ? 'var(--red)' : 'var(--blue-2)' }} />
            {PHASE_TEXT[phase]}
          </span>
        </div>
        <div className="m3d-controls">
          <div className="segmented m3d-seg" role="radiogroup" aria-label="Ko‘rinish">
            {(['front', 'side', 'back'] as const).map((v) => (
              <button key={v} role="radio" aria-checked={view === v} className={view === v ? 'on' : ''} onClick={() => setView(v)}>
                {v === 'front' ? 'Old' : v === 'side' ? 'Yon' : 'Orqa'}
              </button>
            ))}
          </div>
          <button className="icon-btn filled" onClick={() => setPlaying((p) => !p)} aria-label={playing ? 'To‘xtatish' : 'Davom ettirish'}>
            <Icon name={playing ? 'pause' : 'play'} size={18} />
          </button>
        </div>
        {sel && (
          <div className="m3d-card" role="status">
            <div className="row between gap-8">
              <b className="small">{M3_INFO[sel.key].name}</b>
              <button className="icon-btn" style={{ width: 32, height: 32 }} onClick={() => setSelected(null)} aria-label="Yopish">
                <Icon name="x" size={16} />
              </button>
            </div>
            <div className="row gap-8 tiny muted" style={{ marginTop: -4 }}>
              <i>{M3_INFO[sel.key].latin}</i>
            </div>
            <div className="row gap-12 mt-4" style={{ alignItems: 'baseline' }}>
              <span className="num" style={{ fontSize: 28, fontWeight: 800, color: heatColor(sel.mvic) }}>
                {sel.est ? '≈' : ''}
                {Math.round(sel.mvic)}%
              </span>
              <span className="small">
                {ROLE_TEXT[sel.role]}
                {sel.range && <span className="muted"> · tadqiqotlarda {sel.range[0]}–{sel.range[1]}%</span>}
              </span>
            </div>
            <Link to={`/muscle/${sel.key}`} className="small strong row gap-6 mt-4" style={{ minHeight: 32 }}>
              Mushak haqida qo‘llanma <Icon name="right" size={14} />
            </Link>
          </div>
        )}
        {selected && !sel && (
          <div className="m3d-card small" role="status">
            <b>{M3_INFO[selected].name}</b> — bu mashqda sezilarli ishlamaydi (&lt;10% MVIC).
          </div>
        )}
      </div>

      <div className="card stack gap-12">
        <div className="row between">
          <span className="strong">Mushaklar faolligi</span>
          <span className="tiny muted">EMG, % MVIC{act.metric === 'peak' ? ' (cho‘qqi)' : ''}</span>
        </div>
        <div className="stack" style={{ gap: 2 }}>
          {act.list.map((a) => (
            <button key={a.key} className={`act-row ${selected === a.key ? 'on' : ''}`} onClick={() => pick(selected === a.key ? null : a.key)} aria-pressed={selected === a.key}>
              <span className="act-name">
                <span className="small strong">{M3_INFO[a.key].name}</span>
                <span className="tiny muted">{ROLE_TEXT[a.role]}</span>
              </span>
              <span className="act-bar" aria-hidden="true">
                <i style={{ width: `${(Math.min(a.mvic, scaleMax) / scaleMax) * 100}%`, background: heatColor(a.mvic) }} />
                {a.range && <b style={{ left: `${(a.range[0] / scaleMax) * 100}%`, width: `${((a.range[1] - a.range[0]) / scaleMax) * 100}%` }} />}
              </span>
              <span className="num strong act-val" title={a.est ? 'Baho (to‘g‘ridan-to‘g‘ri o‘lchanmagan)' : 'Tadqiqotda o‘lchangan'}>
                {a.est ? '≈' : ''}
                {Math.round(a.mvic)}%
              </span>
            </button>
          ))}
        </div>
        <div className="act-legend tiny muted" aria-hidden="true">
          <span>0</span>
          <i />
          <span>100%+</span>
        </div>
        {act.rom && (
          <p className="small">
            <b>Harakat bo‘ylab:</b> {act.rom}
          </p>
        )}
        {!act.fallback && (
          <p className="tiny muted">
            {measured ? `${measured} ta qiymat tadqiqotda to‘g‘ridan-to‘g‘ri o‘lchangan, ` : ''}≈ belgili qiymatlar — tadqiqotlardagi oraliq, nisbiy farq yoki o‘xshash mashq asosidagi baho.
          </p>
        )}
        {act.fallback ? (
          <p className="small muted">Bu mashq bo‘yicha EMG ma’lumoti hali kiritilmagan — foizlar mashq tavsifidagi asosiy va yordamchi mushaklardan taxmin qilindi.</p>
        ) : similarName ? (
          <p className="small muted">Bu mashqning o‘zi bo‘yicha EMG tadqiqot topilmadi — «{similarName}» natijalari asosida taxmin.</p>
        ) : null}
        {act.notes && <p className="tiny muted">{act.notes}</p>}
        <p className="tiny faint">
          % MVIC — mushakning shu mashqdagi elektr faolligi uning maksimal ixtiyoriy izometrik qisqarishiga nisbatan (sirt EMG). Og‘ir dinamik harakatlarda 100% dan oshishi mumkin. Bu mushak qanchalik
          "yollanganini" ko‘rsatadi; mushak o‘sishi esa umumiy hajm, cho‘zilish va charchoqqa ham bog‘liq.{act.load ? ` Yuklama: ${act.load}.` : ''}
        </p>
        {srcKeys.length > 0 && (
          <div>
            <button className="row gap-6 small strong" style={{ color: 'var(--blue-2)', minHeight: 36 }} onClick={() => setShowSrc((s) => !s)} aria-expanded={showSrc}>
              Manbalar ({srcKeys.length}) <Icon name={showSrc ? 'up' : 'down'} size={14} />
            </button>
            {showSrc && (
              <ul className="src-list">
                {srcKeys.map((k) => {
                  const s = EMG_SOURCES[k];
                  return (
                    <li key={k} className="tiny muted">
                      {s.cite}
                      {s.doi ? (
                        <>
                          {' '}
                          <a href={`https://doi.org/${s.doi}`} target="_blank" rel="noreferrer">
                            doi:{s.doi}
                          </a>
                        </>
                      ) : null}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        )}
        <p className="tiny faint">3D model: Z-Anatomy (BodyParts3D asosida, © DBCLS), CC BY-SA 4.0.</p>
      </div>
    </div>
  );
}
