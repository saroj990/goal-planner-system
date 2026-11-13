import AddIcon from '@mui/icons-material/Add';
import FlagOutlinedIcon from '@mui/icons-material/FlagOutlined';
import { Alert, Button, Stack } from '@mui/material';
import { useState } from 'react';
import { EmptyState } from '../components/EmptyState';
import { PageHeader } from '../components/PageHeader';
import { PageLoader } from '../components/PageLoader';
import { ProjectCard } from '../features/projects/components/ProjectCard';
import { ProjectFormDialog } from '../features/projects/components/ProjectFormDialog';
import { useAuth } from '../features/auth/hooks/useAuth';
import { useProjectMutations } from '../features/projects/hooks/useProjectMutations';
import { useProjectsList } from '../features/projects/hooks/useProjects';

export function ProjectsPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN';
  const [dialogOpen, setDialogOpen] = useState(false);
  const { data: projects, isLoading, isError, error } = useProjectsList();
  const { create } = useProjectMutations();

  return (
    <Stack spacing={3}>
      <PageHeader
        eyebrow="Workspace"
        title="Projects"
        description={
          isAdmin
            ? 'Create projects and assign tasks to Saroj and Tejeshw.'
            : 'Projects that include tasks assigned to you.'
        }
        actions={
          isAdmin ? (
            <Button variant="contained" startIcon={<AddIcon />} onClick={() => setDialogOpen(true)}>
              New project
            </Button>
          ) : undefined
        }
      />

      {isLoading && <PageLoader />}

      {isError && (
        <Alert severity="error">
          {error instanceof Error ? error.message : 'Failed to load projects'}
        </Alert>
      )}

      {!isLoading && !isError && projects?.length === 0 && (
        <EmptyState
          icon={<FlagOutlinedIcon />}
          title="No projects yet"
          description={
            isAdmin
              ? 'Create a project, then assign tasks to Saroj or Tejeshw.'
              : 'When admin assigns you a task, the project will show up here.'
          }
          actionLabel={isAdmin ? 'New project' : undefined}
          onAction={isAdmin ? () => setDialogOpen(true) : undefined}
        />
      )}

      {!isLoading && !isError && (projects?.length ?? 0) > 0 && (
        <Stack spacing={2}>
          {projects?.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </Stack>
      )}

      <ProjectFormDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSubmit={async (input) => {
          await create.mutateAsync(input);
        }}
      />
    </Stack>
  );
}
