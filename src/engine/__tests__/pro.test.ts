import { describe, expect, it } from 'vitest';
import { EXERCISE_MAP } from '../../data/exercises';
import { mesoPlan, mesoState, setChange, weekRir } from '../meso';
import { suggest } from '../progression';
import { e1rmFromSet, loadFor, pct1rm, refE1rm } from '../rpe';
import type { PlannedExercise, Program, WorkoutLog } from '../../types';

describe('RPE jadvali va 1RM', () => {
  it('Helms/Tuchscherer jadvali kataklari', () => {
    expect(pct1rm(1, 0)).toBeCloseTo(1, 3);
    expect(pct1rm(3, 0)).toBeCloseTo(0.922, 3);
    expect(pct1rm(1, 1)).toBeCloseTo(0.955, 3);
    expect(pct1rm(7, 3)).toBeCloseTo(0.739, 3);
    // faqat reps + RIR ga bog'liq
    expect(pct1rm(5, 2)).toBeCloseTo(pct1rm(7, 0), 6);
  });
  it('100 kg × 5 @ RPE 8 → ~123 kg', () => {
    expect(e1rmFromSet(100, 5, 2)).toBeCloseTo(123.3, 0);
  });
  it('uzluksiz va kamayuvchi (jadval chegarasida sakrash yo‘q)', () => {
    let prev = pct1rm(1, 0) + 0.001;
    for (let n = 1; n <= 25; n += 0.5) {
      const p = pct1rm(n, 0);
      expect(p).toBeLessThan(prev);
      expect(prev - p).toBeLessThan(0.05);
      prev = p;
    }
  });
  it('1RM dan vazn va qaytish bir-biriga mos', () => {
    const e = e1rmFromSet(80, 8, 2);
    expect(loadFor(e, 8, 2)).toBeCloseTo(80, 6);
  });
  it('EMA: bitta yomon kun bahoni yarmigacha tortadi', () => {
    const good = [{ kg: 100, reps: 5, rir: 2 }];
    const bad = [{ kg: 90, reps: 5, rir: 2 }];
    const e = refE1rm([bad, good])!;
    expect(e).toBeGreaterThan(e1rmFromSet(90, 5, 2));
    expect(e).toBeLessThan(e1rmFromSet(100, 5, 2));
  });
});

describe('Mezotsikl', () => {
  it('RIR har hafta kamayadi, oxirgi hafta — deload', () => {
    expect(mesoPlan(5, 'intermediate').map((w) => w.rir)).toEqual([3, 2, 2, 1, 4]);
    expect(mesoPlan(5, 'advanced').map((w) => w.rir)).toEqual([3, 2, 1, 0, 4]);
    expect(weekRir(0, 6, 'beginner')).toBe(3);
    expect(weekRir(4, 6, 'beginner')).toBe(2);
  });
  it('hafta kalendar emas, bajarilgan mashg‘ulotlar bo‘yicha o‘tadi', () => {
    const program = { days: [{ id: 'a' }, { id: 'b' }, { id: 'c' }], mesoWeeks: 5, startDate: '2026-01-01' } as unknown as Program;
    const mk = (i: number, day: string): WorkoutLog => ({ id: 'l' + i, dayId: day, title: '', startedAt: `2026-03-${String(i + 1).padStart(2, '0')}T10:00:00Z`, finishedAt: 'x', durationMin: 50, exercises: [] });
    const logs = [mk(0, 'a'), mk(1, 'b'), mk(2, 'c'), mk(3, 'a')];
    const st = mesoState(program, logs, 'intermediate');
    expect(st.week).toBe(1);
    expect(st.sessionsInWeek).toBe(1);
    expect(st.rir).toBe(2);
  });
  it('RP qoidasi: hali og‘riyapti → −1, kam pump + oson + tez tiklanish → +2', () => {
    expect(setChange({ pump: 3, work: 2, recovery: 4 })).toBe(-1);
    expect(setChange({ pump: 1, work: 1, recovery: 1 })).toBe(2);
    expect(setChange({ pump: 2, work: 2, recovery: 3 })).toBe(0);
    expect(setChange({ pump: 2, work: 3, recovery: 3 })).toBe(-1);
  });
});

describe('Avtoregulyatsiya', () => {
  const ex = EXERCISE_MAP['back-squat'];
  const pe: PlannedExercise = { exerciseId: 'back-squat', sets: 3, repMin: 6, repMax: 8, rir: 2, restSec: 180 };
  const ctx = { bodyKg: 80, sex: 'male' as const, level: 'intermediate' as const };
  const log = (sets: [number, number, number?][]): WorkoutLog => ({
    id: 'x',
    title: '',
    startedAt: '2026-03-01T10:00:00Z',
    finishedAt: '2026-03-01T11:00:00Z',
    durationMin: 60,
    exercises: [{ exerciseId: 'back-squat', sets: sets.map(([kg, reps, rir]) => ({ kg, reps, rir, done: true })) }],
  });
  it('o‘tgan safar juda oson bo‘lsa vazn oshadi, lekin 5% dan ko‘p emas', () => {
    const s = suggest(ex, pe, [log([[100, 7, 4], [100, 7, 4], [100, 7, 4]])], ctx);
    expect(s.auto).toBe(true);
    expect(s.kg!).toBeGreaterThan(100);
    expect(s.kg!).toBeLessThanOrEqual(105);
  });
  it('og‘ir bo‘lsa (RIR 0) vazn kamayadi', () => {
    const s = suggest(ex, pe, [log([[100, 6, 0], [100, 6, 0], [100, 5, 0]])], { ...ctx, rir: 3 });
    expect(s.kg!).toBeLessThan(100);
    expect(s.reason).toContain('1RM');
  });
  it('RIR yozilmagan bo‘lsa — ikki bosqichli progressiya', () => {
    const s = suggest(ex, pe, [log([[100, 8], [100, 8], [100, 8]])], ctx);
    expect(s.auto).toBeUndefined();
    expect(s.kg).toBe(102.5);
  });
});

describe('Kuch me’yorlari', () => {
  it('80 kg erkak: o‘tirib-turish chegaralari tana vazniga nisbatan', async () => {
    const { thresholds, liftLevel } = await import('../standards');
    expect(thresholds('squat', 'male', 80)).toEqual([60, 100, 120, 180, 220]);
    const l = liftLevel('squat', 120, 'male', 80);
    expect(l.level).toBe(3);
    expect(l.percentile).toBe(50);
    expect(l.next?.name).toBe('Ilg‘or');
  });
  it('og‘irroq odam uchun nisbat chegarasi pastroq', async () => {
    const { thresholds } = await import('../standards');
    const heavy = thresholds('bench', 'male', 110)[2] / 110;
    const light = thresholds('bench', 'male', 65)[2] / 65;
    expect(heavy).toBeLessThan(light);
  });
});
