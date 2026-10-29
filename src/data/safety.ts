// Mashqlar xavfsizligi: travma xavfi darajasi, xavf ostidagi bo‘g‘imlar va jarohat mexanizmi, setdan oldingi tekshiruv,
// og‘irlikni xavfsiz tashlash, darhol to‘xtash belgilari va cheklov bo‘lganda mashqni moslashtirish.
// Asos: NSCA xavfsizlik va sug‘urta qoidalari (haff2016), og‘ir atletika jarohatlari epidemiologiyasi (keogh2017, kerr2010),
// og‘riq nazorati modeli (silbernagel2007), ko‘krak mushagi uzilishlari (elmaraghy2012).
import type { Injury } from '../types';

/** 1 — past, 2 — o‘rta, 3 — yuqori */
export type Risk = 1 | 2 | 3;

export interface JointRisk {
  at: Injury;
  /** nima va qachon zararlanadi */
  how: string;
  /** shu bo‘g‘imda muammo bo‘lsa — mashqni qanday moslashtirish */
  mod: string;
}

export interface ExerciseSafety {
  risk: Risk;
  /** nima uchun shu daraja */
  why: string;
  joints: JointRisk[];
  /** setdan oldin tekshiriladi */
  check: string[];
  /** takrorni ko‘tara olmasangiz — xavfsiz chiqish yo‘li */
  bail?: string;
  /** chegaragacha (RIR 0): 'spot' — faqat sug‘urtachi yoki to‘sinlar bilan, 'form' — tavsiya etilmaydi, texnika buziladi */
  failure?: 'spot' | 'form';
  /** shu mashqqa xos darhol to‘xtash belgilari */
  stop: string[];
}

export const RISK_INFO: Record<Risk, { name: string; color: string; soft: string; text: string }> = {
  1: {
    name: 'Past',
    color: 'var(--green)',
    soft: 'var(--green-soft)',
    text: 'Yo‘nalish qotirilgan yoki yuklama kichik — xato qilinsa ham oqibati odatda yengil.',
  },
  2: {
    name: 'O‘rta',
    color: 'var(--yellow)',
    soft: 'var(--yellow-soft)',
    text: 'Holat yoki texnika xatosi bo‘g‘imni sezilarli zo‘riqtiradi, muvozanat yoki ushlash yo‘qolishi mumkin.',
  },
  3: {
    name: 'Yuqori',
    color: 'var(--red)',
    soft: 'var(--red-soft)',
    text: 'Og‘ir shtanga tana ustida yoki umurtqaga katta yuklama: xato oqibati jiddiy bo‘lishi mumkin.',
  },
};

/* ---------- Takrorlanadigan qoidalar ---------- */

const C = {
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

const S = {
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

const BENCH_BAIL =
  'To‘sinlar bilan: shtangani ko‘krakka tushiring, belni skameykaga tekislang — shtanga to‘sinlarga tushadi, ostidan sirg‘alib chiqing. Yolg‘iz va to‘sinsiz: shtangani bir tomonga qiyshaytirib, disklarni to‘kib yuboring (shuning uchun qisqich taqilmaydi). Shtangani hech qachon bo‘yin ustida ushlab qolmang.';
const DB_PRESS_BAIL =
  'Gantellarni ko‘krak yoniga tushirib, tanadan tashqariga — yon tomonga qo‘yib yuboring; hech qachon yuz ustida ushlab turmang. Tugatganda gantellarni ko‘krakka olib, tizzalarni ko‘tarib, ularning og‘irligi bilan o‘tirgan holatga qayting.';
const FALL_BAIL = 'Muvozanat yo‘qolsa gantellarni yon tomonga qo‘yib yuboring va oyoqlarni yaqinlashtiring — gantelni ushlab qolishga urinmang.';
const BAR_DOWN = 'Sekin pastga tushing va oyoqlarni platformaga qo‘ying — balanddan sakrab tushmang.';

const SAFETY: Record<string, ExerciseSafety> = {
  /* ===================== O‘TIRISH ===================== */
  'back-squat': {
    risk: 3,
    why: 'Og‘ir shtanga umurtqa ustida: xato belga katta bosim beradi, ko‘tara olmasangiz shtanga ostida qolish xavfi bor.',
    joints: [
      {
        at: 'lowerBack',
        how: 'Pastki nuqtada bel dumaloqlanishi («butt wink») yoki tik turishda belni ortiqcha egish disk va bo‘g‘imchalarga yuklamani oshiradi.',
        mod: 'Tavsiya etilmaydi: kubok o‘tirish, gakk-mashina yoki oyoq press — umurtqaga o‘q yuklamasi kam. Shifokor ruxsati bilan: yengil vazn, qutiga o‘tirish (box squat), bel tekis qoladigan chuqurlik.',
      },
      {
        at: 'knee',
        how: 'Tizzalarning ichkariga qulashi (valgus) va pastda «sakrash» menisk va paylarni zo‘riqtiradi.',
        mod: 'Og‘riqsiz chuqurlikkacha tushing (quti yordam beradi), sekin sur’at (3 s pastga), tovon ostiga 1–2 sm taglik. Og‘riq 3/10 dan oshsa — oyoq press.',
      },
      {
        at: 'hip',
        how: 'Juda chuqur va tor turishda son bo‘g‘imining old qismi «qisiladi» (impingement).',
        mod: 'Oyoqlarni kengroq va uchlarini ko‘proq tashqariga qo‘ying, chuqurlikni og‘riqsiz nuqtagacha cheklang.',
      },
    ],
    check: [C.warm, C.pinsSquat, C.collars, 'Shtanga trapetsiya ustida, bo‘yin suyagida emas; ilgaklar yelka sathidan biroz pastda.'],
    bail: 'Ramada: shunchaki pastga o‘tirib, shtangani to‘sinlarga qo‘ying va ostidan chiqing. Ramasiz: qo‘llarni qo‘yib yuborib, tosni oldinga itaring va o‘zingiz oldinga chiqing — shtanga orqaga tushadi (orqangiz bo‘sh bo‘lsin). Shtangani oldinga engashib ushlab qolishga urinmang.',
    failure: 'spot',
    stop: [S.radiating, S.back, S.knee],
  },
  'front-squat': {
    risk: 3,
    why: 'Og‘ir shtanga old yelkada: umurtqaga bosim orqa o‘tirishdan kam va shtangani oldinga tashlash oson, lekin tirsaklar tushsa shtanga bilan oldinga qulash mumkin.',
    joints: [
      {
        at: 'wrist',
        how: 'Klassik ushlashda bilak keskin orqaga bukiladi — harakatchanlik yetmasa bilak va tirsak zo‘riqadi.',
        mod: 'Qo‘llarni chalishtirib ushlang yoki lyamka ishlating: shtanga kaftda emas, yelka mushaklaridagi «tokchada» tursin.',
      },
      {
        at: 'knee',
        how: 'Tizzalar oldinga ko‘p chiqadi — tizza qopqog‘i ostiga yuklama yuqori.',
        mod: 'Og‘riqsiz chuqurlik, sekin pastga tushish; og‘riq bo‘lsa — qutiga o‘tirish yoki kubok o‘tirish.',
      },
    ],
    check: [C.warm, C.pinsSquat, C.collars, 'Tirsaklar oldinga-yuqoriga ko‘tarilgan — shtanga bo‘yinga emas, yelka mushaklariga tayanadi.'],
    bail: 'Shtangani oldinga, tanadan uzoqqa tashlab yuboring va o‘zingiz orqaga chekining. Ramada — pastga o‘tirib, shtangani to‘sinlarga qo‘ying.',
    failure: 'spot',
    stop: [S.wrist, S.knee, S.back],
  },
  'goblet-squat': {
    risk: 1,
    why: 'Yuklama old tomonda va nisbatan yengil: gavda tik qoladi, ko‘tara olmasangiz gantelni shunchaki polga qo‘yasiz.',
    joints: [
      {
        at: 'knee',
        how: 'Tizzalar ichkariga qulasa yoki pastda «sakrasangiz» tizzaga yonlama bosim tushadi.',
        mod: 'Og‘riqsiz chuqurlik, qutiga o‘tirish; tovon ostiga yupqa taglik tizza burchagini qulaylashtiradi.',
      },
    ],
    check: ['Gantelni bir uchidan ko‘krakka yopishtirib, ikki kaft bilan mahkam ushlang (girya bo‘lsa — dastasining ikki yonidan).'],
    bail: 'Gantelni oldingizdagi polga qo‘ying — oyoq ustiga emas.',
    stop: [S.knee],
  },
  'smith-squat': {
    risk: 2,
    why: 'Yo‘nalish qotirilgan — muvozanat oson, lekin tana shtanga yo‘liga moslashadi: noto‘g‘ri oyoq holati tizza va belni zo‘riqtiradi.',
    joints: [
      {
        at: 'knee',
        how: 'Oyoqlar to‘g‘ri shtanga ostida bo‘lsa, tizzalar haddan oldinga chiqib, tizza qopqog‘i ostiga bosim oshadi.',
        mod: 'Oyoqlarni biroz oldinga qo‘ying, chuqurlikni og‘riqsiz nuqtagacha cheklang.',
      },
      {
        at: 'lowerBack',
        how: 'Oyoqlar juda oldinda bo‘lsa, pastda tos «qayrilib» bel dumaloqlanadi.',
        mod: 'Chuqurlikni bel tekis qoladigan nuqtagacha cheklang, bel spinkasiz — tana tik.',
      },
    ],
    check: ['Pastki to‘xtatgichlarni eng past nuqtangizdan biroz pastga qo‘ying.', 'Shtangani ilgakdan chiqarish va qayta ilishni avval bo‘sh shtangada mashq qiling.', C.warm],
    bail: 'Bilakni burab, shtangani yaqin ilgakka iling yoki to‘xtatgichlarga tushiring — trenajyor uni ushlab qoladi.',
    failure: 'spot',
    stop: [S.knee, S.back],
  },
  'leg-press': {
    risk: 2,
    why: 'Juda og‘ir vazn ko‘tariladi: pastda tos o‘rindiqdan uzilsa bel bukiladi, tepada tizzani «qulflash» tizzaning teskari bukilishiga olib kelishi mumkin.',
    joints: [
      {
        at: 'knee',
        how: 'Tepada tizzani to‘liq qulflash og‘ir vaznda tizzani orqaga bukib yuborishi mumkin; chuqur pastda tizzaga bosim ortadi.',
        mod: 'Oyoqlarni platformada balandroq qo‘ying (tizza kamroq bukiladi), amplituda og‘riqsiz, tepada tizza yengil bukilgan qolsin.',
      },
      {
        at: 'lowerBack',
        how: 'Juda pastga tushganda tos va bel o‘rindiqdan ko‘tarilib dumaloqlanadi — og‘ir vaznda diskka xavfli.',
        mod: 'Amplitudani tos o‘rindiqdan uzilmaydigan nuqtagacha cheklang; bel va dumba tayanchga yopishgan bo‘lsin.',
      },
    ],
    check: [
      'Yon xavfsizlik to‘xtatgichlarini pastki nuqtangizdan biroz pastroqqa o‘rnating.',
      'Bel va dumba o‘rindiqqa to‘liq tegib tursin.',
      'Set tugagach, qulf tutqichlarini yopmaguncha oyoqlarni platformadan olmang.',
    ],
    bail: 'Platformani to‘xtatgichlarga tushiring va ostidan chiqing. To‘xtatgichi yo‘q trenajyorda og‘ir setlarni faqat sug‘urtachi bilan bajaring.',
    stop: [S.knee, S.back, S.radiating],
  },
  'hack-squat': {
    risk: 2,
    why: 'Og‘ir vazn yelkada, yo‘nalish qotirilgan: chuqur pastda tizzaga yuklama katta, xavfsizlik ilgaklari yoqilmasa ostida qolish mumkin.',
    joints: [
      {
        at: 'knee',
        how: 'Chuqur pastda va tovonlar ko‘tarilganda tizza qopqog‘i ostiga yuklama keskin oshadi.',
        mod: 'Oyoqlarni platformada yuqoriroq va kengroq qo‘ying, chuqurlikni cheklang, pastda sakramang.',
      },
    ],
    check: ['Xavfsizlik ilgaklarini yoqing va pastki nuqtaga sozlang.', 'Yelka yostiqlari yelkada, bo‘yinda emas.', C.warm],
    bail: 'Platformani xavfsizlik ilgaklariga tushiring; ilgaklar yoqilmagan bo‘lsa, og‘ir vazn qo‘ymang.',
    stop: [S.knee, S.back],
  },
  'bw-squat': {
    risk: 1,
    why: 'O‘z vazni — o‘tirishning eng xavfsiz varianti; asosiy vazifa — to‘g‘ri harakat naqshini o‘rganish.',
    joints: [
      {
        at: 'knee',
        how: 'Tizzalar ichkariga qulashi odatga aylansa, keyinchalik og‘ir variantlarda muammo beradi.',
        mod: 'Stulga o‘tirib-turish bilan boshlang, chuqurlikni asta oshiring.',
      },
    ],
    check: ['Sirpanmaydigan pol va poyabzal.'],
    stop: [S.knee],
  },

  /* ===================== BUKILISH (TOS) ===================== */
  deadlift: {
    risk: 3,
    why: 'Eng og‘ir vazn ko‘tariladigan mashq: bel dumaloqlansa disklarga bosim keskin oshadi. Jarohatlarning ko‘pi charchoq tufayli texnika buzilganda bo‘ladi.',
    joints: [
      {
        at: 'lowerBack',
        how: 'Shtanga tanadan uzoqlashsa yoki bel dumaloqlansa, bel disklari va paylari ortiqcha yuklanadi; tepada orqaga «yotish» ham zararli.',
        mod: 'Tavsiya etilmaydi: tos ko‘tarish, giperekstenziya, yengil gantel bilan rumincha tortish yoki olti burchakli (trap) shtanga. Shifokor ruxsati bilan — balandlikdan (blok ustidan) tortish, yengil vazn.',
      },
      {
        at: 'hip',
        how: 'Juda keng turish (sumo) va tosni haddan past tushirish son bo‘g‘imini «qisadi».',
        mod: 'Oyoq kengligini og‘riqsiz holatga moslang; harakat — o‘tirish emas, sondan bukilish.',
      },
      {
        at: 'elbow',
        how: 'Aralash ushlashda (bir kaft oldinga qaragan) shu qo‘ldagi bitseps payi zo‘riqadi — uzilish holatlari qayd etilgan.',
        mod: 'Ikki kaft ham o‘zingizga qaragan holda ushlang, ushlash yetmasa — lyamka. Aralash ushlashda tirsakni to‘liq to‘g‘ri tuting, qo‘l bilan «tortmang».',
      },
    ],
    check: [
      C.warm,
      C.collars,
      'Shtanga oyoq kafti o‘rtasi ustida, boldirga yaqin; ko‘tarishdan oldin shtangani tortib, bo‘shliqni yo‘qoting.',
      'Belbog‘ qorin taranglashuvining o‘rnini bosmaydi: avval chuqur nafas va 360° korset.',
    ],
    bail: 'Shtangani shunchaki qo‘yib yuboring va oyoqlarni olib qoching. Dumaloq bel bilan «yulib» ko‘tarishga urinmang.',
    failure: 'form',
    stop: [S.radiating, S.back, S.biceps],
  },
  rdl: {
    risk: 2,
    why: 'Son orqasi cho‘zilgan holda ishlaydi: bel tekis qolsa xavfsiz, dumaloqlansa yoki shtanga tanadan uzoqlashsa — bel zo‘riqadi.',
    joints: [
      {
        at: 'lowerBack',
        how: 'Pastga tushish son orqasining cho‘zilish chegarasidan oshsa, harakat sondan emas, beldan bukilishga aylanadi.',
        mod: 'Amplitudani bel tekis qoladigan nuqtagacha (ko‘pincha tizza ostigacha) cheklang, vaznni kamaytiring yoki gantel bilan bajaring.',
      },
    ],
    check: [C.warm, C.collars, 'Shtanga sonlar va boldirga tegib harakatlanadi — tanadan uzoqlashmasin.'],
    bail: 'Shtangani nazorat bilan polga yoki ramaga qo‘ying; ushlash yetmasa — lyamka.',
    failure: 'form',
    stop: [S.ham, S.back, S.radiating],
  },
  'db-rdl': {
    risk: 2,
    why: 'Shtangali variantdan yengilroq, lekin xato bir xil: bel dumaloqlansa yoki gantellar tanadan uzoqlashsa — bel zo‘riqadi.',
    joints: [
      {
        at: 'lowerBack',
        how: 'Pastga tushish son orqasining cho‘zilish chegarasidan oshsa, bel bukiladi.',
        mod: 'Amplitudani bel tekis qoladigan nuqtagacha cheklang, yengilroq gantel; bir oyoqda emas, ikki oyoqda bajaring.',
      },
    ],
    check: ['Gantellar sonlar oldida, tanaga yaqin harakatlansin.', C.warm],
    bail: 'Gantellarni sonlar yoniga, nazorat bilan polga qo‘ying.',
    failure: 'form',
    stop: [S.ham, S.back],
  },
  'kb-swing': {
    risk: 2,
    why: 'Ballistik harakat: kuch tosdan keladi. Beldan «ko‘tarish» yoki tepada orqaga egilish belni zo‘riqtiradi; qo‘ldan chiqqan girya atrofdagilar uchun xavfli.',
    joints: [
      {
        at: 'lowerBack',
        how: 'Harakat beldan bukilib bajarilsa yoki tepada bel orqaga egilsa, bel disklari va bo‘g‘imchalari zo‘riqadi.',
        mod: 'Yengil girya, past amplituda; avval tos ko‘tarish va rumincha tortishni o‘zlashtiring. Og‘riq bo‘lsa — ko‘prikcha.',
      },
    ],
    check: ['Oldingizda va orqangizda kamida 2–3 m bo‘sh joy — hech kim o‘tmasin.', 'Kaftlar quruq, girya dastasi sirpanchiq emas.', 'Girya ko‘krak sathidan oshmaydi — bu yelka mashqi emas.'],
    bail: 'To‘xtatish: giryani oyoqlar orasidan orqaga silkitib, keyingi tebranishda oldingizdagi polga qo‘ying. Qo‘ldan chiqib ketayotgan bo‘lsa — qo‘yib yuboring va chetga o‘ting, ushlashga urinmang.',
    failure: 'form',
    stop: [S.back, S.radiating],
  },
  'back-extension': {
    risk: 1,
    why: 'Tana vazni bilan, xavf past. Asosiy xato — tepada belni haddan ortiq orqaga egish.',
    joints: [
      {
        at: 'lowerBack',
        how: 'Tepada tana oyoqlar chizig‘idan o‘tib orqaga egilsa, bel bo‘g‘imchalari siqiladi.',
        mod: 'Harakatni tos atrofida bajaring, tepada tana oyoqlar bilan bir chiziqda to‘xtasin; og‘riq bo‘lsa — amplitudani kamaytiring.',
      },
    ],
    check: ['Yostiq son yuqorisida — tos erkin bukila oladigan holatda.', 'Oyoq tayanchi mahkam qotirilgan.'],
    stop: [S.back, S.radiating],
  },

  /* ===================== HAMLA ===================== */
  'split-squat': {
    risk: 1,
    why: 'Yuklama kichik va har oyoqqa alohida; asosiy xavf — muvozanat yo‘qolishi.',
    joints: [
      {
        at: 'knee',
        how: 'Old tizza ichkariga qulasa yoki tovon ko‘tarilsa — tizzaga yonlama bosim.',
        mod: 'Qadamni uzunroq qiling (tizza kamroq bukiladi), amplituda og‘riqsiz, bir qo‘l bilan devor yoki ramaga tayaning.',
      },
      {
        at: 'hip',
        how: 'Orqa oyoq son bo‘g‘imining oldi cho‘ziladi; tos burilib ketsa chov sohasi zo‘riqadi.',
        mod: 'Qadamni torroq, tosni to‘g‘ri oldinga qaratib tuting; og‘riq chegarasigacha tushing.',
      },
    ],
    check: ['Oyoqlar «relsda»: tos kengligida, bir chiziqda emas — muvozanat oson.', 'Muvozanat yetmasa — bir qo‘l bilan ramaga tayaning, gantel bitta qo‘lda.'],
    bail: FALL_BAIL,
    stop: [S.knee, S.hip],
  },
  bulgarian: {
    risk: 2,
    why: 'Orqa oyoq ko‘tarilgan — muvozanat qiyin va old oyoqqa yuklama katta: yiqilish va tizza zo‘riqishi asosiy xavf.',
    joints: [
      {
        at: 'knee',
        how: 'Qadam qisqa bo‘lsa old tizza haddan oldinga chiqadi, ichkariga qulasa — yonlama bosim.',
        mod: 'Skameyka pastroq, qadam uzunroq; avval o‘z vazni bilan, keyin yengil gantel; og‘riqsiz amplituda.',
      },
      {
        at: 'hip',
        how: 'Orqa oyoq son bo‘g‘imining oldi kuchli cho‘ziladi.',
        mod: 'Orqa oyoq uchini skameykaga qo‘ying, tosni to‘g‘ri tuting, chuqurlikni cheklang.',
      },
    ],
    check: ['Skameyka tizza balandligida yoki pastroq, sirpanmaydi.', 'Holatni avval gantelsiz toping: old oyoq skameykadan taxminan bir qadam oldinda.'],
    bail: FALL_BAIL,
    stop: [S.knee, S.hip],
  },
  'step-up': {
    risk: 2,
    why: 'Balandlikka ko‘tarilish: platforma qimirlasa yoki oyoq sirpansa — yiqilish; tushishda tizza zarba oladi.',
    joints: [
      {
        at: 'knee',
        how: 'Platforma juda baland bo‘lsa, tizza chuqur bukilgan holda yuklanadi; tushishda «sakrash» tizzaga zarba.',
        mod: 'Pastroq platforma (tizza 90° dan kam bukiladigan), sekin va nazorat bilan tushing.',
      },
    ],
    check: ['Platforma qimirlamaydi, sirpanmaydi; balandligi tizza sathidan past.', 'Oyoq kafti platformaga to‘liq qo‘yiladi, tovon chetdan chiqmasin.'],
    bail: 'Muvozanat yo‘qolsa gantellarni yonga qo‘yib yuboring va orqaga, polga tushing.',
    stop: [S.knee],
  },
  'bw-split-squat': {
    risk: 1,
    why: 'O‘z vazni bilan — xavf past; muvozanat va tizza holatini o‘rganish uchun yaxshi.',
    joints: [
      {
        at: 'knee',
        how: 'Old tizza ichkariga qulasa — tizzaga yonlama bosim.',
        mod: 'Qadam uzunroq, amplituda og‘riqsiz, tayanchga ushlang.',
      },
    ],
    check: ['Sirpanmaydigan pol; kerak bo‘lsa devorga tayaning.'],
    stop: [S.knee],
  },

  /* ===================== IZOLYATSIYA: OYOQ ===================== */
  'leg-extension': {
    risk: 1,
    why: 'Trenajyor, yo‘nalish qotirilgan. Tizza qopqog‘iga yuklama to‘liq yozilishga yaqin eng katta.',
    joints: [
      {
        at: 'knee',
        how: 'Oxirgi 30° da tizza qopqog‘i ostiga bosim oshadi; vaznni «otish» bo‘g‘imga zarba beradi.',
        mod: 'Amplitudani og‘riqsiz oraliqqa cheklang (masalan 90° dan 30° gacha), sekin sur’at. Tizza payi jarrohligidan keyin — faqat reabilitolog rejasi bo‘yicha.',
      },
    ],
    check: [C.seat('tizza bo‘g‘imi trenajyor o‘qi bilan bir chiziqda, yostiq boldirning pastki qismida'), C.stack],
    stop: [S.knee],
  },
  'leg-curl': {
    risk: 1,
    why: 'Trenajyor, xavf past. Son orqasi mushagi vazn keskin «otilganda» tortilishi mumkin.',
    joints: [],
    check: [C.seat('tizza o‘qi trenajyor o‘qi bilan bir chiziqda, yostiq tovon ustida — Axill payida emas'), C.stack],
    stop: [S.ham, 'Son orqasida tirishish (kramp) — to‘xtang va mushakni yengil cho‘zing'],
  },
  'hip-thrust': {
    risk: 2,
    why: 'Shtanga tos suyagi ustida: og‘ir vaznda ezilish va og‘riq, skameyka siljishi; tepada belni egish — asosiy xato.',
    joints: [
      {
        at: 'lowerBack',
        how: 'Tepada harakat tosdan emas, beldan davom etsa (bel ortiqcha egiladi) — bel bo‘g‘imchalari siqiladi.',
        mod: 'Tepada iyak ko‘krakka yaqin, qovurg‘alar pastda; tos tana chizig‘iga yetganda to‘xtang. Og‘riq bo‘lsa — o‘z vazni bilan ko‘prikcha.',
      },
    ],
    check: ['Shtanga ostida qalin yostiq — tos suyagi ezilmaydi.', 'Skameykani devorga yoki og‘ir jihozga tirang — orqaga siljimasin.', C.collars],
    bail: 'Tosni polga tushiring va shtangani oyoq tomonga dumalatib chiqing.',
    stop: [S.back, S.ham],
  },
  'glute-bridge': {
    risk: 1,
    why: 'O‘z vazni bilan, yerda — xavf past.',
    joints: [
      {
        at: 'lowerBack',
        how: 'Tepada tos haddan ortiq ko‘tarilsa, bel egiladi.',
        mod: 'Tos tizza va yelka bilan bir chiziqqa yetganda to‘xtang, dumbani qisib turing.',
      },
    ],
    check: ['Yumshoq gilam; tovonlar tosdan taxminan 30 sm uzoqlikda.'],
    stop: [S.back],
  },
  'calf-raise': {
    risk: 1,
    why: 'Xavf past. Pastda «sakrash» va keskin cho‘zilish Axill payini zo‘riqtiradi.',
    joints: [],
    check: ['Platforma chetida tursangiz, bir qo‘l bilan tirgakka ushlang.', 'Pastda 1 soniya to‘xtang — sakramang.'],
    stop: [S.achilles],
  },

  /* ===================== KO‘KRAK ===================== */
  'bench-press': {
    risk: 3,
    why: 'Shtanga yuz, bo‘yin va ko‘krak ustida: ko‘tara olmasangiz ostida qolish xavfi bor. Ko‘krak mushagi uzilishlarining ko‘pi og‘ir yotib jimda, pastga tushirishda yuz beradi.',
    joints: [
      {
        at: 'shoulder',
        how: 'Tirsaklar 90° ga yoyilsa va kuraklar bo‘shasa, yelka old qismi va rotator manjeti qisiladi; yillar davomida og‘ir yuklama — o‘mrov uchi bo‘g‘imi zo‘riqishi.',
        mod: 'Tirsaklar 30–45°, ushlash biroz torroq; amplituda ko‘krakdan 3–5 sm yuqorida to‘xtasin (yostiq yoki taxtacha). Yoki neytral ushlashli gantel jimi.',
      },
      {
        at: 'wrist',
        how: 'Shtanga barmoqlarda tursa, bilak orqaga bukilib zo‘riqadi.',
        mod: 'Shtangani kaftning asosiga, bilak suyaklari ustiga qo‘ying; bilak bog‘ichi yordam beradi; yoki gantel neytral ushlash bilan.',
      },
    ],
    check: [C.warm, C.thumb, C.pinsBench, C.benchCollars],
    bail: BENCH_BAIL,
    failure: 'spot',
    stop: [S.pec, S.shoulder, S.wrist],
  },
  'db-bench': {
    risk: 2,
    why: 'Har qo‘l alohida, erkin harakat: ko‘tara olmasangiz gantelni yonga tashlash mumkin. Xavf — gantellarni olish va qaytarishda yelka va bel zo‘riqishi.',
    joints: [
      {
        at: 'shoulder',
        how: 'Pastda gantellar ko‘krak sathidan ancha pastga tushsa, yelka oldi va ko‘krak payi haddan ortiq cho‘ziladi.',
        mod: 'Neytral ushlash (kaftlar bir-biriga qaragan), tirsaklar 30–45°, pastda ko‘krak sathida to‘xtang.',
      },
    ],
    check: [C.dbStart, 'Og‘ir gantellarni uzatish uchun sherik so‘rang.'],
    bail: DB_PRESS_BAIL,
    stop: [S.pec, S.shoulder],
  },
  'machine-chest-press': {
    risk: 1,
    why: 'Trenajyor, yo‘nalish qotirilgan — ko‘krak mashqlarining eng xavfsizi. Asosiy xato — o‘rindiq balandligi.',
    joints: [
      {
        at: 'shoulder',
        how: 'O‘rindiq past bo‘lsa, tutqichlar yelkadan yuqorida qolib, yelka oldi qisiladi.',
        mod: 'O‘rindiqni tutqichlar ko‘krak o‘rtasi sathida bo‘ladigan qilib sozlang, amplituda og‘riqsiz.',
      },
    ],
    check: [C.seat('tutqichlar ko‘krak o‘rtasi sathida'), C.stack],
    stop: [S.shoulder],
  },
  'push-up': {
    risk: 1,
    why: 'O‘z vazni bilan, xavf past. Bilak va yelka holatiga e’tibor bering.',
    joints: [
      {
        at: 'wrist',
        how: 'Kaftlar polda tekis — bilak 90° ga yaqin orqaga bukiladi; harakatchanlik cheklangan bo‘lsa zo‘riqadi.',
        mod: 'Gantel dastalarini yoki otjimaniya tutqichlarini ushlang (bilak to‘g‘ri qoladi) yoki mushtda bajaring; skameykaga tayanib — yengilroq.',
      },
      {
        at: 'shoulder',
        how: 'Tirsaklar yonga 90° yoyilsa, yelka oldi qisiladi.',
        mod: 'Tirsaklar tanaga 30–45°, pastda ko‘krak poldan bir musht yuqorida to‘xtasin.',
      },
    ],
    check: ['Kaftlar yelka ostida, pol sirpanmaydi.'],
    stop: [S.wrist, S.shoulder],
  },
  dips: {
    risk: 2,
    why: 'Butun tana vazni yelkaga eng noqulay holatda tushadi: pastda yelka chuqur orqaga cho‘ziladi — yelka oldi, o‘mrov uchi va to‘sh-o‘mrov bo‘g‘imi zo‘riqadi.',
    joints: [
      {
        at: 'shoulder',
        how: 'Pastki nuqtada yelka chuqur orqaga cho‘zilgan — yelka oldi kapsulasi, bitseps uzun boshi payi va o‘mrov uchi bo‘g‘imi yuklanadi.',
        mod: 'Tavsiya etilmaydi: tor ushlab yotib jim, blokda triseps yoki ko‘krak press trenajyori. Shifokor ruxsati bilan — yelka tirsak sathigacha tushadigan qisqa amplituda, yengillashtiruvchi trenajyor.',
      },
      {
        at: 'elbow',
        how: 'Pastda tirsak chuqur bukilgan holda butun vazn — triseps payi va tirsak orqasi zo‘riqadi.',
        mod: 'Qisqaroq amplituda (tirsak 90°), rezina yoki trenajyor bilan yengillashtirish, sekin sur’at.',
      },
    ],
    check: ['Avval 1–2 ta yengil set: rezina yordamida yoki oyoq bilan tayanib.', 'Brusya mahkam, kaftlar quruq.'],
    bail: 'Oyoqlarni platformaga yoki polga qo‘ying — pastki nuqtada osilib qolmang.',
    stop: [S.shoulder, S.pec, S.elbow],
  },
  'incline-db-press': {
    risk: 2,
    why: 'Erkin gantellar, qiya holat: ko‘tara olmasangiz yonga tashlash mumkin. Qiyalik oshgani sari yelka oldiga yuklama ortadi.',
    joints: [
      {
        at: 'shoulder',
        how: 'Skameyka juda tik bo‘lsa va gantellar chuqur tushsa, yelka oldi qisiladi va cho‘ziladi.',
        mod: 'Skameyka burchagi 30° atrofida (45° dan oshmasin), neytral ushlash, pastda ko‘krak sathida to‘xtang.',
      },
    ],
    check: [C.dbStart],
    bail: DB_PRESS_BAIL,
    stop: [S.shoulder, S.pec],
  },
  'incline-bench': {
    risk: 3,
    why: 'Og‘ir shtanga yuz va ko‘krak ustida, qiyalikda yelka oldiga yuklama yuqori: ko‘tara olmasangiz ostida qolish xavfi.',
    joints: [
      {
        at: 'shoulder',
        how: 'Qiyalik oshgani sari yelka oldiga yuklama oshadi; tirsaklar yoyilsa yelka qisiladi.',
        mod: 'Burchak 30° atrofida, tirsaklar 45°, ko‘krakdan 3–5 sm yuqorida to‘xtatish; yoki gantel bilan neytral ushlash.',
      },
    ],
    check: [C.warm, C.thumb, C.pinsBench, C.benchCollars],
    bail: BENCH_BAIL,
    failure: 'spot',
    stop: [S.pec, S.shoulder],
  },
  'cable-fly': {
    risk: 1,
    why: 'Blokda yuklama bir tekis va yengil — xavf past. Asosiy xato — qo‘llarni haddan orqaga cho‘zish.',
    joints: [
      {
        at: 'shoulder',
        how: 'Qo‘llar tana chizig‘idan orqaga o‘tib ketsa, yelka oldi kapsulasi va ko‘krak payi haddan ortiq cho‘ziladi.',
        mod: 'Qo‘llar tana chizig‘idan orqaga o‘tmasin, tirsaklar yengil bukilgan, yengil vazn — ko‘proq takror.',
      },
    ],
    check: [C.stack, 'Bir oyoq oldinda — tana barqaror, tros sizni orqaga tortmaydi.'],
    stop: [S.shoulder, S.pec],
  },
  'pec-deck': {
    risk: 1,
    why: 'Trenajyor, yo‘nalish qotirilgan — xavf past. Boshlang‘ich holat juda keng bo‘lsa yelka zo‘riqadi.',
    joints: [
      {
        at: 'shoulder',
        how: 'Tutqichlar tana chizig‘idan orqada boshlansa, yelka oldi haddan ortiq cho‘ziladi.',
        mod: 'Boshlang‘ich holatni trenajyorda cheklang (tutqichlar tana chizig‘idan orqaga o‘tmasin), o‘rindiq — tutqichlar ko‘krak sathida.',
      },
    ],
    check: [C.seat('tutqichlar ko‘krak o‘rtasi sathida'), C.stack],
    stop: [S.shoulder, S.pec],
  },
  'db-fly': {
    risk: 2,
    why: 'Uzun richag: tirsaklar to‘g‘rilansa, kichik vazn ham ko‘krak va yelka paylarini kuchli cho‘zadi; og‘ir gantel bilan ko‘krak mushagi tortilishi uchraydi.',
    joints: [
      {
        at: 'shoulder',
        how: 'Gantellar ko‘krak sathidan pastga tushsa, yelka oldi va ko‘krak payi kuchli cho‘ziladi.',
        mod: 'Gantellarni ko‘krak sathidan pastga tushirmang, tirsaklar doim 20–30° bukilgan; og‘riq bo‘lsa — krossover yoki batterflay trenajyori.',
      },
    ],
    check: [C.dbStart, 'Yengil vazn: bu mashq og‘irlik uchun emas, cho‘zilish va qisqarish uchun.'],
    bail: 'Gantellarni ko‘krak ustiga olib keling yoki yon tomonga, polga qo‘ying.',
    stop: [S.pec, S.shoulder],
  },

  /* ===================== YELKA ===================== */
  ohp: {
    risk: 3,
    why: 'Shtanga yuz va bosh ustidan o‘tadi: bel orqaga egilsa umurtqa siqiladi, shtanga iyak yoki burunga urilishi mumkin.',
    joints: [
      {
        at: 'shoulder',
        how: 'Yelka harakatchanligi yetmasa, shtanga tepaga emas, oldinga ketadi va bu bel egilishi bilan «to‘ldiriladi»; yelka tepasida qisilish.',
        mod: 'Yengilroq vazn yoki o‘tirib gantel jimi neytral ushlash bilan; landmin jimi (shtanganing bir uchi polda) — yelka uchun qulayroq.',
      },
      {
        at: 'lowerBack',
        how: 'Dumba qisilmay, qorin bo‘sh bo‘lsa, tana orqaga «yotadi» — bel bo‘g‘imchalari siqiladi.',
        mod: 'Dumba va qorinni qattiq siqing, qovurg‘alarni pastga tuting; og‘riq bo‘lsa — spinkali o‘rindiqda gantel jimi.',
      },
    ],
    check: [
      C.warm,
      C.collars,
      'Ramada boshlang: to‘sinlar yuqori ko‘krak sathida — ko‘tara olmasangiz shtangani ularga tushirasiz.',
      'Iyakni biroz orqaga oling — shtanga yuz bo‘ylab tik chiziqda o‘tadi.',
    ],
    bail: 'Shtangani nazorat bilan yuqori ko‘krakka yoki to‘sinlarga tushiring. Boshdan yuqorida muvozanat yo‘qolsa — shtangani oldinga itarib yuboring va orqaga chekining; hech qachon orqaga tashlamang.',
    failure: 'spot',
    stop: [S.shoulder, S.back, S.head],
  },
  'db-shoulder-press': {
    risk: 2,
    why: 'Gantellar bosh ustida: ushlash yoki muvozanat yo‘qolsa, gantel boshga tushishi mumkin; yelka qisilishiga moyil.',
    joints: [
      {
        at: 'shoulder',
        how: 'Tirsaklar to‘liq yonga yoyilib, gantellar chuqur tushsa yelka tepasi qisiladi.',
        mod: 'Neytral ushlash, tirsaklar biroz oldinda (kurak tekisligida), pastda gantel quloq sathida to‘xtasin.',
      },
    ],
    check: ['Spinkali o‘rindiq (80–90°) — belga tayanch.', 'Gantellarni sonlarga qo‘yib, tizza bilan yelka sathiga uzating.'],
    bail: 'Gantellarni yelkaga tushiring va yonga, sonlarga qo‘ying — boshdan yuqorida tashlab yubormang.',
    stop: [S.shoulder],
  },
  'machine-shoulder-press': {
    risk: 1,
    why: 'Trenajyor, yo‘nalish qotirilgan — yelka jimining eng xavfsiz varianti.',
    joints: [
      {
        at: 'shoulder',
        how: 'O‘rindiq past bo‘lsa, boshlang‘ich holatda yelka chuqur bukilgan va qisilgan.',
        mod: 'O‘rindiqni tutqichlar yelka sathida bo‘ladigan qilib sozlang; neytral tutqich bo‘lsa — shu; amplituda og‘riqsiz.',
      },
    ],
    check: [C.seat('tutqichlar yelka sathida yoki biroz pastda'), C.stack],
    stop: [S.shoulder],
  },
  'pike-push-up': {
    risk: 2,
    why: 'Bosh pastga qarab tushadi: yelka va bilakka katta yuklama, boshni polga urib olish xavfi.',
    joints: [
      {
        at: 'wrist',
        how: 'Kaftlar polda — bilak keskin bukiladi va tana vaznining katta qismini ko‘taradi.',
        mod: 'Tutqich yoki gantel dastalarini ushlang; oyoqlarni pastroq qo‘yib yuklamani kamaytiring.',
      },
      {
        at: 'shoulder',
        how: 'Tirsaklar yonga yoyilsa va bosh qo‘llar oldiga tushmasa, yelka tepasi qisiladi.',
        mod: 'Tirsaklar 45°, qisqaroq amplituda; yoki trenajyorda yelka jimi.',
      },
    ],
    check: ['Bosh tushadigan joyga yumshoq yostiq yoki buklangan gilam.', 'Kaftlar yelka kengligidan biroz kengroq, barmoqlar keng yoyilgan.'],
    stop: [S.wrist, S.shoulder, S.neck],
  },
  'lateral-raise': {
    risk: 1,
    why: 'Yengil vazn, xavf past. Asosiy xato — silkitish va qo‘lni ichkariga burab ko‘tarish.',
    joints: [
      {
        at: 'shoulder',
        how: 'Gantel yelka sathidan baland ko‘tarilsa va bosh barmoq pastga «ag‘darilsa», yelka tepasidagi pay qisiladi.',
        mod: 'Yelka sathigacha, biroz oldinda (30°) ko‘taring, bosh barmoq biroz yuqoriga qaragan; og‘riqli oraliq bo‘lsa — blokda yoki amplitudani qisqartiring.',
      },
    ],
    check: ['Yengil vazn — silkitmasdan 12–20 takror bajara oladigan.'],
    stop: [S.shoulder],
  },
  'cable-lateral-raise': {
    risk: 1,
    why: 'Blokda yuklama bir tekis va yengil — xavf past.',
    joints: [
      {
        at: 'shoulder',
        how: 'Qo‘l yelka sathidan baland ko‘tarilsa va ichkariga buralsa, yelka tepasidagi pay qisiladi.',
        mod: 'Yelka sathigacha ko‘taring, tirsak yengil bukilgan; og‘riqli oraliqni qisqartiring.',
      },
    ],
    check: [C.stack, 'Blok bilak sathida yoki pastroq.'],
    stop: [S.shoulder],
  },
  'face-pull': {
    risk: 1,
    why: 'Yelka sog‘lig‘i uchun foydali mashq — xavf past.',
    joints: [],
    check: [C.stack, 'Blok ko‘z sathida, arqon uchlari mahkam.'],
    stop: [S.shoulder],
  },
  'reverse-fly': {
    risk: 1,
    why: 'Rezina yoki blok bilan yengil yuklama — xavf past.',
    joints: [],
    check: [C.band],
    stop: [S.shoulder],
  },

  /* ===================== ORQA ===================== */
  'barbell-row': {
    risk: 2,
    why: 'Engashgan holatda bel butun set davomida statik yuklama ostida: tana silkitilsa yoki bel dumaloqlansa — bel jarohati xavfi.',
    joints: [
      {
        at: 'lowerBack',
        how: 'Engashgan holatda bel paylariga statik yuklama tushadi; silkitish va dumaloqlanish disklarga xavfli.',
        mod: 'Tavsiya etilmaydi: ko‘krak tayanchli gantel tortish, o‘tirib blok tortish yoki skameykaga tayanib bir qo‘llab gantel tortish — bel yuklanmaydi.',
      },
    ],
    check: [C.warm, C.collars, 'Shtangani poldan rumincha tortish texnikasida ko‘taring — bukilgan bel bilan emas.'],
    bail: 'Shtangani nazorat bilan polga qo‘ying. Charchoqdan tana silkitila boshlasa — set tugadi.',
    failure: 'form',
    stop: [S.back, S.radiating, S.biceps],
  },
  'db-row': {
    risk: 1,
    why: 'Bir qo‘l va tizza skameykada — bel tayanchli, xavf past.',
    joints: [
      {
        at: 'lowerBack',
        how: 'Tayanchsiz engashsangiz yoki gavda buralsa, bel yuklanadi.',
        mod: 'Bir qo‘l va bir tizza bilan skameykaga tayaning, bel tekis, gavda burilmasin.',
      },
    ],
    check: ['Bir qo‘l va bir tizza skameykada — bel tekis, gavda polga deyarli parallel.'],
    stop: [S.back],
  },
  'cable-row': {
    risk: 1,
    why: 'O‘tirib, oyoq tayanchli — xavf past. Asosiy xato — har takrorda tanani silkitish.',
    joints: [
      {
        at: 'lowerBack',
        how: 'Tana oldinga-orqaga silkitilsa, bel takror-takror bukilib-yoziladi.',
        mod: 'Gavda deyarli qimirlamasin, tizzalar yengil bukilgan, bel tekis.',
      },
    ],
    check: [C.stack],
    stop: [S.back],
  },
  'chest-supported-row': {
    risk: 1,
    why: 'Ko‘krak skameykaga tayangan — bel umuman yuklanmaydi, xavf past.',
    joints: [],
    check: ['Ko‘krak skameykaga to‘liq tayangan, iyak skameyka chetidan yuqorida.'],
    stop: [S.shoulder],
  },
  'inverted-row': {
    risk: 1,
    why: 'O‘z vazni bilan — xavf past. Asosiy xavf — shtanganing ramadan chiqib ketishi.',
    joints: [],
    check: ['Shtanga ramaning ilgaklarida yoki smit mashinasida qotirilgan — yuklanganda sirg‘alib chiqmaydi.', 'Tovonlar polda sirpanmaydi.'],
    stop: [S.shoulder, S.elbow],
  },
  'pull-up': {
    risk: 2,
    why: 'Butun tana vazni yelka va tirsakda: silkitib bajarish va turnikdan sakrab tushish — asosiy xavf.',
    joints: [
      {
        at: 'shoulder',
        how: 'Pastda yelka to‘liq bo‘shatilgan holda silkitish yelka kapsulasini zo‘riqtiradi; juda keng ushlash va bosh ortiga tortish — qisilish.',
        mod: 'Yelka kengligida yoki neytral (parallel) ushlash, pastda yelkalarni biroz «faol» tuting; og‘riq bo‘lsa — yuqori blokni tortish.',
      },
      {
        at: 'elbow',
        how: 'Takror soni keskin oshsa, tirsak ichki qismidagi pay yallig‘lanadi («golfchi tirsagi»).',
        mod: 'Neytral ushlash, haftalik takror sonini asta oshiring, rezina bilan yengillashtiring.',
      },
    ],
    check: ['Turnik mahkam, kaftlar quruq.', 'Balandga sakrab yetmaslik uchun ostiga platforma qo‘ying.'],
    bail: BAR_DOWN,
    stop: [S.shoulder, S.elbow, S.biceps],
  },
  'chin-up': {
    risk: 2,
    why: 'Butun tana vazni, kaft o‘zingizga qaragan — bitseps va tirsakka yuklama yuqori.',
    joints: [
      {
        at: 'elbow',
        how: 'Kaft o‘zingizga qaragan — bitseps va tirsak bukuvchilari ko‘proq yuklanadi, tirsak og‘rig‘i ko‘proq uchraydi.',
        mod: 'Neytral ushlash, pastda tirsakni keskin «tashlab» yubormang, rezina yordami.',
      },
      {
        at: 'shoulder',
        how: 'Pastda bo‘shashib silkitish yelka kapsulasini zo‘riqtiradi.',
        mod: 'Pastda yelkalarni biroz faol tuting, silkitmang; og‘riq bo‘lsa — yuqori blokni teskari ushlab tortish.',
      },
    ],
    check: ['Turnik mahkam, kaftlar quruq.', 'Balandga sakrab yetmaslik uchun ostiga platforma qo‘ying.'],
    bail: BAR_DOWN,
    stop: [S.elbow, S.biceps, S.shoulder],
  },
  'lat-pulldown': {
    risk: 1,
    why: 'Trenajyor, yuklama sozlanadi — xavf past.',
    joints: [
      {
        at: 'shoulder',
        how: 'Bosh ortiga tortish yelkani noqulay holatga keltiradi va bo‘yinni oldinga egadi.',
        mod: 'Faqat ko‘krakka torting, yelka kengligida yoki neytral tutqich.',
      },
    ],
    check: [C.seat('son yostig‘i sonlarni mahkam bosib turadi'), C.stack],
    stop: [S.shoulder, S.elbow],
  },
  'db-shrug': {
    risk: 1,
    why: 'Qisqa amplituda, xavf past. Asosiy xato — yelkalarni aylantirish va boshni oldinga cho‘zish.',
    joints: [
      {
        at: 'neck',
        how: 'Yelkalarni aylantirish va boshni oldinga cho‘zish bo‘yin mushaklari va bo‘g‘imlarini zo‘riqtiradi.',
        mod: 'Tavsiya etilmaydi: bo‘yin og‘rig‘ida yelkani ko‘tarish bo‘yinni zo‘riqtiradi — o‘rniga yuzga tortish (face pull) yoki ko‘krak tayangan tortish. Og‘riq o‘tgach — faqat tik yuqoriga-pastga, bosh neytral.',
      },
    ],
    check: ['Ushlash yetmasa — lyamka.'],
    stop: [S.neck],
  },

  /* ===================== QO‘LLAR ===================== */
  'barbell-curl': {
    risk: 1,
    why: 'Xavf past. Asosiy xato — og‘ir vaznni tana bilan silkitib «otish».',
    joints: [
      {
        at: 'wrist',
        how: 'To‘g‘ri shtanga bilaklarni tashqariga buraydi — bilak va tirsak tashqi qismi zo‘riqadi.',
        mod: 'EZ-shtanga yoki gantel bilan bajaring — bilak tabiiy burchakda qoladi.',
      },
      {
        at: 'elbow',
        how: 'Og‘ir vazn silkitib ko‘tarilsa va pastda tirsak keskin to‘g‘rilansa, bitseps payi zo‘riqadi.',
        mod: 'Vaznni kamaytiring, pastda nazorat bilan to‘xtang yoki «bolg‘a» ushlashga o‘ting.',
      },
    ],
    check: ['Tirsaklar tana yonida, belni orqaga egmasdan.'],
    stop: [S.biceps, S.elbow, S.wrist],
  },
  'db-curl': {
    risk: 1,
    why: 'Yengil vazn, xavf past.',
    joints: [
      {
        at: 'elbow',
        how: 'Pastda tirsak keskin «tashlansa», bitseps payi cho‘zilib zo‘riqadi.',
        mod: 'Pastda nazorat bilan to‘xtang; og‘riq bo‘lsa — «bolg‘a» ushlash.',
      },
    ],
    check: ['Tirsaklar tana yonida qotirilgan.'],
    stop: [S.biceps],
  },
  'hammer-curl': {
    risk: 1,
    why: 'Neytral ushlash — tirsak va bilak uchun eng qulay bitseps varianti.',
    joints: [],
    check: ['Tirsaklar tana yonida qotirilgan.'],
    stop: [S.elbow],
  },
  'incline-curl': {
    risk: 1,
    why: 'Yengil vazn, lekin bitseps kuchli cho‘zilgan holatda ishlaydi.',
    joints: [
      {
        at: 'shoulder',
        how: 'Qo‘llar tanadan orqada osilib turadi — yelka oldi va bitseps uzun boshi payi cho‘ziladi.',
        mod: 'Skameyka burchagini tikroq qiling (60°), yengil vazn; og‘riq bo‘lsa — oddiy gantel bitseps.',
      },
    ],
    check: ['Yengil vazn bilan boshlang — cho‘zilish kuchli.'],
    stop: [S.shoulder, S.biceps],
  },
  'cable-curl': {
    risk: 1,
    why: 'Blokda yuklama bir tekis — xavf past.',
    joints: [],
    check: [C.stack],
    stop: [S.biceps],
  },
  pushdown: {
    risk: 1,
    why: 'Blokda yuklama bir tekis — triseps uchun eng xavfsiz mashq.',
    joints: [],
    check: [C.stack, 'Tros uzilsa yuzga urilmasligi uchun boshni tros yo‘lidan biroz chetroq tuting.'],
    stop: [S.elbow],
  },
  'overhead-extension': {
    risk: 2,
    why: 'Gantel bosh ustida va ortida: ushlash bo‘shasa boshga yoki bo‘yinga tushadi; yelka va tirsak chuqur bukilgan holda yuklanadi.',
    joints: [
      {
        at: 'shoulder',
        how: 'Qo‘l bosh ustida — yelka harakatchanligi yetmasa, bel egiladi va yelka qisiladi.',
        mod: 'Tavsiya etilmaydi: qo‘l bosh ustida yelka qisiladi — o‘rniga blokda triseps (pushdown) — qo‘l bosh ustiga ko‘tarilmaydi.',
      },
      {
        at: 'elbow',
        how: 'Pastki nuqtada tirsak to‘liq bukilgan — triseps payi va tirsak orqasi kuchli cho‘ziladi.',
        mod: 'Amplitudani qisqartiring, yengil vazn, sekin sur’at; og‘riq bo‘lsa — blokda triseps.',
      },
    ],
    check: ['Gantelni yuqori diski ostidan ikki kaft bilan mahkam «kosacha» qilib ushlang; gantel disklari qotirilgan bo‘lsin.', 'O‘tirib, spinkali o‘rindiqda — bel egilmaydi.'],
    bail: 'Gantelni bosh ortidan yelka ustiga olib, oldingizga tushiring; ushlash bo‘shay boshlasa — set tugadi.',
    stop: [S.elbow, S.shoulder],
  },
  'skull-crusher': {
    risk: 2,
    why: 'Shtanga yuz va peshona ustida harakatlanadi; tirsak payiga yuklama katta.',
    joints: [
      {
        at: 'elbow',
        how: 'Pastda tirsak chuqur bukilgan holda og‘ir vazn — triseps payi va tirsak bo‘g‘imiga katta yuklama; tirsak og‘rig‘ining keng tarqalgan sababi.',
        mod: 'Tavsiya etilmaydi: arqon bilan blokda triseps — tirsakka yuklama yumshoqroq. Shifokor ruxsati bilan — yengil gantel, qisqaroq amplituda.',
      },
    ],
    check: ['EZ-shtanga — bilaklar uchun qulay; disklar qisqich bilan.', 'Shtangani peshonaga emas, bosh tepasidan biroz orqaga tushiring.', 'Og‘ir vaznda — sug‘urtachi.'],
    bail: 'Shtangani ko‘krak tomonga olib kelib, ko‘krak ustiga qo‘ying — yuz ustida ushlab turmang.',
    failure: 'spot',
    stop: [S.elbow],
  },
  'close-grip-bench': {
    risk: 3,
    why: 'Og‘ir shtanga yuz va ko‘krak ustida: ko‘tara olmasangiz ostida qolish xavfi; tor ushlash bilakni zo‘riqtiradi.',
    joints: [
      {
        at: 'wrist',
        how: 'Juda tor ushlashda bilak ichkariga va orqaga bukilib zo‘riqadi.',
        mod: 'Ushlash yelka kengligida (juda tor emas), shtanga kaft asosida; bilak bog‘ichi.',
      },
      {
        at: 'elbow',
        how: 'Tirsaklar tanaga yopishgan holda og‘ir vazn — triseps payi va tirsak bo‘g‘imi yuklanadi.',
        mod: 'Vaznni kamaytiring, tirsaklarni tanaga 20–30° burchakda tuting; og‘riq bo‘lsa — blokda triseps.',
      },
    ],
    check: [C.warm, C.thumb, C.pinsBench, C.benchCollars],
    bail: BENCH_BAIL,
    failure: 'spot',
    stop: [S.wrist, S.elbow, S.pec],
  },
  'bench-dip': {
    risk: 2,
    why: 'Qo‘llar tanadan orqada: yelka chuqur orqaga cho‘zilgan va ichkariga buralgan holatda yuklanadi — yelka oldi qisilishiga moyil.',
    joints: [
      {
        at: 'shoulder',
        how: 'Pastki nuqtada yelka haddan orqaga cho‘zilgan va ichkariga buralgan — yelka oldi va o‘mrov uchi bo‘g‘imi zo‘riqadi.',
        mod: 'Tavsiya etilmaydi: blokda triseps yoki tor ushlab otjimaniya. Shifokor ruxsati bilan — qisqa amplituda (tirsak 60–70°), oyoqlar bukilgan.',
      },
    ],
    check: ['Skameyka mahkam, sirpanmaydi.', 'Dumba skameyka chetiga yaqin harakatlansin — tanadan uzoqlashmasin.'],
    stop: [S.shoulder],
  },

  /* ===================== PRESS (KOR) ===================== */
  plank: {
    risk: 1,
    why: 'Statik mashq — xavf past. Nafasni ushlab turish qon bosimini oshiradi.',
    joints: [
      {
        at: 'lowerBack',
        how: 'Tos pastga tushib bel egilsa, bel bo‘g‘imchalari siqiladi.',
        mod: 'Tizzalarda planka yoki qisqaroq vaqt (20–30 s) ko‘proq takror bilan.',
      },
    ],
    check: ['Nafasni ushlamang — bir maromda nafas oling.'],
    stop: [S.back],
  },
  'hanging-leg-raise': {
    risk: 2,
    why: 'Turnikda osilib: ushlash, yelka va bel yuklanadi; tana silkitilsa bel egiladi.',
    joints: [
      {
        at: 'lowerBack',
        how: 'Oyoqlar tos bukilmasdan, faqat sondan ko‘tarilsa yoki tana tebransa, bel orqaga egiladi.',
        mod: 'Tizzalarni bukib ko‘taring, tosni orqaga «o‘rang»; og‘riq bo‘lsa — «o‘lik qo‘ng‘iz» yoki yerda yotib oyoq ko‘tarish.',
      },
      {
        at: 'shoulder',
        how: 'Uzoq osilish yelka kapsulasini cho‘zadi — og‘riqli yelkada noqulay.',
        mod: 'Tirsak tayanchli stansiyada bajaring yoki yerda yotib.',
      },
    ],
    check: ['Turnik mahkam, kaftlar quruq; ostida platforma.'],
    bail: 'Oyoqlarni sekin tushirib, platformaga qo‘ying — balanddan sakramang.',
    stop: [S.back, S.shoulder],
  },
  'cable-crunch': {
    risk: 1,
    why: 'Blokda, tiz cho‘kib — xavf past.',
    joints: [],
    check: [C.stack, 'Tizza ostida yumshoq yostiq.'],
    stop: [S.back],
  },
  crunch: {
    risk: 1,
    why: 'O‘z vazni bilan, qisqa amplituda — xavf past. Asosiy xato — boshni qo‘llar bilan tortish.',
    joints: [
      {
        at: 'neck',
        how: 'Qo‘llar bilan boshni oldinga tortish bo‘yin umurtqalarini bukadi.',
        mod: 'Kaftlarni ko‘krakda chalishtiring yoki barmoq uchlarini chakkaga qo‘ying, nigoh shiftda; bo‘yin og‘risa — planka yoki «o‘lik qo‘ng‘iz».',
      },
    ],
    check: ['Yumshoq gilam.'],
    stop: [S.neck],
  },
  'dead-bug': {
    risk: 1,
    why: 'Yerda, yengil — bel uchun eng xavfsiz press mashqlaridan biri.',
    joints: [],
    check: ['Bel polga bosilgan holda qoladi — ko‘tarilsa amplitudani kamaytiring.'],
    stop: [S.back],
  },
};

export const safetyFor = (id: string): ExerciseSafety | undefined => SAFETY[id];
export const SAFETY_IDS = Object.keys(SAFETY);

/* ---------- Umumiy qoidalar ---------- */

export const GOLDEN_RULES: { title: string; text: string }[] = [
  {
    title: 'Isining',
    text: '5 daqiqa yengil kardio va birinchi mashqda 2–3 ta isinish seti. Sovuq mushak va pay jarohatga moyil.',
  },
  {
    title: 'Qisqich (zamok) — har doim',
    text: 'Shtangadagi disklar qisqich bilan mahkamlanadi. Istisno — yolg‘iz va to‘sinsiz yotib jim: disklarni to‘kib yuborish uchun.',
  },
  {
    title: 'To‘sinlar yoki sug‘urtachi',
    text: 'O‘tirish, yotib jim va boshdan yuqori jimda og‘ir shtanga bilan — rama to‘sinlari yoki tajribali sug‘urtachi.',
  },
  {
    title: 'Bosh barmoq bilan ushlang',
    text: 'Yotib jim va boshdan yuqori jimda «ochiq» ushlash (bosh barmoqsiz) — shtanga kaftdan sirg‘alishining asosiy sababi.',
  },
  {
    title: 'Vaznni asta oshiring',
    text: '«2 uchun 2» qoidasi: oxirgi setda ketma-ket ikki mashg‘ulotda rejadan 2 takror ortiq bajarsangiz — vazn qo‘shing. Katta sakrash — jarohatning keng tarqalgan sababi.',
  },
  {
    title: 'Yolg‘iz bo‘lsangiz — zaxira qoldiring',
    text: 'Og‘ir shtanga mashqlarida 1–2 takror zaxira (RIR 1–2). Chegaragacha faqat to‘sinlar yoki sug‘urtachi bilan.',
  },
  {
    title: 'Texnika buzildi — set tugadi',
    text: 'Bel dumaloqlansa, tizzalar qulasa yoki tana silkitila boshlasa — keyingi takror kerak emas.',
  },
  {
    title: 'Atrofni tozalang',
    text: 'Polda disk va gantel yotmasin, atrofda 1 m bo‘sh joy. Ishni tugatgach disklarni joyiga qo‘ying.',
  },
  {
    title: 'Belbog‘ — korset o‘rnida emas',
    text: 'Avval chuqur nafas va qorinni 360° taranglash. Belbog‘ faqat og‘ir setlarda yordamchi.',
  },
  {
    title: 'Og‘riq — signal',
    text: 'Mushakdagi yonish normal. Bo‘g‘imdagi o‘tkir, sanchiqli yoki tarqaluvchi og‘riq — to‘xtash belgisi.',
  },
];

/** Og‘riq nazorati modeli (Silbernagel va boshq., 2007): mashq paytida va ertasi kuni */
export const PAIN_ZONES: {
  from: number;
  to: number;
  name: string;
  color: string;
  text: string;
}[] = [
  {
    from: 0,
    to: 2,
    name: 'Xavfsiz',
    color: 'var(--green)',
    text: 'Davom eting. Sezgi ertasi kuni kuchaymasa — hammasi joyida.',
  },
  {
    from: 3,
    to: 5,
    name: 'Qabul qilinadi',
    color: 'var(--yellow)',
    text: 'Vaznni 20–30% kamaytiring yoki amplitudani og‘riqsiz qiling. Og‘riq ertasi tongga o‘tib ketishi va haftadan-haftaga kuchaymasligi kerak.',
  },
  {
    from: 6,
    to: 10,
    name: 'To‘xtang',
    color: 'var(--red)',
    text: 'Bu mashqni bugun to‘xtating va muqobiliga almashtiring. Bir necha kunda o‘tmasa — shifokorga.',
  },
];

export type FlagLevel = 'emergency' | 'doctor';

/** Darhol to‘xtash va tibbiy yordam talab qiladigan belgilar */
export const RED_FLAGS: { level: FlagLevel; text: string }[] = [
  {
    level: 'emergency',
    text: 'Ko‘krakda og‘riq yoki siqilish, ayniqsa chap qo‘l, jag‘ yoki kurakka tarqalsa',
  },
  {
    level: 'emergency',
    text: 'Kuchanish paytida to‘satdan «hayotimdagi eng kuchli» bosh og‘rig‘i',
  },
  {
    level: 'emergency',
    text: 'Hushdan ketish, kuchli bosh aylanishi, nafas yetishmasligi dam olganda ham o‘tmasa',
  },
  {
    level: 'emergency',
    text: 'Bel og‘rig‘i bilan birga oraliq (chot) sohasida uvishish yoki siydik/najasni tuta olmaslik',
  },
  {
    level: 'emergency',
    text: 'Juda og‘ir mashg‘ulotdan 1–3 kun keyin qoramtir (choy rangidagi) siydik va mushaklarning kuchli shishib og‘rishi — rabdomioliz',
  },
  {
    level: 'doctor',
    text: '«Qars» etgan ovoz, keyin darhol kuchsizlik, shish yoki ko‘karish — pay yoki mushak uzilishi. Jarrohlik kerak bo‘lsa, kechikish natijani yomonlashtiradi',
  },
  {
    level: 'doctor',
    text: 'Qo‘l yoki oyoqqa tarqaluvchi og‘riq, uvishish, karaxtlik yoki kuchsizlik',
  },
  {
    level: 'doctor',
    text: 'Bo‘g‘im shishi, shakli o‘zgarishi yoki uni to‘liq harakatlantira olmaslik',
  },
  {
    level: 'doctor',
    text: 'Tunda va dam olganda ham o‘tmaydigan og‘riq yoki 2 haftadan ortiq davom etayotgan og‘riq',
  },
];

export const SAFETY_SOURCES = ['keogh2017', 'lauersen2014', 'kerr2010', 'haff2016', 'silbernagel2007', 'elmaraghy2012'];
