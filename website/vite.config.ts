import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'

/**
 * Website build (see website/prerender.mjs):
 *  - client build: just the stylesheet (+ self-hosted Inter) into website/dist, with a manifest
 *  - SSR build (`--ssr src/render.tsx --outDir .ssr`): the page renderer, run once at build time
 */
export default defineConfig({
  root: fileURLToPath(new URL('.', import.meta.url)),
  publicDir: false,
  plugins: [react(), tailwindcss()],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    manifest: true,
    rollupOptions: { input: { site: fileURLToPath(new URL('./src/site.css', import.meta.url)) } },
  },
})
