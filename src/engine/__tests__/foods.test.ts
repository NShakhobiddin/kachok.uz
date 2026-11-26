// Ovqat ma’lumotnomasi: mahsulotlar va milliy taomlar tarkibi, glikemik indeks.
import { describe, expect, it } from 'vitest';
import { DISHES, DISH_VIEWS } from '../../data/dishes';
import { FOOD_DB, FOOD_MAP } from '../../data/foods';
import { GI, LOW_CARB, energySplit, giFor, giLevel, glycemicLoad } from '../../data/glycemic';
import { RECIPE_MAP } from '../../data/recipes';

describe('Mahsulotlar bazasi', () => {
  it('id lar takrorlanmaydi; kaloriya makrolarga mos (Atwater ±20%)', () => {
    expect(new Set(FOOD_DB.map((f) => f.id)).size).toBe(FOOD_DB.length);
    for (const f of FOOD_DB) {
      const atw = f.p * 4 + f.c * 4 + f.f * 9;
      if (f.kcal < 20) continue; // choy, bodring — juda kichik sonlarda nisbat ma’nosiz
      expect(Math.abs(atw - f.kcal) / f.kcal, f.id).toBeLessThan(0.2);
    }
  });

  it('kaloriya ulushi yig‘indisi 100%', () => {
    for (const f of FOOD_DB) {
      const s = energySplit(f);
      if (f.p + f.c + f.f === 0) continue;
      expect(s.p + s.c + s.f, f.id).toBe(100);
    }
    expect(energySplit(FOOD_MAP['chicken-breast']).p).toBeGreaterThan(70);
    expect(energySplit(FOOD_MAP['oil']).f).toBe(100);
  });
});

describe('Milliy taomlar', () => {
  it('kamida 50 ta, hammasi bazada, takrorsiz; yengil retseptlar mavjud', () => {
    expect(DISHES.length).toBeGreaterThanOrEqual(50);
    expect(new Set(DISHES.map((d) => d.id)).size).toBe(DISHES.length);
    for (const d of DISHES) {
      expect(FOOD_MAP[d.id], d.id).toBeTruthy();
      if (d.light) expect(RECIPE_MAP[d.light], d.light).toBeTruthy();
      expect(d.tip.length, d.id).toBeGreaterThan(15);
    }
    // bazadagi har bir milliy taom ma’lumotnomada bor
    for (const f of FOOD_DB.filter((x) => x.cat === 'dish')) expect(DISHES.some((d) => d.id === f.id), f.id).toBe(true);
  });

  it('porsiya kaloriyasi birinchi o‘lchovdan: osh likopchasi ~800 kkal', () => {
    const osh = DISH_VIEWS.find((d) => d.id === 'osh')!;
    expect(osh.unit.g).toBe(350);
    expect(osh.kcal).toBeGreaterThan(750);
    expect(osh.kcal).toBeLessThan(850);
  });
});

describe('Glikemik indeks', () => {
  it('faqat bazadagi uglevodli mahsulotlar uchun, qiymatlar 10–110', () => {
    for (const [id, g] of Object.entries(GI)) {
      const f = FOOD_MAP[id];
      expect(f, id).toBeTruthy();
      expect(g.gi).toBeGreaterThanOrEqual(10);
      expect(g.gi).toBeLessThanOrEqual(110);
      expect(f.c, id).toBeGreaterThanOrEqual(LOW_CARB - 1); // sut (4.7 g) — GI o‘lchangan
    }
  });

  it('toifalar ISO 26642 bo‘yicha', () => {
    expect(giLevel(55)).toBe('low');
    expect(giLevel(56)).toBe('mid');
    expect(giLevel(69)).toBe('mid');
    expect(giLevel(70)).toBe('high');
  });

  it('kam uglevodli mahsulotda GI qo‘llanilmaydi; jadvalda yo‘qiga raqam to‘qilmaydi', () => {
    expect(giFor(FOOD_MAP['chicken-breast']).kind).toBe('lowcarb');
    expect(giFor(FOOD_MAP['osh']).kind).toBe('none');
    expect(giFor(FOOD_MAP['rice'])).toMatchObject({ kind: 'gi', info: { gi: 73 } });
  });

  it('glikemik yuk: tarvuz 150 g — past, oq guruch porsiyasi — yuqori', () => {
    expect(glycemicLoad(76, (FOOD_MAP['watermelon'].c * 150) / 100)).toEqual({ gl: 9, level: 'low' });
    expect(glycemicLoad(73, (FOOD_MAP['rice'].c * 200) / 100).level).toBe('high');
  });
});
