# Goal Tracker — implementation progress

**Last updated:** 2026-09-30  
**Current iteration:** 7 — Production hardening (in progress)  
**Status:** in progress  
**Current focus:** JWT auth and production deploy path remain for V1 completion.

**UI refresh (2026-09-30):** Sidebar navigation, calmer theme, Kanban cross-column drag (todo → in progress → done).

Canonical spec (local, gitignored): `local/architecture/goal-tracker-architecture-plan.md`

---

## Iteration checklist (roadmap §21)

### Iteration 1 — Project Foundation

- [x] Monorepo layout (`frontend/`, `backend/`)
- [x] Frontend (React + Vite + TypeScript + MUI shell)
- [x] Backend (NestJS + `GET /api/v1/health`)
- [x] PostgreSQL + Prisma schema (users, goals, tasks)
- [x] Docker Compose (`compose.yaml`)
- [x] CI (GitHub Actions)
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

- [x] Columns: Todo, In Progress, Blocked, Done
- [x] Drag and drop (dnd-kit)
- [x] Ordering (`position`, reorder API)
- [x] Optimistic updates

### Iteration 5 — Dashboard

- [x] Today's goals and tasks
- [x] Completion %
- [x] Active goals
- [x] Overdue items

### Iteration 6 — Analytics

- [x] Daily / weekly / monthly completion (by goal type over time)
- [x] Charts (ECharts)
- [ ] Calendar and history (deferred post-V1 unless needed)

### Iteration 7 — Production hardening

- [ ] Authentication and authorization (JWT)
- [x] Validation, errors, logging (HTTP request logging)
- [x] Testing (Vitest + Playwright smoke)
- [ ] Docker production path, backup, monitoring

**V1 complete** when Iteration 7 is done.

---

## Recently completed

- **Step 13 — Progress UI:** ECharts completion chart, `/progress` route.
- **Step 11–12 — Dashboard & progress APIs:** `GET /dashboard`, `GET /progress`.
- **Step 14–16 — Hardening:** CI workflow, HTTP logging, Playwright welcome smoke test.

---

## Next up

1. **JWT auth** — replace dev user scoping with login/register and guards.
2. Optional: production Docker/Nginx path per architecture plan.

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
| 2026-09-30 | Kanban reorder sends full task list with status + position per drag. |
| 2026-09-30 | Progress API returns per-day buckets for goal types + task completions (`?days=`). |
| 2026-09-30 | **Single workspace Kanban** at `/board` (`GET /tasks`, `POST /tasks/reorder-board`); goal detail uses task list only. |
| 2026-09-30 | Default **dark theme** (black surfaces) with sidebar toggle; preference stored in `localStorage`. |

---

## Completed iterations

Iterations 1–6 (except calendar/history) and partial Iteration 7 (CI, logging, Playwright).
