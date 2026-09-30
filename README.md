# Goal Tracker

Personal goal and task management (V1). Monorepo: React frontend + NestJS backend.

## Prerequisites

- Node.js 20+
- [pnpm](https://pnpm.io/) 10+

## Setup

```bash
pnpm install
```

Copy environment templates (set values locally; **do not commit** `.env`):

```bash
cp .env.example .env
# Optional: copy vars into frontend/.env if you use Vite env files there
```

See `.env.example` for `PORT`, `DATABASE_URL`, and `VITE_API_URL`.

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
| Frontend | http://localhost:5173                    |
| Backend  | http://localhost:3000/api/v1/health      |

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
