// To'lovlar: buyurtma yaratish (ilova uchun) va Payme/Click server so'rovlari.
import { Hono, type Context } from 'hono';
import { z } from 'zod';
import { requireAuth, type AppEnv, type Deps } from '../app.js';
import { clickCheckoutUrl, handleClick, type ClickParams } from '../billing/click.js';
import { handlePayme, paymeAuthorized, paymeCheckoutUrl } from '../billing/payme.js';
import { PLANS, planById } from '../billing/plans.js';

export function billingRoutes(deps: Deps) {
  const r = new Hono<AppEnv>();
  const { db, env } = deps;
  const paymeReady = !!(env.PAYME_MERCHANT_ID && env.PAYME_KEY);
  const clickReady = !!(env.CLICK_SERVICE_ID && env.CLICK_MERCHANT_ID && env.CLICK_SECRET_KEY);

  r.get('/plans', (c) => c.json({ plans: PLANS, providers: { payme: paymeReady, click: clickReady } }));

  r.post('/orders', requireAuth(env), async (c) => {
    const body = z.object({ plan: z.string(), provider: z.enum(['payme', 'click']) }).parse(await c.req.json());
    const plan = planById(body.plan);
    if (!plan) return c.json({ error: 'bad_plan', message: 'Tarif topilmadi' }, 400);
    if ((body.provider === 'payme' && !paymeReady) || (body.provider === 'click' && !clickReady))
      return c.json({ error: 'not_configured', message: "Bu to'lov usuli hali ulanmagan" }, 503);
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
    const { rows } = await db.query(`SELECT id, plan, amount_tiyin, provider, status, created_at FROM orders WHERE id = $1 AND user_id = $2`, [
      c.req.param('id'),
      c.get('uid'),
    ]);
    if (!rows[0]) return c.json({ error: 'not_found' }, 404);
    return c.json({ order: rows[0] });
  });

  // Payme serveri chaqiradi (JSON-RPC, Basic auth). Javob har doim HTTP 200.
  r.post('/payme', async (c) => {
    let body: unknown;
    try {
      body = await c.req.json();
    } catch {
      return c.json({ error: { code: -32700, message: { uz: 'JSON xato', ru: 'Ошибка JSON', en: 'Parse error' } }, id: null });
    }
    if (!paymeAuthorized(c.req.header('authorization'), env.PAYME_KEY))
      return c.json({ error: { code: -32504, message: { uz: 'Ruxsat yo‘q', ru: 'Недостаточно привилегий', en: 'Insufficient privileges' } }, id: (body as { id?: unknown })?.id ?? null });
    return c.json(await handlePayme(db, body));
  });

  // Click serveri chaqiradi (form-urlencoded)
  const click = (stage: 'prepare' | 'complete') => async (c: Context<AppEnv>) => {
    if (!clickReady) return c.json({ error: -8, error_note: 'Not configured' });
    const form = (await c.req.parseBody()) as Record<string, string>;
    return c.json(await handleClick(db, form as ClickParams, { secret: env.CLICK_SECRET_KEY!, serviceId: env.CLICK_SERVICE_ID! }, stage));
  };
  r.post('/click/prepare', click('prepare'));
  r.post('/click/complete', click('complete'));

  return r;
}
