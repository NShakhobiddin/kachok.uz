// Xavfsizlik profillari: qo‘shimcha trenajyor mashqlari (exercisesMachines.ts).
import type { ExerciseSafety } from './safety';
import { C, S } from './safetyText';

export const SAFETY_MACHINES: Record<string, ExerciseSafety> = {
  'hip-abduction': {
    risk: 1,
    why: 'Trenajyor, o‘tirib, yo‘nalish qotirilgan — xavf past. Asosiy xato — og‘ir vaznni silkitib «otish».',
    joints: [
      {
        at: 'hip',
        how: 'Son bo‘g‘imining tashqi qismida (katta ko‘st sohasida) paylar og‘riyotgan bo‘lsa, og‘ir yuklama va keskin harakat ularni ta’sirlantiradi.',
        mod: 'Yengil vazn, sekin sur’at va og‘riqsiz amplituda; og‘riq kuchli bo‘lsa — eng keng nuqtada 20–30 soniya statik ushlab turish (izometrik) bilan boshlang.',
      },
    ],
    check: [C.seat('orqa suyanchiqda, yostiqlar sonning tashqi tomonida — tizzadan biroz yuqorida'), C.stack],
    stop: [S.hip, 'Son tashqi tomonida o‘tkir, sanchiqli og‘riq'],
  },
  'hip-adduction': {
    risk: 1,
    why: 'Trenajyor, yo‘nalish qotirilgan — xavf past. Asosiy xavf — boshlang‘ich holatni juda keng qo‘yib, chovni og‘irlik ostida haddan cho‘zish.',
    joints: [
      {
        at: 'hip',
        how: 'Juda keng boshlang‘ich holat va keng nuqtada «sakrash» chov paylari va son ichki mushaklarini tortadi; chov og‘rig‘ida bu og‘riqni kuchaytiradi.',
        mod: 'Boshlang‘ich kenglikni og‘riqsiz oraliqqa cheklang, yengil vazn va sekin ochish; chov og‘riyotgan bo‘lsa — yostiqlar orasida statik qisish (izometrik) bilan boshlang.',
      },
    ],
    check: [C.seat('orqa suyanchiqda, boshlang‘ich kenglik — chovda yengil cho‘zilish, og‘riqsiz'), C.stack],
    stop: [S.hip, 'Chovda yoki son ichki tomonida o‘tkir «tortilish» yoki «chirt» etish — mushak cho‘zilishi, davom etmang'],
  },
  'cable-kickback': {
    risk: 1,
    why: 'Blokda, yengil yuklama — xavf past. Asosiy xato — oyoqni balandroq ko‘tarish uchun belni egish.',
    joints: [
      {
        at: 'lowerBack',
        how: 'Oyoq gavda chizig‘idan yuqoriga «otilsa», harakat beldan davom etadi — bel orqaga egilib, bo‘g‘imchalar siqiladi.',
        mod: 'Amplitudani gavda chizig‘igacha cheklang, qorinni tarang tuting, gavdani ko‘proq engashtirib ramaga tayaning; og‘riq bo‘lsa — ko‘prikcha.',
      },
    ],
    check: [C.stack, 'To‘piq manjeti mahkam bog‘langan, karabin manjet halqasiga to‘liq kirgan.', 'Ramani ikki qo‘l bilan ushlang — tayanch oyoq barqaror.'],
    stop: [S.back, S.ham],
  },
  'cable-pull-through': {
    risk: 1,
    why: 'Yuk orqadan tortadi va kabel orqali keladi — shtangali tortishlardan bel uchun yengilroq. Asosiy xato — bel dumaloqlanishi.',
    joints: [
      {
        at: 'lowerBack',
        how: 'Engashish tosdan emas, umurtqadan bo‘lsa (bel dumaloqlansa), bel disklariga yuklama oshadi.',
        mod: 'Yengil vazn, chuqurlikni bel tekis qoladigan nuqtagacha cheklang; tepada belni orqaga egmang.',
      },
    ],
    check: [C.stack, 'Blokdan yetarli uzoqlikda turing — tros pastki nuqtada ham taranglikni ushlasin, og‘irlik bloki tushib urilmasin.'],
    bail: 'Arqonni qo‘yib yuboring — u oyoqlar orasidan blok tomonga ketadi. Undan oldin bir qadam orqaga, blokka yaqinlashing.',
    stop: [S.back, S.radiating, S.ham],
  },
  'seated-calf-raise': {
    risk: 1,
    why: 'O‘tirib, yostiq son ustida — xavf past. Pastda «sakrash» va keskin cho‘zilish Axill payini zo‘riqtiradi.',
    joints: [],
    check: [
      C.seat('tizza yostig‘i sonning pastki qismida mahkam, oyoq panjasi platforma chetida'),
      'Ishni tugatganda ushlagichni (stoporni) qaytaring — yostiqni ushlagichsiz qo‘yib yubormang.',
    ],
    stop: [S.achilles, 'Boldirda to‘satdan o‘tkir og‘riq yoki tirishish (kramp) — to‘xtang'],
  },
  'assisted-pull-up': {
    risk: 1,
    why: 'Trenajyor tana vaznining bir qismini ko‘taradi — oddiy tortilishdan xavf past. Asosiy xavf — yostiqqa chiqish va tushishda muvozanat yo‘qotish.',
    joints: [
      {
        at: 'shoulder',
        how: 'Pastda yelka to‘liq bo‘shatilgan holda keskin tushish yelka kapsulasini zo‘riqtiradi; juda keng ushlash — qisilish.',
        mod: 'Neytral (parallel) tutqichlar, yelka kengligida ushlash; pastda yelkalarni biroz faol tuting, yordamni ko‘paytiring.',
      },
      {
        at: 'elbow',
        how: 'Takror soni keskin oshsa, tirsak ichki qismidagi pay yallig‘lanadi.',
        mod: 'Neytral ushlash, haftalik takror sonini asta oshiring, pastda tirsakni keskin to‘g‘rilamang.',
      },
    ],
    check: [
      'Yordam og‘irligini zinapoyada turgan holda tanlang — shtift blokka oxirigacha kirgan.',
      'Avval tutqichlarni ushlang, keyin tizzalarni birin-ketin yostiqqa qo‘ying.',
    ],
    bail: 'Pastki nuqtaga qayting, bir oyoqni zinapoyaga qo‘yib, ikkinchisini yostiqdan oling — yostiqdan sakrab tushmang.',
    stop: [S.shoulder, S.elbow, S.biceps],
  },
  't-bar-row': {
    risk: 2,
    why: 'Engashgan holatda bel butun set davomida statik yuklama ostida: tana silkitilsa yoki bel dumaloqlansa — bel jarohati xavfi.',
    joints: [
      {
        at: 'lowerBack',
        how: 'Engashgan holatda bel paylariga statik yuklama tushadi; silkitish va dumaloqlanish disklarga xavfli.',
        mod: 'Tavsiya etilmaydi: ko‘krak tayanchli gantel tortish, o‘tirib blok tortish yoki skameykaga tayanib bir qo‘llab gantel tortish — bel yuklanmaydi.',
      },
    ],
    check: [C.warm, C.collars, 'Grifning bo‘sh uchi tayanchda (landmine) yoki burchakda mahkam turibdi — sirg‘alib chiqmaydi.', 'Grifni poldan bel tekis holda, tosdan bukilib ko‘taring.'],
    bail: 'Disklarni nazorat bilan polga qo‘ying va tutqichni qo‘yib yuboring. Charchoqdan tana silkitila boshlasa — set tugadi.',
    failure: 'form',
    stop: [S.back, S.radiating, S.biceps],
  },
  'preacher-curl': {
    risk: 1,
    why: 'Yengil vazn, yelka qotirilgan — xavf past. Lekin pastda bitseps payi cho‘zilgan holatda yuklanadi.',
    joints: [
      {
        at: 'elbow',
        how: 'Pastki nuqtada tirsak deyarli to‘liq yozilgan va bitseps cho‘zilgan; og‘irlikni «tashlab» yuborish payga zarba beradi.',
        mod: 'Pastda tirsakni 10–15° bukik holda to‘xtating, yengil vazn va 3 soniyalik tushirish; og‘riq bo‘lsa — «bolg‘a» ushlash bilan gantel.',
      },
    ],
    check: [C.seat('qo‘ltiq yostiqning yuqori chetida, qo‘lning yuqori qismi yostiqda to‘liq'), 'Birinchi setni yengil vazn bilan boshlang — pastki holatdagi cho‘zilish kuchli.'],
    stop: [S.biceps, S.elbow],
  },
  'ab-wheel': {
    risk: 2,
    why: 'Uzun richag: kuch yetmay qolganda bel pastga osilib, keskin orqaga egiladi; yelka boshdan yuqori holatda yuklanadi.',
    joints: [
      {
        at: 'lowerBack',
        how: 'Press tanani ushlay olmasa, bel pastga osiladi — bel umurtqalari orqaga egilib siqiladi.',
        mod: 'Qisqa masofa (devorga qarab dumalating), dumbani qisib tosni «buring»; og‘riq bo‘lsa — planka yoki «o‘lik qo‘ng‘iz».',
      },
      {
        at: 'shoulder',
        how: 'Eng uzoq nuqtada qo‘llar bosh ustiga cho‘zilgan holda tana vaznini ushlaydi — yelka oldi va kapsula zo‘riqadi.',
        mod: 'Masofani qisqartiring, qo‘llar yelka sathidan oldinga ko‘p ketmasin; og‘riq bo‘lsa — planka.',
      },
    ],
    check: ['Tizza ostida yumshoq gilam yoki yostiq.', 'Rolik tekis polda, oldida 2 m bo‘sh joy; boshida devorga qarab dumalating.'],
    bail: 'Qaytib kela olmasangiz — tizzalarni bukib, tosni pastga tushiring va qorin bilan polga yoting.',
    stop: [S.back, S.shoulder],
  },
};
