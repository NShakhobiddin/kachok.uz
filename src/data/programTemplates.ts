// Tayyor dasturlar: mashhur murabbiy va tadqiqotchilar uslubidagi haftalik rejalar. Tanlansa — profil sozlamalari
// (uslub, kunlar, taqsimot) o'zgaradi va dastur generatori mashqlarni jihoz, daraja va cheklovlarga qarab tanlaydi.
// Bu rasmiy dasturlarning nusxasi emas: g'oyasi va tuzilishiga asoslangan.
import { DEFAULT_DAYS } from '../engine/program';
import { resolveMethod, type ConcreteMethod } from '../engine/methods';
import { customSplitOf, type DaySplit } from '../engine/split';
import type { MuscleGroup, Profile, Program } from '../types';
import { GROUP_ORDER } from './catalog';

const [C, B, S, Bi, T, Q, H, G, Ca, Co] = GROUP_ORDER;

export interface ProgramTemplate {
  id: string;
  name: string;
  /** kimning uslubi yoki qaysi tavsiyaga asoslangan */
  author: string;
  who: string;
  how: string;
  days: number;
  level: string;
  method: ConcreteMethod;
  split?: DaySplit;
  focus?: MuscleGroup[];
  sessionMin?: number;
}

export const PROGRAM_TEMPLATES: ProgramTemplate[] = [
  {
    id: 'tpl-linear',
    name: 'Kuch 3×5 — chiziqli',
    author: 'Mark Rippetoe («Starting Strength») va StrongLifts 5×5 g‘oyasida',
    who: 'Zalga endi kelganlar: kuch har mashg‘ulotda o‘sadigan eng tez davr.',
    how: 'Har mashg‘ulotda o‘tirib-turish va navbat bilan ikki xil kun (A/B). Barcha takrorlar bajarilsa — keyingi safar oyoqqa +5 kg, yuqori tanaga +2.5 kg.',
    days: 3,
    level: 'Boshlovchi',
    method: 'linear',
  },
  {
    id: 'tpl-fullbody',
    name: 'Butun tana — 3 kun',
    author: 'ACSM tavsiyasi: har mushak haftasiga 2–3 marta',
    who: 'Boshlovchilar va haftasiga 3 kun vaqti borlar — eng muvozanatli boshlanish.',
    how: 'Har mashg‘ulotda oyoq, ko‘krak, orqa va yelka; har mushak haftasiga 3 marta, har safar kam set — tez o‘rganish va yaxshi tiklanish.',
    days: 3,
    level: 'Boshlovchi',
    method: 'hypertrophy',
  },
  {
    id: 'tpl-glutes',
    name: 'Dumba va oyoq ustuvor — 3 kun',
    author: 'Bret Contreras (dumba mushagi tadqiqotchisi) tavsiyalari g‘oyasida',
    who: 'Dumba va son shakli muhim bo‘lganlar — ko‘pincha ayollar uchun eng mashhur tanlov.',
    how: 'Ikki kun oyoq va dumba (o‘tirish, tos ko‘tarish, rumincha tortish), bir kun yuqori tana. Dumbaga haftasiga 2 marta, turli burchakdan.',
    days: 3,
    level: 'Har qanday',
    method: 'hypertrophy',
    split: [
      [Q, G, Co],
      [C, B, S, Bi, T],
      [H, G, Ca],
    ],
    focus: ['glutes'],
  },
  {
    id: 'tpl-upper-lower',
    name: 'Yuqori / pastki — 4 kun',
    author: 'Renaissance Periodization (Dr. Mike Israetel) mezotsikl tamoyillari',
    who: 'Mushak o‘stirmoqchi bo‘lgan, 2–3 oy tajribasi bor sportchilar.',
    how: 'Har mushak haftasiga 2 marta. Har hafta zaxira takror kamayadi (3 → 1), setlar mushak fikringizga qarab qo‘shiladi, blok oxirida yengil hafta.',
    days: 4,
    level: 'O‘rta',
    method: 'hypertrophy',
  },
  {
    id: 'tpl-ppl3',
    name: 'Itarish / tortish / oyoq — 3 kun',
    author: 'Klassik bodibilding bo‘linmasi',
    who: 'Haftasiga 3 kun, har kuni bir mushak guruhlariga ko‘p e’tibor bermoqchi bo‘lganlar.',
    how: '1-kun ko‘krak, yelka, triseps; 2-kun orqa va bitseps; 3-kun oyoqlar. Har mushak haftasiga 1 marta, lekin kun ichida katta hajm.',
    days: 3,
    level: 'O‘rta',
    method: 'hypertrophy',
    split: [
      [C, S, T],
      [B, Bi],
      [Q, H, G, Ca, Co],
    ],
  },
  {
    id: 'tpl-ppl6',
    name: 'Itarish / tortish / oyoq ×2 — 6 kun',
    author: 'Klassik bodibilding bo‘linmasi (ikki aylanish)',
    who: 'Tajribali, haftasiga 6 kun shug‘ullana oladiganlar.',
    how: 'Itarish, tortish, oyoq — haftasiga ikki marta. Har mushak 2 marta, katta haftalik hajm.',
    days: 6,
    level: 'Tajribali',
    method: 'hypertrophy',
  },
  {
    id: 'tpl-strength',
    name: 'Kuch bloki — 4 kun',
    author: 'Blok periodizatsiyasi (Issurin) va RPE bo‘yicha boshqaruv (Helms)',
    who: 'O‘tirib-turish, yotib jim va o‘lik tortishda kuchni oshirmoqchi bo‘lgan o‘rta va tajribali sportchilar.',
    how: 'Asosiy mashqlar har hafta og‘irlashadi: 4×6 @75% → 4×5 @80% → 4×4 @85% → 3×3 @88%, keyin yengil hafta. Yordamchi mashqlar — hajm uchun.',
    days: 4,
    level: 'O‘rta',
    method: 'strength',
  },
  {
    id: 'tpl-phul',
    name: 'Powerbuilding — 4 kun',
    author: 'PHUL uslubida (kuch + hajm)',
    who: 'Ham kuch, ham tashqi ko‘rinish kerak bo‘lganlar, haftasiga 4 kun.',
    how: 'Ikki og‘ir kun (4–6 takror) kuchni, ikki hajm kuni (8–15 takror) mushakni o‘stiradi. Har mushak haftasiga 2 marta.',
    days: 4,
    level: 'O‘rta',
    method: 'powerbuilding',
  },
  {
    id: 'tpl-minimal',
    name: 'Vaqt kam — 2 kun × 45 daqiqa',
    author: 'JSST (WHO) minimal tavsiyasi: haftasiga 2 kun kuch mashqi',
    who: 'Bandlar, ota-onalar, sog‘liq uchun shug‘ullanadiganlar.',
    how: 'Ikkita butun tana mashg‘uloti, har biri ~45 daqiqa. Eng kam vaqtda sog‘liq va kuchni saqlash.',
    days: 2,
    level: 'Har qanday',
    method: 'hypertrophy',
    sessionMin: 45,
  },
];

export const TEMPLATE_MAP: Record<string, ProgramTemplate> = Object.fromEntries(PROGRAM_TEMPLATES.map((t) => [t.id, t]));

/** Dasturni tanlaganda profilga yoziladigan o'zgarishlar (kunlar soni o'zgarsa — standart hafta kunlari) */
export function templatePatch(t: ProgramTemplate, p: Profile): Partial<Profile> {
  return {
    method: t.method,
    daysPerWeek: t.days,
    trainingDays: p.trainingDays.length === t.days ? p.trainingDays : DEFAULT_DAYS[t.days],
    split: t.split,
    focus: t.focus ? [...new Set([...p.focus, ...t.focus])] : p.focus,
    ...(t.sessionMin ? { sessionMin: t.sessionMin } : {}),
  };
}

/** Hozirgi dastur shu andoza bilan tuzilganmi */
export function isCurrentTemplate(t: ProgramTemplate, p: Profile, program: Program | null): boolean {
  const split = customSplitOf(p);
  const sameSplit = t.split ? !!split && JSON.stringify(split) === JSON.stringify(t.split) : !split;
  return p.daysPerWeek === t.days && sameSplit && (program?.method ?? resolveMethod(p)) === t.method;
}

/** Profilga eng mos dasturlar (birinchisi — "Sizga mos") */
export function recommendTemplates(p: Profile): ProgramTemplate[] {
  const ids: string[] = [];
  const add = (...x: string[]) => x.forEach((id) => !ids.includes(id) && ids.push(id));
  if (p.daysPerWeek <= 2) add('tpl-minimal');
  if (p.level === 'beginner') {
    if (p.sex === 'female' && p.goal !== 'strength') add('tpl-glutes', 'tpl-fullbody');
    else if (p.goal === 'strength' || p.goal === 'muscle') add('tpl-linear', 'tpl-fullbody');
    else add('tpl-fullbody');
  } else if (p.goal === 'strength') add(p.daysPerWeek >= 4 ? 'tpl-strength' : 'tpl-linear', 'tpl-phul');
  else if (p.sex === 'female') add('tpl-glutes', p.daysPerWeek >= 4 ? 'tpl-upper-lower' : 'tpl-fullbody');
  else if (p.daysPerWeek >= 6) add('tpl-ppl6', 'tpl-upper-lower');
  else if (p.daysPerWeek >= 4) add(p.level === 'advanced' ? 'tpl-phul' : 'tpl-upper-lower', 'tpl-upper-lower');
  else add('tpl-fullbody', 'tpl-ppl3');
  add(...PROGRAM_TEMPLATES.map((t) => t.id));
  return ids.map((id) => TEMPLATE_MAP[id]);
}
