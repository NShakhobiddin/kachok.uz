// Offline rejim (service worker) va yangilanish: yangi versiya chiqqanda telefon eski keshni ko'rsatib qolmasin.
let registration: ServiceWorkerRegistration | undefined;

/** Yangi versiyani tekshirish: har 30 daqiqada va ilova qayta ochilganda (fon rejimidan qaytganda) */
export function registerPwa() {
  if (!import.meta.env.PROD || import.meta.env.VITE_TARGET === 'artifact' || !('serviceWorker' in navigator)) return;
  import('virtual:pwa-register')
    .then(({ registerSW }) =>
      registerSW({
        immediate: true,
        onRegisteredSW(_url, r) {
          registration = r;
          if (!r) return;
          const check = () => {
            if (navigator.onLine) r.update().catch(() => {});
          };
          setInterval(check, 30 * 60 * 1000);
          document.addEventListener('visibilitychange', () => document.visibilityState === 'visible' && check());
        },
      }),
    )
    .catch(() => {});
}

export const APP_VERSION = `${__BUILD_TIME__.slice(0, 16).replace('T', ' ')} UTC · ${__APP_VERSION__}`;

/** Majburiy yangilash: keshlangan fayllar va service worker o'chiriladi, sahifa qayta yuklanadi (ma'lumotlar saqlanib qoladi) */
export async function forceUpdate() {
  try {
    await registration?.update();
    const regs = (await navigator.serviceWorker?.getRegistrations()) ?? [];
    await Promise.all(regs.map((r) => r.unregister()));
    if ('caches' in window) await Promise.all((await caches.keys()).map((k) => caches.delete(k)));
  } finally {
    location.reload();
  }
}
