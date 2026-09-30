import { Box, Paper, Stack, Typography } from '@mui/material';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { columnDropId } from '../kanban/kanbanModel';
import { TASK_STATUS_LABEL, taskStatusColors } from '../taskStatusStyle';
import { TaskStatus } from '../types';
import type { Task } from '../types';
import { KanbanTaskCard } from './KanbanTaskCard';

interface KanbanColumnProps {
  status: TaskStatus;
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

export function KanbanColumn({ status, tasks, onEdit, onDelete }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: columnDropId(status) });
  const { bg, color } = taskStatusColors(status);

  return (
    <Paper
      ref={setNodeRef}
      elevation={0}
      sx={{
        flex: '1 1 220px',
        minWidth: 220,
        p: 1.5,
        borderRadius: 3,
        bgcolor: isOver ? 'action.hover' : bg,
        border: '1px solid',
        borderColor: isOver ? 'primary.light' : 'divider',
        transition: 'background-color 0.15s ease, border-color 0.15s ease',
      }}
    >
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1.5, px: 0.5 }}>
        <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: color }} />
        <Typography variant="subtitle2" fontWeight={700} sx={{ color }}>
          {TASK_STATUS_LABEL[status]}
        </Typography>
        <Typography variant="caption" color="text.secondary">({tasks.length})</Typography>
      </Stack>

      <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
        <Stack spacing={1} sx={{ minHeight: 48 }}>
          {tasks.map((task) => (
            <KanbanTaskCard key={task.id} task={task} onEdit={onEdit} onDelete={onDelete} />
          ))}
        </Stack>
      </SortableContext>
    </Paper>
  );
}
