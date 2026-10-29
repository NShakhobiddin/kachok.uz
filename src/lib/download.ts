// Faylni saqlash: oddiy saytda — brauzer yuklab olishi; Claude ko'rgazmasida — "downloads" ruxsati orqali;
// Telegram ichida — ulashish oynasi (Telegram'ning ichki brauzeri oddiy yuklab olishni ko'pincha bajarmaydi).
import { isTelegram } from './telegram';

type DownloadsNs = { save: (r: { filename: string; data: Blob }) => Promise<unknown> };
type ClaudeHost = { use: (name: 'downloads') => Promise<DownloadsNs | null> };

export async function saveFile(filename: string, data: Blob): Promise<'saved' | 'declined'> {
  const host = (window as unknown as { claude?: ClaudeHost }).claude;
  if (host?.use) {
    const dl = await host.use('downloads').catch(() => null);
    if (dl) {
      try {
        await dl.save({ filename, data });
        return 'saved';
      } catch (e) {
        if ((e as { code?: string })?.code === 'declined') return 'declined';
        throw e;
      }
    }
  }
  if (isTelegram()) {
    const file = new File([data], filename, { type: data.type });
    if (navigator.canShare?.({ files: [file] })) {
      try {
        await navigator.share({ files: [file], title: filename });
        return 'saved';
      } catch (e) {
        if ((e as DOMException)?.name === 'AbortError') return 'declined';
      }
    }
  }
  const a = document.createElement('a');
  a.href = URL.createObjectURL(data);
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 1500);
  return 'saved';
}
