import { AnimatePresence, motion } from 'framer-motion';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { Barbell, PlateStack } from '../components/Barbell';
import { Figure } from '../components/figure/Figure';
import { PlateRing } from '../components/PlateRing';
import { Icon } from '../components/ui/Icon';
import { Sheet } from '../components/ui/Sheet';
import { GROUPS, MUSCLES } from '../data/catalog';
import { FB_TEXT, type MuscleFeedback } from '../engine/meso';
import { EXERCISES, EXERCISE_MAP } from '../data/exercises';
import { alternatives, hasEquipment } from '../engine/program';
import { mesoCtx, useMeso } from '../lib/useToday';
import { e1rm, exerciseHistory, fmtKg, platesPerSide, roundLoad, suggest, type Suggestion } from '../engine/progression';
import { e1rmFromSet, loadFor, RIR_LABEL, rirText } from '../engine/rpe';
import { fmtClock } from '../lib/date';
import { useNow } from '../lib/hooks';
import { useStore, type FinishFeedback } from '../store/useStore';
import type { Exercise, MuscleGroup } from '../types';
import { ExercisePicker } from '../components/DayEditor';
import { Choice, Toggle } from '../components/ui/controls';
import { HistorySheet } from '../components/HistorySheet';

function beep() {
  try {
    const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new Ctx();
    [0, 0.18, 0.36].forEach((t, i) => {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.frequency.value = i === 2 ? 1320 : 880;
      g.gain.setValueAtTime(0.0001, ctx.currentTime + t);
      g.gain.exponentialRampToValueAtTime(0.25, ctx.currentTime + t + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + t + 0.15);
      o.connect(g).connect(ctx.destination);
      o.start(ctx.currentTime + t);
      o.stop(ctx.currentTime + t + 0.16);
    });
    setTimeout(() => ctx.close(), 800);
  } catch {
    /* ovoz mavjud emas */
  }
}

const vibrate = (p: number | number[]) => {
  try {
    navigator.vibrate?.(p);
  } catch {
    /* qo‘llab-quvvatlanmaydi */
  }
};

export default function Workout() {
  const nav = useNavigate();
  const active = useStore((s) => s.active);
  const logs = useStore((s) => s.logs);
  const profile = useStore((s) => s.profile);
  const program = useStore((s) => s.program);
  const settings = useStore((s) => s.settings);
  const st = useStore();
  const now = useNow(250);
  const [finishOpen, setFinishOpen] = useState(false);
  const [swapOpen, setSwapOpen] = useState(false);
  /** dam olish paytida "qanchalik og'ir edi?" deb so'raladigan set */
  const [lastDone, setLastDone] = useState<{ ex: number; set: number } | null>(null);
  const [typeFor, setTypeFor] = useState<number | null>(null);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [noteEdit, setNoteEdit] = useState(false);
  const [prSets, setPrSets] = useState<string[]>([]);
  const exNotes = useStore((s) => s.exNotes);
  const setExNote = useStore((s) => s.setExNote);
  const [addOpen, setAddOpen] = useState(false);
  const [techOpen, setTechOpen] = useState(false);
  const [pr, setPr] = useState<string | null>(null);
  const restAlerted = useRef(false);
  const leaving = useRef(false);

  // Ekran o‘chmasligi uchun
  useEffect(() => {
    let lock: { release: () => Promise<void> } | null = null;
    const nav2 = navigator as unknown as { wakeLock?: { request: (t: 'screen') => Promise<{ release: () => Promise<void> }> } };
    nav2.wakeLock?.request('screen').then((l) => (lock = l)).catch(() => {});
    return () => {
      lock?.release().catch(() => {});
    };
  }, []);

  const meso = useMeso();
  const sugs: Suggestion[] = useMemo(() => {
    if (!active || !profile) return [];
    return active.plan.map((pe) => {
      const ex = EXERCISE_MAP[pe.exerciseId];
      // setlar soni mashg'ulot boshlanganda belgilangan (active.plan) — bu yerda faqat vazn va RIR
      return { ...suggest(ex, pe, logs, { bodyKg: profile.weightKg, sex: profile.sex, level: profile.level, ...mesoCtx(meso, program), readiness: active.readiness }), sets: pe.sets };
    });
  }, [active?.plan, logs, profile, meso, program, active?.readiness]); // eslint-disable-line react-hooks/exhaustive-deps

  const remaining = active?.restEndsAt ? (active.restEndsAt - now) / 1000 : null;
  // dam paneli balandligi: setlar uning ostida qolmasin (sahifa pastki bo'shlig'i va scroll-padding)
  const [restH, setRestH] = useState(0);
  const roRef = useRef<ResizeObserver | null>(null);
  const restRef = useCallback((el: HTMLDivElement | null) => {
    roRef.current?.disconnect();
    roRef.current = null;
    if (!el) return setRestH(0);
    const ro = new ResizeObserver(() => setRestH(el.offsetHeight));
    ro.observe(el);
    roRef.current = ro;
  }, []);
  useEffect(() => {
    document.documentElement.style.scrollPaddingBottom = restH ? `${restH + 24}px` : '';
    return () => {
      document.documentElement.style.scrollPaddingBottom = '';
    };
  }, [restH]);
  useEffect(() => {
    if (remaining === null) {
      restAlerted.current = false;
      return;
    }
    if (remaining <= 0 && !restAlerted.current) {
      restAlerted.current = true;
      if (settings.vibrate) vibrate([200, 100, 200]);
      if (settings.sound) beep();
      const t = setTimeout(() => st.stopRest(), 4000);
      return () => clearTimeout(t);
    }
  }, [remaining, settings.vibrate, settings.sound]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!active || !profile) return leaving.current ? null : <Navigate to="/" replace />;
  const idx = Math.min(active.index, active.log.exercises.length - 1);
  const exLog = active.log.exercises[idx];
  const ex = EXERCISE_MAP[exLog?.exerciseId];
  const pe = active.plan[idx];
  const sug = sugs[idx];
  const elapsed = (now - new Date(active.log.startedAt).getTime()) / 1000;
  const doneSets = active.log.exercises.reduce((a, e) => a + e.sets.filter((s) => s.done).length, 0);
  const totalSets = active.log.exercises.reduce((a, e) => a + e.sets.length, 0);
  const allDoneHere = exLog?.sets.length > 0 && exLog.sets.every((s) => s.done);
  const lastWithEx = ex ? [...logs].filter((l) => l.finishedAt && l.exercises.some((e) => e.exerciseId === ex.id)).sort((a, b) => b.startedAt.localeCompare(a.startedAt))[0] : undefined;
  const painLast = !!ex && !!lastWithEx?.painEx?.includes(ex.id);
  const doneExercises = active.log.exercises.filter((e) => e.sets.some((s) => s.done && !s.warmup));
  const finishGroups = [...new Set(doneExercises.flatMap((e) => EXERCISE_MAP[e.exerciseId]?.primary.map((m) => MUSCLES[m].group) ?? []))];
  const finishExercises = [...new Map(doneExercises.map((e) => [e.exerciseId, { id: e.exerciseId, name: EXERCISE_MAP[e.exerciseId]?.name ?? e.exerciseId }])).values()];
  const programDay = program?.days.find((d) => d.id === active.log.dayId);
  const canSaveDay = !!programDay && programDay.exercises.map((p) => p.exerciseId).join() !== active.plan.map((p) => p.exerciseId).join();
  const isLast = idx === active.log.exercises.length - 1;

  const completeSet = (j: number) => {
    const s = exLog.sets[j];
    if (s.done) {
      st.updateSet(idx, j, { done: false });
      return;
    }
    const kg = s.kg || sug?.kg || 0;
    const reps = s.reps || sug?.reps || pe?.repMin || 0;
    st.updateSet(idx, j, { kg, reps, done: true });
    setLastDone({ ex: idx, set: j });
    if (settings.vibrate) vibrate(25);
    // rekordni darhol aniqlash
    if (kg > 0 && ex.loadType !== 'bodyweight') {
      const hist = exerciseHistory(ex.id, logs);
      if (hist.length) {
        const best = Math.max(...hist.flatMap((h) => h.sets.map((x) => e1rm(x.kg, x.reps))));
        const bestKg = Math.max(...hist.flatMap((h) => h.sets.map((x) => x.kg)));
        const doneBefore = exLog.sets.filter((x, k) => x.done && k !== j);
        const sessionBest = Math.max(0, ...doneBefore.map((x) => e1rm(x.kg, x.reps)));
        const cur = e1rm(kg, reps);
        if ((cur > best * 1.005 || kg > bestKg) && cur > sessionBest) {
          setPrSets((p) => [...p, `${idx}-${j}`]);
          setPr(`${fmtKg(kg)} kg × ${reps} — ${kg > bestKg ? "eng og‘ir vazn" : 'eng kuchli set'}!`);
          if (settings.vibrate) vibrate([40, 60, 40, 60, 120]);
          setTimeout(() => setPr(null), 3200);
        }
      }
    }
    const lastSetOfWorkout = isLast && exLog.sets.every((x, k) => x.done || k === j);
    if (!lastSetOfWorkout) st.startRest(pe?.restSec ?? 90);
  };

  return (
    <div className="page no-tab" style={{ paddingTop: 'calc(var(--safe-t) + 8px)', paddingBottom: `calc(var(--safe-b) + ${Math.max(140, restH + 40)}px)` }}>
      {/* Sarlavha */}
      <div className="row between gap-8" style={{ position: 'sticky', top: 0, zIndex: 20, background: 'var(--bg)', padding: '6px 0 10px' }}>
        <button className="icon-btn" onClick={() => nav('/')} aria-label="Kichraytirish (mashg‘ulot saqlanadi)">
          <Icon name="down" />
        </button>
        <div className="stack" style={{ alignItems: 'center' }}>
          <span className="small strong ellipsis" style={{ maxWidth: 180 }}>
            {active.log.title}
          </span>
          <span className="mono tiny faint num">
            {fmtClock(elapsed)} · {doneSets}/{totalSets} set
          </span>
        </div>
        <button className="btn btn-success btn-sm" onClick={() => setFinishOpen(true)}>
          Tugatish
        </button>
      </div>

      <Barbell plates={active.log.exercises.map((e) => ({ progress: e.sets.length ? e.sets.filter((s) => s.done).length / e.sets.length : 0 }))} />

      {/* Mashqlar ro‘yxati */}
      <div className="hscroll mt-12" role="tablist" aria-label="Mashqlar">
        {active.log.exercises.map((e, i) => {
          const x = EXERCISE_MAP[e.exerciseId];
          const done = e.sets.length > 0 && e.sets.every((s) => s.done);
          return (
            <button
              key={i}
              role="tab"
              aria-selected={i === idx}
              className={`chip ${i === idx ? 'on' : ''}`}
              onClick={() => st.setActiveIndex(i)}
              style={{ height: 38, borderColor: done && i !== idx ? 'var(--green)' : undefined }}
            >
              <span className="pill-num" style={{ minWidth: 20, height: 20, fontSize: 11, background: done ? 'var(--green)' : undefined, color: done ? '#062414' : undefined }}>
                {done ? <Icon name="check" size={12} stroke={3} /> : i + 1}
              </span>
              <span className="ellipsis" style={{ maxWidth: 130 }}>
                {x?.name}
              </span>
            </button>
          );
        })}
        <button className="chip" style={{ height: 38 }} onClick={() => setAddOpen(true)} aria-label="Mashq qo‘shish">
          <Icon name="plus" size={16} />
        </button>
      </div>

      {ex && (
        <motion.div key={idx} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.22 }} className="mt-16 stack gap-12">
          <div className="row gap-12">
            <div className="stage" style={{ width: 112, height: 112, flex: 'none' }}>
              <Figure spec={ex.anim} primary={ex.primary} secondary={ex.secondary} title={ex.name} hero={1} />
            </div>
            <div className="grow stack gap-4" style={{ minWidth: 0 }}>
              <span className="eyebrow">
                {idx + 1}/{active.log.exercises.length} · {ex.primary.map((m) => MUSCLES[m].name).join(', ')}
              </span>
              <h2 style={{ fontSize: 21, fontWeight: 800, lineHeight: 1.15 }}>{ex.name}</h2>
              <div className="row wrap gap-6 mt-4">
                <button className="chip sm" onClick={() => setTechOpen(true)}>
                  <Icon name="info" size={14} /> Texnika
                </button>
                <button className="chip sm" onClick={() => setSwapOpen(true)}>
                  <Icon name="swap" size={14} /> Almashtirish
                </button>
                <button className="chip sm" onClick={() => setHistoryOpen(true)}>
                  <Icon name="chart" size={14} /> Tarix
                </button>
                <button className="chip sm" onClick={() => setNoteEdit((v) => !v)} aria-expanded={noteEdit}>
                  <Icon name="edit" size={14} /> Eslatma
                </button>
              </div>
            </div>
          </div>

          {painLast && (
            <div className="notice warn">
              <Icon name="alert" />
              <div className="grow">
                <span className="small">
                  <b>O‘tgan safar bu mashqda bo‘g‘im og‘ridi.</b> Vaznni kamaytiring va amplitudani og‘riqsiz qiling — og‘riq takrorlansa, almashtiring.
                </span>
                <button className="small strong mt-4" style={{ color: 'var(--blue-2)', display: 'block' }} onClick={() => setSwapOpen(true)}>
                  Muqobil mashqni tanlash
                </button>
              </div>
            </div>
          )}

          {(noteEdit || exNotes[ex.id]) && (
            <div className="ex-note">
              {noteEdit ? (
                <textarea
                  className="input"
                  rows={2}
                  maxLength={200}
                  autoFocus
                  defaultValue={exNotes[ex.id] ?? ''}
                  placeholder="Masalan: o‘rindiq 4-teshik, keng ushlash, belbog‘ bilan"
                  aria-label="Mashq eslatmasi"
                  onBlur={(e) => {
                    setExNote(ex.id, e.target.value);
                    setNoteEdit(false);
                  }}
                  style={{ height: 'auto', paddingTop: 10, resize: 'none' }}
                />
              ) : (
                <button className="row gap-8" style={{ width: '100%', textAlign: 'left' }} onClick={() => setNoteEdit(true)}>
                  <Icon name="edit" size={15} style={{ flex: 'none', color: 'var(--yellow)' }} />
                  <span className="small">{exNotes[ex.id]}</span>
                </button>
              )}
            </div>
          )}

          {sug && <TargetCard ex={ex} sug={sug} repMax={pe?.repMax ?? sug.reps} barKg={settings.barKg} />}

          {/* Setlar jadvali */}
          <div className="card flush">
            <div className="set-grid set-head">
              <span>SET</span>
              <span>OLDINGI</span>
              <span>{ex.loadType === 'bodyweight' && !sug?.kg ? '+KG' : 'KG'}</span>
              <span>{ex.timed ? 'SONIYA' : 'TAKROR'}</span>
              <span />
            </div>
            {exLog.sets.map((s, j) => {
              const prev = sug?.last?.sets[j] ?? sug?.last?.sets[sug.last.sets.length - 1];
              return (
                <div key={j} className={`set-grid set-row ${s.done ? 'done' : ''} ${s.warmup ? 'warm' : ''}`}>
                  <button className={`pill-num set-type ${s.warmup ? 'w' : s.kind === 'drop' ? 'd' : s.kind === 'failure' ? 'f' : ''}`} onClick={() => setTypeFor(j)} aria-label={`${j + 1}-set turi: ${s.warmup ? 'isinish' : s.kind === 'drop' ? 'drop-set' : s.kind === 'failure' ? 'chegaragacha' : 'ishchi set'}`}>
                    {s.warmup ? 'I' : s.kind === 'drop' ? 'D' : s.kind === 'failure' ? 'Ch' : j + 1 - exLog.sets.slice(0, j).filter((x) => x.warmup).length}
                  </button>
                  <button
                    className="small faint num stack prev-cell"
                    disabled={!prev || s.done}
                    onClick={() => prev && st.updateSet(idx, j, { kg: prev.kg ?? 0, reps: prev.reps })}
                    aria-label={prev ? `O‘tgan safargi ${fmtKg(prev.kg ?? 0)}×${prev.reps} ni ko‘chirish` : 'O‘tgan natija yo‘q'}
                  >
                    <span>{prev ? `${fmtKg(prev.kg ?? 0)}×${prev.reps}${prev.rir !== undefined ? ` @${prev.rir}` : ''}` : '—'}</span>
                    {prSets.includes(`${idx}-${j}`) && s.done ? (
                      <span className="rir-badge" style={{ color: 'var(--yellow)' }}>
                        <Icon name="trophy" size={11} /> rekord
                      </span>
                    ) : (
                      s.done && s.rir !== undefined && <span className="rir-badge">RIR {s.rir >= 4 ? '4+' : s.rir}</span>
                    )}
                  </button>
                  <input
                    className="set-input"
                    inputMode="decimal"
                    aria-label={`${j + 1}-set vazn`}
                    placeholder={sug?.kg ? fmtKg(sug.kg) : '0'}
                    value={s.kg ? String(s.kg) : ''}
                    onChange={(e) => {
                      const v = parseFloat(e.target.value.replace(',', '.'));
                      st.updateSet(idx, j, { kg: Number.isFinite(v) ? v : 0 });
                    }}
                  />
                  <input
                    className="set-input"
                    inputMode="numeric"
                    aria-label={`${j + 1}-set takror`}
                    placeholder={String(sug?.reps ?? pe?.repMin ?? '')}
                    value={s.reps ? String(s.reps) : ''}
                    onChange={(e) => {
                      const v = parseInt(e.target.value, 10);
                      st.updateSet(idx, j, { reps: Number.isFinite(v) ? v : 0 });
                    }}
                  />
                  <button className={`set-check ${s.done ? 'on' : ''}`} onClick={() => completeSet(j)} aria-label={s.done ? 'Bekor qilish' : 'Set bajarildi'} aria-pressed={s.done}>
                    <Icon name="check" size={18} stroke={3} />
                  </button>
                </div>
              );
            })}
            <div className="row" style={{ borderTop: '1px solid var(--line)' }}>
              <button className="btn btn-ghost btn-sm grow" onClick={() => st.addSet(idx)}>
                <Icon name="plus" size={16} /> Set
              </button>
              {exLog.sets.length > 1 && (
                <button className="btn btn-ghost btn-sm grow" onClick={() => st.removeSet(idx, exLog.sets.length - 1)}>
                  <Icon name="minus" size={16} /> Set
                </button>
              )}
            </div>
          </div>

          {allDoneHere && !isLast && (
            <button className="btn btn-primary btn-block" onClick={() => st.setActiveIndex(idx + 1)}>
              Keyingi: {EXERCISE_MAP[active.log.exercises[idx + 1].exerciseId]?.name} <Icon name="right" size={18} />
            </button>
          )}
          {allDoneHere && isLast && (
            <button className="btn btn-success btn-block" onClick={() => setFinishOpen(true)}>
              <Icon name="trophy" size={18} /> Mashg‘ulotni yakunlash
            </button>
          )}
        </motion.div>
      )}

      {/* Rekord banneri */}
      <AnimatePresence>
        {pr && (
          <motion.div
            initial={{ y: -80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -80, opacity: 0 }}
            transition={{ type: 'spring', damping: 18 }}
            style={{ position: 'fixed', top: 'calc(var(--safe-t) + 12px)', left: 16, right: 16, zIndex: 70, maxWidth: 528, margin: '0 auto' }}
            className="notice gold"
            role="status"
          >
            <Icon name="trophy" style={{ color: 'var(--yellow)' }} />
            <span>
              <b>Yangi rekord!</b> {pr}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dam olish taymeri */}
      <AnimatePresence>
        {remaining !== null && (
          <motion.div
            initial={{ y: 200 }}
            animate={{ y: 0 }}
            exit={{ y: 220 }}
            transition={{ type: 'spring', damping: 26, stiffness: 300 }}
            className="rest-panel"
            ref={restRef}
          >
            {lastDone && <EffortAsk key={`${lastDone.ex}-${lastDone.set}`} at={lastDone} sugs={sugs} />}
            <PlateRing remaining={remaining} total={active.restTotal} size={112} />
            <div className="stack gap-8 grow">
              <span className="small muted">{remaining > 0 ? 'Keyingi setgacha dam oling' : 'Vaqt bo‘ldi — keyingi set!'}</span>
              <div className="row gap-6">
                <button className="btn btn-secondary btn-xs grow" onClick={() => st.adjustRest(-15)}>
                  −15 s
                </button>
                <button className="btn btn-secondary btn-xs grow" onClick={() => st.adjustRest(15)}>
                  +15 s
                </button>
              </div>
              <button className="btn btn-primary btn-sm" onClick={() => st.stopRest()}>
                {remaining > 0 ? "O‘tkazib yuborish" : 'Davom etish'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Sheet open={typeFor !== null} onClose={() => setTypeFor(null)} label="Set turi">
        {typeFor !== null && exLog?.sets[typeFor] && (
          <div className="stack gap-8">
            <h3 className="title">Set turi</h3>
            {(
              [
                ['work', 'Ishchi set', 'Asosiy set — hajm va rekordlarga hisoblanadi'],
                ['warmup', 'Isinish', 'Yengil tayyorlov seti — hajm va rekordga kirmaydi'],
                ['drop', 'Drop-set', 'Vazn darhol kamaytirib davom ettirilgan set'],
                ['failure', 'Chegaragacha', 'Boshqa takror qila olmaguncha bajarilgan set'],
              ] as const
            ).map(([k, t, d]) => {
              const cur = exLog.sets[typeFor];
              const on = k === 'warmup' ? !!cur.warmup : k === 'work' ? !cur.warmup && !cur.kind : !cur.warmup && cur.kind === k;
              return (
                <Choice
                  key={k}
                  on={on}
                  title={t}
                  desc={d}
                  onClick={() => {
                    st.updateSet(idx, typeFor, { warmup: k === 'warmup', kind: k === 'drop' || k === 'failure' ? k : undefined, ...(k === 'failure' ? { rir: 0 } : {}) });
                    setTypeFor(null);
                  }}
                />
              );
            })}
            {exLog.sets.length > 1 && (
              <button
                className="btn btn-ghost btn-block"
                style={{ color: 'var(--danger)' }}
                onClick={() => {
                  st.removeSet(idx, typeFor);
                  setTypeFor(null);
                }}
              >
                <Icon name="trash" size={16} /> Setni o‘chirish
              </button>
            )}
          </div>
        )}
      </Sheet>

      <Sheet open={historyOpen} onClose={() => setHistoryOpen(false)} label="Mashq tarixi">
        {historyOpen && ex && <HistorySheet ex={ex} />}
      </Sheet>

      <Sheet open={techOpen} onClose={() => setTechOpen(false)} label="Texnika">
        {ex && <TechniqueSheet ex={ex} />}
      </Sheet>

      <Sheet open={swapOpen} onClose={() => setSwapOpen(false)} label="Almashtirish">
        {ex && swapOpen && (
          <ExercisePicker
            title="Band yoki og‘riq bo‘lsa — almashtiring"
            equipment={profile.equipment}
            list={alternatives(ex.id, profile).filter((e) => hasEquipment(e, profile.equipment))}
            onPick={(id) => {
              st.swapActive(idx, id);
              setSwapOpen(false);
            }}
          />
        )}
      </Sheet>

      <Sheet open={addOpen} onClose={() => setAddOpen(false)} label="Mashq qo‘shish">
        {addOpen && (
          <ExercisePicker
            title="Mashq qo‘shish"
            search
            equipment={profile.equipment}
            list={EXERCISES.filter((e) => hasEquipment(e, profile.equipment))}
            onPick={(id) => {
              st.addActiveExercise(id);
              setAddOpen(false);
            }}
          />
        )}
      </Sheet>

      <Sheet open={finishOpen} onClose={() => setFinishOpen(false)} label="Yakunlash">
        {finishOpen && (
          <FinishSheet
            doneSets={doneSets}
            totalSets={totalSets}
            groups={finishGroups}
            exercises={finishExercises}
            canSaveDay={canSaveDay}
            onDiscard={() => {
              leaving.current = true;
              st.discardWorkout();
              nav('/');
            }}
            onFinish={(fb, saveDay) => {
              leaving.current = true;
              if (saveDay && active.log.dayId) st.applyWorkoutToDay(active.log.dayId, active.plan);
              const log = st.finishWorkout(fb);
              setFinishOpen(false);
              nav(log ? `/summary/${log.id}` : '/', { replace: true });
            }}
          />
        )}
      </Sheet>
    </div>
  );
}

function TargetCard({ ex, sug, repMax, barKg }: { ex: Exercise; sug: Suggestion; repMax: number; barKg: number }) {
  const [plates, setPlates] = useState(false);
  const icon = sug.kind === 'up' ? 'up' : sug.kind === 'down' || sug.kind === 'deload' || sug.kind === 'easy' ? 'down' : sug.kind === 'first' ? 'spark' : 'target';
  const color = sug.kind === 'up' ? 'var(--green)' : sug.kind === 'down' || sug.kind === 'easy' || sug.kind === 'deload' ? 'var(--yellow)' : 'var(--blue-2)';
  const pp = sug.kg && ex.loadType === 'barbell' ? platesPerSide(sug.kg, ex.id.includes('curl') || ex.id.includes('skull') ? 10 : barKg) : null;
  return (
    <div className="card stack gap-8" style={{ background: 'var(--bg-2)' }}>
      <div className="row between">
        <span className="eyebrow">Bugungi maqsad</span>
        <span className="tag num">
          RIR {sug.rir} · {sug.sets} set
        </span>
      </div>
      <div className="row gap-8" style={{ alignItems: 'baseline' }}>
        {sug.kg ? (
          <span className="score">
            {fmtKg(sug.kg)}
            <small>kg</small>
          </span>
        ) : (
          <span className="score">{ex.loadType === 'bodyweight' ? "O‘z vazni" : '—'}</span>
        )}
        <span className="title muted num">
          × {sug.reps}
          {repMax > sug.reps ? `–${repMax}` : ''} {ex.timed ? 's' : ''}
        </span>
        {sug.estimated && <span className="tag">taxminiy</span>}
      </div>
      <div className="row gap-8 small" style={{ alignItems: 'flex-start' }}>
        <Icon name={icon} size={16} style={{ color, flex: 'none', marginTop: 2 }} />
        <span className="muted">{sug.reason}</span>
      </div>
      {sug.warmups.length > 0 && (
        <div className="small" style={{ color: 'var(--text-2)' }}>
          <b style={{ color: 'var(--text)' }}>Isinish:</b> {sug.warmups.map((w) => `${fmtKg(w.kg ?? 0)}×${w.reps}`).join(' → ')}
        </div>
      )}
      {pp && (
        <>
          <button className="small strong row gap-6" style={{ color: 'var(--blue-2)' }} onClick={() => setPlates((v) => !v)}>
            <Icon name="plate" size={16} /> {plates ? 'Disklarni yashirish' : 'Qaysi disklar taqiladi?'}
          </button>
          {plates && (
            <div className="stack gap-4">
              <PlateStack plates={pp.plates} />
              <span className="tiny muted">
                Har tomonga: {pp.plates.length ? pp.plates.map(fmtKg).join(' + ') : "disk yo‘q"} kg · grif {ex.id.includes('curl') || ex.id.includes('skull') ? 10 : barKg} kg
              </span>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function TechniqueSheet({ ex }: { ex: Exercise }) {
  return (
    <div className="stack gap-12">
      <h3 className="title">{ex.name}</h3>
      <div className="stage" style={{ aspectRatio: '1 / 0.8' }}>
        <Figure spec={ex.anim} primary={ex.primary} secondary={ex.secondary} hero={1 / 0.8} />
      </div>
      <ol className="steps">
        {ex.steps.map((s, i) => (
          <li key={i}>{s}</li>
        ))}
      </ol>
      <div className="stack gap-6">
        {ex.mistakes.slice(0, 2).map((m) => (
          <div key={m.title} className="notice warn small">
            <Icon name="alert" size={18} />
            <span>
              <b>{m.title}.</b> {m.fix}
            </span>
          </div>
        ))}
      </div>
      <Link to={`/exercise/${ex.id}`} className="btn btn-secondary btn-block">
        To‘liq sahifa
      </Link>
    </div>
  );
}

function FinishSheet({
  doneSets,
  totalSets,
  groups,
  exercises,
  canSaveDay,
  onFinish,
  onDiscard,
}: {
  doneSets: number;
  totalSets: number;
  groups: MuscleGroup[];
  exercises: { id: string; name: string }[];
  canSaveDay: boolean;
  onFinish: (fb: FinishFeedback, saveDay: boolean) => void;
  onDiscard: () => void;
}) {
  const [fb, setFb] = useState<Partial<Record<MuscleGroup, Partial<MuscleFeedback>>>>({});
  const [pain, setPain] = useState<string[]>([]);
  const [saveDay, setSaveDay] = useState(true);
  const set = (g: MuscleGroup, k: keyof MuscleFeedback, v: number) => setFb((x) => ({ ...x, [g]: { ...x[g], [k]: v } }));
  if (doneSets === 0)
    return (
      <div className="stack gap-12">
        <h3 className="title">Hech qanday set belgilanmagan</h3>
        <p className="muted">Mashg‘ulotni saqlash uchun kamida bitta setni ✓ bilan belgilang. Yoki mashg‘ulotni bekor qiling.</p>
        <button className="btn btn-danger btn-block" onClick={onDiscard}>
          Mashg‘ulotni bekor qilish
        </button>
      </div>
    );
  const complete = Object.fromEntries(Object.entries(fb).filter(([, f]) => f?.pump && f.work && f.recovery)) as FinishFeedback['muscles'];
  const rows: { k: keyof MuscleFeedback; q: string; o: readonly string[] }[] = [
    { k: 'pump', q: 'To‘lish (pump)', o: FB_TEXT.pump },
    { k: 'work', q: 'Yuklama', o: FB_TEXT.work },
    { k: 'recovery', q: 'O‘tgan safardan keyin', o: FB_TEXT.recovery },
  ];
  return (
    <div className="stack gap-12">
      <h3 className="title">Mashg‘ulotni yakunlash</h3>
      {doneSets < totalSets && <p className="small muted">{totalSets - doneSets} ta set bajarilmagan — ular saqlanmaydi.</p>}
      <p className="small muted">Har bir mushak uchun 3 ta qisqa javob — keyingi haftada shu mushakka setlar soni alohida moslashadi (RP metodikasi). Javob bermasangiz ham bo‘ladi.</p>
      {groups.map((g) => (
        <div key={g} className="card tight stack gap-8">
          <span className="strong">{GROUPS[g].name}</span>
          {rows.map((r) => (
            <div key={r.k} className="stack gap-4">
              <span className="tiny muted">{r.q}</span>
              <div className="row gap-4">
                {r.o.map((o, i) => (
                  <button
                    key={o}
                    className={`chip sm fb-chip ${fb[g]?.[r.k] === i + 1 ? 'on' : ''}`}
                    onClick={() => set(g, r.k, i + 1)}
                    aria-pressed={fb[g]?.[r.k] === i + 1}
                  >
                    {o}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      ))}
      <div className="stack gap-6">
        <span className="small strong">Bo‘g‘imda og‘riq bergan mashq bo‘ldimi?</span>
        <div className="row wrap gap-6">
          {exercises.map((e) => {
            const on = pain.includes(e.id);
            return (
              <button key={e.id} className={`chip sm ${on ? 'on' : ''}`} style={on ? { borderColor: 'var(--red)', background: 'var(--red-soft)' } : undefined} onClick={() => setPain((p) => (on ? p.filter((x) => x !== e.id) : [...p, e.id]))} aria-pressed={on}>
                {e.name}
              </button>
            );
          })}
        </div>
        {pain.length > 0 && <p className="tiny" style={{ color: 'var(--yellow)' }}>Keyingi safar bu mashqlarda ogohlantirish va muqobil taklif chiqadi.</p>}
      </div>
      {canSaveDay && (
        <label className="row between gap-12">
          <span className="small">
            <b>O‘zgarishlarni dasturga saqlash</b>
            <span className="muted" style={{ display: 'block' }}>
              Bugun almashtirilgan va qo‘shilgan mashqlar keyingi safar ham bo‘ladi
            </span>
          </span>
          <Toggle on={saveDay} onChange={setSaveDay} label="Dasturga saqlash" />
        </label>
      )}
      <button className="btn btn-success btn-block mt-8" onClick={() => onFinish({ muscles: complete, pain }, canSaveDay && saveDay)}>
        <Icon name="check" size={18} stroke={3} /> Saqlash
      </button>
      <button className="btn btn-ghost btn-block" onClick={onDiscard}>
        Saqlamasdan chiqish
      </button>
    </div>
  );
}

/** Dam olish paytida: oxirgi set qanchalik og'ir bo'ldi (RIR) va keyingi setlar uchun vazn maslahati */
function EffortAsk({ at, sugs }: { at: { ex: number; set: number }; sugs: Suggestion[] }) {
  const active = useStore((s) => s.active)!;
  const updateSet = useStore((s) => s.updateSet);
  const exLog = active.log.exercises[at.ex];
  const set = exLog?.sets[at.set];
  const ex = exLog ? EXERCISE_MAP[exLog.exerciseId] : undefined;
  const sug = sugs[at.ex];
  if (!set || !set.done || !ex || !sug || ex.loadType === 'bodyweight' || ex.loadType === 'band') return null;
  const target = sug.rir;
  if (set.rir === undefined)
    return (
      <div className="effort">
        <span className="small">
          <b>Oxirgi set qanchalik og‘ir edi?</b> <span className="muted">Yana nechta takror qila olardingiz</span>
        </span>
        <div className="row gap-6" role="group" aria-label="Zaxiradagi takrorlar (RIR)">
          {[0, 1, 2, 3, 4].map((r) => (
            <button key={r} className={`chip effort-chip ${r === target ? 'target' : ''}`} onClick={() => updateSet(at.ex, at.set, { rir: r })} aria-label={RIR_LABEL[r]}>
              {r === 4 ? '4+' : r}
            </button>
          ))}
        </div>
      </div>
    );
  // keyingi bajarilmagan setlar uchun vazn
  const rest = exLog.sets.map((x, k) => ({ x, k })).filter(({ x, k }) => k > at.set && !x.done);
  let advice: { kg: number; from: number } | null = null;
  if (rest.length && set.kg > 0 && set.reps > 0) {
    const reps = rest[0].x.reps || sug.reps;
    const from = rest[0].x.kg || sug.kg || set.kg;
    const e1 = e1rmFromSet(set.kg, set.reps, set.rir);
    const kg = roundLoad(ex, Math.min(from * 1.1, Math.max(from * 0.9, loadFor(e1, reps, target))));
    if (Math.abs(kg - from) >= Math.max(ex.increment || 1, from * 0.02)) advice = { kg, from };
  }
  const off = set.rir - target;
  return (
    <div className="effort">
      <span className="small">
        <b>{rirText(set.rir)}</b>{' '}
        <span className="muted">{off === 0 ? '— aynan reja bo‘yicha.' : off > 0 ? `— rejadan yengil (maqsad ${target}).` : `— rejadan og‘ir (maqsad ${target}).`}</span>
      </span>
      {advice && (
        <div className="row between gap-8">
          <span className="small">
            Keyingi setlar: <b className="num">{fmtKg(advice.kg)} kg</b>{' '}
            <span className="muted num">
              ({advice.kg > advice.from ? '+' : ''}
              {fmtKg(advice.kg - advice.from)})
            </span>
          </span>
          <button className="btn btn-secondary btn-xs" onClick={() => rest.forEach(({ k }) => updateSet(at.ex, k, { kg: advice!.kg }))}>
            Qo‘llash
          </button>
        </div>
      )}
    </div>
  );
}
