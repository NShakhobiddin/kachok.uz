// Tana xaritasi (old va orqa): ishlayotgan mushaklar, tiklanish yoki mushak tanlash.
// Tasvir 3D mushak modelidan render qilingan (scripts/bodymap): faol mushak chegarasi bo'yicha "lime" render kesib qo'yiladi,
// shuning uchun mushak shakli, tolalari va soyasi 3D ko'rinish bilan bir xil.
import { useId, useMemo } from 'react';
import { BODYMAP } from '../data/bodymap';
import { MUSCLES } from '../data/catalog';
import { frontBody } from './figure/body';
import type { FrontSkeleton } from '../lib/figure';
import type { MuscleId } from '../types';

const img = (view: 'front' | 'back', kind: 'base' | 'glow') => `${import.meta.env.BASE_URL}bodymap/${view}-${kind}.webp`;

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
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '');
  return (
    <div className="row center" style={{ gap: 8 }}>
      {views.map((v) => (
        <MapView key={v} uid={uid} view={v} primary={primary} secondary={secondary} recovery={recovery} selected={selected} onSelect={onSelect} height={height} label={showLabels} />
      ))}
    </div>
  );
}

function MapView({
  uid,
  view,
  primary,
  secondary,
  recovery,
  selected,
  onSelect,
  height,
  label,
}: Required<Pick<BodyMapProps, 'primary' | 'secondary' | 'selected' | 'height'>> & Pick<BodyMapProps, 'recovery' | 'onSelect'> & { uid: string; view: 'front' | 'back'; label: boolean }) {
  const m = BODYMAP[view];
  const ids = useMemo(() => Object.keys(m.paths) as MuscleId[], [m]);
  const lit = ids.filter((id) => primary.includes(id) || selected.includes(id));
  const half = ids.filter((id) => !lit.includes(id) && secondary.includes(id));
  const id = (k: string) => `bm${uid}${view}${k}`;
  const names = [...lit, ...half].map((x) => MUSCLES[x].name.toLowerCase());
  return (
    <div className="stack" style={{ alignItems: 'center', gap: 4 }}>
      <svg
        viewBox={`0 0 ${m.w} ${m.h}`}
        height={height}
        className="bodymap"
        style={{ width: 'auto', maxWidth: '100%', overflow: 'visible' }}
        role={onSelect ? 'group' : 'img'}
        aria-label={`${view === 'front' ? 'Old' : 'Orqa'} tomondan${names.length ? `: ${names.join(', ')}` : ''}`}
      >
        <defs>
          <clipPath id={id('p')}>
            {lit.map((k) => (
              <path key={k} d={m.paths[k]} />
            ))}
          </clipPath>
          <clipPath id={id('s')}>
            {half.map((k) => (
              <path key={k} d={m.paths[k]} />
            ))}
          </clipPath>
          <filter id={id('f')} x="-30%" y="-10%" width="160%" height="120%">
            <feGaussianBlur stdDeviation="7" />
          </filter>
        </defs>
        <image href={img(view, 'base')} width={m.w} height={m.h} />
        {recovery &&
          ids.map((k) =>
            recovery[k] !== undefined && !lit.includes(k) && !half.includes(k) ? <path key={k} d={m.paths[k]} fill={recoveryColor(recovery[k]!)} opacity={0.42} style={{ mixBlendMode: 'color' }} /> : null,
          )}
        {/* yordamchi mushaklar: o'sha lime render, lekin xiraroq (zaytun-lime) — qizil bilan aralashib qo'ng'ir bo'lmasin */}
        {half.length > 0 && (
          <g clipPath={`url(#${id('s')})`}>
            <image href={img(view, 'glow')} width={m.w} height={m.h} />
            <rect width={m.w} height={m.h} fill="#0b0b0c" opacity={0.42} />
          </g>
        )}
        {lit.length > 0 && (
          <>
            <g filter={`url(#${id('f')})`} opacity={0.6}>
              <image href={img(view, 'glow')} width={m.w} height={m.h} clipPath={`url(#${id('p')})`} />
            </g>
            <image href={img(view, 'glow')} width={m.w} height={m.h} clipPath={`url(#${id('p')})`} />
          </>
        )}
        {onSelect &&
          ids.map((k) => (
            <path
              key={k}
              d={m.paths[k]}
              className="bm-hit"
              role="button"
              tabIndex={0}
              aria-label={MUSCLES[k].name}
              aria-pressed={selected.includes(k)}
              onClick={() => onSelect(k)}
              onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), onSelect(k))}
            />
          ))}
      </svg>
      {label && <span className="eyebrow">{view === 'front' ? 'Old' : 'Orqa'}</span>}
    </div>
  );
}
