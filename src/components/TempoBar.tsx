// Takror tempi: har bir faza davomiyligi (soniya) va animatsiya bilan birga yuruvchi ko'rsatkich.
import { useCallback, useMemo, useRef } from 'react';
import { totalDuration } from '../lib/figure';
import type { AnimSpec, Phase } from '../types';

const META: Record<Phase, { label: string; color: string }> = {
  down: { label: 'Nazorat', color: 'var(--blue)' },
  up: { label: 'Kuch', color: 'var(--red)' },
  hold: { label: 'Pauza', color: 'var(--surface-3)' },
  squeeze: { label: 'Qisish', color: 'var(--yellow)' },
};

function segments(spec: AnimSpec) {
  const out: { phase: Phase; dur: number }[] = [];
  for (const f of spec.frames) {
    const last = out[out.length - 1];
    if (last && last.phase === f.phase) last.dur += f.dur;
    else out.push({ phase: f.phase, dur: f.dur });
  }
  return out;
}

/** Figuraning onTick'iga ulanadi; ko'rsatkich DOM orqali siljiydi (sahifa qayta chizilmaydi) */
export function useTempo(spec: AnimSpec) {
  const head = useRef<HTMLDivElement>(null);
  const total = useMemo(() => totalDuration(spec.frames), [spec]);
  const onTick = useCallback(
    (t: number) => {
      if (!head.current) return;
      const k = (((t % total) + total) % total) / total;
      head.current.style.left = `${(k * 100).toFixed(2)}%`;
    },
    [total],
  );
  return { head, onTick };
}

export function TempoBar({ spec, head }: { spec: AnimSpec; head: React.RefObject<HTMLDivElement | null> }) {
  const segs = useMemo(() => segments(spec), [spec]);
  const total = segs.reduce((a, s) => a + s.dur, 0);
  return (
    <div className="tempo" aria-label="Takror tempi">
      <div className="tempo-track">
        {segs.map((s, i) => (
          <i key={i} style={{ flex: s.dur, background: META[s.phase].color }} />
        ))}
        <div ref={head} className="tempo-head" />
      </div>
      <div className="tempo-labels">
        {segs.map((s, i) => (
          <span key={i} style={{ flex: s.dur, minWidth: 0 }}>
            {s.dur / total > 0.14 && (
              <>
                {META[s.phase].label} <b className="num">{(s.dur / 1000).toFixed(1)} s</b>
              </>
            )}
          </span>
        ))}
      </div>
    </div>
  );
}
