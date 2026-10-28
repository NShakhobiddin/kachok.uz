import { memo, useState } from 'react';
import { ILLUSTRATIONS } from '../data/illustrations';
import type { Exercise } from '../types';
import { Figure, poseTimes } from './figure/Figure';

// Ro'yxatlardagi kichik rasm: mashq illyustratsiyasining figuraga kesilgan nusxasi (illustrations/thumb); bo'lmasa — animatsiya kadri
const thumbSrc = (id: string) => `${import.meta.env.BASE_URL}illustrations/thumb/${id}.webp`;

export const ExerciseThumb = memo(function ExerciseThumb({ ex, size = 64, playing = false }: { ex: Exercise; size?: number; playing?: boolean }) {
  const [failed, setFailed] = useState(false);
  if (!playing && ILLUSTRATIONS[ex.id] && !failed)
    return (
      <div className="stage thumb-img" style={{ width: size, height: size, flex: 'none', borderRadius: 14 }}>
        <img src={thumbSrc(ex.id)} alt="" loading="lazy" decoding="async" width={size} height={size} onError={() => setFailed(true)} />
      </div>
    );
  return (
    <div className="stage" style={{ width: size, height: size, flex: 'none', borderRadius: 14 }}>
      <Figure spec={ex.anim} primary={ex.primary} secondary={ex.secondary} at={playing ? undefined : poseTimes(ex.anim)[1]} playing={playing} title={ex.name} fit />
    </div>
  );
});
