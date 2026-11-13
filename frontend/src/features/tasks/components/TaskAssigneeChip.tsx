import PersonOffOutlinedIcon from '@mui/icons-material/PersonOffOutlined';
import { Avatar, Chip } from '@mui/material';
import { initialsFromName } from '../../users/userDisplay';
import type { TaskAssigneeSummary } from '../types';

interface TaskAssigneeChipProps {
  assignee: TaskAssigneeSummary | null;
}

export function TaskAssigneeChip({ assignee }: TaskAssigneeChipProps) {
  if (!assignee) {
    return (
      <Chip
        size="small"
        icon={<PersonOffOutlinedIcon sx={{ fontSize: '14px !important' }} />}
        label="Unassigned"
        sx={{
          bgcolor: 'action.hover',
          color: 'text.secondary',
          fontWeight: 600,
          height: 24,
          border: '1px solid',
          borderColor: 'divider',
          '& .MuiChip-label': { px: 0.75, fontSize: '0.75rem' },
          '& .MuiChip-icon': { color: 'text.disabled', ml: 0.75 },
        }}
      />
    );
  }

  return (
    <Chip
      size="small"
      avatar={
        <Avatar
          sx={{
            width: 22,
            height: 22,
            fontSize: '0.65rem',
            fontWeight: 700,
            bgcolor: 'primary.main',
            color: 'primary.contrastText',
          }}
        >
          {initialsFromName(assignee.name)}
        </Avatar>
      }
      label={assignee.name}
      sx={{
        bgcolor: 'action.hover',
        color: 'text.primary',
        fontWeight: 600,
        height: 24,
        border: '1px solid',
        borderColor: 'divider',
        '& .MuiChip-label': { px: 0.75, fontSize: '0.75rem' },
      }}
    />
  );
}
