import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import FlagOutlinedIcon from '@mui/icons-material/FlagOutlined';
import ShowChartOutlinedIcon from '@mui/icons-material/ShowChartOutlined';
import ViewKanbanOutlinedIcon from '@mui/icons-material/ViewKanbanOutlined';
import { Box, Divider, Stack, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { radius } from './theme';
import { NavLink, Outlet } from 'react-router-dom';

const navItems = [
  { to: '/', label: 'Dashboard', icon: DashboardOutlinedIcon, end: true },
  { to: '/goals', label: 'Goals', icon: FlagOutlinedIcon, end: false },
  { to: '/board', label: 'Board', icon: ViewKanbanOutlinedIcon, end: false },
  { to: '/progress', label: 'Progress', icon: ShowChartOutlinedIcon, end: false },
] as const;

export function AppLayout() {
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', bgcolor: 'background.default' }}>
      <Box
        component="nav"
        aria-label="Main"
        sx={{
          width: { xs: 72, sm: 240 },
          flexShrink: 0,
          borderRight: 1,
          borderColor: 'divider',
          bgcolor: 'background.paper',
          display: 'flex',
          flexDirection: 'column',
          py: 2.5,
          px: { xs: 1, sm: 2 },
        }}
      >
        <Typography
          component={NavLink}
          to="/"
          end
          sx={{
            px: { xs: 0.5, sm: 1 },
            mb: 2,
            textDecoration: 'none',
            color: 'text.primary',
            fontWeight: 800,
            fontSize: { xs: 11, sm: 18 },
            letterSpacing: '-0.03em',
            textAlign: { xs: 'center', sm: 'left' },
            lineHeight: 1.2,
          }}
        >
          <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>Goal Tracker</Box>
          <Box component="span" sx={{ display: { xs: 'inline', sm: 'none' } }}>GT</Box>
        </Typography>

        <Divider sx={{ mb: 2, display: { xs: 'none', sm: 'block' } }} />

        <Stack spacing={0.5} sx={{ flex: 1 }}>
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <Box
              key={to}
              component={NavLink}
              to={to}
              end={end}
              title={label}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                px: { xs: 1, sm: 1.5 },
                py: 1.25,
                borderRadius: `${radius.control}px`,
                textDecoration: 'none',
                color: 'text.secondary',
                fontWeight: 600,
                fontSize: 14,
                justifyContent: { xs: 'center', sm: 'flex-start' },
                '&.active': {
                  color: 'primary.main',
                  bgcolor: alpha('#6366f1', 0.1),
                },
                '&:hover': {
                  bgcolor: alpha('#0f172a', 0.04),
                  color: 'text.primary',
                },
              }}
            >
              <Icon sx={{ fontSize: 22 }} />
              <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>{label}</Box>
            </Box>
          ))}
        </Stack>
      </Box>

      <Box
        component="main"
        sx={{
          flex: 1,
          minWidth: 0,
          py: { xs: 2.5, md: 4 },
          px: { xs: 2, md: 4 },
          maxWidth: 1280,
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}
