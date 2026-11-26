// Reklama sayti (GYMbos haqida, interaktiv kalkulyatorlar): ilova ma’lumotlaridan foydalanadi, oldindan HTML qilib yig‘iladi.
// Yig‘ish: npm run build:site → dist-site (GitHub Pages’da ildizda, ilova esa app/ da — scripts/compose-pages.mjs).
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const here = (p: string) => fileURLToPath(new URL(p, import.meta.url));
// GitHub Pages pastki manzili (masalan /kachok.uz/) yoki o‘z domeni bo‘lsa — /
const base = process.env.SITE_BASE || '/';

export default defineConfig(({ isSsrBuild }) => ({
  root: here('.'),
  base,
  publicDir: here('./public'),
  plugins: [react()],
  define: {
    // kanonik manzil (og:image, sitemap uchun to‘liq URL)
    __SITE_URL__: JSON.stringify((process.env.SITE_URL || 'https://nshakhobiddin.github.io/kachok.uz').replace(/\/$/, '')),
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
