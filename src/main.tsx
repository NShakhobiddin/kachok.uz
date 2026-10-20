import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource-variable/big-shoulders-display';
import '@fontsource-variable/manrope';
import '@fontsource-variable/jetbrains-mono';
import './styles/global.css';
import App from './App';
import { registerPwa } from './lib/pwa';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

registerPwa();
