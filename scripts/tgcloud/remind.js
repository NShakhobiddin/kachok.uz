// Eslatmalar — rejalashtiruvchi (.github/workflows/reminders.yml) har soat `npx tgcloud run endpoints/remind '{}'` bilan chaqiradi.
// Bu fayl tgcloud/ ga faqat `run` paytida nusxalanadi va DEPLOY QILINMAYDI; haqiqiy Mini App chaqiruvi rad etiladi.
import { EndpointError } from 'sdk';
import { runReminders } from '../lib/remind.js';

export default async function (input, ctx) {
  if (ctx && ctx.initData && ctx.initData.user) throw new EndpointError('Ruxsat yo‘q', { code: 'FORBIDDEN' });
  return runReminders(Date.now());
}
