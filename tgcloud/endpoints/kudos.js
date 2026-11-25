// «💪» qo'yish yoki olib tashlash: { id, on }
import { me, setKudos } from '../lib/social.js';

export default async function (input, ctx) {
  await setKudos(await me(ctx), input.id, input.on !== false);
  return { ok: true };
}
