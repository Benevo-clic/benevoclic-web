# CI/CD Pipeline Documentation

Ce document décrit le processus de CI/CD (Intégration Continue / Déploiement Continu) pour le projet Benevoclic Web.

## Table des matières

1. [Vue d'ensemble](#vue-densemble)
2. [Workflows GitHub Actions](#workflows-github-actions)
3. [Processus de build Docker](#processus-de-build-docker)
4. [Déploiement](#déploiement)
5. [Variables d'environnement](#variables-denvironnement)
6. [Bonnes pratiques](#bonnes-pratiques)
7. [Dépannage](#dépannage)

## Vue d'ensemble

Le pipeline CI/CD de Benevoclic Web est conçu pour automatiser les processus de test, de build et de déploiement de l'application. Il utilise GitHub Actions pour l'orchestration, Docker pour la conteneurisation, et DockerHub comme registre d'images.

Le processus complet comprend :
- Vérification de la qualité du code (linting, type checking)
- Exécution des tests automatisés
- Construction d'images Docker
- Publication des images sur DockerHub
- Déploiement sur l'environnement de production (VPS OVH)

## Workflows GitHub Actions

### CI Pipeline (`.github/workflows/ci.yml`)

Ce workflow s'exécute automatiquement à chaque push sur les branches `main` et `develop`, ainsi que pour les pull requests vers ces branches.

**Étapes :**
1. Lint et tests
   - Checkout du code
   - Installation des dépendances
   - Exécution du linting
   - Vérification des types TypeScript
   - Exécution des tests unitaires
   - Exécution des audits Lighthouse

2. Build
   - Construction de l'image Docker
   - Publication de l'image sur DockerHub (uniquement pour les pushes, pas pour les PRs)
   - Tagging de l'image avec plusieurs formats (branche, PR, version sémantique, hash de commit)

### Déploiement sur DockerHub (`.github/workflows/deploy-dockerhub.yml`)

Ce workflow est déclenché manuellement et permet de construire et publier une image Docker avec une version spécifique.

**Étapes :**
1. Checkout du code
2. Installation des dépendances
3. Exécution des tests et vérifications
4. Construction et publication de l'image Docker avec la version spécifiée

### Déploiement sur OVH VPS (`.github/workflows/deploy.yml`)

Ce workflow est déclenché manuellement et permet de déployer une version spécifique de l'application sur le VPS OVH.

**Étapes :**
1. Connexion SSH au VPS
2. Génération du fichier docker-compose.yml
3. Arrêt des conteneurs existants
4. Téléchargement de la nouvelle image
5. Démarrage des nouveaux conteneurs

## Processus de build Docker

Le processus de build Docker utilise une approche multi-stage pour optimiser la taille de l'image finale et améliorer la sécurité :

1. **Stage de build :**
   - Utilise Node.js 20 Alpine comme image de base
   - Installe les dépendances
   - Construit l'application Nuxt.js

2. **Stage de runtime :**
   - Utilise également Node.js 20 Alpine
   - Copie uniquement les fichiers nécessaires depuis le stage de build
   - Configure les variables d'environnement
   - Définit un healthcheck
   - Utilise un utilisateur non-root pour la sécurité

## Déploiement

### Déploiement manuel via GitHub Actions

1. Accédez à l'onglet "Actions" du dépôt GitHub
2. Sélectionnez le workflow "Deploy to DockerHub"
3. Cliquez sur "Run workflow"
4. Entrez la version à déployer (par exemple, "1.0.0")
5. Cliquez sur "Run workflow"
6. Une fois terminé, sélectionnez le workflow "Deploy to OVH VPS"
7. Cliquez sur "Run workflow"
8. Entrez la même version que celle utilisée précédemment
9. Cliquez sur "Run workflow"

### Vérification du déploiement

Pour vérifier que le déploiement s'est bien déroulé :
1. Connectez-vous au VPS via SSH
2. Exécutez `docker ps` pour vérifier que le conteneur est en cours d'exécution
3. Vérifiez les logs avec `docker logs benevoclic-web`
4. Accédez à l'application via son URL pour vérifier qu'elle fonctionne correctement

## Variables d'environnement

### Variables GitHub Secrets

Les workflows utilisent plusieurs secrets GitHub qui doivent être configurés dans les paramètres du dépôt :

- `DOCKERHUB_USERNAME` : Nom d'utilisateur DockerHub
- `DOCKERHUB_TOKEN` : Token d'accès DockerHub
- `VPS_HOST` : Adresse IP ou nom d'hôte du VPS
- `VPS_USERNAME` : Nom d'utilisateur SSH pour le VPS
- `OVH_SSH_KEY` : Clé SSH privée pour l'authentification au VPS

### Variables d'environnement de l'application

Les variables d'environnement de l'application sont également stockées dans les secrets GitHub et sont transmises au conteneur Docker lors du déploiement :

- Variables API : `API_BASE_URL`, `API_SIRENE_URL`, `API_KEY`, `API_SIRENE_KEY`
- Variables Firebase : `FIREBASE_API_KEY`, `FIREBASE_AUTH_DOMAIN`, etc.
- Variables de configuration : `PORT`, `NODE_ENV`, etc.

## Bonnes pratiques

### Versionnement

- Utilisez le versionnement sémantique (MAJOR.MINOR.PATCH) pour les releases
- Incrémentez la version MAJOR lorsque vous faites des changements incompatibles
- Incrémentez la version MINOR lorsque vous ajoutez des fonctionnalités de manière rétrocompatible
- Incrémentez la version PATCH lorsque vous faites des corrections de bugs rétrocompatibles

### Sécurité

- Ne stockez jamais de secrets ou d'informations sensibles directement dans le code
- Utilisez les secrets GitHub pour stocker les informations sensibles
- Utilisez un utilisateur non-root dans les conteneurs Docker
- Maintenez les dépendances à jour pour éviter les vulnérabilités connues

### Tests

- Assurez-vous que tous les tests passent avant de déployer
- Écrivez des tests pour toutes les nouvelles fonctionnalités
- Incluez des tests d'accessibilité et de performance

## Dépannage

### Problèmes courants

1. **Les tests échouent dans le pipeline CI**
   - Vérifiez les logs pour identifier les tests qui échouent
   - Exécutez les tests localement pour reproduire le problème
   - Corrigez les tests ou le code selon les besoins

2. **Le build Docker échoue**
   - Vérifiez les logs pour identifier l'étape qui échoue
   - Essayez de construire l'image localement pour reproduire le problème
   - Vérifiez que toutes les dépendances sont correctement spécifiées

3. **Le déploiement échoue**
   - Vérifiez les logs SSH dans le workflow GitHub Actions
   - Connectez-vous au VPS et vérifiez les logs Docker
   - Vérifiez que toutes les variables d'environnement sont correctement définies

### Commandes utiles

```bash
# Construire l'image Docker localement
docker build -t benevoclic-web:local .

# Exécuter l'image Docker localement
docker run -p 5482:5482 benevoclic-web:local

# Vérifier les logs du conteneur
docker logs benevoclic-web

# Exécuter les tests localement
npm test

# Exécuter le linting localement
npm run lint
```

Pour toute question ou problème concernant le pipeline CI/CD, contactez l'équipe DevOps ou créez une issue sur le dépôt GitHub.