// Katta 3D tana (aylanuvchi): tayyor bo'lguncha va trafikni tejash rejimida — 2D anatomik xarita.
import { lazy, Suspense, useMemo } from 'react';
import { M3_INFO, type M3 } from '../data/muscles3d';
import type { BodyLoad } from '../engine/bodyLoad';
import type { MuscleId } from '../types';
import { BodyMap } from './BodyMap';
import type { View3D } from './Muscle3D';

const Muscle3D = lazy(() => import('./Muscle3D'));

const saveData = () => !!(navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;

export function BodyHero({
  load,
  view = 'front',
  label,
  selected,
  onSelect,
  height = 230,
}: {
  load: BodyLoad[];
  view?: View3D;
  label: string;
  selected?: M3 | null;
  onSelect?: (k: M3 | null) => void;
  /** 2D o'rinbosar balandligi */
  height?: number;
}) {
  const [primary, secondary] = useMemo(() => {
    const p = new Set<MuscleId>(), s = new Set<MuscleId>();
    for (const a of load) {
      const g = M3_INFO[a.key].group;
      if (!g) continue;
      (a.mvic >= 50 ? p : s).add(g);
    }
    return [[...p], [...s].filter((g) => !p.has(g))];
  }, [load]);
  const flat = (
    <div className="body-flat" aria-hidden="true">
      <BodyMap primary={primary} secondary={secondary} views={[view === 'back' ? 'back' : 'front']} height={height} showLabels={false} />
    </div>
  );
  if (saveData())
    return (
      <div className="m3d-host body3d" role="img" aria-label={label}>
        {flat}
      </div>
    );
  return (
    <Suspense
      fallback={
        <div className="m3d-host body3d" role="img" aria-label={label}>
          {flat}
        </div>
      }
    >
      <Muscle3D mode="turntable" view={view} acts={load} label={label} placeholder={flat} selected={selected} onSelect={onSelect} className="body3d" />
    </Suspense>
  );
}
