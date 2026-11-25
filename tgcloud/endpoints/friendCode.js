// Taklif kodi va havolasi: { code, invite, bot }
import { friendCode, me } from '../lib/social.js';
import { inviteLink } from '../lib/bot.js';

export default async function (input, ctx) {
  const code = await friendCode(await me(ctx));
  return { code, ...(await inviteLink(code)) };
}
