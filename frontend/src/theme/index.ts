import { createTheme, PaletteMode } from '@mui/material';

const lightPalette = {
  primary: {
    main: '#1976d2',
  },
  secondary: {
    main: '#9c27b0',
  },
};

const darkPalette = {
  primary: {
    main: '#90caf9',
  },
  secondary: {
    main: '#ce93d8',
  },
  background: {
    default: '#121212',
    paper: '#1e1e1e',
  },
};

export const getTheme = (mode: PaletteMode) => 
  createTheme({
    palette: {
      mode,
      ...(mode === 'light' ? lightPalette : darkPalette),
    },
    typography: {
      fontFamily: '"Roboto", sans-serif',
    },
    // ... any other theme customizations
  });
