import { useEffect, useRef, useState } from 'react';

export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(
    () => typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches,
  );
  useEffect(() => {
    const mq = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    if (!mq) return;
    const on = () => setReduced(mq.matches);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);
  return reduced;
}

/** Har soniyada yangilanadigan vaqt (taymerlar uchun) */
export function useNow(intervalMs = 1000) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);
  return now;
}

/**
 * Ikki bosqichli tasdiq (xavfli amallar uchun): birinchi bosish tasdiqni ko'rsatadi, ikkinchi bosish faqat ~0.4 s dan
 * keyin qabul qilinadi — tasodifiy ikki marta bosish (double-tap) o'chirishni bajarib yubormaydi.
 */
export function useArmed(delayMs = 400) {
  const [armedAt, setArmedAt] = useState<number | null>(null);
  return {
    armed: armedAt !== null,
    arm: () => setArmedAt(Date.now()),
    disarm: () => setArmedAt(null),
    /** tasdiq tugmasi bosildi: bajarish mumkinmi */
    ready: () => armedAt !== null && Date.now() - armedAt >= delayMs,
  };
}

/** element ekranga yaqinlashganda (margin ichida) bir marta true bo‘ladi — og‘ir qismlarni kechiktirib yuklash uchun */
export function useNear<T extends Element>(margin = '300px'): [React.RefObject<T | null>, boolean] {
  const ref = useRef<T>(null);
  const [near, setNear] = useState(false);
  useEffect(() => {
    if (near) return;
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      setNear(true);
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setNear(true);
          io.disconnect();
        }
      },
      { rootMargin: margin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [near, margin]);
  return [ref, near];
}
