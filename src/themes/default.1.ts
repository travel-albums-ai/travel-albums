import { createTheme } from '@mui/material/styles';

const ACCORDION_BORDER_RADIUS = 16

export const defaultThemeTokens = {
  accordionBorderRadius: ACCORDION_BORDER_RADIUS,
  typography: { fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif' },
  light: {
    palette: {
      mode: 'light',
      primary: { main: '#1976d2' },
      secondary: { main: '#dc004e' },
      background: { default: '#fafafa', paper: '#ffffff' },
    },
    chipImportant: {
      borderColor: '#1976d2',
      backgroundColor: 'rgba(25, 118, 210, 0.1)',
      boxShadow: '0 1px 8px 4px rgba(25, 118, 210, 0.2)',
      color: '#0d47a1',
    },
    drawerPaperBg: 'rgba(255,255,255,0.4)',
  },
  dark: {
    palette: {
      mode: 'dark',
      primary: { main: '#90caf9' },
      secondary: { main: '#f48fb1' },
      background: { default: '#373737', paper: '#2c2c2c' },
    },
    chipImportant: {
      borderColor: '#90caf9',
      backgroundColor: 'rgba(144, 202, 249, 0.15)',
      boxShadow: '0 1px 8px 4px rgba(144, 202, 249, 0.2)',
      color: '#e3f2fd',
    },
    drawerPaperBg: 'rgba(30,30,30,0.4)',
  },
}

export const defaultLightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#1976d2' },
    secondary: { main: '#dc004e' },
    background: { default: '#fafafa', paper: '#ffffff' },
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
      defaultProps: { roundness: 'rounded' },
      variants: [
        { props: { roundness: 'full' }, style: { '& .MuiOutlinedInput-root': { borderRadius: 8 } } },
        { props: { roundness: 'rounded' }, style: { '& .MuiOutlinedInput-root': { borderRadius: 8 } } },
        { props: { roundness: 'square' }, style: { '& .MuiOutlinedInput-root': { borderRadius: 8 } } },
      ],
    },
    MuiChip: {
      variants: [
        {
          props: { variant: 'important' },
          style: {
            borderStyle: 'dotted',
            borderColor: '#1976d2',
            backgroundColor: 'rgba(25, 118, 210, 0.1)',
            boxShadow: '0 1px 8px 4px rgba(25, 118, 210, 0.2)',
            color: '#0d47a1',
            fontWeight: 600,
          },
        },
      ],
    },
    MuiDialog: {
      styleOverrides: {
        // root: {
        //   backdropFilter: 'blur(12px)',
        //   WebkitBackdropFilter: 'blur(12px)',
        // },
        paper: {
          background: 'transparent',
          backgroundImage: 'none',
          boxShadow: 'none',
          overflow: 'hidden',
        },
        backdrop: {
          backdropFilter: 'blur(2px)',
          WebkitBackdropFilter: 'blur(2px)',
        }
      },
    },
    MuiButton: { styleOverrides: { root: { borderRadius: '8px', textTransform: 'none' } } },
    MuiCard: { styleOverrides: { root: { borderRadius: '16px' } } },
    MuiDrawer: { styleOverrides: { paper: { backgroundColor: 'rgba(255,255,255,0.4)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)' } } },
    MuiPopover: { styleOverrides: { paper: ({ theme }) => ({ backgroundColor: `${theme.palette.background.paper}BD`, backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)' }) } },
    MuiAccordion: { styleOverrides: { root: { '&::before': { display: 'none' }, borderRadius: ACCORDION_BORDER_RADIUS, '&:first-of-type': { borderTopLeftRadius: ACCORDION_BORDER_RADIUS, borderTopRightRadius: ACCORDION_BORDER_RADIUS }, '&:last-of-type': { borderBottomLeftRadius: ACCORDION_BORDER_RADIUS, borderBottomRightRadius: ACCORDION_BORDER_RADIUS } } } },
  },
})

export const defaultDarkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#90caf9' },
    secondary: { main: '#f48fb1' },
    background: { default: '#373737', paper: '#2c2c2c' },
  },
  typography: { fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif' },
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
      defaultProps: { roundness: 'rounded' },
      variants: [
        { props: { roundness: 'full' }, style: { '& .MuiOutlinedInput-root': { borderRadius: 8 } } },
        { props: { roundness: 'rounded' }, style: { '& .MuiOutlinedInput-root': { borderRadius: 8 } } },
        { props: { roundness: 'square' }, style: { '& .MuiOutlinedInput-root': { borderRadius: 8 } } },
      ],
    },
    MuiChip: {
      variants: [
        {
          props: { variant: 'important' },
          style: {
            borderStyle: 'dotted',
            borderColor: '#90caf9',
            backgroundColor: 'rgba(144, 202, 249, 0.15)',
            boxShadow: '0 1px 8px 4px rgba(144, 202, 249, 0.2)',
            color: '#e3f2fd',
            fontWeight: 600,
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
        paper: ({theme}) => ({
          background: 'transparent',
          backgroundImage: 'none',
          borderRadius: 8,
          boxShadow: '0px 0px 12px 4px rgba(0,0,0,0.5)',
          overflow: 'hidden',
        }),
        backdrop: {
          backgroundColor: 'rgba(0,0,0,0.5)',
          backdropFilter: 'blur(0px)',
          WebkitBackdropFilter: 'blur(0px)',
        }
      },
    },
    MuiButton: { styleOverrides: { root: { borderRadius: '8px', textTransform: 'none' } } },
    MuiCard: { styleOverrides: { root: { borderRadius: '16px' } } },
    MuiDrawer: { styleOverrides: { paper: { backgroundColor: 'rgba(30,30,30,0.4)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)' } } },
    MuiPopover: { styleOverrides: { paper: ({ theme }) => ({ backgroundColor: `${theme.palette.background.paper}BD`, backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)' }) } },
    MuiAccordion: { styleOverrides: { root: { '&::before': { display: 'none' }, border: 0, borderRadius: ACCORDION_BORDER_RADIUS, '&:first-of-type': { borderTopLeftRadius: ACCORDION_BORDER_RADIUS, borderTopRightRadius: ACCORDION_BORDER_RADIUS }, '&:last-of-type': { borderBottomLeftRadius: ACCORDION_BORDER_RADIUS, borderBottomRightRadius: ACCORDION_BORDER_RADIUS } } } },
  },
})
