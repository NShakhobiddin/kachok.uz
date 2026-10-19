// Ovqatlanish: Mifflin–St Jeor (1990) + faollik, maqsadga ko‘ra kaloriya,
// oqsil (Morton 2018, ISSN 2017), yog' (Helms 2014), suv (EFSA 2010), tolalar.
import type { ActivityLevel, BodyEntry, Goal, Level, Profile, Sex } from '../types';

export const ACTIVITY: Record<ActivityLevel, { k: number; name: string; desc: string }> = {
  sedentary: { k: 1.2, name: 'Kam harakat', desc: "Asosan o‘tiraman, kuniga 5 000 qadamdan kam" },
  light: { k: 1.375, name: 'Yengil faol', desc: '5–7 ming qadam, ofis ishi' },
  moderate: { k: 1.55, name: "O‘rtacha faol", desc: '7–10 ming qadam yoki tik turib ishlash' },
  active: { k: 1.725, name: 'Faol', desc: "10 ming+ qadam yoki jismoniy ish" },
  veryActive: { k: 1.9, name: 'Juda faol', desc: "Og‘ir jismoniy mehnat yoki ikki mahal mashq" },
};

export function bmr(sex: Sex, kg: number, cm: number, age: number): number {
  return 10 * kg + 6.25 * cm - 5 * age + (sex === 'male' ? 5 : -161);
}

/** Kuch mashqining kunlik o‘rtacha qo‘shimcha sarfi (~4 MET netto) */
export function trainingKcalPerDay(kg: number, sessionMin: number, days: number): number {
  return (4 * 3.5 * kg * sessionMin * days) / 200 / 7;
}

export interface NutritionPlan {
  bmr: number;
  tdee: number;
  kcal: number;
  protein: number;
  fat: number;
  carbs: number;
  fiber: number;
  waterL: number;
  waterTrainingL: number;
  weeklyChangeKg: number;
  ratePct: number;
  meals: number;
  proteinPerMeal: number;
  refWeight: number;
  notes: string[];
}

/** Semizlikda oqsilni "ideal" vaznga (BMI 25) nisbatan hisoblash — ortiqcha raqamlardan saqlaydi */
export function referenceWeight(kg: number, cm: number): number {
  const bmi = kg / (cm / 100) ** 2;
  if (bmi <= 30) return kg;
  return 25 * (cm / 100) ** 2;
}

function surplusPct(goal: Goal, level: Level): number {
  switch (goal) {
    case 'muscle':
      return level === 'beginner' ? 0.12 : level === 'intermediate' ? 0.08 : 0.05;
    case 'strength':
      return 0.05;
    case 'recomp':
      return -0.05;
    case 'health':
      return 0;
    case 'fatLoss':
      return 0; // alohida hisoblanadi
  }
}

/** Formula bo'yicha kunlik sarf: Mifflin–St Jeor × faollik + mashg'ulotlar */
export function formulaTdee(p: Profile): number {
  return bmr(p.sex, p.weightKg, p.heightCm, p.age) * ACTIVITY[p.activity].k + trainingKcalPerDay(p.weightKg, p.sessionMin, p.daysPerWeek);
}

/** tdeeOverride — moslashuvchan (kundalik va vazn asosidagi) sarf berilsa, formula o'rniga ishlatiladi */
export function nutritionPlan(p: Profile, kcalAdjust = 0, tdeeOverride?: number): NutritionPlan {
  const b = bmr(p.sex, p.weightKg, p.heightCm, p.age);
  const tdee = tdeeOverride ?? formulaTdee(p);
  const notes: string[] = [];
  let kcal: number;
  let ratePct: number;
  if (p.goal === 'fatLoss') {
    ratePct = -0.6; // haftasiga tana vaznining 0.5–0.7% (Garthe 2011, Helms 2014)
    const deficit = Math.min((0.006 * p.weightKg * 7700) / 7, tdee * 0.25);
    kcal = tdee - deficit;
    const floor = Math.max(b * 1.05, p.sex === 'male' ? 1500 : 1200);
    if (kcal < floor) {
      kcal = floor;
      notes.push("Kaloriya xavfsiz minimumdan pastga tushirilmadi — sekinroq, lekin mushakni saqlab ozasiz.");
    }
  } else {
    const sp = surplusPct(p.goal, p.level);
    kcal = tdee * (1 + sp);
    ratePct = p.goal === 'muscle' ? (p.level === 'beginner' ? 0.4 : 0.25) : p.goal === 'strength' ? 0.15 : p.goal === 'recomp' ? -0.15 : 0;
  }
  kcal = Math.round((kcal + kcalAdjust) / 10) * 10;

  const refW = referenceWeight(p.weightKg, p.heightCm);
  let protPerKg: number;
  if (p.goal === 'fatLoss') protPerKg = 2.2;
  else if (p.goal === 'recomp') protPerKg = 2.0;
  else if (p.goal === 'health') protPerKg = 1.6;
  else protPerKg = 1.8;
  if (p.age >= 60) protPerKg = Math.max(protPerKg, 1.6);
  let protein = protPerKg * refW;
  if (p.bodyFat && p.goal === 'fatLoss') protein = Math.max(protein, 2.6 * p.weightKg * (1 - p.bodyFat / 100));
  protein = Math.round(protein / 5) * 5;

  let fat = Math.round(0.8 * refW);
  const fatPct = (fat * 9) / kcal;
  if (fatPct < 0.2) fat = Math.round((kcal * 0.2) / 9);
  if (fatPct > 0.35) fat = Math.round((kcal * 0.3) / 9);
  let carbs = Math.round((kcal - protein * 4 - fat * 9) / 4);
  if (carbs < 80) {
    carbs = 80;
    notes.push("Uglevodlar juda kamaymasligi uchun yog' biroz kamaytirildi.");
    fat = Math.max(Math.round((kcal * 0.2) / 9), Math.round((kcal - protein * 4 - carbs * 4) / 9));
  }
  const fiber = Math.max(25, Math.round((14 * kcal) / 1000));
  const waterL = p.sex === 'male' ? 2.0 : 1.6;
  const waterTrainingL = Math.round((p.sessionMin / 60) * 0.6 * 10) / 10;
  const meals = 4;
  const weeklyChangeKg = Math.round(((ratePct / 100) * p.weightKg) * 100) / 100;

  if (p.goal === 'muscle') notes.push("Haftasiga vaznning ~0.25–0.5% qo‘shilishi — asosan mushak, kam yog'.");
  if (p.goal === 'fatLoss') notes.push("Haftasiga vaznning ~0.5–0.7% kamayishi — mushakni saqlagan holda yog' yo‘qotish uchun optimal.");
  if (refW < p.weightKg) notes.push("Oqsil miqdori sog‘lom vazn (BMI 25) bo‘yicha hisoblandi.");

  return {
    bmr: Math.round(b),
    tdee: Math.round(tdee),
    kcal,
    protein,
    fat,
    carbs,
    fiber,
    waterL,
    waterTrainingL,
    weeklyChangeKg,
    ratePct,
    meals,
    proteinPerMeal: Math.round(protein / meals),
    refWeight: Math.round(refW),
    notes,
  };
}

/** Tana vazni trendi: eksponensial silliqlash (kundalik tebranishlarni yashiradi) */
export function weightTrend(entries: BodyEntry[], alpha = 0.25): { date: string; raw: number; trend: number }[] {
  const pts = entries.filter((e) => e.weightKg).sort((a, b) => a.date.localeCompare(b.date));
  let t = pts[0]?.weightKg ?? 0;
  return pts.map((e) => {
    t = t + alpha * (e.weightKg! - t);
    return { date: e.date, raw: e.weightKg!, trend: Math.round(t * 100) / 100 };
  });
}

/**
 * Haftalik tekshiruv (MacroFactor uslubida): trend bo‘yicha haqiqiy o‘zgarish maqsaddan farq qilsa,
 * kaloriyani 100–150 kkal ga moslashni taklif qiladi.
 */
export function weeklyCheck(entries: BodyEntry[], plan: NutritionPlan, weightKg: number): { delta: number; message: string } | null {
  const tr = weightTrend(entries);
  if (tr.length < 6) return null;
  const lastDate = new Date(tr[tr.length - 1].date);
  const weekAgo = new Date(lastDate.getTime() - 14 * 86400000);
  const base = tr.find((x) => new Date(x.date) >= weekAgo);
  if (!base) return null;
  const days = (lastDate.getTime() - new Date(base.date).getTime()) / 86400000;
  if (days < 7) return null;
  const perWeek = ((tr[tr.length - 1].trend - base.trend) / days) * 7;
  const actualPct = (perWeek / weightKg) * 100;
  const target = plan.ratePct;
  const diff = actualPct - target;
  if (Math.abs(diff) < 0.2) return { delta: 0, message: `Haftalik o‘zgarish ${fmtSigned(perWeek)} kg — reja bo‘yicha. Shunday davom eting!` };
  if (diff > 0) return { delta: -120, message: `Vazn rejadan tezroq oshmoqda (${fmtSigned(perWeek)} kg/hafta). Kuniga ~120 kkal kamaytirishni tavsiya qilamiz.` };
  return { delta: 120, message: `Vazn rejadan tezroq kamaymoqda (${fmtSigned(perWeek)} kg/hafta). Mushakni saqlash uchun kuniga ~120 kkal qo‘shing.` };
}

function fmtSigned(n: number) {
  const r = Math.round(n * 100) / 100;
  return (r > 0 ? '+' : '') + r.toFixed(2);
}

/* ---------------- Ovqatlanish rejasi (mahalliy mahsulotlar) ---------------- */

export interface Food {
  id: string;
  name: string;
  unit?: { name: string; g: number };
  kcal: number;
  p: number;
  f: number;
  c: number;
  tags?: ('meat' | 'dairy' | 'egg' | 'fish' | 'veg')[];
}

/** 100 g uchun taxminiy qiymatlar (USDA FoodData Central asosida, tayyor holatda) */
export const FOODS: Record<string, Food> = {
  chicken: { id: 'chicken', name: "Tovuq ko‘kragi (pishgan)", kcal: 165, p: 31, f: 3.6, c: 0, tags: ['meat'] },
  beef: { id: 'beef', name: "Mol go‘shti, yog‘siz (qaynatilgan)", kcal: 217, p: 27, f: 12, c: 0, tags: ['meat'] },
  fish: { id: 'fish', name: 'Oq baliq (pishirilgan)', kcal: 105, p: 22, f: 1.5, c: 0, tags: ['fish'] },
  egg: { id: 'egg', name: 'Tuxum', unit: { name: 'dona', g: 55 }, kcal: 143, p: 12.6, f: 9.5, c: 0.7, tags: ['egg'] },
  tvorog: { id: 'tvorog', name: 'Tvorog 5%', kcal: 121, p: 17, f: 5, c: 3, tags: ['dairy'] },
  qatiq: { id: 'qatiq', name: 'Qatiq / kefir 2.5%', kcal: 53, p: 3, f: 2.5, c: 4, tags: ['dairy'] },
  milk: { id: 'milk', name: 'Sut 2.5%', kcal: 52, p: 2.9, f: 2.5, c: 4.7, tags: ['dairy'] },
  chickpea: { id: 'chickpea', name: "No‘xat (pishgan)", kcal: 164, p: 8.9, f: 2.6, c: 27, tags: ['veg'] },
  mung: { id: 'mung', name: 'Mosh (pishgan)', kcal: 105, p: 7, f: 0.4, c: 19, tags: ['veg'] },
  rice: { id: 'rice', name: 'Guruch (pishgan)', kcal: 130, p: 2.7, f: 0.3, c: 28, tags: ['veg'] },
  buckwheat: { id: 'buckwheat', name: 'Grechka (pishgan)', kcal: 92, p: 3.4, f: 0.6, c: 20, tags: ['veg'] },
  oats: { id: 'oats', name: 'Suli yormasi (quruq)', kcal: 379, p: 13, f: 6.5, c: 68, tags: ['veg'] },
  bread: { id: 'bread', name: 'Non (obi non)', kcal: 265, p: 8.7, f: 1.7, c: 53, tags: ['veg'] },
  potato: { id: 'potato', name: 'Kartoshka (qaynatilgan)', kcal: 87, p: 1.9, f: 0.1, c: 20, tags: ['veg'] },
  pasta: { id: 'pasta', name: 'Makaron (pishgan)', kcal: 158, p: 5.8, f: 0.9, c: 31, tags: ['veg'] },
  banana: { id: 'banana', name: 'Banan', unit: { name: 'dona', g: 120 }, kcal: 89, p: 1.1, f: 0.3, c: 23, tags: ['veg'] },
  apple: { id: 'apple', name: 'Olma', unit: { name: 'dona', g: 160 }, kcal: 52, p: 0.3, f: 0.2, c: 14, tags: ['veg'] },
  walnut: { id: 'walnut', name: "Yong‘oq", kcal: 654, p: 15, f: 65, c: 14, tags: ['veg'] },
  oil: { id: 'oil', name: "O‘simlik yog‘i", kcal: 884, p: 0, f: 100, c: 0, tags: ['veg'] },
  salad: { id: 'salad', name: 'Sabzavot salati (pomidor, bodring, ko‘katlar)', kcal: 18, p: 0.9, f: 0.2, c: 3.6, tags: ['veg'] },
};

type Role = 'P' | 'C' | 'F' | 'V';
interface MealItem {
  food: string;
  g: number;
  role: Role;
}

const MEAL_TEMPLATES: { name: string; time: string; items: MealItem[] }[] = [
  {
    name: 'Nonushta',
    time: '08:00',
    items: [
      { food: 'oats', g: 60, role: 'C' },
      { food: 'milk', g: 200, role: 'V' },
      { food: 'egg', g: 110, role: 'P' },
      { food: 'banana', g: 120, role: 'C' },
    ],
  },
  {
    name: 'Tushlik',
    time: '13:00',
    items: [
      { food: 'chicken', g: 150, role: 'P' },
      { food: 'rice', g: 200, role: 'C' },
      { food: 'salad', g: 200, role: 'V' },
      { food: 'oil', g: 10, role: 'F' },
    ],
  },
  {
    name: 'Tamaddi (mashqdan keyin)',
    time: '17:00',
    items: [
      { food: 'tvorog', g: 180, role: 'P' },
      { food: 'apple', g: 160, role: 'C' },
      { food: 'walnut', g: 20, role: 'F' },
    ],
  },
  {
    name: 'Kechki ovqat',
    time: '20:00',
    items: [
      { food: 'beef', g: 150, role: 'P' },
      { food: 'buckwheat', g: 200, role: 'C' },
      { food: 'salad', g: 200, role: 'V' },
      { food: 'oil', g: 5, role: 'F' },
    ],
  },
];

const SWAPS_VEG: Record<string, string> = { chicken: 'chickpea', beef: 'mung', fish: 'chickpea' };
const SWAPS_LACTOSE: Record<string, string> = { milk: 'banana', tvorog: 'egg', qatiq: 'egg' };

export interface MealPlanItem {
  food: Food;
  g: number;
  label: string;
}
export interface MealPlanMeal {
  name: string;
  time: string;
  items: MealPlanItem[];
  kcal: number;
  p: number;
  f: number;
  c: number;
}

function macro(items: MealItem[], role?: Role) {
  return items
    .filter((i) => !role || i.role === role)
    .reduce(
      (a, i) => {
        const f = FOODS[i.food];
        const k = i.g / 100;
        return { p: a.p + f.p * k, f: a.f + f.f * k, c: a.c + f.c * k };
      },
      { p: 0, f: 0, c: 0 },
    );
}

/** 3×3 chiziqli tenglama: P, F, C guruhlari koeffitsientlari bilan maqsadga erishish */
function solve3(m: number[][], v: number[]): number[] | null {
  const det = (a: number[][]) =>
    a[0][0] * (a[1][1] * a[2][2] - a[1][2] * a[2][1]) - a[0][1] * (a[1][0] * a[2][2] - a[1][2] * a[2][0]) + a[0][2] * (a[1][0] * a[2][1] - a[1][1] * a[2][0]);
  const D = det(m);
  if (Math.abs(D) < 1e-6) return null;
  return [0, 1, 2].map((col) => det(m.map((row, r) => row.map((x, c) => (c === col ? v[r] : x)))) / D);
}

export function mealPlan(plan: NutritionPlan, prefs: Profile['dietPrefs']): MealPlanMeal[] {
  const templates = MEAL_TEMPLATES.map((m) => ({
    ...m,
    items: m.items.map((i) => {
      let food = i.food;
      if (prefs.vegetarian && SWAPS_VEG[food]) food = SWAPS_VEG[food];
      if (prefs.lactoseFree && SWAPS_LACTOSE[food]) food = SWAPS_LACTOSE[food];
      return { ...i, food };
    }),
  }));
  const all = templates.flatMap((t) => t.items);
  const fixed = macro(all, 'V');
  const P = macro(all, 'P');
  const Cm = macro(all, 'C');
  const Fm = macro(all, 'F');
  // [sP, sC, sF] koeffitsientlari: oqsil, yog', uglevod tenglamalari
  const m = [
    [P.p, Cm.p, Fm.p],
    [P.f, Cm.f, Fm.f],
    [P.c, Cm.c, Fm.c],
  ];
  const v = [plan.protein - fixed.p, plan.fat - fixed.f, plan.carbs - fixed.c];
  const sol = solve3(m, v) ?? [1, 1, 1];
  const scale = sol.map((x) => Math.min(2.6, Math.max(0.4, x)));
  const k: Record<Role, number> = { P: scale[0], C: scale[1], F: scale[2], V: 1 };
  // Cheklovlar tufayli kaloriya chetga chiqsa — avval uglevod, keyin oqsil manbalari bilan tuzatamiz
  const kcalOf = (kk: Record<Role, number>) =>
    all.reduce((a, i) => a + (FOODS[i.food].kcal * i.g * kk[i.role]) / 100, 0);
  for (let guard = 0; guard < 60; guard++) {
    const kc = kcalOf(k);
    if (Math.abs(kc - plan.kcal) / plan.kcal < 0.04) break;
    const over = kc > plan.kcal;
    if (over && k.C > 0.25) k.C = Math.max(0.25, k.C - 0.05);
    else if (over && k.F > 0.3) k.F = Math.max(0.3, k.F - 0.05);
    else if (over && k.P > 0.5) k.P = Math.max(0.5, k.P - 0.05);
    else if (!over && k.C < 3) k.C += 0.05;
    else break;
  }

  return templates.map((t) => {
    const items = t.items.map((i) => {
      const food = FOODS[i.food];
      let g = i.g * k[i.role];
      g = food.unit ? Math.max(1, Math.round(g / food.unit.g)) * food.unit.g : i.role === 'F' ? Math.max(5, Math.round(g / 5) * 5) : Math.max(10, Math.round(g / 10) * 10);
      const label = food.unit ? `${Math.round(g / food.unit.g)} ${food.unit.name}` : `${g} g`;
      return { food, g, label };
    });
    const tot = items.reduce(
      (a, i) => ({ kcal: a.kcal + (i.food.kcal * i.g) / 100, p: a.p + (i.food.p * i.g) / 100, f: a.f + (i.food.f * i.g) / 100, c: a.c + (i.food.c * i.g) / 100 }),
      { kcal: 0, p: 0, f: 0, c: 0 },
    );
    return { name: t.name, time: t.time, items, kcal: Math.round(tot.kcal), p: Math.round(tot.p), f: Math.round(tot.f), c: Math.round(tot.c) };
  });
}

/** Milliy taomlar — taxminiy kaloriya (porsiya tarkibi oshxonaga qarab farq qiladi) */
export const NATIONAL_DISHES: { name: string; portion: string; kcal: number; p: number; tip: string }[] = [
  { name: 'Osh (palov)', portion: '1 likopcha, ~350 g', kcal: 800, p: 24, tip: "Guruchni kamroq, go‘sht va achchiq-chuchukni ko‘proq oling. Haftada 1–2 marta — mutlaqo mumkin." },
  { name: 'Somsa', portion: '1 dona, ~120 g', kcal: 350, p: 10, tip: "Tandir somsa yog‘li. Tovuqli yoki ko‘katli variant yengilroq." },
  { name: "Lag‘mon", portion: '1 kosa, ~450 g', kcal: 600, p: 22, tip: "Go‘shtli qismini ko‘paytirib, xamirini kamaytiring." },
  { name: 'Mastava', portion: '1 kosa, ~400 g', kcal: 300, p: 12, tip: 'Yengil va to‘yimli — kechki ovqatga mos.' },
  { name: "Sho‘rva", portion: '1 kosa, ~400 g', kcal: 320, p: 20, tip: "Go‘shtli sho‘rva oqsilga boy; yog‘ini olib tashlang." },
  { name: 'Manti', portion: '5 dona, ~250 g', kcal: 550, p: 25, tip: 'Qatiq bilan yeng — oqsil qo‘shiladi.' },
  { name: 'Chuchvara', portion: '1 kosa, ~350 g', kcal: 450, p: 20, tip: "Suyuq (sho‘rvali) variant qovurilganidan ancha yengil." },
  { name: 'Non', portion: '1 dona, ~250 g', kcal: 660, p: 22, tip: "Bir mahalda chorak non (~60 g) — 160 kkal. Butun nonni 'bilmasdan' yeb qo‘yish oson." },
  { name: 'Moshxo‘rda', portion: '1 kosa, ~400 g', kcal: 380, p: 16, tip: "Mosh — o‘simlik oqsili va tolaga boy." },
  { name: 'Qozon kabob', portion: '1 porsiya, ~300 g', kcal: 650, p: 30, tip: "Kartoshkasi yog‘da qovurilgan — salat bilan muvozanatlang." },
];

/** Ilmiy asoslangan qo‘shimchalar (dalil darajasi bilan) */
export const SUPPLEMENTS: { name: string; grade: 'A' | 'B' | 'C' | 'X'; dose: string; text: string; source?: string }[] = [
  { name: 'Kreatin monogidrat', grade: 'A', dose: 'Kuniga 3–5 g, har kuni', text: "Kuch va mushak o‘sishini isbotlangan holda oshiradi. Yuklash shart emas. Sog‘lom odamlar uchun xavfsiz.", source: 'kreider2017' },
  { name: 'Kofein', grade: 'A', dose: '3–6 mg/kg, mashqdan 60 daqiqa oldin', text: "Kuch va chidamlilikni oshiradi. Kechki mashqdan oldin uyquni buzadi.", source: 'guest2021' },
  { name: 'Oqsil kukuni (protein)', grade: 'B', dose: "Ovqatdan yetmagan qismi uchun", text: "Oddiy ovqatdan farqi yo‘q — faqat qulaylik. Kunlik oqsil miqdori muhim, kukun emas.", source: 'morton2018' },
  { name: 'D vitamini', grade: 'C', dose: 'Faqat tahlil asosida', text: "Yetishmovchilik bo‘lsa foydali (qishda keng tarqalgan). Shifokor bilan."},
  { name: 'BCAA, "yog‘ yoqardilar", testosteron kuchaytirgichlar', grade: 'X', dose: '—', text: "Yetarli oqsil iste’mol qilganda BCAA foyda bermaydi. Yog' yoqish va gormon 'kuchaytiruvchi' vositalar ishonchli dalilga ega emas, ba’zilari xavfli." },
];

/* ---------------- Moslashuvchan sarf (adaptive TDEE) ---------------- */
// Energiya balansi: sarf = o'rtacha iste'mol − ρ · (vazn o'zgarishi / kun), ρ ≈ 7700 kkal/kg (Hall 2008, aralash to'qima).
// Vazn o'zgarishi — oyna ichidagi o'lchovlar bo'yicha chiziqli regressiya (suv tebranishiga chidamli).
// Har hafta baho formuladan (Mifflin–St Jeor) boshlab, kuzatilganga tomon silliq siljiydi: 50% qadam, haftasiga ±150 kkal dan oshmaydi.

const RHO = 7700;
const DAY = 86400000;
const dayNum = (iso: string) => Math.round(Date.parse(iso.slice(0, 10) + 'T00:00:00Z') / DAY);
const isoOf = (n: number) => new Date(n * DAY).toISOString().slice(0, 10);

export interface TdeeEstimate {
  /** formula bo'yicha (boshlang'ich taxmin) */
  prior: number;
  /** joriy baho */
  tdee: number;
  /** oxirgi oynada kuzatilgan xom qiymat */
  observed: number | null;
  /** 0..1 — necha hafta ma'lumot bilan yangilangan */
  confidence: number;
  updates: number;
  /** oxirgi 21 kunda: to'liq yozilgan kunlar va tortilishlar */
  loggedDays: number;
  weighIns: number;
  avgIntake: number | null;
  /** vazn trendi, kg/hafta */
  trendPerWeek: number | null;
  history: { date: string; tdee: number }[];
}

/** Kunlik iste'mol (kkal), faqat "to'liq" kunlar: formula sarfining 40% idan kam yozilgan kun — chala deb hisoblanadi */
export function dailyIntake(entries: { date: string; kcal: number }[], prior: number): Map<number, number> {
  const sum = new Map<number, number>();
  for (const e of entries) sum.set(dayNum(e.date), (sum.get(dayNum(e.date)) ?? 0) + e.kcal);
  for (const [d, k] of sum) if (k < prior * 0.4) sum.delete(d);
  return sum;
}

function slopePerDay(pts: { x: number; y: number }[]): number | null {
  if (pts.length < 2) return null;
  const mx = pts.reduce((a, p) => a + p.x, 0) / pts.length;
  const my = pts.reduce((a, p) => a + p.y, 0) / pts.length;
  const sxx = pts.reduce((a, p) => a + (p.x - mx) ** 2, 0);
  if (!sxx) return null;
  return pts.reduce((a, p) => a + (p.x - mx) * (p.y - my), 0) / sxx;
}

const WINDOW = 21;

/** Bir oynadagi (end kunigacha 21 kun) kuzatilgan sarf; ma'lumot yetarli bo'lmasa — null */
function windowObs(intake: Map<number, number>, weights: { x: number; y: number }[], end: number, prior: number) {
  const from = end - WINDOW + 1;
  const kcals = [...intake.entries()].filter(([d]) => d >= from && d <= end).map(([, k]) => k);
  const ws = weights.filter((w) => w.x >= from && w.x <= end);
  const span = ws.length ? ws[ws.length - 1].x - ws[0].x : 0;
  const slope = slopePerDay(ws);
  const avg = kcals.length ? kcals.reduce((a, b) => a + b, 0) / kcals.length : null;
  const ok = kcals.length >= 8 && ws.length >= 4 && span >= 10 && slope !== null && avg !== null;
  const obs = ok ? Math.min(prior * 1.6, Math.max(prior * 0.6, avg! - RHO * slope!)) : null;
  return { obs, avg, slope, logged: kcals.length, weighIns: ws.length };
}

export function adaptiveTdee(food: { date: string; kcal: number }[], body: BodyEntry[], prior: number, today: string, weeks = 8): TdeeEstimate {
  const intake = dailyIntake(food, prior);
  const weights = body
    .filter((b) => b.weightKg)
    .map((b) => ({ x: dayNum(b.date), y: b.weightKg! }))
    .sort((a, b) => a.x - b.x);
  const t = dayNum(today);
  let est = prior;
  let updates = 0;
  const history: { date: string; tdee: number }[] = [];
  for (let k = weeks - 1; k >= 0; k--) {
    const end = t - 7 * k;
    const w = windowObs(intake, weights, end, prior);
    if (w.obs !== null) {
      est += Math.max(-150, Math.min(150, 0.5 * (w.obs - est)));
      updates++;
      history.push({ date: isoOf(end), tdee: Math.round(est) });
    }
  }
  const last = windowObs(intake, weights, t, prior);
  return {
    prior: Math.round(prior),
    tdee: Math.round(est / 10) * 10,
    observed: last.obs !== null ? Math.round(last.obs) : null,
    confidence: Math.min(1, updates / 3),
    updates,
    loggedDays: last.logged,
    weighIns: last.weighIns,
    avgIntake: last.avg !== null ? Math.round(last.avg) : null,
    trendPerWeek: last.slope !== null && last.weighIns >= 3 ? Math.round(last.slope * 7 * 100) / 100 : null,
    history,
  };
}
