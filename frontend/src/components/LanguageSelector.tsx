import { Button, ButtonGroup, Tooltip, useTheme } from '@mui/material';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import i18n from '@/i18n'; // 👈 asegúrate que el path sea correcto

console.log('🌐 Current language:', i18n.language)

// 🌐 Idiomas soportados
const LANGS = [
  { code: 'en', label: 'EN', name: 'English' },
  { code: 'es', label: 'ES', name: 'Español' },
];

// 🎛️ Centralizamos el cambio y persistencia del idioma
function setLanguage(lng: string) {
  i18n.changeLanguage(lng);
  localStorage.setItem('language', lng);
  document.documentElement.lang = lng;
  document.documentElement.dir = i18n.dir(lng);
}

const LanguageSelector: React.FC = () => {
  const { i18n } = useTranslation();
  const theme = useTheme();
  const currentLang = i18n.language?.split('-')[0] || 'es';

  // 💅 Estilos dinámicos según modo claro/oscuro
  const buttonStyles = useMemo(
    () => ({
      textTransform: 'uppercase',
      fontWeight: 600,
      minWidth: 40,
      borderColor:
        theme.palette.mode === 'dark'
          ? theme.palette.grey[700]
          : theme.palette.grey[300],
      '&.MuiButton-contained': {
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.common.white,
        '&:hover': {
          backgroundColor: theme.palette.primary.dark,
        },
      },
    }),
    [theme]
  );

  return (
    <ButtonGroup
      variant="outlined"
      size="small"
      aria-label="Language selector"
      sx={{
        boxShadow: 'none',
        borderRadius: 2,
        overflow: 'hidden',
      }}
    >
      {LANGS.map(({ code, label, name }) => (
        <Tooltip key={code} title={name} arrow>
          <Button
            onClick={() => setLanguage(code)} // 👈 aquí usamos la función optimizada
            variant={currentLang === code ? 'contained' : 'outlined'}
            aria-pressed={currentLang === code}
            aria-label={`Switch to ${name}`}
            sx={buttonStyles}
          >
            {label}
          </Button>
        </Tooltip>
      ))}
    </ButtonGroup>
  );
};

export default LanguageSelector;
