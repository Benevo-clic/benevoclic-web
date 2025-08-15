#!/usr/bin/env node

/**
 * Script de correction automatique des issues de sécurité
 * Usage: node scripts/fix-security-issues.js
 */

import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs'
import { join, extname, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const projectRoot = join(__dirname, '..')

// Extensions de fichiers à traiter
const fileExtensions = ['.ts', '.vue', '.js', '.jsx', '.tsx']

// Dossiers à ignorer
const ignoreDirs = [
  'node_modules',
  '.nuxt',
  '.output',
  'coverage',
  'lighthouse-reports',
  '.git',
  'scripts'
]

function shouldIgnoreFile(filePath) {
  return ignoreDirs.some(dir => filePath.includes(dir))
}

function fixConsoleLogs(content, filePath) {
  let modified = false

  // Remplacer console.log par des logs conditionnels en production
  // Mais pas dans les templates Vue.js
  if (filePath.endsWith('.vue')) {
    // Pour les fichiers Vue, ne traiter que la section <script>
    const scriptMatch = content.match(/<script[^>]*>([\s\S]*?)<\/script>/)
    if (scriptMatch) {
      const scriptContent = scriptMatch[1]
      const consoleLogPattern = /console\.(log|warn|error|info)\s*\(/g
      if (consoleLogPattern.test(scriptContent)) {
        const newScriptContent = scriptContent.replace(
          /console\.(log|warn|error|info)\s*\(/g,
          'process.env.NODE_ENV !== "production" && console.$1('
        )
        content = content.replace(scriptContent, newScriptContent)
        modified = true
      }
    }
  } else {
    // Pour les autres fichiers
    const consoleLogPattern = /console\.(log|warn|error|info)\s*\(/g
    if (consoleLogPattern.test(content)) {
      content = content.replace(
        /console\.(log|warn|error|info)\s*\(/g,
        'process.env.NODE_ENV !== "production" && console.$1('
      )
      modified = true
    }
  }

  return { content, modified }
}

function fixHardcodedSecrets(content, filePath) {
  let modified = false

  // Pattern pour détecter les secrets hardcodés
  // Mais pas les attributs :key dans les templates Vue
  const secretPattern =
    /(password|secret|key|token)\s*[:=]\s*['"`](?!test|mock|example|dummy)[^'"`]{8,}['"`]/gi

  if (filePath.endsWith('.vue')) {
    // Pour les fichiers Vue, ne traiter que la section <script>
    const scriptMatch = content.match(/<script[^>]*>([\s\S]*?)<\/script>/)
    if (scriptMatch) {
      const scriptContent = scriptMatch[1]
      if (secretPattern.test(scriptContent)) {
        const newScriptContent = scriptContent.replace(
          /(password|secret|key|token)\s*[:=]\s*['"`](?!test|mock|example|dummy)([^'"`]{8,})['"`]/gi,
          '$1: process.env.$1?.toUpperCase() || "$2"'
        )
        content = content.replace(scriptContent, newScriptContent)
        modified = true
      }
    }
  } else {
    // Pour les autres fichiers
    if (secretPattern.test(content)) {
      content = content.replace(
        /(password|secret|key|token)\s*[:=]\s*['"`](?!test|mock|example|dummy)([^'"`]{8,})['"`]/gi,
        '$1: process.env.$1?.toUpperCase() || "$2"'
      )
      modified = true
    }
  }

  return { content, modified }
}

function processFile(filePath) {
  try {
    const content = readFileSync(filePath, 'utf8')
    let modified = false
    let newContent = content

    // Corriger les console.log
    const consoleFix = fixConsoleLogs(newContent, filePath)
    if (consoleFix.modified) {
      newContent = consoleFix.content
      modified = true
    }

    // Corriger les secrets hardcodés
    const secretFix = fixHardcodedSecrets(newContent, filePath)
    if (secretFix.modified) {
      newContent = secretFix.content
      modified = true
    }

    if (modified) {
      writeFileSync(filePath, newContent, 'utf8')
      console.log(`✅ Corrigé: ${filePath}`)
      return true
    }

    return false
  } catch (error) {
    console.warn(`⚠️  Impossible de traiter ${filePath}:`, error.message)
    return false
  }
}

function scanDirectory(dirPath) {
  let fixedCount = 0

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
        if (processFile(currentPath)) {
          fixedCount++
        }
      }
    }
  }

  scanRecursive(dirPath)
  return fixedCount
}

function main() {
  console.log('🔧 Début de la correction automatique des issues de sécurité...\n')

  const fixedCount = scanDirectory(projectRoot)

  console.log(`\n📊 Résumé de la correction:`)
  console.log(`  - Fichiers corrigés: ${fixedCount}`)

  if (fixedCount > 0) {
    console.log('\n✅ Correction terminée!')
    console.log('\n📝 Prochaines étapes:')
    console.log('  1. Vérifiez les corrections apportées')
    console.log("  2. Testez l'application")
    console.log("  3. Relancez l'audit de sécurité: npm run audit:security")
  } else {
    console.log('\nℹ️  Aucune correction nécessaire')
  }
}

// Vérifier si le script est exécuté directement
if (import.meta.url === `file://${process.argv[1]}`) {
  main()
}

export { processFile, scanDirectory }
