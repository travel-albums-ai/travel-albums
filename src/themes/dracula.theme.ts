import { generateTheme } from '@/themes/utils';
import { ThemeOptions } from '@mui/material';

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

      primary: {
        main: '#A970FF',
      },

      secondary: {
        main: '#8BE9FD',
      },

      error: {
        main: '#FF5555',
      },

      warning: {
        main: '#FFB86C',
      },

      info: {
        main: '#8BE9FD',
      },

      success: {
        main: '#50FA7B',
      },

      background: {
        default: '#0F1015',
        paper: '#17181E',
      },

      text: {
        primary: '#E8E8ED',
        secondary: '#85879A',
        disabled: '#555766',
      },

      divider: '#292B36',
    },
    typography: {
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
      button: {
        textTransform: 'none',
      }
    },
  } as ThemeOptions,
}

export const lightTheme = generateTheme(themeTokens.light);

export const darkTheme = generateTheme(themeTokens.dark);

export { darkTheme as draculaDarkTheme, lightTheme as draculaLightTheme };
