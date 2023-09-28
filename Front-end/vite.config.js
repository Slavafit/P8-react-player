import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
  },
  test:{
    globals: true,
    environment: 'jsdom',
    setupFiles: './test-setup/setup.js',
    testTimeout: 60000,
    include: ['**/*.{test,spec}.{js, mjs, ts}'],
  }
})
