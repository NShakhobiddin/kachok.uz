// Maqsadlar: joriy qiymat, bashorat, holat va maslahatlar.
import { describe, expect, it } from 'vitest';
import type { BodyEntry, SetLog, UserGoal, WorkoutLog } from '../../types';
import { goalDefaults, goalStatus, liftCurrent, slopePerDay } from '../goals';
import { e1rmFromSet } from '../rpe';

const DAY = 86_400_000;
const NOW = new Date('2026-03-15T12:00:00');
const ago = (d: number) => new Date(NOW.getTime() - d * DAY);
let n = 0;
const log = (exId: string, kg: number, reps: number, daysAgo: number): WorkoutLog => {
  const at = ago(daysAgo).toISOString();
  n++;
  return { id: `G${n}`, title: 't', startedAt: at, finishedAt: at, durationMin: 50, exercises: [{ exerciseId: exId, sets: [{ kg, reps, rir: 1, done: true }] as SetLog[] }] };
};
const goal = (g: Partial<UserGoal>): UserGoal => ({ id: 'g', kind: 'lift', target: 100, start: 60, createdAt: '2026-01-01', ...g });
const body = (pairs: [number, number][]): BodyEntry[] => pairs.map(([d, w]) => ({ date: ago(d).toISOString().slice(0, 10), weightKg: w }));
const ctx = (over: { logs?: WorkoutLog[]; body?: BodyEntry[] } = {}) => ({ logs: [], body: [], profile: { weightKg: 80, daysPerWeek: 3 }, now: NOW, ...over });

describe('slopePerDay', () => {
  it('kam nuqta yoki qisqa oraliqda — null', () => {
    expect(slopePerDay([{ t: 0, y: 1 }, { t: DAY * 20, y: 2 }])).toBeNull();
    expect(slopePerDay([0, 1, 2].map((i) => ({ t: i * DAY, y: i })))).toBeNull();
  });
  it('to‘g‘ri chiziqda — aniq qiyalik', () => {
    expect(slopePerDay([0, 7, 14, 21].map((d) => ({ t: d * DAY, y: 50 + d * 0.5 })))).toBeCloseTo(0.5, 6);
  });
});

describe('Kuch maqsadi', () => {
  // har hafta +2.5 kg, 5 takror — 8 hafta
  const rising = [49, 42, 35, 28, 21, 14, 7, 0].map((d, i) => log('back-squat', 70 + i * 2.5, 5, d));

  it('joriy 1RM — oxirgi 6 haftadagi eng yaxshisi; eskisi hisobga olinmaydi', () => {
    expect(liftCurrent('back-squat', rising, NOW)).toBeCloseTo(e1rmFromSet(87.5, 5, 1), 0);
    expect(liftCurrent('back-squat', [log('back-squat', 120, 5, 60)], NOW)).toBeNull();
  });

  it('o‘sish trendi bo‘yicha bashorat sanasi beriladi', () => {
    const s = goalStatus(goal({ exerciseId: 'back-squat', target: 120, start: 80 }), ctx({ logs: rising }));
    expect(s.state).toBe('on');
    expect(s.eta! > '2026-03-15').toBe(true);
    expect(s.progress).toBeGreaterThan(0);
    expect(s.progress).toBeLessThan(1);
  });

  it('yangi boshlovchining tez o‘sishi bashoratda haftasiga 2.5% bilan cheklanadi', () => {
    // har mashg'ulot +2.5 kg (haftasiga 3 marta) — 8 kg ni 6 kunda emas, ~5 haftada kutamiz
    const novice = [18, 16, 14, 11, 9, 7, 4, 2, 0].map((d, i) => log('back-squat', 32.5 + i * 2.5, 5, d));
    const cur = liftCurrent('back-squat', novice, NOW)!;
    const s = goalStatus(goal({ exerciseId: 'back-squat', target: cur + 8, start: 40 }), ctx({ logs: novice }));
    const days = (Date.parse(s.eta!) - NOW.getTime()) / DAY;
    expect(days).toBeGreaterThan(28);
    expect(days).toBeLessThan(45);
  });

  it('muddat yaqin bo‘lsa — ortda, kerakli haftalik o‘sish aytiladi', () => {
    const s = goalStatus(goal({ exerciseId: 'back-squat', target: 140, start: 80, deadline: '2026-04-01' }), ctx({ logs: rising }));
    expect(s.state).toBe('behind');
    expect(s.tip).toMatch(/haftasiga/);
  });

  it('muddat uzoq bo‘lsa — oldinda', () => {
    const s = goalStatus(goal({ exerciseId: 'back-squat', target: 110, start: 80, deadline: '2027-03-01' }), ctx({ logs: rising }));
    expect(s.state).toBe('ahead');
  });

  it('o‘sish to‘xtasa — maslahat bilan', () => {
    const flat = [35, 28, 21, 14, 7, 0].map((d) => log('back-squat', 80, 5, d));
    const s = goalStatus(goal({ exerciseId: 'back-squat', target: 120 }), ctx({ logs: flat }));
    expect(s.state).toBe('stalled');
    expect(s.tip).toBeTruthy();
  });

  it('maqsadga yetilsa — done; mashq bajarilmagan bo‘lsa — nodata', () => {
    expect(goalStatus(goal({ exerciseId: 'back-squat', target: 90 }), ctx({ logs: rising })).state).toBe('done');
    expect(goalStatus(goal({ exerciseId: 'back-squat' }), ctx()).state).toBe('nodata');
  });
});

describe('Vazn maqsadi', () => {
  it('xavfsiz sur’atda ozish — bashorat bilan, ogohlantirishsiz', () => {
    const b = body([[28, 84], [21, 83.6], [14, 83.2], [7, 82.8], [0, 82.4]]);
    const s = goalStatus(goal({ kind: 'weight', start: 84, target: 78 }), ctx({ body: b }));
    expect(s.current).toBe(82.4);
    expect(['on', 'ahead']).toContain(s.state);
    expect(s.eta).toBeTruthy();
    expect(s.tip).toBeUndefined();
  });

  it('juda tez ozish — haftasiga 1% dan ko‘p bo‘lsa ogohlantiradi', () => {
    const b = body([[21, 90], [14, 88.5], [7, 87], [0, 85.5]]);
    const s = goalStatus(goal({ kind: 'weight', start: 90, target: 78 }), ctx({ body: b }));
    expect(s.tip).toMatch(/Juda tez/);
  });

  it('juda tez ozishda xavfsiz oraliq kg’da aytiladi; me’yordagi vazn olish ogohlantirilmaydi', () => {
    const fast = goalStatus(goal({ kind: 'weight', start: 90, target: 78 }), ctx({ body: body([[21, 90], [14, 88.5], [7, 87], [0, 85.5]]) }));
    expect(fast.tip).toMatch(/0\.4–0\.9 kg/);
    // 63 kg da haftasiga ~0.32 kg (0.5%) — chegarada, ogohlantirish yo'q
    const gain = goalStatus(goal({ kind: 'weight', start: 62.4, target: 66 }), ctx({ body: body([[13, 62.4], [6, 62.6], [0, 63]]) }));
    expect(gain.tip).toBeUndefined();
  });

  it('teskari yo‘nalish — ortda, kaloriya maslahati', () => {
    const b = body([[21, 80], [14, 80.5], [7, 81], [0, 81.5]]);
    const s = goalStatus(goal({ kind: 'weight', start: 80, target: 75 }), ctx({ body: b }));
    expect(s.state).toBe('behind');
    expect(s.tip).toMatch(/ortib/);
    expect(s.progress).toBe(0);
  });

  it('vazn olish maqsadi yetilsa — done', () => {
    const s = goalStatus(goal({ kind: 'weight', start: 70, target: 73 }), ctx({ body: body([[0, 73.2]]) }));
    expect(s.state).toBe('done');
  });
});

describe('Mashg‘ulotlar soni (oyiga)', () => {
  const finished = (d: number): WorkoutLog => ({ id: `W${d}`, title: 't', startedAt: ago(d).toISOString(), finishedAt: ago(d).toISOString(), durationMin: 40, exercises: [] });

  it('oy yarmida 2/12 — ortda, haftalik sur’at maslahati', () => {
    const s = goalStatus(goal({ kind: 'workouts', start: 0, target: 12 }), ctx({ logs: [finished(10), finished(3)] }));
    expect(s.current).toBe(2);
    expect(s.state).toBe('behind');
    expect(s.tip).toMatch(/haftasiga/);
  });

  it('o‘tgan oy va tugallanmaganlar hisoblanmaydi; yetilsa — done', () => {
    const old = finished(20); // 23-fevral
    const open: WorkoutLog = { ...finished(1), id: 'open', finishedAt: undefined };
    const many = [1, 2, 4, 5, 6, 8].map(finished);
    expect(goalStatus(goal({ kind: 'workouts', target: 6 }), ctx({ logs: [old, open, ...many] })).state).toBe('done');
    expect(goalStatus(goal({ kind: 'workouts', target: 6 }), ctx({ logs: [old, open] })).current).toBe(0);
  });
});

describe('goalDefaults', () => {
  it('maqsadga mos taklif', () => {
    expect(goalDefaults('workouts', ctx())).toEqual({ start: 0, target: 12 });
    expect(goalDefaults('weight', { ...ctx(), goal: 'fatLoss' })).toEqual({ start: 80, target: 75 });
    expect(goalDefaults('weight', { ...ctx(), goal: 'muscle' })).toEqual({ start: 80, target: 83 });
    const d = goalDefaults('lift', ctx({ logs: [log('back-squat', 100, 5, 2)] }), 'back-squat');
    expect(d.target % 2.5).toBe(0);
    expect(d.target).toBeGreaterThan(d.start);
  });
});
