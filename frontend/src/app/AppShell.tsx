import { Container, Typography } from '@mui/material';

export function AppShell() {
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography component="h1" variant="h4" gutterBottom>
        Goal Tracker
      </Typography>
      <Typography color="text.secondary" variant="body1">
        Personal goals and tasks — foundation shell (Step 1).
      </Typography>
    </Container>
  );
}
