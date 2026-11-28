// Ilova bo‘ylab ikki xabar:
// 1) do‘stlik taklifi havolasi bilan kirilgan — avval so‘raladi (havolani ochgan odam o‘zi bilmay do‘st bo‘lib qolmasin);
// 2) telefon xotirasi to‘lgan — o‘zgarishlar saqlanmayapti, zaxira nusxa olish taklif qilinadi.
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { acceptPendingFriend, declinePendingFriend, pendingFriend, socialReady } from '../api/social';
import { useStore } from '../store/useStore';
import { Icon } from './ui/Icon';
import { Sheet } from './ui/Sheet';

export function FriendInvitePrompt() {
  // kirish holati o‘zgarsa (ro‘yxatdan o‘tdi) — qayta tekshiriladi
  const signedIn = useStore((s) => !!s.cloud || !!s.account);
  const [code, setCode] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [added, setAdded] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  useEffect(() => {
    setCode(socialReady() ? pendingFriend() : null);
  }, [signedIn]);
  const close = () => {
    setCode(null);
    setAdded(null);
  };
  return (
    <Sheet open={!!code || !!added} onClose={() => (added ? close() : (declinePendingFriend(), close()))} label="Do‘stlik taklifi">
      {added ? (
        <div className="stack gap-12">
          <h3 className="title">«{added}» do‘stlaringizga qo‘shildi</h3>
          <p className="small muted">Endi bir-biringizning mashg‘ulot natijalarini «Do‘stlar» bo‘limida ko‘rasiz.</p>
          <Link to="/friends" className="btn btn-primary btn-block" onClick={close}>
            Do‘stlarga o‘tish
          </Link>
        </div>
      ) : (
        <div className="stack gap-12">
          <h3 className="title">Do‘stlik taklifi</h3>
          <p className="small muted">
            Siz do‘stingiz yuborgan havola orqali kirdingiz. Qo‘shsangiz, bir-biringizning mashg‘ulot natijalarini ko‘rasiz. Telefon raqamingiz hech kimga ko‘rinmaydi.
          </p>
          {err && (
            <p className="small" role="alert" style={{ color: 'var(--red)' }}>
              {err}
            </p>
          )}
          <button
            className="btn btn-primary btn-block"
            disabled={busy}
            onClick={async () => {
              setBusy(true);
              setErr(null);
              const name = await acceptPendingFriend();
              setBusy(false);
              if (name) {
                setCode(null);
                setAdded(name);
              } else if (pendingFriend()) setErr('Hozir qo‘shib bo‘lmadi — internetni tekshirib, qayta urinib ko‘ring.');
              else close();
            }}
          >
            <Icon name="users" size={18} /> {busy ? 'Qo‘shilmoqda…' : 'Do‘st qo‘shish'}
          </button>
          <button
            className="btn btn-ghost btn-block"
            onClick={() => {
              declinePendingFriend();
              close();
            }}
          >
            Kerak emas
          </button>
        </div>
      )}
    </Sheet>
  );
}

export function StorageWarning() {
  const [full, setFull] = useState(false);
  useEffect(() => {
    const on = () => setFull(true);
    window.addEventListener('kachok:storage-full', on);
    return () => window.removeEventListener('kachok:storage-full', on);
  }, []);
  if (!full) return null;
  return (
    <div className="notice warn small" role="alert" style={{ position: 'fixed', left: 12, right: 12, top: 'calc(var(--safe-t, 0px) + 10px)', zIndex: 60 }}>
      <Icon name="alert" size={18} />
      <span className="grow">
        <b>Telefon xotirasi to‘ldi</b> — oxirgi o‘zgarishlar saqlanmadi. <Link to="/profile">Profil</Link> → «Zaxira nusxa olish», so‘ng eski yozuvlarni o‘chiring.
      </span>
      <button className="icon-btn" style={{ width: 32, height: 32 }} onClick={() => setFull(false)} aria-label="Yopish">
        <Icon name="x" size={16} />
      </button>
    </div>
  );
}
