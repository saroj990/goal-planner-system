import { Button, Stack, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

export function HomePage() {
  return (
    <Stack spacing={2}>
      <Typography component="h1" variant="h4">
        Goal Tracker
      </Typography>
      <Typography color="text.secondary">
        Personal goals and tasks. Manage daily, weekly, and monthly goals.
      </Typography>
      <Button component={RouterLink} to="/goals" variant="contained">
        View goals
      </Button>
    </Stack>
  );
}
