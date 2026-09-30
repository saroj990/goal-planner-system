import { createTheme, alpha, type Theme } from '@mui/material/styles';

export type ThemeMode = 'dark' | 'light';

/** Fixed radii (px) — avoid MUI `borderRadius: N` theme multipliers on surfaces. */
export const radius = {
  card: 8,
  control: 6,
  dialog: 10,
} as const;

export function cardBorder(theme: Theme): string {
  const edge = theme.palette.mode === 'dark' ? '#ffffff' : '#0f172a';
  const opacity = theme.palette.mode === 'dark' ? 0.1 : 0.06;
  return `1px solid ${alpha(edge, opacity)}`;
}

/** Use in `sx` — values must be px strings. */
export function cardSurfaceSx(theme: Theme) {
  return {
    borderRadius: `${radius.card}px`,
    border: cardBorder(theme),
  };
}

export function createAppTheme(mode: ThemeMode) {
  const isDark = mode === 'dark';

  return createTheme({
    palette: {
      mode,
      primary: {
        main: isDark ? '#60a5fa' : '#2563eb',
        light: isDark ? '#93c5fd' : '#3b82f6',
        dark: isDark ? '#3b82f6' : '#1d4ed8',
      },
      background: {
        default: isDark ? '#000000' : '#f8fafc',
        paper: isDark ? '#111111' : '#ffffff',
      },
      text: {
        primary: isDark ? '#f4f4f5' : '#0f172a',
        secondary: isDark ? '#a1a1aa' : '#64748b',
      },
      divider: isDark ? alpha('#ffffff', 0.1) : alpha('#0f172a', 0.08),
      action: {
        hover: isDark ? alpha('#ffffff', 0.06) : alpha('#0f172a', 0.04),
        selected: isDark ? alpha('#60a5fa', 0.14) : alpha('#2563eb', 0.1),
      },
    },
    typography: {
      fontFamily:
        '"Inter", "SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      h4: { fontWeight: 700, letterSpacing: '-0.025em', fontSize: '1.75rem' },
      h5: { fontWeight: 600, letterSpacing: '-0.02em' },
      h6: { fontWeight: 600 },
      button: { fontWeight: 600 },
    },
    shape: {
      borderRadius: radius.control,
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            backgroundColor: isDark ? '#000000' : '#f8fafc',
            color: isDark ? '#f4f4f5' : '#0f172a',
          },
        },
      },
      MuiButton: {
        defaultProps: { disableElevation: true },
        styleOverrides: {
          root: {
            textTransform: 'none',
            borderRadius: radius.control,
            paddingInline: 14,
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: ({ theme }) => ({
            borderRadius: radius.card,
            border: cardBorder(theme),
            boxShadow: 'none',
            backgroundImage: 'none',
          }),
        },
      },
      MuiPaper: {
        defaultProps: { elevation: 0 },
        styleOverrides: {
          root: ({ theme }) => ({
            backgroundImage: 'none',
            borderRadius: radius.card,
            border: cardBorder(theme),
          }),
        },
      },
      MuiAlert: {
        styleOverrides: {
          root: {
            borderRadius: radius.card,
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: { fontWeight: 600, borderRadius: radius.control },
        },
      },
      MuiDialog: {
        styleOverrides: {
          paper: { borderRadius: radius.dialog },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': { borderRadius: radius.control },
          },
        },
      },
      MuiTabs: {
        styleOverrides: {
          root: {
            minHeight: 40,
            '& .MuiTab-root': { textTransform: 'none', fontWeight: 600, minHeight: 40 },
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
          },
        },
      },
    },
  });
}

/** @deprecated Use createAppTheme via ThemeModeProvider */
export const appTheme = createAppTheme('dark');
