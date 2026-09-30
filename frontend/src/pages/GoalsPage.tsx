import AddIcon from '@mui/icons-material/Add';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
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
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Typography component="h1" variant="h4">
          Goals
        </Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setDialogOpen(true)}>
          Add goal
        </Button>
      </Stack>

      <GoalTypeTabs value={type} onChange={setType} />

      {isLoading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {isError && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error instanceof Error ? error.message : 'Failed to load goals'}
        </Alert>
      )}

      {!isLoading && !isError && (
        <Stack spacing={2} sx={{ mt: 3 }}>
          {goals?.length === 0 && (
            <Typography color="text.secondary">No {type.toLowerCase()} goals yet.</Typography>
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
