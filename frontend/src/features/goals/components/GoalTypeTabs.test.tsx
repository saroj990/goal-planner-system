import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { GoalType } from '../types';
import { GoalTypeTabs } from './GoalTypeTabs';

describe('GoalTypeTabs', () => {
  it('renders daily, weekly, and monthly tabs and notifies on change', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<GoalTypeTabs value={GoalType.DAILY} onChange={onChange} />);

    expect(screen.getByRole('tab', { name: /daily/i })).toHaveAttribute('aria-selected', 'true');

    await user.click(screen.getByRole('tab', { name: /weekly/i }));
    expect(onChange).toHaveBeenCalledWith(GoalType.WEEKLY);
  });
});
