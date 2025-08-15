#!/usr/bin/env node

/**
 * Script de vérification de la configuration d'environnement
 * Usage: node scripts/check-env.js
 */

import { config } from 'dotenv'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const projectRoot = join(__dirname, '..')

// Charger les variables d'environnement depuis le fichier .env
config({ path: join(projectRoot, '.env') })

const requiredVars = {
  API_BASE_URL: "URL de l'API backend",
  API_SIRENE_URL: "URL de l'API Sirene",
  API_SIRENE_KEY: 'Clé API Sirene',
  FIREBASE_API_KEY: 'Clé API Firebase',
  FIREBASE_AUTH_DOMAIN: "Domaine d'authentification Firebase",
  FIREBASE_PROJECT_ID: 'ID du projet Firebase',
  FIREBASE_STORAGE_BUCKET: 'Bucket de stockage Firebase',
  FIREBASE_MESSAGING_SENDER_ID: "ID de l'expéditeur Firebase",
  FIREBASE_APP_ID: "ID de l'application Firebase",
  FIREBASE_MEASUREMENT_ID: 'ID de mesure Firebase',
  PORT: 'Port du serveur',
  NODE_ENV: 'Environnement Node.js',
  API_TIMEOUT: 'Timeout des requêtes API',
  API_RETRY_COUNT: 'Nombre de tentatives API',
  GOOGLE_CALLBACK_URL: 'URL de callback Google OAuth'
}

function checkEnvironment() {
  console.log("🔍 Vérification de la configuration d'environnement...\n")

  const missing = []
  const warnings = []

  // Vérifier chaque variable requise
  for (const [key, description] of Object.entries(requiredVars)) {
    const value = process.env[key]

    if (!value || value.trim() === '') {
      missing.push(`${key} (${description})`)
    } else if (value === 'undefined' || value === 'null') {
      missing.push(`${key} (${description}) - valeur invalide: ${value}`)
    }
  }

  // Vérifications spécifiques
  if (process.env.API_BASE_URL && !isValidUrl(process.env.API_BASE_URL)) {
    warnings.push("API_BASE_URL n'est pas une URL valide")
  }

  if (process.env.PORT && isNaN(Number(process.env.PORT))) {
    warnings.push('PORT doit être un nombre valide')
  }

  // Afficher les résultats
  if (missing.length > 0) {
    console.error("❌ Variables d'environnement manquantes:")
    missing.forEach(v => console.error(`  - ${v}`))
    console.log('\n💡 Pour résoudre ce problème:')
    console.log('   1. Vérifiez que le fichier .env existe')
    console.log('   2. Exécutez: npm run setup:env')
    console.log('   3. Modifiez le fichier .env avec vos vraies valeurs')
    console.log('   4. Consultez docs/ENVIRONMENT_SETUP.md')
    return false
  }

  if (warnings.length > 0) {
    console.warn('⚠️ Avertissements de configuration:')
    warnings.forEach(w => console.warn(`  - ${w}`))
  }

  console.log('✅ Configuration valide!')
  console.log('\n📊 Configuration actuelle:')
  console.log(`  - API Base URL: ${process.env.API_BASE_URL}`)
  console.log(`  - API Timeout: ${process.env.API_TIMEOUT}ms`)
  console.log(`  - API Retry Count: ${process.env.API_RETRY_COUNT}`)
  console.log(`  - Port: ${process.env.PORT}`)
  console.log(`  - Node Env: ${process.env.NODE_ENV}`)
  console.log(`  - Firebase Project: ${process.env.FIREBASE_PROJECT_ID}`)

  return true
}

function isValidUrl(url) {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

// Vérifier si le script est exécuté directement
if (import.meta.url === `file://${process.argv[1]}`) {
  const isValid = checkEnvironment()
  process.exit(isValid ? 0 : 1)
}

export { checkEnvironment }
