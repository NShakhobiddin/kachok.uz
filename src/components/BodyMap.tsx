// Tana xaritasi (old va orqa): mushakni tanlash, ishlayotgan mushaklarni yoki tiklanishni ko‘rsatish.
import { useMemo } from 'react';
import { MUSCLES } from '../data/catalog';
import { capsule, frontMuscles, frontTorsoPath } from './figure/Figure';
import { solveFront } from '../lib/figure';
import type { MuscleId } from '../types';

const POSE = { ua: 168, fa: 172, th: 182, sh: 178 };
const FRONT_IDS: MuscleId[] = ['traps', 'chest', 'frontDelts', 'sideDelts', 'biceps', 'forearms', 'abs', 'obliques', 'quads', 'adductors', 'calves'];
const BACK_IDS: MuscleId[] = ['traps', 'upperBack', 'lats', 'rearDelts', 'triceps', 'forearms', 'lowerBack', 'glutes', 'hamstrings', 'adductors', 'calves'];

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

export function BodyMap({ primary = [], secondary = [], recovery, selected = [], onSelect, views = ['front', 'back'], height = 260, showLabels = true }: BodyMapProps) {
  const sk = useMemo(() => solveFront(POSE, 50, 214), []);
  const rankOf = (id: MuscleId) => (primary.includes(id) || selected.includes(id) ? 2 : secondary.includes(id) ? 1 : 0);
  const body = (back: boolean) => (
    <g>
      {sk.arms.map((a, i) => (
        <g key={i}>
          <path d={capsule(a.a, 6.6, a.b, 4.8)} fill="var(--surface-3)" />
          <path d={capsule(a.b, 4.8, a.c, 3.6)} fill="var(--surface-3)" />
          <circle cx={sk.hands[i].x} cy={sk.hands[i].y} r={4} fill="var(--surface-3)" />
        </g>
      ))}
      {sk.legs.map((l, i) => (
        <g key={i}>
          <path d={capsule(l.a, 9.8, l.b, 6.4)} fill="var(--surface-3)" />
          <path d={capsule(l.b, 6.4, l.c, 4.2)} fill="var(--surface-3)" />
        </g>
      ))}
      <path d={capsule({ x: 50, y: sk.shoulderY - 2 }, 5, { x: 50, y: sk.head.y + 6 }, 4.5)} fill="var(--surface-3)" />
      <path d={frontTorsoPath(sk)} fill="var(--surface-3)" />
      <circle cx={sk.head.x} cy={sk.head.y} r={10.5} fill="var(--surface-3)" />
      {[...(back ? BACK_IDS : FRONT_IDS)]
        .sort((a, b) => rankOf(a) - rankOf(b))
        .map((id) => {
        const shapes = frontMuscles(sk, id, back);
        const isP = primary.includes(id);
        const isS = secondary.includes(id);
        const isSel = selected.includes(id);
        let fill = 'var(--line-2)';
        let op = 0.9;
        if (recovery && recovery[id] !== undefined) fill = recoveryColor(recovery[id]!);
        if (isS) fill = 'var(--muscle-secondary)';
        if (isP || isSel) fill = 'var(--muscle-primary)';
        if (recovery && !isP && !isS && !isSel) op = 0.85;
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
            {shapes.map((s, i) => (
              <path key={i} d={s.d} fill={fill} opacity={op} stroke="var(--surface)" strokeWidth={0.8} />
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
          <svg viewBox="0 18 100 204" height={height} style={{ width: 'auto', maxWidth: '100%' }}>
            {body(v === 'back')}
          </svg>
          {showLabels && <span className="eyebrow">{v === 'front' ? 'Old' : 'Orqa'}</span>}
        </div>
      ))}
    </div>
  );
}
