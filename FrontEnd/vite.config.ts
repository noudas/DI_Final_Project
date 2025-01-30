import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  build: {
    sourcemap: false, // Ignora erros de source map
  },
  esbuild: {
    logOverride: { 'this-is-undefined-in-esm': 'silent' }, // Ignora certos erros
  },
  plugins: [react()],
})
