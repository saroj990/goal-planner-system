import { Chip } from '@mui/material';
import { TASK_PRIORITY_LABEL, taskPriorityColors } from '../taskPriorityStyle';
import type { TaskPriority } from '../types';

interface TaskPriorityChipProps {
  priority: TaskPriority;
}

export function TaskPriorityChip({ priority }: TaskPriorityChipProps) {
  const { bg, color } = taskPriorityColors(priority);
  return (
    <Chip
      size="small"
      label={TASK_PRIORITY_LABEL[priority]}
      sx={{
        bgcolor: bg,
        color,
        fontWeight: 600,
        height: 24,
        '& .MuiChip-label': { px: 1, fontSize: '0.75rem' },
      }}
    />
  );
}
