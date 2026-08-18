import { ThemeOptions } from '@mui/material';
import { createTheme } from '@mui/material/styles';

const ACCORDION_BORDER_RADIUS = 16;

export const defaultThemeTokens = {
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
      primary: { main: '#90caf9' },
      secondary: { main: '#f48fb1' },
      background: { default: '#373737', paper: '#2c2c2c' },
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


export const generateTheme = (tokens) => createTheme({
  ...tokens.dark,

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
        root: {
          backdropFilter: 'blur(0px) !important',
          WebkitBackdropFilter: 'blur(0px) !important',
        },

        paper: {
          background: 'transparent',
          backgroundImage: 'none',
          borderRadius: 8,
          boxShadow: '0px 0px 12px 4px rgba(0, 0, 0, 0.5)',
          overflow: 'hidden',
        },

        backdrop: {
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          backdropFilter: 'blur(0px)',
          WebkitBackdropFilter: 'blur(0px)',
        },
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


export const defaultLightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#1976d2' },
    secondary: { main: '#dc004e' },
    background: {
      default: '#fafafa',
      paper: '#ffffff',
    },
  },

  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },

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

    // MuiChip: {
    //   variants: [
    //     {
    //       props: { variant: 'important' },
    //       style: {
    //         borderStyle: 'dotted',
    //         borderColor: '#1976d2',
    //         backgroundColor: 'rgba(25, 118, 210, 0.1)',
    //         boxShadow: '0 1px 8px 4px rgba(25, 118, 210, 0.2)',
    //         color: '#0d47a1',
    //         fontWeight: 600,
    //       },
    //     },
    //   ],
    // },

    MuiDialog: {
      styleOverrides: {
        // Ported from dark theme
        root: {
          backdropFilter: 'blur(0px) !important',
          WebkitBackdropFilter: 'blur(0px) !important',
        },

        // Ported from dark theme, while retaining transparent light styling
        paper: {
          background: 'transparent',
          backgroundImage: 'none',
          borderRadius: 8,
          boxShadow: '0px 0px 12px 4px rgba(0, 0, 0, 0.5)',
          overflow: 'hidden',
        },

        // Ported from dark theme, but with light-theme backdrop
        backdrop: {
          backgroundColor: 'rgba(255, 255, 255, 0.5)',
          backdropFilter: 'blur(0px)',
          WebkitBackdropFilter: 'blur(0px)',
        },
      },
    },

    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          textTransform: 'none',
        },
      },
    },

    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '16px',
        },
      },
    },

    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: 'rgba(255, 255, 255, 0.4)',
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
          WebkitBackdropFilter: 'blur(16px)',
        }),
      },
    },

    MuiAccordion: {
      styleOverrides: {
        root: {
          '&::before': {
            display: 'none',
          },

          // Ported from dark theme
          border: 0,

          borderRadius: ACCORDION_BORDER_RADIUS,

          '&:first-of-type': {
            borderTopLeftRadius: ACCORDION_BORDER_RADIUS,
            borderTopRightRadius: ACCORDION_BORDER_RADIUS,
          },

          '&:last-of-type': {
            borderBottomLeftRadius: ACCORDION_BORDER_RADIUS,
            borderBottomRightRadius: ACCORDION_BORDER_RADIUS,
          },
        },
      },
    },
  },
});

export const defaultDarkTheme = createTheme({
  ...defaultThemeTokens.dark,

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
        root: {
          backdropFilter: 'blur(0px) !important',
          WebkitBackdropFilter: 'blur(0px) !important',
        },

        paper: {
          background: 'transparent',
          backgroundImage: 'none',
          borderRadius: 8,
          boxShadow: '0px 0px 12px 4px rgba(0, 0, 0, 0.5)',
          overflow: 'hidden',
        },

        backdrop: {
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          backdropFilter: 'blur(0px)',
          WebkitBackdropFilter: 'blur(0px)',
        },
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
