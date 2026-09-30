import { AppBar, Box, Container, Toolbar, Typography } from '@mui/material';
import { Link as RouterLink, Outlet } from 'react-router-dom';

export function AppLayout() {
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <AppBar position="sticky" elevation={0}>
        <Toolbar sx={{ gap: 3 }}>
          <Typography
            component={RouterLink}
            to="/"
            variant="h6"
            sx={{
              color: 'inherit',
              textDecoration: 'none',
              fontWeight: 700,
              letterSpacing: '-0.02em',
            }}
          >
            Goal Tracker
          </Typography>
          <Typography
            component={RouterLink}
            to="/goals"
            sx={{
              color: 'text.secondary',
              textDecoration: 'none',
              fontWeight: 600,
              fontSize: 14,
              '&:hover': { color: 'primary.main' },
            }}
          >
            Goals
          </Typography>
        </Toolbar>
      </AppBar>
      <Container maxWidth="md" sx={{ py: 4, flex: 1 }}>
        <Outlet />
      </Container>
    </Box>
  );
}
