import { describe, expect, it } from 'vitest';
import { EQUIPMENT_PRESETS, GROUP_ORDER, MUSCLES, VOLUME_LANDMARKS } from '../../data/catalog';
import { EXERCISE_MAP } from '../../data/exercises';
import type { Goal, Level, MuscleGroup, Profile } from '../../types';
import { sanitizeProfile } from '../../store/sanitize';
import { DEFAULT_DAYS, estimateMinutes, generateProgram, hasEquipment, isSafe, weeklyVolume } from '../program';
import { customSplitOf, resizeSplit, SPLIT_PRESETS, splitAdvice, splitDayTitle } from '../split';

const base: Profile = {
  name: 'Test',
  sex: 'male',
  age: 30,
  heightCm: 178,
  weightKg: 80,
  goal: 'muscle',
  level: 'intermediate',
  daysPerWeek: 3,
  sessionMin: 60,
  trainingDays: DEFAULT_DAYS[3],
  equipment: EQUIPMENT_PRESETS[0].items,
  injuries: [],
  focus: [],
  activity: 'light',
  healthFlags: [],
  dietPrefs: { noPork: true, lactoseFree: false, vegetarian: false },
  createdAt: '2026-01-01',
};

/** mashq kunga mos: asosiy mushagi tanlangan guruhlardan biri */
const groupOf = (id: string) => MUSCLES[EXERCISE_MAP[id].primary[0]].group;
/** mashq guruhni asosiy mushak sifatida ishlatadimi (o'lik tortish — dumba va son orqasi) */
const trains = (id: string, g: MuscleGroup) => EXERCISE_MAP[id].primary.some((m) => MUSCLES[m].group === g);

describe('Kunlar taqsimoti (o‘z tanlovi)', () => {
  it('foydalanuvchi misoli: 1-kun ko‘krak + qo‘llar, 2-kun yelka + orqa, 3-kun oyoqlar', () => {
    const split: MuscleGroup[][] = [
      ['chest', 'biceps', 'triceps'],
      ['shoulders', 'back'],
      ['quads', 'hamstrings', 'glutes', 'calves', 'core'],
    ];
    const prog = generateProgram({ ...base, split });
    expect(prog.split).toBe('O‘z taqsimotingiz');
    expect(prog.days.map((d) => d.title)).toEqual(['Ko‘krak + Qo‘llar', 'Orqa + Yelka', 'Oyoqlar + Press va bel']);
    prog.days.forEach((d, i) => {
      expect(d.exercises.length).toBeGreaterThanOrEqual(3);
      for (const pe of d.exercises) expect(split[i]).toContain(groupOf(pe.exerciseId));
      // har tanlangan guruhga kamida bitta mashq (boldir/press — vaqt qisqa bo'lsa tushishi mumkin)
      for (const g of split[i].filter((x) => x !== 'calves' && x !== 'core')) expect(d.exercises.some((pe) => trains(pe.exerciseId, g))).toBe(true);
      expect(d.estMin).toBeLessThanOrEqual(base.sessionMin + 10);
    });
    // hafta kunlari tartibda
    expect(prog.days.map((d) => d.weekday)).toEqual(DEFAULT_DAYS[3]);
  });

  it('barcha tayyor variantlar × maqsad × daraja × jihoz — yaroqli dastur, hajm MRV dan oshmaydi', () => {
    const goals: Goal[] = ['muscle', 'strength', 'fatLoss', 'health'];
    const levels: Level[] = ['beginner', 'intermediate', 'advanced'];
    for (const [n, presets] of Object.entries(SPLIT_PRESETS))
      for (const pr of presets)
        for (const goal of goals)
          for (const level of levels)
            for (const eq of EQUIPMENT_PRESETS) {
              const p: Profile = { ...base, goal, level, daysPerWeek: Number(n), trainingDays: DEFAULT_DAYS[Number(n)], equipment: eq.items, split: pr.days };
              const prog = generateProgram(p);
              expect(prog.days).toHaveLength(Number(n));
              for (const d of prog.days) {
                expect(d.exercises.length).toBeGreaterThan(0);
                for (const pe of d.exercises) {
                  const ex = EXERCISE_MAP[pe.exerciseId];
                  expect(hasEquipment(ex, eq.items)).toBe(true);
                  expect(isSafe(ex, p)).toBe(true);
                }
                expect(new Set(d.exercises.map((e) => e.exerciseId)).size).toBe(d.exercises.length);
                expect(estimateMinutes(d.exercises)).toBeLessThanOrEqual(p.sessionMin + 12);
              }
              const vol = weeklyVolume(prog);
              for (const g of GROUP_ORDER) expect(vol[g]).toBeLessThanOrEqual(VOLUME_LANDMARKS[g].mrv[3] + 0.01);
            }
  });

  it('jarohat va ustuvor mushak hisobga olinadi', () => {
    const split: MuscleGroup[][] = [['chest', 'triceps'], ['back', 'biceps'], ['quads', 'hamstrings', 'glutes']];
    const p: Profile = { ...base, split, injuries: ['lowerBack'], focus: ['chest'] };
    const prog = generateProgram(p);
    for (const d of prog.days) for (const pe of d.exercises) expect(isSafe(EXERCISE_MAP[pe.exerciseId], p)).toBe(true);
    const chestEx = prog.days[0].exercises.filter((pe) => groupOf(pe.exerciseId) === 'chest');
    expect(chestEx.length).toBeGreaterThanOrEqual(3);
  });

  it('kunlar soni mos kelmasa yoki kun bo‘sh bo‘lsa — tavsiya etilgan bo‘linma', () => {
    expect(customSplitOf({ daysPerWeek: 4, split: [['chest'], ['back'], ['quads']] })).toBeNull();
    expect(customSplitOf({ daysPerWeek: 3, split: [['chest'], [], ['quads']] })).toBeNull();
    expect(generateProgram({ ...base, daysPerWeek: 4, trainingDays: DEFAULT_DAYS[4], split: [['chest'], ['back'], ['quads']] }).split).not.toBe('O‘z taqsimotingiz');
    expect(resizeSplit([['chest'], ['back'], ['quads']], 4)).toHaveLength(4);
    expect(resizeSplit([['chest'], ['back'], ['quads']], 4)[0]).toEqual(['chest']);
  });

  it('kun nomlari', () => {
    expect(splitDayTitle(['chest', 'triceps'])).toBe('Ko‘krak + Triseps');
    expect(splitDayTitle(['biceps', 'triceps'])).toBe('Qo‘llar');
    expect(splitDayTitle(['quads', 'hamstrings', 'glutes', 'calves'])).toBe('Oyoqlar');
    expect(splitDayTitle(['quads', 'chest', 'back', 'shoulders', 'core'])).toBe('Butun tana');
  });

  it('maslahatlar: ishlamaydigan mushak, ketma-ket kunlar, bo‘sh kun', () => {
    // Du va Se ketma-ket, ikkalasida ko'krak; oyoq hech qayerda yo'q
    const hints = splitAdvice([['chest', 'triceps'], ['chest', 'back'], []], [0, 1, 4], 60);
    const text = hints.map((h) => h.text).join('\n');
    expect(text).toMatch(/3-kun uchun mushak tanlanmagan/);
    expect(text).toMatch(/son oldi/);
    expect(text).toMatch(/Dushanba va seshanba ketma-ket: ko‘krak/);
    // yaxshi taqsimotda ogohlantirish yo'q
    expect(splitAdvice(SPLIT_PRESETS[4][0].days, DEFAULT_DAYS[4], 60).filter((h) => h.level === 'warn')).toEqual([]);
  });

  it('zaxiradan tiklashda taqsimot tekshiriladi', () => {
    const p = sanitizeProfile({ ...base, split: [['chest', 'nope'], ['back'], 'x', ['quads']] });
    expect(p?.split).toEqual([['chest'], ['back'], ['quads']]);
    expect(sanitizeProfile({ ...base, split: 'bad' })?.split).toBeUndefined();
  });
});
