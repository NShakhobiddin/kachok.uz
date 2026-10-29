import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { AddToProgram } from '../components/AddToProgram';
import { BenefitMap } from '../components/BenefitMap';
import { BodyMap } from '../components/BodyMap';
import { LineChart } from '../components/charts';
import { MuscleActivation } from '../components/MuscleActivation';
import { PersonalSafetyNotice, RiskTag, SafetySection } from '../components/Safety';
import { safetyFor } from '../data/safety';
import { ExerciseThumb } from '../components/ExerciseThumb';
import { ExerciseIllustration, type IlluLayer } from '../components/ExerciseIllustration';
import { ExerciseMotion } from '../components/ExerciseMotion';
import { ILLUSTRATIONS } from '../data/illustrations';
import { Figure } from '../components/figure/Figure';
import { StandardsTable } from '../components/StrengthLevels';
import { TempoBar, useTempo } from '../components/TempoBar';
import { liftByExercise } from '../engine/standards';
import { Fold, Note } from '../components/ui/Fold';
import { Icon } from '../components/ui/Icon';
import { EQUIPMENT, MUSCLES } from '../data/catalog';
import { exById } from '../data/exercises';
import { alternatives } from '../engine/program';
import { exerciseSeries } from '../engine/stats';
import { fmtDate } from '../lib/date';
import { useBack } from '../lib/useBack';
import { NotFound } from '../components/NotFound';
import { useStore } from '../store/useStore';
import type { Exercise, Phase } from '../types';

const PHASE: Record<Phase, { label: string; hint: string; color: string }> = {
  up: { label: 'Kuch fazasi', hint: 'nafas chiqaring', color: 'var(--red)' },
  down: { label: 'Nazorat bilan', hint: 'nafas oling', color: 'var(--blue-2)' },
  hold: { label: 'Holat', hint: 'tanani qotiring', color: 'var(--text-3)' },
  squeeze: { label: 'Qisish', hint: '1 soniya ushlang', color: 'var(--yellow)' },
};

const GUIDE_HELD = ['barbell', 'ezbar', 'dumbbell', 'kettlebell'];

/** Yig'iq "Xavfsizlik" blokini ochib, unga o'tish */
function openSafety() {
  const el = document.getElementById('safety');
  el?.querySelector('details')?.setAttribute('open', '');
  el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/** Asosiy sahna: animatsiya, faza, tezlik, shtanga yo'li va tempo */
function ExerciseStage({ ex }: { ex: Exercise }) {
  const [playing, setPlaying] = useState(true);
  const [speed, setSpeed] = useState(1);
  const [phase, setPhase] = useState<Phase>('hold');
  const [guides, setGuides] = useState(false);
  const tempo = useTempo(ex.anim);
  const canGuide = ex.anim.view === 'side' && !!ex.anim.held && GUIDE_HELD.includes(ex.anim.held.kind);
  const ph = PHASE[phase];
  return (
    <div className="mt-16">
      <div className="stage" style={{ aspectRatio: '1 / 1' }}>
        <Figure
          spec={ex.anim}
          primary={ex.primary}
          secondary={ex.secondary}
          playing={playing}
          speed={speed}
          onPhase={setPhase}
          onTick={tempo.onTick}
          guides={guides}
          hero={1}
          title={`${ex.name} animatsiyasi`}
        />
        <div style={{ position: 'absolute', left: 12, top: 12 }} className="row gap-8">
          <span className="tag stage-tag">
            <i className="dot" style={{ background: ph.color }} />
            {ph.label} · {ph.hint}
          </span>
        </div>
        {canGuide && (
          <button className={`chip sm stage-chip ${guides ? 'on' : ''}`} style={{ position: 'absolute', right: 12, top: 12 }} onClick={() => setGuides((g) => !g)} aria-pressed={guides}>
            Shtanga yo‘li
          </button>
        )}
      </div>
      <div className="row gap-12" style={{ alignItems: 'flex-start' }}>
        <div className="grow" style={{ minWidth: 0 }}>
          <TempoBar spec={ex.anim} head={tempo.head} />
        </div>
        <div className="row gap-6" style={{ marginTop: 8 }}>
          <button className="chip sm" onClick={() => setSpeed((s) => (s === 1 ? 0.5 : 1))} aria-label="Tezlik">
            {speed === 1 ? '1×' : '0.5×'}
          </button>
          <button className="icon-btn filled" style={{ width: 36, height: 36 }} onClick={() => setPlaying((p) => !p)} aria-label={playing ? 'To‘xtatish' : 'Davom ettirish'}>
            <Icon name={playing ? 'pause' : 'play'} size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

/** Illyustratsiyasi bor mashq: rasm (mushaklar yoki texnika belgilari) va animatsiya orasida tanlash */
function IllustratedStage({ ex }: { ex: Exercise }) {
  const ill = ILLUSTRATIONS[ex.id]!;
  // ikki kadrli harakat bo'lsa — u birinchi; bo'lmasa — mushaklar va texnika rasmlari
  const tabs = (
    ill.pair
      ? [
          ['motion', 'Harakat'],
          ['muscles', 'Mushaklar'],
          ['form', 'Texnika'],
        ]
      : [
          ['muscles', 'Mushaklar'],
          ['form', 'Texnika'],
        ]
  ) as [IlluLayer | 'motion', string][];
  const [mode, setMode] = useState(tabs[0][0]);
  return (
    <div className="mt-16">
      <div className="segmented" role="radiogroup" aria-label="Ko‘rinish">
        {tabs.map(([v, t]) => (
          <button key={v} role="radio" aria-checked={mode === v} className={mode === v ? 'on' : ''} onClick={() => setMode(v)}>
            {t}
          </button>
        ))}
      </div>
      {mode === 'motion' ? (
        <div className="mt-12">
          <ExerciseMotion ex={ex} ill={ill} />
        </div>
      ) : (
        <div className="mt-12">
          <ExerciseIllustration ex={ex} ill={ill} layer={mode} />
          <Note className="mt-4">
            {mode === 'muscles' ? 'Foiz — EMG, maksimal ixtiyoriy qisqarishga nisbatan; ≈ — baho. Yorliqqa bosing — mushak haqida qo‘llanma.' : 'Rasm AI yordamida yaratilgan; texnikasi tekshirilgan.'}
          </Note>
        </div>
      )}
    </div>
  );
}

export default function ExerciseDetail() {
  const { id } = useParams();
  const back = useBack('/library');
  const ex = exById(id ?? '');
  const profile = useStore((s) => s.profile);
  const logs = useStore((s) => s.logs);
  const series = useMemo(() => (ex ? exerciseSeries(ex.id, logs) : []), [ex, logs]);
  const { hash } = useLocation();
  // /exercise/:id#safety — sahifa ochilib, tepaga qaytgandan keyin xavfsizlik bo'limiga o'tish
  useEffect(() => {
    if (hash !== '#safety') return;
    const t = setTimeout(openSafety, 350);
    return () => clearTimeout(t);
  }, [hash, ex?.id]);
  if (!ex) return <NotFound text="Mashq topilmadi" />;

  const injuries = profile?.injuries ?? [];
  const safety = safetyFor(ex.id);
  const eqNames = [
    ...ex.equipment.map((e) => EQUIPMENT.find((x) => x.id === e)?.name),
    ex.equipmentAny ? ex.equipmentAny.map((e) => EQUIPMENT.find((x) => x.id === e)?.name).join(' yoki ') : null,
  ].filter(Boolean);
  const alts = profile ? alternatives(ex.id, profile).slice(0, 6) : [];
  const lift = liftByExercise(ex.id);
  const best = series.length ? series.reduce((a, b) => (b.e1rm > a.e1rm ? b : a)) : null;

  return (
    <div className="page">
      <div className="back-bar">
        <button className="icon-btn" onClick={back} aria-label="Orqaga">
          <Icon name="left" />
        </button>
        <span className="eyebrow">{ex.en}</span>
      </div>
      <h1 className="display display-l">{ex.name}</h1>

      {ILLUSTRATIONS[ex.id] ? <IllustratedStage ex={ex} /> : <ExerciseStage ex={ex} />}

      <div className="row wrap gap-6 mt-12">
        {ex.primary.map((m) => (
          <span key={m} className="tag">
            <i className="dot" style={{ background: 'var(--muscle-primary)' }} /> {MUSCLES[m].name}
          </span>
        ))}
        {ex.secondary.map((m) => (
          <span key={m} className="tag">
            <i className="dot" style={{ background: 'var(--muscle-secondary)' }} /> {MUSCLES[m].name}
          </span>
        ))}
        {safety && (
          <button onClick={openSafety} aria-label="Xavfsizlik bo‘limiga o‘tish">
            <RiskTag risk={safety.risk} />
          </button>
        )}
      </div>

      <AddToProgram ex={ex} />

      <PersonalSafetyNotice ex={ex} injuries={injuries} />

      <section className="section">
        <div className="section-head">
          <h2>Mushaklar 3D</h2>
          <span className="small muted">qaysi mushak necha % ishlaydi</span>
        </div>
        <MuscleActivation ex={ex} />
      </section>

      <section className="section">
        <div className="card row gap-16" style={{ alignItems: 'center' }}>
          <BodyMap primary={ex.primary} secondary={ex.secondary} height={170} />
          <div className="stack gap-8 small">
            <div>
              <div className="eyebrow">Jihoz</div>
              <div className="strong mt-4">{eqNames.length ? eqNames.join(', ') : 'O‘z vazni'}</div>
            </div>
            <div>
              <div className="eyebrow">Daraja</div>
              <div className="strong mt-4">{['', 'Oson', 'O‘rta', 'Murakkab'][ex.level]}</div>
            </div>
            <div>
              <div className="eyebrow">Turi</div>
              <div className="strong mt-4">{ex.mechanics === 'compound' ? 'Ko‘p bo‘g‘imli' : 'Izolyatsiya'}</div>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-head">
          <h2>Batafsil</h2>
          <span className="small muted">bosing — ochiladi</span>
        </div>
        <div className="fold-list">
          <Fold icon={<Icon name="list" size={18} />} title="Qanday bajariladi" hint={`Tayyorgarlik · ${ex.steps.length} qadam · nafas · ${ex.cues.length} maslahat`}>
            <div className="stack gap-12">
              <div className="eyebrow">Tayyorgarlik</div>
              <ol className="steps">
                {ex.setup.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ol>
              <div className="divider" style={{ margin: '2px 0' }} />
              <div className="eyebrow">Bajarish</div>
              <ol className="steps">
                {ex.steps.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ol>
              <div className="notice info mt-4">
                <Icon name="drop" />
                <span>
                  <b>Nafas:</b> {ex.breathing}
                </span>
              </div>
              <div className="stack gap-8">
                {ex.cues.map((c, i) => (
                  <div key={i} className="row gap-10 small">
                    <Icon name="bolt" size={16} style={{ color: 'var(--yellow)', flex: 'none' }} />
                    <span>{c}</span>
                  </div>
                ))}
              </div>
            </div>
          </Fold>

          <SafetySection ex={ex} injuries={injuries} />

          <Fold icon={<Icon name="alert" size={18} style={{ color: 'var(--red)' }} />} title="Ko‘p uchraydigan xatolar" hint={`${ex.mistakes.length} ta · ${ex.mistakes[0]?.title ?? ''}`}>
            <div className="stack gap-12">
              {ex.mistakes.map((m, i) => (
                <MistakeCard key={i} m={m} />
              ))}
            </div>
          </Fold>

          <Fold icon={<Icon name="heart" size={18} />} title="Sog‘liq uchun foydasi" hint={`${ex.benefits.length} ta foyda`}>
            <BenefitMap items={ex.benefits} />
          </Fold>

          {lift && (
            <Fold icon={<Icon name="trophy" size={18} />} title="Kuch me’yorlari" hint="Sizning darajangiz qayerda">
              <StandardsTable lift={lift.id} exName={lift.name} />
            </Fold>
          )}
        </div>
      </section>

      {series.length > 0 && (
        <section className="section">
          <div className="section-head">
            <h2>Sizning natijangiz</h2>
            {best && <span className="small muted">Rekord: {Math.round(best.e1rm)} kg (1RM)</span>}
          </div>
          <div className="card">
            <LineChart label="Taxminiy 1 takrorli maksimum" series={series.map((s) => ({ t: new Date(s.date).getTime(), v: s.e1rm }))} unit="kg" fmtX={(t) => fmtDate(new Date(t))} />
            <p className="tiny faint mt-8">Taxminiy 1RM (Epley formulasi): eng yaxshi set asosida — {series.length} ta mashg‘ulot.</p>
          </div>
        </section>
      )}

      {alts.length > 0 && (
        <section className="section">
          <div className="section-head">
            <h2>Muqobil mashqlar</h2>
          </div>
          <div className="hscroll">
            {alts.map((a) => (
              <Link key={a.id} to={`/exercise/${a.id}`} className="card tight stack gap-8" style={{ width: 150, color: 'inherit' }}>
                <ExerciseThumb ex={a} size={124} />
                <span className="small strong" style={{ lineHeight: 1.25 }}>
                  {a.name}
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function MistakeCard({ m }: { m: Exercise['mistakes'][number] }) {
  return (
    <div className="card stack gap-12">
      <div className="row gap-10" style={{ alignItems: 'flex-start' }}>
        <span style={{ width: 28, height: 28, borderRadius: 9, background: 'var(--red-soft)', color: 'var(--danger)', display: 'grid', placeItems: 'center', flex: 'none' }}>
          <Icon name="alert" size={16} />
        </span>
        <div className="stack gap-4">
          <div className="strong">{m.title}</div>
          <div className="small muted">{m.why}</div>
          <div className="small" style={{ color: 'var(--green)' }}>
            → {m.fix}
          </div>
        </div>
      </div>
    </div>
  );
}
