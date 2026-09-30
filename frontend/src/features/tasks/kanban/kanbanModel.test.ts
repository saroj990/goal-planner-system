import { describe, expect, it } from 'vitest';
import { TaskStatus } from '../types';
import type { Task } from '../types';
import {
  buildBoardReorderPayload,
  buildReorderPayload,
  columnDropId,
  dragOverColumns,
  groupTasksByStatus,
  moveTaskInColumns,
  resolveDropTarget,
} from './kanbanModel';

const baseTask = (overrides: Partial<Task>): Task => ({
  id: '1',
  goalId: 'g1',
  title: 'T',
  description: null,
  status: TaskStatus.TODO,
  priority: null,
  position: 100,
  dueDate: null,
  createdAt: '',
  updatedAt: '',
  completedAt: null,
  ...overrides,
});

describe('kanbanModel', () => {
  it('buildBoardReorderPayload assigns global board positions', () => {
    const columns = groupTasksByStatus([
      baseTask({ id: 'a', status: TaskStatus.TODO, position: 100 }),
      baseTask({ id: 'b', status: TaskStatus.DONE, position: 200 }),
    ]);
    const payload = buildBoardReorderPayload(columns);
    expect(payload.items).toEqual([
      { id: 'a', status: TaskStatus.TODO, position: 100 },
      { id: 'b', status: TaskStatus.DONE, position: 200 },
    ]);
  });

  it('buildReorderPayload assigns positions across columns', () => {
    const columns = groupTasksByStatus([
      baseTask({ id: 'a', status: TaskStatus.TODO, position: 100 }),
      baseTask({ id: 'b', status: TaskStatus.DONE, position: 200 }),
    ]);
    const payload = buildReorderPayload('g1', columns);
    expect(payload.items).toEqual([
      { id: 'a', status: TaskStatus.TODO, position: 100 },
      { id: 'b', status: TaskStatus.DONE, position: 200 },
    ]);
  });

  it('moveTaskInColumns changes status and index', () => {
    const columns = groupTasksByStatus([
      baseTask({ id: 'a', title: 'A' }),
      baseTask({ id: 'b', title: 'B', position: 200 }),
    ]);
    const next = moveTaskInColumns(columns, 'a', TaskStatus.IN_PROGRESS, 0);
    expect(next[TaskStatus.TODO].map((t) => t.id)).toEqual(['b']);
    expect(next[TaskStatus.IN_PROGRESS].map((t) => t.id)).toEqual(['a']);
    expect(next[TaskStatus.IN_PROGRESS][0].status).toBe(TaskStatus.IN_PROGRESS);
  });

  it('resolveDropTarget accepts empty column droppable id', () => {
    const columns = groupTasksByStatus([baseTask({ id: 'a' })]);
    expect(resolveDropTarget(columns, columnDropId(TaskStatus.DONE))).toEqual({
      status: TaskStatus.DONE,
      index: 0,
    });
  });

  it('dragOverColumns moves task into another column', () => {
    const columns = groupTasksByStatus([baseTask({ id: 'a', title: 'A' })]);
    const next = dragOverColumns(columns, 'a', columnDropId(TaskStatus.IN_PROGRESS));
    expect(next?.[TaskStatus.TODO]).toHaveLength(0);
    expect(next?.[TaskStatus.IN_PROGRESS].map((t) => t.id)).toEqual(['a']);
  });
});
