// Ilovaning sinxronlash kodi (src/api/sync.ts) haqiqiy server bilan: ziddiyatlar to'g'ri hal bo'ladimi.
import { beforeAll, describe, expect, it, vi } from 'vitest';
import { createApp } from '../src/app.js';
import { createDb, migrate } from '../src/db/index.js';
import { loadEnv } from '../src/env.js';
import { ConsoleSms } from '../src/sms/index.js';

const env = loadEnv({ JWT_SECRET: 'Qm9yZXRo-7uKx2LpV9aN3cW8dT5fH1jS6gZ4bY0eR', DEV_MODE: '1' });
let app: ReturnType<typeof createApp>;
let client: typeof import('../../src/api/sync.js');
let store: (typeof import('../../src/store/useStore.js'))['useStore'];

const json = (method: string, body?: unknown, token?: string) => ({
  method,
  headers: { 'content-type': 'application/json', ...(token ? { authorization: `Bearer ${token}` } : {}) },
  body: body === undefined ? undefined : JSON.stringify(body),
});
async function login(phone: string) {
  const otp = await (await app.request('/auth/otp', json('POST', { phone }))).json();
  return (await (await app.request('/auth/verify', json('POST', { phone, code: otp.devCode }))).json()) as {
    access: string;
    refresh: string;
    user: { id: string; phone: string; name: string; role: 'athlete' | 'coach' };
  };
}
const serverProgram = async (token: string) => {
  const r = await (await app.request('/sync', json('POST', { since: 0, changes: [] }, token))).json();
  return r.docs.find((d: { kind: string }) => d.kind === 'program').data;
};

beforeAll(async () => {
  const db = await createDb({});
  await migrate(db);
  app = createApp({ db, env, sms: new ConsoleSms(false) });
  vi.stubEnv('VITE_API_URL', 'http://api.test');
  vi.stubGlobal('fetch', (url: string, init?: RequestInit) => app.request(url.replace('http://api.test', ''), init));
  vi.spyOn(console, 'warn').mockImplementation(() => {}); // qurilma xotirasi (localStorage) yo'q
  client = await import('../../src/api/sync.js');
  store = (await import('../../src/store/useStore.js')).useStore;
  const { EQUIPMENT_PRESETS } = await import('../../src/data/catalog.js');
  store.getState().setProfile({
    name: 'Aziz',
    sex: 'male',
    age: 25,
    heightCm: 175,
    weightKg: 75,
    goal: 'muscle',
    level: 'beginner',
    daysPerWeek: 3,
    sessionMin: 60,
    trainingDays: [0, 2, 4],
    equipment: EQUIPMENT_PRESETS[0].items,
    injuries: [],
    focus: [],
    activity: 'light',
    healthFlags: [],
    dietPrefs: { noPork: true, lactoseFree: false, vegetarian: false },
    createdAt: new Date().toISOString(),
  });
});

describe('ilova sinxronlashi', () => {
  it('eski oflayn tahrir murabbiyning yangi dasturini bosib ketmaydi, yangi tahrir esa yutadi', async () => {
    const a = await login('901112233');
    store.getState().setAccount({ access: a.access, refresh: a.refresh, user: a.user });
    await client.syncNow();
    expect(store.getState().sync.status).toBe('idle');
    expect((await serverProgram(a.access)).days.length).toBe(3);

    // murabbiy ulanib, dastur yuboradi
    const c = await login('935556677');
    const coach = await (await app.request('/me', json('PATCH', { name: 'Sardor', role: 'coach' }, c.access))).json();
    const { code } = await (await app.request('/coach/invites', json('POST', {}, coach.access))).json();
    expect((await app.request('/coach/join', json('POST', { code }, a.access))).status).toBe(200);
    const sent = { ...store.getState().program!, split: 'Murabbiy dasturi' };
    expect((await app.request(`/coach/clients/${a.user.id}/program`, json('PUT', { program: sent }, coach.access))).status).toBe(200);

    // sportchi murabbiydan OLDIN oflayn tahrir qilgan edi, endi internet keldi
    const day = store.getState().program!.days[0];
    store.getState().updatePlanned(day.id, 0, { sets: 5 });
    store.getState().setSync({ edited: { 'program:current': Date.now() - 60_000 } });
    await client.syncNow();
    expect(store.getState().program!.split).toBe('Murabbiy dasturi');
    expect(store.getState().program!.coach?.name).toBe('Sardor');
    expect((await serverProgram(a.access)).split).toBe('Murabbiy dasturi');

    // murabbiy dasturidan KEYIN qilingan tahrir serverga yetadi
    store.getState().updatePlanned(day.id, 0, { sets: 2 });
    store.getState().setSync({ edited: { 'program:current': Date.now() } });
    await client.syncNow();
    const after = await serverProgram(a.access);
    expect(after.days[0].exercises[0].sets).toBe(2);
    expect(after.coach.name).toBe('Sardor');
  });

  it('o‘chirilgan mashg‘ulot boshqa qurilmadan ham o‘chadi', async () => {
    const s = store.getState();
    s.startWorkout(s.program!.days[0], s.program!.days[0].exercises);
    s.updateSet(0, 0, { kg: 50, reps: 10, done: true });
    const log = store.getState().finishWorkout()!;
    await client.syncNow();
    const token = store.getState().account!.access;
    const has = async () => (await (await app.request('/sync', json('POST', { since: 0, changes: [] }, token))).json()).docs.find((d: { id: string }) => d.id === log.id);
    expect((await has()).deleted).toBe(false);
    store.getState().deleteLog(log.id);
    await client.syncNow();
    expect((await has()).deleted).toBe(true);
  });

  it('ovqat kundaligi kun bo‘yicha sinxronlanadi, kun bo‘shasa — o‘chadi', async () => {
    const token = store.getState().account!.access;
    const day = '2026-05-03';
    const doc = async () =>
      (await (await app.request('/sync', json('POST', { since: 0, changes: [] }, token))).json()).docs.find((d: { kind: string; id: string }) => d.kind === 'food' && d.id === day);
    store.getState().addFood({ id: 'f1', date: day, meal: 1, foodId: 'osh', name: 'Osh', g: 350, kcal: 805, p: 24, f: 38, c: 91 });
    store.getState().addFood({ id: 'f2', date: day, meal: 0, name: 'Qo‘lda', kcal: 300, p: 10, f: 5, c: 50 });
    await client.syncNow();
    expect((await doc()).data).toHaveLength(2);
    store.getState().removeFood('f1');
    store.getState().removeFood('f2');
    await client.syncNow();
    expect((await doc()).deleted).toBe(true);
  });
});
