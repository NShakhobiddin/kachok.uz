// Serverni ishga tushirish: `npm run dev` (ishlab chiqish) yoki `npm start` (production)
import { serve } from '@hono/node-server';
import { createApp } from './app.js';
import { createDb, migrate } from './db/index.js';
import { loadEnv } from './env.js';
import { createSms } from './sms/index.js';

const env = loadEnv();
const db = await createDb({ url: env.DATABASE_URL, pgliteDir: env.PGLITE_DIR });
const applied = await migrate(db);
if (applied.length) console.log('Migratsiyalar:', applied.join(', '));
const app = createApp({ db, env, sms: createSms(env) });

serve({ fetch: app.fetch, port: env.PORT }, (info) => {
  console.log(`GYMbos API: http://localhost:${info.port} (${env.DATABASE_URL ? 'PostgreSQL' : 'PGlite'}, SMS: ${env.SMS_PROVIDER})`);
});

const stop = async () => {
  await db.close();
  process.exit(0);
};
process.on('SIGINT', stop);
process.on('SIGTERM', stop);
