# Étape 1 : Build
FROM node:20-alpine AS builder
WORKDIR /app

# Copier .npmrc AVANT npm ci
COPY .npmrc .npmrc
COPY package*.json ./

RUN npm ci

COPY . .
RUN npm run build         # génère .output

FROM node:20-alpine
WORKDIR /app

COPY --from=builder /app/.output ./.output
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./

COPY .env.production ./.env
ENV NUXT_PORT=5482
ENV HOST=0.0.0.0
EXPOSE 5482

CMD ["npx", "nuxi", "preview", "--hostname", "0.0.0.0", "--port", "5482"]
