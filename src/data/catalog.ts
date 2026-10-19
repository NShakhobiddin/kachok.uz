// Mushaklar, jihozlar, jarohatlar va sog‘liq foydalari katalogi.
import type { BenefitId, EquipmentId, Injury, MuscleGroup, MuscleId } from '../types';

export const MUSCLES: Record<MuscleId, { name: string; group: MuscleGroup; view: 'front' | 'back' }> = {
  chest: { name: "Ko‘krak", group: 'chest', view: 'front' },
  frontDelts: { name: 'Old delta', group: 'shoulders', view: 'front' },
  sideDelts: { name: "O‘rta delta", group: 'shoulders', view: 'front' },
  rearDelts: { name: 'Orqa delta', group: 'shoulders', view: 'back' },
  biceps: { name: 'Bitseps', group: 'biceps', view: 'front' },
  triceps: { name: 'Triseps', group: 'triceps', view: 'back' },
  forearms: { name: 'Bilak', group: 'biceps', view: 'front' },
  traps: { name: 'Trapetsiya', group: 'back', view: 'back' },
  lats: { name: 'Keng orqa (qanotlar)', group: 'back', view: 'back' },
  upperBack: { name: "Orqa o‘rtasi", group: 'back', view: 'back' },
  lowerBack: { name: 'Bel', group: 'core', view: 'back' },
  abs: { name: 'Qorin pressi', group: 'core', view: 'front' },
  obliques: { name: 'Qiyshiq mushaklar', group: 'core', view: 'front' },
  glutes: { name: 'Dumba', group: 'glutes', view: 'back' },
  quads: { name: 'Son oldi (kvadritseps)', group: 'quads', view: 'front' },
  hamstrings: { name: 'Son orqasi', group: 'hamstrings', view: 'back' },
  adductors: { name: 'Son ichki qismi', group: 'quads', view: 'front' },
  calves: { name: 'Boldir', group: 'calves', view: 'back' },
};

export const GROUPS: Record<MuscleGroup, { name: string; muscles: MuscleId[] }> = {
  chest: { name: "Ko‘krak", muscles: ['chest'] },
  back: { name: 'Orqa', muscles: ['lats', 'upperBack', 'traps'] },
  shoulders: { name: 'Yelka', muscles: ['frontDelts', 'sideDelts', 'rearDelts'] },
  biceps: { name: 'Bitseps', muscles: ['biceps', 'forearms'] },
  triceps: { name: 'Triseps', muscles: ['triceps'] },
  quads: { name: 'Son oldi', muscles: ['quads', 'adductors'] },
  hamstrings: { name: 'Son orqasi', muscles: ['hamstrings'] },
  glutes: { name: 'Dumba', muscles: ['glutes'] },
  calves: { name: 'Boldir', muscles: ['calves'] },
  core: { name: 'Press va bel', muscles: ['abs', 'obliques', 'lowerBack'] },
};

export const GROUP_ORDER: MuscleGroup[] = ['chest', 'back', 'shoulders', 'biceps', 'triceps', 'quads', 'hamstrings', 'glutes', 'calves', 'core'];

/**
 * Haftalik set maqsadi (to‘g‘ridan-to‘g‘ri setlar). Pastki chegara — sezilarli o‘sish uchun minimal hajm,
 * yuqori — ko‘pchilik tiklana oladigan hajm (Schoenfeld 2017, Pelland 2026).
 */
export const WEEKLY_TARGET: Record<MuscleGroup, [number, number]> = {
  chest: [10, 20],
  back: [10, 22],
  shoulders: [8, 20],
  biceps: [6, 14],
  triceps: [6, 14],
  quads: [10, 18],
  hamstrings: [8, 16],
  glutes: [8, 16],
  calves: [6, 12],
  core: [6, 20],
};

export interface EquipmentInfo {
  id: EquipmentId;
  name: string;
  hint: string;
}

export const EQUIPMENT: EquipmentInfo[] = [
  { id: 'barbell', name: 'Shtanga', hint: 'Olimpik shtanga va disklar' },
  { id: 'rack', name: 'Shtanga ramasi', hint: "Stoyka yoki kvadrat rama — o‘tirish va jim uchun" },
  { id: 'bench', name: 'Skameyka', hint: "To‘g‘ri, gorizontal skameyka" },
  { id: 'inclineBench', name: 'Qiya skameyka', hint: 'Burchagi sozlanadigan skameyka' },
  { id: 'dumbbells', name: 'Gantellar', hint: "Turli og‘irlikdagi gantellar qatori" },
  { id: 'ezBar', name: 'EZ-shtanga', hint: 'Egri qisqa shtanga — bitseps va triseps uchun' },
  { id: 'kettlebell', name: 'Girya', hint: 'Bir yoki bir nechta girya' },
  { id: 'cable', name: 'Krossover (blok)', hint: "Balandligi o‘zgaradigan kabelli blok" },
  { id: 'latPulldown', name: 'Yuqori blok', hint: 'Orqa uchun tepadan tortish trenajyori' },
  { id: 'seatedRow', name: 'Pastki blok', hint: "O‘tirib gorizontal tortish trenajyori" },
  { id: 'smith', name: 'Smit mashinasi', hint: "Yo‘naltiruvchili shtanga" },
  { id: 'legPress', name: 'Oyoq press', hint: 'Platformani oyoq bilan itarish trenajyori' },
  { id: 'hackSquat', name: 'Gakk-mashina', hint: "Qiya yo‘naltiruvchida o‘tirish" },
  { id: 'legExtension', name: 'Oyoq yozish', hint: "O‘tirib tizzani yozish trenajyori" },
  { id: 'legCurl', name: 'Oyoq bukish', hint: 'Son orqa qismi uchun trenajyor' },
  { id: 'chestPress', name: "Ko‘krak press trenajyori", hint: "O‘tirib oldinga itarish" },
  { id: 'pecDeck', name: 'Batterflay', hint: "Qo‘llarni birlashtirish trenajyori" },
  { id: 'shoulderPress', name: 'Yelka press trenajyori', hint: 'Tepaga itarish trenajyori' },
  { id: 'hyperext', name: 'Giperekstenziya', hint: '45° bel va dumba stanogi' },
  { id: 'pullupBar', name: 'Turnik', hint: 'Tortilish uchun gorizontal tayoq' },
  { id: 'dipBars', name: 'Brusya', hint: 'Parallel tutqichlar' },
  { id: 'bands', name: 'Rezina lentalar', hint: 'Qarshilik lentalari' },
  { id: 'box', name: 'Platforma', hint: 'Step yoki mustahkam quti' },
  { id: 'cardio', name: 'Kardio', hint: "Yugurish yo‘lakchasi, velotrenajyor, eshkak" },
];

export const EQUIPMENT_PRESETS: { id: string; name: string; desc: string; items: EquipmentId[] }[] = [
  {
    id: 'full',
    name: "To‘liq jihozlangan zal",
    desc: 'Shtanga, trenajyorlar, bloklar — hammasi bor',
    items: EQUIPMENT.map((e) => e.id),
  },
  {
    id: 'basic',
    name: 'Oddiy zal',
    desc: 'Shtanga, gantellar, asosiy trenajyorlar',
    items: ['barbell', 'rack', 'bench', 'inclineBench', 'dumbbells', 'ezBar', 'cable', 'latPulldown', 'seatedRow', 'legPress', 'legCurl', 'legExtension', 'pullupBar', 'dipBars', 'cardio'],
  },
  {
    id: 'home',
    name: 'Uy sharoiti',
    desc: 'Gantellar, skameyka, turnik, lentalar',
    items: ['dumbbells', 'bench', 'inclineBench', 'pullupBar', 'bands'],
  },
  {
    id: 'bodyweight',
    name: "Faqat o‘z vaznim",
    desc: 'Jihozsiz yoki faqat turnik',
    items: ['pullupBar'],
  },
];

export const INJURIES: { id: Injury; name: string; note: string }[] = [
  { id: 'lowerBack', name: 'Bel', note: "Og‘ir o‘q yuklamasi va engashib ko‘tarish cheklanadi" },
  { id: 'knee', name: 'Tizza', note: "Chuqur o‘tirish va sakrashlar kamaytiriladi" },
  { id: 'shoulder', name: 'Yelka', note: 'Bosh ortidan va chuqur jim mashqlari olib tashlanadi' },
  { id: 'elbow', name: 'Tirsak', note: 'Fransuzcha jim kabi tirsakka og‘ir mashqlar almashtiriladi' },
  { id: 'wrist', name: "Bilak bo‘g‘imi", note: 'Gantel va neytral ushlash afzal' },
  { id: 'hip', name: "Tos-son bo‘g‘imi", note: "Chuqur bukilish va keng qadamlar kamaytiriladi" },
  { id: 'neck', name: "Bo‘yin", note: "Bo‘yinga bosim tushiradigan mashqlar chiqariladi" },
];

/** Tibbiy foydalar — tanadagi joylashuvi (old ko‘rinish siluetida, 0..100 x 0..220) */
export const BENEFITS: Record<BenefitId, { name: string; icon: string; x: number; y: number; text: string; source: string }> = {
  bone: {
    name: 'Suyak zichligi',
    icon: 'bone',
    x: 40,
    y: 116,
    text: "Og‘irlik suyakka bosim beradi va suyak hujayralari zichlikni oshiradi. 8 oylik og‘ir kuch mashqi bel umurtqalari zichligini +2.9% oshirgan.",
    source: 'watson2018',
  },
  heart: {
    name: 'Yurak va qon bosimi',
    icon: 'heart',
    x: 56,
    y: 62,
    text: "Muntazam kuch mashqlari qon bosimini pasaytiradi va yurak-qon tomir kasalliklari xavfini kamaytiradi.",
    source: 'cornelissen2013',
  },
  metabolic: {
    name: 'Qand va metabolizm',
    icon: 'drop',
    x: 62,
    y: 134,
    text: "Ishlayotgan mushak qondagi qandni insulinsiz ham so‘radi (GLUT4). Bu 2-tur diabet xavfini kamaytiradi va HbA1c ni pasaytiradi.",
    source: 'umpierre2011',
  },
  posture: {
    name: 'Qaddi-qomat',
    icon: 'spine',
    x: 50,
    y: 52,
    text: "Kuraklarni orqaga tortuvchi mushaklar kuchaysa, yelkalar oldinga egilmaydi — telefon va kompyuter ortidagi 'bukchayish' kamayadi.",
    source: 'westcott2012',
  },
  backHealth: {
    name: 'Bel salomatligi',
    icon: 'spine',
    x: 50,
    y: 96,
    text: "Kuch va stabilizatsiya mashqlari surunkali bel og‘rig‘ida funksiyani eng yaxshi tiklaydigan usullar qatorida.",
    source: 'owen2020',
  },
  joints: {
    name: "Bo‘g‘imlar mustahkamligi",
    icon: 'joint',
    x: 40,
    y: 160,
    text: "Bo‘g‘im atrofidagi mushak va paylar kuchaysa, bo‘g‘im barqaror bo‘ladi va jarohat xavfi kamayadi.",
    source: 'acsm2026',
  },
  mood: {
    name: 'Kayfiyat va stress',
    icon: 'brain',
    x: 50,
    y: 14,
    text: "Kuch mashqlari depressiya alomatlarini sezilarli kamaytiradi va xavotirni pasaytiradi.",
    source: 'gordon2018',
  },
  longevity: {
    name: 'Uzoq umr',
    icon: 'pulse',
    x: 44,
    y: 66,
    text: "Haftasiga 30–60 daqiqa kuch mashqi umumiy o‘lim xavfini 10–17% ga kamaytiradi.",
    source: 'momma2022',
  },
  grip: {
    name: 'Qo‘l kuchi',
    icon: 'hand',
    x: 82,
    y: 118,
    text: "Kuchli qo‘l siqishi kundalik ishlarni yengillashtiradi va keksalikda mustaqil hayotga yordam beradi.",
    source: 'westcott2012',
  },
  balance: {
    name: 'Muvozanat',
    icon: 'balance',
    x: 58,
    y: 206,
    text: "Bir oyoqda bajariladigan mashqlar muvozanat va koordinatsiyani oshiradi — yiqilish xavfi kamayadi.",
    source: 'acsm2026',
  },
  core: {
    name: 'Tana markazi',
    icon: 'core',
    x: 50,
    y: 84,
    text: "Kuchli press va bel mushaklari umurtqani korset kabi ushlab, og‘ir ko‘tarishda belni himoya qiladi.",
    source: 'owen2020',
  },
  fatLoss: {
    name: "Yog' yoqish",
    icon: 'flame',
    x: 38,
    y: 88,
    text: "Mushak massasi oshsa, tinch holatdagi energiya sarfi ortadi; 10 haftalik kuch mashqi ~1.8 kg yog‘ni kamaytirgan.",
    source: 'westcott2012',
  },
};
