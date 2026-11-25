import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Navigate, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { apiEnabled } from '../api/client';
import { BodyHero } from '../components/BodyHero';
import { Logo } from '../components/Logo';
import { Icon } from '../components/ui/Icon';
import { Choice, Stepper } from '../components/ui/controls';
import { EQUIPMENT_PRESETS, INJURIES } from '../data/catalog';
import { nutritionPlan } from '../engine/nutrition';
import { planLoad } from '../engine/bodyLoad';
import { DEFAULT_DAYS } from '../engine/program';
import { DAYS_SHORT } from '../lib/date';
import { telegramFirstName } from '../lib/telegram';
import { useStore } from '../store/useStore';
import type { Goal, Injury, Level, Profile, Sex } from '../types';

export const GOALS: { id: Goal; title: string; desc: string; icon: string }[] = [
  { id: 'muscle', title: 'Mushak massasi (kachok bo‘lish)', desc: 'Mushakni o‘stirish, kuchli va katta ko‘rinish', icon: 'dumbbell' },
  { id: 'fatLoss', title: 'Ozish', desc: 'Yog‘ni yo‘qotib, mushakni saqlash', icon: 'flame' },
  { id: 'recomp', title: 'Shakl berish', desc: 'Bir vaqtda yog‘ni kamaytirib, mushakni oshirish', icon: 'target' },
  { id: 'strength', title: 'Kuch', desc: 'Og‘irroq ko‘tarish — shtanga raqamlari', icon: 'bolt' },
  { id: 'health', title: 'Sog‘liq va tonus', desc: 'Faol, baquvvat, og‘riqsiz hayot', icon: 'heart' },
];

export const LEVELS: { id: Level; title: string; desc: string }[] = [
  { id: 'beginner', title: 'Yangi boshlovchi', desc: 'Zalga endi kelyapman yoki 6 oydan kam muntazam shug‘ullanganman' },
  { id: 'intermediate', title: 'O‘rta daraja', desc: '6 oydan 2 yilgacha muntazam, asosiy mashqlarni bilaman' },
  { id: 'advanced', title: 'Tajribali', desc: '2 yildan ortiq, progressiyani o‘zim boshqaraman' },
];

const PARQ = [
  'Shifokor sizda yurak kasalligi yoki yuqori qon bosimi borligini aytganmi?',
  'Dam olayotganda, kundalik ishda yoki jismoniy harakatda ko‘krak qafasida og‘riq sezasizmi?',
  'So‘nggi 12 oyda bosh aylanishi tufayli muvozanatni yo‘qotganmisiz yoki hushdan ketganmisiz?',
  'Sizda boshqa surunkali kasallik (diabet, astma va h.k.) aniqlanganmi?',
  'Surunkali kasallik uchun doimiy dori ichasizmi?',
  'Harakat bilan kuchayishi mumkin bo‘lgan suyak, bo‘g‘im yoki pay muammosi bormi (so‘nggi 12 oyda)?',
  'Shifokor faqat tibbiy nazorat ostida shug‘ullanishingizni aytganmi?',
];

/** kirish ekranidagi 3D tanada yonadigan mushaklar (yirik guruhlar) */
const WELCOME_LOAD = planLoad([
  { exerciseId: 'back-squat', sets: 3 },
  { exerciseId: 'bench-press', sets: 3 },
  { exerciseId: 'pull-up', sets: 3 },
]);

// qisqa tanishuv: 4 savol; qolganlari (aniq kunlar, davomiylik, faollik, ustuvor mushaklar, ovqat) — standart, keyin Profil'da
const STEPS = ['welcome', 'goal', 'body', 'plan', 'health', 'done'] as const;
type Step = (typeof STEPS)[number];

export default function Onboarding() {
  const nav = useNavigate();
  const setProfile = useStore((s) => s.setProfile);
  const importData = useStore((s) => s.importData);
  const fileRef = useRef<HTMLInputElement>(null);
  // qadam URL'da (?s=3): telefonning "orqaga" tugmasi oldingi qadamga qaytaradi, ilovadan chiqib ketmaydi
  const [sp, setSp] = useSearchParams();
  const loc = useLocation();
  const step: Step = STEPS[Number(sp.get('s'))] ?? 'welcome';
  const setStep = (s: Step) => setSp({ s: String(STEPS.indexOf(s)) });
  const [importErr, setImportErr] = useState(false);
  const [dir, setDir] = useState(1);
  // shu sahifada tugatildi — profil endi bor, lekin "Tayyor" ekrani ko'rsatiladi
  const [finished, setFinished] = useState(false);
  const [p, setP] = useState<Omit<Profile, 'createdAt'>>(() => {
    // javoblar sahifa yangilanganda ham saqlanadi (sessiya davomida)
    try {
      const saved = sessionStorage.getItem('kachok-onboarding');
      if (saved) return JSON.parse(saved);
    } catch {
      /* saqlash imkoni yo'q */
    }
    return {
      name: telegramFirstName(),
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
    };
  });
  useEffect(() => {
    try {
      sessionStorage.setItem('kachok-onboarding', JSON.stringify(p));
    } catch {
      /* saqlash imkoni yo'q */
    }
  }, [p]);
  const up = (patch: Partial<Profile>) => setP((x) => ({ ...x, ...patch }));
  const idx = STEPS.indexOf(step);
  const go = (d: 1 | -1) => {
    setDir(d);
    // orqaga — tarix bo'yicha (ilova ichida kelingan bo'lsa), aks holda oldingi qadamni almashtirib
    if (d === -1 && loc.key !== 'default') nav(-1);
    else setSp({ s: String(Math.max(0, Math.min(STEPS.length - 1, idx + d))) }, { replace: d === -1 });
  };
  const finish = () => {
    setFinished(true);
    // faqat bo'shliqdan iborat ism — avatar harfi va sarlavha bo'sh qolardi
    setProfile({ ...p, name: p.name.trim() || 'Sportchi', createdAt: new Date().toISOString() });
    try {
      sessionStorage.removeItem('kachok-onboarding');
    } catch {
      /* saqlash imkoni yo'q */
    }
    setDir(1);
    setStep('done');
  };
  const canNext = true;

  const progress = idx <= 0 ? 0 : Math.min(1, idx / (STEPS.length - 2));
  const np = useMemo(() => (step === 'done' ? nutritionPlan({ ...p, createdAt: '' }) : null), [step, p]);
  const program = useStore((s) => s.program);
  const hasProfile = useStore((s) => !!s.profile);

  // profil allaqachon bor (masalan, tugatgandan keyin telefonning "orqaga" tugmasi) — so'rovnoma qayta ochilmaydi,
  // aks holda standart javoblar bilan "Dasturni tuzish" profilni ustidan yozib yuborardi
  if (hasProfile && !finished && step !== 'done') return <Navigate to="/" replace />;

  if (step === 'welcome') {
    return (
      <div className="page no-tab" style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column' }}>
        <Logo size={30} intro className="welcome-logo" />
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="card glow welcome-hero mt-12">
          <BodyHero load={WELCOME_LOAD} label="3D anatomik model: mashqda ishlaydigan mushaklar lime rangda yonadi" />
          <span className="eyebrow accent welcome-tag">Har bir mushak — 3D da</span>
        </motion.div>
        <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.6 }} className="poster mt-24" style={{ fontSize: 60 }}>
          Gapirma — bos.
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
            Fayl o‘qilmadi. GYMbos’dan eksport qilingan .json faylni tanlang.
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
              <StepHead title="O‘zingiz haqingizda" text="Kaloriya va boshlang‘ich vaznlarni hisoblash uchun." />
              <div className="grid-2">
                {(['male', 'female'] as Sex[]).map((s) => (
                  <Choice key={s} on={p.sex === s} onClick={() => up({ sex: s })} title={s === 'male' ? 'Erkak' : 'Ayol'} />
                ))}
              </div>
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
              <div className="field">
                <label htmlFor="nm">Ismingiz (ixtiyoriy)</label>
                <input id="nm" className="input" placeholder="Masalan, Aziz" value={p.name} onChange={(e) => up({ name: e.target.value })} autoComplete="given-name" />
              </div>
              {p.age < 18 && (
                <div className="notice info">
                  <Icon name="info" />
                  <span>18 yoshgacha kuch mashqlari xavfsiz va foydali, lekin texnikaga murabbiy nazorati tavsiya etiladi.</span>
                </div>
              )}
            </>
          )}

          {step === 'plan' && (
            <>
              <StepHead title="Reja" text="Tajriba, haftalik kunlar va zalingiz — dastur shundan tuziladi." />
              <div className="field">
                <label>Tajribangiz</label>
                <div className="stack gap-8">
                  {LEVELS.map((l) => (
                    <Choice key={l.id} on={p.level === l.id} onClick={() => up({ level: l.id })} title={l.title} desc={l.desc} />
                  ))}
                </div>
              </div>
              <div className="field">
                <label>Haftasiga necha kun</label>
                <div className="row gap-8">
                  {[2, 3, 4, 5, 6].map((n) => (
                    <button
                      key={n}
                      className={`chip ${p.daysPerWeek === n ? 'on' : ''}`}
                      style={{ flex: 1, height: 48, justifyContent: 'center', fontSize: 18, fontWeight: 800 }}
                      aria-pressed={p.daysPerWeek === n}
                      onClick={() => up({ daysPerWeek: n, trainingDays: DEFAULT_DAYS[n], split: undefined })}
                    >
                      {n}
                    </button>
                  ))}
                </div>
                <span className="tiny faint">
                  {p.trainingDays.map((d) => DAYS_SHORT[d]).join(' · ')} — kunlarni keyin «Haftalik reja»da o‘zgartirasiz.
                </span>
              </div>
              <div className="field">
                <label>Zalingizda nima bor?</label>
                <div className="stack gap-8">
                  {EQUIPMENT_PRESETS.map((pr) => {
                    const on = pr.items.length === p.equipment.length && pr.items.every((x) => p.equipment.includes(x));
                    return <Choice key={pr.id} on={on} onClick={() => up({ equipment: pr.items })} title={pr.name} desc={pr.desc} />;
                  })}
                </div>
                <span className="tiny faint">Aniq jihozlar ro‘yxati — Profil → Zal jihozlari.</span>
              </div>
            </>
          )}

          {step === 'health' && (
            <>
              <StepHead title="Sog‘liq" text="Xavfli mashqlar chiqariladi va muqobili bilan almashtiriladi." />
              <div className="field">
                <label>Og‘riq yoki jarohat bor joylar (bo‘lsa)</label>
                <div className="row wrap gap-8">
                  {INJURIES.map((inj) => {
                    const on = p.injuries.includes(inj.id);
                    return (
                      <button
                        key={inj.id}
                        className={`chip ${on ? 'on' : ''}`}
                        aria-pressed={on}
                        onClick={() => up({ injuries: on ? p.injuries.filter((x) => x !== inj.id) : [...p.injuries, inj.id as Injury] })}
                      >
                        {inj.name}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="field">
                <label>Qaysi biriga «Ha» deb javob berasiz? (PAR-Q+)</label>
                <div className="stack gap-8">
                  {PARQ.map((q, i) => {
                    const on = p.healthFlags.includes(String(i));
                    return <Choice key={i} multi on={on} onClick={() => up({ healthFlags: on ? p.healthFlags.filter((x) => x !== String(i)) : [...p.healthFlags, String(i)] })} title={q} />;
                  })}
                </div>
              </div>
              {p.healthFlags.length > 0 || p.injuries.length > 0 ? (
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
                <h1 className="display display-xl">{p.name ? `${p.name}, boshladik` : 'Boshladik'}</h1>
              </motion.div>
              <div className="card stack gap-12">
                <Row k="Tizim" v={program.split} />
                <Row k="Haftasiga" v={`${program.days.length} kun · ~${Math.round(program.days.reduce((a, d) => a + d.estMin, 0) / program.days.length)} daqiqa`} />
                <Row k="Kunlar" v={program.days.map((d) => DAYS_SHORT[d.weekday]).join(' · ')} />
                <Row k="Kunlik kaloriya" v={`${np.kcal} kkal`} />
                <Row k="Oqsil" v={`${np.protein} g / kun`} />
              </div>
              <p className="muted small">{program.splitWhy}</p>
              <p className="small muted">Kunlar, mashg‘ulot davomiyligi, kundalik faollik va ustuvor mushaklarni istalgan vaqtda Profil’da aniqlashtirasiz — dastur shunga moslanadi.</p>
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
    <span
      style={{
        width: 42,
        height: 42,
        borderRadius: 12,
        display: 'grid',
        placeItems: 'center',
        background: on ? 'var(--accent)' : 'var(--surface-2)',
        color: on ? 'var(--accent-ink)' : 'var(--text-2)',
        flex: 'none',
        transition: 'all .15s',
      }}
    >
      <Icon name={name} />
    </span>
  );
}
