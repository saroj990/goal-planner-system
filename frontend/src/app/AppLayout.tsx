import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import FlagOutlinedIcon from '@mui/icons-material/FlagOutlined';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import ShowChartOutlinedIcon from '@mui/icons-material/ShowChartOutlined';
import ViewKanbanOutlinedIcon from '@mui/icons-material/ViewKanbanOutlined';
import {
  Avatar,
  Box,
  Divider,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../features/auth/hooks/useAuth';
import { initialsFromName } from '../features/users/userDisplay';
import { useThemeMode } from './ThemeModeProvider';
import { radius } from './theme';

const navItems = [
  { to: '/', label: 'Dashboard', icon: DashboardOutlinedIcon, end: true },
  { to: '/projects', label: 'Projects', icon: FlagOutlinedIcon, end: false },
  { to: '/board', label: 'Board', icon: ViewKanbanOutlinedIcon, end: false },
  { to: '/progress', label: 'Progress', icon: ShowChartOutlinedIcon, end: false },
] as const;

export function AppLayout() {
  const { mode, toggleMode } = useThemeMode();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);

  const displayName = user?.name?.split(' ')[0] ?? 'Account';

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        bgcolor: 'background.default',
        backgroundImage: (theme) =>
          theme.palette.mode === 'dark'
            ? 'radial-gradient(ellipse 70% 40% at 0% 0%, rgba(56, 189, 248, 0.08), transparent 50%)'
            : 'radial-gradient(ellipse 70% 40% at 0% 0%, rgba(2, 132, 199, 0.06), transparent 50%)',
      }}
    >
      <Box
        component="nav"
        aria-label="Main"
        sx={{
          width: { xs: 72, sm: 248 },
          flexShrink: 0,
          borderRight: 1,
          borderColor: 'divider',
          bgcolor: (theme) =>
            theme.palette.mode === 'dark' ? 'rgba(18, 18, 22, 0.92)' : 'rgba(255, 255, 255, 0.86)',
          backdropFilter: 'blur(12px)',
          display: 'flex',
          flexDirection: 'column',
          py: 2.5,
          px: { xs: 1, sm: 2 },
        }}
      >
        <Box
          component={NavLink}
          to="/"
          end
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.25,
            px: { xs: 0.5, sm: 1 },
            mb: 2.5,
            textDecoration: 'none',
            color: 'text.primary',
            justifyContent: { xs: 'center', sm: 'flex-start' },
          }}
        >
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: 1.5,
              bgcolor: 'primary.main',
              color: 'primary.contrastText',
              display: 'grid',
              placeItems: 'center',
              fontWeight: 800,
              fontSize: 13,
              letterSpacing: '-0.04em',
              flexShrink: 0,
            }}
          >
            GT
          </Box>
          <Typography
            sx={{
              display: { xs: 'none', sm: 'block' },
              fontWeight: 800,
              fontSize: 17,
              letterSpacing: '-0.03em',
              lineHeight: 1.2,
            }}
          >
            Goal Tracker
          </Typography>
        </Box>

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
                py: 1.15,
                borderRadius: `${radius.control}px`,
                textDecoration: 'none',
                color: 'text.secondary',
                fontWeight: 600,
                fontSize: 14,
                justifyContent: { xs: 'center', sm: 'flex-start' },
                transition: 'background-color 0.15s ease, color 0.15s ease',
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
              <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>
                {label}
              </Box>
            </Box>
          ))}
        </Stack>

        <Stack spacing={1} sx={{ mt: 1, px: { sm: 0.5 } }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              justifyContent: { xs: 'center', sm: 'flex-start' },
            }}
          >
            <Tooltip title="Account">
              <IconButton
                onClick={(e) => setMenuAnchor(e.currentTarget)}
                aria-label="Account menu"
                sx={{ p: 0.5 }}
              >
                <Avatar
                  sx={{
                    width: 34,
                    height: 34,
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    bgcolor: 'primary.main',
                  }}
                >
                  {user?.name ? initialsFromName(user.name) : '?'}
                </Avatar>
              </IconButton>
            </Tooltip>
            <Box sx={{ display: { xs: 'none', sm: 'block' }, minWidth: 0 }}>
              <Typography variant="body2" fontWeight={700} noWrap>
                {displayName}
              </Typography>
              <Typography variant="caption" color="text.secondary" noWrap>
                {user?.role === 'ADMIN' ? 'Admin' : 'Member'}
              </Typography>
            </Box>
          </Box>

          <Menu
            anchorEl={menuAnchor}
            open={Boolean(menuAnchor)}
            onClose={() => setMenuAnchor(null)}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            transformOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          >
            <MenuItem
              onClick={() => {
                setMenuAnchor(null);
                navigate('/profile');
              }}
            >
              <ListItemIcon>
                <AccountCircleOutlinedIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Profile</ListItemText>
            </MenuItem>
            <MenuItem
              onClick={() => {
                setMenuAnchor(null);
                logout();
                navigate('/login');
              }}
            >
              <ListItemIcon>
                <LogoutOutlinedIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Sign out</ListItemText>
            </MenuItem>
          </Menu>

          <Tooltip title={mode === 'dark' ? 'Light mode' : 'Dark mode'}>
            <IconButton
              onClick={toggleMode}
              aria-label={mode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              sx={{
                alignSelf: { xs: 'center', sm: 'flex-start' },
                color: 'text.secondary',
                borderRadius: `${radius.control}px`,
              }}
            >
              {mode === 'dark' ? <LightModeOutlinedIcon /> : <DarkModeOutlinedIcon />}
            </IconButton>
          </Tooltip>
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
