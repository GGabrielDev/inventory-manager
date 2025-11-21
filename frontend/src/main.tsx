// Inicializa i18n antes que cualquier otro import React
/**
 * i18n debe inicializarse antes que cualquier otro módulo de React.
 *
 * Razones:
 * 1. React-i18next usa Suspense para cargar traducciones de forma asíncrona.
 *    Si i18n se carga después, los componentes que llaman `t()` pueden renderizar
 *    antes de que las traducciones estén listas → errores, textos vacíos o fallback incorrecto.
 *
 * 2. i18n define el idioma inicial, la dirección del documento (LTR/RTL)
 *    y las reglas de pluralización. Esto debe estar disponible ANTES de que
 *    React monte el árbol de componentes, para evitar re-render inútiles.
 *
 * 3. Cargar i18n al inicio garantiza consistencia: la app arranca con el idioma correcto,
 *    sin parpadeos ni "pantalla blanca" causada por inicialización tardía.
 *
 * Por eso este import se coloca antes de cualquier import de React.
 */

import '@/i18n'

import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'

import AppRouter from '@/routes/AppRouter'
import { AuthProvider } from './context/auth'
import { store } from './store'
import ThemeWrapper from './theme/ThemeWrapper'
import { I18nProvider } from './i18n/I18nProvider'

const root = document.getElementById('root')

if (root) {
  createRoot(root).render(
    <StrictMode>
      <I18nProvider>
        <Provider store={store}>
          <BrowserRouter>
            <ThemeWrapper>
              <AuthProvider>
                <AppRouter />
              </AuthProvider>
            </ThemeWrapper>
          </BrowserRouter>
        </Provider>
      </I18nProvider>
    </StrictMode>
  )
}
