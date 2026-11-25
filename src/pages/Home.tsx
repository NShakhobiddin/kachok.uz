// Bugun: haftalik reja va tanlangan kun mashqlari bitta oynada. Hafta kuni bosilsa — o'sha kun ochiladi;
// mashqlar sonini − / + bilan o'zgartirish (+ da dastur kunga mos mashqni o'zi tanlaydi), har mashqda bitta "⋯" menyu.
import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { CoachBanner } from '../components/CoachBanner';
import { useArmed } from '../lib/hooks';
import { ExercisePicker } from '../components/DayEditor';
import { ExerciseThumb } from '../components/ExerciseThumb';
import { Logo } from '../components/Logo';
import { Fold } from '../components/ui/Fold';
import { Icon } from '../components/ui/Icon';
import { Sheet } from '../components/ui/Sheet';
import { Stepper } from '../components/ui/controls';
import { MUSCLES } from '../data/catalog';
import { EXERCISE_MAP, EXERCISES } from '../data/exercises';
import { LESSONS } from '../data/lessons';
import { ROUTINE_MAP, routineMinutes } from '../data/routines';
import { dailyPick } from '../data/motivation';
import { alternatives, estimateMinutes, hasEquipment, manualPlanned, removableIndex, rotationSource } from '../engine/program';
import { fmtKg, type Suggestion } from '../engine/progression';
import { weekStreak } from '../engine/stats';
import { DAYS, DAYS_SHORT, MONTHS, addDays, daysBetween, isoDate, startOfWeek } from '../lib/date';
import { weekSummary } from '../engine/stats';
import { useNutrition } from '../lib/useNutrition';
import { useDayPlan, useToday } from '../lib/useToday';
import { useStore } from '../store/useStore';
import type { PlannedExercise, Program, WorkoutDay } from '../types';

const READY = [
  { v: 1.8, label: 'Charchagan', hint: 'set va vazn biroz kamayadi', icon: 'moon' },
  { v: 3.2, label: 'Odatdagidek', hint: 'reja bo‘yicha', icon: 'balance' },
  { v: 4.6, label: 'Zo‘r', hint: 'to‘liq kuch bilan', icon: 'bolt' },
];

export default function Home() {
  const nav = useNavigate();
  const [params] = useSearchParams();
  const profile = useStore((s) => s.profile)!;
  const program = useStore((s) => s.program);
  const logs = useStore((s) => s.logs);
  const active = useStore((s) => s.active);
  const startWorkout = useStore((s) => s.startWorkout);
  const finishWorkout = useStore((s) => s.finishWorkout);
  const discardWorkout = useStore((s) => s.discardWorkout);
  const setReadiness = useStore((s) => s.setReadiness);
  const t = useToday();

  // qaysi kun ochiq: havoladan (?day=), bugun mashg'ulot bo'lsa — bugun, bo'lmasa o'tkazib yuborilgani, aks holda bugun
  const [sel, setSel] = useState<number>(() => {
    const q = Number(params.get('day'));
    if (params.get('day') !== null && q >= 0 && q < 7) return q;
    if (t.todayDay) return t.today;
    if (t.missed && !t.trainedToday) return t.missed.weekday;
    return t.today;
  });
  const day = t.days.find((d) => d.weekday === sel) ?? null;
  const plan = useDayPlan(day);
  const sugOf = useMemo(() => new Map(plan.map((x) => [x.pe, x.sug])), [plan]);
  // chiziqli A/B navbatida ko'rsatilgan mashqlar boshqa kundan — tahrir o'sha kunga yoziladi
  const srcId = day ? (program && t.meso ? rotationSource(program, day.id, t.rotKeys.get(day.id) ?? t.meso.absWeek) : day.id) : null;

  const ws = startOfWeek(new Date(t.dateKey + 'T12:00:00'));
  const now = new Date();
  const doneThisWeek = !!day && t.doneDayIds.has(day.id);
  const dayLog = day ? t.weekLogs.find((l) => l.dayId === day.id) : undefined;
  const past = sel < t.today;
  const isToday = sel === t.today;
  const streak = useMemo(() => weekStreak(logs, profile.daysPerWeek), [logs, profile.daysPerWeek]);
  const totalSets = plan.reduce((a, x) => a + x.sug.sets, 0);
  const estMin = useMemo(() => (plan.length ? estimateMinutes(plan.map(({ pe, sug }) => ({ ...pe, sets: sug.sets }))) : 0), [plan]);
  const groups = day ? [...new Set(day.exercises.flatMap((pe) => (EXERCISE_MAP[pe.exerciseId] ? [MUSCLES[EXERCISE_MAP[pe.exerciseId].primary[0]].name] : [])))].slice(0, 4) : [];

  // boshlash: tayyorlik bugun so'ralmagan bo'lsa — avval bitta savol (set/vazn shunga moslanadi)
  const [askReady, setAskReady] = useState(false);
  const [pending, setPending] = useState(false);
  const [freeOpen, setFreeOpen] = useState(false);
  const begin = () => {
    if (!day) return;
    // faqat bugungi set soni saqlanadi; RIR va vazn mashg'ulotda shu kontekst bilan qayta hisoblanadi
    startWorkout(
      day,
      plan.map(({ pe, sug }) => ({ ...pe, sets: sug.sets })),
      useStore.getState().readiness[t.dateKey],
    );
    nav('/workout');
  };
  // tayyorlik tanlangach reja (set soni) yangilanadi — keyingi chizishda boshlanadi
  useEffect(() => {
    if (!pending) return;
    setPending(false);
    begin();
  }, [pending, plan]);
  const onStart = () => (t.readinessToday === undefined ? setAskReady(true) : begin());
  const startFree = (ids: string[]) => {
    startWorkout(
      null,
      ids.flatMap((id) => (EXERCISE_MAP[id] ? [manualPlanned(EXERCISE_MAP[id], profile)] : [])),
      t.readinessToday,
    );
    nav('/workout');
  };

  // mashqlar soni: − / + va bekor qilish
  const addAutoPlanned = useStore((s) => s.addAutoPlanned);
  const removePlanned = useStore((s) => s.removePlanned);
  const setProgram = useStore((s) => s.setProgram);
  const [undo, setUndo] = useState<{ text: string; prev: Program } | null>(null);
  useEffect(() => {
    if (!undo) return;
    const id = setTimeout(() => setUndo(null), 5000);
    return () => clearTimeout(id);
  }, [undo]);
  const snapshot = () => useStore.getState().program!;
  const plus = () => {
    if (!srcId) return;
    const prev = snapshot();
    const id = addAutoPlanned(srcId);
    setUndo(id ? { text: `«${EXERCISE_MAP[id].name}» qo‘shildi`, prev } : { text: 'Mos mashq topilmadi — ro‘yxatdan tanlang', prev });
  };
  const minus = () => {
    if (!srcId || !day || day.exercises.length <= 1) return;
    const prev = snapshot();
    const i = removableIndex(day);
    const name = EXERCISE_MAP[day.exercises[i].exerciseId]?.name ?? 'Mashq';
    removePlanned(srcId, i);
    setUndo({ text: `«${name}» olib tashlandi`, prev });
  };
  const [editIdx, setEditIdx] = useState<number | null>(null);
  const [adding, setAdding] = useState(false);

  // unutilgan mashg'ulot: 6 soatdan ko'p ochiq turgan bo'lsa yakunlash taklif qilinadi
  const discard = useArmed();
  const staleHours = active ? Math.floor((now.getTime() - new Date(active.log.startedAt).getTime()) / 3600000) : 0;
  const activeDone = active ? active.log.exercises.reduce((a, e) => a + e.sets.filter((s) => s.done).length, 0) : 0;
  const activeTotal = active ? active.log.exercises.reduce((a, e) => a + e.sets.length, 0) : 0;
  const finished = logs.filter((l) => l.finishedAt);
  const lastLog = finished.reduce<(typeof finished)[number] | undefined>((a, l) => (!a || l.startedAt > a.startedAt ? l : a), undefined);
  const daysSince = lastLog ? daysBetween(new Date(lastLog.startedAt), now) : null;
  const untilNext = t.nextDay ? (t.nextDay.weekday - t.today + 7) % 7 || 7 : null;
  // yangi hafta boshida (du–cho) o'tgan hafta hisoboti haqida bir marta eslatma
  const reportSeen = useStore((s) => s.reportSeen);
  const prevWeek = addDays(ws, -7);
  const prevSum = useMemo(() => weekSummary(logs, prevWeek), [logs, prevWeek.getTime()]);
  const showReport = t.today <= 2 && prevSum.workouts > 0 && reportSeen !== isoDate(prevWeek);

  // pastki tugma: faol mashg'ulot → davom; kunda mashq bor va bajarilmagan → boshlash
  const canStart = !active && !!day && day.exercises.length > 0 && !doneThisWeek && !(isToday && t.doneToday);
  const ctaLabel = isToday ? 'Boshlash' : past ? 'Bugun bajarish' : 'Bugun shuni bajarish';

  return (
    <div className="page home2">
      <header className="row between gap-12" style={{ marginBottom: 14 }}>
        <div className="stack" style={{ gap: 4 }}>
          <Logo size={16} flat />
          <span className="eyebrow">
            {DAYS[t.today]} · {now.getDate()} {MONTHS[now.getMonth()]}
          </span>
        </div>
        <span className="row gap-8">
          <Link to="/friends" className="icon-btn" aria-label="Do‘stlar lentasi">
            <Icon name="users" size={20} />
          </Link>
          <Link to="/profile" className="avatar" aria-label="Profil va sozlamalar">
          {profile.name ? profile.name[0].toUpperCase() : <Icon name="user" />}
          </Link>
        </span>
      </header>

      <CoachBanner />

      {/* Hafta: har kun bosiladi */}
      <section aria-label="Hafta">
        <div className="row between gap-8" style={{ marginBottom: 8 }}>
          <h2 className="h-sm">
            Bu hafta{' '}
            <span className="muted num" style={{ fontWeight: 600 }}>
              · {t.weekLogs.length}/{profile.daysPerWeek} mashg‘ulot{streak > 1 ? ` · ${streak} hafta ketma-ket` : ''}
            </span>
          </h2>
          <Link to="/program" className="icon-btn" style={{ width: 36, height: 36 }} aria-label="Haftalik reja sozlamalari">
            <Icon name="settings" size={18} />
          </Link>
        </div>
        <div className="wk2-strip" role="tablist" aria-label="Hafta kunlari">
          {DAYS_SHORT.map((d, i) => {
            const planned = t.days.find((x) => x.weekday === i);
            const done = planned ? t.doneDayIds.has(planned.id) : t.doneDays.has(i);
            const state = done ? 'done' : planned ? (i < t.today ? 'missed' : 'planned') : 'rest';
            return (
              <button
                key={d}
                role="tab"
                aria-selected={sel === i}
                aria-label={`${DAYS[i]}: ${planned ? planned.title : 'dam olish'}${done ? ', bajarildi' : ''}`}
                className={`wk2 ${state} ${i === t.today ? 'today' : ''} ${sel === i ? 'sel' : ''}`}
                onClick={() => setSel(i)}
              >
                <span className="wk2-d">{d}</span>
                <span className="wk2-n num">{addDays(ws, i).getDate()}</span>
                <i aria-hidden="true">{done ? <Icon name="check" size={11} stroke={3.4} /> : null}</i>
              </button>
            );
          })}
        </div>
      </section>

      {showReport && (
        <Link to={`/report?w=${isoDate(prevWeek)}`} className="report-nudge mt-12">
          <Icon name="chart" size={18} style={{ color: 'var(--accent)', flex: 'none' }} />
          <span className="small grow">
            <b>O‘tgan hafta hisoboti</b>
            <span className="muted num">
              {' '}
              · {prevSum.workouts}/{profile.daysPerWeek} mashg‘ulot
            </span>
          </span>
          <Icon name="right" size={16} style={{ color: 'var(--text-3)', flex: 'none' }} />
        </Link>
      )}

      {/* Faol mashg'ulot */}
      {active && (
        <div className="card active-card mt-12">
          <span className="eyebrow accent">Faol mashg‘ulot</span>
          <div className="row between gap-12 mt-4">
            <b className="title">{active.log.title}</b>
            <span className="num small strong">
              {activeDone}/{activeTotal} set
            </span>
          </div>
          <div className="seg-progress mt-8" aria-hidden="true">
            {active.log.exercises.map((e, i) => (
              <i key={i}>
                <b style={{ width: `${e.sets.length ? (e.sets.filter((s) => s.done).length / e.sets.length) * 100 : 0}%` }} />
              </i>
            ))}
          </div>
          {staleHours >= 6 && (
            <div className="stack gap-8 mt-12">
              <span className="small">
                <b>{staleHours} soatdan beri ochiq.</b>{' '}
                {activeDone ? 'Yakunlashni unutdingizmi? Bajarilgan setlar saqlanadi.' : 'Hech bir set belgilanmagan — saqlanadigan natija yo‘q.'}
              </span>
              <div className="row gap-8">
                {activeDone > 0 && (
                  <button
                    className="btn btn-success btn-sm grow"
                    onClick={() => {
                      const log = finishWorkout();
                      if (log) nav(`/summary/${log.id}`, { state: { fresh: true } });
                    }}
                  >
                    Yakunlash
                  </button>
                )}
                {discard.armed ? (
                  <button className="btn btn-danger btn-sm grow" onClick={() => discard.ready() && discardWorkout()}>
                    Ha, o‘chirilsin
                  </button>
                ) : (
                  <button className="btn btn-ghost btn-sm grow" onClick={discard.arm}>
                    Saqlamasdan o‘chirish
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tanlangan kun */}
      <section className="mt-16" aria-live="polite">
        {day ? (
          <>
            <div className="row between gap-12" style={{ alignItems: 'flex-start' }}>
              <div style={{ minWidth: 0 }}>
                <span className={`eyebrow ${isToday ? 'accent' : ''}`}>
                  {isToday ? 'Bugun' : DAYS[sel]}
                  {!doneThisWeek && past ? ' · o‘tkazib yuborilgan' : ''}
                  {t.deload ? ' · yengil hafta' : ''}
                </span>
                <h1 className="display display-m mt-4">{day.title}</h1>
                {groups.length > 0 && <p className="small muted mt-4">{groups.join(' · ')}</p>}
              </div>
              {doneThisWeek && (
                <Link to={dayLog ? `/summary/${dayLog.id}` : '/progress'} className="tag done-tag">
                  <Icon name="check" size={14} stroke={3} /> Bajarildi
                </Link>
              )}
            </div>

            {/* mashqlar soni */}
            <div className="count-row mt-12">
              <div className="stack" style={{ gap: 2 }}>
                <b>{day.exercises.length} ta mashq</b>
                <span className="tiny muted num">
                  ~{estMin} daqiqa · {totalSets} set
                </span>
              </div>
              <div className="count-step" role="group" aria-label="Mashqlar soni">
                <button onClick={minus} disabled={day.exercises.length <= 1} aria-label="Bitta mashqni olib tashlash">
                  <Icon name="minus" size={20} />
                </button>
                <span className="num" aria-live="polite">
                  {day.exercises.length}
                </span>
                <button onClick={plus} disabled={day.exercises.length >= 12} aria-label="Yana bitta mashq qo‘shish">
                  <Icon name="plus" size={20} />
                </button>
              </div>
            </div>

            <ol className="ex-list mt-12">
              {day.exercises.map((pe, i) => {
                const ex = EXERCISE_MAP[pe.exerciseId];
                if (!ex) return null;
                const sug = sugOf.get(pe);
                return (
                  <li key={pe.exerciseId + i} className="ex-row2">
                    <Link to={`/exercise/${ex.id}`} className="ex-row2-main">
                      <ExerciseThumb ex={ex} size={52} />
                      <span className="grow" style={{ minWidth: 0 }}>
                        <span className="ex-name">{ex.name}</span>
                        <span className="tiny muted num">{rx(pe, sug, ex.timed)}</span>
                        {!hasEquipment(ex, profile.equipment) && <span className="tiny" style={{ display: 'block', color: 'var(--yellow)' }}>Jihozingizda yo‘q — almashtiring</span>}
                      </span>
                    </Link>
                    <button className="icon-btn" onClick={() => setEditIdx(i)} aria-label={`${ex.name}: o‘zgartirish`}>
                      <Icon name="more" size={22} stroke={3} />
                    </button>
                  </li>
                );
              })}
            </ol>
            {day.exercises.length === 0 && <p className="card small muted" style={{ textAlign: 'center' }}>Bu kun hali bo‘sh — «+» bosing, dastur mos mashqni o‘zi tanlaydi.</p>}
            <button className="btn btn-ghost btn-block mt-8" onClick={() => setAdding(true)}>
              <Icon name="list" size={18} /> Ro‘yxatdan tanlab qo‘shish
            </button>
          </>
        ) : (
          <div className="card stack gap-8">
            <span className={`eyebrow ${isToday ? 'accent' : ''}`}>{isToday ? 'Bugun' : DAYS[sel]}</span>
            <h1 className="display display-m">{isToday && t.trainedToday ? 'Barakalla!' : 'Dam olish kuni'}</h1>
            <p className="small muted">
              {isToday && t.trainedToday ? 'Mushak dam olayotganda o‘sadi: oqsil, suv va 7–9 soat uyqu.' : 'Mushaklar dam olishda o‘sadi. 7–10 ming qadam va 5 daqiqa cho‘zilish yetarli.'}
              {t.nextDay && untilNext && isToday ? ` Keyingi mashg‘ulot — ${DAYS[t.nextDay.weekday].toLowerCase()}, «${t.nextDay.title}».` : ''}
            </p>
            {isToday && (
              <div className="row gap-8 mt-4">
                <Link to={`/stretch/${t.trainedToday ? 'stretch-evening' : 'stretch-morning'}`} className="btn btn-secondary grow">
                  <Icon name="spine" size={18} /> Cho‘zilish · {routineMinutes(ROUTINE_MAP[t.trainedToday ? 'stretch-evening' : 'stretch-morning'])} daq
                </Link>
                <button className="btn btn-ghost grow" onClick={() => setFreeOpen(true)}>
                  Erkin mashg‘ulot
                </button>
              </div>
            )}
          </div>
        )}
      </section>

      {daysSince !== null && daysSince >= 5 && !active && (
        <div className="notice gold mt-12">
          <Icon name="bolt" />
          <span>{daysSince} kundan beri zalda emassiz. Qaytish uchun mukammal kun shart emas — 30 daqiqalik qisqa mashq ham hisobga kiradi.</span>
        </div>
      )}

      {/* Pastki asosiy tugma */}
      {(active || canStart) && (
        <div className="sticky-cta">
          {active ? (
            <button className="btn btn-primary btn-xl btn-block" onClick={() => nav('/workout')}>
              Davom ettirish <Icon name="play" size={18} />
            </button>
          ) : (
            <button className="btn btn-primary btn-xl btn-block" onClick={onStart}>
              {ctaLabel} <Icon name="play" size={18} />
              <span className="cta-sub num">~{estMin} daq</span>
            </button>
          )}
        </div>
      )}

      <Extras trainingDay={!!t.todayDay} trainedToday={t.trainedToday} />

      {undo && (
        <div className="undo-bar" role="status">
          <span className="small grow">{undo.text}</span>
          <button
            className="small strong accent-text"
            onClick={() => {
              setProgram(undo.prev);
              setUndo(null);
            }}
          >
            Bekor qilish
          </button>
        </div>
      )}

      {/* tayyorlik — boshlashdan oldin bitta savol */}
      <Sheet open={askReady} onClose={() => setAskReady(false)} label="Tayyorlik">
        <h3 className="title">Bugun o‘zingizni qanday his qilyapsiz?</h3>
        <p className="small muted mt-4">Javobingizga qarab set va vazn moslanadi.</p>
        <div className="stack gap-8 mt-16">
          {READY.map((o) => (
            <button
              key={o.v}
              className="choice"
              onClick={() => {
                setReadiness(o.v);
                setAskReady(false);
                setPending(true);
              }}
            >
              <span className="pill-num">
                <Icon name={o.icon} size={17} />
              </span>
              <div className="grow">
                <div className="ch-title">{o.label}</div>
                <div className="ch-desc">{o.hint}</div>
              </div>
            </button>
          ))}
        </div>
      </Sheet>

      {/* bitta mashq: set soni, almashtirish, olib tashlash */}
      <Sheet open={editIdx !== null} onClose={() => setEditIdx(null)} label="Mashqni o‘zgartirish">
        {editIdx !== null && day && srcId && day.exercises[editIdx] && <ExerciseMenu day={day} srcId={srcId} index={editIdx} onClose={() => setEditIdx(null)} />}
      </Sheet>

      <Sheet open={adding} onClose={() => setAdding(false)} label="Mashq qo‘shish">
        {adding && srcId && (
          <ExercisePicker
            title="Mashqlarni tanlang"
            equipment={profile.equipment}
            list={[...EXERCISES].sort((a, b) => Number(hasEquipment(b, profile.equipment)) - Number(hasEquipment(a, profile.equipment)) || b.score - a.score)}
            search
            onPickMany={(ids) => {
              const prev = snapshot();
              const add = useStore.getState().addPlanned;
              ids.forEach((id) => add(srcId, id));
              setAdding(false);
              setUndo({ text: `${ids.length} ta mashq qo‘shildi`, prev });
            }}
          />
        )}
      </Sheet>

      <Sheet open={freeOpen} onClose={() => setFreeOpen(false)} label="Erkin mashg‘ulot">
        {freeOpen && (
          <ExercisePicker
            title="Bugun qaysi mashqlar?"
            search
            equipment={profile.equipment}
            list={[...EXERCISES].sort((a, b) => b.score - a.score)}
            cta="Boshlash"
            onPickMany={(ids) => {
              setFreeOpen(false);
              startFree(ids);
            }}
          />
        )}
      </Sheet>
    </div>
  );
}

/** "3×5 · 25 kg" — bugungi tavsiya bo'yicha (tayyorlik va yengil hafta hisobga olingan) */
function rx(pe: PlannedExercise, sug: Suggestion | undefined, timed?: boolean): string {
  const sets = sug?.sets ?? pe.sets;
  const reps = pe.repMin === pe.repMax ? `${pe.repMin}` : `${pe.repMin}–${pe.repMax}`;
  const kg = sug?.kg ? ` · ${fmtKg(sug.kg)} kg` : '';
  return `${sets} × ${reps}${timed ? ' s' : ''}${kg}`;
}

/** Mashq menyusi: set soni, takror va dam (yig'iq), boshqasiga almashtirish, olib tashlash */
function ExerciseMenu({ day, srcId, index, onClose }: { day: WorkoutDay; srcId: string; index: number; onClose: () => void }) {
  const profile = useStore((s) => s.profile)!;
  const updatePlanned = useStore((s) => s.updatePlanned);
  const swapExercise = useStore((s) => s.swapExercise);
  const removePlanned = useStore((s) => s.removePlanned);
  const [swap, setSwap] = useState(false);
  const pe = day.exercises[index];
  const ex = EXERCISE_MAP[pe.exerciseId];
  if (!ex) return null;
  if (swap)
    return (
      <ExercisePicker
        title={`«${ex.name}» o‘rniga`}
        equipment={profile.equipment}
        list={alternatives(ex.id, profile)}
        onPick={(id) => {
          swapExercise(srcId, index, id);
          onClose();
        }}
      />
    );
  const set = (patch: Partial<PlannedExercise>) => updatePlanned(srcId, index, patch);
  return (
    <div className="stack gap-12">
      <div className="row gap-12">
        <ExerciseThumb ex={ex} size={56} />
        <div className="grow" style={{ minWidth: 0 }}>
          <h3 className="title">{ex.name}</h3>
          <span className="tiny muted">{ex.primary.map((m) => MUSCLES[m].name).join(', ')}</span>
        </div>
      </div>
      <div className="field">
        <label>Setlar</label>
        <Stepper value={pe.sets} min={1} max={8} onChange={(n) => set({ sets: n })} label="Setlar" />
      </div>
      <Fold title="Takror va dam olish" hint={`${pe.repMin}–${pe.repMax}${ex.timed ? ' s' : ' takror'} · dam ${Math.round(pe.restSec / 15) / 4} daq`}>
        <div className="grid-2">
          <div className="field">
            <label>{ex.timed ? 'Min soniya' : 'Min takror'}</label>
            <Stepper value={pe.repMin} min={1} max={90} onChange={(n) => set({ repMin: Math.min(n, pe.repMax) })} label="Min takror" />
          </div>
          <div className="field">
            <label>{ex.timed ? 'Max soniya' : 'Max takror'}</label>
            <Stepper value={pe.repMax} min={1} max={120} onChange={(n) => set({ repMax: Math.max(n, pe.repMin) })} label="Max takror" />
          </div>
        </div>
        <div className="field mt-8">
          <label>Dam olish</label>
          <Stepper value={pe.restSec} min={30} max={300} step={15} onChange={(n) => set({ restSec: n })} unit="s" label="Dam olish" />
        </div>
      </Fold>
      <div className="stack gap-8">
        <button className="btn btn-secondary btn-block" onClick={() => setSwap(true)}>
          <Icon name="swap" size={18} /> Boshqa mashqqa almashtirish
        </button>
        <Link to={`/exercise/${ex.id}`} className="btn btn-ghost btn-block">
          <Icon name="eye" size={18} /> Texnikasini ko‘rish
        </Link>
        <button
          className="btn btn-ghost btn-block"
          style={{ color: 'var(--red)' }}
          disabled={day.exercises.length <= 1}
          onClick={() => {
            removePlanned(srcId, index);
            onClose();
          }}
        >
          <Icon name="trash" size={18} /> Bu kundan olib tashlash
        </button>
      </div>
      <p className="tiny faint">O‘zgarish har hafta shu kunga saqlanadi.</p>
    </div>
  );
}

/** Kunlik qo'shimchalar: suv, ovqat, uyda mashq va cho'zilish, bugungi dars — ixcham */
function Extras({ trainingDay, trainedToday }: { trainingDay: boolean; trainedToday: boolean }) {
  const { np, eatenToday } = useNutrition();
  const lessonsDone = useStore((s) => s.lessonsDone);
  const addWater = useStore((s) => s.addWater);
  const lesson = LESSONS.find((l) => !lessonsDone.includes(l.id)) ?? dailyPick(LESSONS);
  const t = useToday();
  const ml = useStore((s) => s.water[t.dateKey] ?? 0);
  const goal = Math.round((np.waterL + (trainingDay ? np.waterTrainingL : 0)) * 1000);
  const left = Math.max(0, np.kcal - Math.round(eatenToday));
  const stretchId = trainedToday ? 'stretch-evening' : 'stretch-morning';
  return (
    <section className="section">
      <div className="section-head">
        <h2>Kun davomida</h2>
      </div>
      <div className="grid-2">
        <div className="card tight stack gap-4">
          <span className="eyebrow">Suv</span>
          <span className="row gap-6" style={{ alignItems: 'baseline' }}>
            <b className="poster" style={{ fontSize: 28 }}>
              {(ml / 1000).toFixed(1)}
            </b>
            <span className="small muted">/ {(goal / 1000).toFixed(1)} L</span>
          </span>
          <div className="progress" style={{ height: 5 }}>
            <i style={{ width: `${Math.min(100, (ml / goal) * 100)}%` }} />
          </div>
          <div className="row gap-6 mt-4">
            <button className="btn btn-secondary btn-xs grow" onClick={() => addWater(250)}>
              +250 ml
            </button>
            <button className="btn btn-ghost btn-xs" onClick={() => addWater(-250)} aria-label="250 ml ayirish" disabled={ml <= 0}>
              <Icon name="minus" size={16} />
            </button>
          </div>
        </div>
        <Link to="/nutrition" className="card tight stack gap-4" style={{ color: 'inherit' }}>
          <span className="eyebrow">{eatenToday > 0 ? 'Ovqat · qoldi' : 'Ovqat · kunlik'}</span>
          <span className="row gap-6" style={{ alignItems: 'baseline' }}>
            <b className="poster" style={{ fontSize: 28 }}>
              {eatenToday > 0 ? left : np.kcal}
            </b>
            <span className="small muted">kkal</span>
          </span>
          <span className="tiny muted">Oqsil {np.protein} g</span>
          <span className="small strong accent-text mt-4">Yozish ›</span>
        </Link>
        <Link to={`/stretch/${stretchId}`} className="card tight stack gap-4" style={{ color: 'inherit' }}>
          <Icon name="spine" size={20} style={{ color: 'var(--accent)' }} />
          <b className="mt-4">Cho‘zilish</b>
          <span className="tiny muted">Taymer bilan · {routineMinutes(ROUTINE_MAP[stretchId])} daq</span>
        </Link>
        <Link to="/routines?tab=health" className="card tight stack gap-4" style={{ color: 'inherit' }}>
          <Icon name="heart" size={20} style={{ color: 'var(--accent)' }} />
          <b className="mt-4">Tayyor to‘plamlar</b>
          <span className="tiny muted">Uyda, sog‘liq uchun, dasturlar</span>
        </Link>
      </div>
      <Link to={`/lesson/${lesson.id}`} className="card row gap-12 mt-12" style={{ color: 'inherit' }}>
        <span className="lesson-ico">
          <Icon name={lesson.icon} />
        </span>
        <div className="grow">
          <div className="eyebrow">
            Bugungi dars · {lesson.minutes} daq
          </div>
          <div className="subtitle mt-4">{lesson.title}</div>
        </div>
        <Icon name="right" style={{ color: 'var(--text-3)' }} />
      </Link>
    </section>
  );
}

