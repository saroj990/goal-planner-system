import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import {
  Alert,
  Box,
  Button,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { Link as RouterLink, useNavigate, useParams } from 'react-router-dom';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { PageLoader } from '../components/PageLoader';
import { SectionCard } from '../components/SectionCard';
import { useAuth } from '../features/auth/hooks/useAuth';
import { ProjectFormDialog } from '../features/projects/components/ProjectFormDialog';
import { ProjectStatusChip } from '../features/projects/components/ProjectStatusChip';
import { useProjectMutations } from '../features/projects/hooks/useProjectMutations';
import { useProject } from '../features/projects/hooks/useProjects';
import type { UpdateProjectInput } from '../features/projects/types';
import { ProjectTasksSection } from '../features/tasks/components/ProjectTasksSection';

export function ProjectDetailPage() {
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN';
  const { data: project, isLoading, isError, error } = useProject(id);
  const { update, remove } = useProjectMutations();
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  if (isLoading) return <PageLoader />;

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

      <SectionCard>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" gap={2}>
          <Box sx={{ minWidth: 0 }}>
            <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap sx={{ mb: 1.5 }}>
              <ProjectStatusChip status={project.status} />
              {project.dueDate ? (
                <Stack direction="row" spacing={0.5} alignItems="center">
                  <CalendarTodayOutlinedIcon sx={{ fontSize: 14, color: 'text.disabled' }} />
                  <Typography variant="caption" color="text.secondary" fontWeight={600}>
                    Due {project.dueDate.slice(0, 10)}
                  </Typography>
                </Stack>
              ) : null}
            </Stack>
            <Typography component="h1" variant="h4" sx={{ letterSpacing: '-0.03em' }}>
              {project.title}
            </Typography>
            {project.description ? (
              <Typography color="text.secondary" sx={{ mt: 1.25, maxWidth: 640, lineHeight: 1.6 }}>
                {project.description}
              </Typography>
            ) : null}
          </Box>
          {isAdmin ? (
            <Stack direction="row" spacing={0.5}>
              <Tooltip title="Edit project">
                <IconButton aria-label="Edit project" onClick={() => setEditOpen(true)}>
                  <EditOutlinedIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete project">
                <IconButton aria-label="Delete project" color="error" onClick={() => setDeleteOpen(true)}>
                  <DeleteOutlineIcon />
                </IconButton>
              </Tooltip>
            </Stack>
          ) : null}
        </Stack>
      </SectionCard>

      <Box sx={{ mt: 3 }}>
        <ProjectTasksSection projectId={project.id} />
      </Box>

      {isAdmin ? (
        <>
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
        </>
      ) : null}
    </Box>
  );
}
