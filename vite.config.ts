// vite.config.ts （ファイル全体をこれに置き換え）
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// ESM import で Tailwind を読み込む（require を使わない）
import tailwindcss from 'tailwindcss'
import autoprefixer from 'autoprefixer'

export default defineConfig({
  plugins: [react()],
  css: {
    postcss: {
      plugins: [
        tailwindcss(),      // Tailwind v3 を適用
        autoprefixer(),
      ],
    },
  },
  // 他の設定（必要なら追加）
  server: {
    port: 5173,
  },
  build: {
    outDir: 'dist',
  },
})