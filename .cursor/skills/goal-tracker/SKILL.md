---
name: goal-tracker
description: >-
  Implements and extends the Goal Tracker personal goal-management app per
  local architecture plan. Use when adding features, designing API
  contracts, schema changes, Kanban/tasks/goals UI, dashboard/analytics, or when
  the user references V1 scope, domain model, or the architecture plan.
---

# Goal Tracker — implementation skill

## Source of truth

Read [goal-tracker-architecture-plan.md](../../../local/architecture/goal-tracker-architecture-plan.md) before non-trivial changes (file is gitignored; present on your machine under `local/architecture/`). If the plan and code disagree, align code to the plan or propose an explicit plan update.

## Product guardrails

- Personal goal management, **not** a JIRA clone. Kanban supports execution; goals stay the center.
- Core principle: **Goals are the domain. Tasks are execution. Analytics observes. AI sits on top later.**
- V1 answers: what to achieve (goals), what to do (tasks), what am I working on (Kanban + DnD), how am I progressing (dashboard/progress).
- Defer until post-V1 unless asked: microservices, separate analytics engine, `goal_progress_events`, hierarchical `parent_goal_id`, Redis, AI assistant.

## Domain (do not blur)

| Entity | Types / statuses |
|--------|-------------------|
| Goal `type` | `DAILY`, `WEEKLY`, `MONTHLY` |
| Goal `status` | `ACTIVE`, `COMPLETED`, `ARCHIVED` — not task Kanban statuses |
| Task `status` | `TODO`, `IN_PROGRESS`, `BLOCKED`, `DONE` |
| Task `position` | Required for column order; recalculate on reorder |

Status changes: `PATCH /api/v1/tasks/{id}`. Column/order changes: `POST /api/v1/tasks/reorder` (not only status PATCH).

## Stack (stick to the plan)

| Layer | Choice |
|-------|--------|
| Frontend | React, TypeScript, Vite, MUI, TanStack Query, React Router, dnd-kit, ECharts |
| Backend | NestJS modular monolith, REST `/api/v1`, Prisma, PostgreSQL, JWT |
| Validation | Zod and/or class-validator |

## Layout conventions

**Frontend** — feature-based under `src/`:

```text
src/app/          router, providers
src/features/     goals | tasks | dashboard | progress (components, hooks, api, types)
src/components/   shared UI
src/pages/
```

**Backend** — Nest modules: `auth`, `users`, `goals`, `tasks`, `dashboard`, `progress`, `common` (controller → service → repository pattern per plan).

## Build order (when planning work)

1. Foundation → 2. Goals CRUD → 3. Tasks → 4. Kanban (DnD, ordering, optimistic updates) → 5. Dashboard → 6. Analytics/charts → 7. Auth & hardening.

## Kanban implementation notes

- Use **dnd-kit** for drag between columns and sortable lists.
- Use **TanStack Query** for server state; optimistic updates on drag/reorder, then reconcile with API.
- Four columns: Todo, In Progress, Blocked, Done.

## API surface (V1)

```text
/api/v1/auth
/api/v1/goals
/api/v1/tasks
/api/v1/tasks/reorder
/api/v1/dashboard
/api/v1/progress
```

## Additional detail

For enums, schema fields, and screen wireframes, see [reference.md](reference.md).
