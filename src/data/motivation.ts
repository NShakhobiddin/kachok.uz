// Motivatsiya: maqollar, ilmiy faktlar, yutuqlar.
import type { WorkoutLog } from '../types';

export const QUOTES: { text: string; by?: string }[] = [
  { text: 'Sabr tagi — sariq oltin.', by: "O‘zbek maqoli" },
  { text: "Tomchi-tomchi ko‘l bo‘lur.", by: "O‘zbek maqoli" },
  { text: 'Harakatda — barakat.', by: "O‘zbek maqoli" },
  { text: "Bugungi ishni ertaga qo‘yma.", by: "O‘zbek maqoli" },
  { text: "Mehnat qilsang — rohat ko‘rasan.", by: "O‘zbek maqoli" },
  { text: "Kuch — bilakda, bilim — yurakda.", by: "Xalq hikmati" },
  { text: "Motivatsiya boshlatadi. Odat davom ettiradi." },
  { text: "Eng yaxshi dastur — siz bajaradigan dastur." },
  { text: "Bir yaxshi mashg‘ulot hech narsani o‘zgartirmaydi. Yuzta oddiy mashg‘ulot hammasini o‘zgartiradi." },
  { text: "Siz bilan raqobatlashadigan yagona odam — kechagi o‘zingiz." },
  { text: "Charchagan kunlar ham hisobga kiradi. Kelganingizning o‘zi — g‘alaba." },
  { text: "Natija ko‘rinmasa ham, u allaqachon boshlangan: kuch avval asab tizimida o‘sadi." },
];

export const FACTS: { text: string; source: string }[] = [
  { text: "Haftasiga atigi 30–60 daqiqa kuch mashqi umumiy o‘lim xavfini 10–17% ga kamaytiradi.", source: 'momma2022' },
  { text: "Kuch mashqi depressiya alomatlarini dorilar bilan solishtirsa bo‘ladigan darajada kamaytiradi.", source: 'gordon2018' },
  { text: "Har bir qo‘shimcha haftalik set mushak o‘sishini ~0.4% ga oshiradi — lekin sifat muhim.", source: 'schoenfeld2017vol' },
  { text: "To‘liq charchoqqacha ishlash shart emas: 1–3 takror zaxira deyarli bir xil natija beradi.", source: 'refalo2023' },
  { text: "Pressni qancha mashq qilsangiz ham, qorin yog‘i faqat umumiy kaloriya taqchilligi bilan ketadi.", source: 'vispute2011' },
  { text: "Oqsil kuniga ~1.6 g/kg dan oshgach, mushak o‘sishiga qo‘shimcha foyda deyarli yo‘q.", source: 'morton2018' },
  { text: "Sekin ozish (haftasiga ~0.7%) mushakni saqlaydi va hatto oshiradi.", source: 'garthe2011' },
  { text: "50 yoshdan keyin ham 20 haftada o‘rtacha 1.1 kg mushak qo‘shish mumkin.", source: 'peterson2011' },
  { text: "Kuch mashqi suyak zichligini oshiradi — osteoporozning eng yaxshi profilaktikasi.", source: 'watson2018' },
  { text: "3 daqiqalik dam olish 1 daqiqaga qaraganda ko‘proq kuch va mushak beradi.", source: 'schoenfeld2016rest' },
  { text: "Kattalar uchun kerakli uyqu — 7–9 soat. Mushak aynan uyquda tiklanadi.", source: 'hirshkowitz2015' },
  { text: "Kreatin — eng ko‘p o‘rganilgan va xavfsiz sport qo‘shimchasi: kuniga 3–5 g.", source: 'kreider2017' },
];

export function dailyPick<T>(list: T[], salt = 0, d = new Date()): T {
  const day = Math.floor(d.getTime() / 86400000) + salt;
  return list[((day % list.length) + list.length) % list.length];
}

export interface AchievementCtx {
  logs: WorkoutLog[];
  totalWorkouts: number;
  totalVolume: number;
  totalMinutes: number;
  prCount: number;
  streak: number;
  lessonsDone: number;
  lessonsTotal: number;
}

export interface Achievement {
  id: string;
  title: string;
  desc: string;
  plate: 'red' | 'blue' | 'yellow' | 'green' | 'white';
  test: (c: AchievementCtx) => boolean;
}

export const ACHIEVEMENTS: Achievement[] = [
  { id: 'first', title: 'Birinchi qadam', desc: "Birinchi mashg‘ulot yakunlandi", plate: 'white', test: (c) => c.totalWorkouts >= 1 },
  { id: 'w5', title: 'Odat boshlandi', desc: "5 ta mashg‘ulot", plate: 'green', test: (c) => c.totalWorkouts >= 5 },
  { id: 'w10', title: "O‘nlik", desc: "10 ta mashg‘ulot", plate: 'green', test: (c) => c.totalWorkouts >= 10 },
  { id: 'w25', title: 'Doimiy mehmon', desc: "25 ta mashg‘ulot", plate: 'yellow', test: (c) => c.totalWorkouts >= 25 },
  { id: 'w50', title: 'Temir intizom', desc: "50 ta mashg‘ulot", plate: 'blue', test: (c) => c.totalWorkouts >= 50 },
  { id: 'w100', title: 'Yuzlik klub', desc: "100 ta mashg‘ulot", plate: 'red', test: (c) => c.totalWorkouts >= 100 },
  { id: 'pr1', title: 'Birinchi rekord', desc: 'Shaxsiy rekord (PR) o‘rnatildi', plate: 'yellow', test: (c) => c.prCount >= 1 },
  { id: 'pr10', title: 'Rekordchi', desc: '10 ta shaxsiy rekord', plate: 'red', test: (c) => c.prCount >= 10 },
  { id: 't1', title: "Damasni ko‘tardingiz", desc: 'Jami 1 tonna', plate: 'white', test: (c) => c.totalVolume >= 1000 },
  { id: 't10', title: 'Ikki fil', desc: 'Jami 10 tonna', plate: 'green', test: (c) => c.totalVolume >= 10000 },
  { id: 't50', title: 'Yuk mashinasi', desc: 'Jami 50 tonna', plate: 'blue', test: (c) => c.totalVolume >= 50000 },
  { id: 't150', title: "Ko‘k kit", desc: 'Jami 150 tonna', plate: 'red', test: (c) => c.totalVolume >= 150000 },
  { id: 's2', title: 'Ikki hafta ketma-ket', desc: 'Haftalik reja 2 hafta bajarildi', plate: 'green', test: (c) => c.streak >= 2 },
  { id: 's4', title: 'Bir oy intizom', desc: '4 hafta ketma-ket', plate: 'yellow', test: (c) => c.streak >= 4 },
  { id: 's12', title: 'Chorak yil', desc: '12 hafta ketma-ket', plate: 'red', test: (c) => c.streak >= 12 },
  { id: 'h10', title: '10 soat temirda', desc: "Jami 10 soat mashg‘ulot", plate: 'blue', test: (c) => c.totalMinutes >= 600 },
  {
    id: 'early',
    title: 'Erta qush',
    desc: "Soat 8:00 dan oldin mashg‘ulot",
    plate: 'white',
    test: (c) => c.logs.some((l) => l.finishedAt && new Date(l.startedAt).getHours() < 8),
  },
  { id: 'learn3', title: 'Bilimdon', desc: '3 ta dars tugatildi', plate: 'blue', test: (c) => c.lessonsDone >= 3 },
  { id: 'learnAll', title: 'Akademik', desc: 'Barcha darslar tugatildi', plate: 'yellow', test: (c) => c.lessonsTotal > 0 && c.lessonsDone >= c.lessonsTotal },
];

export function finishMessage(prs: number, workouts: number, streak: number): { title: string; text: string } {
  if (prs > 1) return { title: `${prs} ta yangi rekord!`, text: "Bugun siz o‘tgan haftadagi o‘zingizdan kuchliroqsiz. Aynan shunday o‘sish ko‘rinadi." };
  if (prs === 1) return { title: 'Yangi rekord!', text: 'Progressiv yuklama ishlayapti. Uyquga va oqsilga e’tibor bering — mushak dam olishda o‘sadi.' };
  if (workouts === 1) return { title: "Birinchi mashg‘ulot!", text: "Eng qiyin qadam ortda qoldi. Keyingi 2 hafta — odat shakllanadigan davr." };
  if (streak >= 4) return { title: `${streak} hafta ketma-ket!`, text: 'Bunday barqarorlik natijalarning 80% ini beradi.' };
  return { title: 'Mashg‘ulot bajarildi', text: "Har bir mashg‘ulot — omonatga qo‘yilgan pul. Foiz bilan qaytadi." };
}
