#!/usr/bin/env node

/**
 * Script de configuration automatique des variables d'environnement
 * Usage: node scripts/setup-env.js
 */

import { writeFileSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const projectRoot = join(__dirname, '..')

const envContent = `# Configuration API
API_BASE_URL=http://localhost:3000
API_SIRENE_URL=https://api.insee.fr/entreprises/sirene/V3
API_SIRENE_KEY=your_sirene_api_key_here

# Configuration Firebase
FIREBASE_API_KEY=your_firebase_api_key_here
FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_STORAGE_BUCKET=your-project.appspot.com
FIREBASE_MESSAGING_SENDER_ID=123456789
FIREBASE_APP_ID=1:123456789:web:abcdef123456
FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX

# Configuration Serveur
PORT=5482
NODE_ENV=production

# Timeouts et Retry
API_TIMEOUT=30000
API_RETRY_COUNT=3

# OAuth
GOOGLE_CALLBACK_URL=http://localhost:5482/auth/google/callback
`

function setupEnv() {
  const envPath = join(projectRoot, '.env')

  if (existsSync(envPath)) {
    console.log('⚠️  Le fichier .env existe déjà')
    console.log("   Si vous voulez le recréer, supprimez-le d'abord")
    return
  }

  try {
    writeFileSync(envPath, envContent, 'utf8')
    console.log('✅ Fichier .env créé avec succès!')
    console.log('📝 Prochaines étapes:')
    console.log('   1. Modifiez le fichier .env avec vos vraies valeurs')
    console.log("   2. Redémarrez l'application")
    console.log("   3. Consultez docs/ENVIRONMENT_SETUP.md pour plus d'informations")
  } catch (error) {
    console.error('❌ Erreur lors de la création du fichier .env:', error.message)
  }
}

// Vérifier si le script est exécuté directement
if (import.meta.url === `file://${process.argv[1]}`) {
  setupEnv()
}

export { setupEnv }
