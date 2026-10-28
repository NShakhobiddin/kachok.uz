import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { BODYMAP } from '../../data/bodymap';
import { EQUIPMENT, MUSCLES } from '../../data/catalog';
import { EQUIPMENT_WITH_IMG } from '../../data/equipmentImages';
import { EXERCISE_MAP } from '../../data/exercises';
import { ILLUSTRATIONS } from '../../data/illustrations';
import { activationFor } from '../activation';

const entries = Object.entries(ILLUSTRATIONS).flatMap(([id, ill]) => (ill ? [[id, ill] as const] : []));
const inPct = (v: number) => v >= 0 && v <= 100;

describe('Mashq illyustratsiyalari', () => {
  it('har bir rasm mavjud mashqqa tegishli va fayli bor', () => {
    expect(entries.length).toBeGreaterThan(0);
    for (const [id, ill] of entries) {
      expect(EXERCISE_MAP[id], id).toBeDefined();
      const file = ill.src.split('/illustrations/')[1];
      expect(existsSync(resolve(__dirname, '../../../public/illustrations', file)), file).toBe(true);
      expect(ill.alt.length, id).toBeGreaterThan(20);
    }
  });

  it('yorliqdagi har bir mushak shu mashqning EMG jadvalida bor', () => {
    for (const [id, ill] of entries) {
      const keys = new Set(activationFor(EXERCISE_MAP[id]).list.map((a) => a.key));
      const labels = ill.labels ?? [];
      for (const l of labels) expect(keys.has(l.key), `${id}: ${l.key}`).toBe(true);
      expect(new Set(labels.map((l) => l.key)).size, id).toBe(labels.length);
    }
  });

  it('koordinatalar rasm ichida, bir ustundagi yorliqlar bir-birini yopmaydi', () => {
    for (const [id, ill] of entries) {
      for (const layer of [ill.labels ?? [], ill.checks ?? []]) {
        for (const p of layer) for (const v of [p.x, p.y, p.ly]) expect(inPct(v), `${id}: ${v}`).toBe(true);
        for (const side of ['l', 'r'] as const) {
          const ys = layer
            .filter((p) => p.side === side)
            .map((p) => p.ly)
            .sort((a, b) => a - b);
          for (let i = 1; i < ys.length; i++) expect(ys[i] - ys[i - 1], `${id} ${side}: ${ys[i - 1]} → ${ys[i]}`).toBeGreaterThanOrEqual(12);
        }
      }
    }
  });

  it('o‘zbek imlosi: o‘ va g‘ to‘g‘ri belgi bilan', () => {
    for (const [id, ill] of entries) {
      for (const t of [ill.phase, ill.alt, ...(ill.checks ?? []).map((c) => c.text), ...(ill.labels ?? []).map((l) => l.name ?? '')]) expect(t, `${id}: ${t}`).not.toMatch(/[og]['`’]/i);
    }
  });
});

describe('Jihoz rasmlari', () => {
  it('ro‘yxatdagi har bir rasm mavjud jihozga tegishli va fayli bor', () => {
    const ids = new Set(EQUIPMENT.map((e) => e.id));
    for (const id of EQUIPMENT_WITH_IMG) {
      expect(ids.has(id), id).toBe(true);
      expect(existsSync(resolve(__dirname, '../../../public/illustrations/equipment', `${id}.webp`)), id).toBe(true);
    }
    expect(new Set(EQUIPMENT_WITH_IMG).size).toBe(EQUIPMENT_WITH_IMG.length);
  });
});

describe('Tana xaritasi (3D modeldan render)', () => {
  it('tasvirlar bor, har bir mushak guruhi kamida bitta ko‘rinishda chizilgan', () => {
    const seen = new Set<string>();
    for (const view of ['front', 'back'] as const) {
      const m = BODYMAP[view];
      for (const kind of ['base', 'glow']) expect(existsSync(resolve(__dirname, '../../../public/bodymap', `${view}-${kind}.webp`)), `${view}-${kind}`).toBe(true);
      for (const [id, d] of Object.entries(m.paths)) {
        expect(MUSCLES[id as keyof typeof MUSCLES], id).toBeDefined();
        expect(d, `${view}.${id}`).toMatch(/^M [\d.]+ [\d.]+ /);
        // koordinatalar tasvir ichida
        const nums = d!.match(/-?\d+(\.\d+)?/g)!.map(Number);
        nums.forEach((v, i) => expect(v).toBeLessThanOrEqual((i % 2 ? m.h : m.w) + 1));
        seen.add(id);
      }
    }
    expect([...seen].sort()).toEqual(Object.keys(MUSCLES).sort());
  });
});
