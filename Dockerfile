# Étape 1 : build
FROM node:20-alpine AS builder

WORKDIR /app

# Désactive la génération de package-lock.json
RUN npm config set package-lock false

# Copie uniquement package.json
COPY package.json ./

# Installe les dépendances
RUN npm install

# Copie le reste du code
COPY . .

# Compile l’app
RUN npm run build

# Étape 2 : runtime
FROM node:20-alpine

WORKDIR /app

# Récupère le build
COPY --from=builder /app/.output ./

# Expose le port Nuxt (5482)
EXPOSE 5482

# Démarre le serveur Nuxt
CMD ["node", "server/index.mjs"]
