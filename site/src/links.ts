// Havolalar: bot (Telegram Mini App), ilovaning brauzer versiyasi va sayt fayllari (sayt ilovadan alohida joylanadi).
const BOT = import.meta.env.VITE_TG_BOT || 'gym_bosbot';
const BASE = import.meta.env.BASE_URL;

export const BOT_NAME = `@${BOT}`;
/**
 * Mini App’ni to‘g‘ridan-to‘g‘ri ochadi. from — qaysi tugmadan kelgani (start_param: harf, raqam, _):
 * keyinchalik bot qaysi bo‘lim ko‘proq odam olib kelayotganini sanashi mumkin.
 */
export const botUrl = (from = 'site') => `https://t.me/${BOT}?startapp=${from}`;
/** bot chati (Mini App ochilmaydigan eski Telegram versiyalari uchun) */
export const BOT_CHAT = `https://t.me/${BOT}`;
/** ilovaning brauzer versiyasi (alohida joylangan): VITE_APP_URL bilan o‘zgartiriladi */
export const APP_URL = import.meta.env.VITE_APP_URL || 'https://nshakhobiddin.github.io/kachok.uz/';
export const PRIVACY_URL = `${BASE}maxfiylik.html`;
export const HOME_URL = BASE;
export const asset = (p: string) => `${BASE}${p}`;
