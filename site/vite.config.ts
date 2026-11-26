// Reklama sayti (GYMbos haqida, interaktiv kalkulyatorlar): ilova ma’lumotlaridan foydalanadi, oldindan HTML qilib yig‘iladi.
// Yig‘ish: SITE_URL=https://domen.uz npm run build:site → dist-site (istalgan statik hostingga yuklanadi).
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const here = (p: string) => fileURLToPath(new URL(p, import.meta.url));
// nisbiy manzillar: sayt domen ildizida ham, istalgan papkada ham ishlaydi
const base = process.env.SITE_BASE || './';

export default defineConfig(({ isSsrBuild }) => ({
  root: here('.'),
  base,
  publicDir: here('./public'),
  plugins: [react()],
  define: {
    // nisbiy base’da Vite SSR uchun BASE_URL ni "/" qiladi — sahifa va brauzer bir xil "./" ko‘rsin (rasmlar, tana xaritasi)
    'import.meta.env.BASE_URL': JSON.stringify(base),
    // kanonik manzil (og:image, sitemap uchun to‘liq URL); berilmasa — almashtiriladigan belgi
    __SITE_URL__: JSON.stringify((process.env.SITE_URL || 'https://SIZNING-DOMENINGIZ.uz').replace(/\/$/, '')),
  },
  server: { port: 5180 },
  build: isSsrBuild
    ? { outDir: here('../dist-site-ssr'), emptyOutDir: true }
    : {
        outDir: here('../dist-site'),
        emptyOutDir: true,
        rollupOptions: { input: { index: here('./index.html'), maxfiylik: here('./maxfiylik.html') } },
      },
}));
