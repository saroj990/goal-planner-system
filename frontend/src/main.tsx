import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { AppProviders } from './app/providers';
import { AppShell } from './app/AppShell';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppProviders>
      <AppShell />
    </AppProviders>
  </StrictMode>,
);
