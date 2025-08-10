import { logConfig, validateConfig } from '~/utils/config'

export default defineNuxtPlugin(() => {
  // Utiliser notre utilitaire de configuration
  logConfig()

  const validation = validateConfig()

  if (!validation.isValid) {
    console.error('❌ ERREUR: Configuration invalide:', validation.errors)
  } else {
    console.log('✅ Configuration valide')
  }
})
