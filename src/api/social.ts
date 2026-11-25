// Do'stlar va lenta: taklif kodi, do'st qo'shish, lenta va "💪".
// Ikki xil server: Telegram Serverless (tgcloud/ — ilova app<id>.tgcloud.ai da, Telegram ichida; kirish shart emas)
// yoki o'z API serverimiz (server/ — VITE_API_URL, akkaunt bilan).
import type { CardData } from '../lib/shareCard';
import { telegram } from '../lib/telegram';
import { useStore, type Account } from '../store/useStore';
import { api, apiEnabled, refreshMe } from './client';
import { scall, serverless, tgInitData } from './serverless';
export { serverless, tgInitData };
import { syncNow } from './sync';

type WorkoutCard = Omit<Extract<CardData, { kind: 'workout' }>, 'kind'>;
type WeekCard = Omit<Extract<CardData, { kind: 'week' }>, 'kind'>;

export interface FeedPost {
  id: string;
  kind: 'workout' | 'week';
  data: WorkoutCard | WeekCard;
  created_at: string;
  author_id: string;
  author: string;
  own: boolean;
  kudos: number;
  kudoed: boolean;
}

export interface Friend {
  id: string;
  name: string;
  since: string;
  last_post: string | null;
}

/** Telegram bot manzili (taklif havolasi uchun): VITE_TG_BOT — bot nomi, VITE_TG_APP — Mini App qisqa nomi (bo'lsa) */
const TG_BOT = (import.meta.env.VITE_TG_BOT as string | undefined)?.replace(/^@/, '');
const TG_APP = import.meta.env.VITE_TG_APP as string | undefined;

export const canTelegramLogin = () => apiEnabled && tgInitData().length > 0;

/** Lentadan foydalanish mumkin: Serverless yoki kirilgan akkaunt */
export const socialReady = () => serverless() || (apiEnabled && !!useStore.getState().account);

/** Telegram ichida bir bosishda kirish (SMS kerak emas) */
export async function telegramLogin() {
  const r = await api<{
    access: string;
    refresh: string;
    user: Account['user'];
    isNew: boolean;
  }>('/auth/telegram', { body: { initData: tgInitData() }, auth: false });
  useStore.getState().setAccount({ access: r.access, refresh: r.refresh, user: r.user });
  // Telegram'da ism bo'lmasa — qurilmadagi profil ismi
  const localName = useStore.getState().profile?.name;
  if (!r.user.name && localName) {
    const p = await api<{ user: Account['user']; access: string }>('/me', {
      method: 'PATCH',
      body: { name: localName },
    }).catch(() => null);
    if (p) useStore.getState().patchAccount({ user: p.user, access: p.access });
  }
  await syncNow().catch(() => null);
  await refreshMe().catch(() => null);
  await acceptPendingFriend();
  return r;
}

/** Taklif kodi va havolasi */
export async function getFriendCode(): Promise<{ code: string; invite: string }> {
  if (serverless()) {
    const r = await scall<{ code: string; invite: string | null }>('friendCode');
    return { code: r.code, invite: r.invite ?? inviteLink(r.code) };
  }
  const { code } = await api<{ code: string }>('/social/code');
  return { code, invite: inviteLink(code) };
}
export const listFriends = () => (serverless() ? scall<{ friends: Friend[] }>('friends') : api<{ friends: Friend[] }>('/social/friends')).then((r) => r.friends);
export const addFriend = (code: string) =>
  (serverless() ? scall<{ friend: { id: string; name: string } }>('friendAdd', { code }) : api<{ friend: { id: string; name: string } }>('/social/friends', { body: { code } })).then((r) => r.friend);
export const removeFriend = (id: string) => (serverless() ? scall('friendRemove', { id }) : api(`/social/friends/${id}`, { method: 'DELETE' }));
export const getFeed = (before?: string) =>
  serverless()
    ? scall<{ posts: FeedPost[]; more: boolean }>('feed', before ? { before } : {})
    : api<{ posts: FeedPost[]; more: boolean }>(`/social/feed${before ? `?before=${encodeURIComponent(before)}` : ''}`);
export const setKudos = (id: string, on: boolean) => (serverless() ? scall('kudos', { id, on }) : api(`/social/posts/${id}/kudos`, { method: on ? 'PUT' : 'DELETE' }));
export const deletePost = (id: string) => (serverless() ? scall('postDelete', { id }) : api(`/social/posts/${id}`, { method: 'DELETE' }));
/** Serverless: lentadagi barcha ma'lumotlarimni o'chirish (akkaunt serverida — Akkaunt sahifasida) */
export const deleteSocialData = () => scall('socialDelete');

/** Natijani lentaga joylash (shu mashg'ulot/hafta qayta yuborilsa — yangilanadi) */
export function postCard(clientId: string, card: CardData) {
  const { kind, ...data } = card;
  return serverless() ? scall<{ id: string }>('postSave', { kind, clientId, data }) : api<{ id: string }>('/social/posts', { body: { kind, clientId, data } });
}

/** Tugagan mashg'ulot avtomatik lentaga (kirgan va sozlamada o'chirilmagan bo'lsa); bir mashg'ulot — bir marta */
const POSTED_KEY = 'gymbos-posted';
export async function autoPostWorkout(logId: string, card: CardData): Promise<boolean> {
  const st = useStore.getState();
  if (!socialReady() || st.settings.feedShare === false) return false;
  let posted: string[] = [];
  try {
    posted = JSON.parse(localStorage.getItem(POSTED_KEY) ?? '[]');
  } catch {
    /* bo'sh */
  }
  if (posted.includes(logId)) return true;
  await postCard(logId, card);
  try {
    localStorage.setItem(POSTED_KEY, JSON.stringify([...posted, logId].slice(-200)));
  } catch {
    /* saqlanmasa — keyingi safar server baribir yangilaydi */
  }
  return true;
}

/** Serverda qaysi kirish usullari yoqilgan (SMS o'chiq bo'lsa — faqat Telegram) */
let methods: Promise<{ sms: boolean; telegram: boolean }> | null = null;
export function loginMethods() {
  methods ??= api<{ sms: boolean; telegram: boolean }>('/auth/methods', {
    auth: false,
  }).catch((e) => {
    methods = null;
    throw e;
  });
  return methods;
}

/** Ilovani Telegram'da ochish havolasi (bot sozlangan bo'lsa) */
export const botLink = (): string | null => (TG_BOT ? (TG_APP ? `https://t.me/${TG_BOT}/${TG_APP}` : `https://t.me/${TG_BOT}?startapp`) : null);

/** Taklif havolasi: Telegram bot sozlangan bo'lsa — Mini App ochiladi, aks holda sayt */
export function inviteLink(code: string): string {
  if (TG_BOT) return TG_APP ? `https://t.me/${TG_BOT}/${TG_APP}?startapp=f_${code}` : `https://t.me/${TG_BOT}?startapp=f_${code}`;
  const u = new URL(import.meta.env.BASE_URL || '/', location.origin);
  u.searchParams.set('friend', code);
  return u.href;
}

/** Ilova taklif havolasi bilan ochilganda kodni eslab qolish (kirgandan keyin do'st qo'shiladi) */
const PENDING_KEY = 'gymbos-pending-friend';
export function capturePendingFriend() {
  try {
    const fromUrl = new URLSearchParams(location.search).get('friend');
    const start = (telegram() as unknown as { initDataUnsafe?: { start_param?: string } } | undefined)?.initDataUnsafe?.start_param;
    const code = fromUrl ?? (start?.startsWith('f_') ? start.slice(2) : null);
    if (code && /^[A-Za-z0-9]{6,12}$/.test(code)) localStorage.setItem(PENDING_KEY, code.toUpperCase());
  } catch {
    /* localStorage yo'q */
  }
}
export const pendingFriend = (): string | null => {
  try {
    return localStorage.getItem(PENDING_KEY);
  } catch {
    return null;
  }
};

const ADDED_KEY = 'gymbos-friend-added';
/** Taklif orqali qo'shilgan do'st ismi (bir marta o'qiladi) */
export function takeAddedFriend(): string | null {
  try {
    const n = sessionStorage.getItem(ADDED_KEY);
    sessionStorage.removeItem(ADDED_KEY);
    return n;
  } catch {
    return null;
  }
}

/** Kutilayotgan taklifni qabul qilish (kirgan bo'lsa); qo'shilgan do'st ismi */
export async function acceptPendingFriend(): Promise<string | null> {
  const code = pendingFriend();
  if (!code || !socialReady()) return null;
  try {
    const f = await addFriend(code);
    localStorage.removeItem(PENDING_KEY);
    const name = f.name || 'Do‘st';
    // ilova ochilishida qabul qilinsa — Do'stlar sahifasi keyin xabar ko'rsatadi
    try {
      sessionStorage.setItem(ADDED_KEY, name);
    } catch {
      /* bo'sh */
    }
    return name;
  } catch (e) {
    // o'z kodi yoki topilmagan — qayta urinish ma'nosiz
    if ((e as { status?: number }).status && (e as { status: number }).status < 500) localStorage.removeItem(PENDING_KEY);
    return null;
  }
}
