// Zal jihozlari rasmlari: AI yordamida yaratilgan, matnsiz, bir xil uslubda (promptlar — docs/image-prompts.md).
// Rasm qo'shilganda uning id si shu ro'yxatga yoziladi; rasmi hali yo'q jihoz kartasida belgi chiqadi.
import type { EquipmentId } from '../types';

export const EQUIPMENT_WITH_IMG: EquipmentId[] = [
  'barbell',
  'rack',
  'bench',
  'inclineBench',
  'dumbbells',
  'ezBar',
  'kettlebell',
  'cable',
  'latPulldown',
  'seatedRow',
  'smith',
  'legPress',
  'hackSquat',
  'legExtension',
  'legCurl',
  'chestPress',
  'pecDeck',
  'shoulderPress',
  'hyperext',
  'pullupBar',
  'dipBars',
  'bands',
  'box',
  'cardio',
];

export const equipmentImg = (id: EquipmentId) => (EQUIPMENT_WITH_IMG.includes(id) ? `${import.meta.env.BASE_URL}illustrations/equipment/${id}.webp` : null);
