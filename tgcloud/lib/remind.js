// Botdan eslatmalar (scripts/tgcloud/remind.js orqali har soat — GitHub Actions: .github/workflows/reminders.yml):
//  • mashg'ulot kuni, mahalliy vaqt bilan tanlangan soatda: "Bugun — Kuch A: 6 ta mashq, ~55 daqiqa" (bugun shug'ullangan bo'lsa — yo'q)
//  • dushanba: o'tgan hafta natijasi (mashg'ulotlar, setlar, kg) + hisobot havolasi
// Ma'lumot — bulutga sinxronlangan dastur va mashg'ulotlardan (faqat ro'yxatdan o'tganlar). Har tur kuniga bir marta.
import { api, db } from 'sdk';
import { sql } from 'sdk/db';
import { appUrl } from './bot.js';

/** eslatma soatidan keyin shuncha soat ichida yuboriladi (rejalashtiruvchi kechiksa ham) */
const WINDOW_H = 3;
const DAY_MS = 24 * 3600 * 1000;

const localDate = (ms, tz) => new Date(ms + tz * 60000).toISOString().slice(0, 10);
const json = (s) => {
  try {
    return JSON.parse(s);
  } catch {
    return null;
  }
};
const fmtNum = (n) => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

/** Bir kunlik kalit (dedup) — birinchi bo'lib olgan yuboradi */
async function claim(uid, kind, day) {
  const r = await db.run(sql`INSERT INTO notified (user_id, kind, day) VALUES (${uid}, ${kind}, ${day}) ON CONFLICT DO NOTHING RETURNING user_id`);
  return (r.rows ?? []).length > 0;
}

/** Bitta foydalanuvchi uchun { kind, day, msg (sendMessage parametrlari) } yoki null */
export async function reminderFor(u, nowMs, url) {
  const tz = Number(u.tz_offset ?? 300);
  const local = new Date(nowMs + tz * 60000);
  const hour = local.getUTCHours();
  const remindHour = Number(u.remind_hour ?? 8);
  if (hour < remindHour || hour >= remindHour + WINDOW_H) return null;
  const today = local.toISOString().slice(0, 10);
  const weekday = (local.getUTCDay() + 6) % 7; // Du = 0

  const progRow = await db.get(sql`SELECT data FROM docs WHERE user_id = ${u.id} AND kind = 'program' AND doc_id = 'current' AND deleted = 0`);
  const program = progRow ? json(progRow.data) : null;
  const days = Array.isArray(program?.days) ? program.days : [];
  const day = days.find((d) => d && d.weekday === weekday) ?? null;
  const logs = (await db.all(sql`SELECT data FROM docs WHERE user_id = ${u.id} AND kind = 'log' AND deleted = 0 AND updated_at >= ${nowMs - 16 * DAY_MS}`))
    .map((r) => json(r.data))
    .filter((l) => l && l.finishedAt && typeof l.startedAt === 'string');
  const trainedToday = logs.some((l) => localDate(Date.parse(l.startedAt), tz) === today);
  const name = (u.name || '').split(' ')[0];
  const hi = name ? `Salom, ${name}!` : 'Salom!';
  // chiziqli A/B dasturida bu hafta qaysi kun ekani ilovada hisoblanadi — nomini aytmaymiz
  const title = !day ? '' : program?.method === 'linear' ? 'kuch mashg‘uloti' : day.title;
  const todayLine = day && !trainedToday ? `Bugun — ${title}: ${(day.exercises ?? []).length} ta mashq${day.estMin ? `, ~${day.estMin} daqiqa` : ''}.` : '';
  const open = (text, path = '') => (url ? { text, web_app: { url: url + path } } : null);

  if (weekday === 0 && (await claim(u.id, 'week', today))) {
    const from = localDate(nowMs - 7 * DAY_MS, tz);
    const week = logs.filter((l) => {
      const d = localDate(Date.parse(l.startedAt), tz);
      return d >= from && d < today;
    });
    let sets = 0;
    let volume = 0;
    for (const l of week)
      for (const e of l.exercises ?? [])
        for (const s of e.sets ?? [])
          if (s && s.done && !s.warmup) {
            sets++;
            volume += (Number(s.kg) || 0) * (Number(s.reps) || 0);
          }
    const planned = days.length;
    const verdict = !week.length ? 'Bu hafta qaytamizmi? Kichik qadamdan boshlang — 30 daqiqa ham hisob.' : planned && week.length >= planned ? 'Reja to‘liq bajarildi — zo‘r! 🔥' : 'Bu hafta yana bir qadam oldinga!';
    const text = [`📊 ${hi} O‘tgan hafta: ${week.length}${planned ? `/${planned}` : ''} mashg‘ulot${sets ? `, ${sets} set, ${fmtNum(volume)} kg` : ''}.`, verdict, todayLine].filter(Boolean).join('\n\n');
    const rows = [[open('📈 Hisobotni ochish', `report?w=${from}`)], todayLine ? [open('💪 Mashg‘ulotni boshlash')] : []].map((r) => r.filter(Boolean)).filter((r) => r.length);
    return { kind: 'week', day: today, msg: { chat_id: u.tg_id, text, ...(rows.length ? { reply_markup: { inline_keyboard: rows } } : {}) } };
  }
  if (weekday !== 0 && todayLine && (await claim(u.id, 'day', today))) {
    const btn = open('💪 Boshlash');
    return { kind: 'day', day: today, msg: { chat_id: u.tg_id, text: `💪 ${hi} ${todayLine}\nVazn va takrorlar sizga moslab tayyorlangan. Boshlaymizmi?`, ...(btn ? { reply_markup: { inline_keyboard: [[btn]] } } : {}) } };
  }
  return null;
}

/** Barcha eslatmalar (rejalashtiruvchi chaqiradi): { checked, sent, off, errors } */
export async function runReminders(nowMs = Date.now(), send = (p) => api.sendMessage(p)) {
  const users = await db.all(sql`SELECT id, tg_id, name, tz_offset, remind_hour FROM users WHERE remind = 1 AND registered_at IS NOT NULL LIMIT 5000`);
  const base = await appUrl();
  const url = base && !base.endsWith('/') ? base + '/' : base;
  const out = { checked: users.length, sent: 0, off: 0, errors: 0 };
  for (const u of users) {
    let r = null;
    try {
      r = await reminderFor(u, nowMs, url);
      if (!r) continue;
      await send(r.msg);
      out.sent++;
    } catch (e) {
      // foydalanuvchi botni bloklagan / botga hech yozmagan — eslatmalar o'chiriladi
      const blocked = e && (e.code === 403 || (e.code === 400 && /chat not found/i.test(String(e.description ?? ''))));
      if (blocked) {
        await db.run(sql`UPDATE users SET remind = 0 WHERE id = ${u.id}`);
        out.off++;
      } else {
        // vaqtinchalik xato — keyingi soatda qayta urinish uchun belgi olib tashlanadi
        if (r) await db.run(sql`DELETE FROM notified WHERE user_id = ${u.id} AND kind = ${r.kind} AND day = ${r.day}`);
        out.errors++;
      }
    }
  }
  return out;
}
