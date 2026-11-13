import { Button, Stack, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { SectionCard } from '../components/SectionCard';

export function HomePage() {
  return (
    <Stack spacing={3} sx={{ maxWidth: 560 }}>
      <Stack spacing={1}>
        <Typography
          variant="caption"
          color="primary"
          fontWeight={700}
          letterSpacing="0.04em"
          textTransform="uppercase"
        >
          Welcome
        </Typography>
        <Typography variant="h4" component="h1" sx={{ letterSpacing: '-0.03em' }}>
          Your projects, one calm place
        </Typography>
        <Typography color="text.secondary" sx={{ lineHeight: 1.6 }}>
          Create projects, add tasks with clear statuses, and track progress on the dashboard with a
          project filter.
        </Typography>
      </Stack>

      <SectionCard>
        <Stack spacing={2}>
          <Typography fontWeight={700}>Start with a project</Typography>
          <Typography variant="body2" color="text.secondary">
            Projects hold your tasks. From there you can organize work on the board and watch
            completion climb.
          </Typography>
          <Button
            component={RouterLink}
            to="/projects"
            variant="contained"
            size="large"
            sx={{ alignSelf: 'flex-start' }}
          >
            Open projects
          </Button>
        </Stack>
      </SectionCard>
    </Stack>
  );
}
