// 3D modeldagi mushaklar (Z-Anatomy / BodyParts3D asosida). Har bir kalit — modeldagi alohida mesh (chap + o'ng).
// EMG tadqiqotlari aynan shu darajada o'lchaydi: masalan, ko'krak mushagining o'mrov va to'sh qismlari alohida.
import type { MuscleId } from '../types';

export type M3 =
  | 'pecUpper'
  | 'pecMid'
  | 'pecLower'
  | 'deltAnt'
  | 'deltLat'
  | 'deltPost'
  | 'trapUpper'
  | 'trapMid'
  | 'trapLower'
  | 'rhomboids'
  | 'lats'
  | 'teresMajor'
  | 'infraspinatus'
  | 'serratus'
  | 'erectors'
  | 'rectusAbdominis'
  | 'externalOblique'
  | 'biceps'
  | 'brachialis'
  | 'brachioradialis'
  | 'tricepsLong'
  | 'tricepsLateral'
  | 'tricepsMedial'
  | 'forearmFlexors'
  | 'forearmExtensors'
  | 'gluteMax'
  | 'gluteMed'
  | 'rectusFemoris'
  | 'vastusLateralis'
  | 'vastusMedialis'
  | 'bicepsFemoris'
  | 'medialHamstrings'
  | 'adductors'
  | 'gastrocnemius'
  | 'soleus'
  | 'tibialisAnterior'
  | 'iliopsoas';

export interface M3Info {
  name: string;
  /** lotincha anatomik nom */
  latin: string;
  /** ilovadagi umumiy mushak guruhi (xarita, hajm hisobi) */
  group: MuscleId | null;
  /** qaysi tomondan yaxshi ko'rinadi */
  view: 'front' | 'back' | 'side';
}

export const M3_INFO: Record<M3, M3Info> = {
  pecUpper: { name: 'Ko‘krak mushagi — yuqori (o‘mrov) qismi', latin: 'pectoralis major, pars clavicularis', group: 'chest', view: 'front' },
  pecMid: { name: 'Ko‘krak mushagi — o‘rta (to‘sh) qismi', latin: 'pectoralis major, pars sternocostalis', group: 'chest', view: 'front' },
  pecLower: { name: 'Ko‘krak mushagi — pastki qismi', latin: 'pectoralis major, pars abdominalis', group: 'chest', view: 'front' },
  deltAnt: { name: 'Delta — old qismi', latin: 'deltoideus, pars clavicularis', group: 'frontDelts', view: 'front' },
  deltLat: { name: 'Delta — o‘rta (yon) qismi', latin: 'deltoideus, pars acromialis', group: 'sideDelts', view: 'side' },
  deltPost: { name: 'Delta — orqa qismi', latin: 'deltoideus, pars spinalis', group: 'rearDelts', view: 'back' },
  trapUpper: { name: 'Trapetsiya — yuqori qismi', latin: 'trapezius, pars descendens', group: 'traps', view: 'back' },
  trapMid: { name: 'Trapetsiya — o‘rta qismi', latin: 'trapezius, pars transversa', group: 'upperBack', view: 'back' },
  trapLower: { name: 'Trapetsiya — pastki qismi', latin: 'trapezius, pars ascendens', group: 'upperBack', view: 'back' },
  rhomboids: { name: 'Rombsimon mushaklar', latin: 'rhomboideus major et minor', group: 'upperBack', view: 'back' },
  lats: { name: 'Orqaning eng keng mushagi', latin: 'latissimus dorsi', group: 'lats', view: 'back' },
  teresMajor: { name: 'Katta yumaloq mushak', latin: 'teres major', group: 'lats', view: 'back' },
  infraspinatus: { name: 'Qirra osti va kichik yumaloq mushak', latin: 'infraspinatus, teres minor', group: 'rearDelts', view: 'back' },
  serratus: { name: 'Old tishsimon mushak', latin: 'serratus anterior', group: null, view: 'side' },
  erectors: { name: 'Umurtqa rostlovchi mushaklar', latin: 'erector spinae', group: 'lowerBack', view: 'back' },
  rectusAbdominis: { name: 'Qorinning to‘g‘ri mushagi', latin: 'rectus abdominis', group: 'abs', view: 'front' },
  externalOblique: { name: 'Qorinning qiyshiq mushaklari', latin: 'obliquus externus et internus abdominis', group: 'obliques', view: 'front' },
  biceps: { name: 'Bitseps (ikki boshli yelka mushagi)', latin: 'biceps brachii', group: 'biceps', view: 'front' },
  brachialis: { name: 'Yelka mushagi (brakhialis)', latin: 'brachialis', group: 'biceps', view: 'side' },
  brachioradialis: { name: 'Yelka-bilak mushagi', latin: 'brachioradialis', group: 'forearms', view: 'front' },
  tricepsLong: { name: 'Triseps — uzun boshi', latin: 'triceps brachii, caput longum', group: 'triceps', view: 'back' },
  tricepsLateral: { name: 'Triseps — tashqi boshi', latin: 'triceps brachii, caput laterale', group: 'triceps', view: 'back' },
  tricepsMedial: { name: 'Triseps — ichki boshi', latin: 'triceps brachii, caput mediale', group: 'triceps', view: 'back' },
  forearmFlexors: { name: 'Bilak bukuvchi mushaklari', latin: 'flexores antebrachii', group: 'forearms', view: 'front' },
  forearmExtensors: { name: 'Bilak yozuvchi mushaklari', latin: 'extensores antebrachii', group: 'forearms', view: 'back' },
  gluteMax: { name: 'Katta dumba mushagi', latin: 'gluteus maximus', group: 'glutes', view: 'back' },
  gluteMed: { name: 'O‘rta va kichik dumba mushaklari', latin: 'gluteus medius et minimus', group: 'glutes', view: 'side' },
  rectusFemoris: { name: 'Sonning to‘g‘ri mushagi', latin: 'rectus femoris', group: 'quads', view: 'front' },
  vastusLateralis: { name: 'Sonning tashqi keng mushagi', latin: 'vastus lateralis', group: 'quads', view: 'side' },
  vastusMedialis: { name: 'Sonning ichki keng mushagi', latin: 'vastus medialis', group: 'quads', view: 'front' },
  bicepsFemoris: { name: 'Sonning ikki boshli mushagi', latin: 'biceps femoris', group: 'hamstrings', view: 'back' },
  medialHamstrings: { name: 'Yarim payli va yarim pardali mushaklar', latin: 'semitendinosus, semimembranosus', group: 'hamstrings', view: 'back' },
  adductors: { name: 'Son yaqinlashtiruvchi mushaklar', latin: 'adductores, gracilis, pectineus', group: 'adductors', view: 'front' },
  gastrocnemius: { name: 'Boldir mushagi (gastroknemius)', latin: 'gastrocnemius', group: 'calves', view: 'back' },
  soleus: { name: 'Kambalasimon mushak', latin: 'soleus', group: 'calves', view: 'back' },
  tibialisAnterior: { name: 'Boldirning old mushagi', latin: 'tibialis anterior', group: null, view: 'front' },
  iliopsoas: { name: 'Yonbosh-bel mushagi', latin: 'iliopsoas', group: null, view: 'front' },
};

export const M3_KEYS = Object.keys(M3_INFO) as M3[];
export const isM3 = (k: string): k is M3 => k in M3_INFO;

/** Ilovaning umumiy guruhidan 3D mushaklarga (EMG ma'lumoti bo'lmaganda taxmin uchun) */
export const GROUP_TO_M3: Partial<Record<MuscleId, M3[]>> = {
  chest: ['pecMid', 'pecUpper', 'pecLower'],
  frontDelts: ['deltAnt'],
  sideDelts: ['deltLat'],
  rearDelts: ['deltPost', 'infraspinatus'],
  biceps: ['biceps', 'brachialis'],
  triceps: ['tricepsLateral', 'tricepsLong', 'tricepsMedial'],
  forearms: ['forearmFlexors', 'brachioradialis'],
  traps: ['trapUpper'],
  lats: ['lats', 'teresMajor'],
  upperBack: ['trapMid', 'rhomboids', 'trapLower'],
  lowerBack: ['erectors'],
  abs: ['rectusAbdominis'],
  obliques: ['externalOblique'],
  glutes: ['gluteMax', 'gluteMed'],
  quads: ['vastusLateralis', 'vastusMedialis', 'rectusFemoris'],
  hamstrings: ['bicepsFemoris', 'medialHamstrings'],
  adductors: ['adductors'],
  calves: ['gastrocnemius', 'soleus'],
};
