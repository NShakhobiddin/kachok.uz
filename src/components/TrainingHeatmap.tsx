// Mashg'ulot kalendari: so'nggi 20 hafta, har kun — bajarilgan ishchi setlar soniga qarab rang.
// Ostida: rejaga rioya (boshlangandan beri, ko'pi bilan so'nggi 12 to'liq hafta), eng uzun haftalik seriya va faol kunlar.
import { useMemo, useState } from 'react';
import { logSets } from '../engine/stats';
import { DAYS_SHORT, fmtDate, fmtDuration, isoDate, startOfWeek } from '../lib/date';
import type { WorkoutLog } from '../types';

const WEEKS = 20;
const MON = ['yan', 'fev', 'mar', 'apr', 'may', 'iyn', 'iyl', 'avg', 'sen', 'okt', 'noy', 'dek'];

/** since — foydalanuvchi qachon boshlagan (profil yaratilgan yoki birinchi mashg'ulot): rioya shu vaqtdan hisoblanadi */
export function TrainingHeatmap({ logs, perWeek, since }: { logs: WorkoutLog[]; perWeek: number; since?: string }) {
  const [sel, setSel] = useState<string | null>(null);
  const data = useMemo(() => {
    const byDay = new Map<string, WorkoutLog[]>();
    for (const l of logs) {
      if (!l.finishedAt) continue;
      const d = isoDate(new Date(l.startedAt));
      byDay.set(d, [...(byDay.get(d) ?? []), l]);
    }
    const start = startOfWeek();
    start.setDate(start.getDate() - (WEEKS - 1) * 7);
    const today = isoDate();
    const cols: { date: string; sets: number; future: boolean }[][] = [];
    const weekCounts: number[] = [];
    for (let w = 0; w < WEEKS; w++) {
      const col = [];
      let n = 0;
      for (let d = 0; d < 7; d++) {
        const dt = new Date(start.getFullYear(), start.getMonth(), start.getDate() + w * 7 + d);
        const iso = isoDate(dt);
        const ls = byDay.get(iso) ?? [];
        n += ls.length;
        col.push({ date: iso, sets: ls.reduce((a, l) => a + logSets(l), 0), future: iso > today });
      }
      cols.push(col);
      weekCounts.push(n);
    }
    // rioya: boshlangandan beri o'tgan to'liq haftalar (joriy haftasiz, 1..12); hali to'liq hafta bo'lmasa — joriy hafta
    const firstLog = logs.reduce<string | undefined>((a, l) => (l.finishedAt && (!a || l.startedAt < a) ? l.startedAt : a), undefined);
    const startAt = [since, firstLog].filter((x): x is string => !!x && !Number.isNaN(Date.parse(x))).sort()[0];
    const weeksSince = startAt ? Math.round((startOfWeek().getTime() - startOfWeek(new Date(startAt)).getTime()) / (7 * 86400000)) : 12;
    const span = Math.min(12, Math.max(0, weeksSince));
    const full = span > 0 ? weekCounts.slice(-1 - span, -1) : weekCounts.slice(-1);
    const done = full.reduce((a, n) => a + Math.min(n, perWeek), 0);
    let best = 0;
    let run = 0;
    for (const n of weekCounts.slice(0, -1)) {
      run = n >= Math.min(perWeek, 2) ? run + 1 : 0;
      best = Math.max(best, run);
    }
    const active = weekCounts.reduce((a, n) => a + n, 0);
    return { cols, byDay, adherence: full.length ? done / (full.length * perWeek) : 0, adherenceLabel: span === 0 ? 'shu hafta' : span === 1 ? 'o‘tgan hafta' : `so‘nggi ${span} hafta`, best, active };
  }, [logs, perWeek, since]);

  const level = (sets: number) => (sets === 0 ? 0 : sets < 12 ? 1 : sets < 20 ? 2 : sets < 28 ? 3 : 4);
  const picked = sel ? (data.byDay.get(sel) ?? []) : [];

  return (
    <div className="card stack gap-12">
      <div className="heat" role="grid" aria-label={`So‘nggi ${WEEKS} haftadagi mashg‘ulotlar`}>
        <span aria-hidden="true" />
        {data.cols.map((c, i) => {
          const d = new Date(c[0].date + 'T00:00:00');
          return (
            <span key={'m' + i} className="heat-month" aria-hidden="true">
              {i === 0 || d.getDate() <= 7 ? MON[d.getMonth()] : ''}
            </span>
          );
        })}
        <div className="heat-days" aria-hidden="true">
          {DAYS_SHORT.map((d, i) => (
            <span key={d}>{i % 2 === 0 ? d : ''}</span>
          ))}
        </div>
        {data.cols.map((col, i) => (
          <div key={i} role="row" className="heat-col">
            {col.map((c) => (
              <button
                key={c.date}
                role="gridcell"
                className={`heat-cell l${level(c.sets)} ${c.date === isoDate() ? 'today' : ''} ${sel === c.date ? 'sel' : ''}`}
                disabled={c.future}
                aria-label={`${fmtDate(c.date)}: ${c.sets ? `${c.sets} set` : 'dam olish'}`}
                onClick={() => setSel(sel === c.date ? null : c.date)}
              />
            ))}
          </div>
        ))}
      </div>
      <div className="row between tiny muted">
        <span>{sel ? fmtDate(sel) : 'Katakni bosing'}</span>
        <span className="row gap-4" aria-hidden="true">
          Kam{' '}
          {[0, 1, 2, 3, 4].map((l) => (
            <i key={l} className={`heat-cell l${l}`} style={{ width: 10, height: 10 }} />
          ))}{' '}
          Ko‘p
        </span>
      </div>
      {sel && (
        <div className="small" style={{ minHeight: 20 }}>
          {picked.length ? (
            picked.map((l) => (
              <div key={l.id} className="row between">
                <span className="strong">{l.title}</span>
                <span className="muted num">
                  {logSets(l)} set · {fmtDuration(l.durationMin)}
                </span>
              </div>
            ))
          ) : (
            <span className="muted">Dam olish kuni</span>
          )}
        </div>
      )}
      <div className="grid-3">
        <HeatStat k="Rejaga rioya" v={`${Math.round(data.adherence * 100)}%`} sub={data.adherenceLabel} />
        <HeatStat k="Eng uzun seriya" v={`${data.best} hafta`} sub="uzluksiz" />
        <HeatStat k="Mashg‘ulotlar" v={String(data.active)} sub={`${WEEKS} haftada`} />
      </div>
    </div>
  );
}

function HeatStat({ k, v, sub }: { k: string; v: string; sub: string }) {
  return (
    <div className="stack" style={{ gap: 2 }}>
      <span className="tiny muted">{k}</span>
      <span className="strong num" style={{ fontSize: 18 }}>
        {v}
      </span>
      <span className="tiny faint">{sub}</span>
    </div>
  );
}
