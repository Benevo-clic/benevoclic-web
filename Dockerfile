# Étape 1 : build
FROM node:20-alpine AS builder

WORKDIR /app

# Copier les fichiers de dépendances pour optimiser le cache
COPY package*.json ./
# Disable the use of global .npmrc file
RUN npm ci --no-global

# Copier le fichier .env s'il existe
COPY .env.production ./.env

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

# Copier le fichier .env pour le runtime
COPY --from=builder /app/.env.production ./

# Exposer le port configuré
EXPOSE ${PORT}

# Utilisateur non-root pour la sécurité
USER node

# Commande de démarrage
CMD ["node", "server/index.mjs"]