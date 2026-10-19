import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// VITE_TARGET=artifact — bitta HTML faylli ko'rgazma (oldindan ko'rish) varianti: PWA'siz, hammasi ichiga joylangan
const artifact = process.env.VITE_TARGET === 'artifact';
// GitHub Pages kabi pastki manzilda joylash uchun, masalan VITE_BASE=/kachok.uz/
const base = process.env.VITE_BASE || '/';

export default defineConfig({
  base,
  plugins: [
    react(),
    !artifact &&
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icon.svg', 'apple-touch-icon.png'],
      manifest: {
        name: 'Kachok — zal murabbiyi',
        short_name: 'Kachok',
        description: 'Sizga moslangan mashq dasturi, animatsion texnika, ovqatlanish va natijalar statistikasi.',
        lang: 'uz',
        start_url: base,
        scope: base,
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#0D1014',
        theme_color: '#0D1014',
        icons: [
          { src: 'icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,woff2}'],
        navigateFallback: `${base}index.html`,
      },
    }),
  ],
  build: artifact
    ? { assetsInlineLimit: 100_000_000, cssCodeSplit: false, chunkSizeWarningLimit: 5000, rollupOptions: { output: { inlineDynamicImports: true } } }
    : { chunkSizeWarningLimit: 900 },
});
