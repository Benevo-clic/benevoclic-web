import { vi } from 'vitest'
import { config } from '@vue/test-utils'

// Mock global pour useI18n
vi.mock('vue-i18n', () => ({
  useI18n: () => ({
    t: (key: string) => key,
    locale: 'fr',
    locales: ['fr', 'en', 'es'],
    setLocale: vi.fn()
  })
}))

// Mock global pour #imports
vi.mock('#imports', () => ({
  useI18n: () => ({
    t: (key: string) => key,
    locale: 'fr',
    locales: ['fr', 'en', 'es'],
    setLocale: vi.fn()
  }),
  useCookie: () => ({
    value: 'fr',
    set: vi.fn()
  })
}))

// Configuration globale pour Vue Test Utils
config.global.mocks = {
  useI18n: () => ({
    t: (key: string) => key,
    locale: 'fr',
    locales: ['fr', 'en', 'es'],
    setLocale: vi.fn()
  }),
  useCookie: () => ({
    value: 'fr',
    set: vi.fn()
  })
}

// Mock global pour useI18n
;(global as any).useI18n = () => ({
  t: (key: string) => key,
  locale: 'fr',
  locales: ['fr', 'en', 'es'],
  setLocale: vi.fn()
})

// Mock global pour useCookie
;(global as any).useCookie = () => ({
  value: 'fr',
  set: vi.fn()
})
