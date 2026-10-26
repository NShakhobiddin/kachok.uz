// Mashq illyustratsiyalari: AI yordamida yaratilgan, texnikasi va mushak yoritilishi EMG jadvali bilan tekshirilgan rasmlar.
// Rasmlarda matn yo'q — mushak nomlari, foizlar va texnika belgilari ilovada ustiga qo'yiladi (koordinatalar — rasmning %).
// Foizlar shu yerda yozilmaydi: activationFor(mashq) dan olinadi, shuning uchun jadval bilan doim bir xil.
import type { M3 } from './muscles3d';

export interface IlluLabel {
  key: M3;
  /** qisqa nom (rasm ustida); berilmasa — M3_INFO nomi */
  name?: string;
  /** mushakdagi nuqta, % */
  x: number;
  y: number;
  /** yorliq ustuni va balandligi */
  side: 'l' | 'r';
  ly: number;
}

export interface IlluCheck {
  text: string;
  x: number;
  y: number;
  side: 'l' | 'r';
  ly: number;
}

export interface Illustration {
  src: string;
  /** qaysi holat tasvirlangan */
  phase: string;
  alt: string;
  labels: IlluLabel[];
  checks: IlluCheck[];
}

const img = (f: string) => `${import.meta.env.BASE_URL}illustrations/${f}`;

export const ILLUSTRATIONS: Partial<Record<string, Illustration>> = {
  'back-squat': {
    src: img('back-squat-bottom.webp'),
    phase: 'Pastki nuqta',
    alt: 'Shtanga bilan o‘tirib-turish, pastki nuqta: shtanga trapetsiya ustida, son pol bilan parallel; son oldi, dumba va bel mushaklari lime rangda yonmoqda',
    labels: [
      { key: 'rectusFemoris', name: 'To‘g‘ri son', x: 43, y: 54.5, side: 'l', ly: 42 },
      { key: 'vastusLateralis', name: 'Tashqi son', x: 34, y: 59, side: 'l', ly: 56 },
      { key: 'gastrocnemius', name: 'Boldir', x: 32, y: 73, side: 'l', ly: 77 },
      { key: 'erectors', name: 'Bel rostlovchi', x: 53, y: 40, side: 'r', ly: 42 },
      { key: 'gluteMax', name: 'Katta dumba', x: 55, y: 57, side: 'r', ly: 56 },
      { key: 'adductors', name: 'Ichki son', x: 53, y: 64, side: 'r', ly: 70 },
    ],
    checks: [
      { text: 'Nigoh 2 m oldinga, bo‘yin tabiiy', x: 37, y: 19, side: 'l', ly: 6 },
      { text: 'Shtanga trapetsiya ustida', x: 47, y: 27.5, side: 'r', ly: 36 },
      { text: 'Ushlash keng, tirsaklar pastga', x: 41, y: 40, side: 'l', ly: 42 },
      { text: 'Bel tekis, tabiiy egilish saqlangan', x: 53, y: 44, side: 'r', ly: 54 },
      { text: 'Son pol bilan parallel', x: 46, y: 59, side: 'l', ly: 57 },
      { text: 'Tizza oyoq uchi yo‘nalishida', x: 27, y: 63, side: 'l', ly: 71 },
      { text: 'Tovonlar yerda, og‘irlik oyoq kafti o‘rtasida', x: 40, y: 90, side: 'r', ly: 85 },
    ],
  },
};
