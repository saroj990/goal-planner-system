import { Box, Stack, Typography } from '@mui/material';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { alpha } from '@mui/material/styles';
import { radius } from '../../../app/theme';
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
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: 320,
        borderRadius: radius.surface,
        bgcolor: isOver ? alpha('#6366f1', 0.06) : 'transparent',
        outline: isOver ? `2px solid ${alpha('#6366f1', 0.35)}` : 'none',
        outlineOffset: 2,
        transition: 'background-color 0.15s ease, outline 0.15s ease',
      }}
    >
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1.5, px: 0.5 }}>
        <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: color, flexShrink: 0 }} />
        <Typography variant="subtitle2" fontWeight={700} sx={{ color: 'text.primary' }}>
          {TASK_STATUS_LABEL[status]}
        </Typography>
        <Box
          sx={{
            ml: 'auto',
            minWidth: 24,
            height: 24,
            px: 0.75,
            borderRadius: 999,
            bgcolor: bg,
            color,
            fontSize: 12,
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {tasks.length}
        </Box>
      </Stack>

      <Box
        ref={setNodeRef}
        sx={{
          flex: 1,
          p: 1.25,
          borderRadius: radius.control,
          bgcolor: alpha('#0f172a', 0.03),
          border: '1px solid',
          borderColor: alpha('#0f172a', 0.06),
        }}
      >
        <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
          <Stack spacing={1.25} sx={{ minHeight: 200 }}>
            {tasks.length === 0 && (
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ py: 4, textAlign: 'center', display: 'block' }}
              >
                Drop tasks here
              </Typography>
            )}
            {tasks.map((task) => (
              <KanbanTaskCard key={task.id} task={task} onEdit={onEdit} onDelete={onDelete} />
            ))}
          </Stack>
        </SortableContext>
      </Box>
    </Box>
  );
}
