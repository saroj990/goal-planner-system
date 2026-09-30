import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { Box, IconButton, Paper, Stack, Typography } from '@mui/material';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Link as RouterLink } from 'react-router-dom';
import type { Task } from '../types';

interface KanbanTaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  isOverlay?: boolean;
}

export function KanbanTaskCard({ task, onEdit, onDelete, isOverlay }: KanbanTaskCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task.id,
    disabled: isOverlay,
  });

  const style = isOverlay
    ? undefined
    : {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.35 : 1,
      };

  if (isOverlay) {
    return (
      <Paper
        elevation={4}
        sx={{
          p: 1.75,
          cursor: 'grabbing',
          bgcolor: 'background.paper',
          border: '1px solid',
          borderColor: 'primary.light',
          boxShadow: '0 12px 32px rgba(15, 23, 42, 0.12)',
        }}
      >
        <Typography variant="body2" fontWeight={600}>{task.title}</Typography>
      </Paper>
    );
  }

  return (
    <Paper
      ref={setNodeRef}
      style={style}
      elevation={0}
      {...attributes}
      {...listeners}
      sx={{
        p: 1.75,
        cursor: 'grab',
        bgcolor: 'background.paper',
        border: '1px solid',
        borderColor: 'divider',
        touchAction: 'none',
        '&:active': { cursor: 'grabbing' },
      }}
    >
      <Stack direction="row" spacing={1} alignItems="flex-start">
        <Box sx={{ color: 'text.disabled', pt: 0.25 }} aria-hidden>
          <DragIndicatorIcon fontSize="small" />
        </Box>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography variant="body2" fontWeight={600} sx={{ wordBreak: 'break-word', lineHeight: 1.4 }}>
            {task.title}
          </Typography>
          {task.goalTitle && (
            <Typography
              component={RouterLink}
              to={`/goals/${task.goalId}`}
              variant="caption"
              color="text.secondary"
              onPointerDown={(e) => e.stopPropagation()}
              sx={{ mt: 0.25, display: 'block', textDecoration: 'none', '&:hover': { color: 'primary.main' } }}
            >
              {task.goalTitle}
            </Typography>
          )}
        </Box>
        <Stack direction="row" spacing={0} onPointerDown={(e) => e.stopPropagation()}>
          <IconButton size="small" aria-label="Edit task" onClick={() => onEdit(task)}>
            <EditOutlinedIcon sx={{ fontSize: 16 }} />
          </IconButton>
          <IconButton size="small" aria-label="Delete task" color="error" onClick={() => onDelete(task)}>
            <DeleteOutlineIcon sx={{ fontSize: 16 }} />
          </IconButton>
        </Stack>
      </Stack>
    </Paper>
  );
}
