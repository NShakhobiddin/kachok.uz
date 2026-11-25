import { createHmac } from 'node:crypto';
import { beforeEach, describe, expect, it } from 'vitest';
import { createApp } from '../src/app.js';
import { createDb, migrate, type Db } from '../src/db/index.js';
import { loadEnv } from '../src/env.js';
import { webhookSecret } from '../src/lib/telegram.js';
import { ConsoleSms } from '../src/sms/index.js';

const BOT = '123456789:AAHk3vX9q-Zr8pL2mN5bC7dF1gH4jK6lQwE';
const APP = 'https://nshakhobiddin.github.io/kachok.uz/';
const JWT = 'Qm9yZXRo-7uKx2LpV9aN3cW8dT5fH1jS6gZ4bY0eR';

let db: Db;
let app: ReturnType<typeof createApp>;
beforeEach(async () => {
  db = await createDb({});
  await migrate(db);
  app = createApp({ db, env: loadEnv({ JWT_SECRET: JWT, DEV_MODE: '1', TELEGRAM_BOT_TOKEN: BOT, APP_URL: APP }), sms: new ConsoleSms(false) });
});

const hook = (update: unknown, secret: string | null = webhookSecret(BOT), a = app) =>
  a.request('/telegram/webhook', { method: 'POST', headers: { 'content-type': 'application/json', ...(secret === null ? {} : { 'x-telegram-bot-api-secret-token': secret }) }, body: JSON.stringify(update) });
const msg = (text: string, type = 'private') => ({ update_id: 1, message: { message_id: 1, chat: { id: 42, type }, from: { id: 42, first_name: 'Dilnoza' }, text } });

describe('Telegram bot webhook', () => {
  it('maxfiy kalit scripts/telegram-bot.mjs dagi bilan bir xil hisoblanadi', () => {
    expect(webhookSecret(BOT)).toBe(createHmac('sha256', BOT).update('gymbos-webhook').digest('hex'));
    expect(webhookSecret(BOT)).toMatch(/^[0-9a-f]{64}$/);
  });

  it('kalitsiz yoki noto‘g‘ri kalit bilan — 403; bot sozlanmagan bo‘lsa — 404', async () => {
    expect((await hook(msg('/start'), null)).status).toBe(403);
    expect((await hook(msg('/start'), 'x'.repeat(64))).status).toBe(403);
    const noBot = createApp({ db, env: loadEnv({ JWT_SECRET: JWT, DEV_MODE: '1' }), sms: new ConsoleSms(false) });
    expect((await hook(msg('/start'), webhookSecret(BOT), noBot)).status).toBe(404);
  });

  it('/start — salom va ilovani ochish tugmasi (Mini App)', async () => {
    const r = await (await hook(msg('/start'))).json();
    expect(r.method).toBe('sendMessage');
    expect(r.chat_id).toBe(42);
    expect(r.text).toContain('Salom, Dilnoza!');
    expect(r.reply_markup.inline_keyboard[0][0].web_app.url).toBe(APP);
  });

  it('/start f_KOD — taklif matni, havolada ?friend=KOD', async () => {
    const r = await (await hook(msg('/start f_ab12cd34'))).json();
    expect(r.text).toContain('taklif qildi');
    expect(r.reply_markup.inline_keyboard[0][0].web_app.url).toBe(`${APP}?friend=AB12CD34`);
    // noto'g'ri parametr — oddiy salom
    const bad = await (await hook(msg('/start f_<script>'))).json();
    expect(bad.reply_markup.inline_keyboard[0][0].web_app.url).toBe(APP);
  });

  it('guruhda va xabarsiz yangilanishda javob yo‘q; boshqa matnga — qisqa yo‘l-yo‘riq', async () => {
    expect(await (await hook(msg('/start', 'group'))).json()).toEqual({ ok: true });
    expect(await (await hook({ update_id: 2, edited_message: {} })).json()).toEqual({ ok: true });
    const other = await (await hook(msg('salom'))).json();
    expect(other.text).toContain('«Ochish»');
  });
});
