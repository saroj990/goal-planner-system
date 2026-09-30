import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { TaskStatusChip } from './TaskStatusChip';
import { TaskStatus } from '../types';

describe('TaskStatusChip', () => {
  it('shows human-readable status label', () => {
    render(<TaskStatusChip status={TaskStatus.IN_PROGRESS} />);
    expect(screen.getByText('In progress')).toBeInTheDocument();
  });
});
