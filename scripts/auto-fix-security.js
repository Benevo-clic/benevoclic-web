#!/usr/bin/env node

/**
 * Script de correction automatique des issues de sécurité non-critiques
 * Usage: node scripts/auto-fix-security.js
 */

import { readFileSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { execSync } from 'child_process'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const projectRoot = join(__dirname, '..')

function autoFixSecurity() {
  console.log('🔧 Début de la correction automatique des issues de sécurité...\n')

  try {
    // 1. Exécuter la correction ESLint
    console.log('🔧 Correction ESLint...')
    try {
      execSync('npm run lint:fix', { cwd: projectRoot, stdio: 'inherit' })
      console.log('✅ Correction ESLint terminée')
    } catch (error) {
      console.log('⚠️ Erreur lors de la correction ESLint:', error.message)
    }

    // 2. Exécuter la correction automatique des issues de sécurité
    console.log('🔧 Correction des issues de sécurité...')
    try {
      execSync('npm run fix:security', { cwd: projectRoot, stdio: 'inherit' })
      console.log('✅ Correction des issues de sécurité terminée')
    } catch (error) {
      console.log('⚠️ Erreur lors de la correction des issues de sécurité:', error.message)
    }

    // 3. Vérifier s'il y a encore des issues critiques
    console.log('🔍 Vérification des issues restantes...')
    try {
      execSync('npm run audit:security', { cwd: projectRoot, stdio: 'pipe' })
      console.log('✅ Aucune issue critique restante')
    } catch (error) {
      // Lire le rapport pour vérifier les issues critiques
      const reportPath = join(projectRoot, 'security-audit-report.json')
      if (existsSync(reportPath)) {
        const report = JSON.parse(readFileSync(reportPath, 'utf8'))

        if (report.summary.critical > 0) {
          console.log(`🚨 ${report.summary.critical} issue(s) critique(s) restante(s)`)
          console.log('💡 Ces issues nécessitent une correction manuelle')
          process.exit(1)
        } else {
          console.log('✅ Toutes les issues critiques ont été corrigées')
        }
      }
    }

    console.log('\n🎉 Correction automatique terminée avec succès!')
    console.log('📝 Prochaines étapes:')
    console.log("   1. Testez l'application: npm run test")
    console.log('   2. Vérifiez le build: npm run build')
    console.log("   3. Relancez l'audit: npm run audit:security")
  } catch (error) {
    console.error('❌ Erreur lors de la correction automatique:', error.message)
    process.exit(1)
  }
}

// Vérifier si le script est exécuté directement
if (import.meta.url === `file://${process.argv[1]}`) {
  autoFixSecurity()
}

export { autoFixSecurity }
