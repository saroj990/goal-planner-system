import ViewKanbanOutlinedIcon from '@mui/icons-material/ViewKanbanOutlined';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { useGoalsList } from '../features/goals/hooks/useGoals';
import { GoalStatus } from '../features/goals/types';

export function BoardPage() {
  const { data: goals, isLoading, isError, error } = useGoalsList();
  const activeGoals = (goals ?? []).filter((g) => g.status === GoalStatus.ACTIVE);

  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h4" component="h1">Kanban boards</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          Open a goal&apos;s board to drag tasks between columns.
        </Typography>
      </Box>

      {isLoading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
          <CircularProgress />
        </Box>
      )}

      {isError && (
        <Alert severity="error">
          {error instanceof Error ? error.message : 'Failed to load goals'}
        </Alert>
      )}

      {!isLoading && !isError && activeGoals.length === 0 && (
        <Paper sx={{ p: 4, textAlign: 'center', borderStyle: 'dashed' }}>
          <ViewKanbanOutlinedIcon sx={{ fontSize: 40, color: 'text.disabled', mb: 1 }} />
          <Typography fontWeight={600}>No active goals</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1, mb: 2 }}>
            Create a goal first, then manage tasks on its board.
          </Typography>
          <Button component={RouterLink} to="/goals" variant="contained">
            Go to goals
          </Button>
        </Paper>
      )}

      {!isLoading && !isError && activeGoals.length > 0 && (
        <Stack spacing={1.5}>
          {activeGoals.map((goal) => (
            <Paper key={goal.id} sx={{ p: 2 }}>
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                alignItems={{ xs: 'flex-start', sm: 'center' }}
                justifyContent="space-between"
                spacing={1.5}
              >
                <Box>
                  <Typography fontWeight={600}>{goal.title}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {goal.type}
                  </Typography>
                </Box>
                <Button
                  component={RouterLink}
                  to={`/goals/${goal.id}#task-board`}
                  variant="outlined"
                  size="small"
                  startIcon={<ViewKanbanOutlinedIcon />}
                >
                  Open board
                </Button>
              </Stack>
            </Paper>
          ))}
        </Stack>
      )}
    </Stack>
  );
}
