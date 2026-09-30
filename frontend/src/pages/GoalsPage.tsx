import AddIcon from '@mui/icons-material/Add';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { GoalCard } from '../features/goals/components/GoalCard';
import { GoalFormDialog } from '../features/goals/components/GoalFormDialog';
import { GoalTypeTabs } from '../features/goals/components/GoalTypeTabs';
import { useGoalMutations } from '../features/goals/hooks/useGoalMutations';
import { useGoalsList } from '../features/goals/hooks/useGoals';
import { GoalType } from '../features/goals/types';

export function GoalsPage() {
  const [type, setType] = useState<GoalType>(GoalType.DAILY);
  const [dialogOpen, setDialogOpen] = useState(false);

  const { data: goals, isLoading, isError, error } = useGoalsList(type);
  const { create } = useGoalMutations(type);

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Box>
          <Typography component="h1" variant="h4">Goals</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Focus on what matters this day, week, or month.
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setDialogOpen(true)}>
          New goal
        </Button>
      </Stack>

      <Paper sx={{ px: 2, py: 1, mb: 3 }}>
        <GoalTypeTabs value={type} onChange={setType} />
      </Paper>

      {isLoading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {isError && (
        <Alert severity="error">
          {error instanceof Error ? error.message : 'Failed to load goals'}
        </Alert>
      )}

      {!isLoading && !isError && (
        <Stack spacing={2}>
          {goals?.length === 0 && (
            <Paper sx={{ p: 4, textAlign: 'center', borderStyle: 'dashed' }}>
              <Typography fontWeight={600}>No {type.toLowerCase()} goals yet</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Create one to start tracking tasks.
              </Typography>
            </Paper>
          )}
          {goals?.map((goal) => (
            <GoalCard key={goal.id} goal={goal} />
          ))}
        </Stack>
      )}

      <GoalFormDialog
        open={dialogOpen}
        defaultType={type}
        onClose={() => setDialogOpen(false)}
        onSubmit={async (input) => {
          await create.mutateAsync(input);
        }}
      />
    </Box>
  );
}
