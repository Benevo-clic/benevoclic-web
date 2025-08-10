#!/bin/bash

echo "🔍 Vérification des clés dans le conteneur benevoclic-web"
echo "=================================================="

# Vérifier si le conteneur existe
if ! docker ps | grep -q "benevoclic-web"; then
    echo "❌ Conteneur benevoclic-web non trouvé"
    echo "📋 Conteneurs en cours d'exécution :"
    docker ps
    exit 1
fi

echo "✅ Conteneur benevoclic-web trouvé"
echo ""

# Variables à vérifier
KEYS=(
    "NODE_ENV"
    "PORT"
    "API_BASE_URL"
    "API_SIRENE_URL"
    "API_KEY"
    "API_SIRENE_KEY"
    "STORAGE_BUCKET"
    "MESSAGING_SENDER_ID"
    "APP_ID"
    "MEASUREMENT_ID"
    "API_TIMEOUT"
    "API_RETRY_COUNT"
    "GOOGLE_CALLBACK_URL"
    "FIREBASE_API_KEY"
    "FIREBASE_AUTH_DOMAIN"
    "FIREBASE_PROJECT_ID"
    "FIREBASE_STORAGE_BUCKET"
    "FIREBASE_MESSAGING_SENDER_ID"
    "FIREBASE_APP_ID"
    "FIREBASE_MEASUREMENT_ID"
)

echo "📋 Vérification des variables d'environnement :"
echo ""

for key in "${KEYS[@]}"; do
    value=$(docker exec benevoclic-web sh -c "echo \$$key")
    
    if [ -z "$value" ]; then
        echo "❌ $key: NON DÉFINIE"
    elif [ "$value" = "undefined" ]; then
        echo "❌ $key: UNDEFINED"
    else
        # Masquer les valeurs sensibles
        if [[ "$key" == *"KEY"* ]] || [[ "$key" == *"ID"* ]] || [[ "$key" == *"SECRET"* ]]; then
            masked_value=$(echo "$value" | sed 's/./*/g')
            echo "✅ $key: $masked_value"
        else
            echo "✅ $key: $value"
        fi
    fi
done

echo ""
echo "🔍 Vérification des logs récents :"
echo "=================================="
docker logs --tail 20 benevoclic-web

echo ""
echo "🔍 Vérification de la santé du conteneur :"
echo "=========================================="
docker exec benevoclic-web sh -c "ps aux | grep node" || echo "Processus non accessible"

echo ""
echo "🔍 Test de connectivité interne :"
echo "================================="
docker exec benevoclic-web sh -c "wget -qO- http://localhost:5482/health 2>/dev/null || echo 'Service non accessible sur /health'"
docker exec benevoclic-web sh -c "wget -qO- http://localhost:5482/ 2>/dev/null | head -c 100 || echo 'Service non accessible sur /'"

echo ""
echo "🔍 Informations système :"
echo "========================"
echo "Image utilisée : $(docker inspect benevoclic-web --format='{{.Config.Image}}')"
echo "Ports exposés : $(docker inspect benevoclic-web --format='{{range $k, $v := .NetworkSettings.Ports}}{{$k}} {{end}}')"
echo "Réseau : $(docker inspect benevoclic-web --format='{{range $k, $v := .NetworkSettings.Networks}}{{$k}} {{end}}')"
