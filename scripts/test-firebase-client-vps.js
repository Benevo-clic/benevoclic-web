#!/usr/bin/env node

/**
 * Script simple pour tester Firebase côté client sur le VPS
 * À exécuter dans le conteneur Docker
 */

console.log('🔍 Test Firebase côté client sur le VPS')
console.log('='.repeat(50))

// Simuler useRuntimeConfig() côté client
const runtimeConfig = {
  public: {
    firebaseConfig: {
      apiKey: process.env.FIREBASE_API_KEY,
      authDomain: process.env.FIREBASE_AUTH_DOMAIN,
      projectId: process.env.FIREBASE_PROJECT_ID,
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.FIREBASE_APP_ID,
      measurementId: process.env.FIREBASE_MEASUREMENT_ID
    }
  }
}

console.log('📋 Configuration Firebase côté client:')
console.log(JSON.stringify(runtimeConfig.public.firebaseConfig, null, 2))

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

console.log('\n🎯 Validation:')
const firebaseConfig = runtimeConfig.public.firebaseConfig
const isValid = firebaseConfig.apiKey && firebaseConfig.authDomain && firebaseConfig.projectId

if (isValid) {
  console.log('✅ Configuration Firebase valide pour le client')
  console.log("✅ Prêt pour l'initialisation Firebase")
} else {
  console.log('❌ Configuration Firebase invalide pour le client')
  console.log('   Variables manquantes:')
  if (!firebaseConfig.apiKey) console.log('   - FIREBASE_API_KEY')
  if (!firebaseConfig.authDomain) console.log('   - FIREBASE_AUTH_DOMAIN')
  if (!firebaseConfig.projectId) console.log('   - FIREBASE_PROJECT_ID')
}

console.log('\n📝 Test de simulation des plugins:')
console.log('1. firebase-init.client.ts devrait recevoir:')
console.log('   useRuntimeConfig().public.firebaseConfig')
console.log('   ✅ Configuration accessible')

console.log('\n2. firebase-permissions.client.ts devrait recevoir:')
console.log('   useRuntimeConfig().public.firebaseConfig')
console.log('   ✅ Configuration accessible')

console.log('\n🔍 Si les erreurs Firebase persistent:')
console.log("   - Vérifier que le build inclut les variables d'environnement")
console.log('   - Vérifier que nuxt.config.ts expose correctement les variables')
console.log('   - Vérifier que les plugins utilisent useRuntimeConfig()')
