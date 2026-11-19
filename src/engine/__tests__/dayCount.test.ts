import { describe, expect, it } from 'vitest';
import { EQUIPMENT_PRESETS, MUSCLES } from '../../data/catalog';
import { EXERCISE_MAP } from '../../data/exercises';
import { useStore } from '../../store/useStore';
import type { Profile } from '../../types';
import { DEFAULT_DAYS, generateProgram, hasEquipment, isSafe, removableIndex, rotateLinear, rotationSource, suggestExtra } from '../program';

const base: Profile = {
  name: 'Test',
  sex: 'female',
  age: 28,
  heightCm: 165,
  weightKg: 60,
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
  dietPrefs: { noPork: false, lactoseFree: false, vegetarian: false },
  createdAt: '2026-01-01',
};
const groupOf = (id: string) => MUSCLES[EXERCISE_MAP[id].primary[0]].group;

describe('Kundagi mashqlar soni (+ / −)', () => {
  it('qo‘shilgan mashq jihozga mos, xavfsiz, kunda takrorlanmaydi va kun mushaklaridan biriga', () => {
    for (const p of [base, { ...base, level: 'beginner' as const }, { ...base, injuries: ['lowerBack' as const, 'knee' as const] }, { ...base, equipment: EQUIPMENT_PRESETS.at(-1)!.items }]) {
      const program = generateProgram(p);
      for (const day of program.days) {
        let d = day;
        // ketma-ket 4 marta qo'shish
        for (let k = 0; k < 4; k++) {
          const pe = suggestExtra(d, { ...program, days: program.days.map((x) => (x.id === d.id ? d : x)) }, p);
          if (!pe) break;
          const ex = EXERCISE_MAP[pe.exerciseId];
          expect(hasEquipment(ex, p.equipment), ex.id).toBe(true);
          expect(isSafe(ex, p), ex.id).toBe(true);
          expect(d.exercises.some((e) => e.exerciseId === ex.id), ex.id).toBe(false);
          expect(pe.sets).toBeGreaterThanOrEqual(1);
          expect(pe.repMin).toBeLessThanOrEqual(pe.repMax);
          expect(pe.scheme).toBeUndefined();
          if (k === 0) expect(day.exercises.flatMap((e) => EXERCISE_MAP[e.exerciseId].primary.map((m) => MUSCLES[m].group))).toContain(groupOf(ex.id));
          d = { ...d, exercises: [...d.exercises, pe] };
        }
      }
    }
  });

  it('bo‘sh kunga ham mashq taklif qilinadi', () => {
    const program = generateProgram(base);
    expect(suggestExtra({ exercises: [] }, program, base)).not.toBeNull();
  });

  it('kamaytirishda asosiy (sxemali) mashq oxirgi navbatda olinadi', () => {
    const program = generateProgram({ ...base, level: 'beginner', method: 'linear' });
    const day = program.days[0];
    const i = removableIndex(day);
    expect(day.exercises[i].scheme).toBeUndefined();
    expect(removableIndex({ exercises: day.exercises.filter((e) => e.scheme) })).toBe(day.exercises.filter((e) => e.scheme).length - 1);
  });

  it('chiziqli A/B navbatida tahrir ko‘rsatilayotgan kunning manbasiga yoziladi', () => {
    const program = generateProgram({ ...base, level: 'beginner', method: 'linear' });
    const [a, b, a2] = program.days;
    // juft hafta — navbat yo'q
    for (const d of program.days) expect(rotationSource(program, d.id, 0)).toBe(d.id);
    // toq hafta: A kuni B ni, B kuni A ni, A′ kuni B ni ko'rsatadi
    expect(rotateLinear(program, a, 1).exercises.map((e) => e.exerciseId)).toEqual(b.exercises.map((e) => e.exerciseId));
    expect(rotationSource(program, a.id, 1)).toBe(b.id);
    expect(rotationSource(program, b.id, 1)).toBe(a.id);
    expect(rotationSource(program, a2.id, 1)).toBe(b.id);
  });

  it('store: addAutoPlanned kunga bitta mashq qo‘shadi', () => {
    useStore.getState().setProfile(base);
    const day = useStore.getState().program!.days[0];
    const n = day.exercises.length;
    const id = useStore.getState().addAutoPlanned(day.id);
    expect(id).toBeTruthy();
    const after = useStore.getState().program!.days.find((d) => d.id === day.id)!;
    expect(after.exercises.length).toBe(n + 1);
    expect(after.exercises.at(-1)!.exerciseId).toBe(id);
  });
});
