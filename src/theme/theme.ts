import { createTheme, alpha } from '@mui/material/styles';

const GOLD = '#ECD06F';
const BLACK = '#000000';
const WHITE = '#FFFFFF';
const DARK_SURFACE = '#0A0A0A';
const DARK_CARD = '#141414';
const DARK_BORDER = '#1E1E1E';
const GRAY_TEXT = '#9E9E9E';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: GOLD,
      light: '#F2E0A0',
      dark: '#C9AD4A',
      contrastText: BLACK,
    },
    secondary: {
      main: '#2A2A2A',
      light: '#3A3A3A',
      dark: '#1A1A1A',
      contrastText: WHITE,
    },
    background: {
      default: BLACK,
      paper: DARK_CARD,
    },
    text: {
      primary: WHITE,
      secondary: GRAY_TEXT,
    },
    success: {
      main: '#4ADE80',
      dark: '#16A34A',
    },
    error: {
      main: '#EF4444',
      dark: '#DC2626',
    },
    warning: {
      main: GOLD,
      dark: '#C9AD4A',
    },
    info: {
      main: '#60A5FA',
      dark: '#3B82F6',
    },
    divider: DARK_BORDER,
  },
  typography: {
    fontFamily: '"DM Sans", "Helvetica Neue", Helvetica, Arial, sans-serif',
    h1: {
      fontWeight: 800,
      letterSpacing: '-0.04em',
      lineHeight: 1.1,
    },
    h2: {
      fontWeight: 700,
      letterSpacing: '-0.03em',
      lineHeight: 1.15,
    },
    h3: {
      fontWeight: 700,
      letterSpacing: '-0.02em',
    },
    h4: {
      fontWeight: 600,
      letterSpacing: '-0.01em',
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
    subtitle1: {
      fontWeight: 500,
      color: GRAY_TEXT,
    },
    subtitle2: {
      fontWeight: 500,
      fontSize: '0.8rem',
      letterSpacing: '0.08em',
      textTransform: 'uppercase' as const,
      color: GRAY_TEXT,
    },
    body1: {
      lineHeight: 1.7,
    },
    body2: {
      color: GRAY_TEXT,
      lineHeight: 1.6,
    },
    button: {
      fontWeight: 600,
      letterSpacing: '0.02em',
    },
    overline: {
      fontFamily: '"Space Mono", "Courier New", monospace',
      letterSpacing: '0.15em',
      fontWeight: 400,
    },
  },
  shape: {
    borderRadius: 16,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: BLACK,
          scrollbarWidth: 'thin',
          scrollbarColor: `${DARK_BORDER} transparent`,
          '&::-webkit-scrollbar': {
            width: '6px',
          },
          '&::-webkit-scrollbar-track': {
            background: 'transparent',
          },
          '&::-webkit-scrollbar-thumb': {
            background: DARK_BORDER,
            borderRadius: '3px',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          textTransform: 'none' as const,
          padding: '10px 24px',
          fontSize: '0.9rem',
          fontWeight: 600,
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
          },
        },
        containedPrimary: {
          background: GOLD,
          color: BLACK,
          '&:hover': {
            background: '#F2E0A0',
            boxShadow: `0 0 20px ${alpha(GOLD, 0.4)}`,
          },
        },
        outlinedPrimary: {
          borderColor: alpha(GOLD, 0.4),
          color: GOLD,
          '&:hover': {
            borderColor: GOLD,
            background: alpha(GOLD, 0.08),
          },
        },
        text: {
          '&:hover': {
            background: alpha(WHITE, 0.05),
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          background: DARK_CARD,
          border: `1px solid ${DARK_BORDER}`,
          borderRadius: 20,
          boxShadow: 'none',
          transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
          '&:hover': {
            borderColor: alpha(GOLD, 0.2),
            boxShadow: `0 0 30px ${alpha(GOLD, 0.05)}`,
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 500,
          fontSize: '0.75rem',
        },
        filled: {
          border: 'none',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
            background: alpha(WHITE, 0.03),
            '& fieldset': {
              borderColor: DARK_BORDER,
            },
            '&:hover fieldset': {
              borderColor: alpha(GOLD, 0.3),
            },
            '&.Mui-focused fieldset': {
              borderColor: GOLD,
              borderWidth: '1px',
            },
          },
          '& .MuiInputLabel-root': {
            color: GRAY_TEXT,
            '&.Mui-focused': {
              color: GOLD,
            },
          },
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          background: DARK_SURFACE,
          border: `1px solid ${DARK_BORDER}`,
          borderRadius: 24,
          boxShadow: `0 25px 80px ${alpha(BLACK, 0.8)}`,
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          background: DARK_SURFACE,
          borderRight: `1px solid ${DARK_BORDER}`,
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          background: DARK_CARD,
          border: `1px solid ${DARK_BORDER}`,
          borderRadius: 8,
          fontSize: '0.8rem',
          padding: '8px 12px',
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          '&:hover': {
            background: alpha(WHITE, 0.05),
          },
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          height: 4,
          backgroundColor: DARK_BORDER,
        },
        barColorPrimary: {
          background: `linear-gradient(90deg, ${GOLD}, #F2E0A0)`,
          borderRadius: 4,
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderColor: DARK_BORDER,
        },
        head: {
          fontWeight: 600,
          fontSize: '0.75rem',
          letterSpacing: '0.08em',
          textTransform: 'uppercase' as const,
          color: GRAY_TEXT,
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
  },
});

export default theme;
