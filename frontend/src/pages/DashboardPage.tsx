import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined';
import {
  Alert,
  Box,
  FormControl,
  InputLabel,
  LinearProgress,
  MenuItem,
  Select,
  Stack,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { radius } from '../app/theme';
import { PageHeader } from '../components/PageHeader';
import { PageLoader } from '../components/PageLoader';
import { SectionCard } from '../components/SectionCard';
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

  if (isLoading) return <PageLoader />;

  if (isError || !data) {
    return (
      <Alert severity="error">
        {error instanceof Error ? error.message : 'Failed to load dashboard'}
      </Alert>
    );
  }

  return (
    <Stack spacing={3}>
      <PageHeader
        eyebrow="Overview"
        title={greeting()}
        description={filterId ? 'Stats for the selected project.' : 'A calm snapshot across your projects and tasks.'}
        actions={
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
        }
      />

      <Box
        sx={{
          display: 'grid',
          gap: 2,
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' },
        }}
      >
        <MetricCard label="Projects done" value={`${data.projectsCompleted}/${data.projectsTotal}`} />
        <MetricCard label="Tasks done" value={`${data.tasksCompleted}/${data.tasksTotal}`} />
        <MetricCard label="Active projects" value={String(data.activeProjectsCount)} />
      </Box>

      <SectionCard title="Task completion" subtitle={`${data.completionPercent}% marked done in this view`}>
        <LinearProgress variant="determinate" value={data.completionPercent} sx={{ mb: 1 }} />
        <Typography variant="caption" color="text.secondary">
          Keep moving work through the board to raise this number.
        </Typography>
      </SectionCard>

      <Box
        sx={{
          display: 'grid',
          gap: 2,
          gridTemplateColumns: { xs: '1fr', md: data.overdueProjects.length > 0 ? '1.2fr 0.8fr' : '1fr' },
        }}
      >
        <SectionCard title="Active projects" subtitle="Jump into work that is still open">
          {data.activeProjects.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              No active projects in this view.
            </Typography>
          ) : (
            <Stack spacing={1}>
              {data.activeProjects.map((project) => (
                <Box
                  key={project.id}
                  component={RouterLink}
                  to={`/projects/${project.id}`}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.25,
                    px: 1.5,
                    py: 1.15,
                    borderRadius: `${radius.control}px`,
                    textDecoration: 'none',
                    color: 'inherit',
                    bgcolor: 'action.hover',
                    transition: 'background-color 0.15s ease, transform 0.15s ease',
                    '&:hover': {
                      bgcolor: 'action.selected',
                      transform: 'translateX(2px)',
                    },
                  }}
                >
                  <RadioButtonUncheckedIcon fontSize="small" color="primary" />
                  <Typography variant="body2" fontWeight={600} sx={{ flex: 1 }}>
                    {project.title}
                  </Typography>
                  <ArrowForwardIcon sx={{ fontSize: 16, color: 'text.disabled' }} />
                </Box>
              ))}
            </Stack>
          )}
        </SectionCard>

        {data.overdueProjects.length > 0 && (
          <SectionCard
            title="Overdue"
            subtitle="Needs attention"
            tone="danger"
            action={<WarningAmberOutlinedIcon color="error" fontSize="small" />}
          >
            <Stack spacing={1}>
              {data.overdueProjects.map((project) => (
                <Typography
                  key={project.id}
                  component={RouterLink}
                  to={`/projects/${project.id}`}
                  variant="body2"
                  fontWeight={600}
                  sx={{ textDecoration: 'none', color: 'error.main' }}
                >
                  {project.title}
                </Typography>
              ))}
            </Stack>
          </SectionCard>
        )}
      </Box>

      <SectionCard title="Tasks by status" subtitle="A quick scan of where work sits right now">
        <Box
          sx={{
            display: 'grid',
            gap: 2,
            gridTemplateColumns: { xs: '1fr 1fr', md: 'repeat(4, 1fr)' },
          }}
        >
          <TaskColumn title="To do" tasks={data.tasksByStatus.todo} />
          <TaskColumn title="In progress" tasks={data.tasksByStatus.inProgress} />
          <TaskColumn title="Blocked" tasks={data.tasksByStatus.blocked} />
          <TaskColumn title="Done" tasks={data.tasksByStatus.done} done />
        </Box>
      </SectionCard>
    </Stack>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <Box
      sx={{
        p: 2.5,
        borderRadius: `${radius.card}px`,
        border: '1px solid',
        borderColor: 'divider',
        bgcolor: 'background.paper',
        backgroundImage: (theme) =>
          theme.palette.mode === 'dark'
            ? 'linear-gradient(160deg, rgba(56,189,248,0.08), transparent 55%)'
            : 'linear-gradient(160deg, rgba(2,132,199,0.06), transparent 55%)',
      }}
    >
      <Typography variant="caption" color="text.secondary" fontWeight={600}>
        {label}
      </Typography>
      <Typography variant="h5" fontWeight={700} sx={{ mt: 0.75, letterSpacing: '-0.03em' }}>
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
    <Box
      sx={{
        p: 1.75,
        borderRadius: `${radius.card}px`,
        bgcolor: 'action.hover',
        minHeight: 140,
      }}
    >
      <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1.25 }}>
        {title}
        <Typography component="span" variant="caption" color="text.secondary" sx={{ ml: 0.75 }}>
          {tasks.length}
        </Typography>
      </Typography>
      <Stack spacing={0.75}>
        {tasks.length === 0 && (
          <Typography variant="caption" color="text.secondary">
            Empty
          </Typography>
        )}
        {tasks.slice(0, 5).map((t) => (
          <Stack key={t.id} direction="row" spacing={0.75} alignItems="flex-start">
            {done ? (
              <CheckCircleOutlineIcon sx={{ fontSize: 16, color: 'success.main', mt: 0.15 }} />
            ) : (
              <RadioButtonUncheckedIcon sx={{ fontSize: 16, color: 'text.disabled', mt: 0.15 }} />
            )}
            <Typography variant="body2" sx={{ lineHeight: 1.35 }}>
              {t.title}
            </Typography>
          </Stack>
        ))}
        {tasks.length > 5 ? (
          <Typography variant="caption" color="text.secondary">
            +{tasks.length - 5} more
          </Typography>
        ) : null}
      </Stack>
    </Box>
  );
}
