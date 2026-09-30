import { AppBar, Box, Container, Toolbar, Typography } from '@mui/material';
import { Link as RouterLink, Outlet } from 'react-router-dom';

export function AppLayout() {
  return (
    <>
      <AppBar position="static" elevation={0}>
        <Toolbar>
          <Typography
            component={RouterLink}
            to="/"
            variant="h6"
            sx={{ color: 'inherit', textDecoration: 'none', flexGrow: 1 }}
          >
            Goal Tracker
          </Typography>
          <Typography
            component={RouterLink}
            to="/goals"
            sx={{ color: 'inherit', textDecoration: 'none' }}
          >
            Goals
          </Typography>
        </Toolbar>
      </AppBar>
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Outlet />
      </Container>
    </>
  );
}
