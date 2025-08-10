## [Unreleased]
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
