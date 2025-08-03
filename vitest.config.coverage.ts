import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  test: {
    environment: 'happy-dom',
    globals: true,
    setupFiles: ['./test/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        '.nuxt/',
        '.output/',
        'coverage/',
        'test/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/types/**',
        '**/interfaces/**',
        '**/enums/**',
        '**/stores/**',
        '**/composables/**',
        '**/middleware/**',
        '**/plugins/**',
        '**/server/**',
        '**/utils/**',
        '**/mock/**',
        '**/docs/**',
        '**/scripts/**',
        '**/lighthouse-reports/**',
        '**/public/**',
        '**/assets/**',
        '**/i18n/**',
        '**/types/**',
        '**/layouts/**',
        '**/pages/**'
      ],
      include: [
        'components/**/*.vue',
        'components/**/*.ts'
      ],
      thresholds: {
        global: {
          branches: 70,
          functions: 70,
          lines: 70,
          statements: 70
        }
      }
    }
  },
  resolve: {
    alias: {
      '~': resolve(__dirname, '.'),
      '@': resolve(__dirname, '.')
    }
  }
}) 