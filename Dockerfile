# Étape 1 : Build
FROM node:20-alpine AS builder
WORKDIR /app

# 1) Copier package.json et lockfile
COPY package*.json ./

RUN npm ci

# 4) Copier tout le code et builder Nuxt
COPY . .
RUN npm run build

# Étape 2 : Production
FROM node:20-alpine
WORKDIR /app

# Copier le build et les modules
COPY --from=builder /app/.output ./.output
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./

# Variables d’environnement et port
COPY .env.production ./.env
ENV NUXT_PORT=5482
ENV HOST=0.0.0.0
EXPOSE 5482

# Lancer avec nuxi preview
CMD ["npx", "nuxi", "preview", "--hostname", "0.0.0.0", "--port", "5482"]
