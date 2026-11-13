import AddIcon from '@mui/icons-material/Add';
import ViewKanbanOutlinedIcon from '@mui/icons-material/ViewKanbanOutlined';
import {
  Alert,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
} from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { EmptyState } from '../components/EmptyState';
import { PageHeader } from '../components/PageHeader';
import { PageLoader } from '../components/PageLoader';
import { useAuth } from '../features/auth/hooks/useAuth';
import { useProjectsList } from '../features/projects/hooks/useProjects';
import { ProjectStatus } from '../features/projects/types';
import { KanbanBoard } from '../features/tasks/components/KanbanBoard';
import { TaskFormDialog } from '../features/tasks/components/TaskFormDialog';
import { useBoardTaskMutations } from '../features/tasks/hooks/useBoardTaskMutations';
import { useAllTasks } from '../features/tasks/hooks/useTasks';
import type { Task } from '../features/tasks/types';
import { useAssignableUsers } from '../features/users/hooks/useAssignableUsers';

export function BoardPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN';
  const [searchParams, setSearchParams] = useSearchParams();
  const initialFilter = searchParams.get('projectId') ?? '';
  const initialAssignee = searchParams.get('assigneeId') ?? '';
  const [boardProjectFilter, setBoardProjectFilter] = useState(initialFilter);
  const [assigneeFilter, setAssigneeFilter] = useState(initialAssignee);
  const { data: assignableUsers } = useAssignableUsers();
  const { data: tasks, isLoading, isError, error } = useAllTasks({
    projectId: boardProjectFilter || undefined,
    assigneeId: isAdmin ? assigneeFilter || undefined : undefined,
  });
  const { data: projects } = useProjectsList();
  const { create, update, remove, reorder } = useBoardTaskMutations();

  useEffect(() => {
    const next: Record<string, string> = {};
    if (boardProjectFilter) next.projectId = boardProjectFilter;
    if (isAdmin && assigneeFilter) next.assigneeId = assigneeFilter;
    setSearchParams(next, { replace: true });
  }, [boardProjectFilter, assigneeFilter, isAdmin, setSearchParams]);

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
    setCreateProjectId(boardProjectFilter || activeProjects[0]?.id || '');
    setDialogOpen(true);
  };

  const openEdit = (task: Task) => {
    setEditing(task);
    setDialogOpen(true);
  };

  return (
    <Stack spacing={3}>
      <PageHeader
        eyebrow="Execution"
        title="Board"
        description={
          isAdmin
            ? 'Assign and track work for Saroj and Tejeshw. Filter by project or assignee.'
            : 'Your assigned tasks across projects. Drag to update status.'
        }
        actions={
          <>
            <FormControl size="small" sx={{ minWidth: 160 }}>
              <InputLabel id="board-filter-label">Project</InputLabel>
              <Select
                labelId="board-filter-label"
                label="Project"
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
            {isAdmin ? (
              <FormControl size="small" sx={{ minWidth: 160 }}>
                <InputLabel id="board-assignee-label">Assignee</InputLabel>
                <Select
                  labelId="board-assignee-label"
                  label="Assignee"
                  value={assigneeFilter}
                  onChange={(e) => setAssigneeFilter(e.target.value)}
                >
                  <MenuItem value="">Everyone</MenuItem>
                  {(assignableUsers ?? []).map((u) => (
                    <MenuItem key={u.id} value={u.id}>
                      {u.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            ) : null}
            {isAdmin ? (
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={openCreate}
                disabled={activeProjects.length === 0}
              >
                Add task
              </Button>
            ) : null}
          </>
        }
      />

      {isLoading && <PageLoader />}

      {isError && (
        <Alert severity="error">
          {error instanceof Error ? error.message : 'Failed to load board'}
        </Alert>
      )}

      {!isLoading && !isError && isAdmin && activeProjects.length === 0 && (
        <EmptyState
          icon={<ViewKanbanOutlinedIcon />}
          title="No active projects"
          description="Create an active project before adding tasks to the board."
          actionLabel="Go to projects"
          actionTo="/projects"
        />
      )}

      {!isLoading && !isError && (!isAdmin || activeProjects.length > 0) && (
        <KanbanBoard
          tasks={tasks ?? []}
          onEdit={openEdit}
          onDelete={(task) => setTaskToDelete(task)}
          onReorder={(payload) => reorder.mutate(payload)}
          canManage={isAdmin}
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
      ) : null}

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
