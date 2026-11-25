import { useMemo, useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { ExerciseThumb } from '../components/ExerciseThumb';
import { NotFound } from '../components/NotFound';
import { Icon } from '../components/ui/Icon';
import { Segmented } from '../components/ui/controls';
import { Sheet } from '../components/ui/Sheet';
import { PROGRAM_TEMPLATES, isCurrentTemplate, recommendTemplates, templatePatch, type ProgramTemplate } from '../data/programTemplates';
import { EQUIPMENT } from '../data/catalog';
import { ROUTINES, ROUTINE_MAP, holdSec, routineExercises, routineMinutes, type Routine, type RoutineItem } from '../data/routines';
import { isoDate } from '../lib/date';
import { useBack } from '../lib/useBack';
import { useStore } from '../store/useStore';
import type { Exercise, PlannedExercise } from '../types';

const LEVEL = ['', 'Oson', 'O‘rta'];
const eqName = (id: string) => EQUIPMENT.find((e) => e.id === id)?.name ?? id;

type Tab = 'home' | 'health' | 'stretch' | 'programs';
const TAB_INFO: Record<Tab, { title: string; text: string }> = {
  home: { title: 'Uyda mashq', text: 'Kam jihoz bilan: dumba, son, qorin va qaddi-qomat uchun. Setlar odatdagi mashg‘ulot kabi yoziladi va natijalaringizda ko‘rinadi.' },
  health: {
    title: 'Sog‘liq uchun',
    text: 'Shifokor va fizioterapevtlar tavsiyasiga asoslangan to‘plamlar. Har birida manba, kimga mumkin emasligi va qachon to‘xtash kerakligi yozilgan. Ular davolash o‘rnini bosmaydi — shifokoringiz bilan kelishing.',
  },
  stretch: { title: 'Cho‘zilish', text: 'Taymer bilan, gilamcha ustida. Har pozada sekin nafas oling: og‘riq emas, yoqimli tortilish (10 balldan 4–6).' },
  programs: { title: 'Tayyor dasturlar', text: 'Mashhur murabbiy va tadqiqotchilar uslubidagi haftalik rejalar. Tanlasangiz, mashqlar jihozingiz, darajangiz va cheklovlaringizga qarab tuziladi.' },
};

/** Tayyor mashg'ulotlar: uyda, sog'liq uchun, cho'zilish va haftalik dasturlar */
export default function Routines() {
  const [params, setParams] = useSearchParams();
  const raw = params.get('tab');
  const tab: Tab = raw === 'stretch' || raw === 'health' || raw === 'programs' ? raw : 'home';
  const back = useBack('/');
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
      <h1 className="display">{TAB_INFO[tab].title}</h1>
      <div className="mt-12" />
      <Segmented
        label="Bo‘lim"
        value={tab}
        onChange={(v) => setParams(v === 'home' ? {} : { tab: v }, { replace: true })}
        options={[
          { value: 'home', label: 'Uyda' },
          { value: 'health', label: 'Sog‘liq' },
          { value: 'stretch', label: 'Cho‘zilish' },
          { value: 'programs', label: 'Dasturlar' },
        ]}
      />
      <p className="small muted mt-12">{TAB_INFO[tab].text}</p>
      {tab === 'stretch' && weekMin > 0 && (
        <div className="notice info mt-12">
          <Icon name="check" />
          <span>Shu hafta cho‘zilish: {weekMin} daqiqa</span>
        </div>
      )}
      {tab === 'programs' ? (
        <ProgramList />
      ) : (
        <div className="stack gap-12 mt-16">
          {list.map((r) => (
            <RoutineCard key={r.id} r={r} />
          ))}
        </div>
      )}
    </div>
  );
}

/** Haftalik dasturlar: profilga mosi birinchi; tanlansa — dastur qayta tuziladi */
function ProgramList() {
  const profile = useStore((s) => s.profile);
  const program = useStore((s) => s.program);
  const updateProfile = useStore((s) => s.updateProfile);
  const regenerate = useStore((s) => s.regenerate);
  const nav = useNavigate();
  const [pick, setPick] = useState<ProgramTemplate | null>(null);
  const list = profile ? recommendTemplates(profile) : PROGRAM_TEMPLATES;
  return (
    <>
      <div className="stack gap-12 mt-16">
        {list.map((t, i) => {
          const cur = !!profile && isCurrentTemplate(t, profile, program);
          return (
            <button key={t.id} className="card stack gap-8" style={{ textAlign: 'left', width: '100%', ...(i === 0 && profile ? { borderColor: 'var(--accent-line)' } : {}) }} onClick={() => setPick(t)}>
              <div className="row between gap-8" style={{ alignItems: 'flex-start' }}>
                <b style={{ lineHeight: 1.25 }}>{t.name}</b>
                {i === 0 && profile && !cur && (
                  <span className="tag" style={{ flex: 'none', color: 'var(--accent)', borderColor: 'var(--accent-line)' }}>
                    Sizga mos
                  </span>
                )}
                {cur && (
                  <span className="tag" style={{ flex: 'none' }}>
                    <Icon name="check" size={12} stroke={3} /> Joriy
                  </span>
                )}
              </div>
              <span className="tiny faint">{t.author}</span>
              <p className="small muted clamp-2">{t.who}</p>
              <div className="row wrap gap-6">
                <span className="tag num">{t.days} kun / hafta</span>
                <span className="tag">{t.level}</span>
              </div>
            </button>
          );
        })}
      </div>
      <Sheet open={!!pick} onClose={() => setPick(null)} label="Dastur">
        {pick && (
          <div className="stack gap-12">
            <h3 className="title">{pick.name}</h3>
            <span className="tiny faint">{pick.author}</span>
            <p className="small">
              <b>Kimga:</b> {pick.who}
            </p>
            <p className="small">
              <b>Qanday ishlaydi:</b> {pick.how}
            </p>
            {profile ? (
              isCurrentTemplate(pick, profile, program) ? (
                <p className="notice good small">
                  <Icon name="check" size={18} /> <span>Hozir shu dastur bo‘yicha shug‘ullanyapsiz.</span>
                </p>
              ) : (
                <>
                  <p className="tiny muted">
                    Haftasiga {pick.days} kun bo‘ladi. Dastur qayta tuziladi: qo‘lda qilgan o‘zgarishlaringiz o‘chadi, mashg‘ulot tarixi saqlanadi.
                  </p>
                  <button
                    className="btn btn-primary btn-block"
                    onClick={() => {
                      updateProfile(templatePatch(pick, profile));
                      regenerate();
                      setPick(null);
                      nav('/');
                    }}
                  >
                    Shu dasturni boshlash
                  </button>
                </>
              )
            ) : (
              <Link to="/onboarding" className="btn btn-primary btn-block">
                Avval profil yarating
              </Link>
            )}
          </div>
        )}
      </Sheet>
    </>
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
      {r.health && <span className="small strong" style={{ color: 'var(--accent)' }}>{r.health.condition}</span>}
      <p className="small muted clamp-2">{r.about}</p>
      {r.health && <span className="tiny faint clamp-2">Asos: {r.health.source}</span>}
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
  const back = useBack(`/routines${r && r.kind !== 'home' ? `?tab=${r.kind}` : ''}`);
  const seenNotes = useStore((s) => s.seenNotes);
  const markNote = useStore((s) => s.markNote);
  const [ack, setAck] = useState(false);
  const active = useStore((s) => s.active);
  const equipment = useStore((s) => s.profile?.equipment);
  const startWorkout = useStore((s) => s.startWorkout);
  const readiness = useStore((s) => s.readiness[isoDate()]);
  if (!r) return <NotFound text="Mashg‘ulot topilmadi" />;
  const items = routineExercises(r);
  const missing = equipment ? r.needs.filter((n) => !equipment.includes(n)) : [];
  const busy = r.kind !== 'stretch' && !!active;
  const h = r.health;
  // sog'liq to'plamida: birinchi marta ogohlantirishlar o'qilganini tasdiqlash
  const acked = !h || ack || seenNotes.includes(`health-ack:${r.id}`);

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
        <span className="eyebrow">{TAB_INFO[r.kind].title}</span>
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

      {h && <HealthBlock h={h} />}

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
          {r.kind !== 'stretch' && <span className="small muted">setlar orasida {r.rest ?? 45} s dam</span>}
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

      {h?.extras && (
        <section className="section">
          <div className="section-head">
            <h2>Qo‘shimcha</h2>
          </div>
          <div className="stack gap-8">
            {h.extras.map((x) => (
              <div key={x.title} className="card tight stack gap-4">
                <b className="small">{x.title}</b>
                <span className="small muted">{x.text}</span>
              </div>
            ))}
          </div>
        </section>
      )}
      {h?.stretch && ROUTINE_MAP[h.stretch] && (
        <Link to={`/routine/${h.stretch}`} className="card row gap-12 mt-12" style={{ color: 'inherit' }}>
          <Icon name="spine" size={20} style={{ color: 'var(--accent)', flex: 'none' }} />
          <div className="grow">
            <div className="small strong">Keyin: {ROUTINE_MAP[h.stretch].title}</div>
            <div className="tiny muted">Cho‘zilish · ~{routineMinutes(ROUTINE_MAP[h.stretch])} daqiqa</div>
          </div>
          <Icon name="right" size={18} style={{ color: 'var(--text-3)' }} />
        </Link>
      )}

      {h ? (
        <p className="tiny faint mt-12">Bu to‘plam ma’lumot uchun va davolash o‘rnini bosmaydi. Og‘riq kuchaysa yoki yangi belgi paydo bo‘lsa — to‘xtating va shifokorga murojaat qiling.</p>
      ) : r.kind === 'stretch' ? (
        <p className="tiny faint mt-12">Og‘riq, uvishish yoki karaxtlik sezsangiz — pozadan chiqing. Jarohat yoki homiladorlikda shifokor bilan maslahatlashing.</p>
      ) : (
        <p className="tiny faint mt-12">Har setni texnika buzilmaguncha bajaring: oxirgi 1–2 takror og‘ir, lekin toza bo‘lsin. Osonlashsa — takrorni yoki og‘irlikni oshiring.</p>
      )}

      <div className="sticky-cta">
        {busy ? (
          <Link to="/workout" className="btn btn-primary btn-xl btn-block">
            Tugallanmagan mashg‘ulotni davom ettirish
          </Link>
        ) : !acked ? (
          <label className="card row gap-12" style={{ alignItems: 'flex-start', cursor: 'pointer' }}>
            <input
              type="checkbox"
              style={{ width: 22, height: 22, marginTop: 2, flex: 'none' }}
              onChange={(e) => {
                if (!e.target.checked) return;
                setAck(true);
                markNote(`health-ack:${r.id}`);
              }}
            />
            <span className="small">«Avval shifokor bilan» bandidagi holatlar menda yo‘q yoki shifokor ruxsat bergan; «Darhol to‘xtating» belgilarini o‘qidim.</span>
          </label>
        ) : (
          <button className="btn btn-primary btn-xl btn-block" onClick={start}>
            <Icon name="play" size={18} /> Boshlash
          </button>
        )}
      </div>
    </div>
  );
}

/** Sog'liq to'plami: holat, asos, kimga, ehtiyot, to'xtash belgilari va qancha */
function HealthBlock({ h }: { h: NonNullable<Routine['health']> }) {
  return (
    <div className="stack gap-8 mt-16">
      <div className="card tight stack gap-6">
        <span className="eyebrow accent">{h.condition}</span>
        <span className="small">
          <b>Asos:</b> {h.source}
        </span>
        <span className="small">
          <b>Qancha:</b> {h.freq}
        </span>
      </div>
      <div className="card tight stack gap-6">
        <b className="small">Kimga mos</b>
        {h.who.map((x) => (
          <span key={x} className="small muted row gap-8" style={{ alignItems: 'flex-start' }}>
            <Icon name="check" size={15} stroke={3} style={{ color: 'var(--accent)', flex: 'none', marginTop: 2 }} /> {x}
          </span>
        ))}
      </div>
      <div className="notice warn small" style={{ alignItems: 'flex-start' }}>
        <Icon name="alert" size={18} />
        <div className="stack gap-4">
          <b>Avval shifokor bilan</b>
          {h.caution.map((x) => (
            <span key={x}>• {x}</span>
          ))}
        </div>
      </div>
      <div className="notice small" style={{ alignItems: 'flex-start', background: 'var(--red-soft)', borderColor: 'rgba(255, 90, 90, 0.3)' }}>
        <Icon name="x" size={18} style={{ color: 'var(--red)' }} />
        <div className="stack gap-4">
          <b>Darhol to‘xtating</b>
          {h.stop.map((x) => (
            <span key={x}>• {x}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
