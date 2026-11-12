import { alpha, Chip, Stack, Typography } from '@mui/material';
import { TASK_PRIORITY_LABEL, TASK_PRIORITY_ORDER, taskPriorityColors } from '../taskPriorityStyle';
import type { TaskPriority } from '../types';

interface TaskPriorityPickerProps {
  value: TaskPriority;
  onChange: (priority: TaskPriority) => void;
}

export function TaskPriorityPicker({ value, onChange }: TaskPriorityPickerProps) {
  return (
    <Stack spacing={1}>
      <Typography variant="caption" color="text.secondary" fontWeight={600} letterSpacing="0.02em">
        Priority
      </Typography>
      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap role="radiogroup" aria-label="Task priority">
        {TASK_PRIORITY_ORDER.map((p) => {
          const { bg, color } = taskPriorityColors(p);
          const selected = value === p;
          return (
            <Chip
              key={p}
              role="radio"
              aria-checked={selected}
              tabIndex={0}
              label={TASK_PRIORITY_LABEL[p]}
              onClick={() => onChange(p)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onChange(p);
                }
              }}
              sx={{
                bgcolor: selected ? bg : 'background.paper',
                color: selected ? color : 'text.secondary',
                fontWeight: 600,
                border: '1px solid',
                borderColor: selected ? alpha(color, 0.35) : 'divider',
                cursor: 'pointer',
                transition: 'border-color 0.15s ease, background-color 0.15s ease',
                '&:hover': {
                  bgcolor: selected ? bg : alpha(bg, 0.5),
                  borderColor: alpha(color, 0.4),
                },
                '& .MuiChip-label': { px: 1.25 },
              }}
            />
          );
        })}
      </Stack>
    </Stack>
  );
}
