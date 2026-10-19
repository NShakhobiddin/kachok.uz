// Tana tarkibi: bel/bo'y nisbati (WHtR) va AQSh harbiy-dengiz flotining (US Navy) yog' foizi formulasi.
// WHtR: Ashwell & Hsieh 2005, Ashwell 2012 — "belingiz bo'yingizning yarmidan kam bo'lsin" (0.5 — xavf chegarasi).
// US Navy: Hodgdon & Beckett 1984 — DEXA bilan ±3–4% aniqlik; trend kuzatish uchun yetarli.
import type { BodyEntry, Sex } from '../types';

export function whtr(waistCm: number, heightCm: number): number {
  return Math.round((waistCm / heightCm) * 1000) / 1000;
}

export const WHTR_ZONES = [
  { max: 0.4, name: 'Juda ozg‘in', tone: 'warn' },
  { max: 0.5, name: 'Sog‘lom', tone: 'good' },
  { max: 0.6, name: 'Xavf oshgan', tone: 'warn' },
  { max: 9, name: 'Yuqori xavf', tone: 'bad' },
] as const;

export function whtrZone(r: number) {
  return WHTR_ZONES.find((z) => r < z.max) ?? WHTR_ZONES[WHTR_ZONES.length - 1];
}

/** US Navy yog' foizi (sm). Ayollarda son (hip) o'lchami kerak. */
export function navyBodyFat(sex: Sex, heightCm: number, waistCm?: number, neckCm?: number, hipCm?: number): number | null {
  if (!waistCm || !neckCm) return null;
  let bf: number;
  if (sex === 'male') {
    if (waistCm - neckCm <= 0) return null;
    bf = 495 / (1.0324 - 0.19077 * Math.log10(waistCm - neckCm) + 0.15456 * Math.log10(heightCm)) - 450;
  } else {
    if (!hipCm || waistCm + hipCm - neckCm <= 0) return null;
    bf = 495 / (1.29579 - 0.35004 * Math.log10(waistCm + hipCm - neckCm) + 0.221 * Math.log10(heightCm)) - 450;
  }
  return Math.round(Math.max(3, Math.min(60, bf)) * 10) / 10;
}

export type MeasureKey = 'waistCm' | 'neckCm' | 'hipCm' | 'chestCm' | 'armCm' | 'thighCm';

export const MEASURES: { key: MeasureKey; name: string; how: string }[] = [
  { key: 'waistCm', name: 'Bel', how: 'Kindik sathida, nafas chiqargandan keyin, qorinni tortmasdan' },
  { key: 'neckCm', name: 'Bo‘yin', how: 'Kekirdak ostida, lenta biroz pastga qiya' },
  { key: 'hipCm', name: 'Son-dumba', how: 'Dumbaning eng chiqqan joyidan, oyoqlar jips' },
  { key: 'chestCm', name: 'Ko‘krak', how: 'Ko‘krak uchlari sathida, qo‘llar tushirilgan' },
  { key: 'armCm', name: 'Qo‘l (bitseps)', how: 'Bitsepsning eng yo‘g‘on joyi, qo‘l bo‘shashgan' },
  { key: 'thighCm', name: 'Son', how: 'Sonning eng yo‘g‘on joyi, tik turib' },
];

/** O'lchamning oxirgi qiymati va ~4 hafta oldingisi bilan farqi */
export function measureTrend(body: BodyEntry[], key: MeasureKey, days = 28): { last: number; date: string; delta: number | null } | null {
  const pts = body.filter((b) => b[key]).sort((a, b) => a.date.localeCompare(b.date));
  if (!pts.length) return null;
  const last = pts[pts.length - 1];
  const cutoff = new Date(Date.parse(last.date) - days * 86400000).toISOString().slice(0, 10);
  const base = [...pts].reverse().find((p) => p.date <= cutoff) ?? (pts.length > 1 ? pts[0] : null);
  return { last: last[key]!, date: last.date, delta: base && base !== last ? Math.round((last[key]! - base[key]!) * 10) / 10 : null };
}

/** Eng so'nggi o'lchamlar bo'yicha yog' foizi (har bir o'lcham o'zining oxirgi qiymati) */
export function latestBodyFat(body: BodyEntry[], sex: Sex, heightCm: number): number | null {
  const v = (k: MeasureKey) => measureTrend(body, k)?.last;
  return navyBodyFat(sex, heightCm, v('waistCm'), v('neckCm'), v('hipCm'));
}
