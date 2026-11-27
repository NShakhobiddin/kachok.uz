// Sayt ma’lumotlari: yig‘ish paytida ilova bazasidan tayyorlanadi (buildData.ts) va sahifaga JSON bo‘lib joylanadi —
// brauzer ilovaning katta jadvallarini (EMG, mashqlar, retseptlar) yuklamaydi.
import type { MuscleId } from '../../src/types';

export interface DishRow {
  id: string;
  name: string;
  icon: string;
  tip: string;
  group: string;
  /** odatiy porsiya: "1 likopcha", "5 dona" */
  unit: string;
  g: number;
  kcal: number;
  p: number;
  f: number;
  c: number;
  /** yengilroq retsept nomi va uning kaloriyasi */
  light?: { name: string; kcal: number; p: number };
}

export interface GiRow {
  id: string;
  name: string;
  gi: number;
  /** 100 g dagi uglevod */
  c: number;
  /** odatiy porsiya */
  unit: string;
  g: number;
  as?: string;
}

export interface MuscleRow {
  name: string;
  short: string;
  view: 'front' | 'back';
  top: { id: string; name: string; mvic: number; est: boolean }[];
}

export interface SourceRow {
  short: string;
  finding: string;
  doi?: string;
}

export interface FactRow {
  value: string;
  title: string;
  text: string;
  src: SourceRow;
}

export interface MythRow {
  claim: string;
  truth: boolean;
  explain: string;
  src: SourceRow;
}

export interface SourceFull extends SourceRow {
  cite: string;
}

export interface SiteData {
  stats: { year: number; templates: number; exercises: number; stretches: number; illustrated: number; dishes: number; recipes: number; foods: number; sources: number; routines: number; lessons: number };
  dishes: DishRow[];
  groups: { id: string; name: string; short: string }[];
  gi: GiRow[];
  muscles: Partial<Record<MuscleId, MuscleRow>>;
  sources: SourceRow[];
  facts: FactRow[];
  myths: MythRow[];
  /** ilovadagi barcha manbalar (ro‘yxatni ochganda ko‘rinadi) */
  allSources: SourceFull[];
}
