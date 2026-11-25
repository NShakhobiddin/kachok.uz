// Shaxsiy chatdagi xabarlar: kontakt — ro'yxatdan o'tishda raqamni ulash; /start — salom va ilovani ochish tugmasi
// (/start f_KOD — do'st taklifi).
import { api } from 'sdk';
import { savePhone } from '../lib/account.js';
import { startReply } from '../lib/bot.js';

export default async function (message) {
  const reply = message && message.contact ? await savePhone(message) : await startReply(message);
  if (reply) await api.sendMessage(reply);
}
