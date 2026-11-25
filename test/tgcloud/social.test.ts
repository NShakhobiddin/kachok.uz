// Telegram Serverless (tgcloud/) — do'stlar lentasi endpointlari va bot handleri, haqiqiy SQLite bilan.
import { beforeEach, describe, expect, it } from 'vitest';
import { calls, EndpointError, replies } from './sdk';
import { resetDb } from './sdk-db';
import * as schema from '../../tgcloud/schema.js';
import friendCode from '../../tgcloud/endpoints/friendCode.js';
import friends from '../../tgcloud/endpoints/friends.js';
import friendAdd from '../../tgcloud/endpoints/friendAdd.js';
import friendRemove from '../../tgcloud/endpoints/friendRemove.js';
import feed from '../../tgcloud/endpoints/feed.js';
import postSave from '../../tgcloud/endpoints/postSave.js';
import postDelete from '../../tgcloud/endpoints/postDelete.js';
import kudos from '../../tgcloud/endpoints/kudos.js';
import socialDelete from '../../tgcloud/endpoints/socialDelete.js';
import message from '../../tgcloud/handlers/message.js';
import { resetBotCache } from '../../tgcloud/lib/bot.js';
import setupBot from '../../scripts/tgcloud/setupBot.js';

type Ctx = { initData: { user: { id: number; first_name: string; last_name?: string } } };
const as = (id: number, first_name: string): Ctx => ({ initData: { user: { id, first_name } } });
const A = as(1001, 'Ali');
const B = as(1002, 'Bekzod');
const S = as(1003, 'Begona');

/** EndpointError kodi (yoki xato bo'lmasa — null) */
async function errCode(p: Promise<unknown>) {
  try {
    await p;
    return null;
  } catch (e) {
    expect(e).toBeInstanceOf(EndpointError);
    return (e as EndpointError).parameters?.code;
  }
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
    ],
    rows: [{ name: 'O‘tirib-turish', value: '60 kg × 5', hot: true }],
    rowsTitle: 'Rekordlar',
  },
});

beforeEach(() => {
  resetDb(schema);
  resetBotCache();
  calls.length = 0;
  for (const k of Object.keys(replies)) delete replies[k];
  replies.getMe = () => ({ id: 1, is_bot: true, username: 'gym_bosbot', has_main_web_app: true });
});

describe('tgcloud: do‘stlar', () => {
  it('kod barqaror, taklif havolasi asosiy Mini App’ga; parallel birinchi chaqiruvlar xatosiz', async () => {
    const [c1, f, l] = await Promise.all([friendCode({}, A), feed({}, A), friends({}, A)]);
    expect(c1.code).toMatch(/^[A-Z2-9]{8}$/);
    expect(c1.invite).toBe(`https://t.me/gym_bosbot?startapp=f_${c1.code}`);
    expect(f).toEqual({ posts: [], more: false });
    expect(l).toEqual({ friends: [] });
    expect((await friendCode({}, A)).code).toBe(c1.code);
  });

  it('asosiy Mini App yo‘q bo‘lsa — taklif bot chati orqali (/start f_KOD)', async () => {
    replies.getMe = () => ({ id: 1, is_bot: true, username: 'gym_bosbot', has_main_web_app: false });
    const c = await friendCode({}, A);
    expect(c.invite).toBe(`https://t.me/gym_bosbot?start=f_${c.code}`);
  });

  it('kod bilan ikki tomonlama do‘stlik; o‘z kodi, noma’lum va noto‘g‘ri kod rad etiladi; Telegram id ko‘rinmaydi', async () => {
    const { code } = await friendCode({}, A);
    expect(await errCode(friendAdd({ code }, A))).toBe('SELF');
    expect(await errCode(friendAdd({ code: 'ZZZZZZZZ' }, B))).toBe('NOT_FOUND');
    expect(await errCode(friendAdd({ code: 'a b' }, B))).toBe('BAD_CODE');
    const r = await friendAdd({ code: code.toLowerCase() }, B);
    expect(r.friend.name).toBe('Ali');
    expect((await friends({}, A)).friends.map((f: { name: string }) => f.name)).toEqual(['Bekzod']);
    const fb = await friends({}, B);
    expect(fb.friends.map((f: { name: string }) => f.name)).toEqual(['Ali']);
    expect(JSON.stringify(fb)).not.toContain('1001');
    // qayta qo'shish — xatosiz, takror yozuv yo'q
    await friendAdd({ code }, B);
    expect((await friends({}, B)).friends).toHaveLength(1);
  });

  it('ism Telegram’dan yangilanadi', async () => {
    await friendCode({}, A);
    const { code } = await friendCode({}, A);
    await friendAdd({ code }, B);
    await friends({}, { initData: { user: { id: 1001, first_name: 'Ali', last_name: 'Valiyev' } } });
    expect((await friends({}, B)).friends[0].name).toBe('Ali Valiyev');
  });

  it('Telegram foydalanuvchisiz chaqiruv rad etiladi', async () => {
    expect(await errCode(feed({}, {} as Ctx))).toBe('NO_USER');
  });

  it('soatiga 30 tadan ortiq do‘st qo‘shish urinishi — RATE_LIMIT', async () => {
    for (let i = 0; i < 30; i++) expect(await errCode(friendAdd({ code: 'ZZZZZZZ' + (i % 10) }, B))).toBe('NOT_FOUND');
    expect(await errCode(friendAdd({ code: 'ZZZZZZZZ' }, B))).toBe('RATE_LIMIT');
  });
});

describe('tgcloud: lenta', () => {
  it('o‘zining va do‘stlarining yozuvlari; begona ko‘rmaydi; 💪 faqat ko‘rinadigan yozuvga; uzilsa lenta yopiladi', async () => {
    const { code } = await friendCode({}, A);
    await friendAdd({ code }, B);
    const p1 = await postSave(workout('log-1'), A);
    const p1b = await postSave(workout('log-1', 'Kuch A′'), A);
    expect(p1b.id).toBe(p1.id);
    await postSave(workout('log-s'), S);

    const fb = await feed({}, B);
    expect(fb.posts).toHaveLength(1);
    expect(fb.posts[0]).toMatchObject({ author: 'Ali', own: false, kudos: 0, kudoed: false, kind: 'workout' });
    expect(fb.posts[0].data.title).toBe('Kuch A′');
    expect(fb.posts[0].data.rows[0].hot).toBe(true);
    expect(Date.parse(fb.posts[0].created_at)).toBeGreaterThan(0);

    await kudos({ id: p1.id, on: true }, B);
    await kudos({ id: p1.id, on: true }, B);
    expect(await errCode(kudos({ id: p1.id, on: true }, S))).toBe('NOT_FOUND');
    const fa = await feed({}, A);
    expect(fa.posts[0]).toMatchObject({ own: true, kudos: 1, kudoed: false });
    expect((await feed({}, B)).posts[0].kudoed).toBe(true);
    await kudos({ id: p1.id, on: false }, B);
    expect((await feed({}, A)).posts[0].kudos).toBe(0);
    expect((await feed({}, S)).posts.map((p: { author: string }) => p.author)).toEqual(['Begona']);

    // begona birovning yozuvini o'chira olmaydi
    await postDelete({ id: p1.id }, S);
    expect((await feed({}, A)).posts).toHaveLength(1);
    // do'stlik uzilsa — lenta yopiladi
    await friendRemove({ id: (await friends({}, B)).friends[0].id }, B);
    expect((await feed({}, B)).posts).toHaveLength(0);
    expect((await friends({}, A)).friends).toHaveLength(0);
  });

  it('sahifalash: before bilan eskiroqlari', async () => {
    for (let i = 0; i < 32; i++) {
      await postSave(workout(`l${i}`), A);
      await new Promise((r) => setTimeout(r, 2));
    }
    const p1 = await feed({}, A);
    expect(p1.posts).toHaveLength(30);
    expect(p1.more).toBe(true);
    const p2 = await feed({ before: p1.posts[29].created_at }, A);
    expect(p2.posts).toHaveLength(2);
    expect(p2.more).toBe(false);
  });

  it('kartochka tekshiriladi: ortiqcha maydon, uzun matn, noma’lum tur, ko‘p qator — INVALID; hafta kartochkasi qabul qilinadi', async () => {
    const w = workout('x');
    const bad = [
      { ...w, data: { ...w.data, phone: '998901234567' } },
      { ...w, data: { ...w.data, title: 'A'.repeat(200) } },
      { ...w, kind: 'photo' },
      { ...w, extra: 1 },
      { ...w, data: { ...w.data, rows: Array.from({ length: 10 }, () => ({ name: 'a', value: 'b' })) } },
      { ...w, data: { ...w.data, stats: [['a', 'b', 'c']] } },
      { ...w, data: { ...w.data, rows: [{ name: 'a', value: 'b', hot: 'yes' }] } },
    ];
    for (const b of bad) expect(await errCode(postSave(b, A))).toBe('INVALID');
    const week = { kind: 'week', clientId: 'week-2026-11-16', data: { label: '16–22 noyabr', done: 3, planned: 3, streak: 4, stats: [['Setlar', '48']], rows: [], rowsTitle: 'Kuchda o‘sish' } };
    expect(await errCode(postSave(week, A))).toBeNull();
    expect(await errCode(postSave({ ...week, data: { ...week.data, done: 1.5 } }, A))).toBe('INVALID');
  });

  it('«ma’lumotlarimni o‘chirish» — yozuvlar, 💪, do‘stliklar va akkaunt o‘chadi', async () => {
    const { code } = await friendCode({}, A);
    await friendAdd({ code }, B);
    const p = await postSave(workout('l1'), B);
    await kudos({ id: p.id, on: true }, A);
    await socialDelete({}, B);
    expect((await feed({}, A)).posts).toHaveLength(0);
    expect((await friends({}, A)).friends).toHaveLength(0);
    // qayta kirsa — yangi, bo'sh akkaunt
    expect((await friends({}, B)).friends).toHaveLength(0);
    expect((await feed({}, B)).posts).toHaveLength(0);
  });
});

describe('tgcloud: bot', () => {
  const msg = (text: string, type = 'private') => ({ message_id: 1, chat: { id: 42, type }, from: { id: 42, first_name: 'Dilnoza' }, text });
  const sent = () => calls.filter((c) => c.method === 'sendMessage').map((c) => c.params as { text: string; reply_markup: { inline_keyboard: { web_app?: { url: string }; url?: string }[][] } });

  it('/start — salom va Mini App tugmasi (menyu tugmasidagi manzil)', async () => {
    replies.getChatMenuButton = () => ({ type: 'web_app', text: 'Ochish', web_app: { url: 'https://app77.tgcloud.ai/' } });
    await message(msg('/start'));
    await message(msg('/start f_ab12cd34'));
    const [a, b] = sent();
    expect(a.text).toContain('Salom, Dilnoza!');
    expect(a.reply_markup.inline_keyboard[0][0].web_app?.url).toBe('https://app77.tgcloud.ai/');
    expect(b.text).toContain('taklif qildi');
    expect(b.reply_markup.inline_keyboard[0][0].web_app?.url).toBe('https://app77.tgcloud.ai/?friend=AB12CD34');
  });

  it('menyu tugmasi sozlanmagan bo‘lsa — t.me havolasi; guruhda javob yo‘q', async () => {
    replies.getChatMenuButton = () => ({ type: 'default' });
    await message(msg('/start f_ab12cd34'));
    await message(msg('/start', 'group'));
    const s = sent();
    expect(s).toHaveLength(1);
    expect(s[0].reply_markup.inline_keyboard[0][0].url).toBe('https://t.me/gym_bosbot?startapp=f_AB12CD34');
  });

  it('setupBot: menyu, tavsif va buyruqlar; Mini App foydalanuvchisi va noto‘g‘ri manzil rad etiladi', async () => {
    expect(await errCode(setupBot({ appUrl: 'https://app77.tgcloud.ai/' }, A))).toBe('FORBIDDEN');
    expect(await errCode(setupBot({ appUrl: 'https://evil.example/' }, {}))).toBe('BAD_URL');
    const r = await setupBot({ appUrl: 'https://app77.tgcloud.ai/' }, {});
    expect(r).toEqual({ bot: 'gym_bosbot', mainApp: true, menu: 'https://app77.tgcloud.ai/' });
    const m = calls.find((c) => c.method === 'setChatMenuButton')?.params as { menu_button: { web_app: { url: string } } };
    expect(m.menu_button.web_app.url).toBe('https://app77.tgcloud.ai/');
    const d = calls.find((c) => c.method === 'setMyDescription')?.params as { description: string };
    expect(d.description.length).toBeLessThanOrEqual(512);
    const sd = calls.find((c) => c.method === 'setMyShortDescription')?.params as { short_description: string };
    expect(sd.short_description.length).toBeLessThanOrEqual(120);
  });
});
