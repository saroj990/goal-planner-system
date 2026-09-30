import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import {
  Alert,
  Box,
  CircularProgress,
  LinearProgress,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { useDashboard } from '../features/dashboard/hooks/useDashboard';

function greeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

export function DashboardPage() {
  const { data, isLoading, isError, error } = useDashboard();

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (isError || !data) {
    return (
      <Alert severity="error" sx={{ borderRadius: 2 }}>
        {error instanceof Error ? error.message : 'Failed to load dashboard'}
      </Alert>
    );
  }

  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h4" component="h1">{greeting()}</Typography>
        <Typography color="text.secondary" variant="body2" sx={{ mt: 0.5 }}>
          Here’s your progress for today.
        </Typography>
      </Box>

      <Paper sx={{ p: 3, borderRadius: 4 }}>
        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
          Today&apos;s progress
        </Typography>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} sx={{ mb: 2 }}>
          <Stat label="Goals" value={`${data.goalsCompleted} / ${data.goalsTotal}`} />
          <Stat label="Tasks" value={`${data.tasksCompleted} / ${data.tasksTotal}`} />
          <Stat label="Active goals" value={String(data.activeGoalsCount)} />
        </Stack>
        <LinearProgress
          variant="determinate"
          value={data.completionPercent}
          sx={{ height: 10, borderRadius: 5 }}
        />
        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
          {data.completionPercent}% complete (daily goals & tasks)
        </Typography>
      </Paper>

      <Paper sx={{ p: 3, borderRadius: 4 }}>
        <Typography variant="h6" gutterBottom>Today&apos;s goals</Typography>
        {data.todaysGoals.length === 0 ? (
          <Typography variant="body2" color="text.secondary">No active daily goals.</Typography>
        ) : (
          <Stack spacing={1}>
            {data.todaysGoals.map((goal) => (
              <Stack
                key={goal.id}
                direction="row"
                spacing={1}
                alignItems="center"
                component={RouterLink}
                to={`/goals/${goal.id}`}
                sx={{ textDecoration: 'none', color: 'inherit' }}
              >
                <RadioButtonUncheckedIcon fontSize="small" color="action" />
                <Typography variant="body2">{goal.title}</Typography>
              </Stack>
            ))}
          </Stack>
        )}
      </Paper>

      {data.overdueGoals.length > 0 && (
        <Paper sx={{ p: 3, borderRadius: 4, borderColor: 'error.light', border: 1 }}>
          <Typography variant="h6" color="error" gutterBottom>Overdue</Typography>
          <Stack spacing={1}>
            {data.overdueGoals.map((goal) => (
              <Typography
                key={goal.id}
                component={RouterLink}
                to={`/goals/${goal.id}`}
                variant="body2"
                sx={{ textDecoration: 'none', color: 'error.main' }}
              >
                {goal.title}
              </Typography>
            ))}
          </Stack>
        </Paper>
      )}

      <Paper sx={{ p: 3, borderRadius: 4 }}>
        <Typography variant="h6" gutterBottom>Today&apos;s tasks by status</Typography>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
          <TaskColumn title="To do" tasks={data.tasksByStatus.todo} />
          <TaskColumn title="In progress" tasks={data.tasksByStatus.inProgress} />
          <TaskColumn title="Done" tasks={data.tasksByStatus.done} done />
        </Stack>
      </Paper>
    </Stack>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <Box>
      <Typography variant="caption" color="text.secondary">{label}</Typography>
      <Typography variant="h6" fontWeight={700}>{value}</Typography>
    </Box>
  );
}

function TaskColumn({
  title,
  tasks,
  done,
}: {
  title: string;
  tasks: { id: string; title: string }[];
  done?: boolean;
}) {
  return (
    <Box sx={{ flex: 1, minWidth: 160 }}>
      <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1 }}>{title}</Typography>
      <Stack spacing={0.5}>
        {tasks.length === 0 && (
          <Typography variant="caption" color="text.secondary">—</Typography>
        )}
        {tasks.map((t) => (
          <Stack key={t.id} direction="row" spacing={0.5} alignItems="center">
            {done ? (
              <CheckCircleOutlineIcon sx={{ fontSize: 16, color: 'success.main' }} />
            ) : (
              <RadioButtonUncheckedIcon sx={{ fontSize: 16, color: 'text.disabled' }} />
            )}
            <Typography variant="body2">{t.title}</Typography>
          </Stack>
        ))}
      </Stack>
    </Box>
  );
}
