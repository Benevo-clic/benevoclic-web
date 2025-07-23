# --- 1) Builder : compile l’app avec tes secrets ---
FROM node:20-alpine AS builder
WORKDIR /app

# 1.1 Copier ton fichier d’env prod et le renommer en .env
COPY .env.production .env

# 1.2 Désactiver package-lock (optionnel)
RUN npm config set package-lock false

# 1.3 Installer les dépendances
COPY package.json package-lock.json* ./
RUN npm install

# 1.4 Copier tout le code (incluant .env)
COPY . .

# 1.5 Lancer le build : à ce moment, Nuxt lit process.env.* et génère un .output complet
RUN npm run build

# --- 2) Runner : image finale légère sans secrets texte ---
FROM node:20-alpine AS runner
WORKDIR /app

# Récupérer uniquement le build
COPY --from=builder /app/.output ./

# Mettre NODE_ENV en prod
ENV NODE_ENV=production
# Par défaut Nuxt écoute sur 5482
EXPOSE 5482

# Démarrer l’app
CMD ["node", "server/index.mjs"]
