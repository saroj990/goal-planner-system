import { Task, TaskStatus } from '../types';

export const KANBAN_COLUMN_ORDER: TaskStatus[] = [
  TaskStatus.TODO,
  TaskStatus.IN_PROGRESS,
  TaskStatus.BLOCKED,
  TaskStatus.DONE,
];

export const COLUMN_DROP_PREFIX = 'column-';

export function columnDropId(status: TaskStatus): string {
  return `${COLUMN_DROP_PREFIX}${status}`;
}

export function parseColumnDropId(id: string): TaskStatus | null {
  if (!id.startsWith(COLUMN_DROP_PREFIX)) return null;
  const status = id.slice(COLUMN_DROP_PREFIX.length) as TaskStatus;
  return KANBAN_COLUMN_ORDER.includes(status) ? status : null;
}

export function groupTasksByStatus(tasks: Task[]): Record<TaskStatus, Task[]> {
  const columns = Object.fromEntries(
    KANBAN_COLUMN_ORDER.map((status) => [status, [] as Task[]]),
  ) as Record<TaskStatus, Task[]>;

  const sorted = [...tasks].sort((a, b) => a.position - b.position);
  for (const task of sorted) {
    columns[task.status].push(task);
  }
  return columns;
}

export function buildReorderPayload(goalId: string, columns: Record<TaskStatus, Task[]>) {
  const items: { id: string; status: TaskStatus; position: number }[] = [];
  let position = 100;
  for (const status of KANBAN_COLUMN_ORDER) {
    for (const task of columns[status]) {
      items.push({ id: task.id, status, position });
      position += 100;
    }
  }
  return { goalId, items };
}

export function moveTaskInColumns(
  columns: Record<TaskStatus, Task[]>,
  taskId: string,
  toStatus: TaskStatus,
  toIndex: number,
): Record<TaskStatus, Task[]> {
  const next = KANBAN_COLUMN_ORDER.reduce(
    (acc, status) => {
      acc[status] = [...columns[status]];
      return acc;
    },
    {} as Record<TaskStatus, Task[]>,
  );

  let moved: Task | undefined;
  for (const status of KANBAN_COLUMN_ORDER) {
    const idx = next[status].findIndex((t) => t.id === taskId);
    if (idx >= 0) {
      moved = next[status].splice(idx, 1)[0];
      break;
    }
  }
  if (!moved) return columns;

  const updated: Task = { ...moved, status: toStatus };
  const target = next[toStatus];
  const index = Math.max(0, Math.min(toIndex, target.length));
  target.splice(index, 0, updated);

  return next;
}

export function resolveDropTarget(
  columns: Record<TaskStatus, Task[]>,
  overId: string,
): { status: TaskStatus; index: number } | null {
  const columnStatus = parseColumnDropId(overId);
  if (columnStatus) {
    return { status: columnStatus, index: columns[columnStatus].length };
  }

  for (const status of KANBAN_COLUMN_ORDER) {
    const index = columns[status].findIndex((t) => t.id === overId);
    if (index >= 0) {
      return { status, index };
    }
  }
  return null;
}

export function tasksFromColumns(columns: Record<TaskStatus, Task[]>): Task[] {
  return KANBAN_COLUMN_ORDER.flatMap((status) => columns[status]);
}
