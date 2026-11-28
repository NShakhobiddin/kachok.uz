// Mashg‘ulotning oddiy nomi: «Kuch A’» yoki «Push» o‘rniga — tananing qaysi qismi ishlashi («Oyoq, ko‘krak va orqa»).
// Har mashqning asosiy mushagi bo‘yicha, mashqlar tartibida; 3 tadan ko‘p qism bo‘lsa — «Butun tana».
import { MUSCLES } from '../data/catalog';
import { EXERCISE_MAP } from '../data/exercises';
import type { MuscleGroup } from '../types';

const REGION: Record<MuscleGroup, string> = {
  chest: 'ko‘krak',
  back: 'orqa',
  shoulders: 'yelka',
  biceps: 'qo‘l',
  triceps: 'qo‘l',
  quads: 'oyoq',
  hamstrings: 'oyoq',
  glutes: 'oyoq',
  calves: 'oyoq',
  core: 'qorin',
};

/** tananing ishlaydigan qismlari, mashqlar tartibida, takrorsiz */
export function bodyRegions(exerciseIds: string[]): string[] {
  const out: string[] = [];
  for (const id of exerciseIds) {
    const m = EXERCISE_MAP[id]?.primary[0];
    const r = m ? REGION[MUSCLES[m].group] : undefined;
    if (r && !out.includes(r)) out.push(r);
  }
  return out;
}

/** «Oyoq, ko‘krak va orqa» · «Qo‘l» · «Butun tana» */
export function plainTitle(exerciseIds: string[]): string {
  const r = bodyRegions(exerciseIds);
  if (!r.length) return 'Mashg‘ulot';
  if (r.length > 3) return 'Butun tana';
  const text = r.length === 1 ? r[0] : `${r.slice(0, -1).join(', ')} va ${r[r.length - 1]}`;
  return text[0].toUpperCase() + text.slice(1);
}
