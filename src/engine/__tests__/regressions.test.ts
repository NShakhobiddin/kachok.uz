// Audit natijasida tuzatilgan xatolar uchun regressiya testlari (hisob-kitob dvigatellari va ma'lumotlar).
import { describe, expect, it } from 'vitest';
import { EQUIPMENT_PRESETS, GROUP_ORDER, VOLUME_LANDMARKS, WEEKLY_TARGET } from '../../data/catalog';
import { EXERCISE_MAP } from '../../data/exercises';
import { LESSONS } from '../../data/lessons';
import type { Goal, Level, Method, MuscleGroup, PlannedExercise, Profile, Program, SetLog, WorkoutLog } from '../../types';
import { deloadLogIds, mesoPerWeek, mesoState } from '../meso';
import { resolveMethod } from '../methods';
import { clampKcalAdjust, KCAL_ADJUST_MAX, mealPlan, nutritionPlan, weeklyCheck } from '../nutrition';
import { DEFAULT_DAYS, estimateMinutes, generateProgram, LEVEL_MAX_SETS, rotateLinear, weeklyVolume } from '../program';
import { roundLoad, startingWeight, suggest, warmupSets, workingWeight } from '../progression';
import { e1rmFromSet, pct1rm } from '../rpe';
import { allPRs, detectPRs } from '../stats';

const base: Profile = {
  name: 'T',
  sex: 'male',
  age: 30,
  heightCm: 178,
  weightKg: 80,
  goal: 'muscle',
  level: 'intermediate',
  daysPerWeek: 4,
  sessionMin: 60,
  trainingDays: DEFAULT_DAYS[4],
  equipment: EQUIPMENT_PRESETS[0].items,
  injuries: [],
  focus: [],
  activity: 'moderate',
  healthFlags: [],
  dietPrefs: { noPork: false, lactoseFree: false, vegetarian: false },
  createdAt: '2026-01-01',
};
const prof = (o: Partial<Profile>): Profile => ({ ...base, trainingDays: DEFAULT_DAYS[o.daysPerWeek ?? base.daysPerWeek], ...o });

const wlog = (id: string, date: string, exId: string, sets: Partial<SetLog>[], extra: Partial<WorkoutLog> = {}): WorkoutLog => ({
  id,
  title: 't',
  startedAt: `${date}T10:00:00.000Z`,
  finishedAt: `${date}T11:00:00.000Z`,
  durationMin: 60,
  exercises: [{ exerciseId: exId, sets: sets.map((s) => ({ kg: 0, reps: 0, done: true, ...s })) }],
  ...extra,
});
const ctx = { bodyKg: 80, sex: 'male' as const, level: 'intermediate' as const };

describe('Kaloriya: xavfsiz minimum va qo‘lda tuzatish', () => {
  const small = prof({ sex: 'female', weightKg: 55, heightCm: 160, age: 35, goal: 'fatLoss', activity: 'sedentary', daysPerWeek: 3, sessionMin: 45 });
  it('tuzatishdan keyin ham kaloriya minimumdan past emas, tuzatish ±300 bilan cheklanadi', () => {
    const np0 = nutritionPlan(small);
    for (const adj of [-120, -360, -600, -5000]) {
      const np = nutritionPlan(small, adj);
      expect(np.kcal).toBeGreaterThanOrEqual(np.floor);
      expect(np.kcal).toBeGreaterThanOrEqual(np0.floor);
    }
    const big = nutritionPlan(base, 5000);
    expect(big.kcalAdjust).toBe(KCAL_ADJUST_MAX);
    expect(big.kcal - nutritionPlan(base).kcal).toBeLessThanOrEqual(KCAL_ADJUST_MAX + 10);
    expect(clampKcalAdjust(-1000)).toBe(-KCAL_ADJUST_MAX);
    expect(clampKcalAdjust(NaN)).toBe(0);
  });
  it('makrolar yig‘indisi hech qachon kaloriyadan oshmaydi', () => {
    for (const sex of ['male', 'female'] as const)
      for (const goal of ['fatLoss', 'muscle', 'strength', 'recomp', 'health'] as Goal[])
        for (const w of [40, 55, 80, 120, 160])
          for (const h of [150, 175, 195])
            for (const adj of [-300, 0, 300])
              for (const bodyFat of [undefined, 8, 35]) {
                const np = nutritionPlan(prof({ sex, goal, weightKg: w, heightCm: h, activity: 'sedentary', bodyFat }), adj);
                expect(np.protein * 4 + np.fat * 9 + np.carbs * 4, `${sex} ${goal} ${w} ${h} ${adj}`).toBeLessThanOrEqual(np.kcal + 5);
                expect(np.kcal).toBeGreaterThanOrEqual(np.floor);
                expect(Math.min(np.protein, np.fat, np.carbs)).toBeGreaterThanOrEqual(0);
              }
  });
  it('moslashuvchan sarf yoqilganda qo‘lda tuzatish qo‘shilmaydi', () => {
    const p = prof({ goal: 'fatLoss' });
    expect(nutritionPlan(p, -240, 2500).kcal).toBe(nutritionPlan(p, 0, 2500).kcal);
    expect(nutritionPlan(p, -240, 2500).kcalAdjust).toBe(0);
  });
});

describe('Haftalik tekshiruv', () => {
  const series = (start: number, perWeek: number, n = 15) => Array.from({ length: n }, (_, i) => ({ date: `2026-10-${String(i + 1).padStart(2, '0')}`, weightKg: start + (i * perWeek) / 7 }));
  it('ozishda sekin kamayish — "tezroq oshmoqda" emas, "sekinroq kamaymoqda"', () => {
    const np = nutritionPlan(prof({ goal: 'fatLoss' }));
    const c = weeklyCheck(series(80, -0.2), np, 80)!;
    expect(c.delta).toBeLessThan(0);
    expect(c.message).toMatch(/sekinroq kamaymoqda/);
    expect(c.message).not.toMatch(/oshmoqda/);
    const gain = weeklyCheck(series(80, 0.3), np, 80)!;
    expect(gain.message).toMatch(/kamaymayapti/);
  });
  it('massada sekin oshish — kaloriya qo‘shish taklifi', () => {
    const np = nutritionPlan(prof({ goal: 'muscle' }));
    const c = weeklyCheck(series(80, 0), np, 80)!;
    expect(c.delta).toBeGreaterThan(0);
    expect(c.message).toMatch(/oshmayapti/);
  });
  it('tuzatish qo‘llangach shu yo‘nalishda qayta taklif qilinmaydi (tugma yo‘qoladi)', () => {
    const p = prof({ goal: 'fatLoss' });
    const entries = series(80, -0.2);
    const first = weeklyCheck(entries, nutritionPlan(p), 80)!;
    expect(first.delta).toBe(-120);
    const after = weeklyCheck(entries, nutritionPlan(p, first.delta), 80)!;
    expect(after.delta).toBe(0);
    expect(after.message).toMatch(/allaqachon/);
  });
  it('sana ma’lum bo‘lsa: 7 kun kutadi, keyin ±300 chegarasigacha davom etadi', () => {
    const p = prof({ goal: 'fatLoss' });
    const entries = series(80, -0.2);
    const wait = weeklyCheck(entries, nutritionPlan(p, -120), 80, { kcalAdjust: -120, adjustedAt: '2026-10-12' })!;
    expect(wait.delta).toBe(0);
    expect(wait.message).toMatch(/kun tortilib turing/);
    const more = weeklyCheck(entries, nutritionPlan(p, -120), 80, { kcalAdjust: -120, adjustedAt: '2026-10-05' })!;
    expect(more.delta).toBe(-120);
    const limit = weeklyCheck(entries, nutritionPlan(p, -300), 80, { kcalAdjust: -300, adjustedAt: '2026-10-05' })!;
    expect(limit.delta).toBe(0);
    const near = weeklyCheck(entries, nutritionPlan(p, -240), 80, { kcalAdjust: -240, adjustedAt: '2026-10-05' })!;
    expect(near.delta).toBe(-60);
  });
  it('kaloriya minimumda bo‘lsa kamaytirish taklif qilinmaydi', () => {
    const p = prof({ sex: 'female', weightKg: 55, heightCm: 160, age: 35, goal: 'fatLoss', activity: 'sedentary', daysPerWeek: 3, sessionMin: 45 });
    const np = nutritionPlan(p);
    expect(np.kcal).toBe(np.floor);
    const c = weeklyCheck(series(55, 0.1), np, 55)!;
    expect(c.delta).toBe(0);
    expect(c.message).toMatch(/minimumda/);
  });
});

describe('Ovqat rejasi', () => {
  it('laktozasiz va vegetarian rejalar ham kaloriyadan ±5% ichida', () => {
    for (const sex of ['male', 'female'] as const)
      for (const goal of ['fatLoss', 'muscle', 'health', 'strength', 'recomp'] as Goal[])
        for (const w of [45, 55, 80, 110, 140])
          for (const vegetarian of [false, true])
            for (const lactoseFree of [false, true]) {
              const prefs = { noPork: false, lactoseFree, vegetarian };
              const np = nutritionPlan(prof({ sex, goal, weightKg: w, heightCm: sex === 'male' ? 178 : 163, dietPrefs: prefs }));
              const meals = mealPlan(np, prefs);
              const kcal = meals.reduce((a, m) => a + m.kcal, 0);
              expect(Math.abs(kcal - np.kcal) / np.kcal, `${sex} ${goal} ${w} veg=${vegetarian} lf=${lactoseFree}`).toBeLessThanOrEqual(0.05);
              if (lactoseFree) expect(meals.flatMap((m) => m.items).some((i) => i.food.tags?.includes('dairy'))).toBe(false);
              if (vegetarian) expect(meals.flatMap((m) => m.items).some((i) => i.food.tags?.includes('meat') || i.food.tags?.includes('fish'))).toBe(false);
            }
  });
});

describe('Progressiya: yengillashtirish haftasi tayanch bo‘lmaydi', () => {
  const ex = EXERCISE_MAP['bench-press'];
  const pe: PlannedExercise = { exerciseId: 'bench-press', sets: 3, repMin: 6, repMax: 10, rir: 2, restSec: 150 };
  const pre = [
    wlog('a', '2026-10-01', 'bench-press', [
      { kg: 80, reps: 9, rir: 2 },
      { kg: 80, reps: 9, rir: 2 },
      { kg: 80, reps: 8, rir: 1 },
    ]),
    wlog('b', '2026-10-05', 'bench-press', [
      { kg: 80, reps: 9, rir: 2 },
      { kg: 80, reps: 9, rir: 2 },
      { kg: 80, reps: 9, rir: 1 },
    ]),
  ];
  const deloadSets = [
    { kg: 67.5, reps: 9, rir: 5 },
    { kg: 67.5, reps: 9, rir: 5 },
  ];
  it('logdagi deload belgisi bo‘yicha: keyingi tavsiya deloaddan oldingi natijadan', () => {
    const logs = [...pre, wlog('d', '2026-10-12', 'bench-press', deloadSets, { deload: true })];
    const clean = suggest(ex, pe, pre, { ...ctx, rir: 3 });
    const s = suggest(ex, pe, logs, { ...ctx, rir: 3 });
    expect(s.kg).toBe(clean.kg);
    expect(s.e1rm).toBe(clean.e1rm);
    expect(s.last?.date.slice(0, 10)).toBe('2026-10-05');
    // belgisiz (va dastursiz) — eski xatti-harakat: deload vazni tayanch bo'lib, tavsiya pastroq
    const legacy = suggest(ex, pe, [...pre, wlog('d', '2026-10-12', 'bench-press', deloadSets)], { ...ctx, rir: 3 });
    expect(legacy.kg!).toBeLessThan(s.kg!);
    // RIR yozilmagan ikki bosqichli progressiya: 80×9 dan davom etadi (67.5 dan emas)
    const noRir = (sets: { kg: number; reps: number }[]) => sets.map(({ kg, reps }) => ({ kg, reps }));
    const plain = suggest(ex, pe, [wlog('a', '2026-10-05', 'bench-press', noRir(pre[1].exercises[0].sets)), wlog('d', '2026-10-12', 'bench-press', noRir(deloadSets), { deload: true })], ctx);
    expect(plain).toMatchObject({ kg: 80, reps: 10 });
  });
  it('belgi bo‘lmasa — dastur va blok haftasi bo‘yicha qayta hisoblanadi', () => {
    // 2 kunlik dastur, 2 haftalik blok: 3–4-mashg'ulotlar — deload haftasi
    const program = { days: [{ id: 'x' }, { id: 'y' }], mesoWeeks: 2, startDate: '2026-01-01' } as unknown as Program;
    const logs = [
      wlog('1', '2026-10-01', 'bench-press', pre[0].exercises[0].sets, { dayId: 'x' }),
      wlog('2', '2026-10-03', 'bench-press', pre[1].exercises[0].sets, { dayId: 'y' }),
      wlog('3', '2026-10-08', 'bench-press', deloadSets, { dayId: 'x' }),
      wlog('4', '2026-10-10', 'bench-press', deloadSets, { dayId: 'y' }),
    ];
    expect([...deloadLogIds(program, logs)].sort()).toEqual(['3', '4']);
    // saqlangan belgi hisobdan ustun
    expect(deloadLogIds(program, [...logs.slice(0, 3), { ...logs[3], deload: false }]).has('4')).toBe(false);
    const s = suggest(ex, pe, logs, { ...ctx, rir: 3, program, perWeek: 2 });
    expect(s.kg).toBe(suggest(ex, pe, logs.slice(0, 2), { ...ctx, rir: 3 }).kg);
    expect(s.kg!).toBeGreaterThan(67.5 * 1.05); // +5% chegara deload vaznidan emas
    expect(s.kg!).toBeLessThanOrEqual(84); // +5% chegara — oxirgi oddiy mashg'ulotdan (80 kg)
  });
  it('kuch bloki: deloaddan keyingi 1RM deload vaznidan emas', () => {
    const sq = EXERCISE_MAP['back-squat'];
    const peB: PlannedExercise = { exerciseId: 'back-squat', sets: 4, repMin: 6, repMax: 6, rir: 2, restSec: 240, scheme: 'block' };
    const logs = [
      wlog(
        'w4',
        '2026-09-20',
        'back-squat',
        [1, 2, 3].map(() => ({ kg: 122.5, reps: 3 })),
      ),
      wlog(
        'dl',
        '2026-09-27',
        'back-squat',
        [1, 2, 3].map(() => ({ kg: 87.5, reps: 5 })),
        { deload: true },
      ),
    ];
    const s = suggest(sq, peB, logs, { ...ctx, week: 0, mesoWeeks: 5 });
    expect(s.e1rm!).toBeGreaterThan(130);
  });
});

describe('Progressiya: ishchi vazn, yaxlitlash, jihoz', () => {
  const ex = EXERCISE_MAP['bench-press'];
  const pe: PlannedExercise = { exerciseId: 'bench-press', sets: 3, repMin: 6, repMax: 10, rir: 2, restSec: 150 };
  it('bitta og‘ir set (100×1) tavsiyani buzmaydi — ishchi vazn 80 kg', () => {
    expect(
      workingWeight(
        [
          { kg: 100, reps: 1 },
          { kg: 80, reps: 8 },
          { kg: 80, reps: 8 },
        ],
        6,
      ),
    ).toBe(80);
    const s = suggest(
      ex,
      pe,
      [
        wlog('a', '2026-10-20', 'bench-press', [
          { kg: 100, reps: 1 },
          { kg: 80, reps: 8 },
          { kg: 80, reps: 8 },
        ]),
      ],
      ctx,
    );
    expect(s.kg).toBe(80);
    expect(s.reps).toBe(9);
    // RIR yozilgan bo'lsa ham +5% chegara ishchi vazndan
    const r = suggest(
      ex,
      pe,
      [
        wlog('a', '2026-10-20', 'bench-press', [
          { kg: 100, reps: 1, rir: 0 },
          { kg: 80, reps: 8, rir: 2 },
          { kg: 80, reps: 8, rir: 2 },
        ]),
      ],
      ctx,
    );
    expect(r.kg!).toBeLessThanOrEqual(84);
  });
  it('faqat bitta sinov seti bo‘lsa — vazn 1RM × %1RM(repMin, RIR) dan oshmaydi', () => {
    const s = suggest(ex, pe, [wlog('a', '2026-10-20', 'bench-press', [{ kg: 100, reps: 1 }])], ctx);
    expect(s.kg!).toBeLessThanOrEqual(roundLoad(ex, e1rmFromSet(100, 1) * pct1rm(6, 2)));
    const lin = suggest(
      ex,
      { ...pe, repMin: 5, repMax: 5, scheme: 'linear' },
      [
        wlog('a', '2026-10-20', 'bench-press', [
          { kg: 100, reps: 1 },
          { kg: 80, reps: 5 },
          { kg: 80, reps: 5 },
          { kg: 80, reps: 5 },
        ]),
      ],
      ctx,
    );
    expect(lin.kg).toBe(82.5);
  });
  it('boshlang‘ich vazn: yaxlitlanmagan taxmindan hisoblanadi, faqat oxirida yaxlitlanadi', () => {
    const ohp = EXERCISE_MAP['ohp'];
    const c = { bodyKg: 50, sex: 'female' as const, level: 'beginner' as const };
    const lin = suggest(ohp, { exerciseId: 'ohp', sets: 3, repMin: 5, repMax: 5, rir: 2, restSec: 180, scheme: 'linear' }, [], c);
    expect(lin.kg).toBe(20); // avval 25 kg edi (20 kg grifga yaxlitlangan taxmin qayta kattalashtirilgan)
    const blk = suggest(ohp, { exerciseId: 'ohp', sets: 4, repMin: 6, repMax: 6, rir: 2, restSec: 240, scheme: 'block' }, [], { ...c, week: 0, mesoWeeks: 5 });
    expect(blk.e1rm!).toBeLessThan(20);
    expect(blk.kg).toBe(20);
  });
  it('grif og‘irligi sozlamasi va isinish setlari', () => {
    expect(roundLoad(ex, 12, 15)).toBe(15);
    expect(roundLoad(ex, 16, 15)).toBe(15);
    expect(roundLoad(ex, 18, 15)).toBe(17.5);
    expect(startingWeight(ex, 50, 'female', 'beginner', 15)).toBe(15);
    expect(warmupSets(ex, 20, 5)).toEqual([]);
    expect(warmupSets(ex, 15, 5, 15)).toEqual([]);
    for (const kg of [22.5, 25, 40, 100]) for (const w of warmupSets(ex, kg, 5)) expect(w.kg!).toBeLessThan(kg);
    const s = suggest(ex, { ...pe, repMin: 5, repMax: 5, scheme: 'linear' }, [], { bodyKg: 50, sex: 'female', level: 'beginner', barKg: 15 });
    expect(s.kg).toBe(15);
  });
  it('eng og‘ir girya (48 kg) dan keyin 52 kg taklif qilinmaydi', () => {
    const kb = EXERCISE_MAP['kb-swing'];
    const s = suggest(
      kb,
      { exerciseId: 'kb-swing', sets: 3, repMin: 10, repMax: 15, rir: 2, restSec: 90 },
      [
        wlog(
          'a',
          '2026-10-20',
          'kb-swing',
          [1, 2, 3].map(() => ({ kg: 48, reps: 15 })),
        ),
      ],
      {
        ...ctx,
        level: 'advanced',
      },
    );
    expect(s.kg).toBe(48);
    expect(s.kind).not.toBe('up');
    const s2 = suggest(
      kb,
      { exerciseId: 'kb-swing', sets: 3, repMin: 10, repMax: 15, rir: 2, restSec: 90 },
      [
        wlog(
          'a',
          '2026-10-20',
          'kb-swing',
          [1, 2, 3].map(() => ({ kg: 16, reps: 15 })),
        ),
      ],
      ctx,
    );
    expect(s2.kg).toBe(20);
  });
  it('boldir ko‘tarish: gantel bo‘lmasa — tana vazni bilan takror progressiyasi', () => {
    const calf = EXERCISE_MAP['calf-raise'];
    const cpe: PlannedExercise = { exerciseId: 'calf-raise', sets: 3, repMin: 10, repMax: 15, rir: 1, restSec: 75 };
    const first = suggest(calf, cpe, [], { ...ctx, equipment: EQUIPMENT_PRESETS.find((p) => p.id === 'bodyweight')!.items });
    expect(first.kg).toBeNull();
    expect(first.kind).toBe('bodyweight');
    const next = suggest(
      calf,
      cpe,
      [
        wlog(
          'a',
          '2026-10-20',
          'calf-raise',
          [1, 2, 3].map(() => ({ kg: 0, reps: 12 })),
        ),
      ],
      ctx,
    );
    expect(next.kg).toBeNull();
    expect(next.reps).toBe(13);
    // gantel bor bo'lsa — vazn bilan
    expect(suggest(calf, cpe, [], { ...ctx, equipment: ['dumbbells'] }).kg).toBeGreaterThan(0);
  });
  it('vaqtli mashq (planka): matnda takror emas, soniya', () => {
    const plank = EXERCISE_MAP['plank'];
    const ppe: PlannedExercise = { exerciseId: 'plank', sets: 3, repMin: 20, repMax: 40, rir: 2, restSec: 60 };
    const s = suggest(plank, ppe, [], ctx);
    expect(s.reason).toMatch(/20–40 soniya/);
    expect(s.reason).not.toMatch(/takror/);
    const n = suggest(
      plank,
      ppe,
      [
        wlog(
          'a',
          '2026-10-20',
          'plank',
          [1, 2, 3].map(() => ({ kg: 0, reps: 25 })),
        ),
      ],
      ctx,
    );
    expect(n.reps).toBe(30);
    expect(n.reason).toMatch(/soniya/);
  });
});

describe('Dastur generatori: setlar, hajm, vaqt, ustuvor mushaklar', () => {
  const methods: (Method | undefined)[] = [undefined, 'hypertrophy', 'strength', 'linear', 'powerbuilding'];
  it('har mashqda set soni daraja chegarasidan oshmaydi (boshlovchi — 3)', () => {
    for (const level of ['beginner', 'intermediate', 'advanced'] as Level[])
      for (const method of methods)
        for (const goal of ['muscle', 'strength', 'fatLoss'] as Goal[])
          for (const d of [2, 3, 4, 5, 6])
            for (const sessionMin of [45, 90]) {
              const prog = generateProgram(prof({ level, method, goal, daysPerWeek: d, sessionMin }));
              for (const day of prog.days) for (const pe of day.exercises) expect(pe.sets, `${level} ${method} ${d}d ${pe.exerciseId}`).toBeLessThanOrEqual(LEVEL_MAX_SETS[level]);
            }
  });
  it('haftalik hajm guruhning yuqori chegarasidan oshmaydi (to‘liq zal, 4–6 kun)', () => {
    for (const level of ['beginner', 'intermediate', 'advanced'] as Level[])
      for (const d of [4, 5, 6])
        for (const sessionMin of [60, 90]) {
          const vol = weeklyVolume(generateProgram(prof({ level, daysPerWeek: d, sessionMin, goal: 'recomp' })));
          for (const g of GROUP_ORDER) expect(vol[g], `${level} ${d}d ${sessionMin}m ${g}`).toBeLessThanOrEqual(WEEKLY_TARGET[g][1]);
        }
  });
  it('taxminiy vaqt rejadan 10 daqiqadan oshmaydi (30 daqiqalik mashg‘ulot ham)', () => {
    for (const preset of EQUIPMENT_PRESETS.filter((p) => p.id !== 'bodyweight'))
      for (const method of methods)
        for (const goal of ['muscle', 'strength', 'fatLoss'] as Goal[])
          for (const level of ['beginner', 'advanced'] as Level[])
            for (const d of [2, 3, 4, 6])
              for (const sessionMin of [30, 45, 60]) {
                const prog = generateProgram(prof({ method, goal, level, daysPerWeek: d, sessionMin, equipment: preset.items }));
                for (const day of prog.days) {
                  expect(estimateMinutes(day.exercises), `${preset.id} ${method} ${goal} ${level} ${d}d ${sessionMin}m ${day.title}`).toBeLessThanOrEqual(sessionMin + 10);
                  expect(day.exercises.length).toBeGreaterThanOrEqual(2);
                }
              }
  });
  it('4–6 kunlik rejada ham ustuvor mushak haftasiga ko‘proq set oladi', () => {
    for (const method of [undefined, 'powerbuilding'] as (Method | undefined)[])
      for (const d of [4, 5, 6])
        for (const f of ['chest', 'back', 'shoulders', 'biceps', 'triceps', 'quads', 'hamstrings', 'glutes', 'calves', 'core'] as MuscleGroup[]) {
          const a = weeklyVolume(generateProgram(prof({ method, daysPerWeek: d, sessionMin: 75 })))[f];
          const b = weeklyVolume(generateProgram(prof({ method, daysPerWeek: d, sessionMin: 75, focus: [f] })))[f];
          expect(b, `${method} ${d}d ${f}`).toBeGreaterThan(a);
        }
  });
  it('jarohat: bo‘yin — shrug yo‘q, yelka — bosh ustidan triseps yo‘q; xavfsizlik bo‘g‘imlari reytingni pasaytiradi', () => {
    const ids = (p: Profile) => generateProgram(p).days.flatMap((d) => d.exercises.map((e) => e.exerciseId));
    for (const preset of EQUIPMENT_PRESETS) {
      expect(ids(prof({ injuries: ['neck'], daysPerWeek: 6, equipment: preset.items }))).not.toContain('db-shrug');
      expect(ids(prof({ injuries: ['shoulder'], daysPerWeek: 6, equipment: preset.items }))).not.toContain('overhead-extension');
    }
    expect(EXERCISE_MAP['db-shrug'].avoid).toContain('neck');
    expect(EXERCISE_MAP['overhead-extension'].avoid).toContain('shoulder');
    // oyoq press va pastki blokda tortishda bel uchun bo'g'im xavfi bor — bel cheklovida boshqa mashq tanlanadi
    const back = ids(prof({ injuries: ['lowerBack'], daysPerWeek: 6 }));
    expect(back).not.toContain('leg-press');
    expect(back).not.toContain('cable-row');
  });
  it('MRV ≥ MAV yuqori chegarasi ≥ haftalik maqsad', () => {
    for (const g of GROUP_ORDER) {
      const L = VOLUME_LANDMARKS[g];
      expect(L.mrv[0], g).toBeGreaterThanOrEqual(L.mav[1]);
      expect(L.mav[1], g).toBeGreaterThanOrEqual(WEEKLY_TARGET[g][1]);
      for (let i = 1; i < L.mrv.length; i++) expect(L.mrv[i]).toBeGreaterThanOrEqual(L.mrv[i - 1]);
    }
  });
  it('bir tomonlama kabel bilan yonga ko‘tarish', () => {
    expect(EXERCISE_MAP['cable-lateral-raise'].unilateral).toBe(true);
  });
});

describe('Chiziqli progressiya va uslub tanlovi', () => {
  it('boshlovchi kuch/massa maqsadida avtomatik — chiziqli; ozishda — gipertrofiya', () => {
    expect(resolveMethod(prof({ level: 'beginner', goal: 'muscle' }))).toBe('linear');
    expect(resolveMethod(prof({ level: 'beginner', goal: 'strength' }))).toBe('linear');
    expect(resolveMethod(prof({ level: 'beginner', goal: 'fatLoss' }))).toBe('hypertrophy');
    expect(resolveMethod(prof({ level: 'intermediate', goal: 'muscle' }))).toBe('hypertrophy');
    // massa maqsadida A/B kunlarga qo'l va yelka uchun yordamchi mashq qo'shiladi
    const prog = generateProgram(prof({ level: 'beginner', goal: 'muscle', daysPerWeek: 3, sessionMin: 75 }));
    expect(prog.method).toBe('linear');
    expect(prog.days.every((d) => d.exercises.some((e) => e.scheme === 'linear'))).toBe(true);
    expect(prog.days.flatMap((d) => d.exercises).some((e) => EXERCISE_MAP[e.exerciseId].pattern === 'biceps')).toBe(true);
  });
  it('A/B navbati haftadan haftaga almashadi: A-B-A, keyin B-A-B', () => {
    const prog = generateProgram(prof({ level: 'beginner', goal: 'strength', daysPerWeek: 3, trainingDays: [0, 2, 4] }));
    const mains = (w: number) =>
      prog.days.map((d) =>
        rotateLinear(prog, d, w)
          .exercises.filter((e) => e.scheme === 'linear')
          .map((e) => e.exerciseId)
          .join(','),
      );
    const [a, b] = mains(0);
    expect(mains(0)).toEqual([a, b, a]);
    expect(mains(1)).toEqual([b, a, b]);
    expect(mains(2)).toEqual([a, b, a]);
    expect(rotateLinear(prog, prog.days[2], 1).title).toBe('Kuch B′');
    // ikki haftada A va B teng
    const all = [...mains(0), ...mains(1)];
    expect(all.filter((x) => x === a).length).toBe(3);
    // hafta kuni va id o'zgarmaydi (loglar to'g'ri bog'lanadi)
    expect(rotateLinear(prog, prog.days[0], 1)).toMatchObject({ id: prog.days[0].id, weekday: prog.days[0].weekday });
  });
});

describe('Blok haftasi: kun qo‘shilganda sakramaydi', () => {
  it('barqaror perWeek bilan hafta o‘zgarmaydi', () => {
    const p = generateProgram(prof({ daysPerWeek: 4 }));
    p.startDate = '2026-10-31';
    const logs: WorkoutLog[] = Array.from({ length: 16 }, (_, i) => ({
      id: 'l' + i,
      dayId: p.days[i % 4].id,
      title: 't',
      startedAt: `2026-11-${String(i + 1).padStart(2, '0')}T10:00:00.000Z`,
      finishedAt: 'x',
      durationMin: 60,
      exercises: [],
    }));
    const more = { ...p, days: [...p.days, { ...p.days[0], id: 'extra' }] };
    const before = mesoState(p, logs, 'intermediate', mesoPerWeek(p, base));
    const after = mesoState(more, logs, 'intermediate', mesoPerWeek(more, base));
    expect(after.week).toBe(before.week);
    expect(after.deload).toBe(before.deload);
    expect(mesoPerWeek(more, base)).toBe(4);
    // murabbiy dasturida — dasturdagi kunlar soni
    expect(mesoPerWeek({ ...more, coach: { name: 'C', at: '2026-01-01' } }, base)).toBe(5);
    // perWeek berilmasa — eski xatti-harakat
    expect(mesoState(p, logs, 'intermediate').perWeek).toBe(4);
  });
});

describe('Shaxsiy rekordlar', () => {
  it('bir mashg‘ulotda bir mashq uchun ko‘pi bilan bitta rekord', () => {
    const prev = wlog('a', '2026-10-01', 'bench-press', [{ kg: 60, reps: 8 }]);
    const cur: WorkoutLog = {
      ...wlog('b', '2026-10-04', 'bench-press', [{ kg: 65, reps: 8 }]),
      exercises: [
        { exerciseId: 'bench-press', sets: [{ kg: 65, reps: 8, done: true }] },
        { exerciseId: 'bench-press', sets: [{ kg: 62.5, reps: 10, done: true }] },
      ],
    };
    const prs = detectPRs(cur, [prev]);
    expect(prs).toHaveLength(1);
    expect(prs[0].kind).toBe('weight');
    // takroriy log (bir xil id) ikki marta hisoblanmaydi
    expect(allPRs([prev, cur, { ...cur }])).toHaveLength(1);
  });
  it('kichik tebranish (1% dan kam) rekord emas', () => {
    const prev = wlog('a', '2026-10-01', 'bench-press', [{ kg: 100, reps: 5 }]);
    const cur = wlog('b', '2026-10-04', 'bench-press', [{ kg: 97.5, reps: 6 }]);
    // e1rm: 116.7 → 117 (+0.3%)
    expect(detectPRs(cur, [prev])).toHaveLength(0);
  });
});

describe('Darslar dvigatel bilan mos', () => {
  it('massa uchun ortiqcha kaloriya 5–12% (dvigateldagi kabi), 10–20% emas', () => {
    const txt = JSON.stringify(LESSONS);
    expect(txt).not.toMatch(/10–20% ko‘p/);
    expect(txt).toMatch(/5–12% ko‘p/);
    const sp = (level: Level) => nutritionPlan(prof({ goal: 'muscle', level })).kcal / nutritionPlan(prof({ goal: 'muscle', level })).tdee - 1;
    for (const l of ['beginner', 'intermediate', 'advanced'] as Level[]) {
      expect(sp(l)).toBeGreaterThanOrEqual(0.045);
      expect(sp(l)).toBeLessThanOrEqual(0.125);
    }
  });
});
