# 1. Build du frontend React avec Node 22 (LTS récente)
FROM node:22-alpine AS builder
WORKDIR /app

# Copie uniquement les manifests de dépendances
COPY package*.json ./

# npm ci est plus rapide et plus strict que npm install
# Le mount de cache évite de re-télécharger tous les paquets NPM si package.json n'a pas changé
RUN --mount=type=cache,target=/root/.npm \
    npm ci

COPY . .
RUN npm run build

# 2. Image finale Nginx patchée contre les CVEs
FROM nginx:1.27-alpine

# Patch immédiat des vulnérabilités système d'Alpine
RUN apk update && apk upgrade --no-cache

COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]