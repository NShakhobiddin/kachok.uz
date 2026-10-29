// Xavfsizlik auditi topilmalari uchun regressiya testlari (har bir blok — audit bandi raqami).
import { readFileSync } from 'node:fs';
import type { AddressInfo } from 'node:net';
import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { describe, expect, it, vi } from 'vitest';
import { createApp } from '../src/app.js';
import { clickSign } from '../src/billing/click.js';
import { createDb, migrate, type Db, type Queryable } from '../src/db/index.js';
import { loadEnv } from '../src/env.js';
import { rateLimit, scrubError } from '../src/lib/http.js';
import { MAX_FAILS_PER_DAY } from '../src/routes/auth.js';
import { ConsoleSms } from '../src/sms/index.js';

const SECRET = 'Qm9yZXRo-7uKx2LpV9aN3cW8dT5fH1jS6gZ4bY0eR';
const baseEnv = {
  JWT_SECRET: SECRET,
  DEV_MODE: '1',
  TRUST_PROXY: '1',
  PAYME_MERCHANT_ID: 'merchant123',
  PAYME_KEY: 'payme-key',
  PAYME_TEST: '1',
  CLICK_SERVICE_ID: '111',
  CLICK_MERCHANT_ID: '222',
  CLICK_SECRET_KEY: 'click-secret',
};

async function setup(extra: Record<string, string> = {}, wrap?: (db: Db) => Db) {
  const env = loadEnv({ ...baseEnv, ...extra });
  const raw = await createDb({});
  await migrate(raw);
  const db = wrap ? wrap(raw) : raw;
  const sms = new ConsoleSms(false);
  const app = createApp({ db, env, sms });
  return { env, db: raw, sms, app };
}
type App = ReturnType<typeof createApp>;

let ipSeq = 0;
/** Har bir "mijoz" uchun alohida IP (TRUST_PROXY=1): IP cheklovi boshqa tekshiruvlarga xalaqit bermasin */
const ip = () => `10.${(++ipSeq >> 16) & 255}.${(ipSeq >> 8) & 255}.${ipSeq & 255}`;
const xff = () => ({ 'x-forwarded-for': ip() });

const json = (method: string, body?: unknown, token?: string, headers: Record<string, string> = {}) => ({
  method,
  headers: { 'content-type': 'application/json', ...(token ? { authorization: `Bearer ${token}` } : {}), ...headers },
  body: body === undefined ? undefined : JSON.stringify(body),
});
const call = async (app: App, path: string, init: RequestInit) => {
  const r = await app.request(path, init);
  return { status: r.status, body: (await r.json().catch(() => null)) as Record<string, any> };
};

async function login(app: App, phone: string) {
  const h = xff();
  const otp = await (await app.request('/auth/otp', json('POST', { phone }, undefined, h))).json();
  const res = await app.request('/auth/verify', json('POST', { phone, code: otp.devCode }, undefined, h));
  return (await res.json()) as { access: string; refresh: string; user: { id: string }; isNew: boolean };
}
async function mkCoach(app: App, phone: string) {
  const c = await login(app, phone);
  const me = await (await app.request('/me', json('PATCH', { role: 'coach', name: 'Murabbiy' }, c.access))).json();
  return { ...c, access: me.access as string };
}
async function invite(app: App, coachToken: string) {
  return (await (await app.request('/coach/invites', json('POST', {}, coachToken))).json()).code as string;
}

const paymeAuth = { authorization: 'Basic ' + Buffer.from('Paycom:payme-key').toString('base64') };
const rpc = (app: App, method: string, params: unknown, id: unknown = 1) => app.request('/billing/payme', json('POST', { method, params, id }, undefined, paymeAuth)).then((r) => r.json());
async function buy(app: App, token: string, plan: 'pro_month' | 'coach_month', txn: string) {
  const order = await (await app.request('/billing/orders', json('POST', { plan, provider: 'payme' }, token))).json();
  const amount = plan === 'pro_month' ? 2_900_000 : 9_900_000;
  await rpc(app, 'CreateTransaction', { id: txn, time: Date.now(), amount, account: { order_id: order.orderId } });
  expect((await rpc(app, 'PerformTransaction', { id: txn })).result.state).toBe(2);
  return order.orderId as string;
}

const validProgram = (over: Record<string, unknown> = {}) => ({
  id: 'p1',
  name: 'Butun tana',
  split: 'Butun tana',
  startDate: '2026-10-01',
  mesoWeeks: 5,
  days: [{ id: 'd1', title: 'A kun', weekday: 0, exercises: [{ exerciseId: 'squat', sets: 3, repMin: 6, repMax: 10, rir: 2, restSec: 150 }] }],
  ...over,
});

/** Haqiqiy HTTP server (soket manzili bilan) */
async function listen(app: App) {
  return new Promise<{ base: string; close: () => void }>((res) => {
    const server = serve({ fetch: app.fetch, port: 0, hostname: '127.0.0.1' }, (info: AddressInfo) => res({ base: `http://127.0.0.1:${info.port}`, close: () => server.close() }));
  });
}

describe('1. OTP: bir vaqtdagi /auth/verify', () => {
  it('parallel taxminlar 5 tadan oshmaydi; kunlik xato chegarasi kod qayta yuborilganda ham saqlanadi', async () => {
    const { app, sms, db } = await setup();
    const phone = '998901234567';
    const h = xff();
    await app.request('/auth/otp', json('POST', { phone }, undefined, h));
    const real = sms.sent[0].text.match(/(\d{6})/)![1];
    const guesses: string[] = [];
    for (let i = 0; guesses.length < 199; i++) if (String(i).padStart(6, '0') !== real) guesses.push(String(i).padStart(6, '0'));
    guesses.push(real);
    const rs = await Promise.all(guesses.map((code) => call(app, '/auth/verify', json('POST', { phone, code }, undefined, xff()))));
    const evaluated = rs.filter((r) => r.body.error === 'wrong_code' || r.status === 200).length;
    expect(evaluated).toBeLessThanOrEqual(5);
    expect(rs.at(-1)!.status).not.toBe(200);

    // yangi kod so'rash kunlik xato hisoblagichini nolga tushirmaydi
    const resend = async () => {
      await db.query(`UPDATE phone_limits SET last_sent_at = now() - interval '2 minutes', hour_start = now() - interval '2 hours'`);
      return (await (await app.request('/auth/otp', json('POST', { phone }, undefined, h))).json()).devCode as string;
    };
    let code = await resend();
    let wrong = rs.filter((r) => r.body.error === 'wrong_code').length;
    for (let i = 0; i < 30 && wrong < MAX_FAILS_PER_DAY; i++) {
      const r = await call(app, '/auth/verify', json('POST', { phone, code: code === '000000' ? '111111' : '000000' }, undefined, h));
      if (r.body.error === 'wrong_code') wrong++;
      else code = await resend();
    }
    expect(wrong).toBe(MAX_FAILS_PER_DAY);
    code = await resend();
    const locked = await call(app, '/auth/verify', json('POST', { phone, code }, undefined, h));
    expect(locked.status).toBe(429);
    expect(locked.body.error).toBe('locked');
  });

  it('to‘g‘ri kod faqat bir marta ishlaydi', async () => {
    const { app } = await setup();
    const phone = '998901234500';
    const otp = await (await app.request('/auth/otp', json('POST', { phone }, undefined, xff()))).json();
    const rs = await Promise.all([1, 2, 3, 4].map(() => call(app, '/auth/verify', json('POST', { phone, code: otp.devCode }, undefined, xff()))));
    expect(rs.filter((r) => r.status === 200)).toHaveLength(1);
    expect(rs.some((r) => r.status === 500)).toBe(false);
  });
});

describe('2. Cheklovchi va SMS byudjeti', () => {
  it('TRUST_PROXY=0: X-Forwarded-For e’tiborga olinmaydi, soket manzili ishlatiladi', async () => {
    const { app } = await setup({ TRUST_PROXY: '0' });
    const srv = await listen(app);
    try {
      const statuses: number[] = [];
      for (let i = 0; i < 21; i++) {
        const r = await fetch(`${srv.base}/auth/otp`, json('POST', { phone: `99890100${String(i).padStart(4, '0')}` }, undefined, { 'x-forwarded-for': `6.6.6.${i}` }));
        statuses.push(r.status);
      }
      expect(statuses.slice(0, 20).every((s) => s === 200)).toBe(true);
      expect(statuses[20]).toBe(429);
    } finally {
      srv.close();
    }
  });

  it('TRUST_PROXY=1: faqat eng o‘ngdagi (proksi yozgan) manzil hisoblanadi', async () => {
    const { app } = await setup();
    const statuses: number[] = [];
    for (let i = 0; i < 21; i++)
      statuses.push((await app.request('/auth/otp', json('POST', { phone: `99890200${String(i).padStart(4, '0')}` }, undefined, { 'x-forwarded-for': `6.6.6.${i}, 203.0.113.7` }))).status);
    expect(statuses[20]).toBe(429);
    const other = await app.request('/auth/otp', json('POST', { phone: '998902009999' }, undefined, { 'x-forwarded-for': '6.6.6.1, 203.0.113.8' }));
    expect(other.status).toBe(200);
  });

  it('raqam bo‘yicha SMS: soatiga 5, kuniga 10', async () => {
    const { app, db, sms } = await setup();
    const phone = '998903000001';
    const send = () => call(app, '/auth/otp', json('POST', { phone }, undefined, xff()));
    const skip60s = () => db.query(`UPDATE phone_limits SET last_sent_at = now() - interval '2 minutes'`);
    for (let i = 0; i < 5; i++) {
      expect((await send()).status).toBe(200);
      await skip60s();
    }
    expect((await send()).body.error).toBe('too_many');
    await db.query(`UPDATE phone_limits SET hour_start = now() - interval '2 hours'`);
    for (let i = 0; i < 5; i++) {
      expect((await send()).status).toBe(200);
      await skip60s();
    }
    await db.query(`UPDATE phone_limits SET hour_start = now() - interval '2 hours'`);
    const r = await send();
    expect(r.status).toBe(429);
    expect(r.body.message).toContain('Bugun');
    expect(sms.sent).toHaveLength(10);
  });

  it('umumiy soatlik SMS byudjeti (SMS_GLOBAL_PER_HOUR)', async () => {
    const { app, sms } = await setup({ SMS_GLOBAL_PER_HOUR: '3' });
    const rs: number[] = [];
    for (let i = 0; i < 5; i++) rs.push((await app.request('/auth/otp', json('POST', { phone: `99890400000${i}` }, undefined, xff()))).status);
    expect(rs).toEqual([200, 200, 200, 503, 503]);
    expect(sms.sent).toHaveLength(3);
  });

  it('ko‘p kalit kelganda faqat muddati o‘tganlari tozalanadi (hamma hisoblagich nolga tushmaydi)', async () => {
    let key = 'victim';
    const app = new Hono();
    app.use(
      '*',
      rateLimit(1, 60 * 60 * 1000, () => key),
    );
    app.get('/', (c) => c.text('ok'));
    expect((await app.request('/')).status).toBe(200);
    expect((await app.request('/')).status).toBe(429);
    for (let i = 0; i < 10_050; i++) {
      key = `k${i}`;
      await app.request('/');
    }
    key = 'victim';
    expect((await app.request('/')).status).toBe(429);
  });
});

describe('3. So‘rov hajmi', () => {
  const big = (n: number) => JSON.stringify({ phone: '998901234567', pad: 'x'.repeat(n) });

  it('odatiy marshrutlarda 64 KB dan katta tana — 413 (Content-Length bilan ham, oqim bilan ham)', async () => {
    const { app } = await setup();
    expect((await app.request('/auth/otp', { method: 'POST', headers: { 'content-type': 'application/json', ...xff() }, body: big(100_000) })).status).toBe(413);
    const bytes = new TextEncoder().encode(big(100_000));
    const stream = new ReadableStream({
      start(ctl) {
        for (let i = 0; i < bytes.length; i += 8192) ctl.enqueue(bytes.subarray(i, i + 8192));
        ctl.close();
      },
    });
    const r = await app.request('/auth/refresh', { method: 'POST', headers: { 'content-type': 'application/json' }, body: stream, duplex: 'half' } as RequestInit);
    expect(r.status).toBe(413);
  });

  it('/sync kattaroq tanani qabul qiladi', async () => {
    const { app } = await setup();
    const u = await login(app, '998903100001');
    const changes = Array.from({ length: 4 }, (_, i) => ({ kind: 'meta', id: `m${i}`, updatedAt: 1, data: { blob: 'x'.repeat(250_000) } }));
    expect((await app.request('/sync', json('POST', { changes }, u.access))).status).toBe(200);
  });

  it('Payme: ruxsat tanadan oldin tekshiriladi, katta tana — 413', async () => {
    const { app } = await setup();
    const bad = { authorization: 'Basic ' + Buffer.from('Paycom:wrong').toString('base64'), 'content-type': 'application/json' };
    // buzuq JSON + noto'g'ri ruxsat → parse xatosi emas, ruxsat xatosi (tana tahlil qilinmagan)
    const r1 = await (await app.request('/billing/payme', { method: 'POST', headers: bad, body: '{"id": 5, ' + 'x'.repeat(10_000) })).json();
    expect(r1.error.code).toBe(-32504);
    // kichik so'rovda id qaytariladi (JSON-RPC)
    const r2 = await (await app.request('/billing/payme', { method: 'POST', headers: bad, body: JSON.stringify({ method: 'CheckTransaction', params: {}, id: 77 }) })).json();
    expect(r2).toMatchObject({ error: { code: -32504 }, id: 77 });
    const r3 = await app.request('/billing/payme', { method: 'POST', headers: bad, body: 'x'.repeat(200_000) });
    expect(r3.status).toBe(413);
  });
});

describe('4–5. Sozlamalar', () => {
  it('namunaviy, qisqa va oddiy JWT_SECRET rad etiladi; .env.example o‘zgartirmasdan ishga tushmaydi', () => {
    const base = { DEV_MODE: '1' };
    expect(() => loadEnv({ ...base, JWT_SECRET: 'almashtiring-bu-yerga-uzun-tasodifiy-maxfiy-qator' })).toThrow(/namunaviy/);
    expect(() => loadEnv({ ...base, JWT_SECRET: 'short' })).toThrow(/32/);
    expect(() => loadEnv({ ...base, JWT_SECRET: 'ab'.repeat(30) })).toThrow(/oddiy/);
    expect(() => loadEnv({ ...base, JWT_SECRET: 'test-secret-test-secret-test-secret-123' })).toThrow(/oddiy/);
    expect(loadEnv({ ...base, JWT_SECRET: SECRET }).JWT_SECRET).toBe(SECRET);

    const ex: Record<string, string> = {};
    for (const l of readFileSync(new URL('../.env.example', import.meta.url), 'utf8').split('\n')) {
      const m = l.match(/^([A-Z_]+)=(.*)$/);
      if (m) ex[m[1]] = m[2];
    }
    expect(ex.JWT_SECRET).toBe('');
    expect(() => loadEnv(ex)).toThrow();
  });

  it('console SMS va devCode faqat DEV_MODE=1 bilan; production’da DEV_MODE taqiqlangan', async () => {
    expect(() => loadEnv({ JWT_SECRET: SECRET })).toThrow(/DEV_MODE/);
    expect(() => loadEnv({ JWT_SECRET: SECRET, DEV_MODE: '1', NODE_ENV: 'production' })).toThrow(/DEV_MODE/);
    expect(() => loadEnv({ JWT_SECRET: SECRET, SMS_PROVIDER: 'eskiz', ESKIZ_EMAIL: 'a', ESKIZ_PASSWORD: 'b', NODE_ENV: 'production' })).not.toThrow();
    // eskiz provayderida javobda kod yo'q
    const env = loadEnv({ JWT_SECRET: SECRET, SMS_PROVIDER: 'eskiz', ESKIZ_EMAIL: 'a', ESKIZ_PASSWORD: 'b', TRUST_PROXY: '1' });
    const db = await createDb({});
    await migrate(db);
    const app = createApp({ db, env, sms: new ConsoleSms(false) });
    const r = await (await app.request('/auth/otp', json('POST', { phone: '998901112233' }, undefined, xff()))).json();
    expect(r.ok).toBe(true);
    expect(r.devCode).toBeUndefined();
    const pkg = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'));
    expect(pkg.scripts.start).toContain('NODE_ENV=production');
  });

  it('Payme ulangan bo‘lsa PAYME_TEST aniq ko‘rsatilishi shart', () => {
    expect(() => loadEnv({ JWT_SECRET: SECRET, DEV_MODE: '1', PAYME_MERCHANT_ID: 'm', PAYME_KEY: 'k' })).toThrow(/PAYME_TEST/);
    expect(loadEnv({ JWT_SECRET: SECRET, DEV_MODE: '1', PAYME_MERCHANT_ID: 'm', PAYME_KEY: 'k', PAYME_TEST: '0' }).PAYME_TEST).toBe('0');
  });
});

describe('6. Murabbiy tarifi tugagach mijozlar chegarasi', () => {
  it('to‘lov qaytarilgach faqat birinchi 2 mijoz ochiq, qolganlari yopiq (402)', async () => {
    const { app } = await setup();
    const coach = await mkCoach(app, '998905000000');
    await buy(app, coach.access, 'coach_month', 'tx-coach');
    const ids: string[] = [];
    for (let i = 0; i < 4; i++) {
      const cl = await login(app, `99890500100${i}`);
      expect((await app.request('/coach/join', json('POST', { code: await invite(app, coach.access) }, cl.access))).status).toBe(200);
      await app.request('/sync', json('POST', { changes: [{ kind: 'log', id: 'w', updatedAt: 1, data: { startedAt: new Date().toISOString(), durationMin: 30 } }] }, cl.access));
      ids.push(cl.user.id);
    }
    expect((await rpc(app, 'CancelTransaction', { id: 'tx-coach', reason: 5 })).result.state).toBe(-2);
    const list = await (await app.request('/coach/clients', json('GET', undefined, coach.access))).json();
    expect(list.limit).toBe(2);
    expect(list.clients).toHaveLength(4);
    const locked = list.clients.filter((c: { locked: boolean }) => c.locked);
    expect(locked.map((c: { id: string }) => c.id).sort()).toEqual(ids.slice(2).sort());
    expect(locked.every((c: { workouts7d: number; goal: unknown }) => c.workouts7d === 0 && c.goal === null)).toBe(true);
    expect((await app.request(`/coach/clients/${ids[0]}`, json('GET', undefined, coach.access))).status).toBe(200);
    const detail = await call(app, `/coach/clients/${ids[3]}`, json('GET', undefined, coach.access));
    expect(detail.status).toBe(402);
    expect(detail.body.message).toContain('tarifi');
    expect((await app.request(`/coach/clients/${ids[3]}/program`, json('PUT', { program: validProgram() }, coach.access))).status).toBe(402);
    expect((await app.request(`/coach/clients/${ids[3]}/notes`, json('POST', { text: 'salom' }, coach.access))).status).toBe(402);
    // ortiqcha mijozni uzish mumkin
    expect((await app.request(`/coach/clients/${ids[3]}`, json('DELETE', undefined, coach.access))).status).toBe(200);
  });
});

describe('7. Sinxronlash: foydalanuvchi qulfi', () => {
  it('/sync va murabbiy dasturi yozuvi o‘qish bilan birga pg_advisory_xact_lock ostida', async () => {
    const log: string[] = [];
    const wrap = (db: Db): Db => ({
      query: (s, p) => {
        log.push(`q:${s.trim().slice(0, 40)}`);
        return db.query(s, p);
      },
      tx: (fn) =>
        db.tx((q: Queryable) =>
          fn({
            query: (s, p) => {
              log.push(`tx:${s.trim().slice(0, 40)}`);
              return q.query(s, p);
            },
          }),
        ),
      close: () => db.close(),
    });
    const { app } = await setup({}, wrap);
    const coach = await mkCoach(app, '998907000001');
    const cl = await login(app, '998907000002');
    await app.request('/coach/join', json('POST', { code: await invite(app, coach.access) }, cl.access));
    log.length = 0;
    await app.request('/sync', json('POST', { changes: [{ kind: 'meta', id: 'state', updatedAt: 1, data: {} }] }, cl.access));
    const lock = log.findIndex((l) => l.startsWith('tx:SELECT pg_advisory_xact_lock'));
    const write = log.findIndex((l) => l.startsWith('tx:INSERT INTO docs'));
    const read = log.findIndex((l) => l.startsWith('tx:SELECT kind, id, data'));
    expect(lock).toBeGreaterThanOrEqual(0);
    expect(lock).toBeLessThan(write);
    expect(write).toBeLessThan(read);
    log.length = 0;
    expect((await app.request(`/coach/clients/${cl.user.id}/program`, json('PUT', { program: validProgram() }, coach.access))).status).toBe(200);
    const lock2 = log.findIndex((l) => l.startsWith('tx:SELECT pg_advisory_xact_lock'));
    expect(lock2).toBeGreaterThanOrEqual(0);
    expect(lock2).toBeLessThan(log.findIndex((l) => l.startsWith('tx:INSERT INTO docs')));
  });
});

describe('8. Akkauntni o‘chirish', () => {
  it('qayta ro‘yxatdan o‘tganda bepul sinov berilmaydi, to‘lov yozuvlari saqlanadi', async () => {
    const { app } = await setup();
    const u = await login(app, '998906000000');
    expect(u.isNew).toBe(true);
    await buy(app, u.access, 'pro_month', 'pay1');
    expect((await app.request('/me', json('DELETE', undefined, u.access))).status).toBe(200);
    // muvaffaqiyatli kirishdan keyin darhol qayta kod so'rash mumkin (60 s kutish shart emas)
    const again = await login(app, '998906000000');
    expect(again.isNew).toBe(true);
    const me = await (await app.request('/me', json('GET', undefined, again.access))).json();
    expect(me.entitlements.pro).toMatchObject({ active: false, trial: false });
    // Payme hali ham tranzaksiyani topadi, qaytara oladi, hisobotda ko'radi
    expect((await rpc(app, 'CheckTransaction', { id: 'pay1' })).result.state).toBe(2);
    expect((await rpc(app, 'GetStatement', { from: 0, to: Date.now() + 1000 })).result.transactions).toHaveLength(1);
    expect((await rpc(app, 'CancelTransaction', { id: 'pay1', reason: 5 })).result.state).toBe(-2);
    // boshqa raqam — sinov bor
    const other = await login(app, '998906000001');
    expect((await (await app.request('/me', json('GET', undefined, other.access))).json()).entitlements.pro.trial).toBe(true);
  });

  it('o‘chirilgan akkauntning buyurtmasini to‘lab bo‘lmaydi (Payme -31050, Click -5)', async () => {
    const { app } = await setup();
    const u = await login(app, '998906100000');
    const payOrder = await (await app.request('/billing/orders', json('POST', { plan: 'pro_month', provider: 'payme' }, u.access))).json();
    const clickOrder = await (await app.request('/billing/orders', json('POST', { plan: 'pro_month', provider: 'click' }, u.access))).json();
    await app.request('/me', json('DELETE', undefined, u.access));
    expect((await rpc(app, 'CheckPerformTransaction', { amount: 2_900_000, account: { order_id: payOrder.orderId } })).error.code).toBe(-31050);
    const p = { click_trans_id: '1', service_id: '111', merchant_trans_id: clickOrder.orderId, amount: '29000.00', action: '0', sign_time: '2026-10-19 10:00:00' };
    const r = await app.request('/billing/click/prepare', {
      method: 'POST',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ ...p, sign_string: clickSign(p, 'click-secret', false) }).toString(),
    });
    expect((await r.json()).error).toBe(-5);
  });
});

describe('9. Bir vaqtdagi /auth/otp', () => {
  it('bitta raqamga bir vaqtda 30 so‘rov — faqat bitta SMS', async () => {
    const { app, sms } = await setup();
    const rs = await Promise.all(Array.from({ length: 30 }, () => app.request('/auth/otp', json('POST', { phone: '998977777777' }, undefined, xff())).then((r) => r.status)));
    expect(sms.sent).toHaveLength(1);
    expect(rs.filter((s) => s === 200)).toHaveLength(1);
    expect(rs.filter((s) => s === 429)).toHaveLength(29);
  });
});

describe('10. Buzuq mijoz hujjatlari', () => {
  it('/sync shakli noto‘g‘ri hujjatni rad etadi; bazadagi eski buzuq yozuv murabbiy ro‘yxatini yiqitmaydi', async () => {
    const { app, db } = await setup();
    const coach = await mkCoach(app, '998902222222');
    const cl = await login(app, '998903333332');
    await app.request('/coach/join', json('POST', { code: await invite(app, coach.access) }, cl.access));
    const push = (changes: unknown[]) => call(app, '/sync', json('POST', { changes }, cl.access));
    expect((await push([{ kind: 'log', id: 'x', updatedAt: 1, data: { startedAt: 'not-a-date', durationMin: 1 } }])).status).toBe(400);
    expect((await push([{ kind: 'program', id: 'current', updatedAt: 1, data: { days: 5 } }])).status).toBe(400);
    expect((await push([{ kind: 'food', id: '2026-10-01', updatedAt: 1, data: { id: 'f' } }])).status).toBe(400);
    expect((await push([{ kind: 'log', id: 'ok', updatedAt: 1, data: { startedAt: new Date().toISOString(), durationMin: 45.5, exercises: [] } }])).status).toBe(200);
    // migratsiyadan oldin yozilgan buzuq hujjatlar
    await db.query(
      `INSERT INTO docs (user_id, kind, id, data, updated_at) VALUES ($1, 'log', 'b1', '{"startedAt":"2026-13-45T99:99","durationMin":"abc"}', 1),
      ($1, 'log', 'b2', '"just a string"', 1), ($1, 'log', 'b3', '{"startedAt":"not-a-date","durationMin":1e400}', 1)`,
      [cl.user.id],
    );
    const r = await call(app, '/coach/clients', json('GET', undefined, coach.access));
    expect(r.status).toBe(200);
    expect(r.body.clients[0]).toMatchObject({ workouts7d: 1, minutes7d: 46 });
    const detail = await call(app, `/coach/clients/${cl.user.id}`, json('GET', undefined, coach.access));
    expect(detail.status).toBe(200);
    expect(detail.body.logs).toHaveLength(1);
  });
});

describe('11–12. Taklif kodlari', () => {
  it('8 belgili, bir martalik; /coach/join foydalanuvchi bo‘yicha cheklangan', async () => {
    const { app } = await setup();
    const coach = await mkCoach(app, '998905500000');
    await buy(app, coach.access, 'coach_month', 'tx-inv');
    const code = await invite(app, coach.access);
    expect(code).toMatch(/^[A-Z2-9]{8}$/);
    const a = await login(app, '998905500001');
    const b = await login(app, '998905500002');
    expect((await app.request('/coach/join', json('POST', { code }, a.access))).status).toBe(200);
    expect((await call(app, '/coach/join', json('POST', { code }, b.access))).body.error).toBe('bad_code');
    const statuses: number[] = [];
    for (let i = 0; i < 10; i++) statuses.push((await app.request('/coach/join', json('POST', { code: `ZZZZZZ${i}${i}` }, b.access))).status);
    expect(statuses.filter((s) => s === 429)).toHaveLength(1);
    expect((await app.request('/coach/join', json('POST', { code: await invite(app, coach.access) }, b.access))).status).toBe(429);
  });

  it('bir vaqtdagi qo‘shilishlar bepul murabbiy limitidan (2) oshmaydi', async () => {
    const { app } = await setup();
    const coach = await mkCoach(app, '998905555555');
    const clients = [];
    for (let i = 0; i < 8; i++) clients.push(await login(app, `99890555600${i}`));
    const codes: string[] = [];
    for (let i = 0; i < 8; i++) codes.push(await invite(app, coach.access));
    const rs = await Promise.all(clients.map((c, i) => app.request('/coach/join', json('POST', { code: codes[i] }, c.access)).then((r) => r.status)));
    expect(rs.filter((s) => s === 200)).toHaveLength(2);
    expect(rs.filter((s) => s === 409)).toHaveLength(6);
    const list = await (await app.request('/coach/clients', json('GET', undefined, coach.access))).json();
    expect(list.clients).toHaveLength(2);
  });
});

describe('13. Murabbiy dasturi sxemasi', () => {
  it('noto‘g‘ri shakl — 400, to‘g‘risi — 200', async () => {
    const { app } = await setup();
    const coach = await mkCoach(app, '998908100000');
    const cl = await login(app, '998908100001');
    await app.request('/coach/join', json('POST', { code: await invite(app, coach.access) }, cl.access));
    const put = (program: unknown) => app.request(`/coach/clients/${cl.user.id}/program`, json('PUT', { program }, coach.access)).then((r) => r.status);
    expect(await put({ days: 5 })).toBe(400);
    expect(await put({ days: [{}] })).toBe(400);
    expect(await put(validProgram({ days: [{ id: 'd1', title: 'A', weekday: 9, exercises: [] }] }))).toBe(400);
    const ex = (o: object) => validProgram({ days: [{ id: 'd1', title: 'A', weekday: 0, exercises: [{ exerciseId: 'squat', sets: 3, repMin: 6, repMax: 10, rir: 2, restSec: 150, ...o }] }] });
    expect(await put(ex({ sets: 50 }))).toBe(400);
    expect(await put(ex({ sets: 'many' }))).toBe(400);
    expect(await put(ex({ repMin: 12, repMax: 8 }))).toBe(400);
    expect(await put(validProgram())).toBe(200);
  });
});

describe('14. Yangilash tokeni', () => {
  it('bir vaqtda faqat bitta almashtirish; eski token qayta ishlatilsa — barcha sessiyalar yopiladi', async () => {
    const { app } = await setup();
    const a = await login(app, '998901112233');
    const rs = await Promise.all(Array.from({ length: 5 }, () => call(app, '/auth/refresh', json('POST', { refresh: a.refresh }))));
    const ok = rs.filter((r) => r.status === 200);
    expect(ok).toHaveLength(1);
    expect((await app.request('/auth/refresh', json('POST', { refresh: a.refresh }))).status).toBe(401);
    // o'g'irlangan token ishlatildi → yangi (avlod) token ham bekor
    expect((await app.request('/auth/refresh', json('POST', { refresh: ok[0].body.refresh }))).status).toBe(401);
  });
});

describe('15. Sportchiga qaytgan murabbiy', () => {
  it('murabbiy marshrutlari rol bo‘yicha yopiladi', async () => {
    const { app } = await setup();
    const coach = await mkCoach(app, '998908000000');
    const cl = await login(app, '998908000001');
    await app.request('/coach/join', json('POST', { code: await invite(app, coach.access) }, cl.access));
    const back = await (await app.request('/me', json('PATCH', { role: 'athlete' }, coach.access))).json();
    // eski (murabbiy) access token ham ishlamaydi — rol bazadan tekshiriladi
    for (const token of [back.access, coach.access]) {
      expect((await app.request(`/coach/clients/${cl.user.id}`, json('GET', undefined, token))).status).toBe(403);
      expect((await app.request('/coach/clients', json('GET', undefined, token))).status).toBe(403);
      expect((await app.request(`/coach/clients/${cl.user.id}/program`, json('PUT', { program: validProgram() }, token))).status).toBe(403);
      expect((await app.request('/coach/invites', json('POST', {}, token))).status).toBe(403);
    }
  });
});

describe('16. Foydalanuvchi kvotasi', () => {
  it('20 MB dan oshsa — 413 quota; o‘chirish har doim mumkin', async () => {
    const { app } = await setup();
    const u = await login(app, '998901999999');
    const batch = (b: number) => Array.from({ length: 15 }, (_, i) => ({ kind: 'meta', id: `m${b}-${i}`, updatedAt: 1, data: { blob: 'x'.repeat(250 * 1024 - 20) } }));
    let since = 0;
    const push = async (changes: unknown[]) => {
      const r = await call(app, '/sync', json('POST', { since, changes }, u.access));
      if (r.status === 200) since = r.body.cursor;
      return r;
    };
    for (let b = 0; b < 5; b++) expect((await push(batch(b))).status).toBe(200);
    const over = await push(batch(5));
    expect(over.status).toBe(413);
    expect(over.body.error).toBe('quota');
    const del = Array.from({ length: 10 }, (_, i) => ({ kind: 'meta', id: `m0-${i}`, updatedAt: 2, deleted: true }));
    expect((await push(del)).status).toBe(200);
    expect((await push(batch(5))).status).toBe(200);
    // javob sahifasi hajm bo'yicha bo'linadi: ~4 MB dan oshmaydi, qolgani `more`
    const first = await call(app, '/sync', json('POST', { since: 0 }, u.access));
    expect(first.body.more).toBe(true);
    expect(first.body.docs.length).toBeLessThanOrEqual(17);
    expect(first.body.docs.length).toBeGreaterThan(0);
    // bitta so'rovda 400 tadan ko'p o'zgarish — rad
    const many = Array.from({ length: 401 }, (_, i) => ({ kind: 'meta', id: `n${i}`, updatedAt: 1, data: {} }));
    expect((await app.request('/sync', json('POST', { changes: many }, u.access))).status).toBe(400);
  });
});

describe('17. Noto‘g‘ri kiritish — 4xx (500 emas)', () => {
  it('buzuq JSON, zod xatolari, UUID bo‘lmagan id, Payme xatolari', async () => {
    const { app } = await setup();
    const coach = await mkCoach(app, '998909000000');
    expect((await app.request('/auth/verify', { method: 'POST', headers: { 'content-type': 'application/json' }, body: '{bad' })).status).toBe(400);
    expect((await app.request('/auth/otp', { method: 'POST', headers: { 'content-type': 'application/json', ...xff() }, body: '{bad' })).status).toBe(400);
    expect((await app.request('/auth/refresh', json('POST', { refresh: 5 }))).status).toBe(400);
    expect((await app.request('/me', json('PATCH', { role: 'admin' }, coach.access))).status).toBe(400);
    expect((await app.request('/sync', { method: 'POST', headers: { authorization: `Bearer ${coach.access}` }, body: 'nope' })).status).toBe(400);
    expect((await app.request('/coach/clients/abc', json('GET', undefined, coach.access))).status).toBe(404);
    expect((await app.request('/coach/clients/abc/notes', json('GET', undefined, coach.access))).status).toBe(404);
    expect((await app.request('/coach/clients/abc', json('DELETE', undefined, coach.access))).status).toBe(404);
    expect((await app.request('/billing/orders/abc', json('GET', undefined, coach.access))).status).toBe(404);
    expect((await app.request('/billing/orders', json('POST', { plan: 1 }, coach.access))).status).toBe(400);
    const nf = await call(app, '/no/such/route', json('GET'));
    expect(nf).toMatchObject({ status: 404, body: { error: 'not_found' } });

    const st = await app.request('/billing/payme', json('POST', { method: 'GetStatement', params: {}, id: 9 }, undefined, paymeAuth));
    expect(st.status).toBe(200);
    expect(await st.json()).toMatchObject({ error: { code: -32600 }, id: 9 });
    expect((await rpc(app, 'CreateTransaction', { id: { x: 1 }, amount: 1, account: {} })).error.code).toBe(-32600);
    for (const body of ['{}', '[]', '5', 'null', '{"method":"CheckTransaction"}']) {
      const r = await app.request('/billing/payme', { method: 'POST', headers: { 'content-type': 'application/json', ...paymeAuth }, body });
      expect(r.status).toBe(200);
      expect((await r.json()).error.code).toBe(-32600);
    }
    const parse = await app.request('/billing/payme', { method: 'POST', headers: { 'content-type': 'application/json', ...paymeAuth }, body: '{bad' });
    expect((await parse.json()).error.code).toBe(-32700);
  });

  it('Click: summa son bo‘lmasa — -2', async () => {
    const { app } = await setup();
    const u = await login(app, '998909000001');
    const order = await (await app.request('/billing/orders', json('POST', { plan: 'pro_month', provider: 'click' }, u.access))).json();
    const p = { click_trans_id: '9', service_id: '111', merchant_trans_id: order.orderId, amount: 'abc', action: '0', sign_time: '2026-10-19 10:00:00' };
    const r = await app.request('/billing/click/prepare', {
      method: 'POST',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ ...p, sign_string: clickSign(p, 'click-secret', false) }).toString(),
    });
    expect((await r.json()).error).toBe(-2);
  });
});

describe('18. Loglarda shaxsiy ma’lumot yo‘q', () => {
  it('pg xatosining detail va telefon raqami logga tushmaydi', async () => {
    const pgErr = Object.assign(new Error('duplicate key value violates unique constraint "users_phone_key" for 998901234567'), {
      code: '23505',
      constraint: 'users_phone_key',
      detail: 'Key (phone)=(998901234567) already exists.',
    });
    const out = scrubError(pgErr);
    expect(out).not.toContain('998901234567');
    expect(out).not.toContain('Key (phone)');
    expect(out).toContain('23505');

    const wrap = (db: Db): Db => ({
      ...db,
      query: (s, p) => (s.startsWith('SELECT * FROM users WHERE id') ? Promise.reject(pgErr) : db.query(s, p)),
    });
    const { app } = await setup({}, wrap);
    const u = await login(app, '998901234567');
    const logged: string[] = [];
    const spy = vi.spyOn(console, 'error').mockImplementation((...a: unknown[]) => void logged.push(a.map(String).join(' ')));
    const r = await app.request('/me', json('GET', undefined, u.access));
    spy.mockRestore();
    expect(r.status).toBe(500);
    expect(logged.join('\n')).not.toMatch(/998901234567|Key \(phone\)/);
    expect(logged.join('\n')).toContain('/me');
  });
});

describe('19. docker-compose', () => {
  it('API faqat 127.0.0.1 da, Postgres paroli standart qiymatsiz', () => {
    const yml = readFileSync(new URL('../docker-compose.yml', import.meta.url), 'utf8');
    expect(yml).toMatch(/['"]127\.0\.0\.1:8787:8787['"]/);
    expect(yml).not.toMatch(/POSTGRES_PASSWORD:\s*kachok/);
    expect(yml).not.toContain('kachok:kachok@');
    expect(yml).toContain('${POSTGRES_PASSWORD:?');
  });
});
