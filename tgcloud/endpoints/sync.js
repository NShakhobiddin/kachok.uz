// Bulutga sinxronlash: { since, changes } → { docs, cursor, more } (faqat ro'yxatdan o'tganlar)
import { me } from '../lib/social.js';
import { sync } from '../lib/sync.js';

export default async function (input, ctx) {
  return sync(await me(ctx), input);
}
