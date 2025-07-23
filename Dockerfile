# === builder ===
FROM node:20-alpine AS builder
WORKDIR /app

# On veut injecter tes vars avant le build
COPY .env .env

# Désactive package-lock
RUN npm config set package-lock false

# Installe tes dépendances
COPY package.json ./
RUN npm install

# Copie tout le code (et .env, qui était ignoré par défaut)
COPY . .

# Build Nuxt avec tes vraies clés
RUN npm run build

# === runtime ===
FROM node:20-alpine AS runner
WORKDIR /app

# On ne récupère que la sortie du builder
COPY --from=builder /app/.output ./

EXPOSE 5482
CMD ["node", "server/index.mjs"]
