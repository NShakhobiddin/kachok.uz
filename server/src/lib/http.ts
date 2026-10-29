// HTTP yordamchilari: xatolar, so'rov tanasini tekshirish, mijoz IP manzili, cheklovchi va loglarni tozalash.
import { getConnInfo } from '@hono/node-server/conninfo';
import type { Context, MiddlewareHandler } from 'hono';
import type { ZodError, ZodTypeAny, z } from 'zod';

export const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
export const isUuid = (s: unknown): s is string => typeof s === 'string' && UUID_RE.test(s);

/** Mijozga tushunarli javob bilan tugaydigan xato (app.onError JSON qilib qaytaradi) */
export class ApiError extends Error {
  constructor(
    public status: 400 | 401 | 402 | 403 | 404 | 409 | 413 | 429 | 502 | 503,
    public code: string,
    message: string,
  ) {
    super(message);
  }
}

export function zodMessage(e: ZodError): string {
  const i = e.issues[0];
  if (!i) return 'Ma’lumot noto‘g‘ri';
  return `Ma’lumot noto‘g‘ri${i.path.length ? ` (${i.path.join('.')})` : ''}: ${i.message}`;
}

/** JSON tanani o'qish; buzilgan JSON — 400 (500 emas) */
export async function readJson(c: Context): Promise<unknown> {
  try {
    return await c.req.json();
  } catch (e) {
    if ((e as Error)?.name === 'BodyLimitError') throw e;
    throw new ApiError(400, 'bad_json', 'So‘rov noto‘g‘ri: JSON kutilgan');
  }
}

/** JSON tanani o'qib, zod sxemasi bilan tekshirish; mos kelmasa — 400 */
export async function readBody<T extends ZodTypeAny>(c: Context, schema: T): Promise<z.infer<T>> {
  const r = schema.safeParse(await readJson(c));
  if (!r.success) throw new ApiError(400, 'bad_request', zodMessage(r.error));
  return r.data;
}

/** IPv6 manzilni /64 tarmoqqa qisqartirish: bitta abonent odatda butun /64 ga ega, aks holda cheklovni aylanib o'tish oson */
function ipv6Net(ip: string): string {
  const addr = ip.split('%')[0].toLowerCase();
  const [head, tail] = addr.split('::');
  const h = head ? head.split(':') : [];
  const t = tail ? tail.split(':') : [];
  const groups = addr.includes('::') ? [...h, ...Array(Math.max(0, 8 - h.length - t.length)).fill('0'), ...t] : h;
  return groups
    .slice(0, 4)
    .map((g) => (parseInt(g, 16) || 0).toString(16))
    .join(':') + '::/64';
}

function normIp(raw: string): string {
  let ip = raw.trim().slice(0, 64);
  if (ip.startsWith('[')) ip = ip.slice(1, ip.indexOf(']') > 0 ? ip.indexOf(']') : undefined);
  if (ip.toLowerCase().startsWith('::ffff:') && ip.includes('.')) return ip.slice(7);
  return ip.includes(':') ? ipv6Net(ip) : ip;
}

/**
 * Mijoz manzili. Odatda — TCP soket manzili (uni soxtalashtirib bo'lmaydi).
 * TRUST_PROXY=1 bo'lsa — X-Forwarded-For'ning eng o'ngidagi qiymati (uni bizning proksi qo'shadi; chapdagilarini mijoz yozishi mumkin).
 */
export function clientIp(c: Context, trustProxy: boolean): string {
  if (trustProxy) {
    const hops = (c.req.header('x-forwarded-for') ?? '')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    if (hops.length) return normIp(hops[hops.length - 1]);
  }
  try {
    const a = getConnInfo(c).remote.address;
    if (a) return normIp(a);
  } catch {
    // app.request() (testlar) — soket yo'q
  }
  return 'unknown';
}

/** Kalitlar soni shundan oshsa — muddati o'tganlari tozalanadi */
const SWEEP_AT = 10_000;
/** Xotira chegarasi: muddati o'tmaganlar ham shundan oshsa — eng eskilari chiqariladi */
const HARD_MAX = 100_000;

/** Xotiradagi oddiy cheklovchi: `key` bo'yicha `windowMs` ichida ko'pi bilan `max` so'rov */
export function rateLimit<E extends { Variables: object }>(max: number, windowMs: number, key: (c: Context<E>) => string): MiddlewareHandler<E> {
  const hits = new Map<string, { n: number; t: number }>();
  let lastSweep = 0;
  return async (c, next) => {
    const now = Date.now();
    if (hits.size >= SWEEP_AT && now - lastSweep > 1000) {
      lastSweep = now;
      for (const [k, h] of hits) if (now - h.t >= windowMs) hits.delete(k);
    }
    while (hits.size >= HARD_MAX) hits.delete(hits.keys().next().value as string);
    const k = key(c);
    const h = hits.get(k);
    if (!h || now - h.t >= windowMs) {
      hits.delete(k);
      hits.set(k, { n: 1, t: now });
    } else if (++h.n > max) {
      c.header('Retry-After', String(Math.max(1, Math.ceil((h.t + windowMs - now) / 1000))));
      return c.json({ error: 'rate_limited', message: 'Juda ko‘p urinish. Birozdan so‘ng qayta urinib ko‘ring.' }, 429);
    }
    await next();
  };
}

/** Logga yozishdan oldin xatodan shaxsiy ma'lumotlarni olib tashlash (telefon raqamlari, pg `detail` va parametrlar) */
export function scrubError(e: unknown): string {
  const err = e as { name?: string; message?: string; code?: string; constraint?: string; stack?: string };
  const mask = (s: string) => s.replace(/\+?\d[\d\s()-]{6,}\d/g, '[raqam]');
  const head = `${err?.name ?? 'Error'}${err?.code ? ` [${err.code}]` : ''}${err?.constraint ? ` (${err.constraint})` : ''}: ${mask(String(err?.message ?? e))}`;
  const frames = (err?.stack ?? '')
    .split('\n')
    .filter((l) => /^\s+at /.test(l))
    .slice(0, 8)
    .join('\n');
  return frames ? `${head}\n${frames}` : head;
}
