import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3003",
        changeOrigin: true,
      },
    },
    host: '127.0.0.1', // changed 'localhost' -> '127.0.0.1'
    port: 5173
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './testSetup.js',
  }
})

// host: '127.0.0.1' change made bacause: https://github.com/node-fetch/node-fetch/issues/1624