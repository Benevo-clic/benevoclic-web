# Étape 1 : build
FROM node:20-alpine AS builder

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

# Copier le fichier .env par défaut (optionnel)
COPY --from=builder /app/.env.production ./.env

# Exposer le port configuré
EXPOSE ${PORT}

# Utilisateur non-root pour la sécurité
USER node

# Script de démarrage pour gérer les variables d'environnement
COPY --from=builder /app/scripts/start.sh ./start.sh
RUN chmod +x ./start.sh

# Commande de démarrage
CMD ["./start.sh"]