// Xavfsizlik profillarida takrorlanadigan matnlar: setdan oldingi qoidalar (C), to'xtash belgilari (S), chiqish yo'llari.

export const C = {
  warm: 'Ishchi vazndan oldin 2–3 ta isinish seti: taxminan 40%, 60% va 80%.',
  collars: 'Disklarni qisqich (zamok) bilan mahkamlang — sirg‘algan disk shtangani bir tomonga ag‘daradi.',
  thumb: 'Shtangani bosh barmoq bilan o‘rab ushlang. Bosh barmoqsiz «ochiq» ushlashda shtanga kaftdan sirg‘alib, to‘g‘ri ko‘krak yoki bo‘yinga tushadi.',
  pinsSquat: 'Rama to‘sinlarini (safety pin) eng past nuqtangizdagi shtanga sathidan 3–5 sm pastga o‘rnating.',
  pinsBench: 'Ramada yoki to‘sinli skameykada yoting: to‘sinlar ko‘krak sathidan biroz pastda. To‘sin bo‘lmasa — sug‘urtachi so‘rang.',
  benchCollars: 'Qisqich faqat to‘sin yoki sug‘urtachi bo‘lsa. Yolg‘iz va to‘sinsiz bo‘lsangiz — qisqichsiz (pastdagi chiqish yo‘liga qarang).',
  stack: 'Shtift (pin) og‘irlik blokiga oxirigacha kirganini, tros va karabinda yemirilish yo‘qligini tekshiring.',
  band: 'Rezinani yoriq va yemirilish uchun tekshiring, mahkam tayanchga iling — uzilgan lenta yuz va ko‘zga uriladi.',
  dbStart: 'Gantellarni sonlarga qo‘yib, orqaga yotayotganda tizza bilan yuqoriga uzating — ularni poldan bukilgan bel bilan ko‘tarmang.',
  seat: (what: string) => `O‘rindiq va tayanchni moslang: ${what}.`,
};

export const S = {
  radiating: 'Oyoqqa tarqaluvchi og‘riq, uvishish yoki karaxtlik — nerv ildizi ta’sirlanishi belgisi',
  back: 'Belda to‘satdan o‘tkir og‘riq yoki «qotib qolish»',
  knee: 'Tizza ichida o‘tkir og‘riq, «qulflanib qolish» yoki tizza «chiqib ketgandek» bo‘lishi',
  shoulder: 'Yelka ichida o‘tkir sanchiq, og‘riqli «qirsillash» yoki qo‘l kuchsizlanib qolishi',
  pec: 'Ko‘krak yoki qo‘ltiq yaqinida «qars» etib uzilish hissi, keyin kuchsizlik va ko‘karish — ko‘krak mushagi uzilishi belgisi: zudlik bilan travmatologga',
  biceps: 'Tirsak bukimida «qars» va keskin og‘riq, bitseps yuqoriga «yig‘ilib» qolishi — pay uzilishi belgisi: zudlik bilan travmatologga',
  elbow: 'Tirsakning ichki yoki tashqi suyak bo‘rtig‘ida o‘tkir og‘riq',
  wrist: 'Bilakda sanchiq yoki barmoqlarga tarqaluvchi uvishish',
  neck: 'Bo‘yindan yelka yoki qo‘lga tarqaluvchi og‘riq, uvishish',
  head: 'Kuchanish paytida to‘satdan juda kuchli bosh og‘rig‘i — to‘xtang va tez yordam chaqiring (103)',
  achilles: 'Tovon ustida kimdir tepgandek zarba hissi — Axill payi uzilishi belgisi: zudlik bilan travmatologga',
  ham: 'Son orqasida o‘tkir «tortilish» yoki «chirt» etish — mushak cho‘zilishi, davom etmang',
  hip: 'Chov yoki son bo‘g‘imi ichida o‘tkir, «chimchilovchi» og‘riq',
};

export const BENCH_BAIL =
  'To‘sinlar bilan: shtangani ko‘krakka tushiring, belni skameykaga tekislang — shtanga to‘sinlarga tushadi, ostidan sirg‘alib chiqing. Yolg‘iz va to‘sinsiz: shtangani bir tomonga qiyshaytirib, disklarni to‘kib yuboring (shuning uchun qisqich taqilmaydi). Shtangani hech qachon bo‘yin ustida ushlab qolmang.';
export const DB_PRESS_BAIL =
  'Gantellarni ko‘krak yoniga tushirib, tanadan tashqariga — yon tomonga qo‘yib yuboring; hech qachon yuz ustida ushlab turmang. Tugatganda gantellarni ko‘krakka olib, tizzalarni ko‘tarib, ularning og‘irligi bilan o‘tirgan holatga qayting.';
export const FALL_BAIL = 'Muvozanat yo‘qolsa gantellarni yon tomonga qo‘yib yuboring va oyoqlarni yaqinlashtiring — gantelni ushlab qolishga urinmang.';
export const BAR_DOWN = 'Sekin pastga tushing va oyoqlarni platformaga qo‘ying — balanddan sakrab tushmang.';
