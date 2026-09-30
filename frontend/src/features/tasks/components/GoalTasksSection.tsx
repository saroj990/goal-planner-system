import AddIcon from '@mui/icons-material/Add';
import { Alert, Box, Button, CircularProgress, Paper, Stack, Typography } from '@mui/material';
import { useState } from 'react';
import { ConfirmDialog } from '../../../components/ConfirmDialog';
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
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);

  const openCreate = () => {
    setEditing(null);
    setDialogOpen(true);
  };

  const openEdit = (task: Task) => {
    setEditing(task);
    setDialogOpen(true);
  };

  return (
    <Box id="task-board" sx={{ mt: 3, scrollMarginTop: 24 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2.5 }}>
        <Box>
          <Typography variant="h5" component="h2">Task board</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25 }}>
            Drag cards across To do, In progress, and Done.
          </Typography>
        </Box>
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
        <Alert severity="error">
          {error instanceof Error ? error.message : 'Failed to load tasks'}
        </Alert>
      )}

      {!isLoading && !isError && (
        <Paper sx={{ p: { xs: 1.5, md: 2.5 } }}>
          <KanbanBoard
            goalId={goalId}
            tasks={tasks ?? []}
            onEdit={openEdit}
            onDelete={(task) => setTaskToDelete(task)}
            onReorder={(payload) => {
              reorder.mutate(payload);
            }}
          />
        </Paper>
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

      <ConfirmDialog
        open={taskToDelete !== null}
        title="Delete task?"
        description={
          taskToDelete
            ? `"${taskToDelete.title}" will be permanently removed.`
            : ''
        }
        confirmLabel="Delete"
        destructive
        loading={remove.isPending}
        onCancel={() => setTaskToDelete(null)}
        onConfirm={async () => {
          if (!taskToDelete) return;
          await remove.mutateAsync(taskToDelete.id);
          setTaskToDelete(null);
        }}
      />
    </Box>
  );
}
