// Telegram ichida ro'yxatdan o'tish (Serverless): akkaunt — Telegram foydalanuvchisi (Telegram tasdiqlaydi),
// raqam — ixtiyoriy, Telegram'ning "raqamni ulashish" oynasi orqali (SMS kerak emas). Ro'yxatdan o'tgach
// ma'lumotlar bulutga saqlanadi va boshqa qurilmada shu Telegram akkaunti bilan ochilganda tiklanadi.
import { telegram } from '../lib/telegram';
import { useStore } from '../store/useStore';
import { scall, serverless, tgUserId } from './serverless';
import { syncNow } from './sync';

export interface CloudInfo {
  registered: boolean;
  name: string;
  phone: string | null;
  registeredAt: string | null;
  remind?: boolean;
  remindHour?: number;
}

/** Telegram'dagi ism (ro'yxatdan o'tish oynasida ko'rsatish uchun) */
export function tgProfile() {
  const u = telegram()?.initDataUnsafe.user;
  return { name: [u?.first_name, u?.last_name].filter(Boolean).join(' ').trim(), username: u?.username ?? null };
}

/** Serverdagi holatni qurilmaga yozish */
function apply(info: CloudInfo) {
  const id = tgUserId();
  const { cloud, setCloud } = useStore.getState();
  if (!id) return;
  if (info.registered) {
    const next = { tgId: id, name: info.name, phone: info.phone, at: info.registeredAt ?? new Date().toISOString(), remind: !!info.remind, remindHour: info.remindHour ?? 8 };
    // `at` — ro'yxatdan o'tgan vaqt: o'zgarsa, akkaunt o'chirilib qayta ochilgan (setCloud sinxronni boshidan boshlaydi)
    if (!cloud || cloud.tgId !== id || cloud.at !== next.at || cloud.name !== next.name || cloud.phone !== next.phone || cloud.remind !== next.remind || cloud.remindHour !== next.remindHour) setCloud(next);
  } else if (cloud && cloud.tgId === id) setCloud(null); // boshqa qurilmada o'chirilgan
}

export async function fetchCloud(): Promise<CloudInfo> {
  const info = await scall<CloudInfo>('account');
  apply(info);
  return info;
}

/** Ro'yxatdan o'tish; keyin darhol bulutga saqlanadi (yangi qurilmada — bulutdagisi tiklanadi) */
export async function registerCloud(): Promise<CloudInfo> {
  const info = await scall<CloudInfo>('register');
  apply(info);
  await syncNow();
  return info;
}

/** Telegram ilovasi raqam so'rash oynasini qo'llaydimi (Bot API 6.9+) */
export const canRequestPhone = () => {
  const tg = telegram();
  return !!tg?.requestContact && tg.isVersionAtLeast('6.9');
};

/** Telegram'ning "raqamni ulashish" oynasi; ulashilsa — true (kontakt botga boradi, server raqamni saqlaydi) */
export function requestPhone(): Promise<boolean> {
  const tg = telegram();
  return new Promise((resolve) => {
    if (!tg?.requestContact || !canRequestPhone()) return resolve(false);
    try {
      tg.requestContact((shared) => resolve(!!shared));
    } catch {
      resolve(false);
    }
  });
}

/** Raqam serverga yetib kelguncha kutish (bot kontaktni bir-ikki soniyada oladi) */
export async function waitForPhone(tries = 8, ms = 1000): Promise<string | null> {
  for (let i = 0; i < tries; i++) {
    const info = await fetchCloud().catch(() => null);
    if (info?.phone) return info.phone;
    await new Promise((r) => setTimeout(r, ms));
  }
  return null;
}

/** Botga foydalanuvchiga yozish ruxsati (bot bilan chat ochilmagan bo'lsa — Telegram oynasi) */
function requestWrite(): Promise<boolean> {
  const tg = telegram();
  if (tg?.initDataUnsafe.user?.allows_write_to_pm) return Promise.resolve(true);
  return new Promise((resolve) => {
    if (!tg?.requestWriteAccess || !tg.isVersionAtLeast('6.9')) return resolve(true);
    try {
      tg.requestWriteAccess((granted) => resolve(!!granted));
    } catch {
      resolve(false);
    }
  });
}

/** Eslatmalarni yoqish/o'chirish (yoqishda — bot yozish ruxsati so'raladi); false — ruxsat berilmadi */
export async function setReminders(on: boolean, hour?: number): Promise<boolean> {
  if (on && !(await requestWrite())) return false;
  const info = await scall<CloudInfo>('reminders', { on, ...(hour !== undefined ? { hour } : {}), tzOffset: -new Date().getTimezoneOffset() });
  apply(info);
  return true;
}

export async function deleteCloud() {
  await scall('accountDelete');
  useStore.getState().setCloud(null);
}

let boot: Promise<CloudInfo | null> | null = null;
/**
 * Ilova ochilganda (Telegram ichida): akkaunt holatini tekshirish. Ro'yxatdan o'tgan, lekin qurilmada profil yo'q bo'lsa
 * (yangi telefon) — bulutdagi ma'lumotlar tiklanadi. Bir marta ishlaydi.
 */
export function bootCloud(): Promise<CloudInfo | null> {
  if (!serverless()) return Promise.resolve(null);
  boot ??= (async () => {
    const info = await fetchCloud().catch(() => null);
    if (info?.registered && !useStore.getState().profile) await syncNow();
    return info;
  })();
  return boot;
}

/** "+998 90 123 45 67" ko'rinishida */
export function fmtPhone(p: string | null | undefined): string {
  if (!p) return '';
  const m = /^(998)(\d{2})(\d{3})(\d{2})(\d{2})$/.exec(p);
  return m ? `+${m[1]} ${m[2]} ${m[3]} ${m[4]} ${m[5]}` : `+${p}`;
}
