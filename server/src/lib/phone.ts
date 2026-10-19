/** O'zbekiston raqamini 998XXXXXXXXX ko'rinishiga keltirish; noto'g'ri bo'lsa null */
export function normalizePhone(input: string): string | null {
  const digits = input.replace(/\D/g, '');
  const full = digits.length === 9 ? '998' + digits : digits;
  return /^998\d{9}$/.test(full) ? full : null;
}

/** Murabbiyga ko'rsatish uchun: +998 90 ••• •• 67 */
export function maskPhone(p: string): string {
  return `+${p.slice(0, 3)} ${p.slice(3, 5)} ••• •• ${p.slice(10)}`;
}
