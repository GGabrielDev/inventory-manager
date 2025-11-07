// 🧩 Inicializa i18n antes que cualquier otro import React
import '@/i18n'

import React, { StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'

import AppRouter from '@/routes/AppRouter'

import { AuthProvider } from './context/auth'
import { store } from './store'
import ThemeWrapper from './theme/ThemeWrapper'

// 🌀 Loader simple mientras i18n carga (evita pantalla blanca)
export const LoadingScreen = () => (
  <div
    style={{
      width: '100vw',
      height: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      fontFamily: 'sans-serif',
    }}
  >
    <h3>Loading...</h3>
  </div>
)

const root = document.getElementById('root')

if (root) {
  createRoot(root).render(
    <StrictMode>
      {/* Suspense asegura que la app no se rompa si las traducciones tardan */}
      <Suspense fallback={<LoadingScreen />}>
        <Provider store={store}>
          <BrowserRouter>
            <ThemeWrapper>
              <AuthProvider>
                <AppRouter />
              </AuthProvider>
            </ThemeWrapper>
          </BrowserRouter>
        </Provider>
      </Suspense>
    </StrictMode>
  )
}
