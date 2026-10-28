// Mashq illyustratsiyasi: rasm ustida mushak nomlari va EMG foizlari yoki texnika belgilari.
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import type { Illustration } from '../data/illustrations';
import { M3_INFO, type M3 } from '../data/muscles3d';
import { activationFor, heatColor } from '../engine/activation';
import type { Exercise } from '../types';

export type IlluLayer = 'muscles' | 'form';

export function ExerciseIllustration({ ex, ill, layer }: { ex: Exercise; ill: Illustration; layer: IlluLayer }) {
  const act = useMemo(() => activationFor(ex), [ex]);
  const acts = useMemo(() => new Map(act.list.map((a) => [a.key, a])), [act]);
  if (layer === 'muscles' && !ill.labels) return <LegendIllustration ill={ill} top={act.list.slice(0, 4)} />;
  if (layer === 'form' && !ill.checks) return <CuesIllustration ill={ill} cues={ex.cues} />;
  const labels = ill.labels ?? [];
  const checks = ill.checks ?? [];
  const [loaded, setLoaded] = useState(false);
  const col = (side: 'l' | 'r') => (side === 'l' ? 27 : 73);
  return (
    <figure className={`illu ${loaded ? 'ready' : ''}`}>
      <img src={ill.src} alt={ill.alt} loading="lazy" decoding="async" onLoad={() => setLoaded(true)} />
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        {layer === 'muscles'
          ? labels.map((l) => {
              const a = acts.get(l.key);
              if (!a) return null;
              const c = heatColor(a.mvic);
              return (
                <g key={l.key}>
                  <line x1={l.x} y1={l.y} x2={col(l.side)} y2={l.ly} stroke={c} strokeWidth={0.35} opacity={0.9} />
                  <circle cx={l.x} cy={l.y} r={1.2} fill={c} />
                  <circle cx={l.x} cy={l.y} r={2.3} fill="none" stroke={c} strokeWidth={0.35} opacity={0.7} />
                </g>
              );
            })
          : checks.map((k) => (
              <g key={k.text}>
                <line x1={k.x} y1={k.y} x2={col(k.side)} y2={k.ly} stroke="#d4fa50" strokeWidth={0.3} opacity={0.75} />
                <circle cx={k.x} cy={k.y} r={1.9} fill="none" stroke="#d4fa50" strokeWidth={0.45} />
              </g>
            ))}
      </svg>
      {layer === 'muscles'
        ? labels.map((l) => {
            const a = acts.get(l.key);
            if (!a) return null;
            return (
              <Link key={l.key} to={`/muscle/${l.key}`} className={`illu-lab ${l.side}`} style={{ top: `${l.ly}%` }} aria-label={`${M3_INFO[l.key].name}: ${Math.round(a.mvic)}% — mushak haqida`}>
                <span>{l.name ?? M3_INFO[l.key].name}</span>
                <b style={{ color: heatColor(a.mvic) }}>
                  {a.est ? '≈' : ''}
                  {Math.round(a.mvic)}%
                </b>
              </Link>
            );
          })
        : checks.map((k) => (
            <span key={k.text} className={`illu-chk ${k.side}`} style={{ top: `${k.ly}%` }}>
              <i aria-hidden="true">✓</i>
              {k.text}
            </span>
          ))}
      <figcaption className="illu-phase">{ill.phase}</figcaption>
    </figure>
  );
}

/** rasm ustidagi qisqa nom: qavs ichidagi izoh va "qismi" so'zisiz ("Ko‘krak mushagi — o‘rta (to‘sh) qismi" → "Ko‘krak mushagi — o‘rta") */
const shortName = (n: string) => n.replace(/ \(.*?\)/g, '').replace(/ qismi$/, '');

/** Yorliq joylari belgilanmagan rasm: eng faol mushaklar rasm ostida (har biri — mushak qo'llanmasiga havola) */
function LegendIllustration({ ill, top }: { ill: Illustration; top: { key: M3; mvic: number; est?: boolean }[] }) {
  return (
    <div className="stack gap-8">
      <figure className="illu ready">
        <img src={ill.src} alt={ill.alt} loading="lazy" decoding="async" />
        <figcaption className="illu-phase">{ill.phase}</figcaption>
      </figure>
      <div className="illu-legend">
        {top.map((a) => (
          <Link key={a.key} to={`/muscle/${a.key}`} className="illu-leg" aria-label={`${M3_INFO[a.key].name}: ${Math.round(a.mvic)}% — mushak haqida`}>
            <b style={{ color: heatColor(a.mvic) }}>
              {a.est ? '≈' : ''}
              {Math.round(a.mvic)}%
            </b>
            <span>{shortName(M3_INFO[a.key].name)}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

/** Texnika qatlami (belgilar joyi berilmagan): mashqning asosiy maslahatlari rasm ostida */
function CuesIllustration({ ill, cues }: { ill: Illustration; cues: string[] }) {
  return (
    <div className="stack gap-8">
      <figure className="illu ready">
        <img src={ill.src} alt={ill.alt} loading="lazy" decoding="async" />
        <figcaption className="illu-phase">{ill.phase}</figcaption>
      </figure>
      <ul className="illu-cues">
        {cues.slice(0, 4).map((c) => (
          <li key={c}>
            <i aria-hidden="true">✓</i>
            {c}
          </li>
        ))}
      </ul>
    </div>
  );
}
