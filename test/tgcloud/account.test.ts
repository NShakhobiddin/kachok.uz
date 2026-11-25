// Telegram Serverless: ro'yxatdan o'tish, raqam (bot orqali kontakt) va bulutga sinxronlash — haqiqiy SQLite bilan.
import { beforeEach, describe, expect, it } from 'vitest';
import { calls, EndpointError, replies } from './sdk';
import { resetDb } from './sdk-db';
import * as schema from '../../tgcloud/schema.js';
import account from '../../tgcloud/endpoints/account.js';
import register from '../../tgcloud/endpoints/register.js';
import accountDelete from '../../tgcloud/endpoints/accountDelete.js';
import sync from '../../tgcloud/endpoints/sync.js';
import friendCode from '../../tgcloud/endpoints/friendCode.js';
import friendAdd from '../../tgcloud/endpoints/friendAdd.js';
import friends from '../../tgcloud/endpoints/friends.js';
import message from '../../tgcloud/handlers/message.js';
import { resetBotCache } from '../../tgcloud/lib/bot.js';

const as = (id: number, first_name: string) => ({ initData: { user: { id, first_name } } });
const A = as(2001, 'Ali');
const B = as(2002, 'Bekzod');

async function errCode(p: Promise<unknown>) {
  try {
    await p;
    return null;
  } catch (e) {
    expect(e).toBeInstanceOf(EndpointError);
    return (e as EndpointError).parameters?.code;
  }
}

type Doc = { kind: string; id: string; data: unknown; updatedAt: number; deleted?: boolean };
const doc = (kind: string, id: string, data: unknown, updatedAt = 1000): Doc => ({ kind, id, data, updatedAt });

beforeEach(() => {
  resetDb(schema);
  resetBotCache();
  calls.length = 0;
  for (const k of Object.keys(replies)) delete replies[k];
  replies.getMe = () => ({ id: 1, is_bot: true, username: 'gym_bosbot', has_main_web_app: true });
});

describe('tgcloud: ro‘yxatdan o‘tish', () => {
  it('yangi foydalanuvchi — ro‘yxatdan o‘tmagan; register bir marta vaqt yozadi', async () => {
    expect(await account({}, A)).toEqual({ registered: false, name: 'Ali', phone: null, registeredAt: null, remind: false, remindHour: 8 });
    const r1 = await register({}, A);
    expect(r1.registered).toBe(true);
    expect(Date.parse(r1.registeredAt)).toBeGreaterThan(0);
    const r2 = await register({}, A);
    expect(r2.registeredAt).toBe(r1.registeredAt);
    expect((await account({}, A)).registered).toBe(true);
  });

  it('raqam faqat o‘z kontaktidan: bot chatiga kelgan kontakt saqlanadi, boshqaniki rad etiladi; do‘stlarga ko‘rinmaydi', async () => {
    const contact = (user_id: number, phone: string, fromId = 2001) => ({
      message_id: 5,
      chat: { id: fromId, type: 'private' },
      from: { id: fromId, first_name: 'Ali' },
      contact: { phone_number: phone, first_name: 'Ali', user_id },
    });
    await message(contact(9999, '+998 90 111 22 33'));
    expect((await account({}, A)).phone).toBeNull();
    expect((calls.at(-1)?.params as { text: string }).text).toContain('o‘zingizning');
    await message(contact(2001, '+998 90 123 45 67'));
    expect((await account({}, A)).phone).toBe('998901234567');
    expect((calls.at(-1)?.params as { text: string }).text).toContain('ulandi');
    // ilovani hali ochmagan foydalanuvchi ham — akkaunt yaratiladi
    await message(contact(2002, '998935550011', 2002));
    expect((await account({}, B)).phone).toBe('998935550011');
    // do'stlar ro'yxatida raqam yo'q
    const { code } = await friendCode({}, A);
    await friendAdd({ code }, B);
    expect(JSON.stringify(await friends({}, B))).not.toContain('998901234567');
  });

  it('akkauntni o‘chirish: bulutdagi ma’lumotlar, raqam va lenta o‘chadi', async () => {
    await register({}, A);
    await sync({ since: 0, changes: [doc('profile', 'me', { name: 'Ali' })] }, A);
    await accountDelete({}, A);
    const again = await account({}, A);
    expect(again).toMatchObject({ registered: false, phone: null });
    await register({}, A);
    expect((await sync({ since: 0, changes: [] }, A)).docs).toEqual([]);
  });
});

describe('tgcloud: bulutga sinxronlash', () => {
  it('ro‘yxatdan o‘tmagan — NOT_REGISTERED', async () => {
    expect(await errCode(sync({ since: 0, changes: [] }, A))).toBe('NOT_REGISTERED');
  });

  it('bir qurilmada yozilgan — ikkinchisida tiklanadi; begona ko‘rmaydi; kursor bilan faqat yangilari', async () => {
    await register({}, A);
    await register({}, B);
    const r1 = await sync({ since: 0, changes: [doc('profile', 'me', { name: 'Ali', weight: 80 }), doc('log', 'L1', { id: 'L1', title: 'Kuch A' }), doc('food', '2026-11-25', [{ id: 'f1' }])] }, A);
    expect(r1.docs).toHaveLength(3);
    // ikkinchi qurilma (o'sha Telegram akkaunti) — boshidan
    const fresh = await sync({ since: 0, changes: [] }, A);
    expect(fresh.docs.map((d: Doc) => `${d.kind}:${d.id}`).sort()).toEqual(['food:2026-11-25', 'log:L1', 'profile:me']);
    expect(fresh.docs.find((d: Doc) => d.kind === 'profile').data).toEqual({ name: 'Ali', weight: 80 });
    expect((await sync({ since: 0, changes: [] }, B)).docs).toEqual([]);
    // kursordan keyin faqat yangi o'zgarish
    const r2 = await sync({ since: fresh.cursor, changes: [doc('body', '2026-11-25', { date: '2026-11-25', weight: 79.5 }, 2000)] }, A);
    expect(r2.docs.map((d: Doc) => d.kind)).toEqual(['body']);
    expect(r2.cursor).toBeGreaterThan(fresh.cursor);
    expect((await sync({ since: r2.cursor, changes: [] }, A)).docs).toEqual([]);
  });

  it('eskiroq o‘zgarish yangisini bosmaydi; o‘chirish ham hujjat sifatida keladi; kelajak vaqti cheklanadi', async () => {
    await register({}, A);
    const T = Date.now() - 60_000;
    await sync({ since: 0, changes: [doc('profile', 'me', { v: 2 }, T + 5000)] }, A);
    await sync({ since: 0, changes: [doc('profile', 'me', { v: 1 }, T + 4000)] }, A);
    let all = await sync({ since: 0, changes: [] }, A);
    expect(all.docs[0].data).toEqual({ v: 2 });
    await sync({ since: 0, changes: [doc('log', 'L1', { id: 'L1' }, T + 1000)] }, A);
    await sync({ since: 0, changes: [{ kind: 'log', id: 'L1', data: null, updatedAt: T + 3000, deleted: true }] }, A);
    all = await sync({ since: 0, changes: [] }, A);
    expect(all.docs.find((d: Doc) => d.id === 'L1')).toMatchObject({ deleted: true, data: null });
    const future = Date.now() + 10 * 24 * 3600 * 1000;
    await sync({ since: 0, changes: [doc('meta', 'state', { a: 1 }, future)] }, A);
    all = await sync({ since: 0, changes: [] }, A);
    expect(all.docs.find((d: Doc) => d.kind === 'meta').updatedAt).toBeLessThan(Date.now() + 6 * 60 * 1000);
  });

  it('sahifalash: ko‘p hujjat — more va kursor bilan to‘liq olinadi', async () => {
    await register({}, A);
    const many = Array.from({ length: 450 }, (_, i) => doc('log', `L${i}`, { id: `L${i}` }));
    await sync({ since: 0, changes: many.slice(0, 400) }, A);
    await sync({ since: 0, changes: many.slice(400) }, A);
    let cursor = 0;
    const got = new Set<string>();
    for (let guard = 0; guard < 10; guard++) {
      const r = await sync({ since: cursor, changes: [] }, A);
      r.docs.forEach((d: Doc) => got.add(d.id));
      cursor = r.cursor;
      if (!r.more) break;
    }
    expect(got.size).toBe(450);
  });

  it('noto‘g‘ri hujjatlar rad etiladi: tur, shakl, hajm, ko‘p o‘zgarish', async () => {
    await register({}, A);
    expect(await errCode(sync({ since: 0, changes: [doc('photo', 'x', {})] }, A))).toBe('BAD_REQUEST');
    expect(await errCode(sync({ since: 0, changes: [doc('food', 'd', { not: 'array' })] }, A))).toBe('BAD_DOC');
    expect(await errCode(sync({ since: 0, changes: [doc('profile', 'me', [1, 2])] }, A))).toBe('BAD_DOC');
    expect(await errCode(sync({ since: 0, changes: [doc('log', 'big', { s: 'x'.repeat(300 * 1024) })] }, A))).toBe('TOO_LARGE');
    expect(await errCode(sync({ since: 0, changes: Array.from({ length: 401 }, (_, i) => doc('log', `L${i}`, {})) }, A))).toBe('BAD_REQUEST');
    expect(await errCode(sync({ since: -1, changes: [] }, A))).toBe('BAD_REQUEST');
  });

  it('kvota: 20 MB dan oshsa — QUOTA', async () => {
    await register({}, A);
    const chunk = 'x'.repeat(250 * 1024);
    for (let i = 0; i < 81; i++) await sync({ since: 0, changes: [doc('log', `L${i}`, { s: chunk })] }, A);
    expect(await errCode(sync({ since: 0, changes: [doc('log', 'L-over', { s: chunk })] }, A))).toBe('QUOTA');
    // mavjud hujjatni almashtirish kvotaga qo'shilmaydi
    expect(await errCode(sync({ since: 0, changes: [doc('log', 'L0', { s: 'small' }, 9999)] }, A))).toBeNull();
  });
});

describe('tgcloud: audit tuzatishlari', () => {
  it('lenta ma’lumotlarini o‘chirish akkaunt va bulutdagi ma’lumotlarni o‘chirmaydi', async () => {
    const socialDelete = (await import('../../tgcloud/endpoints/socialDelete.js')).default;
    await register({}, A);
    await sync({ since: 0, changes: [doc('profile', 'me', { name: 'Ali' }, Date.now())] }, A);
    await socialDelete({}, A);
    expect((await account({}, A)).registered).toBe(true);
    expect((await sync({ since: 0, changes: [] }, A)).docs).toHaveLength(1);
  });

  it('do‘stlikdan chiqarilgan odam eski kod bilan qayta qo‘shila olmaydi', async () => {
    const friendRemove = (await import('../../tgcloud/endpoints/friendRemove.js')).default;
    const { code } = await friendCode({}, A);
    await friendAdd({ code }, B);
    const bId = (await friends({}, A)).friends[0].id;
    await friendRemove({ id: bId }, A);
    expect(await errCode(friendAdd({ code }, B))).toBe('NOT_FOUND');
    expect((await friendCode({}, A)).code).not.toBe(code);
  });

  it('hujjatlar soni cheklangan (o‘chirilganlari ham); bo‘sh hujjatlar ham kvotada', async () => {
    const { MAX_DOCS } = await import('../../tgcloud/lib/sync.js');
    await register({}, A);
    const t = Date.now();
    for (let i = 0; i < MAX_DOCS; i += 400) await sync({ since: 0, changes: Array.from({ length: Math.min(400, MAX_DOCS - i) }, (_, j) => doc('log', `L${i + j}`, {}, t)) }, A);
    expect(await errCode(sync({ since: 0, changes: [doc('log', 'one-more', {}, t)] }, A))).toBe('QUOTA');
    // mavjud hujjatni yangilash — mumkin
    expect(await errCode(sync({ since: 0, changes: [doc('log', 'L0', { x: 1 }, t + 1)] }, A))).toBeNull();
  });

  it('so‘rov cheklovi Telegram id bo‘yicha — ma’lumotlarni o‘chirib qayta kirish uni nolga tushirmaydi', async () => {
    const socialDelete = (await import('../../tgcloud/endpoints/socialDelete.js')).default;
    for (let i = 0; i < 30; i++) await errCode(friendAdd({ code: 'ZZZZZZZ' + (i % 10) }, B));
    await socialDelete({}, B);
    expect(await errCode(friendAdd({ code: 'ZZZZZZZZ' }, B))).toBe('RATE_LIMIT');
  });
});
