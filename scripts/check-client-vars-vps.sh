#!/bin/bash

# Script pour vérifier les variables côté client sur le VPS

echo "🔍 Vérification des variables côté client sur le VPS"
echo "===================================================="

# 1. Vérifier les variables d'environnement du conteneur
echo "📋 Variables d'environnement du conteneur:"
echo "-------------------------------------------"
docker exec benevoclic-web env | grep -E "(FIREBASE|NODE_ENV)" | sort

echo ""

# 2. Tester l'endpoint de debug côté serveur
echo "🔧 Test de l'endpoint debug côté serveur:"
echo "----------------------------------------"
curl -s http://localhost:3000/api/debug/config | jq '.' 2>/dev/null || curl -s http://localhost:3000/api/debug/config

echo ""

# 3. Tester l'endpoint de debug côté client
echo "🎯 Test de l'endpoint debug côté client:"
echo "---------------------------------------"
curl -s http://localhost:3000/api/debug/client-config | jq '.' 2>/dev/null || curl -s http://localhost:3000/api/debug/client-config

echo ""

# 4. Vérifier les logs du conteneur pour les erreurs Firebase
echo "📝 Logs récents du conteneur (erreurs Firebase):"
echo "-----------------------------------------------"
docker logs benevoclic-web --tail 20 | grep -i firebase

echo ""

# 5. Vérifier la configuration Nuxt
echo "⚙️ Configuration Nuxt (runtimeConfig):"
echo "-------------------------------------"
docker exec benevoclic-web node -e "
const config = {
  public: {
    firebaseConfig: {
      apiKey: process.env.FIREBASE_API_KEY,
      authDomain: process.env.FIREBASE_AUTH_DOMAIN,
      projectId: process.env.FIREBASE_PROJECT_ID,
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.FIREBASE_APP_ID,
      measurementId: process.env.FIREBASE_MEASUREMENT_ID
    }
  }
};
console.log('Configuration Firebase côté client:');
console.log(JSON.stringify(config.public.firebaseConfig, null, 2));
console.log('');
console.log('Validation:');
const isValid = config.public.firebaseConfig.apiKey && config.public.firebaseConfig.authDomain && config.public.firebaseConfig.projectId;
console.log('✅ Configuration valide:', isValid);
if (!isValid) {
  console.log('❌ Variables manquantes:');
  if (!config.public.firebaseConfig.apiKey) console.log('   - FIREBASE_API_KEY');
  if (!config.public.firebaseConfig.authDomain) console.log('   - FIREBASE_AUTH_DOMAIN');
  if (!config.public.firebaseConfig.projectId) console.log('   - FIREBASE_PROJECT_ID');
}
"

echo ""

# 6. Vérifier le fichier docker-compose
echo "🐳 Configuration docker-compose:"
echo "-------------------------------"
if [ -f /root/docker-compose.web.yml ]; then
    echo "Fichier docker-compose.web.yml trouvé:"
    cat /root/docker-compose.web.yml | grep -A 10 -B 5 "FIREBASE"
else
    echo "❌ Fichier docker-compose.web.yml non trouvé"
fi

echo ""

# 7. Instructions de correction
echo "🔧 Instructions de correction:"
echo "-----------------------------"
echo "1. Vérifier que les variables sont dans GitHub Secrets:"
echo "   - FIREBASE_API_KEY"
echo "   - FIREBASE_AUTH_DOMAIN"
echo "   - FIREBASE_PROJECT_ID"
echo "   - FIREBASE_STORAGE_BUCKET"
echo "   - FIREBASE_MESSAGING_SENDER_ID"
echo "   - FIREBASE_APP_ID"
echo "   - FIREBASE_MEASUREMENT_ID"
echo ""
echo "2. Redéployer avec le workflow GitHub Actions:"
echo "   https://github.com/Benevo-clic/benevoclic-web/actions/workflows/deploy.yml"
echo ""
echo "3. Vérifier que le workflow passe les variables au conteneur"
echo ""
echo "4. Si le problème persiste, vérifier:"
echo "   - nuxt.config.ts expose les variables dans runtimeConfig.public"
echo "   - Les plugins Firebase utilisent useRuntimeConfig()"
echo "   - Le build Docker inclut les variables d'environnement"
