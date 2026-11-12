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
import { ConfirmDialog } from '../components/ConfirmDialog';
import { useProjectsList } from '../features/projects/hooks/useProjects';
import { ProjectStatus } from '../features/projects/types';
import { KanbanBoard } from '../features/tasks/components/KanbanBoard';
import { TaskFormDialog } from '../features/tasks/components/TaskFormDialog';
import { useBoardTaskMutations } from '../features/tasks/hooks/useBoardTaskMutations';
import { useAllTasks } from '../features/tasks/hooks/useTasks';
import type { Task } from '../features/tasks/types';

export function BoardPage() {
  const [boardProjectFilter, setBoardProjectFilter] = useState('');
  const filterId = boardProjectFilter || undefined;
  const { data: tasks, isLoading, isError, error } = useAllTasks(filterId);
  const { data: projects } = useProjectsList();
  const { create, update, remove, reorder } = useBoardTaskMutations();

  const activeProjects = useMemo(
    () => (projects ?? []).filter((p) => p.status === ProjectStatus.ACTIVE),
    [projects],
  );

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Task | null>(null);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
  const [createProjectId, setCreateProjectId] = useState('');

  const openCreate = () => {
    setEditing(null);
    setCreateProjectId(activeProjects[0]?.id ?? '');
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
          <Typography variant="h4" component="h1">
            Board
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Kanban for tasks across projects. Filter by project or see everything.
          </Typography>
        </Box>
        <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
          <FormControl size="small" sx={{ minWidth: 180 }}>
            <InputLabel id="board-filter-label">Show</InputLabel>
            <Select
              labelId="board-filter-label"
              label="Show"
              value={boardProjectFilter}
              onChange={(e) => setBoardProjectFilter(e.target.value)}
            >
              <MenuItem value="">All projects</MenuItem>
              {(projects ?? []).map((p) => (
                <MenuItem key={p.id} value={p.id}>
                  {p.title}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={openCreate}
            disabled={activeProjects.length === 0}
          >
            Add task
          </Button>
        </Stack>
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

      {!isLoading && !isError && activeProjects.length === 0 && (
        <Alert severity="info">Create an active project before adding tasks to the board.</Alert>
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
            if (!createProjectId) return;
            await create.mutateAsync({ projectId: createProjectId, input });
          }
        }}
        extraFields={
          !editing ? (
            <FormControl fullWidth required>
              <InputLabel id="board-project-label">Project</InputLabel>
              <Select
                labelId="board-project-label"
                label="Project"
                value={createProjectId}
                onChange={(e) => setCreateProjectId(e.target.value)}
              >
                {activeProjects.map((project) => (
                  <MenuItem key={project.id} value={project.id}>
                    {project.title}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          ) : null
        }
      />

      <ConfirmDialog
        open={taskToDelete !== null}
        title="Delete task?"
        description={taskToDelete ? `"${taskToDelete.title}" will be permanently removed.` : ''}
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
