import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import wasm from 'vite-plugin-wasm'
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      'wasm-utils': path.resolve(__dirname, './src/utils')
    }
  },
  plugins: [
    react(),
    wasm()
  ]
})
