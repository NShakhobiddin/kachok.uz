// O'z yozuvini o'chirish: { id }
import { deletePost, me } from '../lib/social.js';

export default async function (input, ctx) {
  await deletePost(await me(ctx), input.id);
  return { ok: true };
}
