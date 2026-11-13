import { Box, Button, Stack, Typography } from '@mui/material';
import type { ReactNode } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { radius } from '../app/theme';

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  actionTo?: string;
  icon?: ReactNode;
}

export function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
  actionTo,
  icon,
}: EmptyStateProps) {
  return (
    <Box
      sx={{
        py: 6,
        px: 3,
        textAlign: 'center',
        borderRadius: `${radius.card}px`,
        border: '1px dashed',
        borderColor: 'divider',
        bgcolor: 'background.paper',
      }}
    >
      <Stack spacing={1.5} alignItems="center" sx={{ maxWidth: 360, mx: 'auto' }}>
        {icon ? (
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: `${radius.control}px`,
              display: 'grid',
              placeItems: 'center',
              bgcolor: 'action.selected',
              color: 'primary.main',
              mb: 0.5,
            }}
          >
            {icon}
          </Box>
        ) : null}
        <Typography fontWeight={700}>{title}</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.55 }}>
          {description}
        </Typography>
        {actionLabel && onAction ? (
          <Button variant="contained" onClick={onAction} sx={{ mt: 1 }}>
            {actionLabel}
          </Button>
        ) : null}
        {actionLabel && actionTo ? (
          <Button component={RouterLink} to={actionTo} variant="contained" sx={{ mt: 1 }}>
            {actionLabel}
          </Button>
        ) : null}
      </Stack>
    </Box>
  );
}
