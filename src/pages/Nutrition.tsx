import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { LineChart, MacroBar } from '../components/charts';
import { FoodDiary, TdeeCard } from '../components/FoodDiary';
import { ProGate } from '../components/ProGate';
import { Icon } from '../components/ui/Icon';
import { Note } from '../components/ui/Fold';
import { Sheet } from '../components/ui/Sheet';
import { Stepper } from '../components/ui/controls';
import { sourceById } from '../data/sources';
import { ACTIVITY, NATIONAL_DISHES, SUPPLEMENTS, mealPlan, weeklyCheck, weightTrend } from '../engine/nutrition';
import { fmtDate, isoDate } from '../lib/date';
import { useNutrition } from '../lib/useNutrition';
import { useStore } from '../store/useStore';

const GOAL_TEXT: Record<string, string> = {
  fatLoss: 'ozish',
  muscle: 'mushak massasi',
  strength: 'kuch',
  recomp: 'shakl berish',
  health: "sog‘liq",
};

export default function Nutrition() {
  const profile = useStore((s) => s.profile)!;
  const kcalAdjust = useStore((s) => s.kcalAdjust);
  const setKcalAdjust = useStore((s) => s.setKcalAdjust);
  const updateProfile = useStore((s) => s.updateProfile);
  const body = useStore((s) => s.body);
  const addBody = useStore((s) => s.addBody);
  const setSettings = useStore((s) => s.setSettings);
  const { np, est, adaptiveOn, useAdaptive } = useNutrition();
  const [tab, setTabRaw] = useState<'diary' | 'plan'>(() => {
    try {
      return localStorage.getItem('kachok-ntab') === 'plan' ? 'plan' : 'diary';
    } catch {
      return 'diary';
    }
  });
  const setTab = (t: 'diary' | 'plan') => {
    setTabRaw(t);
    try {
      localStorage.setItem('kachok-ntab', t);
    } catch {
      /* saqlash imkoni yo'q */
    }
  };
  const meals = useMemo(() => mealPlan(np, profile.dietPrefs), [np, profile.dietPrefs]);
  const trend = useMemo(() => weightTrend(body), [body]);
  const check = useMemo(() => weeklyCheck(body, np, profile.weightKg), [body, np, profile.weightKg]);
  const [how, setHow] = useState(false);
  const [logW, setLogW] = useState(false);
  const [w, setW] = useState(profile.weightKg);
  const [openMeal, setOpenMeal] = useState<number | null>(0);
  const mealKcal = meals.reduce((a, m) => a + m.kcal, 0);

  const weightSection = (
    <section className="section">
      <div className="section-head">
        <h2>Vazn trendi</h2>
        <button className="btn btn-secondary btn-xs" onClick={() => setLogW(true)}>
          <Icon name="plus" size={14} /> Vazn
        </button>
      </div>
      <div className="card stack gap-12">
        {trend.length >= 2 ? (
          <>
            <LineChart
              label="Tana vazni: kunlik o‘lchov va trend"
              series={trend.map((p) => ({ t: new Date(p.date).getTime(), v: p.trend }))}
              dots={trend.map((p) => ({ t: new Date(p.date).getTime(), v: p.raw }))}
              unit="kg"
              fmtX={(t) => fmtDate(new Date(t))}
            />
            <div className="row gap-16 tiny muted">
              <span className="row gap-6">
                <i className="dot" style={{ background: 'var(--text-3)' }} /> Kunlik o‘lchov
              </span>
              <span className="row gap-6">
                <i style={{ width: 14, height: 2, background: 'var(--blue)', display: 'inline-block' }} /> Trend (silliqlangan)
              </span>
            </div>
          </>
        ) : (
          <Note label="Qanday tortilish kerak">Har kuni ertalab (hojatxonadan keyin, nonushtadan oldin) tortilib, vaznni kiriting. Kunlik tebranishlar yashiriladi — haqiqiy trend ko‘rinadi.</Note>
        )}
        {useAdaptive ? (
          <p className="tiny faint">Kaloriya moslashuvchan sarf bo‘yicha avtomatik yangilanadi — qo‘lda tuzatish shart emas.</p>
        ) : check ? (
          <div className={`notice ${check.delta === 0 ? 'good' : 'gold'}`}>
            <Icon name={check.delta === 0 ? 'check' : 'info'} />
            <div className="stack gap-8">
              <span>{check.message}</span>
              {check.delta !== 0 && (
                <button className="btn btn-secondary btn-xs" style={{ alignSelf: 'flex-start' }} onClick={() => setKcalAdjust(kcalAdjust + check.delta)}>
                  Qo‘llash ({check.delta > 0 ? '+' : ''}{check.delta} kkal)
                </button>
              )}
            </div>
          </div>
        ) : (
          <p className="tiny faint">2 hafta davomida kamida 6 ta o‘lchov kiritilgach, kaloriyani avtomatik moslash taklifi paydo bo‘ladi.</p>
        )}
      </div>
    </section>
  );

  return (
    <div className="page">
      <div className="page-head">
        <div className="stack gap-4">
          <span className="eyebrow">Maqsad: {GOAL_TEXT[profile.goal]}</span>
          <h1 className="display">Ovqatlanish</h1>
        </div>
      </div>

      <div className="segmented" role="tablist" aria-label="Bo‘lim" style={{ marginBottom: 16 }}>
        <button role="tab" aria-selected={tab === 'diary'} className={tab === 'diary' ? 'on' : ''} onClick={() => setTab('diary')}>
          Kundalik
        </button>
        <button role="tab" aria-selected={tab === 'plan'} className={tab === 'plan' ? 'on' : ''} onClick={() => setTab('plan')}>
          Reja va bilim
        </button>
      </div>

      {tab === 'diary' && (
        <>
          <FoodDiary np={np} />
          {weightSection}
          <section className="section">
            <div className="section-head">
              <h2>Moslashuvchan kaloriya</h2>
            </div>
            <TdeeCard est={est} on={adaptiveOn} setOn={(v) => setSettings({ adaptiveTdee: v })} />
          </section>
        </>
      )}

      {tab === 'plan' && (
        <>
          <div className="card raised stack gap-16">
            <div className="row between" style={{ alignItems: 'flex-end' }}>
              <div className="stack gap-4">
                <span className="small muted">Kunlik kaloriya</span>
                <span style={{ fontSize: 48, fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1 }}>
                  {np.kcal}
                  <span className="title muted" style={{ marginLeft: 6 }}>
                    kkal
                  </span>
                </span>
              </div>
              <button className="small strong" style={{ color: 'var(--blue-2)' }} onClick={() => setHow(true)}>
                Qanday hisoblandi?
              </button>
            </div>
            <MacroBar p={np.protein} f={np.fat} c={np.carbs} />
            <div className="row wrap gap-8 small">
              <span className="tag">Tola {np.fiber}+ g</span>
              <span className="tag">
                Suv {np.waterL} L <span className="faint">+{np.waterTrainingL} L mashq kuni</span>
              </span>
              <span className="tag">Oqsil har mahalda ~{np.proteinPerMeal} g</span>
            </div>
            {np.weeklyChangeKg !== 0 && (
              <div className="notice info">
                <Icon name="target" />
                <span>
                  Kutilayotgan o‘zgarish: <b>haftasiga {np.weeklyChangeKg > 0 ? '+' : ''}{np.weeklyChangeKg} kg</b>. {np.notes[0]}
                </span>
              </div>
            )}
            {kcalAdjust !== 0 && (
              <div className="row between small">
                <span className="muted">Haftalik tekshiruv bo‘yicha tuzatish: {kcalAdjust > 0 ? '+' : ''}{kcalAdjust} kkal</span>
                <button className="strong" style={{ color: 'var(--text-2)' }} onClick={() => setKcalAdjust(0)}>
                  Bekor qilish
                </button>
              </div>
            )}
          </div>

          {/* Ovqat rejasi */}
          <section className="section">
            <div className="section-head">
              <h2>Namunaviy kun</h2>
              <span className="small muted num">≈ {mealKcal} kkal</span>
            </div>
            <div className="row wrap gap-8" style={{ marginBottom: 12 }}>
              <button className={`chip ${profile.dietPrefs.vegetarian ? 'on' : ''}`} onClick={() => updateProfile({ dietPrefs: { ...profile.dietPrefs, vegetarian: !profile.dietPrefs.vegetarian } })}>
                Go‘shtsiz
              </button>
              <button className={`chip ${profile.dietPrefs.lactoseFree ? 'on' : ''}`} onClick={() => updateProfile({ dietPrefs: { ...profile.dietPrefs, lactoseFree: !profile.dietPrefs.lactoseFree } })}>
                Sut mahsulotlarisiz
              </button>
            </div>
            <ProGate feature="meals">
              <div className="stack gap-8">
                {meals.map((m, i) => (
                  <div key={m.name} className="card tight">
                    <button className="row between gap-12" style={{ width: '100%', textAlign: 'left' }} onClick={() => setOpenMeal(openMeal === i ? null : i)} aria-expanded={openMeal === i}>
                      <div className="row gap-12">
                        <span className="mono small faint">{m.time}</span>
                        <span className="strong">{m.name}</span>
                      </div>
                      <span className="row gap-8 small muted num">
                        {m.kcal} kkal · O {m.p} g
                        <Icon name={openMeal === i ? 'up' : 'down'} size={16} />
                      </span>
                    </button>
                    {openMeal === i && (
                      <div className="stack mt-8">
                        {m.items.map((it) => (
                          <div key={it.food.id} className="row between small" style={{ padding: '7px 0', borderTop: '1px solid var(--line)' }}>
                            <span>{it.food.name}</span>
                            <span className="strong num">{it.label}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </ProGate>
            <Note className="mt-4">Miqdorlar maqsadingizga moslab hisoblandi (USDA ma’lumotlari asosida, taxminiy). Mahsulotlarni teng qiymatlilariga almashtirish mumkin: tovuq ↔ baliq ↔ mol go‘shti, guruch ↔ grechka ↔ kartoshka.</Note>
          </section>

          {/* Milliy taomlar */}
          <section className="section">
            <div className="section-head">
              <h2>Milliy taomlar</h2>
              <span className="small muted">taxminiy</span>
            </div>
            <div className="card flush">
              {NATIONAL_DISHES.map((d, i) => (
                <div key={d.name} style={{ padding: '12px 14px', borderBottom: i < NATIONAL_DISHES.length - 1 ? '1px solid var(--line)' : 0 }}>
                  <div className="row between gap-12">
                    <span className="strong">{d.name}</span>
                    <span className="strong num" style={{ flex: 'none' }}>
                      {d.kcal} kkal
                    </span>
                  </div>
                  <div className="tiny faint">
                    {d.portion} · oqsil ~{d.p} g
                  </div>
                  <div className="small muted mt-4">{d.tip}</div>
                </div>
              ))}
            </div>
            <p className="tiny faint mt-8">Kunlik maqsadingizning {Math.round((800 / np.kcal) * 100)}% i — bitta likopcha osh. Taqiq yo‘q, faqat hisob bor.</p>
          </section>

          {/* Qo‘shimchalar */}
          <section className="section">
            <div className="section-head">
              <h2>Qo‘shimchalar</h2>
              <span className="small muted">dalil darajasi</span>
            </div>
            <div className="stack gap-8">
              {SUPPLEMENTS.map((s) => (
                <div key={s.name} className="card tight row gap-12" style={{ alignItems: 'flex-start' }}>
                  <span
                    aria-label={`Daraja ${s.grade}`}
                    style={{
                      width: 34,
                      height: 34,
                      borderRadius: 10,
                      flex: 'none',
                      display: 'grid',
                      placeItems: 'center',
                      fontWeight: 800,
                      color: '#0b0e12',
                      background: s.grade === 'A' ? 'var(--green)' : s.grade === 'B' ? 'var(--blue-2)' : s.grade === 'C' ? 'var(--yellow)' : 'var(--red)',
                    }}
                  >
                    {s.grade}
                  </span>
                  <div className="stack gap-4">
                    <span className="strong">{s.name}</span>
                    <span className="small">{s.dose}</span>
                    <span className="small muted">{s.text}</span>
                    {s.source && <span className="tiny faint">{sourceById(s.source)?.short}</span>}
                  </div>
                </div>
              ))}
            </div>
            <Note className="mt-4" label="A, B, C, X nima">A — kuchli dalil, B — o‘rtacha, C — faqat ma’lum holatlarda, X — samarasiz yoki xavfli.</Note>
          </section>
        </>
      )}

      <Sheet open={how} onClose={() => setHow(false)} label="Hisob-kitob">
        <h3 className="title">Qanday hisoblandi</h3>
        <div className="stack gap-12 mt-12 small">
          <Line k="1. Tinch holat sarfi (Mifflin–St Jeor)" v={`${np.bmr} kkal`} />
          <Line k={useAdaptive ? '2. Haqiqiy sarf (kundalik + vazn trendi)' : `2. Faollik: ${ACTIVITY[profile.activity].name} + ${profile.daysPerWeek} ta mashg‘ulot`} v={`${np.tdee} kkal`} />
          <Line k={`3. Maqsad: ${GOAL_TEXT[profile.goal]}`} v={`${np.kcal} kkal`} />
          <div className="divider" />
          <Line k={`Oqsil: ${(np.protein / np.refWeight).toFixed(1)} g/kg${np.refWeight < profile.weightKg ? ` (sog‘lom vazn ${np.refWeight} kg)` : ''}`} v={`${np.protein} g`} />
          <Line k="Yog': ~0.8 g/kg (kaloriyaning 20–35%)" v={`${np.fat} g`} />
          <Line k="Uglevod: qolgan kaloriya" v={`${np.carbs} g`} />
          <div className="divider" />
          {np.notes.map((n) => (
            <p key={n} className="muted">
              • {n}
            </p>
          ))}
          <p className="faint tiny">Manbalar: Mifflin 1990; ISSN (Jäger 2017, Aragon 2017); Morton 2018; Helms 2014; Garthe 2011; Iraki 2019; EFSA 2010.</p>
          <Link to="/sources" className="btn btn-secondary btn-sm">
            Barcha manbalar
          </Link>
        </div>
      </Sheet>

      <Sheet open={logW} onClose={() => setLogW(false)} label="Vazn kiritish">
        <h3 className="title">Bugungi vazn</h3>
        <div className="mt-12">
          <Stepper value={w} onChange={setW} step={0.1} min={30} max={300} unit="kg" label="Vazn" />
        </div>
        <button
          className="btn btn-primary btn-block mt-16"
          onClick={() => {
            addBody({ date: isoDate(), weightKg: w });
            setLogW(false);
          }}
        >
          Saqlash
        </button>
      </Sheet>
    </div>
  );
}

function Line({ k, v }: { k: string; v: string }) {
  return (
    <div className="row between gap-12">
      <span className="muted">{k}</span>
      <span className="strong num" style={{ flex: 'none' }}>
        {v}
      </span>
    </div>
  );
}
