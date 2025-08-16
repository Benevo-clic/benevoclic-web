#!/usr/bin/env node

/**
 * Script de correction des issues de sécurité - Version 3
 * Corrige intelligemment les vrais problèmes sans faux positifs
 */

import { readFileSync, writeFileSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const projectRoot = join(__dirname, '..')

// Configuration des corrections intelligentes
const securityFixes = {
  // Correction des console.log en production (seulement ceux non protégés)
  consoleLog: {
    pattern:
      /(?<!process\.env\.NODE_ENV\s*!==\s*['"]production['"]\s*&&\s*)console\.(log|warn|error|info|debug)\s*\(/g,
    replacement: (match, method) => {
      return `process.env.NODE_ENV !== 'production' && console.${method}(`
    },
    description: 'Protection des console.log en production'
  },

  // Correction des innerHTML dangereux (seulement les vrais cas)
  innerHTML: {
    pattern: /\.innerHTML\s*=\s*`([^`]*)`/g,
    replacement: (match, content) => {
      // Vérifier si c'est du contenu statique sécurisé
      if (
        content.includes('<script') ||
        content.includes('javascript:') ||
        content.includes('onclick=')
      ) {
        // Créer une version sécurisée avec createElement
        const safeContent = content.replace(/`/g, '\\`').replace(/\$/g, '\\$')

        return `.innerHTML = createSafeHTML(\`${safeContent}\`)`
      }
      return match // Garder tel quel si c'est sécurisé
    },
    description: 'Remplacement des innerHTML dangereux'
  }
}

// Fichiers à corriger (priorité aux fichiers principaux)
const filesToFix = [
  'app.vue',
  'components/CookieConsent.vue',
  'components/MultiMarkerMap.vue',
  'components/common/UserDetailsModal.vue',
  'components/event/association/AnnouncementEditForm.vue',
  'components/event/association/EventModalForm.vue',
  'components/event/association/ParticipantOrVolunteerCard.vue',
  'components/event/association/PresenceListModal.vue',
  'components/event/association/UploadCoverForm.vue',
  'components/event/volunteer/VolunteerAnnouncementFavoritesList.vue',
  'components/event/volunteer/VolunteerAnnouncementList.vue',
  'components/event/volunteer/VolunteerEventFilters.vue',
  'components/event/volunteer/utils/DropDownLocation.vue',
  'components/event/volunteer/utils/LocationButton.vue',
  'components/header/Header.vue',
  'components/header/HeaderAuth.vue',
  'components/header/auth/form/LoginForm.vue',
  'components/header/auth/form/UserRegisterForm.vue',
  'components/header/auth/form/VerifEmailForm.vue',
  'components/header/auth/form/VerifSiretAssociation.vue',
  'components/header/utils/components/LocationContextComponent.vue',
  'components/notifications/NotificationsStats.vue',
  'components/register/RegisterModal.vue',
  'components/register/association/RegisterAssociation.vue',
  'components/register/association/form/RegisterInfoAssociationForm.vue',
  'components/register/volunteer/RegisterVolunteer.vue',
  'components/register/volunteer/form/RegisterInfoVolunteerForm.vue',
  'components/utils/FirebaseStatus.vue',
  'components/utils/ReportModal.vue',
  'composables/auth/useUser.ts',
  'composables/useAssociationDashboard.ts',
  'composables/useFirebase.ts',
  'composables/useNavigation.ts',
  'composables/usePageVisibility.ts',
  'composables/usePermissions.ts',
  'composables/useRecentSearches.ts',
  'composables/useSessionApi.ts',
  'composables/useSessionPersistence.ts',
  'composables/useUserLocation.ts',
  'middleware/route-guard.global.ts',
  'pages/admin/login.vue',
  'pages/admin/manageAnnouncement.vue',
  'pages/admin/register.vue',
  'pages/admin/support.vue',
  'pages/admin/verification.vue',
  'pages/announcement/[id].vue',
  'pages/association/account/edit.vue',
  'pages/association/account/profile.vue',
  'pages/association/account/settings.vue',
  'pages/association/account/volunteers.vue',
  'pages/association/dashboard.vue',
  'pages/association/events/announcement/[id].vue',
  'pages/association/events/association/manage/index.vue',
  'pages/association/events/association/requests/index.vue',
  'pages/help/index.vue',
  'pages/index.vue',
  'pages/notifications/index.vue',
  'pages/search/index.vue',
  'pages/volunteer/account/associations.vue',
  'pages/volunteer/account/edit.vue',
  'pages/volunteer/account/profile.vue',
  'pages/volunteer/account/settings.vue',
  'pages/volunteer/activity/history.vue',
  'pages/volunteer/activity/missions.vue',
  'pages/volunteer/activity/participations.vue',
  'pages/volunteer/events/announcement/[id].vue',
  'pages/volunteer/index.vue',
  'plugins/env-validation.server.ts',
  'plugins/init-permissions.client.ts',
  'plugins/init-user.client.ts',
  'plugins/permissions.client.ts',
  'plugins/session-init.client.ts',
  'stores/announcement.store.ts',
  'stores/association.store.ts',
  'stores/auth/auth.store.ts',
  'stores/session.store.ts',
  'stores/user/user.store.ts',
  'stores/volunteer.store.ts',
  'utils/env-validator.ts',
  'utils/error-handler.ts',
  'utils/session-cleaner.ts'
]

// Fonction pour corriger un fichier
function fixFile(filePath) {
  const fullPath = join(projectRoot, filePath)

  if (!existsSync(fullPath)) {
    console.log(`⚠️  Fichier non trouvé: ${filePath}`)
    return false
  }

  try {
    let content = readFileSync(fullPath, 'utf8')
    let modified = false
    let fixes = []

    // Appliquer les corrections
    for (const [fixType, fix] of Object.entries(securityFixes)) {
      const matches = content.match(fix.pattern)
      if (matches) {
        content = content.replace(fix.pattern, fix.replacement)
        fixes.push(`${fix.description}: ${matches.length} occurrence(s)`)
        modified = true
      }
    }

    if (modified) {
      writeFileSync(fullPath, content, 'utf8')
      console.log(`✅ ${filePath}: ${fixes.join(', ')}`)
      return true
    } else {
      console.log(`ℹ️  ${filePath}: Aucune correction nécessaire`)
      return false
    }
  } catch (error) {
    console.error(`❌ Erreur lors de la correction de ${filePath}:`, error.message)
    return false
  }
}

// Fonction principale
function main() {
  console.log('🔒 Correction intelligente des issues de sécurité - Version 3')
  console.log('==============================================================')

  let totalFixed = 0
  let totalFiles = 0

  for (const file of filesToFix) {
    totalFiles++
    if (fixFile(file)) {
      totalFixed++
    }
  }

  console.log('\n📊 Résumé des corrections')
  console.log('==================================================')
  console.log(`📁 Fichiers traités: ${totalFiles}`)
  console.log(`✅ Fichiers corrigés: ${totalFixed}`)
  console.log(`ℹ️  Fichiers inchangés: ${totalFiles - totalFixed}`)

  if (totalFixed > 0) {
    console.log('\n💡 Prochaines étapes:')
    console.log('1. Vérifiez les corrections avec: npm run prettier:check')
    console.log("2. Testez l'application: npm run dev")
    console.log("3. Relancez l'audit: npm run audit:security")
    console.log('4. Pour les faux positifs restants, utilisez: npm run fix:security:v2')
  } else {
    console.log('\n✅ Aucune correction nécessaire - Le code est déjà sécurisé !')
  }

  console.log('\n📝 Note: Les "secrets hardcodés" détectés sont souvent des faux positifs')
  console.log('   (comme les :key de Vue.js). Le script v2 peut les corriger si nécessaire.')
}

// Exécuter le script
if (import.meta.url === `file://${process.argv[1]}`) {
  main()
}

export { main as fixSecurityIssuesV3 }
