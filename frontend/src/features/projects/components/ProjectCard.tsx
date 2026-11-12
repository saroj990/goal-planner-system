import ViewKanbanOutlinedIcon from '@mui/icons-material/ViewKanbanOutlined';
import {
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  Chip,
  Stack,
  Typography,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import type { Project } from '../types';

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
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 8px 24px rgba(15, 23, 42, 0.08)',
        },
      }}
    >
      <CardActionArea component={RouterLink} to={`/projects/${project.id}`} sx={{ p: 0.5 }}>
        <CardContent>
          <Stack direction="row" justifyContent="space-between" alignItems="flex-start" gap={1}>
            <Typography variant="h6" component="h2" fontWeight={600}>
              {project.title}
            </Typography>
            <Chip label={project.status} size="small" variant="outlined" />
          </Stack>
          {project.description ? (
            <Typography color="text.secondary" variant="body2" sx={{ mt: 1 }}>
              {project.description}
            </Typography>
          ) : null}
          {due ? (
            <Typography color="text.secondary" variant="caption" sx={{ mt: 0.5, display: 'block' }}>
              Due {due}
            </Typography>
          ) : null}
        </CardContent>
      </CardActionArea>
      <CardActions sx={{ px: 2, pb: 2, pt: 0 }}>
        <Button component={RouterLink} to="/board" size="small" startIcon={<ViewKanbanOutlinedIcon />}>
          Board
        </Button>
      </CardActions>
    </Card>
  );
}
