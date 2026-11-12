import AddIcon from '@mui/icons-material/Add';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Stack,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { ProjectCard } from '../features/projects/components/ProjectCard';
import { ProjectFormDialog } from '../features/projects/components/ProjectFormDialog';
import { useProjectMutations } from '../features/projects/hooks/useProjectMutations';
import { useProjectsList } from '../features/projects/hooks/useProjects';

export function ProjectsPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { data: projects, isLoading, isError, error } = useProjectsList();
  const { create } = useProjectMutations();

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Box>
          <Typography component="h1" variant="h4">
            Projects
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Organize work into projects; each project has tasks with statuses on the board.
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setDialogOpen(true)}>
          New project
        </Button>
      </Stack>

      {isLoading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {isError && (
        <Alert severity="error">
          {error instanceof Error ? error.message : 'Failed to load projects'}
        </Alert>
      )}

      {!isLoading && !isError && (
        <Stack spacing={2}>
          {projects?.length === 0 && (
            <Alert severity="info">Create a project, then add tasks from the project page or board.</Alert>
          )}
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
    </Box>
  );
}
