// Telegram bot webhook'i: /start va boshqa xabarlarga ilovani ochish tugmasi bilan javob.
// Javob to'g'ridan-to'g'ri webhook javobida qaytadi (Telegram uni o'zi bajaradi) — serverdan tashqariga so'rov kerak emas.
// Bot sozlamalari (menyu tugmasi, tavsif, webhook manzili): scripts/telegram-bot.mjs (GitHub Actions → «Telegram bot»).
import { Hono } from 'hono';
import type { AppEnv, Deps } from '../app.js';
import { safeEqual } from '../lib/crypto.js';
import { webhookSecret } from '../lib/telegram.js';

interface TgMessage {
  chat?: { id?: number; type?: string };
  from?: { first_name?: string };
  text?: string;
}

/** Ilova manzili; do'st taklifi bo'lsa ?friend=KOD (ilova kirgandan keyin do'st qiladi) */
export function appLink(appUrl: string, friend?: string) {
  const u = new URL(appUrl);
  if (friend) u.searchParams.set('friend', friend);
  return u.href;
}

/** Xabarga javob (sendMessage); javob kerak bo'lmasa null */
export function botReply(msg: TgMessage | undefined, appUrl: string) {
  const chatId = msg?.chat?.id;
  if (!msg || msg.chat?.type !== 'private' || !Number.isSafeInteger(chatId)) return null;
  const text = typeof msg.text === 'string' ? msg.text.trim() : '';
  const name = (msg.from?.first_name ?? '').slice(0, 64).trim();
  const hi = name ? `Salom, ${name}!` : 'Salom!';
  const start = /^\/start(?:@\w+)?(?:\s+(\S+))?$/.exec(text);
  const friend = start?.[1] && /^f_([A-Za-z0-9]{6,12})$/.exec(start[1])?.[1]?.toUpperCase();
  const body = friend
    ? `${hi} Do‘stingiz sizni GYMbos’ga taklif qildi 🤝\n\nIlovani oching va kiring — do‘stlar ro‘yxatiga avtomatik qo‘shilasiz, bir-biringizning mashg‘ulotlarini ko‘rib, «💪» bilan qo‘llab-quvvatlaysiz.`
    : start
      ? `${hi} 👋\n\nGYMbos — zal uchun aqlli murabbiy: darajangiz va jihozingizga mos haftalik reja, har setda vazn bo‘yicha maslahat, rekordlar, haftalik hisobot va do‘stlar lentasi.\n\nBoshlash uchun pastdagi tugmani bosing.`
      : 'Ilovani ochish uchun pastdagi tugmani yoki chap pastdagi «Ochish» menyusini bosing.';
  return {
    method: 'sendMessage',
    chat_id: chatId,
    text: body,
    reply_markup: { inline_keyboard: [[{ text: '💪 GYMbos’ni ochish', web_app: { url: appLink(appUrl, friend || undefined) } }]] },
  };
}

export function telegramRoutes({ env }: Deps) {
  const r = new Hono<AppEnv>();
  r.post('/webhook', async (c) => {
    const token = env.TELEGRAM_BOT_TOKEN;
    if (!token) return c.json({ error: 'not_found', message: 'Topilmadi' }, 404);
    if (!safeEqual(c.req.header('x-telegram-bot-api-secret-token') ?? '', webhookSecret(token))) return c.json({ error: 'forbidden', message: 'Ruxsat yo‘q' }, 403);
    const update = (await c.req.json().catch(() => null)) as { message?: TgMessage } | null;
    const reply = botReply(update?.message, env.APP_URL);
    return reply ? c.json(reply) : c.json({ ok: true });
  });
  return r;
}
