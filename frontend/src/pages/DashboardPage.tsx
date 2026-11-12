import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import {
  Alert,
  Box,
  CircularProgress,
  FormControl,
  InputLabel,
  LinearProgress,
  MenuItem,
  Paper,
  Select,
  Stack,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useDashboard } from '../features/dashboard/hooks/useDashboard';
import { useProjectsList } from '../features/projects/hooks/useProjects';

function greeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

export function DashboardPage() {
  const [projectId, setProjectId] = useState('');
  const filterId = projectId || undefined;
  const { data: projects } = useProjectsList();
  const { data, isLoading, isError, error } = useDashboard(filterId);

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (isError || !data) {
    return (
      <Alert severity="error">
        {error instanceof Error ? error.message : 'Failed to load dashboard'}
      </Alert>
    );
  }

  return (
    <Stack spacing={3}>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        justifyContent="space-between"
        alignItems={{ xs: 'stretch', sm: 'flex-start' }}
        spacing={2}
      >
        <Box>
          <Typography variant="h4" component="h1">
            {greeting()}
          </Typography>
          <Typography color="text.secondary" variant="body2" sx={{ mt: 0.5 }}>
            {filterId ? 'Stats for the selected project' : 'Overview across all projects'}
          </Typography>
        </Box>
        <FormControl size="small" sx={{ minWidth: 220 }}>
          <InputLabel id="dashboard-project-filter">Project</InputLabel>
          <Select
            labelId="dashboard-project-filter"
            label="Project"
            value={projectId}
            onChange={(e) => setProjectId(e.target.value)}
          >
            <MenuItem value="">All projects</MenuItem>
            {(projects ?? []).map((p) => (
              <MenuItem key={p.id} value={p.id}>
                {p.title}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Stack>

      <Paper sx={{ p: 3 }}>
        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
          Task completion
        </Typography>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} sx={{ mb: 2 }}>
          <Stat label="Projects" value={`${data.projectsCompleted} / ${data.projectsTotal}`} />
          <Stat label="Tasks done" value={`${data.tasksCompleted} / ${data.tasksTotal}`} />
          <Stat label="Active projects" value={String(data.activeProjectsCount)} />
        </Stack>
        <LinearProgress
          variant="determinate"
          value={data.completionPercent}
          sx={{ height: 8, borderRadius: '4px' }}
        />
        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
          {data.completionPercent}% of tasks marked done in this view
        </Typography>
      </Paper>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Active projects
        </Typography>
        {data.activeProjects.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            No active projects in this view.
          </Typography>
        ) : (
          <Stack spacing={1}>
            {data.activeProjects.map((project) => (
              <Stack
                key={project.id}
                direction="row"
                spacing={1}
                alignItems="center"
                component={RouterLink}
                to={`/projects/${project.id}`}
                sx={{ textDecoration: 'none', color: 'inherit' }}
              >
                <RadioButtonUncheckedIcon fontSize="small" color="action" />
                <Typography variant="body2">{project.title}</Typography>
              </Stack>
            ))}
          </Stack>
        )}
      </Paper>

      {data.overdueProjects.length > 0 && (
        <Paper sx={{ p: 3, borderColor: 'error.light', border: 1 }}>
          <Typography variant="h6" color="error" gutterBottom>
            Overdue projects
          </Typography>
          <Stack spacing={1}>
            {data.overdueProjects.map((project) => (
              <Typography
                key={project.id}
                component={RouterLink}
                to={`/projects/${project.id}`}
                variant="body2"
                sx={{ textDecoration: 'none', color: 'error.main' }}
              >
                {project.title}
              </Typography>
            ))}
          </Stack>
        </Paper>
      )}

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Tasks by status
        </Typography>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
          <TaskColumn title="To do" tasks={data.tasksByStatus.todo} />
          <TaskColumn title="In progress" tasks={data.tasksByStatus.inProgress} />
          <TaskColumn title="Blocked" tasks={data.tasksByStatus.blocked} />
          <TaskColumn title="Done" tasks={data.tasksByStatus.done} done />
        </Stack>
      </Paper>
    </Stack>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <Box>
      <Typography variant="caption" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="h6" fontWeight={700}>
        {value}
      </Typography>
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
      <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1 }}>
        {title}
      </Typography>
      <Stack spacing={0.5}>
        {tasks.length === 0 && (
          <Typography variant="caption" color="text.secondary">
            —
          </Typography>
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
