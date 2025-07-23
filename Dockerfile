# Étape 1 : Build
FROM node:20-alpine AS builder
WORKDIR /app

# 1) Installer TOUTES les dépendances (prod + dev)
COPY package*.json ./
RUN npm ci                   # install + lockfile, inclut les devDeps

# 2) Copier le code et builder
COPY . .
RUN npm run build            # génère .output

# Étape 2 : Image de production
FROM node:20-alpine
WORKDIR /app

# 3) Copier build + dépendances complètes
COPY --from=builder /app/.output ./.output
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./

# 4) Variables d’env & port
COPY .env.production ./.env
ENV NUXT_PORT=5482
ENV HOST=0.0.0.0
EXPOSE 5482

# 5) Lancer en mode production avec nuxi preview
#    (nuxi est présent dans node_modules/.bin grâce au builder)
CMD ["npx", "nuxi", "preview", "--hostname", "0.0.0.0", "--port", "5482"]
