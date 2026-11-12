import { describe, expect, it } from 'vitest';
import { TASK_PRIORITY_LABEL, taskPriorityColors } from './taskPriorityStyle';

describe('taskPriorityStyle', () => {
  it('maps priority labels and muted colors', () => {
    expect(TASK_PRIORITY_LABEL.URGENT).toBe('Urgent');
    expect(taskPriorityColors('HIGH')).toMatchObject({ bg: expect.any(String), color: expect.any(String) });
  });
});
