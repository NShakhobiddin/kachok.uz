// Ilova bo'yicha xatolik ushlagichi: buzilgan holat (masalan, noto'g'ri zaxira fayli) ilovani "oq ekran"ga aylantirmasin.
// Foydalanuvchi qayta yuklashi, ma'lumotni tuzatishi, zaxira olishi yoki tozalab boshidan boshlashi mumkin.
import { Component, useState, type ErrorInfo, type ReactNode } from 'react';
import { saveFile } from '../lib/download';
import { repairState } from '../store/sanitize';

const KEY = 'kachok-v1';

function readStored(): { state: unknown; version?: number } | null {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as { state: unknown; version?: number }) : null;
  } catch {
    return null;
  }
}

function Fallback({ error }: { error: Error }) {
  const [msg, setMsg] = useState<string | null>(null);
  const [confirmWipe, setConfirmWipe] = useState(false);
  const reload = () => window.location.reload();
  const repair = () => {
    const stored = readStored();
    if (!stored) return setMsg('Saqlangan ma’lumot o‘qilmadi. Zaxira nusxa oling yoki tozalang.');
    try {
      localStorage.setItem(KEY, JSON.stringify({ state: repairState(stored.state), version: stored.version ?? 1 }));
      reload();
    } catch {
      setMsg('Tiklab bo‘lmadi. Zaxira nusxa oling, so‘ng tozalang.');
    }
  };
  const backup = () => {
    let raw: string | null = null;
    try {
      raw = localStorage.getItem(KEY);
    } catch {
      /* xotiraga kirish yo'q */
    }
    if (!raw) return setMsg('Qurilmada saqlangan ma’lumot yo‘q.');
    let body = raw;
    try {
      const st = (JSON.parse(raw) as { state?: Record<string, unknown> }).state ?? {};
      body = JSON.stringify({ app: 'kachok', version: 1, exportedAt: new Date().toISOString(), ...st, account: undefined, sync: undefined }, null, 1);
    } catch {
      /* JSON buzilgan — xom holicha saqlanadi */
    }
    saveFile(`kachok-zaxira-${new Date().toISOString().slice(0, 10)}.json`, new Blob([body], { type: 'application/json' }))
      .then(() => setMsg('Zaxira fayli saqlandi.'))
      .catch(() => setMsg('Fayl saqlanmadi.'));
  };
  const wipe = () => {
    try {
      localStorage.removeItem(KEY);
    } catch {
      /* xotiraga kirish yo'q */
    }
    window.location.href = import.meta.env.BASE_URL || '/';
  };
  return (
    <div className="page no-tab" role="alert" style={{ paddingTop: 'calc(var(--safe-t, 0px) + 48px)', maxWidth: 480, margin: '0 auto' }}>
      <h1 className="display display-m">Nimadir noto‘g‘ri ketdi</h1>
      <p className="muted mt-8">Ilovada xatolik yuz berdi. Ma’lumotlaringiz qurilmada saqlangan — avval qayta yuklab ko‘ring.</p>
      <div className="stack gap-8 mt-24">
        <button className="btn btn-primary btn-block" onClick={reload}>
          Qayta yuklash
        </button>
        <button className="btn btn-secondary btn-block" onClick={repair}>
          Ma’lumotlarni tiklash
        </button>
        <p className="tiny muted" style={{ padding: '0 4px' }}>
          Buzilgan yozuvlar olib tashlanadi, qolgan barcha ma’lumot saqlanadi.
        </p>
        <button className="btn btn-ghost btn-block" onClick={backup}>
          Zaxira nusxa olish (.json)
        </button>
        {confirmWipe ? (
          <div className="card stack gap-8">
            <span className="small">Barcha ma’lumotlar shu qurilmadan o‘chiriladi. Avval zaxira nusxa oling.</span>
            <div className="row gap-8">
              <button className="btn btn-secondary grow" onClick={() => setConfirmWipe(false)}>
                Bekor qilish
              </button>
              <button className="btn btn-danger grow" onClick={wipe}>
                Tozalash
              </button>
            </div>
          </div>
        ) : (
          <button className="btn btn-ghost btn-block" style={{ color: 'var(--danger)' }} onClick={() => setConfirmWipe(true)}>
            Tozalash va boshidan boshlash
          </button>
        )}
      </div>
      {msg && (
        <p className="small mt-12" role="status">
          {msg}
        </p>
      )}
      <details className="mt-24 tiny faint">
        <summary>Texnik ma’lumot</summary>
        <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{String(error?.message ?? error)}</pre>
      </details>
    </div>
  );
}

export class ErrorBoundary extends Component<{ children: ReactNode }, { error: Error | null }> {
  state: { error: Error | null } = { error: null };
  static getDerivedStateFromError(error: Error) {
    return { error };
  }
  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Kachok xatosi:', error, info.componentStack);
  }
  render() {
    return this.state.error ? <Fallback error={this.state.error} /> : this.props.children;
  }
}
