import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Stack,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { Link as RouterLink, useNavigate, useParams } from 'react-router-dom';
import { GoalFormDialog } from '../features/goals/components/GoalFormDialog';
import { useGoalMutations } from '../features/goals/hooks/useGoalMutations';
import { useGoal } from '../features/goals/hooks/useGoals';
import type { CreateGoalInput } from '../features/goals/types';

export function GoalDetailPage() {
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const { data: goal, isLoading, isError, error } = useGoal(id);
  const { update, remove } = useGoalMutations(goal?.type);
  const [editOpen, setEditOpen] = useState(false);

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (isError || !goal) {
    return (
      <Alert severity="error">
        {error instanceof Error ? error.message : 'Goal not found'}
      </Alert>
    );
  }

  const handleDelete = async () => {
    if (!window.confirm(`Delete goal "${goal.title}"?`)) return;
    await remove.mutateAsync(goal.id);
    navigate('/goals');
  };

  return (
    <Box>
      <Button component={RouterLink} to="/goals" startIcon={<ArrowBackIcon />} sx={{ mb: 2 }}>
        Back to goals
      </Button>

      <Stack direction="row" justifyContent="space-between" alignItems="flex-start" gap={2}>
        <Box>
          <Typography component="h1" variant="h4" gutterBottom>
            {goal.title}
          </Typography>
          <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
            <Chip label={goal.type} size="small" />
            <Chip label={goal.status} size="small" color="primary" variant="outlined" />
          </Stack>
          {goal.description && (
            <Typography color="text.secondary" paragraph>
              {goal.description}
            </Typography>
          )}
          {goal.dueDate && (
            <Typography variant="body2">Due: {goal.dueDate.slice(0, 10)}</Typography>
          )}
        </Box>
        <Stack direction="row" spacing={1}>
          <Button startIcon={<EditIcon />} onClick={() => setEditOpen(true)}>
            Edit
          </Button>
          <Button color="error" startIcon={<DeleteIcon />} onClick={handleDelete}>
            Delete
          </Button>
        </Stack>
      </Stack>

      <Typography color="text.secondary" sx={{ mt: 4 }}>
        Tasks and Kanban board will appear here in a later step.
      </Typography>

      <GoalFormDialog
        open={editOpen}
        initial={goal}
        defaultType={goal.type}
        onClose={() => setEditOpen(false)}
        onSubmit={async (input: CreateGoalInput) => {
          await update.mutateAsync({ id: goal.id, input });
        }}
      />
    </Box>
  );
}
