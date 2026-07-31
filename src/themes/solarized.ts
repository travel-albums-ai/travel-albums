import { createTheme } from '@mui/material/styles'

const ACCORDION_BORDER_RADIUS = 16

export const solarizedLightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#268bd2' },
    secondary: { main: '#2aa198' },
    background: { default: '#fdf6e3', paper: '#ffffff' },
  },
  typography: { fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif' },
  components: {
    MuiTextField: { defaultProps: { roundness: 'rounded' }, variants: [ { props: { roundness: 'full' }, style: { '& .MuiOutlinedInput-root': { borderRadius: 999 } } }, { props: { roundness: 'rounded' }, style: { '& .MuiOutlinedInput-root': { borderRadius: 24 } } }, { props: { roundness: 'square' }, style: { '& .MuiOutlinedInput-root': { borderRadius: 0 } } } ] },
    MuiChip: {
      variants: [
        {
          props: { variant: 'important' },
          style: {
            borderStyle: 'dotted',
            borderColor: '#268bd2',
            backgroundColor: 'rgba(38,139,210,0.08)',
            boxShadow: '0 1px 8px 4px rgba(38,139,210,0.12)',
            color: '#073642',
            fontWeight: 600,
          },
        },
      ],
    },
    MuiButton: { styleOverrides: { root: { borderRadius: '24px', textTransform: 'none' } } },
    MuiCard: { styleOverrides: { root: { borderRadius: '16px' } } },
    MuiDrawer: { styleOverrides: { paper: { backgroundColor: 'rgba(253,246,227,0.6)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)' } } },
    MuiPopover: { styleOverrides: { paper: ({ theme }) => ({ backgroundColor: `${theme.palette.background.paper}BD`, backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)' }) } },
    MuiAccordion: { styleOverrides: { root: { '&::before': { display: 'none' }, borderRadius: ACCORDION_BORDER_RADIUS } } },
  },
})

export const solarizedDarkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#268bd2' },
    secondary: { main: '#2aa198' },
    background: { default: '#002b36', paper: '#073642' },
  },
  typography: { fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif' },
  components: {
    MuiTextField: { defaultProps: { roundness: 'rounded' }, variants: [ { props: { roundness: 'full' }, style: { '& .MuiOutlinedInput-root': { borderRadius: 999 } } }, { props: { roundness: 'rounded' }, style: { '& .MuiOutlinedInput-root': { borderRadius: 24 } } }, { props: { roundness: 'square' }, style: { '& .MuiOutlinedInput-root': { borderRadius: 0 } } } ] },
    MuiChip: {
      variants: [
        {
          props: { variant: 'important' },
          style: {
            borderStyle: 'dotted',
            borderColor: '#268bd2',
            backgroundColor: 'rgba(38,139,210,0.12)',
            boxShadow: '0 1px 8px 4px rgba(38,139,210,0.12)',
            color: '#fdf6e3',
            fontWeight: 600,
          },
        },
      ],
    },
    MuiButton: { styleOverrides: { root: { borderRadius: '24px', textTransform: 'none' } } },
    MuiCard: { styleOverrides: { root: { borderRadius: '16px' } } },
    MuiDrawer: { styleOverrides: { paper: { backgroundColor: 'rgba(0,43,54,0.6)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)' } } },
    MuiPopover: { styleOverrides: { paper: ({ theme }) => ({ backgroundColor: `${theme.palette.background.paper}BD`, backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)' }) } },
    MuiAccordion: { styleOverrides: { root: { '&::before': { display: 'none' }, border: 0, borderRadius: ACCORDION_BORDER_RADIUS } } },
  },
})
