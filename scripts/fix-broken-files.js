#!/usr/bin/env node

/**
 * Script de correction des fichiers cassés par le script de sécurité
 * Usage: node scripts/fix-broken-files.js
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

function fixBrokenKeyAttributes(content) {
  let modified = false

  // Corriger les attributs :key cassés dans les templates Vue
  // Pattern: :key: process.env.key?.toUpperCase() || "value"
  const brokenKeyPattern = /:key:\s*process\.env\.key\?\.toUpperCase\(\)\s*\|\|\s*"([^"]+)"/g

  if (brokenKeyPattern.test(content)) {
    content = content.replace(
      /:key:\s*process\.env\.key\?\.toUpperCase\(\)\s*\|\|\s*"([^"]+)"/g,
      ':key="$1"'
    )
    modified = true
  }

  // Corriger aussi les attributs key: sans les deux points
  const brokenKeyPattern2 = /key:\s*process\.env\.key\?\.toUpperCase\(\)\s*\|\|\s*"([^"]+)"/g

  if (brokenKeyPattern2.test(content)) {
    content = content.replace(
      /key:\s*process\.env\.key\?\.toUpperCase\(\)\s*\|\|\s*"([^"]+)"/g,
      'key="$1"'
    )
    modified = true
  }

  return { content, modified }
}

function fixBrokenPasswordAttributes(content) {
  let modified = false

  // Corriger les attributs @forgot-password cassés
  // Pattern: @forgot-password: process.env.password?.toUpperCase() || "value"
  const brokenPasswordPattern =
    /@forgot-password:\s*process\.env\.password\?\.toUpperCase\(\)\s*\|\|\s*"([^"]+)"/g

  if (brokenPasswordPattern.test(content)) {
    content = content.replace(
      /@forgot-password:\s*process\.env\.password\?\.toUpperCase\(\)\s*\|\|\s*"([^"]+)"/g,
      '@forgot-password="$1"'
    )
    modified = true
  }

  return { content, modified }
}

function fixBrokenVariableDeclarations(content) {
  let modified = false

  // Corriger les déclarations de variables cassées
  // Pattern: const VAR_NAME: process.env.KEY?.toUpperCase() || "value"
  const brokenVarPattern =
    /const\s+([A-Z_]+):\s*process\.env\.KEY\?\.toUpperCase\(\)\s*\|\|\s*"([^"]+)"/g

  if (brokenVarPattern.test(content)) {
    content = content.replace(
      /const\s+([A-Z_]+):\s*process\.env\.KEY\?\.toUpperCase\(\)\s*\|\|\s*"([^"]+)"/g,
      'const $1 = "$2"'
    )
    modified = true
  }

  // Corriger aussi les déclarations avec Key au lieu de KEY
  const brokenVarPattern2 =
    /const\s+([A-Z_]+):\s*process\.env\.Key\?\.toUpperCase\(\)\s*\|\|\s*"([^"]+)"/g

  if (brokenVarPattern2.test(content)) {
    content = content.replace(
      /const\s+([A-Z_]+):\s*process\.env\.Key\?\.toUpperCase\(\)\s*\|\|\s*"([^"]+)"/g,
      'const $1 = "$2"'
    )
    modified = true
  }

  // Corriger les déclarations avec Password
  const brokenVarPattern3 =
    /const\s+([A-Z_]+):\s*process\.env\.Password\?\.toUpperCase\(\)\s*\|\|\s*"([^"]+)"/g

  if (brokenVarPattern3.test(content)) {
    content = content.replace(
      /const\s+([A-Z_]+):\s*process\.env\.Password\?\.toUpperCase\(\)\s*\|\|\s*"([^"]+)"/g,
      'const $1 = "$2"'
    )
    modified = true
  }

  return { content, modified }
}

function fixBrokenTemplateLiterals(content) {
  let modified = false

  // Corriger les template literals cassés
  // Pattern: `process.env.Key?.toUpperCase() || "value"`
  const brokenTemplatePattern = /`process\.env\.Key\?\.toUpperCase\(\)\s*\|\|\s*"([^"]+)"`/g

  if (brokenTemplatePattern.test(content)) {
    content = content.replace(/`process\.env\.Key\?\.toUpperCase\(\)\s*\|\|\s*"([^"]+)"`/g, '"$1"')
    modified = true
  }

  return { content, modified }
}

function processFile(filePath) {
  try {
    const content = readFileSync(filePath, 'utf8')
    let modified = false
    let newContent = content

    // Corriger les attributs :key cassés
    const keyFix = fixBrokenKeyAttributes(newContent)
    if (keyFix.modified) {
      newContent = keyFix.content
      modified = true
    }

    // Corriger les attributs @forgot-password cassés
    const passwordFix = fixBrokenPasswordAttributes(newContent)
    if (passwordFix.modified) {
      newContent = passwordFix.content
      modified = true
    }

    // Corriger les déclarations de variables cassées
    const varFix = fixBrokenVariableDeclarations(newContent)
    if (varFix.modified) {
      newContent = varFix.content
      modified = true
    }

    // Corriger les template literals cassés
    const templateFix = fixBrokenTemplateLiterals(newContent)
    if (templateFix.modified) {
      newContent = templateFix.content
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
  console.log('🔧 Début de la correction des fichiers cassés...\n')

  const fixedCount = scanDirectory(projectRoot)

  console.log(`\n📊 Résumé de la correction:`)
  console.log(`  - Fichiers corrigés: ${fixedCount}`)

  if (fixedCount > 0) {
    console.log('\n✅ Correction terminée!')
    console.log('\n📝 Prochaines étapes:')
    console.log('  1. Vérifiez que les fichiers sont corrigés')
    console.log('  2. Lancez Prettier: npm run prettier:fix')
    console.log("  3. Testez l'application: npm run dev")
  } else {
    console.log('\nℹ️  Aucune correction nécessaire')
  }
}

// Vérifier si le script est exécuté directement
if (import.meta.url === `file://${process.argv[1]}`) {
  main()
}

export { processFile, scanDirectory }
