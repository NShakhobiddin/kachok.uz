// Server sozlamalari (muhit o'zgaruvchilari). Namunasi: server/.env.example
import { z } from 'zod';

/** .env.example va hujjatlardagi namunaviy qiymatlar — hech qachon haqiqiy kalit sifatida qabul qilinmaydi */
const PLACEHOLDER_SECRETS = new Set(['almashtiring-bu-yerga-uzun-tasodifiy-maxfiy-qator']);
const PLACEHOLDER_WORDS = /almashtiring|change[-_ ]?me|placeholder|example|namuna/i;
/** Tasodifiy kalitda (openssl rand -base64 48 yoki -hex 32) turli belgilar soni bundan ancha ko'p bo'ladi */
const MIN_UNIQUE_CHARS = 12;

/** JWT_SECRET zaif bo'lsa — sababi, aks holda null */
export function weakSecretReason(s: string): string | null {
  const hint = 'Yangisini yarating: openssl rand -base64 48';
  if (s.length < 32) return `JWT_SECRET kamida 32 belgi bo‘lishi kerak. ${hint}`;
  if (PLACEHOLDER_SECRETS.has(s) || PLACEHOLDER_WORDS.test(s)) return `JWT_SECRET — namunaviy qiymat, uni hamma biladi. ${hint}`;
  if (new Set(s).size < MIN_UNIQUE_CHARS) return `JWT_SECRET juda oddiy (belgilar takrorlanadi). ${hint}`;
  return null;
}

const flag = z.enum(['0', '1']);

const schema = z.object({
  PORT: z.coerce.number().default(8787),
  /** postgres://... — bo'sh bo'lsa, ichki PGlite (ishlab chiqish uchun) */
  DATABASE_URL: z.string().optional(),
  /** PGlite ma'lumotlar papkasi (DATABASE_URL bo'lmaganda). Bo'sh = xotirada */
  PGLITE_DIR: z.string().optional(),
  JWT_SECRET: z.string().superRefine((s, ctx) => {
    const why = weakSecretReason(s);
    if (why) ctx.addIssue({ code: z.ZodIssueCode.custom, message: why });
  }),
  /** Veb-ilova manzili (to'lovdan qaytish va CORS uchun) */
  APP_URL: z.string().url().default('http://localhost:5173'),
  CORS_ORIGINS: z.string().default('http://localhost:5173'),

  /** 1 — ishlab chiqish rejimi: SMS konsolga yoziladi va kod javobda qaytariladi (devCode). Production'da taqiqlangan */
  DEV_MODE: flag.default('0'),
  /** 1 — API teskari proksi (nginx, Caddy) ortida: mijoz IP manzili X-Forwarded-For'ning eng o'ngidagi qiymatidan olinadi */
  TRUST_PROXY: flag.default('0'),

  /** console — kod server logiga yoziladi (faqat DEV_MODE=1 bilan!), eskiz — Eskiz.uz SMS */
  SMS_PROVIDER: z.enum(['console', 'eskiz']).default('console'),
  ESKIZ_EMAIL: z.string().optional(),
  ESKIZ_PASSWORD: z.string().optional(),
  ESKIZ_FROM: z.string().default('4546'),
  /** Butun server bo'yicha soatiga yuboriladigan SMS'lar chegarasi (SMS-pamping hujumidan himoya) */
  SMS_GLOBAL_PER_HOUR: z.coerce.number().int().positive().default(500),

  PAYME_MERCHANT_ID: z.string().optional(),
  PAYME_KEY: z.string().optional(),
  /** 0 — haqiqiy to'lovlar (checkout.paycom.uz), 1 — test.paycom.uz. Payme ulangan bo'lsa, aniq ko'rsatilishi shart */
  PAYME_TEST: flag.optional(),

  CLICK_SERVICE_ID: z.string().optional(),
  CLICK_MERCHANT_ID: z.string().optional(),
  CLICK_SECRET_KEY: z.string().optional(),

  /** Yangi akkauntga beriladigan bepul Pro sinov kunlari */
  TRIAL_DAYS: z.coerce.number().default(7),
});

export type Env = z.infer<typeof schema>;

export function loadEnv(src: Record<string, string | undefined> = process.env): Env {
  const env = schema.parse(src);
  const production = (src.NODE_ENV ?? process.env.NODE_ENV) === 'production';
  if (production && env.DEV_MODE === '1') throw new Error('Production’da DEV_MODE=1 ishlatib bo‘lmaydi');
  if (env.SMS_PROVIDER === 'console' && env.DEV_MODE !== '1') throw new Error('SMS_PROVIDER=console faqat ishlab chiqishda (DEV_MODE=1) ishlaydi. Production uchun: SMS_PROVIDER=eskiz');
  if (env.PAYME_MERCHANT_ID && env.PAYME_KEY && !env.PAYME_TEST) throw new Error('PAYME_TEST ni aniq belgilang: 0 — haqiqiy to‘lovlar, 1 — test.paycom.uz');
  return env;
}
