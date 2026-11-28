// Kachok API bilan ishlash: tokenlarni avtomatik yangilaydi, xatolarni tushunarli matnga aylantiradi.
import { useStore, type Account, type Entitlements } from '../store/useStore';

const BASE = (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/$/, '');

/** Server manzili sozlanganmi (ko'rgazma va oflayn rejimda — yo'q) */
export const apiEnabled = !!BASE;

export class ApiError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string,
  ) {
    super(message);
  }
}

let refreshing: Promise<boolean> | null = null;

async function refreshTokens(): Promise<boolean> {
  const acc = useStore.getState().account;
  if (!acc) return false;
  refreshing ??= (async () => {
    try {
      const r = await fetch(`${BASE}/auth/refresh`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ refresh: acc.refresh }) });
      if (r.status === 401) {
        // sessiya tugagan — chiqamiz, qurilmadagi ma'lumotlar qoladi
        useStore.getState().setAccount(null);
        return false;
      }
      if (!r.ok) return false;
      const j = (await r.json()) as { access: string; refresh: string; user: Account['user'] };
      useStore.getState().patchAccount({ access: j.access, refresh: j.refresh, user: j.user });
      return true;
    } catch {
      return false;
    } finally {
      setTimeout(() => (refreshing = null), 0);
    }
  })();
  return refreshing;
}

export async function api<T>(path: string, opts: { method?: string; body?: unknown; auth?: boolean } = {}): Promise<T> {
  if (!BASE) throw new ApiError(0, 'no_api', 'Server ulanmagan');
  const auth = opts.auth ?? true;
  const send = () => {
    const token = useStore.getState().account?.access;
    // osilib qolgan so'rov sinxronni butunlay to'xtatib qo'ymasin — 30 soniyada uziladi
    const ctl = typeof AbortController !== 'undefined' ? new AbortController() : null;
    const timer = ctl ? setTimeout(() => ctl.abort(), 30_000) : null;
    return fetch(`${BASE}${path}`, {
      method: opts.method ?? (opts.body === undefined ? 'GET' : 'POST'),
      headers: { 'content-type': 'application/json', ...(auth && token ? { authorization: `Bearer ${token}` } : {}) },
      body: opts.body === undefined ? undefined : JSON.stringify(opts.body),
      signal: ctl?.signal,
    }).finally(() => timer && clearTimeout(timer));
  };
  let res: Response;
  try {
    res = await send();
    if (res.status === 401 && auth && (await refreshTokens())) res = await send();
  } catch {
    throw new ApiError(0, 'offline', "Internet yo‘q. Ulanish tiklangach qayta urinib ko‘ring.");
  }
  const data = (await res.json().catch(() => ({}))) as { error?: string; message?: string };
  if (!res.ok) throw new ApiError(res.status, data.error ?? 'error', data.message ?? 'Xatolik yuz berdi');
  return data as T;
}

export interface MeResponse {
  user: Account['user'];
  entitlements: Entitlements;
  coach: { id: string; name: string } | null;
}

/** Profil, obuna va murabbiy holatini yangilash */
export async function refreshMe() {
  const uid = useStore.getState().account?.user.id;
  if (!uid) return null;
  const me = await api<MeResponse>('/me');
  // so'rov davomida akkaunt almashgan bo'lsa — eski foydalanuvchi ma'lumoti yangisiga yozilmaydi
  if (useStore.getState().account?.user.id !== uid) return null;
  useStore.getState().patchAccount({ user: me.user, entitlements: me.entitlements, coach: me.coach });
  return me;
}
