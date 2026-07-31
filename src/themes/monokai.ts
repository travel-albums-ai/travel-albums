import { createTheme } from '@mui/material/styles'

const ACCORDION_BORDER_RADIUS = 16

export const monokaiLightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#f92672' },
    secondary: { main: '#fd971f' },
    background: { default: '#f8f8f2', paper: '#ffffff' },
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
            borderColor: '#f92672',
            backgroundColor: 'rgba(249,38,114,0.08)',
            boxShadow: '0 1px 8px 4px rgba(249,38,114,0.12)',
            color: '#2b2a26',
            fontWeight: 600,
          },
        },
      ],
    },
    MuiButton: { styleOverrides: { root: { borderRadius: '24px', textTransform: 'none' } } },
    MuiCard: { styleOverrides: { root: { borderRadius: '16px' } } },
    MuiDrawer: { styleOverrides: { paper: { backgroundColor: 'rgba(248,248,242,0.6)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)' } } },
    MuiPopover: { styleOverrides: { paper: ({ theme }) => ({ backgroundColor: `${theme.palette.background.paper}BD`, backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)' }) } },
    MuiAccordion: { styleOverrides: { root: { '&::before': { display: 'none' }, borderRadius: ACCORDION_BORDER_RADIUS } } },
  },
})

export const monokaiDarkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#f92672' },
    secondary: { main: '#a6e22e' },
    background: { default: '#272822', paper: '#3a3a2a' },
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
            borderColor: '#f92672',
            backgroundColor: 'rgba(249,38,114,0.12)',
            boxShadow: '0 1px 8px 4px rgba(249,38,114,0.12)',
            color: '#f8f8f2',
            fontWeight: 600,
          },
        },
      ],
    },
    MuiButton: { styleOverrides: { root: { borderRadius: '24px', textTransform: 'none' } } },
    MuiCard: { styleOverrides: { root: { borderRadius: '16px' } } },
    MuiDrawer: { styleOverrides: { paper: { backgroundColor: 'rgba(39,40,34,0.6)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)' } } },
    MuiPopover: { styleOverrides: { paper: ({ theme }) => ({ backgroundColor: `${theme.palette.background.paper}BD`, backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)' }) } },
    MuiAccordion: { styleOverrides: { root: { '&::before': { display: 'none' }, border: 0, borderRadius: ACCORDION_BORDER_RADIUS } } },
  },
})
