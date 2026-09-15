import { resolve } from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Design playground: character sheet + product plan, rendered with the real app components.
export default defineConfig({
  root: __dirname,
  base: './',
  plugins: [react()],
  server: { port: 5199 },
  build: {
    outDir: resolve(__dirname, '../out/design'),
    emptyOutDir: true,
    rollupOptions: {
      input: {
        sheet: resolve(__dirname, 'index.html'),
        plan: resolve(__dirname, 'plan.html')
      }
    }
  }
})
