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
            ? 'radial-gradient(ellipse 80% 55% at 50% -15%, rgba(56, 189, 248, 0.16), transparent 55%), #09090b'
            : 'radial-gradient(ellipse 80% 55% at 50% -15%, rgba(2, 132, 199, 0.12), transparent 55%), #f3f7fb',
      }}
    >
      <Stack spacing={3} sx={{ width: '100%', maxWidth: 420 }}>
        <Box sx={{ textAlign: 'center' }}>
          <Box
            component={RouterLink}
            to="/login"
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 1,
              textDecoration: 'none',
              color: 'text.primary',
              mb: 2,
            }}
          >
            <Box
              sx={{
                width: 34,
                height: 34,
                borderRadius: 1.5,
                bgcolor: 'primary.main',
                color: 'primary.contrastText',
                display: 'grid',
                placeItems: 'center',
                fontWeight: 800,
                fontSize: 13,
              }}
            >
              GT
            </Box>
            <Typography sx={{ fontWeight: 800, fontSize: 20, letterSpacing: '-0.03em' }}>
              Goal Tracker
            </Typography>
          </Box>
          <Typography variant="h5" component="h1" sx={{ fontWeight: 700, mb: 0.5, letterSpacing: '-0.02em' }}>
            {title}
          </Typography>
          {subtitle ? (
            <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.55 }}>
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
          <CardContent sx={{ p: 3.25 }}>{children}</CardContent>
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
