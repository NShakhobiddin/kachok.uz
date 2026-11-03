import { useMemo } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { ExerciseThumb } from '../components/ExerciseThumb';
import { NotFound } from '../components/NotFound';
import { Icon } from '../components/ui/Icon';
import { Segmented } from '../components/ui/controls';
import { EQUIPMENT } from '../data/catalog';
import { ROUTINES, ROUTINE_MAP, holdSec, routineExercises, routineMinutes, type Routine, type RoutineItem } from '../data/routines';
import { isoDate } from '../lib/date';
import { useBack } from '../lib/useBack';
import { useStore } from '../store/useStore';
import type { Exercise, PlannedExercise } from '../types';

const LEVEL = ['', 'Oson', 'O‘rta'];
const eqName = (id: string) => EQUIPMENT.find((e) => e.id === id)?.name ?? id;

/** Uyda va cho'zilish: tayyor mashg'ulotlar ro'yxati */
export default function Routines() {
  const [params, setParams] = useSearchParams();
  const tab = params.get('tab') === 'stretch' ? 'stretch' : 'home';
  const back = useBack('/library');
  const stretchLog = useStore((s) => s.stretchLog);
  const weekMin = useMemo(() => {
    const from = new Date();
    from.setDate(from.getDate() - 6);
    const f = isoDate(from);
    return Math.round(Object.entries(stretchLog).reduce((a, [d, m]) => (d >= f ? a + m : a), 0));
  }, [stretchLog]);
  const list = ROUTINES.filter((r) => r.kind === tab);
  return (
    <div className="page">
      <div className="back-bar">
        <button className="icon-btn" onClick={back} aria-label="Orqaga">
          <Icon name="left" />
        </button>
        <span className="eyebrow">Tayyor mashg‘ulotlar</span>
      </div>
      <h1 className="display">{tab === 'stretch' ? 'Cho‘zilish' : 'Uyda mashq'}</h1>
      <div className="mt-12" />
      <Segmented
        label="Bo‘lim"
        value={tab}
        onChange={(v) => setParams(v === 'home' ? {} : { tab: v }, { replace: true })}
        options={[
          { value: 'home', label: 'Uyda' },
          { value: 'stretch', label: 'Cho‘zilish' },
        ]}
      />
      <p className="small muted mt-12">
        {tab === 'stretch'
          ? 'Taymer bilan, gilamcha ustida. Har pozada sekin nafas oling: og‘riq emas, yoqimli tortilish (10 balldan 4–6).'
          : 'Kam jihoz bilan: dumba, son, qorin va qaddi-qomat uchun. Setlar odatdagi mashg‘ulot kabi yoziladi va natijalaringizda ko‘rinadi.'}
      </p>
      {tab === 'stretch' && weekMin > 0 && (
        <div className="notice info mt-12">
          <Icon name="check" />
          <span>Shu hafta cho‘zilish: {weekMin} daqiqa</span>
        </div>
      )}
      <div className="stack gap-12 mt-16">
        {list.map((r) => (
          <RoutineCard key={r.id} r={r} />
        ))}
      </div>
    </div>
  );
}

function RoutineCard({ r }: { r: Routine }) {
  const equipment = useStore((s) => s.profile?.equipment);
  const items = routineExercises(r);
  const missing = equipment ? r.needs.filter((n) => !equipment.includes(n)) : [];
  return (
    <Link to={`/routine/${r.id}`} className="card stack gap-10" style={{ color: 'inherit' }}>
      <div className="row between gap-8" style={{ alignItems: 'flex-start' }}>
        <b style={{ lineHeight: 1.25 }}>{r.title}</b>
        <span className="tag num" style={{ flex: 'none' }}>
          <Icon name="clock" size={12} /> {routineMinutes(r)} daq
        </span>
      </div>
      <p className="small muted clamp-2">{r.about}</p>
      <div className="row gap-6" style={{ overflow: 'hidden' }}>
        {items.slice(0, 6).map(({ ex }) => (
          <ExerciseThumb key={ex.id} ex={ex} size={44} />
        ))}
      </div>
      <div className="row wrap gap-6">
        <span className="tag">{items.length} ta {r.kind === 'stretch' ? 'poza' : 'mashq'}</span>
        <span className="tag">{LEVEL[r.level]}</span>
        {r.needs.length === 0 && <span className="tag">Jihozsiz</span>}
        {r.needs.map((n) => (
          <span key={n} className="tag" style={missing.includes(n) ? { color: 'var(--yellow)', background: 'var(--yellow-soft)', borderColor: 'transparent' } : undefined}>
            {eqName(n)}
          </span>
        ))}
      </div>
    </Link>
  );
}

/** Mashqning shu mashg'ulotdagi me'yori: "3 × 10–12", "2 × 30–45 s", "30 s · har tomonga" */
function dose(r: Routine, item: RoutineItem, ex: Exercise) {
  if (r.kind === 'stretch') return `${holdSec(item, ex)} s${ex.perSide ? ' · har tomonga' : ''}`;
  const [a, b] = item.reps ?? [10, 12];
  return `${item.sets ?? 3} × ${a === b ? a : `${a}–${b}`}${ex.timed ? ' s' : ''}${ex.unilateral ? ' · har tomonga' : ''}`;
}

/** Bitta tayyor mashg'ulot: mashqlar ro'yxati va boshlash */
export function RoutineView() {
  const { id = '' } = useParams();
  const r = ROUTINE_MAP[id];
  const nav = useNavigate();
  const back = useBack(`/routines${r?.kind === 'stretch' ? '?tab=stretch' : ''}`);
  const active = useStore((s) => s.active);
  const equipment = useStore((s) => s.profile?.equipment);
  const startWorkout = useStore((s) => s.startWorkout);
  const readiness = useStore((s) => s.readiness[isoDate()]);
  if (!r) return <NotFound text="Mashg‘ulot topilmadi" />;
  const items = routineExercises(r);
  const missing = equipment ? r.needs.filter((n) => !equipment.includes(n)) : [];
  const busy = r.kind === 'home' && !!active;

  const start = () => {
    if (r.kind === 'stretch') return nav(`/stretch/${r.id}`);
    const plan: PlannedExercise[] = items.map(({ item, ex }) => ({
      exerciseId: ex.id,
      sets: item.sets ?? 3,
      repMin: item.reps?.[0] ?? 10,
      repMax: item.reps?.[1] ?? 12,
      rir: 2,
      restSec: r.rest ?? 45,
    }));
    startWorkout(null, plan, readiness, undefined, r.title);
    nav('/workout');
  };

  return (
    <div className="page">
      <div className="back-bar">
        <button className="icon-btn" onClick={back} aria-label="Orqaga">
          <Icon name="left" />
        </button>
        <span className="eyebrow">{r.kind === 'stretch' ? 'Cho‘zilish' : 'Uyda mashq'}</span>
      </div>
      <h1 className="display display-l">{r.title}</h1>
      <p className="muted mt-8">{r.about}</p>
      <div className="row wrap gap-6 mt-12">
        <span className="tag num">
          <Icon name="clock" size={12} /> ~{routineMinutes(r)} daqiqa
        </span>
        <span className="tag">{LEVEL[r.level]}</span>
        {r.needs.length === 0 ? <span className="tag">Jihozsiz</span> : r.needs.map((n) => <span key={n} className="tag">{eqName(n)}</span>)}
      </div>

      {missing.length > 0 && (
        <div className="notice warn mt-12">
          <Icon name="info" />
          <span>
            Jihozlaringiz ro‘yxatida {missing.map(eqName).join(', ')} yo‘q. U bilan bajarilgani ma’qul; bo‘lmasa mashqlarni o‘z vazningiz bilan qiling.
          </span>
        </div>
      )}

      <section className="section">
        <div className="section-head">
          <h2>{r.kind === 'stretch' ? 'Pozalar' : 'Mashqlar'}</h2>
          {r.kind === 'home' && <span className="small muted">setlar orasida {r.rest ?? 45} s dam</span>}
        </div>
        <div className="stack gap-8">
          {items.map(({ item, ex }, i) => (
            <Link key={`${ex.id}-${i}`} to={`/exercise/${ex.id}`} className="card tight row gap-12" style={{ color: 'inherit' }}>
              <ExerciseThumb ex={ex} size={60} />
              <div className="grow" style={{ minWidth: 0 }}>
                <div className="strong" style={{ lineHeight: 1.25 }}>
                  {i + 1}. {ex.name}
                </div>
                <div className="small muted num mt-4">{dose(r, item, ex)}</div>
              </div>
              <Icon name="right" size={18} style={{ color: 'var(--text-3)' }} />
            </Link>
          ))}
        </div>
      </section>

      {r.kind === 'stretch' ? (
        <p className="tiny faint mt-12">Og‘riq, uvishish yoki karaxtlik sezsangiz — pozadan chiqing. Jarohat yoki homiladorlikda shifokor bilan maslahatlashing.</p>
      ) : (
        <p className="tiny faint mt-12">Har setni texnika buzilmaguncha bajaring: oxirgi 1–2 takror og‘ir, lekin toza bo‘lsin. Osonlashsa — takrorni yoki og‘irlikni oshiring.</p>
      )}

      <div className="sticky-cta">
        {busy ? (
          <Link to="/workout" className="btn btn-primary btn-xl btn-block">
            Tugallanmagan mashg‘ulotni davom ettirish
          </Link>
        ) : (
          <button className="btn btn-primary btn-xl btn-block" onClick={start}>
            <Icon name="play" size={18} /> Boshlash
          </button>
        )}
      </div>
    </div>
  );
}
