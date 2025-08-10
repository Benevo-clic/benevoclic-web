# Étape 1 : build
FROM node:20-alpine AS builder

# Build arguments pour les variables d'environnement
ARG FIREBASE_API_KEY
ARG FIREBASE_AUTH_DOMAIN
ARG FIREBASE_PROJECT_ID
ARG FIREBASE_STORAGE_BUCKET
ARG FIREBASE_MESSAGING_SENDER_ID
ARG FIREBASE_APP_ID
ARG FIREBASE_MEASUREMENT_ID
ARG API_BASE_URL

# Variables d'environnement pour le build
ENV FIREBASE_API_KEY=$FIREBASE_API_KEY
ENV FIREBASE_AUTH_DOMAIN=$FIREBASE_AUTH_DOMAIN
ENV FIREBASE_PROJECT_ID=$FIREBASE_PROJECT_ID
ENV FIREBASE_STORAGE_BUCKET=$FIREBASE_STORAGE_BUCKET
ENV FIREBASE_MESSAGING_SENDER_ID=$FIREBASE_MESSAGING_SENDER_ID
ENV FIREBASE_APP_ID=$FIREBASE_APP_ID
ENV FIREBASE_MEASUREMENT_ID=$FIREBASE_MEASUREMENT_ID
ENV API_BASE_URL=$API_BASE_URL

WORKDIR /app

# Copier les fichiers de dépendances pour optimiser le cache
COPY package*.json ./
# Disable the use of global .npmrc file
RUN npm ci --no-global

# Copier le reste des fichiers
COPY . .

# Construire l'application
RUN npm run build

# Étape 2 : runtime
FROM node:20-alpine AS runner

WORKDIR /app

# Définir les variables d'environnement par défaut
ENV NODE_ENV=production \
    PORT=5482

# Copier uniquement les fichiers nécessaires depuis l'étape de build
COPY --from=builder /app/.output ./

# Exposer le port configuré
EXPOSE ${PORT}

# Utilisateur non-root pour la sécurité
USER node

# Commande de démarrage
CMD ["node", "server/index.mjs"]