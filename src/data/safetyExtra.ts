// Yangi mashqlar (exercisesExtra.ts) xavfsizligi: xavf darajasi, bo‘g‘imlar, setdan oldingi tekshiruv va to‘xtash belgilari.
import type { ExerciseSafety } from './safety';
import { C, FALL_BAIL, S } from './safetyText';

export const SAFETY_EXTRA: Record<string, ExerciseSafety> = {
  'straight-arm-pulldown': {
    risk: 1,
    why: 'Blokda, yengil vazn, harakat yo‘li qotirilgan — xavf past.',
    joints: [
      {
        at: 'shoulder',
        how: 'Qo‘llar ko‘z sathidan baland ko‘tarilsa yoki og‘ir vazn yelkani oldinga tortsa, yelka oldi cho‘zilib qisiladi.',
        mod: 'Harakatni ko‘krak sathidan boshlang, vaznni kamaytiring; og‘riq bo‘lsa — o‘tirib blok tortish (neytral tutqich).',
      },
    ],
    check: [C.stack, 'Dasta karabinga mahkam ilinganini tekshiring.'],
    stop: [S.shoulder],
  },
  'reverse-pec-deck': {
    risk: 1,
    why: 'Trenajyorda, ko‘krak suyanchiqda — xavf past.',
    joints: [],
    check: [C.seat('dastalar yelka sathida, ko‘krak suyanchiqqa tegib turadi'), C.stack],
    stop: [S.shoulder],
  },
  'db-reverse-fly': {
    risk: 1,
    why: 'Yengil gantellar; asosiy xavf — engashgan holatda belni dumaloqlash.',
    joints: [
      {
        at: 'lowerBack',
        how: 'Gavda engashgan holatda gantellar silkitilsa yoki bel dumaloqlansa, bel bo‘g‘imchalari va disklar yuklanadi.',
        mod: 'Peshonani qiya skameykaga qo‘yib bajaring yoki batterflayda orqa delta; vaznni kamaytiring.',
      },
    ],
    check: ['Engashishdan oldin qorinni qotiring, bel tekis.'],
    stop: [S.back, S.shoulder],
  },
  'lying-leg-curl': {
    risk: 1,
    why: 'Trenajyorda, harakat yo‘li qotirilgan. Asosiy xato — tosni ko‘tarib belni egish.',
    joints: [
      {
        at: 'lowerBack',
        how: 'Og‘ir vaznda tos yostiqdan ko‘tarilsa, bel ortiqcha egiladi — bel bo‘g‘imchalari siqiladi.',
        mod: 'Qorin va tosni yostiqqa bosing, vaznni kamaytiring; og‘riq bo‘lsa — o‘tirib oyoq bukish.',
      },
    ],
    check: [C.seat('tizza trenajyor o‘qi bilan bir chiziqda, rolik tovondan biroz yuqorida'), C.stack],
    stop: [S.ham, S.back],
  },
  'db-lunge': {
    risk: 2,
    why: 'Bir oyoqda, gantellar bilan: muvozanat yo‘qolishi va tizzaning ichkariga qulashi asosiy xavf.',
    joints: [
      {
        at: 'knee',
        how: 'Qisqa qadam yoki tizzaning ichkariga qulashi tizza qopqog‘i va ichki paylarga bosimni oshiradi.',
        mod: 'Qadamni uzaytiring, chuqurlikni og‘riqsiz nuqtagacha cheklang; og‘riq bo‘lsa — orqaga hamla yoki oyoq press.',
      },
    ],
    check: ['Atrofda 2–3 qadam bo‘sh joy, pol sirpanchiq emas.', 'Avval vaznsiz 5–6 takror bilan muvozanatni tekshiring.'],
    bail: FALL_BAIL,
    stop: [S.knee],
  },
  'single-leg-rdl': {
    risk: 2,
    why: 'Bir oyoqda engashish: muvozanat va bel holatini bir vaqtda nazorat qilish kerak.',
    joints: [
      {
        at: 'lowerBack',
        how: 'Muvozanat uchun bel dumaloqlansa yoki tos burilsa, bel bo‘g‘imchalariga notekis yuklama tushadi.',
        mod: 'Bo‘sh qo‘l bilan devorga tayaning, amplitudani kamaytiring; og‘riq bo‘lsa — ko‘prikcha yoki tos ko‘tarish.',
      },
    ],
    check: ['Yonida devor yoki tayanch bo‘lsin.', 'Vaznsiz 5–6 takror bilan muvozanatni sinang.'],
    bail: FALL_BAIL,
    stop: [S.back, S.ham],
  },
  'cable-overhead-extension': {
    risk: 1,
    why: 'Blokda, yengil-o‘rta vazn — xavf past. Asosiy xato — belni egib itarish va tirsaklarni yoyish.',
    joints: [
      {
        at: 'elbow',
        how: 'Chuqur cho‘zilgan holatda og‘ir vazn tirsak orqasidagi payga katta yuklama beradi.',
        mod: 'Vaznni kamaytirib, pastki holatga sekin tushing; og‘riq bo‘lsa — blokda triseps (pastga itarish).',
      },
      {
        at: 'shoulder',
        how: 'Qo‘llar bosh ustida — yelka harakatchanligi yetmasa, yelka oldi qisiladi va bel egiladi.',
        mod: 'Tavsiya etilmaydi: qo‘l bosh ustida bo‘lganda yelka qisiladi — o‘rniga blokda triseps (pastga itarish), qo‘l bosh ustiga ko‘tarilmaydi.',
      },
    ],
    check: [C.stack, 'Arqon karabinga to‘liq ilinganini tekshiring.'],
    stop: [S.elbow, S.shoulder],
  },
  'farmers-carry': {
    risk: 2,
    why: 'Og‘ir yuk bilan yurish: yukni ko‘tarish-qo‘yish va qo‘ldan tushirib yuborish asosiy xavf.',
    joints: [
      {
        at: 'lowerBack',
        how: 'Yukni poldan egilgan bel bilan olish yoki tashlash belni jarohatlaydi; yurishda yonga qiyshayish ham bel yuklamasini oshiradi.',
        mod: 'Yukni cho‘kkalab, bel tekis holda oling va qo‘ying; yengilroq yuk va qisqa masofa.',
      },
    ],
    check: ['Yo‘lak bo‘sh va sirpanchiq emas.', 'Ushlash charchasa — to‘xtang, yuk qo‘ldan tushmasin.'],
    stop: [S.back, 'Ushlash bo‘shab, yuk sirg‘alib keta boshlasa — darhol qo‘ying'],
  },
  'pallof-press': {
    risk: 1,
    why: 'Yengil yuk, umurtqa harakatsiz — bel uchun eng xavfsiz press mashqlaridan.',
    joints: [],
    check: [C.stack],
    stop: [S.back],
  },
  'hanging-knee-raise': {
    risk: 1,
    why: 'O‘z vazni bilan; asosiy xavf — tebranish va ushlash bo‘shashi.',
    joints: [
      {
        at: 'shoulder',
        how: 'Osilib turganda yelka butun tana vaznini ushlaydi; yelkalar butunlay bo‘shashsa, bo‘g‘im kapsulasi zo‘riqadi.',
        mod: 'Yelkalarni biroz pastga tortib osiling; og‘riq bo‘lsa — polda teskari qisqarish.',
      },
    ],
    check: ['Turnik mahkam o‘rnatilgan; qo‘llar quruq (kerak bo‘lsa — bo‘r).'],
    stop: [S.shoulder, S.back],
  },
  'sumo-deadlift': {
    risk: 3,
    why: 'Poldan og‘ir shtanga: bel holati va tizzalarning ichkariga qulashi — asosiy xavf.',
    joints: [
      {
        at: 'lowerBack',
        how: 'Tos tez ko‘tarilib ketsa yoki bel dumaloqlansa, og‘ir yuk umurtqa disklariga tushadi.',
        mod: 'Tavsiya etilmaydi: tos ko‘tarish, giperekstenziya yoki oyoq press. Shifokor ruxsati bilan — yengil vazn, balandroq (blok ustidan) tortish.',
      },
      {
        at: 'hip',
        how: 'Juda keng turish va oyoqlarni haddan tashqariga burish tos-son bo‘g‘imining old qismini qisadi.',
        mod: 'Turishni torroq qiling, oyoq uchlarini kamroq tashqariga buring; og‘riq bo‘lsa — oddiy o‘lik tortish yoki tos ko‘tarish.',
      },
      {
        at: 'knee',
        how: 'Tizzalar ichkariga qulasa, ichki paylarga yonlama bosim tushadi.',
        mod: 'Tizzalarni oyoq uchi yo‘nalishida tashqariga suring, vaznni kamaytiring.',
      },
    ],
    check: [C.warm, C.collars, 'Shtanga oyoq kafti o‘rtasi ustida, boldirlarga tegib turadi.'],
    bail: 'Shtangani ko‘tara olmasangiz — tortishni to‘xtatib, shtangani belni tekis tutgan holda polga qo‘ying; tepada bo‘lsa — sonlar bo‘ylab tushirib, oyoqlaringizni chetga oling.',
    failure: 'form',
    stop: [S.back, S.radiating, S.hip],
  },
  'incline-push-up': {
    risk: 1,
    why: 'O‘z vazni, tayanch baland — eng yengil otjimaniya. Asosiy xavf — tayanch sirpanib ketishi.',
    joints: [
      {
        at: 'wrist',
        how: 'Kaft tayanchda bilak orqaga keskin bukilgan holda yuklanadi.',
        mod: 'Kaftni tayanch chetini ushlab qo‘ying yoki mushtda bajaring; og‘riq bo‘lsa — devorga otjimaniya.',
      },
    ],
    check: ['Tayanch (skameyka, stol) sirpanmaydi va og‘irlikka chidaydi — devorga tirab qo‘ying.'],
    stop: [S.wrist, S.shoulder],
  },
  'nordic-curl': {
    risk: 2,
    why: 'Kuchli ekssentrik yuklama: birinchi marta son orqasi qattiq og‘riydi (mushak og‘rig‘i), tez «yiqilish» — asosiy xavf.',
    joints: [
      {
        at: 'knee',
        how: 'Tiz cho‘kib, tana vazni tizzaga tushadi; qattiq polda tizza qopqog‘i siqiladi.',
        mod: 'Tizza ostiga qalin yostiq qo‘ying, amplitudani kichraytiring; og‘riq bo‘lsa — fitbolda oyoq bukish.',
      },
    ],
    check: [
      'Tizza ostida qalin yumshoq gilam yoki yostiq.',
      'To‘piqlar mahkam qistirilgan (og‘ir divan yoki sherik).',
      'Birinchi haftalarda 2 set × 3–5 takror — keyingi kunlardagi kuchli og‘riqni kamaytiradi.',
    ],
    stop: [S.ham, S.knee],
  },
  'lateral-lunge': {
    risk: 1,
    why: 'O‘z vazni bilan, kichik amplitudadan boshlanadi — xavf past.',
    joints: [
      {
        at: 'knee',
        how: 'Bukilgan tizza ichkariga qulasa yoki tovon ko‘tarilsa, tizza ichki tomoniga bosim tushadi.',
        mod: 'Chuqurlikni kamaytiring, og‘irlik tovonda; og‘riq bo‘lsa — sumo o‘tirish.',
      },
      {
        at: 'hip',
        how: 'To‘g‘ri oyoqning son ichki mushaklari va chov sohasi kuchli cho‘ziladi.',
        mod: 'Oyoqlarni kamroq keng qo‘ying, sekin bajaring; chovda og‘riq bo‘lsa — to‘xtang.',
      },
    ],
    check: ['Pol sirpanchiq emas, atrofda bo‘sh joy.'],
    stop: [S.knee, S.hip],
  },
  'jump-squat': {
    risk: 2,
    why: 'Sakrash va qo‘nish — bo‘g‘imlarga zarb. Charchaganda texnika buziladi.',
    joints: [
      {
        at: 'knee',
        how: 'Tik oyoqda qattiq qo‘nish yoki tizzaning ichkariga qulashi tizza paylariga zarb beradi.',
        mod: 'Tavsiya etilmaydi: sakrab qo‘nish tizzaga takroriy zarba beradi — o‘rniga o‘z vazni bilan o‘tirish yoki qutiga o‘tirib-turish, og‘riqsiz chuqurlikda.',
      },
    ],
    check: ['Yumshoq gilam yoki rezina pol; poyabzal tovoni yumshoq.', 'Oldin 1–2 daqiqa isinish.'],
    stop: [S.knee, S.back],
  },
};
