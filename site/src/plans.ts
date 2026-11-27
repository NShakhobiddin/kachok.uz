// «Sizga mos dastur»: saytdagi 3 savol va ularning ilovadagi profil qiymatlari.
// Rejalar yig‘ishda ilovaning dvigateli (generateProgram) bilan oldindan tuziladi: standart variant sahifada,
// qolganlari plans.json da (birinchi tanlovda yuklanadi).
import type { Goal } from '../../src/types';

export type Place = 'gym' | 'home' | 'bw';

export const PLAN_GOALS: { v: Goal; t: string }[] = [
  { v: 'fatLoss', t: 'Ozish' },
  { v: 'muscle', t: 'Mushak' },
  { v: 'strength', t: 'Kuch' },
  { v: 'health', t: 'Sog‘liq' },
];
export const PLAN_PLACES: { v: Place; t: string; preset: string }[] = [
  { v: 'gym', t: 'Zalda', preset: 'basic' },
  { v: 'home', t: 'Uyda (gantel)', preset: 'home' },
  { v: 'bw', t: 'Jihozsiz', preset: 'bodyweight' },
];
export const PLAN_DAYS = [2, 3, 4, 5];
export const PLAN_DEFAULT = { goal: 'muscle' as Goal, place: 'gym' as Place, days: 3 };

export const planKey = (goal: Goal, place: Place, days: number) => `${goal}-${place}-${days}`;
