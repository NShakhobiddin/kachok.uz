import { motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Barbell, PlateBadge } from '../components/Barbell';
import { BodyMap } from '../components/BodyMap';
import { Icon } from '../components/ui/Icon';
import { EXERCISE_MAP } from '../data/exercises';
import { ACHIEVEMENTS, finishMessage } from '../data/motivation';
import { LESSONS } from '../data/lessons';
import { fmtKg } from '../engine/progression';
import { allPRs, detectPRs, logSets, logVolume, totals, volumeComparison, weekStreak } from '../engine/stats';
import { fmtDuration } from '../lib/date';
import { useStore } from '../store/useStore';
import type { MuscleId } from '../types';

const PLATE_VAR: Record<string, string> = { red: 'var(--plate-red)', blue: 'var(--plate-blue)', yellow: 'var(--plate-yellow)', green: 'var(--plate-green)', white: 'var(--plate-white)' };

export default function Summary() {
  const { id } = useParams();
  const logs = useStore((s) => s.logs);
  const profile = useStore((s) => s.profile)!;
  const seen = useStore((s) => s.seenAchievements);
  const markAchievements = useStore((s) => s.markAchievements);
  const lessonsDone = useStore((s) => s.lessonsDone);
  const [copied, setCopied] = useState(false);
  const log = logs.find((l) => l.id === id);
  // rekordlar tarixdan hisoblanadi (sahifa qayta yuklansa ham yo'qolmaydi): shu mashg'ulotdan oldingilarga nisbatan
  const prs = useMemo(() => (log ? detectPRs(log, logs.filter((l) => l.id !== log.id && l.startedAt < log.startedAt)) : []), [log, logs]);
  const finishedCount = logs.filter((l) => l.finishedAt).length;
  const streak = useMemo(() => weekStreak(logs, profile.daysPerWeek), [logs, profile.daysPerWeek]);
  // yangi yutuqlar sahifa ochilganda bir marta aniqlanadi va "ko'rilgan" deb belgilanadi — ekranda qoladi
  const [newAch] = useState(() => {
    const t = totals(logs);
    const ctx = { logs, totalWorkouts: t.workouts, totalVolume: t.volume, totalMinutes: t.minutes, prCount: allPRs(logs).length, streak, lessonsDone: lessonsDone.length, lessonsTotal: LESSONS.length };
    return ACHIEVEMENTS.filter((a) => !seen.includes(a.id) && a.test(ctx));
  });
  useEffect(() => {
    if (newAch.length) markAchievements(newAch.map((a) => a.id));
  }, [newAch, markAchievements]);

  if (!log)
    return (
      <div className="page no-tab empty stack gap-16" style={{ alignItems: 'center' }}>
        <p>Mashg‘ulot topilmadi.</p>
        <Link to="/" className="btn btn-primary">
          Bosh sahifaga
        </Link>
      </div>
    );
  const vol = logVolume(log);
  const sets = logSets(log);
  const msg = finishMessage(prs.length, finishedCount, streak);
  const cmp = volumeComparison(vol);
  const prim = Array.from(new Set(log.exercises.flatMap((e) => EXERCISE_MAP[e.exerciseId]?.primary ?? []))) as MuscleId[];
  const sec = Array.from(new Set(log.exercises.flatMap((e) => EXERCISE_MAP[e.exerciseId]?.secondary ?? []))).filter((m) => !prim.includes(m)) as MuscleId[];

  const share = async () => {
    const text = `Kachok: ${log.title} — ${fmtDuration(log.durationMin)}, ${sets} set, ${Math.round(vol)} kg${prs.length ? `, ${prs.length} ta yangi rekord` : ''}. 💪`;
    try {
      if (navigator.share) await navigator.share({ text, title: 'Kachok' });
      else {
        await navigator.clipboard.writeText(text);
        setCopied(true);
      }
    } catch {
      /* bekor qilindi */
    }
  };

  return (
    <div className="page no-tab">
      <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: 'spring', damping: 20 }} className="stack gap-8" style={{ marginTop: 18 }}>
        <span className="eyebrow">{log.title}</span>
        <h1 className="display" style={{ fontSize: 50 }}>
          {msg.title}
        </h1>
        <p className="muted" style={{ fontSize: 16 }}>
          {msg.text}
        </p>
      </motion.div>

      <div className="mt-16">
        <Barbell plates={log.exercises.map(() => ({ progress: 1 }))} />
      </div>

      <div className="grid-2 mt-16">
        <Stat label="Vaqt" value={fmtDuration(log.durationMin)} />
        <Stat label="Setlar" value={String(sets)} />
        <Stat label="Ko‘tarilgan og‘irlik" value={`${Math.round(vol).toLocaleString('ru-RU')} kg`} sub={vol > 0 ? `≈ ${cmp.text}` : undefined} />
        <Stat label="Rekordlar" value={String(prs.length)} accent={prs.length > 0} />
      </div>

      {prs.length > 0 && (
        <section className="section">
          <div className="section-head">
            <h2>Yangi rekordlar</h2>
          </div>
          <div className="stack gap-8">
            {prs.map((p, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 + i * 0.15 }} className="card tight row gap-12">
                <PlateBadge color="var(--plate-yellow)" size={44}>
                  <Icon name="trophy" size={16} style={{ color: '#0b0e12' }} />
                </PlateBadge>
                <div className="grow">
                  <div className="strong">{EXERCISE_MAP[p.exerciseId]?.name}</div>
                  <div className="small muted num">
                    {fmtKg(p.kg)} kg × {p.reps} · {p.kind === 'weight' ? "eng og‘ir vazn" : `taxminiy 1RM ${fmtKg(p.value)} kg`}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {newAch.length > 0 && (
        <section className="section">
          <div className="section-head">
            <h2>Yangi yutuq</h2>
          </div>
          <div className="stack gap-8">
            {newAch.slice(0, 3).map((a) => (
              <motion.div key={a.id} initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', delay: 0.4 }} className="card tight row gap-12">
                <PlateBadge color={PLATE_VAR[a.plate]} size={48} />
                <div>
                  <div className="strong">{a.title}</div>
                  <div className="small muted">{a.desc}</div>
                </div>
              </motion.div>
            ))}
            {newAch.length > 3 && (
              <Link to="/progress" className="small strong" style={{ textAlign: 'center', padding: 6 }}>
                Yana {newAch.length - 3} ta yutuq — barchasini ko‘rish
              </Link>
            )}
          </div>
        </section>
      )}

      <section className="section">
        <div className="section-head">
          <h2>Ishlagan mushaklar</h2>
        </div>
        <div className="card">
          <BodyMap primary={prim} secondary={sec} height={200} />
        </div>
      </section>

      <section className="section">
        <div className="card stack gap-8">
          {log.exercises.map((e, i) => {
            const ex = EXERCISE_MAP[e.exerciseId];
            return (
              <div key={i} className="row between gap-12 small">
                <span className="strong ellipsis">{ex?.name}</span>
                <span className="muted num" style={{ flex: 'none' }}>
                  {e.sets.map((s) => (s.kg ? `${fmtKg(s.kg)}×${s.reps}` : `${s.reps}`)).join(' · ')}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      <div className="row gap-8 mt-24">
        <button className="btn btn-secondary" onClick={share} aria-label="Ulashish">
          <Icon name="share" size={18} />
        </button>
        <Link to="/" className="btn btn-primary grow">
          Bosh sahifa
        </Link>
      </div>
      {copied && (
        <p className="small mt-8" role="status" style={{ textAlign: 'center', color: 'var(--green)' }}>
          Natija matni nusxalandi — Telegramga joylashtiring.
        </p>
      )}
      <p className="small faint mt-16" style={{ textAlign: 'center' }}>
        Endi: oqsilli ovqat, suv va 7–9 soat uyqu.
      </p>
    </div>
  );
}

function Stat({ label, value, sub, accent }: { label: string; value: string; sub?: string; accent?: boolean }) {
  return (
    <div className="card tight stack gap-4" style={accent ? { borderColor: 'var(--yellow)', background: 'var(--yellow-soft)' } : undefined}>
      <span className="small muted">{label}</span>
      <span style={{ fontSize: 24, fontWeight: 800 }}>{value}</span>
      {sub && <span className="tiny faint">{sub}</span>}
    </div>
  );
}
