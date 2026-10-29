import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import type { FoodEntry, Profile } from '../../types';

// Soxta server: server/src/routes/sync.ts dagi kabi har hujjat uchun "oxirgi yozgan yutadi"
type Row = { kind: string; id: string; data: unknown; updated_at: number; deleted: boolean; seq: number };
const rows = new Map<string, Row>();
let seq = 0;
function handle(body: { since: number; changes: { kind: string; id: string; updatedAt: number; deleted?: boolean; data?: unknown }[] }) {
  const maxTs = Date.now() + 5 * 60 * 1000;
  for (const ch of body.changes) {
    const k = ch.kind + ':' + ch.id;
    const ts = Math.min(ch.updatedAt, maxTs);
    const cur = rows.get(k);
    if (!cur || cur.updated_at <= ts)
      rows.set(k, { kind: ch.kind, id: ch.id, data: ch.deleted ? null : JSON.parse(JSON.stringify(ch.data ?? null)), updated_at: ts, deleted: !!ch.deleted, seq: ++seq });
  }
  const page = [...rows.values()].filter((r) => r.seq > body.since).sort((a, b) => a.seq - b.seq);
  return { docs: page.map((d) => ({ kind: d.kind, id: d.id, data: d.data, updatedAt: d.updated_at, deleted: d.deleted })), cursor: page.length ? page[page.length - 1].seq : body.since, more: false };
}

type Store = typeof import('../../store/useStore').useStore;
let useStore: Store;
let syncNow: typeof import('../sync').syncNow;
let touchedDocs: typeof import('../sync').touchedDocs;
let mergeFood: typeof import('../sync').mergeFood;
let exportData: typeof import('../../store/useStore').exportData;

const acc = { user: { id: 'u1', phone: '998901112233', name: 'A', role: 'athlete' as const }, access: 'tok', refresh: 'ref' };
const acc2 = { user: { id: 'u2', phone: '998907778899', name: 'B', role: 'athlete' as const }, access: 'tok2', refresh: 'ref2' };

beforeAll(async () => {
  vi.stubEnv('VITE_API_URL', 'http://api.test');
  vi.stubGlobal('fetch', async (url: string, init: { body?: string }) => {
    const path = url.replace('http://api.test', '');
    const json =
      path === '/sync' ? handle(JSON.parse(init.body!)) : { user: acc.user, entitlements: { pro: { active: false, until: null, trial: false }, coach: { active: false, until: null } }, coach: null };
    return new Response(JSON.stringify(json), { status: 200, headers: { 'content-type': 'application/json' } });
  });
  ({ useStore, exportData } = await import('../../store/useStore'));
  ({ syncNow, touchedDocs, mergeFood } = await import('../sync'));
  const { apiEnabled } = await import('../client');
  expect(apiEnabled).toBe(true);
});

const profile = {
  name: 'A',
  sex: 'male',
  age: 30,
  heightCm: 178,
  weightKg: 80,
  goal: 'muscle',
  level: 'beginner',
  daysPerWeek: 3,
  sessionMin: 60,
  trainingDays: [0, 2, 4],
  equipment: ['barbell', 'rack', 'bench', 'dumbbells'],
  injuries: [],
  focus: [],
  activity: 'light',
  healthFlags: [],
  dietPrefs: { noPork: true, lactoseFree: false, vegetarian: false },
  createdAt: '2026-10-01T00:00:00Z',
} as Profile;
const today = '2026-10-29';
const food = (id: string, meal: 0 | 1 | 2 | 3): FoodEntry => ({ id, date: today, meal, name: id, kcal: 500, p: 30, f: 10, c: 50 });
const tick = (ms = 5) => new Promise((r) => setTimeout(r, ms));
const S = () => useStore.getState();
const ids = (list: { id: string }[]) => list.map((f) => f.id).sort();
const serverFood = () => ids((rows.get('food:' + today)?.data as FoodEntry[] | null) ?? []);
/** bitta qurilma holati (JSON nusxa: funksiyalar store da qoladi) */
const snap = () => JSON.parse(JSON.stringify(S()));
const device = (st: ReturnType<typeof snap>) => useStore.setState({ ...st, setDeltaMeso: st.setDeltaMeso });

beforeEach(() => {
  rows.clear();
  S().reset();
  S().setProfile(profile);
});

describe('sinxronlash', () => {
  it('chiqib qayta kirilganda akkauntsiz yozilgan ovqat yo‘qolmaydi va serverga yetadi', async () => {
    S().setAccount(acc);
    S().addFood(food('breakfast', 0));
    await syncNow();
    expect(S().sync.cursor).toBeGreaterThan(0);
    S().setAccount(null); // chiqish yoki 401 → setAccount(null)
    expect(S().sync.cursor).toBeGreaterThan(0);
    S().addFood(food('lunch', 1));
    S().setAccount(acc);
    await syncNow();
    expect(ids(S().food)).toEqual(['breakfast', 'lunch']);
    expect(serverFood()).toEqual(['breakfast', 'lunch']);
  });

  it('akkauntsiz o‘chirilgan mashg‘ulot qayta kirganda tirilmaydi', async () => {
    S().setAccount(acc);
    const t = new Date().toISOString();
    useStore.setState({ logs: [{ id: 'L1', title: 'x', startedAt: t, finishedAt: t, durationMin: 40, exercises: [{ exerciseId: 'bench-press', sets: [{ kg: 60, reps: 8, done: true }] }] }] });
    await syncNow();
    S().setAccount(null);
    S().deleteLog('L1');
    S().setAccount(acc);
    await syncNow();
    expect(S().logs.map((l) => l.id)).toEqual([]);
    expect(rows.get('log:L1')?.deleted).toBe(true);
  });

  it('boshqa akkauntga kirilsa sinxron holati boshidan boshlanadi', async () => {
    S().setAccount(acc);
    await syncNow();
    expect(S().sync.cursor).toBeGreaterThan(0);
    S().setAccount(null);
    S().setAccount(acc2);
    expect(S().sync.cursor).toBe(0);
    expect(S().sync.uid).toBe('u2');
  });

  it('ikki qurilma bir kunda ovqat yozsa — hammasi saqlanadi', async () => {
    // A qurilma
    S().setAccount(acc);
    S().addFood(food('breakfastA', 0));
    await syncNow();
    const devA = snap();
    // B qurilma: kirib, nonushtani oladi va kechki ovqat yozadi
    S().reset();
    S().setProfile(profile);
    S().setAccount(acc);
    await syncNow();
    expect(ids(S().food)).toEqual(['breakfastA']);
    S().addFood(food('dinnerB', 2));
    await tick();
    await syncNow();
    const devB = snap();
    // A (oflayn edi): tushlik yozadi, keyin sinxronlanadi
    device(devA);
    S().addFood(food('lunchA', 1));
    await tick();
    await syncNow();
    expect(ids(S().food)).toEqual(['breakfastA', 'dinnerB', 'lunchA']);
    expect(serverFood()).toEqual(['breakfastA', 'dinnerB', 'lunchA']);
    // B yana sinxronlanadi — tushlik keladi, kechki ovqat qoladi
    device(devB);
    await syncNow();
    expect(ids(S().food)).toEqual(['breakfastA', 'dinnerB', 'lunchA']);
  });

  it('bir qurilmada o‘chirilgan ovqat boshqasida ham o‘chadi (tirilmaydi)', async () => {
    S().setAccount(acc);
    S().addFood(food('a', 0));
    S().addFood(food('b', 1));
    await syncNow();
    const devA = snap();
    S().reset();
    S().setProfile(profile);
    S().setAccount(acc);
    await syncNow();
    S().removeFood('a');
    await tick();
    await syncNow();
    expect(serverFood()).toEqual(['b']);
    device(devA);
    S().addFood(food('c', 2));
    await tick();
    await syncNow();
    expect(ids(S().food)).toEqual(['b', 'c']);
    expect(serverFood()).toEqual(['b', 'c']);
  });

  it('meta: bir qurilmada suv, boshqasida sozlama — ikkalasi ham saqlanadi, suv jamlanadi', async () => {
    S().setAccount(acc);
    S().addWater(250);
    await syncNow();
    const devA = snap();
    S().reset();
    S().setProfile(profile);
    S().setAccount(acc);
    await syncNow();
    S().addWater(500);
    S().setSettings({ sound: false });
    useStore.setState({ setDeltaMeso: 2, setDelta: { chest: 1 } });
    await tick();
    await syncNow();
    device(devA);
    S().addWater(250);
    S().completeLesson('lesson-x');
    await tick();
    await syncNow();
    const d = Object.keys(S().water)[0];
    expect(S().water[d]).toBe(1000); // 250 + 500 (B) + 250 (A)
    expect(S().settings.sound).toBe(false);
    expect(S().lessonsDone).toContain('lesson-x');
    expect(S().setDeltaMeso).toBe(2);
    expect(S().setDelta).toEqual({ chest: 1 });
  });

  it('zaxiradan tiklash akkauntdan chiqarmaydi; bulutdagi boshqa mashg‘ulotlar o‘chmaydi, tiklangan profil ustun', async () => {
    S().setAccount(acc);
    const t = new Date(Date.now() - 86400e3).toISOString();
    const log = (id: string) => ({ id, title: id, startedAt: t, finishedAt: t, durationMin: 40, exercises: [{ exerciseId: 'bench-press', sets: [{ kg: 60, reps: 8, done: true }] }] });
    useStore.setState({ logs: [log('old')] });
    const backup = exportData();
    useStore.setState({ logs: [log('old'), log('new')] });
    S().updateProfile({ name: 'Yangi ism' });
    await syncNow();
    expect(rows.has('log:new')).toBe(true);
    expect(S().importData(backup)).toBe(true);
    expect(S().account?.user.id).toBe('u1');
    expect(S().profile?.name).toBe('A');
    await tick();
    await syncNow();
    expect(
      S()
        .logs.map((l) => l.id)
        .sort(),
    ).toEqual(['new', 'old']);
    expect(rows.get('log:new')?.deleted).toBe(false);
    expect((rows.get('profile:me')?.data as Profile).name).toBe('A');
  });

  it('tahrir vaqti: qaysi hujjat o‘zgargani aniqlanadi', () => {
    const prev = S();
    S().addFood(food('x', 0));
    const t = new Date().toISOString();
    useStore.setState({ logs: [{ id: 'L9', title: 'x', startedAt: t, finishedAt: t, durationMin: 1, exercises: [] }] });
    S().addWater(250);
    expect(touchedDocs(S(), prev).sort()).toEqual(['food:' + today, 'log:L9', 'meta:state']);
  });

  it('mergeFood: uch tomonlama', () => {
    const e = (id: string) => food(id, 0);
    // base: a,b · server: a,c (b o'chirilgan, c qo'shilgan) · qurilma: a,b,d (d qo'shilgan)
    expect(ids(mergeFood([e('a'), e('c')], [e('a'), e('b'), e('d')], ['a', 'b']))).toEqual(['a', 'c', 'd']);
    // base yo'q — birlashma
    expect(ids(mergeFood([e('a')], [e('b')], undefined))).toEqual(['a', 'b']);
  });
});
