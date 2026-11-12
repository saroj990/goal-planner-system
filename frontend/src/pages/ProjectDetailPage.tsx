import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  IconButton,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { Link as RouterLink, useNavigate, useParams } from 'react-router-dom';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { ProjectFormDialog } from '../features/projects/components/ProjectFormDialog';
import { useProjectMutations } from '../features/projects/hooks/useProjectMutations';
import { useProject } from '../features/projects/hooks/useProjects';
import type { UpdateProjectInput } from '../features/projects/types';
import { ProjectTasksSection } from '../features/tasks/components/ProjectTasksSection';

export function ProjectDetailPage() {
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const { data: project, isLoading, isError, error } = useProject(id);
  const { update, remove } = useProjectMutations();
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (isError || !project) {
    return (
      <Alert severity="error">
        {error instanceof Error ? error.message : 'Project not found'}
      </Alert>
    );
  }

  return (
    <Box>
      <Button
        component={RouterLink}
        to="/projects"
        startIcon={<ArrowBackIcon />}
        color="inherit"
        sx={{ mb: 2, color: 'text.secondary' }}
      >
        Projects
      </Button>

      <Paper sx={{ p: 3, mb: 2 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" gap={2}>
          <Box>
            <Typography component="h1" variant="h4" gutterBottom>
              {project.title}
            </Typography>
            <Chip label={project.status} size="small" variant="outlined" sx={{ mb: 2 }} />
            {project.description && (
              <Typography color="text.secondary" sx={{ maxWidth: 560 }}>
                {project.description}
              </Typography>
            )}
            {project.dueDate && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1.5 }}>
                Due {project.dueDate.slice(0, 10)}
              </Typography>
            )}
          </Box>
          <Stack direction="row" spacing={0.5}>
            <IconButton aria-label="Edit project" onClick={() => setEditOpen(true)}>
              <EditOutlinedIcon />
            </IconButton>
            <IconButton aria-label="Delete project" color="error" onClick={() => setDeleteOpen(true)}>
              <DeleteOutlineIcon />
            </IconButton>
          </Stack>
        </Stack>
      </Paper>

      <ProjectTasksSection projectId={project.id} />

      <ProjectFormDialog
        open={editOpen}
        initial={project}
        onClose={() => setEditOpen(false)}
        onSubmit={async (input) => {
          await update.mutateAsync({ id: project.id, input: input as UpdateProjectInput });
        }}
      />

      <ConfirmDialog
        open={deleteOpen}
        title="Delete project?"
        description={`"${project.title}" and all of its tasks will be permanently removed.`}
        confirmLabel="Delete"
        destructive
        loading={remove.isPending}
        onCancel={() => setDeleteOpen(false)}
        onConfirm={async () => {
          await remove.mutateAsync(project.id);
          setDeleteOpen(false);
          navigate('/projects');
        }}
      />
    </Box>
  );
}
