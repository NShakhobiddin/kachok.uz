// Lentadagi barcha ma'lumotlarimni o'chirish (yozuvlar, «💪», do'stliklar, akkaunt)
import { deleteMe, me } from '../lib/social.js';

export default async function (input, ctx) {
  await deleteMe(await me(ctx));
  return { ok: true };
}
