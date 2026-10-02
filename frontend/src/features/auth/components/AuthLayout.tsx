import { Box, Card, CardContent, Stack, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { cardSurfaceSx, radius } from '../../../app/theme';

interface AuthLayoutProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export function AuthLayout({ title, subtitle, children, footer }: AuthLayoutProps) {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        px: 2,
        py: 4,
        background: (theme) =>
          theme.palette.mode === 'dark'
            ? 'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(96, 165, 250, 0.18), transparent 55%), #000'
            : 'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(37, 99, 235, 0.12), transparent 55%), #f8fafc',
      }}
    >
      <Stack spacing={3} sx={{ width: '100%', maxWidth: 420 }}>
        <Box sx={{ textAlign: 'center' }}>
          <Typography
            component={RouterLink}
            to="/login"
            sx={{
              display: 'inline-block',
              textDecoration: 'none',
              color: 'text.primary',
              fontWeight: 800,
              fontSize: 22,
              letterSpacing: '-0.03em',
              mb: 1,
            }}
          >
            Goal Tracker
          </Typography>
          <Typography variant="h5" component="h1" sx={{ fontWeight: 700, mb: 0.5 }}>
            {title}
          </Typography>
          {subtitle ? (
            <Typography variant="body2" color="text.secondary">
              {subtitle}
            </Typography>
          ) : null}
        </Box>

        <Card
          elevation={0}
          sx={(theme) => ({
            ...cardSurfaceSx(theme),
            borderRadius: `${radius.dialog}px`,
            boxShadow:
              theme.palette.mode === 'dark'
                ? '0 24px 48px rgba(0,0,0,0.45)'
                : '0 20px 40px rgba(15, 23, 42, 0.08)',
          })}
        >
          <CardContent sx={{ p: 3 }}>{children}</CardContent>
        </Card>

        {footer ? (
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
            {footer}
          </Typography>
        ) : null}
      </Stack>
    </Box>
  );
}
