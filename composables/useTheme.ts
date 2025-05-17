import { ref, onMounted, watch } from 'vue'
import { useHead } from '#imports'

export function useTheme() {
  const theme = ref<'light' | 'dark'>('light')

  // Function to toggle theme
  const toggleTheme = () => {
    theme.value = theme.value === 'light' ? 'dark' : 'light'
    localStorage.setItem('theme', theme.value)
  }

  // Function to check if current theme is dark
  const isDarkTheme = () => theme.value === 'dark'

  // Update HTML data-theme attribute when theme changes
  watch(theme, (newTheme) => {
    useHead({
      htmlAttrs: {
        'data-theme': newTheme
      }
    })
  })

  // Initialize theme from localStorage or system preference
  onMounted(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null
    
    if (savedTheme) {
      theme.value = savedTheme
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      // Use system preference as fallback if no saved theme
      theme.value = 'dark'
    }
    
    // Set initial theme
    useHead({
      htmlAttrs: {
        'data-theme': theme.value
      }
    })
  })

  return {
    theme,
    toggleTheme,
    isDarkTheme
  }
}