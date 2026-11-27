// Kaloriya va oqsil kalkulyatori: ilovadagi formula bilan bir xil (src/engine/nutrition.ts).
import { CaretDown, Info } from '@phosphor-icons/react/ssr';
import { useEffect, useId, useMemo, useState } from 'react';
import { ACTIVITY, nutritionPlan } from '../../../src/engine/nutrition';
import type { ActivityLevel, Goal, Level, Profile, Sex } from '../../../src/types';
import { fmt, fmt1, useShared } from '../data';
import { BotButton, Chips, NumberField, parseNum, Seg } from '../ui';

const GOALS: { v: Goal; t: string }[] = [
  { v: 'fatLoss', t: 'Ozish' },
  { v: 'muscle', t: 'Mushak massasi' },
  { v: 'recomp', t: 'Ozib, mushak saqlash' },
  { v: 'strength', t: 'Kuch' },
  { v: 'health', t: 'Sog‘liq' },
];
const LEVELS: { v: Level; t: string }[] = [
  { v: 'beginner', t: 'Endi boshlayapman' },
  { v: 'intermediate', t: '1–3 yil' },
  { v: 'advanced', t: '3 yildan ko‘p' },
];
const DAYS = [0, 1, 2, 3, 4, 5, 6].map((d) => ({ v: d, t: String(d) }));

export function Calories() {
  const { setDailyKcal } = useShared();
  const actId = useId();
  const [sex, setSex] = useState<Sex>('male');
  const [age, setAge] = useState('25');
  const [height, setHeight] = useState('175');
  const [weight, setWeight] = useState('75');
  const [activity, setActivity] = useState<ActivityLevel>('light');
  const [days, setDays] = useState(3);
  const [goal, setGoal] = useState<Goal>('muscle');
  const [level, setLevel] = useState<Level>('beginner');

  const a = parseNum(age, 14, 80, 'Yosh');
  const h = parseNum(height, 140, 215, 'Bo‘y');
  const w = parseNum(weight, 40, 200, 'Vazn');
  const ok = !a.err && !h.err && !w.err;

  const plan = useMemo(() => {
    if (!ok) return null;
    const p: Profile = {
      name: '',
      sex,
      age: a.n,
      heightCm: h.n,
      weightKg: w.n,
      goal,
      level,
      daysPerWeek: days,
      sessionMin: 60,
      trainingDays: [],
      equipment: [],
      injuries: [],
      focus: [],
      activity,
      healthFlags: [],
      dietPrefs: { noPork: false, lactoseFree: false, vegetarian: false },
      createdAt: '',
    };
    return nutritionPlan(p);
  }, [ok, sex, a.n, h.n, w.n, goal, level, days, activity]);

  useEffect(() => setDailyKcal(plan ? plan.kcal : null), [plan, setDailyKcal]);

  const split = plan ? { p: plan.protein * 4, c: plan.carbs * 4, f: plan.fat * 9 } : null;
  const total = split ? split.p + split.c + split.f : 1;
  const change = plan ? plan.weeklyChangeKg : 0;

  return (
    <section id="kaloriya" className="tool" aria-labelledby="kaloriya-t">
      <div className="stack gap-24">
        <div className="tool-head">
          <span className="eyebrow">Kalkulyator</span>
          <h3 id="kaloriya-t" className="heading-4">
            Kuniga qancha kaloriya va oqsil kerak?
          </h3>
          <p className="body-3 muted">Ilovadagi formula bilan hisoblanadi: tinch holatdagi sarf (Mifflin–St Jeor), kundalik harakat, mashg‘ulotlar va maqsadingiz.</p>
        </div>
        <div className="panel">
          <Seg label="Jins" value={sex} options={[{ v: 'male', t: 'Erkak' }, { v: 'female', t: 'Ayol' }]} onChange={setSex} />
          <div className="fields-3">
            <NumberField label="Yosh" value={age} onChange={setAge} min={14} max={80} unit="yosh" error={a.err} />
            <NumberField label="Bo‘y" value={height} onChange={setHeight} min={140} max={215} unit="sm" error={h.err} />
            <NumberField label="Vazn" value={weight} onChange={setWeight} min={40} max={200} step={0.5} unit="kg" error={w.err} />
          </div>
          <div className="field">
            <label className="field-label caption-1" htmlFor={actId}>
              Kundalik harakat (mashg‘ulotdan tashqari)
            </label>
            <div className="input-wrap">
              <select id={actId} className="input" value={activity} onChange={(e) => setActivity(e.target.value as ActivityLevel)}>
                {(Object.keys(ACTIVITY) as ActivityLevel[]).map((k) => (
                  <option key={k} value={k}>
                    {ACTIVITY[k].name}
                  </option>
                ))}
              </select>
              <CaretDown size={16} className="select-caret" aria-hidden="true" />
            </div>
            {/* tavsif alohida: telefonda tanlov maydoniga uzun matn sig‘maydi */}
            <span className="caption-5 faint">{ACTIVITY[activity].desc}</span>
          </div>
          <Chips label="Haftada necha kun kuch mashqi" value={days} options={DAYS} onChange={setDays} />
          <Chips label="Maqsad" value={goal} options={GOALS} onChange={setGoal} />
          {goal === 'muscle' && <Chips label="Zalda tajriba" value={level} options={LEVELS} onChange={setLevel} />}
        </div>
      </div>

      <div className="panel" aria-live="polite">
        {plan && split ? (
          <div className="result">
            <span className="caption-1 muted">Kunlik me’yoringiz</span>
            <div className="big">
              <span className="heading-2">{fmt(plan.kcal)}</span>
              <span className="title-2 muted">kkal</span>
            </div>
            <div className="split" aria-hidden="true">
              <i style={{ flexGrow: split.p, background: 'var(--lime)' }} />
              <i style={{ flexGrow: split.c, background: 'var(--carb)' }} />
              <i style={{ flexGrow: split.f, background: 'var(--fat)' }} />
            </div>
            <div className="bars">
              <Macro name="Oqsil" g={plan.protein} pct={split.p / total} color="var(--lime)" />
              <Macro name="Uglevod" g={plan.carbs} pct={split.c / total} color="var(--carb)" />
              <Macro name="Yog‘" g={plan.fat} pct={split.f / total} color="var(--fat)" />
            </div>
            <div className="kv">
              <div>
                <span className="caption-4 faint">Har mahalda oqsil</span>
                <span className="body-1 num">
                  ~{plan.proteinPerMeal} g · {plan.meals} mahal
                </span>
              </div>
              <div>
                <span className="caption-4 faint">Suv</span>
                <span className="body-1 num">{fmt1(plan.waterL)} L</span>
              </div>
              <div>
                <span className="caption-4 faint">Kunlik sarfingiz</span>
                <span className="body-1 num">{fmt(plan.tdee)} kkal</span>
              </div>
              <div>
                <span className="caption-4 faint">Kutilgan o‘zgarish</span>
                <span className="body-1 num">{change === 0 ? 'vazn o‘zgarmaydi' : `${change > 0 ? '+' : '−'}${fmt1(Math.abs(change))} kg / hafta`}</span>
              </div>
            </div>
            {plan.notes.map((n) => (
              <p key={n} className="note caption-2">
                <Info size={16} aria-hidden="true" />
                {n}
              </p>
            ))}
            <div className="tool-cta">
              <BotButton from="site_kkal" size="md">
                Shu me’yor bilan kundalik yuritish
              </BotButton>
              <a className="link body-5" href="#taomlar">
                Milliy taomlar bilan solishtirish
              </a>
            </div>
            <p className="caption-5 faint">Taxminiy hisob. Ilova 2–3 haftalik vazningiz va yeganlaringizga qarab me’yorni o‘zi aniqlashtiradi.</p>
          </div>
        ) : (
          <div className="empty">
            <span className="body-2">Natija shu yerda chiqadi</span>
            <span className="body-6">Yosh, bo‘y va vaznni to‘g‘ri kiriting: chap tomonda qaysi maydon xato ekani yozilgan.</span>
          </div>
        )}
      </div>
    </section>
  );
}

function Macro({ name, g, pct, color }: { name: string; g: number; pct: number; color: string }) {
  return (
    <div className="bar-row">
      <span className="body-5">
        <span className="dot" style={{ background: color }} />
        {name}
      </span>
      <span className="body-4 num">
        {fmt(g)} g <span className="faint caption-5">· {Math.round(pct * 100)}%</span>
      </span>
    </div>
  );
}
