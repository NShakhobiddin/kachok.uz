// Ro'yxatdan o'tish (Telegram akkaunti bilan; raqam — ixtiyoriy, bot orqali): { registered, name, phone, registeredAt }
import { me } from '../lib/social.js';
import { register } from '../lib/account.js';

export default async function (input, ctx) {
  return register(await me(ctx));
}
