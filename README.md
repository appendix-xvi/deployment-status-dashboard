# deployment-status-dashboard

Work-in-progress internal dashboard concept for DevOps/SRE deployment visibility across environments.

This repository is not yet a completed application. It should not be presented as a running dashboard until the frontend, backend, database schema, and Docker Compose runtime are committed.

## Intended stack

```text
Frontend: React + TypeScript + Vite + Tailwind CSS
Backend: Node.js + Express + TypeScript
Database: SQLite
Runtime: Docker Compose
```

## Intended features

- Summary cards for deployment health
- Deployment table with status badges and pipeline links
- Filters by environment, service name, status, and search text
- Deployment detail page with timeline and failure context
- Mock data generation for local demo usage

## Current repository status

```text
Status: work in progress
Ready to showcase: no
```

The README must stay aligned with committed files. Do not claim the app can run locally until the runtime files exist.

## Required files before showcase

```text
frontend/package.json
frontend/src/
backend/package.json
backend/src/
backend/db/
docker-compose.yml
README.md
```

## Intended API design

```text
GET  /health
GET  /api/deployments
GET  /api/deployments/:id
GET  /api/summary
POST /api/deployments/mock-generate
```

These endpoints are planned and should be implemented before this project is described as runnable.

## Target environment list

```text
dev, dev01, alpha, staging, staging01, pt, preprod, prod
```

## Showcase readiness checklist

Before publishing this as a finished portfolio project, verify:

- `docker compose up --build` works from a clean clone.
- Frontend loads without manual code edits.
- Backend `/health` returns success.
- Mock deployment data can be generated.
- Deployment list and summary cards render correctly.
- README commands match the committed implementation.

## License

MIT
