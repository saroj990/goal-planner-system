import { Box, Paper, Typography } from '@mui/material';
import type { ReactNode } from 'react';

interface SectionCardProps {
  title?: string;
  subtitle?: string;
  children: ReactNode;
  action?: ReactNode;
  tone?: 'default' | 'danger';
}

export function SectionCard({ title, subtitle, children, action, tone = 'default' }: SectionCardProps) {
  return (
    <Paper
      sx={(theme) => ({
        p: { xs: 2.5, md: 3 },
        ...(tone === 'danger'
          ? {
              borderColor: theme.palette.mode === 'dark' ? 'error.dark' : 'error.light',
              bgcolor:
                theme.palette.mode === 'dark'
                  ? 'rgba(185, 28, 28, 0.12)'
                  : 'rgba(254, 226, 226, 0.45)',
            }
          : {}),
      })}
    >
      {(title || action) && (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            gap: 2,
            mb: title || subtitle ? 2 : 0,
          }}
        >
          <Box>
            {title ? (
              <Typography variant="h6" fontWeight={700} sx={{ letterSpacing: '-0.02em' }}>
                {title}
              </Typography>
            ) : null}
            {subtitle ? (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                {subtitle}
              </Typography>
            ) : null}
          </Box>
          {action}
        </Box>
      )}
      {children}
    </Paper>
  );
}
