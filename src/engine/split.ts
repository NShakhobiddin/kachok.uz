// Kunlar taqsimoti: foydalanuvchi har bir mashg'ulot kuniga qaysi mushak guruhlarini ishlatishni o'zi tanlaydi,
// mashqlarni esa dastur tanlaydi (program.ts → generateProgram). Bu yerda — tayyor variantlar, kun nomi va maslahatlar.
// Asos: Schoenfeld 2016 (har mushak haftasiga 2 marta biroz samaraliroq), ACSM 2026 (katta mushak guruhi kamida
// haftasiga 2 marta), tiklanish — og'ir ishlagan mushakka ~48 soat.
import { GROUP_ORDER, GROUPS } from '../data/catalog';
import { DAYS } from '../lib/date';
import type { MuscleGroup, Profile } from '../types';

/** Har bir mashg'ulot kuni uchun mushak guruhlari (kunlar hafta tartibida) */
export type DaySplit = MuscleGroup[][];

/** Katta guruhlar: haftasiga 2 marta ishlatish tavsiya etiladi, ketma-ket kunlarga qo'yilmaydi */
export const MAJOR_GROUPS: MuscleGroup[] = ['chest', 'back', 'shoulders', 'quads', 'hamstrings', 'glutes'];

const [C, B, S, Bi, T, Q, H, G, Ca, Co] = GROUP_ORDER;
const UPPER: MuscleGroup[] = [C, B, S, Bi, T];
const LOWER: MuscleGroup[] = [Q, H, G, Ca, Co];
const LEGS: MuscleGroup[] = [Q, H, G, Ca];

export const SPLIT_PRESETS: Record<number, { name: string; days: DaySplit }[]> = {
  2: [
    { name: 'Yuqori / Pastki', days: [UPPER, LOWER] },
    { name: 'Butun tana ×2', days: [[Q, H, C, B, S, Co], [Q, G, C, B, Bi, T]] },
  ],
  3: [
    { name: 'Ko‘krak + qo‘llar / Yelka + orqa / Oyoqlar', days: [[C, Bi, T], [S, B], [...LEGS, Co]] },
    { name: 'Itarish / Tortish / Oyoqlar', days: [[C, S, T], [B, Bi], [...LEGS, Co]] },
    { name: 'Ko‘krak + triseps / Orqa + bitseps / Oyoq + yelka', days: [[C, T], [B, Bi], [Q, H, G, S]] },
    { name: 'Butun tana ×3', days: [[Q, C, B, S, Co], [H, G, C, B, Bi, T], [Q, H, B, S, Ca, Co]] },
  ],
  4: [
    { name: 'Yuqori / Pastki ×2', days: [UPPER, LOWER, UPPER, LOWER] },
    { name: 'Ko‘krak + triseps / Orqa + bitseps / Oyoqlar / Yelka + qo‘llar', days: [[C, T], [B, Bi], LEGS, [S, Bi, T, Co]] },
  ],
  5: [
    { name: 'Ko‘krak / Orqa / Oyoqlar / Yelka / Qo‘llar', days: [[C], [B], LEGS, [S, Co], [Bi, T]] },
    { name: 'Yuqori / Pastki + Itarish / Tortish / Oyoqlar', days: [UPPER, LOWER, [C, S, T], [B, Bi], LEGS] },
  ],
  6: [
    { name: 'Itarish / Tortish / Oyoqlar ×2', days: [[C, S, T], [B, Bi], [...LEGS, Co], [C, S, T], [B, Bi], [...LEGS, Co]] },
    { name: 'Ko‘krak + orqa / Yelka + qo‘llar / Oyoqlar ×2', days: [[C, B, Co], [S, Bi, T], LEGS, [C, B, Co], [S, Bi, T], LEGS] },
  ],
};

const clampDays = (n: number) => Math.min(6, Math.max(2, n));

/** Profildagi taqsimot amaldami: kunlar soniga teng, har kunda kamida bitta guruh. Aks holda — tavsiya etilgan bo'linma */
export function customSplitOf(p: Pick<Profile, 'split' | 'daysPerWeek'>): DaySplit | null {
  const sp = p.split;
  if (!sp || sp.length !== clampDays(p.daysPerWeek) || sp.some((d) => !d.length)) return null;
  return sp;
}

/** Kunlar sonini o'zgartirganda taqsimot: mavjud kunlar saqlanadi, yetishmagani birinchi tayyor variantdan */
export function resizeSplit(split: DaySplit | undefined, days: number): DaySplit {
  const preset = SPLIT_PRESETS[clampDays(days)][0].days;
  return Array.from({ length: clampDays(days) }, (_, i) => [...(split?.[i] ?? preset[i])]);
}

/** Kun nomi: oyoq guruhlari — "Oyoqlar", bitseps + triseps — "Qo‘llar", deyarli hammasi — "Butun tana" */
export function splitDayTitle(groups: MuscleGroup[]): string {
  const has = (g: MuscleGroup) => groups.includes(g);
  if (groups.length >= 8 || (has(C) && has(B) && (has(Q) || has(H)))) return 'Butun tana';
  const parts: string[] = [];
  const legs = has(Q) && (has(H) || has(G));
  const arms = has(Bi) && has(T);
  for (const g of GROUP_ORDER) {
    if (!has(g)) continue;
    if (legs && LEGS.includes(g)) {
      if (!parts.includes('Oyoqlar')) parts.push('Oyoqlar');
      continue;
    }
    if (arms && (g === Bi || g === T)) {
      if (!parts.includes('Qo‘llar')) parts.push('Qo‘llar');
      continue;
    }
    parts.push(GROUPS[g].name);
  }
  return parts.length > 3 ? `${parts.slice(0, 2).join(' + ')} + yana ${parts.length - 2}` : parts.join(' + ');
}

export interface SplitHint {
  level: 'warn' | 'info';
  text: string;
}

const names = (gs: MuscleGroup[]) => gs.map((g) => GROUPS[g].name.toLowerCase()).join(', ');

/** Taqsimot bo'yicha maslahatlar: bo'sh kun, ishlamay qolgan mushak, ketma-ket kunlar, haftasiga bir marta, vaqtga sig'maslik */
export function splitAdvice(split: DaySplit, trainingDays: number[], sessionMin: number): SplitHint[] {
  const out: SplitHint[] = [];
  const empty = split.flatMap((d, i) => (d.length ? [] : [i + 1]));
  if (empty.length) out.push({ level: 'warn', text: `${empty.join(', ')}-kun uchun mushak tanlanmagan.` });

  const freq = (g: MuscleGroup) => split.filter((d) => d.includes(g)).length;
  const missing = GROUP_ORDER.filter((g) => !freq(g));
  const missMajor = missing.filter((g) => MAJOR_GROUPS.includes(g));
  const missMinor = missing.filter((g) => !MAJOR_GROUPS.includes(g));
  if (missMajor.length) out.push({ level: 'warn', text: `Haftada umuman ishlamaydi: ${names(missMajor)}. Muvozanat va jarohatsizlik uchun har katta guruhni kamida bir kunga qo‘shing.` });
  if (missMinor.length) out.push({ level: 'info', text: `Alohida mashq qilinmaydi: ${names(missMinor)} — ular boshqa mashqlarda yordamchi sifatida qisman ishlaydi.` });

  // hafta kunlari: taqsimotning i-kuni — tartiblangan mashg'ulot kunlarining i-si
  const wd = trainingDays.length === split.length ? [...trainingDays].sort((a, b) => a - b) : null;
  if (wd) {
    for (let i = 0; i < split.length; i++) {
      const j = (i + 1) % split.length;
      if (i === j || (wd[j] - wd[i] + 7) % 7 !== 1) continue;
      const shared = split[i].filter((g) => MAJOR_GROUPS.includes(g) && split[j].includes(g));
      if (shared.length)
        out.push({
          level: 'warn',
          text: `${DAYS[wd[i]]} va ${DAYS[wd[j]].toLowerCase()} ketma-ket: ${names(shared)}. Og‘ir ishlagan mushak ~48 soatda tiklanadi — bu guruhni boshqa kunga o‘tkazing.`,
        });
    }
  }

  const once = MAJOR_GROUPS.filter((g) => freq(g) === 1);
  if (once.length && split.length >= 3)
    out.push({
      level: 'info',
      text: `Haftasiga bir marta: ${names(once)}. Har mushakni 2 marta ishlatish o‘sish uchun biroz samaraliroq (Schoenfeld, 2016), lekin haftalik setlar yetarli bo‘lsa, bir marta ham o‘sadi — dastur shu kuni ko‘proq set beradi.`,
    });

  // har guruhga kamida bitta mashq (~10–12 daqiqa) — undan ko'p guruh bo'lsa, kunda har biriga bittadan tushadi
  const cap = Math.max(3, Math.floor(sessionMin / 11));
  split.forEach((d, i) => {
    if (d.length > cap)
      out.push({ level: 'info', text: `${i + 1}-kun: ${d.length} guruh ${sessionMin} daqiqaga ko‘p — har biriga bittadan mashq, vaqt yetmasa ba’zilari tushib qoladi. Kamroq guruh tanlang yoki vaqtni oshiring.` });
  });
  return out;
}
