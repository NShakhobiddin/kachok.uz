// Tugagan mashg'ulotni tuzatish: setlardagi vazn va takrorni o'zgartirish yoki setni o'chirish.
import { useState } from 'react';
import { EXERCISE_MAP } from '../data/exercises';
import { fmtKg } from '../engine/progression';
import type { ExerciseLog, SetLog, WorkoutLog } from '../types';
import { parseNum } from './ui/controls';
import { Icon } from './ui/Icon';

/** har qator — asl set bilan (isinish, RIR, set turi saqlanadi) */
type Draft = { kg: string; reps: string; src: SetLog }[][];

export function LogEditor({ log, onSave, onCancel }: { log: WorkoutLog; onSave: (exercises: ExerciseLog[]) => void; onCancel: () => void }) {
  const [draft, setDraft] = useState<Draft>(() => log.exercises.map((e) => e.sets.map((s) => ({ kg: s.kg ? fmtKg(s.kg) : '', reps: String(s.reps), src: s }))));
  const set = (i: number, j: number, k: 'kg' | 'reps', v: string) => setDraft((d) => d.map((row, a) => (a !== i ? row : row.map((c, b) => (b !== j ? c : { ...c, [k]: v })))));
  const remove = (i: number, j: number) => setDraft((d) => d.map((row, a) => (a !== i ? row : row.filter((_, b) => b !== j))));
  // tekshiruv: vazn 0–650 kg, takror 1–100 (soniyali mashqda 1–3600)
  const parsed = log.exercises.map((e, i) => {
    const timed = !!EXERCISE_MAP[e.exerciseId]?.timed;
    return draft[i].map((c) => {
      const kg = c.kg.trim() ? parseNum(c.kg) : 0;
      const reps = parseNum(c.reps);
      const ok = Number.isFinite(kg) && kg >= 0 && kg <= 650 && Number.isInteger(reps) && reps >= 1 && reps <= (timed ? 3600 : 100);
      return { ok, set: { ...c.src, kg: Math.round(kg * 100) / 100, reps, done: true } };
    });
  });
  const valid = parsed.every((row) => row.every((c) => c.ok)) && parsed.some((row) => row.length > 0);
  return (
    <div className="stack gap-12">
      {log.exercises.map((e, i) => (
        <div key={i} className="stack gap-6">
          <span className="strong small">{EXERCISE_MAP[e.exerciseId]?.name ?? e.exerciseId}</span>
          {draft[i].length === 0 && <span className="tiny muted">Setlar o‘chirildi — mashq saqlanmaydi</span>}
          {draft[i].map((c, j) => (
            <div key={j} className="row gap-8" style={{ alignItems: 'center' }}>
              <span className="tiny faint num" style={{ width: 18 }}>
                {j + 1}
              </span>
              <input className="input num" style={{ width: 88, borderColor: parsed[i][j].ok ? undefined : 'var(--danger)' }} inputMode="decimal" aria-label={`${j + 1}-set vazn`} placeholder="kg" value={c.kg} onChange={(ev) => set(i, j, 'kg', ev.target.value)} />
              <span className="muted">×</span>
              <input className="input num" style={{ width: 72, borderColor: parsed[i][j].ok ? undefined : 'var(--danger)' }} inputMode="numeric" aria-label={`${j + 1}-set takror`} value={c.reps} onChange={(ev) => set(i, j, 'reps', ev.target.value)} />
              <button className="icon-btn" style={{ marginLeft: 'auto' }} aria-label={`${j + 1}-setni o‘chirish`} onClick={() => remove(i, j)}>
                <Icon name="trash" size={16} />
              </button>
            </div>
          ))}
        </div>
      ))}
      {!valid && <p className="small" style={{ color: 'var(--danger)' }}>Qizil maydonlarni tekshiring: vazn 0–650 kg, takror 1–100.</p>}
      <div className="row gap-8">
        <button className="btn btn-secondary grow" onClick={onCancel}>
          Bekor qilish
        </button>
        <button
          className="btn btn-primary grow"
          disabled={!valid}
          onClick={() => onSave(log.exercises.map((e, i) => ({ ...e, sets: parsed[i].map((c) => c.set) })))}
        >
          Saqlash
        </button>
      </div>
    </div>
  );
}
