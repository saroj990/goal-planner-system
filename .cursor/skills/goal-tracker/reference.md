# Goal Tracker — quick reference

## Main screens

1. Dashboard — today’s goals/tasks, completion %
2. Goals — Daily / Weekly / Monthly tabs, goal cards with progress
3. Goal detail — Kanban board for that goal’s tasks
4. Progress — historical completion; ECharts in analytics iteration

## Goal fields (initial)

`id`, `user_id`, `title`, `description`, `type`, `start_date`, `due_date`, `status`, `priority`, `created_at`, `updated_at`, `completed_at`

## Task fields (initial)

`id`, `goal_id`, `title`, `description`, `status`, `priority`, `position`, `due_date`, `created_at`, `updated_at`, `completed_at`

## Position pattern

Use spaced integers (e.g. 100, 200, 300) so reorder can insert without renumbering entire columns when possible; recalculate when the plan’s drag scenario requires it.

## Testing & deploy (per plan)

Vitest, Playwright, Docker Compose, Nginx reverse proxy.
