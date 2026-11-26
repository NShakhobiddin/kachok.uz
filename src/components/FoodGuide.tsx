// «Taomlar» bo‘limi: milliy taomlar kaloriyasi (porsiyada, kunlik me’yorga nisbatan) va mahsulotlar tarkibi
// (oqsil/uglevod/yog‘ — grammda va kaloriya ulushida) hamda glikemik indeks — manbalari bilan.
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { DISH_VIEWS, type DishView } from '../data/dishes';
import { foodImg } from '../data/foodImages';
import { FOOD_CATS, FOOD_DB, normalize, portion, type FoodCat, type FoodItem } from '../data/foods';
import { GI_COLOR, GI_LABEL, energySplit, giFor, giLevel, glycemicLoad } from '../data/glycemic';
import { RECIPE_MAP, fmtQty, type MealSlot } from '../data/recipes';
import type { NutritionPlan } from '../engine/nutrition';
import { isoDate } from '../lib/date';
import { useStore } from '../store/useStore';
import { MACRO_COLORS } from './charts';
import { MealChips } from './FoodDiary';
import { RecipeSheet } from './Recipes';
import { Segmented } from './ui/controls';
import { Icon } from './ui/Icon';
import { Note } from './ui/Fold';
import { Sheet } from './ui/Sheet';

const uid = () => Math.random().toString(36).slice(2, 10);
const PAGE = 15;

/** Tez yurish (~5,5 km/soat, 4,3 MET — Ainsworth 2011) bilan shuncha kaloriya necha daqiqada sarflanadi */
function walkMinutes(kcal: number, kg: number): string {
  const perMin = (4.3 * 3.5 * kg) / 200;
  const m = Math.round(kcal / perMin);
  if (m < 60) return `${m} daqiqa`;
  const h = Math.floor(m / 60);
  const r = Math.round((m % 60) / 5) * 5;
  return r ? `${h} soat ${r} daqiqa` : `${h} soat`;
}

/** Kaloriya ulushi chizig‘i: oqsil · uglevod · yog‘ */
function SplitBar({ f, height = 6 }: { f: Pick<FoodItem, 'p' | 'c' | 'f'>; height?: number }) {
  const s = energySplit(f);
  return (
    <span className="split-bar" style={{ height }} aria-hidden="true">
      <i style={{ width: `${s.p}%`, background: MACRO_COLORS.p }} />
      <i style={{ width: `${s.c}%`, background: MACRO_COLORS.c }} />
      <i style={{ width: `${s.f}%`, background: MACRO_COLORS.f }} />
    </span>
  );
}

function SplitText({ f }: { f: Pick<FoodItem, 'p' | 'c' | 'f'> }) {
  const s = energySplit(f);
  return (
    <span className="tiny num">
      <span style={{ color: MACRO_COLORS.p }}>O {s.p}%</span> · <span style={{ color: MACRO_COLORS.c }}>U {s.c}%</span> · <span style={{ color: MACRO_COLORS.f }}>Y {s.f}%</span>
    </span>
  );
}

function GiBadge({ food }: { food: FoodItem }) {
  const g = giFor(food);
  if (g.kind !== 'gi') return <span className="gi-badge none">{g.kind === 'lowcarb' ? 'GI —' : 'GI ?'}</span>;
  const lv = giLevel(g.info.gi);
  return (
    <span className="gi-badge" style={{ color: GI_COLOR[lv], borderColor: GI_COLOR[lv] }} aria-label={`Glikemik indeks ${g.info.gi}, ${GI_LABEL[lv]}`}>
      GI {g.info.gi}
    </span>
  );
}

function Thumb({ id, icon }: { id: string; icon: string }) {
  const src = foodImg(id);
  return src ? <img className="recipe-ico food-img" src={src} alt="" loading="lazy" /> : <span className="recipe-ico" aria-hidden="true">{icon}</span>;
}

export function FoodGuide({ np }: { np: NutritionPlan }) {
  const [view, setView] = useState<'dishes' | 'products'>('dishes');
  return (
    <div className="stack gap-12">
      <Segmented
        label="Ma’lumotnoma"
        value={view}
        onChange={setView}
        options={[
          { value: 'dishes', label: 'Milliy taomlar' },
          { value: 'products', label: 'Mahsulotlar va GI' },
        ]}
      />
      {view === 'dishes' ? <DishList np={np} /> : <ProductList />}
    </div>
  );
}

/* ---------------- Milliy taomlar ---------------- */

type DishSort = 'popular' | 'light' | 'protein';

function DishList({ np }: { np: NutritionPlan }) {
  const [q, setQ] = useState('');
  const [sort, setSort] = useState<DishSort>('popular');
  const [shown, setShown] = useState(PAGE);
  const [open, setOpen] = useState<DishView | null>(null);
  const list = useMemo(() => {
    const n = normalize(q);
    const xs = DISH_VIEWS.filter((d) => !n || normalize(`${d.food.name} ${d.food.alt ?? ''}`).includes(n));
    // yengillik — energiya zichligi (100 g dagi kaloriya), porsiya kattaligiga bog‘liq emas
    if (sort === 'light') return [...xs].sort((a, b) => a.food.kcal - b.food.kcal);
    if (sort === 'protein') return [...xs].sort((a, b) => b.p / Math.max(1, b.kcal) - a.p / Math.max(1, a.kcal));
    return xs;
  }, [q, sort]);
  return (
    <div className="stack gap-12">
      <p className="small muted">Bir porsiya kaloriyasi va u kunlik me’yoringiz ({np.kcal} kkal) ning qancha qismi. Bosing — tarkibi, yengil varianti va kundalikka qo‘shish.</p>
      <div style={{ position: 'relative' }}>
        <Icon name="search" size={18} style={{ position: 'absolute', left: 14, top: 16, color: 'var(--text-3)' }} />
        <input className="input" style={{ paddingLeft: 40 }} placeholder="Osh, somsa, manti…" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Taom qidirish" />
      </div>
      <div className="row wrap gap-6" role="radiogroup" aria-label="Tartib">
        {(
          [
            ['popular', 'Ommabop'],
            ['light', 'Eng yengil'],
            ['protein', 'Oqsilga boy'],
          ] as [DishSort, string][]
        ).map(([k, l]) => (
          <button key={k} role="radio" aria-checked={sort === k} className={`chip sm ${sort === k ? 'on' : ''}`} onClick={() => setSort(k)}>
            {l}
          </button>
        ))}
      </div>
      <div className="card flush" style={{ padding: '0 14px' }}>
        {list.slice(0, shown).map((d) => {
          const share = d.kcal / np.kcal;
          return (
            <button key={d.id} className="recipe-row" onClick={() => setOpen(d)}>
              <Thumb id={d.id} icon={d.icon} />
              <span className="grow stack" style={{ gap: 3, minWidth: 0, textAlign: 'left' }}>
                <span className="small strong ellipsis">{d.food.name}</span>
                <span className="tiny muted num ellipsis">
                  1 {d.unit.name} · {d.unit.g} g · O {d.p} g
                </span>
                <span className="share-bar" aria-hidden="true">
                  <i style={{ width: `${Math.min(100, share * 100)}%`, background: share > 0.35 ? 'var(--yellow)' : 'var(--accent)' }} />
                </span>
              </span>
              <span className="stack" style={{ gap: 0, alignItems: 'flex-end', flex: 'none' }}>
                <b className="num">{d.kcal}</b>
                <span className="tiny faint num">kunning {Math.round(share * 100)}%</span>
              </span>
            </button>
          );
        })}
        {!list.length && <p className="small muted" style={{ padding: '14px 0' }}>Topilmadi</p>}
      </div>
      {list.length > shown && (
        <button className="btn btn-secondary btn-sm" style={{ alignSelf: 'center' }} onClick={() => setShown(shown + PAGE)}>
          Yana {Math.min(PAGE, list.length - shown)} ta
        </button>
      )}
      <Note>Qiymatlar an’anaviy retseptlar bo‘yicha o‘rtacha (oshxonaga qarab ±20%): mahsulotlar tarkibi — USDA FoodData Central. Taqiq yo‘q — faqat hisob bor.</Note>
      <DishSheet dish={open} np={np} onClose={() => setOpen(null)} />
    </div>
  );
}

function DishSheet({ dish, np, onClose }: { dish: DishView | null; np: NutritionPlan; onClose: () => void }) {
  return (
    <Sheet open={!!dish} onClose={onClose} label={dish?.food.name ?? 'Taom'}>
      {dish && <DishBody key={dish.id} d={dish} np={np} />}
    </Sheet>
  );
}

const PORTIONS = [0.5, 1, 1.5, 2];

function DishBody({ d, np }: { d: DishView; np: NutritionPlan }) {
  const kg = useStore((s) => s.profile?.weightKg ?? 75);
  const addFood = useStore((s) => s.addFood);
  const [k, setK] = useState(1);
  const [meal, setMeal] = useState<MealSlot>(new Date().getHours() < 11 ? 0 : new Date().getHours() < 16 ? 1 : 2);
  const [added, setAdded] = useState(false);
  const [recipe, setRecipe] = useState(false);
  const g = Math.round(d.unit.g * k);
  const v = portion(d.food, g);
  const light = d.light ? RECIPE_MAP[d.light] : null;
  const share = v.kcal / np.kcal;
  return (
    <div className="stack gap-16">
      <div className="row gap-12">
        <Thumb id={d.id} icon={d.icon} />
        <div className="stack" style={{ gap: 2 }}>
          <h3 className="title">{d.food.name}</h3>
          <span className="tiny muted">
            {fmtQty(k)} {d.unit.name} · {g} g
          </span>
        </div>
      </div>

      <div className="card tight stack gap-10">
        <div className="row between" style={{ alignItems: 'flex-end' }}>
          <span className="num" style={{ fontSize: 30, fontWeight: 800 }}>
            {v.kcal} <span className="small muted">kkal</span>
          </span>
          <span className="small num" style={{ textAlign: 'right' }}>
            <span style={{ color: MACRO_COLORS.p }}>O {Math.round(v.p)} g</span>
            <br />
            <span style={{ color: MACRO_COLORS.c }}>U {Math.round(v.c)} g</span> · <span style={{ color: MACRO_COLORS.f }}>Y {Math.round(v.f)} g</span>
          </span>
        </div>
        <SplitBar f={d.food} height={8} />
        <span className="tiny muted">
          Kaloriya ulushi: <SplitText f={d.food} />
        </span>
      </div>

      <div className="stack gap-6">
        <div className="row between small">
          <span className="muted">Kunlik me’yoringizdan</span>
          <b className="num">{Math.round(share * 100)}%</b>
        </div>
        <span className="share-bar" style={{ height: 8 }} aria-hidden="true">
          <i style={{ width: `${Math.min(100, share * 100)}%`, background: share > 0.35 ? 'var(--yellow)' : 'var(--accent)' }} />
        </span>
        <span className="tiny muted row gap-6">
          <Icon name="flame" size={14} /> Shuncha energiya — taxminan {walkMinutes(v.kcal, kg)} tez yurish
        </span>
      </div>

      <div className="notice info">
        <Icon name="info" />
        <span>{d.tip}</span>
      </div>

      {light && (
        <button className="card tight row gap-12" style={{ textAlign: 'left', width: '100%' }} onClick={() => setRecipe(true)}>
          <span className="recipe-ico" aria-hidden="true">
            {light.icon}
          </span>
          <span className="grow stack" style={{ gap: 2, minWidth: 0 }}>
            <span className="tiny" style={{ color: 'var(--accent)' }}>
              Yengil varianti — retsept
            </span>
            <span className="small strong ellipsis">{light.name}</span>
            <span className="tiny muted num">
              {light.kcal} kkal · O {Math.round(light.p)} g
            </span>
          </span>
          <Icon name="right" size={16} style={{ color: 'var(--text-3)', flex: 'none' }} />
        </button>
      )}

      <section className="card stack gap-12">
        <b>Kundalikka qo‘shish</b>
        <div className="row wrap gap-6" role="radiogroup" aria-label="Porsiya">
          {PORTIONS.map((p) => (
            <button key={p} role="radio" aria-checked={k === p} className={`chip sm ${k === p ? 'on' : ''}`} onClick={() => setK(p)}>
              {fmtQty(p)} {d.unit.name}
            </button>
          ))}
        </div>
        <MealChips meal={meal} setMeal={setMeal} />
        <button
          className={`btn btn-block ${added ? 'btn-secondary' : 'btn-primary'}`}
          disabled={added}
          onClick={() => {
            addFood({ id: uid(), date: isoDate(), meal, foodId: d.id, name: d.food.name, g, label: `${fmtQty(k)} ${d.unit.name}`, ...v });
            setAdded(true);
          }}
        >
          {added ? (
            <>
              <Icon name="check" size={18} /> Bugungi kundalikka qo‘shildi
            </>
          ) : (
            <>
              <Icon name="plus" size={18} /> Qo‘shish · {v.kcal} kkal
            </>
          )}
        </button>
      </section>
      {light && <RecipeSheet recipe={recipe ? light : null} meal={meal} onClose={() => setRecipe(false)} />}
    </div>
  );
}

/* ---------------- Mahsulotlar: tarkib va GI ---------------- */

type ProdSort = 'name' | 'protein' | 'kcal' | 'gi';
const PROD_CATS = (Object.keys(FOOD_CATS) as FoodCat[]).filter((c) => c !== 'recipe' && c !== 'dish');
const PRODUCTS = FOOD_DB.filter((f) => f.cat !== 'dish');

function ProductList() {
  const [q, setQ] = useState('');
  const [cat, setCat] = useState<FoodCat | 'all'>('all');
  const [sort, setSort] = useState<ProdSort>('name');
  const [shown, setShown] = useState(PAGE);
  const [open, setOpen] = useState<FoodItem | null>(null);
  const [gi, setGi] = useState(false);
  const list = useMemo(() => {
    const n = normalize(q);
    const xs = PRODUCTS.filter((f) => (cat === 'all' || f.cat === cat) && (!n || normalize(`${f.name} ${f.alt ?? ''}`).includes(n)));
    if (sort === 'protein') return [...xs].sort((a, b) => b.p / Math.max(1, b.kcal) - a.p / Math.max(1, a.kcal));
    if (sort === 'kcal') return [...xs].sort((a, b) => a.kcal - b.kcal);
    if (sort === 'gi') {
      const v = (f: FoodItem) => {
        const g = giFor(f);
        // avval GI li mahsulotlar (pastdan), keyin uglevodsizlar, oxirida GI noma’lumlar
        return g.kind === 'gi' ? g.info.gi : g.kind === 'lowcarb' ? 500 : 999;
      };
      return [...xs].sort((a, b) => v(a) - v(b));
    }
    return xs;
  }, [q, cat, sort]);
  return (
    <div className="stack gap-12">
      <p className="small muted">100 g dagi tarkib va kaloriyaning qaysi qismi oqsil, uglevod va yog‘dan kelishi. GI — uglevodli mahsulot qondagi qandni qanchalik tez oshirishi.</p>
      <button className="card tight row gap-10" style={{ textAlign: 'left', width: '100%' }} onClick={() => setGi(true)}>
        <span className="row gap-6" style={{ flex: 'none' }}>
          {(['low', 'mid', 'high'] as const).map((l) => (
            <i key={l} className="dot" style={{ background: GI_COLOR[l], width: 10, height: 10 }} />
          ))}
        </span>
        <span className="grow small">
          <b>Glikemik indeks nima?</b> <span className="muted">past ≤ 55 · o‘rta 56–69 · yuqori ≥ 70</span>
        </span>
        <Icon name="right" size={16} style={{ color: 'var(--text-3)', flex: 'none' }} />
      </button>
      <div style={{ position: 'relative' }}>
        <Icon name="search" size={18} style={{ position: 'absolute', left: 14, top: 16, color: 'var(--text-3)' }} />
        <input className="input" style={{ paddingLeft: 40 }} placeholder="Guruch, tovuq, olma…" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Mahsulot qidirish" />
      </div>
      <div className="hscroll" role="radiogroup" aria-label="Turkum">
        {(['all', ...PROD_CATS] as (FoodCat | 'all')[]).map((c) => (
          <button key={c} role="radio" aria-checked={cat === c} className={`chip ${cat === c ? 'on' : ''}`} onClick={() => setCat(c)}>
            {c === 'all' ? 'Hammasi' : FOOD_CATS[c]}
          </button>
        ))}
      </div>
      <div className="row wrap gap-6" role="radiogroup" aria-label="Tartib">
        {(
          [
            ['name', 'Turkum bo‘yicha'],
            ['protein', 'Oqsil / kaloriya'],
            ['kcal', 'Kaloriya kam'],
            ['gi', 'GI past'],
          ] as [ProdSort, string][]
        ).map(([k, l]) => (
          <button key={k} role="radio" aria-checked={sort === k} className={`chip sm ${sort === k ? 'on' : ''}`} onClick={() => setSort(k)}>
            {l}
          </button>
        ))}
      </div>
      <div className="card flush" style={{ padding: '0 14px' }}>
        {list.slice(0, shown).map((f) => (
          <button key={f.id} className="recipe-row" onClick={() => setOpen(f)}>
            <span className="grow stack" style={{ gap: 4, minWidth: 0, textAlign: 'left' }}>
              <span className="small strong ellipsis">{f.name}</span>
              <SplitBar f={f} />
              <span className="row between gap-8">
                <SplitText f={f} />
                <span className="tiny faint num">{f.kcal} kkal / 100 g</span>
              </span>
            </span>
            <GiBadge food={f} />
          </button>
        ))}
        {!list.length && <p className="small muted" style={{ padding: '14px 0' }}>Topilmadi</p>}
      </div>
      {list.length > shown && (
        <button className="btn btn-secondary btn-sm" style={{ alignSelf: 'center' }} onClick={() => setShown(shown + PAGE)}>
          Yana {Math.min(PAGE, list.length - shown)} ta
        </button>
      )}
      <Note label="Manbalar">
        Tarkib (100 g): USDA FoodData Central. GI: Atkinson, Foster-Powell, Brand-Miller — «International tables of glycemic index and glycemic load values», Diabetes Care, 2008 (glyukoza = 100). Toifalar: ISO 26642:2010.{' '}
        <Link to="/sources" className="strong" style={{ color: 'var(--blue-2)' }}>
          Barcha manbalar
        </Link>
      </Note>
      <ProductSheet food={open} onClose={() => setOpen(null)} />
      <GiSheet open={gi} onClose={() => setGi(false)} />
    </div>
  );
}

function ProductSheet({ food, onClose }: { food: FoodItem | null; onClose: () => void }) {
  return (
    <Sheet open={!!food} onClose={onClose} label={food?.name ?? 'Mahsulot'}>
      {food && <ProductBody key={food.id} f={food} />}
    </Sheet>
  );
}

function ProductBody({ f }: { f: FoodItem }) {
  const unit = f.units?.[0];
  const pv = unit ? portion(f, unit.g) : null;
  const g = giFor(f);
  const r1 = (n: number) => Math.round(n * 10) / 10;
  return (
    <div className="stack gap-16">
      <div>
        <span className="eyebrow">{FOOD_CATS[f.cat]}</span>
        <h3 className="title mt-4">{f.name}</h3>
      </div>
      <div className="card tight stack gap-10">
        <div className="row between">
          <span className="small muted">100 g da</span>
          <b className="num">{f.kcal} kkal</b>
        </div>
        <div className="grid-3 small num">
          <span style={{ color: MACRO_COLORS.p }}>
            Oqsil
            <br />
            <b>{r1(f.p)} g</b>
          </span>
          <span style={{ color: MACRO_COLORS.c }}>
            Uglevod
            <br />
            <b>{r1(f.c)} g</b>
          </span>
          <span style={{ color: MACRO_COLORS.f }}>
            Yog‘
            <br />
            <b>{r1(f.f)} g</b>
          </span>
        </div>
        <SplitBar f={f} height={8} />
        <span className="tiny muted">
          Kaloriya ulushi: <SplitText f={f} />
        </span>
        {pv && unit && (
          <span className="tiny muted num">
            1 {unit.name} ({unit.g} g): {pv.kcal} kkal · O {pv.p} · U {pv.c} · Y {pv.f} g
          </span>
        )}
      </div>

      <div className="card tight stack gap-8">
        <b className="small">Glikemik indeks</b>
        {g.kind === 'gi' ? (
          <>
            <div className="row gap-10">
              <span className="num" style={{ fontSize: 28, fontWeight: 800, color: GI_COLOR[giLevel(g.info.gi)] }}>{g.info.gi}</span>
              <span className="small">
                <b style={{ color: GI_COLOR[giLevel(g.info.gi)] }}>{GI_LABEL[giLevel(g.info.gi)]}</b>
                <span className="muted"> · ±{g.info.sem}{g.info.as ? ` · jadvalda: ${g.info.as}` : ''}</span>
              </span>
            </div>
            {pv && unit && (
              <span className="small muted">
                {(() => {
                  const gl = glycemicLoad(g.info.gi, pv.c);
                  return (
                    <>
                      Glikemik yuk (1 {unit.name}): <b style={{ color: GI_COLOR[gl.level] }}>{gl.gl}</b> — {GI_LABEL[gl.level]}. GY porsiya hajmini ham hisobga oladi.
                    </>
                  );
                })()}
              </span>
            )}
          </>
        ) : g.kind === 'lowcarb' ? (
          <span className="small muted">Uglevod juda kam (100 g da {r1(f.c)} g) — qondagi qandni deyarli oshirmaydi, GI qo‘llanilmaydi.</span>
        ) : (
          <span className="small muted">Bu mahsulot xalqaro GI jadvalining umumiy ro‘yxatida yo‘q — taxminiy raqam yozmaymiz.</span>
        )}
      </div>
      <p className="tiny faint">Manba: tarkib — USDA FoodData Central; GI — Atkinson va boshq., Diabetes Care 2008.</p>
    </div>
  );
}

function GiSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Sheet open={open} onClose={onClose} label="Glikemik indeks">
      <div className="stack gap-12">
        <h3 className="title">Glikemik indeks (GI)</h3>
        <p className="small">Uglevodli mahsulot yeyilgandan keyin 2 soat ichida qondagi qand qanchalik ko‘tarilishini sof glyukoza (= 100) bilan solishtiradi.</p>
        <div className="stack gap-6">
          {(
            [
              ['low', 'Past — 55 va kam', 'qand sekin va bir tekis ko‘tariladi: dukkaklilar, olma, sut, makaron'],
              ['mid', 'O‘rta — 56–69', 'asal, shakar, kartoshka fri'],
              ['high', 'Yuqori — 70 va ko‘p', 'qand tez ko‘tariladi: oq non, oq guruch, qaynatilgan kartoshka, tarvuz'],
            ] as const
          ).map(([l, t, d]) => (
            <div key={l} className="row gap-10" style={{ alignItems: 'flex-start' }}>
              <i className="dot" style={{ background: GI_COLOR[l], width: 12, height: 12, marginTop: 4, flex: 'none' }} />
              <span className="small">
                <b>{t}</b> <span className="muted">— {d}</span>
              </span>
            </div>
          ))}
        </div>
        <p className="small">
          <b>Glikemik yuk (GY)</b> porsiyani ham hisobga oladi: GI × uglevod (g) / 100. Masalan, tarvuzning GI si yuqori (76), lekin 150 g bo‘lakda uglevod atigi ~11 g — GY 9, ya’ni past.
        </p>
        <div className="notice good">
          <Icon name="check" />
          <span className="small">
            Qiziq fakt: to‘liq donli (qora) bug‘doy noni GI si oq nondan deyarli farq qilmaydi (74 va 75). Uning foydasi — tola va to‘qlikda, GI da emas.
          </span>
        </div>
        <p className="small muted">
          Amalda: uglevodni oqsil, yog‘ yoki sabzavot bilan birga yeng — qand sekinroq ko‘tariladi. Go‘sht, tuxum, yog‘ va pishloqda uglevod deyarli yo‘q — ularga GI qo‘llanilmaydi. Qandli diabetda ovqatlanishni shifokor bilan rejalang.
        </p>
        <p className="tiny faint">Manba: Atkinson FS, Foster-Powell K, Brand-Miller JC. Diabetes Care 2008;31:2281–3 (doi 10.2337/dc08-1239); ISO 26642:2010.</p>
      </div>
    </Sheet>
  );
}
