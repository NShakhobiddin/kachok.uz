// Akkaunt holati: { registered, name, phone, registeredAt }
import { me } from '../lib/social.js';
import { accountInfo } from '../lib/account.js';

export default async function (input, ctx) {
  return accountInfo(await me(ctx));
}
