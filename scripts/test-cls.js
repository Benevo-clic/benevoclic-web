#!/usr/bin/env node

/**
 * Script de test pour le CLS (Cumulative Layout Shift)
 * Utilise Lighthouse pour mesurer le CLS
 */

import { execSync } from 'child_process'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const URL = 'http://localhost:5482'
const OUTPUT_DIR = './lighthouse-reports'
const REPORT_FILE = path.join(OUTPUT_DIR, 'cls-report.json')

// Créer le dossier de sortie s'il n'existe pas
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true })
}

console.log('🚀 Test du CLS en cours...')
console.log(`📊 URL testée: ${URL}`)

try {
  // Exécuter Lighthouse avec focus sur les performances
  const command = `lighthouse ${URL} --output=json --output-path=${REPORT_FILE} --only-categories=performance --chrome-flags="--headless --no-sandbox --disable-dev-shm-usage"`

  console.log('⏳ Exécution de Lighthouse...')
  execSync(command, { stdio: 'inherit' })

  // Lire le rapport
  const report = JSON.parse(fs.readFileSync(REPORT_FILE, 'utf8'))

  // Extraire les métriques
  const cls = report.audits['cumulative-layout-shift']?.numericValue || 0
  const lcp = report.audits['largest-contentful-paint']?.numericValue || 0
  const fcp = report.audits['first-contentful-paint']?.numericValue || 0

  console.log('\n📈 Résultats des métriques:')
  console.log(`CLS: ${cls.toFixed(3)} ${cls <= 0.1 ? '✅' : '❌'} (objectif: ≤ 0.1)`)
  console.log(`LCP: ${(lcp / 1000).toFixed(2)}s ${lcp <= 2500 ? '✅' : '❌'} (objectif: ≤ 2.5s)`)
  console.log(`FCP: ${(fcp / 1000).toFixed(2)}s ${fcp <= 1800 ? '✅' : '❌'} (objectif: ≤ 1.8s)`)

  // Afficher les recommandations si CLS > 0.1
  if (cls > 0.1) {
    console.log('\n🔧 Recommandations pour améliorer le CLS:')
    console.log('1. Ajouter des dimensions (width/height) à toutes les images')
    console.log("2. Utiliser des aspect-ratio CSS pour réserver l'espace")
    console.log("3. Éviter d'insérer du contenu au-dessus du contenu existant")
    console.log('4. Utiliser des polices web avec font-display: swap')
    console.log('5. Précharger les ressources critiques')
  }

  // Afficher les éléments qui causent le CLS
  const clsElements = report.audits['layout-shift-elements']?.details?.items || []
  if (clsElements.length > 0) {
    console.log('\n🎯 Éléments causant le CLS:')
    clsElements.forEach((element, index) => {
      console.log(
        `${index + 1}. ${element.node?.snippet || 'Élément inconnu'} (CLS: ${element.score.toFixed(3)})`
      )
    })
  }

  console.log(`\n📄 Rapport complet: ${REPORT_FILE}`)
} catch (error) {
  console.error('❌ Erreur lors du test:', error.message)
  process.exit(1)
}
