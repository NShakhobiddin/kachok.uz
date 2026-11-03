import { describe, expect, it } from 'vitest';
import { EXERCISES, EXERCISE_MAP, STRETCHES } from '../../data/exercises';
import { ROUTINES, isHomeExercise, routineExercises, routineMinutes, stretchSteps } from '../../data/routines';
import { generateProgram } from '../program';
import type { Profile } from '../../types';

const base: Profile = {
  name: 'T',
  sex: 'female',
  age: 28,
  heightCm: 165,
  weightKg: 60,
  goal: 'recomp',
  level: 'beginner',
  daysPerWeek: 3,
  sessionMin: 45,
  trainingDays: [0, 2, 4],
  equipment: [],
  injuries: [],
  focus: [],
  activity: 'light',
  healthFlags: [],
  dietPrefs: { noPork: false, lactoseFree: false, vegetarian: false },
  createdAt: '2026-01-01',
};

describe('Cho‘zilishlar', () => {
  it('har biri to‘liq: vaqt, animatsiya, texnika; kuch mashqlari ro‘yxatiga kirmaydi', () => {
    const strength = new Set(EXERCISES.map((e) => e.id));
    const ids = new Set<string>();
    expect(STRETCHES.length).toBeGreaterThanOrEqual(12);
    for (const s of STRETCHES) {
      expect(ids.has(s.id), s.id).toBe(false);
      ids.add(s.id);
      expect(strength.has(s.id), s.id).toBe(false);
      expect(s.kind, s.id).toBe('stretch');
      expect(s.pattern, s.id).toBe('mobility');
      expect(s.timed, s.id).toBe(true);
      expect(s.hold, s.id).toBeGreaterThanOrEqual(15);
      expect(s.anim.frames.length, s.id).toBeGreaterThan(1);
      expect(s.steps.length && s.mistakes.length && s.benefits.length && s.primary.length, s.id).toBeTruthy();
    }
  });

  it('dastur generatori cho‘zilish va qo‘lda tanlanadigan mashqlarni qo‘ymaydi', () => {
    for (const equipment of [[], ['dumbbells', 'bands', 'miniBand', 'fitball'], EXERCISES.flatMap((e) => e.equipment)] as Profile['equipment'][]) {
      const prog = generateProgram({ ...base, equipment });
      for (const d of prog.days)
        for (const pe of d.exercises) {
          const ex = EXERCISE_MAP[pe.exerciseId];
          expect(ex?.kind, pe.exerciseId).toBeUndefined();
          expect(ex?.pattern, pe.exerciseId).not.toBe('adduction');
        }
    }
  });
});

describe('Tayyor mashg‘ulotlar', () => {
  it('har bir mashq mavjud va bo‘limiga mos', () => {
    const ids = new Set<string>();
    for (const r of ROUTINES) {
      expect(ids.has(r.id), r.id).toBe(false);
      ids.add(r.id);
      expect(routineExercises(r).length, r.id).toBe(r.items.length);
      for (const { ex } of routineExercises(r)) {
        if (r.kind === 'stretch') expect(ex.kind, `${r.id}: ${ex.id}`).toBe('stretch');
        else {
          expect(ex.kind, `${r.id}: ${ex.id}`).toBeUndefined();
          // uydagi mashg'ulot faqat uy jihozlari yoki shu mashg'ulotda ko'rsatilgan jihoz bilan
          expect(isHomeExercise(ex) || ex.equipment.every((e) => r.needs.includes(e)), `${r.id}: ${ex.id}`).toBe(true);
        }
      }
      for (const item of r.items) if (item.reps) expect(item.reps[0], r.id).toBeLessThanOrEqual(item.reps[1]);
    }
  });

  it('davomiylik real: cho‘zilish 5–20, uyda 10–40 daqiqa', () => {
    for (const r of ROUTINES) {
      const m = routineMinutes(r);
      if (r.kind === 'stretch') {
        expect(m, r.id).toBeGreaterThanOrEqual(5);
        expect(m, r.id).toBeLessThanOrEqual(20);
      } else {
        expect(m, r.id).toBeGreaterThanOrEqual(10);
        expect(m, r.id).toBeLessThanOrEqual(40);
      }
    }
  });

  it('bir tomonlama cho‘zilish ikki qadam bo‘ladi (o‘ng, chap)', () => {
    const r = ROUTINES.find((x) => x.kind === 'stretch' && routineExercises(x).some(({ ex }) => ex.perSide))!;
    const steps = stretchSteps(r);
    const i = steps.findIndex((s) => s.side === 'o‘ng');
    expect(steps[i + 1].side).toBe('chap');
    expect(steps[i + 1].ex.id).toBe(steps[i].ex.id);
  });
});
