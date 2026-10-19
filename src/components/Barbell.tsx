// Imzo element: mashg‘ulot progressi — shtangaga disk taqish.
// Har bir mashq — bir juft disk; setlar bajarilgan sari disk "to‘ladi" va shtangaga o‘tiradi.
import { motion } from 'framer-motion';

export const PLATE_COLORS = ['var(--plate-red)', 'var(--plate-blue)', 'var(--plate-yellow)', 'var(--plate-green)', 'var(--plate-white)'];
const THICK = [10, 9, 8, 7, 6];
const TALL = [62, 62, 58, 54, 44];

export interface BarbellPlate {
  /** 0..1 */
  progress: number;
}

export function Barbell({ plates, className, label }: { plates: BarbellPlate[]; className?: string; label?: string }) {
  const n = Math.min(plates.length, 9);
  const shown = plates.slice(0, n);
  const totalW = shown.reduce((a, _, i) => a + THICK[i % 5] + 2.5, 0);
  const sleeve = Math.max(70, totalW + 14);
  const W = 120 + sleeve * 2 + 20;
  const cy = 40;
  const collarR = 10 + sleeve;
  const collarL = W - 10 - sleeve;
  let xr = collarR + 4;
  let xl = collarL - 4;
  const done = shown.filter((p) => p.progress >= 1).length;
  return (
    <svg viewBox={`0 0 ${W} 80`} className={className} role="img" aria-label={label ?? `${done} / ${n} mashq bajarildi`}>
      {/* grif */}
      <rect x={6} y={cy - 2.5} width={W - 12} height={5} rx={2.5} fill="var(--iron)" opacity={0.85} />
      {/* rifli joy */}
      <rect x={collarR + 2} y={cy - 2.5} width={collarL - collarR - 4} height={5} fill="url(#knurl)" opacity={0.5} />
      <defs>
        <pattern id="knurl" width="3" height="3" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="3" stroke="#5b6573" strokeWidth="1" />
        </pattern>
      </defs>
      {/* yeng (sleeve) */}
      <rect x={10} y={cy - 4} width={sleeve} height={8} rx={2} fill="#b9c2ce" />
      <rect x={W - 10 - sleeve} y={cy - 4} width={sleeve} height={8} rx={2} fill="#b9c2ce" />
      {/* qulf (collar) */}
      <rect x={collarR - 2} y={cy - 9} width={6} height={18} rx={2} fill="#8f99a6" />
      <rect x={collarL - 4} y={cy - 9} width={6} height={18} rx={2} fill="#8f99a6" />
      {shown.map((p, i) => {
        const w = THICK[i % 5];
        const h = TALL[i % 5];
        const color = PLATE_COLORS[i % 5];
        const rx = xr;
        const lx = xl - w;
        xr += w + 2.5;
        xl -= w + 2.5;
        const full = p.progress >= 1;
        const fillH = h * Math.min(1, p.progress);
        return (
          <g key={i}>
            {[rx, lx].map((x, k) => (
              <g key={k}>
                <rect x={x} y={cy - h / 2} width={w} height={h} rx={2.5} fill="var(--surface-2)" stroke="var(--line-2)" strokeWidth={1} />
                <rect x={x} y={cy - h / 2} width={w} height={h} rx={2.5} fill={color} opacity={0.16} />
                <motion.rect
                  x={x}
                  width={w}
                  rx={2.5}
                  fill={color}
                  initial={false}
                  animate={{ y: cy + h / 2 - fillH, height: fillH, opacity: full ? 1 : 0.55 }}
                  transition={{ type: 'spring', stiffness: 260, damping: 24 }}
                />
                {full && (
                  <motion.rect
                    x={x - 1}
                    y={cy - h / 2 - 1}
                    width={w + 2}
                    height={h + 2}
                    rx={3}
                    fill="none"
                    stroke={color}
                    strokeWidth={1}
                    initial={{ opacity: 0.9, scale: 1 }}
                    animate={{ opacity: 0, scale: 1.25 }}
                    transition={{ duration: 0.7 }}
                    style={{ transformOrigin: `${x + w / 2}px ${cy}px` }}
                  />
                )}
              </g>
            ))}
          </g>
        );
      })}
    </svg>
  );
}

/** Disk ko‘rinishidagi kichik belgi (yutuqlar, PR) */
export function PlateBadge({ color, size = 56, children, dim }: { color: string; size?: number; children?: React.ReactNode; dim?: boolean }) {
  return (
    <div style={{ width: size, height: size, position: 'relative', opacity: dim ? 0.28 : 1, filter: dim ? 'grayscale(1)' : undefined }}>
      <svg viewBox="0 0 56 56" width={size} height={size}>
        <circle cx={28} cy={28} r={27} fill={color} />
        <circle cx={28} cy={28} r={22} fill="none" stroke="rgba(0,0,0,0.22)" strokeWidth={1.4} />
        <circle cx={28} cy={28} r={8} fill="var(--iron)" />
        <circle cx={28} cy={28} r={4} fill="rgba(0,0,0,0.45)" />
      </svg>
      {children && <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center' }}>{children}</div>}
    </div>
  );
}

/** Disk kalkulyatori vizuali: bir tomonga taqiladigan disklar */
const KG_COLOR: Record<number, string> = {
  25: 'var(--plate-red)',
  20: 'var(--plate-blue)',
  15: 'var(--plate-yellow)',
  10: 'var(--plate-green)',
  5: 'var(--plate-white)',
  2.5: 'var(--plate-red)',
  1.25: 'var(--iron)',
};
const KG_H: Record<number, number> = { 25: 44, 20: 44, 15: 40, 10: 36, 5: 28, 2.5: 22, 1.25: 18 };

export function PlateStack({ plates }: { plates: number[] }) {
  let x = 18;
  const items = plates.map((p) => {
    const w = p >= 10 ? 9 : 6;
    const el = { p, x, w, h: KG_H[p] ?? 20 };
    x += w + 2;
    return el;
  });
  const W = Math.max(80, x + 24);
  return (
    <svg viewBox={`0 0 ${W} 50`} height={50} style={{ maxWidth: '100%' }} role="img" aria-label={`Har tomonga: ${plates.join(' + ') || "disk yo‘q"} kg`}>
      <rect x={0} y={22} width={W} height={6} rx={3} fill="#b9c2ce" />
      <rect x={10} y={15} width={6} height={20} rx={2} fill="#8f99a6" />
      {items.map((it, i) => (
        <rect key={i} x={it.x} y={25 - it.h / 2} width={it.w} height={it.h} rx={2} fill={KG_COLOR[it.p] ?? 'var(--iron)'} />
      ))}
    </svg>
  );
}
