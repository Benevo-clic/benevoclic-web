import { EnvValidator } from '~/utils/env-validator'

export default defineNuxtPlugin(() => {
  try {
    EnvValidator.validateRequired()

    const config = EnvValidator.getConfig()
  } catch (error: any) {
    process.env.NODE_ENV !== 'production' &&
      console.error('❌ ERREUR CRITIQUE - Configuration invalide:', error.message)
    process.env.NODE_ENV !== 'production' &&
      console.error("💡 Vérifiez votre fichier .env et les variables d'environnement")

    // En production, on peut choisir de faire crasher l'application
    if (process.env.NODE_ENV === 'production') {
      process.env.NODE_ENV !== 'production' &&
        console.error("🚨 Arrêt de l'application en raison d'une configuration invalide")
      process.exit(1)
    }
  }
})
