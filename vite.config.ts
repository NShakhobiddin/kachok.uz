import { execSync } from 'node:child_process';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// VITE_TARGET=artifact — bitta HTML faylli ko'rgazma (oldindan ko'rish) varianti: PWA'siz, hammasi ichiga joylangan
const artifact = process.env.VITE_TARGET === 'artifact';
// GitHub Pages kabi pastki manzilda joylash uchun, masalan VITE_BASE=/kachok.uz/
const base = process.env.VITE_BASE || '/';
// ilovada ko'rinadigan versiya: qaysi commit va qachon yig'ilgan (eski kesh bilan adashmaslik uchun)
const commit = (() => {
  if (process.env.GITHUB_SHA) return process.env.GITHUB_SHA.slice(0, 7);
  try {
    return execSync('git rev-parse --short HEAD').toString().trim();
  } catch {
    return 'dev';
  }
})();

export default defineConfig({
  base,
  define: {
    __APP_VERSION__: JSON.stringify(commit),
    __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
  },
  plugins: [
    react(),
    !artifact &&
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icon.svg', 'apple-touch-icon.png', 'fonts/big-shoulders.woff2'],
      manifest: {
        name: 'GYMbos — zal murabbiyi',
        short_name: 'GYMbos',
        description: 'Gapirma — bos. Sizga moslangan mashq dasturi, har bir mashq texnikasi, ovqatlanish va natijalar.',
        lang: 'uz',
        start_url: base,
        scope: base,
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#0B0B0C',
        theme_color: '#0B0B0C',
        icons: [
          { src: 'icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,woff2}', 'bodymap/*.webp', 'illustrations/thumb/*.webp'],
        navigateFallback: `${base}index.html`,
        // Telegram Serverless endpointlari (POST /api/<nom>) — ilova sahifasi emas
        navigateFallbackDenylist: [/^\/api\//],
        // 3D model (~3.6 MB) oldindan yuklanmaydi: birinchi ochilganda keshga tushadi va keyin internetsiz ishlaydi
        runtimeCaching: [
          {
            urlPattern: /\/models\/.*\.glb$/,
            handler: 'CacheFirst',
            options: { cacheName: 'kachok-models', expiration: { maxEntries: 4 } },
          },
          // mashq illyustratsiyalari: ochilganda yuklanadi va keyin internetsiz ham ko'rinadi
          // rasmlar bir xil nom bilan yangilanadi (tuzatilgan rasm) — keshdan darhol ko'rsatiladi va fonda yangilanadi
          {
            urlPattern: /\/illustrations\/.*\.webp$/,
            handler: 'StaleWhileRevalidate',
            options: { cacheName: 'kachok-illustrations', expiration: { maxEntries: 300 } },
          },
          // 3D harakat videolari: to‘liq fayl keshda bo‘lsa — darhol (bo‘lak so‘rovlari ham keshdan), internetsiz ham
          {
            urlPattern: /\/videos\/.*\.(mp4|webm)$/,
            handler: 'CacheFirst',
            options: { cacheName: 'kachok-videos', rangeRequests: true, cacheableResponse: { statuses: [200] }, expiration: { maxEntries: 150 } },
          },
          {
            urlPattern: /\/videos\/.*\.webp$/,
            handler: 'StaleWhileRevalidate',
            options: { cacheName: 'kachok-illustrations', expiration: { maxEntries: 300 } },
          },
        ],
      },
    }),
  ],
  build: artifact
    ? { assetsInlineLimit: 100_000_000, cssCodeSplit: false, chunkSizeWarningLimit: 5000, rollupOptions: { output: { inlineDynamicImports: true } } }
    : { chunkSizeWarningLimit: 900 },
});
