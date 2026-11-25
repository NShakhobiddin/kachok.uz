// Qisqa signallar (dam tugadi, poza tugadi). iOS/Safari ovozni faqat foydalanuvchi teginishidan keyin yoqadi:
// shuning uchun bitta umumiy AudioContext har teginishda "uyg'otiladi" (installAudioUnlock) va taymerdan qayta ishlatiladi.
let ctx: AudioContext | null = null;

function context(): AudioContext | null {
  try {
    const C = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!C) return null;
    ctx ??= new C();
    if (ctx.state === 'suspended') void ctx.resume().catch(() => {});
    return ctx;
  } catch {
    return null;
  }
}

/** Ilova ochilganda bir marta: har teginishda ovoz kontekstini yoqib qo'yadi (fon rejimidan qaytganda ham) */
export function installAudioUnlock() {
  const unlock = () => void context();
  window.addEventListener('pointerdown', unlock, { passive: true });
  window.addEventListener('touchend', unlock, { passive: true });
}

/** Ohanglar ketma-ketligi: [chastota Gts, boshlanishi s, davomiyligi s] */
export function playTones(tones: [number, number, number][], gain = 0.25) {
  const c = context();
  if (!c) return;
  try {
    for (const [freq, at, dur] of tones) {
      const o = c.createOscillator();
      const g = c.createGain();
      o.frequency.value = freq;
      g.gain.setValueAtTime(0.0001, c.currentTime + at);
      g.gain.exponentialRampToValueAtTime(gain, c.currentTime + at + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + at + dur);
      o.connect(g).connect(c.destination);
      o.start(c.currentTime + at);
      o.stop(c.currentTime + at + dur + 0.01);
    }
  } catch {
    /* ovoz mavjud emas */
  }
}
