// Bot sozlamalari — CI `npx tgcloud run endpoints/setupBot '{ appUrl }'` bilan ishga tushiradi.
// Bu fayl tgcloud/ ga faqat `run` paytida nusxalanadi va DEPLOY QILINMAYDI (foydalanuvchilar chaqira olmaydi);
// baribir: haqiqiy Mini App chaqiruvida (initData.user bor) rad etadi.
import { api, EndpointError } from 'sdk';

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

export default async function (input, ctx) {
  if (ctx && ctx.initData && ctx.initData.user) throw new EndpointError('Ruxsat yo‘q', { code: 'FORBIDDEN' });
  const url = input.appUrl;
  if (typeof url !== 'string' || !/^https:\/\/app[0-9A-Za-z_-]+\.tgcloud\.ai\/$/.test(url)) throw new EndpointError('appUrl noto‘g‘ri', { code: 'BAD_URL' });
  await api.setChatMenuButton({ menu_button: { type: 'web_app', text: 'Ochish', web_app: { url } } });
  await api.setMyDescription({ description: DESCRIPTION });
  await api.setMyShortDescription({ short_description: SHORT });
  await api.setMyCommands({ commands: [{ command: 'start', description: 'Ilovani ochish' }] });
  const me = await api.getMe();
  return { bot: me.username, mainApp: Boolean(me.has_main_web_app), menu: url };
}
