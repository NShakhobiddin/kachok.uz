// Bir kunlik mashqlar ro'yxatini tahrirlash: almashtirish, set/takror, o'chirish, qo'shish.
// Foydalanuvchining o'z dasturida ham, murabbiy mijoz dasturida ham ishlatiladi.
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { EXERCISES, EXERCISE_MAP } from '../data/exercises';
import { GROUPS, GROUP_ORDER, MUSCLES } from '../data/catalog';
import { alternatives, hasEquipment } from '../engine/program';
import type { Exercise, MuscleGroup, PlannedExercise, Profile, WorkoutDay } from '../types';
import { ExerciseThumb } from './ExerciseThumb';
import { Icon } from './ui/Icon';
import { Sheet } from './ui/Sheet';
import { Stepper } from './ui/controls';

export interface DayEditorProps {
  day: WorkoutDay;
  /** jihoz va jarohatlar bo'yicha muqobillarni tanlash uchun (mijoz profili) */
  profile: Pick<Profile, 'equipment' | 'injuries'>;
  onSwap: (i: number, exId: string) => void;
  onUpdate: (i: number, patch: Partial<PlannedExercise>) => void;
  onRemove: (i: number) => void;
  onAdd: (exId: string) => void;
}

export function DayEditor({ day, profile, onSwap, onUpdate, onRemove, onAdd }: DayEditorProps) {
  const [edit, setEdit] = useState<{ i: number; pe: PlannedExercise } | null>(null);
  const [swap, setSwap] = useState<number | null>(null);
  const [adding, setAdding] = useState(false);
  return (
    <>
      {day.exercises.length === 0 && <p className="card small muted" style={{ textAlign: 'center' }}>Bu kun hali bo‘sh — mashqlarni o‘zingiz tanlang.</p>}
      <div className="card flush" style={day.exercises.length ? undefined : { display: 'none' }}>
        {day.exercises.map((pe, i) => {
          const ex = EXERCISE_MAP[pe.exerciseId];
          if (!ex) return null;
          const missing = !hasEquipment(ex, profile.equipment);
          return (
            <div key={i} className="row gap-12" style={{ padding: 12, borderBottom: i < day.exercises.length - 1 ? '1px solid var(--line)' : 0 }}>
              <Link to={`/exercise/${ex.id}`} aria-label={`${ex.name} texnikasi`}>
                <ExerciseThumb ex={ex} size={60} />
              </Link>
              <Link to={`/exercise/${ex.id}`} className="grow" style={{ color: 'inherit', minWidth: 0 }}>
                <div className="strong" style={{ lineHeight: 1.25 }}>
                  {ex.name}
                </div>
                <div className="tiny faint">{ex.en}</div>
                <div className="small mt-4 num">
                  <b>
                    {pe.sets} × {pe.repMin === pe.repMax ? pe.repMin : `${pe.repMin}–${pe.repMax}`}
                    {ex.timed ? ' s' : ''}
                  </b>
                  <span className="muted"> · {pe.scheme === 'block' ? '%1RM blok' : pe.scheme === 'linear' ? 'har safar +vazn' : `RIR ${pe.rir}`} · dam {Math.round(pe.restSec / 15) / 4} daq</span>
                </div>
                {missing && <div className="tiny mt-4" style={{ color: 'var(--yellow)' }}>Jihozlar ro‘yxatida yo‘q — almashtiring</div>}
              </Link>
              <div className="stack" style={{ gap: 2 }}>
                <button className="icon-btn" style={{ width: 38, height: 38 }} onClick={() => setSwap(i)} aria-label="Almashtirish">
                  <Icon name="swap" size={19} />
                </button>
                <button className="icon-btn" style={{ width: 38, height: 38 }} onClick={() => setEdit({ i, pe })} aria-label="Tahrirlash">
                  <Icon name="edit" size={18} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
      <button className={`btn ${day.exercises.length ? 'btn-ghost' : 'btn-primary'} btn-block mt-8`} onClick={() => setAdding(true)}>
        <Icon name="plus" size={18} /> {day.exercises.length ? 'Mashq qo‘shish' : 'Mashqlarni tanlash'}
      </button>

      <Sheet open={!!edit} onClose={() => setEdit(null)} label="Mashqni tahrirlash">
        {edit && (
          <EditPlanned
            pe={edit.pe}
            onSave={(patch) => {
              onUpdate(edit.i, patch);
              setEdit(null);
            }}
            onRemove={() => {
              onRemove(edit.i);
              setEdit(null);
            }}
          />
        )}
      </Sheet>

      <Sheet open={swap !== null} onClose={() => setSwap(null)} label="Muqobil mashqlar">
        {swap !== null && day.exercises[swap] && (
          <ExercisePicker
            title="Muqobil mashq tanlang"
            equipment={profile.equipment}
            list={alternatives(day.exercises[swap].exerciseId, profile as Profile)}
            onPick={(id) => {
              onSwap(swap, id);
              setSwap(null);
            }}
          />
        )}
      </Sheet>

      <Sheet open={adding} onClose={() => setAdding(false)} label="Mashq qo‘shish">
        {adding && (
          <ExercisePicker
            title="Mashqlarni tanlang"
            equipment={profile.equipment}
            list={[...EXERCISES].sort((a, b) => Number(hasEquipment(b, profile.equipment)) - Number(hasEquipment(a, profile.equipment)) || b.score - a.score)}
            search
            onPickMany={(ids) => {
              ids.forEach(onAdd);
              setAdding(false);
            }}
          />
        )}
      </Sheet>
    </>
  );
}

function EditPlanned({ pe, onSave, onRemove }: { pe: PlannedExercise; onSave: (p: Partial<PlannedExercise>) => void; onRemove: () => void }) {
  const [v, setV] = useState(pe);
  const ex = EXERCISE_MAP[pe.exerciseId];
  return (
    <div className="stack gap-12">
      <h3 className="title">{ex?.name}</h3>
      <div className="grid-2">
        <div className="field">
          <label>Setlar</label>
          <Stepper value={v.sets} min={1} max={8} onChange={(n) => setV({ ...v, sets: n })} label="Setlar" />
        </div>
        <div className="field">
          <label>RIR (zaxira)</label>
          <Stepper value={v.rir} min={0} max={5} onChange={(n) => setV({ ...v, rir: n })} label="RIR" />
        </div>
        <div className="field">
          <label>Min takror</label>
          <Stepper value={v.repMin} min={1} max={60} onChange={(n) => setV({ ...v, repMin: Math.min(n, v.repMax) })} label="Min takror" />
        </div>
        <div className="field">
          <label>Max takror</label>
          <Stepper value={v.repMax} min={1} max={90} onChange={(n) => setV({ ...v, repMax: Math.max(n, v.repMin) })} label="Max takror" />
        </div>
      </div>
      <div className="field">
        <label>Dam olish (soniya)</label>
        <Stepper value={v.restSec} min={30} max={300} step={15} onChange={(n) => setV({ ...v, restSec: n })} unit="s" label="Dam olish" />
      </div>
      <div className="row gap-8 mt-8">
        <button className="btn btn-danger" onClick={onRemove} aria-label="O‘chirish">
          <Icon name="trash" size={18} />
        </button>
        <button className="btn btn-primary grow" onClick={() => onSave(v)}>
          Saqlash
        </button>
      </div>
    </div>
  );
}

/** Mashq tanlash: qidiruv, mushak guruhi va jihoz bo'yicha filtr; onPickMany berilsa — bir nechtasini belgilab, bir bosishda qo'shish */
export function ExercisePicker({
  title,
  list,
  onPick,
  onPickMany,
  search,
  equipment,
  cta = 'Qo‘shish',
}: {
  title: string;
  list: Exercise[];
  onPick?: (id: string) => void;
  onPickMany?: (ids: string[]) => void;
  search?: boolean;
  equipment?: Profile['equipment'];
  cta?: string;
}) {
  const [q, setQ] = useState('');
  const [group, setGroup] = useState<MuscleGroup | null>(null);
  const [onlyMine, setOnlyMine] = useState(true);
  const [picked, setPicked] = useState<string[]>([]);
  const multi = !!onPickMany;
  const items = list.filter(
    (e) =>
      (!q || (e.name + ' ' + e.en).toLowerCase().includes(q.toLowerCase())) &&
      (!group || MUSCLES[e.primary[0]].group === group) &&
      (!search || !equipment || !onlyMine || hasEquipment(e, equipment)),
  );
  const toggle = (id: string) => setPicked((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));
  return (
    <div className="stack gap-12">
      <h3 className="title">{title}</h3>
      {search && (
        <>
          <input className="input" placeholder="Qidirish..." value={q} onChange={(e) => setQ(e.target.value)} aria-label="Mashq qidirish" />
          <div className="hscroll" role="group" aria-label="Mushak guruhi">
            <button className={`chip ${!group ? 'on' : ''}`} aria-pressed={!group} onClick={() => setGroup(null)}>
              Hammasi
            </button>
            {GROUP_ORDER.map((g) => (
              <button key={g} className={`chip ${group === g ? 'on' : ''}`} aria-pressed={group === g} onClick={() => setGroup(group === g ? null : g)}>
                {GROUPS[g].name}
              </button>
            ))}
          </div>
          {equipment && (
            <label className="row gap-8 small muted" style={{ cursor: 'pointer' }}>
              <input type="checkbox" checked={onlyMine} onChange={(e) => setOnlyMine(e.target.checked)} />
              Faqat zalimdagi jihozlar bilan
            </label>
          )}
        </>
      )}
      <div className="stack">
        {items.map((e) => {
          const ok = equipment ? hasEquipment(e, equipment) : true;
          const n = picked.indexOf(e.id);
          return (
            <button key={e.id} className={`list-row ${n >= 0 ? 'picked' : ''}`} aria-pressed={multi ? n >= 0 : undefined} onClick={() => (multi ? toggle(e.id) : onPick?.(e.id))} style={{ opacity: ok ? 1 : 0.55 }}>
              <ExerciseThumb ex={e} size={48} />
              <div className="grow" style={{ minWidth: 0 }}>
                <div className="strong small">{e.name}</div>
                <div className="tiny faint ellipsis">
                  {e.primary.map((m) => MUSCLES[m].name).join(', ')}
                  {!ok && ' · jihoz yo‘q'}
                </div>
              </div>
              {multi ? (
                <span className={`pick-mark ${n >= 0 ? 'on' : ''}`} aria-hidden="true">
                  {n >= 0 ? n + 1 : <Icon name="plus" size={16} />}
                </span>
              ) : (
                <Icon name="plus" size={18} style={{ color: 'var(--text-3)' }} />
              )}
            </button>
          );
        })}
        {items.length === 0 && <p className="empty">Hech narsa topilmadi.</p>}
      </div>
      {multi && (
        <div className="picker-foot">
          <button className="btn btn-primary btn-block" disabled={!picked.length} onClick={() => onPickMany!(picked)}>
            {picked.length ? `${cta} · ${picked.length} ta mashq` : 'Mashqlarni belgilang'}
          </button>
        </div>
      )}
    </div>
  );
}
