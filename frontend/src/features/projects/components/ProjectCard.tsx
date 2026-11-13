import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import ViewKanbanOutlinedIcon from '@mui/icons-material/ViewKanbanOutlined';
import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  Stack,
  Typography,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import type { Project } from '../types';
import { ProjectStatusChip } from './ProjectStatusChip';

function formatDate(value: string | null): string | null {
  if (!value) return null;
  return value.slice(0, 10);
}

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const due = formatDate(project.dueDate);

  return (
    <Card
      sx={{
        overflow: 'hidden',
        '&:hover': {
          transform: 'translateY(-3px)',
          boxShadow: (theme) =>
            theme.palette.mode === 'dark'
              ? '0 16px 36px rgba(0,0,0,0.35)'
              : '0 14px 32px rgba(15, 23, 42, 0.08)',
        },
      }}
    >
      <CardActionArea component={RouterLink} to={`/projects/${project.id}`} sx={{ p: 0 }}>
        <CardContent sx={{ p: 2.75 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="flex-start" gap={1.5}>
            <Box sx={{ minWidth: 0 }}>
              <Typography variant="h6" component="h2" fontWeight={700} sx={{ letterSpacing: '-0.02em' }}>
                {project.title}
              </Typography>
              {project.description ? (
                <Typography
                  color="text.secondary"
                  variant="body2"
                  sx={{
                    mt: 1,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    lineHeight: 1.5,
                  }}
                >
                  {project.description}
                </Typography>
              ) : null}
            </Box>
            <ProjectStatusChip status={project.status} />
          </Stack>
          {due ? (
            <Stack direction="row" spacing={0.75} alignItems="center" sx={{ mt: 2 }}>
              <CalendarTodayOutlinedIcon sx={{ fontSize: 14, color: 'text.disabled' }} />
              <Typography color="text.secondary" variant="caption" fontWeight={600}>
                Due {due}
              </Typography>
            </Stack>
          ) : null}
        </CardContent>
      </CardActionArea>
      <CardActions sx={{ px: 2.5, pb: 2, pt: 0 }}>
        <Button
          component={RouterLink}
          to={`/board?projectId=${project.id}`}
          size="small"
          startIcon={<ViewKanbanOutlinedIcon />}
        >
          Open board
        </Button>
      </CardActions>
    </Card>
  );
}
