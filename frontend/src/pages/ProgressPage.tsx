import ShowChartOutlinedIcon from '@mui/icons-material/ShowChartOutlined';
import { Alert, Stack, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { useState } from 'react';
import { EmptyState } from '../components/EmptyState';
import { PageHeader } from '../components/PageHeader';
import { PageLoader } from '../components/PageLoader';
import { SectionCard } from '../components/SectionCard';
import { CompletionChart } from '../features/progress/components/CompletionChart';
import { useProgress } from '../features/progress/hooks/useProgress';

const RANGE_OPTIONS = [14, 30, 90] as const;

export function ProgressPage() {
  const [days, setDays] = useState<number>(30);
  const { data, isLoading, isError, error } = useProgress(days);

  const hasActivity = (data?.days ?? []).some((d) => d.projects > 0 || d.tasks > 0);

  return (
    <Stack spacing={3}>
      <PageHeader
        eyebrow="Analytics"
        title="Progress"
        description="Completed projects and tasks over the selected window."
        actions={
          <ToggleButtonGroup
            exclusive
            size="small"
            value={days}
            onChange={(_, value) => value != null && setDays(value)}
            aria-label="Progress range"
          >
            {RANGE_OPTIONS.map((n) => (
              <ToggleButton key={n} value={n}>
                {n}d
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        }
      />

      {isLoading && <PageLoader />}

      {isError && (
        <Alert severity="error">
          {error instanceof Error ? error.message : 'Failed to load progress'}
        </Alert>
      )}

      {data && !hasActivity && (
        <EmptyState
          icon={<ShowChartOutlinedIcon />}
          title="No completions yet"
          description="Finish a few tasks or projects and this chart will fill in over time."
          actionLabel="Open board"
          actionTo="/board"
        />
      )}

      {data && hasActivity && (
        <SectionCard title="Completion trend" subtitle={`Last ${days} days`}>
          <CompletionChart days={data.days} />
        </SectionCard>
      )}
    </Stack>
  );
}
