// Do'stlar ro'yxati: { friends: [{ id, name, since, last_post }] }
import { listFriends, me } from '../lib/social.js';

export default async function (input, ctx) {
  return { friends: await listFriends((await me(ctx)).id) };
}
