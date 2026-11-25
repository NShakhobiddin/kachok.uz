// Haftalik hisobot: hafta natijasi, kuch o'sishi, mushaklar, vazn va ovqat, keyingi hafta uchun tavsiyalar; do'stlarga ulashish.
import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ShareSheet } from '../components/ShareSheet';
import { Icon } from '../components/ui/Icon';
import { EXERCISE_MAP } from '../data/exercises';
import { fmtKg } from '../engine/progression';
import { defaultReportWeek, weekReport } from '../engine/report';
import { addDays, fmtDuration, isoDate, startOfWeek } from '../lib/date';
import { useBack } from '../lib/useBack';
import { useNutrition } from '../lib/useNutrition';
import { useStore } from '../store/useStore';

export default function Report() {
  const [params, setParams] = useSearchParams();
  const back = useBack('/');
  const logs = useStore((s) => s.logs);
  const profile = useStore((s) => s.profile)!;
  const body = useStore((s) => s.body);
  const food = useStore((s) => s.food);
  const setReportSeen = useStore((s) => s.setReportSeen);
  const { np } = useNutrition();
  const cur = startOfWeek(new Date());
  const q = params.get('w');
  const start = q && /^\d{4}-\d{2}-\d{2}$/.test(q) ? startOfWeek(new Date(q + 'T12:00:00')) : defaultReportWeek();
  const isCurrent = isoDate(start) === isoDate(cur);
  const r = useMemo(() => weekReport({ logs, profile, body, food, target: { kcal: np.kcal, protein: np.protein } }, start), [logs, profile, body, food, np.kcal, np.protein, start.getTime()]); // eslint-disable-line react-hooks/exhaustive-deps
  const [shareOpen, setShareOpen] = useState(false);
  useEffect(() => {
    if (!isCurrent) setReportSeen(isoDate(start));
  }, [isCurrent, start.getTime()]);
  const go = (d: number) => setParams({ w: isoDate(addDays(start, 7 * d)) }, { replace: true });
  const volDiff = r.prev.volume > 0 ? Math.round(((r.volume - r.prev.volume) / r.prev.volume) * 100) : null;

  const card = {
    kind: 'week' as const,
    label: r.label,
    done: r.workouts,
    planned: r.planned,
    streak: r.streak,
    stats: [
      ['Vaqt', fmtDuration(r.minutes)],
      ['Setlar', String(r.sets)],
      ['Ko‘tarildi', `${Math.round(r.volume).toLocaleString('ru-RU')} kg`],
      ['Rekordlar', String(r.prs.length)],
    ] as [string, string][],
    rows: r.lifts.map((l) => ({ name: l.name, value: `+${fmtKg(Math.round((l.now - l.before) * 2) / 2)} kg`, hot: true })),
    rowsTitle: 'Kuchda o‘sish (taxminiy 1RM)',
  };
  const shareText = `GYMbos haftalik hisobot (${r.label}): ${r.workouts}/${r.planned} mashg‘ulot, ${r.sets} set, ${Math.round(r.volume).toLocaleString('ru-RU')} kg${r.prs.length ? `, ${r.prs.length} ta rekord` : ''}${r.streak > 1 ? `, ${r.streak} hafta ketma-ket` : ''}. Men bilan mashq qil!`;

  return (
    <div className="page no-tab">
      <div className="back-bar">
        <button className="icon-btn" onClick={back} aria-label="Orqaga">
          <Icon name="left" />
        </button>
        <span className="eyebrow">Haftalik hisobot</span>
      </div>

      <div className="row between gap-8" style={{ alignItems: 'center' }}>
        <button className="icon-btn" onClick={() => go(-1)} aria-label="Oldingi hafta">
          <Icon name="left" />
        </button>
        <div className="stack" style={{ alignItems: 'center', gap: 2 }}>
          <h1 className="display display-m">{r.label}</h1>
          <span className="tiny muted">{isCurrent ? 'joriy hafta — davom etmoqda' : 'yakunlangan hafta'}</span>
        </div>
        <button className="icon-btn" onClick={() => go(1)} disabled={isCurrent} aria-label="Keyingi hafta">
          <Icon name="right" />
        </button>
      </div>

      {/* asosiy natija */}
      <div className="card glow mt-16 row gap-16" style={{ alignItems: 'center' }}>
        <Ring done={r.workouts} planned={r.planned} />
        <div className="stack gap-4" style={{ minWidth: 0 }}>
          <b className="title">{r.workouts >= r.planned && r.planned ? 'Reja bajarildi!' : r.workouts ? `${r.planned - r.workouts} ta mashg‘ulot qoldi` : 'Mashg‘ulot bo‘lmadi'}</b>
          <span className="small muted">
            {r.streak > 1 ? `${r.streak} hafta ketma-ket` : 'Muntazamlik — natijaning asosi'}
            {r.prev.workouts ? ` · o‘tgan hafta ${r.prev.workouts} ta` : ''}
          </span>
        </div>
      </div>

      <div className="grid-2 mt-12">
        <Stat label="Vaqt" value={fmtDuration(r.minutes)} />
        <Stat label="Setlar" value={String(r.sets)} sub={r.prev.sets ? `o‘tgan hafta ${r.prev.sets}` : undefined} />
        <Stat label="Ko‘tarildi" value={`${Math.round(r.volume).toLocaleString('ru-RU')} kg`} sub={volDiff !== null ? `${volDiff >= 0 ? '+' : ''}${volDiff}% o‘tgan haftaga` : undefined} />
        <Stat label="Rekordlar" value={String(r.prs.length)} accent={r.prs.length > 0} />
      </div>

      {/* keyingi hafta uchun */}
      {r.tips.length > 0 && (
        <section className="section">
          <div className="section-head">
            <h2>Keyingi hafta uchun</h2>
          </div>
          <div className="stack gap-8">
            {r.tips.map((t, i) => (
              <div key={i} className={`notice ${t.tone === 'warn' ? 'warn' : t.tone === 'good' ? 'good' : 'info'} small`}>
                <Icon name={t.tone === 'warn' ? 'alert' : t.tone === 'good' ? 'check' : 'bolt'} size={18} />
                <span>{t.text}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {(r.lifts.length > 0 || r.prs.length > 0) && (
        <section className="section">
          <div className="section-head">
            <h2>Kuchda o‘sish</h2>
            <span className="small muted">so‘nggi 6 haftaga nisbatan</span>
          </div>
          <div className="card flush">
            {r.lifts.map((l, i) => (
              <Link key={l.exerciseId} to={`/exercise/${l.exerciseId}`} className="row between gap-12" style={{ padding: '12px 16px', color: 'inherit', borderTop: i ? '1px solid var(--line)' : 0 }}>
                <span className="stack" style={{ gap: 2, minWidth: 0 }}>
                  <b className="small">{l.name}</b>
                  <span className="tiny muted num">
                    eng kuchli set: {fmtKg(l.kg)} kg × {l.reps}
                  </span>
                </span>
                <b className="num accent-text">+{fmtKg(Math.round((l.now - l.before) * 2) / 2)} kg</b>
              </Link>
            ))}
            {r.lifts.length === 0 &&
              r.prs.map((p, i) => (
                <div key={p.exerciseId + i} className="row between gap-12" style={{ padding: '12px 16px', borderTop: i ? '1px solid var(--line)' : 0 }}>
                  <b className="small">{EXERCISE_MAP[p.exerciseId]?.name}</b>
                  <b className="num accent-text">
                    {fmtKg(p.kg)} kg × {p.reps}
                  </b>
                </div>
              ))}
          </div>
        </section>
      )}

      {r.workouts > 0 && (
        <section className="section">
          <div className="section-head">
            <h2>Mushaklar</h2>
            <span className="small muted">haftalik setlar</span>
          </div>
          <div className="card stack gap-10">
            {r.groups
              .filter((g) => g.sets > 0 || !['calves', 'core'].includes(g.g))
              .map((g) => (
                <div key={g.g} className="stack" style={{ gap: 4 }}>
                  <div className="row between small">
                    <span>{g.name}</span>
                    <span className="num" style={{ color: g.sets < g.mev ? 'var(--yellow)' : 'var(--text)' }}>
                      {g.sets} set
                    </span>
                  </div>
                  <div className="progress" style={{ height: 6 }}>
                    <i style={{ width: `${Math.min(100, (g.sets / g.mav[1]) * 100)}%`, background: g.sets < g.mev ? 'var(--yellow)' : undefined }} />
                  </div>
                </div>
              ))}
            <span className="tiny faint">Sariq — o‘sish uchun hali kam (haftasiga kamida {Math.min(...r.groups.map((g) => g.mev))}–10 set tavsiya etiladi).</span>
          </div>
        </section>
      )}

      {(r.weight || r.food) && (
        <section className="section">
          <div className="grid-2">
            {r.weight && <Stat label="Vazn" value={`${fmtKg(r.weight.to)} kg`} sub={`${r.weight.to - r.weight.from >= 0 ? '+' : ''}${fmtKg(Math.round((r.weight.to - r.weight.from) * 10) / 10)} kg haftada`} />}
            {r.food && <Stat label="Ovqat (o‘rtacha)" value={`${r.food.kcal} kkal`} sub={`oqsil ${r.food.protein} g · ${r.food.days} kun yozilgan`} />}
          </div>
        </section>
      )}

      <div className="sticky-cta" style={{ bottom: 'calc(var(--safe-b) + 12px)' }}>
        <button className="btn btn-primary btn-xl btn-block" onClick={() => setShareOpen(true)} disabled={r.workouts === 0}>
          <Icon name="share" size={18} /> Do‘stlarga ulashish
        </button>
      </div>
      <ShareSheet open={shareOpen} onClose={() => setShareOpen(false)} card={card} text={shareText} filename={`gymbos-hafta-${isoDate(start)}.png`} feedId={`week-${isoDate(start)}`} />
    </div>
  );
}

function Ring({ done, planned }: { done: number; planned: number }) {
  const r = 34;
  const c = 2 * Math.PI * r;
  const part = planned ? Math.min(1, done / planned) : 0;
  return (
    <svg width="84" height="84" viewBox="0 0 84 84" aria-label={`${done} / ${planned} mashg‘ulot`} role="img" style={{ flex: 'none' }}>
      <circle cx="42" cy="42" r={r} fill="none" stroke="var(--surface-3)" strokeWidth="9" />
      <circle cx="42" cy="42" r={r} fill="none" stroke="var(--accent)" strokeWidth="9" strokeLinecap="round" strokeDasharray={`${c * part} ${c}`} transform="rotate(-90 42 42)" />
      <text x="42" y="49" textAnchor="middle" fill="var(--text)" style={{ font: '800 21px var(--font-display)' }}>
        {done}/{planned}
      </text>
    </svg>
  );
}

function Stat({ label, value, sub, accent }: { label: string; value: string; sub?: string; accent?: boolean }) {
  return (
    <div className="card tight stack gap-4">
      <span className="eyebrow">{label}</span>
      <b className="poster" style={{ fontSize: 26, color: accent ? 'var(--accent)' : undefined }}>
        {value}
      </b>
      {sub && <span className="tiny muted">{sub}</span>}
    </div>
  );
}
