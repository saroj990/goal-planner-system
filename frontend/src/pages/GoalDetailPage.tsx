import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  IconButton,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { Link as RouterLink, useLocation, useNavigate, useParams } from 'react-router-dom';
import { GoalFormDialog } from '../features/goals/components/GoalFormDialog';
import { useGoalMutations } from '../features/goals/hooks/useGoalMutations';
import { useGoal } from '../features/goals/hooks/useGoals';
import type { CreateGoalInput } from '../features/goals/types';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { GoalTasksSection } from '../features/tasks/components/GoalTasksSection';

export function GoalDetailPage() {
  const { id = '' } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { data: goal, isLoading, isError, error } = useGoal(id);
  const { update, remove } = useGoalMutations(goal?.type);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  useEffect(() => {
    if (location.hash !== '#task-board' || isLoading || !goal) return;
    const el = document.getElementById('task-board');
    el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [location.hash, isLoading, goal?.id]);

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
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

  return (
    <Box>
      <Button
        component={RouterLink}
        to="/goals"
        startIcon={<ArrowBackIcon />}
        color="inherit"
        sx={{ mb: 2, color: 'text.secondary' }}
      >
        Goals
      </Button>

      <Paper sx={{ p: 3, mb: 2 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" gap={2}>
          <Box>
            <Typography component="h1" variant="h4" gutterBottom>
              {goal.title}
            </Typography>
            <Stack direction="row" spacing={1} sx={{ mb: 2 }} flexWrap="wrap" useFlexGap>
              <Chip label={goal.type} size="small" sx={{ bgcolor: '#eef2ff', color: '#4338ca' }} />
              <Chip label={goal.status} size="small" variant="outlined" />
            </Stack>
            {goal.description && (
              <Typography color="text.secondary" sx={{ maxWidth: 560 }}>
                {goal.description}
              </Typography>
            )}
            {goal.dueDate && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1.5 }}>
                Due {goal.dueDate.slice(0, 10)}
              </Typography>
            )}
          </Box>
          <Stack direction="row" spacing={0.5}>
            <IconButton aria-label="Edit goal" onClick={() => setEditOpen(true)}>
              <EditOutlinedIcon />
            </IconButton>
            <IconButton aria-label="Delete goal" color="error" onClick={() => setDeleteOpen(true)}>
              <DeleteOutlineIcon />
            </IconButton>
          </Stack>
        </Stack>
      </Paper>

      <GoalTasksSection goalId={goal.id} />

      <GoalFormDialog
        open={editOpen}
        initial={goal}
        defaultType={goal.type}
        onClose={() => setEditOpen(false)}
        onSubmit={async (input: CreateGoalInput) => {
          await update.mutateAsync({ id: goal.id, input });
        }}
      />

      <ConfirmDialog
        open={deleteOpen}
        title="Delete goal?"
        description={`"${goal.title}" and all of its tasks will be permanently removed.`}
        confirmLabel="Delete"
        destructive
        loading={remove.isPending}
        onCancel={() => setDeleteOpen(false)}
        onConfirm={async () => {
          await remove.mutateAsync(goal.id);
          setDeleteOpen(false);
          navigate('/goals');
        }}
      />
    </Box>
  );
}
