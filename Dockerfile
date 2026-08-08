# 1. Build frontend
FROM node:22-alpine AS frontend-builder
WORKDIR /app
COPY package*.json ./
RUN --mount=type=cache,target=/root/.npm npm ci
COPY index.html vite.config.js ./
COPY public ./public
COPY src ./src
RUN npm run build

# 2. Install backend deps
FROM node:22-alpine AS backend-deps
WORKDIR /app/backend
COPY backend/package*.json ./
RUN --mount=type=cache,target=/root/.npm npm ci --omit=dev

# 3. Runtime monolith: Express serves API + static React build
FROM node:22-alpine
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=80

RUN apk update && apk upgrade --no-cache

COPY --from=backend-deps /app/backend/node_modules ./backend/node_modules
COPY backend/package.json ./backend/
COPY backend/src ./backend/src
COPY --from=frontend-builder /app/dist ./dist

EXPOSE 80
CMD ["node", "backend/src/index.js"]
