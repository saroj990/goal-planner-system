export type DueDateUrgency = 'none' | 'onTrack' | 'dueSoon' | 'overdue';

export interface DueDatePresentation {
  urgency: DueDateUrgency;
  label: string;
  color: string;
  bgcolor: string;
}

function startOfLocalDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

/** Parse API date (ISO or YYYY-MM-DD) as local calendar day. */
export function parseTaskDueDate(value: string): Date {
  const day = value.slice(0, 10);
  const [y, m, d] = day.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function getDueDateUrgency(dueDate: string | null, now = new Date()): DueDateUrgency {
  if (!dueDate) return 'none';

  const today = startOfLocalDay(now);
  const due = startOfLocalDay(parseTaskDueDate(dueDate));

  if (due < today) return 'overdue';

  const msPerDay = 24 * 60 * 60 * 1000;
  const daysUntil = Math.round((due.getTime() - today.getTime()) / msPerDay);

  if (daysUntil <= 2) return 'dueSoon';
  return 'onTrack';
}

function formatDueLabel(dueDate: string, now: Date): string {
  const today = startOfLocalDay(now);
  const due = startOfLocalDay(parseTaskDueDate(dueDate));
  const msPerDay = 24 * 60 * 60 * 1000;
  const daysUntil = Math.round((due.getTime() - today.getTime()) / msPerDay);

  if (daysUntil < 0) {
    const daysLate = Math.abs(daysUntil);
    return daysLate === 1 ? 'Overdue yesterday' : `Overdue ${daysLate}d`;
  }
  if (daysUntil === 0) return 'Due today';
  if (daysUntil === 1) return 'Due tomorrow';
  return `Due ${dueDate.slice(0, 10)}`;
}

const URGENCY_STYLES: Record<Exclude<DueDateUrgency, 'none'>, { color: string; bgcolor: string }> = {
  onTrack: { color: '#15803d', bgcolor: '#dcfce7' },
  dueSoon: { color: '#c2410c', bgcolor: '#ffedd5' },
  overdue: { color: '#b91c1c', bgcolor: '#fee2e2' },
};

const URGENCY_STYLES_DARK: Record<Exclude<DueDateUrgency, 'none'>, { color: string; bgcolor: string }> = {
  onTrack: { color: '#86efac', bgcolor: 'rgba(34, 197, 94, 0.18)' },
  dueSoon: { color: '#fdba74', bgcolor: 'rgba(249, 115, 22, 0.2)' },
  overdue: { color: '#fca5a5', bgcolor: 'rgba(239, 68, 68, 0.22)' },
};

export function getDueDatePresentation(
  dueDate: string | null,
  options?: { now?: Date; dark?: boolean },
): DueDatePresentation | null {
  const urgency = getDueDateUrgency(dueDate, options?.now);
  if (urgency === 'none' || !dueDate) return null;

  const palette = options?.dark ? URGENCY_STYLES_DARK : URGENCY_STYLES;
  const { color, bgcolor } = palette[urgency];

  return {
    urgency,
    label: formatDueLabel(dueDate, options?.now ?? new Date()),
    color,
    bgcolor,
  };
}
