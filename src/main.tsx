import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource-variable/archivo/wdth.css';
import '@fontsource-variable/manrope';
import './styles/global.css';
import App from './App';
import { ErrorBoundary } from './components/ErrorBoundary';
import { registerPwa } from './lib/pwa';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
);

registerPwa();
