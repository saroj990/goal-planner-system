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
pnpm -C backend db:seed
```

`DATABASE_URL` in `.env` should match Docker defaults:

`postgresql://postgres:postgres@localhost:5432/goaltracker`

Stop Postgres: `pnpm db:down`

### Seeded logins

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@goaltracker.local` | `Admin123!` |
| Member | `saroj@goaltracker.local` | `Saroj123!` |
| Member | `tejeshw@goaltracker.local` | `Tejeshw123!` |

Admin creates projects, assigns tasks to Saroj/Tejeshw, and can filter the board by assignee. Members see and update status on their assigned tasks.

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
| Frontend | http://localhost:5173 — `/projects` for project list and task management |
| Backend  | http://localhost:3000/api/v1/health (`database: up` when Postgres is running) |

### Projects API

Protected routes require `Authorization: Bearer <accessToken>` from `POST /api/v1/auth/login` or `POST /api/v1/auth/register`. Set `JWT_SECRET` in `.env` (see `.env.example`).

| Method | Path | Notes |
|--------|------|--------|
| `GET` | `/api/v1/projects` | List user projects |
| `POST` | `/api/v1/projects` | Body: `title`, optional `description`, `startDate`, `dueDate`, `priority` |
| `GET` | `/api/v1/projects/:id` | |
| `PATCH` | `/api/v1/projects/:id` | Status: `ACTIVE`, `COMPLETED`, `ARCHIVED` |
| `DELETE` | `/api/v1/projects/:id` | `204` |

### Tasks API (Iteration 3 — backend)

| Method | Path | Notes |
|--------|------|--------|
| `POST` | `/api/v1/projects/:projectId/tasks` | Body: `title`, optional `description`, `dueDate`, `priority` (`LOW`–`URGENT`), `assigneeId` (defaults to you); assigns `position` |
| `GET` | `/api/v1/users/assignable` | Users for task assignment picker (`id`, `name`, `email`) |
| `GET` | `/api/v1/projects/:projectId/tasks` | Ordered by `position` |
| `GET` | `/api/v1/tasks/:id` | |
| `PATCH` | `/api/v1/tasks/:id` | `status`: `TODO`, `IN_PROGRESS`, `BLOCKED`, `DONE` |
| `DELETE` | `/api/v1/tasks/:id` | `204` |
| `POST` | `/api/v1/tasks/reorder` | Body: `goalId`, `items[]` with `id`, `status`, `position` |

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
