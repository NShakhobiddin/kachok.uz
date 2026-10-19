// Mashg'ulot paytida mashq tarixi: kuch trendi, oxirgi mashg'ulotlar, har takror soni uchun eng yaxshi vazn.
import { useMemo } from 'react';
import { exerciseHistory, fmtKg } from '../engine/progression';
import { e1rmFromSet, pct1rm } from '../engine/rpe';
import { exerciseSeries } from '../engine/stats';
import { fmtDate } from '../lib/date';
import { useStore } from '../store/useStore';
import type { Exercise } from '../types';
import { LineChart } from './charts';

export function HistorySheet({ ex }: { ex: Exercise }) {
  const logs = useStore((s) => s.logs);
  const hist = useMemo(() => exerciseHistory(ex.id, logs), [ex.id, logs]);
  const series = useMemo(() => exerciseSeries(ex.id, logs), [ex.id, logs]);
  const loaded = ex.loadType !== 'bodyweight' && ex.loadType !== 'band';
  const all = hist.flatMap((h) => h.sets.map((s) => ({ ...s, date: h.date })));
  const bestE1 = loaded && all.length ? Math.max(...all.map((s) => e1rmFromSet(s.kg, s.reps, s.rir))) : 0;
  const heaviest = all.length ? all.reduce((a, b) => (b.kg > a.kg || (b.kg === a.kg && b.reps > a.reps) ? b : a)) : null;
  const bestVolume = all.length ? all.reduce((a, b) => (b.kg * b.reps > a.kg * a.reps ? b : a)) : null;
  const mostReps = all.length ? all.reduce((a, b) => (b.reps > a.reps ? b : a)) : null;
  // har takror soni uchun eng og'ir vazn — aynan shu takror soni bilan bajarilgan setlardan
  const repMax = Array.from({ length: 12 }, (_, i) => {
    const r = i + 1;
    const real = all.filter((s) => s.reps === r).reduce((m, s) => Math.max(m, s.kg), 0);
    return { r, real, est: bestE1 ? Math.round(bestE1 * pct1rm(r, 0) * 2) / 2 : 0 };
  });

  if (!hist.length)
    return (
      <div className="stack gap-8">
        <h3 className="title">{ex.name}</h3>
        <p className="muted">Hali tarix yo‘q. Birinchi mashg‘ulotdan keyin bu yerda kuch trendi, oxirgi natijalar va rekordlar paydo bo‘ladi.</p>
      </div>
    );

  return (
    <div className="stack gap-16">
      <div>
        <h3 className="title">{ex.name}</h3>
        <p className="small muted">{hist.length} ta mashg‘ulot</p>
      </div>

      {loaded && series.length >= 2 && (
        <div className="stack gap-6">
          <span className="eyebrow">Taxminiy 1RM trendi</span>
          <LineChart label={`${ex.name}: taxminiy 1RM`} series={series.map((s) => ({ t: new Date(s.date).getTime(), v: s.e1rm }))} unit="kg" height={130} fmtX={(t) => fmtDate(new Date(t))} />
        </div>
      )}

      <div className="grid-2">
        {loaded && bestE1 > 0 && <Rec label="Taxminiy 1RM" value={`${Math.round(bestE1)} kg`} />}
        {heaviest && loaded && <Rec label="Eng og‘ir set" value={`${fmtKg(heaviest.kg)}×${heaviest.reps}`} sub={fmtDate(heaviest.date)} />}
        {bestVolume && loaded && <Rec label="Eng katta hajmli set" value={`${fmtKg(bestVolume.kg * bestVolume.reps)} kg`} sub={`${fmtKg(bestVolume.kg)}×${bestVolume.reps}`} />}
        {mostReps && <Rec label="Eng ko‘p takror" value={`${mostReps.reps}`} sub={loaded ? `${fmtKg(mostReps.kg)} kg bilan` : fmtDate(mostReps.date)} />}
      </div>

      <div className="stack gap-6">
        <span className="eyebrow">Oxirgi mashg‘ulotlar</span>
        {hist.slice(0, 3).map((h) => (
          <div key={h.date} className="row between gap-12 small" style={{ padding: '8px 0', borderBottom: '1px solid var(--line)' }}>
            <span className="muted" style={{ flex: 'none' }}>
              {fmtDate(h.date)}
            </span>
            <span className="num" style={{ textAlign: 'right' }}>
              {h.sets.map((s) => `${loaded ? fmtKg(s.kg) + '×' : ''}${s.reps}${s.rir !== undefined ? `@${s.rir}` : ''}`).join('  ·  ')}
            </span>
          </div>
        ))}
      </div>

      {loaded && (
        <div className="stack gap-6">
          <span className="eyebrow">Takror soni bo‘yicha eng yaxshi vazn</span>
          <div className="rm-grid">
            {repMax.map(({ r, real, est }) => (
              <div key={r} className="rm-cell">
                <span className="tiny faint">{r}RM</span>
                {real ? <b className="num">{fmtKg(real)}</b> : est ? <span className="num faint">≈{fmtKg(est)}</span> : <span className="faint">—</span>}
              </div>
            ))}
          </div>
          <p className="tiny faint">Qalin — aynan shu takror soni bilan ko‘targan eng og‘ir vazningiz; ≈ — taxminiy 1RM dan RPE jadvali bo‘yicha (chegaragacha) hisoblangan.</p>
        </div>
      )}
    </div>
  );
}

function Rec({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="card tight">
      <div className="tiny muted">{label}</div>
      <div className="strong num mt-4" style={{ fontSize: 18 }}>
        {value}
      </div>
      {sub && <div className="tiny faint">{sub}</div>}
    </div>
  );
}
