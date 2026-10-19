import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { TargetBars } from '../components/charts';
import { ExerciseThumb } from '../components/ExerciseThumb';
import { Icon } from '../components/ui/Icon';
import { Sheet } from '../components/ui/Sheet';
import { Stepper } from '../components/ui/controls';
import { GROUPS, GROUP_ORDER, MUSCLES, WEEKLY_TARGET } from '../data/catalog';
import { EXERCISES, EXERCISE_MAP } from '../data/exercises';
import { exportProgramPdf } from '../engine/pdf';
import { alternatives, estimateMinutes, hasEquipment, programWeek, weeklyVolume } from '../engine/program';
import { DAYS, DAYS_SHORT, weekdayIdx } from '../lib/date';
import { useStore } from '../store/useStore';
import type { PlannedExercise } from '../types';

export default function ProgramPage() {
  const program = useStore((s) => s.program);
  const profile = useStore((s) => s.profile)!;
  const kcalAdjust = useStore((s) => s.kcalAdjust);
  const regenerate = useStore((s) => s.regenerate);
  const swapExercise = useStore((s) => s.swapExercise);
  const updatePlanned = useStore((s) => s.updatePlanned);
  const removePlanned = useStore((s) => s.removePlanned);
  const addPlanned = useStore((s) => s.addPlanned);
  const moveDay = useStore((s) => s.moveDay);
  const days = useMemo(() => [...(program?.days ?? [])].sort((a, b) => a.weekday - b.weekday), [program]);
  const todayIdx = days.findIndex((d) => d.weekday === weekdayIdx());
  const [sel, setSel] = useState(Math.max(0, todayIdx));
  const [edit, setEdit] = useState<{ i: number; pe: PlannedExercise } | null>(null);
  const [swap, setSwap] = useState<number | null>(null);
  const [adding, setAdding] = useState(false);
  const [confirmRegen, setConfirmRegen] = useState(false);
  const [pdfBusy, setPdfBusy] = useState(false);
  const vol = useMemo(() => (program ? weeklyVolume(program) : null), [program]);
  if (!program) return null;
  const day = days[Math.min(sel, days.length - 1)];
  const week = programWeek(program) + 1;
  const meso = ((week - 1) % program.mesoWeeks) + 1;

  const onPdf = async () => {
    setPdfBusy(true);
    try {
      await exportProgramPdf(program, profile, kcalAdjust);
    } finally {
      setPdfBusy(false);
    }
  };

  return (
    <div className="page">
      <div className="page-head">
        <div className="stack gap-4">
          <span className="eyebrow">{program.split}</span>
          <h1 className="display">Dastur</h1>
        </div>
        <div className="row gap-8">
          <button className="btn btn-secondary btn-sm" onClick={onPdf} disabled={pdfBusy}>
            <Icon name="download" size={18} /> {pdfBusy ? '...' : 'PDF'}
          </button>
          <button className="icon-btn filled" onClick={() => setConfirmRegen(true)} aria-label="Dasturni qayta tuzish">
            <Icon name="refresh" size={20} />
          </button>
        </div>
      </div>

      <div className="card stack gap-12">
        <div className="row between">
          <span className="strong">
            Blok: {meso}-hafta / {program.mesoWeeks}
          </span>
          <span className="small muted">{meso === program.mesoWeeks ? 'Yengillashtirish haftasi' : `${program.mesoWeeks}-hafta — yengil`}</span>
        </div>
        <div className="row" style={{ gap: 4 }} aria-hidden>
          {Array.from({ length: program.mesoWeeks }, (_, i) => (
            <i key={i} style={{ flex: 1, height: 8, borderRadius: 4, background: i < meso ? (i === program.mesoWeeks - 1 ? 'var(--yellow)' : 'var(--blue)') : 'var(--surface-3)' }} />
          ))}
        </div>
        <p className="small muted">{program.splitWhy}</p>
      </div>

      <div className="hscroll mt-16" role="tablist" aria-label="Kunlar">
        {days.map((d, i) => (
          <button key={d.id} role="tab" aria-selected={i === sel} className={`chip ${i === sel ? 'on' : ''}`} style={{ height: 44 }} onClick={() => setSel(i)}>
            <b>{DAYS_SHORT[d.weekday]}</b> {d.title}
          </button>
        ))}
      </div>

      {day && (
        <section className="mt-16">
          <div className="row between" style={{ marginBottom: 10 }}>
            <div>
              <h2 className="display display-m">{day.title}</h2>
              <p className="small muted mt-4">
                {DAYS[day.weekday]} · {day.focus} · ~{estimateMinutes(day.exercises)} daq
              </p>
            </div>
            <select
              className="chip"
              aria-label="Hafta kunini o‘zgartirish"
              value={day.weekday}
              onChange={(e) => moveDay(day.id, Number(e.target.value))}
              style={{ appearance: 'none', cursor: 'pointer' }}
            >
              {DAYS.map((d, i) => (
                <option key={d} value={i}>
                  {d}
                </option>
              ))}
            </select>
          </div>
          <div className="card flush">
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
                        {pe.sets} × {pe.repMin}–{pe.repMax}
                        {ex.timed ? ' s' : ''}
                      </b>
                      <span className="muted"> · RIR {pe.rir} · dam {Math.round(pe.restSec / 15) / 4} daq</span>
                    </div>
                    {missing && <div className="tiny mt-4" style={{ color: 'var(--yellow)' }}>Jihoz ro‘yxatingizda yo‘q — almashtiring</div>}
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
          <button className="btn btn-ghost btn-block mt-8" onClick={() => setAdding(true)}>
            <Icon name="plus" size={18} /> Mashq qo‘shish
          </button>
        </section>
      )}

      {vol && (
        <section className="section">
          <div className="section-head">
            <h2>Haftalik hajm</h2>
            <Link to="/lesson/muscle-growth" className="small strong">
              Nega 10–20?
            </Link>
          </div>
          <div className="card">
            <TargetBars label="Mushak guruhlari bo‘yicha haftalik setlar" rows={GROUP_ORDER.map((g) => ({ label: GROUPS[g].name, value: vol[g], lo: WEEKLY_TARGET[g][0], hi: WEEKLY_TARGET[g][1] }))} />
            <p className="tiny faint mt-12">Asosiy mushak uchun set = 1, yordamchi mushak uchun = 0.5 (Pelland va boshq., 2026).</p>
          </div>
        </section>
      )}

      <Sheet open={!!edit} onClose={() => setEdit(null)} label="Mashqni tahrirlash">
        {edit && day && (
          <EditPlanned
            pe={edit.pe}
            onSave={(patch) => {
              updatePlanned(day.id, edit.i, patch);
              setEdit(null);
            }}
            onRemove={() => {
              removePlanned(day.id, edit.i);
              setEdit(null);
            }}
          />
        )}
      </Sheet>

      <Sheet open={swap !== null} onClose={() => setSwap(null)} label="Muqobil mashqlar">
        {swap !== null && day && (
          <ExercisePicker
            title="Muqobil mashq tanlang"
            list={alternatives(day.exercises[swap].exerciseId, profile)}
            onPick={(id) => {
              swapExercise(day.id, swap, id);
              setSwap(null);
            }}
          />
        )}
      </Sheet>

      <Sheet open={adding} onClose={() => setAdding(false)} label="Mashq qo‘shish">
        {adding && day && (
          <ExercisePicker
            title="Mashq qo‘shish"
            list={[...EXERCISES].sort((a, b) => Number(hasEquipment(b, profile.equipment)) - Number(hasEquipment(a, profile.equipment)) || b.score - a.score)}
            search
            onPick={(id) => {
              addPlanned(day.id, id);
              setAdding(false);
            }}
          />
        )}
      </Sheet>

      <Sheet open={confirmRegen} onClose={() => setConfirmRegen(false)} label="Qayta tuzish">
        <h3 className="title">Dasturni qayta tuzasizmi?</h3>
        <p className="muted mt-8">Profil, jihozlar va maqsadingiz asosida yangi dastur tuziladi. Qo‘lda kiritilgan o‘zgarishlar o‘chadi, mashg‘ulot tarixi saqlanadi.</p>
        <div className="row gap-8 mt-16">
          <button className="btn btn-secondary grow" onClick={() => setConfirmRegen(false)}>
            Bekor qilish
          </button>
          <button
            className="btn btn-primary grow"
            onClick={() => {
              regenerate();
              setConfirmRegen(false);
            }}
          >
            Qayta tuzish
          </button>
        </div>
      </Sheet>
    </div>
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

export function ExercisePicker({ title, list, onPick, search }: { title: string; list: typeof EXERCISES; onPick: (id: string) => void; search?: boolean }) {
  const profile = useStore((s) => s.profile);
  const [q, setQ] = useState('');
  const items = list.filter((e) => !q || (e.name + ' ' + e.en).toLowerCase().includes(q.toLowerCase()));
  return (
    <div className="stack gap-12">
      <h3 className="title">{title}</h3>
      {search && <input className="input" placeholder="Qidirish..." value={q} onChange={(e) => setQ(e.target.value)} />}
      <div className="stack">
        {items.slice(0, 40).map((e) => {
          const ok = profile ? hasEquipment(e, profile.equipment) : true;
          return (
            <button key={e.id} className="list-row" onClick={() => onPick(e.id)} style={{ opacity: ok ? 1 : 0.55 }}>
              <ExerciseThumb ex={e} size={48} />
              <div className="grow" style={{ minWidth: 0 }}>
                <div className="strong small">{e.name}</div>
                <div className="tiny faint ellipsis">
                  {e.primary.map((m) => MUSCLES[m].name).join(', ')}
                  {!ok && ' · jihoz yo‘q'}
                </div>
              </div>
              <Icon name="plus" size={18} style={{ color: 'var(--text-3)' }} />
            </button>
          );
        })}
        {items.length === 0 && <p className="empty">Hech narsa topilmadi.</p>}
      </div>
    </div>
  );
}
