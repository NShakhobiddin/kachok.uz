import { describe, expect, it } from 'vitest';
import { EXERCISES, EXERCISE_MAP } from '../../data/exercises';
import { GOLDEN_RULES, PAIN_ZONES, RED_FLAGS, SAFETY_IDS, SAFETY_SOURCES, safetyFor } from '../../data/safety';
import { sourceById } from '../../data/sources';
import { LESSONS } from '../../data/lessons';
import { loadJump, needsPreSetCheck, personalSafety, reducedLoad } from '../safety';

describe('Mashqlar xavfsizligi — ma’lumotlar', () => {
  it('har bir mashqda xavfsizlik profili bor, ortiqchasi yo‘q', () => {
    const ids = EXERCISES.map((e) => e.id).sort();
    expect([...SAFETY_IDS].sort()).toEqual(ids);
  });

  it('tavsiya etilmagan va ehtiyotkorlik talab qiladigan har bir bo‘g‘im uchun mexanizm va moslashtirish yozilgan', () => {
    for (const ex of EXERCISES) {
      const s = safetyFor(ex.id)!;
      const at = s.joints.map((j) => j.at);
      expect(new Set(at).size, ex.id).toBe(at.length);
      for (const i of [...(ex.avoid ?? []), ...(ex.caution ?? [])]) expect(at, `${ex.id}: ${i}`).toContain(i);
      for (const j of s.joints) {
        expect(j.how.length, `${ex.id}.${j.at}`).toBeGreaterThan(20);
        expect(j.mod.length, `${ex.id}.${j.at}`).toBeGreaterThan(20);
      }
      // tavsiya etilmaganda — muqobil mashq aytiladi
      for (const i of ex.avoid ?? []) expect(s.joints.find((j) => j.at === i)!.mod, `${ex.id}.${i}`).toMatch(/^Tavsiya etilmaydi/);
    }
  });

  it('har bir profil to‘liq: sabab, tekshiruv, to‘xtash belgilari', () => {
    for (const id of SAFETY_IDS) {
      const s = safetyFor(id)!;
      expect([1, 2, 3]).toContain(s.risk);
      expect(s.why.length, id).toBeGreaterThan(20);
      expect(s.check.length, id).toBeGreaterThan(0);
      expect(s.stop.length, id).toBeGreaterThan(0);
    }
  });

  it('yuqori xavfli mashqlar: chiqish yo‘li va chegaraga borish qoidasi bor', () => {
    const high = SAFETY_IDS.filter((id) => safetyFor(id)!.risk === 3);
    expect(high.length).toBeGreaterThanOrEqual(5);
    for (const id of high) {
      const s = safetyFor(id)!;
      expect(s.bail, id).toBeTruthy();
      expect(s.failure, id).toBeTruthy();
    }
    // interfeysda «Ko‘tara olmasangiz:» sarlavhasi bilan chiqadi — matn uni takrorlamasin
    for (const id of SAFETY_IDS) expect(safetyFor(id)!.bail ?? '', id).not.toMatch(/^Ko‘tara olmasangiz/);
    // tana ustidagi og'ir shtanga — faqat sug'urta bilan chegaragacha
    for (const id of ['back-squat', 'front-squat', 'bench-press', 'incline-bench', 'close-grip-bench', 'ohp']) expect(safetyFor(id)!.failure, id).toBe('spot');
    expect(safetyFor('deadlift')!.failure).toBe('form');
  });

  it('shtangali mashqlarda qisqich va isinish eslatiladi', () => {
    for (const ex of EXERCISES.filter((e) => e.loadType === 'barbell' && e.mechanics === 'compound')) {
      const text = safetyFor(ex.id)!.check.join(' ');
      expect(text, ex.id).toMatch(/qisqich/i);
    }
  });

  it('o‘zbek imlosi: o‘ va g‘ to‘g‘ri belgi bilan yozilgan', () => {
    const all = [
      ...SAFETY_IDS.flatMap((id) => {
        const s = safetyFor(id)!;
        return [s.why, ...s.check, ...s.stop, s.bail ?? '', ...s.joints.flatMap((j) => [j.how, j.mod])];
      }),
      ...GOLDEN_RULES.flatMap((r) => [r.title, r.text]),
      ...PAIN_ZONES.map((z) => z.text),
      ...RED_FLAGS.map((f) => f.text),
    ];
    for (const t of all) expect(t, t).not.toMatch(/[og]['`’]/i);
  });

  it('og‘riq zonalari 0–10 ni bo‘shliqsiz qoplaydi', () => {
    const covered = PAIN_ZONES.flatMap((z) => Array.from({ length: z.to - z.from + 1 }, (_, i) => z.from + i));
    expect(covered).toEqual(Array.from({ length: 11 }, (_, i) => i));
  });

  it('manbalar mavjud', () => {
    for (const id of SAFETY_SOURCES) expect(sourceById(id), id).toBeTruthy();
    const lesson = LESSONS.find((l) => l.id === 'safety')!;
    for (const sl of lesson.slides) if (sl.source) expect(sourceById(sl.source), sl.source).toBeTruthy();
  });
});

describe('Shaxsiy xavfsizlik', () => {
  it('bel muammosida o‘tirish tavsiya etilmaydi, oyoq press — ehtiyotkorlik bilan', () => {
    const sq = personalSafety(EXERCISE_MAP['back-squat'], ['lowerBack']);
    expect(sq.level).toBe('avoid');
    expect(sq.avoid).toEqual(['lowerBack']);
    const lp = personalSafety(EXERCISE_MAP['leg-press'], ['lowerBack']);
    expect(lp.level).toBe('caution');
    expect(lp.joints[0].mod).toMatch(/tos/);
    expect(personalSafety(EXERCISE_MAP['leg-curl'], ['lowerBack']).level).toBeNull();
  });

  it('setdan oldingi ro‘yxat: yuqori xavfda doim, boshqalarida — cheklov bo‘lsa', () => {
    expect(needsPreSetCheck(EXERCISE_MAP['bench-press'], [])).toBe(true);
    expect(needsPreSetCheck(EXERCISE_MAP['leg-curl'], [])).toBe(false);
    expect(needsPreSetCheck(EXERCISE_MAP['leg-press'], [])).toBe(false);
    expect(needsPreSetCheck(EXERCISE_MAP['leg-press'], ['knee'])).toBe(true);
  });

  it('vazn sakrashi: 10% va bir qadamdan ko‘p bo‘lsa ogohlantiriladi', () => {
    expect(loadJump(110, 100, 2.5)).toBeNull();
    expect(loadJump(115, 100, 2.5)).toBe(15);
    expect(loadJump(22, 20, 2.5)).toBeNull();
    expect(loadJump(60, null, 2.5)).toBeNull();
    expect(loadJump(0, 100, 2.5)).toBeNull();
  });

  it('og‘riqda vazn 20% kamayadi va jihoz qadamiga yaxlitlanadi', () => {
    expect(reducedLoad(100, 2.5)).toBe(80);
    expect(reducedLoad(22.5, 2.5)).toBe(17.5);
    expect(reducedLoad(14, 2)).toBe(12);
  });
});
