// HTTP ilova: barcha marshrutlar shu yerda yig'iladi. Testlar ham shu funksiyani chaqiradi.
import { Hono, type Context, type MiddlewareHandler } from 'hono';
import { cors } from 'hono/cors';
import { HTTPException } from 'hono/http-exception';
import type { Db } from './db/index.js';
import type { Env } from './env.js';
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

/** Oddiy xotiradagi cheklovchi (IP bo'yicha) — SMS suiiste'molidan himoya */
export function rateLimit(max: number, windowMs: number): MiddlewareHandler {
  const hits = new Map<string, { n: number; t: number }>();
  return async (c, next) => {
    const ip = c.req.header('x-forwarded-for')?.split(',')[0].trim() || c.req.header('x-real-ip') || 'local';
    const now = Date.now();
    const h = hits.get(ip);
    if (!h || now - h.t > windowMs) hits.set(ip, { n: 1, t: now });
    else if (++h.n > max) return c.json({ error: 'rate_limited', message: "Juda ko‘p urinish. Birozdan so‘ng qayta urinib ko‘ring." }, 429);
    if (hits.size > 10_000) hits.clear();
    await next();
  };
}

export function createApp(deps: Deps) {
  const app = new Hono<AppEnv>();
  const origins = deps.env.CORS_ORIGINS.split(',').map((s) => s.trim());
  app.use('*', cors({ origin: (o) => (origins.includes(o) ? o : null), allowHeaders: ['Content-Type', 'Authorization'], maxAge: 86400 }));

  app.get('/health', (c) => c.json({ ok: true }));
  app.route('/auth', authRoutes(deps));
  app.route('/sync', syncRoutes(deps));
  app.route('/coach', coachRoutes(deps));
  app.route('/billing', billingRoutes(deps));
  // /me va /notes auth marshrutlari ichida
  app.route('/', authRoutes(deps, true));

  app.onError((e, c) => {
    if (e instanceof HTTPException) return c.json({ error: 'http', message: e.message }, e.status);
    console.error(e);
    return c.json({ error: 'server', message: 'Serverda xatolik' }, 500);
  });
  return app;
}
