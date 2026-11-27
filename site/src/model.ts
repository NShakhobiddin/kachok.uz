// Sayt ma’lumotlari: yig‘ish paytida ilova bazasidan tayyorlanadi (buildData.ts) va sahifaga JSON bo‘lib joylanadi —
// brauzer ilovaning katta jadvallarini (EMG, mashqlar, retseptlar) yuklamaydi.
import type { MuscleId, Phase } from '../../src/types';

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

/** «3D anatomiya»: mashq rasmi (ikki kadr) va 3D modelda yonadigan mushaklar */
export interface ShowcaseRow {
  id: string;
  name: string;
  tag: string;
  alt: string;
  /** kadrlar: boshlanish va harakatning ikkinchi cheti (nisbiy yo‘l: ./illustrations/…) */
  frames: { src: string; phase: string }[];
  /** kadrlar orasidagi harakat: birinchisi (masalan, tushirish) va qaytish, ms */
  tempo: { go: { phase: 'up' | 'down'; ms: number }; back: { phase: 'up' | 'down'; ms: number } };
  /** 3D model uchun takror fazalari (faqat faza va davomiylik) */
  anim: { phase: Phase; dur: number }[];
  /** EMG bo‘yicha mushaklar (kamayish tartibida), 3D modelning kalitlari bilan */
  acts: { key: string; name: string; mvic: number; est: boolean }[];
  /** 3D yuklanguncha 2D xarita uchun */
  primary: MuscleId[];
  secondary: MuscleId[];
  /** 3D model qaysi tomondan boshlab ko‘rsatiladi */
  view: 'front' | 'back';
}

/** «Sizga mos dastur»: ilova dvigateli tuzgan haftalik reja (ixcham) */
export interface PlanEx {
  id: string;
  name: string;
  sets: number;
  /** "8–12" yoki "5" */
  reps: string;
  rest: number;
  /** kichik rasm bor (thumbs/<id>.webp) */
  thumb: boolean;
}
export interface PlanDay {
  title: string;
  focus: string;
  /** 0 = dushanba */
  weekday: number;
  min: number;
  ex: PlanEx[];
}
export interface PlanRow {
  key: string;
  name: string;
  method: string;
  days: PlanDay[];
}

export interface GalleryRow {
  id: string;
  name: string;
  src: string;
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
  showcase: ShowcaseRow[];
  gallery: GalleryRow[];
  /** 3D modeldagi barcha mushaklar nomi (bosilganda ko‘rsatish uchun) */
  m3names: Record<string, string>;
  /** standart tanlov uchun reja (qolganlari plans.json da) */
  plan: PlanRow;
}
