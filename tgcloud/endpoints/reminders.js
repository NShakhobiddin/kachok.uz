// Botdan eslatmalar: { on, hour?, tzOffset? } → akkaunt holati
import { me } from '../lib/social.js';
import { setReminders } from '../lib/account.js';

export default async function (input, ctx) {
  return setReminders(await me(ctx), input);
}
