# Configuration de Production - BenevoClic Web

## Problème Résolu

L'erreur suivante en production :
```
❌ Variables d'environnement manquantes:
  - API_TIMEOUT (Timeout des requêtes API)
  - API_RETRY_COUNT (Nombre de tentatives API)
❌ ERREUR CRITIQUE - Configuration invalide: Configuration invalide: 2 variable(s) manquante(s)
```

## Solutions

### 1. Vérification de la Configuration

Exécutez le script de vérification :
```bash
npm run check:env
```

### 2. Configuration du Fichier .env

Assurez-vous que votre fichier `.env` contient toutes les variables requises :

```env
# Configuration API
API_BASE_URL=http://localhost:3000
API_SIRENE_URL=https://api.insee.fr/entreprises/sirene/V3
API_SIRENE_KEY=your_sirene_api_key_here

# Configuration Firebase
FIREBASE_API_KEY=your_firebase_api_key_here
FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_STORAGE_BUCKET=your-project.appspot.com
FIREBASE_MESSAGING_SENDER_ID=123456789
FIREBASE_APP_ID=1:123456789:web:abcdef123456
FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX

# Configuration Serveur
PORT=5482
NODE_ENV=production

# Timeouts et Retry
API_TIMEOUT=30000
API_RETRY_COUNT=3

# OAuth
GOOGLE_CALLBACK_URL=http://localhost:5482/auth/google/callback
```

### 3. Génération Automatique

Si le fichier `.env` n'existe pas :
```bash
npm run setup:env
```

### 4. Variables d'Environnement en Production

#### Docker
```dockerfile
ENV NODE_ENV=production
ENV API_TIMEOUT=30000
ENV API_RETRY_COUNT=3
```

#### Docker Compose
```yaml
environment:
  - NODE_ENV=production
  - API_TIMEOUT=30000
  - API_RETRY_COUNT=3
```

#### Variables Système
```bash
export NODE_ENV=production
export API_TIMEOUT=30000
export API_RETRY_COUNT=3
```

### 5. Scripts Utiles

```bash
# Vérifier la configuration
npm run check:env

# Générer le fichier .env
npm run setup:env

# Démarrer en mode production
NODE_ENV=production npm run start

# Démarrer avec Docker
docker run -e NODE_ENV=production -e API_TIMEOUT=30000 -e API_RETRY_COUNT=3 your-image
```

### 6. Déploiement

#### Avec PM2
```bash
# ecosystem.config.js
module.exports = {
  apps: [{
    name: 'benevoclic-web',
    script: 'npm',
    args: 'start',
    env: {
      NODE_ENV: 'production',
      API_TIMEOUT: '30000',
      API_RETRY_COUNT: '3'
    }
  }]
}
```

#### Avec GitHub Actions
```yaml
- name: Deploy to production
  env:
    NODE_ENV: production
    API_TIMEOUT: 30000
    API_RETRY_COUNT: 3
  run: |
    npm run build
    npm run start
```

### 7. Debugging

Si le problème persiste :

1. **Vérifiez les logs** :
   ```bash
   npm run check:env
   ```

2. **Vérifiez les variables d'environnement** :
   ```bash
   printenv | grep -E "(API_|FIREBASE_|NODE_ENV)"
   ```

3. **Testez en local** :
   ```bash
   NODE_ENV=production npm run dev
   ```

### 8. Valeurs Recommandées pour la Production

```env
# Timeouts plus longs pour la production
API_TIMEOUT=60000
API_RETRY_COUNT=5

# Environnement de production
NODE_ENV=production

# URLs de production
API_BASE_URL=https://api.benevoclic.com
GOOGLE_CALLBACK_URL=https://benevoclic.com/auth/google/callback
```

## Support

Si vous rencontrez encore des problèmes :
1. Consultez `docs/ENVIRONMENT_SETUP.md`
2. Vérifiez les logs d'erreur
3. Exécutez `npm run check:env` pour diagnostiquer
