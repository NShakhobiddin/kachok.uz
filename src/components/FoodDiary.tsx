// Ovqat kundaligi: kun bo'yicha yozuvlar, maqsadga nisbatan qoldiq, mahalliy taomlar bazasidan tez qo'shish
// va kundalik + vazn asosidagi moslashuvchan sarf (adaptive TDEE).
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { FOOD_CATS, FOOD_DB, FOOD_MAP, portion, searchFoods, type FoodCat, type FoodItem } from '../data/foods';
import type { NutritionPlan, TdeeEstimate } from '../engine/nutrition';
import { fmtDate, isoDate } from '../lib/date';
import { useStore } from '../store/useStore';
import type { FoodEntry } from '../types';
import { MACRO_COLORS } from './charts';
import { Icon } from './ui/Icon';
import { Sheet } from './ui/Sheet';
import { Stepper, Toggle } from './ui/controls';

export const MEALS = ['Nonushta', 'Tushlik', 'Kechki ovqat', 'Tamaddi'] as const;
/** jo'nalish kelishigi: "tushlik" + ga → "tushlikka" */
const MEALS_TO = ['Nonushtaga', 'Tushlikka', 'Kechki ovqatga', 'Tamaddiga'] as const;
type Meal = FoodEntry['meal'];

const uid = () => Math.random().toString(36).slice(2, 10);
const addDays = (iso: string, n: number) => isoDate(new Date(new Date(iso + 'T12:00:00').getTime() + n * 86400000));
const r1 = (n: number) => Math.round(n * 10) / 10;

export function sumEntries(list: Pick<FoodEntry, 'kcal' | 'p' | 'f' | 'c'>[]) {
  return list.reduce((a, e) => ({ kcal: a.kcal + e.kcal, p: a.p + e.p, f: a.f + e.f, c: a.c + e.c }), { kcal: 0, p: 0, f: 0, c: 0 });
}

export function FoodDiary({ np }: { np: NutritionPlan }) {
  const food = useStore((s) => s.food);
  const removeFood = useStore((s) => s.removeFood);
  const [date, setDate] = useState(isoDate());
  const [adding, setAdding] = useState<Meal | null>(null);
  const today = isoDate();
  const list = useMemo(() => food.filter((e) => e.date === date), [food, date]);
  const tot = sumEntries(list);
  const left = np.kcal - Math.round(tot.kcal);

  return (
    <div className="stack gap-12">
      <div className="row between">
        <button className="icon-btn" onClick={() => setDate(addDays(date, -1))} aria-label="Oldingi kun">
          <Icon name="left" />
        </button>
        <span className="strong">{date === today ? 'Bugun' : date === addDays(today, -1) ? 'Kecha' : fmtDate(date)}</span>
        <button className="icon-btn" onClick={() => setDate(addDays(date, 1))} disabled={date >= today} aria-label="Keyingi kun">
          <Icon name="right" />
        </button>
      </div>

      <div className="card raised stack gap-16">
        <div className="row between" style={{ alignItems: 'flex-end' }}>
          <div className="stack gap-4">
            <span className="small muted">{left >= 0 ? 'Qoldi' : 'Maqsaddan oshdi'}</span>
            <span className="num" style={{ fontSize: 44, fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1, color: left < -150 ? 'var(--yellow)' : 'var(--text)' }}>
              {Math.abs(left)}
              <span className="title muted" style={{ marginLeft: 6 }}>
                kkal
              </span>
            </span>
          </div>
          <span className="small muted num" style={{ textAlign: 'right' }}>
            {Math.round(tot.kcal)} / {np.kcal}
            <br />
            yeyildi
          </span>
        </div>
        <Progress value={tot.kcal} target={np.kcal} color="var(--blue)" label="Kaloriya" />
        <div className="grid-3">
          <MacroLine label="Oqsil" value={tot.p} target={np.protein} color={MACRO_COLORS.p} />
          <MacroLine label="Uglevod" value={tot.c} target={np.carbs} color={MACRO_COLORS.c} />
          <MacroLine label="Yog‘" value={tot.f} target={np.fat} color={MACRO_COLORS.f} />
        </div>
      </div>

      {MEALS.map((name, m) => {
        const items = list.filter((e) => e.meal === m);
        const s = sumEntries(items);
        return (
          <div key={name} className="card tight stack" style={{ gap: 0 }}>
            <div className="row between" style={{ paddingBottom: items.length ? 6 : 0 }}>
              <span className="strong">{name}</span>
              <span className="row gap-8">
                {items.length > 0 && <span className="small muted num">{Math.round(s.kcal)} kkal</span>}
                <button className="chip sm" onClick={() => setAdding(m as Meal)} aria-label={`${MEALS_TO[m]} qo‘shish`}>
                  <Icon name="plus" size={15} /> Qo‘shish
                </button>
              </span>
            </div>
            {items.map((e) => (
              <div key={e.id} className="row gap-8 small" style={{ padding: '8px 0', borderTop: '1px solid var(--line)' }}>
                <span className="grow" style={{ minWidth: 0 }}>
                  <span className="ellipsis" style={{ display: 'block' }}>
                    {e.name}
                  </span>
                  <span className="tiny faint num">
                    {e.label ?? (e.g ? `${e.g} g` : '')} · O {r1(e.p)} · U {r1(e.c)} · Y {r1(e.f)}
                  </span>
                </span>
                <b className="num">{Math.round(e.kcal)}</b>
                <button className="icon-btn" style={{ width: 34, height: 34 }} onClick={() => removeFood(e.id)} aria-label={`${e.name} — o‘chirish`}>
                  <Icon name="x" size={16} />
                </button>
              </div>
            ))}
          </div>
        );
      })}

      <AddFoodSheet open={adding !== null} meal={adding ?? 0} date={date} onClose={() => setAdding(null)} />
    </div>
  );
}

function Progress({ value, target, color, label }: { value: number; target: number; color: string; label: string }) {
  const pct = Math.min(1, value / Math.max(1, target));
  const over = value > target * 1.05;
  return (
    <div className="diary-bar" role="progressbar" aria-label={label} aria-valuenow={Math.round(value)} aria-valuemin={0} aria-valuemax={Math.round(target)}>
      <i style={{ width: `${pct * 100}%`, background: over ? 'var(--yellow)' : color }} />
    </div>
  );
}

function MacroLine({ label, value, target, color }: { label: string; value: number; target: number; color: string }) {
  return (
    <div className="stack gap-6">
      <span className="row gap-6 small muted">
        <i className="dot" style={{ background: color }} />
        {label}
      </span>
      <span className="small num">
        <b>{Math.round(value)}</b>
        <span className="faint"> / {target} g</span>
      </span>
      <Progress value={value} target={target} color={color} label={label} />
    </div>
  );
}

/* ---------------- Qo'shish oynasi ---------------- */

function AddFoodSheet({ open, meal, date, onClose }: { open: boolean; meal: Meal; date: string; onClose: () => void }) {
  const food = useStore((s) => s.food);
  const addFood = useStore((s) => s.addFood);
  const [q, setQ] = useState('');
  const [pick, setPick] = useState<FoodItem | null>(null);
  const [quick, setQuick] = useState(false);
  const [m, setM] = useState<Meal>(meal);
  const [lastMeal, setLastMeal] = useState(meal);
  if (meal !== lastMeal) {
    setLastMeal(meal);
    setM(meal);
  }
  const close = () => {
    setQ('');
    setPick(null);
    setQuick(false);
    onClose();
  };
  // so'nggi ishlatilganlar — eng yangisi birinchi
  const recent = useMemo(() => {
    const seen = new Set<string>();
    const out: FoodItem[] = [];
    for (let i = food.length - 1; i >= 0 && out.length < 8; i--) {
      const id = food[i].foodId;
      if (id && FOOD_MAP[id] && !seen.has(id)) {
        seen.add(id);
        out.push(FOOD_MAP[id]);
      }
    }
    return out;
  }, [food]);
  const results = useMemo(() => (q.trim() ? searchFoods(q) : []), [q]);
  const add = (e: Omit<FoodEntry, 'id' | 'date' | 'meal'>) => {
    addFood({ ...e, id: uid(), date, meal: m });
    close();
  };

  return (
    <Sheet open={open} onClose={close} label="Ovqat qo‘shish">
      {pick ? (
        <PortionStep food={pick} meal={m} setMeal={setM} onBack={() => setPick(null)} onAdd={add} />
      ) : quick ? (
        <QuickStep meal={m} setMeal={setM} onBack={() => setQuick(false)} onAdd={add} />
      ) : (
        <div className="stack gap-12">
          <h3 className="title">{MEALS_TO[m]} qo‘shish</h3>
          <div style={{ position: 'relative' }}>
            <Icon name="search" size={18} style={{ position: 'absolute', left: 14, top: 16, color: 'var(--text-3)' }} />
            <input className="input" style={{ paddingLeft: 40 }} placeholder="Osh, tovuq, non, qatiq…" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Ovqat qidirish" />
          </div>
          <button className="row gap-8 small strong" style={{ color: 'var(--blue-2)', alignSelf: 'flex-start', minHeight: 36 }} onClick={() => setQuick(true)}>
            <Icon name="edit" size={16} /> Kaloriyani qo‘lda kiritish
          </button>
          {q.trim() ? (
            results.length ? (
              <FoodList items={results} onPick={setPick} />
            ) : (
              <p className="small muted">Topilmadi. Kaloriyani qo‘lda kiriting yoki boshqa nom bilan qidiring.</p>
            )
          ) : (
            <>
              {recent.length > 0 && (
                <div className="stack gap-6">
                  <span className="eyebrow">So‘nggi</span>
                  <FoodList items={recent} onPick={setPick} />
                </div>
              )}
              {(Object.keys(FOOD_CATS) as FoodCat[]).map((cat) => (
                <details key={cat} className="food-cat">
                  <summary>
                    <span>{FOOD_CATS[cat]}</span>
                    <Icon name="down" size={16} />
                  </summary>
                  <FoodList items={FOOD_DB.filter((f) => f.cat === cat)} onPick={setPick} />
                </details>
              ))}
            </>
          )}
        </div>
      )}
    </Sheet>
  );
}

function FoodList({ items, onPick }: { items: FoodItem[]; onPick: (f: FoodItem) => void }) {
  return (
    <div className="stack" style={{ gap: 0 }}>
      {items.map((f) => {
        const u = f.units?.[0];
        const v = portion(f, u?.g ?? 100);
        return (
          <button key={f.id} className="row between gap-12 food-row" onClick={() => onPick(f)}>
            <span className="stack" style={{ gap: 2, minWidth: 0, textAlign: 'left' }}>
              <span className="small strong">{f.name}</span>
              <span className="tiny faint num">
                {u ? `1 ${u.name} (${u.g} g)` : '100 g'} · O {v.p} g
              </span>
            </span>
            <span className="small num" style={{ flex: 'none' }}>
              <b>{v.kcal}</b> <span className="faint">kkal</span>
            </span>
          </button>
        );
      })}
    </div>
  );
}

function MealChips({ meal, setMeal }: { meal: Meal; setMeal: (m: Meal) => void }) {
  return (
    <div className="row wrap gap-6" role="radiogroup" aria-label="Ovqat mahali">
      {MEALS.map((n, i) => (
        <button key={n} role="radio" aria-checked={meal === i} className={`chip sm ${meal === i ? 'on' : ''}`} onClick={() => setMeal(i as Meal)}>
          {n}
        </button>
      ))}
    </div>
  );
}

function PortionStep({ food, meal, setMeal, onBack, onAdd }: { food: FoodItem; meal: Meal; setMeal: (m: Meal) => void; onBack: () => void; onAdd: (e: Omit<FoodEntry, 'id' | 'date' | 'meal'>) => void }) {
  const units = [...(food.units ?? []), { name: 'g', g: 1 }];
  const [ui, setUi] = useState(0);
  const unit = units[ui];
  const isGram = unit.g === 1;
  const [qty, setQty] = useState(isGram ? 100 : 1);
  const g = Math.round(qty * unit.g);
  const v = portion(food, g);
  const label = isGram ? `${g} g` : `${qty} ${unit.name}`;
  return (
    <div className="stack gap-16">
      <button className="row gap-6 small muted" style={{ alignSelf: 'flex-start', minHeight: 36 }} onClick={onBack}>
        <Icon name="left" size={16} /> Orqaga
      </button>
      <div>
        <h3 className="title">{food.name}</h3>
        <p className="tiny faint num mt-4">
          100 g: {food.kcal} kkal · O {food.p} · U {food.c} · Y {food.f}
        </p>
      </div>
      <div className="row wrap gap-6" role="radiogroup" aria-label="O‘lchov birligi">
        {units.map((u, i) => (
          <button
            key={u.name}
            role="radio"
            aria-checked={ui === i}
            className={`chip sm ${ui === i ? 'on' : ''}`}
            onClick={() => {
              setUi(i);
              setQty(u.g === 1 ? Math.round((qty * unit.g) / 10) * 10 || 100 : 1);
            }}
          >
            {u.g === 1 ? 'gramm' : `${u.name} · ${u.g} g`}
          </button>
        ))}
      </div>
      <Stepper value={qty} onChange={setQty} step={isGram ? 10 : 0.5} min={isGram ? 5 : 0.5} max={isGram ? 3000 : 20} unit={isGram ? 'g' : unit.name} label="Miqdor" />
      <div className="card tight row between">
        <span className="stack" style={{ gap: 2 }}>
          <span className="tiny muted">{label}</span>
          <span className="num" style={{ fontSize: 28, fontWeight: 800 }}>
            {v.kcal} <span className="small muted">kkal</span>
          </span>
        </span>
        <span className="small num" style={{ textAlign: 'right' }}>
          <span style={{ color: MACRO_COLORS.p }}>O {v.p} g</span>
          <br />
          <span style={{ color: MACRO_COLORS.c }}>U {v.c} g</span> · <span style={{ color: MACRO_COLORS.f }}>Y {v.f} g</span>
        </span>
      </div>
      <MealChips meal={meal} setMeal={setMeal} />
      <button className="btn btn-primary btn-block" onClick={() => onAdd({ foodId: food.id, name: food.name, g, label, ...v })}>
        <Icon name="plus" size={18} /> Qo‘shish
      </button>
    </div>
  );
}

function QuickStep({ meal, setMeal, onBack, onAdd }: { meal: Meal; setMeal: (m: Meal) => void; onBack: () => void; onAdd: (e: Omit<FoodEntry, 'id' | 'date' | 'meal'>) => void }) {
  const [name, setName] = useState('');
  const [kcal, setKcal] = useState(300);
  const [p, setP] = useState(0);
  const [c, setC] = useState(0);
  const [f, setF] = useState(0);
  return (
    <div className="stack gap-12">
      <button className="row gap-6 small muted" style={{ alignSelf: 'flex-start', minHeight: 36 }} onClick={onBack}>
        <Icon name="left" size={16} /> Orqaga
      </button>
      <h3 className="title">Qo‘lda kiritish</h3>
      <input className="input" placeholder="Nomi (ixtiyoriy)" value={name} onChange={(e) => setName(e.target.value)} aria-label="Ovqat nomi" />
      <Stepper value={kcal} onChange={setKcal} step={10} min={0} max={5000} unit="kkal" label="Kaloriya" />
      <Stepper value={p} onChange={setP} step={1} min={0} max={300} unit="g oqsil" label="Oqsil" />
      <div className="grid-2">
        <Stepper value={c} onChange={setC} step={5} min={0} max={600} unit="g U" label="Uglevod" />
        <Stepper value={f} onChange={setF} step={1} min={0} max={300} unit="g Y" label="Yog‘" />
      </div>
      <MealChips meal={meal} setMeal={setMeal} />
      <button className="btn btn-primary btn-block" disabled={kcal <= 0} onClick={() => onAdd({ name: name.trim() || 'Qo‘lda kiritilgan', kcal, p, f, c })}>
        <Icon name="plus" size={18} /> Qo‘shish
      </button>
    </div>
  );
}

/* ---------------- Moslashuvchan sarf kartasi ---------------- */

export function TdeeCard({ est, on, setOn }: { est: TdeeEstimate; on: boolean; setOn: (v: boolean) => void }) {
  const ready = est.updates > 0;
  const diff = est.tdee - est.prior;
  return (
    <div className="card stack gap-12">
      <div className="row between gap-12">
        <div className="stack" style={{ gap: 2 }}>
          <span className="eyebrow">Haqiqiy sarfingiz (TDEE)</span>
          <span className="num" style={{ fontSize: 30, fontWeight: 800 }}>
            {ready ? est.tdee : '—'} <span className="small muted">kkal/kun</span>
          </span>
        </div>
        <Toggle on={on} onChange={setOn} label="Rejada moslashuvchan sarfni ishlatish" />
      </div>
      {ready ? (
        <p className="small">
          Formula bo‘yicha {est.prior} kkal edi; sizning kundalik va vazningiz {diff === 0 ? 'uni tasdiqladi' : `${Math.abs(diff)} kkal ${diff > 0 ? 'ko‘proq' : 'kamroq'} sarflayotganingizni ko‘rsatdi`}. {on ? 'Kaloriya rejasi shu asosda.' : 'Yoqsangiz, kaloriya rejasi shu raqamdan hisoblanadi.'}
        </p>
      ) : (
        <p className="small muted">Kaloriyani formula emas, aynan sizning tanangiz bo‘yicha hisoblash uchun: 3 hafta ichida kamida 8 kun ovqatni to‘liq yozing va 4+ marta (10 kun oralig‘ida) tortiling.</p>
      )}
      <div className="conf-bar" role="img" aria-label={`Ishonch: ${Math.round(est.confidence * 100)}%`}>
        {[0, 1, 2].map((i) => (
          <i key={i} className={est.updates > i ? 'on' : ''} />
        ))}
      </div>
      <div className="grid-2 small">
        <Stat k="To‘liq yozilgan kunlar" v={`${est.loggedDays} / 21`} />
        <Stat k="Tortilish" v={`${est.weighIns} marta`} />
        <Stat k="O‘rtacha iste’mol" v={est.avgIntake ? `${est.avgIntake} kkal` : '—'} />
        <Stat k="Vazn trendi" v={est.trendPerWeek !== null ? `${est.trendPerWeek > 0 ? '+' : ''}${est.trendPerWeek} kg/hafta` : '—'} />
      </div>
      <p className="tiny faint">
        Energiya balansi: sarf = iste’mol − 7700 × vazn o‘zgarishi (Hall 2008). Baho har hafta silliq yangilanadi (±150 kkal dan oshmaydi), kun bo‘yi chala yozilgan kunlar hisobga olinmaydi.{' '}
        <Link to="/lesson/tdee-body" className="strong" style={{ color: 'var(--blue-2)' }}>
          Batafsil
        </Link>
      </p>
    </div>
  );
}

function Stat({ k, v }: { k: string; v: string }) {
  return (
    <div className="stack" style={{ gap: 2 }}>
      <span className="tiny muted">{k}</span>
      <span className="strong num">{v}</span>
    </div>
  );
}
