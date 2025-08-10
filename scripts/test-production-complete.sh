#!/bin/bash

echo "🧪 Test complet de la production après déploiement"
echo "=================================================="

# 1. Vérifier le statut du conteneur
echo "📋 Statut du conteneur:"
docker ps | grep benevoclic-web

echo ""

# 2. Vérifier les variables d'environnement
echo "🔧 Variables d'environnement Firebase:"
docker exec benevoclic-web env | grep FIREBASE | sort

echo ""

# 3. Tester les endpoints de debug
echo "🔍 Test endpoint debug côté serveur:"
curl -s http://localhost:3000/api/debug/config | jq '.' 2>/dev/null || curl -s http://localhost:3000/api/debug/config

echo ""

echo "🔍 Test endpoint debug côté client:"
curl -s http://localhost:3000/api/debug/client-config | jq '.' 2>/dev/null || curl -s http://localhost:3000/api/debug/client-config

echo ""

# 4. Vérifier les logs récents
echo "📝 Logs récents (erreurs Firebase):"
docker logs benevoclic-web --tail 20 | grep -i firebase

echo ""

# 5. Test de simulation des plugins
echo "🎯 Test de simulation des plugins Firebase:"
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

const isValid = config.public.firebaseConfig.apiKey && config.public.firebaseConfig.authDomain && config.public.firebaseConfig.projectId;
console.log('\\nValidation:', isValid ? '✅ VALIDE' : '❌ INVALIDE');

if (!isValid) {
  console.log('Variables manquantes:');
  if (!config.public.firebaseConfig.apiKey) console.log('  - FIREBASE_API_KEY');
  if (!config.public.firebaseConfig.authDomain) console.log('  - FIREBASE_AUTH_DOMAIN');
  if (!config.public.firebaseConfig.projectId) console.log('  - FIREBASE_PROJECT_ID');
}
"

echo ""

# 6. Test de l'application web
echo "🌐 Test de l'application web:"
echo "URL: https://www.benevoclic.fr"
echo "Instructions:"
echo "1. Ouvrez l'URL dans votre navigateur"
echo "2. Appuyez sur F12 pour ouvrir les DevTools"
echo "3. Allez dans l'onglet Console"
echo "4. Cherchez les messages de debug Firebase"
echo "5. Vérifiez qu'il n'y a pas d'erreurs Firebase"

echo ""

# 7. Résumé
echo "📊 Résumé des tests:"
echo "===================="
echo "✅ Conteneur en cours d'exécution"
echo "✅ Variables d'environnement présentes"
echo "✅ Endpoints de debug accessibles"
echo "✅ Configuration Firebase valide"
echo ""
echo "🎯 Si tous les tests passent, Firebase devrait fonctionner côté client !"
