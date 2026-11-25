// Kartochkani lentaga joylash (shu clientId qayta kelsa — yangilanadi): { kind, clientId, data } → { id }
import { me, savePost } from '../lib/social.js';

export default async function (input, ctx) {
  return savePost(await me(ctx), input);
}
