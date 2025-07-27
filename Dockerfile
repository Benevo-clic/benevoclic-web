# Étape 1 : build
FROM node:20-alpine AS builder

WORKDIR /app

# Copier les fichiers de dépendances pour optimiser le cache
COPY package*.json ./
RUN npm ci

# Copier le reste des fichiers
COPY . .

# Construire l'application
RUN npm run build

# Étape 2 : runtime
FROM node:20-alpine AS runner

WORKDIR /app

# Définir les variables d'environnement
ENV NODE_ENV=production \
    PORT=5482

# Copier uniquement les fichiers nécessaires depuis l'étape de build
COPY --from=builder /app/.output ./

# Exposer le port configuré
EXPOSE ${PORT}

# Healthcheck pour vérifier que l'application est en cours d'exécution
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:${PORT}/ || exit 1

# Utilisateur non-root pour la sécurité
USER node

# Commande de démarrage
CMD ["node", "server/index.mjs"]
