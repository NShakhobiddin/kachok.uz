// Click SHOP API: Prepare (action=0) va Complete (action=1) so'rovlari, MD5 imzo bilan.
// Hujjat: docs.click.uz — "Click API / SHOP API".
import type { Db } from '../db/index.js';
import { md5, safeEqual } from '../lib/crypto.js';
import { activatePlan } from './subscription.js';

export interface ClickParams {
  click_trans_id?: string;
  service_id?: string;
  click_paydoc_id?: string;
  merchant_trans_id?: string;
  merchant_prepare_id?: string;
  amount?: string;
  action?: string;
  error?: string;
  error_note?: string;
  sign_time?: string;
  sign_string?: string;
}

const NOTES: Record<number, string> = {
  0: 'Success',
  [-1]: 'SIGN CHECK FAILED!',
  [-2]: 'Incorrect parameter amount',
  [-3]: 'Action not found',
  [-4]: 'Already paid',
  [-5]: 'User does not exist',
  [-6]: 'Transaction does not exist',
  [-8]: 'Error in request from click',
  [-9]: 'Transaction cancelled',
};

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

interface Order {
  id: string;
  /** akkaunt o'chirilgan bo'lsa — null */
  user_id: string | null;
  plan: string;
  amount_tiyin: number;
  status: string;
  click_prepare_id: number | null;
}

export function clickSign(p: ClickParams, secret: string, withPrepare: boolean) {
  return md5(`${p.click_trans_id}${p.service_id}${secret}${p.merchant_trans_id}${withPrepare ? p.merchant_prepare_id : ''}${p.amount}${p.action}${p.sign_time}`);
}

export async function handleClick(db: Db, p: ClickParams, cfg: { secret: string; serviceId: string }, stage: 'prepare' | 'complete') {
  const base = { click_trans_id: p.click_trans_id, merchant_trans_id: p.merchant_trans_id };
  const reply = (error: number, extra: Record<string, unknown> = {}) => ({ ...base, ...extra, error, error_note: NOTES[error] ?? 'Error' });
  const required = ['click_trans_id', 'service_id', 'merchant_trans_id', 'amount', 'action', 'sign_time', 'sign_string'] as const;
  if (required.some((k) => !p[k]) || (stage === 'complete' && !p.merchant_prepare_id)) return reply(-8);
  if (p.service_id !== cfg.serviceId || !safeEqual(clickSign(p, cfg.secret, stage === 'complete'), String(p.sign_string))) return reply(-1);
  if ((stage === 'prepare' && p.action !== '0') || (stage === 'complete' && p.action !== '1')) return reply(-3);
  if (!UUID.test(String(p.merchant_trans_id))) return reply(-5);

  return db.tx(async (q) => {
    const { rows } = await q.query<Order>(`SELECT * FROM orders WHERE id = $1 AND provider = 'click' FOR UPDATE`, [p.merchant_trans_id]);
    const order = rows[0];
    if (!order || !order.user_id) return reply(-5);
    if (order.status === 'paid') return reply(-4);
    if (order.status === 'cancelled') return reply(-9);
    const amount = Number(p.amount);
    if (!Number.isFinite(amount) || Math.abs(Math.round(amount * 100) - Number(order.amount_tiyin)) > 1) return reply(-2);

    if (stage === 'prepare') {
      const prepareId = order.click_prepare_id ?? Number((await q.query<{ v: number }>(`SELECT nextval('click_prepare_seq') AS v`)).rows[0].v);
      await q.query(`UPDATE orders SET provider_txn_id = $2, click_prepare_id = $3, status = 'pending' WHERE id = $1`, [order.id, p.click_trans_id, prepareId]);
      return reply(0, { merchant_prepare_id: prepareId });
    }

    if (String(order.click_prepare_id) !== String(p.merchant_prepare_id)) return reply(-6);
    // Click to'lov amalga oshmaganini bildirsa — buyurtma bekor qilinadi
    if (Number(p.error ?? 0) < 0) {
      await q.query(`UPDATE orders SET status = 'cancelled', cancel_time = $2 WHERE id = $1`, [order.id, Date.now()]);
      return reply(-9);
    }
    await q.query(`UPDATE orders SET status = 'paid', perform_time = $2 WHERE id = $1`, [order.id, Date.now()]);
    await activatePlan(q, order.user_id!, order.plan);
    return reply(0, { merchant_confirm_id: order.click_prepare_id });
  });
}

export function clickCheckoutUrl(opts: { serviceId: string; merchantId: string; orderId: string; amountTiyin: number; returnUrl: string }) {
  const u = new URL('https://my.click.uz/services/pay');
  u.searchParams.set('service_id', opts.serviceId);
  u.searchParams.set('merchant_id', opts.merchantId);
  u.searchParams.set('amount', (opts.amountTiyin / 100).toFixed(2));
  u.searchParams.set('transaction_param', opts.orderId);
  u.searchParams.set('return_url', opts.returnUrl);
  return u.toString();
}
