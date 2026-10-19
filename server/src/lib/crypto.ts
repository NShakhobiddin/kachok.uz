import { createHash, createHmac, randomBytes, randomInt, timingSafeEqual } from 'node:crypto';

export const sha256 = (s: string) => createHash('sha256').update(s).digest('hex');
export const md5 = (s: string) => createHash('md5').update(s).digest('hex');
export const hmac = (secret: string, s: string) => createHmac('sha256', secret).update(s).digest('hex');
export const randomToken = (bytes = 32) => randomBytes(bytes).toString('base64url');

/** 6 xonali SMS kod */
export const otpCode = () => String(randomInt(0, 1_000_000)).padStart(6, '0');

/** Murabbiy taklif kodi: chalkash belgilarsiz (0/O, 1/I) */
const ALPHA = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
export const inviteCode = (len = 6) => Array.from({ length: len }, () => ALPHA[randomInt(0, ALPHA.length)]).join('');

export function safeEqual(a: string, b: string) {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}
