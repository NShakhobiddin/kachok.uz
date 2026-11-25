// Bitta telefonda ikki Telegram akkaunt: ma'lumotlar aralashib ketmaydi.
import { describe, expect, it } from 'vitest';
import { STATE_KEY, swapTelegramUser } from '../tgStorage';

function mem(init: Record<string, string> = {}): Storage {
  const m = new Map(Object.entries(init));
  return {
    get length() {
      return m.size;
    },
    clear: () => m.clear(),
    getItem: (k) => m.get(k) ?? null,
    key: (i) => [...m.keys()][i] ?? null,
    removeItem: (k) => void m.delete(k),
    setItem: (k, v) => void m.set(k, String(v)),
  };
}
const state = (name: string, uid?: string) => JSON.stringify({ state: { profile: { name }, sync: { uid } } });

describe('Telegram foydalanuvchisi bo‘yicha xotira', () => {
  it('boshqa akkaunt ochsa — oldingisi chetga olinadi, yangisi bo‘sh; qaytsa — tiklanadi', () => {
    const ls = mem({ [STATE_KEY]: state('Ali') });
    swapTelegramUser(1, ls); // birinchi ochilish: mavjud ma'lumot shu foydalanuvchiniki
    expect(JSON.parse(ls.getItem(STATE_KEY)!).state.profile.name).toBe('Ali');
    swapTelegramUser(2, ls); // boshqa akkaunt
    expect(ls.getItem(STATE_KEY)).toBeNull();
    ls.setItem(STATE_KEY, state('Vali'));
    swapTelegramUser(1, ls); // birinchisi qaytdi
    expect(JSON.parse(ls.getItem(STATE_KEY)!).state.profile.name).toBe('Ali');
    swapTelegramUser(2, ls);
    expect(JSON.parse(ls.getItem(STATE_KEY)!).state.profile.name).toBe('Vali');
  });

  it('eski versiya (egasi yozilmagan): sinxron holatidagi tg:<id> bo‘yicha aniqlanadi', () => {
    const ls = mem({ [STATE_KEY]: state('Ali', 'tg:1') });
    swapTelegramUser(2, ls);
    expect(ls.getItem(STATE_KEY)).toBeNull();
    swapTelegramUser(1, ls);
    expect(JSON.parse(ls.getItem(STATE_KEY)!).state.profile.name).toBe('Ali');
  });

  it('Telegram’dan tashqarida — hech narsa o‘zgarmaydi', () => {
    const ls = mem({ [STATE_KEY]: state('Ali') });
    swapTelegramUser(undefined, ls);
    expect(JSON.parse(ls.getItem(STATE_KEY)!).state.profile.name).toBe('Ali');
  });
});

describe('Qayta ro‘yxatdan o‘tish (boshqa qurilmada akkaunt o‘chirilib, qayta ochilgan)', () => {
  it('ro‘yxat vaqti o‘zgarsa — sinxron holati boshidan (eski kursor yangi akkauntda ishlamaydi)', async () => {
    const { useStore } = await import('../../store/useStore');
    const st = useStore.getState();
    st.setCloud({ tgId: 5, name: 'A', phone: null, at: '2026-01-01T00:00:00.000Z' });
    st.setSync({ cursor: 42, hashes: { 'log:1': 'x' }, stamps: { 'log:1': 1 } });
    useStore.getState().setCloud({ tgId: 5, name: 'A', phone: '998', at: '2026-01-01T00:00:00.000Z' });
    expect(useStore.getState().sync.cursor).toBe(42); // faqat raqam qo'shildi
    useStore.getState().setCloud({ tgId: 5, name: 'A', phone: null, at: '2026-06-01T00:00:00.000Z' });
    expect(useStore.getState().sync.cursor).toBe(0);
    expect(useStore.getState().sync.hashes).toEqual({});
  });
});
