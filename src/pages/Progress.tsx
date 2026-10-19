import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { PlateBadge } from '../components/Barbell';
import { ColumnChart, LineChart, TargetBars } from '../components/charts';
import { StrengthLevels } from '../components/StrengthLevels';
import { Icon } from '../components/ui/Icon';
import { Sheet } from '../components/ui/Sheet';
import { GROUPS, GROUP_ORDER, VOLUME_LANDMARKS, mrvAt } from '../data/catalog';
import { EXERCISE_MAP } from '../data/exercises';
import { LESSONS } from '../data/lessons';
import { ACHIEVEMENTS } from '../data/motivation';
import { groupFrequency } from '../engine/program';
import { fmtKg } from '../engine/progression';
import { allPRs, exerciseSeries, finished, lastWeeks, logSets, logVolume, totals, volumeComparison, weekStreak, weeklyInsights } from '../engine/stats';
import { fmtDate, fmtDuration } from '../lib/date';
import { useStore } from '../store/useStore';
import type { WorkoutLog } from '../types';

const PLATE_VAR: Record<string, string> = { red: 'var(--plate-red)', blue: 'var(--plate-blue)', yellow: 'var(--plate-yellow)', green: 'var(--plate-green)', white: 'var(--plate-white)' };

export default function Progress() {
  const logs = useStore((s) => s.logs);
  const profile = useStore((s) => s.profile)!;
  const lessonsDone = useStore((s) => s.lessonsDone);
  const program = useStore((s) => s.program);
  const freq = useMemo(() => groupFrequency(program ?? { days: [] }), [program]);
  const deleteLog = useStore((s) => s.deleteLog);
  const t = useMemo(() => totals(logs), [logs]);
  const weeks = useMemo(() => lastWeeks(logs, 8), [logs]);
  const insights = useMemo(() => weeklyInsights(logs, profile), [logs, profile]);
  const prs = useMemo(() => allPRs(logs), [logs]);
  const streak = useMemo(() => weekStreak(logs, profile.daysPerWeek), [logs, profile.daysPerWeek]);
  const exIds = useMemo(() => {
    const count = new Map<string, number>();
    finished(logs).forEach((l) => l.exercises.forEach((e) => count.set(e.exerciseId, (count.get(e.exerciseId) ?? 0) + 1)));
    return [...count.entries()].filter(([id]) => EXERCISE_MAP[id] && EXERCISE_MAP[id].loadType !== 'bodyweight').sort((a, b) => b[1] - a[1]).map(([id]) => id);
  }, [logs]);
  const [exSel, setExSel] = useState<string | null>(null);
  const curEx = exSel ?? exIds[0] ?? null;
  const series = useMemo(() => (curEx ? exerciseSeries(curEx, logs) : []), [curEx, logs]);
  const [open, setOpen] = useState<WorkoutLog | null>(null);
  const [confirmDel, setConfirmDel] = useState(false);
  const history = useMemo(() => finished(logs).sort((a, b) => b.startedAt.localeCompare(a.startedAt)), [logs]);
  const ctx = { logs, totalWorkouts: t.workouts, totalVolume: t.volume, totalMinutes: t.minutes, prCount: prs.length, streak, lessonsDone: lessonsDone.length, lessonsTotal: LESSONS.length };
  const cmp = volumeComparison(t.volume);
  const cur = weeks[weeks.length - 1];
  const volWeek = cur.workouts > 0 ? cur : weeks[weeks.length - 2];

  if (t.workouts === 0)
    return (
      <div className="page">
        <div className="page-head">
          <h1 className="display">Natija</h1>
        </div>
        <div className="card empty stack gap-12" style={{ alignItems: 'center' }}>
          <PlateBadge color="var(--plate-blue)" size={72} />
          <p className="title" style={{ color: 'var(--text)' }}>
            Birinchi mashg‘ulotdan keyin bu yerda statistika paydo bo‘ladi
          </p>
          <p className="small">Haftalik vaqt tahlili, rekordlar, mushaklar bo‘yicha hajm va kuch o‘sishi grafigi.</p>
          <Link to="/" className="btn btn-primary">
            Bugungi mashqqa o‘tish
          </Link>
        </div>
        <Achievements ctx={ctx} />
      </div>
    );

  return (
    <div className="page">
      <div className="page-head">
        <h1 className="display">Natija</h1>
      </div>

      <div className="grid-2">
        <Tile label="Mashg‘ulotlar" value={String(t.workouts)} />
        <Tile label="Umumiy vaqt" value={t.minutes >= 60 ? `${Math.round(t.minutes / 6) / 10} soat` : `${t.minutes} daq`} />
        <Tile label="Ko‘tarilgan" value={`${(t.volume / 1000).toFixed(1)} t`} sub={cmp.text} />
        <Tile label="Shaxsiy rekordlar" value={String(prs.length)} />
      </div>
      {cmp.next && <p className="tiny faint mt-8">Keyingi bosqich: {cmp.next}</p>}

      <section className="section">
        <div className="section-head">
          <h2>Haftalik tahlil</h2>
          <span className="small muted">{fmtDuration(cur.minutes)} bu hafta</span>
        </div>
        <div className="card stack gap-12">
          <span className="small muted">Mashg‘ulot vaqti, daqiqa (so‘nggi 8 hafta)</span>
          <ColumnChart
            label="Haftalik mashg‘ulot daqiqalari"
            unit="daq"
            data={weeks.map((w, i) => ({ label: i === weeks.length - 1 ? 'Shu' : fmtDate(w.start).split('-')[0] + '-' + fmtDate(w.start).split('-')[1].slice(0, 3), value: w.minutes, note: `${w.workouts} mashg‘ulot`, highlight: i === weeks.length - 1 }))}
          />
          <div className="stack gap-8">
            {insights.map((ins, i) => (
              <div key={i} className={`notice ${ins.tone === 'good' ? 'good' : ins.tone === 'warn' ? 'warn' : 'info'}`}>
                <Icon name={ins.tone === 'good' ? 'check' : ins.tone === 'warn' ? 'alert' : 'info'} size={18} />
                <span>
                  <b>{ins.title}.</b> {ins.text}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-head">
          <h2>Mushaklar bo‘yicha hajm</h2>
          <span className="small muted">{volWeek === cur ? 'bu hafta' : 'o‘tgan hafta'}</span>
        </div>
        <div className="card">
          <TargetBars label="Haftalik setlar mushak guruhlari bo‘yicha" rows={GROUP_ORDER.map((g) => ({ label: GROUPS[g].name, value: volWeek.groups[g], mev: VOLUME_LANDMARKS[g].mev, mav: VOLUME_LANDMARKS[g].mav, mrv: mrvAt(g, freq[g]) }))} />
        </div>
      </section>

      <section className="section">
        <div className="section-head">
          <h2>Kuch darajasi</h2>
          <span className="small muted">dunyo me’yorlari bo‘yicha</span>
        </div>
        <StrengthLevels />
      </section>

      {curEx && (
        <section className="section">
          <div className="section-head">
            <h2>Kuch o‘sishi</h2>
          </div>
          <div className="hscroll" style={{ marginBottom: 10 }}>
            {exIds.slice(0, 12).map((id) => (
              <button key={id} className={`chip ${id === curEx ? 'on' : ''}`} onClick={() => setExSel(id)}>
                {EXERCISE_MAP[id].name}
              </button>
            ))}
          </div>
          <div className="card stack gap-8">
            {series.length > 1 ? (
              <LineChart label="Taxminiy 1RM" series={series.map((s) => ({ t: new Date(s.date).getTime(), v: s.e1rm }))} unit="kg" fmtX={(x) => fmtDate(new Date(x))} />
            ) : (
              <p className="small muted">Grafik uchun kamida 2 ta mashg‘ulot kerak.</p>
            )}
            {series.length > 0 && (
              <div className="row between small">
                <span className="muted">Birinchi → oxirgi (taxminiy 1RM)</span>
                <span className="strong num">
                  {fmtKg(series[0].e1rm)} → {fmtKg(series[series.length - 1].e1rm)} kg
                  {series.length > 1 && (
                    <span style={{ color: 'var(--green)', marginLeft: 6 }}>
                      {series[series.length - 1].e1rm >= series[0].e1rm ? '+' : ''}
                      {Math.round(((series[series.length - 1].e1rm - series[0].e1rm) / Math.max(1, series[0].e1rm)) * 100)}%
                    </span>
                  )}
                </span>
              </div>
            )}
          </div>
        </section>
      )}

      {prs.length > 0 && (
        <section className="section">
          <div className="section-head">
            <h2>Rekordlar</h2>
          </div>
          <div className="card flush">
            {[...prs].reverse().slice(0, 8).map((p, i) => (
              <div key={i} className="row gap-12" style={{ padding: '10px 14px', borderBottom: '1px solid var(--line)' }}>
                <Icon name="trophy" size={18} style={{ color: 'var(--yellow)' }} />
                <div className="grow" style={{ minWidth: 0 }}>
                  <div className="small strong ellipsis">{EXERCISE_MAP[p.exerciseId]?.name}</div>
                  <div className="tiny faint">{fmtDate(p.date)}</div>
                </div>
                <span className="strong num small">
                  {fmtKg(p.kg)} × {p.reps}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      <Achievements ctx={ctx} />

      <section className="section">
        <div className="section-head">
          <h2>Tarix</h2>
          <span className="small muted">{history.length} ta</span>
        </div>
        <div className="card flush">
          {history.slice(0, 30).map((l) => (
            <button key={l.id} className="row gap-12" style={{ padding: '12px 14px', borderBottom: '1px solid var(--line)', width: '100%', textAlign: 'left' }} onClick={() => setOpen(l)}>
              <div className="stack" style={{ width: 44, alignItems: 'center' }}>
                <span style={{ fontSize: 18, fontWeight: 800 }}>{new Date(l.startedAt).getDate()}</span>
                <span className="tiny faint">{fmtDate(l.startedAt).split('-')[1].slice(0, 3)}</span>
              </div>
              <div className="grow" style={{ minWidth: 0 }}>
                <div className="strong small">{l.title}</div>
                <div className="tiny faint num">
                  {fmtDuration(l.durationMin)} · {logSets(l)} set · {Math.round(logVolume(l))} kg
                </div>
              </div>
              <Icon name="right" size={16} style={{ color: 'var(--text-3)' }} />
            </button>
          ))}
        </div>
      </section>

      <Sheet
        open={!!open}
        onClose={() => {
          setOpen(null);
          setConfirmDel(false);
        }}
        label="Mashg‘ulot tafsiloti"
      >
        {open && (
          <div className="stack gap-12">
            <div>
              <h3 className="title">{open.title}</h3>
              <p className="small muted">
                {fmtDate(open.startedAt, true)} · {fmtDuration(open.durationMin)}
              </p>
            </div>
            {open.exercises.map((e, i) => (
              <div key={i} className="stack gap-4">
                <span className="strong small">{EXERCISE_MAP[e.exerciseId]?.name}</span>
                <span className="small muted num">{e.sets.map((s) => (s.kg ? `${fmtKg(s.kg)}×${s.reps}` : `${s.reps}`)).join(' · ')}</span>
              </div>
            ))}
            <button
              className="btn btn-danger btn-block mt-8"
              onClick={() => {
                if (!confirmDel) return setConfirmDel(true);
                deleteLog(open.id);
                setConfirmDel(false);
                setOpen(null);
              }}
            >
              <Icon name="trash" size={18} /> {confirmDel ? 'Tasdiqlash: butunlay o‘chirish' : 'O‘chirish'}
            </button>
          </div>
        )}
      </Sheet>
    </div>
  );
}

function Tile({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="card tight stack gap-4">
      <span className="small muted">{label}</span>
      <span style={{ fontSize: 26, fontWeight: 800 }}>{value}</span>
      {sub && <span className="tiny faint">≈ {sub}</span>}
    </div>
  );
}

function Achievements({ ctx }: { ctx: Parameters<(typeof ACHIEVEMENTS)[number]['test']>[0] }) {
  const got = ACHIEVEMENTS.filter((a) => a.test(ctx)).length;
  return (
    <section className="section">
      <div className="section-head">
        <h2>Yutuqlar</h2>
        <span className="small muted num">
          {got}/{ACHIEVEMENTS.length}
        </span>
      </div>
      <div className="grid-3">
        {ACHIEVEMENTS.map((a) => {
          const ok = a.test(ctx);
          return (
            <div key={a.id} className="card tight stack" style={{ alignItems: 'center', textAlign: 'center', gap: 6, padding: '12px 6px' }} title={a.desc}>
              <PlateBadge color={PLATE_VAR[a.plate]} size={44} dim={!ok} />
              <span className="tiny strong" style={{ lineHeight: 1.2, color: ok ? 'var(--text)' : 'var(--text-3)' }}>
                {a.title}
              </span>
              <span className="tiny faint" style={{ lineHeight: 1.2, fontSize: 10.5 }}>
                {a.desc}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
