import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { TargetBars } from '../components/charts';
import { DayEditor } from '../components/DayEditor';
import { Icon } from '../components/ui/Icon';
import { Sheet } from '../components/ui/Sheet';
import { GROUPS, GROUP_ORDER, WEEKLY_TARGET } from '../data/catalog';
import { exportProgramPdf } from '../engine/pdf';
import { estimateMinutes, programWeek, weeklyVolume } from '../engine/program';
import { DAYS, DAYS_SHORT, weekdayIdx } from '../lib/date';
import { useIsPro } from '../lib/features';
import { useStore } from '../store/useStore';

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
  const [confirmRegen, setConfirmRegen] = useState(false);
  const [pdfBusy, setPdfBusy] = useState(false);
  const isPro = useIsPro();
  const nav = useNavigate();
  const vol = useMemo(() => (program ? weeklyVolume(program) : null), [program]);
  if (!program) return null;
  const day = days[Math.min(sel, days.length - 1)];
  const week = programWeek(program) + 1;
  const meso = ((week - 1) % program.mesoWeeks) + 1;

  const onPdf = async () => {
    if (!isPro) return nav('/premium?f=pdf');
    setPdfBusy(true);
    try {
      await exportProgramPdf(program, profile, kcalAdjust);
    } catch {
      /* foydalanuvchi bekor qildi yoki saqlash imkoni yo'q */
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
            <Icon name={isPro ? 'download' : 'lock'} size={18} /> {pdfBusy ? '...' : 'PDF'}
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
          <DayEditor
            day={day}
            profile={profile}
            onSwap={(i, id) => swapExercise(day.id, i, id)}
            onUpdate={(i, patch) => updatePlanned(day.id, i, patch)}
            onRemove={(i) => removePlanned(day.id, i)}
            onAdd={(id) => addPlanned(day.id, id)}
          />
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
