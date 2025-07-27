# Étape 1 : Build
FROM node:20-alpine AS builder
WORKDIR /app

COPY . .
RUN npm install --frozen-lockfile
RUN NITRO_PRESET=node npm run build

# Étape 2 : Runtime
FROM node:20-alpine AS runner
WORKDIR /app

# Installer curl
RUN apk add --no-cache curl

ENV NODE_ENV=production \
    PORT=5482

COPY --from=builder /app/.output ./

EXPOSE ${PORT}

HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:${PORT}/ || exit 1

CMD ["node", "server/index.mjs"]
