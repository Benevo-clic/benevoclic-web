#!/usr/bin/env node

/**
 * Script pour tester les variables d'environnement localement
 * Simule ce que Nuxt fait avec runtimeConfig
 */

console.log('🔍 Test des variables d\'environnement localement')
console.log('=' .repeat(50))

// Charger les variables d'environnement
import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

// Simuler la configuration Nuxt
const runtimeConfig = {
  private: {
    api_base_url: process.env.API_BASE_URL,
    api_sirene_url: process.env.API_SIRENE_URL,
    api_sirene_key: process.env.API_SIRENE_KEY
  },
  public: {
    ssr: true,
    siteUrl: 'https://www.benevoclic.fr',
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

console.log('\n🔧 Variables d\'environnement brutes:')
console.log('FIREBASE_API_KEY:', process.env.FIREBASE_API_KEY ? '✅ DÉFINIE' : '❌ NON DÉFINIE')
console.log('FIREBASE_AUTH_DOMAIN:', process.env.FIREBASE_AUTH_DOMAIN ? '✅ DÉFINIE' : '❌ NON DÉFINIE')
console.log('FIREBASE_PROJECT_ID:', process.env.FIREBASE_PROJECT_ID ? '✅ DÉFINIE' : '❌ NON DÉFINIE')
console.log('FIREBASE_STORAGE_BUCKET:', process.env.FIREBASE_STORAGE_BUCKET ? '✅ DÉFINIE' : '❌ NON DÉFINIE')
console.log('FIREBASE_MESSAGING_SENDER_ID:', process.env.FIREBASE_MESSAGING_SENDER_ID ? '✅ DÉFINIE' : '❌ NON DÉFINIE')
console.log('FIREBASE_APP_ID:', process.env.FIREBASE_APP_ID ? '✅ DÉFINIE' : '❌ NON DÉFINIE')
console.log('FIREBASE_MEASUREMENT_ID:', process.env.FIREBASE_MEASUREMENT_ID ? '✅ DÉFINIE' : '❌ NON DÉFINIE')

console.log('\n🎯 Validation:')
const firebaseConfig = runtimeConfig.public.firebaseConfig
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

console.log('\n📝 Instructions:')
console.log('1. Si les variables sont manquantes, créez un fichier .env.local')
console.log('2. Ajoutez les variables Firebase nécessaires')
console.log('3. Redémarrez le serveur de développement')
