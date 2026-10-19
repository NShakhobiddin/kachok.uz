// Oflayn-birinchi sinxronlash. Qurilma — asosiy manba; server — zaxira va qurilmalar orasidagi ko'prik.
// Har bir yozuv alohida hujjat: profil, dastur, har bir mashg'ulot, har kungi vazn, sozlamalar.
import { useStore } from '../store/useStore';
import type { BodyEntry, Profile, Program, WorkoutLog } from '../types';
import { api, apiEnabled, refreshMe } from './client';

type Kind = 'profile' | 'program' | 'log' | 'body' | 'meta';
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

export function collectDocs(): Map<string, Doc> {
  const s = useStore.getState();
  const out = new Map<string, Doc>();
  const put = (kind: Kind, id: string, data: unknown) => out.set(key(kind, id), { kind, id, data });
  if (s.profile) put('profile', 'me', s.profile);
  if (s.program) put('program', 'current', s.program);
  for (const l of s.logs) if (l.finishedAt) put('log', l.id, l);
  for (const b of s.body) put('body', b.date, b);
  put('meta', 'state', {
    water: s.water,
    readiness: s.readiness,
    lessonsDone: s.lessonsDone,
    kcalAdjust: s.kcalAdjust,
    setDelta: s.setDelta,
    seenAchievements: s.seenAchievements,
    settings: s.settings,
  });
  return out;
}

/** Serverdan kelgan hujjatlarni qurilma holatiga qo'llash */
function applyRemote(docs: RemoteDoc[], hashes: Record<string, string>, stamps: Record<string, number>, preferServer: boolean) {
  const st = useStore.getState();
  let { profile, program, logs, body } = st;
  let meta: Record<string, unknown> | null = null;
  for (const d of docs) {
    const k = key(d.kind, d.id);
    const localNewer = (stamps[k] ?? 0) > d.updatedAt && !(preferServer && SINGLETONS.includes(d.kind));
    if (localNewer) continue;
    stamps[k] = d.updatedAt;
    if (d.deleted) {
      delete hashes[k];
      if (d.kind === 'log') logs = logs.filter((l) => l.id !== d.id);
      if (d.kind === 'body') body = body.filter((b) => b.date !== d.id);
      continue;
    }
    const h = hash(d.data);
    if (hashes[k] === h) continue; // o'zimiz yuborgan nusxa qaytdi
    hashes[k] = h;
    if (d.kind === 'profile') profile = d.data as Profile;
    else if (d.kind === 'program') program = d.data as Program;
    else if (d.kind === 'log') logs = [...logs.filter((l) => l.id !== d.id), d.data as WorkoutLog];
    else if (d.kind === 'body') body = [...body.filter((b) => b.date !== d.id), d.data as BodyEntry].sort((a, b) => a.date.localeCompare(b.date));
    else if (d.kind === 'meta') meta = d.data as Record<string, unknown>;
  }
  useStore.setState({ profile, program, logs, body, ...(meta ?? {}) });
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
    const hashes = { ...sync.hashes };
    const stamps = { ...sync.stamps };
    let cursor = sync.cursor;

    // Birinchi ulanishda avval serverdagini olamiz: yangi telefondagi bo'sh profil eski ma'lumotni bosib ketmasin
    if (cursor === 0) {
      let more = true;
      while (more) {
        const res = await api<SyncResponse>('/sync', { body: { since: cursor, changes: [] } });
        applyRemote(res.docs, hashes, stamps, true);
        cursor = res.cursor;
        more = res.more;
      }
    }

    // Qurilmadagi o'zgarishlarni yuborish
    const local = collectDocs();
    const now = Date.now();
    const changes: (Doc & { updatedAt: number; deleted?: boolean })[] = [];
    const edited = useStore.getState().sync.edited ?? {};
    for (const [k, d] of local) {
      const h = hash(d.data);
      if (hashes[k] !== h) {
        // tahrir vaqti: murabbiy keyinroq yozgan dasturni eski oflayn tahrir bosib ketmasin
        const at = Math.max(Math.min(edited[k] ?? now, now), (stamps[k] ?? 0) + 1);
        changes.push({ ...d, updatedAt: at });
        hashes[k] = h;
        stamps[k] = at;
      }
    }
    for (const k of Object.keys(hashes)) {
      if (local.has(k)) continue;
      const [kind, ...rest] = k.split(':');
      if (kind !== 'log' && kind !== 'body') continue;
      changes.push({ kind: kind as Kind, id: rest.join(':'), data: null, updatedAt: now, deleted: true });
      delete hashes[k];
      stamps[k] = now;
    }

    let i = 0;
    let more = true;
    while (i < changes.length || more) {
      const batch = changes.slice(i, i + 400);
      i += batch.length;
      const res = await api<SyncResponse>('/sync', { body: { since: cursor, changes: batch } });
      applyRemote(res.docs, hashes, stamps, false);
      cursor = res.cursor;
      more = res.more;
      if (!batch.length && !more) break;
    }
    setSync({ cursor, hashes, stamps, lastSyncAt: Date.now(), status: 'idle' });
    refreshMe().catch(() => {});
  } catch (e) {
    setSync({ status: 'error', error: (e as Error).message });
  }
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
  // faqat sinxronlanadigan ma'lumotlar o'zgarganda
  const unsub = useStore.subscribe((s, prev) => {
    if (!s.account) return;
    if (!prev.account) return schedule(300);
    const touched: string[] = [];
    if (s.profile !== prev.profile) touched.push('profile:me');
    if (s.program !== prev.program) touched.push('program:current');
    if (
      s.water !== prev.water ||
      s.readiness !== prev.readiness ||
      s.lessonsDone !== prev.lessonsDone ||
      s.kcalAdjust !== prev.kcalAdjust ||
      s.setDelta !== prev.setDelta ||
      s.seenAchievements !== prev.seenAchievements ||
      s.settings !== prev.settings
    )
      touched.push('meta:state');
    if (!touched.length && s.logs === prev.logs && s.body === prev.body) return;
    if (touched.length) {
      const at = Date.now();
      s.setSync({ edited: { ...s.sync.edited, ...Object.fromEntries(touched.map((k) => [k, at])) } });
    }
    schedule(4000);
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
