// Bot: ilova manzili, taklif havolasi va /start javobi.
// Ilova manzili — bot menyu tugmasidan (CI uni app<id>.tgcloud.ai ga o'rnatadi: scripts/tgcloud/setupBot.js);
// topilmasa — t.me/<bot>?startapp havolasi (BotFather'dagi asosiy Mini App).
import { api } from 'sdk';

// getMe natijasi isolate ichida 10 daqiqa saqlanadi (BotFather'da asosiy Mini App yoqilsa — tez orada ko'rinadi)
let meCache = null;
let meAt = 0;
async function botInfo() {
  if (!meCache || Date.now() - meAt > 10 * 60 * 1000) {
    meCache = await api.getMe();
    meAt = Date.now();
  }
  return meCache;
}
/** testlar uchun */
export function resetBotCache() {
  meCache = null;
}

export async function appUrl() {
  try {
    const mb = await api.getChatMenuButton({});
    if (mb && mb.type === 'web_app' && mb.web_app && typeof mb.web_app.url === 'string') return mb.web_app.url;
  } catch {
    /* menyu tugmasi o'qilmadi */
  }
  return null;
}

/** Do'st taklifi: asosiy Mini App yoqilgan bo'lsa — to'g'ridan-to'g'ri ilova, aks holda bot chati (/start f_KOD) */
export async function inviteLink(code) {
  try {
    const me = await botInfo();
    return { bot: me.username, invite: me.has_main_web_app ? `https://t.me/${me.username}?startapp=f_${code}` : `https://t.me/${me.username}?start=f_${code}` };
  } catch {
    return { bot: null, invite: null };
  }
}

/** Xabarga javob (sendMessage parametrlari) yoki null */
export async function startReply(message) {
  if (!message || !message.chat || message.chat.type !== 'private') return null;
  const text = typeof message.text === 'string' ? message.text.trim() : '';
  const name = ((message.from && message.from.first_name) || '').slice(0, 64).trim();
  const hi = name ? `Salom, ${name}!` : 'Salom!';
  const start = /^\/start(?:@\w+)?(?:\s+(\S+))?$/.exec(text);
  const m = start && start[1] ? /^f_([A-Za-z0-9]{6,12})$/.exec(start[1]) : null;
  const friend = m ? m[1].toUpperCase() : null;
  const body = friend
    ? `${hi} Do‘stingiz sizni GYMbos’ga taklif qildi 🤝\n\nIlovani oching — do‘stlar ro‘yxatiga avtomatik qo‘shilasiz, bir-biringizning mashg‘ulotlarini ko‘rib, «💪» bilan qo‘llab-quvvatlaysiz.`
    : start
      ? `${hi} 👋\n\nGYMbos — zal uchun aqlli murabbiy: darajangiz va jihozingizga mos haftalik reja, har setda vazn bo‘yicha maslahat, rekordlar, haftalik hisobot va do‘stlar lentasi.\n\nBoshlash uchun pastdagi tugmani bosing.`
      : 'Ilovani ochish uchun pastdagi tugmani yoki «Ochish» menyusini bosing.';
  const url = await appUrl();
  let button;
  if (url) {
    const href = friend ? `${url}${url.includes('?') ? '&' : '?'}friend=${friend}` : url;
    button = { text: '💪 GYMbos’ni ochish', web_app: { url: href } };
  } else {
    const me = await botInfo();
    button = { text: '💪 GYMbos’ni ochish', url: `https://t.me/${me.username}?startapp${friend ? `=f_${friend}` : ''}` };
  }
  return { chat_id: message.chat.id, text: body, reply_markup: { inline_keyboard: [[button]] } };
}
