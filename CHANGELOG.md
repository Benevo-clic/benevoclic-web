## [Unreleased]
## [1.18.0] - 2025-08-18

### 🚀 Ajouté
- i18n (#41)

### ♻️ Refactorisation
- i18n (#40)

---

## [1.17.1] - 2025-08-15

### 🐛 Corrigé
- header (#38)

---

## [1.17.0] - 2025-08-14

### 🚀 Ajouté
- enhance announcement participant and volunteer display logic (#37)

---

## [1.16.0] - 2025-08-14

### 🚀 Ajouté
- enhance announcement participant and volunteer display logic (#36)

---

## [1.15.0] - 2025-08-13

### 🚀 Ajouté
- enhance session management with cookie handling for connection state (#35)

---

## [1.14.0] - 2025-08-13

### 🚀 Ajouté
- implement session management with persistence and restoration capabilities (#34)

---

## [1.13.1] - 2025-08-13

### 🐛 Corrigé
- implement user and association deletion functionality with improved error handling (#33)

---

## [1.13.0] - 2025-08-13

### 🚀 Ajouté
- settings account (#32)

---

## [1.12.1] - 2025-08-11

### 🐛 Corrigé
- enhance Google authentication flow with session management and e… (#31)

---

## [1.12.0] - 2025-08-11

### 🚀 Ajouté
- details profiles (#30)

---

## [1.11.3] - 2025-08-10

### 🐛 Corrigé
- streamline Firebase configuration handling for server-side usage

---

## [1.11.2] - 2025-08-10

### 🐛 Corrigé
- improve error handling and logging for Firebase initialization and usage

---

## [1.11.1] - 2025-08-10

### 🐛 Corrigé
- improve error handling and logging for Firebase initialization and usage

---

## [1.11.0] - 2025-08-10

### 🚀 Ajouté
- implement Firebase composables for improved initialization and authentication handling
- implement Firebase composables for improved initialization and authentication handling

---

## [1.10.0] - 2025-08-10

### 🚀 Ajouté
- enhance Firebase configuration handling for client-side and server-side access

---

## [1.9.1] - 2025-08-10

### 🐛 Corrigé
- correct console log formatting and improve Firebase configuration handling in debug scripts
- add fallback values for Firebase config in nuxt.config.ts to ensure client-side access

---

## [1.9.0] - 2025-08-10

### 🚀 Ajouté
- add debug plugin and improve Firebase client-side configuration

### 🐛 Corrigé
- clean up console log formatting and improve environment variable checks in test scripts

---

## [1.8.0] - 2025-08-10

### 🚀 Ajouté
- add scripts for client-side environment variable checks and deployment process

---

## [1.7.1] - 2025-08-10

### 🐛 Corrigé
- migrate environment variables from useRuntimeConfig to process.env for server-side and fix Firebase client-side config

---

## [1.7.0] - 2025-08-10

### 🚀 Ajouté
- replace runtime config with environment variable for API base URL (#29)

---

## [1.6.0] - 2025-08-10

### 🚀 Ajouté
- debug config (#27)

---

## [1.5.0] - 2025-08-10

### 🚀 Ajouté
- add runtime configuration endpoint to expose environment and AP… (#25)

---

## [1.4.0] - 2025-08-10

### 🚀 Ajouté
- update Dockerfile to simplify startup command and remove unnecessary scripts (#23)

---

## [1.3.0] - 2025-08-10

### 🚀 Ajouté
- update deployment scripts and Dockerfile to improve environment variable handling (#20)

### 🐛 Corrigé
- add missing newline at end of deploy.yml for proper script execution (#21)

---

## [1.2.0] - 2025-08-10

### 🚀 Ajouté
- update Dockerfile to copy production environment variables (#19)
- add AssociationsList component and update profile and associati… (#18)

---

## [1.1.0] - 2025-08-10

### 🚀 Ajouté
- deploy (#17)

---


## [1.0.0] - 2025-08-09

### 🚀 Ajouté
- Configuration complète CI/CD avec GitHub Actions
- Workflow de déploiement automatique vers Docker Hub
- Workflow de déploiement manuel vers OVH VPS
- Workflow de release automatique basé sur les commits conventionnels
- Intégration Prettier pour le formatage de code
- Configuration ESLint pour la qualité du code
- Tests automatisés avec Vitest
- Build Docker multi-stage optimisé
- Support pour les commits conventionnels (feat, fix, docs, etc.)

### 🔧 Maintenance
- Ajout du champ `version` dans `package.json` pour résoudre les erreurs de release
- Configuration Prettier avec règles personnalisées pour Vue.js
- Fichier `.prettierignore` pour exclure les fichiers générés
- Scripts npm pour Prettier (`prettier:fix`, `prettier:check`)
- Intégration Prettier dans le workflow CI
- Formatage automatique de tous les fichiers du projet

### 🐛 Corrigé
- Erreur `NEW_VERSION="undefined.1.0"` dans le workflow de release
- Problèmes de formatage de code avec Prettier
- Configuration Docker pour le déploiement en production

### 📚 Documentation
- Configuration complète des workflows GitHub Actions
- Documentation des scripts npm disponibles
- Guide de configuration Prettier et ESLint
