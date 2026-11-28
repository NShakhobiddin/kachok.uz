// Bugun (11-prototip): birinchi ekranda — salomlashuv, bugungi mashq katta rasmda va bitta katta tugma, suv/ovqat/cho‘zilish halqalari.
// Qolgan hamma imkoniyat pastda saqlanadi: mashqlar ro‘yxati (− / +, «⋯» menyu), hafta kunlari, maqsad, hisobot, to‘plamlar va dars.
import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { CoachBanner } from '../components/CoachBanner';
import { GoalStrip } from '../components/Goals';
import { useArmed, useVisible } from '../lib/hooks';
import { ExercisePicker } from '../components/DayEditor';
import { ExerciseThumb } from '../components/ExerciseThumb';
import { SpeakButton } from '../components/SpeakButton';
import { Fold } from '../components/ui/Fold';
import { Icon } from '../components/ui/Icon';
import { afterSheetClosed, Sheet } from '../components/ui/Sheet';
import { Stepper } from '../components/ui/controls';
import { MUSCLES } from '../data/catalog';
import { EXERCISE_MAP, EXERCISES } from '../data/exercises';
import { ILLUSTRATIONS } from '../data/illustrations';
import { LESSONS } from '../data/lessons';
import { ROUTINE_MAP, routineMinutes } from '../data/routines';
import { dailyPick } from '../data/motivation';
import { alternatives, estimateMinutes, hasEquipment, manualPlanned, removableIndex, rotationSource } from '../engine/program';
import { fmtKg, type Suggestion } from '../engine/progression';
import { weekStreak } from '../engine/stats';
import { DAYS, DAYS_SHORT, addDays, daysBetween, isoDate, startOfWeek } from '../lib/date';
import { weekSummary } from '../engine/stats';
import { plainTitle } from '../lib/plainTitle';
import { useNutrition } from '../lib/useNutrition';
import { useDayPlan, useToday } from '../lib/useToday';
import { useStore } from '../store/useStore';
import type { PlannedExercise, WorkoutDay } from '../types';

const READY = [
  { v: 1.8, label: 'Charchagan', hint: 'yondashuv va vazn biroz kamayadi', icon: 'moon' },
  { v: 3.2, label: 'Odatdagidek', hint: 'reja bo‘yicha', icon: 'balance' },
  { v: 4.6, label: 'Zo‘r', hint: 'to‘liq kuch bilan', icon: 'bolt' },
];
const REST_IMG = `${import.meta.env.BASE_URL}illustrations/hamstring-stretch.webp`;

/** kichik halqa: 0..1 */
function Ring({ value, color, icon }: { value: number; color: string; icon: string }) {
  const c = 2 * Math.PI * 25;
  return (
    <span className="h3-ring" aria-hidden="true">
      <svg className="h3-ring-svg" viewBox="0 0 58 58">
        <circle cx="29" cy="29" r="25" fill="none" stroke={color} strokeOpacity={0.18} strokeWidth="6" />
        {value > 0 && <circle cx="29" cy="29" r="25" fill="none" stroke={color} strokeWidth="6" strokeLinecap="round" strokeDasharray={`${Math.min(1, value) * c} ${c}`} />}
      </svg>
      <Icon name={icon} size={24} style={{ color }} />
    </span>
  );
}

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
  const addWater = useStore((s) => s.addWater);
  const t = useToday();
  const { np, eatenToday } = useNutrition();
  const waterMl = useStore((s) => s.water[t.dateKey] ?? 0);
  const stretchDone = useStore((s) => s.stretchLog[t.dateKey] ?? 0);

  // qaysi kun ochiq: havoladan (?day=), bugun mashg'ulot bo'lsa — bugun, bo'lmasa o'tkazib yuborilgani, aks holda bugun
  const [sel, setSel] = useState<number>(() => {
    const q = Number(params.get('day'));
    if (params.get('day') !== null && q >= 0 && q < 7) return q;
    if (t.todayDay) return t.today;
    if (t.missed && !t.trainedToday) return t.missed.weekday;
    return t.today;
  });
  // ilova ochiq qolib sana almashsa (yarim tun) — tanlangan kun yangi «bugun»ga qaytadi (havolada ?day= bo'lmasa)
  const [selFor, setSelFor] = useState(t.dateKey);
  if (selFor !== t.dateKey) {
    setSelFor(t.dateKey);
    if (params.get('day') === null) setSel(t.todayDay ? t.today : t.missed && !t.trainedToday ? t.missed.weekday : t.today);
  }
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

  // mashqlar soni: − / + va bekor qilish (suv qo‘shish ham shu yerdan bekor qilinadi)
  const addAutoPlanned = useStore((s) => s.addAutoPlanned);
  const removePlanned = useStore((s) => s.removePlanned);
  const setProgram = useStore((s) => s.setProgram);
  const [undo, setUndo] = useState<{ text: string; revert: () => void } | null>(null);
  useEffect(() => {
    if (!undo) return;
    const id = setTimeout(() => setUndo(null), 5000);
    return () => clearTimeout(id);
  }, [undo]);
  const snapshot = () => {
    const prev = useStore.getState().program!;
    return () => setProgram(prev);
  };
  const plus = () => {
    if (!srcId) return;
    const revert = snapshot();
    const id = addAutoPlanned(srcId);
    setUndo(id ? { text: `«${EXERCISE_MAP[id].name}» qo‘shildi`, revert } : { text: 'Mos mashq topilmadi — ro‘yxatdan tanlang', revert });
  };
  const minus = () => {
    if (!srcId || !day || day.exercises.length <= 1) return;
    const revert = snapshot();
    const i = removableIndex(day);
    const name = EXERCISE_MAP[day.exercises[i].exerciseId]?.name ?? 'Mashq';
    removePlanned(srcId, i);
    setUndo({ text: `«${name}» olib tashlandi`, revert });
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

  // asosiy tugma: faol mashg'ulot → davom; kunda mashq bor va bajarilmagan → boshlash
  const canStart = !active && !!day && day.exercises.length > 0 && !doneThisWeek && !(isToday && t.doneToday);
  const ctaLabel = isToday ? 'Boshlash' : past ? 'Bugun bajarish' : 'Bugun shuni bajarish';
  // katta kartadagi tugma ko‘rinmay qolsa (pastga aylantirilganda) — pastki tugma chiqadi
  const [heroBtn, heroBtnVisible] = useVisible<HTMLDivElement>();

  // katta karta: rasm, nom, holat
  const exIds = active ? active.log.exercises.map((e) => e.exerciseId) : (day?.exercises.map((pe) => pe.exerciseId) ?? []);
  const heroImg = exIds.map((id) => ILLUSTRATIONS[id]?.src).find(Boolean) ?? null;
  const title = plainTitle(exIds);
  const stretchId = t.trainedToday ? 'stretch-evening' : 'stretch-morning';
  const stretchMin = routineMinutes(ROUTINE_MAP[stretchId]);
  const mode: 'active' | 'start' | 'done' | 'empty' | 'trained' | 'rest' = active
    ? 'active'
    : day && day.exercises.length === 0
      ? 'empty'
      : canStart
        ? 'start'
        : day && doneThisWeek
          ? 'done'
          : day && isToday && t.doneToday
            ? 'trained'
            : 'rest';
  const nextText = t.nextDay && untilNext ? `Keyingi mashq — ${DAYS[t.nextDay.weekday].toLowerCase()}` : '';

  // «Eshiting» matni — ekrandagi asosiy narsa oddiy gap bilan
  const first = day?.exercises.map((pe) => EXERCISE_MAP[pe.exerciseId]).find(Boolean);
  const speech =
    mode === 'active'
      ? `Mashg‘ulot davom etyapti. ${activeDone} ta yondashuv bajarildi, ${Math.max(0, activeTotal - activeDone)} ta qoldi. Davom ettirish uchun yashil tugmani bosing.`
      : mode === 'start'
        ? `Salom${profile.name ? ', ' + profile.name : ''}! ${isToday ? 'Bugun' : DAYS[sel]} ${title.toLowerCase()} mashqi: ${day!.exercises.length} ta mashq, taxminan ${estMin} daqiqa.${first ? ` Birinchisi — ${first.name}.` : ''} Boshlash uchun katta yashil tugmani bosing.`
        : mode === 'done' || mode === 'trained'
          ? 'Barakalla! Bugungi mashq bajarildi. Endi suv iching, oqsilli ovqat yeng va kechqurun cho‘ziling.'
          : !isToday
            ? `${DAYS[sel]} — dam olish kuni. Bugungi kunga qaytish uchun tugmani bosing.`
            : `Bugun dam olish kuni. Mushaklar dam olganda o‘sadi. Xohlasangiz, ${stretchMin} daqiqalik yengil cho‘zilish qiling.${nextText ? ` ${nextText}.` : ''}`;

  // tezkor ishlar
  const waterGoal = Math.round((np.waterL + (t.todayDay ? np.waterTrainingL : 0)) * 1000);
  const glasses = Math.round(waterMl / 250);
  const glassesGoal = Math.max(1, Math.round(waterGoal / 250));
  const drink = () => {
    addWater(250);
    setUndo({ text: `Suv: ${glasses + 1} / ${glassesGoal} stakan`, revert: () => addWater(-250) });
  };
  const pickDay = (i: number) => {
    setSel(i);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="page home3">
      <header className="h3-head">
        <div style={{ minWidth: 0 }}>
          <h1 className="h3-hello">Salom{profile.name ? `, ${profile.name}` : ''}!</h1>
          <p className="h3-sub num">
            {DAYS[t.today]} · bu hafta {t.weekLogs.length} / {profile.daysPerWeek} mashq
          </p>
        </div>
        <span className="row gap-8" style={{ flex: 'none' }}>
          <SpeakButton text={speech} />
          <Link to="/profile" className="avatar sm" aria-label="Profil va sozlamalar">
            {profile.name ? profile.name[0].toUpperCase() : <Icon name="user" size={18} />}
          </Link>
        </span>
      </header>

      <CoachBanner />

      {/* Katta karta: bugungi mashq (yoki faol / bajarilgan / dam olish holati) */}
      <section className={`h3-hero ${mode === 'rest' || mode === 'trained' ? 'rest' : ''} ${mode === 'done' ? 'done' : ''}`} aria-live="polite">
        {mode === 'rest' || mode === 'trained' ? <img src={REST_IMG} alt="" decoding="async" /> : heroImg ? <img src={heroImg} alt="" decoding="async" /> : <div className="h3-hero-blank" />}
        <span className={`h3-chip ${mode === 'done' ? 'ok' : ''} ${mode === 'rest' || mode === 'trained' ? 'calm' : ''}`}>
          {mode === 'active'
            ? 'Faol mashg‘ulot'
            : mode === 'done'
              ? '✓ Bajarildi'
              : mode === 'rest'
                ? isToday ? 'Dam olish kuni' : DAYS[sel]
                : mode === 'trained'
                  ? '✓ Bugun mashq qildingiz'
                  : isToday
                    ? `Bugungi mashq${t.deload ? ' · yengil hafta' : ''}`
                    : `${DAYS[sel]}${past && !doneThisWeek ? ' · o‘tkazib yuborilgan' : ''}`}
        </span>
        <div className="h3-in">
          {mode === 'rest' || mode === 'trained' ? (
            <>
              <h2 className="h3-title">{!isToday ? `${DAYS[sel]} — dam olish kuni` : mode === 'trained' || t.trainedToday ? 'Barakalla! Endi tiklanish' : 'Bugun mushaklar tiklanadi'}</h2>
              <p className="h3-meta">
                <Icon name="spine" size={18} /> Yengil cho‘zilish · {stretchMin} daqiqa
              </p>
              <div ref={heroBtn}>
                {isToday ? (
                  <Link to={`/stretch/${stretchId}`} className="btn btn-xl btn-block h3-go calm">
                    <Icon name="play" size={20} /> CHO‘ZILISH
                  </Link>
                ) : (
                  <button className="btn btn-secondary btn-xl btn-block h3-go" onClick={() => pickDay(t.today)}>
                    Bugungi kunga qaytish
                  </button>
                )}
              </div>
              <p className="h3-alt">
                {nextText && <>{nextText} · </>}
                <button className="link-btn" onClick={() => setFreeOpen(true)}>
                  Erkin mashg‘ulot
                </button>
              </p>
            </>
          ) : (
            <>
              <h2 className="h3-title">{mode === 'empty' ? 'Bu kun hali bo‘sh' : title}</h2>
              <p className="h3-meta num">
                {mode === 'active' ? (
                  <>
                    <Icon name="check" size={18} /> {activeDone} / {activeTotal} yondashuv bajarildi
                  </>
                ) : mode === 'empty' ? (
                  'Bitta bosishda dastur mos mashqni o‘zi tanlaydi'
                ) : (
                  <>
                    <Icon name="dumbbell" size={18} /> {day!.exercises.length} ta mashq <Icon name="clock" size={18} /> {estMin} daqiqa
                  </>
                )}
              </p>
              {mode === 'active' && (
                <div className="seg-progress mt-8" aria-hidden="true">
                  {active!.log.exercises.map((e, i) => (
                    <i key={i}>
                      <b style={{ width: `${e.sets.length ? (e.sets.filter((s) => s.done).length / e.sets.length) * 100 : 0}%` }} />
                    </i>
                  ))}
                </div>
              )}
              <div ref={heroBtn}>
                {mode === 'active' ? (
                  <button className="btn btn-primary btn-xl btn-block h3-go" onClick={() => nav('/workout')}>
                    <Icon name="play" size={20} /> DAVOM ETTIRISH
                  </button>
                ) : mode === 'start' ? (
                  <button className="btn btn-primary btn-xl btn-block h3-go" onClick={onStart}>
                    <Icon name="play" size={20} /> {ctaLabel.toUpperCase()}
                  </button>
                ) : mode === 'empty' ? (
                  <button className="btn btn-primary btn-xl btn-block h3-go" onClick={plus}>
                    <Icon name="plus" size={20} /> MASHQ QO‘SHISH
                  </button>
                ) : (
                  <Link to={dayLog ? `/summary/${dayLog.id}` : '/progress'} className="btn btn-secondary btn-xl btn-block h3-go">
                    Natijani ko‘rish
                  </Link>
                )}
              </div>
              {mode === 'active' && staleHours >= 6 && (
                <div className="stack gap-8 mt-12">
                  <span className="small">
                    <b>{staleHours} soatdan beri ochiq.</b> {activeDone ? 'Yakunlashni unutdingizmi? Bajarilgan yondashuvlar saqlanadi.' : 'Hech bir yondashuv belgilanmagan — saqlanadigan natija yo‘q.'}
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
            </>
          )}
        </div>
      </section>

      {/* Tezkor ishlar: suv, ovqat, cho‘zilish */}
      <div className="h3-quick">
        <button className="h3-q" onClick={drink} aria-label={`Bir stakan suv qo‘shish. Hozir ${glasses} / ${glassesGoal}`}>
          <Ring value={glasses / glassesGoal} color="#5ab4ff" icon="drop" />
          <b>Suv +1</b>
          <span className="num">
            {glasses} / {glassesGoal}
          </span>
        </button>
        <Link to="/nutrition" className="h3-q">
          <Ring value={np.kcal ? eatenToday / np.kcal : 0} color="#ffb547" icon="food" />
          <b>Ovqat</b>
          <span className="num">
            {Math.round(eatenToday)} / {np.kcal}
          </span>
        </Link>
        <Link to={`/stretch/${stretchId}`} className="h3-q">
          <Ring value={stretchMin ? stretchDone / stretchMin : 0} color="#c9a7ff" icon="spine" />
          <b>Cho‘zilish</b>
          <span className="num">{stretchDone > 0 ? `${Math.round(stretchDone)} / ${stretchMin} daq` : `${stretchMin} daqiqa`}</span>
        </Link>
      </div>

      {daysSince !== null && daysSince >= 5 && !active && (
        <div className="notice gold mt-16">
          <Icon name="bolt" />
          <span>{daysSince} kundan beri zalda emassiz. Qaytish uchun mukammal kun shart emas — 30 daqiqalik qisqa mashq ham hisobga kiradi.</span>
        </div>
      )}

      {/* Mashqlar ro‘yxati: soni, har mashqning menyusi, qo‘shish */}
      {day && !active && (
        <section className="section" aria-label="Mashqlar ro‘yxati">
          <div className="section-head">
            <h2>{isToday ? 'Bugungi mashqlar' : `${DAYS[sel]} mashqlari`}</h2>
            <span className="small muted">{day.title}</span>
          </div>
          {groups.length > 0 && <p className="small muted" style={{ marginTop: -4, marginBottom: 10 }}>{groups.join(' · ')}</p>}
          <div className="count-row">
            <div className="stack" style={{ gap: 2 }}>
              <b>{day.exercises.length} ta mashq</b>
              <span className="tiny muted num">
                ~{estMin} daqiqa · {totalSets} yondashuv
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
          <button className="btn btn-ghost btn-block mt-8" onClick={() => setAdding(true)}>
            <Icon name="list" size={18} /> Ro‘yxatdan tanlab qo‘shish
          </button>
        </section>
      )}

      {/* Hafta: har kun bosiladi — tanlangan kun yuqoridagi kartada ochiladi */}
      <section className="section" aria-label="Hafta">
        <div className="section-head">
          <h2>
            Bu hafta{' '}
            <span className="muted num" style={{ fontWeight: 600, fontSize: '0.8em' }}>
              · {t.weekLogs.length}/{profile.daysPerWeek}
              {streak > 1 ? ` · ${streak} hafta ketma-ket` : ''}
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
                onClick={() => pickDay(i)}
              >
                <span className="wk2-d">{d}</span>
                <span className="wk2-n num">{addDays(ws, i).getDate()}</span>
                <i aria-hidden="true">{done ? <Icon name="check" size={11} stroke={3.4} /> : null}</i>
              </button>
            );
          })}
        </div>
        <GoalStrip />
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
      </section>

      <More />

      {/* Pastki tugma — faqat katta kartadagi tugma ko‘rinmay qolganda */}
      {(active || canStart) && !heroBtnVisible && (
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

      {undo && (
        <div className="undo-bar" role="status">
          <span className="small grow">{undo.text}</span>
          <button
            className="small strong accent-text"
            onClick={() => {
              undo.revert();
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
        <p className="small muted mt-4">Javobingizga qarab yondashuvlar soni va vazn moslanadi.</p>
        <div className="stack gap-8 mt-16">
          {READY.map((o) => (
            <button
              key={o.v}
              className="choice"
              onClick={() => {
                setReadiness(o.v);
                setAskReady(false);
                // oyna tarixdan chiqib bo‘lgach boshlanadi — aks holda mashg‘ulot sahifasidan bosh sahifaga qaytib qolardi
                afterSheetClosed(() => setPending(true));
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
              const revert = snapshot();
              const add = useStore.getState().addPlanned;
              ids.forEach((id) => add(srcId, id));
              setAdding(false);
              setUndo({ text: `${ids.length} ta mashq qo‘shildi`, revert });
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

/** Pastki qism: tayyor to‘plamlar, mashqlar kutubxonasi va bugungi dars */
function More() {
  const lessonsDone = useStore((s) => s.lessonsDone);
  const lesson = LESSONS.find((l) => !lessonsDone.includes(l.id)) ?? dailyPick(LESSONS);
  return (
    <section className="section">
      <div className="section-head">
        <h2>Yana</h2>
      </div>
      <div className="grid-2">
        <Link to="/routines?tab=health" className="card tight stack gap-4" style={{ color: 'inherit' }}>
          <Icon name="heart" size={20} style={{ color: 'var(--accent)' }} />
          <b className="mt-4">Tayyor to‘plamlar</b>
          <span className="tiny muted">Uyda, sog‘liq uchun, dasturlar</span>
        </Link>
        <Link to="/library" className="card tight stack gap-4" style={{ color: 'inherit' }}>
          <Icon name="search" size={20} style={{ color: 'var(--accent)' }} />
          <b className="mt-4">Mashqlar va darslar</b>
          <span className="tiny muted">Qidirish, texnika, mushaklar</span>
        </Link>
      </div>
      <Link to={`/lesson/${lesson.id}`} className="card row gap-12 mt-12" style={{ color: 'inherit' }}>
        <span className="lesson-ico">
          <Icon name={lesson.icon} />
        </span>
        <div className="grow">
          <div className="eyebrow">Bugungi dars · {lesson.minutes} daq</div>
          <div className="subtitle mt-4">{lesson.title}</div>
        </div>
        <Icon name="right" style={{ color: 'var(--text-3)' }} />
      </Link>
    </section>
  );
}
