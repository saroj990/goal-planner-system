import { Autocomplete, Avatar, Box, Stack, TextField, Typography } from '@mui/material';
import { initialsFromName } from '../../users/userDisplay';
import type { TaskAssigneeSummary } from '../types';

const UNASSIGNED: TaskAssigneeSummary = {
  id: '',
  name: 'Unassigned',
  email: '',
};

function isUnassigned(option: TaskAssigneeSummary): boolean {
  return option.id === '';
}

interface TaskAssigneeFieldProps {
  users: TaskAssigneeSummary[];
  valueId: string;
  onChange: (assigneeId: string) => void;
  loading?: boolean;
}

export function TaskAssigneeField({ users, valueId, onChange, loading }: TaskAssigneeFieldProps) {
  const options = [UNASSIGNED, ...users];
  const selected = valueId ? users.find((u) => u.id === valueId) ?? UNASSIGNED : UNASSIGNED;

  return (
    <Stack spacing={1}>
      <Typography variant="caption" color="text.secondary" fontWeight={600} letterSpacing="0.02em">
        Assignee
      </Typography>
      <Autocomplete
        size="small"
        loading={loading}
        options={options}
        value={selected}
        onChange={(_, option) => onChange(option && !isUnassigned(option) ? option.id : '')}
        isOptionEqualToValue={(a, b) => a.id === b.id}
        getOptionLabel={(option) => (isUnassigned(option) ? 'Unassigned' : option.name)}
        renderOption={(props, option) => {
          const { key, ...rest } = props;
          return (
            <Box component="li" key={key} {...rest} sx={{ gap: 1.5, display: 'flex', alignItems: 'center' }}>
              {isUnassigned(option) ? (
                <Avatar sx={{ width: 28, height: 28, bgcolor: 'action.hover', fontSize: '0.75rem' }}>—</Avatar>
              ) : (
                <Avatar sx={{ width: 28, height: 28, fontSize: '0.75rem', bgcolor: 'primary.main' }}>
                  {initialsFromName(option.name)}
                </Avatar>
              )}
              <Box sx={{ minWidth: 0 }}>
                <Typography variant="body2" fontWeight={600} noWrap>
                  {isUnassigned(option) ? 'Unassigned' : option.name}
                </Typography>
                {!isUnassigned(option) && (
                  <Typography variant="caption" color="text.secondary" noWrap>
                    {option.email}
                  </Typography>
                )}
              </Box>
            </Box>
          );
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            placeholder="Who owns this?"
            InputProps={{
              ...params.InputProps,
              startAdornment: (
                <>
                  {!isUnassigned(selected) ? (
                    <Avatar
                      sx={{
                        width: 24,
                        height: 24,
                        mr: 1,
                        fontSize: '0.65rem',
                        bgcolor: 'primary.main',
                      }}
                    >
                      {initialsFromName(selected.name)}
                    </Avatar>
                  ) : null}
                  {params.InputProps.startAdornment}
                </>
              ),
            }}
          />
        )}
      />
    </Stack>
  );
}
