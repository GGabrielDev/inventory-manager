import { Button, ButtonGroup, Tooltip } from '@mui/material';
import { useTranslation } from 'react-i18next';

const LanguageSelector: React.FC = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('user-language', lng);
  };

  return (
    <ButtonGroup variant="outlined" size="medium" aria-label="language selector">
      <Tooltip title={i18n.t('language_english')}>
        <Button
          onClick={() => changeLanguage('en')}
          variant={i18n.language === 'en' ? 'contained' : 'outlined'}
        >
          EN
        </Button>
      </Tooltip>
      <Tooltip title={i18n.t('language_spanish')}>
        <Button
          onClick={() => changeLanguage('es')}
          variant={i18n.language === 'es' ? 'contained' : 'outlined'}
        >
          ES
        </Button>
      </Tooltip>
    </ButtonGroup>
  );
};

export default LanguageSelector;