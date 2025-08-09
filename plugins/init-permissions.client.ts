export default defineNuxtPlugin(async () => {
  // Ce plugin s'exécute uniquement côté client et en premier
  if (process.client) {
    try {
      // Importer et initialiser les permissions
      const { usePermissions } = await import('~/composables/usePermissions')

      // Utiliser le composable qui initialise automatiquement les permissions
      const { loadCookiePreferences } = usePermissions()

      // Charger les préférences existantes
      loadCookiePreferences()

      console.log('Permissions initialisées avec succès')
    } catch (error) {
      console.error("Erreur lors de l'initialisation des permissions:", error)
    }
  }
})
