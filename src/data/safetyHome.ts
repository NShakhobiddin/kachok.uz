// Xavfsizlik profillari: uydagi mashqlar (exercisesHome.ts).
import type { ExerciseSafety } from './safety';
import { S } from './safetyText';

const WRIST_FLOOR = {
  at: 'wrist' as const,
  how: 'Kaftlarga tayanganda bilak 90° ga yaqin orqaga bukiladi; harakatchanlik cheklangan bo‘lsa zo‘riqadi.',
  mod: 'Mushtda yoki kaft ostiga buklangan sochiq qo‘yib bajaring; bilak og‘risa — tirsaklarga tayaning.',
};

const MAT = 'Yumshoq gilam, atrofda bo‘sh joy.';

export const SAFETY_HOME: Record<string, ExerciseSafety> = {
  /* ===================== O‘TIRISH VA HAMLA ===================== */
  'sumo-squat': {
    risk: 1,
    why: 'Yuk oyoqlar orasida va nisbatan yengil: ko‘tara olmasangiz gantelni shunchaki polga qo‘yasiz. Asosiy xato — keng turishda tizzalarning ichkariga qulashi.',
    joints: [
      {
        at: 'knee',
        how: 'Keng turishda tizzalar oyoq uchlaridan ichkariga qulasa, tizzaning ichki tomoniga yonlama bosim tushadi.',
        mod: 'Oyoq uchlari va tizzalar bir yo‘nalishda; turishni biroz toraytiring, chuqurlikni og‘riqsiz nuqtagacha cheklang.',
      },
      {
        at: 'hip',
        how: 'Juda keng turish va chuqur o‘tirishda chov sohasi va son bo‘g‘imining old qismi zo‘riqadi.',
        mod: 'Turishni toraytiring, oyoq uchlarini kamroq tashqariga buring, og‘riqsiz chuqurlikkacha tushing.',
      },
    ],
    check: ['Gantelni bir uchidan yoki girya dastasidan ikki qo‘llab mahkam ushlang.', 'Sirpanmaydigan pol va poyabzal.'],
    bail: 'Gantelni oyoqlaringiz orasidagi polga qo‘ying — oyoq ustiga emas.',
    stop: [S.knee, S.hip],
  },
  'reverse-lunge': {
    risk: 1,
    why: 'O‘z vazni bilan — xavf past; asosiy xavf — orqaga qadam tashlaganda muvozanat yo‘qolishi.',
    joints: [
      {
        at: 'knee',
        how: 'Old tizza ichkariga qulasa yoki pastda «sakrasangiz» tizzaga yonlama bosim tushadi.',
        mod: 'Qadamni uzunroq qiling, amplitudani og‘riqsiz oraliqqa cheklang, bir qo‘l bilan devor yoki stulga tayaning.',
      },
    ],
    check: ['Orqangizda 1 m bo‘sh joy, pol sirpanmaydi.', 'Muvozanat yetmasa — devor yoki stul suyanchig‘iga ushlang.'],
    stop: [S.knee],
  },
  'curtsy-lunge': {
    risk: 2,
    why: 'O‘z vazni bilan, lekin oyoqlar kesishgani uchun muvozanat va tizza holati oddiy hamladan qiyinroq: tizzaga burama yuklama tushishi mumkin.',
    joints: [
      {
        at: 'knee',
        how: 'Orqa oyoq kesishganda old tizza ichkariga buralib qolishi mumkin — tizzaga burama yuklama tushadi.',
        mod: 'Kesishuvni kamaytiring yoki oddiy orqaga hamla bajaring; old tizza oyoq uchi ustida qolsin.',
      },
      {
        at: 'hip',
        how: 'Chuqur kesishuvda son bo‘g‘imi va tosning yon tomoni cho‘zilib, chov sohasi zo‘riqadi.',
        mod: 'Qadam va amplitudani kichraytiring; og‘riq bo‘lsa — orqaga hamla.',
      },
    ],
    check: ['Devor yoki stul yonida bajaring — muvozanat uchun.', 'Atrofda bo‘sh joy, pol sirpanmaydi.'],
    stop: [S.knee, S.hip],
  },
  'wall-sit': {
    risk: 1,
    why: 'Harakatsiz ushlab turish — xavf past. Tizza qopqog‘i ostidagi bosim tizza qanchalik ko‘p bukilsa, shunchalik katta.',
    joints: [
      {
        at: 'knee',
        how: 'Tizza 90° bukik holda uzoq ushlash tizza qopqog‘i ostiga bosim beradi; tizzalar oyoq uchidan oldinga chiqsa, bosim yanada oshadi.',
        mod: 'Balandroq ushlang (tizza 45–60°), boldir tik bo‘lsin; vaqtni qisqartiring.',
      },
    ],
    check: ['Sirpanmaydigan pol va poyabzal — oyoqlar sirg‘alib ketmasin.'],
    stop: [S.knee],
  },

  /* ===================== DUMBA ===================== */
  'single-leg-bridge': {
    risk: 1,
    why: 'O‘z vazni bilan, yerda — xavf past; ikki oyoqli ko‘prikchadan ko‘ra tos barqarorligini ko‘proq talab qiladi.',
    joints: [
      {
        at: 'lowerBack',
        how: 'Tepada belni egib ko‘tarish yoki tosning bir tomonga buralishi bel bo‘g‘imchalarini zo‘riqtiradi.',
        mod: 'Tos tizza-yelka chizig‘iga yetganda to‘xtang; tos tushib ketsa — ikki oyoqli ko‘prikchaga qayting.',
      },
    ],
    check: ['Yumshoq gilam; tayanch tovon tosdan 25–30 sm uzoqlikda.'],
    stop: [S.back, S.ham],
  },
  'glute-kickback': {
    risk: 1,
    why: 'To‘rt oyoqlab, o‘z vazni bilan — xavf past. Asosiy xato — oyoqni baland ko‘tarib belni egish.',
    joints: [
      {
        at: 'lowerBack',
        how: 'Son gavda chizig‘idan yuqoriga ko‘tarilsa, harakat beldan davom etib, bel bo‘g‘imchalari siqiladi.',
        mod: 'Oyoqni faqat gavda chizig‘igacha ko‘taring, qorinni taranglang; og‘riq bo‘lsa — amplitudani kamaytiring yoki ko‘prikcha bajaring.',
      },
      WRIST_FLOOR,
    ],
    check: ['Tizza ostida yumshoq gilam.'],
    stop: [S.back, S.wrist],
  },
  'fire-hydrant': {
    risk: 1,
    why: 'To‘rt oyoqlab, o‘z vazni bilan, kichik amplituda — xavf past.',
    joints: [WRIST_FLOOR],
    check: ['Tizza ostida yumshoq gilam.', 'Tos va gavda pol bilan parallel qolguncha ko‘taring.'],
    stop: [S.hip, S.wrist],
  },
  clamshell: {
    risk: 1,
    why: 'Yonboshlab yotib, kichik amplituda — eng xavfsiz dumba mashqlaridan.',
    joints: [],
    check: ['Yumshoq gilam; boshni qo‘l yoki yostiqqa qo‘ying.'],
    stop: [S.hip],
  },
  'side-leg-raise': {
    risk: 1,
    why: 'Yonboshlab, o‘z vazni bilan — xavf past. Asosiy xato — oyoqni juda baland ko‘tarib tosni qiyshaytirish.',
    joints: [],
    check: ['Yumshoq gilam; tos va yelkalar bir tekislikda.'],
    stop: [S.hip, S.back],
  },
  'banded-lateral-walk': {
    risk: 1,
    why: 'Yengil lenta, kichik qadamlar — xavf past.',
    joints: [
      {
        at: 'knee',
        how: 'Lenta tizzalarni ichkariga tortadi; qarshilik qilmasangiz tizzalar qulab, ichki tomoniga yonlama bosim tushadi.',
        mod: 'Yengilroq lenta oling yoki uni tizzadan biroz yuqoriga kiying; qadamni kichraytiring, tizzalarni tashqariga ochib turing.',
      },
    ],
    check: ['Lentani yoriq va yemirilish uchun tekshiring — uzilgan lenta oyoqqa qattiq uriladi.', 'Atrofda to‘siqsiz yo‘lak.'],
    stop: [S.knee, S.hip],
  },

  /* ===================== SON ORQASI ===================== */
  'ball-leg-curl': {
    risk: 1,
    why: 'Yerda, past balandlik — xavf past. To‘p beqaror: muvozanat va son orqasining keskin tortilishiga e’tibor bering.',
    joints: [
      {
        at: 'lowerBack',
        how: 'Tosni yuqorida ushlashda belni egish bel bo‘g‘imchalarini siqadi.',
        mod: 'Tosni biroz pastroq ushlang, qovurg‘alarni pastga tushiring; og‘riq bo‘lsa — ikki oyoqli ko‘prikcha.',
      },
    ],
    check: ['To‘p yetarlicha damlangan va butun; atrofda o‘tkir buyumlar yo‘q.', 'Avval tovonlar to‘pda tosni ko‘tarib ushlashni o‘rganing, keyin bukishni qo‘shing.'],
    stop: [S.ham, S.back, 'Son orqasida tirishish (kramp) — to‘xtang va mushakni yengil cho‘zing'],
  },

  /* ===================== BEL ===================== */
  superman: {
    risk: 1,
    why: 'O‘z vazni bilan, kichik amplituda. Qo‘l va oyoqlar birga ko‘tarilganda bel egilgan holatda yuklanadi — bel muammosida yengilroq variantlar afzal.',
    joints: [
      {
        at: 'lowerBack',
        how: 'Qo‘l va oyoqlar birga ko‘tarilganda bel egilgan holatda umurtqaga siqilish yuklamasi ancha oshadi.',
        mod: 'Avval faqat qo‘llarni yoki faqat oyoqlarni ko‘taring yoki «qush-it» mashqini bajaring; balandlik bir necha santimetrdan oshmasin.',
      },
      {
        at: 'neck',
        how: 'Boshni orqaga tashlab yuqoriga qarash bo‘yin umurtqalarini siqadi.',
        mod: 'Nigoh polda, peshona ostiga buklangan sochiq qo‘ying; boshni ko‘tarmasdan bajaring.',
      },
    ],
    check: [MAT],
    stop: [S.back, S.radiating, S.neck],
  },

  /* ===================== KO‘KRAK VA ORQA ===================== */
  'knee-push-up': {
    risk: 1,
    why: 'O‘z vazni bilan, oddiy otjimaniyadan yengilroq — xavf past. Bilak va yelka holatiga e’tibor bering.',
    joints: [
      {
        at: 'wrist',
        how: 'Kaftlar polda tekis — bilak 90° ga yaqin orqaga bukiladi; harakatchanlik cheklangan bo‘lsa zo‘riqadi.',
        mod: 'Gantel dastalarini yoki otjimaniya tutqichlarini ushlang yoki mushtda bajaring; devorga tayanib — yanada yengilroq.',
      },
      {
        at: 'shoulder',
        how: 'Tirsaklar yonga 90° yoyilsa, yelka oldi qisiladi.',
        mod: 'Tirsaklar tanaga 30–45°, pastda ko‘krak poldan bir musht yuqorida to‘xtasin.',
      },
    ],
    check: ['Tizza ostida yumshoq gilam yoki buklangan sochiq.', 'Kaftlar yelka ostida, pol sirpanmaydi.'],
    stop: [S.wrist, S.shoulder],
  },
  'band-row': {
    risk: 1,
    why: 'Rezina lenta bilan, o‘tirib — xavf past. Asosiy xavf — lentaning oyoq ostidan sirg‘alib chiqishi.',
    joints: [],
    check: [
      'Rezinani yoriq va yemirilish uchun tekshiring — uzilgan lenta yuz va ko‘zga uriladi.',
      'Lentani oyoq kaftlarining o‘rtasidan o‘tkazing va oyoq bilan mahkam bosing — sirg‘alib chiqmasin.',
    ],
    stop: [S.back, S.shoulder],
  },

  /* ===================== TANA MARKAZI ===================== */
  'bird-dog': {
    risk: 1,
    why: 'Yerda, umurtqa tabiiy holatda — bel uchun eng xavfsiz stabilizatsiya mashqlaridan.',
    joints: [WRIST_FLOOR],
    check: ['Tizza ostida yumshoq gilam.'],
    stop: [S.back, S.wrist],
  },
  'side-plank': {
    risk: 1,
    why: 'O‘z vazni bilan, harakatsiz — xavf past. Butun yuk bitta tirsak va yelkaga tushadi.',
    joints: [
      {
        at: 'shoulder',
        how: 'Tayanch tirsak yelka ostida bo‘lmasa yoki yelka quloqqa yopishsa, yelka bo‘g‘imi zo‘riqadi.',
        mod: 'Tirsak to‘g‘ri yelka ostida; tizzalarni bukib, tizzaga tayanib bajaring; og‘riq bo‘lsa — oddiy planka yoki «o‘lik qo‘ng‘iz».',
      },
    ],
    check: ['Yumshoq gilam; tirsak ostiga buklangan sochiq.'],
    stop: [S.shoulder, S.back],
  },
  'reverse-crunch': {
    risk: 1,
    why: 'O‘z vazni bilan, yerda — xavf past. Asosiy xato — oyoqlarni silkitib, tosni keskin tashlash.',
    joints: [
      {
        at: 'lowerBack',
        how: 'Oyoqlarni silkitib ko‘tarish va tosni keskin tashlash bel umurtqalarini takroriy bukadi.',
        mod: 'Sekin, kichik amplitudada bajaring; og‘riq bo‘lsa — «o‘lik qo‘ng‘iz» yoki planka.',
      },
    ],
    check: [MAT],
    stop: [S.back],
  },
  'bicycle-crunch': {
    risk: 1,
    why: 'O‘z vazni bilan — xavf past. Asosiy xatolar: boshni qo‘llar bilan tortish va tez, nazoratsiz burilish.',
    joints: [
      {
        at: 'neck',
        how: 'Qo‘llar bilan boshni oldinga tortish bo‘yin umurtqalarini bukadi.',
        mod: 'Barmoq uchlari faqat chakkada; bo‘yin og‘risa — «o‘lik qo‘ng‘iz» yoki teskari qisqarish.',
      },
      {
        at: 'lowerBack',
        how: 'Cho‘zilgan oyoq juda past tushsa, bel poldan uzilib egiladi; bukilish va burilish birga bel disklarini yuklaydi.',
        mod: 'Oyoqni balandroq ushlang, burilishni sekin va kichik qiling; og‘riq bo‘lsa — planka yoki «o‘lik qo‘ng‘iz».',
      },
    ],
    check: [MAT],
    stop: [S.neck, S.back],
  },
  'mountain-climber': {
    risk: 1,
    why: 'O‘z vazni bilan, lekin tez: charchaganda bel osilib, yelka va bilaklarga yuk oshadi.',
    joints: [
      {
        at: 'wrist',
        how: 'Tez harakat paytida bilak uzoq vaqt orqaga bukilgan holatda yuklanadi.',
        mod: 'Mushtda yoki otjimaniya tutqichlarida bajaring; skameyka yoki divanga tayanib — yengilroq.',
      },
      {
        at: 'shoulder',
        how: 'Yelkalar kaftlardan oldinga chiqib ketsa yoki planka holati buzilsa, yelka bo‘g‘imiga ortiqcha yuk tushadi.',
        mod: 'Yelkalarni kaftlar ustida ushlang, sekinroq bajaring yoki balandroq tayanchga tayaning.',
      },
    ],
    check: ['Sirpanmaydigan pol yoki gilam — oyoq sirg‘alib ketmasin.'],
    stop: [S.wrist, S.shoulder, 'Kuchli hansirash, bosh aylanishi yoki ko‘krakda noqulaylik — to‘xtang va dam oling'],
  },
};
