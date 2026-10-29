// Server sozlamalari (muhit o'zgaruvchilari). Namunasi: server/.env.example
import { z } from 'zod';

const schema = z.object({
  PORT: z.coerce.number().default(8787),
  /** postgres://... — bo'sh bo'lsa, ichki PGlite (ishlab chiqish uchun) */
  DATABASE_URL: z.string().optional(),
  /** PGlite ma'lumotlar papkasi (DATABASE_URL bo'lmaganda). Bo'sh = xotirada */
  PGLITE_DIR: z.string().optional(),
  JWT_SECRET: z.string().min(32, 'JWT_SECRET kamida 32 belgi bo‘lishi kerak'),
  /** Veb-ilova manzili (to'lovdan qaytish va CORS uchun) */
  APP_URL: z.string().url().default('http://localhost:5173'),
  CORS_ORIGINS: z.string().default('http://localhost:5173'),

  /** console — kod server logiga yoziladi (faqat ishlab chiqishda!), eskiz — Eskiz.uz SMS */
  SMS_PROVIDER: z.enum(['console', 'eskiz']).default('console'),
  ESKIZ_EMAIL: z.string().optional(),
  ESKIZ_PASSWORD: z.string().optional(),
  ESKIZ_FROM: z.string().default('4546'),

  PAYME_MERCHANT_ID: z.string().optional(),
  PAYME_KEY: z.string().optional(),
  PAYME_TEST: z.enum(['0', '1']).default('1'),

  CLICK_SERVICE_ID: z.string().optional(),
  CLICK_MERCHANT_ID: z.string().optional(),
  CLICK_SECRET_KEY: z.string().optional(),

  /** Yangi akkauntga beriladigan bepul Pro sinov kunlari */
  TRIAL_DAYS: z.coerce.number().default(7),
});

export type Env = z.infer<typeof schema>;

export function loadEnv(src: Record<string, string | undefined> = process.env): Env {
  const env = schema.parse(src);
  if (env.SMS_PROVIDER === 'console' && process.env.NODE_ENV === 'production')
    throw new Error("Production’da SMS_PROVIDER=console ishlatib bo‘lmaydi");
  return env;
}
