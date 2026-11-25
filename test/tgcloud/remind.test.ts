// Botdan eslatmalar: mashg'ulot kuni ertalab va dushanba — haftalik natija (haqiqiy SQLite bilan).
import { beforeEach, describe, expect, it } from 'vitest';
import { EndpointError, replies } from './sdk';
import { resetDb } from './sdk-db';
import * as schema from '../../tgcloud/schema.js';
import register from '../../tgcloud/endpoints/register.js';
import reminders from '../../tgcloud/endpoints/reminders.js';
import sync from '../../tgcloud/endpoints/sync.js';
import { resetBotCache } from '../../tgcloud/lib/bot.js';
import { runReminders } from '../../tgcloud/lib/remind.js';

const A = { initData: { user: { id: 3001, first_name: 'Sardor', last_name: 'Aliyev' } } };
// 2026-11-25 — chorshanba (weekday 2); Toshkent UTC+5
const at = (iso: string) => Date.parse(iso);
const WED_0830 = at('2026-11-25T03:30:00Z');
const MON_0900 = at('2026-11-30T04:00:00Z');

const program = (method = 'hypertrophy') => ({
  method,
  days: [
    { id: 'd1', title: 'Yuqori tana', weekday: 0, estMin: 50, exercises: [{ exerciseId: 'bench-press' }, { exerciseId: 'row' }] },
    { id: 'd2', title: 'Pastki tana', weekday: 2, estMin: 55, exercises: [{ exerciseId: 'back-squat' }, { exerciseId: 'rdl' }, { exerciseId: 'calf' }] },
    { id: 'd3', title: 'Butun tana', weekday: 4, estMin: 45, exercises: [{ exerciseId: 'deadlift' }] },
  ],
});
const log = (id: string, startedAt: string, sets: [number, number][]) => ({
  kind: 'log',
  id,
  updatedAt: Date.parse(startedAt),
  data: { id, title: 't', startedAt, finishedAt: startedAt, exercises: [{ exerciseId: 'back-squat', sets: sets.map(([kg, reps]) => ({ kg, reps, done: true })) }] },
});

async function setup(extra: unknown[] = [], prog = program()) {
  await register({}, A);
  await reminders({ on: true, hour: 8, tzOffset: 300 }, A);
  await sync({ since: 0, changes: [{ kind: 'program', id: 'current', data: prog, updatedAt: Date.now() }, ...extra] }, A);
}

const sent: { chat_id: number; text: string; reply_markup?: { inline_keyboard: { text: string; web_app?: { url: string } }[][] } }[] = [];
const send = async (p: unknown) => void sent.push(p as (typeof sent)[number]);

beforeEach(() => {
  resetDb(schema);
  resetBotCache();
  sent.length = 0;
  for (const k of Object.keys(replies)) delete replies[k];
  replies.getMe = () => ({ id: 1, is_bot: true, username: 'gym_bosbot', has_main_web_app: true });
  replies.getChatMenuButton = () => ({ type: 'web_app', text: 'Ochish', web_app: { url: 'https://app1.tgcloud.ai/' } });
});

describe('Eslatmalar', () => {
  it('mashg‘ulot kuni 8:00 da — bugungi reja va "Boshlash"; ikkinchi marta yuborilmaydi', async () => {
    await setup();
    expect(await runReminders(WED_0830, send)).toMatchObject({ checked: 1, sent: 1 });
    expect(sent[0].chat_id).toBe(3001);
    expect(sent[0].text).toContain('Salom, Sardor!');
    expect(sent[0].text).toContain('Pastki tana: 3 ta mashq, ~55 daqiqa');
    expect(sent[0].reply_markup!.inline_keyboard[0][0].web_app!.url).toBe('https://app1.tgcloud.ai/');
    await runReminders(WED_0830 + 3600_000, send);
    expect(sent).toHaveLength(1);
  });

  it('bugun allaqachon shug‘ullangan, dam kuni yoki vaqt oynasidan tashqari — xabar yo‘q', async () => {
    await setup([log('L1', '2026-11-25T02:00:00Z', [[100, 5]])]);
    await runReminders(WED_0830, send);
    await runReminders(at('2026-11-26T03:30:00Z'), send); // payshanba — dam
    await runReminders(at('2026-11-27T08:00:00Z'), send); // juma 13:00 — oynadan tashqari
    expect(sent).toHaveLength(0);
  });

  it('dushanba: o‘tgan hafta natijasi + bugungi reja; hisobot havolasi', async () => {
    await setup([log('L1', '2026-11-23T13:00:00Z', [[100, 5], [100, 5]]), log('L2', '2026-11-25T13:00:00Z', [[60, 10]]), log('old', '2026-11-16T13:00:00Z', [[50, 5]])]);
    await runReminders(MON_0900, send);
    expect(sent).toHaveLength(1);
    expect(sent[0].text).toContain('O‘tgan hafta: 2/3 mashg‘ulot, 3 set, 1 600 kg');
    expect(sent[0].text).toContain('Bugun — Yuqori tana');
    const kb = sent[0].reply_markup!.inline_keyboard;
    expect(kb[0][0].web_app!.url).toBe('https://app1.tgcloud.ai/report?w=2026-11-23');
    expect(kb[1][0].text).toMatch(/boshlash/i);
  });

  it('chiziqli A/B dasturida kun nomi aytilmaydi (navbatni ilova hisoblaydi)', async () => {
    await setup([], program('linear'));
    await runReminders(WED_0830, send);
    expect(sent[0].text).toContain('Bugun — kuch mashg‘uloti');
  });

  it('eslatma o‘chiq yoki ro‘yxatdan o‘tmagan — xabar yo‘q; boshqa soat va mintaqa hisobga olinadi', async () => {
    await setup();
    await reminders({ on: false }, A);
    await runReminders(WED_0830, send);
    expect(sent).toHaveLength(0);
    await reminders({ on: true, hour: 19, tzOffset: 180 }, A); // Moskva 19:00 = 16:00 UTC
    await runReminders(at('2026-11-25T16:10:00Z'), send);
    expect(sent).toHaveLength(1);
  });

  it('bot bloklangan (403) — eslatmalar o‘chadi; vaqtinchalik xato — keyingi soatda qayta urinadi', async () => {
    await setup();
    const fail = (code: number) => async () => {
      throw Object.assign(new Error('x'), { code, description: code === 403 ? 'Forbidden: bot was blocked by the user' : 'Too Many Requests' });
    };
    expect(await runReminders(WED_0830, fail(429))).toMatchObject({ errors: 1 });
    expect(await runReminders(WED_0830 + 3600_000, send)).toMatchObject({ sent: 1 });
    await setup();
    expect(await runReminders(at('2026-11-27T03:30:00Z'), fail(403))).toMatchObject({ off: 1 });
    expect(await runReminders(at('2026-11-27T04:30:00Z'), send)).toMatchObject({ checked: 0 });
  });

  it('sozlash: ro‘yxatdan o‘tmagan — rad; noto‘g‘ri soat/mintaqa — eskisi qoladi', async () => {
    try {
      await reminders({ on: true }, A);
      expect.unreachable();
    } catch (e) {
      expect((e as EndpointError).parameters?.code).toBe('NOT_REGISTERED');
    }
    await register({}, A);
    const r = await reminders({ on: true, hour: 99, tzOffset: 99999 }, A);
    expect(r).toMatchObject({ remind: true, remindHour: 8 });
  });
});
