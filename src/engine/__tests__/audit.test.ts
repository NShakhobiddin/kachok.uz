// Audit (2026-11) da topilgan dvigatel xatolari — qaytmasligi uchun.
import { describe, expect, it } from 'vitest';
import { EQUIPMENT_PRESETS } from '../../data/catalog';
import { EXERCISE_MAP } from '../../data/exercises';
import { safetyFor } from '../../data/safety';
import { rotationKeys, weekDays } from '../../lib/useToday';
import type { PlannedExercise, Profile, Program, SetLog, WorkoutLog } from '../../types';
import { adaptiveTdee, nutritionPlan, referenceWeight } from '../nutrition';
import { alternatives, DEFAULT_DAYS, generateProgram } from '../program';
import { exerciseHistory, suggest, warmupSets } from '../progression';
import { exerciseSeries } from '../stats';

const base: Profile = {
  name: 'Test',
  sex: 'male',
  age: 30,
  heightCm: 180,
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
  dietPrefs: { noPork: false, lactoseFree: false, vegetarian: false },
  createdAt: '2026-01-01',
};
const ctx = { bodyKg: 80, sex: 'male' as const, level: 'intermediate' as const };
let n = 0;
const log = (exId: string, sets: Partial<SetLog>[], extra: Partial<WorkoutLog> = {}, day?: number): WorkoutLog => {
  n++;
  day ??= n;
  const at = new Date(Date.UTC(2026, 0, day, 10)).toISOString();
  return { id: `L${n}-${exId}`, title: 't', startedAt: at, finishedAt: at, durationMin: 50, exercises: [{ exerciseId: exId, sets: sets.map((s) => ({ kg: 0, reps: 0, done: true, ...s })) as SetLog[] }], ...extra };
};

describe('Kuch bloki: RIR yozilmasa 1RM pasaymaydi', () => {
  it('rejadagidek bajarilgan 3 blokda boshlang‘ich vazn kamaymaydi', () => {
    const ex = EXERCISE_MAP['back-squat'];
    const pe: PlannedExercise = { exerciseId: 'back-squat', sets: 4, repMin: 6, repMax: 6, rir: 2, restSec: 240, scheme: 'block' };
    const logs: WorkoutLog[] = [];
    const starts: number[] = [];
    for (let block = 0; block < 3; block++)
      for (let week = 0; week < 5; week++) {
        const s = suggest(ex, pe, logs, { ...ctx, week, mesoWeeks: 5, deload: week === 4 });
        if (week === 0) starts.push(s.kg!);
        logs.push(log('back-squat', Array.from({ length: s.sets }, () => ({ kg: s.kg!, reps: s.reps })), { deload: week === 4 }, logs.length * 7 + 1));
      }
    expect(starts[1]).toBeGreaterThanOrEqual(starts[0]);
    expect(starts[2]).toBeGreaterThanOrEqual(starts[1]);
  });
});

describe('Yordamchi trenajyor (gravitron): yordam kamaysa — og‘irroq', () => {
  const ex = EXERCISE_MAP['assisted-pull-up'];
  const pe: PlannedExercise = { exerciseId: ex.id, sets: 3, repMin: 8, repMax: 12, rir: 2, restSec: 120 };
  const logs = [log(ex.id, [{ kg: 60, reps: 9 }, { kg: 60, reps: 9 }, { kg: 60, reps: 9 }])];
  it('yengillashtirish va charchagan kunda yordam kamaymaydi; isinish seti yo‘q', () => {
    const normal = suggest(ex, pe, logs, ctx);
    expect(suggest(ex, pe, logs, { ...ctx, deload: true }).kg!).toBeGreaterThanOrEqual(normal.kg!);
    expect(suggest(ex, pe, logs, { ...ctx, readiness: 1 }).kg!).toBeGreaterThanOrEqual(normal.kg!);
    expect(warmupSets(ex, 40, 8)).toEqual([]);
  });
});

describe('Charchagan kun tayanch bo‘lmaydi', () => {
  it('chiziqli: charchagan kundagi 2×5 dan keyin vazn oshadi', () => {
    const ex = EXERCISE_MAP['back-squat'];
    const pe: PlannedExercise = { exerciseId: ex.id, sets: 3, repMin: 5, repMax: 5, rir: 2, restSec: 180, scheme: 'linear' };
    const logs = [log(ex.id, [{ kg: 100, reps: 5 }, { kg: 100, reps: 5 }, { kg: 100, reps: 5 }]), log(ex.id, [{ kg: 95, reps: 5 }, { kg: 95, reps: 5 }], { readiness: 1.5 })];
    expect(suggest(ex, pe, logs, ctx).kg).toBe(105);
  });
});

describe('Hech bir set repMin ga yetmasa — 1RM chegarasi', () => {
  it('3×5@100 dan keyin 8–12 takrorli sxemada 100 kg × 8 taklif qilinmaydi', () => {
    const ex = EXERCISE_MAP['bench-press'];
    const pe: PlannedExercise = { exerciseId: ex.id, sets: 3, repMin: 8, repMax: 12, rir: 2, restSec: 120 };
    const s = suggest(ex, pe, [log(ex.id, [{ kg: 100, reps: 5 }, { kg: 100, reps: 5 }, { kg: 100, reps: 5 }])], ctx);
    expect(s.kg!).toBeLessThan(100);
  });
});

describe('Bir mashg‘ulotda mashq ikki marta', () => {
  const at = '2026-02-01T10:00:00.000Z';
  const twice: WorkoutLog = {
    id: 'dup',
    title: 't',
    startedAt: at,
    finishedAt: at,
    durationMin: 50,
    exercises: [
      { exerciseId: 'bench-press', sets: [{ kg: 80, reps: 12, done: true }] as SetLog[] },
      { exerciseId: 'bench-press', sets: [{ kg: 80, reps: 9, done: true }, { kg: 80, reps: 8, done: true }] as SetLog[] },
    ],
  };
  it('tarix va grafik barcha setlarni ko‘radi; "barcha setlar 12" deb vazn oshirilmaydi', () => {
    expect(exerciseHistory('bench-press', [twice])[0].sets).toHaveLength(3);
    expect(exerciseSeries('bench-press', [twice])[0]?.volume ?? 2320).toBe(2320);
    const pe: PlannedExercise = { exerciseId: 'bench-press', sets: 3, repMin: 8, repMax: 12, rir: 2, restSec: 120 };
    expect(suggest(EXERCISE_MAP['bench-press'], pe, [twice], ctx).kind).not.toBe('up');
  });
  it('tashlab ketilgan mashg‘ulot (3 dan 1 set) — "barchasi bajarildi" emas', () => {
    const pe: PlannedExercise = { exerciseId: 'bench-press', sets: 3, repMin: 8, repMax: 12, rir: 2, restSec: 120 };
    const s = suggest(EXERCISE_MAP['bench-press'], pe, [log('bench-press', [{ kg: 80, reps: 12 }])], ctx);
    expect(s.kind).not.toBe('up');
  });
});

describe('Ehtiyotkor rejim (sog‘liq so‘rovnomasi): almashtirish ro‘yxati ham xavfsiz', () => {
  it('yuqori xavfli yoki murakkab mashqlar taklif qilinmaydi', () => {
    const p = { ...base, healthFlags: ['heart'] };
    for (const id of ['leg-press', 'db-bench', 'db-row'])
      for (const e of alternatives(id, p)) {
        expect(e.level, `${id} → ${e.id}`).toBeLessThan(3);
        expect(safetyFor(e.id)?.risk ?? 1, `${id} → ${e.id}`).toBeLessThan(3);
      }
  });
});

describe('Chiziqli A/B navbati o‘tkazib yuborilgan mashg‘ulotdan keyin buzilmaydi', () => {
  const program: Program = { ...generateProgram({ ...base, level: 'beginner', goal: 'strength' }), method: 'linear' } as Program;
  it('dastur chiziqli A/B (3 kun)', () => {
    expect(program.days).toHaveLength(3);
  });
  it('Du A, Ch B, Ju o‘tkazib yuborildi → keyingi Du — A (B dan keyin)', () => {
    if (program.method !== 'linear' || program.days.length !== 3) return;
    const [a, b] = program.days;
    const start = new Date(2026, 10, 9); // dushanba
    const p = { ...program, startDate: '2026-11-09' };
    const at = (d: number) => new Date(2026, 10, 9 + d, 18).toISOString();
    const logs: WorkoutLog[] = [
      { id: 'w1', title: a.title, dayId: a.id, startedAt: at(0), finishedAt: at(0), durationMin: 50, exercises: [] },
      { id: 'w2', title: b.title, dayId: b.id, startedAt: at(2), finishedAt: at(2), durationMin: 50, exercises: [] },
    ];
    const nextWeek = new Date(2026, 10, 16);
    const keys = rotationKeys(p, null, logs, nextWeek, 0);
    const days = weekDays(p, null, keys).sort((x, y) => x.weekday - y.weekday);
    expect(days[0].exercises.map((e) => e.exerciseId)).toEqual(a.exercises.map((e) => e.exerciseId));
    // shu haftaning o'zida: dushanba bajarildi, chorshanba o'tkazib yuborildi → juma — B
    const keys2 = rotationKeys(p, null, logs.slice(0, 1), start, 4);
    const days2 = weekDays(p, null, keys2).sort((x, y) => x.weekday - y.weekday);
    expect(days2[2].exercises.map((e) => e.exerciseId)).toEqual(b.exercises.map((e) => e.exerciseId));
  });
});

describe('Ovqatlanish', () => {
  it('BMI 30 chegarasida oqsil keskin sakramaydi', () => {
    const at = (kg: number) => nutritionPlan({ ...base, weightKg: kg }).protein;
    expect(Math.abs(at(97.2) - at(97.3))).toBeLessThanOrEqual(2);
    expect(referenceWeight(150, 180)).toBeLessThan(150);
    expect(referenceWeight(150, 180)).toBeGreaterThan(97.2);
  });
  it('bugungi chala yozilgan ovqat moslashuvchan sarfga ta’sir qilmaydi', () => {
    const food = Array.from({ length: 20 }, (_, i) => ({ date: `2026-11-${String(i + 1).padStart(2, '0')}`, kcal: 2500 }));
    const body = Array.from({ length: 20 }, (_, i) => ({ date: `2026-11-${String(i + 1).padStart(2, '0')}`, weightKg: 80 }));
    const a = adaptiveTdee(food, body, 2500, '2026-11-21');
    const b = adaptiveTdee([...food, { date: '2026-11-21', kcal: 1100 }], body, 2500, '2026-11-21');
    expect(b.tdee).toBe(a.tdee);
  });
});
