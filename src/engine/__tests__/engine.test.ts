import { describe, expect, it } from 'vitest';
import { EQUIPMENT_PRESETS, GROUP_ORDER, WEEKLY_TARGET } from '../../data/catalog';
import { EXERCISES, EXERCISE_MAP } from '../../data/exercises';
import { LESSONS } from '../../data/lessons';
import { SOURCES } from '../../data/sources';
import type { Goal, Injury, Level, Profile, WorkoutLog } from '../../types';
import { bmr, mealPlan, nutritionPlan, weeklyCheck } from '../nutrition';
import { DEFAULT_DAYS, estimateMinutes, generateProgram, hasEquipment, isSafe, weeklyVolume } from '../program';
import { e1rm, platesPerSide, suggest, warmupSets } from '../progression';
import { detectPRs, volumeComparison, weekStreak } from '../stats';

const base: Profile = {
  name: 'Test',
  sex: 'male',
  age: 30,
  heightCm: 178,
  weightKg: 80,
  goal: 'muscle',
  level: 'intermediate',
  daysPerWeek: 4,
  sessionMin: 60,
  trainingDays: DEFAULT_DAYS[4],
  equipment: EQUIPMENT_PRESETS[0].items,
  injuries: [],
  focus: [],
  activity: 'light',
  healthFlags: [],
  dietPrefs: { noPork: true, lactoseFree: false, vegetarian: false },
  createdAt: '2026-01-01',
};

describe('ma’lumotlar yaxlitligi', () => {
  it('har bir mashqda animatsiya, texnika va to‘g‘ri havolalar bor', () => {
    const ids = new Set<string>();
    for (const e of EXERCISES) {
      expect(ids.has(e.id)).toBe(false);
      ids.add(e.id);
      expect(e.steps.length).toBeGreaterThan(0);
      expect(e.mistakes.length).toBeGreaterThan(0);
      expect(e.benefits.length).toBeGreaterThan(0);
      expect(e.anim.frames.length).toBeGreaterThan(1);
      expect(e.primary.length).toBeGreaterThan(0);
    }
    expect(EXERCISES.length).toBeGreaterThanOrEqual(60);
  });
  it('darslardagi manbalar va mashq sahnalari mavjud', () => {
    const src = new Set(SOURCES.map((s) => s.id));
    for (const l of LESSONS)
      for (const s of l.slides) {
        if (s.source) expect(src.has(s.source), `${l.id}: ${s.source}`).toBe(true);
        const m = /^(fig|wrong):(.+)$/.exec(s.scene);
        if (m) expect(EXERCISE_MAP[m[2]], s.scene).toBeTruthy();
      }
  });
});

describe('dastur generatori', () => {
  const goals: Goal[] = ['muscle', 'fatLoss', 'strength', 'recomp', 'health'];
  const levels: Level[] = ['beginner', 'intermediate', 'advanced'];
  const injurySets: Injury[][] = [[], ['lowerBack'], ['shoulder', 'knee']];
  it('barcha kombinatsiyalarda ishlaydi va qoidalarga amal qiladi', () => {
    let n = 0;
    for (const days of [2, 3, 4, 5, 6])
      for (const goal of goals)
        for (const level of levels)
          for (const preset of EQUIPMENT_PRESETS)
            for (const injuries of injurySets)
              for (const sessionMin of [30, 60, 90]) {
                const p: Profile = { ...base, daysPerWeek: days, trainingDays: DEFAULT_DAYS[days], goal, level, equipment: preset.items, injuries, sessionMin };
                const prog = generateProgram(p);
                n++;
                expect(prog.days.length).toBe(days);
                for (const d of prog.days) {
                  expect(d.exercises.length, `${preset.id} ${days}d ${d.title}`).toBeGreaterThanOrEqual(preset.id === 'bodyweight' ? 2 : 3);
                  for (const pe of d.exercises) {
                    const ex = EXERCISE_MAP[pe.exerciseId];
                    expect(hasEquipment(ex, p.equipment), `${ex.id} jihozsiz`).toBe(true);
                    expect(isSafe(ex, p), `${ex.id} jarohat`).toBe(true);
                    expect(pe.repMin).toBeLessThanOrEqual(pe.repMax);
                    expect(pe.sets).toBeGreaterThanOrEqual(1);
                  }
                  expect(new Set(d.exercises.map((e) => e.exerciseId)).size).toBe(d.exercises.length);
                  if (preset.id !== 'bodyweight') expect(estimateMinutes(d.exercises), `${days}d ${sessionMin}m`).toBeLessThanOrEqual(sessionMin + 15);
                }
              }
    expect(n).toBeGreaterThan(1000);
  });
  it("to‘liq zalda haftalik hajm asosiy guruhlar uchun tavsiyaga yaqin", () => {
    const vol = weeklyVolume(generateProgram(base));
    for (const g of GROUP_ORDER) {
      if (g === 'calves') continue;
      expect(vol[g], g).toBeGreaterThanOrEqual(WEEKLY_TARGET[g][0] * 0.6);
      expect(vol[g], g).toBeLessThanOrEqual(WEEKLY_TARGET[g][1] * 1.35);
    }
  });
  it('bel jarohatida o‘lik tortish va shtanga bilan o‘tirish chiqmaydi', () => {
    const prog = generateProgram({ ...base, injuries: ['lowerBack'] });
    const ids = prog.days.flatMap((d) => d.exercises.map((e) => e.exerciseId));
    expect(ids).not.toContain('deadlift');
    expect(ids).not.toContain('back-squat');
  });
});

const log = (id: string, date: string, sets: [number, number][], exId = 'bench-press'): WorkoutLog => ({
  id,
  title: 't',
  startedAt: date,
  finishedAt: date,
  durationMin: 50,
  exercises: [{ exerciseId: exId, sets: sets.map(([kg, reps]) => ({ kg, reps, done: true })) }],
});

describe('progressiya', () => {
  const ex = EXERCISE_MAP['bench-press'];
  const pe = { exerciseId: ex.id, sets: 3, repMin: 8, repMax: 12, rir: 2, restSec: 120 };
  const ctx = { bodyKg: 80, sex: 'male' as const, level: 'intermediate' as const };
  it('barcha setlarda yuqori takror — vazn oshadi', () => {
    const s = suggest(ex, pe, [log('a', '2026-01-01T10:00:00Z', [[60, 12], [60, 12], [60, 12]])], ctx);
    expect(s.kind).toBe('up');
    expect(s.kg).toBe(62.5);
    expect(s.reps).toBe(8);
  });
  it('takror yetmasa — vazn o‘zgarmaydi, +1 takror', () => {
    const s = suggest(ex, pe, [log('a', '2026-01-01T10:00:00Z', [[60, 10], [60, 9], [60, 9]])], ctx);
    expect(s.kg).toBe(60);
    expect(s.reps).toBe(10);
  });
  it("ikki marta ketma-ket muvaffaqiyatsizlik — vazn kamayadi", () => {
    const logs = [log('a', '2026-01-01T10:00:00Z', [[60, 6], [60, 5], [60, 5]]), log('b', '2026-01-04T10:00:00Z', [[60, 6], [60, 6], [60, 5]])];
    const s = suggest(ex, pe, logs, ctx);
    expect(s.kind).toBe('down');
    expect(s.kg).toBeLessThan(60);
  });
  it('yengillashtirish haftasi setlarni kamaytiradi', () => {
    const s = suggest(ex, pe, [log('a', '2026-01-01T10:00:00Z', [[60, 10], [60, 10], [60, 10]])], { ...ctx, deload: true });
    expect(s.sets).toBe(2);
    expect(s.rir).toBe(4);
  });
  it('birinchi marta — taxminiy vazn grifdan og‘ir emas va mantiqiy', () => {
    const s = suggest(ex, pe, [], { ...ctx, level: 'beginner' });
    expect(s.estimated).toBe(true);
    expect(s.kg).toBeGreaterThanOrEqual(20);
    expect(s.kg).toBeLessThanOrEqual(60);
  });
  it('isinish setlari ish vaznidan yengil', () => {
    for (const w of warmupSets(ex, 100)) expect(w.kg!).toBeLessThan(100);
  });
  it('disk kalkulyatori', () => {
    expect(platesPerSide(100).plates).toEqual([25, 15]);
    expect(platesPerSide(62.5).plates).toEqual([20, 1.25]);
    expect(platesPerSide(20).plates).toEqual([]);
  });
  it('Epley 1RM', () => {
    expect(e1rm(100, 1)).toBe(100);
    expect(Math.round(e1rm(100, 10))).toBe(133);
  });
});

describe('ovqatlanish', () => {
  it('Mifflin–St Jeor', () => {
    expect(bmr('male', 80, 178, 30)).toBeCloseTo(10 * 80 + 6.25 * 178 - 5 * 30 + 5);
    expect(bmr('female', 60, 165, 25)).toBeCloseTo(600 + 1031.25 - 125 - 161);
  });
  it('maqsadga mos kaloriya va makrolar', () => {
    const lose = nutritionPlan({ ...base, goal: 'fatLoss' });
    const gain = nutritionPlan({ ...base, goal: 'muscle' });
    expect(lose.kcal).toBeLessThan(lose.tdee);
    expect(gain.kcal).toBeGreaterThan(gain.tdee);
    expect(lose.protein / 80).toBeGreaterThanOrEqual(2);
    expect(gain.protein / 80).toBeGreaterThanOrEqual(1.6);
    for (const np of [lose, gain]) {
      const kcalFromMacros = np.protein * 4 + np.fat * 9 + np.carbs * 4;
      expect(Math.abs(kcalFromMacros - np.kcal) / np.kcal).toBeLessThan(0.05);
      expect((np.fat * 9) / np.kcal).toBeGreaterThanOrEqual(0.19);
    }
  });
  it('semizlikda oqsil sog‘lom vazn bo‘yicha', () => {
    const np = nutritionPlan({ ...base, weightKg: 140, heightCm: 175 });
    expect(np.protein).toBeLessThan(140 * 1.8);
  });
  it('ovqat rejasi maqsadga yaqin', () => {
    for (const goal of ['fatLoss', 'muscle', 'health'] as Goal[])
      for (const veg of [false, true]) {
        const np = nutritionPlan({ ...base, goal });
        const meals = mealPlan(np, { noPork: true, lactoseFree: false, vegetarian: veg });
        const kcal = meals.reduce((a, m) => a + m.kcal, 0);
        const prot = meals.reduce((a, m) => a + m.p, 0);
        expect(Math.abs(kcal - np.kcal) / np.kcal, `${goal} ${veg}`).toBeLessThan(0.15);
        expect(prot / np.protein, `${goal} ${veg} oqsil`).toBeGreaterThan(veg ? 0.6 : 0.85);
      }
  });
  it('haftalik tekshiruv: tez ozishda kaloriya qo‘shishni taklif qiladi', () => {
    const np = nutritionPlan({ ...base, goal: 'fatLoss' });
    const entries = Array.from({ length: 15 }, (_, i) => ({ date: `2026-02-${String(i + 1).padStart(2, '0')}`, weightKg: 80 - i * 0.2 }));
    const c = weeklyCheck(entries, np, 80);
    expect(c?.delta).toBeGreaterThan(0);
  });
});

describe('statistika', () => {
  it('rekord aniqlanadi', () => {
    const prev = [log('a', '2026-01-01T10:00:00Z', [[60, 8]])];
    const cur = log('b', '2026-01-04T10:00:00Z', [[65, 8]]);
    const prs = detectPRs(cur, prev);
    expect(prs).toHaveLength(1);
    expect(prs[0].kind).toBe('weight');
  });
  it('birinchi mashg‘ulot rekord hisoblanmaydi', () => {
    expect(detectPRs(log('b', '2026-01-04T10:00:00Z', [[65, 8]]), [])).toHaveLength(0);
  });
  it('haftalik seriya', () => {
    const now = new Date('2026-03-18T12:00:00');
    const logs = ['2026-03-16', '2026-03-17', '2026-03-09', '2026-03-11', '2026-03-13', '2026-03-02', '2026-03-04'].map((d, i) => log(String(i), `${d}T10:00:00`, [[50, 10]]));
    expect(weekStreak(logs, 3, now)).toBe(3);
  });
  it('hajmni solishtirish', () => {
    expect(volumeComparison(1000).text).toContain('Damas');
    expect(volumeComparison(13000).text).toContain('avtobus');
  });
});
