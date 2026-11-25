// Bitta telefonda bir nechta Telegram akkaunt (Android multi-akkaunt, umumiy telefon): Mini App xotirasi umumiy bo'lishi mumkin.
// Har Telegram foydalanuvchisining ma'lumoti alohida: boshqa akkaunt ochilganda joriy ma'lumot oldingi egasi nomi bilan
// chetga olinadi, yangi foydalanuvchiniki (bo'lsa) tiklanadi — birovning mashg'ulotlari boshqa akkauntga (va uning bulutiga)
// o'tib ketmaydi. Store yuklanishidan OLDIN chaqiriladi (main.tsx); shu sababli bu fayl hech narsa import qilmaydi.
export const STATE_KEY = 'kachok-v1';
const OWNER_KEY = 'kachok-owner';
const stash = (id: string) => `${STATE_KEY}@${id}`;

/** Saqlangan holat qaysi Telegram foydalanuvchisiniki (sinxron holatidagi "tg:<id>" dan) */
function ownerFromState(raw: string | null): string | null {
  try {
    const uid = raw ? JSON.parse(raw)?.state?.sync?.uid : null;
    return typeof uid === 'string' && uid.startsWith('tg:') ? uid.slice(3) : null;
  } catch {
    return null;
  }
}

type TgWindow = { Telegram?: { WebApp?: { initDataUnsafe?: { user?: { id?: number } } } } };
const currentTgId = () => (typeof window === 'undefined' ? undefined : (window as TgWindow).Telegram?.WebApp?.initDataUnsafe?.user?.id);

export function swapTelegramUser(tgId: number | undefined = currentTgId(), ls?: Storage) {
  try {
    ls ??= localStorage;
    if (!tgId) return;
    const id = String(tgId);
    const cur = ls.getItem(STATE_KEY);
    // egasi yozilmagan (eski versiya) — sinxron holatidan; u ham bo'lmasa, mavjud ma'lumot joriy foydalanuvchiniki deb olinadi
    const owner = ls.getItem(OWNER_KEY) ?? ownerFromState(cur);
    if (owner && owner !== id) {
      if (cur !== null) ls.setItem(stash(owner), cur);
      const mine = ls.getItem(stash(id));
      if (mine !== null) {
        ls.setItem(STATE_KEY, mine);
        ls.removeItem(stash(id));
      } else ls.removeItem(STATE_KEY);
    }
    ls.setItem(OWNER_KEY, id);
  } catch {
    /* localStorage yo'q yoki to'la */
  }
}
