# Goal Tracker — implementation progress

**Last updated:** 2026-09-30  
**Current iteration:** 1 — Project Foundation  
**Status:** in progress  
**Current focus:** Step 1 done; next — Postgres, Prisma, Docker Compose (Step 2).

Canonical spec (local, gitignored): `local/architecture/goal-tracker-architecture-plan.md`

---

## Iteration checklist (roadmap §21)

### Iteration 1 — Project Foundation

- [x] Monorepo layout (`frontend/`, `backend/`)
- [x] Frontend (React + Vite + TypeScript + MUI shell)
- [x] Backend (NestJS + `GET /api/v1/health`)
- [ ] PostgreSQL + Prisma schema (users, goals, tasks)
- [ ] Docker Compose
- [ ] CI
- [x] Environment configuration (`.env.example` only; no committed `.env`)

### Iteration 2 — Goals

- [ ] Create / edit / delete goal
- [ ] Goal list
- [ ] Daily / weekly / monthly
- [ ] Goal detail

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

- **Step 1 — Monorepo shell:** pnpm workspaces, `frontend/` (Vite, React, MUI, Vitest), `backend/` (NestJS health API), root `README.md`, `.env.example`, tests green (`pnpm test`), builds (`pnpm build`).

---

## Next up

1. **Step 2:** Docker Compose Postgres + Prisma schema (`users`, `goals`, `tasks`) + migration tests  
2. Wire `DATABASE_URL` locally (user-managed `.env`, not in repo)  
3. **Step 3:** API base (validation pipe, error format) on top of DB

---

## Decisions

| Date | Decision |
|------|----------|
| 2026-09-30 | Use `docs/PROGRESS.md` for stage tracking; architecture plan remains the design spec. |
| 2026-09-30 | Architecture plan moved to `local/architecture/` and gitignored. |
| 2026-09-30 | **pnpm** only for package management; never modify `.env` or secret files (Cursor rules). |
| 2026-09-30 | `before-implementing.mdc` — follow all rules and user step approval before coding. |

---

## Completed iterations

_None yet._
