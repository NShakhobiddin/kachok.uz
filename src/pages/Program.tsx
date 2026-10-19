import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { TargetBars } from '../components/charts';
import { DayEditor } from '../components/DayEditor';
import { Icon } from '../components/ui/Icon';
import { Sheet } from '../components/ui/Sheet';
import { GROUPS, GROUP_ORDER, VOLUME_LANDMARKS, mrvAt } from '../data/catalog';
import { EXERCISE_MAP } from '../data/exercises';
import { blockWeek, METHOD_INFO, resolveMethod, type ConcreteMethod } from '../engine/methods';
import { exportProgramPdf } from '../engine/pdf';
import { estimateMinutes, groupFrequency, weeklyVolume } from '../engine/program';
import { fmtKg, suggest } from '../engine/progression';
import { mesoPlan, type MesoState } from '../engine/meso';
import { useNutrition } from '../lib/useNutrition';
import { mesoCtx, useMeso } from '../lib/useToday';
import { DAYS, DAYS_SHORT, weekdayIdx } from '../lib/date';
import { useIsPro } from '../lib/features';
import { useStore } from '../store/useStore';
import type { Method, Profile, Program } from '../types';

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
  const [methodOpen, setMethodOpen] = useState(false);
  const [pdfBusy, setPdfBusy] = useState(false);
  const isPro = useIsPro();
  const nav = useNavigate();
  const vol = useMemo(() => (program ? weeklyVolume(program) : null), [program]);
  const freq = useMemo(() => groupFrequency(program ?? { days: [] }), [program]);
  const meso = useMeso();
  const nut = useNutrition();
  if (!program) return null;
  const day = days[Math.min(sel, days.length - 1)];

  const onPdf = async () => {
    if (!isPro) return nav('/premium?f=pdf');
    setPdfBusy(true);
    try {
      await exportProgramPdf(program, profile, kcalAdjust, useStore.getState().logs, nut.useAdaptive ? nut.est.tdee : undefined);
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

      {meso && <MethodCard program={program} profile={profile} meso={meso} onChange={() => setMethodOpen(true)} />}

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
            <TargetBars label="Mushak guruhlari bo‘yicha haftalik setlar" rows={GROUP_ORDER.map((g) => ({ label: GROUPS[g].name, value: vol[g], mev: VOLUME_LANDMARKS[g].mev, mav: VOLUME_LANDMARKS[g].mav, mrv: mrvAt(g, freq[g]) }))} />
            <p className="tiny faint mt-12">Asosiy mushak uchun set = 1, yordamchi mushak uchun = 0.5 (Pelland va boshq., 2026).</p>
          </div>
        </section>
      )}

      <MethodSheet open={methodOpen} onClose={() => setMethodOpen(false)} profile={profile} current={program.method ?? resolveMethod(profile)} />

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

/** Uslub kartasi: qaysi metodika, blok jadvali (RIR yoki %1RM) va asosiy mashqlarning bu haftalik yuklamasi */
function MethodCard({ program, profile, meso, onChange }: { program: Program; profile: Profile; meso: MesoState; onChange: () => void }) {
  const method: ConcreteMethod = program.method ?? 'hypertrophy';
  const info = METHOD_INFO[method];
  const weeks = program.mesoWeeks;
  const plan = mesoPlan(weeks, profile.level);
  const { week, sessionsInWeek: done, perWeek } = meso;
  const cur = plan[week];
  const bw = method === 'strength' ? blockWeek(week, weeks) : null;
  return (
    <div className="card stack gap-12">
      <div className="row between gap-12">
        <div className="stack" style={{ gap: 2, minWidth: 0 }}>
          <span className="eyebrow">Uslub</span>
          <span className="strong">{info.name}</span>
        </div>
        <button className="chip sm" onClick={onChange}>
          <Icon name="swap" size={15} /> O‘zgartirish
        </button>
      </div>

      {method === 'linear' ? (
        <div className="row between small">
          <span className="strong">{meso.absWeek + 1}-hafta</span>
          <span className="muted num">
            {done}/{perWeek} mashg‘ulot
          </span>
        </div>
      ) : (
        <>
          <div className="row between small">
            <span className="strong">
              {meso.meso + 1}-blok · {week + 1}-hafta / {weeks}
            </span>
            <span className="muted num">
              {done}/{perWeek} mashg‘ulot
            </span>
          </div>
          <div className="meso-grid" role="table" aria-label="Blok haftalari">
            {plan.map((w) => {
              const b = method === 'strength' ? blockWeek(w.week, weeks) : null;
              return (
                <div key={w.week} role="row" className={`meso-col ${w.week === week ? 'cur' : ''} ${w.week < week ? 'past' : ''} ${w.deload ? 'deload' : ''}`}>
                  <span className="tiny">{w.week + 1}-h</span>
                  <b className="num">{w.deload ? 'D' : b ? Math.round(b.pct * 100) : w.rir}</b>
                  <i style={{ height: w.deload ? 8 : 10 + (w.week / Math.max(1, weeks - 2)) * 16 }} />
                </div>
              );
            })}
          </div>
        </>
      )}

      <p className="small">
        {method === 'linear' ? (
          <>
            <b>Har mashg‘ulotda og‘irroq.</b> Asosiy mashqlarda barcha takrorlar bajarilsa — oyoq +5 kg, yuqori tana +2.5 kg. Ikki marta yetmasa, vazn 10% tushadi va yana ko‘tariladi.
          </>
        ) : cur.deload ? (
          <>
            <b>Yengillashtirish haftasi.</b> Setlar kamayadi, vazn yengillashadi — charchoq ketadi, keyingi blok kuchliroq boshlanadi.
          </>
        ) : bw ? (
          <>
            <b>
              Bu hafta asosiy mashqlar: {bw.sets}×{bw.reps} @ {Math.round(bw.pct * 100)}% 1RM.
            </b>{' '}
            Yordamchi mashqlar — {cur.rir} zaxira takror bilan.
          </>
        ) : (
          <>
            <b>Bu hafta: har setda {cur.rir} ta zaxira takror.</b> Har hafta zaxira kamayadi va mushak fikringizga qarab setlar qo‘shiladi; oxirgi hafta — yengillashtirish.
          </>
        )}
      </p>

      {(method === 'strength' || method === 'linear') && <KeyLifts program={program} profile={profile} meso={meso} />}

      <p className="tiny faint">
        {method === 'linear' ? '' : method === 'strength' ? 'Raqam — asosiy mashqlar uchun %1RM.' : 'Raqam — maqsadli RIR (zaxiradagi takror).'} Hafta kalendar bo‘yicha emas, bajarilgan mashg‘ulotlar bo‘yicha o‘tadi. {program.splitWhy.replace(`${info.name}. `, '')}
      </p>
    </div>
  );
}

/** Kuch sxemasidagi asosiy mashqlar: keyingi mashg'ulotdagi vazn */
function KeyLifts({ program, profile, meso }: { program: Program; profile: Profile; meso: MesoState }) {
  const logs = useStore((s) => s.logs);
  const rows = useMemo(() => {
    const seen = new Set<string>();
    const out: { id: string; name: string; text: string; e1rm?: number }[] = [];
    for (const d of program.days)
      for (const pe of d.exercises) {
        const ex = EXERCISE_MAP[pe.exerciseId];
        if (!pe.scheme || !ex || seen.has(ex.id)) continue;
        seen.add(ex.id);
        const sug = suggest(ex, pe, logs, { bodyKg: profile.weightKg, sex: profile.sex, level: profile.level, ...mesoCtx(meso, program) });
        out.push({ id: ex.id, name: ex.name, text: `${sug.sets}×${sug.reps}${sug.kg ? ` · ${fmtKg(sug.kg)} kg` : ''}`, e1rm: pe.scheme === 'block' ? sug.e1rm : undefined });
      }
    return out;
  }, [program, profile, meso, logs]);
  if (!rows.length) return null;
  return (
    <div className="stack" style={{ gap: 0 }}>
      <span className="eyebrow" style={{ marginBottom: 4 }}>
        Keyingi mashg‘ulotda
      </span>
      {rows.map((r) => (
        <Link key={r.id} to={`/exercise/${r.id}`} className="row between gap-12 small" style={{ color: 'inherit', padding: '9px 0', borderTop: '1px solid var(--line)' }}>
          <span className="strong">{r.name}</span>
          <span className="num" style={{ textAlign: 'right' }}>
            <b>{r.text}</b>
            {r.e1rm ? <span className="tiny muted" style={{ display: 'block' }}>1RM ≈ {Math.round(r.e1rm)} kg</span> : null}
          </span>
        </Link>
      ))}
    </div>
  );
}

const METHOD_ORDER: ConcreteMethod[] = ['hypertrophy', 'strength', 'linear', 'powerbuilding'];

/** Uslub tanlash: 4 metodika + avtomatik; tanlansa dastur shu uslubda qayta tuziladi */
function MethodSheet({ open, onClose, profile, current }: { open: boolean; onClose: () => void; profile: Profile; current: ConcreteMethod }) {
  const updateProfile = useStore((s) => s.updateProfile);
  const regenerate = useStore((s) => s.regenerate);
  const [pick, setPick] = useState<Method>(profile.method ?? 'auto');
  const auto = resolveMethod({ ...profile, method: 'auto' });
  const apply = () => {
    updateProfile({ method: pick });
    regenerate();
    onClose();
  };
  const changed = (pick === 'auto' ? auto : pick) !== current || pick !== (profile.method ?? 'auto');
  return (
    <Sheet open={open} onClose={onClose} label="Dastur uslubi">
      <h3 className="title">Dastur uslubi</h3>
      <p className="small muted mt-4">Har biri sport ilmida sinalgan metodika. Tanlasangiz, dastur shu uslubda qayta tuziladi — mashg‘ulot tarixi saqlanadi.</p>
      <div className="stack gap-8 mt-16" role="radiogroup" aria-label="Uslub">
        <button role="radio" aria-checked={pick === 'auto'} className={`method-opt ${pick === 'auto' ? 'on' : ''}`} onClick={() => setPick('auto')}>
          <span className="row between gap-8">
            <b>Avtomatik</b>
            <span className="tiny muted">tavsiya</span>
          </span>
          <span className="small muted">Maqsad va tajribangizga qarab: hozir — {METHOD_INFO[auto].name}</span>
        </button>
        {METHOD_ORDER.map((m) => {
          const info = METHOD_INFO[m];
          const locked = m === 'powerbuilding' && profile.daysPerWeek < 4;
          return (
            <button key={m} role="radio" aria-checked={pick === m} disabled={locked} className={`method-opt ${pick === m ? 'on' : ''}`} onClick={() => setPick(m)}>
              <span className="row between gap-8">
                <b>{info.name}</b>
                {m === current && <span className="tiny strong" style={{ color: 'var(--blue-2)' }}>joriy</span>}
              </span>
              <span className="small">{info.short}</span>
              {pick === m && (
                <span className="stack gap-6 mt-4">
                  <span className="small muted">{info.who}</span>
                  <span className="small">{info.how}</span>
                  <span className="tiny faint">Manba: {info.source}</span>
                </span>
              )}
              {locked && <span className="tiny" style={{ color: 'var(--yellow)' }}>Haftasiga kamida 4 kun kerak</span>}
            </button>
          );
        })}
      </div>
      <button className="btn btn-primary btn-block mt-16" disabled={!changed} onClick={apply}>
        {changed ? 'Tanlash va dasturni qayta tuzish' : 'Joriy uslub'}
      </button>
    </Sheet>
  );
}
