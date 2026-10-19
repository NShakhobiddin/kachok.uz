export const DAYS = ['Dushanba', 'Seshanba', 'Chorshanba', 'Payshanba', 'Juma', 'Shanba', 'Yakshanba'];
export const DAYS_SHORT = ['Du', 'Se', 'Ch', 'Pa', 'Ju', 'Sh', 'Ya'];
export const MONTHS = ['yanvar', 'fevral', 'mart', 'aprel', 'may', 'iyun', 'iyul', 'avgust', 'sentabr', 'oktabr', 'noyabr', 'dekabr'];

/** Dushanba = 0 */
export function weekdayIdx(d = new Date()): number {
  return (d.getDay() + 6) % 7;
}

export function isoDate(d = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function startOfWeek(d = new Date()): Date {
  const x = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  x.setDate(x.getDate() - weekdayIdx(x));
  return x;
}

export function addDays(d: Date, n: number): Date {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
}

export function fmtDate(iso: string | Date, withYear = false): string {
  const d = typeof iso === 'string' ? new Date(iso.length === 10 ? iso + 'T00:00:00' : iso) : iso;
  return `${d.getDate()}-${MONTHS[d.getMonth()]}${withYear ? ` ${d.getFullYear()}` : ''}`;
}

export function fmtDuration(min: number): string {
  const m = Math.round(min);
  if (m < 60) return `${m} daq`;
  const h = Math.floor(m / 60);
  const r = m % 60;
  return r ? `${h} soat ${r} daq` : `${h} soat`;
}

export function fmtClock(sec: number): string {
  const s = Math.max(0, Math.round(sec));
  const m = Math.floor(s / 60);
  return `${m}:${String(s % 60).padStart(2, '0')}`;
}

export function daysBetween(a: Date, b: Date): number {
  return Math.round((startDay(b).getTime() - startDay(a).getTime()) / 86400000);
}

function startDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

export function greeting(d = new Date()): string {
  const h = d.getHours();
  if (h < 5) return 'Xayrli tun';
  if (h < 11) return 'Xayrli tong';
  if (h < 17) return 'Xayrli kun';
  return 'Xayrli kech';
}
