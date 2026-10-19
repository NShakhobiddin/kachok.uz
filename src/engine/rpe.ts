// Kuchlanish (RPE / RIR) asosida yuklamani boshqarish.
// RIR — "zaxiradagi takrorlar": set tugaganda yana nechta takror qila olardingiz. RPE = 10 − RIR.
// Jadval: Tuchscherer RPE jadvali, Helms va boshq. 2016 (RIR asosidagi RPE shkalasi), Zourdos va boshq. 2016.

/** %1RM: qator — takror (1..12), ustun — RPE 10, 9.5, 9, 8.5, 8, 7.5, 7, 6.5 */
const TABLE: number[][] = [
  [100, 97.8, 95.5, 93.9, 92.2, 90.7, 89.2, 87.8],
  [95.5, 93.9, 92.2, 90.7, 89.2, 87.8, 86.3, 85.0],
  [92.2, 90.7, 89.2, 87.8, 86.3, 85.0, 83.7, 82.4],
  [89.2, 87.8, 86.3, 85.0, 83.7, 82.4, 81.1, 79.9],
  [86.3, 85.0, 83.7, 82.4, 81.1, 79.9, 78.6, 77.4],
  [83.7, 82.4, 81.1, 79.9, 78.6, 77.4, 76.2, 75.1],
  [81.1, 79.9, 78.6, 77.4, 76.2, 75.1, 73.9, 72.3],
  [78.6, 77.4, 76.2, 75.1, 73.9, 72.3, 70.7, 69.4],
  [76.2, 75.1, 73.9, 72.3, 70.7, 69.4, 68.0, 66.7],
  [73.9, 72.3, 70.7, 69.4, 68.0, 66.7, 65.3, 64.0],
  [70.7, 69.4, 68.0, 66.7, 65.3, 64.0, 62.6, 61.3],
  [68.0, 66.7, 65.3, 64.0, 62.6, 61.3, 59.9, 58.6],
];

/**
 * %1RM faqat "failure gacha takror" n = reps + RIR ga bog'liq (jadvalning asosiy xossasi).
 * f(n) — jadvaldan 0.5 qadam bilan, 15.5 dan keyin silliq davom ettiriladi.
 */
const F: number[] = (() => {
  const out: number[] = []; // indeks: (n − 1) × 2
  for (let n2 = 2; n2 <= 31; n2++) {
    const n = n2 / 2;
    // n = reps + rir, rir ∈ {0, 0.5 … 3.5}: eng kichik rir bilan jadval katagini topamiz
    const reps = Math.min(12, Math.floor(n));
    const rir = n - reps;
    out.push(rir <= 3.5 && reps >= 1 ? TABLE[reps - 1][Math.round(rir * 2)] : NaN);
  }
  return out;
})();

function f(n: number): number {
  if (n <= 1) return 100;
  if (n > 15.5) return Math.max(30, F[F.length - 1] - 2.6 * (n - 15.5));
  const i = (n - 1) * 2;
  const i0 = Math.floor(i);
  const i1 = Math.min(F.length - 1, i0 + 1);
  return F[i0] + (F[i1] - F[i0]) * (i - i0);
}

/** reps takrorni rir zaxira bilan bajarish uchun 1RM ning qancha qismi kerak (0..1) */
export function pct1rm(reps: number, rir: number): number {
  return f(Math.max(1, reps) + Math.max(0, rir)) / 100;
}

/** Bajarilgan setdan taxminiy 1RM. rir berilmasa — set chegaraga yaqin (RIR 1) deb olinadi */
export function e1rmFromSet(kg: number, reps: number, rir?: number): number {
  if (!kg || reps <= 0) return 0;
  return kg / pct1rm(reps, rir ?? 1);
}

/** Taxminiy 1RM dan: reps takror rir zaxira bilan uchun vazn */
export function loadFor(e1rm: number, reps: number, rir: number): number {
  return e1rm * pct1rm(reps, rir);
}

export interface SetWithEffort {
  kg: number;
  reps: number;
  rir?: number;
}

/**
 * Bir mashg'ulotdagi eng ishonchli 1RM bahosi: RIR yozilgan setlardan.
 * 12 dan ortiq takror yoki RIR 4+ (RPE < 6.5) setlar noaniq — ular faqat boshqa set bo'lmasa ishlatiladi (Halperin 2022).
 */
export function sessionE1rm(sets: SetWithEffort[]): number | null {
  const rated = sets.filter((s) => s.rir !== undefined && s.kg > 0 && s.reps > 0);
  if (!rated.length) return null;
  const good = rated.filter((s) => s.reps <= 12 && (s.rir ?? 0) <= 3.5);
  const pool = good.length ? good : rated;
  return Math.max(...pool.map((s) => e1rmFromSet(s.kg, s.reps, s.rir)));
}

/** Oxirgi 1–3 mashg'ulot bo'yicha silliqlangan 1RM (EMA, α = 0.5), eng yangisi birinchi */
export function refE1rm(sessions: SetWithEffort[][]): number | null {
  const vals = sessions
    .slice(0, 3)
    .map(sessionE1rm)
    .filter((v): v is number => v !== null);
  if (!vals.length) return null;
  let ema = vals[vals.length - 1];
  for (let i = vals.length - 2; i >= 0; i--) ema = ema + 0.5 * (vals[i] - ema);
  return ema;
}

export const RIR_LABEL: Record<number, string> = {
  0: 'Chegaragacha — boshqa takror qila olmasdim',
  1: 'Yana 1 takror qila olardim',
  2: 'Yana 2 takror',
  3: 'Yana 3 takror',
  4: '4 va undan ko‘p — yengil',
};

/** RIR va RPE ni bir qatorda ko'rsatish: "RIR 2 · RPE 8" */
export const rirText = (rir: number) => `RIR ${rir >= 4 ? '4+' : rir} · RPE ${Math.max(6, 10 - rir)}`;
