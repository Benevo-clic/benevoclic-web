#!/bin/bash

# Script pour déployer et tester les variables côté client en production

echo "🚀 Déploiement et test des variables côté client en production"
echo "================================================================"

# 1. Vérifier que nous sommes sur la branche main
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "main" ]; then
    echo "❌ Erreur: Vous devez être sur la branche main pour déployer"
    echo "   Branche actuelle: $CURRENT_BRANCH"
    exit 1
fi

echo "✅ Branche: $CURRENT_BRANCH"

# 2. Vérifier que les changements sont commités
if [ -n "$(git status --porcelain)" ]; then
    echo "❌ Erreur: Il y a des changements non commités"
    echo "   Committez vos changements avant de déployer"
    git status --short
    exit 1
fi

echo "✅ Tous les changements sont commités"

# 3. Pousser vers GitHub
echo "📤 Poussage vers GitHub..."
git push origin main

if [ $? -ne 0 ]; then
    echo "❌ Erreur lors du push vers GitHub"
    exit 1
fi

echo "✅ Code poussé vers GitHub"

# 4. Attendre que le build soit terminé
echo "⏳ Attente du build Docker Hub..."
echo "   Vérifiez: https://github.com/Benevo-clic/benevoclic-web/actions"
echo "   Ou: https://hub.docker.com/r/aboubakar940/benevoclic-web/tags"

# 5. Déployer en production
echo "🌐 Déploiement en production..."
echo "   Déclenchez manuellement le workflow deploy.yml:"
echo "   https://github.com/Benevo-clic/benevoclic-web/actions/workflows/deploy.yml"

# 6. Instructions de test
echo ""
echo "🧪 Tests à effectuer après déploiement:"
echo ""
echo "1. Vérifier les variables côté serveur:"
echo "   curl https://www.benevoclic.fr/api/debug/config"
echo ""
echo "2. Vérifier les variables côté client:"
echo "   curl https://www.benevoclic.fr/api/debug/client-config"
echo ""
echo "3. Vérifier les logs du conteneur:"
echo "   ssh user@vps 'docker logs benevoclic-web --tail 50'"
echo ""
echo "4. Tester l'application:"
echo "   https://www.benevoclic.fr"
echo ""
echo "5. Vérifier les erreurs Firebase dans la console du navigateur:"
echo "   - Ouvrir les DevTools (F12)"
echo "   - Aller dans l'onglet Console"
echo "   - Chercher les erreurs Firebase"
echo ""
echo "🔍 Variables à vérifier:"
echo "   - FIREBASE_API_KEY"
echo "   - FIREBASE_AUTH_DOMAIN" 
echo "   - FIREBASE_PROJECT_ID"
echo "   - FIREBASE_STORAGE_BUCKET"
echo "   - FIREBASE_MESSAGING_SENDER_ID"
echo "   - FIREBASE_APP_ID"
echo "   - FIREBASE_MEASUREMENT_ID"
echo ""
echo "📝 Si les erreurs Firebase persistent:"
echo "   1. Vérifier que les variables sont dans GitHub Secrets"
echo "   2. Vérifier que deploy.yml passe les variables au conteneur"
echo "   3. Vérifier que nuxt.config.ts expose les variables publiques"
echo "   4. Vérifier que les plugins Firebase utilisent useRuntimeConfig()"
