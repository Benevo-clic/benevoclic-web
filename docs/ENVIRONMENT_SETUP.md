# Configuration d'Environnement - BenevoClic Web

## Variables d'Environnement Requises

Créez un fichier `.env` à la racine du projet avec les variables suivantes :

### Configuration API
```env
# URL de l'API backend
API_BASE_URL=http://localhost:3000

# URL de l'API Sirene (pour la validation des associations)
API_SIRENE_URL=https://api.insee.fr/entreprises/sirene/V3

# Clé API Sirene (obtenez-la sur https://api.insee.fr/)
API_SIRENE_KEY=your_sirene_api_key_here
```

### Configuration Firebase
```env
# Clé API Firebase
FIREBASE_API_KEY=your_firebase_api_key_here

# Domaine d'authentification Firebase
FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com

# ID du projet Firebase
FIREBASE_PROJECT_ID=your-project-id

# Bucket de stockage Firebase
FIREBASE_STORAGE_BUCKET=your-project.appspot.com

# ID de l'expéditeur Firebase
FIREBASE_MESSAGING_SENDER_ID=123456789

# ID de l'application Firebase
FIREBASE_APP_ID=1:123456789:web:abcdef123456

# ID de mesure Firebase (optionnel)
FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
```

### Configuration Serveur
```env
# Port du serveur
PORT=5482

# Environnement Node.js
NODE_ENV=production
```

### Timeouts et Retry
```env
# Timeout des requêtes API (en millisecondes)
API_TIMEOUT=30000

# Nombre de tentatives API
API_RETRY_COUNT=3
```

### OAuth
```env
# URL de callback Google OAuth
GOOGLE_CALLBACK_URL=http://localhost:5482/auth/google/callback
```

## Fichier .env Complet

Voici un exemple de fichier `.env` complet :

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

## Instructions d'Installation

1. **Copiez le contenu ci-dessus** dans un fichier `.env` à la racine du projet
2. **Remplacez les valeurs** par vos vraies clés API et configurations
3. **Redémarrez l'application** après avoir créé le fichier

## Variables Manquantes

Si vous obtenez l'erreur suivante :
```
❌ Variables d'environnement manquantes:
  - API_TIMEOUT (Timeout des requêtes API)
  - API_RETRY_COUNT (Nombre de tentatives API)
```

Cela signifie que le fichier `.env` n'existe pas ou que certaines variables sont manquantes.

## Sécurité

⚠️ **Important :** Ne committez jamais le fichier `.env` dans Git. Il est déjà dans le `.gitignore` pour éviter cela.

## Environnements

- **Développement :** `NODE_ENV=development`
- **Production :** `NODE_ENV=production`
- **Test :** `NODE_ENV=test`
