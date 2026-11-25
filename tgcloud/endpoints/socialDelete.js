// Lentadagi barcha ma'lumotlarimni o'chirish (yozuvlar, «💪», do'stliklar; akkaunt va bulutdagi ma'lumotlar qoladi)
import { deleteSocial, me } from '../lib/social.js';

export default async function (input, ctx) {
  await deleteSocial(await me(ctx));
  return { ok: true };
}
