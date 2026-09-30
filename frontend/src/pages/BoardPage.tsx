import AddIcon from '@mui/icons-material/Add';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Typography,
} from '@mui/material';
import { useMemo, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { useGoalsList } from '../features/goals/hooks/useGoals';
import { GoalStatus } from '../features/goals/types';
import { KanbanBoard } from '../features/tasks/components/KanbanBoard';
import { TaskFormDialog } from '../features/tasks/components/TaskFormDialog';
import { useBoardTaskMutations } from '../features/tasks/hooks/useBoardTaskMutations';
import { useAllTasks } from '../features/tasks/hooks/useTasks';
import type { Task } from '../features/tasks/types';

export function BoardPage() {
  const { data: tasks, isLoading, isError, error } = useAllTasks();
  const { data: goals } = useGoalsList();
  const { create, update, remove, reorder } = useBoardTaskMutations();

  const activeGoals = useMemo(
    () => (goals ?? []).filter((g) => g.status === GoalStatus.ACTIVE),
    [goals],
  );

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Task | null>(null);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
  const [createGoalId, setCreateGoalId] = useState('');

  const openCreate = () => {
    setEditing(null);
    setCreateGoalId(activeGoals[0]?.id ?? '');
    setDialogOpen(true);
  };

  const openEdit = (task: Task) => {
    setEditing(task);
    setDialogOpen(true);
  };

  return (
    <Stack spacing={3}>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        justifyContent="space-between"
        alignItems={{ xs: 'flex-start', sm: 'center' }}
        spacing={2}
      >
        <Box>
          <Typography variant="h4" component="h1">Board</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            One workspace for every task across your goals. Add tasks from any active goal.
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={openCreate}
          disabled={activeGoals.length === 0}
        >
          Add task
        </Button>
      </Stack>

      {isLoading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
          <CircularProgress />
        </Box>
      )}

      {isError && (
        <Alert severity="error">
          {error instanceof Error ? error.message : 'Failed to load board'}
        </Alert>
      )}

      {!isLoading && !isError && activeGoals.length === 0 && (
        <Alert severity="info">
          Create an active goal before adding tasks to the board.
        </Alert>
      )}

      {!isLoading && !isError && (
        <KanbanBoard
          tasks={tasks ?? []}
          onEdit={openEdit}
          onDelete={(task) => setTaskToDelete(task)}
          onReorder={(payload) => reorder.mutate(payload)}
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
            if (!createGoalId) return;
            await create.mutateAsync({ goalId: createGoalId, input });
          }
        }}
        extraFields={
          !editing ? (
            <FormControl fullWidth required>
              <InputLabel id="board-goal-label">Goal</InputLabel>
              <Select
                labelId="board-goal-label"
                label="Goal"
                value={createGoalId}
                onChange={(e) => setCreateGoalId(e.target.value)}
              >
                {activeGoals.map((goal) => (
                  <MenuItem key={goal.id} value={goal.id}>{goal.title}</MenuItem>
                ))}
              </Select>
            </FormControl>
          ) : null
        }
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
    </Stack>
  );
}
