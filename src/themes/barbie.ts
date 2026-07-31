import { createTheme } from '@mui/material/styles';

const ACCORDION_BORDER_RADIUS = 16

export const barbieLightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#ff4081' },
    secondary: { main: '#f06292' },
    background: { default: '#fff5fb', paper: '#ffffff' },
  },
  typography: { fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif' },
  components: {
    MuiTextField: {
      defaultProps: { roundness: 'rounded' },
      variants: [
        { props: { roundness: 'full' }, style: { '& .MuiOutlinedInput-root': { borderRadius: 999 } } },
        { props: { roundness: 'rounded' }, style: { '& .MuiOutlinedInput-root': { borderRadius: 24 } } },
        { props: { roundness: 'square' }, style: { '& .MuiOutlinedInput-root': { borderRadius: 0 } } },
      ],
    },
    MuiChip: {
      variants: [
        {
          props: { variant: 'important' },
          style: {
            borderStyle: 'dotted',
            borderColor: '#ff4081',
            backgroundColor: 'rgba(255, 64, 129, 0.08)',
            boxShadow: '0 1px 8px 4px rgba(255, 64, 129, 0.12)',
            color: '#880e4f',
            fontWeight: 600,
          },
        },
      ],
    },
    MuiButton: { styleOverrides: { root: { borderRadius: '24px', textTransform: 'none' } } },
    MuiCard: { styleOverrides: { root: { borderRadius: '16px' } } },
    MuiDrawer: { styleOverrides: { paper: { backgroundColor: 'rgba(255,245,250,0.6)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)' } } },
    MuiPopover: { styleOverrides: { paper: ({ theme }) => ({ backgroundColor: `${theme.palette.background.paper}BD`, backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)' }) } },
    MuiAccordion: { styleOverrides: { root: { '&::before': { display: 'none' }, borderRadius: ACCORDION_BORDER_RADIUS } } },
  },
})

export const barbieDarkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#ff79c6', contrastText: '#2a0710' },
    secondary: { main: '#ff4081', contrastText: '#2a0710' },
    error: { main: '#ff6b6b', contrastText: '#2a0710' },
    warning: { main: '#ffb74d', contrastText: '#2a0710' },
    info: { main: '#4fc3f7', contrastText: '#02182a' },
    success: { main: '#66bb6a', contrastText: '#051207' },
    background: { default: '#1a0a12', paper: '#24121a' },
    text: { primary: '#ffe8f2', secondary: 'rgba(255,232,242,0.72)' },
    divider: 'rgba(255,255,255,0.06)',
    action: {
      active: 'rgba(255,255,255,0.87)',
      hover: 'rgba(255,121,198,0.06)',
      selected: 'rgba(255,121,198,0.12)',
      disabled: 'rgba(255,255,255,0.26)',
      disabledBackground: 'rgba(255,255,255,0.08)',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontWeight: 700, fontSize: '2rem' },
    h2: { fontWeight: 600, fontSize: '1.6rem' },
    h3: { fontWeight: 600, fontSize: '1.375rem' },
    body1: { fontSize: '1rem' },
    body2: { fontSize: '0.875rem' },
  },
  shape: { borderRadius: 12 },
  spacing: 8,
  components: {
    MuiTextField: {
      defaultProps: { roundness: 'rounded' },
      variants: [
        { props: { roundness: 'full' }, style: { '& .MuiOutlinedInput-root': { borderRadius: 999 } } },
        { props: { roundness: 'rounded' }, style: { '& .MuiOutlinedInput-root': { borderRadius: 24 } } },
        { props: { roundness: 'square' }, style: { '& .MuiOutlinedInput-root': { borderRadius: 0 } } },
      ],
    },
    MuiChip: {
      variants: [
        {
          props: { variant: 'important' },
          style: {
            borderStyle: 'dotted',
            borderColor: '#ff79c6',
            backgroundColor: 'rgba(255, 121, 198, 0.12)',
            boxShadow: '0 1px 8px 4px rgba(255, 121, 198, 0.12)',
            color: '#ffe8f2',
            fontWeight: 600,
          },
        },
      ],
    },
    MuiButton: { styleOverrides: { root: { borderRadius: '24px', textTransform: 'none' }, containedPrimary: { boxShadow: '0 6px 18px rgba(255,121,198,0.12)' } } },
    MuiCard: { styleOverrides: { root: { borderRadius: '16px', backgroundClip: 'padding-box' } } },
    MuiDrawer: { styleOverrides: { paper: { backgroundColor: 'rgba(30,10,16,0.5)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)' } } },
    MuiPopover: { styleOverrides: { paper: ({ theme }) => ({ backgroundColor: `${theme.palette.background.paper}BD`, backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)' }) } },
    MuiAppBar: { styleOverrides: { root: { backgroundColor: 'rgba(20,8,12,0.6)', backdropFilter: 'blur(6px)' } } },
    MuiIconButton: { styleOverrides: { root: { color: 'inherit' } } },
    MuiTooltip: { styleOverrides: { tooltip: { backgroundColor: '#2a1620', color: '#ffe8f2', borderRadius: 8, fontSize: '0.875rem' } } },
    MuiPaper: { styleOverrides: { root: { backgroundColor: 'transparent' } } },
    MuiOutlinedInput: { styleOverrides: { root: { borderRadius: 24, backgroundColor: 'rgba(255,255,255,0.01)', color: 'inherit' }, notchedOutline: { borderColor: 'rgba(255,255,255,0.06)' } } },
    MuiInputBase: { styleOverrides: { input: { color: 'inherit' } } },
    MuiListItemButton: { styleOverrides: { root: { borderRadius: 12, '&.Mui-selected': { backgroundColor: 'rgba(255,121,198,0.08)' } } } },
    MuiTabs: { styleOverrides: { indicator: { backgroundColor: '#ff79c6' } } },
    MuiTab: { styleOverrides: { root: { textTransform: 'none' } } },
    MuiSnackbar: { styleOverrides: { root: { maxWidth: 'min(640px, 92vw)' } } },
    MuiFormLabel: { styleOverrides: { root: { color: 'rgba(255,232,242,0.7)' } } },
    MuiSwitch: { styleOverrides: { switchBase: { color: 'rgba(255,255,255,0.6)' }, track: { backgroundColor: 'rgba(255,255,255,0.08)' } } },
    MuiCheckbox: { styleOverrides: { root: { color: 'rgba(255,255,255,0.86)' } } },
    MuiRadio: { styleOverrides: { root: { color: 'rgba(255,255,255,0.86)' } } },
    MuiAccordion: { styleOverrides: { root: { '&::before': { display: 'none' }, border: 0, borderRadius: ACCORDION_BORDER_RADIUS } } },
  },
})
