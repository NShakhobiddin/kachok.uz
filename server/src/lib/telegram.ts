// Telegram Mini App ma'lumotini (initData) bot tokeni bilan tekshirish.
// https://core.telegram.org/bots/webapps#validating-data-received-via-the-mini-app
import { createHmac } from 'node:crypto';
import { safeEqual } from './crypto.js';

export interface TgUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
}

export interface TgAuth {
  user: TgUser;
  authDate: number;
  startParam?: string;
}

const check = (secret: Buffer, pairs: [string, string][]) =>
  createHmac('sha256', secret)
    .update(
      pairs
        .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))
        .map(([k, v]) => `${k}=${v}`)
        .join('\n'),
    )
    .digest('hex');

/**
 * initData haqiqiy (Telegram imzolagan, muddati o'tmagan) bo'lsa — foydalanuvchi, aks holda null.
 * Bot API 8.0 dan "signature" maydoni ham keladi: u tekshiruv qatoriga kiradi; eski mijozlar uchun usiz ham tekshiriladi.
 */
export function verifyInitData(raw: string, botToken: string, maxAgeSec: number, nowMs = Date.now()): TgAuth | null {
  let params: URLSearchParams;
  try {
    params = new URLSearchParams(raw);
  } catch {
    return null;
  }
  const hash = params.get('hash');
  if (!hash || !/^[0-9a-f]{64}$/.test(hash)) return null;
  const pairs = [...params.entries()].filter(([k]) => k !== 'hash');
  const secret = createHmac('sha256', 'WebAppData').update(botToken).digest();
  const ok = safeEqual(check(secret, [...pairs]), hash) || (pairs.some(([k]) => k === 'signature') && safeEqual(check(secret, pairs.filter(([k]) => k !== 'signature')), hash));
  if (!ok) return null;
  const authDate = Number(params.get('auth_date'));
  if (!Number.isFinite(authDate) || authDate <= 0) return null;
  const age = nowMs / 1000 - authDate;
  if (age > maxAgeSec || age < -300) return null;
  let user: TgUser;
  try {
    user = JSON.parse(params.get('user') ?? '');
  } catch {
    return null;
  }
  if (!user || !Number.isSafeInteger(user.id) || user.id <= 0) return null;
  const startParam = params.get('start_param') ?? undefined;
  return { user: { id: user.id, first_name: String(user.first_name ?? '').slice(0, 64), last_name: user.last_name?.slice(0, 64), username: user.username?.slice(0, 64) }, authDate, startParam };
}

/** Testlar uchun: bot tokeni bilan imzolangan initData yasash */
export function signInitData(fields: Record<string, string>, botToken: string): string {
  const secret = createHmac('sha256', 'WebAppData').update(botToken).digest();
  const hash = check(secret, Object.entries(fields));
  return new URLSearchParams({ ...fields, hash }).toString();
}

/**
 * Webhook maxfiy kaliti (X-Telegram-Bot-Api-Secret-Token): bot tokenidan hosil qilinadi — alohida sozlash kerak emas.
 * Xuddi shu hisob scripts/telegram-bot.mjs da (setWebhook) — o'zgartirsangiz ikkalasini ham.
 */
export const webhookSecret = (botToken: string) => createHmac('sha256', botToken).update('gymbos-webhook').digest('hex');
