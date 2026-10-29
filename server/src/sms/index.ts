// SMS yuborish: ishlab chiqishda — konsolga, production'da — Eskiz.uz orqali.
import type { Env } from '../env.js';

export interface SmsSender {
  send(phone: string, text: string): Promise<void>;
}

/** Faqat ishlab chiqish (DEV_MODE=1): kod va raqam konsolga yoziladi. Production'da loadEnv bunga yo'l qo'ymaydi */
export class ConsoleSms implements SmsSender {
  sent: { phone: string; text: string }[] = [];
  constructor(private log = true) {}
  async send(phone: string, text: string) {
    this.sent.push({ phone, text });
    if (this.log) console.log(`[SMS → +${phone}] ${text}`);
  }
}

/** Eskiz.uz API: token oladi va keshlaydi, muddati tugasa yangilaydi */
export class EskizSms implements SmsSender {
  private token: string | null = null;
  constructor(
    private email: string,
    private password: string,
    private from: string,
    private base = 'https://notify.eskiz.uz/api',
  ) {}

  private async login() {
    const body = new FormData();
    body.set('email', this.email);
    body.set('password', this.password);
    const r = await fetch(`${this.base}/auth/login`, { method: 'POST', body });
    if (!r.ok) throw new Error(`Eskiz login: ${r.status}`);
    const j = (await r.json()) as { data?: { token?: string } };
    if (!j.data?.token) throw new Error('Eskiz login: token yo‘q');
    this.token = j.data.token;
  }

  async send(phone: string, text: string) {
    if (!this.token) await this.login();
    const post = () => {
      const body = new FormData();
      body.set('mobile_phone', phone);
      body.set('message', text);
      body.set('from', this.from);
      return fetch(`${this.base}/message/sms/send`, { method: 'POST', body, headers: { Authorization: `Bearer ${this.token}` } });
    };
    let r = await post();
    if (r.status === 401) {
      await this.login();
      r = await post();
    }
    if (!r.ok) throw new Error(`Eskiz SMS: ${r.status} ${await r.text()}`);
  }
}

export function createSms(env: Env): SmsSender {
  if (env.SMS_PROVIDER === 'eskiz') {
    if (!env.ESKIZ_EMAIL || !env.ESKIZ_PASSWORD) throw new Error('ESKIZ_EMAIL va ESKIZ_PASSWORD kerak');
    return new EskizSms(env.ESKIZ_EMAIL, env.ESKIZ_PASSWORD, env.ESKIZ_FROM);
  }
  if (env.DEV_MODE !== '1') throw new Error('SMS_PROVIDER=console faqat DEV_MODE=1 bilan');
  return new ConsoleSms();
}
