# Étape 1 : Build
FROM node:20-alpine AS builder
WORKDIR /app

COPY . .
RUN npm install --frozen-lockfile
RUN NITRO_PRESET=node npm run build

# Étape 2 : Runtime
FROM node:20-alpine AS runner
WORKDIR /app

COPY --from=builder /app/.output ./

ENV NODE_ENV=production
ENV PORT=5482

EXPOSE 5482

CMD ["node", "server/index.mjs"]
