import { resolve } from 'path'
import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  test: {
    environment: 'happy-dom',
    setupFiles: ['./test/setup.ts'],
    globals: true,
    deps: {
      inline: ['nuxt', 'nuxt-app']
    }
  },
  resolve: {
    alias: {
      '~': resolve(__dirname, '.'),
      '~~': resolve(__dirname, '.'),
      '@': resolve(__dirname, '.'),
      '@@': resolve(__dirname, '.'),
      '#app': resolve(__dirname, './test/mocks/nuxt-app.js'),
      '#imports': resolve(__dirname, './test/mocks/nuxt-imports.js'),
      '#components': resolve(__dirname, './test/mocks/nuxt-components.js'),
      'nuxt-app': resolve(__dirname, './test/mocks/nuxt-app.js')
    }
  }
})
