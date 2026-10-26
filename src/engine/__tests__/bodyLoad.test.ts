import { describe, expect, it } from 'vitest';
import { MUSCLES } from '../../data/catalog';
import { fatigueLoad, loadGroups, planLoad, weekLoad } from '../bodyLoad';
import type { WorkoutLog } from '../../types';

const log = (startedAt: string, exerciseId: string, sets: { done: boolean; warmup?: boolean }[]): WorkoutLog => ({
  id: startedAt,
  title: 'x',
  startedAt,
  finishedAt: startedAt,
  durationMin: 30,
  exercises: [{ exerciseId, sets: sets.map((s) => ({ kg: 50, reps: 8, ...s })) }],
});

describe('3D tanada yoritish', () => {
  it('reja: eng ko‘p ishlaydigan mushak 100, tartib kamayish bo‘yicha', () => {
    const l = planLoad([{ exerciseId: 'bench-press', sets: 4 }]);
    expect(l[0].mvic).toBe(100);
    expect(l.map((a) => a.key)).toContain('pecMid');
    for (let i = 1; i < l.length; i++) expect(l[i].mvic).toBeLessThanOrEqual(l[i - 1].mvic);
    // ko'krak mashqida son mushagi yonmaydi
    expect(l.find((a) => a.key === 'rectusFemoris')).toBeUndefined();
    expect(loadGroups(l, MUSCLES)[0]).toBe(MUSCLES.chest.name);
  });

  it('hafta: faqat bajarilgan ishchi setlar, haftadan oldingisi hisobga olinmaydi', () => {
    const since = new Date('2026-10-26T00:00:00');
    const logs = [
      log('2026-10-26T10:00:00', 'back-squat', [{ done: true, warmup: true }, { done: true }, { done: true }, { done: false }]),
      log('2026-10-20T10:00:00', 'bench-press', [{ done: true }, { done: true }, { done: true }]),
    ];
    const l = weekLoad(logs, since);
    expect(l.length).toBeGreaterThan(0);
    expect(l.some((a) => a.key.startsWith('pec'))).toBe(false);
    const quads = l.find((a) => a.key === 'vastusLateralis' || a.key === 'vastusMedialis');
    expect(quads?.sets).toBeGreaterThan(0);
    expect(quads!.sets!).toBeLessThanOrEqual(2);
  });

  it('tiklanish: faqat 80% dan past tiklangan mushaklar', () => {
    const l = fatigueLoad({ quads: 0.4, chest: 0.95 });
    expect(l.map((a) => a.key)).toEqual(expect.arrayContaining(['rectusFemoris', 'vastusLateralis']));
    expect(l.some((a) => a.key.startsWith('pec'))).toBe(false);
    expect(l[0].mvic).toBe(60);
  });
});
