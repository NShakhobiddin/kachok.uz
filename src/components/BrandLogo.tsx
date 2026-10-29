import { useId } from 'react';
import { BRAND_LOGO as L } from './brandLogo.data';

type Props = {
  /** Logoning balandligi, px. Kenglik nisbat bo'yicha o'zi hisoblanadi. */
  height?: number;
  /** Ochilishda tugma bir marta "bosiladi", keyin "bos" yozuvi chiqadi. */
  animate?: boolean;
  className?: string;
};

/**
 * GYMbos logosi: laym tugma ichida "GYM" (shtanga sterjeni sifatida), yonida "bos".
 * Harflar konturda — shrift yuklanishini kutmaydi. Ranglar tokens.css'dan olinadi.
 */
export function BrandLogo({ height = 64, animate = false, className }: Props) {
  const clip = `gb-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`;
  const r = L.pillHeight / 2;
  return (
    <svg
      className={['brand-logo', animate ? 'brand-logo--intro' : '', className ?? ''].join(' ').trim()}
      viewBox={`0 0 ${L.width} ${L.height}`}
      height={height}
      width={(height * L.width) / L.height}
      role="img"
      aria-label="GYMbos"
    >
      <defs>
        <clipPath id={clip}>
          <rect width={L.pillWidth} height={L.pillHeight} rx={r} />
        </clipPath>
      </defs>
      <rect y={L.depth} width={L.pillWidth} height={L.pillHeight} rx={r} fill="var(--accent-depth)" />
      <g className="brand-logo__pill">
        <g clipPath={`url(#${clip})`}>
          <rect width={L.pillWidth} height={L.pillHeight} fill="var(--accent-hi)" />
          <rect y={L.highlight} width={L.pillWidth} height={L.pillHeight} rx={r} fill="var(--accent)" />
        </g>
        {L.bars.map(([x, y, w, h]) => (
          <rect key={x} x={x} y={y} width={w} height={h} rx={w / 2} fill="var(--bg)" />
        ))}
        <path d={L.gym} fill="var(--bg)" />
      </g>
      <path className="brand-logo__bos" d={L.bos} fill="var(--text)" />
    </svg>
  );
}
