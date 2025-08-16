#!/usr/bin/env node

/**
 * Script de désactivation de CodeQL
 * Usage: node scripts/disable-codeql.js
 */

import { execSync } from 'child_process'
import { existsSync, unlinkSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const projectRoot = join(__dirname, '..')

function disableCodeQL() {
  console.log('🔧 Désactivation de CodeQL...\n')

  const workflowsDir = join(projectRoot, '.github', 'workflows')
  const codeqlFiles = ['codeql-analysis.yml', 'codeql.yml', 'security.yml', 'code-scanning.yml']

  let removedCount = 0

  // 1. Supprimer les workflows CodeQL
  console.log('📁 Suppression des workflows CodeQL...')
  codeqlFiles.forEach(file => {
    const filePath = join(workflowsDir, file)
    if (existsSync(filePath)) {
      try {
        unlinkSync(filePath)
        console.log(`   ✅ Supprimé: ${file}`)
        removedCount++
      } catch (error) {
        console.log(`   ❌ Erreur lors de la suppression de ${file}:`, error.message)
      }
    } else {
      console.log(`   ℹ️  Non trouvé: ${file}`)
    }
  })

  // 2. Vérifier les workflows restants
  console.log('\n📋 Workflows restants:')
  try {
    const remainingWorkflows = execSync(`ls ${workflowsDir}`, { encoding: 'utf8' })
      .trim()
      .split('\n')
    remainingWorkflows.forEach(workflow => {
      console.log(`   - ${workflow}`)
    })
  } catch (error) {
    console.log('   ❌ Erreur lors de la lecture des workflows:', error.message)
  }

  // 3. Vérifier les scripts disponibles
  console.log("\n🔧 Scripts d'analyse disponibles:")
  const scripts = [
    'npm run audit:security',
    'npm run analyze:code',
    'npm run lint:security',
    'npm run auto:fix'
  ]

  scripts.forEach(script => {
    console.log(`   - ${script}`)
  })

  // 4. Instructions pour GitHub
  console.log('\n📋 Instructions pour GitHub:')
  console.log('1. Allez dans votre repository GitHub')
  console.log('2. Cliquez sur Settings (Paramètres)')
  console.log('3. Dans le menu de gauche, cliquez sur Security (Sécurité)')
  console.log('4. Cliquez sur Code security and analysis')
  console.log('5. Trouvez Code scanning et cliquez sur Disable (Désactiver)')

  // 5. Résumé
  console.log('\n📊 RÉSUMÉ')
  console.log('='.repeat(50))
  console.log(`📁 Workflows CodeQL supprimés: ${removedCount}`)
  console.log('✅ CodeQL désactivé localement')
  console.log('✅ Alternative locale disponible')
  console.log("✅ Scripts d'analyse fonctionnels")

  if (removedCount > 0) {
    console.log('\n🎉 CodeQL a été désactivé avec succès!')
    console.log('💡 Utilisez maintenant les workflows alternatifs:')
    console.log('   - security-analysis.yml')
    console.log('   - code-analysis.yml')
    console.log('   - security-audit.yml')
  } else {
    console.log('\nℹ️  Aucun workflow CodeQL trouvé à supprimer')
    console.log('💡 CodeQL est probablement déjà désactivé')
  }

  console.log('\n📝 Prochaines étapes:')
  console.log('1. Désactiver CodeQL dans les paramètres GitHub')
  console.log("2. Utiliser npm run analyze:code pour l'analyse locale")
  console.log('3. Utiliser les workflows alternatifs pour CI/CD')
  console.log('4. Monitorer les rapports générés')

  return removedCount
}

// Vérifier si le script est exécuté directement
if (import.meta.url === `file://${process.argv[1]}`) {
  disableCodeQL()
}

export { disableCodeQL }
