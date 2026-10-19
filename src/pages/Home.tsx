import { motion } from 'framer-motion';
import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Barbell } from '../components/Barbell';
import { BodyMap } from '../components/BodyMap';
import { CoachBanner } from '../components/CoachBanner';
import { Icon } from '../components/ui/Icon';
import { Sheet } from '../components/ui/Sheet';
import { MUSCLES } from '../data/catalog';
import { LESSONS } from '../data/lessons';
import { FACTS, QUOTES, dailyPick } from '../data/motivation';
import { sourceById } from '../data/sources';
import { nutritionPlan } from '../engine/nutrition';
import { muscleRecovery, weekStreak } from '../engine/stats';
import { DAYS, DAYS_SHORT, MONTHS, daysBetween, fmtDuration, greeting, isoDate } from '../lib/date';
import { useDayPlan, useToday } from '../lib/useToday';
import { useStore } from '../store/useStore';
import type { MuscleId, WorkoutDay } from '../types';

export default function Home() {
  const nav = useNavigate();
  const profile = useStore((s) => s.profile)!;
  const logs = useStore((s) => s.logs);
  const active = useStore((s) => s.active);
  const startWorkout = useStore((s) => s.startWorkout);
  const kcalAdjust = useStore((s) => s.kcalAdjust);
  const t = useToday();
  const [pickDay, setPickDay] = useState(false);
  const [chosen, setChosen] = useState<WorkoutDay | null>(null);
  const day = chosen ?? t.todayDay ?? (t.missed && !t.doneToday ? t.missed : null);
  const plan = useDayPlan(day);
  const now = new Date();
  const streak = useMemo(() => weekStreak(logs, profile.daysPerWeek), [logs, profile.daysPerWeek]);
  const recovery = useMemo(() => muscleRecovery(logs), [logs]);
  const np = useMemo(() => nutritionPlan(profile, kcalAdjust), [profile, kcalAdjust]);
  const lastLog = [...logs].filter((l) => l.finishedAt).sort((a, b) => b.startedAt.localeCompare(a.startedAt))[0];
  const daysSince = lastLog ? daysBetween(new Date(lastLog.startedAt), now) : null;
  const weekMinutes = t.weekLogs.reduce((a, l) => a + l.durationMin, 0);
  const quote = dailyPick(QUOTES);
  const fact = dailyPick(FACTS, 3);
  const lessonsDone = useStore((s) => s.lessonsDone);
  const lesson = LESSONS.find((l) => !lessonsDone.includes(l.id)) ?? dailyPick(LESSONS);

  const begin = () => {
    if (!day) return;
    startWorkout(day, plan.map(({ pe, sug }) => ({ ...pe, sets: sug.sets, rir: sug.rir })), t.readinessToday);
    nav('/workout');
  };

  const fresh = (Object.entries(recovery) as [MuscleId, number][]).filter(([, v]) => v < 0.8).map(([m]) => m);
  const totalSets = plan.reduce((a, x) => a + x.sug.sets, 0);
  const estMin = day?.estMin ?? 0;

  return (
    <div className="page">
      <header className="row between" style={{ marginBottom: 18 }}>
        <div className="stack gap-4">
          <span className="eyebrow">
            {DAYS[t.today]} · {now.getDate()} {MONTHS[now.getMonth()]}
          </span>
          <h1 style={{ fontSize: 24, fontWeight: 800, letterSpacing: '-0.01em' }}>
            {greeting(now)}
            {profile.name ? `, ${profile.name}` : ''}
          </h1>
        </div>
        <Link to="/profile" className="icon-btn filled" aria-label="Profil va sozlamalar">
          {profile.name ? <span style={{ fontWeight: 800, fontSize: 17 }}>{profile.name[0].toUpperCase()}</span> : <Icon name="user" />}
        </Link>
      </header>

      <CoachBanner />

      {active ? (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="card raised stack gap-12" style={{ borderColor: 'var(--blue)' }}>
          <span className="eyebrow" style={{ color: 'var(--blue-2)' }}>
            Faol mashg‘ulot
          </span>
          <h2 className="display display-l">{active.log.title}</h2>
          <Barbell plates={active.log.exercises.map((e) => ({ progress: e.sets.length ? e.sets.filter((s) => s.done).length / e.sets.length : 0 }))} />
          <button className="btn btn-primary btn-block" onClick={() => nav('/workout')}>
            Davom ettirish <Icon name="play" size={18} />
          </button>
        </motion.div>
      ) : day && !(t.doneToday && !chosen) ? (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="card raised stack gap-12">
          <div className="row between">
            <span className="eyebrow">
              {t.todayDay?.id === day.id ? 'Bugungi mashq' : chosen ? 'Tanlangan mashq' : `O‘tkazib yuborilgan · ${DAYS[day.weekday]}`} · {t.week}-hafta
            </span>
            {t.deload && <span className="tag" style={{ color: 'var(--yellow)' }}>Yengil hafta</span>}
          </div>
          <div>
            <h2 className="display display-l">{day.title}</h2>
            <p className="muted small mt-4">{day.focus}</p>
          </div>
          <Barbell plates={plan.map(() => ({ progress: 0 }))} label={`${plan.length} ta mashq rejada`} />
          <div className="row gap-16 small">
            <span className="row gap-6 muted">
              <Icon name="dumbbell" size={16} /> {plan.length} mashq
            </span>
            <span className="row gap-6 muted">
              <Icon name="list" size={16} /> {totalSets} set
            </span>
            <span className="row gap-6 muted">
              <Icon name="clock" size={16} /> ~{estMin} daq
            </span>
          </div>
          <Readiness />
          <button className="btn btn-primary btn-block" onClick={begin}>
            <Icon name="play" size={18} /> Mashqni boshlash
          </button>
          <div className="row between">
            <Link to="/program" className="small strong" style={{ color: 'var(--text-2)' }}>
              Mashqlarni ko‘rish
            </Link>
            <button className="small strong" style={{ color: 'var(--text-2)' }} onClick={() => setPickDay(true)}>
              Boshqa kunni tanlash
            </button>
          </div>
        </motion.div>
      ) : (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="card raised stack gap-12">
          <span className="eyebrow">{t.doneToday ? 'Bugungi mashq bajarildi' : 'Dam olish kuni'}</span>
          <h2 className="display display-l">{t.doneToday ? 'Barakalla!' : 'Tiklanish ham mashq'}</h2>
          <p className="muted">
            {t.doneToday
              ? 'Mushak hozir, dam olayotganda o‘sadi: oqsil, suv va 7–9 soat uyqu.'
              : "Mushaklar dam olishda o‘sadi. Bugun 7–10 ming qadam yurish va 5 daqiqa cho‘zilish yetarli."}
          </p>
          {t.nextDay && (
            <div className="notice">
              <Icon name="calendar" />
              <span>
                Keyingi mashg‘ulot: <b>{DAYS[t.nextDay.weekday]}</b> — {t.nextDay.title}
              </span>
            </div>
          )}
          <button className="btn btn-secondary btn-block" onClick={() => setPickDay(true)}>
            Baribir mashq qilaman
          </button>
        </motion.div>
      )}

      {daysSince !== null && daysSince >= 5 && !active && (
        <div className="notice gold mt-12">
          <Icon name="bolt" />
          <span>
            {daysSince} kundan beri zalda emassiz. Qaytish uchun mukammal kun kerak emas — 30 daqiqalik qisqa mashq ham hisobga kiradi.
          </span>
        </div>
      )}

      {/* Hafta */}
      <section className="section">
        <div className="section-head">
          <h2>Bu hafta</h2>
          <span className="small muted num">
            {t.weekLogs.length}/{profile.daysPerWeek} mashq · {fmtDuration(weekMinutes)}
          </span>
        </div>
        <div className="row" style={{ gap: 6 }}>
          {DAYS_SHORT.map((d, i) => {
            const planned = t.days.some((x) => x.weekday === i);
            const done = t.doneDays.has(i);
            const isToday = i === t.today;
            return (
              <div
                key={d}
                className="stack"
                style={{
                  flex: 1,
                  alignItems: 'center',
                  gap: 6,
                  padding: '10px 0',
                  borderRadius: 14,
                  background: isToday ? 'var(--surface-2)' : 'transparent',
                  border: `1px solid ${isToday ? 'var(--line-2)' : 'transparent'}`,
                }}
              >
                <span className="tiny strong" style={{ color: isToday ? 'var(--text)' : 'var(--text-3)' }}>
                  {d}
                </span>
                <span
                  aria-label={done ? 'bajarildi' : planned ? 'rejada' : 'dam'}
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: '50%',
                    display: 'grid',
                    placeItems: 'center',
                    background: done ? 'var(--green)' : 'transparent',
                    border: done ? 'none' : planned ? '2px solid var(--blue)' : '2px dashed var(--line-2)',
                    color: '#062414',
                  }}
                >
                  {done && <Icon name="check" size={13} stroke={3.2} />}
                </span>
              </div>
            );
          })}
        </div>
        <div className="grid-2 mt-12">
          <div className="card tight stack gap-4">
            <span className="row gap-6 small muted">
              <Icon name="flame" size={16} style={{ color: 'var(--red)' }} /> Haftalik seriya
            </span>
            <span style={{ fontSize: 26, fontWeight: 800 }}>
              {streak} <span className="small muted">hafta</span>
            </span>
          </div>
          <Link to="/nutrition" className="card tight stack gap-4" style={{ color: 'inherit' }}>
            <span className="row gap-6 small muted">
              <Icon name="food" size={16} style={{ color: 'var(--green)' }} /> Kunlik maqsad
            </span>
            <span style={{ fontSize: 26, fontWeight: 800 }}>
              {np.kcal} <span className="small muted">kkal</span>
            </span>
            <span className="tiny faint">Oqsil {np.protein} g</span>
          </Link>
        </div>
      </section>

      <WaterCard goalL={np.waterL + (t.todayDay ? np.waterTrainingL : 0)} />

      {/* Tiklanish xaritasi */}
      <section className="section">
        <div className="section-head">
          <h2>Mushaklar tiklanishi</h2>
          <span className="small muted">so‘nggi 6 kun</span>
        </div>
        <div className="card">
          <BodyMap recovery={recovery} height={210} />
          <div className="row gap-12 center tiny muted mt-12">
            <span className="row gap-6">
              <i className="dot" style={{ background: 'var(--green)' }} /> Tayyor
            </span>
            <span className="row gap-6">
              <i className="dot" style={{ background: 'var(--yellow)' }} /> Tiklanmoqda
            </span>
            <span className="row gap-6">
              <i className="dot" style={{ background: 'var(--red)' }} /> Charchagan
            </span>
          </div>
          {fresh.length > 0 && <p className="small muted mt-12">Hali tiklanmoqda: {Array.from(new Set(fresh.map((m) => MUSCLES[m].name))).slice(0, 4).join(', ')}.</p>}
        </div>
      </section>

      {/* Dars */}
      <section className="section">
        <div className="section-head">
          <h2>Bugungi dars</h2>
          <Link to="/library?tab=lessons" className="small strong">
            Barchasi
          </Link>
        </div>
        <Link to={`/lesson/${lesson.id}`} className="card row gap-12" style={{ color: 'inherit' }}>
          <span style={{ width: 52, height: 52, borderRadius: 14, background: `var(--plate-${lesson.plate})`, display: 'grid', placeItems: 'center', flex: 'none', color: lesson.plate === 'white' || lesson.plate === 'yellow' ? '#111' : '#fff' }}>
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
      </section>

      {/* Fakt va iqtibos */}
      <section className="section">
        <div className="card stack gap-8" style={{ background: 'var(--blue-soft)', borderColor: 'rgba(58,116,255,.3)' }}>
          <span className="eyebrow" style={{ color: 'var(--blue-2)' }}>
            Bilasizmi?
          </span>
          <p style={{ fontSize: 16, lineHeight: 1.5 }}>{fact.text}</p>
          <span className="tiny faint">{sourceById(fact.source)?.short}</span>
        </div>
        <blockquote className="mt-16" style={{ margin: '16px 0 0', padding: '0 4px' }}>
          <p className="display" style={{ fontSize: 26, lineHeight: 1.05 }}>
            «{quote.text}»
          </p>
          {quote.by && <p className="small faint mt-8">— {quote.by}</p>}
        </blockquote>
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

function Readiness() {
  const setReadiness = useStore((s) => s.setReadiness);
  const value = useStore((s) => s.readiness[isoDate()]);
  const [ans, setAns] = useState<Record<string, number>>({});
  const [open, setOpen] = useState(false);
  const Q = [
    { k: 'sleep', q: 'Uyqu', o: ['Yomon', "O‘rtacha", 'Yaxshi'] },
    { k: 'sore', q: "Mushak og‘rig‘i", o: ['Kuchli', 'Biroz', "Yo‘q"] },
    { k: 'energy', q: 'Energiya', o: ['Past', "O‘rtacha", 'Yuqori'] },
  ];
  if (value !== undefined && !open) {
    const tone = value >= 3.7 ? 'good' : value >= 2.6 ? 'gold' : 'warn';
    const msg = value >= 3.7 ? "Tayyorsiz — bugun to‘liq kuch bilan." : value >= 2.6 ? 'Rejadagidek, har setda 2 takror zaxira qoldiring.' : "Yengillashtirilgan rejim: setlar va vazn biroz kamaytirildi.";
    return (
      <button className={`notice ${tone}`} onClick={() => setOpen(true)} style={{ textAlign: 'left' }}>
        <Icon name={value >= 3.7 ? 'bolt' : value >= 2.6 ? 'info' : 'moon'} />
        <span className="grow">
          <b>Tayyorlik: {Math.round((value / 5) * 100)}%</b> · {msg}
        </span>
      </button>
    );
  }
  return (
    <div className="stack gap-10" style={{ padding: 12, borderRadius: 14, background: 'var(--bg-2)', border: '1px solid var(--line)' }}>
      <span className="small strong">Bugun o‘zingizni qanday his qilyapsiz?</span>
      {Q.map((q) => (
        <div key={q.k} className="row gap-8">
          <span className="small muted" style={{ width: 104, flex: 'none' }}>
            {q.q}
          </span>
          <div className="row gap-6 grow">
            {q.o.map((o, i) => (
              <button key={o} className={`chip sm ${ans[q.k] === i ? 'on' : ''}`} style={{ flex: 1, justifyContent: 'center' }} onClick={() => setAns((a) => ({ ...a, [q.k]: i }))}>
                {o}
              </button>
            ))}
          </div>
        </div>
      ))}
      <button
        className="btn btn-secondary btn-sm"
        disabled={Object.keys(ans).length < 3}
        onClick={() => {
          const avg = Object.values(ans).reduce((a, b) => a + [1, 3, 5][b], 0) / 3;
          setReadiness(Math.round(avg * 10) / 10);
          setOpen(false);
        }}
      >
        Saqlash
      </button>
    </div>
  );
}

function WaterCard({ goalL }: { goalL: number }) {
  const ml = useStore((s) => s.water[isoDate()] ?? 0);
  const addWater = useStore((s) => s.addWater);
  const goal = Math.round(goalL * 1000);
  const cups = Math.ceil(goal / 250);
  const filled = Math.floor(ml / 250);
  return (
    <section className="section">
      <div className="card stack gap-12">
        <div className="row between">
          <span className="row gap-8 strong">
            <Icon name="drop" size={18} style={{ color: 'var(--blue-2)' }} /> Suv
          </span>
          <span className="small muted num">
            {(ml / 1000).toFixed(2)} / {(goal / 1000).toFixed(1)} L
          </span>
        </div>
        <div className="row gap-6 wrap" aria-hidden>
          {Array.from({ length: cups }, (_, i) => (
            <span key={i} style={{ width: 20, height: 26, borderRadius: '3px 3px 7px 7px', border: '1.5px solid var(--line-2)', position: 'relative', overflow: 'hidden' }}>
              <motion.i
                initial={false}
                animate={{ height: i < filled ? '100%' : '0%' }}
                style={{ position: 'absolute', left: 0, right: 0, bottom: 0, background: 'var(--blue)', display: 'block' }}
              />
            </span>
          ))}
        </div>
        <div className="row gap-8">
          <button className="btn btn-secondary btn-sm grow" onClick={() => addWater(250)}>
            +250 ml
          </button>
          <button className="btn btn-secondary btn-sm grow" onClick={() => addWater(500)}>
            +500 ml
          </button>
          <button className="btn btn-ghost btn-sm" onClick={() => addWater(-250)} aria-label="250 ml ayirish">
            <Icon name="minus" size={18} />
          </button>
        </div>
        <span className="tiny faint">EFSA tavsiyasi asosida + mashq kunlari qo‘shimcha suv.</span>
      </div>
    </section>
  );
}
