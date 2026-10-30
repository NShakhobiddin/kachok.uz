// Murabbiy: bitta mijozning natijalari, dasturini tahrirlash va xabar yozish.
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ColumnChart, LineChart } from '../components/charts';
import { DayEditor } from '../components/DayEditor';
import { Icon } from '../components/ui/Icon';
import { Sheet } from '../components/ui/Sheet';
import { api, ApiError } from '../api/client';
import { EXERCISE_MAP } from '../data/exercises';
import { INJURIES } from '../data/catalog';
import { weightTrend } from '../engine/nutrition';
import { generateProgram, swapPlanned } from '../engine/program';
import { allPRs, lastWeeks, logSets, logVolume, totals, weeklyInsights } from '../engine/stats';
import { DAYS_SHORT, fmtDate, fmtDuration } from '../lib/date';
import type { BodyEntry, PlannedExercise, Profile, Program, WorkoutDay, WorkoutLog } from '../types';
import { GOALS, LEVELS } from './Onboarding';

interface ClientData {
  client: { id: string; name: string; phone: string };
  profile: Profile | null;
  program: Program | null;
  logs: WorkoutLog[];
  body: BodyEntry[];
}
interface Note {
  id: string;
  text: string;
  created_at: string;
}

type Tab = 'stats' | 'program' | 'notes';

export default function CoachClient() {
  const { id = '' } = useParams();
  const nav = useNavigate();
  const [data, setData] = useState<ClientData | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [tab, setTab] = useState<Tab>('stats');

  useEffect(() => {
    api<ClientData>(`/coach/clients/${id}`)
      .then(setData)
      .catch((e) => setErr(e instanceof ApiError ? e.message : 'Yuklanmadi'));
  }, [id]);

  return (
    <div className="page">
      <div className="back-bar">
        <button className="icon-btn" onClick={() => nav('/coach')} aria-label="Orqaga">
          <Icon name="left" />
        </button>
      </div>
      {err && <div className="card empty">{err}</div>}
      {!data && !err && <div className="card empty">Yuklanmoqda...</div>}
      {data && (
        <>
          <Header data={data} />
          <div className="segmented mt-16" role="tablist" aria-label="Bo‘limlar">
            {(
              [
                ['stats', 'Natijalar'],
                ['program', 'Dastur'],
                ['notes', 'Xabarlar'],
              ] as [Tab, string][]
            ).map(([k, label]) => (
              <button key={k} role="tab" aria-selected={tab === k} className={tab === k ? 'on' : ''} onClick={() => setTab(k)}>
                {label}
              </button>
            ))}
          </div>
          {tab === 'stats' && <Stats data={data} />}
          {tab === 'program' && <ProgramEditor data={data} onSaved={(program) => setData({ ...data, program })} />}
          {tab === 'notes' && <Notes clientId={id} onRemoved={() => nav('/coach', { replace: true })} />}
        </>
      )}
    </div>
  );
}

function Header({ data }: { data: ClientData }) {
  const p = data.profile;
  const name = data.client.name || p?.name || data.client.phone;
  return (
    <div className="stack gap-12">
      <div className="row gap-16">
        <span style={{ width: 56, height: 56, borderRadius: 18, background: 'var(--surface-3)', display: 'grid', placeItems: 'center', fontSize: 24, fontWeight: 800 }}>{name[0]?.toUpperCase()}</span>
        <div style={{ minWidth: 0 }}>
          <h1 className="display display-m ellipsis">{name}</h1>
          <p className="small muted num">{p ? `${p.sex === 'female' ? 'Ayol' : 'Erkak'} · ${p.age} yosh · ${p.heightCm} sm · ${p.weightKg} kg` : data.client.phone}</p>
        </div>
      </div>
      {p && (
        <div className="row wrap gap-6">
          <span className="tag">{GOALS.find((g) => g.id === p.goal)?.title.split(' (')[0]}</span>
          <span className="tag">{LEVELS.find((l) => l.id === p.level)?.title}</span>
          <span className="tag num">
            {p.daysPerWeek} kun · {p.sessionMin} daq
          </span>
          {p.injuries.map((i) => (
            <span key={i} className="tag" style={{ color: 'var(--red)' }}>
              {INJURIES.find((x) => x.id === i)?.name ?? i}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

function Stats({ data }: { data: ClientData }) {
  const { logs, profile, body } = data;
  const weeks = useMemo(() => lastWeeks(logs, 8), [logs]);
  const t = useMemo(() => totals(logs), [logs]);
  const insights = useMemo(() => (profile ? weeklyInsights(logs, profile) : []), [logs, profile]);
  const prs = useMemo(() => allPRs(logs).slice(-5).reverse(), [logs]);
  const trend = useMemo(() => weightTrend(body), [body]);
  const recent = useMemo(() => [...logs].sort((a, b) => b.startedAt.localeCompare(a.startedAt)).slice(0, 12), [logs]);

  if (!logs.length) return <div className="card empty mt-16">Mijoz hali mashg‘ulot yozmagan. U ilovada mashq qilib, internetga ulanganda natijalar shu yerda chiqadi.</div>;

  return (
    <div className="stack gap-16 mt-16">
      <div className="grid-2">
        <Kpi label="Mashg‘ulotlar" value={String(t.workouts)} />
        <Kpi label="Umumiy vaqt" value={fmtDuration(t.minutes)} />
      </div>

      <div className="card stack gap-12">
        <span className="small muted">Haftalik mashg‘ulot vaqti, daqiqa</span>
        <ColumnChart
          label="Mijozning haftalik mashg‘ulot daqiqalari"
          unit="daq"
          data={weeks.map((w, i) => ({ label: i === weeks.length - 1 ? 'Shu' : shortDate(w.start), value: w.minutes, note: `${w.workouts} mashg‘ulot`, highlight: i === weeks.length - 1 }))}
        />
        {insights.map((ins, i) => (
          <div key={i} className={`notice ${ins.tone}`}>
            <Icon name={ins.tone === 'good' ? 'check' : ins.tone === 'warn' ? 'alert' : 'info'} size={18} />
            <span>
              <b>{ins.title}.</b> {ins.text}
            </span>
          </div>
        ))}
      </div>

      {trend.length >= 2 && (
        <div className="card stack gap-12">
          <span className="small muted">Tana vazni</span>
          <LineChart
            label="Mijozning tana vazni"
            series={trend.map((p) => ({ t: new Date(p.date).getTime(), v: p.trend }))}
            dots={trend.map((p) => ({ t: new Date(p.date).getTime(), v: p.raw }))}
            unit="kg"
            fmtX={(x) => fmtDate(new Date(x))}
          />
        </div>
      )}

      {prs.length > 0 && (
        <div className="card stack gap-8">
          <span className="small muted">So‘nggi rekordlar</span>
          {prs.map((pr, i) => (
            <div key={i} className="row between small">
              <span>{EXERCISE_MAP[pr.exerciseId]?.name ?? pr.exerciseId}</span>
              <span className="strong num" style={{ color: 'var(--yellow)' }}>
                {pr.kg} kg × {pr.reps}
              </span>
            </div>
          ))}
        </div>
      )}

      <div className="stack gap-8">
        <span className="eyebrow">So‘nggi mashg‘ulotlar</span>
        {recent.map((l) => (
          <LogCard key={l.id} log={l} />
        ))}
      </div>
    </div>
  );
}

const shortDate = (d: Date) => {
  const [day, month] = fmtDate(d).split('-');
  return `${day}-${month.slice(0, 3)}`;
};

function LogCard({ log }: { log: WorkoutLog }) {
  const [open, setOpen] = useState(false);
  const fb = log.feedback;
  return (
    <div className="card tight">
      <button className="row between gap-12" style={{ width: '100%', textAlign: 'left' }} onClick={() => setOpen(!open)} aria-expanded={open}>
        <div style={{ minWidth: 0 }}>
          <div className="strong ellipsis">{log.title}</div>
          <div className="tiny muted num">
            {fmtDate(log.startedAt)} · {log.durationMin} daq · {logSets(log)} set · {Math.round(logVolume(log)).toLocaleString('ru-RU')} kg
          </div>
        </div>
        <Icon name={open ? 'up' : 'down'} size={16} />
      </button>
      {fb && (fb.joints >= 2 || fb.soreness >= 3) && (
        <div className="tiny mt-8" style={{ color: 'var(--yellow)' }}>
          {fb.joints >= 2 ? 'Bo‘g‘imda noqulaylik qayd etgan' : 'Kuchli og‘riq/charchoq qayd etgan'}
        </div>
      )}
      {open && (
        <div className="stack mt-8">
          {log.exercises.map((e, i) => (
            <div key={i} className="small" style={{ padding: '7px 0', borderTop: '1px solid var(--line)' }}>
              <div className="strong">{EXERCISE_MAP[e.exerciseId]?.name ?? e.exerciseId}</div>
              <div className="muted num">{e.sets.map((s) => `${s.kg}×${s.reps}`).join(' · ')}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Kpi({ label, value }: { label: string; value: string }) {
  return (
    <div className="card tight">
      <div className="tiny muted">{label}</div>
      <div className="display display-m num mt-4">{value}</div>
    </div>
  );
}

function ProgramEditor({ data, onSaved }: { data: ClientData; onSaved: (p: Program) => void }) {
  const [draft, setDraft] = useState<Program | null>(data.program);
  const [sel, setSel] = useState(0);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [confirmRegen, setConfirmRegen] = useState(false);
  const profile = data.profile;
  const dirty = draft !== data.program;
  const days = useMemo(() => [...(draft?.days ?? [])].sort((a, b) => a.weekday - b.weekday), [draft]);

  if (!profile || !draft) return <div className="card empty mt-16">Mijoz hali profilini to‘ldirmagan — dastur tuzish uchun uning jihozlari va maqsadi kerak.</div>;

  const day = days[Math.min(sel, days.length - 1)];
  // funksional yangilash: bir nechta mashq ketma-ket qo'shilganda (ids.forEach) har biri oldingisi ustiga yoziladi
  const mapDay = (fn: (d: WorkoutDay) => WorkoutDay) => {
    setMsg(null);
    const dayId = day.id;
    setDraft((cur) => (cur ? { ...cur, days: cur.days.map((d) => (d.id === dayId ? fn(d) : d)) } : cur));
  };
  const patchEx = (fn: (list: PlannedExercise[]) => PlannedExercise[]) => mapDay((d) => ({ ...d, exercises: fn(d.exercises) }));

  const send = async () => {
    setBusy(true);
    setMsg(null);
    try {
      await api(`/coach/clients/${data.client.id}/program`, { method: 'PUT', body: { program: draft } });
      onSaved(draft);
      setMsg({ ok: true, text: 'Dastur mijozga yuborildi. Ilovasi internetga ulanganda yangilanadi.' });
    } catch (e) {
      setMsg({ ok: false, text: e instanceof ApiError ? e.message : 'Yuborilmadi' });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="stack gap-12 mt-16">
      <div className="row between">
        <div style={{ minWidth: 0 }}>
          <div className="strong ellipsis">{draft.split}</div>
          {draft.coach && <div className="tiny muted">Oxirgi marta {fmtDate(draft.coach.at)} da yuborilgan</div>}
        </div>
        <button className="icon-btn filled" onClick={() => setConfirmRegen(true)} aria-label="Profil asosida qayta tuzish">
          <Icon name="refresh" size={20} />
        </button>
      </div>

      <div className="row gap-6" role="tablist" aria-label="Kunlar">
        {days.map((d, i) => (
          <button
            key={d.id}
            role="tab"
            aria-selected={i === sel}
            className={`chip ${i === sel ? 'on' : ''}`}
            style={{ flex: 1, justifyContent: 'center', padding: 0, height: 42 }}
            onClick={() => setSel(i)}
          >
            {DAYS_SHORT[d.weekday]}
          </button>
        ))}
      </div>

      {day && (
        <>
          <div>
            <h2 className="title">{day.title}</h2>
            <p className="small muted">{day.focus}</p>
          </div>
          <DayEditor
            day={day}
            profile={profile}
            onSwap={(i, exId) => patchEx((l) => l.map((e, j) => (j === i && EXERCISE_MAP[exId] ? swapPlanned(e, EXERCISE_MAP[exId]) : e)))}
            onUpdate={(i, patch) => patchEx((l) => l.map((e, j) => (j === i ? { ...e, ...patch } : e)))}
            onRemove={(i) => patchEx((l) => l.filter((_, j) => j !== i))}
            onAdd={(exId) => {
              const ex = EXERCISE_MAP[exId];
              const compound = ex?.mechanics === 'compound';
              patchEx((l) => [...l, { exerciseId: exId, sets: 3, repMin: compound ? 8 : 10, repMax: compound ? 12 : 15, rir: 2, restSec: compound ? 120 : 75 }]);
            }}
          />
        </>
      )}

      {msg && (
        <p className="small" role="status" style={{ color: msg.ok ? 'var(--green)' : 'var(--danger)' }}>
          {msg.text}
        </p>
      )}
      <div className="stack gap-8" style={{ position: 'sticky', bottom: 12, zIndex: 2 }}>
        <button className="btn btn-primary btn-block" disabled={!dirty || busy} onClick={send}>
          {busy ? 'Yuborilmoqda...' : dirty ? 'Mijozga yuborish' : 'O‘zgarish yo‘q'}
        </button>
      </div>

      <Sheet open={confirmRegen} onClose={() => setConfirmRegen(false)} label="Qayta tuzish">
        <h3 className="title">Profil asosida yangi dastur?</h3>
        <p className="muted mt-8">Mijozning maqsadi, jihozlari va cheklovlariga qarab dastur qaytadan tuziladi. Yuborishdan oldin uni tahrirlashingiz mumkin.</p>
        <div className="row gap-8 mt-16">
          <button className="btn btn-secondary grow" onClick={() => setConfirmRegen(false)}>
            Bekor qilish
          </button>
          <button
            className="btn btn-primary grow"
            onClick={() => {
              setDraft(generateProgram(profile));
              setSel(0);
              setConfirmRegen(false);
            }}
          >
            Tuzish
          </button>
        </div>
      </Sheet>
    </div>
  );
}

function Notes({ clientId, onRemoved }: { clientId: string; onRemoved: () => void }) {
  const [notes, setNotes] = useState<Note[] | null>(null);
  const [text, setText] = useState('');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [confirm, setConfirm] = useState(false);

  useEffect(() => {
    api<{ notes: Note[] }>(`/coach/clients/${clientId}/notes`)
      .then((r) => setNotes(r.notes))
      .catch(() => setNotes([]));
  }, [clientId]);

  const send = async () => {
    setBusy(true);
    setErr(null);
    try {
      const r = await api<{ note: Note }>(`/coach/clients/${clientId}/notes`, { body: { text: text.trim() } });
      setNotes([r.note, ...(notes ?? [])]);
      setText('');
    } catch (e) {
      setErr(e instanceof ApiError ? e.message : 'Yuborilmadi');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="stack gap-12 mt-16">
      <div className="card stack gap-12">
        <textarea
          className="input"
          rows={3}
          maxLength={1000}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Masalan: Bu hafta o‘tirib-turishda vaznni 2,5 kg oshiring"
          aria-label="Xabar matni"
          style={{ height: 'auto', paddingTop: 12, resize: 'vertical' }}
        />
        <button className="btn btn-primary btn-sm" style={{ alignSelf: 'flex-end' }} disabled={!text.trim() || busy} onClick={send}>
          Yuborish
        </button>
        {err && (
          <p className="small" role="alert" style={{ color: 'var(--danger)' }}>
            {err}
          </p>
        )}
      </div>
      <p className="tiny faint">Xabar mijozning “Bugun” sahifasida ko‘rinadi.</p>
      {notes?.map((n) => (
        <div key={n.id} className="card tight">
          <div className="tiny muted">{fmtDate(n.created_at)}</div>
          <p className="mt-4" style={{ whiteSpace: 'pre-wrap' }}>
            {n.text}
          </p>
        </div>
      ))}
      <button className="btn btn-ghost btn-block mt-16" style={{ color: 'var(--danger)' }} onClick={() => setConfirm(true)}>
        Mijozni ro‘yxatdan chiqarish
      </button>
      <Sheet open={confirm} onClose={() => setConfirm(false)} label="Mijozni chiqarish">
        <h3 className="title">Mijozni chiqarasizmi?</h3>
        <p className="muted mt-8">Siz endi uning natijalarini ko‘rmaysiz. Uning ma’lumotlari va dasturi o‘zida qoladi.</p>
        <div className="row gap-8 mt-16">
          <button className="btn btn-secondary grow" onClick={() => setConfirm(false)}>
            Bekor qilish
          </button>
          <button
            className="btn btn-danger grow"
            onClick={async () => {
              await api(`/coach/clients/${clientId}`, { method: 'DELETE' }).catch(() => null);
              onRemoved();
            }}
          >
            Chiqarish
          </button>
        </div>
      </Sheet>
    </div>
  );
}
