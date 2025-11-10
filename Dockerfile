# Node 20 alpine
FROM node:20-alpine AS deps
WORKDIR /app
# Устанавливаем OpenSSL для Prisma
RUN apk add --no-cache openssl1.1-compat
COPY package.json ./
RUN npm install --no-audit --no-fund

FROM node:20-alpine AS builder
WORKDIR /app
# Устанавливаем OpenSSL для Prisma
RUN apk add --no-cache openssl1.1-compat
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run prisma:generate && npm run build

FROM node:20-alpine AS runner
WORKDIR /app
# Устанавливаем OpenSSL для Prisma
RUN apk add --no-cache openssl1.1-compat
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma
EXPOSE 3000
CMD ["npm","start"]
