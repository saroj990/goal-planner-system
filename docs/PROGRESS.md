# Goal Tracker — implementation progress

**Last updated:** 2026-09-30  
**Current iteration:** 2 — Goals  
**Status:** in progress  
**Current focus:** Goals API done; next — Goals UI (tabs, list, detail).

Canonical spec (local, gitignored): `local/architecture/goal-tracker-architecture-plan.md`

---

## Iteration checklist (roadmap §21)

### Iteration 1 — Project Foundation

- [x] Monorepo layout (`frontend/`, `backend/`)
- [x] Frontend (React + Vite + TypeScript + MUI shell)
- [x] Backend (NestJS + `GET /api/v1/health`)
- [x] PostgreSQL + Prisma schema (users, goals, tasks)
- [x] Docker Compose (`compose.yaml`)
- [ ] CI
- [x] Environment configuration (`.env.example` only; no committed `.env`)

### Iteration 2 — Goals

- [x] Create / edit / delete goal (REST API)
- [x] Goal list
- [x] Daily / weekly / monthly (query filter `?type=`)
- [ ] Goal detail (frontend)
- [ ] Goals UI (tabs + cards)

### Iteration 3 — Tasks

- [ ] Create / edit / delete task
- [ ] Task status
- [ ] Task → goal relationship

### Iteration 4 — Kanban

- [ ] Columns: Todo, In Progress, Blocked, Done
- [ ] Drag and drop
- [ ] Ordering (`position`, reorder API)
- [ ] Optimistic updates

### Iteration 5 — Dashboard

- [ ] Today's goals and tasks
- [ ] Completion %
- [ ] Active goals
- [ ] Overdue items

### Iteration 6 — Analytics

- [ ] Daily / weekly / monthly completion
- [ ] Charts (ECharts)
- [ ] Calendar and history

### Iteration 7 — Production hardening

- [ ] Authentication and authorization
- [ ] Validation, errors, logging
- [ ] Testing (Vitest + Playwright)
- [ ] Docker production path, backup, monitoring

**V1 complete** when Iteration 7 is done.

---

## Recently completed

- **Step 4 — Goals API:** `GoalsModule` CRUD at `/api/v1/goals`, type filter, DTO validation, dev user via `UsersService` until JWT.

---

## Next up

1. **Goals frontend:** React Router, TanStack Query, Daily/Weekly/Monthly tabs, list + create/edit + detail route
2. **Iteration 3:** Tasks API under goals

---

## Decisions

| Date | Decision |
|------|----------|
| 2026-09-30 | Use `docs/PROGRESS.md` for stage tracking; architecture plan remains the design spec. |
| 2026-09-30 | Architecture plan moved to `local/architecture/` and gitignored. |
| 2026-09-30 | **pnpm** only for package management; never modify `.env` or secret files (Cursor rules). |
| 2026-09-30 | `before-implementing.mdc` — follow all rules and user step approval before coding. |
| 2026-09-30 | Prisma `cuid` IDs; goal/task enums per architecture plan; `onDelete: Cascade` goal→tasks. |
| 2026-09-30 | API errors: `statusCode`, `error`, `message`, `path`, `timestamp` via global exception filter. |
| 2026-09-30 | Pre-auth: single dev user `dev@goaltracker.local` (upsert) owns all goals. |

---

## Completed iterations

_None yet._
