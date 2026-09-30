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
import type { Goal } from '../types';

function formatDate(value: string | null): string | null {
  if (!value) return null;
  return value.slice(0, 10);
}

interface GoalCardProps {
  goal: Goal;
}

export function GoalCard({ goal }: GoalCardProps) {
  const due = formatDate(goal.dueDate);

  return (
    <Card
      sx={{
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 8px 24px rgba(15, 23, 42, 0.08)',
        },
      }}
    >
      <CardActionArea component={RouterLink} to={`/goals/${goal.id}`} sx={{ p: 0.5 }}>
        <CardContent>
          <Stack direction="row" justifyContent="space-between" alignItems="flex-start" gap={1}>
            <Typography variant="h6" component="h2" fontWeight={600}>
              {goal.title}
            </Typography>
            <Chip label={goal.status} size="small" variant="outlined" />
          </Stack>
          <Typography color="text.secondary" variant="body2" sx={{ mt: 1 }}>
            {goal.type}
            {due ? ` · Due ${due}` : ''}
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions sx={{ px: 2, pb: 2, pt: 0 }}>
        <Button
          component={RouterLink}
          to="/board"
          size="small"
          startIcon={<ViewKanbanOutlinedIcon />}
        >
          Board
        </Button>
      </CardActions>
    </Card>
  );
}
