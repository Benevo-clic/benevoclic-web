# Étape 1 : Build
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install --ignore-scripts

COPY . .

RUN npm run build

# Étape 2 : Production image
FROM node:20-alpine

WORKDIR /app

COPY --from=builder /app/.output ./.output
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY .env.production ./.env

ENV NUXT_PORT=5482
EXPOSE 5482

CMD ["node", ".output/server/index.mjs"]