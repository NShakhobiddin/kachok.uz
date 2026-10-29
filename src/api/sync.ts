// Oflayn-birinchi sinxronlash. Qurilma — asosiy manba; server — zaxira va qurilmalar orasidagi ko'prik.
// Har bir yozuv alohida hujjat: profil, dastur, har bir mashg'ulot, har kungi vazn, sozlamalar.
// Server har hujjat uchun "oxirgi yozgan yutadi" (updatedAt) qoidasida ishlaydi. Shuning uchun avval o'qiymiz,
// ovqat kundaligi va meta hujjatini (bir nechta qurilma bir vaqtda yozadigan) birlashtiramiz, keyin yuboramiz.
import { clampKcalAdjust } from '../engine/nutrition';
import { useStore } from '../store/useStore';
import type { BodyEntry, FoodEntry, Profile, Program, WorkoutLog } from '../types';
import { api, apiEnabled, refreshMe } from './client';

type Kind = 'profile' | 'program' | 'log' | 'body' | 'food' | 'meta';
interface Doc {
  kind: Kind;
  id: string;
  data: unknown;
}
interface RemoteDoc extends Doc {
  updatedAt: number;
  deleted: boolean;
}
interface SyncResponse {
  docs: RemoteDoc[];
  cursor: number;
  more: boolean;
}

const key = (kind: string, id: string) => `${kind}:${id}`;
const SINGLETONS: Kind[] = ['profile', 'program', 'meta'];

/** meta:state hujjatidagi kalitlar */
export const META_KEYS = ['water', 'readiness', 'lessonsDone', 'kcalAdjust', 'kcalAdjustAt', 'setDelta', 'setDeltaMeso', 'seenAchievements', 'settings', 'exNotes'] as const;
type MetaKey = (typeof META_KEYS)[number];

/** Tez xesh (FNV-1a) — hujjat o'zgarganini aniqlash uchun */
export function hash(v: unknown): string {
  const s = JSON.stringify(v) ?? '';
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return (h >>> 0).toString(36) + s.length.toString(36);
}

const same = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b);
const isRec = (v: unknown): v is Record<string, unknown> => !!v && typeof v === 'object' && !Array.isArray(v);

export function collectDocs(): Map<string, Doc> {
  const s = useStore.getState();
  const out = new Map<string, Doc>();
  const put = (kind: Kind, id: string, data: unknown) => out.set(key(kind, id), { kind, id, data });
  if (s.profile) put('profile', 'me', s.profile);
  if (s.program) put('program', 'current', s.program);
  for (const l of s.logs) if (l.finishedAt) put('log', l.id, l);
  for (const b of s.body) put('body', b.date, b);
  // ovqat kundaligi — har kun bitta hujjat
  const byDay = new Map<string, FoodEntry[]>();
  for (const e of s.food) byDay.set(e.date, [...(byDay.get(e.date) ?? []), e]);
  for (const [date, list] of byDay) put('food', date, list);
  put('meta', 'state', Object.fromEntries(META_KEYS.map((k) => [k, s[k]])));
  return out;
}

/**
 * Ovqat kundaligi: yozuv id lari bo'yicha uch tomonlama birlashtirish.
 * base — serverdagi oxirgi ko'rilgan nusxadagi id lar: base da bor, qurilmada yo'q → bu yerda o'chirilgan;
 * base da bor, serverda yo'q → boshqa qurilmada o'chirilgan; base da yo'q → yangi qo'shilgan.
 */
export function mergeFood(remote: FoodEntry[], local: FoodEntry[], base: string[] | undefined): FoodEntry[] {
  const B = new Set(base ?? []);
  const L = new Set(local.map((e) => e.id));
  const R = new Set(remote.map((e) => e.id));
  const out = remote.filter((e) => !(B.has(e.id) && !L.has(e.id)));
  for (const e of local) if (!R.has(e.id) && !B.has(e.id)) out.push(e);
  return out;
}

/** Bitta qiymatni uch tomonlama birlashtirish (obyektlar — kalit bo'yicha, ro'yxatlar — birlashma) */
function merge3(k: string, r: unknown, l: unknown, b: unknown, localWins: boolean): unknown {
  // serverdagi qiymat turi noto'g'ri bo'lsa (eski/buzuq mijoz) — qurilmadagisi qoladi
  if (r === undefined || r === null || (l !== undefined && (Array.isArray(r) !== Array.isArray(l) || typeof r !== typeof l))) return l;
  if (l === undefined && b === undefined) return r;
  if (same(l, r) || same(r, b)) return l;
  if (same(l, b)) return r;
  // ikkala tomonda ham o'zgargan
  if (Array.isArray(r) && Array.isArray(l)) {
    const removed = new Set(Array.isArray(b) ? b.filter((x) => !r.includes(x) || !l.includes(x)) : []);
    return [...new Set([...r, ...l])].filter((x) => !removed.has(x));
  }
  if (isRec(r) && isRec(l)) {
    const bb = isRec(b) ? b : {};
    const out: Record<string, unknown> = {};
    for (const s of new Set([...Object.keys(r), ...Object.keys(l)])) {
      const rv = r[s];
      const lv = l[s];
      const bv = bb[s];
      let v: unknown;
      if (same(lv, rv) || same(rv, bv)) v = lv;
      else if (same(lv, bv)) v = rv;
      else if (k === 'water' && typeof rv === 'number' && typeof lv === 'number')
        // suv — hisoblagich: ikkala qurilmada qo'shilgani jamlanadi
        v = typeof bv === 'number' ? Math.max(0, rv + lv - bv) : Math.max(rv, lv);
      else v = localWins ? lv : rv;
      if (v !== undefined) out[s] = v;
    }
    return out;
  }
  return localWins ? l : r;
}

/** meta:state — har kalit alohida birlashtiriladi (bir qurilmada suv, boshqasida sozlama o'zgarsa, ikkalasi ham qoladi) */
export function mergeMeta(remote: Record<string, unknown>, local: Record<string, unknown>, base: Record<string, unknown> | undefined, localWins: boolean) {
  const out: Record<string, unknown> = {};
  for (const k of META_KEYS) {
    const v = merge3(k, remote[k], local[k], base?.[k], localWins);
    if (v !== undefined) out[k] = v;
  }
  return out as Partial<Record<MetaKey, unknown>>;
}

interface Ctx {
  hashes: Record<string, string>;
  stamps: Record<string, number>;
  base: Record<string, unknown>;
  edited: Record<string, number>;
}

/** Serverdan kelgan hujjatlarni qurilma holatiga qo'llash */
function applyRemote(docs: RemoteDoc[], c: Ctx, preferServer: boolean) {
  if (!docs.length) return;
  const st = useStore.getState();
  const local = collectDocs();
  let { profile, program, logs, body, food } = st;
  let meta: Record<string, unknown> | null = null;
  for (const d of docs) {
    const k = key(d.kind, d.id);
    const ld = local.get(k);
    // qurilmada sinxronlanmagan tahrir bor va u serverdagidan keyin qilingan
    const dirty = !!ld && hash(ld.data) !== c.hashes[k];
    const editedLater = dirty && (c.edited[k] ?? 0) > d.updatedAt;
    const prefer = preferServer && SINGLETONS.includes(d.kind);
    const localNewer = !prefer && ((c.stamps[k] ?? 0) > d.updatedAt || editedLater);
    if (d.kind === 'food') {
      // ovqat har doim birlashtiriladi
      if ((c.stamps[k] ?? 0) > d.updatedAt) continue;
      c.stamps[k] = Math.max(c.stamps[k] ?? 0, d.updatedAt);
      const remote = d.deleted || !Array.isArray(d.data) ? [] : (d.data as FoodEntry[]);
      const mine = food.filter((e) => e.date === d.id);
      const merged = mergeFood(remote, mine, c.base[k] as string[] | undefined);
      if (!same(merged, mine)) food = [...food.filter((e) => e.date !== d.id), ...merged];
      if (d.deleted) delete c.hashes[k];
      else c.hashes[k] = hash(remote);
      c.base[k] = remote.map((e) => e.id);
      continue;
    }
    if (d.kind === 'meta' && !d.deleted && isRec(d.data)) {
      if ((c.stamps[k] ?? 0) > d.updatedAt) continue;
      c.stamps[k] = Math.max(c.stamps[k] ?? 0, d.updatedAt);
      const h = hash(d.data);
      if (c.hashes[k] !== h) {
        const mine = (ld?.data ?? {}) as Record<string, unknown>;
        meta = mergeMeta(d.data, mine, c.base[k] as Record<string, unknown> | undefined, !prefer && editedLater);
        c.hashes[k] = h;
      }
      c.base[k] = d.data;
      continue;
    }
    if (localNewer) continue;
    c.stamps[k] = d.updatedAt;
    if (d.deleted) {
      delete c.hashes[k];
      if (d.kind === 'log') logs = logs.filter((l) => l.id !== d.id);
      if (d.kind === 'body') body = body.filter((b) => b.date !== d.id);
      continue;
    }
    const h = hash(d.data);
    if (c.hashes[k] === h) continue; // o'zimiz yuborgan nusxa qaytdi
    c.hashes[k] = h;
    if (d.kind === 'profile') profile = d.data as Profile;
    else if (d.kind === 'program') program = d.data as Program;
    else if (d.kind === 'log') logs = [...logs.filter((l) => l.id !== d.id), d.data as WorkoutLog];
    else if (d.kind === 'body') body = [...body.filter((b) => b.date !== d.id), d.data as BodyEntry].sort((a, b) => a.date.localeCompare(b.date));
  }
  // eski mijozdan kelgan haddan tashqari kaloriya tuzatishi chegaraga keltiriladi
  if (meta && typeof meta.kcalAdjust === 'number') meta.kcalAdjust = clampKcalAdjust(meta.kcalAdjust);
  useStore.setState({ profile, program, logs, body, food, ...(meta ?? {}) });
}

let running: Promise<void> | null = null;

export function syncNow(): Promise<void> {
  if (!apiEnabled || !useStore.getState().account) return Promise.resolve();
  running ??= run().finally(() => (running = null));
  return running;
}

async function run() {
  const { setSync } = useStore.getState();
  setSync({ status: 'syncing', error: undefined });
  try {
    const sync = useStore.getState().sync;
    const c: Ctx = { hashes: { ...sync.hashes }, stamps: { ...sync.stamps }, base: { ...sync.base }, edited: sync.edited ?? {} };
    let cursor = sync.cursor;
    // har sahifadan keyin saqlaymiz: uzilib qolsa, qo'llangan o'zgarish ikkinchi marta birlashtirilmaydi
    const save = () => setSync({ cursor, hashes: { ...c.hashes }, stamps: { ...c.stamps }, base: { ...c.base } });
    // Birinchi ulanishda serverdagi profil/dastur ustun: yangi telefondagi bo'sh profil eski ma'lumotni bosib ketmasin
    // (zaxiradan tiklanganda esa — qurilmadagisi)
    const preferServer = cursor === 0 && !sync.forceLocal;
    const pull = async () => {
      let more = true;
      while (more) {
        const res = await api<SyncResponse>('/sync', { body: { since: cursor, changes: [] } });
        applyRemote(res.docs, c, preferServer);
        cursor = res.cursor;
        more = res.more;
        save();
      }
    };

    // 1) avval o'qiymiz va birlashtiramiz — boshqa qurilmadagi yozuvlar bosib ketilmasin
    await pull();

    // 2) qurilmadagi o'zgarishlarni yuborish (tahrir vaqti bilan)
    const local = collectDocs();
    const now = Date.now();
    const edited = useStore.getState().sync.edited ?? {};
    const at = (k: string) => Math.max(Math.min(edited[k] ?? now, now), (c.stamps[k] ?? 0) + 1);
    const changes: (Doc & { updatedAt: number; deleted?: boolean })[] = [];
    for (const [k, d] of local) {
      const h = hash(d.data);
      if (c.hashes[k] !== h) {
        // tahrir vaqti: murabbiy keyinroq yozgan dasturni eski oflayn tahrir bosib ketmasin
        const t = at(k);
        changes.push({ ...d, updatedAt: t });
        c.hashes[k] = h;
        c.stamps[k] = t;
      }
    }
    for (const k of Object.keys(c.hashes)) {
      if (local.has(k)) continue;
      const [kind, ...rest] = k.split(':');
      if (kind !== 'log' && kind !== 'body' && kind !== 'food') continue;
      const t = at(k);
      changes.push({ kind: kind as Kind, id: rest.join(':'), data: null, updatedAt: t, deleted: true });
      delete c.hashes[k];
      c.stamps[k] = t;
    }

    for (let i = 0; i < changes.length; ) {
      const batch = changes.slice(i, i + 400);
      i += batch.length;
      const res = await api<SyncResponse>('/sync', { body: { since: cursor, changes: batch } });
      applyRemote(res.docs, c, false);
      cursor = res.cursor;
      save();
      if (res.more) await pull();
    }
    setSync({ cursor, hashes: c.hashes, stamps: c.stamps, base: c.base, forceLocal: false, uid: useStore.getState().account?.user.id ?? sync.uid, lastSyncAt: Date.now(), status: 'idle' });
    refreshMe().catch(() => {});
  } catch (e) {
    setSync({ status: 'error', error: (e as Error).message });
  }
}

/** Qaysi hujjatlar o'zgardi (tahrir vaqtini yozish uchun) */
export function touchedDocs(s: ReturnType<typeof useStore.getState>, prev: ReturnType<typeof useStore.getState>): string[] {
  const touched: string[] = [];
  if (s.profile !== prev.profile) touched.push('profile:me');
  if (s.program !== prev.program) touched.push('program:current');
  if (META_KEYS.some((k) => s[k] !== prev[k])) touched.push('meta:state');
  if (s.logs !== prev.logs) {
    const before = new Map(prev.logs.map((l) => [l.id, l]));
    const now = new Set(s.logs.map((l) => l.id));
    for (const l of s.logs) if (before.get(l.id) !== l) touched.push(key('log', l.id));
    for (const id of before.keys()) if (!now.has(id)) touched.push(key('log', id));
  }
  if (s.body !== prev.body) {
    const before = new Map(prev.body.map((b) => [b.date, b]));
    const now = new Set(s.body.map((b) => b.date));
    for (const b of s.body) if (before.get(b.date) !== b) touched.push(key('body', b.date));
    for (const d of before.keys()) if (!now.has(d)) touched.push(key('body', d));
  }
  if (s.food !== prev.food) {
    const before = new Map(prev.food.map((e) => [e.id, e]));
    const ids = new Set(s.food.map((e) => e.id));
    const dates = new Set<string>();
    for (const e of s.food) if (before.get(e.id) !== e) dates.add(e.date);
    for (const e of prev.food) if (!ids.has(e.id)) dates.add(e.date);
    for (const d of dates) touched.push(key('food', d));
  }
  return touched;
}

let timer: ReturnType<typeof setTimeout> | null = null;

/** Ilova ishga tushganda: o'zgarishlarni kuzatib, fon rejimida sinxronlash */
export function startAutoSync() {
  if (!apiEnabled) return () => {};
  if (useStore.getState().sync.status === 'syncing') useStore.getState().setSync({ status: 'idle' });
  const schedule = (ms: number) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => void syncNow(), ms);
  };
  const unsub = useStore.subscribe((s, prev) => {
    // tahrir vaqti akkauntsiz ham yoziladi: keyin kirilganda oflayn yozilgan ma'lumot to'g'ri vaqt bilan yuboriladi
    const touched = touchedDocs(s, prev);
    if (touched.length) {
      const at = Date.now();
      s.setSync({ edited: { ...s.sync.edited, ...Object.fromEntries(touched.map((k) => [k, at])) } });
    }
    if (!s.account) return;
    if (!prev.account) return schedule(300);
    if (touched.length) schedule(4000);
  });
  const onFocus = () => document.visibilityState === 'visible' && schedule(500);
  const onOnline = () => schedule(500);
  document.addEventListener('visibilitychange', onFocus);
  window.addEventListener('online', onOnline);
  const iv = setInterval(() => void syncNow(), 5 * 60 * 1000);
  schedule(800);
  return () => {
    unsub();
    document.removeEventListener('visibilitychange', onFocus);
    window.removeEventListener('online', onOnline);
    clearInterval(iv);
  };
}
