import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react({ jsxRuntime: 'classic' }), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@shell': path.resolve(__dirname, './src/shell'),
      '@handoff': path.resolve(__dirname, './src/handoff'),
      '@graduated': path.resolve(__dirname, './src/graduated'),
      '@dev-mode': path.resolve(__dirname, './dev-mode'),
    },
  },
})
