import AddIcon from '@mui/icons-material/Add';
import { Alert, Box, Button, CircularProgress, Stack, Typography } from '@mui/material';
import { useState } from 'react';
import { useTaskMutations } from '../hooks/useTaskMutations';
import { useTasksForGoal } from '../hooks/useTasks';
import type { Task } from '../types';
import { KanbanBoard } from './KanbanBoard';
import { TaskFormDialog } from './TaskFormDialog';

interface GoalTasksSectionProps {
  goalId: string;
}

export function GoalTasksSection({ goalId }: GoalTasksSectionProps) {
  const { data: tasks, isLoading, isError, error } = useTasksForGoal(goalId);
  const { create, update, remove, reorder } = useTaskMutations(goalId);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Task | null>(null);

  const openCreate = () => {
    setEditing(null);
    setDialogOpen(true);
  };

  const openEdit = (task: Task) => {
    setEditing(task);
    setDialogOpen(true);
  };

  return (
    <Box sx={{ mt: 5 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Typography variant="h5" component="h2">Board</Typography>
        <Button variant="contained" size="small" startIcon={<AddIcon />} onClick={openCreate}>
          Add task
        </Button>
      </Stack>

      {isLoading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
          <CircularProgress size={28} />
        </Box>
      )}

      {isError && (
        <Alert severity="error" sx={{ borderRadius: 2 }}>
          {error instanceof Error ? error.message : 'Failed to load tasks'}
        </Alert>
      )}

      {!isLoading && !isError && (
        <KanbanBoard
          goalId={goalId}
          tasks={tasks ?? []}
          onEdit={openEdit}
          onDelete={async (task) => {
            if (!window.confirm(`Delete task "${task.title}"?`)) return;
            await remove.mutateAsync(task.id);
          }}
          onReorder={(payload) => {
            reorder.mutate(payload);
          }}
        />
      )}

      <TaskFormDialog
        open={dialogOpen}
        initial={editing}
        onClose={() => setDialogOpen(false)}
        onSubmit={async (input) => {
          if (editing) {
            await update.mutateAsync({ taskId: editing.id, input });
          } else {
            await create.mutateAsync(input);
          }
        }}
      />
    </Box>
  );
}
