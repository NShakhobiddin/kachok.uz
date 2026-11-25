import { beforeEach, describe, expect, it } from 'vitest';
import { createApp } from '../src/app.js';
import { createDb, migrate, type Db } from '../src/db/index.js';
import { loadEnv } from '../src/env.js';
import { signInitData, verifyInitData } from '../src/lib/telegram.js';
import { ConsoleSms, NoSms } from '../src/sms/index.js';

const BOT = '123456789:AAHk3vX9q-Zr8pL2mN5bC7dF1gH4jK6lQwE';
const env = loadEnv({ JWT_SECRET: 'Qm9yZXRo-7uKx2LpV9aN3cW8dT5fH1jS6gZ4bY0eR', DEV_MODE: '1', TELEGRAM_BOT_TOKEN: BOT });

let db: Db;
let app: ReturnType<typeof createApp>;

beforeEach(async () => {
  db = await createDb({});
  await migrate(db);
  app = createApp({ db, env, sms: new ConsoleSms(false) });
});

const json = (method: string, body?: unknown, token?: string) => ({
  method,
  headers: { 'content-type': 'application/json', ...(token ? { authorization: `Bearer ${token}` } : {}) },
  body: body === undefined ? undefined : JSON.stringify(body),
});

const initData = (id: number, name: string, opts: { age?: number; bot?: string; extra?: Record<string, string> } = {}) =>
  signInitData(
    { auth_date: String(Math.floor(Date.now() / 1000) - (opts.age ?? 10)), query_id: 'AAE' + id, user: JSON.stringify({ id, first_name: name, language_code: 'uz' }), ...opts.extra },
    opts.bot ?? BOT,
  );

async function tgLogin(id: number, name: string) {
  const r = await app.request('/auth/telegram', json('POST', { initData: initData(id, name) }));
  expect(r.status).toBe(200);
  return (await r.json()) as { access: string; refresh: string; user: { id: string; name: string; phone: string | null }; isNew: boolean };
}

const workout = (clientId: string, title = 'Kuch A') => ({
  kind: 'workout',
  clientId,
  data: {
    title,
    date: '25 noyabr · Chorshanba',
    muscles: 'Son oldi · Ko‘krak',
    stats: [
      ['Vaqt', '55 daq'],
      ['Setlar', '16'],
      ['Ko‘tarildi', '3 613 kg'],
      ['Rekordlar', '2'],
    ],
    rows: [{ name: 'O‘tirib-turish', value: '60 kg × 5', hot: true }],
    rowsTitle: 'Rekordlar',
  },
});

describe('Telegram orqali kirish', () => {
  it('to‘g‘ri initData — akkaunt yaratiladi, ism Telegram’dan, qayta kirishda o‘sha akkaunt', async () => {
    const a = await tgLogin(5001, 'Dilnoza');
    expect(a.isNew).toBe(true);
    expect(a.user.name).toBe('Dilnoza');
    expect(a.user.phone).toBeNull();
    const b = await tgLogin(5001, 'Dilnoza');
    expect(b.isNew).toBe(false);
    expect(b.user.id).toBe(a.user.id);
    const me = await (await app.request('/me', json('GET', undefined, b.access))).json();
    expect(me.user.id).toBe(a.user.id);
    expect(me.entitlements.pro.trial).toBe(true);
  });

  it('soxta, boshqa bot imzolagan yoki eskirgan ma’lumot rad etiladi', async () => {
    const good = initData(5002, 'Ali');
    const tampered = good.replace('Ali', 'Vali');
    for (const d of [tampered, initData(5002, 'Ali', { bot: '987654321:BBHk3vX9q-Zr8pL2mN5bC7dF1gH4jK6lQwE' }), initData(5002, 'Ali', { age: 2 * 24 * 3600 }), 'hash=abc&user=1']) {
      const r = await app.request('/auth/telegram', json('POST', { initData: d }));
      expect(r.status, d.slice(0, 30)).toBe(401);
    }
  });

  it('Bot API 8.0 «signature» maydoni bilan ham tekshiriladi', () => {
    const d = initData(5003, 'Aziz', { extra: { signature: 'c2lnbmF0dXJl' } });
    expect(verifyInitData(d, BOT, 3600)?.user.id).toBe(5003);
  });

  it('bot tokeni bo‘lmasa — 503; SMS o‘chiq bo‘lsa — /auth/otp 503', async () => {
    const noTg = createApp({ db, env: loadEnv({ JWT_SECRET: 'Qm9yZXRo-7uKx2LpV9aN3cW8dT5fH1jS6gZ4bY0eR', DEV_MODE: '1' }), sms: new ConsoleSms(false) });
    expect((await noTg.request('/auth/telegram', json('POST', { initData: initData(1, 'A') }))).status).toBe(503);
    const tgOnly = loadEnv({ JWT_SECRET: 'Qm9yZXRo-7uKx2LpV9aN3cW8dT5fH1jS6gZ4bY0eR', SMS_PROVIDER: 'none', TELEGRAM_BOT_TOKEN: BOT, NODE_ENV: 'production' });
    const prod = createApp({ db, env: tgOnly, sms: new NoSms() });
    expect((await prod.request('/auth/otp', json('POST', { phone: '+998901234567' }))).status).toBe(503);
    expect((await prod.request('/auth/telegram', json('POST', { initData: initData(7, 'B') }))).status).toBe(200);
    expect(await (await prod.request('/auth/methods')).json()).toEqual({ sms: false, telegram: true });
    expect(await (await noTg.request('/auth/methods')).json()).toEqual({ sms: true, telegram: false });
  });
});

describe('Do‘stlar va lenta', () => {
  it('kod bilan ikki tomonlama do‘stlik; o‘z kodi va noma’lum kod rad etiladi', async () => {
    const a = await tgLogin(1, 'Ali');
    const b = await tgLogin(2, 'Bekzod');
    const code = (await (await app.request('/social/code', json('GET', undefined, a.access))).json()).code as string;
    expect(code).toMatch(/^[A-Z0-9]{8}$/);
    expect((await (await app.request('/social/code', json('GET', undefined, a.access))).json()).code).toBe(code);
    expect((await app.request('/social/friends', json('POST', { code }, a.access))).status).toBe(400);
    expect((await app.request('/social/friends', json('POST', { code: 'ZZZZZZZZ' }, b.access))).status).toBe(404);
    const add = await app.request('/social/friends', json('POST', { code: code.toLowerCase() }, b.access));
    expect(add.status).toBe(200);
    for (const [who, other] of [
      [a, 'Bekzod'],
      [b, 'Ali'],
    ] as const) {
      const list = await (await app.request('/social/friends', json('GET', undefined, who.access))).json();
      expect(list.friends.map((f: { name: string }) => f.name)).toEqual([other]);
      expect(JSON.stringify(list)).not.toContain('phone');
    }
  });

  it('lenta: o‘zining va do‘stlarining yozuvlari; begona ko‘rmaydi; 💪 faqat ko‘rinadigan yozuvga', async () => {
    const a = await tgLogin(11, 'Ali');
    const b = await tgLogin(12, 'Bekzod');
    const s = await tgLogin(13, 'Begona');
    const code = (await (await app.request('/social/code', json('GET', undefined, a.access))).json()).code;
    await app.request('/social/friends', json('POST', { code }, b.access));

    const p1 = await (await app.request('/social/posts', json('POST', workout('log-1'), a.access))).json();
    // shu mashg'ulot qayta yuborilsa — yangilanadi, ikkinchi yozuv bo'lmaydi
    const p1b = await (await app.request('/social/posts', json('POST', workout('log-1', 'Kuch A′'), a.access))).json();
    expect(p1b.id).toBe(p1.id);
    await app.request('/social/posts', json('POST', workout('log-s'), s.access));

    const feedB = await (await app.request('/social/feed', json('GET', undefined, b.access))).json();
    expect(feedB.posts).toHaveLength(1);
    expect(feedB.posts[0].author).toBe('Ali');
    expect(feedB.posts[0].data.title).toBe('Kuch A′');
    expect(feedB.posts[0].own).toBe(false);

    expect((await app.request(`/social/posts/${p1.id}/kudos`, json('PUT', undefined, b.access))).status).toBe(200);
    expect((await app.request(`/social/posts/${p1.id}/kudos`, json('PUT', undefined, b.access))).status).toBe(200);
    expect((await app.request(`/social/posts/${p1.id}/kudos`, json('PUT', undefined, s.access))).status).toBe(404);
    const feedA = await (await app.request('/social/feed', json('GET', undefined, a.access))).json();
    expect(feedA.posts[0].kudos).toBe(1);
    expect(feedA.posts[0].own).toBe(true);
    const feedS = await (await app.request('/social/feed', json('GET', undefined, s.access))).json();
    expect(feedS.posts.map((p: { author: string }) => p.author)).toEqual(['Begona']);

    // begona birovning yozuvini o'chira olmaydi; do'stlik uzilsa lenta yopiladi
    await app.request(`/social/posts/${p1.id}`, json('DELETE', undefined, s.access));
    expect((await (await app.request('/social/feed', json('GET', undefined, a.access))).json()).posts).toHaveLength(1);
    await app.request(`/social/friends/${a.user.id}`, json('DELETE', undefined, b.access));
    expect((await (await app.request('/social/feed', json('GET', undefined, b.access))).json()).posts).toHaveLength(0);
  });

  it('yozuv tekshiriladi: ortiqcha maydon, uzun matn, noma’lum tur — 400; kirmagan — 401', async () => {
    const a = await tgLogin(21, 'Ali');
    const bad = [
      { ...workout('x'), data: { ...workout('x').data, phone: '998901234567' } },
      { ...workout('x'), data: { ...workout('x').data, title: 'A'.repeat(200) } },
      { ...workout('x'), kind: 'photo' },
      { ...workout('x'), data: { ...workout('x').data, rows: Array.from({ length: 10 }, () => ({ name: 'a', value: 'b' })) } },
    ];
    for (const b of bad) expect((await app.request('/social/posts', json('POST', b, a.access))).status).toBe(400);
    expect((await app.request('/social/feed', json('GET'))).status).toBe(401);
    const week = { kind: 'week', clientId: 'week-2026-11-16', data: { label: '16–22 noyabr', done: 3, planned: 3, streak: 4, stats: [['Setlar', '48']], rows: [], rowsTitle: 'Kuchda o‘sish' } };
    expect((await app.request('/social/posts', json('POST', week, a.access))).status).toBe(200);
  });

  it('akkaunt o‘chirilsa — yozuvlar, do‘stliklar va 💪 ham o‘chadi', async () => {
    const a = await tgLogin(31, 'Ali');
    const b = await tgLogin(32, 'Bekzod');
    const code = (await (await app.request('/social/code', json('GET', undefined, a.access))).json()).code;
    await app.request('/social/friends', json('POST', { code }, b.access));
    const p = await (await app.request('/social/posts', json('POST', workout('l1'), b.access))).json();
    await app.request(`/social/posts/${p.id}/kudos`, json('PUT', undefined, a.access));
    expect((await app.request('/me', json('DELETE', undefined, b.access))).status).toBe(200);
    const feedA = await (await app.request('/social/feed', json('GET', undefined, a.access))).json();
    expect(feedA.posts).toHaveLength(0);
    expect((await (await app.request('/social/friends', json('GET', undefined, a.access))).json()).friends).toHaveLength(0);
    // qayta kirsa — yangi akkaunt, lekin bepul sinov qayta berilmaydi
    const again = await tgLogin(32, 'Bekzod');
    expect(again.isNew).toBe(true);
    const me = await (await app.request('/me', json('GET', undefined, again.access))).json();
    expect(me.entitlements.pro.trial).toBe(false);
  });
});
