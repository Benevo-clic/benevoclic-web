#!/bin/sh

# Afficher les variables d'environnement pour debug (masquées)
echo "🔍 Variables d'environnement configurées :"
echo "NODE_ENV: $NODE_ENV"
echo "PORT: $PORT"
echo "FIREBASE_API_KEY: ${FIREBASE_API_KEY:+***}"
echo "FIREBASE_AUTH_DOMAIN: $FIREBASE_AUTH_DOMAIN"
echo "FIREBASE_PROJECT_ID: $FIREBASE_PROJECT_ID"

# Démarrer l'application
exec node server/index.mjs