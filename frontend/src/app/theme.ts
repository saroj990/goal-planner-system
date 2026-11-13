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
        main: isDark ? '#38bdf8' : '#0284c7',
        light: isDark ? '#7dd3fc' : '#0ea5e9',
        dark: isDark ? '#0ea5e9' : '#0369a1',
        contrastText: '#ffffff',
      },
      background: {
        default: isDark ? '#09090b' : '#f3f7fb',
        paper: isDark ? '#121216' : '#ffffff',
      },
      text: {
        primary: isDark ? '#f4f4f5' : '#0f172a',
        secondary: isDark ? '#a1a1aa' : '#64748b',
      },
      divider: isDark ? alpha('#ffffff', 0.09) : alpha('#0f172a', 0.07),
      action: {
        hover: isDark ? alpha('#ffffff', 0.06) : alpha('#0f172a', 0.04),
        selected: isDark ? alpha('#38bdf8', 0.16) : alpha('#0284c7', 0.1),
      },
    },
    typography: {
      fontFamily:
        '"Inter", "SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      h4: { fontWeight: 700, letterSpacing: '-0.03em', fontSize: '1.75rem' },
      h5: { fontWeight: 600, letterSpacing: '-0.02em' },
      h6: { fontWeight: 600, letterSpacing: '-0.015em' },
      subtitle2: { fontWeight: 600 },
      button: { fontWeight: 600 },
    },
    shape: {
      borderRadius: radius.control,
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            backgroundColor: isDark ? '#09090b' : '#f4f6fb',
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
            paddingInline: 16,
            transition: 'transform 0.15s ease, box-shadow 0.15s ease, background-color 0.15s ease',
          },
          contained: {
            boxShadow: isDark
              ? '0 8px 20px rgba(2, 132, 199, 0.28)'
              : '0 8px 18px rgba(2, 132, 199, 0.18)',
            '&:hover': {
              boxShadow: isDark
                ? '0 10px 24px rgba(2, 132, 199, 0.38)'
                : '0 10px 22px rgba(2, 132, 199, 0.26)',
            },
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
            transition: 'transform 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease',
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
      MuiOutlinedInput: {
        styleOverrides: {
          root: { borderRadius: radius.control },
        },
      },
      MuiSelect: {
        styleOverrides: {
          root: { borderRadius: radius.control },
        },
      },
      MuiToggleButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            fontWeight: 600,
            borderRadius: `${radius.control}px !important`,
            px: 1.5,
          },
        },
      },
      MuiToggleButtonGroup: {
        styleOverrides: {
          root: {
            backgroundColor: isDark ? alpha('#ffffff', 0.04) : alpha('#0f172a', 0.03),
            borderRadius: radius.control,
            padding: 3,
            gap: 2,
            '& .MuiToggleButton-root': {
              border: 'none',
              margin: 0,
            },
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
      MuiLinearProgress: {
        styleOverrides: {
          root: {
            borderRadius: 999,
            height: 8,
            backgroundColor: isDark ? alpha('#ffffff', 0.08) : alpha('#0f172a', 0.06),
          },
          bar: { borderRadius: 999 },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
          },
        },
      },
      MuiTooltip: {
        styleOverrides: {
          tooltip: {
            borderRadius: 8,
            fontWeight: 500,
          },
        },
      },
      MuiMenu: {
        styleOverrides: {
          paper: {
            borderRadius: radius.card,
            marginTop: 4,
          },
        },
      },
    },
  });
}

/** @deprecated Use createAppTheme via ThemeModeProvider */
export const appTheme = createAppTheme('dark');
