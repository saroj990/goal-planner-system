import AddIcon from '@mui/icons-material/Add';
import ViewKanbanOutlinedIcon from '@mui/icons-material/ViewKanbanOutlined';
import { Alert, Box, Button, CircularProgress, Stack, Typography } from '@mui/material';
import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { ConfirmDialog } from '../../../components/ConfirmDialog';
import { useAuth } from '../../auth/hooks/useAuth';
import { useTaskMutations } from '../hooks/useTaskMutations';
import { useTasksForProject } from '../hooks/useTasks';
import type { Task } from '../types';
import { TaskFormDialog } from './TaskFormDialog';
import { TaskList } from './TaskList';

interface ProjectTasksSectionProps {
  projectId: string;
}

export function ProjectTasksSection({ projectId }: ProjectTasksSectionProps) {
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN';
  const { data: tasks, isLoading, isError, error } = useTasksForProject(projectId);
  const { create, update, remove } = useTaskMutations(projectId);
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
    <Box>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        justifyContent="space-between"
        alignItems={{ xs: 'flex-start', sm: 'center' }}
        spacing={1.5}
        sx={{ mb: 2.5 }}
      >
        <Box>
          <Typography variant="h5" component="h2" sx={{ letterSpacing: '-0.02em' }}>
            Tasks
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, maxWidth: 480 }}>
            {isAdmin
              ? 'Assign tasks to Saroj or Tejeshw. Status and drag-and-drop live on the board.'
              : 'Your assigned tasks for this project. Update status here or on the board.'}
          </Typography>
        </Box>
        <Stack direction="row" spacing={1}>
          <Button
            component={RouterLink}
            to={`/board?projectId=${projectId}`}
            size="small"
            variant="outlined"
            startIcon={<ViewKanbanOutlinedIcon />}
          >
            Open board
          </Button>
          {isAdmin ? (
            <Button variant="contained" size="small" startIcon={<AddIcon />} onClick={openCreate}>
              Add task
            </Button>
          ) : null}
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
          onEdit={isAdmin ? openEdit : () => undefined}
          onDelete={isAdmin ? (task) => setTaskToDelete(task) : () => undefined}
          canManage={isAdmin}
          onStatusChange={async (task, status) => {
            await update.mutateAsync({ taskId: task.id, input: { status } });
          }}
        />
      )}

      {isAdmin ? (
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
      ) : null}

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
