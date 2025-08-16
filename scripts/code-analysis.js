#!/usr/bin/env node

/**
 * Script d'analyse de code local (alternative à CodeQL)
 * Usage: node scripts/code-analysis.js
 */

import { execSync } from 'child_process'
import { writeFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const projectRoot = join(__dirname, '..')

function runCodeAnalysis() {
  console.log("🔍 Début de l'analyse de code...\n")

  const report = {
    timestamp: new Date().toISOString(),
    summary: {
      totalFiles: 0,
      totalLines: 0,
      issues: {
        eslint: 0,
        typescript: 0,
        security: 0,
        dependencies: 0
      }
    }
  }

  try {
    // 1. Compter les fichiers
    console.log('📊 Analyse des fichiers...')
    const tsFiles = execSync(
      'find . -name "*.ts" -o -name "*.vue" -o -name "*.js" | grep -v node_modules | wc -l',
      { encoding: 'utf8' }
    ).trim()
    const totalLines = execSync(
      'find . -name "*.ts" -o -name "*.vue" -o -name "*.js" | grep -v node_modules | xargs wc -l | tail -1',
      { encoding: 'utf8' }
    ).trim()

    report.summary.totalFiles = parseInt(tsFiles)
    report.summary.totalLines = parseInt(totalLines.split(' ')[0])

    console.log(`   - Fichiers TypeScript/JavaScript/Vue: ${report.summary.totalFiles}`)
    console.log(`   - Lignes de code: ${report.summary.totalLines}`)

    // 2. ESLint
    console.log('\n🔧 Analyse ESLint...')
    try {
      execSync('npm run lint', { encoding: 'utf8', stdio: 'pipe' })
      console.log('✅ ESLint: Aucune erreur détectée')
    } catch (error) {
      console.log('⚠️  ESLint: Erreurs détectées')
      report.summary.issues.eslint = 1
    }

    // 3. TypeScript
    console.log('\n📝 Vérification TypeScript...')
    try {
      execSync('npm run type-check', { encoding: 'utf8', stdio: 'pipe' })
      console.log('✅ TypeScript: Aucune erreur de type détectée')
    } catch (error) {
      console.log('⚠️  TypeScript: Erreurs de type détectées')
      report.summary.issues.typescript = 1
    }

    // 4. Audit de sécurité
    console.log('\n🔒 Audit de sécurité...')
    try {
      execSync('npm run audit:security', { encoding: 'utf8', stdio: 'pipe' })
      console.log('✅ Sécurité: Aucune issue critique détectée')
    } catch (error) {
      console.log('⚠️  Sécurité: Issues détectées')
      report.summary.issues.security = 1
    }

    // 5. Audit des dépendances
    console.log('\n📦 Audit des dépendances...')
    try {
      execSync('npm audit --audit-level=moderate', { encoding: 'utf8', stdio: 'pipe' })
      console.log('✅ Dépendances: Aucune vulnérabilité détectée')
    } catch (error) {
      console.log('⚠️  Dépendances: Vulnérabilités détectées')
      report.summary.issues.dependencies = 1
    }

    // 6. Génération du rapport
    console.log('\n�� Génération du rapport...')
    const reportPath = join(projectRoot, 'code-analysis-report.json')
    writeFileSync(reportPath, JSON.stringify(report, null, 2))
    console.log(`✅ Rapport sauvegardé: ${reportPath}`)

    // 7. Affichage du résumé
    console.log("\n📊 RÉSUMÉ DE L'ANALYSE")
    console.log('='.repeat(50))
    console.log(`📅 Date: ${new Date(report.timestamp).toLocaleString()}`)
    console.log(`📁 Fichiers analysés: ${report.summary.totalFiles}`)
    console.log(`📝 Lignes de code: ${report.summary.totalLines}`)
    console.log(`🔧 ESLint: ${report.summary.issues.eslint} erreur(s)`)
    console.log(`📝 TypeScript: ${report.summary.issues.typescript} erreur(s)`)
    console.log(`🔒 Sécurité: ${report.summary.issues.security} issue(s)`)
    console.log(`📦 Dépendances: ${report.summary.issues.dependencies} vulnérabilité(s)`)

    const totalIssues = Object.values(report.summary.issues).reduce((sum, count) => sum + count, 0)

    if (totalIssues === 0) {
      console.log('\n🎉 Aucune issue détectée! Code de qualité.')
    } else {
      console.log(`\n⚠️  Total: ${totalIssues} issue(s) détectée(s)`)
      console.log("💡 Consultez le rapport détaillé pour plus d'informations")
    }

    return report
  } catch (error) {
    console.error("❌ Erreur lors de l'analyse:", error.message)
    return null
  }
}

// Vérifier si le script est exécuté directement
if (import.meta.url === `file://${process.argv[1]}`) {
  runCodeAnalysis()
}

export { runCodeAnalysis }
