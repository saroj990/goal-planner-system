import AddIcon from '@mui/icons-material/Add';
import ViewKanbanOutlinedIcon from '@mui/icons-material/ViewKanbanOutlined';
import { Alert, Box, Button, CircularProgress, Stack, Typography } from '@mui/material';
import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { ConfirmDialog } from '../../../components/ConfirmDialog';
import { useTaskMutations } from '../hooks/useTaskMutations';
import { useTasksForGoal } from '../hooks/useTasks';
import type { Task } from '../types';
import { TaskFormDialog } from './TaskFormDialog';
import { TaskList } from './TaskList';

interface GoalTasksSectionProps {
  goalId: string;
}

export function GoalTasksSection({ goalId }: GoalTasksSectionProps) {
  const { data: tasks, isLoading, isError, error } = useTasksForGoal(goalId);
  const { create, update, remove } = useTaskMutations(goalId);
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
    <Box sx={{ mt: 3 }}>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        justifyContent="space-between"
        alignItems={{ xs: 'flex-start', sm: 'center' }}
        spacing={1.5}
        sx={{ mb: 2.5 }}
      >
        <Box>
          <Typography variant="h5" component="h2">Tasks</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25 }}>
            Tasks for this goal. Drag and status changes happen on the shared board.
          </Typography>
        </Box>
        <Stack direction="row" spacing={1}>
          <Button
            component={RouterLink}
            to="/board"
            size="small"
            variant="outlined"
            startIcon={<ViewKanbanOutlinedIcon />}
          >
            Open board
          </Button>
          <Button variant="contained" size="small" startIcon={<AddIcon />} onClick={openCreate}>
            Add task
          </Button>
        </Stack>
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
        <TaskList
          tasks={tasks ?? []}
          onEdit={openEdit}
          onDelete={(task) => setTaskToDelete(task)}
          onStatusChange={async (task, status) => {
            await update.mutateAsync({ taskId: task.id, input: { status } });
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

      <ConfirmDialog
        open={taskToDelete !== null}
        title="Delete task?"
        description={
          taskToDelete ? `"${taskToDelete.title}" will be permanently removed.` : ''
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
