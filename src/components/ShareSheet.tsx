// Ulashish oynasi: tayyor rasm-kartochka ko'rinadi; "Ulashish" (rasm bilan) yoki "Telegram'da yuborish" (matn + havola).
import { useEffect, useState } from 'react';
import { appUrl, canShareFiles, saveImage, shareImage, telegramShare } from '../lib/share';
import { renderCard, type CardData } from '../lib/shareCard';
import { Icon } from './ui/Icon';
import { Sheet } from './ui/Sheet';

export function ShareSheet({ open, onClose, card, text, filename }: { open: boolean; onClose: () => void; card: CardData; text: string; filename: string }) {
  const [img, setImg] = useState<{ blob: Blob; url: string } | null>(null);
  const [failed, setFailed] = useState(false);
  const files = canShareFiles();
  const fullText = `${text}\n${appUrl()}`;
  useEffect(() => {
    if (!open) return;
    let url = '';
    let alive = true;
    setFailed(false);
    renderCard(card, appUrl())
      .then((blob) => {
        if (!alive) return;
        url = URL.createObjectURL(blob);
        setImg({ blob, url });
      })
      .catch(() => alive && setFailed(true));
    return () => {
      alive = false;
      if (url) URL.revokeObjectURL(url);
      setImg(null);
    };
    // kartochka mazmuni ochilgan paytdagisi
  }, [open]);
  return (
    <Sheet open={open} onClose={onClose} label="Ulashish">
      <div className="stack gap-12">
        <h3 className="title">Do‘stlar bilan ulashish</h3>
        <div className="share-preview">{img ? <img src={img.url} alt="Ulashiladigan rasm" /> : <span className="small muted">{failed ? 'Rasm yaratilmadi — matn bilan ulashing' : 'Rasm tayyorlanmoqda…'}</span>}</div>
        {files && img ? (
          <>
            <button className="btn btn-primary btn-block" onClick={() => shareImage(img.blob, fullText, filename)}>
              <Icon name="share" size={18} /> Ulashish
            </button>
            <button className="btn btn-ghost btn-block" onClick={() => telegramShare(text)}>
              Telegram’da matn bilan yuborish
            </button>
          </>
        ) : (
          <>
            <button className="btn btn-primary btn-block" onClick={() => telegramShare(text)}>
              <Icon name="share" size={18} /> Telegram’da yuborish
            </button>
            {img && (
              <button className="btn btn-ghost btn-block" onClick={() => saveImage(img.blob, filename)}>
                <Icon name="download" size={18} /> Rasmni saqlash
              </button>
            )}
          </>
        )}
      </div>
    </Sheet>
  );
}
