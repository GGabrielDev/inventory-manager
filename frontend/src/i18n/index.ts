import i18n, { type InitOptions } from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import HttpBackend from 'i18next-http-backend'
import { initReactI18next } from 'react-i18next'

// ⚙️ Configuración avanzada de i18next
i18n
  .use(HttpBackend) // Carga los archivos JSON dinámicamente desde /public/locales
  .use(LanguageDetector) // Detecta idioma desde navegador, localStorage, URL, etc.
  .use(initReactI18next) // Integra con React
  .init({
    // 🌍 Idiomas soportados
    supportedLngs: ['en', 'es'],
    fallbackLng: 'es',

    // 🔠 Namespaces — separa traducciones por contexto
    ns: ['common', 'auth', 'dashboard', 'users', 'roles'],
    defaultNS: 'common',

    // 📦 Ruta pública de los archivos JSON
    backend: {
      // ✅ Asegúrate de tener /public/locales/{lng}/{ns}.json
      loadPath: '/locales/{{lng}}/{{ns}}.json',
      crossDomain: false,
    },

    // 🧭 Detección automática del idioma
    detection: {
      order: ['localStorage', 'querystring', 'cookie', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'language',
      lookupQuerystring: 'lang',
      lookupCookie: 'i18next',
      checkWhitelist: true,
      ignoreCase: true,
    },

    // 🧩 Interpolación segura (React ya maneja escape)
    interpolation: {
      escapeValue: false,
    },

    // ⚡️ Integración con React
    react: {
      useSuspense: true,
      bindI18n: 'languageChanged loaded',
      bindI18nStore: 'added removed',
    },

    // 🧪 Solo muestra logs si estás en modo desarrollo
    debug: import.meta.env.MODE === 'development',
  } as InitOptions)

export default i18n
