// Ovqat kundaligi uchun mahsulot va taomlar bazasi. Qiymatlar 100 g (ichimliklar — 100 ml) uchun, tayyor holatda.
// Asosiy mahsulotlar: USDA FoodData Central. Milliy taomlar: an'anaviy retseptlar bo'yicha hisoblangan o'rtacha qiymat
// (oshxonaga qarab ±20% farq qiladi). Porsiyalar — O'zbekistondagi odatiy idish va dona o'lchamlari.

export type FoodCat = 'dish' | 'meat' | 'dairy' | 'grain' | 'veg' | 'fruit' | 'nut' | 'fat' | 'sweet' | 'drink' | 'fast';

export interface FoodItem {
  id: string;
  name: string;
  /** qidiruv uchun boshqa nomlar */
  alt?: string;
  cat: FoodCat;
  kcal: number;
  p: number;
  f: number;
  c: number;
  /** odatiy porsiyalar; birinchisi — standart */
  units?: { name: string; g: number }[];
}

export const FOOD_CATS: Record<FoodCat, string> = {
  dish: 'Milliy taomlar',
  meat: 'Go‘sht, baliq, tuxum',
  dairy: 'Sut mahsulotlari',
  grain: 'Non va yormalar',
  veg: 'Sabzavot va dukkaklilar',
  fruit: 'Mevalar',
  nut: 'Yong‘oqlar',
  fat: 'Yog‘lar va souslar',
  sweet: 'Shirinliklar',
  drink: 'Ichimliklar',
  fast: 'Fastfud',
};

const F = (id: string, name: string, cat: FoodCat, kcal: number, p: number, f: number, c: number, units?: FoodItem['units'], alt?: string): FoodItem => ({ id, name, cat, kcal, p, f, c, units, alt });

export const FOOD_DB: FoodItem[] = [
  // Milliy taomlar
  F('osh', 'Osh (palov)', 'dish', 230, 6.9, 11, 26, [{ name: 'likopcha', g: 350 }, { name: 'katta likopcha', g: 500 }], 'plov palov'),
  F('somsa', 'Somsa (go‘shtli, tandir)', 'dish', 290, 8.5, 17, 26, [{ name: 'dona', g: 120 }], 'samsa'),
  F('somsa-kok', 'Somsa (ko‘katli)', 'dish', 220, 5, 10, 28, [{ name: 'dona', g: 110 }], 'samsa'),
  F('lagmon', 'Lag‘mon', 'dish', 133, 4.9, 4.5, 18, [{ name: 'kosa', g: 450 }], 'lagman'),
  F('qovurma-lagmon', 'Qovurma lag‘mon', 'dish', 185, 7, 8, 21, [{ name: 'likopcha', g: 400 }], 'lagman'),
  F('mastava', 'Mastava', 'dish', 75, 3, 2.8, 9.5, [{ name: 'kosa', g: 400 }]),
  F('shorva', 'Sho‘rva (go‘shtli)', 'dish', 80, 5, 4.5, 5, [{ name: 'kosa', g: 400 }], 'shurpa'),
  F('manti', 'Manti', 'dish', 220, 10, 11, 20, [{ name: 'dona', g: 50 }, { name: '5 dona', g: 250 }]),
  F('chuchvara', 'Chuchvara (sho‘rvali)', 'dish', 129, 5.7, 5, 15, [{ name: 'kosa', g: 350 }], 'chuchvara pelmen'),
  F('moshxorda', 'Moshxo‘rda', 'dish', 95, 4, 2.5, 14, [{ name: 'kosa', g: 400 }], 'mosh'),
  F('qozon-kabob', 'Qozon kabob', 'dish', 217, 10, 14, 13, [{ name: 'porsiya', g: 300 }]),
  F('dimlama', 'Dimlama', 'dish', 90, 5, 4.5, 7, [{ name: 'porsiya', g: 400 }]),
  F('shashlik', 'Shashlik (mol/qo‘y)', 'dish', 250, 24, 17, 0, [{ name: 'six', g: 70 }], 'kabob'),
  F('shashlik-tovuq', 'Shashlik (tovuq)', 'dish', 180, 25, 8, 1, [{ name: 'six', g: 80 }], 'kabob'),
  F('lula', 'Lula kabob', 'dish', 280, 17, 23, 2, [{ name: 'six', g: 80 }], 'kabob'),
  F('norin', 'Norin', 'dish', 210, 10, 9, 22, [{ name: 'porsiya', g: 250 }]),
  F('hasip', 'Hasip', 'dish', 300, 13, 26, 4, [{ name: 'bo‘lak', g: 100 }]),
  F('achchiq-chuchuk', 'Achchiq-chuchuk', 'dish', 40, 1, 2.5, 4, [{ name: 'porsiya', g: 150 }], 'salat'),
  F('chalop', 'Chalop', 'dish', 35, 1.5, 1.5, 3.5, [{ name: 'kosa', g: 300 }]),
  F('tuxum-barak', 'Tuxum barak', 'dish', 190, 8, 7, 24, [{ name: '10 dona', g: 200 }], 'barak'),
  F('gumma', 'Gumma (qovurilgan)', 'dish', 310, 8, 16, 34, [{ name: 'dona', g: 90 }], 'pirojki'),

  // Go'sht, baliq, tuxum
  F('chicken-breast', 'Tovuq ko‘kragi (pishgan)', 'meat', 165, 31, 3.6, 0, [{ name: 'porsiya', g: 150 }], 'tovuq'),
  F('chicken-thigh', 'Tovuq soni (pishgan)', 'meat', 209, 26, 11, 0, [{ name: 'dona', g: 120 }], 'tovuq'),
  F('beef', 'Mol go‘shti, yog‘siz (qaynatilgan)', 'meat', 217, 27, 12, 0, [{ name: 'porsiya', g: 150 }], 'gosht'),
  F('lamb', 'Qo‘y go‘shti (pishgan)', 'meat', 294, 25, 21, 0, [{ name: 'porsiya', g: 150 }], 'gosht'),
  F('mince', 'Qiyma (mol, 15%)', 'meat', 250, 26, 15, 0, [{ name: 'porsiya', g: 150 }], 'farsh'),
  F('liver', 'Jigar (mol, qovurilgan)', 'meat', 175, 27, 5, 5, [{ name: 'porsiya', g: 120 }]),
  F('fish-white', 'Oq baliq (pishirilgan)', 'meat', 105, 22, 1.5, 0, [{ name: 'porsiya', g: 150 }], 'baliq'),
  F('salmon', 'Qizil baliq (losos)', 'meat', 208, 20, 13, 0, [{ name: 'porsiya', g: 120 }], 'baliq'),
  F('tuna', 'Tunets (konserva, o‘z sharbatida)', 'meat', 116, 26, 1, 0, [{ name: 'banka', g: 130 }], 'tuna baliq'),
  F('egg', 'Tuxum', 'meat', 143, 12.6, 9.5, 0.7, [{ name: 'dona', g: 55 }]),
  F('egg-white', 'Tuxum oqi', 'meat', 52, 11, 0.2, 0.7, [{ name: 'dona', g: 33 }]),
  F('sausage', 'Kolbasa (qaynatilgan)', 'meat', 257, 13, 22, 1.5, [{ name: 'bo‘lak', g: 20 }], 'kolbasa doktorskaya'),
  F('hotdog-sausage', 'Sosiska', 'meat', 266, 11, 24, 2, [{ name: 'dona', g: 50 }]),

  // Sut mahsulotlari
  F('milk', 'Sut 2.5%', 'dairy', 52, 2.9, 2.5, 4.7, [{ name: 'stakan', g: 250 }]),
  F('qatiq', 'Qatiq / kefir 2.5%', 'dairy', 53, 3, 2.5, 4, [{ name: 'stakan', g: 250 }], 'kefir'),
  F('suzma', 'Suzma', 'dairy', 140, 12, 8, 4, [{ name: 'osh qoshiq', g: 30 }, { name: 'porsiya', g: 150 }]),
  F('tvorog', 'Tvorog 5%', 'dairy', 121, 17, 5, 3, [{ name: 'porsiya', g: 180 }], 'tvorog'),
  F('tvorog-0', 'Tvorog 0–2%', 'dairy', 90, 18, 1.5, 3.3, [{ name: 'porsiya', g: 180 }], 'tvorog'),
  F('yogurt-greek', 'Grek yogurti', 'dairy', 97, 9, 5, 3.9, [{ name: 'idish', g: 150 }], 'yogurt'),
  F('yogurt-sweet', 'Shirin yogurt', 'dairy', 95, 3, 2.5, 15, [{ name: 'idish', g: 125 }], 'yogurt'),
  F('cheese', 'Pishloq (qattiq)', 'dairy', 350, 25, 27, 2, [{ name: 'bo‘lak', g: 20 }], 'sir'),
  F('brynza', 'Brinza', 'dairy', 260, 18, 20, 1, [{ name: 'porsiya', g: 50 }]),
  F('qaymoq', 'Qaymoq', 'dairy', 340, 2.5, 35, 3, [{ name: 'osh qoshiq', g: 20 }]),
  F('smetana', 'Smetana 20%', 'dairy', 204, 2.8, 20, 3.2, [{ name: 'osh qoshiq', g: 20 }]),
  F('whey', 'Protein kukuni (zardob)', 'dairy', 400, 80, 5, 10, [{ name: 'o‘lchov', g: 30 }], 'protein'),

  // Non va yormalar
  F('non', 'Non (obi non)', 'grain', 265, 8.7, 1.7, 53, [{ name: 'chorak', g: 60 }, { name: 'yarim', g: 125 }, { name: 'dona', g: 250 }]),
  F('patir', 'Patir non', 'grain', 330, 8, 10, 52, [{ name: 'chorak', g: 70 }, { name: 'dona', g: 280 }]),
  F('bread-white', 'Oq non (buxanka)', 'grain', 265, 8, 3.2, 49, [{ name: 'bo‘lak', g: 30 }]),
  F('bread-rye', 'Qora non', 'grain', 250, 8.5, 3.3, 48, [{ name: 'bo‘lak', g: 30 }]),
  F('lavash', 'Lavash', 'grain', 275, 9, 1.2, 56, [{ name: 'dona', g: 80 }]),
  F('rice', 'Guruch (pishgan)', 'grain', 130, 2.7, 0.3, 28, [{ name: 'porsiya', g: 200 }]),
  F('buckwheat', 'Grechka (pishgan)', 'grain', 92, 3.4, 0.6, 20, [{ name: 'porsiya', g: 200 }]),
  F('oats', 'Suli yormasi (quruq)', 'grain', 379, 13, 6.5, 68, [{ name: 'porsiya', g: 60 }], 'gerkules ovsyanka'),
  F('pasta', 'Makaron (pishgan)', 'grain', 158, 5.8, 0.9, 31, [{ name: 'porsiya', g: 200 }]),
  F('potato', 'Kartoshka (qaynatilgan)', 'grain', 87, 1.9, 0.1, 20, [{ name: 'dona', g: 150 }]),
  F('potato-fried', 'Kartoshka (qovurilgan)', 'grain', 312, 3.4, 15, 41, [{ name: 'porsiya', g: 150 }], 'fri'),
  F('corn-flakes', 'Makkajo‘xori bodroqlari', 'grain', 357, 7.5, 0.4, 84, [{ name: 'porsiya', g: 40 }], 'hlopya'),

  // Sabzavot va dukkaklilar
  F('salad', 'Sabzavot salati (pomidor, bodring)', 'veg', 18, 0.9, 0.2, 3.6, [{ name: 'porsiya', g: 200 }], 'salat'),
  F('salad-oil', 'Salat yog‘ bilan', 'veg', 65, 1, 5, 4, [{ name: 'porsiya', g: 200 }], 'salat'),
  F('tomato', 'Pomidor', 'veg', 18, 0.9, 0.2, 3.9, [{ name: 'dona', g: 120 }]),
  F('cucumber', 'Bodring', 'veg', 15, 0.7, 0.1, 3.6, [{ name: 'dona', g: 100 }]),
  F('carrot', 'Sabzi', 'veg', 41, 0.9, 0.2, 10, [{ name: 'dona', g: 80 }]),
  F('chickpea', 'No‘xat (pishgan)', 'veg', 164, 8.9, 2.6, 27, [{ name: 'porsiya', g: 150 }]),
  F('mung', 'Mosh (pishgan)', 'veg', 105, 7, 0.4, 19, [{ name: 'porsiya', g: 150 }]),
  F('beans', 'Loviya (pishgan)', 'veg', 127, 8.7, 0.5, 23, [{ name: 'porsiya', g: 150 }]),
  F('lentil', 'Yasmiq (pishgan)', 'veg', 116, 9, 0.4, 20, [{ name: 'porsiya', g: 150 }]),

  // Mevalar
  F('apple', 'Olma', 'fruit', 52, 0.3, 0.2, 14, [{ name: 'dona', g: 160 }]),
  F('banana', 'Banan', 'fruit', 89, 1.1, 0.3, 23, [{ name: 'dona', g: 120 }]),
  F('grape', 'Uzum', 'fruit', 69, 0.7, 0.2, 18, [{ name: 'shingil', g: 150 }]),
  F('pomegranate', 'Anor', 'fruit', 83, 1.7, 1.2, 19, [{ name: 'dona', g: 250 }]),
  F('watermelon', 'Tarvuz', 'fruit', 30, 0.6, 0.2, 7.6, [{ name: 'bo‘lak', g: 300 }]),
  F('melon', 'Qovun', 'fruit', 36, 0.8, 0.2, 8.5, [{ name: 'bo‘lak', g: 250 }]),
  F('apricot', 'O‘rik', 'fruit', 48, 1.4, 0.4, 11, [{ name: 'dona', g: 35 }]),
  F('peach', 'Shaftoli', 'fruit', 39, 0.9, 0.3, 10, [{ name: 'dona', g: 150 }]),
  F('persimmon', 'Xurmo', 'fruit', 70, 0.6, 0.2, 19, [{ name: 'dona', g: 170 }]),
  F('orange', 'Apelsin', 'fruit', 47, 0.9, 0.1, 12, [{ name: 'dona', g: 180 }]),
  F('raisin', 'Mayiz', 'fruit', 299, 3.1, 0.5, 79, [{ name: 'hovuch', g: 30 }]),
  F('dried-apricot', 'Turshak (quritilgan o‘rik)', 'fruit', 241, 3.4, 0.5, 63, [{ name: 'hovuch', g: 30 }], 'kuraga'),
  F('dates', 'Xurmo (quruq, finik)', 'fruit', 282, 2.5, 0.4, 75, [{ name: 'dona', g: 8 }], 'finik'),

  // Yong'oqlar
  F('walnut', 'Yong‘oq', 'nut', 654, 15, 65, 14, [{ name: 'hovuch', g: 30 }]),
  F('almond', 'Bodom', 'nut', 579, 21, 50, 22, [{ name: 'hovuch', g: 30 }]),
  F('pistachio', 'Pista', 'nut', 560, 20, 45, 28, [{ name: 'hovuch', g: 30 }]),
  F('sunflower', 'Kungaboqar pistasi', 'nut', 584, 21, 51, 20, [{ name: 'hovuch', g: 30 }], 'semechka'),
  F('peanut-butter', 'Yeryong‘oq pastasi', 'nut', 588, 25, 50, 20, [{ name: 'osh qoshiq', g: 16 }], 'arahis'),

  // Yog'lar va souslar
  F('oil', 'O‘simlik yog‘i', 'fat', 884, 0, 100, 0, [{ name: 'osh qoshiq', g: 14 }, { name: 'choy qoshiq', g: 5 }], 'paxta yogi'),
  F('butter', 'Sariyog‘', 'fat', 717, 0.9, 81, 0.1, [{ name: 'choy qoshiq', g: 5 }, { name: 'bo‘lak', g: 10 }]),
  F('mayo', 'Mayonez', 'fat', 680, 1, 75, 2.6, [{ name: 'osh qoshiq', g: 15 }]),
  F('ketchup', 'Ketchup', 'fat', 112, 1.7, 0.3, 26, [{ name: 'osh qoshiq', g: 15 }]),

  // Shirinliklar
  F('sugar', 'Shakar / qand', 'sweet', 400, 0, 0, 100, [{ name: 'choy qoshiq', g: 5 }, { name: 'qand bo‘lagi', g: 5 }]),
  F('honey', 'Asal', 'sweet', 304, 0.3, 0, 82, [{ name: 'choy qoshiq', g: 8 }]),
  F('chocolate', 'Shokolad', 'sweet', 546, 5, 31, 61, [{ name: 'plitka', g: 90 }, { name: 'bo‘lak', g: 10 }]),
  F('cookies', 'Pechenye', 'sweet', 480, 6, 20, 68, [{ name: 'dona', g: 12 }]),
  F('cake', 'Tort', 'sweet', 370, 5, 18, 47, [{ name: 'bo‘lak', g: 100 }]),
  F('icecream', 'Muzqaymoq', 'sweet', 207, 3.5, 11, 24, [{ name: 'dona', g: 80 }]),
  F('halva', 'Holva', 'sweet', 516, 12, 30, 54, [{ name: 'bo‘lak', g: 30 }]),
  F('navvot', 'Navvot', 'sweet', 390, 0, 0, 98, [{ name: 'bo‘lak', g: 10 }]),

  // Ichimliklar (100 ml)
  F('tea', 'Choy (shakarsiz)', 'drink', 1, 0, 0, 0.2, [{ name: 'piyola', g: 150 }], 'kok choy qora choy'),
  F('coffee-milk', 'Qahva sut bilan', 'drink', 40, 2, 2, 3.5, [{ name: 'chashka', g: 200 }], 'kofe latte'),
  F('cola', 'Gazli ichimlik (shakarli)', 'drink', 42, 0, 0, 10.6, [{ name: 'stakan', g: 250 }, { name: '0.5 L', g: 500 }], 'kola'),
  F('juice', 'Sharbat', 'drink', 45, 0.5, 0.1, 11, [{ name: 'stakan', g: 250 }], 'sok'),
  F('kompot', 'Kompot', 'drink', 60, 0.2, 0, 15, [{ name: 'stakan', g: 250 }]),
  F('ayran', 'Ayron', 'drink', 27, 1.5, 1.2, 2, [{ name: 'stakan', g: 250 }], 'ayran'),

  // Fastfud
  F('shawarma', 'Lavash (shaurma)', 'fast', 230, 10, 11, 22, [{ name: 'dona', g: 350 }], 'shaurma doner'),
  F('burger', 'Burger', 'fast', 250, 13, 12, 24, [{ name: 'dona', g: 220 }], 'gamburger'),
  F('pizza', 'Pitsa', 'fast', 266, 11, 10, 33, [{ name: 'bo‘lak', g: 110 }]),
  F('hotdog', 'Hot-dog', 'fast', 290, 10, 17, 24, [{ name: 'dona', g: 150 }]),
  F('fries', 'Kartoshka fri', 'fast', 312, 3.4, 15, 41, [{ name: 'o‘rtacha', g: 115 }]),
];

export const FOOD_MAP: Record<string, FoodItem> = Object.fromEntries(FOOD_DB.map((f) => [f.id, f]));

/** Lotin yozuvidagi apostrof variantlarini birxillashtirib qidirish */
export function normalize(s: string): string {
  return s
    .toLowerCase()
    .replace(/[‘’ʻʼ`']/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

export function searchFoods(q: string, limit = 40): FoodItem[] {
  const n = normalize(q);
  if (!n) return FOOD_DB.slice(0, limit);
  const words = n.split(' ');
  return FOOD_DB.map((f) => {
    const hay = normalize(`${f.name} ${f.alt ?? ''}`);
    if (!words.every((w) => hay.includes(w))) return null;
    // so'z boshida mos kelsa — yuqoriroq
    const score = (normalize(f.name).startsWith(n) ? 0 : 1) + (hay.split(' ').some((w) => w.startsWith(words[0])) ? 0 : 1);
    return { f, score };
  })
    .filter((x): x is { f: FoodItem; score: number } => !!x)
    .sort((a, b) => a.score - b.score)
    .slice(0, limit)
    .map((x) => x.f);
}

/** Berilgan grammdagi qiymatlar */
export function portion(f: Pick<FoodItem, 'kcal' | 'p' | 'f' | 'c'>, g: number) {
  const k = g / 100;
  return { kcal: Math.round(f.kcal * k), p: Math.round(f.p * k * 10) / 10, f: Math.round(f.f * k * 10) / 10, c: Math.round(f.c * k * 10) / 10 };
}
