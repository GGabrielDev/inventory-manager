import { IconButton, useTheme } from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { useThemeMode } from '../theme/ThemeContext';

export function ThemeToggle() {
  const { toggleThemeMode, mode } = useThemeMode();
  const theme = useTheme();

  return (
    <IconButton onClick={toggleThemeMode} color="inherit">
      {mode === 'dark' ? (
        <Brightness7Icon sx={{ color: theme.palette.warning.main }} />
      ) : (
        <Brightness4Icon />
      )}
    </IconButton>
  );
}
