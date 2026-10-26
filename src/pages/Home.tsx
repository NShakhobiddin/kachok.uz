import { motion } from 'framer-motion';
import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BodyHero } from '../components/BodyHero';
import { CoachBanner } from '../components/CoachBanner';
import { ExerciseThumb } from '../components/ExerciseThumb';
import { Icon } from '../components/ui/Icon';
import { Sheet } from '../components/ui/Sheet';
import { MUSCLES } from '../data/catalog';
import { EXERCISE_MAP } from '../data/exercises';
import { LESSONS } from '../data/lessons';
import { FACTS, dailyPick } from '../data/motivation';
import { sourceById } from '../data/sources';
import { fatigueLoad, loadGroups, planLoad } from '../engine/bodyLoad';
import { muscleRecovery, weekStreak } from '../engine/stats';
import { DAYS, DAYS_SHORT, MONTHS, daysBetween, isoDate } from '../lib/date';
import { useNutrition } from '../lib/useNutrition';
import { useDayPlan, useToday } from '../lib/useToday';
import { useStore } from '../store/useStore';
import type { WorkoutDay } from '../types';

export default function Home() {
  const nav = useNavigate();
  const profile = useStore((s) => s.profile)!;
  const logs = useStore((s) => s.logs);
  const active = useStore((s) => s.active);
  const startWorkout = useStore((s) => s.startWorkout);
  const t = useToday();
  const [pickDay, setPickDay] = useState(false);
  const [chosen, setChosen] = useState<WorkoutDay | null>(null);
  const day = chosen ?? t.todayDay ?? (t.missed && !t.doneToday ? t.missed : null);
  const plan = useDayPlan(day);
  const now = new Date();
  const streak = useMemo(() => weekStreak(logs, profile.daysPerWeek), [logs, profile.daysPerWeek]);
  const recovery = useMemo(() => muscleRecovery(logs), [logs]);
  const { np, eatenToday } = useNutrition();
  const finished = logs.filter((l) => l.finishedAt);
  const lastLog = [...finished].sort((a, b) => b.startedAt.localeCompare(a.startedAt))[0];
  const daysSince = lastLog ? daysBetween(new Date(lastLog.startedAt), now) : null;
  const weekMinutes = t.weekLogs.reduce((a, l) => a + l.durationMin, 0);
  const fact = dailyPick(FACTS, 3);
  const lessonsDone = useStore((s) => s.lessonsDone);
  const lesson = LESSONS.find((l) => !lessonsDone.includes(l.id)) ?? dailyPick(LESSONS);

  const begin = () => {
    if (!day) return;
    startWorkout(day, plan.map(({ pe, sug }) => ({ ...pe, sets: sug.sets, rir: sug.rir })), t.readinessToday);
    nav('/workout');
  };

  const totalSets = plan.reduce((a, x) => a + x.sug.sets, 0);
  const estMin = day?.estMin ?? 0;
  const mode: 'active' | 'plan' | 'rest' = active ? 'active' : day && !(t.doneToday && !chosen) ? 'plan' : 'rest';
  const load = useMemo(() => {
    if (active) return planLoad(active.plan.map((p) => ({ exerciseId: p.exerciseId, sets: p.sets })));
    if (mode === 'plan') return planLoad(plan.map(({ pe, sug }) => ({ exerciseId: pe.exerciseId, sets: sug.sets })));
    return fatigueLoad(recovery);
  }, [active, mode, plan, recovery]);
  const groups = loadGroups(load, MUSCLES);
  const activeDone = active ? active.log.exercises.reduce((a, e) => a + e.sets.filter((s) => s.done).length, 0) : 0;
  const activeTotal = active ? active.log.exercises.reduce((a, e) => a + e.sets.length, 0) : 0;
  const untilNext = t.nextDay ? (t.nextDay.weekday - t.today + 7) % 7 || 7 : null;

  return (
    <div className="page home">
      <header className="row between" style={{ marginBottom: 16 }}>
        <div className="stack gap-6">
          <span className="eyebrow">
            {DAYS[t.today]} · {now.getDate()} {MONTHS[now.getMonth()]}
          </span>
          <h1 className="display display-l">{profile.name ? `Salom, ${profile.name}` : 'Bugun'}</h1>
        </div>
        <Link to="/profile" className="avatar" aria-label="Profil va sozlamalar">
          {profile.name ? profile.name[0].toUpperCase() : <Icon name="user" />}
        </Link>
      </header>

      <CoachBanner />

      {/* Asosiy kartochka: 3D tana — bugun ishlaydigan (yoki hali tiklanayotgan) mushaklar */}
      <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="hero card glow">
        <div className="hero-body">
          <BodyHero
            load={load}
            label={mode === 'rest' ? `Hali tiklanayotgan mushaklar: ${groups.join(', ') || 'yo‘q'}` : `Bugun ishlaydigan mushaklar: ${groups.join(', ')}`}
          />
        </div>
        <div className="hero-copy">
          <span className="eyebrow accent">
            {mode === 'active'
              ? 'Faol mashg‘ulot'
              : mode === 'plan'
                ? `${t.todayDay?.id === day?.id ? 'Bugungi mashq' : chosen ? 'Tanlangan mashq' : `O‘tkazib yuborilgan · ${DAYS[day!.weekday]}`} · ${t.week}-hafta`
                : t.doneToday
                  ? 'Bugungi mashq bajarildi'
                  : 'Dam olish kuni'}
          </span>
          <h2 className="display display-m hero-title">
            {mode === 'active' ? active!.log.title : mode === 'plan' ? day!.title : t.doneToday ? 'Barakalla!' : 'Tiklanish ham mashq'}
          </h2>
          {groups.length > 0 && (
            <div className="stack gap-4 mt-8">
              {groups.map((g) => (
                <span key={g} className="hero-muscle">
                  <i /> {g}
                </span>
              ))}
              {mode === 'rest' && <span className="tiny muted">hali tiklanmoqda</span>}
            </div>
          )}
          {t.deload && mode === 'plan' && (
            <span className="tag mt-8" style={{ color: 'var(--yellow)', alignSelf: 'flex-start' }}>
              Yengil hafta
            </span>
          )}
        </div>
        <div className="hero-stat">
          {mode === 'active' ? (
            <>
              <span className="poster hero-num">
                {activeDone}
                <small>/{activeTotal}</small>
              </span>
              <span className="hero-unit">set bajarildi</span>
            </>
          ) : mode === 'plan' ? (
            <>
              <span className="poster hero-num">{estMin}</span>
              <span className="hero-unit">daqiqa</span>
              <span className="small muted mt-8">
                {plan.length} mashq · {totalSets} set
              </span>
            </>
          ) : t.nextDay && untilNext ? (
            <>
              <span className="poster hero-num">{untilNext}</span>
              <span className="hero-unit">kundan keyin</span>
              <span className="small muted mt-8">{t.nextDay.title}</span>
            </>
          ) : null}
        </div>
        {mode === 'active' && (
          <div className="seg-progress hero-seg" aria-hidden="true">
            {active!.log.exercises.map((e, i) => (
              <i key={i}>
                <b style={{ width: `${e.sets.length ? (e.sets.filter((s) => s.done).length / e.sets.length) * 100 : 0}%` }} />
              </i>
            ))}
          </div>
        )}
      </motion.section>

      {mode === 'active' ? (
        <button className="btn btn-primary btn-xl btn-block mt-12" onClick={() => nav('/workout')}>
          Davom ettirish <Icon name="play" size={18} />
        </button>
      ) : mode === 'plan' ? (
        <>
          <button className="btn btn-primary btn-xl btn-block mt-12" onClick={begin}>
            Boshlash <Icon name="play" size={18} />
          </button>
          <Readiness />
        </>
      ) : (
        <div className="stack gap-8 mt-12">
          <p className="small muted" style={{ padding: '0 4px' }}>
            {t.doneToday
              ? 'Mushak hozir — dam olayotganda o‘sadi: oqsil, suv va 7–9 soat uyqu.'
              : 'Mushaklar dam olishda o‘sadi. Bugun 7–10 ming qadam va 5 daqiqa cho‘zilish yetarli.'}
          </p>
          <button className="btn btn-secondary btn-block" onClick={() => setPickDay(true)}>
            Baribir mashq qilaman
          </button>
        </div>
      )}

      {daysSince !== null && daysSince >= 5 && !active && (
        <div className="notice gold mt-12">
          <Icon name="bolt" />
          <span>{daysSince} kundan beri zalda emassiz. Qaytish uchun mukammal kun shart emas — 30 daqiqalik qisqa mashq ham hisobga kiradi.</span>
        </div>
      )}

      {/* Bugungi mashqlar ro'yxati */}
      {mode === 'plan' && plan.length > 0 && (
        <section className="section">
          <div className="section-head">
            <h2>Mashqlar</h2>
            <button className="small strong accent-text" onClick={() => setPickDay(true)}>
              Boshqa kun
            </button>
          </div>
          <ol className="ex-list">
            {plan.map(({ pe, sug }, i) => {
              const ex = EXERCISE_MAP[pe.exerciseId];
              if (!ex) return null;
              return (
                <li key={pe.exerciseId + i}>
                  <Link to={`/exercise/${ex.id}`} className="ex-row">
                    <span className="ex-n">{i + 1}</span>
                    <ExerciseThumb ex={ex} size={52} />
                    <span className="grow" style={{ minWidth: 0 }}>
                      <span className="ex-name">{ex.name}</span>
                      <span className="tiny muted">{ex.primary.map((m) => MUSCLES[m].name).join(', ')}</span>
                    </span>
                    <span className="ex-meta num">
                      {sug.sets}×{pe.repMin}–{pe.repMax}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ol>
        </section>
      )}

      {/* Hafta */}
      <section className="section">
        <div className="section-head">
          <h2>Bu hafta</h2>
          <span className="small muted num">
            {t.weekLogs.length}/{profile.daysPerWeek} mashg‘ulot
          </span>
        </div>
        <div className="week-strip">
          {DAYS_SHORT.map((d, i) => {
            const planned = t.days.some((x) => x.weekday === i);
            const done = t.doneDays.has(i);
            return (
              <div key={d} className={`wk ${i === t.today ? 'today' : ''} ${done ? 'done' : planned ? 'planned' : ''}`}>
                <span>{d}</span>
                <i aria-label={done ? 'bajarildi' : planned ? 'rejada' : 'dam'}>{done && <Icon name="check" size={12} stroke={3.2} />}</i>
              </div>
            );
          })}
        </div>
        <div className="stat3 mt-12">
          <div>
            <b className="poster">{streak}</b>
            <span>hafta ketma-ket</span>
          </div>
          <div>
            <b className="poster">{weekMinutes}</b>
            <span>daqiqa bu hafta</span>
          </div>
          <div>
            <b className="poster">{finished.length}</b>
            <span>mashg‘ulot jami</span>
          </div>
        </div>
      </section>

      {/* Ovqat va suv */}
      <section className="section">
        <div className="grid-2">
          <Link to="/nutrition" className="card tight stack gap-4" style={{ color: 'inherit' }}>
            <span className="eyebrow">{eatenToday > 0 ? 'Qoldi' : 'Kunlik maqsad'}</span>
            <span className="row gap-6" style={{ alignItems: 'baseline' }}>
              <b className="poster" style={{ fontSize: 32 }}>
                {eatenToday > 0 ? Math.max(0, np.kcal - Math.round(eatenToday)) : np.kcal}
              </b>
              <span className="small muted">kkal</span>
            </span>
            <span className="tiny muted">Oqsil {np.protein} g</span>
          </Link>
          <Water goalL={np.waterL + (t.todayDay ? np.waterTrainingL : 0)} />
        </div>
      </section>

      {/* Dars va fakt */}
      <section className="section">
        <div className="section-head">
          <h2>Bugungi dars</h2>
          <Link to="/library?tab=lessons">Barchasi</Link>
        </div>
        <Link to={`/lesson/${lesson.id}`} className="card row gap-12" style={{ color: 'inherit' }}>
          <span className="lesson-ico">
            <Icon name={lesson.icon} />
          </span>
          <div className="grow">
            <div className="eyebrow">
              {lesson.category} · {lesson.minutes} daq
            </div>
            <div className="subtitle mt-4">{lesson.title}</div>
          </div>
          <Icon name="right" style={{ color: 'var(--text-3)' }} />
        </Link>
        <div className="card mt-12 stack gap-8">
          <span className="eyebrow accent">Bilasizmi?</span>
          <p style={{ fontSize: 15, lineHeight: 1.5 }}>{fact.text}</p>
          <span className="tiny faint">{sourceById(fact.source)?.short}</span>
        </div>
      </section>

      <Sheet open={pickDay} onClose={() => setPickDay(false)} label="Kun tanlash">
        <h3 className="title" style={{ marginBottom: 12 }}>
          Qaysi mashg‘ulotni bajarasiz?
        </h3>
        <div className="stack gap-8">
          {t.days.map((d) => (
            <button
              key={d.id}
              className="choice"
              onClick={() => {
                setChosen(d);
                setPickDay(false);
              }}
            >
              <span className="pill-num">{DAYS_SHORT[d.weekday]}</span>
              <div className="grow">
                <div className="ch-title">{d.title}</div>
                <div className="ch-desc">
                  {d.focus} · ~{d.estMin} daq {t.doneDayIds.has(d.id) ? '· bu hafta bajarilgan' : ''}
                </div>
              </div>
            </button>
          ))}
        </div>
      </Sheet>
    </div>
  );
}

/** Bir bosishda tayyorlik: avtoregulyatsiya uchun (charchagan — yengilroq, zo'r — to'liq) */
function Readiness() {
  const setReadiness = useStore((s) => s.setReadiness);
  const value = useStore((s) => s.readiness[isoDate()]);
  const [edit, setEdit] = useState(false);
  const OPTS = [
    { v: 1.8, label: 'Charchagan', icon: 'moon' },
    { v: 3.2, label: 'Odatdagidek', icon: 'balance' },
    { v: 4.6, label: 'Zo‘r', icon: 'bolt' },
  ];
  if (value !== undefined && !edit) {
    const msg = value >= 3.7 ? 'Tayyorsiz — bugun to‘liq kuch bilan.' : value >= 2.6 ? 'Rejadagidek: har setda 2 takror zaxira qoldiring.' : 'Yengil rejim: setlar va vazn biroz kamaytirildi.';
    return (
      <button className="ready-done" onClick={() => setEdit(true)}>
        <Icon name={value >= 3.7 ? 'bolt' : value >= 2.6 ? 'balance' : 'moon'} size={18} />
        <span className="grow small">
          <b>Tayyorlik {Math.round((value / 5) * 100)}%</b> · {msg}
        </span>
        <span className="tiny muted">o‘zgartirish</span>
      </button>
    );
  }
  return (
    <div className="ready mt-12">
      <span className="small strong">Bugun o‘zingizni qanday his qilyapsiz?</span>
      <div className="row gap-6 mt-8" role="radiogroup" aria-label="Tayyorlik">
        {OPTS.map((o) => (
          <button
            key={o.v}
            role="radio"
            aria-checked={value === o.v}
            className="ready-opt"
            onClick={() => {
              setReadiness(o.v);
              setEdit(false);
            }}
          >
            <Icon name={o.icon} size={18} />
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function Water({ goalL }: { goalL: number }) {
  const ml = useStore((s) => s.water[isoDate()] ?? 0);
  const addWater = useStore((s) => s.addWater);
  const goal = Math.round(goalL * 1000);
  return (
    <div className="card tight stack gap-4">
      <span className="eyebrow">Suv</span>
      <span className="row gap-6" style={{ alignItems: 'baseline' }}>
        <b className="poster" style={{ fontSize: 32 }}>
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
        <button className="btn btn-ghost btn-xs" onClick={() => addWater(-250)} aria-label="250 ml ayirish">
          <Icon name="minus" size={16} />
        </button>
      </div>
    </div>
  );
}
