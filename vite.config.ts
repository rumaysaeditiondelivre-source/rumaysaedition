import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function disableClientWebSocketPlugin() {
  return {
    name: 'disable-client-websocket',
    transform(code: string, id: string) {
      if (id.includes('vite/dist/client/client.mjs') || id.includes('@vite/client')) {
        return code
          .replace(
            /createConnection:\s*\(\)\s*=>\s*new WebSocket\([^)]+\)/g,
            'createConnection: () => ({ readyState: 1, OPEN: 1, addEventListener() {}, removeEventListener() {}, send() {}, close() {} })'
          )
          .replace(
            /new WebSocket\([^)]+\)/g,
            '({ readyState: 1, OPEN: 1, addEventListener() {}, removeEventListener() {}, send() {}, close() {} })'
          );
      }
    },
  };
}

export default defineConfig(() => {
  return {
    base: '/',
    plugins: [
      disableClientWebSocketPlugin(),
      react(),
      tailwindcss(),
      VitePWA({
        registerType: 'autoUpdate',
        injectRegister: 'auto',
        includeAssets: ['favicon.ico', 'favicon.svg', 'apple-touch-icon.png', 'pwa-192x192.png', 'pwa-512x512.png'],
        manifest: {
          id: '/',
          name: 'دار رميسة للنشر والتوزيع - المتجر ونظام POS',
          short_name: 'دار رميسة',
          description: 'منصة دار النشر والترجمة والتوزيع رميسة إيديسيو: متجر كتب فاخر، بيع ورقي وإلكتروني ePub، كاشير معارض الكتاب POS، وبوابات شارجلي باي.',
          start_url: '/',
          scope: '/',
          display: 'standalone',
          orientation: 'portrait-primary',
          background_color: '#1c1917',
          theme_color: '#1c1917',
          dir: 'rtl',
          lang: 'ar',
          icons: [
            {
              src: '/pwa-192x192.png',
              sizes: '192x192',
              type: 'image/png',
              purpose: 'any',
            },
            {
              src: '/pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any',
            },
            {
              src: '/pwa-maskable-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'maskable',
            },
            {
              src: '/apple-touch-icon.png',
              sizes: '180x180',
              type: 'image/png',
              purpose: 'any',
            },
          ],
        },
        workbox: {
          globPatterns: ['**/*.{js,css,html,ico,png,svg,json}'],
          cleanupOutdatedCaches: true,
          maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
        },
        devOptions: {
          enabled: false,
        },
      }),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    build: {
      outDir: 'dist',
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
