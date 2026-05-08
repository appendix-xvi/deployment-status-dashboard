# deployment-status-dashboard

Lightweight internal dashboard for DevOps/SRE visibility of deployments across environments.

## Stack
- Frontend: React + TypeScript + Vite + Tailwind CSS
- Backend: Node.js + Express + TypeScript
- Database: SQLite
- Runtime: Docker Compose

## Features
- Summary cards (today, successful, failed, running, last prod)
- Deployment table with status badges and pipeline links
- Filters: environment, service name, status, search
- Deployment detail with timeline, version diff, pipeline URL, failure message
- Mock data generation endpoint

## API
- `GET /health`
- `GET /api/deployments`
- `GET /api/deployments/:id`
- `GET /api/summary`
- `POST /api/deployments/mock-generate`

## Run locally
```bash
docker compose up --build
```
Open frontend at http://localhost:3000.

## Local development without Docker
### Backend
```bash
cd backend
npm install
npm run seed
npm run dev
```
### Frontend
```bash
cd frontend
npm install
npm run dev
```

## Environment list supported
`dev`, `dev01`, `alpha`, `staging`, `staging01`, `pt`, `preprod`, `prod`.

## Mock seed
Backend auto-seeds at startup when the database is empty. You can regenerate:
```bash
curl -X POST http://localhost:4000/api/deployments/mock-generate
```
