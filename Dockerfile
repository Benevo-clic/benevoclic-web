# Étape 1 : Build
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm config set registry https://registry.npmjs.org/
RUN npm install

COPY . .

# Copie le fichier .env pour le build (si besoin d'accès aux variables à la build)
COPY .env .env

RUN npm run build

# Étape 2 : Production image
FROM node:20-alpine

WORKDIR /app

COPY --from=builder /app/.output ./.output
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.env ./

ENV NUXT_PORT=5482
ENV HOST=0.0.0.0
EXPOSE 5482

CMD ["node", ".output/server/index.mjs"]