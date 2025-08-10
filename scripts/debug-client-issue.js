#!/usr/bin/env node

/**
 * Script pour diagnostiquer le problème côté client
 * Simule exactement ce qui se passe dans le navigateur
 */

console.log('🔍 Diagnostic du problème côté client')
console.log('='.repeat(50))

// Simuler les variables d'environnement (comme dans le conteneur)
process.env.FIREBASE_API_KEY = 'AIzaSyAGAry8cF7Ma1aZxhTXvK5dMjjNFZdgKew'
process.env.FIREBASE_AUTH_DOMAIN = 'benevoclic-85ddc.firebaseapp.com'
process.env.FIREBASE_PROJECT_ID = 'benevoclic-85ddc'
process.env.FIREBASE_STORAGE_BUCKET = 'benevoclic-85ddc.firebasestorage.app'
process.env.FIREBASE_MESSAGING_SENDER_ID = '538379400989'
process.env.FIREBASE_APP_ID = '1:538379400989:web:980ce02f88b4512ba993f4'
process.env.FIREBASE_MEASUREMENT_ID = 'G-F7YS4B0QZ8'

// Simuler ce que Nuxt fait au build time (pas au runtime)
const simulateNuxtBuildTime = () => {
  console.log('🔧 Simulation du build time Nuxt:')
  console.log('   Variables disponibles au build:', {
    FIREBASE_API_KEY: process.env.FIREBASE_API_KEY ? 'DÉFINIE' : 'NON DÉFINIE',
    FIREBASE_AUTH_DOMAIN: process.env.FIREBASE_AUTH_DOMAIN ? 'DÉFINIE' : 'NON DÉFINIE',
    FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID ? 'DÉFINIE' : 'NON DÉFINIE'
  })

  // Ceci simule ce que Nuxt génère dans le runtimeConfig.public
  return {
    public: {
      firebaseConfig: {
        apiKey: process.env.FIREBASE_API_KEY || '',
        authDomain: process.env.FIREBASE_AUTH_DOMAIN || '',
        projectId: process.env.FIREBASE_PROJECT_ID || '',
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET || '',
        messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || '',
        appId: process.env.FIREBASE_APP_ID || '',
        measurementId: process.env.FIREBASE_MEASUREMENT_ID || ''
      }
    }
  }
}

// Simuler ce que les plugins voient côté client
const simulateClientSide = () => {
  console.log('\n🎯 Simulation côté client:')

  // Simuler useRuntimeConfig() côté client
  const config = simulateNuxtBuildTime()
  const firebaseConfig = config.public.firebaseConfig

  console.log('📋 Configuration reçue par les plugins:')
  console.log(JSON.stringify(firebaseConfig, null, 2))

  // Test de validation (comme dans vos plugins)
  const isValid = firebaseConfig.apiKey && firebaseConfig.authDomain && firebaseConfig.projectId

  console.log('\n✅ Configuration Firebase valide:', isValid)

  if (!isValid) {
    console.log('❌ Variables manquantes:')
    if (!firebaseConfig.apiKey) console.log('   - apiKey: vide')
    if (!firebaseConfig.authDomain) console.log('   - authDomain: vide')
    if (!firebaseConfig.projectId) console.log('   - projectId: vide')
  }

  return isValid
}

// Tests
const buildTimeConfig = simulateNuxtBuildTime()
const clientSideValid = simulateClientSide()

console.log('\n📊 Analyse du problème:')
console.log('=======================')

if (clientSideValid) {
  console.log("✅ Si ce test passe, le problème vient d'ailleurs")
} else {
  console.log('❌ PROBLÈME IDENTIFIÉ:')
  console.log("   Les variables d'environnement ne sont pas disponibles")
  console.log('   au moment du build de Nuxt.')
  console.log('')
  console.log('🔧 Solutions possibles:')
  console.log('   1. Passer les variables au build Docker (--build-arg)')
  console.log('   2. Utiliser des variables publiques dans nuxt.config.ts')
  console.log('   3. Charger les variables au runtime côté client')
}

console.log('\n💡 Recommandation:')
console.log('   Le problème vient du fait que Nuxt génère le runtimeConfig.public')
console.log('   au moment du build, pas au runtime. Les variables doivent être')
console.log('   disponibles pendant le build Docker.')
