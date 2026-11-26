// Glikemik indeks (GI): uglevodli mahsulot qondagi qandni glyukozaga (=100) nisbatan qanchalik tez oshiradi.
// Qiymatlar — xalqaro GI jadvallarining umumiy mahsulotlar jadvalidan (Atkinson va boshq., Diabetes Care 2008, 1-jadval),
// o‘rtacha ± standart xato. Jadvalda yo‘q mahsulotlar uchun qiymat to‘qib chiqarilmaydi — «ma’lumot yo‘q» deb ko‘rsatiladi.
// Toifalar (ISO 26642:2010): past ≤ 55, o‘rta 56–69, yuqori ≥ 70.
import type { FoodItem } from './foods';

export interface GiInfo {
  gi: number;
  sem: number;
  /** jadvaldagi mahsulot (bizdagi nom bilan bir xil bo‘lmasa) */
  as?: string;
}

export const GI: Record<string, GiInfo> = {
  // non va yormalar
  non: { gi: 75, sem: 2, as: 'oq bug‘doy noni' },
  patir: { gi: 75, sem: 2, as: 'oq bug‘doy noni' },
  'shirmoy-non': { gi: 75, sem: 2, as: 'oq bug‘doy noni' },
  'bread-white': { gi: 75, sem: 2 },
  lavash: { gi: 70, sem: 5, as: 'xamirturushsiz bug‘doy noni' },
  rice: { gi: 73, sem: 4, as: 'oq guruch, qaynatilgan' },
  oats: { gi: 55, sem: 2, as: 'suli bo‘tqasi (yormadan)' },
  pasta: { gi: 49, sem: 2, as: 'spagetti, oq undan' },
  potato: { gi: 78, sem: 4, as: 'kartoshka, qaynatilgan' },
  'potato-fried': { gi: 63, sem: 5, as: 'kartoshka fri' },
  fries: { gi: 63, sem: 5 },
  'corn-flakes': { gi: 81, sem: 6 },
  // sut
  milk: { gi: 39, sem: 3, as: 'sut, to‘liq yog‘li' },
  'yogurt-sweet': { gi: 41, sem: 2, as: 'mevali yogurt' },
  icecream: { gi: 51, sem: 3 },
  // mevalar
  apple: { gi: 36, sem: 2 },
  banana: { gi: 51, sem: 3 },
  orange: { gi: 43, sem: 3 },
  watermelon: { gi: 76, sem: 4 },
  dates: { gi: 42, sem: 4 },
  // sabzavot va dukkaklilar
  carrot: { gi: 39, sem: 4, as: 'sabzi, qaynatilgan' },
  chickpea: { gi: 28, sem: 9 },
  beans: { gi: 24, sem: 4, as: 'qizil loviya' },
  lentil: { gi: 32, sem: 5 },
  // shirinlik va ichimliklar
  sugar: { gi: 65, sem: 4, as: 'saxaroza (oq shakar)' },
  navvot: { gi: 65, sem: 4, as: 'saxaroza (oq shakar)' },
  honey: { gi: 61, sem: 3 },
  chocolate: { gi: 40, sem: 3 },
  cola: { gi: 59, sem: 3, as: 'shakarli gazli ichimlik' },
  juice: { gi: 50, sem: 2, as: 'apelsin sharbati' },
};

export type GiLevel = 'low' | 'mid' | 'high';
export const giLevel = (gi: number): GiLevel => (gi <= 55 ? 'low' : gi < 70 ? 'mid' : 'high');
export const GI_LABEL: Record<GiLevel, string> = { low: 'past', mid: 'o‘rta', high: 'yuqori' };
export const GI_COLOR: Record<GiLevel, string> = { low: 'var(--green)', mid: 'var(--yellow)', high: 'var(--red)' };

/** 100 g da uglevod shundan kam bo‘lsa — GI amalda ahamiyatsiz (go‘sht, tuxum, yog‘, ko‘p sut mahsulotlari) */
export const LOW_CARB = 5;

/** GI holati: qiymat, «uglevod juda kam» yoki «jadvalda yo‘q» (aralash taomlar va o‘lchanmagan mahsulotlar) */
export function giFor(f: Pick<FoodItem, 'id' | 'c' | 'cat'>): { kind: 'gi'; info: GiInfo } | { kind: 'lowcarb' } | { kind: 'none' } {
  const info = GI[f.id];
  if (info) return { kind: 'gi', info };
  if (f.c < LOW_CARB) return { kind: 'lowcarb' };
  return { kind: 'none' };
}

/** Glikemik yuk (GY) porsiyaga: GI × uglevod (g) / 100. Past ≤ 10, o‘rta 11–19, yuqori ≥ 20 */
export function glycemicLoad(gi: number, carbsG: number): { gl: number; level: GiLevel } {
  const gl = Math.round((gi * carbsG) / 100);
  return { gl, level: gl <= 10 ? 'low' : gl < 20 ? 'mid' : 'high' };
}

/** Kaloriyaning qaysi qismi oqsil, uglevod va yog‘dan (Atwater: 4/4/9), foizda — yig‘indi 100 */
export function energySplit(f: Pick<FoodItem, 'p' | 'c' | 'f'>): { p: number; c: number; f: number } {
  const p = f.p * 4;
  const c = f.c * 4;
  const fa = f.f * 9;
  const t = p + c + fa;
  if (!t) return { p: 0, c: 0, f: 0 };
  const rp = Math.round((p / t) * 100);
  const rf = Math.round((fa / t) * 100);
  return { p: rp, c: Math.max(0, 100 - rp - rf), f: rf };
}

/** Kundalikda mahsulot yonida qisqa GI belgisi (bo‘lsa): " · GI 73 (yuqori)" */
export function giShort(f: Pick<FoodItem, 'id' | 'c' | 'cat'>): string {
  const g = giFor(f);
  return g.kind === 'gi' ? ` · GI ${g.info.gi} (${GI_LABEL[giLevel(g.info.gi)]})` : '';
}
