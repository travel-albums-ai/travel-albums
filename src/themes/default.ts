import { ThemeOptions } from '@mui/material';
import { createTheme } from '@mui/material/styles';

export const themeTokens = {
  light: {
    palette: {
      mode: 'light',
      primary: { main: '#1976d2' },
      secondary: { main: '#dc004e' },
      background: { default: '#fafafa', paper: '#ffffff' },
    },
    shape: {
      borderRadius: 4,
    },
    typography: {
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
      button: {
        textTransform: 'none',
      }
    },
  } as ThemeOptions,
  dark: {
    palette: {
      mode: 'dark',
      primary: { main: '#a8c7fa' },
      secondary: { main: '#f48fb1' },
      background: { default: '#3c3c3c', paper: '#282828' },
    },
    shape: {
      borderRadius: 4,
    },
    typography: {
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
      button: {
        textTransform: 'none',
      }
    },
  } as ThemeOptions,
}

export const clownThemeTokens = {
  light: {
    palette: {
      mode: 'light',
      primary: { main: 'red' },
      secondary: { main: 'blue' },
      background: { default: 'yellow', paper: 'green' },
    },
    shape: {
      borderRadius: 4,
    },
    typography: {
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
      button: {
        textTransform: 'none',
      }
    },
  } as ThemeOptions,
  dark: {
    palette: {
      mode: 'light',
      primary: { main: '#FF0000' },
      secondary: { main: '#0000FF' },
      background: {
        default: '#5f5f0b',
        paper: '#285e28',
      },
      text: {
        primary: '#2b882b',
        secondary: '#6c8a32',
        disabled: '#1010be',
      },
      action: {
        active: '#771717',
        hover: '#ec780a',
        hoverOpacity: 0.2,
        selected: '#10106b',
        selectedOpacity: 0.2,
        disabled: '#861a86',
        disabledBackground: '#838320',
        disabledOpacity: 0.38,
        focus: '#0f7a0f',
        focusOpacity: 0.12,

      },
      divider: '#a30f0f',
      main: '#c01cc0',
    },
    shape: {
      borderRadius: 12,
    },
    typography: {
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
      button: {
        textTransform: 'none',
      }
    },
  } as ThemeOptions,
}


export const generateTheme = (tokens: ThemeOptions) => createTheme({
  ...tokens,

  components: {
    MuiTextField: {
      styleOverrides: {
        root: ({ theme }) => ({
          border: '0px',

          '& .MuiOutlinedInput-root': {
            backgroundColor: theme.palette.background.default,
            border: '0px',
          },
        }),
      },

      defaultProps: {
        roundness: 'rounded',
      },

      variants: [
        {
          props: { roundness: 'full' },
          style: {
            '& .MuiOutlinedInput-root': {
              borderRadius: 8,
            },
          },
        },
        {
          props: { roundness: 'rounded' },
          style: {
            '& .MuiOutlinedInput-root': {
              borderRadius: 8,
            },
          },
        },
        {
          props: { roundness: 'square' },
          style: {
            '& .MuiOutlinedInput-root': {
              borderRadius: 8,
            },
          },
        },
      ],
    },

    MuiDialog: {
      styleOverrides: {
        paper: ({ theme }) => ({
          maxHeight: '75vh',
          padding: theme.spacing(2),
          overflowY: 'auto',
          borderRadius: Number(theme.shape.borderRadius) * 4,
          backgroundColor: `${theme.palette.background.default}BD`,
          backdropFilter: 'blur(4px)',
          border: `2px solid ${theme.palette.divider}`,
          boxShadow: theme.shadows[24],
        }),
        backdrop: {
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          backdropFilter: 'blur(1px)',
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: ({ theme }) => ({
          backgroundColor: `${theme.palette.background.paper}87`,
          backdropFilter: 'blur(2px)',
          color: `${theme.palette.text.primary}`,
          boxShadow: theme.shadows[4],
        }),
        arrow: ({ theme }) => ({
          color: `${theme.palette.background.paper}87`,
        }),
      },
    },

    MuiButton: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderRadius: Number(theme.shape.borderRadius) * 2,
        }),
      },
    },

    MuiCard: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderRadius: Number(theme.shape.borderRadius) * 3,
        }),
      },
    },

    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: 'rgba(30, 30, 30, 0.4)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
        },
      },
    },

    MuiPopover: {
      styleOverrides: {
        paper: ({ theme }) => ({
          backgroundColor: `${theme.palette.background.paper}BD`,
          backdropFilter: 'blur(16px)',
        }),
      },
    },

    MuiAccordion: {
      styleOverrides: {
        root: ({ theme }) => ({
          '&::before': {
            display: 'none',
          },

          border: '1px solid',
          borderColor: theme.palette.divider,

          borderRadius: Number(theme.shape.borderRadius) * 3,

          '&:first-of-type': {
            borderTopLeftRadius: Number(theme.shape.borderRadius) * 3,
            borderTopRightRadius: Number(theme.shape.borderRadius) * 3,
          },

          '&:last-of-type': {
            borderBottomLeftRadius: Number(theme.shape.borderRadius) * 3,
            borderBottomRightRadius: Number(theme.shape.borderRadius) * 3,
          },
        }),
      },
    },
  },
});

export const lightTheme = generateTheme(themeTokens.light);

export const darkTheme = generateTheme(themeTokens.dark);

export { darkTheme as defaultDarkTheme, lightTheme as defaultLightTheme };
