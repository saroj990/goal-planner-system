import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import FlagOutlinedIcon from '@mui/icons-material/FlagOutlined';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import ShowChartOutlinedIcon from '@mui/icons-material/ShowChartOutlined';
import ViewKanbanOutlinedIcon from '@mui/icons-material/ViewKanbanOutlined';
import { Box, Divider, IconButton, Stack, Tooltip, Typography } from '@mui/material';
import { NavLink, Outlet } from 'react-router-dom';
import { useThemeMode } from './ThemeModeProvider';
import { radius } from './theme';

const navItems = [
  { to: '/', label: 'Dashboard', icon: DashboardOutlinedIcon, end: true },
  { to: '/goals', label: 'Goals', icon: FlagOutlinedIcon, end: false },
  { to: '/board', label: 'Board', icon: ViewKanbanOutlinedIcon, end: false },
  { to: '/progress', label: 'Progress', icon: ShowChartOutlinedIcon, end: false },
] as const;

export function AppLayout() {
  const { mode, toggleMode } = useThemeMode();

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
              sx={(theme) => ({
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
                  bgcolor: theme.palette.action.selected,
                },
                '&:hover': {
                  bgcolor: theme.palette.action.hover,
                  color: 'text.primary',
                },
              })}
            >
              <Icon sx={{ fontSize: 22 }} />
              <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>{label}</Box>
            </Box>
          ))}
        </Stack>

        <Tooltip title={mode === 'dark' ? 'Light mode' : 'Dark mode'}>
          <IconButton
            onClick={toggleMode}
            aria-label={mode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            sx={{
              alignSelf: { xs: 'center', sm: 'flex-start' },
              ml: { sm: 0.5 },
              color: 'text.secondary',
            }}
          >
            {mode === 'dark' ? <LightModeOutlinedIcon /> : <DarkModeOutlinedIcon />}
          </IconButton>
        </Tooltip>
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
