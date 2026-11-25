// Ulashish oynasi: tayyor rasm-kartochka ko'rinadi; "Ulashish" (rasm bilan) yoki "Telegram'da yuborish" (matn + havola).
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiEnabled } from '../api/client';
import { postCard } from '../api/social';
import { useStore } from '../store/useStore';
import { appUrl, canShareFiles, saveImage, shareImage, telegramShare } from '../lib/share';
import { renderCard, type CardData } from '../lib/shareCard';
import { Icon } from './ui/Icon';
import { Sheet } from './ui/Sheet';

/** feedId berilsa — kirgan foydalanuvchi uchun «Do'stlar lentasiga» tugmasi (shu id bilan qayta yuborilsa yangilanadi) */
export function ShareSheet({ open, onClose, card, text, filename, feedId }: { open: boolean; onClose: () => void; card: CardData; text: string; filename: string; feedId?: string }) {
  const account = useStore((s) => s.account);
  const [feed, setFeed] = useState<'idle' | 'busy' | 'done' | 'error'>('idle');
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
        {feedId && apiEnabled && account && (
          <div className="row gap-8">
            <button
              className="btn btn-secondary grow"
              disabled={feed === 'busy' || feed === 'done'}
              onClick={async () => {
                setFeed('busy');
                try {
                  await postCard(feedId, card);
                  setFeed('done');
                } catch {
                  setFeed('error');
                }
              }}
            >
              <Icon name={feed === 'done' ? 'check' : 'users'} size={18} /> {feed === 'done' ? 'Lentaga joylandi' : feed === 'error' ? 'Qayta urinish' : 'Do‘stlar lentasiga'}
            </button>
            {feed === 'done' && (
              <Link to="/friends" className="btn btn-ghost">
                Lenta
              </Link>
            )}
          </div>
        )}
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
