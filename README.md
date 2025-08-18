# 🚀 Benevoclic Web - Application Frontend

Application web moderne pour connecter les associations avec des bénévoles, construite avec Nuxt.js 3 et Vue.js 3.

## 📌 Liens utiles

### 🌐 Application
- **Benevoclic** : https://www.benevoclic.fr

### 💻 GitHub
- **Front-end** : https://github.com/Benevo-clic/benevoclic-web
- **Back-end** : https://github.com/Benevo-clic/benevoclic-api-nest
- **Documentation** : https://github.com/Benevo-clic/benevoclic-docs

### 📊 Monitoring
- **Grafana (Dashboard)** : http://mon_ip:3001/dashboards
- **Prometheus (Query)** : http://mon_ip:9090/query
- **AlertManager (Alerts)** : http://mon_ip:9093/#/alerts
- **API Health (Status)** : http://mon_ip:3000/health

### 💬 Communication
- **Discord (Support)** : https://discord.gg/F7NMNGT9

## 🛠️ Technologies

- **Framework** : Nuxt.js 3.16.0 + Vue.js 3.5.18
- **Styling** : Tailwind CSS + DaisyUI
- **État** : Pinia 0.10.1
- **Authentification** : Firebase Auth 11.4.0
- **Internationalisation** : i18n (Français, Anglais, Espagnol)
- **Tests** : Vitest + Vue Test Utils
- **Performance** : Lighthouse CI
- **Linting** : ESLint + Prettier

## 📦 Installation et Démarrage

### Prérequis
```bash
# Vérifier Node.js (version 18+ requise)
node --version
npm --version

# Utiliser la bonne version Node.js pour ce projet
nvm use

# Installer les dépendances
npm install

# Vérifier l'installation
npm run type-check
```

### 🚀 Commandes de Développement

```bash
# Démarrer le serveur de développement (port 5482)
npm run dev
# ou
npm run start

# Construire pour la production
npm run build

# Prévisualiser la build de production
npm run preview

# Démarrer en mode production
npm run start:prod
```

### 🐳 Docker

```bash
# Construire l'image Docker
docker build -t benevoclic-web .

# Exécuter le conteneur
docker run -p 5482:5482 benevoclic-web

# Exécuter avec variables d'environnement
docker run -p 5482:5482 \
  -e API_BASE_URL=http://localhost:3000 \
  -e FIREBASE_API_KEY=your_key \
  benevoclic-web
```

## 🧪 Tests et Qualité

### Tests Unitaires
```bash
# Exécuter tous les tests
npm test

# Tests des composants uniquement
npm run test:components

# Tests avec couverture
npm run test:coverage

# Tests d'accessibilité
npm run test:a11y

# Exécuter tous les tests avec rapport
npm run test:all
```

### Audits et Analyses
```bash
# Audit Lighthouse complet
npm run audit:all

# Audit de performance
npm run audit:lighthouse

# Audit SEO
npm run audit:seo

# Audit d'accessibilité
npm run audit:a11y

# Audit d'accessibilité détaillé
npm run a11y:audit
```

### Linting et Formatage
```bash
# Vérifier le code
npm run lint

# Corriger automatiquement
npm run lint:fix

# Linting de sécurité
npm run lint:security

# Formatage Prettier
npm run prettier:fix

# Vérifier le formatage
npm run prettier:check

# Vérification TypeScript
npm run type-check

# Vérifier les imports lodash
npm run check:lodash
```

## 🍪 Gestion des Cookies et Sessions

### Problème de Connexion - Cookie `isConnected`

Si vous rencontrez des problèmes de connexion liés au cookie `isConnected`, voici les solutions :

#### 1. Supprimer le Cookie via l'API
```bash
# Supprimer tous les cookies de session
curl -X DELETE http://localhost:5482/api/auth/deleteCookies

# Ou via l'API utilisateur
curl -X DELETE http://localhost:5482/api/user/deleteCookies
```

#### 2. Supprimer le Cookie dans le Navigateur

**Chrome/Edge :**
1. Ouvrir les DevTools (F12)
2. Aller dans l'onglet "Application" ou "Storage"
3. Dans "Cookies" → `http://localhost:5482`
4. Supprimer le cookie `isConnected`

**Firefox :**
1. Ouvrir les DevTools (F12)
2. Aller dans l'onglet "Storage"
3. Dans "Cookies" → `http://localhost:5482`
4. Supprimer le cookie `isConnected`

**Safari :**
1. Préférences → Confidentialité
2. Gérer les données de sites web
3. Rechercher `localhost:5482`
4. Supprimer les cookies


## 🗂️ Nettoyage du Cache

### Cache Nuxt.js
```bash
# Supprimer le cache de build
rm -rf .nuxt
rm -rf .output
rm -rf dist

# Nettoyer le cache npm
npm cache clean --force

# Réinstaller les dépendances
rm -rf node_modules
npm install
```

### Cache du Navigateur
```bash
# Script de nettoyage complet
cat > clear-all-cache.sh << 'EOF'
#!/bin/bash
echo "🧹 Nettoyage complet du cache..."

# Arrêter le serveur
npm run pm2:stop

# Supprimer les caches Nuxt
rm -rf .nuxt .output dist

# Nettoyer le cache npm
npm cache clean --force

# Réinstaller les dépendances
rm -rf node_modules
npm install

# Redémarrer le serveur
npm run pm2:start

echo "✅ Cache nettoyé et serveur redémarré"
EOF

chmod +x clear-all-cache.sh
./clear-all-cache.sh
```

## 🔍 Diagnostic et Debug

### Vérifier l'État des Cookies
```javascript
// Dans la console du navigateur
console.log('Cookies actuels:', document.cookie);

// Vérifier le cookie isConnected
const isConnected = document.cookie
  .split('; ')
  .find(row => row.startsWith('isConnected='));
console.log('Cookie isConnected:', isConnected);
```

### Vérifier l'État de l'Authentification
```javascript
// Dans la console du navigateur
// Vérifier le store d'authentification
const authStore = useAuthStore();
console.log('État auth:', {
  isConnected: authStore.isConnected,
  idToken: authStore.idToken ? 'présent' : 'absent',
  user: authStore.user
});
```

### Logs de Debug
```bash
# Activer les logs de debug
DEBUG=nuxt:* npm run dev

# Voir les logs PM2 en temps réel
npm run pm2:logs

# Voir les logs avec filtrage
pm2 logs benevoclic-web --lines 100 | grep -i "cookie\|auth\|error"
```

## 🚨 Résolution des Problèmes Courants

### Problème : "Cookie isConnected existe mais connexion échoue"

**Solution :**
1. Supprimer le cookie `isConnected` via l'API
2. Vider le cache du navigateur
3. Redémarrer le serveur
4. Se reconnecter

```bash
# Solution rapide
curl -X DELETE http://localhost:5482/api/auth/deleteCookies
npm run pm2:reload
```

### Problème : "Erreur de session expirée"

**Solution :**
```bash
# Nettoyer toutes les sessions
curl -X DELETE http://localhost:5482/api/user/deleteCookies
npm run pm2:reload
```

### Problème : "Impossible de se connecter"

**Solution :**
1. Vérifier que l'API backend fonctionne
2. Vérifier les variables d'environnement Firebase
3. Nettoyer les cookies et le cache
4. Redémarrer l'application

```bash
# Diagnostic complet
echo "🔍 Diagnostic de connexion..."

# Vérifier l'API
curl -s http://localhost:3000/health || echo "❌ API non accessible"

# Vérifier le frontend
curl -s http://localhost:5482 || echo "❌ Frontend non accessible"

# Nettoyer et redémarrer
curl -X DELETE http://localhost:5482/api/auth/deleteCookies
npm run pm2:reload

echo "✅ Diagnostic terminé"
```

## 📊 Monitoring et Performance

### Métriques de Performance
```bash
# Audit de performance complet
npm run audit:all

# Vérifier la taille du bundle
npm run build
du -sh .output/

# Analyser les dépendances
npm ls --depth=0
```

### Monitoring en Temps Réel
```bash
# Voir les ressources utilisées
pm2 monit

# Voir les logs en temps réel
pm2 logs benevoclic-web --lines 50

# Statut des processus
pm2 status
```


### Variables d'Environnement
```bash
# Créer le fichier .env.local
cat > .env.local << 'EOF'
# API Configuration
API_BASE_URL=http://localhost:3000

# Firebase Configuration
FIREBASE_API_KEY=your_api_key
FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_STORAGE_BUCKET=your_project.appspot.com
FIREBASE_MESSAGING_SENDER_ID=your_sender_id
FIREBASE_APP_ID=your_app_id

# Application Configuration
NODE_ENV=development
NUXT_HOST=0.0.0.0
NUXT_PORT=5482
EOF
```

### Configuration PM2
```bash
# Voir la configuration PM2
cat ecosystem.config.cjs

# Modifier la configuration
nano ecosystem.config.cjs
```


## 👨‍💼 Administration

### 🔐 Accès à l'Espace Administrateur

L'espace administrateur de Benevoclic permet de gérer les utilisateurs, les annonces et les signalements de support.

#### Connexion Admin

1. **Accéder à la page de connexion admin :**
   ```
   http://localhost:5482/admin/login
   ```

2. **Créer un compte administrateur :**
   - Aller sur `/admin/register`
   - Remplir le formulaire avec vos informations
   - Votre compte nécessitera une approbation par un super administrateur

3. **Se connecter :**
   - Utiliser vos identifiants admin
   - Si votre compte n'est pas encore approuvé, vous serez redirigé vers la page de vérification

#### Vérification du Statut Admin

```bash
# Vérifier le statut d'approbation
curl -X GET http://localhost:5482/api/admin/[adminId]/check-approval-status
```

### 🎛️ Fonctionnalités Administratives

#### 📊 Dashboard Principal (`/admin`)
- **Vue d'ensemble** : Statistiques globales de la plateforme
- **Compteurs** : Nombre d'utilisateurs, annonces, signalements
- **Statuts** : Signalements en attente vs résolus

#### 👥 Gestion des Utilisateurs (`/admin/manageUser`)
- **Liste des utilisateurs** : Voir tous les utilisateurs inscrits
- **Recherche** : Filtrer par email, rôle, etc.
- **Actions** :
  - Supprimer un utilisateur
  - Voir les détails du profil
  - Gérer les rôles (Volontaire, Association, Admin)

#### 📢 Gestion des Annonces (`/admin/manageAnnouncement`)
- **Liste des annonces** : Toutes les annonces publiées
- **Filtres** : Par statut, association, date
- **Actions** :
  - Modifier le statut d'une annonce
  - Supprimer une annonce
  - Voir les détails complets

#### 🚨 Support et Signalements (`/admin/support`)
- **Signalements** : Gérer les signalements d'utilisateurs
- **Statuts** :
  - `PENDING` : En attente de traitement
  - `IN_PROGRESS` : En cours de traitement
  - `RESOLVED` : Résolu
- **Actions** :
  - Changer le statut d'un signalement
  - Voir les détails du signalement
  - Répondre aux utilisateurs

### 🔧 API Endpoints Admin

#### Gestion des Utilisateurs
```bash
# Lister tous les utilisateurs
GET /api/admin/users

# Supprimer un utilisateur
DELETE /api/admin/users/[id]

# Vérifier le statut d'approbation admin
GET /api/admin/[adminId]/check-approval-status
```

#### Gestion des Annonces
```bash
# Lister toutes les annonces
GET /api/announcements

# Supprimer une annonce
DELETE /api/announcements/[id]

# Modifier une annonce
PATCH /api/announcements/[id]
```

#### Support et Signalements
```bash
# Lister les signalements
GET /api/admin/support-reports

# Obtenir un signalement spécifique
GET /api/admin/support-reports/[id]

# Mettre à jour le statut d'un signalement
PATCH /api/admin/support-reports/[id]/status

# Statistiques des signalements
GET /api/admin/support-stats
```

### 🛡️ Sécurité et Permissions

#### Rôles Administrateurs
- **Admin Standard** : Accès aux fonctionnalités de base
- **Super Admin** : Peut approuver de nouveaux comptes admin
- **Permissions** : Gestion des utilisateurs, annonces, signalements

#### Protection des Routes
```typescript
// Middleware de protection admin
middleware: ['auth', 'admin']

// Vérification du rôle
if (user.role !== RoleUser.ADMIN) {
  // Redirection vers la page de connexion
}
```

### 🚨 Résolution des Problèmes Admin

#### Problème : "Accès refusé à l'espace admin"
```bash
# Vérifier le rôle de l'utilisateur
curl -X GET http://localhost:5482/api/user/profile

# Vérifier l'approbation admin
curl -X GET http://localhost:5482/api/admin/[adminId]/check-approval-status
```

#### Problème : "Compte admin non approuvé"
1. Contacter un super administrateur
2. Attendre l'approbation du compte
3. Vérifier le statut via l'API

#### Problème : "Impossible de supprimer un utilisateur"
```bash
# Vérifier les permissions
curl -X GET http://localhost:5482/api/admin/users

# Vérifier que l'utilisateur existe
curl -X GET http://localhost:5482/api/admin/users/[id]
```

### 📋 Checklist d'Administration

#### Quotidien
- [ ] Vérifier les nouveaux signalements
- [ ] Examiner les demandes d'approbation admin
- [ ] Surveiller les statistiques de la plateforme

#### Hebdomadaire
- [ ] Réviser les annonces signalées
- [ ] Nettoyer les comptes inactifs
- [ ] Analyser les métriques de performance

#### Mensuel
- [ ] Audit des permissions admin
- [ ] Révision des politiques de modération
- [ ] Mise à jour des procédures de support

## 🆘 Support

### Commandes d'Aide
```bash
# Afficher toutes les commandes disponibles
npm run

# Aide PM2
pm2 --help

# Vérifier la configuration
npm run type-check
npm run lint
```

### Logs et Debug
```bash
# Logs détaillés
pm2 logs benevoclic-web --lines 200

# Logs avec timestamp
pm2 logs benevoclic-web --timestamp

# Logs d'erreurs uniquement
pm2 logs benevoclic-web --err
```

---

**🎯 Version actuelle : 1.17.1** | **🚀 Prêt pour la production** | **🔒 Sécurisé et optimisé**
