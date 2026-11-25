// Maqsadlar: kartochka (progress, bashorat, maslahat), yangi maqsad oynasi va Bugun sahifasidagi qisqa qator.
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { EXERCISE_MAP } from '../data/exercises';
import { fmtDay, goalDefaults, goalStatus, type GoalStatus } from '../engine/goals';
import { fmtKg } from '../engine/progression';
import { useArmed } from '../lib/hooks';
import { addDays, isoDate } from '../lib/date';
import { useStore } from '../store/useStore';
import type { UserGoal } from '../types';
import { Choice, Stepper } from './ui/controls';
import { Icon } from './ui/Icon';
import { Sheet } from './ui/Sheet';

const STATE_COLOR: Record<GoalStatus['state'], string> = {
  done: 'var(--accent)',
  ahead: 'var(--green)',
  on: 'var(--green)',
  behind: 'var(--yellow)',
  stalled: 'var(--yellow)',
  nodata: 'var(--text-3)',
};
const STATE_LABEL: Record<GoalStatus['state'], string> = {
  done: 'Bajarildi',
  ahead: 'Rejadan oldinda',
  on: 'Rejada',
  behind: 'Ortda',
  stalled: 'To‘xtagan',
  nodata: 'Ma’lumot kam',
};

/** Barcha maqsadlar holati; erishilganlari avtomatik belgilanadi (doneAt) */
export function useGoals() {
  const goals = useStore((s) => s.goals);
  const logs = useStore((s) => s.logs);
  const body = useStore((s) => s.body);
  const profile = useStore((s) => s.profile);
  const saveGoal = useStore((s) => s.saveGoal);
  const list = useMemo(
    () =>
      Object.values(goals)
        .map((goal) => ({ goal, status: goalStatus(goal, { logs, body, profile }) }))
        // faollari oldin, keyin yangi qo'yilgani
        .sort((a, b) => Number(!!a.goal.doneAt) - Number(!!b.goal.doneAt) || b.goal.createdAt.localeCompare(a.goal.createdAt)),
    [goals, logs, body, profile],
  );
  useEffect(() => {
    // oylik mashg'ulot maqsadi har oy yangilanadi — "bajarildi" deb yopilmaydi
    for (const { goal, status } of list) if (status.state === 'done' && !goal.doneAt && goal.kind !== 'workouts') saveGoal({ ...goal, doneAt: isoDate() });
  }, [list, saveGoal]);
  return list;
}

export function GoalCard({ goal, status, onEdit }: { goal: UserGoal; status: GoalStatus; onEdit?: () => void }) {
  const done = !!goal.doneAt || status.state === 'done';
  return (
    <div className="card stack gap-8" style={done ? { borderColor: 'var(--accent-line)' } : undefined}>
      <div className="row between gap-8" style={{ alignItems: 'flex-start' }}>
        <div className="stack" style={{ gap: 2, minWidth: 0 }}>
          <b className="small">{status.title}</b>
          <span className="tiny" style={{ color: STATE_COLOR[done ? 'done' : status.state] }}>
            {done ? (goal.doneAt ? `🎯 Bajarildi · ${fmtDay(goal.doneAt)}` : '🎯 Bajarildi') : STATE_LABEL[status.state]}
            {!done && goal.deadline ? ` · muddat ${fmtDay(goal.deadline)}` : ''}
          </span>
        </div>
        {onEdit && (
          <button className="icon-btn" style={{ width: 32, height: 32, flex: 'none' }} onClick={onEdit} aria-label={`${status.title}: o‘zgartirish`}>
            <Icon name="more" size={16} />
          </button>
        )}
      </div>
      <div className="progress" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(status.progress * 100)} aria-label={status.title}>
        <i style={{ width: `${Math.max(3, status.progress * 100)}%`, background: done ? 'var(--accent)' : STATE_COLOR[status.state] === 'var(--yellow)' ? 'var(--yellow)' : 'var(--accent)' }} />
      </div>
      <span className="small muted num">{status.text}</span>
      {status.tip && !done && <p className="tiny muted">{status.tip}</p>}
    </div>
  );
}

const KINDS: { kind: UserGoal['kind']; title: string; desc: string }[] = [
  { kind: 'lift', title: 'Kuch', desc: 'Mashqda maqsadli og‘irlik (taxminiy 1 marta ko‘tarish)' },
  { kind: 'weight', title: 'Tana vazni', desc: 'Ozish yoki vazn olish — xavfsiz sur’at nazorati bilan' },
  { kind: 'workouts', title: 'Muntazamlik', desc: 'Oyiga necha marta mashg‘ulot' },
];
const TERMS = [
  { label: 'Muddatsiz', days: 0 },
  { label: '1 oy', days: 30 },
  { label: '3 oy', days: 91 },
  { label: '6 oy', days: 182 },
];
const FALLBACK_LIFTS = ['back-squat', 'bench-press', 'deadlift', 'ohp', 'pull-up', 'hip-thrust'];

/** Yangi maqsad yoki mavjudini o'zgartirish/o'chirish */
export function GoalSheet({ open, onClose, edit }: { open: boolean; onClose: () => void; edit?: UserGoal | null }) {
  return (
    <Sheet open={open} onClose={onClose} label={edit ? 'Maqsadni o‘zgartirish' : 'Yangi maqsad'}>
      {open && <GoalForm key={edit?.id ?? 'new'} edit={edit ?? null} onDone={onClose} />}
    </Sheet>
  );
}

function GoalForm({ edit, onDone }: { edit: UserGoal | null; onDone: () => void }) {
  const logs = useStore((s) => s.logs);
  const body = useStore((s) => s.body);
  const profile = useStore((s) => s.profile);
  const program = useStore((s) => s.program);
  const saveGoal = useStore((s) => s.saveGoal);
  const removeGoal = useStore((s) => s.removeGoal);
  const del = useArmed();
  // dasturdagi asosiy (murakkab) mashqlar — kuch maqsadi uchun
  const lifts = useMemo(() => {
    const ids = [...new Set(program?.days.flatMap((d) => d.exercises.map((e) => e.exerciseId)) ?? [])].filter((id) => {
      const ex = EXERCISE_MAP[id];
      return ex && ex.mechanics === 'compound' && ex.loadType !== 'bodyweight' && !ex.assisted && !ex.timed;
    });
    return (ids.length ? ids : FALLBACK_LIFTS.filter((id) => EXERCISE_MAP[id])).slice(0, 8);
  }, [program]);
  const [kind, setKind] = useState<UserGoal['kind']>(edit?.kind ?? 'lift');
  const [exId, setExId] = useState(edit?.exerciseId ?? lifts[0]);
  const ctx = { logs, body, profile, goal: profile?.goal };
  const def = goalDefaults(kind, ctx, exId);
  const [target, setTarget] = useState<number>(edit?.target ?? def.target);
  // -1 — mavjud muddat o'zgarmaydi
  const [term, setTerm] = useState(edit?.deadline ? -1 : 0);
  // tur yoki mashq o'zgarsa — taklif qilinadigan qiymat
  const pick = (k: UserGoal['kind'], ex = exId) => {
    setKind(k);
    setExId(ex);
    setTarget(goalDefaults(k, ctx, ex).target);
  };
  const save = () => {
    const start = edit && edit.kind === kind && edit.exerciseId === (kind === 'lift' ? exId : undefined) ? edit.start : def.start;
    saveGoal({
      id: edit?.id ?? Math.random().toString(36).slice(2, 10),
      kind,
      ...(kind === 'lift' ? { exerciseId: exId } : {}),
      target,
      start,
      createdAt: edit?.createdAt ?? new Date().toISOString(),
      ...(term > 0 ? { deadline: isoDate(addDays(new Date(), TERMS[term].days)) } : term === -1 && edit?.deadline ? { deadline: edit.deadline } : {}),
    });
    onDone();
  };
  const cur = kind === 'lift' ? def.start : kind === 'weight' ? def.start : null;
  return (
    <div className="stack gap-12">
      <h3 className="title">{edit ? 'Maqsadni o‘zgartirish' : 'Yangi maqsad'}</h3>
      {!edit && (
        <div className="stack gap-8">
          {KINDS.map((k) => (
            <Choice key={k.kind} on={kind === k.kind} onClick={() => pick(k.kind)} title={k.title} desc={k.desc} />
          ))}
        </div>
      )}
      {kind === 'lift' && (
        <div className="field">
          <label>Mashq</label>
          <div className="row wrap gap-6">
            {lifts.map((id) => (
              <button key={id} className={`chip ${exId === id ? 'on' : ''}`} aria-pressed={exId === id} onClick={() => pick('lift', id)}>
                {EXERCISE_MAP[id]?.name}
              </button>
            ))}
          </div>
        </div>
      )}
      <div className="field">
        <label>{kind === 'lift' ? 'Maqsad: 1 marta ko‘tarish' : kind === 'weight' ? 'Maqsadli vazn' : 'Oyiga mashg‘ulot'}</label>
        <Stepper
          value={target}
          onChange={setTarget}
          step={kind === 'lift' ? 2.5 : kind === 'weight' ? 0.5 : 1}
          min={kind === 'workouts' ? 4 : kind === 'weight' ? 35 : 5}
          max={kind === 'workouts' ? 31 : kind === 'weight' ? 250 : 500}
          unit={kind === 'workouts' ? 'ta' : 'kg'}
          label="Maqsad"
        />
        {cur ? <span className="tiny faint">Hozir: {fmtKg(cur)} kg{kind === 'lift' ? ' (taxminiy, oxirgi 6 hafta)' : ''}</span> : kind === 'lift' ? <span className="tiny faint">Bu mashqni bajarganingizdan keyin hisoblanadi</span> : null}
      </div>
      {kind !== 'workouts' && (
        <div className="field">
          <label>Muddat</label>
          <div className="row wrap gap-6">
            {edit?.deadline && (
              <button className={`chip ${term === -1 ? 'on' : ''}`} aria-pressed={term === -1} onClick={() => setTerm(-1)}>
                {fmtDay(edit.deadline)}
              </button>
            )}
            {TERMS.map((t, i) => (
              <button key={t.label} className={`chip ${term === i ? 'on' : ''}`} aria-pressed={term === i} onClick={() => setTerm(i)}>
                {t.label}
              </button>
            ))}
          </div>
        </div>
      )}
      <button className="btn btn-primary btn-block" onClick={save} disabled={kind === 'lift' && !exId}>
        <Icon name="target" size={18} /> Saqlash
      </button>
      {edit && (
        <button
          className="btn btn-ghost btn-block"
          style={{ color: del.armed ? 'var(--danger)' : undefined }}
          onClick={() => {
            if (!del.armed) return del.arm();
            if (!del.ready()) return;
            removeGoal(edit.id);
            onDone();
          }}
        >
          {del.armed ? 'Rostdan o‘chirilsinmi? — bosing' : 'Maqsadni o‘chirish'}
        </button>
      )}
    </div>
  );
}

/** Natija sahifasidagi bo'lim: barcha maqsadlar va "qo'shish" */
export function GoalsSection() {
  const list = useGoals();
  const [sheet, setSheet] = useState<{ edit: UserGoal | null } | null>(null);
  // Bugun sahifasidan "?goal=new" bilan kelinsa — darhol yangi maqsad oynasi
  useEffect(() => {
    if (new URLSearchParams(location.search).get('goal') === 'new') setSheet({ edit: null });
  }, []);
  const active = list.filter((x) => !x.goal.doneAt);
  const done = list.filter((x) => x.goal.doneAt).slice(0, 3);
  return (
    <section className="section" id="goals">
      <div className="section-head">
        <h2>Maqsadlar</h2>
        <button className="small strong accent-text" onClick={() => setSheet({ edit: null })}>
          + Qo‘shish
        </button>
      </div>
      {list.length === 0 ? (
        <button className="card row gap-12" style={{ width: '100%', textAlign: 'left', color: 'inherit' }} onClick={() => setSheet({ edit: null })}>
          <Icon name="target" size={22} style={{ color: 'var(--accent)', flex: 'none' }} />
          <span className="stack" style={{ gap: 2 }}>
            <b className="small">Maqsad qo‘ying</b>
            <span className="tiny muted">Masalan, «o‘tirib-turish 100 kg» yoki «−5 kg, 3 oyda» — ilova sur’atni kuzatib, qachon yetishingizni aytadi.</span>
          </span>
        </button>
      ) : (
        <div className="stack gap-8">
          {[...active, ...done].map(({ goal, status }) => (
            <GoalCard key={goal.id} goal={goal} status={status} onEdit={() => setSheet({ edit: goal })} />
          ))}
        </div>
      )}
      <GoalSheet open={!!sheet} onClose={() => setSheet(null)} edit={sheet?.edit} />
    </section>
  );
}

/** Bugun erishilgan maqsadlar (mashg'ulot xulosasida tabrik) */
export function GoalsAchieved() {
  const today = isoDate();
  const hit = useGoals().filter((x) => x.goal.doneAt === today);
  if (!hit.length) return null;
  return (
    <div className="notice gold mt-16" role="status">
      <Icon name="target" style={{ color: 'var(--yellow)' }} />
      <span>
        <b>Maqsadga yetdingiz!</b> {hit.map((x) => x.status.title).join(' · ')}. Yangi maqsad qo‘yish — <Link to="/progress?goal=new">Natija</Link>.
      </span>
    </div>
  );
}

/** Bugun sahifasidagi qisqa qator: birinchi faol maqsad yoki "maqsad qo'ying" */
export function GoalStrip() {
  const list = useGoals();
  const top = list.find((x) => !x.goal.doneAt);
  if (!top)
    return list.length ? null : (
      <Link to="/progress?goal=new" className="report-nudge mt-12">
        <Icon name="target" size={18} style={{ color: 'var(--accent)', flex: 'none' }} />
        <span className="small grow">
          <b>Maqsad qo‘ying</b> <span className="muted">· sur’atni ilova kuzatadi</span>
        </span>
        <Icon name="right" size={16} style={{ color: 'var(--text-3)', flex: 'none' }} />
      </Link>
    );
  const { status } = top;
  return (
    <Link to="/progress#goals" className="report-nudge mt-12" style={{ flexWrap: 'wrap', rowGap: 6 }}>
      <Icon name="target" size={18} style={{ color: STATE_COLOR[status.state], flex: 'none' }} />
      <span className="small grow ellipsis" style={{ minWidth: 0 }}>
        <b>{status.title}</b>
        <span className="muted"> · {status.state === 'nodata' ? STATE_LABEL.nodata : status.eta ? `~${fmtDay(status.eta)}` : STATE_LABEL[status.state]}</span>
      </span>
      <span className="progress" style={{ flexBasis: '100%', height: 4 }} aria-hidden="true">
        <i style={{ width: `${Math.max(3, status.progress * 100)}%`, background: 'var(--accent)' }} />
      </span>
    </Link>
  );
}
