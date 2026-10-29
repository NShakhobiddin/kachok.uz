// HTTP ilova: barcha marshrutlar shu yerda yig'iladi. Testlar ham shu funksiyani chaqiradi.
import { Hono, type Context, type MiddlewareHandler } from 'hono';
import { bodyLimit } from 'hono/body-limit';
import { cors } from 'hono/cors';
import { HTTPException } from 'hono/http-exception';
import type { Db } from './db/index.js';
import type { Env } from './env.js';
import { ApiError, clientIp, rateLimit as limiter, scrubError } from './lib/http.js';
import { verifyAccess } from './lib/jwt.js';
import { authRoutes } from './routes/auth.js';
import { billingRoutes } from './routes/billing.js';
import { coachRoutes } from './routes/coach.js';
import { syncRoutes } from './routes/sync.js';
import type { SmsSender } from './sms/index.js';

export interface Deps {
  db: Db;
  env: Env;
  sms: SmsSender;
}

export type AppEnv = { Variables: { uid: string; role: 'athlete' | 'coach' } };
export type Ctx = Context<AppEnv>;

/** So'rov tanasi chegaralari: odatda 64 KB; sinxronlash (ilova 400 talik paketlarda yuboradi) va murabbiy dasturi — kattaroq */
export const BODY_LIMIT = 64 * 1024;
export const SYNC_BODY_LIMIT = 4 * 1024 * 1024;
export const PROGRAM_BODY_LIMIT = 1024 * 1024;

export function requireAuth(env: Env): MiddlewareHandler<AppEnv> {
  return async (c, next) => {
    const h = c.req.header('authorization');
    const token = h?.startsWith('Bearer ') ? h.slice(7) : null;
    const claims = token ? await verifyAccess(env.JWT_SECRET, token) : null;
    if (!claims) return c.json({ error: 'unauthorized', message: 'Qaytadan kiring' }, 401);
    c.set('uid', claims.sub);
    c.set('role', claims.role);
    await next();
  };
}

/** IP bo'yicha cheklovchi (SMS suiiste'molidan himoya). IP — soket manzili, TRUST_PROXY=1 bo'lsa — proksi yozgani */
export function rateLimit(env: Env, max: number, windowMs: number): MiddlewareHandler<AppEnv> {
  const trust = env.TRUST_PROXY === '1';
  return limiter<AppEnv>(max, windowMs, (c) => clientIp(c, trust));
}

/** Foydalanuvchi bo'yicha cheklovchi (requireAuth'dan keyin) */
export function userRateLimit(max: number, windowMs: number): MiddlewareHandler<AppEnv> {
  return limiter<AppEnv>(max, windowMs, (c) => c.get('uid'));
}

const tooLarge = (c: Context) => c.json({ error: 'too_large', message: 'So‘rov hajmi juda katta' }, 413);

export function createApp(deps: Deps) {
  const app = new Hono<AppEnv>();
  const origins = deps.env.CORS_ORIGINS.split(',').map((s) => s.trim());
  app.use('*', cors({ origin: (o) => (origins.includes(o) ? o : null), allowHeaders: ['Content-Type', 'Authorization'], maxAge: 86400 }));

  const small = bodyLimit({ maxSize: BODY_LIMIT, onError: tooLarge });
  const sync = bodyLimit({ maxSize: SYNC_BODY_LIMIT, onError: tooLarge });
  const program = bodyLimit({ maxSize: PROGRAM_BODY_LIMIT, onError: tooLarge });
  app.use('*', (c, next) => {
    const p = c.req.path;
    if (/^\/sync\/?$/.test(p)) return sync(c, next);
    if (/^\/coach\/clients\/[^/]+\/program\/?$/.test(p)) return program(c, next);
    return small(c, next);
  });

  app.get('/health', (c) => c.json({ ok: true }));
  app.route('/auth', authRoutes(deps));
  app.route('/sync', syncRoutes(deps));
  app.route('/coach', coachRoutes(deps));
  app.route('/billing', billingRoutes(deps));
  // /me va /notes auth marshrutlari ichida
  app.route('/', authRoutes(deps, true));

  app.notFound((c) => c.json({ error: 'not_found', message: 'Topilmadi' }, 404));
  app.onError((e, c) => {
    if (e instanceof ApiError) return c.json({ error: e.code, message: e.message }, e.status);
    if (e.name === 'BodyLimitError') return tooLarge(c);
    if (e instanceof HTTPException) return c.json({ error: 'http', message: e.message }, e.status);
    // pg xatolarining `detail` maydonida telefon raqami va boshqa qiymatlar bo'ladi — logga faqat tozalangan matn
    console.error(`[xato] ${c.req.method} ${c.req.path}: ${scrubError(e)}`);
    return c.json({ error: 'server', message: 'Serverda xatolik' }, 500);
  });
  return app;
}
