import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { AppProviders } from '../../../app/providers';
import { TaskStatus } from '../types';
import { TaskStatusPicker } from './TaskStatusPicker';

describe('TaskStatusPicker', () => {
  it('opens menu and selects a status', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(
      <AppProviders>
        <TaskStatusPicker value={TaskStatus.TODO} onChange={onChange} />
      </AppProviders>,
    );

    await user.click(screen.getByRole('button', { name: /change task status/i }));
    expect(screen.getByRole('menu')).toBeInTheDocument();
    await user.click(screen.getByRole('menuitem', { name: /in progress/i }));
    expect(onChange).toHaveBeenCalledWith(TaskStatus.IN_PROGRESS);
  });
});
