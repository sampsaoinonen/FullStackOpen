import { defineConfig } from 'cypress'

export default defineConfig({
  e2e: {
    baseUrl: 'http://127.0.0.1:5173', // changed 'localhost' -> '127.0.0.1'
    setupNodeEvents(on, config) {

    },
  },
})

// host: '127.0.0.1' change made bacause: https://github.com/node-fetch/node-fetch/issues/1624