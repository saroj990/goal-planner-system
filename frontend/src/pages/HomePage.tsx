import { Button, Stack, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

export function HomePage() {
  return (
    <Stack spacing={3} sx={{ maxWidth: 520 }}>
      <Typography variant="h4" component="h1">
        Your projects, one calm place
      </Typography>
      <Typography color="text.secondary">
        Create projects, add tasks with clear statuses, and track progress on the dashboard with a
        project filter.
      </Typography>
      <Button component={RouterLink} to="/projects" variant="contained" size="large">
        Open projects
      </Button>
    </Stack>
  );
}
