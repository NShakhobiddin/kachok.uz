// Saytdagi faktlar va «Mif yoki haqiqat?» o‘yini: har bir da’vo ilovaning tekshirilgan manbalariga (src/data/sources.ts) tayanadi.
// Bu fayl faqat yig‘ishda o‘qiladi (buildData.ts): manba nomi va DOI shu yerda emas, manbalar ro‘yxatidan olinadi.

export interface FactDef {
  /** katta raqam: "10–17%", "+2,9%" — raqamlar ekranga chiqqanda noldan sanab chiqadi */
  value: string;
  title: string;
  text: string;
  source: string;
}

export interface MythDef {
  claim: string;
  /** true — haqiqat, false — mif */
  truth: boolean;
  explain: string;
  source: string;
}

export const FACT_DEFS: FactDef[] = [
  {
    value: '10–17%',
    title: 'kamroq o‘lim xavfi',
    text: 'Haftasiga atigi 30–60 daqiqa kuch mashqi umumiy o‘lim, yurak-qon tomir kasalliklari, saraton va diabet xavfini kamaytiradi.',
    source: 'momma2022',
  },
  {
    value: '3–8%',
    title: 'mushak har 10 yilda yo‘qoladi',
    text: 'Harakatsiz kattalarda shunday. 10 haftalik kuch mashqi esa o‘rtacha 1,4 kg mushak qo‘shib, 1,8 kg yog‘ni kamaytiradi.',
    source: 'westcott2012',
  },
  {
    value: '4 tadan 1',
    title: 'kishida kayfiyat aniq yaxshilanadi',
    text: '33 ta tadqiqot tahlili: kuch mashqi depressiya alomatlarini sezilarli kamaytiradi.',
    source: 'gordon2018',
  },
  {
    value: '+2,9%',
    title: 'umurtqa suyagi zichligi',
    text: '8 oylik og‘ir kuch mashqidan keyin (mashq qilmaganlarda −1,2%). Tadqiqot suyak zichligi past ayollarda o‘tkazilgan: to‘g‘ri texnika bilan og‘ir vazn suyakni mustahkamlaydi.',
    source: 'watson2018',
  },
  {
    value: '−3,2',
    title: 'mm sim. ust. qon bosimi',
    text: 'Dinamik kuch mashqlari pastki (diastolik) qon bosimini o‘rtacha shuncha pasaytiradi.',
    source: 'cornelissen2013',
  },
  {
    value: '2 kun',
    title: 'haftasiga kuch mashqi',
    text: 'JSST tavsiyasi: kattalarga haftasiga 150–300 daqiqa o‘rtacha faollik va kamida 2 kun barcha yirik mushaklar uchun kuch mashqi.',
    source: 'who2020',
  },
];

export const MYTH_DEFS: MythDef[] = [
  {
    claim: 'Press mashqi qorindagi yog‘ni ketkazadi.',
    truth: false,
    explain: '6 hafta press mashqi qilganlarda qorin yog‘i ham, bel o‘lchami ham kamaymadi. Yog‘ butun tanadan va faqat kaloriya taqchilligida ketadi.',
    source: 'vispute2011',
  },
  {
    claim: 'Osh yeb ham ozish mumkin.',
    truth: true,
    explain: 'Ozishni kunlik jami kaloriya hal qiladi, alohida taom emas. Porsiyani nazorat qilsangiz, osh ham reja ichiga sig‘adi.',
    source: 'aragon2017',
  },
  {
    claim: 'Oqsil qancha ko‘p bo‘lsa, mushak shuncha ko‘p o‘sadi.',
    truth: false,
    explain: '49 ta tadqiqot, 1 863 kishi: kuniga tana vaznining har kilogrammiga ~1,6 g oqsildan keyin qo‘shimcha foyda deyarli yo‘q.',
    source: 'morton2018',
  },
  {
    claim: 'Setlar orasida 2–3 daqiqa dam olish 1 daqiqadan foydaliroq.',
    truth: true,
    explain: '3 daqiqa dam olganlarda 1 daqiqa dam olganlarga qaraganda kuch ham, mushak ham ko‘proq o‘sdi.',
    source: 'schoenfeld2016rest',
  },
  {
    claim: 'Tez ozish (haftasiga 1–2 kg) — eng samarali yo‘l.',
    truth: false,
    explain: 'Haftasiga vaznning 0,7% i qadar sekin ozganlar mushakni 2,1% oshirdi, 1,4% dan tez ozganlar esa mushak yo‘qotdi.',
    source: 'garthe2011',
  },
  {
    claim: 'Yengil vazn bilan ham mushak o‘stirsa bo‘ladi.',
    truth: true,
    explain: 'Set charchoqqa yaqin bajarilsa, yengil va og‘ir vazn mushakni bir xil o‘stiradi. Maksimal kuch esa og‘ir vazndan ko‘proq oshadi.',
    source: 'schoenfeld2017load',
  },
  {
    claim: 'Kreatin — gormon, sog‘liqqa zarar.',
    truth: false,
    explain: 'Kreatin gormon ham, steroid ham emas. Kreatin monogidrat — eng ko‘p o‘rganilgan va xavfsiz sport qo‘shimchasi: kuniga 3–5 g.',
    source: 'kreider2017',
  },
  {
    claim: '50 yoshdan keyin mushak qo‘shib bo‘lmaydi.',
    truth: false,
    explain: '50 yoshdan oshganlar kuch mashqi bilan ~20 haftada o‘rtacha 1,1 kg mushak qo‘shgan. Yosh to‘siq emas.',
    source: 'peterson2011',
  },
  {
    claim: 'Har mushakni haftasiga 2 marta ishlatish 1 martadan yaxshiroq.',
    truth: true,
    explain: 'Mushakni haftasiga 2 va undan ko‘p marta ishlatish 1 martadan yaxshiroq natija berdi. Haftalik set soni teng bo‘lsa, farq kichrayadi.',
    source: 'schoenfeld2016freq',
  },
  {
    claim: 'Ozish uchun maxsus parhez (keto va boshqalar) shart.',
    truth: false,
    explain: 'Kaloriya teng bo‘lsa, turli parhezlar deyarli bir xil natija beradi. Asosiysi — barqaror kaloriya taqchilligi va yetarli oqsil.',
    source: 'aragon2017',
  },
];
