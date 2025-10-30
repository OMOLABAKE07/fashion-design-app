import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    vue(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: [
        'favicon.ico',
        'apple-touch-icon.png',
        'masked-icon.svg'
      ],
      manifest: {
        name: 'Fashion Design App',
        short_name: 'FashionApp',
        description: 'A PWA fashion design app built with Vue and Vite',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        display: 'standalone',
        start_url: '/fashion-design-app/',
        scope: '/fashion-design-app/',
        icons: [
          {
            src: '/fashion-design-app/img/android-chrome-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/fashion-design-app/img/android-chrome-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      },
      workbox: {
        navigateFallback: '/fashion-design-app/index.html'
      }
    })
  ],
  base: '/fashion-design-app/', // Required for GitHub Pages deployment
})