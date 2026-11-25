// Telegram ichida akkaunt: ro'yxatdan o'tish (Telegram akkaunti + ixtiyoriy raqam), bulutga saqlash va akkauntni o'chirish.
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ApiError } from '../api/client';
import { canRequestPhone, deleteCloud, fetchCloud, fmtPhone, registerCloud, requestPhone, tgProfile, waitForPhone } from '../api/cloud';
import { syncNow } from '../api/sync';
import { Logo } from '../components/Logo';
import { Icon } from '../components/ui/Icon';
import { useArmed } from '../lib/hooks';
import { useStore } from '../store/useStore';
import { timeAgo } from './Account';

const errText = (e: unknown) => (e instanceof ApiError ? e.message : 'Xatolik yuz berdi');

export default function CloudAccount() {
  const cloud = useStore((s) => s.cloud);
  const [checked, setChecked] = useState(!!cloud);
  useEffect(() => {
    fetchCloud()
      .catch(() => null)
      .finally(() => setChecked(true));
  }, []);
  if (!checked) return <p className="small muted">Tekshirilmoqda…</p>;
  return cloud ? <Registered /> : <Register />;
}

function Benefit({ children }: { children: React.ReactNode }) {
  return (
    <div className="row gap-10" style={{ alignItems: 'flex-start' }}>
      <Icon name="check" size={18} style={{ color: 'var(--accent)', flex: 'none', marginTop: 1 }} />
      <span className="small">{children}</span>
    </div>
  );
}

/** Ro'yxatdan o'tish. entry — ilovaga kirishdagi oyna (App.tsx): tugagach ilova o'zi ochiladi */
export function Register({ entry = false }: { entry?: boolean }) {
  const nav = useNavigate();
  const tg = tgProfile();
  const [busy, setBusy] = useState<'phone' | 'plain' | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const done = () => {
    if (!entry) nav(useStore.getState().profile ? '/account' : '/onboarding', { replace: true });
  };

  const withPhone = async () => {
    setBusy('phone');
    setErr(null);
    try {
      const asked = canRequestPhone();
      const shared = await requestPhone();
      // oynada "Bekor qilish" bosilsa — ro'yxatdan o'tkazmaymiz, tanlov foydalanuvchida
      if (asked && !shared) return setErr('Raqam ulashilmadi. Xohlasangiz, «Raqamsiz davom etish»ni bosing.');
      await registerCloud();
      if (shared) await waitForPhone();
      done();
    } catch (e) {
      setErr(errText(e));
    } finally {
      setBusy(null);
    }
  };
  const plain = async () => {
    setBusy('plain');
    setErr(null);
    try {
      await registerCloud();
      done();
    } catch (e) {
      setErr(errText(e));
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="stack gap-16">
      {entry ? (
        <div>
          <Logo size={30} />
          <h1 className="display mt-16">Xush kelibsiz!</h1>
          <p className="muted mt-8">Boshlash uchun ro‘yxatdan o‘ting — Telegram akkauntingiz bilan bir bosishda, parol va SMS kerak emas.</p>
        </div>
      ) : (
        <div>
          <span className="eyebrow">Akkaunt</span>
          <h1 className="display mt-4">Ro‘yxatdan o‘tish</h1>
          <p className="muted mt-8">Telegram akkauntingiz bilan bir bosishda — parol va SMS kerak emas.</p>
        </div>
      )}

      <div className="card row gap-12">
        <span className="avatar">{(tg.name || 'G')[0].toUpperCase()}</span>
        <div className="grow" style={{ minWidth: 0 }}>
          <div className="strong ellipsis">{tg.name || 'Telegram foydalanuvchisi'}</div>
          <div className="small muted">{tg.username ? `@${tg.username}` : 'Telegram akkaunti'}</div>
        </div>
      </div>

      <div className="card stack gap-10">
        <Benefit>Mashg‘ulot, vazn va ovqat yozuvlari bulutda saqlanadi — telefon almashsa ham yo‘qolmaydi</Benefit>
        <Benefit>Boshqa qurilmada GYMbos’ni Telegram’da ochsangiz — hammasi o‘zi tiklanadi</Benefit>
        <Benefit>Raqamingiz akkauntni tiklash va murabbiy bilan bog‘lanish uchun — hech kimga ko‘rsatilmaydi</Benefit>
      </div>

      <button className="btn btn-primary btn-block" disabled={!!busy} onClick={withPhone}>
        <Icon name="phone" size={18} /> {busy === 'phone' ? 'Kutilmoqda…' : 'Raqam bilan ro‘yxatdan o‘tish'}
      </button>
      <button className="btn btn-ghost btn-block" disabled={!!busy} onClick={plain}>
        {busy === 'plain' ? 'Saqlanmoqda…' : 'Raqamsiz davom etish'}
      </button>

      {err && (
        <p className="small" role="alert" style={{ color: 'var(--danger)' }}>
          {err}
        </p>
      )}
      <p className="tiny faint">
        Ro‘yxatdan o‘tish orqali Telegram ismingiz, ulashsangiz telefon raqamingiz, mashg‘ulot va tana o‘lchovlaringiz ilova xizmati uchun saqlanishiga rozilik bildirasiz. Akkauntni istalgan vaqtda o‘chirishingiz mumkin.
      </p>
    </div>
  );
}

function Registered() {
  const cloud = useStore((s) => s.cloud)!;
  const sync = useStore((s) => s.sync);
  const [busy, setBusy] = useState(false);
  const wipe = useArmed();
  const [err, setErr] = useState<string | null>(null);

  const addPhone = async () => {
    setBusy(true);
    setErr(null);
    try {
      if (await requestPhone()) {
        if (!(await waitForPhone())) setErr('Raqam hali kelmadi — birozdan keyin sahifani yangilang.');
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="stack gap-16">
      <div className="row gap-12">
        <span className="avatar">{(cloud.name || 'G')[0].toUpperCase()}</span>
        <div className="grow" style={{ minWidth: 0 }}>
          <h1 className="title ellipsis">{cloud.name || 'Akkaunt'}</h1>
          <p className="small muted num">{cloud.phone ? fmtPhone(cloud.phone) : 'Telegram orqali'}</p>
        </div>
      </div>

      {!cloud.phone && (
        <div className="card row between gap-12">
          <div className="stack" style={{ gap: 2 }}>
            <b className="small">Raqam ulanmagan</b>
            <span className="tiny muted">Akkauntni tiklash va murabbiy bilan bog‘lanish uchun</span>
          </div>
          <button className="btn btn-secondary btn-sm" disabled={busy} onClick={addPhone}>
            {busy ? 'Kutilmoqda…' : 'Ulash'}
          </button>
        </div>
      )}

      <div className="card stack gap-12">
        <div className="row between">
          <span className="row gap-8 strong">
            <Icon name="refresh" size={18} /> Bulutga saqlash
          </span>
          <span className="small" style={{ color: sync.status === 'error' ? 'var(--danger)' : sync.status === 'syncing' ? 'var(--blue-2)' : 'var(--green)' }} role="status">
            {sync.status === 'syncing' ? 'Sinxronlanmoqda...' : sync.status === 'error' ? 'Ulanmadi' : sync.lastSyncAt ? `${timeAgo(sync.lastSyncAt)} saqlandi` : 'Kutilmoqda'}
          </span>
        </div>
        {sync.status === 'error' && <p className="small muted">{sync.error}. Internet tiklanganda o‘zi qayta urinadi.</p>}
        <p className="small muted">Mashg‘ulotlar avval telefonga, internet bo‘lsa bulutga ham yoziladi. Boshqa qurilmada GYMbos’ni shu Telegram akkaunt bilan ochsangiz — hammasi qaytadi.</p>
        <button className="btn btn-secondary btn-sm" style={{ alignSelf: 'flex-start' }} disabled={sync.status === 'syncing'} onClick={() => syncNow()}>
          Hozir sinxronlash
        </button>
      </div>

      {err && (
        <p className="small" role="alert" style={{ color: 'var(--danger)' }}>
          {err}
        </p>
      )}

      <button
        className="small muted"
        style={{ textAlign: 'left', color: wipe.armed ? 'var(--danger)' : undefined }}
        disabled={busy}
        onClick={async () => {
          if (!wipe.armed) return wipe.arm();
          if (!wipe.ready()) return;
          setBusy(true);
          try {
            await deleteCloud();
          } catch (e) {
            setErr(errText(e));
          } finally {
            setBusy(false);
            wipe.disarm();
          }
        }}
      >
        {wipe.armed ? 'Rostdan o‘chirilsinmi? Bulutdagi ma’lumotlar, do‘stlar va lenta o‘chadi (telefondagilari qoladi) — bosing' : 'Akkauntni o‘chirish'}
      </button>
    </div>
  );
}
