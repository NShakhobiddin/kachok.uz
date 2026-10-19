// Pullik imkoniyatlar. To'lov tizimi ulanmaguncha (VITE_BILLING≠1) hammasi bepul ishlaydi.
import { apiEnabled } from '../api/client';
import { useStore } from '../store/useStore';

export const BILLING = apiEnabled && import.meta.env.VITE_BILLING === '1';

/** Pro tarifga kiradigan imkoniyatlar — biznes qaroriga ko'ra shu ro'yxatni o'zgartiring */
export const PRO_FEATURES = {
  pdf: 'Haftalik dasturni PDF qilib yuklash',
  meals: 'Shaxsiy kunlik ovqat rejasi',
  coachPlus: 'Murabbiy: 50 tagacha mijoz',
} as const;
export type ProFeature = keyof typeof PRO_FEATURES;

export function useIsPro(): boolean {
  const pro = useStore((s) => s.account?.entitlements?.pro.active ?? false);
  return !BILLING || pro;
}
