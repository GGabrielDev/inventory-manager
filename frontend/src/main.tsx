import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider} from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

import App from './App.tsx'
import { store } from './store'
import ThemeWrapper from './theme/ThemeWrapper';

const root = document.getElementById('root');

if (root) createRoot(root).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <ThemeWrapper>
          <App />
        </ThemeWrapper>
      </BrowserRouter>
    </Provider>
  </StrictMode>,
)
