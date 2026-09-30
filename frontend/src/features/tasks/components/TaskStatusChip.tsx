import { Chip } from '@mui/material';
import { TASK_STATUS_LABEL, taskStatusColors } from '../taskStatusStyle';
import { TaskStatus } from '../types';

interface TaskStatusChipProps {
  status: TaskStatus;
  onClick?: () => void;
}

export function TaskStatusChip({ status, onClick }: TaskStatusChipProps) {
  const { bg, color } = taskStatusColors(status);
  return (
    <Chip
      size="small"
      label={TASK_STATUS_LABEL[status]}
      onClick={onClick}
      sx={{
        bgcolor: bg,
        color,
        fontWeight: 600,
        '& .MuiChip-label': { px: 1 },
      }}
    />
  );
}
