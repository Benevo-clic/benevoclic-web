import { EnvValidator } from '~/utils/env-validator'

export default defineNuxtPlugin(() => {
  try {
    EnvValidator.validateRequired()
    console.log("✅ Configuration d'environnement validée avec succès")
  } catch (error: any) {
    console.error('❌ ERREUR CRITIQUE - Configuration invalide:', error.message)
    console.error("💡 Vérifiez votre fichier .env et les variables d'environnement")

    // En production, on fait crasher l'application
    if (process.env.NODE_ENV === 'production') {
      console.error("🚨 Arrêt de l'application en raison d'une configuration invalide")
      process.exit(1)
    }
  }
})
