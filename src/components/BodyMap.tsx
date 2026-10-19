// Tana xaritasi (old va orqa): mushakni tanlash, ishlayotgan mushaklarni yoki tiklanishni ko‘rsatish.
// Anatomik atlas uslubida: barcha mushaklar chegaralari ko'rinadi, faollari rang bilan ajraladi.
import { useMemo } from 'react';
import { MUSCLES } from '../data/catalog';
import { frontBody } from './figure/body';
import { solveFront, type FrontSkeleton } from '../lib/figure';
import type { MuscleId } from '../types';

const POSE = { ua: 168, fa: 172, th: 182, sh: 178 };
const FRONT_IDS: MuscleId[] = ['traps', 'lats', 'chest', 'sideDelts', 'frontDelts', 'biceps', 'forearms', 'abs', 'obliques', 'adductors', 'quads', 'calves'];
const BACK_IDS: MuscleId[] = ['traps', 'upperBack', 'lats', 'sideDelts', 'rearDelts', 'triceps', 'forearms', 'lowerBack', 'glutes', 'adductors', 'hamstrings', 'calves'];

export interface BodyMapProps {
  primary?: MuscleId[];
  secondary?: MuscleId[];
  /** tiklanish: 0 (charchagan) .. 1 (tiklangan) */
  recovery?: Partial<Record<MuscleId, number>>;
  selected?: MuscleId[];
  onSelect?: (m: MuscleId) => void;
  views?: ('front' | 'back')[];
  height?: number;
  showLabels?: boolean;
}

function recoveryColor(v: number) {
  if (v < 0.45) return 'var(--red)';
  if (v < 0.8) return 'var(--yellow)';
  return 'var(--green)';
}

/** Tananing bir rangli silueti (xaritalar uchun) */
export function BodySilhouette({ sk, back, fill = 'var(--map-body)' }: { sk: FrontSkeleton; back: boolean; fill?: string }) {
  const fb = useMemo(() => frontBody(sk, back), [sk, back]);
  const parts = [...fb.arms, ...fb.legs, ...fb.torso, ...fb.head.filter((p) => p.fill !== 'var(--hair)')];
  return (
    <g>
      <g stroke="var(--map-edge)" strokeWidth={1.6} fill="none" strokeLinejoin="round">
        {parts.map((p, i) => (
          <path key={i} d={p.d} />
        ))}
      </g>
      <g fill={fill}>
        {parts.map((p, i) => (
          <path key={i} d={p.d} />
        ))}
      </g>
      <g fill="none" stroke="var(--map-groove)" strokeWidth={0.6} strokeLinecap="round">
        {[...fb.grooves, ...fb.armGrooves].map((d, i) => (
          <path key={i} d={d} />
        ))}
      </g>
    </g>
  );
}

export function BodyMap({ primary = [], secondary = [], recovery, selected = [], onSelect, views = ['front', 'back'], height = 260, showLabels = true }: BodyMapProps) {
  const sk = useMemo(() => solveFront(POSE, 50, 214), []);
  const shapes = useMemo(() => {
    const out: Record<'front' | 'back', Partial<Record<MuscleId, { d: string }[]>>> = { front: {}, back: {} };
    for (const v of ['front', 'back'] as const) {
      const fb = frontBody(sk, v === 'back');
      for (const id of v === 'back' ? BACK_IDS : FRONT_IDS) out[v][id] = [...(fb.muscles[id] ?? []), ...(fb.armMuscles[id] ?? []), ...(fb.late[id] ?? [])];
    }
    return out;
  }, [sk]);
  const rankOf = (id: MuscleId) => (primary.includes(id) || selected.includes(id) ? 2 : secondary.includes(id) ? 1 : 0);
  const body = (v: 'front' | 'back') => (
    <g>
      <BodySilhouette sk={sk} back={v === 'back'} />
      {[...(v === 'back' ? BACK_IDS : FRONT_IDS)]
        .sort((a, b) => rankOf(a) - rankOf(b))
        .map((id) => {
          const isP = primary.includes(id);
          const isS = secondary.includes(id);
          const isSel = selected.includes(id);
          let fill = 'var(--map-muscle)';
          let glow = false;
          if (recovery && recovery[id] !== undefined) fill = recoveryColor(recovery[id]!);
          if (isS) fill = 'var(--muscle-secondary)';
          if (isP || isSel) {
            fill = 'var(--muscle-primary)';
            glow = true;
          }
          const list = shapes[v][id] ?? [];
          return (
            <g
              key={id}
              onClick={onSelect ? () => onSelect(id) : undefined}
              style={{ cursor: onSelect ? 'pointer' : undefined }}
              role={onSelect ? 'button' : undefined}
              aria-label={onSelect ? MUSCLES[id].name : undefined}
              aria-pressed={onSelect ? isSel : undefined}
              tabIndex={onSelect ? 0 : undefined}
              onKeyDown={onSelect ? (e) => (e.key === 'Enter' || e.key === ' ') && onSelect(id) : undefined}
            >
              {glow && list.map((s, i) => <path key={`g${i}`} d={s.d} fill="var(--muscle-primary)" opacity={0.35} filter="url(#bm-glow)" />)}
              {list.map((s, i) => (
                <path key={i} d={s.d} fill={fill} stroke="var(--map-body)" strokeWidth={0.7} opacity={fill === 'var(--map-muscle)' ? 1 : 0.95} />
              ))}
            </g>
          );
        })}
    </g>
  );
  return (
    <div className="row center" style={{ gap: 8 }}>
      {views.map((v) => (
        <div key={v} className="stack" style={{ alignItems: 'center', gap: 4 }}>
          <svg viewBox="2 20 96 202" height={height} style={{ width: 'auto', maxWidth: '100%', overflow: 'visible' }}>
            <defs>
              <filter id="bm-glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="2.4" />
              </filter>
            </defs>
            {body(v)}
          </svg>
          {showLabels && <span className="eyebrow">{v === 'front' ? 'Old' : 'Orqa'}</span>}
        </div>
      ))}
    </div>
  );
}
