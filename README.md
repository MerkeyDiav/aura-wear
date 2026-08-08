# Aura Wear

Landing page D2C Aura Smartwatch + backend Node.js monolithique (Express + MySQL).

Le formulaire VIP enregistre les emails en base. En production, Express sert l’API **et** le frontend buildé (une seule image Docker).

## Stack

- Frontend: React + Vite + Tailwind
- Backend: Express (`backend/`)
- DB: MySQL (`DATABASE_URL`)

## API (lab)

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/health` | Santé app + statut DB |
| `POST` | `/api/preorders` | `{ "email": "..." }` — inscription VIP |
| `GET` | `/api/preorders/count` | Nombre d’inscrits |

## Lancer en local

**Prérequis:** Node.js 22+, Docker (pour MySQL)

```bash
# 1. MySQL local
npm run db:up

# 2. Backend
cp backend/.env.example backend/.env
npm install --prefix backend
npm run dev:backend

# 3. Frontend (autre terminal)
npm install
npm run dev
```

- Frontend: http://localhost:5173 (proxy `/api` → backend `:3000`)
- API health: http://localhost:3000/api/health

## Build / run monolith (comme en Azure)

```bash
npm run build
NODE_ENV=production PORT=3000 npm start
```

Ou via Docker:

```bash
docker compose up -d db
docker build -t aura-wear .
docker run --rm -p 8080:80 \
  -e DATABASE_URL=mysql://aura:aura@host.docker.internal:3306/aura_wear \
  aura-wear
```

## Déploiement Azure

1. Créer une **Azure Database for MySQL**
2. Passer la connection string au pod:

```text
DATABASE_URL=mysql://USER:PASSWORD@HOST:3306/aura_wear
DB_SSL=true
```

3. Image unique (frontend + backend). Les probes Helm peuvent pointer vers `/api/health`.
