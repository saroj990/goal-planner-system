import {
  Alert,
  Box,
  CircularProgress,
  Paper,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { CompletionChart } from '../features/progress/components/CompletionChart';
import { useProgress } from '../features/progress/hooks/useProgress';

const RANGE_OPTIONS = [14, 30, 90] as const;

export function ProgressPage() {
  const [days, setDays] = useState<number>(30);
  const { data, isLoading, isError, error } = useProgress(days);

  return (
    <Stack spacing={3}>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        justifyContent="space-between"
        alignItems={{ xs: 'flex-start', sm: 'center' }}
        spacing={2}
      >
        <Box>
          <Typography variant="h4" component="h1">Progress</Typography>
          <Typography color="text.secondary" variant="body2" sx={{ mt: 0.5 }}>
            Completions over time by goal type and tasks.
          </Typography>
        </Box>
        <ToggleButtonGroup
          exclusive
          size="small"
          value={days}
          onChange={(_, value) => value != null && setDays(value)}
        >
          {RANGE_OPTIONS.map((n) => (
            <ToggleButton key={n} value={n}>{n}d</ToggleButton>
          ))}
        </ToggleButtonGroup>
      </Stack>

      {isLoading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
          <CircularProgress />
        </Box>
      )}

      {isError && (
        <Alert severity="error">
          {error instanceof Error ? error.message : 'Failed to load progress'}
        </Alert>
      )}

      {data && (
        <Paper sx={{ p: 2 }}>
          <CompletionChart days={data.days} />
        </Paper>
      )}
    </Stack>
  );
}
