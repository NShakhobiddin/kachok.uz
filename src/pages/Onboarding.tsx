import { AnimatePresence, motion } from 'framer-motion';
import { useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiEnabled } from '../api/client';
import { BodyHero } from '../components/BodyHero';
import { Icon } from '../components/ui/Icon';
import { Choice, Stepper } from '../components/ui/controls';
import { EquipmentGrid } from '../components/EquipmentGrid';
import { EQUIPMENT_PRESETS, GROUPS, GROUP_ORDER, INJURIES } from '../data/catalog';
import { ACTIVITY, nutritionPlan } from '../engine/nutrition';
import { planLoad } from '../engine/bodyLoad';
import { DEFAULT_DAYS } from '../engine/program';
import { DAYS_SHORT } from '../lib/date';
import { useStore } from '../store/useStore';
import type { ActivityLevel, EquipmentId, Goal, Injury, Level, MuscleGroup, Profile, Sex } from '../types';

export const GOALS: { id: Goal; title: string; desc: string; icon: string }[] = [
  { id: 'muscle', title: "Mushak massasi (kachok bo‘lish)", desc: "Mushakni o‘stirish, kuchli va katta ko‘rinish", icon: 'dumbbell' },
  { id: 'fatLoss', title: 'Ozish', desc: "Yog‘ni yo‘qotib, mushakni saqlash", icon: 'flame' },
  { id: 'recomp', title: 'Shakl berish', desc: "Bir vaqtda yog‘ni kamaytirib, mushakni oshirish", icon: 'target' },
  { id: 'strength', title: 'Kuch', desc: "Og‘irroq ko‘tarish — shtanga raqamlari", icon: 'bolt' },
  { id: 'health', title: "Sog‘liq va tonus", desc: "Faol, baquvvat, og‘riqsiz hayot", icon: 'heart' },
];

export const LEVELS: { id: Level; title: string; desc: string }[] = [
  { id: 'beginner', title: 'Yangi boshlovchi', desc: "Zalga endi kelyapman yoki 6 oydan kam muntazam shug‘ullanganman" },
  { id: 'intermediate', title: "O‘rta daraja", desc: "6 oydan 2 yilgacha muntazam, asosiy mashqlarni bilaman" },
  { id: 'advanced', title: 'Tajribali', desc: '2 yildan ortiq, progressiyani o‘zim boshqaraman' },
];

const PARQ = [
  "Shifokor sizda yurak kasalligi yoki yuqori qon bosimi borligini aytganmi?",
  "Dam olayotganda, kundalik ishda yoki jismoniy harakatda ko‘krak qafasida og‘riq sezasizmi?",
  "So‘nggi 12 oyda bosh aylanishi tufayli muvozanatni yo‘qotganmisiz yoki hushdan ketganmisiz?",
  "Sizda boshqa surunkali kasallik (diabet, astma va h.k.) aniqlanganmi?",
  "Surunkali kasallik uchun doimiy dori ichasizmi?",
  "Harakat bilan kuchayishi mumkin bo‘lgan suyak, bo‘g‘im yoki pay muammosi bormi (so‘nggi 12 oyda)?",
  "Shifokor faqat tibbiy nazorat ostida shug‘ullanishingizni aytganmi?",
];

/** kirish ekranidagi 3D tanada yonadigan mushaklar (yirik guruhlar) */
const WELCOME_LOAD = planLoad([
  { exerciseId: 'back-squat', sets: 3 },
  { exerciseId: 'bench-press', sets: 3 },
  { exerciseId: 'pull-up', sets: 3 },
]);

const STEPS = ['welcome', 'about', 'goal', 'body', 'level', 'schedule', 'equipment', 'limits', 'activity', 'health', 'done'] as const;
type Step = (typeof STEPS)[number];

export default function Onboarding() {
  const nav = useNavigate();
  const setProfile = useStore((s) => s.setProfile);
  const importData = useStore((s) => s.importData);
  const fileRef = useRef<HTMLInputElement>(null);
  const [step, setStep] = useState<Step>('welcome');
  const [importErr, setImportErr] = useState(false);
  const [dir, setDir] = useState(1);
  const [p, setP] = useState<Omit<Profile, 'createdAt'>>({
    name: '',
    sex: 'male',
    age: 25,
    heightCm: 175,
    weightKg: 75,
    goal: 'muscle',
    level: 'beginner',
    daysPerWeek: 3,
    sessionMin: 60,
    trainingDays: DEFAULT_DAYS[3],
    equipment: EQUIPMENT_PRESETS[0].items,
    injuries: [],
    focus: [],
    activity: 'light',
    healthFlags: [],
    dietPrefs: { noPork: true, lactoseFree: false, vegetarian: false },
  });
  const up = (patch: Partial<Profile>) => setP((x) => ({ ...x, ...patch }));
  const idx = STEPS.indexOf(step);
  const go = (d: 1 | -1) => {
    setDir(d);
    setStep(STEPS[Math.max(0, Math.min(STEPS.length - 1, idx + d))]);
  };
  const finish = () => {
    setProfile({ ...p, createdAt: new Date().toISOString() });
    setDir(1);
    setStep('done');
  };
  const canNext = step !== 'schedule' || p.trainingDays.length === p.daysPerWeek;

  const progress = idx <= 0 ? 0 : Math.min(1, idx / (STEPS.length - 2));
  const np = useMemo(() => (step === 'done' ? nutritionPlan({ ...p, createdAt: '' }) : null), [step, p]);
  const program = useStore((s) => s.program);

  if (step === 'welcome') {
    return (
      <div className="page no-tab" style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column' }}>
        <span className="eyebrow">kachok.uz</span>
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="card glow welcome-hero mt-12">
          <BodyHero load={WELCOME_LOAD} label="3D anatomik model: mashqda ishlaydigan mushaklar lime rangda yonadi" />
          <span className="eyebrow accent welcome-tag">Har bir mushak — 3D da</span>
        </motion.div>
        <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.6 }} className="poster mt-24" style={{ fontSize: 68 }}>
          Kachok
        </motion.h1>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="mt-12" style={{ fontSize: 17, lineHeight: 1.45, color: 'var(--text-2)' }}>
          Zalda yoningizdagi murabbiy: <span style={{ color: 'var(--text)' }}>sizga moslangan dastur</span>, har bir mashqda qaysi mushak qancha ishlashi va ilmiy asoslangan ovqatlanish.
        </motion.p>
        <div style={{ flex: 1, minHeight: 24 }} />
        <button className="btn btn-primary btn-xl btn-block" onClick={() => go(1)}>
          Dasturimni tuzish <Icon name="right" size={20} />
        </button>
        {apiEnabled ? (
          <div className="grid-2 mt-8">
            <button className="btn btn-ghost" onClick={() => nav('/account')}>
              Akkauntim bor
            </button>
            <button className="btn btn-ghost" onClick={() => fileRef.current?.click()}>
              Zaxiradan tiklash
            </button>
          </div>
        ) : (
          <button className="btn btn-ghost btn-block mt-8" onClick={() => fileRef.current?.click()}>
            Zaxira nusxadan tiklash
          </button>
        )}
        {importErr && (
          <p className="small mt-8" role="alert" style={{ textAlign: 'center', color: 'var(--danger)' }}>
            Fayl o‘qilmadi. Kachok’dan eksport qilingan .json faylni tanlang.
          </p>
        )}
        <input
          ref={fileRef}
          type="file"
          accept="application/json"
          hidden
          onChange={async (e) => {
            const f = e.target.files?.[0];
            if (!f) return;
            if (importData(await f.text())) nav('/');
            else setImportErr(true);
          }}
        />
      </div>
    );
  }

  return (
    <div className="page no-tab" style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column' }}>
      {step !== 'done' && (
        <div className="row gap-12" style={{ marginBottom: 20 }}>
          <button className="icon-btn" onClick={() => go(-1)} aria-label="Orqaga">
            <Icon name="left" />
          </button>
          <div className="progress grow" aria-label={`Qadam ${idx} / ${STEPS.length - 2}`}>
            <i style={{ width: `${progress * 100}%` }} />
          </div>
          <span className="eyebrow num">
            {idx}/{STEPS.length - 2}
          </span>
        </div>
      )}
      <AnimatePresence mode="wait" custom={dir}>
        <motion.div
          key={step}
          custom={dir}
          initial={{ opacity: 0, x: 24 * dir }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -24 * dir }}
          transition={{ duration: 0.22 }}
          className="stack gap-16"
          style={{ flex: 1 }}
        >
          {step === 'about' && (
            <>
              <StepHead title="Tanishaylik" text="Ism ixtiyoriy — faqat sizga murojaat qilish uchun." />
              <div className="field">
                <label htmlFor="nm">Ismingiz</label>
                <input id="nm" className="input" placeholder="Masalan, Aziz" value={p.name} onChange={(e) => up({ name: e.target.value })} autoComplete="given-name" />
              </div>
              <div className="field">
                <label>Jinsingiz (kaloriya hisobi uchun)</label>
                <div className="grid-2">
                  {(['male', 'female'] as Sex[]).map((s) => (
                    <Choice key={s} on={p.sex === s} onClick={() => up({ sex: s })} title={s === 'male' ? 'Erkak' : 'Ayol'} />
                  ))}
                </div>
              </div>
            </>
          )}

          {step === 'goal' && (
            <>
              <StepHead title="Asosiy maqsad" text="Dastur va ovqatlanish shu maqsadga moslanadi. Keyin o‘zgartirish mumkin." />
              <div className="stack gap-8">
                {GOALS.map((g) => (
                  <Choice key={g.id} on={p.goal === g.id} onClick={() => up({ goal: g.id })} title={g.title} desc={g.desc} icon={<GoalIcon name={g.icon} on={p.goal === g.id} />} />
                ))}
              </div>
            </>
          )}

          {step === 'body' && (
            <>
              <StepHead title="Tana ko‘rsatkichlari" text="Mifflin–St Jeor formulasi bo‘yicha energiya sarfini hisoblash uchun." />
              <div className="field">
                <label>Yosh</label>
                <Stepper value={p.age} onChange={(v) => up({ age: v })} min={14} max={90} unit="yosh" label="Yosh" />
              </div>
              <div className="field">
                <label>Bo‘y</label>
                <Stepper value={p.heightCm} onChange={(v) => up({ heightCm: v })} min={130} max={225} unit="sm" label="Bo‘y" />
              </div>
              <div className="field">
                <label>Vazn</label>
                <Stepper value={p.weightKg} onChange={(v) => up({ weightKg: v })} step={0.5} min={35} max={250} unit="kg" label="Vazn" />
              </div>
              {p.age < 18 && (
                <div className="notice info">
                  <Icon name="info" />
                  <span>18 yoshgacha kuch mashqlari xavfsiz va foydali, lekin texnikaga murabbiy nazorati tavsiya etiladi.</span>
                </div>
              )}
            </>
          )}

          {step === 'level' && (
            <>
              <StepHead title="Tajribangiz" text="Mashqlar murakkabligi, hajm va boshlang‘ich vaznlar shunga qarab tanlanadi." />
              <div className="stack gap-8">
                {LEVELS.map((l) => (
                  <Choice key={l.id} on={p.level === l.id} onClick={() => up({ level: l.id })} title={l.title} desc={l.desc} />
                ))}
              </div>
            </>
          )}

          {step === 'schedule' && (
            <>
              <StepHead title="Jadval" text="Haftasiga necha kun va qaysi kunlari zalga bora olasiz?" />
              <div className="field">
                <label>Haftasiga kunlar</label>
                <div className="row gap-8">
                  {[2, 3, 4, 5, 6].map((n) => (
                    <button
                      key={n}
                      className={`chip ${p.daysPerWeek === n ? 'on' : ''}`}
                      style={{ flex: 1, height: 48, justifyContent: 'center', fontSize: 18, fontWeight: 800 }}
                      onClick={() => up({ daysPerWeek: n, trainingDays: DEFAULT_DAYS[n] })}
                    >
                      {n}
                    </button>
                  ))}
                </div>
                <span className="tiny faint">
                  {p.daysPerWeek <= 3 ? "Yangi boshlovchilar uchun ideal — har mushak haftasiga 2–3 marta." : p.daysPerWeek === 4 ? 'Eng muvozanatli tanlov.' : "Ko‘proq hajm — yaxshi tiklanish kerak."}
                </span>
              </div>
              <div className="field">
                <label>
                  Kunlar ({p.trainingDays.length}/{p.daysPerWeek})
                </label>
                <div className="row gap-6">
                  {DAYS_SHORT.map((d, i) => {
                    const on = p.trainingDays.includes(i);
                    return (
                      <button
                        key={d}
                        className={`chip ${on ? 'on' : ''}`}
                        style={{ flex: 1, height: 44, justifyContent: 'center', padding: 0 }}
                        aria-pressed={on}
                        onClick={() => {
                          const next = on ? p.trainingDays.filter((x) => x !== i) : [...p.trainingDays, i].sort();
                          if (next.length <= p.daysPerWeek) up({ trainingDays: next });
                        }}
                      >
                        {d}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="field">
                <label>Bir mashg‘ulot davomiyligi</label>
                <div className="row gap-6 wrap">
                  {[30, 45, 60, 75, 90].map((m) => (
                    <button key={m} className={`chip ${p.sessionMin === m ? 'on' : ''}`} onClick={() => up({ sessionMin: m })}>
                      {m} daqiqa
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {step === 'equipment' && (
            <>
              <StepHead title="Zalingizda nima bor?" text="Faqat mavjud jihozlarga mos mashqlar tanlanadi." />
              <div className="stack gap-8">
                {EQUIPMENT_PRESETS.map((pr) => {
                  const on = pr.items.length === p.equipment.length && pr.items.every((x) => p.equipment.includes(x));
                  return <Choice key={pr.id} on={on} onClick={() => up({ equipment: pr.items })} title={pr.name} desc={pr.desc} />;
                })}
              </div>
              <div className="eyebrow mt-8">Yoki aniq belgilang</div>
              <EquipmentGrid value={p.equipment} onChange={(eq: EquipmentId[]) => up({ equipment: eq })} />
            </>
          )}

          {step === 'limits' && (
            <>
              <StepHead title="Cheklovlar va ustuvorlik" text="Og‘riyotgan joylar uchun xavfli mashqlar chiqariladi va muqobil bilan almashtiriladi." />
              <div className="field">
                <label>Og‘riq yoki jarohat bor joylar</label>
                <div className="row wrap gap-8">
                  {INJURIES.map((inj) => {
                    const on = p.injuries.includes(inj.id);
                    return (
                      <button key={inj.id} className={`chip ${on ? 'on' : ''}`} aria-pressed={on} onClick={() => up({ injuries: on ? p.injuries.filter((x) => x !== inj.id) : [...p.injuries, inj.id as Injury] })}>
                        {inj.name}
                      </button>
                    );
                  })}
                </div>
                {p.injuries.length > 0 && (
                  <div className="notice warn mt-8">
                    <Icon name="alert" />
                    <span>Kuchli yoki o‘tkir og‘riq bo‘lsa, avval shifokor yoki fizioterapevtga murojaat qiling. Dastur tashxis qo‘ymaydi.</span>
                  </div>
                )}
              </div>
              <div className="field mt-8">
                <label>Ko‘proq e’tibor beriladigan mushaklar (ixtiyoriy)</label>
                <div className="row wrap gap-8">
                  {GROUP_ORDER.map((g) => {
                    const on = p.focus.includes(g);
                    return (
                      <button
                        key={g}
                        className={`chip ${on ? 'on' : ''}`}
                        aria-pressed={on}
                        onClick={() => up({ focus: on ? p.focus.filter((x) => x !== g) : p.focus.length < 3 ? [...p.focus, g as MuscleGroup] : p.focus })}
                      >
                        {GROUPS[g].name}
                      </button>
                    );
                  })}
                </div>
                <span className="tiny faint">3 tagacha. Har biriga qo‘shimcha mashq qo‘shiladi.</span>
              </div>
            </>
          )}

          {step === 'activity' && (
            <>
              <StepHead title="Kundalik faollik" text="Zaldan tashqari harakat — kaloriya hisobining eng katta qismi." />
              <div className="stack gap-8">
                {(Object.keys(ACTIVITY) as ActivityLevel[]).map((a) => (
                  <Choice key={a} on={p.activity === a} onClick={() => up({ activity: a })} title={ACTIVITY[a].name} desc={ACTIVITY[a].desc} />
                ))}
              </div>
              <div className="row wrap gap-8 mt-8">
                <button className={`chip ${p.dietPrefs.vegetarian ? 'on' : ''}`} onClick={() => up({ dietPrefs: { ...p.dietPrefs, vegetarian: !p.dietPrefs.vegetarian } })}>
                  Go‘sht yemayman
                </button>
                <button className={`chip ${p.dietPrefs.lactoseFree ? 'on' : ''}`} onClick={() => up({ dietPrefs: { ...p.dietPrefs, lactoseFree: !p.dietPrefs.lactoseFree } })}>
                  Sut mahsulotlarisiz
                </button>
              </div>
            </>
          )}

          {step === 'health' && (
            <>
              <StepHead title="Sog‘liq tekshiruvi" text="Xalqaro PAR-Q+ so‘rovnomasi. Qaysi biriga «Ha» deb javob berasiz?" />
              <div className="stack gap-8">
                {PARQ.map((q, i) => {
                  const on = p.healthFlags.includes(String(i));
                  return <Choice key={i} multi on={on} onClick={() => up({ healthFlags: on ? p.healthFlags.filter((x) => x !== String(i)) : [...p.healthFlags, String(i)] })} title={q} />;
                })}
              </div>
              {p.healthFlags.length > 0 ? (
                <div className="notice warn">
                  <Icon name="alert" />
                  <span>
                    Mashqlarni boshlashdan oldin <b>shifokor bilan maslahatlashing</b>. Dastur ehtiyotkor rejimda tuziladi, lekin tibbiy ko‘rik o‘rnini bosmaydi.
                  </span>
                </div>
              ) : (
                <div className="notice good">
                  <Icon name="check" />
                  <span>Hech biri yo‘q bo‘lsa — mashqlarni xavfsiz boshlashingiz mumkin.</span>
                </div>
              )}
            </>
          )}

          {step === 'done' && program && np && (
            <div className="stack gap-16" style={{ flex: 1 }}>
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', damping: 18 }} className="stack gap-8" style={{ marginTop: 24 }}>
                <span className="eyebrow">Dastur tayyor</span>
                <h1 className="display display-xl">{p.name ? `${p.name},` : ''} boshladik</h1>
              </motion.div>
              <div className="card stack gap-12">
                <Row k="Tizim" v={program.split} />
                <Row k="Haftasiga" v={`${program.days.length} kun · ~${Math.round(program.days.reduce((a, d) => a + d.estMin, 0) / program.days.length)} daqiqa`} />
                <Row k="Kunlar" v={program.days.map((d) => DAYS_SHORT[d.weekday]).join(' · ')} />
                <Row k="Kunlik kaloriya" v={`${np.kcal} kkal`} />
                <Row k="Oqsil" v={`${np.protein} g / kun`} />
              </div>
              <p className="muted small">{program.splitWhy}</p>
              <div style={{ flex: 1 }} />
              <button className="btn btn-primary btn-block" onClick={() => nav('/', { replace: true })}>
                Bosh sahifaga <Icon name="right" size={20} />
              </button>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {step !== 'done' && (
        <div className="mt-24" style={{ position: 'sticky', bottom: 'calc(var(--safe-b) + 12px)' }}>
          <button className="btn btn-primary btn-block" disabled={!canNext} onClick={() => (step === 'health' ? finish() : go(1))}>
            {step === 'health' ? 'Dasturni tuzish' : 'Davom etish'}
          </button>
          {!canNext && <p className="tiny faint mt-8" style={{ textAlign: 'center' }}>{p.daysPerWeek} ta kunni tanlang</p>}
        </div>
      )}
    </div>
  );
}

function StepHead({ title, text }: { title: string; text: string }) {
  return (
    <div className="stack gap-8">
      <h1 className="display display-l">{title}</h1>
      <p className="muted">{text}</p>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="row between gap-12">
      <span className="muted small">{k}</span>
      <span className="strong" style={{ textAlign: 'right' }}>
        {v}
      </span>
    </div>
  );
}

function GoalIcon({ name, on }: { name: string; on: boolean }) {
  return (
    <span style={{ width: 42, height: 42, borderRadius: 12, display: 'grid', placeItems: 'center', background: on ? 'var(--accent)' : 'var(--surface-2)', color: on ? 'var(--accent-ink)' : 'var(--text-2)', flex: 'none', transition: 'all .15s' }}>
      <Icon name={name} />
    </span>
  );
}
