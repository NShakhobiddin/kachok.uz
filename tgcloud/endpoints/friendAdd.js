// Kod bo'yicha do'st qo'shish (ikki tomonlama): { code } → { friend: { id, name } }
import { addFriend, me } from '../lib/social.js';

export default async function (input, ctx) {
  return { friend: await addFriend(await me(ctx), input.code) };
}
