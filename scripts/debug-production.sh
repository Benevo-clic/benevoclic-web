#!/bin/bash

echo "🔍 Diagnostic de production - Benevoclic Web"
echo "============================================="
echo ""

# 1. Vérifier les conteneurs
echo "📋 1. Conteneurs en cours d'exécution :"
docker ps | grep benevoclic || echo "Aucun conteneur benevoclic trouvé"
echo ""

# 2. Vérifier les variables d'environnement du conteneur
echo "📋 2. Variables d'environnement du conteneur benevoclic-web :"
if docker ps | grep -q benevoclic-web; then
    echo "Variables API :"
    docker exec benevoclic-web env | grep -E "(API_BASE_URL|API_SIRENE_URL|API_KEY|API_SIRENE_KEY)" || echo "Aucune variable API trouvée"
    echo ""
    echo "Variables Firebase :"
    docker exec benevoclic-web env | grep -E "(FIREBASE_API_KEY|FIREBASE_AUTH_DOMAIN|FIREBASE_PROJECT_ID)" || echo "Aucune variable Firebase trouvée"
    echo ""
    echo "Variables système :"
    docker exec benevoclic-web env | grep -E "(NODE_ENV|PORT)" || echo "Aucune variable système trouvée"
else
    echo "❌ Conteneur benevoclic-web non trouvé"
fi
echo ""

# 3. Vérifier le fichier docker-compose
echo "📋 3. Fichier docker-compose.web.yml :"
if [ -f ~/benevoclicWeb/docker-compose.web.yml ]; then
    echo "Contenu du fichier docker-compose.web.yml :"
    cat ~/benevoclicWeb/docker-compose.web.yml
else
    echo "❌ Fichier docker-compose.web.yml non trouvé"
fi
echo ""

# 4. Vérifier les logs du conteneur
echo "📋 4. Logs récents du conteneur benevoclic-web :"
if docker ps | grep -q benevoclic-web; then
    docker logs --tail 20 benevoclic-web
else
    echo "❌ Conteneur benevoclic-web non trouvé"
fi
echo ""

# 5. Test de connectivité
echo "📋 5. Test de connectivité :"
echo "Test local (port 5482) :"
curl -s http://localhost:5482/ || echo "Service non accessible sur localhost:5482"
echo ""
echo "Test externe (www.benevoclic.fr) :"
curl -s http://www.benevoclic.fr/ | head -c 200 || echo "Site non accessible"
echo ""

# 6. Vérifier les variables d'environnement du système
echo "📋 6. Variables d'environnement du système :"
echo "API_BASE_URL: ${API_BASE_URL:-NON DÉFINIE}"
echo "NODE_ENV: ${NODE_ENV:-NON DÉFINIE}"
echo "PORT: ${PORT:-NON DÉFINIE}"
echo ""

# 7. Vérifier les réseaux Docker
echo "📋 7. Réseaux Docker :"
docker network ls | grep benevoclic || echo "Réseau benevoclic non trouvé"
echo ""

# 8. Vérifier les volumes et montages
echo "📋 8. Informations détaillées du conteneur :"
if docker ps | grep -q benevoclic-web; then
    echo "Image utilisée :"
    docker inspect benevoclic-web --format='{{.Config.Image}}'
    echo ""
    echo "Variables d'environnement configurées :"
    docker inspect benevoclic-web --format='{{range .Config.Env}}{{println .}}{{end}}'
    echo ""
    echo "Ports exposés :"
    docker inspect benevoclic-web --format='{{range $k, $v := .NetworkSettings.Ports}}{{$k}} -> {{$v}}{{"\n"}}{{end}}'
else
    echo "❌ Conteneur benevoclic-web non trouvé"
fi
