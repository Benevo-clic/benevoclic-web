export default defineNuxtPlugin(({ $i18n }) => {
  // This plugin only runs on the client side
  if (process.client) {
    // Get the saved locale from localStorage
    const savedLocale = localStorage.getItem('locale')
    
    // If a locale is saved in localStorage, use it
    if (savedLocale) {
      // Make sure the locale is one of the supported locales
      const supportedLocales = ['fr', 'en', 'es']
      if (supportedLocales.includes(savedLocale)) {
        // Set the locale
        $i18n.setLocale(savedLocale)
      }
    }
  }
})