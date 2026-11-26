// Faqat yig‘ishda (SSR) ishlaydi: ilova bazasidan sayt uchun ixcham ma’lumot.
import { ACTIVATION } from '../../src/data/activation';
import { MUSCLES } from '../../src/data/catalog';
import { DISH_GROUPS, DISH_VIEWS } from '../../src/data/dishes';
import { EXERCISE_MAP, EXERCISES } from '../../src/data/exercises';
import { FOOD_DB, FOOD_MAP } from '../../src/data/foods';
import { GI } from '../../src/data/glycemic';
import { ILLUSTRATIONS } from '../../src/data/illustrations';
import { LESSONS } from '../../src/data/lessons';
import { MUSCLE_GUIDE } from '../../src/data/muscleGuide';
import { M3_INFO, M3_KEYS } from '../../src/data/muscles3d';
import { RECIPE_MAP, RECIPES } from '../../src/data/recipes';
import { PROGRAM_TEMPLATES } from '../../src/data/programTemplates';
import { ROUTINES } from '../../src/data/routines';
import { SOURCES } from '../../src/data/sources';
import { STRETCHES } from '../../src/data/stretches';
import type { MuscleId } from '../../src/types';
import type { MuscleRow, SiteData } from './model';

/** saytda ko‘rsatiladigan manbalar (asosiy hisob-kitoblar shularga tayanadi) */
const KEY_SOURCES = ['mifflin1990', 'morton2018', 'helms2014', 'schoenfeld2017vol', 'atkinson2008', 'iso26642'];

function muscles(): Partial<Record<MuscleId, MuscleRow>> {
  const out: Partial<Record<MuscleId, MuscleRow>> = {};
  for (const m of Object.keys(MUSCLES) as MuscleId[]) {
    const keys = M3_KEYS.filter((k) => M3_INFO[k].group === m);
    if (!keys.length) continue;
    const best = Object.entries(ACTIVATION)
      // faqat ilovada bor va rasmi chizilgan mashqlar
      .filter(([id]) => EXERCISE_MAP[id] && ILLUSTRATIONS[id])
      .flatMap(([id, a]) => {
        const vals = keys.map((k) => a.muscles[k]).filter((v): v is NonNullable<typeof v> => !!v);
        if (!vals.length) return [];
        const top = vals.reduce((x, y) => (y.mvic > x.mvic ? y : x));
        return [{ id, name: EXERCISE_MAP[id].name, mvic: Math.round(top.mvic), est: !!top.est }];
      })
      .sort((a, b) => b.mvic - a.mvic || Number(a.est) - Number(b.est))
      .slice(0, 5);
    if (!best.length) continue;
    out[m] = { name: MUSCLES[m].name, short: MUSCLE_GUIDE[keys[0]].short, view: MUSCLES[m].view, top: best };
  }
  return out;
}

export function buildSiteData(): SiteData {
  const groupOf = new Map(DISH_GROUPS.flatMap((g) => g.ids.map((id) => [id, g.id] as const)));
  return {
    stats: {
      year: new Date().getFullYear(),
      templates: PROGRAM_TEMPLATES.length,
      exercises: EXERCISES.length,
      stretches: STRETCHES.length,
      illustrated: Object.keys(ILLUSTRATIONS).length,
      dishes: DISH_VIEWS.length,
      recipes: RECIPES.length,
      foods: FOOD_DB.length,
      sources: SOURCES.length,
      routines: ROUTINES.length,
      lessons: LESSONS.length,
    },
    dishes: DISH_VIEWS.map((d) => {
      const r = d.light ? RECIPE_MAP[d.light] : undefined;
      return {
        id: d.id,
        name: d.food.name,
        icon: d.icon,
        tip: d.tip,
        group: groupOf.get(d.id) ?? 'other',
        // "1 likopcha", lekin "5 dona" (son allaqachon bor)
        unit: /^\d/.test(d.unit.name) ? d.unit.name : `1 ${d.unit.name}`,
        g: d.unit.g,
        kcal: d.kcal,
        p: d.p,
        f: d.f,
        c: d.c,
        light: r ? { name: r.name, kcal: Math.round(r.kcal), p: Math.round(r.p) } : undefined,
      };
    }),
    groups: DISH_GROUPS.map(({ id, name, short }) => ({ id, name, short })),
    gi: Object.entries(GI)
      .filter(([id]) => FOOD_MAP[id])
      .map(([id, g]) => {
        const f = FOOD_MAP[id];
        const u = f.units?.[0] ?? { name: '100 g', g: 100 };
        return { id, name: f.name, gi: g.gi, c: f.c, unit: u.name, g: u.g, as: g.as };
      })
      .sort((a, b) => a.gi - b.gi),
    muscles: muscles(),
    sources: KEY_SOURCES.flatMap((id) => {
      const s = SOURCES.find((x) => x.id === id);
      return s ? [{ short: s.short, finding: s.finding ?? '', doi: s.doi }] : [];
    }),
  };
}
