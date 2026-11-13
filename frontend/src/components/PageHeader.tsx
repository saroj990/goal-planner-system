import { Box, Stack, Typography } from '@mui/material';
import type { ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: ReactNode;
  eyebrow?: string;
}

export function PageHeader({ title, description, actions, eyebrow }: PageHeaderProps) {
  return (
    <Stack
      direction={{ xs: 'column', sm: 'row' }}
      justifyContent="space-between"
      alignItems={{ xs: 'stretch', sm: 'flex-start' }}
      spacing={2}
      sx={{ mb: 0.5 }}
    >
      <Box sx={{ minWidth: 0 }}>
        {eyebrow ? (
          <Typography
            variant="caption"
            color="primary"
            fontWeight={700}
            letterSpacing="0.04em"
            textTransform="uppercase"
            sx={{ display: 'block', mb: 0.75 }}
          >
            {eyebrow}
          </Typography>
        ) : null}
        <Typography variant="h4" component="h1" sx={{ letterSpacing: '-0.03em' }}>
          {title}
        </Typography>
        {description ? (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.75, maxWidth: 540, lineHeight: 1.55 }}>
            {description}
          </Typography>
        ) : null}
      </Box>
      {actions ? (
        <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
          {actions}
        </Stack>
      ) : null}
    </Stack>
  );
}
