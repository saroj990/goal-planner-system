import { describe, expect, it } from 'vitest';
import { getDueDatePresentation, getDueDateUrgency } from './taskDueDateStyle';

const noon = (iso: string) => new Date(`${iso}T12:00:00`);

describe('getDueDateUrgency', () => {
  it('returns none when due date is missing', () => {
    expect(getDueDateUrgency(null)).toBe('none');
  });

  it('returns overdue before today', () => {
    expect(getDueDateUrgency('2026-04-01', noon('2026-04-05'))).toBe('overdue');
  });

  it('returns dueSoon for today through two days out', () => {
    expect(getDueDateUrgency('2026-04-05', noon('2026-04-05'))).toBe('dueSoon');
    expect(getDueDateUrgency('2026-04-07', noon('2026-04-05'))).toBe('dueSoon');
  });

  it('returns onTrack when more than two days away', () => {
    expect(getDueDateUrgency('2026-04-10', noon('2026-04-05'))).toBe('onTrack');
  });
});

describe('getDueDatePresentation', () => {
  it('formats human labels', () => {
    expect(getDueDatePresentation('2026-04-05', { now: noon('2026-04-05') })?.label).toBe(
      'Due today',
    );
    expect(getDueDatePresentation('2026-04-06', { now: noon('2026-04-05') })?.label).toBe(
      'Due tomorrow',
    );
    expect(getDueDatePresentation('2026-04-03', { now: noon('2026-04-05') })?.label).toBe(
      'Overdue 2d',
    );
  });
});
