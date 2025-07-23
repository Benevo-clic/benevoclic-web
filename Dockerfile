# === builder ===
FROM node:20-alpine AS builder
WORKDIR /app

# Copier et renommer .env.production ➔ .env pour le build
COPY .env.production .env

# Désactive package-lock
RUN npm config set package-lock false

# Dépendances
COPY package.json ./
RUN npm install

# Tout le code (incluant .env)
COPY . .

# Build Nuxt (utilise les vars de .env)
RUN npm run build

# === runtime ===
FROM node:20-alpine AS runner
WORKDIR /app

# Ne récupérer que le build
COPY --from=builder /app/.output ./

# On indique au conteneur de s'appuyer sur le même fichier de prod
# (optionnel si tu préfères monter en runtime)
ENV NODE_ENV=production
EXPOSE 5482

CMD ["node", "server/index.mjs"]
