// Telegram Mini App: ilova Telegram ichida ochilganda o'zini oddiy ilovadek tutadi —
// to'liq ekran, pastga tortilganda yopilib qolmaydi, ranglar bir xil, Telegram'ning "orqaga" tugmasi ishlaydi.
// SDK faqat Telegram ichida yuklanadi (index.html), oddiy brauzer va PWA'da bu modul hech narsa qilmaydi.
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';

type Haptic = 'light' | 'medium' | 'heavy' | 'rigid' | 'soft';
type Notice = 'success' | 'warning' | 'error';

interface TgButton {
  show: () => void;
  hide: () => void;
  onClick: (cb: () => void) => void;
  offClick: (cb: () => void) => void;
}

interface TgWebApp {
  initData: string;
  initDataUnsafe: { user?: { first_name?: string } };
  platform: string;
  version: string;
  isVersionAtLeast: (v: string) => boolean;
  ready: () => void;
  expand: () => void;
  requestFullscreen?: () => void;
  disableVerticalSwipes?: () => void;
  enableClosingConfirmation: () => void;
  disableClosingConfirmation: () => void;
  setHeaderColor: (c: string) => void;
  setBackgroundColor: (c: string) => void;
  setBottomBarColor?: (c: string) => void;
  openLink: (url: string) => void;
  BackButton: TgButton;
  SettingsButton?: TgButton;
  HapticFeedback?: { impactOccurred: (s: Haptic) => void; notificationOccurred: (t: Notice) => void };
}

declare global {
  interface Window {
    Telegram?: { WebApp?: TgWebApp };
  }
}

const BG = '#0b0b0c';

/** Telegram ichida ochilganmi (SDK yuklangan va Telegram ma'lumot bergan) */
export function telegram(): TgWebApp | undefined {
  const w = window.Telegram?.WebApp;
  return w && w.platform && w.platform !== 'unknown' ? w : undefined;
}

export const isTelegram = () => !!telegram();

const MOBILE = ['android', 'ios'];

/** Ilova ochilishi bilan bir marta: o'lcham, ranglar, siljish va havolalar */
export function initTelegram() {
  const tg = telegram();
  if (!tg) return;
  document.documentElement.classList.add('tg');
  const at = (v: string) => tg.isVersionAtLeast(v);
  try {
    tg.expand();
    // telefonda — butun ekran (Telegram sarlavhasi yo'q, ilovadek); kompyuterda oyna o'zi yetarli
    if (MOBILE.includes(tg.platform) && at('8.0')) tg.requestFullscreen?.();
    // pastga tortilganda (ro'yxat, 3D model) Telegram ilovani yopib yubormasin
    if (at('7.7')) tg.disableVerticalSwipes?.();
    if (at('6.1')) {
      tg.setHeaderColor(BG);
      tg.setBackgroundColor(BG);
    }
    if (at('7.10')) tg.setBottomBarColor?.(BG);
    // Sozlamalar (⋯ menyusida) — profil sahifasi
    if (at('7.0')) tg.SettingsButton?.show();
  } catch {
    /* eski Telegram — oddiy oynada ishlaydi */
  }
  // tashqi havolalar (manbalar, DOI) ilova ichida emas, brauzerda ochilsin — ilovadan chiqib ketmaslik uchun
  document.addEventListener('click', (e) => {
    const a = (e.target as Element | null)?.closest?.('a[href]') as HTMLAnchorElement | null;
    if (!a || !/^https?:/.test(a.href) || a.origin === location.origin) return;
    e.preventDefault();
    tg.openLink(a.href);
  });
  tg.ready();
}

/** Tebranish: Telegram'da uning haptic API'si (iPhone'da ham ishlaydi), aks holda navigator.vibrate */
const PATTERN = { tick: 25, done: [200, 100, 200], record: [40, 60, 40, 60, 120] };
export function haptic(kind: keyof typeof PATTERN) {
  const tg = telegram();
  try {
    if (tg?.HapticFeedback && tg.isVersionAtLeast('6.1')) {
      if (kind === 'tick') tg.HapticFeedback.impactOccurred('light');
      else tg.HapticFeedback.notificationOccurred('success');
      return;
    }
    navigator.vibrate?.(PATTERN[kind]);
  } catch {
    /* qo‘llab-quvvatlanmaydi */
  }
}

// asosiy bo'limlar: bu yerda "orqaga" o'rniga Telegram'ning "yopish" tugmasi turadi
const ROOTS = ['/', '/program', '/library', '/nutrition', '/progress'];

/** Router ichida: Telegram'ning "orqaga" va "sozlamalar" tugmalari, mashg'ulot paytida yopishni tasdiqlash */
export function useTelegramBridge() {
  const loc = useLocation();
  const nav = useNavigate();
  const active = useStore((s) => !!s.active);
  const tg = telegram();

  const root = ROOTS.includes(loc.pathname);
  const onboardingStart = loc.pathname === '/onboarding' && !loc.search;
  const showBack = !!tg && !root && !onboardingStart;
  const first = loc.key === 'default';

  useEffect(() => {
    if (!tg) return;
    const back = () => (first ? nav('/', { replace: true }) : nav(-1));
    if (showBack) {
      tg.BackButton.show();
      tg.BackButton.onClick(back);
    } else tg.BackButton.hide();
    return () => tg.BackButton.offClick(back);
  }, [tg, showBack, first, nav]);

  useEffect(() => {
    const sb = tg?.SettingsButton;
    if (!sb) return;
    const open = () => nav('/profile');
    sb.onClick(open);
    return () => sb.offClick(open);
  }, [tg, nav]);

  // mashg'ulot davom etayotganda tasodifan yopib yuborilmasin
  useEffect(() => {
    if (!tg?.isVersionAtLeast('6.2')) return;
    if (active) tg.enableClosingConfirmation();
    else tg.disableClosingConfirmation();
  }, [tg, active]);
}

/** Telegram profilidagi ism — tanishuvda ism maydonini oldindan to'ldirish uchun */
export const telegramFirstName = () => telegram()?.initDataUnsafe.user?.first_name?.trim().slice(0, 40) ?? '';
