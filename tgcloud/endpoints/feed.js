// Lenta: o'zining va do'stlarining yozuvlari, eng yangisi birinchi: { before? } → { posts, more }
import { feed, me } from '../lib/social.js';

export default async function (input, ctx) {
  return feed(await me(ctx), input.before);
}
