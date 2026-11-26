// Ko‘p beriladigan savollar: sahifada va qidiruv tizimlari uchun (FAQPage) bir xil matn.
import type { SiteData } from './model';

export interface Faq {
  q: string;
  a: string;
}

export const faqs = (s: SiteData['stats'], bot: string): Faq[] => [
  {
    q: 'GYMbos pullikmi?',
    a: 'Yo‘q. Hozir ilovaning barcha imkoniyatlari bepul: dastur, mashqlar texnikasi, ovqatlanish, natijalar va do‘stlar lentasi. Karta ulash so‘ralmaydi.',
  },
  {
    q: 'Ilovani qanday ochaman?',
    a: `Telegram’da ${bot} botini oching. Ilova Telegram’ning o‘zida ochiladi, hech narsa yuklab olish va o‘rnatish shart emas. Telefon va kompyuterdagi Telegram’da ishlaydi.`,
  },
  {
    q: 'Zalga endi bormoqchiman. Menga mosmi?',
    a: 'Ha. Boshlovchilar uchun oddiy dastur beriladi: kam mashq, aniq vazn va takror. Har bir mashqning anatomik rasmi, to‘g‘ri bajarish va keng tarqalgan xatolar ko‘rsatiladi. Vazn esa siz bajarganingizga qarab asta-sekin oshadi.',
  },
  {
    q: 'Uyda mashq qilsam bo‘ladimi?',
    a: 'Bo‘ladi. Qaysi jihozingiz borligini belgilaysiz: gantel, rezina, turnik, girya yoki faqat o‘z vazningiz. Ilova faqat shu jihozlar bilan bajariladigan mashqlarni beradi.',
  },
  {
    q: 'Belim yoki tizzam og‘risa-chi?',
    a: 'Anketada qayeringiz og‘rishini belgilaysiz. Shu joyga xavfli mashqlar dasturdan chiqariladi yoki yengilroq varianti beriladi, har mashqdan oldin qisqa xavfsizlik tekshiruvi bor. Kuchli yoki uzoq davom etayotgan og‘riqda avval shifokorga ko‘rining.',
  },
  {
    q: 'Kaloriya va oqsil qanday hisoblanadi?',
    a: `Mifflin–St Jeor formulasi, kundalik harakatingiz, mashg‘ulotlar soni va maqsadingiz bo‘yicha. Ilovada ${s.dishes} ta milliy taom va ${s.foods} ta mahsulot bor: osh, lag‘mon, manti, somsani porsiya bilan kundalikka qo‘shasiz. Bir necha haftadan keyin ilova vazningiz o‘zgarishiga qarab me’yorni aniqlashtiradi.`,
  },
  {
    q: 'Ayollar uchun ham mosmi?',
    a: 'Ha. Kaloriya, oqsil va kuch me’yorlari jinsga qarab hisoblanadi. Dasturdagi mashqlar maqsadingizga qarab tanlanadi: dumba va oyoqqa urg‘u, ozish yoki umumiy tetiklik.',
  },
  {
    q: 'Ma’lumotlarim qayerda saqlanadi?',
    a: 'Mashg‘ulotlar va ovqat kundaligi telefoningizda saqlanadi. Ro‘yxatdan o‘tsangiz, telefon almashganda yo‘qolmasligi uchun zaxira nusxasi serverda turadi. Do‘stlaringiz faqat siz ulashgan natijalarni ko‘radi. Batafsil maxfiylik sahifasida.',
  },
  {
    q: 'Telegram’siz ishlatsa bo‘ladimi?',
    a: 'Ha, brauzer versiyasi bor (sahifa pastidagi «Brauzerda ochish» havolasi). Lekin do‘stlar lentasi, bulutdagi zaxira va botdan eslatmalar faqat Telegram’da ishlaydi.',
  },
];
