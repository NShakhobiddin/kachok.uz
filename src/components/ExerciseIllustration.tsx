// Mashq illyustratsiyasi: rasm ustida mushak nomlari va EMG foizlari yoki texnika belgilari.
import { useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import type { Illustration } from '../data/illustrations';
import { M3_INFO, type M3 } from '../data/muscles3d';
import { activationFor, heatColor } from '../engine/activation';
import type { Exercise } from '../types';

export type IlluLayer = 'muscles' | 'form';

export function ExerciseIllustration({ ex, ill, layer }: { ex: Exercise; ill: Illustration; layer: IlluLayer }) {
  const act = useMemo(() => activationFor(ex), [ex]);
  if (layer === 'muscles' && !ill.labels) return <LegendIllustration ill={ill} top={act.list.slice(0, 4)} />;
  if (layer === 'form' && !ill.checks) return <CuesIllustration ill={ill} cues={ex.cues} />;
  return <LabeledIllustration key={layer} ill={ill} layer={layer} act={act.list} />;
}

interface Placed {
  id: string;
  x: number;
  y: number;
  side: 'l' | 'r';
  ly: number;
}

/**
 * Yorliqlar rasm ustida, chiziq bilan mushak yoki texnika nuqtasiga ulangan.
 * Qutilar balandligi o'lchanib, bir ustunda ustma-ust tushsa — pastga suriladi (rasm chetidan chiqsa — tepaga).
 */
function LabeledIllustration({ ill, layer, act }: { ill: Illustration; layer: IlluLayer; act: ReturnType<typeof activationFor>['list'] }) {
  const acts = useMemo(() => new Map(act.map((a) => [a.key, a])), [act]);
  const [loaded, setLoaded] = useState(false);
  const [adj, setAdj] = useState<Record<string, number>>({});
  const fig = useRef<HTMLElement>(null);
  const items: Placed[] =
    layer === 'muscles'
      ? (ill.labels ?? []).filter((l) => acts.has(l.key)).map((l) => ({ id: l.key, x: l.x, y: l.y, side: l.side, ly: l.ly }))
      : (ill.checks ?? []).map((k) => ({ id: k.text, x: k.x, y: k.y, side: k.side, ly: k.ly }));

  useLayoutEffect(() => {
    const el = fig.current;
    if (!el) return;
    const layout = () => {
      const H = el.clientHeight;
      if (!H) return;
      const next: Record<string, number> = {};
      const GAP = 0.8;
      for (const side of ['l', 'r'] as const) {
        const boxes = [...el.querySelectorAll<HTMLElement>(`[data-side="${side}"]`)]
          .map((b) => ({ id: b.dataset.id!, want: Number(b.dataset.ly), h: (b.offsetHeight / H) * 100 }))
          .sort((a, b) => a.want - b.want);
        let floor = 1;
        const tops = boxes.map((b) => {
          const top = Math.max(b.want - b.h / 2, floor);
          floor = top + b.h + GAP;
          return top;
        });
        let ceil = 99;
        for (let i = boxes.length - 1; i >= 0; i--) {
          if (tops[i] + boxes[i].h > ceil) tops[i] = ceil - boxes[i].h;
          ceil = tops[i] - GAP;
        }
        boxes.forEach((b, i) => (next[b.id] = Math.round((tops[i] + b.h / 2) * 10) / 10));
      }
      setAdj((prev) => (JSON.stringify(prev) === JSON.stringify(next) ? prev : next));
    };
    layout();
    const ro = new ResizeObserver(layout);
    ro.observe(el);
    return () => ro.disconnect();
  }, [ill, layer]);

  const col = (side: 'l' | 'r') => (side === 'l' ? 27 : 73);
  const at = (p: Placed) => adj[p.id] ?? p.ly;
  return (
    <figure ref={fig} className={`illu ${loaded ? 'loaded' : ''}`}>
      <img src={ill.src} alt={ill.alt} loading="lazy" decoding="async" onLoad={() => setLoaded(true)} />
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        {items.map((p) => {
          const c = layer === 'muscles' ? heatColor(acts.get(p.id as M3)!.mvic) : '#d4fa50';
          return layer === 'muscles' ? (
            <g key={p.id}>
              <line x1={p.x} y1={p.y} x2={col(p.side)} y2={at(p)} stroke={c} strokeWidth={0.35} opacity={0.9} />
              <circle cx={p.x} cy={p.y} r={1.2} fill={c} />
              <circle cx={p.x} cy={p.y} r={2.3} fill="none" stroke={c} strokeWidth={0.35} opacity={0.7} />
            </g>
          ) : (
            <g key={p.id}>
              <line x1={p.x} y1={p.y} x2={col(p.side)} y2={at(p)} stroke={c} strokeWidth={0.3} opacity={0.75} />
              <circle cx={p.x} cy={p.y} r={1.9} fill="none" stroke={c} strokeWidth={0.45} />
            </g>
          );
        })}
      </svg>
      {layer === 'muscles'
        ? (ill.labels ?? []).map((l) => {
            const a = acts.get(l.key);
            if (!a) return null;
            return (
              <Link
                key={l.key}
                to={`/muscle/${l.key}`}
                className={`illu-lab ${l.side}`}
                data-id={l.key}
                data-side={l.side}
                data-ly={l.ly}
                style={{ top: `${adj[l.key] ?? l.ly}%` }}
                aria-label={`${M3_INFO[l.key].name}: ${Math.round(a.mvic)}% — mushak haqida`}
              >
                <span>{l.name ?? M3_INFO[l.key].name}</span>
                <b style={{ color: heatColor(a.mvic) }}>
                  {a.est ? '≈' : ''}
                  {Math.round(a.mvic)}%
                </b>
              </Link>
            );
          })
        : (ill.checks ?? []).map((k) => (
            <span key={k.text} className={`illu-chk ${k.side}`} data-id={k.text} data-side={k.side} data-ly={k.ly} style={{ top: `${adj[k.text] ?? k.ly}%` }}>
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
      <figure className="illu loaded">
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
      <figure className="illu loaded">
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
