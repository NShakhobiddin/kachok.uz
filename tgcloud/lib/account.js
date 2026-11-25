// Ro'yxatdan o'tish: Telegram akkaunti (platforma tasdiqlaydi) + ixtiyoriy telefon raqami.
// Raqam faqat Telegram'ning o'zidan keladi: Mini App requestContact → foydalanuvchi o'z kontaktini botga yuboradi →
// handlers/message.js uni shu yerda saqlaydi (boshqa odamning kontakti qabul qilinmaydi).
import { db } from 'sdk';
import { sql } from 'sdk/db';
import { deleteMe } from './social.js';

const iso = (ms) => (ms == null ? null : new Date(Number(ms)).toISOString());

export function accountInfo(user) {
  return { registered: user.registered_at != null, name: user.name || '', phone: user.phone || null, registeredAt: iso(user.registered_at) };
}

export async function register(user) {
  if (user.registered_at == null) {
    const t = Date.now();
    await db.run(sql`UPDATE users SET registered_at = ${t} WHERE id = ${user.id} AND registered_at IS NULL`);
    const row = await db.get(sql`SELECT registered_at FROM users WHERE id = ${user.id}`);
    user.registered_at = row ? row.registered_at : t;
  }
  return accountInfo(user);
}

/** Akkauntni butunlay o'chirish: bulutdagi ma'lumotlar, lenta, do'stliklar */
export async function deleteAccount(user) {
  await db.run(sql`DELETE FROM docs WHERE user_id = ${user.id}`);
  await deleteMe(user);
}

/** Botga kelgan kontakt: faqat yuboruvchining o'z raqami saqlanadi. Javob (sendMessage) yoki null */
export async function savePhone(message) {
  const c = message.contact;
  const from = message.from;
  if (!c || !message.chat || message.chat.type !== 'private') return null;
  if (!from || c.user_id !== from.id) return { chat_id: message.chat.id, text: 'Faqat o‘zingizning raqamingizni ulashing — ilovadagi «Raqam bilan ro‘yxatdan o‘tish» tugmasi orqali.' };
  const digits = String(c.phone_number || '').replace(/\D/g, '').slice(0, 15);
  if (digits.length < 7) return null;
  const name = [from.first_name, from.last_name].filter((s) => typeof s === 'string' && s.trim()).join(' ').trim().slice(0, 60);
  await db.run(
    sql`INSERT INTO users (tg_id, name, phone, created_at) VALUES (${from.id}, ${name}, ${digits}, ${(Date.now() / 1000) | 0})
        ON CONFLICT(tg_id) DO UPDATE SET phone = excluded.phone`,
  );
  return { chat_id: message.chat.id, text: '✅ Raqamingiz GYMbos akkauntiga ulandi. Ilovaga qaytishingiz mumkin.' };
}
