import { vi } from 'vitest'

export const useNuxtApp = vi.fn(() => ({
  $fetch: vi.fn(),
  $maplibregl: {
    Map: vi.fn(),
    NavigationControl: vi.fn(),
    GeolocateControl: vi.fn(),
    Popup: vi.fn()
  }
}))

export const navigateTo = vi.fn()
export const useRoute = vi.fn(() => ({
  path: '/',
  query: {},
  params: {}
}))
export const useRouter = vi.fn(() => ({
  push: vi.fn(),
  replace: vi.fn(),
  back: vi.fn()
}))
export const useHead = vi.fn()
export const useSeoMeta = vi.fn()
export const useLazyFetch = vi.fn()
export const useFetch = vi.fn()
export const $fetch = vi.fn()

export default {
  useNuxtApp,
  navigateTo,
  useRoute,
  useRouter,
  useHead,
  useSeoMeta,
  useLazyFetch,
  useFetch,
  $fetch
}
