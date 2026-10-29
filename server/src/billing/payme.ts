// Payme Merchant API (JSON-RPC): Payme serveri buyurtmani tekshiradi, tranzaksiya yaratadi,
// bajaradi yoki bekor qiladi. Hujjat: developer.help.paycom.uz — "Merchant API".
import type { Db, Queryable } from '../db/index.js';
import { safeEqual } from '../lib/crypto.js';
import { activatePlan, revokePlan } from './subscription.js';

/** Tranzaksiya yaratilgandan keyin bajarish uchun muddat — 12 soat */
export const PAYME_TIMEOUT_MS = 12 * 60 * 60 * 1000;

interface RpcError {
  code: number;
  message: { uz: string; ru: string; en: string };
  data?: string;
}

const err = (code: number, uz: string, ru: string, en: string, data?: string): RpcError => ({ code, message: { uz, ru, en }, data });

const E = {
  auth: () => err(-32504, 'Ruxsat yo‘q', 'Недостаточно привилегий', 'Insufficient privileges'),
  method: () => err(-32601, 'Metod topilmadi', 'Метод не найден', 'Method not found'),
  parse: () => err(-32700, 'So‘rov noto‘g‘ri', 'Ошибка разбора', 'Parse error'),
  invalid: () => err(-32600, 'So‘rovda majburiy maydonlar yo‘q yoki turi noto‘g‘ri', 'Неверный RPC-запрос', 'Invalid request'),
  system: () => err(-32400, 'Tizim xatosi', 'Системная ошибка', 'System error'),
  amount: () => err(-31001, 'Summa noto‘g‘ri', 'Неверная сумма', 'Incorrect amount'),
  notFound: () => err(-31003, 'Tranzaksiya topilmadi', 'Транзакция не найдена', 'Transaction not found'),
  cantPerform: () => err(-31008, 'Amalni bajarib bo‘lmaydi', 'Невозможно выполнить операцию', 'Unable to perform operation'),
  cantCancel: () => err(-31007, 'Bekor qilib bo‘lmaydi', 'Невозможно отменить транзакцию', 'Unable to cancel transaction'),
  order: () => err(-31050, 'Buyurtma topilmadi', 'Заказ не найден', 'Order not found', 'order_id'),
  orderBusy: () => err(-31051, 'Buyurtma to‘lanmoqda yoki to‘langan', 'Заказ уже оплачивается или оплачен', 'Order is being paid or already paid', 'order_id'),
};

/** Marshrut (routes/billing.ts) uchun: handlePayme'dan tashqaridagi xatolar ham JSON-RPC ko'rinishida */
export const paymeError = (kind: 'auth' | 'parse' | 'invalid' | 'system'): RpcError => E[kind]();

interface OrderRow {
  id: string;
  /** akkaunt o'chirilgan bo'lsa — null (to'lov yozuvi qoladi) */
  user_id: string | null;
  plan: string;
  amount_tiyin: number;
  provider: string;
  status: string;
  provider_txn_id: string | null;
  provider_state: number | null;
  provider_create_time: number | null;
  perform_time: number | null;
  cancel_time: number | null;
  cancel_reason: number | null;
}

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

async function orderById(q: Queryable, id: unknown): Promise<OrderRow | null> {
  if (typeof id !== 'string' || !UUID.test(id)) return null;
  const { rows } = await q.query<OrderRow>(`SELECT * FROM orders WHERE id = $1 AND provider = 'payme' FOR UPDATE`, [id]);
  return rows[0] ?? null;
}

async function orderByTxn(q: Queryable, txn: unknown): Promise<OrderRow | null> {
  if (typeof txn !== 'string') return null;
  const { rows } = await q.query<OrderRow>(`SELECT * FROM orders WHERE provider_txn_id = $1 AND provider = 'payme' FOR UPDATE`, [txn]);
  return rows[0] ?? null;
}

/** Buyurtma va summani tekshirish (CheckPerformTransaction va CreateTransaction uchun umumiy) */
function checkOrder(order: OrderRow | null, amount: unknown): RpcError | null {
  // akkaunt o'chirilgan — to'lanadigan hisob yo'q
  if (!order || !order.user_id) return E.order();
  if (order.status === 'paid' || order.status === 'cancelled') return E.orderBusy();
  if (typeof amount !== 'number' || amount !== Number(order.amount_tiyin)) return E.amount();
  return null;
}

export function paymeAuthorized(header: string | undefined, key: string | undefined): boolean {
  if (!key || !header?.startsWith('Basic ')) return false;
  const decoded = Buffer.from(header.slice(6), 'base64').toString();
  const i = decoded.indexOf(':');
  return i > 0 && decoded.slice(0, i) === 'Paycom' && safeEqual(decoded.slice(i + 1), key);
}

export async function handlePayme(db: Db, body: unknown, now = Date.now()): Promise<{ result?: unknown; error?: RpcError; id: unknown }> {
  const req = body as { method?: string; params?: Record<string, unknown>; id?: unknown };
  const id = req?.id ?? null;
  if (!req || typeof req !== 'object' || typeof req.method !== 'string' || typeof req.params !== 'object' || !req.params) return { error: E.invalid(), id };
  const p = req.params;
  const isRpc = (e: unknown): e is RpcError => typeof (e as RpcError)?.code === 'number' && !!(e as RpcError).message?.uz;
  // RpcError tranzaksiya ichida qaytariladi (otilmaydi), aks holda muddat o'tgani uchun bekor qilish yozuvi ham qaytarib yuboriladi
  const out = await db.tx(async (q): Promise<{ ok: unknown } | { err: RpcError }> => {
    try {
      return { ok: await run(q) };
    } catch (e) {
      if (isRpc(e)) return { err: e };
      throw e;
    }
  });
  return 'err' in out ? { error: out.err, id } : { result: out.ok, id };

  async function run(q: Queryable): Promise<unknown> {
    switch (req.method) {
      case 'CheckPerformTransaction': {
        const order = await orderById(q, (p.account as Record<string, unknown>)?.order_id);
        const e = checkOrder(order, p.amount);
        if (e) throw e;
        if (order!.provider_state === 1) throw E.orderBusy();
        return { allow: true };
      }
      case 'CreateTransaction': {
        if (typeof p.id !== 'string' || !p.id || p.id.length > 64) throw E.invalid();
        const existing = await orderByTxn(q, p.id);
        if (existing) {
          if (existing.provider_state !== 1) throw E.cantPerform();
          if (now - Number(existing.provider_create_time) > PAYME_TIMEOUT_MS) {
            await q.query(`UPDATE orders SET provider_state = -1, cancel_time = $2, cancel_reason = 4, status = 'cancelled' WHERE id = $1`, [existing.id, now]);
            throw E.cantPerform();
          }
          return { create_time: Number(existing.provider_create_time), transaction: existing.id, state: 1 };
        }
        const order = await orderById(q, (p.account as Record<string, unknown>)?.order_id);
        const e = checkOrder(order, p.amount);
        if (e) throw e;
        // shu buyurtma bo'yicha boshqa tranzaksiya kutilmoqda
        if (order!.provider_state === 1) throw E.orderBusy();
        await q.query(`UPDATE orders SET provider_txn_id = $2, provider_state = 1, provider_create_time = $3, status = 'pending' WHERE id = $1`, [order!.id, p.id, now]);
        return { create_time: now, transaction: order!.id, state: 1 };
      }
      case 'PerformTransaction': {
        const o = await orderByTxn(q, p.id);
        if (!o) throw E.notFound();
        if (o.provider_state === 2) return { transaction: o.id, perform_time: Number(o.perform_time), state: 2 };
        if (o.provider_state !== 1 || !o.user_id) throw E.cantPerform();
        if (now - Number(o.provider_create_time) > PAYME_TIMEOUT_MS) {
          await q.query(`UPDATE orders SET provider_state = -1, cancel_time = $2, cancel_reason = 4, status = 'cancelled' WHERE id = $1`, [o.id, now]);
          throw E.cantPerform();
        }
        await q.query(`UPDATE orders SET provider_state = 2, perform_time = $2, status = 'paid' WHERE id = $1`, [o.id, now]);
        await activatePlan(q, o.user_id!, o.plan);
        return { transaction: o.id, perform_time: now, state: 2 };
      }
      case 'CancelTransaction': {
        const o = await orderByTxn(q, p.id);
        if (!o) throw E.notFound();
        if (o.provider_state === -1 || o.provider_state === -2) return { transaction: o.id, cancel_time: Number(o.cancel_time), state: o.provider_state };
        const reason = typeof p.reason === 'number' ? p.reason : null;
        if (o.provider_state === 1) {
          await q.query(`UPDATE orders SET provider_state = -1, cancel_time = $2, cancel_reason = $3, status = 'cancelled' WHERE id = $1`, [o.id, now, reason]);
          return { transaction: o.id, cancel_time: now, state: -1 };
        }
        if (o.provider_state === 2) {
          // to'lov qaytarildi — obuna kunlari olib tashlanadi
          await q.query(`UPDATE orders SET provider_state = -2, cancel_time = $2, cancel_reason = $3, status = 'cancelled' WHERE id = $1`, [o.id, now, reason]);
          if (o.user_id) await revokePlan(q, o.user_id, o.plan);
          return { transaction: o.id, cancel_time: now, state: -2 };
        }
        throw E.cantCancel();
      }
      case 'CheckTransaction': {
        const o = await orderByTxn(q, p.id);
        if (!o) throw E.notFound();
        return {
          create_time: Number(o.provider_create_time),
          perform_time: Number(o.perform_time ?? 0),
          cancel_time: Number(o.cancel_time ?? 0),
          transaction: o.id,
          state: o.provider_state,
          reason: o.cancel_reason ?? null,
        };
      }
      case 'GetStatement': {
        if (typeof p.from !== 'number' || typeof p.to !== 'number' || !Number.isFinite(p.from) || !Number.isFinite(p.to)) throw E.invalid();
        const { rows } = await q.query<OrderRow>(`SELECT * FROM orders WHERE provider = 'payme' AND provider_create_time BETWEEN $1 AND $2 ORDER BY provider_create_time`, [
          Number(p.from),
          Number(p.to),
        ]);
        return {
          transactions: rows.map((o) => ({
            id: o.provider_txn_id,
            time: Number(o.provider_create_time),
            amount: Number(o.amount_tiyin),
            account: { order_id: o.id },
            create_time: Number(o.provider_create_time),
            perform_time: Number(o.perform_time ?? 0),
            cancel_time: Number(o.cancel_time ?? 0),
            transaction: o.id,
            state: o.provider_state,
            reason: o.cancel_reason ?? null,
          })),
        };
      }
      default:
        throw E.method();
    }
  }
}

/** Foydalanuvchini Payme to'lov sahifasiga yuborish uchun havola */
export function paymeCheckoutUrl(opts: { merchantId: string; orderId: string; amountTiyin: number; returnUrl: string; test: boolean }) {
  const params = `m=${opts.merchantId};ac.order_id=${opts.orderId};a=${opts.amountTiyin};c=${opts.returnUrl};l=uz`;
  const base = opts.test ? 'https://test.paycom.uz' : 'https://checkout.paycom.uz';
  return `${base}/${Buffer.from(params).toString('base64')}`;
}
