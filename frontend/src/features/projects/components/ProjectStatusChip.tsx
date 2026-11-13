import { Chip } from '@mui/material';
import { PROJECT_STATUS_LABEL, projectStatusColors } from '../projectStatusStyle';
import { ProjectStatus } from '../types';

interface ProjectStatusChipProps {
  status: ProjectStatus;
}

export function ProjectStatusChip({ status }: ProjectStatusChipProps) {
  const { bg, color } = projectStatusColors(status);
  return (
    <Chip
      size="small"
      label={PROJECT_STATUS_LABEL[status]}
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
