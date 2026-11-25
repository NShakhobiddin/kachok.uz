// Har bir xabarga (shaxsiy chatda): /start — salom va ilovani ochish tugmasi; /start f_KOD — do'st taklifi.
import { api } from 'sdk';
import { startReply } from '../lib/bot.js';

export default async function (message) {
  const reply = await startReply(message);
  if (reply) await api.sendMessage(reply);
}
