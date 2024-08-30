import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import VueDevTools from 'vite-plugin-vue-devtools'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), VueDevTools()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    proxy: {
      '/Api': {
        target: 'https://romb-art.ru',
        changeOrigin: true,
        secure: false
      }
    }
  },
  build: {
    rollupOptions: {
      output: {
        dir: 'dist',
        entryFileNames: 'vueBundle.js',
        assetFileNames: 'vueStyles.css',
        chunkFileNames: 'vueChunk.js',
        manualChunks: undefined
      }
    }
  }
})
