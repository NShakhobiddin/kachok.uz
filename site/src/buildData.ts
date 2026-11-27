// Faqat yig‘ishda (SSR) ishlaydi: ilova bazasidan sayt uchun ixcham ma’lumot.
import { motionFrames } from '../../src/components/ExerciseMotion';
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
import { activationFor } from '../../src/engine/activation';
import { METHOD_INFO } from '../../src/engine/methods';
import { generateProgram } from '../../src/engine/program';
import { EQUIPMENT_PRESETS } from '../../src/data/catalog';
import { RECIPE_MAP, RECIPES } from '../../src/data/recipes';
import { PROGRAM_TEMPLATES } from '../../src/data/programTemplates';
import { ROUTINES } from '../../src/data/routines';
import { SOURCES } from '../../src/data/sources';
import { STRETCHES } from '../../src/data/stretches';
import type { Exercise, Goal, MuscleId, Profile } from '../../src/types';
import { PLAN_DAYS, PLAN_DEFAULT, PLAN_GOALS, PLAN_PLACES, planKey, type Place } from './plans';
import { GALLERY_IDS, SHOWCASE } from './media';
import { FACT_DEFS, MYTH_DEFS } from './content';
import type { GalleryRow, MuscleRow, PlanRow, ShowcaseRow, SiteData, SourceRow } from './model';

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

/** mashq tempidan: kadrlar orasidagi harakat vaqti (ilovadagi ExerciseMotion bilan bir xil qoida) */
function tempo(ex: Exercise): ShowcaseRow['tempo'] {
  const segs: { phase: string; dur: number }[] = [];
  for (const f of ex.anim.frames) {
    const last = segs[segs.length - 1];
    if (last && last.phase === f.phase) last.dur += f.dur;
    else segs.push({ phase: f.phase, dur: f.dur });
  }
  const moves = segs.filter((s) => s.phase === 'up' || s.phase === 'down') as { phase: 'up' | 'down'; dur: number }[];
  const clamp = (v: number) => Math.min(2200, Math.max(700, v));
  return {
    go: { phase: moves[0]?.phase ?? 'down', ms: clamp(moves[0]?.dur ?? 1200) },
    back: { phase: moves[1]?.phase ?? 'up', ms: clamp(moves[1]?.dur ?? 900) },
  };
}

function showcase(): ShowcaseRow[] {
  return SHOWCASE.map(({ id, tag }) => {
    const ex = EXERCISE_MAP[id];
    const ill = ILLUSTRATIONS[id];
    if (!ex || !ill) throw new Error(`3D bo‘limi: mashq yoki rasm topilmadi: ${id}`);
    const act = activationFor(ex);
    const groups = (min: number, max: number) => [
      ...new Set(act.list.filter((a) => a.mvic >= min && a.mvic < max).flatMap((a) => (M3_INFO[a.key].group ? [M3_INFO[a.key].group!] : []))),
    ];
    const primary = groups(50, Infinity);
    return {
      id,
      name: ex.name,
      tag,
      alt: ill.alt,
      frames: motionFrames(ex, ill).map((f) => ({ src: f.src, phase: f.phase })),
      tempo: tempo(ex),
      anim: ex.anim.frames.map((f) => ({ phase: f.phase, dur: f.dur })),
      acts: act.list.map((a) => ({ key: a.key, name: M3_INFO[a.key].name, mvic: Math.round(a.mvic), est: a.est })),
      primary,
      secondary: groups(20, 50).filter((g) => !primary.includes(g)),
      view: M3_INFO[act.list[0].key].view === 'back' ? ('back' as const) : ('front' as const),
    };
  });
}

function gallery(): GalleryRow[] {
  return GALLERY_IDS.map((id) => {
    const ex = EXERCISE_MAP[id];
    if (!ex || !ILLUSTRATIONS[id]) throw new Error(`rasm lentasi: mashq yoki rasm topilmadi: ${id}`);
    return { id, name: ex.name, src: `gallery/${id}.webp` };
  });
}

/** ilova dvigateli bilan reja: boshlovchi, 60 daqiqa, jarohatsiz (ilovada 4 savoldan keyin shaxsiylashadi) */
function plan(goal: Goal, place: Place, days: number): PlanRow {
  const preset = EQUIPMENT_PRESETS.find((x) => x.id === PLAN_PLACES.find((pl) => pl.v === place)!.preset)!;
  const p: Profile = {
    name: '',
    sex: 'male',
    age: 25,
    heightCm: 175,
    weightKg: 75,
    goal,
    level: 'beginner',
    daysPerWeek: days,
    sessionMin: 60,
    trainingDays: [],
    equipment: preset.items,
    injuries: [],
    focus: [],
    activity: 'light',
    healthFlags: [],
    dietPrefs: { noPork: false, lactoseFree: false, vegetarian: false },
    createdAt: '',
  };
  const prog = generateProgram(p);
  return {
    key: planKey(goal, place, days),
    name: prog.split,
    method: prog.method ? METHOD_INFO[prog.method].name : '',
    days: prog.days.map((d) => ({
      title: d.title,
      focus: d.focus,
      weekday: d.weekday,
      min: d.estMin,
      ex: d.exercises.map((e) => ({
        id: e.exerciseId,
        name: EXERCISE_MAP[e.exerciseId]?.name ?? e.exerciseId,
        sets: e.sets,
        reps: e.repMin === e.repMax ? String(e.repMin) : `${e.repMin}–${e.repMax}`,
        rest: e.restSec,
        thumb: !!ILLUSTRATIONS[e.exerciseId],
      })),
    })),
  };
}

/** barcha tanlovlar (plans.json uchun) */
export function buildPlans(): Record<string, PlanRow> {
  const out: Record<string, PlanRow> = {};
  for (const g of PLAN_GOALS) for (const pl of PLAN_PLACES) for (const d of PLAN_DAYS) out[planKey(g.v, pl.v, d)] = plan(g.v, pl.v, d);
  return out;
}

/** manba nomi va DOI ilovaning ro‘yxatidan: id xato bo‘lsa yig‘ish to‘xtaydi */
function src(id: string): SourceRow {
  const s = SOURCES.find((x) => x.id === id);
  if (!s) throw new Error(`manba topilmadi: ${id}`);
  return { short: s.short, finding: s.finding ?? '', doi: s.doi };
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
    sources: KEY_SOURCES.map(src),
    facts: FACT_DEFS.map(({ source, ...f }) => ({ ...f, src: src(source) })),
    myths: MYTH_DEFS.map(({ source, ...m }) => ({ ...m, src: src(source) })),
    allSources: SOURCES.map((s) => ({ short: s.short, finding: s.finding ?? '', doi: s.doi, cite: s.cite })),
    showcase: showcase(),
    gallery: gallery(),
    m3names: Object.fromEntries(M3_KEYS.map((k) => [k, M3_INFO[k].name])),
    plan: plan(PLAN_DEFAULT.goal, PLAN_DEFAULT.place, PLAN_DEFAULT.days),
  };
}
