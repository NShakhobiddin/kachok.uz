// Dastur uslublari (metodikalar). Har biri ilmiy asoslangan va sport amaliyotida sinalgan:
// - Gipertrofiya: Renaissance Periodization (Israetel) — RIR har hafta kamayadi, setlar mushak fikriga qarab oshadi
// - Kuch bloki: blok periodizatsiya (Issurin) — to'plash → kuchaytirish, %1RM bo'yicha
// - Chiziqli progressiya: Rippetoe & Kilgore "Practical Programming" — har mashg'ulot +vazn
// - Powerbuilding: og'ir (4–6 takror) va hajmli (8–15) kunlar (PHUL uslubi)
import type { Level, Method, MuscleGroup, Profile } from '../types';

export type ConcreteMethod = Exclude<Method, 'auto'>;

export function resolveMethod(p: Pick<Profile, 'method' | 'goal' | 'level' | 'daysPerWeek'>): ConcreteMethod {
  if (p.method && p.method !== 'auto') return p.method === 'powerbuilding' && p.daysPerWeek < 4 ? 'hypertrophy' : p.method;
  if (p.goal === 'strength') return p.level === 'beginner' ? 'linear' : 'strength';
  return 'hypertrophy';
}

export const METHOD_INFO: Record<ConcreteMethod, { name: string; short: string; who: string; how: string; source: string }> = {
  hypertrophy: {
    name: 'Gipertrofiya (RP uslubi)',
    short: 'Mushak massasi va shakl',
    who: 'Mushak o‘stirish, shakl va ozish paytida mushakni saqlash uchun — ko‘pchilik uchun eng yaxshi tanlov.',
    how: 'Har hafta zaxira takror kamayadi (3 → 2 → 1), har mushakka setlar sizning fikringizga qarab qo‘shiladi, blok oxirida yengillashtirish.',
    source: 'Israetel va boshq. (Renaissance Periodization); Schoenfeld 2017; Pelland 2025',
  },
  strength: {
    name: 'Kuch bloki (%1RM)',
    short: 'Asosiy mashqlarda maksimal kuch',
    who: 'O‘tirib-turish, yotib jim, o‘lik tortishda kuchni oshirmoqchi bo‘lgan o‘rta va tajribali sportchilar uchun.',
    how: 'Asosiy mashqlar har hafta og‘irlashadi: 4×6 @75% → 4×5 @80% → 4×4 @85% → 3×3 @88%, keyin yengillashtirish. Yordamchi mashqlar — hajm uchun.',
    source: 'Issurin 2010 (blok periodizatsiya); Helms RPE tizimi; ACSM 2009',
  },
  linear: {
    name: 'Chiziqli progressiya (3×5)',
    short: 'Yangi boshlovchining tez o‘sishi',
    who: 'Zalga endi kelganlar uchun: kuch har mashg‘ulotda o‘sadigan eng tez davr.',
    how: 'Asosiy mashqlar 3×5. Har safar barcha takrorlar bajarilsa: oyoq mashqlari +5 kg, yuqori tana +2.5 kg. Ikki marta yetmasa — vazn 10% kamayadi va yana ko‘tariladi.',
    source: 'Rippetoe & Kilgore, Practical Programming for Strength Training',
  },
  powerbuilding: {
    name: 'Powerbuilding',
    short: 'Ham kuch, ham massa',
    who: 'Haftasiga 4+ kun shug‘ullanadigan, kuch va tashqi ko‘rinishni birga xohlaganlar uchun.',
    how: 'Og‘ir kunlar: asosiy mashqlar 4–6 takror. Hajm kunlari: 8–15 takror, ko‘proq izolyatsiya. Har mushak haftasiga 2 marta.',
    source: 'PHUL (Brandon Campbell) uslubi; Schoenfeld 2016 (yuklama oraliqlari)',
  },
};

/** Kuch bloki: blok ichidagi hafta → setlar × takror @ %1RM (oxirgi hafta — yengillashtirish) */
export function blockWeek(week: number, mesoWeeks: number): { sets: number; reps: number; pct: number; deload: boolean } {
  const acc = Math.max(1, mesoWeeks - 1);
  if (week >= acc) return { sets: 3, reps: 5, pct: 0.65, deload: true };
  const plan = [
    { sets: 4, reps: 6, pct: 0.75 },
    { sets: 4, reps: 5, pct: 0.8 },
    { sets: 4, reps: 4, pct: 0.85 },
    { sets: 3, reps: 3, pct: 0.88 },
  ];
  // blok uzunligi boshqacha bo'lsa — rejani cho'zamiz
  const idx = acc === plan.length ? week : Math.min(plan.length - 1, Math.round((week / Math.max(1, acc - 1)) * (plan.length - 1)));
  return { ...plan[idx], deload: false };
}

export const LOWER_GROUPS: MuscleGroup[] = ['quads', 'hamstrings', 'glutes', 'calves'];

export function methodMeso(method: ConcreteMethod, level: Level): number {
  if (method === 'linear') return 12;
  if (method === 'strength') return 5;
  return level === 'beginner' ? 6 : 5;
}
