import { VitePWA } from 'vite-plugin-pwa'

/** Web-only app shell. API calls, runtime configuration and user data are never precached. */
export function createPwaPlugin() {
  return VitePWA({
    strategies: 'injectManifest',
    srcDir: 'src/pwa',
    filename: 'sw.ts',
    injectRegister: null,
    registerType: 'prompt',
    devOptions: { enabled: false },
    manifest: {
      id: './',
      name: 'Prompt Studio',
      short_name: 'Prompt Studio',
      description: '写出更清晰的提示词，保存你的创作。',
      lang: 'zh-CN',
      start_url: './',
      scope: './',
      display: 'standalone',
      background_color: '#ffffff',
      theme_color: '#ffffff',
      icons: [
        { src: 'pwa/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
        { src: 'pwa/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
        { src: 'pwa/maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
      ],
    },
    injectManifest: {
      globPatterns: ['**/*.{html,js,css,png,svg,ico,woff,woff2}'],
      globIgnores: ['config.js', '**/*.map', '**/sw.js'],
      // UI includes the editors and renderers used offline; no remote or user content.
      maximumFileSizeToCacheInBytes: 12 * 1024 * 1024,
    },
  })
}
