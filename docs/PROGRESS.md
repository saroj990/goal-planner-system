# Goal Tracker — implementation progress

**Last updated:** 2026-09-30  
**Current iteration:** 4 — Kanban (next)  
**Status:** in progress  
**Current focus:** Step 8 done; Step 9 Kanban UI in progress.

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

- [x] Create / edit / delete goal (REST API + UI)
- [x] Goal list
- [x] Daily / weekly / monthly (tabs + API filter)
- [x] Goal detail (frontend)

### Iteration 3 — Tasks

- [x] Create / edit / delete task (REST API)
- [x] Task status (`PATCH`)
- [x] Task → goal relationship (nested routes + ownership)
- [x] Tasks UI on goal detail (status select, modern theme)

### Iteration 4 — Kanban

- [ ] Columns: Todo, In Progress, Blocked, Done
- [ ] Drag and drop
- [x] Ordering (`position`, reorder API)
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

- **Step 8 — Reorder API:** `POST /api/v1/tasks/reorder` with validation and integration tests.

---

## Next up

1. **Step 9:** Kanban board (dnd-kit) + optimistic reorder on goal detail

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
| 2026-09-30 | Frontend API base via `VITE_API_URL` (see `.env.example`). |
| 2026-09-30 | New tasks get `position` in steps of 100 per goal. |
| 2026-09-30 | Modern UI skill + shared `app/theme.ts` (Inter, indigo, soft surfaces). |

---

## Completed iterations

_None yet._
