#!/usr/bin/env node

/**
 * Script d'audit de sécurité pour benevoclic-web
 * Usage: node scripts/security-audit.js
 */

import { readdirSync, readFileSync, statSync, writeFileSync } from 'fs'
import { dirname, extname, join } from 'path'
import { execSync } from 'child_process'
import { fileURLToPath } from 'url'

// Patterns de vulnérabilités à détecter
const securityPatterns = [
  {
    name: 'XSS via innerHTML',
    pattern: /\.innerHTML\s*=/g,
    severity: 'HIGH',
    description: 'Utilisation dangereuse de innerHTML qui peut mener à des attaques XSS'
  },
  {
    name: 'XSS via v-html',
    pattern: /v-html\s*=/g,
    severity: 'HIGH',
    description: 'Directive Vue.js dangereuse qui peut mener à des attaques XSS'
  },
  {
    name: 'Eval usage',
    pattern: /eval\s*\(/g,
    severity: 'CRITICAL',
    description: 'Utilisation de eval() qui peut exécuter du code arbitraire'
  },
  {
    name: 'Console.log in production',
    pattern: /console\.(log|warn|error|info)\s*\(/g,
    severity: 'MEDIUM',
    description: 'Console.log peut exposer des informations sensibles en production'
  },
  {
    name: 'Hardcoded secrets',
    pattern:
      /(password|secret|key|token)\s*[:=]\s*['"`](?!test|mock|example|dummy)[^'"`]{8,}['"`]/gi,
    severity: 'HIGH',
    description: 'Secrets potentiellement hardcodés dans le code (exclut les valeurs de test)'
  },
  {
    name: 'SQL Injection risk',
    pattern: /query\s*\(\s*['"`][^'"`]*\$\{[^}]*}[^'"`]*['"`]/g,
    severity: 'HIGH',
    description: "Risque d'injection SQL avec template literals"
  },
  {
    name: 'Unsafe regex',
    pattern: /new RegExp\s*\([^)]*\+[^)]*\)/g,
    severity: 'MEDIUM',
    description: 'Regex potentiellement dangereux avec concaténation'
  },
  {
    name: 'No CSRF protection',
    pattern: /axios\.(post|put|delete|patch)\s*\(/g,
    severity: 'MEDIUM',
    description: 'Requêtes HTTP sans protection CSRF visible'
  }
]

// Extensions de fichiers à analyser
const fileExtensions = ['.ts', '.vue', '.js', '.jsx', '.tsx']

// Dossiers à ignorer
const ignoreDirs = ['node_modules', '.nuxt', '.output', 'coverage', 'lighthouse-reports', '.git']

function shouldIgnoreFile(filePath) {
  return ignoreDirs.some(dir => filePath.includes(dir))
}

function scanFile(filePath) {
  const issues = []

  try {
    const content = readFileSync(filePath, 'utf8')

    securityPatterns.forEach(pattern => {
      // Exclure les patterns de détection eux-mêmes (faux positifs)
      if (filePath.includes('scripts/security-audit.js') && pattern.name === 'Eval usage') {
        return
      }

      const matches = content.match(pattern.pattern)
      if (matches) {
        issues.push({
          file: filePath,
          pattern: pattern.name,
          severity: pattern.severity,
          description: pattern.description,
          count: matches.length
        })
      }
    })
  } catch (error) {
    console.warn(`⚠️  Impossible de lire le fichier ${filePath}:`, error.message)
  }

  return issues
}

function scanDirectory(dirPath) {
  const allIssues = []

  function scanRecursive(currentPath) {
    if (shouldIgnoreFile(currentPath)) {
      return
    }

    const stats = statSync(currentPath)

    if (stats.isDirectory()) {
      const items = readdirSync(currentPath)
      items.forEach(item => {
        scanRecursive(join(currentPath, item))
      })
    } else if (stats.isFile()) {
      const ext = extname(currentPath)
      if (fileExtensions.includes(ext)) {
        const issues = scanFile(currentPath)
        allIssues.push(...issues)
      }
    }
  }

  scanRecursive(dirPath)
  return allIssues
}

function runEslintSecurity() {
  try {
    console.log("🔍 Exécution d'ESLint avec règles de sécurité...")
    const result = execSync('npx eslint . --ext .ts,.vue,.js --format json', {
      encoding: 'utf8',
      stdio: 'pipe'
    })
    return JSON.parse(result)
  } catch (error) {
    if (error.stdout) {
      return JSON.parse(error.stdout)
    }
    return []
  }
}

function generateReport(issues, eslintResults) {
  return {
    timestamp: new Date().toISOString(),
    summary: {
      totalIssues: issues.length,
      critical: issues.filter(i => i.severity === 'CRITICAL').length,
      high: issues.filter(i => i.severity === 'HIGH').length,
      medium: issues.filter(i => i.severity === 'MEDIUM').length,
      low: issues.filter(i => i.severity === 'LOW').length
    },
    issues: issues,
    eslintResults: eslintResults
  }
}

function printReport(report) {
  console.log("\n🔒 RAPPORT D'AUDIT DE SÉCURITÉ")
  console.log('='.repeat(50))
  console.log(`📅 Date: ${new Date(report.timestamp).toLocaleString()}`)
  console.log(`📊 Total d'issues: ${report.summary.totalIssues}`)
  console.log(`🚨 Critique: ${report.summary.critical}`)
  console.log(`⚠️  Élevé: ${report.summary.high}`)
  console.log(`⚡ Moyen: ${report.summary.medium}`)
  console.log(`ℹ️  Faible: ${report.summary.low}`)

  if (report.issues.length > 0) {
    console.log('\n📋 DÉTAIL DES ISSUES:')
    console.log('-'.repeat(50))

    report.issues.forEach((issue, index) => {
      console.log(`${index + 1}. [${issue.severity}] ${issue.pattern}`)
      console.log(`   📁 Fichier: ${issue.file}`)
      console.log(`   📝 Description: ${issue.description}`)
      console.log(`   🔢 Occurrences: ${issue.count}`)
      console.log('')
    })
  }

  if (report.eslintResults.length > 0) {
    console.log('\n🔧 RÉSULTATS ESLINT:')
    console.log('-'.repeat(50))

    const securityIssues = report.eslintResults.filter(
      issue => issue.ruleId && issue.ruleId.startsWith('security/')
    )

    if (securityIssues.length > 0) {
      securityIssues.forEach((issue, index) => {
        console.log(`${index + 1}. [${issue.ruleId}] ${issue.message}`)
        console.log(`   📁 Fichier: ${issue.filePath}`)
        console.log(`   📍 Ligne: ${issue.line}`)
        console.log('')
      })
    } else {
      console.log('✅ Aucune issue de sécurité détectée par ESLint')
    }
  }

  // Recommandations
  console.log('\n💡 RECOMMANDATIONS:')
  console.log('-'.repeat(50))

  if (report.summary.critical > 0) {
    console.log('🚨 CRITIQUE: Corrigez immédiatement les issues critiques')
  }

  if (report.summary.high > 0) {
    console.log('⚠️  ÉLEVÉ: Traitez en priorité les issues de sécurité élevées')
  }

  if (report.summary.medium > 0) {
    console.log('⚡ MOYEN: Planifiez la correction des issues moyennes')
  }

  console.log('🔧 Utilisez "npm run lint:fix" pour corriger automatiquement certaines issues')
  console.log("📚 Consultez la documentation de sécurité pour plus d'informations")
}

function main() {
  console.log("🔒 Début de l'audit de sécurité...\n")

  const __filename = fileURLToPath(import.meta.url)
  const __dirname = dirname(__filename)
  const projectRoot = join(__dirname, '..')

  // Scan manuel
  console.log('🔍 Scan manuel des patterns de sécurité...')
  const manualIssues = scanDirectory(projectRoot)

  // ESLint security
  console.log('🔧 Vérification ESLint...')
  const eslintResults = runEslintSecurity()

  // Génération du rapport
  const report = generateReport(manualIssues, eslintResults)

  // Affichage
  printReport(report)

  // Sauvegarde du rapport
  const reportPath = join(projectRoot, 'security-audit-report.json')
  writeFileSync(reportPath, JSON.stringify(report, null, 2))
  console.log(`\n💾 Rapport sauvegardé: ${reportPath}`)

  // Code de sortie
  const exitCode = report.summary.critical > 0 ? 1 : 0
  process.exit(exitCode)
}

// Vérifier si le script est exécuté directement
if (import.meta.url === `file://${process.argv[1]}`) {
  main()
}

export { scanDirectory, scanFile, securityPatterns }
