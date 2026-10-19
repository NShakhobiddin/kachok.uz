import { memo } from 'react';
import type { Exercise } from '../types';
import { Figure, poseTimes } from './figure/Figure';

export const ExerciseThumb = memo(function ExerciseThumb({ ex, size = 64, playing = false }: { ex: Exercise; size?: number; playing?: boolean }) {
  return (
    <div className="stage" style={{ width: size, height: size, flex: 'none', borderRadius: 14 }}>
      <Figure spec={ex.anim} primary={ex.primary} secondary={ex.secondary} at={playing ? undefined : poseTimes(ex.anim)[1]} playing={playing} title={ex.name} fit />
    </div>
  );
});
