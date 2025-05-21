import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { router } from './router';
import { queryClient } from './queries';
import { ThemeProvider } from './theme-provider';
import './main.css';

async function enableMocking() {
  const { worker } = await import('./mocks/browser');
  return worker.start();
}

enableMocking()
  // @TODO: Uncomment this to enable loading data on initial page load; import `homeLoader` from `router.tsx`
  // .then(() => homeLoader())
  .then(() => {
    createRoot(document.getElementById('root')!).render(
      <StrictMode>
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
          <QueryClientProvider client={queryClient}>
            <RouterProvider
              router={router}
              future={{ v7_startTransition: true }}
            />
          </QueryClientProvider>
        </ThemeProvider>
      </StrictMode>,
    );
  })
  .catch((error) => {
    console.error('Error in main.tsx:', error);
    throw error;
  });
