import { ref, onMounted, watch } from 'vue'
import { useHead } from '#imports'

const theme = ref<'light' | 'dark'>('light')
let initialized = false

export function useTheme () {
  const toggleTheme = () => {
    theme.value = theme.value === 'light' ? 'dark' : 'light'
    localStorage.setItem('theme', theme.value)
  }

  const isDarkTheme = () => theme.value === 'dark'

  watch(theme, (newTheme) => {
    useHead({
      htmlAttrs: {
        'data-theme': newTheme
      }
    })
  })

  onMounted(() => {
    if (!initialized) {
      const savedTheme = localStorage.getItem('theme') as
        | 'light'
        | 'dark'
        | null

      if (savedTheme) {
        theme.value = savedTheme
      } else if (
        window.matchMedia &&
        window.matchMedia('(prefers-color-scheme: dark)').matches
      ) {
        theme.value = 'dark'
      }

      useHead({
        htmlAttrs: {
          'data-theme': theme.value
        }
      })

      initialized = true
    }
  })

  return {
    theme,
    toggleTheme,
    isDarkTheme
  }
}
