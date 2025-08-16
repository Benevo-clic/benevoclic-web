#!/usr/bin/env node

/**
 * Script de test des permissions GitHub Actions
 * Usage: node scripts/test-github-permissions.js
 */

import { execSync } from 'child_process'
import { readFileSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const projectRoot = join(__dirname, '..')

function testGitHubPermissions() {
  console.log('🔍 Test des permissions GitHub Actions...\n')

  try {
    // 1. Vérifier la présence du token GitHub
    const githubToken = process.env.GITHUB_TOKEN
    if (!githubToken) {
      console.log('⚠️  GITHUB_TOKEN non défini')
      console.log('💡 Ce script doit être exécuté dans un environnement GitHub Actions')
      return false
    }

    console.log('✅ GITHUB_TOKEN détecté')

    // 2. Tester l'accès aux issues
    console.log("\n🔍 Test d'accès aux issues...")
    try {
      const issuesResponse = execSync(
        `curl -s -H "Authorization: token ${githubToken}" \
         -H "Accept: application/vnd.github.v3+json" \
         https://api.github.com/repos/Benevo-clic/benevoclic-web/issues?per_page=1`,
        { encoding: 'utf8' }
      )

      const issues = JSON.parse(issuesResponse)
      if (Array.isArray(issues)) {
        console.log('✅ Accès aux issues autorisé')
      } else {
        console.log('❌ Accès aux issues refusé')
        return false
      }
    } catch (error) {
      console.log("❌ Erreur lors du test d'accès aux issues:", error.message)
      return false
    }

    // 3. Tester l'accès aux pull requests
    console.log("\n🔍 Test d'accès aux pull requests...")
    try {
      const prResponse = execSync(
        `curl -s -H "Authorization: token ${githubToken}" \
         -H "Accept: application/vnd.github.v3+json" \
         https://api.github.com/repos/Benevo-clic/benevoclic-web/pulls?per_page=1`,
        { encoding: 'utf8' }
      )

      const prs = JSON.parse(prResponse)
      if (Array.isArray(prs)) {
        console.log('✅ Accès aux pull requests autorisé')
      } else {
        console.log('❌ Accès aux pull requests refusé')
        return false
      }
    } catch (error) {
      console.log("❌ Erreur lors du test d'accès aux PR:", error.message)
      return false
    }

    // 4. Vérifier les workflows
    console.log('\n🔍 Vérification des workflows...')
    const workflowsDir = join(projectRoot, '.github', 'workflows')
    if (existsSync(workflowsDir)) {
      const workflows = execSync(`ls ${workflowsDir}`, { encoding: 'utf8' }).trim().split('\n')
      console.log('📁 Workflows trouvés:')
      workflows.forEach(workflow => {
        console.log(`   - ${workflow}`)
      })
    }

    // 5. Vérifier les permissions dans les workflows
    console.log('\n🔍 Vérification des permissions dans les workflows...')
    const securityAuditWorkflow = join(workflowsDir, 'security-audit.yml')
    const autoFixWorkflow = join(workflowsDir, 'auto-fix-security.yml')

    if (existsSync(securityAuditWorkflow)) {
      const content = readFileSync(securityAuditWorkflow, 'utf8')
      if (content.includes('permissions:')) {
        console.log('✅ Permissions configurées dans security-audit.yml')
      } else {
        console.log('⚠️  Permissions manquantes dans security-audit.yml')
      }
    }

    if (existsSync(autoFixWorkflow)) {
      const content = readFileSync(autoFixWorkflow, 'utf8')
      if (content.includes('permissions:')) {
        console.log('✅ Permissions configurées dans auto-fix-security.yml')
      } else {
        console.log('⚠️  Permissions manquantes dans auto-fix-security.yml')
      }
    }

    console.log('\n🎉 Test des permissions terminé avec succès!')
    console.log('📝 Les workflows devraient maintenant fonctionner correctement')

    return true
  } catch (error) {
    console.error('❌ Erreur lors du test des permissions:', error.message)
    return false
  }
}

// Vérifier si le script est exécuté directement
if (import.meta.url === `file://${process.argv[1]}`) {
  const success = testGitHubPermissions()
  process.exit(success ? 0 : 1)
}

export { testGitHubPermissions }
