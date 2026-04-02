import { createTheme, alpha } from '@mui/material/styles';

const LIME = '#C8E64A';
const DARK_BG = '#1A1A1A';
const CARD_BG = '#242424';
const CARD_BORDER = '#2E2E2E';
const WHITE = '#FFFFFF';
const GRAY_TEXT = '#9E9E9E';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: LIME,
      light: '#D9F07A',
      dark: '#A8C230',
      contrastText: '#000000',
    },
    secondary: {
      main: '#2E2E2E',
      light: '#3A3A3A',
      dark: '#1E1E1E',
      contrastText: WHITE,
    },
    background: {
      default: DARK_BG,
      paper: CARD_BG,
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
      main: '#F59E0B',
      dark: '#D97706',
    },
    info: {
      main: '#60A5FA',
      dark: '#3B82F6',
    },
    divider: CARD_BORDER,
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
    borderRadius: 20,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: DARK_BG,
          scrollbarWidth: 'thin',
          scrollbarColor: `${CARD_BORDER} transparent`,
          '&::-webkit-scrollbar': {
            width: '6px',
          },
          '&::-webkit-scrollbar-track': {
            background: 'transparent',
          },
          '&::-webkit-scrollbar-thumb': {
            background: CARD_BORDER,
            borderRadius: '3px',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 14,
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
          background: LIME,
          color: '#000',
          '&:hover': {
            background: '#D9F07A',
            boxShadow: `0 0 20px ${alpha(LIME, 0.35)}`,
          },
        },
        outlinedPrimary: {
          borderColor: alpha(LIME, 0.4),
          color: LIME,
          '&:hover': {
            borderColor: LIME,
            background: alpha(LIME, 0.08),
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
          background: CARD_BG,
          border: `1px solid ${CARD_BORDER}`,
          borderRadius: 24,
          boxShadow: 'none',
          transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
          '&:hover': {
            borderColor: alpha(LIME, 0.15),
            boxShadow: `0 0 30px ${alpha(LIME, 0.04)}`,
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 10,
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
            borderRadius: 14,
            background: alpha(WHITE, 0.03),
            '& fieldset': {
              borderColor: CARD_BORDER,
            },
            '&:hover fieldset': {
              borderColor: alpha(LIME, 0.3),
            },
            '&.Mui-focused fieldset': {
              borderColor: LIME,
              borderWidth: '1px',
            },
          },
          '& .MuiInputLabel-root': {
            color: GRAY_TEXT,
            '&.Mui-focused': {
              color: LIME,
            },
          },
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          background: CARD_BG,
          border: `1px solid ${CARD_BORDER}`,
          borderRadius: 28,
          boxShadow: `0 25px 80px ${alpha('#000000', 0.8)}`,
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          background: DARK_BG,
          borderRight: `1px solid ${CARD_BORDER}`,
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          background: CARD_BG,
          border: `1px solid ${CARD_BORDER}`,
          borderRadius: 10,
          fontSize: '0.8rem',
          padding: '8px 12px',
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          borderRadius: 14,
          '&:hover': {
            background: alpha(WHITE, 0.05),
          },
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          height: 6,
          backgroundColor: alpha(WHITE, 0.08),
        },
        barColorPrimary: {
          background: `linear-gradient(90deg, ${LIME}, #D9F07A)`,
          borderRadius: 6,
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderColor: CARD_BORDER,
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
          borderRadius: 14,
        },
      },
    },
  },
});

export default theme;
