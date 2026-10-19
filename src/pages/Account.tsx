// Akkaunt: telefon raqam orqali kirish, bulutga sinxronlash, murabbiyga ulanish.
import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Icon } from '../components/ui/Icon';
import { Sheet } from '../components/ui/Sheet';
import { Toggle } from '../components/ui/controls';
import { api, ApiError, apiEnabled, refreshMe } from '../api/client';
import { syncNow } from '../api/sync';
import { BILLING } from '../lib/features';
import { fmtDate } from '../lib/date';
import { useStore, type Account as Acc } from '../store/useStore';

export default function Account() {
  const account = useStore((s) => s.account);
  if (!apiEnabled)
    return (
      <Shell>
        <div className="card empty">Bu versiyada akkaunt yo‘q — ma’lumotlar faqat shu qurilmada saqlanadi.</div>
      </Shell>
    );
  return <Shell>{account ? <Signed account={account} /> : <Login />}</Shell>;
}

function Shell({ children }: { children: React.ReactNode }) {
  const nav = useNavigate();
  return (
    <div className="page">
      <div className="back-bar">
        <button className="icon-btn" onClick={() => (window.history.length > 1 ? nav(-1) : nav('/'))} aria-label="Orqaga">
          <Icon name="left" />
        </button>
      </div>
      {children}
    </div>
  );
}

const errText = (e: unknown) => (e instanceof ApiError ? e.message : 'Xatolik yuz berdi');

/** 901234567 → "90 123 45 67" */
function fmtLocal(d: string) {
  return [d.slice(0, 2), d.slice(2, 5), d.slice(5, 7), d.slice(7, 9)].filter(Boolean).join(' ');
}

function Login() {
  const nav = useNavigate();
  const setAccount = useStore((s) => s.setAccount);
  const [digits, setDigits] = useState('');
  const [stage, setStage] = useState<'phone' | 'code'>('phone');
  const [code, setCode] = useState('');
  const [devCode, setDevCode] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [wait, setWait] = useState(0);
  const codeRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (wait <= 0) return;
    const t = setTimeout(() => setWait(wait - 1), 1000);
    return () => clearTimeout(t);
  }, [wait]);

  const send = async () => {
    setBusy(true);
    setErr(null);
    try {
      const r = await api<{ devCode?: string }>('/auth/otp', { body: { phone: '998' + digits }, auth: false });
      setDevCode(r.devCode ?? null);
      setStage('code');
      setCode('');
      setWait(60);
      setTimeout(() => codeRef.current?.focus(), 50);
    } catch (e) {
      setErr(errText(e));
    } finally {
      setBusy(false);
    }
  };

  const verify = async (c: string) => {
    setBusy(true);
    setErr(null);
    try {
      const r = await api<{ access: string; refresh: string; user: Acc['user']; isNew: boolean }>('/auth/verify', { body: { phone: '998' + digits, code: c }, auth: false });
      setAccount({ access: r.access, refresh: r.refresh, user: r.user });
      // yangi akkauntga qurilmadagi ismni beramiz
      const localName = useStore.getState().profile?.name;
      if (!r.user.name && localName) {
        const p = await api<{ user: Acc['user']; access: string }>('/me', { method: 'PATCH', body: { name: localName } }).catch(() => null);
        if (p) useStore.getState().patchAccount({ user: p.user, access: p.access });
      }
      await syncNow();
      await refreshMe().catch(() => null);
      nav(useStore.getState().profile ? '/account' : '/onboarding', { replace: true });
    } catch (e) {
      setErr(errText(e));
      setCode('');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="stack gap-16">
      <div>
        <span className="eyebrow">Akkaunt</span>
        <h1 className="display mt-4">{stage === 'phone' ? 'Kirish' : 'SMS kod'}</h1>
        <p className="muted mt-8">
          {stage === 'phone' ? (
            'Telefon raqamingiz bilan kiring: mashg‘ulotlar bulutda saqlanadi, telefon almashsa ham yo‘qolmaydi va murabbiyingiz natijalaringizni ko‘ra oladi.'
          ) : (
            <>
              <b>+998 {fmtLocal(digits)}</b> raqamiga 6 xonali kod yuborildi.
            </>
          )}
        </p>
      </div>

      {stage === 'phone' ? (
        <form
          className="stack gap-12"
          onSubmit={(e) => {
            e.preventDefault();
            if (digits.length === 9 && !busy) void send();
          }}
        >
          <label className="field">
            <span className="small muted">Telefon raqam</span>
            <div className="row gap-8 input" style={{ padding: 0, paddingLeft: 14 }}>
              <span className="strong num">+998</span>
              <input
                className="grow num"
                style={{ background: 'transparent', border: 0, outline: 0, height: 52, fontSize: 18, color: 'inherit', minWidth: 0 }}
                inputMode="tel"
                autoComplete="tel-national"
                placeholder="90 123 45 67"
                aria-label="Telefon raqam"
                value={fmtLocal(digits)}
                onChange={(e) => {
                  let d = e.target.value.replace(/\D/g, '');
                  if (d.length > 9 && d.startsWith('998')) d = d.slice(3);
                  setDigits(d.slice(0, 9));
                }}
              />
            </div>
          </label>
          <button className="btn btn-primary btn-block" disabled={digits.length !== 9 || busy}>
            {busy ? 'Yuborilmoqda...' : 'Kod olish'}
          </button>
        </form>
      ) : (
        <div className="stack gap-12">
          <input
            ref={codeRef}
            className="input mono"
            style={{ fontSize: 30, letterSpacing: '0.4em', textAlign: 'center', height: 64 }}
            inputMode="numeric"
            autoComplete="one-time-code"
            aria-label="SMS kod"
            placeholder="••••••"
            value={code}
            disabled={busy}
            onChange={(e) => {
              const c = e.target.value.replace(/\D/g, '').slice(0, 6);
              setCode(c);
              if (c.length === 6) void verify(c);
            }}
          />
          {devCode && (
            <div className="notice info">
              <Icon name="info" />
              <span>
                Sinov rejimi (SMS ulanmagan): kod — <b className="mono">{devCode}</b>
              </span>
            </div>
          )}
          <button className="btn btn-primary btn-block" disabled={code.length !== 6 || busy} onClick={() => verify(code)}>
            {busy ? 'Tekshirilmoqda...' : 'Tasdiqlash'}
          </button>
          <div className="row between small">
            <button className="strong" style={{ color: 'var(--text-2)' }} onClick={() => setStage('phone')}>
              Raqamni o‘zgartirish
            </button>
            <button className="strong" style={{ color: wait ? 'var(--text-3)' : 'var(--blue-2)' }} disabled={wait > 0 || busy} onClick={send}>
              {wait ? `Qayta yuborish · ${wait}s` : 'Qayta yuborish'}
            </button>
          </div>
        </div>
      )}

      {err && (
        <p className="small" role="alert" style={{ color: 'var(--danger)' }}>
          {err}
        </p>
      )}
      <p className="tiny faint">
        Kirish orqali shaxsiy ma’lumotlaringiz (raqam, mashg‘ulot va tana o‘lchovlari) ilova xizmati uchun saqlanishiga rozilik bildirasiz. Akkauntni istalgan vaqtda o‘chirishingiz mumkin.
      </p>
    </div>
  );
}

function Signed({ account }: { account: Acc }) {
  const nav = useNavigate();
  const sync = useStore((s) => s.sync);
  const patchAccount = useStore((s) => s.patchAccount);
  const setAccount = useStore((s) => s.setAccount);
  const reset = useStore((s) => s.reset);
  const [name, setName] = useState(account.user.name);
  const [code, setCode] = useState('');
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const [sheet, setSheet] = useState<'logout' | 'delete' | 'unlink' | null>(null);
  const ent = account.entitlements;
  const isCoach = account.user.role === 'coach';

  useEffect(() => {
    refreshMe().catch(() => null);
  }, []);

  const run = async (fn: () => Promise<void>, ok?: string) => {
    setBusy(true);
    setMsg(null);
    try {
      await fn();
      if (ok) setMsg({ ok: true, text: ok });
    } catch (e) {
      setMsg({ ok: false, text: errText(e) });
    } finally {
      setBusy(false);
    }
  };

  const patchMe = (body: { name?: string; role?: 'athlete' | 'coach' }) =>
    run(async () => {
      const r = await api<{ user: Acc['user']; access: string }>('/me', { method: 'PATCH', body });
      patchAccount({ user: r.user, access: r.access });
    });

  const logout = async (wipe: boolean) => {
    if (wipe) await syncNow();
    await api('/auth/logout', { body: { refresh: account.refresh }, auth: false }).catch(() => null);
    if (wipe) {
      reset();
      nav('/onboarding', { replace: true });
    } else {
      setAccount(null);
      setSheet(null);
    }
  };

  return (
    <div className="stack gap-16">
      <div className="row gap-16">
        <span style={{ width: 64, height: 64, borderRadius: 20, background: 'var(--plate-blue)', display: 'grid', placeItems: 'center', fontSize: 28, fontWeight: 800, color: '#fff' }}>
          {(account.user.name || 'K')[0].toUpperCase()}
        </span>
        <div style={{ minWidth: 0 }}>
          <h1 className="display display-m ellipsis">{account.user.name || 'Akkaunt'}</h1>
          <p className="small muted num">+{account.user.phone.replace(/^(998)(\d{2})(\d{3})(\d{2})(\d{2})$/, '$1 $2 $3 $4 $5')}</p>
        </div>
      </div>

      {/* Sinxronlash */}
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
        <p className="small muted">Mashg‘ulotlar avval telefonga, internet bo‘lsa bulutga ham yoziladi. Boshqa telefonda shu raqam bilan kirsangiz hammasi qaytadi.</p>
        <button className="btn btn-secondary btn-sm" style={{ alignSelf: 'flex-start' }} disabled={sync.status === 'syncing'} onClick={() => syncNow()}>
          Hozir sinxronlash
        </button>
      </div>

      {/* Ism */}
      <div className="card stack gap-12">
        <label className="field">
          <span className="small muted">Ism (murabbiy va mijozlarga ko‘rinadi)</span>
          <div className="row gap-8">
            <input className="input grow" value={name} maxLength={60} onChange={(e) => setName(e.target.value)} placeholder="Ismingiz" />
            <button className="btn btn-secondary" disabled={busy || name.trim() === account.user.name} onClick={() => patchMe({ name: name.trim() })}>
              Saqlash
            </button>
          </div>
        </label>
      </div>

      {/* Pro */}
      {BILLING && (
        <Link to="/premium" className="card row gap-12" style={{ color: 'inherit', borderColor: ent?.pro.active ? 'rgba(255, 200, 61, 0.35)' : undefined }}>
          <Icon name="spark" size={22} style={{ color: 'var(--yellow)' }} />
          <div className="grow">
            <div className="strong">{ent?.pro.active ? (ent.pro.trial ? 'Pro — sinov muddati' : 'Pro faol') : 'Pro tarif'}</div>
            <div className="small muted">{ent?.pro.active && ent.pro.until ? `${fmtDate(ent.pro.until, true)} gacha` : 'PDF, ovqat rejasi va boshqalar'}</div>
          </div>
          <Icon name="right" size={16} style={{ color: 'var(--text-3)' }} />
        </Link>
      )}

      {/* Murabbiy */}
      <section className="stack gap-8">
        <div className="eyebrow">Murabbiy</div>
        {account.coach ? (
          <div className="card row gap-12">
            <Icon name="user" size={22} style={{ color: 'var(--blue-2)' }} />
            <div className="grow">
              <div className="strong">{account.coach.name || 'Murabbiy'}</div>
              <div className="small muted">mashg‘ulot va natijalaringizni ko‘radi, dastur yuborishi mumkin</div>
            </div>
            <button className="btn btn-ghost btn-xs" onClick={() => setSheet('unlink')}>
              Uzish
            </button>
          </div>
        ) : (
          <form
            className="card stack gap-12"
            onSubmit={(e) => {
              e.preventDefault();
              void run(async () => {
                await api('/coach/join', { body: { code: code.trim().toUpperCase() } });
                setCode('');
                await refreshMe();
              }, 'Murabbiyga ulandingiz');
            }}
          >
            <p className="small muted">Murabbiyingiz bergan 6 belgili kodni kiriting. U mashg‘ulotlaringizni ko‘radi va dastur yubora oladi.</p>
            <div className="row gap-8">
              <input
                className="input grow mono"
                style={{ textTransform: 'uppercase', letterSpacing: '0.2em' }}
                maxLength={6}
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/[^a-z0-9]/gi, ''))}
                placeholder="KOD"
                aria-label="Murabbiy kodi"
              />
              <button className="btn btn-primary" disabled={code.length !== 6 || busy}>
                Ulanish
              </button>
            </div>
          </form>
        )}

        <div className="card stack gap-12">
          <label className="row between">
            <span>
              <span className="strong">Men murabbiyman</span>
              <span className="small muted" style={{ display: 'block' }}>
                Mijozlar qo‘shish, ularga dastur yozish va natijasini kuzatish
              </span>
            </span>
            <Toggle on={isCoach} onChange={(v) => patchMe({ role: v ? 'coach' : 'athlete' })} label="Murabbiy rejimi" />
          </label>
          {isCoach && (
            <Link to="/coach" className="btn btn-secondary btn-block">
              <Icon name="list" size={18} /> Mijozlarim
            </Link>
          )}
        </div>
      </section>

      {msg && (
        <p className="small" role="status" style={{ color: msg.ok ? 'var(--green)' : 'var(--danger)' }}>
          {msg.text}
        </p>
      )}

      <div className="stack gap-8 mt-8">
        <button className="btn btn-secondary btn-block" onClick={() => setSheet('logout')}>
          Chiqish
        </button>
        <button className="btn btn-ghost btn-block" style={{ color: 'var(--danger)' }} onClick={() => setSheet('delete')}>
          Akkauntni o‘chirish
        </button>
      </div>

      <Sheet open={sheet === 'logout'} onClose={() => setSheet(null)} label="Chiqish">
        <h3 className="title">Akkauntdan chiqasizmi?</h3>
        <p className="muted mt-8">Bulutdagi nusxa saqlanib qoladi. Bu telefonda ma’lumotlar qolsinmi?</p>
        <div className="stack gap-8 mt-16">
          <button className="btn btn-secondary btn-block" onClick={() => logout(false)}>
            Chiqish, telefonda qolsin
          </button>
          <button className="btn btn-danger btn-block" onClick={() => logout(true)}>
            Chiqish va telefondan o‘chirish
          </button>
        </div>
      </Sheet>

      <Sheet open={sheet === 'unlink'} onClose={() => setSheet(null)} label="Murabbiydan uzish">
        <h3 className="title">Murabbiydan uzilasizmi?</h3>
        <p className="muted mt-8">U endi natijalaringizni ko‘rmaydi. Yuborgan dasturi telefoningizda qoladi.</p>
        <div className="row gap-8 mt-16">
          <button className="btn btn-secondary grow" onClick={() => setSheet(null)}>
            Bekor qilish
          </button>
          <button
            className="btn btn-danger grow"
            onClick={() =>
              run(async () => {
                await api('/coach/link', { method: 'DELETE' });
                await refreshMe();
                setSheet(null);
              })
            }
          >
            Uzish
          </button>
        </div>
      </Sheet>

      <Sheet open={sheet === 'delete'} onClose={() => setSheet(null)} label="Akkauntni o‘chirish">
        <h3 className="title">Akkaunt butunlay o‘chirilsinmi?</h3>
        <p className="muted mt-8">Bulutdagi barcha ma’lumotlar, murabbiy bog‘lanishlari va obuna serverdan o‘chiriladi. Telefondagi nusxa qoladi. Buni qaytarib bo‘lmaydi.</p>
        <div className="row gap-8 mt-16">
          <button className="btn btn-secondary grow" onClick={() => setSheet(null)}>
            Bekor qilish
          </button>
          <button
            className="btn btn-danger grow"
            disabled={busy}
            onClick={() =>
              run(async () => {
                await api('/me', { method: 'DELETE' });
                setAccount(null);
                setSheet(null);
              })
            }
          >
            O‘chirish
          </button>
        </div>
      </Sheet>
    </div>
  );
}

export function timeAgo(t: number) {
  const s = Math.round((Date.now() - t) / 1000);
  if (s < 60) return 'hozirgina';
  if (s < 3600) return `${Math.floor(s / 60)} daqiqa oldin`;
  if (s < 86400) return `${Math.floor(s / 3600)} soat oldin`;
  return `${Math.floor(s / 86400)} kun oldin`;
}
