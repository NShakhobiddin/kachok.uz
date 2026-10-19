import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icon.svg', 'apple-touch-icon.png'],
      manifest: {
        name: 'Kachok — zal murabbiyi',
        short_name: 'Kachok',
        description: 'Sizga moslangan mashq dasturi, animatsion texnika, ovqatlanish va natijalar statistikasi.',
        lang: 'uz',
        start_url: '/',
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
        navigateFallback: '/index.html',
      },
    }),
  ],
  build: { chunkSizeWarningLimit: 900 },
});
