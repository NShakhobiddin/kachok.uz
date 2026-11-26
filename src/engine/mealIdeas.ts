// Kunlik ovqat tavsiyasi: bugun yeyilgani va kunlik maqsaddan qolgan kaloriya/oqsilga qarab,
// navbatdagi ovqat mahali uchun 3 ta retsept (porsiyasi moslab). Cheklovlar (go‘shtsiz, sutsiz) hisobga olinadi,
// so‘nggi kunlarda yeyilganlar kamroq taklif qilinadi, tanlov har kuni biroz almashadi.
import { RECIPES, RECIPE_PREFIX, type MealSlot, type RecipeInfo } from '../data/recipes';
import type { FoodEntry, Profile } from '../types';

/** mahallarning kunlik ulushi: nonushta · tushlik · kechki · tamaddi */
const SHARE = [0.25, 0.35, 0.3, 0.1];
const SERVINGS = [0.5, 0.75, 1, 1.25, 1.5];

export type IdeaMode = 'normal' | 'light' | 'over';

export interface MealPick {
  recipe: RecipeInfo;
  servings: number;
  kcal: number;
  p: number;
  f: number;
  c: number;
  why?: string;
}

export interface MealIdeas {
  slot: MealSlot;
  mode: IdeaMode;
  /** shu mahal uchun mo‘ljal */
  kcal: number;
  protein: number;
  /** kun bo‘yi qolgani */
  kcalLeft: number;
  proteinLeft: number;
  picks: MealPick[];
}

export interface MealIdeasInput {
  np: { kcal: number; protein: number };
  /** bugungi kundalik yozuvlari */
  today: Pick<FoodEntry, 'meal' | 'kcal' | 'p' | 'foodId'>[];
  /** so‘nggi 3 kunda yeyilgan retseptlar (foodId) — takrorlamaslik uchun */
  recent?: (string | undefined)[];
  hour: number;
  prefs: Profile['dietPrefs'];
  /** kun kaliti (YYYY-MM-DD) — tanlov kun sayin almashadi; "boshqa variantlar" uchun +n */
  seed: string;
  /** bugun mashg‘ulot qilingan */
  trained?: boolean;
}

/** soat va yozilgan mahallarga qarab navbatdagi mahal */
export function nextSlot(hour: number, eaten: Set<number>): MealSlot {
  let s: MealSlot = hour < 11 ? 0 : hour < 16 ? 1 : hour < 22 ? 2 : 3;
  while (s < 2 && eaten.has(s)) s = (s + 1) as MealSlot;
  if (s === 2 && eaten.has(2)) s = 3;
  return s;
}

/** satrdan barqaror 0..1 son (kunlik almashinuv uchun) */
function hash01(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return ((h >>> 0) % 10000) / 10000;
}

const sum = (xs: { kcal: number; p: number }[]) => xs.reduce((a, e) => ({ kcal: a.kcal + e.kcal, p: a.p + e.p }), { kcal: 0, p: 0 });

export function mealIdeas(input: MealIdeasInput): MealIdeas {
  const { np, today, hour, prefs, seed } = input;
  const eaten = sum(today);
  const kcalLeft = Math.round(np.kcal - eaten.kcal);
  const proteinLeft = Math.max(0, Math.round(np.protein - eaten.p));
  const logged = new Set<number>(today.map((e) => e.meal));
  const slot = nextSlot(hour, logged);
  // qolgan mahallar (shu mahaldan kechki ovqatgacha, yozilmaganlari) + tamaddi
  const rest = [0, 1, 2].filter((s) => s >= slot && !logged.has(s));
  const shares = rest.reduce((a, s) => a + SHARE[s], 0) + SHARE[3];
  const ratio = slot === 3 ? 1 : SHARE[slot] / shares;

  const mode: IdeaMode = kcalLeft <= 120 ? 'over' : kcalLeft < 300 ? 'light' : 'normal';
  let kcal = mode === 'normal' ? Math.round(kcalLeft * ratio) : Math.max(120, kcalLeft);
  if (mode === 'normal') kcal = slot === 3 ? Math.min(kcal, 400) : Math.max(300, Math.min(kcal, 1000));
  if (mode === 'over') kcal = 150;
  const protein = Math.round(slot === 3 ? Math.min(proteinLeft, 30) : proteinLeft * ratio);

  const recent = new Set((input.recent ?? []).filter((x): x is string => !!x && x.startsWith(RECIPE_PREFIX)).map((x) => x.slice(RECIPE_PREFIX.length)));
  const allowed = RECIPES.filter((r) => (!prefs.vegetarian || r.meatFree) && (!prefs.lactoseFree || r.dairyFree));
  let pool = allowed.filter((r) => (mode === 'normal' ? r.meals.includes(slot) : r.light || r.kcal * 0.5 <= kcal * 1.2));
  // cheklovlar ko‘p bo‘lsa — boshqa mahallarning asosiy taomlari ham (masalan, tushlikka omlet)
  if (pool.length < 3 && mode === 'normal') pool = allowed.filter((r) => (slot === 3 ? r.meals.includes(3) || r.kcal <= 400 : r.meals.some((m) => m !== 3)));

  const scored = pool.map((r) => {
    // porsiya: mo‘ljalga eng yaqini (tamaddi va yengil rejimda 1 dan oshmaydi)
    const opts = SERVINGS.filter((s) => (slot === 3 || mode !== 'normal' ? s <= 1 : s >= 0.75));
    const servings = opts.reduce((best, s) => (Math.abs(r.kcal * s - kcal) < Math.abs(r.kcal * best - kcal) ? s : best), opts[0]);
    const k = r.kcal * servings;
    const p = r.p * servings;
    const kErr = Math.abs(k - kcal) / Math.max(kcal, 150);
    const pShort = protein > 0 ? Math.max(0, protein - p) / Math.max(protein, 20) : 0;
    // porsiyani 1 dan uzoqlashtirish — oxirgi chora (1.5 porsiya omlet = 4–5 tuxum)
    const score = kErr + 1.2 * pShort + 0.2 * Math.abs(servings - 1) + (recent.has(r.id) ? 0.35 : 0) + hash01(seed + r.id) * 0.25;
    return { r, servings, k, p, score };
  });
  scored.sort((a, b) => a.score - b.score);

  const picks: MealPick[] = [];
  const icons = new Set<string>();
  for (const x of scored) {
    if (picks.length === 3) break;
    // bir xil turdagi taomlar ketma-ket chiqmasin (masalan, ikkita salat)
    if (icons.has(x.r.icon) && scored.length > 4) continue;
    icons.add(x.r.icon);
    picks.push({ recipe: x.r, servings: x.servings, kcal: Math.round(x.k), p: Math.round(x.p), f: Math.round(x.r.f * x.servings), c: Math.round(x.r.c * x.servings) });
  }
  // har variantda bitta ajralib turadigan sabab (raqamlar kartada ko‘rinadi — takrorlamaymiz)
  const maxP = Math.max(0, ...picks.map((x) => x.p));
  for (const x of picks)
    x.why =
      input.trained && x.c >= 40 && x.p >= 25
        ? 'Mashg‘ulotdan keyin tiklanish uchun'
        : x.recipe.quick
          ? `Tez: ${x.recipe.min} daqiqa`
          : picks.length > 1 && x.p === maxP && x.p >= 25
            ? 'Eng ko‘p oqsil'
            : undefined;
  return { slot, mode, kcal, protein, kcalLeft, proteinLeft, picks };
}
