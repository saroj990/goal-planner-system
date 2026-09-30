import { Card, CardActionArea, CardContent, Chip, Stack, Typography } from '@mui/material';
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
            <Chip
              label={goal.status}
              size="small"
              sx={{ bgcolor: '#f1f5f9', color: '#475569', fontWeight: 600 }}
            />
          </Stack>
          <Typography color="text.secondary" variant="body2" sx={{ mt: 1 }}>
            {goal.type}
            {due ? ` · Due ${due}` : ''}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
