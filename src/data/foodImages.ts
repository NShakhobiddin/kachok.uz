// Taom rasmlari (Flow’da yaratiladi: scripts/images/food-pack.ts). Rasm qo‘shilgan taom id lari shu ro‘yxatga yoziladi;
// rasmi yo‘q taomlarda belgi (emoji) ko‘rsatiladi.
const WITH_IMG = new Set<string>([]);

export const foodImg = (id: string): string | null => (WITH_IMG.has(id) ? `${import.meta.env.BASE_URL}food/${id}.webp` : null);
