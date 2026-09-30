import { Button, Paper, Stack, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

export function HomePage() {
  return (
    <Paper sx={{ p: { xs: 3, sm: 5 }, textAlign: 'center' }}>
      <Stack spacing={2} alignItems="center">
        <Typography component="h1" variant="h4">
          Your goals, one calm place
        </Typography>
        <Typography color="text.secondary" sx={{ maxWidth: 420 }}>
          Plan daily, weekly, and monthly outcomes. Add tasks under each goal and track progress
          without the JIRA noise.
        </Typography>
        <Button component={RouterLink} to="/goals" variant="contained" size="large">
          Open goals
        </Button>
      </Stack>
    </Paper>
  );
}
