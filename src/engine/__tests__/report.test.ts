import { describe, expect, it } from 'vitest';
import { EQUIPMENT_PRESETS } from '../../data/catalog';
import { addDays, startOfWeek } from '../../lib/date';
import type { Profile, WorkoutLog } from '../../types';
import { DEFAULT_DAYS } from '../program';
import { defaultReportWeek, weekLabel, weekReport } from '../report';

const profile: Profile = {
  name: 'T', sex: 'male', age: 30, heightCm: 178, weightKg: 80, goal: 'muscle', level: 'intermediate', daysPerWeek: 3, sessionMin: 60,
  trainingDays: DEFAULT_DAYS[3], equipment: EQUIPMENT_PRESETS[0].items, injuries: [], focus: [], activity: 'light', healthFlags: [],
  dietPrefs: { noPork: false, lactoseFree: false, vegetarian: false }, createdAt: '2026-01-01',
};
const W = startOfWeek(new Date('2026-11-18T12:00:00')); // dushanba, 16-noyabr
const log = (day: Date, kg: number, extra: Partial<WorkoutLog> = {}): WorkoutLog => ({
  id: `l${day.getTime()}${kg}`,
  title: 'Kuch',
  startedAt: new Date(day.getTime() + 10 * 3600e3).toISOString(),
  finishedAt: new Date(day.getTime() + 11 * 3600e3).toISOString(),
  durationMin: 55,
  exercises: [
    { exerciseId: 'back-squat', sets: [1, 2, 3].map(() => ({ kg, reps: 5, done: true })) },
    { exerciseId: 'bench-press', sets: [1, 2, 3].map(() => ({ kg: kg - 20, reps: 8, done: true })) },
  ],
  ...extra,
});

describe('Haftalik hisobot', () => {
  const logs = [log(addDays(W, -14), 80), log(addDays(W, -7), 82.5), log(W, 85), log(addDays(W, 2), 85), log(addDays(W, 4), 87.5, { painEx: ['bench-press'] })];
  const r = weekReport({ logs, profile, body: [{ date: '2026-11-10', weightKg: 80 }, { date: '2026-11-21', weightKg: 80.6 }], food: [], target: { kcal: 2500, protein: 150 } }, W);

  it('hafta natijasi: mashg‘ulotlar, setlar, hajm, o‘tgan hafta', () => {
    expect(r.workouts).toBe(3);
    expect(r.planned).toBe(3);
    expect(r.sets).toBe(18);
    expect(r.prev.workouts).toBe(1);
    expect(r.volume).toBeGreaterThan(r.prev.volume);
    expect(r.label).toBe('16–22 noyabr');
  });

  it('rekordlar va kuch o‘sishi oldingi haftalarga nisbatan', () => {
    expect(r.prs.some((p) => p.exerciseId === 'back-squat')).toBe(true);
    const sq = r.lifts.find((l) => l.exerciseId === 'back-squat')!;
    expect(sq.now).toBeGreaterThan(sq.before);
    expect(sq.kg).toBe(87.5);
  });

  it('tavsiyalar: og‘riq birinchi, reja bajarilgani, ko‘pi bilan 4 ta', () => {
    expect(r.tips[0].tone).toBe('warn');
    expect(r.tips[0].text).toContain('og‘riq');
    expect(r.tips.some((t) => t.text.startsWith('Reja to‘liq bajarildi'))).toBe(true);
    expect(r.tips.length).toBeLessThanOrEqual(4);
    expect(r.weight).toEqual({ from: 80, to: 80.6 });
  });

  it('bo‘sh hafta — qaytishga undovchi tavsiya', () => {
    const e = weekReport({ logs: [], profile, body: [], food: [] }, W);
    expect(e.workouts).toBe(0);
    expect(e.tips[0].text).toMatch(/mashg‘ulot bo‘lmadi/);
  });

  it('standart hafta: dushanba–chorshanba o‘tgan hafta, keyin joriy', () => {
    expect(defaultReportWeek(new Date('2026-11-24T10:00:00')).getDate()).toBe(16);
    expect(defaultReportWeek(new Date('2026-11-27T10:00:00')).getDate()).toBe(23);
    expect(weekLabel(startOfWeek(new Date('2026-12-01T12:00:00')))).toBe('30 noyabr – 6 dekabr');
  });
});
