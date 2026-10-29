// To'lovlar: buyurtma yaratish (ilova uchun) va Payme/Click server so'rovlari.
import { Hono, type Context } from 'hono';
import { z } from 'zod';
import { requireAuth, type AppEnv, type Deps } from '../app.js';
import { clickCheckoutUrl, handleClick, type ClickParams } from '../billing/click.js';
import { handlePayme, paymeAuthorized, paymeCheckoutUrl, paymeError } from '../billing/payme.js';
import { PLANS, planById } from '../billing/plans.js';
import { isUuid, readBody, scrubError } from '../lib/http.js';

/** Ruxsatsiz Payme so'rovida javobga `id` qaytarish uchun o'qiladigan eng katta tana (haqiqiy so'rovlar ~1 KB) */
const PAYME_UNAUTH_PEEK = 4 * 1024;

export function billingRoutes(deps: Deps) {
  const r = new Hono<AppEnv>();
  const { db, env } = deps;
  const paymeReady = !!(env.PAYME_MERCHANT_ID && env.PAYME_KEY);
  const clickReady = !!(env.CLICK_SERVICE_ID && env.CLICK_MERCHANT_ID && env.CLICK_SECRET_KEY);

  r.get('/plans', (c) => c.json({ plans: PLANS, providers: { payme: paymeReady, click: clickReady } }));

  r.post('/orders', requireAuth(env), async (c) => {
    const body = await readBody(c, z.object({ plan: z.string().max(64), provider: z.enum(['payme', 'click']) }));
    const plan = planById(body.plan);
    if (!plan) return c.json({ error: 'bad_plan', message: 'Tarif topilmadi' }, 400);
    if ((body.provider === 'payme' && !paymeReady) || (body.provider === 'click' && !clickReady))
      return c.json({ error: 'not_configured', message: 'Bu to‘lov usuli hali ulanmagan' }, 503);
    const amountTiyin = plan.priceSom * 100;
    const { rows } = await db.query<{ id: string }>(`INSERT INTO orders (user_id, plan, amount_tiyin, provider) VALUES ($1, $2, $3, $4) RETURNING id`, [
      c.get('uid'),
      plan.id,
      amountTiyin,
      body.provider,
    ]);
    const orderId = rows[0].id;
    const returnUrl = `${env.APP_URL}/premium?order=${orderId}`;
    const checkoutUrl =
      body.provider === 'payme'
        ? paymeCheckoutUrl({ merchantId: env.PAYME_MERCHANT_ID!, orderId, amountTiyin, returnUrl, test: env.PAYME_TEST === '1' })
        : clickCheckoutUrl({ serviceId: env.CLICK_SERVICE_ID!, merchantId: env.CLICK_MERCHANT_ID!, orderId, amountTiyin, returnUrl });
    return c.json({ orderId, checkoutUrl });
  });

  r.get('/orders/:id', requireAuth(env), async (c) => {
    const id = c.req.param('id');
    if (!isUuid(id)) return c.json({ error: 'not_found' }, 404);
    const { rows } = await db.query(`SELECT id, plan, amount_tiyin, provider, status, created_at FROM orders WHERE id = $1 AND user_id = $2`, [id, c.get('uid')]);
    if (!rows[0]) return c.json({ error: 'not_found' }, 404);
    return c.json({ order: rows[0] });
  });

  // Payme serveri chaqiradi (JSON-RPC, Basic auth). Javob har doim HTTP 200 va JSON-RPC ko'rinishida.
  r.post('/payme', async (c) => {
    // Avval ruxsat (sarlavha bo'yicha), tana keyin. Ruxsatsiz so'rovda tana faqat `id` ni qaytarish uchun, kichik bo'lsa o'qiladi.
    if (!paymeAuthorized(c.req.header('authorization'), env.PAYME_KEY)) {
      let id: unknown = null;
      const len = Number(c.req.header('content-length') ?? NaN);
      if (Number.isFinite(len) && len <= PAYME_UNAUTH_PEEK) {
        try {
          id = (JSON.parse(await c.req.text()) as { id?: unknown })?.id ?? null;
        } catch {
          id = null;
        }
      }
      return c.json({ error: paymeError('auth'), id });
    }
    let body: unknown;
    try {
      body = JSON.parse(await c.req.text());
    } catch (e) {
      if ((e as Error)?.name === 'BodyLimitError') throw e;
      return c.json({ error: paymeError('parse'), id: null });
    }
    try {
      return c.json(await handlePayme(db, body));
    } catch (e) {
      // kutilmagan xato ham JSON-RPC javobi bo'lishi kerak (HTTP 500 emas)
      console.error(`[payme] ${scrubError(e)}`);
      return c.json({ error: paymeError('system'), id: (body as { id?: unknown })?.id ?? null });
    }
  });

  // Click serveri chaqiradi (form-urlencoded)
  const click = (stage: 'prepare' | 'complete') => async (c: Context<AppEnv>) => {
    if (!clickReady) return c.json({ error: -8, error_note: 'Not configured' });
    const form = (await c.req.parseBody()) as Record<string, unknown>;
    const params = Object.fromEntries(Object.entries(form).filter(([, v]) => typeof v === 'string')) as ClickParams;
    return c.json(await handleClick(db, params, { secret: env.CLICK_SECRET_KEY!, serviceId: env.CLICK_SERVICE_ID! }, stage));
  };
  r.post('/click/prepare', click('prepare'));
  r.post('/click/complete', click('complete'));

  return r;
}
