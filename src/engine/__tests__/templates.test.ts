import { describe, expect, it } from 'vitest';
import { EQUIPMENT_PRESETS } from '../../data/catalog';
import { EXERCISE_MAP } from '../../data/exercises';
import { PROGRAM_TEMPLATES, isCurrentTemplate, recommendTemplates, templatePatch } from '../../data/programTemplates';
import type { Profile } from '../../types';
import { DEFAULT_DAYS, generateProgram } from '../program';

const base: Profile = {
  name: 'T', sex: 'female', age: 28, heightCm: 165, weightKg: 60, goal: 'muscle', level: 'beginner', daysPerWeek: 3, sessionMin: 60,
  trainingDays: DEFAULT_DAYS[3], equipment: EQUIPMENT_PRESETS[0].items, injuries: [], focus: [], activity: 'light', healthFlags: [],
  dietPrefs: { noPork: false, lactoseFree: false, vegetarian: false }, createdAt: '2026-01-01',
};

describe('Tayyor dasturlar', () => {
  it('har bir dastur yaroqli reja beradi va tanlangach «joriy» bo‘ladi', () => {
    for (const t of PROGRAM_TEMPLATES) {
      for (const p of [base, { ...base, sex: 'male' as const, level: 'intermediate' as const, goal: 'strength' as const }]) {
        const q = { ...p, ...templatePatch(t, p) };
        const program = generateProgram(q);
        expect(program.days.length, t.id).toBe(t.days);
        expect(q.trainingDays.length, t.id).toBe(t.days);
        for (const d of program.days) {
          expect(d.exercises.length, `${t.id}: ${d.title}`).toBeGreaterThanOrEqual(3);
          for (const pe of d.exercises) expect(EXERCISE_MAP[pe.exerciseId], pe.exerciseId).toBeTruthy();
        }
        expect(program.method, t.id).toBe(t.method);
        expect(isCurrentTemplate(t, q, program), t.id).toBe(true);
      }
    }
  });

  it('tavsiya profilga qarab: boshlovchi ayol — dumba, boshlovchi erkak — 3×5, kuch maqsadi — kuch bloki, vaqt kam — 2 kun', () => {
    expect(recommendTemplates(base)[0].id).toBe('tpl-glutes');
    expect(recommendTemplates({ ...base, sex: 'male' })[0].id).toBe('tpl-linear');
    expect(recommendTemplates({ ...base, sex: 'male', level: 'intermediate', goal: 'strength', daysPerWeek: 4 })[0].id).toBe('tpl-strength');
    expect(recommendTemplates({ ...base, daysPerWeek: 2 })[0].id).toBe('tpl-minimal');
    for (const p of [base, { ...base, sex: 'male' as const, level: 'advanced' as const, daysPerWeek: 6 }]) {
      const ids = recommendTemplates(p).map((t) => t.id);
      expect(new Set(ids).size).toBe(PROGRAM_TEMPLATES.length);
    }
  });
});
