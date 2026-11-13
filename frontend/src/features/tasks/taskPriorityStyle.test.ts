import { describe, expect, it } from 'vitest';
import { TaskPriority } from './types';
import { TASK_PRIORITY_LABEL, taskPriorityColors } from './taskPriorityStyle';

describe('taskPriorityStyle', () => {
  it('maps priority labels and muted colors', () => {
    expect(TASK_PRIORITY_LABEL[TaskPriority.URGENT]).toBe('Urgent');
    expect(taskPriorityColors(TaskPriority.HIGH)).toMatchObject({
      bg: expect.any(String),
      color: expect.any(String),
    });
  });
});
