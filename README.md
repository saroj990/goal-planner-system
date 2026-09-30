# Goal Tracker

Personal goal and task management (V1). Monorepo: React frontend + NestJS backend.

## Prerequisites

- Node.js 20+
- [pnpm](https://pnpm.io/) 10+
- [Docker](https://www.docker.com/) (for PostgreSQL)

## Setup

```bash
pnpm install
```

Copy environment templates (set values locally; **do not commit** `.env`):

```bash
cp .env.example .env
```

See `.env.example` for `PORT`, `DATABASE_URL`, and `VITE_API_URL`.

### Database (PostgreSQL)

```bash
pnpm db:up
pnpm db:migrate:deploy
```

`DATABASE_URL` in `.env` should match Docker defaults:

`postgresql://postgres:postgres@localhost:5432/goaltracker`

Stop Postgres: `pnpm db:down`

## Development

Run both apps in parallel:

```bash
pnpm dev
```

Or separately:

```bash
pnpm --filter @goal-tracker/backend dev
pnpm --filter @goal-tracker/frontend dev
```

| App      | URL                                      |
|----------|------------------------------------------|
| Frontend | http://localhost:5173 — `/goals` for Daily/Weekly/Monthly lists |
| Backend  | http://localhost:3000/api/v1/health (`database: up` when Postgres is running) |

### Goals API (Iteration 2 — backend)

Until auth ships, goals are scoped to an auto-created dev user (`dev@goaltracker.local`).

| Method | Path | Notes |
|--------|------|--------|
| `GET` | `/api/v1/goals` | Optional query `?type=DAILY\|WEEKLY\|MONTHLY` |
| `POST` | `/api/v1/goals` | Body: `title`, `type`, optional `description`, `startDate`, `dueDate`, `priority` |
| `GET` | `/api/v1/goals/:id` | |
| `PATCH` | `/api/v1/goals/:id` | |
| `DELETE` | `/api/v1/goals/:id` | `204` |

### Tasks API (Iteration 3 — backend)

| Method | Path | Notes |
|--------|------|--------|
| `POST` | `/api/v1/goals/:goalId/tasks` | Body: `title`, optional `description`, `dueDate`, `priority`; assigns `position` |
| `GET` | `/api/v1/goals/:goalId/tasks` | Ordered by `position` |
| `GET` | `/api/v1/tasks/:id` | |
| `PATCH` | `/api/v1/tasks/:id` | `status`: `TODO`, `IN_PROGRESS`, `BLOCKED`, `DONE` |
| `DELETE` | `/api/v1/tasks/:id` | `204` |

### API errors

Validation and HTTP errors use a consistent JSON body:

```json
{
  "statusCode": 400,
  "error": "Bad Request",
  "message": ["email must be an email"],
  "path": "/api/v1/goals",
  "timestamp": "2026-09-30T12:00:00.000Z"
}
```

Global `ValidationPipe` strips unknown properties (`whitelist`). Prisma unique violations map to `409 Conflict`.

## Test & build

```bash
pnpm test
pnpm build
```

## Project layout

```text
frontend/     React + Vite + MUI
backend/      NestJS API (/api/v1)
docs/         PROGRESS.md (implementation stage)
local/        Local-only architecture spec (gitignored)
```

Implementation status: [docs/PROGRESS.md](docs/PROGRESS.md).
