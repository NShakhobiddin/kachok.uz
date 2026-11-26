// Retseptlar: kunlik tavsiya kartasi (kundalikda), retseptlar ro‘yxati (filtrlar bilan) va retsept oynasi
// (masalliqlar necha kishiga, tayyorlash bosqichlari, kundalikka bir bosishda qo‘shish).
import { useMemo, useState } from 'react';
import { normalize } from '../data/foods';
import { RECIPES, RECIPE_PREFIX, fmtQty, ingredientLine, type MealSlot, type RecipeInfo } from '../data/recipes';
import { mealIdeas } from '../engine/mealIdeas';
import type { NutritionPlan } from '../engine/nutrition';
import { isoDate } from '../lib/date';
import { useDateKey } from '../lib/useToday';
import { useStore } from '../store/useStore';
import { MACRO_COLORS } from './charts';
import { MEALS, MealChips } from './FoodDiary';
import { Icon } from './ui/Icon';
import { Note } from './ui/Fold';
import { Sheet } from './ui/Sheet';

const SLOT_TO = ['Nonushtaga', 'Tushlikka', 'Kechki ovqatga', 'Tamaddiga'] as const;
const PORTIONS = [0.5, 0.75, 1, 1.25, 1.5, 2];
const PEOPLE = [1, 2, 3, 4, 6];
const uid = () => Math.random().toString(36).slice(2, 10);
const addDays = (iso: string, n: number) => isoDate(new Date(new Date(iso + 'T12:00:00').getTime() + n * 86400000));

export function RecipeRow({ r, servings = 1, meta, onClick }: { r: RecipeInfo; servings?: number; meta?: string; onClick: () => void }) {
  return (
    <button className="recipe-row" onClick={onClick}>
      <span className="recipe-ico" aria-hidden="true">
        {r.icon}
      </span>
      <span className="grow stack" style={{ gap: 2, minWidth: 0, textAlign: 'left' }}>
        <span className="small strong ellipsis">{r.name}</span>
        <span className="tiny muted num ellipsis">
          {Math.round(r.kcal * servings)} kkal · O {Math.round(r.p * servings)} g · {servings !== 1 ? `${fmtQty(servings)} porsiya` : `${r.min} daq`}
        </span>
        {meta && (
          <span className="tiny ellipsis" style={{ color: 'var(--accent)' }}>
            {meta}
          </span>
        )}
      </span>
      <Icon name="right" size={16} style={{ color: 'var(--text-3)', flex: 'none' }} />
    </button>
  );
}

/** Kundalikda: navbatdagi ovqat mahali uchun 3 ta tavsiya (qolgan kaloriya va oqsilga qarab) */
export function MealIdeasCard({ np, onAll }: { np: NutritionPlan; onAll?: () => void }) {
  const food = useStore((s) => s.food);
  const logs = useStore((s) => s.logs);
  const prefs = useStore((s) => s.profile!.dietPrefs);
  const today = useDateKey();
  const [shuffle, setShuffle] = useState(0);
  const [open, setOpen] = useState<{ r: RecipeInfo; servings: number } | null>(null);
  const ideas = useMemo(
    () =>
      mealIdeas({
        np,
        today: food.filter((e) => e.date === today),
        recent: food.filter((e) => e.date >= addDays(today, -3) && e.date < today).map((e) => e.foodId),
        hour: new Date().getHours(),
        prefs,
        seed: `${today}:${shuffle}`,
        trained: logs.some((l) => l.finishedAt && isoDate(new Date(l.startedAt)) === today),
      }),
    [np, food, logs, prefs, today, shuffle],
  );
  if (!ideas.picks.length) return null;
  const title = ideas.mode === 'over' ? 'Kaloriya tugadi' : `${SLOT_TO[ideas.slot]} nima yeysiz?`;
  const sub =
    ideas.mode === 'over'
      ? `Bugun maqsaddan ${ideas.kcalLeft < 0 ? `${-ideas.kcalLeft} kkal oshdi` : 'deyarli hammasi yeyildi'}. Juda och bo‘lsangiz — ~150 kkal, oqsilli:`
      : ideas.mode === 'light'
        ? `Bugun ${ideas.kcalLeft} kkal qoldi — yengil variantlar:`
        : `~${ideas.kcal} kkal${ideas.protein >= 10 ? ` va ${ideas.protein} g oqsil` : ''} — kunlik maqsadingizga moslab`;
  return (
    <div className="card stack gap-8" aria-labelledby="ideas-title">
      <div className="row between gap-8" style={{ alignItems: 'flex-start' }}>
        <div className="stack" style={{ gap: 2 }}>
          <span className="eyebrow accent">Tavsiya</span>
          <b id="ideas-title">{title}</b>
          <span className="tiny muted">{sub}</span>
        </div>
        <button className="icon-btn" style={{ width: 36, height: 36, flex: 'none' }} onClick={() => setShuffle((n) => n + 1)} aria-label="Boshqa variantlar">
          <Icon name="refresh" size={18} />
        </button>
      </div>
      <div className="stack" style={{ gap: 0 }}>
        {ideas.picks.map((x) => (
          <RecipeRow key={x.recipe.id} r={x.recipe} servings={x.servings} meta={x.why} onClick={() => setOpen({ r: x.recipe, servings: x.servings })} />
        ))}
      </div>
      {onAll && (
        <button className="small strong row gap-6" style={{ color: 'var(--blue-2)', alignSelf: 'flex-start', minHeight: 36 }} onClick={onAll}>
          Barcha retseptlar <Icon name="right" size={14} />
        </button>
      )}
      <RecipeSheet recipe={open?.r ?? null} servings={open?.servings} meal={ideas.slot} onClose={() => setOpen(null)} />
    </div>
  );
}

type Filter = 'protein' | 'quick' | 'meatFree' | 'dairyFree';
const FILTERS: { k: Filter; label: string }[] = [
  { k: 'protein', label: 'Oqsilga boy' },
  { k: 'quick', label: 'Tez (15 daq gacha)' },
  { k: 'meatFree', label: 'Go‘shtsiz' },
  { k: 'dairyFree', label: 'Sutsiz' },
];

/** Retseptlar bo‘limi: qidiruv, mahal va filtrlar */
export function RecipeBrowser({ initial }: { initial?: string | null }) {
  const prefs = useStore((s) => s.profile!.dietPrefs);
  const [q, setQ] = useState('');
  const [slot, setSlot] = useState<MealSlot | -1>(-1);
  const [on, setOn] = useState<Record<Filter, boolean>>({ protein: false, quick: false, meatFree: prefs.vegetarian, dairyFree: prefs.lactoseFree });
  const [open, setOpen] = useState<RecipeInfo | null>(() => RECIPES.find((r) => r.id === initial) ?? null);
  const list = useMemo(() => {
    // so‘z boshidan qidiriladi: "osh" — oshni topadi, "go‘sht"ni emas
    const words = normalize(q).split(' ').filter(Boolean);
    const match = (r: RecipeInfo) => {
      const hay = normalize(r.name).split(/[\s(),-]+/);
      return words.every((w) => hay.some((h) => h.startsWith(w)));
    };
    return RECIPES.filter((r) => (slot === -1 || r.meals.includes(slot)) && FILTERS.every((f) => !on[f.k] || r[f.k]) && match(r));
  }, [q, slot, on]);
  return (
    <div className="stack gap-12">
      <div style={{ position: 'relative' }}>
        <Icon name="search" size={18} style={{ position: 'absolute', left: 14, top: 16, color: 'var(--text-3)' }} />
        <input className="input" style={{ paddingLeft: 40 }} placeholder="Osh, tovuq, tvorog…" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Retsept qidirish" />
      </div>
      <div className="hscroll" role="radiogroup" aria-label="Ovqat mahali">
        {[-1, 0, 1, 2, 3].map((s) => (
          <button key={s} role="radio" aria-checked={slot === s} className={`chip ${slot === s ? 'on' : ''}`} onClick={() => setSlot(s as MealSlot | -1)}>
            {s === -1 ? 'Hammasi' : MEALS[s]}
          </button>
        ))}
      </div>
      <div className="row wrap gap-6">
        {FILTERS.map((f) => (
          <button key={f.k} className={`chip sm ${on[f.k] ? 'on' : ''}`} aria-pressed={on[f.k]} onClick={() => setOn({ ...on, [f.k]: !on[f.k] })}>
            {f.label}
          </button>
        ))}
      </div>
      <span className="tiny muted">{list.length ? `${list.length} ta retsept · kaloriya 1 porsiyaga` : 'Bu filtrlar bilan retsept topilmadi'}</span>
      <div className="card flush" style={{ padding: '0 14px' }}>
        {list.map((r) => (
          <RecipeRow key={r.id} r={r} onClick={() => setOpen(r)} />
        ))}
      </div>
      <Note>Kaloriya masalliqlardan hisoblangan (USDA). Yog‘ni ko‘p quysangiz yoki go‘sht yog‘liroq bo‘lsa — ko‘proq chiqadi.</Note>
      <RecipeSheet recipe={open} onClose={() => setOpen(null)} />
    </div>
  );
}

/** Retsept oynasi */
export function RecipeSheet({ recipe, servings = 1, meal, onClose }: { recipe: RecipeInfo | null; servings?: number; meal?: MealSlot; onClose: () => void }) {
  return (
    <Sheet open={!!recipe} onClose={onClose} label={recipe?.name ?? 'Retsept'}>
      {/* key — boshqa retsept ochilganda holat (porsiya, kishi soni) yangidan */}
      {recipe && <RecipeBody key={recipe.id + servings} r={recipe} servings={servings} meal={meal ?? recipe.meals[0]} />}
    </Sheet>
  );
}

function RecipeBody({ r, servings, meal: meal0 }: { r: RecipeInfo; servings: number; meal: MealSlot }) {
  const addFood = useStore((s) => s.addFood);
  const [people, setPeople] = useState(r.people ?? 1);
  const [portion, setPortion] = useState(servings);
  const [meal, setMeal] = useState<MealSlot>(meal0);
  const [added, setAdded] = useState(false);
  const v = { kcal: Math.round(r.kcal * portion), p: Math.round(r.p * portion), c: Math.round(r.c * portion), f: Math.round(r.f * portion) };
  const tags = [r.protein && 'oqsilga boy', r.meatFree && 'go‘shtsiz', r.dairyFree && 'sutsiz'].filter(Boolean).join(' · ');
  return (
    <div className="stack gap-16">
      <div className="row gap-12">
        <span className="recipe-ico lg" aria-hidden="true">
          {r.icon}
        </span>
        <div className="stack" style={{ gap: 2 }}>
          <h3 className="title">{r.name}</h3>
          <span className="tiny muted">
            {r.min} daqiqa{tags ? ` · ${tags}` : ''}
          </span>
        </div>
      </div>

      <div className="card tight row between">
        <span className="stack" style={{ gap: 2 }}>
          <span className="tiny muted">{fmtQty(portion)} porsiya</span>
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
      {r.tip && <p className="small muted">{r.tip}</p>}

      <section className="stack gap-8">
        <div className="row between gap-8">
          <b>Masalliqlar</b>
          <div className="row gap-4" role="radiogroup" aria-label="Necha kishiga">
            {PEOPLE.map((n) => (
              <button key={n} role="radio" aria-checked={people === n} className={`chip sm ${people === n ? 'on' : ''}`} style={{ minWidth: 34, padding: '0 8px' }} onClick={() => setPeople(n)}>
                {n}
              </button>
            ))}
          </div>
        </div>
        <span className="tiny faint">{people === 1 ? (portion === 1 ? '1 kishiga' : `1 kishiga — ${fmtQty(portion)} porsiya`) : `${people} kishiga`}</span>
        <div className="stack" style={{ gap: 0 }}>
          {r.ing.map((i, k) => {
            // bir kishiga — tanlangan porsiya miqdorida (1¼ porsiya — masalliq ham 1¼ barobar)
            const l = ingredientLine(i, people === 1 ? portion : people);
            return (
              <div key={k} className="row between gap-12 small" style={{ padding: '7px 0', borderTop: '1px solid var(--line)' }}>
                <span className={l.amount ? '' : 'muted'}>{l.name}</span>
                <span className="strong num" style={{ flex: 'none' }}>
                  {l.amount}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      <section className="stack gap-8">
        <b>Tayyorlash</b>
        <ol className="recipe-steps">
          {r.steps.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ol>
      </section>

      <section className="card stack gap-12">
        <b>Kundalikka qo‘shish</b>
        <div className="row wrap gap-6" role="radiogroup" aria-label="Porsiya">
          {PORTIONS.map((p) => (
            <button key={p} role="radio" aria-checked={portion === p} className={`chip sm ${portion === p ? 'on' : ''}`} onClick={() => setPortion(p)}>
              {fmtQty(p)} porsiya
            </button>
          ))}
        </div>
        <MealChips meal={meal} setMeal={(m) => setMeal(m)} />
        <button
          className={`btn btn-block ${added ? 'btn-secondary' : 'btn-primary'}`}
          disabled={added}
          onClick={() => {
            addFood({ id: uid(), date: isoDate(), meal, foodId: RECIPE_PREFIX + r.id, name: r.name, label: `${fmtQty(portion)} porsiya`, kcal: v.kcal, p: r.p * portion, f: r.f * portion, c: r.c * portion });
            setAdded(true);
          }}
        >
          {added ? (
            <>
              <Icon name="check" size={18} /> Bugungi kundalikka qo‘shildi
            </>
          ) : (
            <>
              <Icon name="plus" size={18} /> {SLOT_TO[meal]} qo‘shish · {v.kcal} kkal
            </>
          )}
        </button>
      </section>
    </div>
  );
}
