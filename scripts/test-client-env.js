#!/usr/bin/env node

/**
 * Script pour tester les variables d'environnement côté client
 * Simule ce que Nuxt fait avec useRuntimeConfig()
 */

// Simuler la configuration Nuxt
const mockRuntimeConfig = {
  public: {
    firebaseConfig: {
      apiKey: process.env.FIREBASE_API_KEY,
      authDomain: process.env.FIREBASE_AUTH_DOMAIN,
      projectId: process.env.FIREBASE_PROJECT_ID,
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.FIREBASE_APP_ID,
      measurementId: process.env.FIREBASE_MEASUREMENT_ID
    },
    ssr: true,
    siteUrl: 'https://www.benevoclic.fr'
  }
}

console.log("🔍 Test des variables d'environnement côté client")
console.log('='.repeat(60))

console.log('📋 Configuration Firebase:')
console.log(JSON.stringify(mockRuntimeConfig.public.firebaseConfig, null, 2))

console.log("\n🔧 Variables d'environnement brutes:")
console.log('FIREBASE_API_KEY:', process.env.FIREBASE_API_KEY ? '✅ DÉFINIE' : '❌ NON DÉFINIE')
console.log(
  'FIREBASE_AUTH_DOMAIN:',
  process.env.FIREBASE_AUTH_DOMAIN ? '✅ DÉFINIE' : '❌ NON DÉFINIE'
)
console.log(
  'FIREBASE_PROJECT_ID:',
  process.env.FIREBASE_PROJECT_ID ? '✅ DÉFINIE' : '❌ NON DÉFINIE'
)
console.log(
  'FIREBASE_STORAGE_BUCKET:',
  process.env.FIREBASE_STORAGE_BUCKET ? '✅ DÉFINIE' : '❌ NON DÉFINIE'
)
console.log(
  'FIREBASE_MESSAGING_SENDER_ID:',
  process.env.FIREBASE_MESSAGING_SENDER_ID ? '✅ DÉFINIE' : '❌ NON DÉFINIE'
)
console.log('FIREBASE_APP_ID:', process.env.FIREBASE_APP_ID ? '✅ DÉFINIE' : '❌ NON DÉFINIE')
console.log(
  'FIREBASE_MEASUREMENT_ID:',
  process.env.FIREBASE_MEASUREMENT_ID ? '✅ DÉFINIE' : '❌ NON DÉFINIE'
)

console.log('\n🎯 Validation:')
const firebaseConfig = mockRuntimeConfig.public.firebaseConfig
const isValid = firebaseConfig.apiKey && firebaseConfig.authDomain && firebaseConfig.projectId

if (isValid) {
  console.log('✅ Configuration Firebase valide pour le client')
} else {
  console.log('❌ Configuration Firebase invalide pour le client')
  console.log('   Variables manquantes:')
  if (!firebaseConfig.apiKey) console.log('   - FIREBASE_API_KEY')
  if (!firebaseConfig.authDomain) console.log('   - FIREBASE_AUTH_DOMAIN')
  if (!firebaseConfig.projectId) console.log('   - FIREBASE_PROJECT_ID')
}

console.log('\n📝 Note: En production, ces variables doivent être définies dans:')
console.log('   - GitHub Secrets (pour CI/CD)')
console.log("   - Variables d'environnement du serveur")
console.log('   - Fichier .env.production (pour le build)')
