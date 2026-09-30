import { Box, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { getDueDatePresentation } from '../taskDueDateStyle';

interface TaskDueDateBadgeProps {
  dueDate: string | null;
}

export function TaskDueDateBadge({ dueDate }: TaskDueDateBadgeProps) {
  const theme = useTheme();
  const presentation = getDueDatePresentation(dueDate, { dark: theme.palette.mode === 'dark' });

  if (!presentation) return null;

  return (
    <Box
      component="span"
      sx={{
        display: 'inline-block',
        mt: 0.75,
        px: 0.75,
        py: 0.15,
        borderRadius: `${6}px`,
        bgcolor: presentation.bgcolor,
        color: presentation.color,
        fontSize: 11,
        fontWeight: 600,
        lineHeight: 1.4,
      }}
    >
      <Typography component="span" variant="caption" sx={{ color: 'inherit', fontWeight: 600 }}>
        {presentation.label}
      </Typography>
    </Box>
  );
}
