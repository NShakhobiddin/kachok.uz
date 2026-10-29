// Serverni ishga tushirish: `npm run dev` (ishlab chiqish) yoki `npm start` (production)
import { serve } from '@hono/node-server';
import { createApp } from './app.js';
import { createDb, migrate } from './db/index.js';
import { loadEnv } from './env.js';
import { createSms } from './sms/index.js';

const env = loadEnv();
if (env.DEV_MODE === '1') console.warn('DIQQAT: DEV_MODE=1 — SMS kodlari konsolga yoziladi va javobda qaytariladi. Faqat ishlab chiqish uchun!');
if (env.PAYME_TEST === '1' && process.env.NODE_ENV === 'production') console.warn('DIQQAT: PAYME_TEST=1 — to‘lovlar test.paycom.uz orqali (haqiqiy pul olinmaydi)');
if (env.TRUST_PROXY !== '1' && env.DATABASE_URL) console.warn('Eslatma: TRUST_PROXY=0 — API proksi ortida bo‘lsa, barcha mijozlar bitta IP sifatida cheklanadi. Proksi ortida TRUST_PROXY=1 qiling.');
const db = await createDb({ url: env.DATABASE_URL, pgliteDir: env.PGLITE_DIR });
const applied = await migrate(db);
if (applied.length) console.log('Migratsiyalar:', applied.join(', '));
const app = createApp({ db, env, sms: createSms(env) });

serve({ fetch: app.fetch, port: env.PORT }, (info) => {
  console.log(`Kachok API: http://localhost:${info.port} (${env.DATABASE_URL ? 'PostgreSQL' : 'PGlite'}, SMS: ${env.SMS_PROVIDER})`);
});

const stop = async () => {
  await db.close();
  process.exit(0);
};
process.on('SIGINT', stop);
process.on('SIGTERM', stop);
