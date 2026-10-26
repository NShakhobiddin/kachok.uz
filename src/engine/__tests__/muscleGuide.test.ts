import { describe, expect, it } from 'vitest';
import { EXERCISE_MAP } from '../../data/exercises';
import { ATLAS_ORDER, bestExercises, MUSCLE_GUIDE, REGIONS } from '../../data/muscleGuide';
import { M3_KEYS } from '../../data/muscles3d';
import { sourceById } from '../../data/sources';

describe('Mushaklar atlasi', () => {
  it('3D modeldagi har bir mushak uchun to‘liq qo‘llanma bor', () => {
    expect(Object.keys(MUSCLE_GUIDE).sort()).toEqual([...M3_KEYS].sort());
    const regions = new Set(REGIONS.map((r) => r.id));
    for (const k of M3_KEYS) {
      const g = MUSCLE_GUIDE[k];
      expect(regions.has(g.region), k).toBe(true);
      for (const f of ['short', 'where', 'origin', 'insertion', 'daily', 'feel', 'stretch', 'watch'] as const) expect(g[f].length, `${k}.${f}`).toBeGreaterThan(10);
      expect(g.actions.length, k).toBeGreaterThan(0);
    }
  });

  it('atlas tartibida har bir mushak bir martadan', () => {
    expect(ATLAS_ORDER.length).toBe(M3_KEYS.length);
    expect(new Set(ATLAS_ORDER).size).toBe(M3_KEYS.length);
  });

  it('har bir mushak uchun EMG bo‘yicha kamida bitta mashq, kamayish tartibida', () => {
    for (const k of M3_KEYS) {
      const b = bestExercises(k);
      expect(b.length, k).toBeGreaterThan(0);
      for (const x of b) expect(EXERCISE_MAP[x.id], `${k} → ${x.id}`).toBeDefined();
      for (let i = 1; i < b.length; i++) expect(b[i].mvic).toBeLessThanOrEqual(b[i - 1].mvic);
    }
    // ko'krakning o'rta qismi uchun yotib jim yetakchilar orasida
    expect(bestExercises('pecMid', 3).map((x) => x.id)).toContain('bench-press');
  });

  it('o‘zbek imlosi: o‘ va g‘ to‘g‘ri belgi bilan', () => {
    for (const k of M3_KEYS) {
      const g = MUSCLE_GUIDE[k];
      for (const t of [g.short, g.where, g.origin, g.insertion, g.daily, g.feel, g.stretch, g.watch, g.fact ?? '', ...g.actions]) expect(t, `${k}: ${t}`).not.toMatch(/[og]['`’]/i);
    }
  });

  it('anatomiya manbasi ro‘yxatda', () => {
    expect(sourceById('openstax2022')).toBeDefined();
  });
});
