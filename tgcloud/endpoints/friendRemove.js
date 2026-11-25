// Do'stlikni bekor qilish: { id }
import { me, removeFriend } from '../lib/social.js';

export default async function (input, ctx) {
  await removeFriend(await me(ctx), input.id);
  return { ok: true };
}
