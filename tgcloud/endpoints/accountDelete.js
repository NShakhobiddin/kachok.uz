// Akkauntni o'chirish: bulutdagi ma'lumotlar, lenta, do'stliklar va raqam
import { me } from '../lib/social.js';
import { deleteAccount } from '../lib/account.js';

export default async function (input, ctx) {
  await deleteAccount(await me(ctx));
  return { ok: true };
}
