import { describe, expect, it } from 'vitest';
import { EXERCISE_MAP } from '../../data/exercises';
import { mesoPlan, mesoState, setChange, weekRir } from '../meso';
import { suggest } from '../progression';
import { e1rmFromSet, loadFor, pct1rm, refE1rm } from '../rpe';
import type { PlannedExercise, Profile, Program, WorkoutLog } from '../../types';
import { EQUIPMENT_PRESETS } from '../../data/catalog';
import { blockWeek, resolveMethod } from '../methods';
import { adaptiveTdee, dailyIntake } from '../nutrition';
import { navyBodyFat, whtr, whtrZone } from '../bodycomp';
import { searchFoods } from '../../data/foods';
import { DEFAULT_DAYS, generateProgram, hasEquipment } from '../program';

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

describe('Dastur uslublari', () => {
  const base = {
    name: 'T', sex: 'male', age: 30, heightCm: 178, weightKg: 80, goal: 'muscle', level: 'intermediate', daysPerWeek: 3, sessionMin: 60,
    trainingDays: DEFAULT_DAYS[3], equipment: EQUIPMENT_PRESETS[0].items, injuries: [], focus: [], activity: 'light', healthFlags: [],
    dietPrefs: { noPork: true, lactoseFree: false, vegetarian: false }, createdAt: '2026-01-01',
  } as Profile;

  it('avtomatik tanlov: kuch maqsadida boshlovchi — chiziqli, tajribali — blok', () => {
    expect(resolveMethod({ ...base, goal: 'strength', level: 'beginner' })).toBe('linear');
    expect(resolveMethod({ ...base, goal: 'strength' })).toBe('strength');
    expect(resolveMethod(base)).toBe('hypertrophy');
    expect(resolveMethod({ ...base, method: 'powerbuilding', daysPerWeek: 3 })).toBe('hypertrophy');
    expect(resolveMethod({ ...base, method: 'powerbuilding', daysPerWeek: 4 })).toBe('powerbuilding');
  });

  it('kuch bloki: 75 → 80 → 85 → 88 %, keyin yengillashtirish', () => {
    expect([0, 1, 2, 3, 4].map((w) => blockWeek(w, 5).pct)).toEqual([0.75, 0.8, 0.85, 0.88, 0.65]);
    expect(blockWeek(4, 5).deload).toBe(true);
    // uzunroq blok — reja cho'ziladi, monoton o'sadi
    const long = [0, 1, 2, 3, 4, 5].map((w) => blockWeek(w, 7).pct);
    for (let i = 1; i < long.length; i++) expect(long[i]).toBeGreaterThanOrEqual(long[i - 1]);
  });

  it('chiziqli A/B: har kuni o‘tirib-turish 3×5, o‘lik tortish 2×5', () => {
    const prog = generateProgram({ ...base, method: 'linear', level: 'beginner' });
    expect(prog.method).toBe('linear');
    expect(prog.days.map((d) => d.title)).toEqual(['Kuch A', 'Kuch B', 'Kuch A′']);
    for (const d of prog.days) {
      const sq = d.exercises.find((e) => e.exerciseId === 'back-squat');
      expect(sq, d.title).toMatchObject({ sets: 3, repMin: 5, repMax: 5, scheme: 'linear' });
    }
    expect(prog.days[1].exercises.find((e) => e.exerciseId === 'deadlift')).toMatchObject({ sets: 2, repMin: 5, scheme: 'linear' });
  });

  it('kuch bloki: asosiy mashqlar %1RM sxemasida, yordamchilar oddiy', () => {
    const prog = generateProgram({ ...base, method: 'strength' });
    expect(prog.mesoWeeks).toBe(5);
    const all = prog.days.flatMap((d) => d.exercises);
    expect(all.filter((e) => e.scheme === 'block').length).toBeGreaterThanOrEqual(6);
    expect(all.filter((e) => e.scheme === 'block').every((e) => e.sets === 4 && e.repMin === 6)).toBe(true);
    expect(all.some((e) => !e.scheme)).toBe(true);
  });

  it('powerbuilding: 2 og‘ir + 2 hajm kuni', () => {
    const prog = generateProgram({ ...base, method: 'powerbuilding', daysPerWeek: 4, trainingDays: DEFAULT_DAYS[4] });
    expect(prog.days.map((d) => d.title)).toEqual(['Yuqori — kuch', 'Pastki — kuch', 'Yuqori — hajm', 'Pastki — hajm']);
    expect(prog.days[0].exercises[0]).toMatchObject({ repMin: 4, repMax: 6 });
    expect(prog.days[2].exercises.every((e) => e.repMin >= 6)).toBe(true);
  });

  it('har uslub × kunlar × jihoz — yaroqli dastur', () => {
    for (const method of ['hypertrophy', 'strength', 'linear', 'powerbuilding'] as const)
      for (const days of [2, 3, 4, 5, 6])
        for (const preset of EQUIPMENT_PRESETS)
          for (const level of ['beginner', 'advanced'] as const) {
            const prog = generateProgram({ ...base, method, level, daysPerWeek: days, trainingDays: DEFAULT_DAYS[days], equipment: preset.items });
            expect(prog.days.length).toBe(days);
            for (const d of prog.days) {
              expect(d.exercises.length, `${method} ${preset.id} ${days} ${d.title}`).toBeGreaterThanOrEqual(preset.id === 'bodyweight' ? 1 : 3);
              expect(new Set(d.exercises.map((e) => e.exerciseId)).size).toBe(d.exercises.length);
              for (const pe of d.exercises) expect(hasEquipment(EXERCISE_MAP[pe.exerciseId], preset.items)).toBe(true);
            }
          }
  });

  const sq = EXERCISE_MAP['back-squat'];
  const bench = EXERCISE_MAP['bench-press'];
  const mk = (i: number, exId: string, sets: [number, number, number?][]): WorkoutLog => ({
    id: 'm' + i, title: '', startedAt: `2026-05-${String(10 + i).padStart(2, '0')}T10:00:00Z`, finishedAt: 'x', durationMin: 60,
    exercises: [{ exerciseId: exId, sets: sets.map(([kg, reps, rir]) => ({ kg, reps, rir, done: true })) }],
  });
  const ctx = { bodyKg: 80, sex: 'male' as const, level: 'intermediate' as const };

  it('blok tavsiyasi: 3-hafta 4×4 @85% 1RM', () => {
    const logs = [mk(1, 'back-squat', [[100, 5, 2], [100, 5, 2], [100, 5, 2]])];
    const pe: PlannedExercise = { exerciseId: 'back-squat', sets: 4, repMin: 6, repMax: 6, rir: 2, restSec: 240, scheme: 'block' };
    const s = suggest(sq, pe, logs, { ...ctx, week: 2, mesoWeeks: 5 });
    const e1 = e1rmFromSet(100, 5, 2);
    expect(s.sets).toBe(4);
    expect(s.reps).toBe(4);
    expect(s.kg).toBe(Math.round((e1 * 0.85) / 2.5) * 2.5);
    expect(s.rir).toBeGreaterThanOrEqual(0.5);
    expect(s.rir).toBeLessThanOrEqual(2);
    expect(s.reason).toMatch(/3-hafta/);
    const dl = suggest(sq, pe, logs, { ...ctx, week: 4, mesoWeeks: 5 });
    expect(dl.kind).toBe('deload');
    expect(dl.reps).toBe(5);
  });

  it('chiziqli: oyoq +5 kg, yuqori tana +2.5 kg, ikki marta yetmasa −10%', () => {
    const pe = (id: string): PlannedExercise => ({ exerciseId: id, sets: 3, repMin: 5, repMax: 5, rir: 2, restSec: 180, scheme: 'linear' });
    expect(suggest(sq, pe('back-squat'), [mk(1, 'back-squat', [[60, 5], [60, 5], [60, 5]])], ctx).kg).toBe(65);
    expect(suggest(bench, pe('bench-press'), [mk(1, 'bench-press', [[40, 5], [40, 5], [40, 5]])], ctx).kg).toBe(42.5);
    // chegarada (RIR 0) — qadam yarmi
    expect(suggest(sq, pe('back-squat'), [mk(1, 'back-squat', [[60, 5, 1], [60, 5, 0], [60, 5, 0]])], ctx).kg).toBe(62.5);
    const miss1 = [mk(2, 'back-squat', [[100, 5], [100, 4], [100, 3]])];
    expect(suggest(sq, pe('back-squat'), miss1, ctx).kg).toBe(100);
    const miss2 = [...miss1, mk(1, 'back-squat', [[100, 5], [100, 5], [100, 4]])];
    expect(suggest(sq, pe('back-squat'), miss2, ctx)).toMatchObject({ kg: 90, kind: 'down' });
  });
});

describe('Moslashuvchan sarf va tana tarkibi', () => {
  const day = (i: number) => new Date(Date.UTC(2026, 4, 1) + i * 86400000).toISOString().slice(0, 10);
  it('kundalik + vazn: haqiqiy sarf formulasidan past bo‘lsa — baho pastga siljiydi', () => {
    // haqiqiy sarf 2200, formula 2500, iste'mol 2000 → kuniga −0.026 kg
    const food = Array.from({ length: 28 }, (_, i) => ({ date: day(i), kcal: 2000 + ((i * 37) % 120) - 60 }));
    const body = Array.from({ length: 28 }, (_, i) => ({ date: day(i), weightKg: 80 - (i * 200) / 7700 + Math.sin(i * 2.1) * 0.4 }));
    const est = adaptiveTdee(food, body, 2500, day(27));
    expect(est.updates).toBe(3);
    expect(est.tdee).toBeLessThan(2350);
    expect(est.tdee).toBeGreaterThan(2150);
    expect(est.observed!).toBeGreaterThan(2000);
    expect(est.observed!).toBeLessThan(2450);
    expect(est.trendPerWeek!).toBeLessThan(0);
  });
  it('ma’lumot kam bo‘lsa — formula o‘zgarmaydi; chala kunlar hisobga olinmaydi', () => {
    const est = adaptiveTdee([{ date: day(0), kcal: 2000 }], [{ date: day(0), weightKg: 80 }], 2500, day(5));
    expect(est.tdee).toBe(2500);
    expect(est.confidence).toBe(0);
    expect(dailyIntake([{ date: day(0), kcal: 600 }, { date: day(1), kcal: 1900 }], 2500).size).toBe(1);
  });
  it('bir haftada ±150 kkal dan ko‘p sakramaydi', () => {
    const food = Array.from({ length: 21 }, (_, i) => ({ date: day(i), kcal: 1500 }));
    const body = Array.from({ length: 21 }, (_, i) => ({ date: day(i), weightKg: 80 }));
    const est = adaptiveTdee(food, body, 2500, day(20));
    expect(est.history.map((h) => h.tdee)).toEqual([2350, 2200]);
    expect(est.observed).toBe(1500);
  });
  it('US Navy yog‘ foizi va WHtR', () => {
    expect(navyBodyFat('male', 180, 85, 38)).toBeCloseTo(16.1, 1);
    expect(navyBodyFat('female', 165, 72, 32)).toBeNull();
    expect(navyBodyFat('female', 165, 72, 32, 98)).toBeGreaterThan(20);
    expect(whtr(85, 180)).toBeCloseTo(0.472, 3);
    expect(whtrZone(0.47).name).toBe('Sog‘lom');
    expect(whtrZone(0.55).tone).toBe('warn');
  });
  it('ovqat qidiruvi apostrofsiz ham topadi', () => {
    expect(searchFoods('lagmon')[0].id).toBe('lagmon');
    expect(searchFoods('osh')[0].id).toBe('osh');
    expect(searchFoods('tovuq').length).toBeGreaterThanOrEqual(3);
  });
});
