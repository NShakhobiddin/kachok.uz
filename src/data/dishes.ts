// Milliy taomlar ma’lumotnomasi: tartib (ommabopligi bo‘yicha), belgi, foydali maslahat va yengil retsept (bo‘lsa).
// Kaloriya va makrolar — foods.ts dagi 100 g qiymatlardan, porsiya — odatiy idish (birinchi o‘lchov).
import { FOOD_MAP, type FoodItem } from './foods';

export interface DishInfo {
  id: string;
  icon: string;
  tip: string;
  /** yengilroq, oqsilga boy varianti — retsept id */
  light?: string;
}

const D = (id: string, icon: string, tip: string, light?: string): DishInfo => ({ id, icon, tip, light });

export const DISHES: DishInfo[] = [
  D('osh', '🍚', 'Guruchni kamroq, go‘sht va achchiq-chuchukni ko‘proq oling. Haftada 1–2 marta — mutlaqo mumkin.', 'light-plov'),
  D('somsa', '🥟', 'Tandir somsa yog‘li: bitta somsa — bir mahal ovqatning yarmi. Ko‘katli yoki qovoqli varianti yengilroq.'),
  D('lagmon', '🍜', 'Go‘shtli qismini ko‘paytirib, xamirini kamaytiring.', 'chicken-lagman'),
  D('manti', '🥟', 'Qatiq bilan yeng — oqsil qo‘shiladi. 5 dona — to‘yimli bir mahal.'),
  D('shashlik', '🍢', 'Oqsilga boy, uglevod yo‘q. Non va yog‘li qismini kamroq, achchiq-chuchukni ko‘proq.', 'oven-kebab'),
  D('shorva', '🍲', 'Go‘shtli sho‘rva oqsilga boy; ustidagi yog‘ini olib tashlang.'),
  D('mastava', '🥣', 'Yengil va to‘yimli — kechki ovqatga mos.', 'mastava-light'),
  D('chuchvara', '🥟', 'Sho‘rvali chuchvara qovurilganidan ancha yengil.'),
  D('dimlama', '🥘', 'Sabzavotga boy, yog‘ kam — eng foydali milliy taomlardan.', 'dimlama'),
  D('moshxorda', '🍲', 'Mosh — o‘simlik oqsili va tolaga boy.', 'moshxorda-light'),
  D('qozon-kabob', '🍖', 'Kartoshkasi yog‘da qovurilgan — salat bilan muvozanatlang.'),
  D('norin', '🍝', 'Go‘sht va xamir teng — porsiyani kichikroq oling.'),
  D('qovurma-lagmon', '🍜', 'Qovurilgani uchun sho‘rvali lag‘mondan deyarli 1,5 barobar og‘ir.', 'chicken-lagman'),
  D('osh-tovuq', '🍚', 'Tovuqli osh mol yoki qo‘y go‘shtlisidan biroz yengil.', 'light-plov'),
  D('tandir-gosht', '🍖', 'Oqsil ko‘p, uglevod yo‘q; yog‘li qismini kesib tashlasangiz — ancha yengil.'),
  D('qovurma', '🍖', 'Yog‘da qovurilgan — kichik porsiya va ko‘p sabzavot bilan.'),
  D('jigar-kabob', '🍢', 'Jigar temir va B12 vitaminiga boy; charvisi yog‘ qo‘shadi.'),
  D('lula', '🍢', 'Qiymaga dumba qo‘shiladi — oddiy shashlikdan yog‘liroq.'),
  D('shashlik-tovuq', '🍢', 'Eng yengil kaboblardan — oqsil ko‘p, yog‘ kam.', 'oven-kebab'),
  D('tovuq-qovurma', '🍗', 'Kartoshkani kamaytirib, sabzavot qo‘shing.'),
  D('baliq-qovurma', '🐟', 'Baliq — sifatli oqsil va omega-3; pechda pishirilsa yanada yengil.', 'baked-fish'),
  D('xonim', '🌯', 'Kartoshkalisi yengilroq, go‘shtlisi to‘yimliroq; qatiq bilan yeng.'),
  D('beshbarmoq', '🍲', 'Go‘sht va xamir — porsiyada xamirni kamroq oling.'),
  D('shivit-oshi', '🍜', 'Ko‘katli xamir — ustidagi qayla yog‘ini kamaytirsangiz yengil.'),
  D('mampar', '🍜', 'Sho‘rvali lag‘mon — qovurilgan lag‘mondan yengil.'),
  D('ugra-oshi', '🍲', 'Yengil sho‘rva: go‘shtini ko‘paytirsangiz oqsil yetadi.'),
  D('kuza-shorva', '🍲', 'Sopol ko‘zada sekin pishadi — yog‘i kam, mazasi to‘yimli.'),
  D('halim', '🥣', 'Bug‘doy va go‘sht — uzoq to‘q tutadi, oqsil yetarli.'),
  D('moshkichiri-dish', '🍛', 'Mosh va guruch — ustiga tuxum qo‘ysangiz oqsil oshadi.', 'moshkichiri'),
  D('shirguruch', '🍚', 'Sutli guruch — shakarni kamroq soling.'),
  D('manti-qovoq', '🥟', 'Go‘shtli mantidan ancha yengil — kechki ovqatga mos.'),
  D('chuchvara-qovurma', '🥟', 'Qovurilgan — sho‘rvalisidan deyarli ikki barobar og‘ir.'),
  D('somsa-kok', '🥟', 'Go‘shtli somsadan yengil, lekin xamiri baribir yog‘li.'),
  D('somsa-qovoq', '🥟', 'Qovoqli somsa — eng yengil somsalardan.'),
  D('dolma', '🍃', 'Tok bargidagi qiyma va guruch — qatiq bilan yaxshi.'),
  D('hasip', '🌭', 'Juda yog‘li — kichik bo‘lak yetarli.'),
  D('gumma', '🥐', 'Yog‘da qovurilgan — yo‘l-yo‘lakay emas, ba’zida.'),
  D('tuxum-barak', '🥟', 'Tuxumli barak — oqsil ko‘p emas, xamir asosiy qismi.'),
  D('qatlama', '🫓', 'Yog‘da qatlanib pishadi — bitta qatlama ~400 kkal.'),
  D('bogirsoq', '🍩', 'Qovurilgan xamir — bayram dasturxonida bir-ikki dona.'),
  D('jiz', '🍖', 'Eng yog‘li go‘sht taomlaridan — kichik porsiya va ko‘p ko‘kat.'),
  D('qazi', '🌭', 'Juda yog‘li: bir bo‘lak — 100 kkal dan ortiq.'),
  D('achchiq-chuchuk', '🥗', 'Deyarli kaloriyasiz — har qanday og‘ir taomga eng yaxshi hamroh.'),
  D('chalop', '🥒', 'Yozda chanqoq bosadi, kaloriyasi juda kam.'),
  D('sumalak', '🍯', 'Navro‘z taomi — tabiiy shirin, shakar qo‘shilmaydi.'),
  D('nisholda', '🍮', 'Asosan shakar — bir porsiya 200 kkal.'),
  D('chak-chak', '🍯', 'Yog‘da qovurilgan xamir va asal — bir bo‘lak ~230 kkal.'),
  D('parvarda', '🍬', 'Deyarli toza shakar — choy bilan 1–2 dona.'),
  D('non', '🍞', 'Bir mahalda chorak non (~60 g) — 160 kkal. Butun nonni «bilmasdan» yeb qo‘yish oson.'),
  D('patir', '🍞', 'Patir oddiy nondan yog‘liroq — chorakda ~230 kkal.'),
  D('shirmoy-non', '🍞', 'Sut va shakar qo‘shilgan non — oddiy nondan biroz og‘ir.'),
];

export interface DishView extends DishInfo {
  food: FoodItem;
  unit: { name: string; g: number };
  kcal: number;
  p: number;
  f: number;
  c: number;
}

/** odatiy porsiya birinchi o‘lchov bo‘lmagan taomlar (manti — 5 dona, qazi — porsiya) */
const SERVE: Record<string, string> = { manti: '5 dona', 'manti-qovoq': '5 dona', qazi: 'porsiya' };

/** Porsiya bo‘yicha qiymatlar (odatiy porsiya) */
export const DISH_VIEWS: DishView[] = DISHES.map((d) => {
  const food = FOOD_MAP[d.id];
  if (!food) throw new Error(`dishes.ts: foods.ts da yo‘q: ${d.id}`);
  const unit = food.units?.find((u) => u.name === SERVE[d.id]) ?? food.units?.[0] ?? { name: '100 g', g: 100 };
  const k = unit.g / 100;
  return { ...d, food, unit, kcal: Math.round(food.kcal * k), p: Math.round(food.p * k), f: Math.round(food.f * k), c: Math.round(food.c * k) };
});
