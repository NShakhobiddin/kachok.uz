import { describe, expect, it } from 'vitest';
import { EQUIPMENT_PRESETS } from '../../data/catalog';
import { EXERCISE_MAP, EXERCISES } from '../../data/exercises';
import { useStore } from '../../store/useStore';
import type { Profile } from '../../types';
import { DEFAULT_DAYS, estimateMinutes, manualPlanned } from '../program';

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

describe('Mashqlarni qo‘lda tanlash', () => {
  it('qo‘lda qo‘shilgan mashq profil maqsadiga mos set/takror oladi', () => {
    for (const ex of EXERCISES) {
      const pe = manualPlanned(ex, base);
      expect(pe.exerciseId).toBe(ex.id);
      expect(pe.sets, ex.id).toBeGreaterThanOrEqual(2);
      expect(pe.repMin, ex.id).toBeLessThanOrEqual(pe.repMax);
      if (ex.timed) expect(pe.repMin, ex.id).toBeGreaterThanOrEqual(20);
    }
    const iso = EXERCISES.find((e) => e.mechanics === 'isolation' && !e.timed)!;
    expect(manualPlanned(iso, { goal: 'strength', level: 'advanced' }).repMin).toBeGreaterThanOrEqual(8);
    // profilsiz ham ishlaydi
    expect(manualPlanned(EXERCISES[0]).sets).toBeGreaterThan(0);
  });

  it('kun qo‘shish, mashq tanlash va o‘chirish; davomiylik yangilanadi', () => {
    useStore.getState().setProfile(base);
    const before = useStore.getState().program!.days.length;
    const free = [0, 1, 2, 3, 4, 5, 6].find((w) => !useStore.getState().program!.days.some((d) => d.weekday === w))!;
    const id = useStore.getState().addDay(free, 'Qo‘l kuni')!;
    let day = useStore.getState().program!.days.find((d) => d.id === id)!;
    expect(day.exercises).toEqual([]);
    expect(day.weekday).toBe(free);

    const picks = EXERCISES.filter((e) => e.primary.includes('biceps')).slice(0, 2);
    picks.forEach((e) => useStore.getState().addPlanned(id, e.id));
    day = useStore.getState().program!.days.find((d) => d.id === id)!;
    expect(day.exercises.map((p) => p.exerciseId)).toEqual(picks.map((e) => e.id));
    expect(day.estMin).toBe(estimateMinutes(day.exercises));
    expect(day.estMin).toBeGreaterThan(estimateMinutes([]));

    useStore.getState().removeDay(id);
    expect(useStore.getState().program!.days.length).toBe(before);
  });

  it('erkin mashg‘ulot: tanlangan mashqlar bilan boshlanadi, yana qo‘shish mumkin', () => {
    useStore.getState().setProfile(base);
    const ids = ['back-squat', 'bench-press'].filter((x) => EXERCISE_MAP[x]);
    useStore.getState().startWorkout(
      null,
      ids.map((x) => manualPlanned(EXERCISE_MAP[x], base)),
    );
    let a = useStore.getState().active!;
    expect(a.log.title).toBe('Erkin mashg‘ulot');
    expect(a.log.exercises.map((e) => e.exerciseId)).toEqual(ids);
    useStore.getState().addActiveExercise('plank');
    a = useStore.getState().active!;
    expect(a.log.exercises.length).toBe(ids.length + (EXERCISE_MAP.plank ? 1 : 0));
    expect(a.plan.length).toBe(a.log.exercises.length);
    useStore.getState().discardWorkout();
  });
});
