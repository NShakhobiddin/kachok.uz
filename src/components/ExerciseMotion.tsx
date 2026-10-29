// Mashq harakati: ikki kadr (boshlanish va harakatning ikkinchi cheti) navbatma-navbat, silliq almashadi.
// Kadrlar — bitta kamera va bitta odam bilan yaratilgan rasmlar; vaqt — mashq tempidan (tushirish sekinroq, ko'tarish tezroq).
import { useEffect, useMemo, useState } from 'react';
import type { Illustration } from '../data/illustrations';
import { usePrefersReducedMotion } from '../lib/hooks';
import type { Exercise, Phase } from '../types';
import { Icon } from './ui/Icon';

interface Frame {
  src: string;
  phase: string;
}

/** boshlanish kadri birinchi: "Boshlang‘ich holat" bo'lsa — u; aks holda mashq qaysi fazadan boshlanishiga qarab (o'tirish — yuqoridan, tortish — pastdan) */
export function motionFrames(ex: Exercise, ill: Illustration): Frame[] {
  const main = { src: ill.src, phase: ill.phase };
  if (!ill.pair) return [main];
  const pair = ill.pair;
  const START = 'Boshlang‘ich holat';
  if (main.phase === START) return [main, pair];
  if (pair.phase === START) return [pair, main];
  const first = ex.anim.frames.find((f) => f.phase === 'down' || f.phase === 'up')?.phase;
  const isBottom = (f: Frame) => f.phase === 'Pastki nuqta';
  // avval tushiriladigan mashqda (o'tirish, jim) boshlanish — yuqori holat; avval ko'tariladiganda (tortish, bukish) — pastki
  const startIsBottom = first === 'up';
  return isBottom(main) === startIsBottom ? [main, pair] : [pair, main];
}

/** mashq tempidan: birinchi va ikkinchi harakat davomiyligi (ms) va qaysi biri kuch fazasi */
function tempo(ex: Exercise) {
  const segs: { phase: Phase; dur: number }[] = [];
  for (const f of ex.anim.frames) {
    const last = segs[segs.length - 1];
    if (last && last.phase === f.phase) last.dur += f.dur;
    else segs.push({ phase: f.phase, dur: f.dur });
  }
  const moves = segs.filter((s) => s.phase === 'up' || s.phase === 'down');
  const clamp = (v: number) => Math.min(2200, Math.max(700, v));
  return {
    go: { phase: moves[0]?.phase ?? 'down', ms: clamp(moves[0]?.dur ?? 1200) },
    back: { phase: moves[1]?.phase ?? 'up', ms: clamp(moves[1]?.dur ?? 900) },
  };
}

const CUE: Record<'up' | 'down', string> = {
  up: 'Kuch bilan · nafas chiqaring',
  down: 'Nazorat bilan · nafas oling',
};

export function ExerciseMotion({ ex, ill, compact = false }: { ex: Exercise; ill: Illustration; compact?: boolean }) {
  const frames = useMemo(() => motionFrames(ex, ill), [ex, ill]);
  const t = useMemo(() => tempo(ex), [ex]);
  const reduced = usePrefersReducedMotion();
  const [playing, setPlaying] = useState(!reduced);
  const [slow, setSlow] = useState(false);
  // kadrlar orasidagi almashish qisqa (ikki rasm ustma-ust ko'rinmasin), holatda turish — tempo bo'yicha
  // 0 — boshlanishda turish, 1 — ikkinchi chetga o'tish, 2 — u yerda turish, 3 — qaytish
  const [step, setStep] = useState<0 | 1 | 2 | 3>(0);
  const [frozen, setFrozen] = useState(0);
  const k = slow ? 2 : 1;
  const two = frames.length === 2;
  const FADE = 380;

  useEffect(() => {
    if (!playing || !two) return;
    const wait = step === 0 ? t.go.ms * k : step === 2 ? t.back.ms * k : FADE * k;
    const id = window.setTimeout(() => setStep((s) => ((s + 1) % 4) as 0 | 1 | 2 | 3), wait);
    return () => window.clearTimeout(id);
  }, [playing, step, two, k, t]);

  const at = !two ? 0 : playing ? (step === 1 || step === 2 ? 1 : 0) : frozen;
  // harakat yo'nalishi: boshlanishdan ikkinchi chetga — birinchi faza (masalan, tushirish), qaytish — ikkinchi
  const moving: 'up' | 'down' | null = !playing || !two ? null : ((step === 0 || step === 1 ? t.go.phase : t.back.phase) as 'up' | 'down');
  const pick = (i: number) => {
    setPlaying(false);
    setFrozen(i);
  };
  const toggle = () => {
    if (!playing) setStep(0);
    setPlaying((p) => !p);
  };

  return (
    <div className={`motion ${compact ? 'compact' : ''}`}>
      <figure className="illu motion-stage" aria-label={`${ex.name}: ${frames.map((f) => f.phase.toLowerCase()).join(' → ')}`}>
        <img src={frames[0].src} alt={ill.alt} decoding="async" />
        {two && <img src={frames[1].src} alt="" aria-hidden="true" decoding="async" className="motion-top" style={{ opacity: at, transitionDuration: `${FADE * k}ms` }} />}
        <figcaption className="illu-phase">{frames[at].phase}</figcaption>
        {moving && <span className={`motion-cue ${moving}`}>{CUE[moving]}</span>}
      </figure>
      {two && (
        <div className="motion-bar">
          <div className="segmented motion-seg" role="radiogroup" aria-label="Holat">
            {frames.map((f, i) => (
              <button key={f.src} role="radio" aria-checked={!playing && at === i} className={!playing && at === i ? 'on' : ''} onClick={() => pick(i)}>
                {i + 1}. {f.phase}
              </button>
            ))}
          </div>
          {!compact && (
            <button className="chip sm" onClick={() => setSlow((s) => !s)} aria-label="Tezlik" aria-pressed={slow}>
              {slow ? '0.5×' : '1×'}
            </button>
          )}
          <button className="icon-btn filled" style={{ width: 40, height: 40 }} onClick={toggle} aria-label={playing ? 'To‘xtatish' : 'Harakatni ko‘rsatish'}>
            <Icon name={playing ? 'pause' : 'play'} size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
