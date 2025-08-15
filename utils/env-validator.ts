export class EnvValidator {
  private static requiredVars = {
    API_BASE_URL: "URL de l'API backend",
    API_SIRENE_URL: "URL de l'API Sirene",
    API_SIRENE_KEY: process.env.KEY?.toUpperCase() || 'Clé API Sirene',

    FIREBASE_API_KEY: process.env.KEY?.toUpperCase() || 'Clé API Firebase',
    FIREBASE_AUTH_DOMAIN: "Domaine d'authentification Firebase",
    FIREBASE_PROJECT_ID: 'ID du projet Firebase',
    FIREBASE_STORAGE_BUCKET: 'Bucket de stockage Firebase',
    FIREBASE_MESSAGING_SENDER_ID: "ID de l'expéditeur Firebase",
    FIREBASE_APP_ID: "ID de l'application Firebase",
    FIREBASE_MEASUREMENT_ID: 'ID de mesure Firebase',

    // Server Configuration
    PORT: 'Port du serveur',
    NODE_ENV: 'Environnement Node.js',

    // Timeouts
    API_TIMEOUT: 'Timeout des requêtes API',
    API_RETRY_COUNT: 'Nombre de tentatives API',

    // OAuth
    GOOGLE_CALLBACK_URL: 'URL de callback Google OAuth'
  }

  /**
   * Valide toutes les variables d'environnement requises
   * @throws Error si des variables sont manquantes
   */
  static validateRequired(): void {
    const missing: string[] = []
    const warnings: string[] = []

    // Vérifier chaque variable requise
    for (const [key, description] of Object.entries(this.requiredVars)) {
      const value = process.env[key]

      if (!value || value.trim() === '') {
        missing.push(`${key} (${description})`)
      } else if (value === 'undefined' || value === 'null') {
        missing.push(`${key} (${description}) - valeur invalide: ${value}`)
      }
    }

    // Vérifications spécifiques
    if (process.env.API_BASE_URL && !this.isValidUrl(process.env.API_BASE_URL)) {
      warnings.push("API_BASE_URL n'est pas une URL valide")
    }

    if (process.env.PORT && isNaN(Number(process.env.PORT))) {
      warnings.push('PORT doit être un nombre valide')
    }

    // Lancer les erreurs si nécessaire
    if (missing.length > 0) {
      const errorMessage = `❌ Variables d'environnement manquantes:\n${missing.map(v => `  - ${v}`).join('\n')}`
      console.error(errorMessage)
      throw new Error(`Configuration invalide: ${missing.length} variable(s) manquante(s)`)
    }

    // Afficher les avertissements
    if (warnings.length > 0) {
      console.warn(
        `⚠️ Avertissements de configuration:\n${warnings.map(w => `  - ${w}`).join('\n')}`
      )
    }
  }

  /**
   * Valide une URL
   */
  private static isValidUrl(url: string): boolean {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }

  /**
   * Retourne la configuration validée
   */
  static getConfig() {
    return {
      api: {
        baseUrl: process.env.API_BASE_URL!,
        sireneUrl: process.env.API_SIRENE_URL!,
        sireneKey: process.env.API_SIRENE_KEY!,
        timeout: parseInt(process.env.API_TIMEOUT || '30000'),
        retryCount: parseInt(process.env.API_RETRY_COUNT || '3')
      },
      firebase: {
        apiKey: process.env.FIREBASE_API_KEY!,
        authDomain: process.env.FIREBASE_AUTH_DOMAIN!,
        projectId: process.env.FIREBASE_PROJECT_ID!,
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET!,
        messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID!,
        appId: process.env.FIREBASE_APP_ID!,
        measurementId: process.env.FIREBASE_MEASUREMENT_ID!
      },
      server: {
        port: parseInt(process.env.PORT || '5482'),
        nodeEnv: process.env.NODE_ENV || 'development'
      },
      oauth: {
        googleCallbackUrl: process.env.GOOGLE_CALLBACK_URL!
      }
    }
  }

  /**
   * Vérifie si l'environnement est en production
   */
  static isProduction(): boolean {
    return process.env.NODE_ENV === 'production'
  }

  /**
   * Vérifie si l'environnement est en développement
   */
  static isDevelopment(): boolean {
    return process.env.NODE_ENV === 'development'
  }
}
