// Telegram botni sozlash — botning o'z serveri shart emas (sozlamalar Telegram'da saqlanadi):
//  • chap pastdagi menyu tugmasi «Ochish» → GYMbos Mini App
//  • bot tavsifi (birinchi ochilganda) va qisqa tavsif (profil)
//  • API_URL berilgan bo'lsa — webhook: /start ga salom va ilovani ochish tugmasi (server/src/routes/telegram.ts)
// Ishga tushirish: GitHub → Actions → «Telegram bot» → Run workflow (token: repo secret TELEGRAM_BOT_TOKEN).
// Mahalliy: TELEGRAM_BOT_TOKEN=... [API_URL=https://...] node scripts/telegram-bot.mjs
import { createHmac } from 'node:crypto';
import { appendFileSync } from 'node:fs';

const TOKEN = (process.env.TELEGRAM_BOT_TOKEN ?? '').trim();
const TG = (process.env.TG_API || 'https://api.telegram.org').replace(/\/$/, '');
const API_URL = (process.env.API_URL ?? '').trim().replace(/\/$/, '');
const [owner, repo] = (process.env.GITHUB_REPOSITORY || 'NShakhobiddin/kachok.uz').split('/');
const APP_URL = (process.env.APP_URL ?? '').trim() || `https://${owner.toLowerCase()}.github.io/${repo}/`;

const summary = [];
const say = (line = '') => {
  console.log(line);
  summary.push(line);
};
const finish = (code = 0) => {
  if (process.env.GITHUB_STEP_SUMMARY) appendFileSync(process.env.GITHUB_STEP_SUMMARY, summary.join('\n') + '\n');
  process.exit(code);
};

if (!TOKEN) {
  console.log('::warning::TELEGRAM_BOT_TOKEN berilmagan: Settings → Secrets and variables → Actions → New repository secret');
  say('### Telegram bot sozlanmadi');
  say('`TELEGRAM_BOT_TOKEN` secret yo‘q. @BotFather → /newbot (yoki /token) → tokenni repo secret sifatida qo‘shing va qayta ishga tushiring.');
  finish(0);
}
if (!/^\d+:[\w-]{30,}$/.test(TOKEN)) {
  console.log('::error::TELEGRAM_BOT_TOKEN noto‘g‘ri ko‘rinishda (kutilgan: 123456789:AA...)');
  finish(1);
}

/** Bot API chaqiruvi; token hech qachon chiqarilmaydi */
async function call(method, body = {}) {
  const res = await fetch(`${TG}/bot${TOKEN}/${method}`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body), signal: AbortSignal.timeout(30_000) });
  const data = await res.json().catch(() => ({ ok: false, description: `HTTP ${res.status}` }));
  if (!data.ok) throw new Error(`${method}: ${data.description ?? 'xato'}`);
  return data.result;
}

const DESCRIPTION = [
  'GYMbos — zal uchun aqlli murabbiy.',
  '',
  '• Darajangiz, jihozingiz va cheklovlaringizga mos haftalik reja',
  '• Har setda vazn va takror bo‘yicha maslahat, texnika ko‘rsatmalari',
  '• Rekordlar, haftalik hisobot va ovqatlanish',
  '• Do‘stlar lentasi: bir-biringizni «💪» bilan qo‘llab-quvvatlang',
  '',
  'Boshlash uchun «Ochish» tugmasini bosing.',
].join('\n');
const SHORT = 'Zal uchun aqlli murabbiy: shaxsiy reja, setlar bo‘yicha maslahat, natijalar va do‘stlar lentasi.';

try {
  const me = await call('getMe');
  say(`### Bot: @${me.username}`);
  console.log(`bot=@${me.username}`);
  if (process.env.GITHUB_OUTPUT) appendFileSync(process.env.GITHUB_OUTPUT, `username=${me.username}\n`);

  await call('setChatMenuButton', { menu_button: { type: 'web_app', text: 'Ochish', web_app: { url: APP_URL } } });
  say(`- ✅ Menyu tugmasi «Ochish» → ${APP_URL}`);
  await call('setMyDescription', { description: DESCRIPTION });
  await call('setMyShortDescription', { short_description: SHORT });
  say('- ✅ Tavsif va qisqa tavsif');

  if (me.has_main_web_app === false) {
    console.log('::warning::Asosiy Mini App yoqilmagan — taklif havolalari (t.me/bot?startapp=...) ishlamaydi');
    say(`- ⚠️ Asosiy Mini App yoqilmagan: @BotFather → /mybots → @${me.username} → Bot Settings → Configure Mini App → Enable Mini App → ${APP_URL}`);
  } else if (me.has_main_web_app) say(`- ✅ Asosiy Mini App yoqilgan: https://t.me/${me.username}?startapp`);

  if (API_URL) {
    const health = await fetch(`${API_URL}/health`, { signal: AbortSignal.timeout(100_000) }).then((r) => r.ok, () => false);
    if (!health) {
      console.log(`::warning::${API_URL}/health javob bermadi — webhook o‘rnatilmadi`);
      say(`- ⚠️ Server (${API_URL}) javob bermadi — webhook keyinroq: shu workflow'ni qayta ishga tushiring`);
    } else {
      const secret = createHmac('sha256', TOKEN).update('gymbos-webhook').digest('hex'); // server/src/lib/telegram.ts → webhookSecret
      await call('setWebhook', { url: `${API_URL}/telegram/webhook`, secret_token: secret, allowed_updates: ['message'], drop_pending_updates: true });
      await call('setMyCommands', { commands: [{ command: 'start', description: 'Ilovani ochish' }] });
      say(`- ✅ Webhook: ${API_URL}/telegram/webhook — /start ga bot javob beradi`);
    }
  } else {
    const info = await call('getWebhookInfo');
    say(info.url ? `- ℹ️ Webhook avvalgidek: ${info.url}` : '- ℹ️ Server (API_URL) hali yo‘q — bot /start ga javob bermaydi, lekin «Ochish» tugmasi ilovani ochadi');
  }
  say('');
  say(`Bot: https://t.me/${me.username} · Do‘st taklifi: https://t.me/${me.username}?startapp=f_KOD`);
  finish(0);
} catch (e) {
  console.log(`::error::${e.message}`);
  say(`- ❌ ${e.message}`);
  finish(1);
}
