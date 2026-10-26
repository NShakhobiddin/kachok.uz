// Grafikalar: ingichka belgilar, sezilmas to‘r, sichqoncha/barmoq bilan ko‘rsatkich.
import { useEffect, useRef, useState } from 'react';

const BLUE = 'var(--blue)';

function useWidth(initial = 320) {
  const ref = useRef<HTMLDivElement>(null);
  const [w, setW] = useState(initial);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setW(el.clientWidth || initial));
    ro.observe(el);
    setW(el.clientWidth || initial);
    return () => ro.disconnect();
  }, [initial]);
  return [ref, w] as const;
}

function niceMax(v: number) {
  if (v <= 0) return 1;
  const p = Math.pow(10, Math.floor(Math.log10(v)));
  const n = v / p;
  const s = n <= 1 ? 1 : n <= 2 ? 2 : n <= 2.5 ? 2.5 : n <= 5 ? 5 : 10;
  return s * p;
}

function compact(n: number) {
  if (n >= 1000) return `${Math.round(n / 100) / 10}K`;
  return String(Math.round(n * 10) / 10);
}

/* ---------- Ustunli grafika (bitta seriya) ---------- */

export function ColumnChart({ data, height = 150, unit = '', refValue: refLine, refLabel, label }: { data: { label: string; value: number; note?: string; highlight?: boolean }[]; height?: number; unit?: string; refValue?: number; refLabel?: string; label: string }) {
  const [box, W] = useWidth();
  const [hover, setHover] = useState<number | null>(null);
  const pad = { l: 30, r: 6, t: 14, b: 22 };
  const max = niceMax(Math.max(...data.map((d) => d.value), refLine ?? 0, 1));
  const iw = W - pad.l - pad.r;
  const ih = height - pad.t - pad.b;
  const band = iw / Math.max(1, data.length);
  const bw = Math.min(24, band * 0.56);
  const y = (v: number) => pad.t + ih - (v / max) * ih;
  return (
    <div ref={box} style={{ position: 'relative' }}>
      <svg width={W} height={height} role="img" aria-label={label}>
        {[0, 0.5, 1].map((t) => (
          <g key={t}>
            <line x1={pad.l} x2={W - pad.r} y1={y(max * t)} y2={y(max * t)} stroke="var(--line)" strokeWidth={1} />
            <text x={pad.l - 6} y={y(max * t) + 4} textAnchor="end" fontSize={10} fill="var(--text-3)" className="num">
              {compact(max * t)}
            </text>
          </g>
        ))}
        {refLine !== undefined && (
          <g>
            <line x1={pad.l} x2={W - pad.r} y1={y(refLine)} y2={y(refLine)} stroke="var(--text-2)" strokeWidth={1} />
            {refLabel && (
              <text x={W - pad.r} y={y(refLine) - 4} textAnchor="end" fontSize={10} fill="var(--text-2)">
                {refLabel}
              </text>
            )}
          </g>
        )}
        {data.map((d, i) => {
          const cx = pad.l + band * i + band / 2;
          const h = Math.max(d.value > 0 ? 3 : 0, (d.value / max) * ih);
          const top = pad.t + ih - h;
          const r = Math.min(4, h);
          const path = h > 0 ? `M${cx - bw / 2} ${pad.t + ih} V${top + r} Q${cx - bw / 2} ${top} ${cx - bw / 2 + r} ${top} H${cx + bw / 2 - r} Q${cx + bw / 2} ${top} ${cx + bw / 2} ${top + r} V${pad.t + ih} Z` : '';
          return (
            <g key={i} onPointerEnter={() => setHover(i)} onPointerLeave={() => setHover(null)} onFocus={() => setHover(i)} onBlur={() => setHover(null)} tabIndex={0}>
              <rect x={pad.l + band * i} y={pad.t} width={band} height={ih} fill="transparent" />
              {h > 0 && <path d={path} fill={BLUE} opacity={hover === null || hover === i ? (d.highlight === false ? 0.45 : 1) : 0.5} />}
              <text x={cx} y={height - 6} textAnchor="middle" fontSize={10} fill={d.highlight ? 'var(--text)' : 'var(--text-3)'} fontWeight={d.highlight ? 700 : 400}>
                {d.label}
              </text>
            </g>
          );
        })}
      </svg>
      {hover !== null && (
        <div className="tooltip" style={{ left: pad.l + band * hover + band / 2, top: y(data[hover].value) }}>
          <b className="num">
            {compact(data[hover].value)} {unit}
          </b>
          {data[hover].note && <div className="faint">{data[hover].note}</div>}
        </div>
      )}
    </div>
  );
}

/* ---------- Chiziqli grafika ---------- */

export interface LinePoint {
  t: number; // vaqt (ms)
  v: number;
}

export function LineChart({ series, dots, height = 170, unit = '', label, fmtX }: { series: LinePoint[]; dots?: LinePoint[]; height?: number; unit?: string; label: string; fmtX: (t: number) => string }) {
  const [box, W] = useWidth();
  const [hover, setHover] = useState<number | null>(null);
  const pad = { l: 34, r: 12, t: 12, b: 22 };
  const all = [...series, ...(dots ?? [])];
  if (all.length === 0) return null;
  const minT = Math.min(...all.map((p) => p.t));
  const maxT = Math.max(...all.map((p) => p.t));
  let minV = Math.min(...all.map((p) => p.v));
  let maxV = Math.max(...all.map((p) => p.v));
  const span = Math.max(1, maxV - minV);
  minV = Math.floor(minV - span * 0.15);
  maxV = Math.ceil(maxV + span * 0.15);
  const iw = W - pad.l - pad.r;
  const ih = height - pad.t - pad.b;
  const x = (t: number) => pad.l + (maxT === minT ? iw / 2 : ((t - minT) / (maxT - minT)) * iw);
  const y = (v: number) => pad.t + ih - ((v - minV) / (maxV - minV)) * ih;
  const d = series.map((p, i) => `${i ? 'L' : 'M'}${x(p.t).toFixed(1)} ${y(p.v).toFixed(1)}`).join(' ');
  const area = series.length > 1 ? `${d} L${x(series[series.length - 1].t)} ${pad.t + ih} L${x(series[0].t)} ${pad.t + ih} Z` : '';
  const onMove = (e: React.PointerEvent<SVGSVGElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const px = e.clientX - r.left;
    let best = 0;
    series.forEach((p, i) => {
      if (Math.abs(x(p.t) - px) < Math.abs(x(series[best].t) - px)) best = i;
    });
    setHover(best);
  };
  const ticks = [minV, (minV + maxV) / 2, maxV];
  const last = series[series.length - 1];
  return (
    <div ref={box} style={{ position: 'relative' }}>
      <svg width={W} height={height} role="img" aria-label={label} onPointerMove={onMove} onPointerLeave={() => setHover(null)} style={{ touchAction: 'pan-y' }}>
        {ticks.map((t, i) => (
          <g key={i}>
            <line x1={pad.l} x2={W - pad.r} y1={y(t)} y2={y(t)} stroke="var(--line)" strokeWidth={1} />
            <text x={pad.l - 6} y={y(t) + 4} textAnchor="end" fontSize={10} fill="var(--text-3)" className="num">
              {compact(t)}
            </text>
          </g>
        ))}
        <text x={pad.l} y={height - 6} fontSize={10} fill="var(--text-3)">
          {fmtX(minT)}
        </text>
        <text x={W - pad.r} y={height - 6} textAnchor="end" fontSize={10} fill="var(--text-3)">
          {fmtX(maxT)}
        </text>
        {area && <path d={area} fill={BLUE} opacity={0.1} />}
        {dots?.map((p, i) => (
          <circle key={i} cx={x(p.t)} cy={y(p.v)} r={3} fill="var(--text-3)" stroke="var(--surface)" strokeWidth={2} />
        ))}
        <path d={d} fill="none" stroke={BLUE} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
        {last && <circle cx={x(last.t)} cy={y(last.v)} r={4.5} fill={BLUE} stroke="var(--surface)" strokeWidth={2} />}
        {last && (
          <text x={Math.min(W - pad.r, x(last.t))} y={y(last.v) - 10} textAnchor="end" fontSize={11} fontWeight={700} fill="var(--text)" className="num">
            {compact(last.v)} {unit}
          </text>
        )}
        {hover !== null && series[hover] && (
          <g>
            <line x1={x(series[hover].t)} x2={x(series[hover].t)} y1={pad.t} y2={pad.t + ih} stroke="var(--line-2)" strokeWidth={1} />
            <circle cx={x(series[hover].t)} cy={y(series[hover].v)} r={5} fill={BLUE} stroke="var(--surface)" strokeWidth={2} />
          </g>
        )}
      </svg>
      {hover !== null && series[hover] && (
        <div className="tooltip" style={{ left: x(series[hover].t), top: y(series[hover].v) }}>
          <b className="num">
            {compact(series[hover].v)} {unit}
          </b>
          <div className="faint">{fmtX(series[hover].t)}</div>
        </div>
      )}
    </div>
  );
}

/* ---------- Gorizontal ustunlar + maqsad diapazoni ---------- */

/**
 * Haftalik setlar va hajm chegaralari (RP): MEV — minimal samarali, MAV — eng samarali oraliq, MRV — tiklanish chegarasi.
 */
export function TargetBars({ rows, label }: { rows: { label: string; value: number; mev: number; mav: [number, number]; mrv: number }[]; label: string }) {
  const max = niceMax(Math.max(...rows.map((r) => Math.max(r.value, r.mrv))) * 1.04);
  const STATUS = {
    low: { t: 'MEV dan kam', c: 'var(--text-2)' },
    ok: { t: 'Samarali', c: 'var(--green)' },
    high: { t: 'Yuqori', c: 'var(--yellow)' },
    over: { t: 'MRV dan ko‘p', c: 'var(--red)' },
  };
  return (
    <div className="stack gap-10" role="table" aria-label={label}>
      {rows.map((r) => {
        const st = r.value < r.mev ? 'low' : r.value <= r.mav[1] ? 'ok' : r.value <= r.mrv ? 'high' : 'over';
        return (
          <div key={r.label} role="row" className="stack gap-4">
            <div className="row between small">
              <span role="cell" className="strong">
                {r.label}
              </span>
              <span role="cell" className="num muted">
                {Math.round(r.value * 10) / 10} set{' '}
                <span className="tag" style={{ marginLeft: 6, color: STATUS[st].c }}>
                  {STATUS[st].t}
                </span>
              </span>
            </div>
            <div style={{ position: 'relative', height: 10, borderRadius: 6, background: 'var(--surface-2)' }} title={`MEV ${r.mev} · MAV ${r.mav[0]}–${r.mav[1]} · MRV ${r.mrv}`}>
              <div style={{ position: 'absolute', left: `${(r.mev / max) * 100}%`, width: `${((r.mav[1] - r.mev) / max) * 100}%`, top: 0, bottom: 0, background: 'var(--green-soft)', borderLeft: '1px solid var(--green)', borderRight: '1px solid var(--green)' }} />
              <div style={{ position: 'absolute', left: `${(r.mrv / max) * 100}%`, top: -2, bottom: -2, width: 2, background: 'var(--red)', opacity: 0.7, borderRadius: 1 }} />
              <div style={{ position: 'absolute', left: 0, top: 2, bottom: 2, width: `${Math.min(100, (r.value / max) * 100)}%`, background: BLUE, borderRadius: '0 4px 4px 0', transition: 'width .5s var(--ease-out)' }} />
            </div>
          </div>
        );
      })}
      <div className="row wrap gap-12 tiny faint">
        <span className="row gap-6">
          <i style={{ width: 14, height: 6, borderRadius: 3, background: BLUE, display: 'inline-block' }} /> Haftalik setlar
        </span>
        <span className="row gap-6">
          <i style={{ width: 14, height: 8, background: 'var(--green-soft)', border: '1px solid var(--green)', display: 'inline-block' }} /> MEV–MAV: samarali oraliq
        </span>
        <span className="row gap-6">
          <i style={{ width: 2, height: 10, background: 'var(--red)', display: 'inline-block' }} /> MRV: tiklanish chegarasi
        </span>
      </div>
    </div>
  );
}

/* ---------- Makronutrientlar (qism-butun) ---------- */

export const MACRO_COLORS = { p: '#d4fa50', c: '#e6e4da', f: '#ffb547' };

export function MacroBar({ p, f, c }: { p: number; f: number; c: number }) {
  const kp = p * 4;
  const kc = c * 4;
  const kf = f * 9;
  const tot = kp + kc + kf || 1;
  const segs = [
    { k: 'p', label: 'Oqsil', g: p, pct: kp / tot, color: MACRO_COLORS.p },
    { k: 'c', label: 'Uglevod', g: c, pct: kc / tot, color: MACRO_COLORS.c },
    { k: 'f', label: "Yog'", g: f, pct: kf / tot, color: MACRO_COLORS.f },
  ];
  return (
    <div className="stack gap-10">
      <div className="row" style={{ gap: 2, height: 12 }} role="img" aria-label={segs.map((s) => `${s.label} ${s.g} g (${Math.round(s.pct * 100)}%)`).join(', ')}>
        {segs.map((s, i) => (
          <div key={s.k} style={{ width: `${s.pct * 100}%`, height: '100%', background: s.color, borderRadius: i === 0 ? '6px 0 0 6px' : i === 2 ? '0 6px 6px 0' : 0 }} />
        ))}
      </div>
      <div className="grid-3">
        {segs.map((s) => (
          <div key={s.k} className="stack gap-4">
            <span className="row gap-6 small muted">
              <i className="dot" style={{ background: s.color }} />
              {s.label}
            </span>
            <span className="subtitle num">
              {s.g} g <span className="faint small">{Math.round(s.pct * 100)}%</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
