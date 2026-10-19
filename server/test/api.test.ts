import { beforeEach, describe, expect, it } from 'vitest';
import { createApp } from '../src/app.js';
import { clickSign } from '../src/billing/click.js';
import { PAYME_TIMEOUT_MS, handlePayme } from '../src/billing/payme.js';
import { createDb, migrate, type Db } from '../src/db/index.js';
import { loadEnv } from '../src/env.js';
import { ConsoleSms } from '../src/sms/index.js';

const env = loadEnv({
  JWT_SECRET: 'test-secret-test-secret-test-secret-123',
  PAYME_MERCHANT_ID: 'merchant123',
  PAYME_KEY: 'payme-key',
  CLICK_SERVICE_ID: '111',
  CLICK_MERCHANT_ID: '222',
  CLICK_SECRET_KEY: 'click-secret',
});

let db: Db;
let app: ReturnType<typeof createApp>;
let sms: ConsoleSms;

beforeEach(async () => {
  db = await createDb({});
  await migrate(db);
  sms = new ConsoleSms();
  app = createApp({ db, env, sms });
});

const json = (method: string, body?: unknown, token?: string, headers: Record<string, string> = {}) => ({
  method,
  headers: { 'content-type': 'application/json', ...(token ? { authorization: `Bearer ${token}` } : {}), ...headers },
  body: body === undefined ? undefined : JSON.stringify(body),
});

async function login(phone: string) {
  const otp = await (await app.request('/auth/otp', json('POST', { phone }))).json();
  const res = await app.request('/auth/verify', json('POST', { phone, code: otp.devCode }));
  return (await res.json()) as { access: string; refresh: string; user: { id: string }; isNew: boolean };
}

describe('kirish', () => {
  it('SMS kod bilan kirish, noto‘g‘ri kod va tokenni yangilash', async () => {
    const otp = await (await app.request('/auth/otp', json('POST', { phone: '+998 90 123 45 67' }))).json();
    expect(otp.phone).toBe('998901234567');
    expect(sms.sent[0].text).toContain(otp.devCode);
    const again = await app.request('/auth/otp', json('POST', { phone: '901234567' }));
    expect(again.status).toBe(429);
    const wrong = await app.request('/auth/verify', json('POST', { phone: '998901234567', code: otp.devCode === '000000' ? '111111' : '000000' }));
    expect(wrong.status).toBe(400);
    const ok = await (await app.request('/auth/verify', json('POST', { phone: '998901234567', code: otp.devCode }))).json();
    expect(ok.isNew).toBe(true);
    const me = await (await app.request('/me', json('GET', undefined, ok.access))).json();
    expect(me.user.phone).toBe('998901234567');
    expect(me.entitlements.pro.trial).toBe(true);
    const r1 = await (await app.request('/auth/refresh', json('POST', { refresh: ok.refresh }))).json();
    expect(r1.access).toBeTruthy();
    // eski yangilash tokeni qayta ishlamaydi
    expect((await app.request('/auth/refresh', json('POST', { refresh: ok.refresh }))).status).toBe(401);
    expect((await app.request('/me', json('GET'))).status).toBe(401);
  });

  it("noto'g'ri raqam rad etiladi", async () => {
    expect((await app.request('/auth/otp', json('POST', { phone: '12345' }))).status).toBe(400);
  });
});

describe('sinxronlash', () => {
  it('ikki qurilma, eng so‘nggi o‘zgarish yutadi, o‘chirish tarqaladi', async () => {
    const a = await login('998901111111');
    const push = (changes: unknown[], since = 0) => app.request('/sync', json('POST', { since, changes }, a.access)).then((r) => r.json());
    const r1 = await push([
      { kind: 'profile', id: 'me', updatedAt: 1000, data: { name: 'Aziz', goal: 'muscle' } },
      { kind: 'log', id: 'l1', updatedAt: 1000, data: { id: 'l1', startedAt: new Date().toISOString(), durationMin: 50 } },
    ]);
    expect(r1.docs).toHaveLength(2);
    // eskiroq o'zgarish yozilmaydi
    await push([{ kind: 'profile', id: 'me', updatedAt: 500, data: { name: 'Eski' } }]);
    // ikkinchi qurilma noldan
    const r2 = await push([], 0);
    expect(r2.docs.find((d: { kind: string }) => d.kind === 'profile').data.name).toBe('Aziz');
    const r3 = await push([{ kind: 'log', id: 'l1', updatedAt: 2000, deleted: true }], r2.cursor);
    expect(r3.docs).toEqual([expect.objectContaining({ kind: 'log', id: 'l1', deleted: true })]);
    // kelajakdagi vaqt cheklanadi
    const r4 = await push([{ kind: 'meta', id: 'state', updatedAt: Date.now() + 10 ** 9, data: {} }], r3.cursor);
    expect(r4.docs[0].updatedAt).toBeLessThan(Date.now() + 6 * 60 * 1000);
  });

  it('noto‘g‘ri hujjat turi rad etiladi', async () => {
    const a = await login('998901111112');
    const r = await app.request('/sync', json('POST', { changes: [{ kind: 'hack', id: 'x', updatedAt: 1 }] }, a.access));
    expect(r.status).toBe(400);
  });
});

describe('murabbiy rejimi', () => {
  it('taklif, mijozlar, dastur yuborish, xabar, ruxsatlar', async () => {
    const coach = await login('998902222222');
    const client = await login('998903333333');
    const stranger = await login('998904444444');
    // oddiy foydalanuvchi taklif yarata olmaydi
    expect((await app.request('/coach/invites', json('POST', {}, coach.access))).status).toBe(403);
    const me = await (await app.request('/me', json('PATCH', { role: 'coach', name: 'Murabbiy Bek' }, coach.access))).json();
    const coachToken = me.access;
    const { code } = await (await app.request('/coach/invites', json('POST', {}, coachToken))).json();
    expect(code).toMatch(/^[A-Z2-9]{6}$/);
    const join = await (await app.request('/coach/join', json('POST', { code: code.toLowerCase() }, client.access))).json();
    expect(join.coach.name).toBe('Murabbiy Bek');
    await app.request('/sync', json('POST', { changes: [{ kind: 'log', id: 'w1', updatedAt: 1, data: { startedAt: new Date().toISOString(), durationMin: 45 } }] }, client.access));
    const list = await (await app.request('/coach/clients', json('GET', undefined, coachToken))).json();
    expect(list.clients).toHaveLength(1);
    expect(list.clients[0]).toMatchObject({ workouts7d: 1, minutes7d: 45 });
    expect(list.clients[0].phone).toContain('•');
    const detail = await (await app.request(`/coach/clients/${client.user.id}`, json('GET', undefined, coachToken))).json();
    expect(detail.logs).toHaveLength(1);
    expect((await app.request(`/coach/clients/${client.user.id}`, json('GET', undefined, stranger.access))).status).toBe(404);
    // dastur yuborish -> mijoz sinxronlashda oladi
    expect((await app.request(`/coach/clients/${client.user.id}/program`, json('PUT', { program: { id: 'p1', days: [] } }, coachToken))).status).toBe(200);
    const pulled = await (await app.request('/sync', json('POST', { since: 0 }, client.access))).json();
    const prog = pulled.docs.find((d: { kind: string }) => d.kind === 'program');
    expect(prog.data.coach.name).toBe('Murabbiy Bek');
    await app.request(`/coach/clients/${client.user.id}/notes`, json('POST', { text: 'Barakalla, davom eting!' }, coachToken));
    const notes = await (await app.request('/notes', json('GET', undefined, client.access))).json();
    expect(notes.notes[0]).toMatchObject({ text: 'Barakalla, davom eting!', coach_name: 'Murabbiy Bek' });
    const meClient = await (await app.request('/me', json('GET', undefined, client.access))).json();
    expect(meClient.coach.name).toBe('Murabbiy Bek');
  });

  it('bepul murabbiy limiti', async () => {
    const coach = await login('998905555555');
    const token = (await (await app.request('/me', json('PATCH', { role: 'coach' }, coach.access))).json()).access;
    for (const [i, phone] of ['998905555001', '998905555002', '998905555003'].entries()) {
      const c = await login(phone);
      const { code } = await (await app.request('/coach/invites', json('POST', {}, token))).json();
      const r = await app.request('/coach/join', json('POST', { code }, c.access));
      expect(r.status).toBe(i < 2 ? 200 : 409);
    }
  });
});

describe('Payme', () => {
  const auth = { authorization: 'Basic ' + Buffer.from('Paycom:payme-key').toString('base64') };
  const rpc = (method: string, params: unknown, headers = auth) => app.request('/billing/payme', json('POST', { method, params, id: 7 }, undefined, headers)).then((r) => r.json());

  it("to'liq to'lov: tekshirish, yaratish, bajarish, obuna, bekor qilish", async () => {
    const u = await login('998906666666');
    const order = await (await app.request('/billing/orders', json('POST', { plan: 'pro_month', provider: 'payme' }, u.access))).json();
    expect(order.checkoutUrl).toContain('test.paycom.uz');
    const account = { order_id: order.orderId };
    expect((await rpc('CheckPerformTransaction', { amount: 2_900_000, account }, { authorization: 'Basic eDp5' })).error.code).toBe(-32504);
    expect((await rpc('CheckPerformTransaction', { amount: 100, account })).error.code).toBe(-31001);
    expect((await rpc('CheckPerformTransaction', { amount: 2_900_000, account: { order_id: '00000000-0000-0000-0000-000000000000' } })).error.code).toBe(-31050);
    expect((await rpc('CheckPerformTransaction', { amount: 2_900_000, account })).result.allow).toBe(true);
    const created = await rpc('CreateTransaction', { id: 'pm1', time: Date.now(), amount: 2_900_000, account });
    expect(created.result.state).toBe(1);
    expect((await rpc('CreateTransaction', { id: 'pm1', time: Date.now(), amount: 2_900_000, account })).result.state).toBe(1);
    // boshqa tranzaksiya shu buyurtmaga
    expect((await rpc('CreateTransaction', { id: 'pm2', time: Date.now(), amount: 2_900_000, account })).error.code).toBe(-31051);
    const performed = await rpc('PerformTransaction', { id: 'pm1' });
    expect(performed.result.state).toBe(2);
    expect((await rpc('PerformTransaction', { id: 'pm1' })).result.perform_time).toBe(performed.result.perform_time);
    const me = await (await app.request('/me', json('GET', undefined, u.access))).json();
    expect(me.entitlements.pro).toMatchObject({ active: true, trial: false });
    expect((await rpc('CheckTransaction', { id: 'pm1' })).result.state).toBe(2);
    const st = await rpc('GetStatement', { from: 0, to: Date.now() + 1000 });
    expect(st.result.transactions).toHaveLength(1);
    expect((await rpc('CancelTransaction', { id: 'pm1', reason: 5 })).result.state).toBe(-2);
    expect((await rpc('CheckTransaction', { id: 'pm1' })).result.reason).toBe(5);
    expect((await rpc('UnknownMethod', {})).error.code).toBe(-32601);
  });

  it('12 soatdan keyin bajarib bo‘lmaydi va bekor qilish saqlanadi', async () => {
    const u = await login('998906666667');
    const order = await (await app.request('/billing/orders', json('POST', { plan: 'pro_month', provider: 'payme' }, u.access))).json();
    const account = { order_id: order.orderId };
    const past = Date.now() - PAYME_TIMEOUT_MS - 1000;
    await handlePayme(db, { method: 'CreateTransaction', params: { id: 'old', time: past, amount: 2_900_000, account }, id: 1 }, past);
    expect((await rpc('PerformTransaction', { id: 'old' })).error.code).toBe(-31008);
    const check = await rpc('CheckTransaction', { id: 'old' });
    expect(check.result).toMatchObject({ state: -1, reason: 4 });
  });
});

describe('Click', () => {
  const post = (path: string, form: Record<string, string>) =>
    app.request(path, { method: 'POST', headers: { 'content-type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams(form).toString() }).then((r) => r.json());

  it("prepare va complete: imzo, summa va obuna", async () => {
    const u = await login('998907777777');
    const order = await (await app.request('/billing/orders', json('POST', { plan: 'coach_month', provider: 'click' }, u.access))).json();
    expect(order.checkoutUrl).toContain('my.click.uz');
    const base = { click_trans_id: '5001', service_id: '111', click_paydoc_id: '9', merchant_trans_id: order.orderId, amount: '99000.00', action: '0', error: '0', error_note: 'ok', sign_time: '2026-10-19 10:00:00' };
    const bad = await post('/billing/click/prepare', { ...base, sign_string: 'x' });
    expect(bad.error).toBe(-1);
    const wrongAmount = { ...base, amount: '100.00' };
    expect((await post('/billing/click/prepare', { ...wrongAmount, sign_string: clickSign(wrongAmount, 'click-secret', false) })).error).toBe(-2);
    const prep = await post('/billing/click/prepare', { ...base, sign_string: clickSign(base, 'click-secret', false) });
    expect(prep.error).toBe(0);
    const comp = { ...base, action: '1', merchant_prepare_id: String(prep.merchant_prepare_id) };
    const done = await post('/billing/click/complete', { ...comp, sign_string: clickSign(comp, 'click-secret', true) });
    expect(done).toMatchObject({ error: 0, merchant_confirm_id: prep.merchant_prepare_id });
    const again = await post('/billing/click/complete', { ...comp, sign_string: clickSign(comp, 'click-secret', true) });
    expect(again.error).toBe(-4);
    const me = await (await app.request('/me', json('GET', undefined, u.access))).json();
    expect(me.entitlements.coach.active).toBe(true);
    expect(me.entitlements.pro.active).toBe(true);
  });
});
