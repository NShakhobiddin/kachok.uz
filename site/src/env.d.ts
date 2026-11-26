/// <reference types="vite/client" />
/** kanonik manzil, masalan https://gymbos.uz (oxirida / siz) */
declare const __SITE_URL__: string;

interface ImportMetaEnv {
  /** ilovaning brauzer versiyasi manzili */
  readonly VITE_APP_URL?: string;
  readonly VITE_TG_BOT?: string;
}
