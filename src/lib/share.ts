// Do'stlar bilan ulashish: rasm (telefonning ulashish oynasi) yoki Telegram orqali matn va ilova havolasi.
import { saveFile } from './download';
import { telegram } from './telegram';

/** Ilovaning ochiq manzili (do'st bosib ochishi uchun) */
export function appUrl(): string {
  try {
    return new URL(import.meta.env.BASE_URL || '/', location.origin).href;
  } catch {
    return location.origin;
  }
}

/** Qurilma rasmni ulashish oynasi orqali yubora oladimi (Android Chrome, iOS Safari — ha; kompyuter va ba'zi ichki brauzerlar — yo'q) */
export function canShareFiles(): boolean {
  try {
    const f = new File([new Blob(['x'], { type: 'image/png' })], 'x.png', { type: 'image/png' });
    return !!navigator.canShare?.({ files: [f] });
  } catch {
    return false;
  }
}

/** Rasm va matn bilan ulashish; foydalanuvchi bekor qilsa — false */
export async function shareImage(blob: Blob, text: string, filename: string): Promise<boolean> {
  const file = new File([blob], filename, { type: 'image/png' });
  try {
    await navigator.share({ files: [file], text });
    return true;
  } catch {
    return false;
  }
}

/** Telegram'da do'stlarga: chat tanlash oynasi, matn va ilova havolasi bilan */
export function telegramShare(text: string) {
  const url = `https://t.me/share/url?url=${encodeURIComponent(appUrl())}&text=${encodeURIComponent(text)}`;
  const tg = telegram() as unknown as { openTelegramLink?: (u: string) => void } | undefined;
  if (tg?.openTelegramLink) tg.openTelegramLink(url);
  else window.open(url, '_blank', 'noopener');
}

export const saveImage = (blob: Blob, filename: string) => saveFile(filename, blob);
