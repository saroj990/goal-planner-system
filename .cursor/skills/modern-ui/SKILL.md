---
name: modern-ui
description: >-
  Applies modern product UI patterns for Goal Tracker frontend (MUI). Use when
  building or styling React pages, components, layout, theme, goals, tasks, or
  Kanban, or when the user asks for a modern, non-traditional look.
---

# Modern UI (Goal Tracker)

## Visual direction

Aim for a **contemporary productivity app** (Linear / Notion / Arc vibes), not enterprise “blue header + tables.”

- **Surfaces:** soft page background (`grey.50` / cool tint), white cards with light border or soft shadow—not heavy outlines everywhere.
- **Shape:** generous radius (`12–16px` cards, `10px` buttons/chips). `textTransform: 'none'` on buttons.
- **Typography:** clean sans (Inter or system stack), clear hierarchy (`h4` page titles, `body2` secondary meta).
- **Color:** one confident primary (indigo/violet or teal); status colors as **muted pills**, not loud defaults.
- **Density:** airy padding (`p: 2.5–3` on cards), `spacing={2}` stacks; avoid cramped forms.
- **Motion:** subtle hovers (`translateY(-2px)`, shadow lift on cards); keep animations &lt; 200ms.

## MUI patterns

- Centralize in `frontend/src/app/theme.ts`; extend `components` (Card, Button, Chip, AppBar, Dialog, TextField).
- Prefer `Stack`, `Box`, `Card` + `CardContent` over raw tables for lists.
- Use `IconButton` + tooltips for row actions; primary actions = contained `Button` with icon.
- Empty states: short headline + one-line hint + CTA—not bare “No data.”

## Do not

- Default Material blue (`#1976d2`) without customizing the palette.
- ALL CAPS buttons, sharp 0-radius cards, or dense grid-only layouts for personal goal views.
- Overuse `variant="outlined"` on every control—mix contained / text / soft chips.

## Reference

Theme tokens live in `frontend/src/app/theme.ts`. Match new screens to existing goals/tasks components before inventing new patterns.
