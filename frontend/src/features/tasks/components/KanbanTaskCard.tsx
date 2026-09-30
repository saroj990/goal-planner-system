import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { Box, IconButton, Paper, Stack, Typography } from '@mui/material';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Task } from '../types';

interface KanbanTaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

export function KanbanTaskCard({ task, onEdit, onDelete }: KanbanTaskCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <Paper
      ref={setNodeRef}
      style={style}
      elevation={0}
      sx={{
        p: 1.5,
        borderRadius: 2.5,
        cursor: 'grab',
        bgcolor: 'background.paper',
        '&:active': { cursor: 'grabbing' },
      }}
    >
      <Stack direction="row" spacing={1} alignItems="flex-start">
        <Box {...attributes} {...listeners} sx={{ color: 'text.disabled', pt: 0.25, touchAction: 'none' }}>
          <DragIndicatorIcon fontSize="small" />
        </Box>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography variant="body2" fontWeight={600} sx={{ wordBreak: 'break-word' }}>
            {task.title}
          </Typography>
        </Box>
        <Stack direction="row" spacing={0}>
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
