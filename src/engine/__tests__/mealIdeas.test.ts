// Retseptlar bazasi va kunlik ovqat tavsiyasi.
import { describe, expect, it } from 'vitest';
import { FOOD_DB } from '../../data/foods';
import { RECIPES, RECIPE_FOODS, ingredientLine, fmtQty } from '../../data/recipes';
import { mealIdeas, nextSlot } from '../mealIdeas';

const PREFS = { noPork: false, lactoseFree: false, vegetarian: false };
const NP = { kcal: 2400, protein: 150 };
const base = { np: NP, prefs: PREFS, seed: '2026-11-26' };

describe('Retseptlar bazasi', () => {
  it('id va nomlar takrorlanmaydi, har birida masalliq, bosqich va mahal bor', () => {
    expect(new Set(RECIPES.map((r) => r.id)).size).toBe(RECIPES.length);
    expect(new Set(RECIPES.map((r) => r.name)).size).toBe(RECIPES.length);
    for (const r of RECIPES) {
      expect(r.steps.length, r.id).toBeGreaterThan(0);
      expect(r.meals.length, r.id).toBeGreaterThan(0);
      expect(r.ing.some((i) => 'id' in i), r.id).toBe(true);
    }
  });

  it('1 porsiya kaloriyasi va makrolari mantiqiy (Atwater ±15%)', () => {
    for (const r of RECIPES) {
      expect(r.kcal, r.id).toBeGreaterThan(80);
      expect(r.kcal, r.id).toBeLessThan(750);
      const atwater = r.p * 4 + r.c * 4 + r.f * 9;
      expect(Math.abs(atwater - r.kcal) / r.kcal, r.id).toBeLessThan(0.15);
    }
  });

  it('teglar masalliqlardan: go‘shtli taom go‘shtsiz emas, qatiqli — sutsiz emas', () => {
    const by = Object.fromEntries(RECIPES.map((r) => [r.id, r]));
    expect(by['chicken-buckwheat'].meatFree).toBe(false);
    expect(by['omelet-tomato'].meatFree).toBe(true); // tuxum — go‘sht emas
    expect(by['mastava-light'].dairyFree).toBe(false);
    expect(by['dimlama'].dairyFree).toBe(true);
    expect(by['herb-tvorog'].protein).toBe(true);
    // har bir mahalga go‘shtsiz va sutsiz variant bor
    for (const s of [0, 1, 2, 3] as const) expect(RECIPES.some((r) => r.meals.includes(s) && r.meatFree && r.dairyFree), `mahal ${s}`).toBe(true);
  });

  it('kundalikda porsiya bilan qo‘shiladi (id lar bazaga to‘qnashmaydi)', () => {
    const ids = new Set(FOOD_DB.map((f) => f.id));
    for (const f of RECIPE_FOODS) {
      expect(ids.has(f.id)).toBe(false);
      expect(f.noGram).toBe(true);
      expect(f.units).toEqual([{ name: 'porsiya', g: 100 }]);
    }
  });

  it('masalliq miqdori kishi soniga ko‘paytiriladi, qoshiq va dona tushunarli', () => {
    const plov = RECIPES.find((r) => r.id === 'light-plov')!;
    const oil = plov.ing.find((i) => 'id' in i && i.id === 'oil')!;
    expect(ingredientLine(oil, 1).amount).toBe('2 choy qoshiq');
    expect(ingredientLine(oil, 4).amount).toBe('3 osh qoshiq');
    const omelet = RECIPES.find((r) => r.id === 'omelet-tomato')!;
    expect(ingredientLine(omelet.ing[0], 1)).toEqual({ name: 'Tuxum', amount: '3 dona' });
    expect(ingredientLine(omelet.ing[0], 2).amount).toBe('6 dona');
    const rice = plov.ing[0];
    expect(ingredientLine(rice, 4).amount).toBe('280 g (quruq)');
    expect(fmtQty(1.5)).toBe('1½');
    expect(fmtQty(0.5)).toBe('½');
    expect(fmtQty(2)).toBe('2');
  });
});

describe('Navbatdagi ovqat mahali', () => {
  it('soatga qarab; yozilgan mahal o‘tkazib yuboriladi', () => {
    expect(nextSlot(8, new Set())).toBe(0);
    expect(nextSlot(8, new Set([0]))).toBe(1);
    expect(nextSlot(13, new Set())).toBe(1);
    expect(nextSlot(13, new Set([1]))).toBe(2);
    expect(nextSlot(19, new Set([2]))).toBe(3);
    expect(nextSlot(23, new Set())).toBe(3);
  });
});

describe('Kunlik tavsiya', () => {
  it('ertalab — nonushta, porsiya mo‘ljalga yaqin', () => {
    const s = mealIdeas({ ...base, today: [], hour: 8 });
    expect(s.slot).toBe(0);
    expect(s.mode).toBe('normal');
    expect(s.picks).toHaveLength(3);
    for (const x of s.picks) {
      expect(x.recipe.meals).toContain(0);
      expect(Math.abs(x.kcal - s.kcal) / s.kcal).toBeLessThan(0.3);
    }
  });

  it('kechki ovqat mo‘ljali qolgan kaloriya va oqsildan', () => {
    const s = mealIdeas({ ...base, today: [{ meal: 0, kcal: 500, p: 30 }, { meal: 1, kcal: 800, p: 40 }], hour: 19 });
    expect(s.slot).toBe(2);
    expect(s.kcalLeft).toBe(1100);
    // kechki 0.3 / (0.3 + tamaddi 0.1) = 75%
    expect(s.kcal).toBe(825);
    expect(s.protein).toBe(60);
    expect(s.picks.every((x) => x.p >= 30)).toBe(true);
  });

  it('kaloriya tugaganda — faqat yengil (~150 kkal) variantlar', () => {
    const s = mealIdeas({ ...base, today: [{ meal: 0, kcal: 900, p: 40 }, { meal: 1, kcal: 1100, p: 50 }, { meal: 2, kcal: 450, p: 30 }], hour: 21 });
    expect(s.mode).toBe('over');
    expect(s.kcalLeft).toBe(-50);
    for (const x of s.picks) expect(x.kcal).toBeLessThanOrEqual(220);
  });

  it('cheklovlar: go‘shtsiz va sutsiz bo‘lsa ham 3 ta variant', () => {
    const s = mealIdeas({ ...base, prefs: { noPork: false, vegetarian: true, lactoseFree: true }, today: [], hour: 13 });
    expect(s.picks).toHaveLength(3);
    for (const x of s.picks) {
      expect(x.recipe.meatFree).toBe(true);
      expect(x.recipe.dairyFree).toBe(true);
    }
  });

  it('kecha yeyilgan retsept birinchi taklif qilinmaydi; "boshqa variantlar" ro‘yxatni almashtiradi', () => {
    const a = mealIdeas({ ...base, today: [], hour: 13 });
    const b = mealIdeas({ ...base, today: [], hour: 13, recent: ['rcp-' + a.picks[0].recipe.id] });
    expect(b.picks[0].recipe.id).not.toBe(a.picks[0].recipe.id);
    const seen = new Set<string>();
    for (let i = 0; i < 4; i++) for (const x of mealIdeas({ ...base, seed: `${base.seed}:${i}`, today: [], hour: 13 }).picks) seen.add(x.recipe.id);
    expect(seen.size).toBeGreaterThan(4);
  });

  it('mashg‘ulotdan keyin — tiklanish sababi ko‘rsatiladi', () => {
    const s = mealIdeas({ ...base, today: [{ meal: 0, kcal: 500, p: 30 }], hour: 13, trained: true });
    expect(s.picks.some((x) => x.why === 'Mashg‘ulotdan keyin tiklanish uchun')).toBe(true);
  });
});
