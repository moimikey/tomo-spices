import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Home from './home/index.tsx';
import SpiceDetail from './spice-detail/index.tsx';
import BlendDetail from './blend-detail/index.tsx';
import './main.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
    },
  },
});

async function prefetchSpices() {
  await queryClient.prefetchQuery({
    queryKey: ['spices'],
    queryFn: async () => {
      const response = await fetch('/api/v1/spices');
      return response.json();
    },
  });
}

async function prefetchBlends() {
  await queryClient.prefetchQuery({
    queryKey: ['blends'],
    queryFn: async () => {
      const response = await fetch('/api/v1/blends');
      return response.json();
    },
  });
}

async function enableMocking() {
  const { worker } = await import('./mocks/browser');
  return worker.start();
}

const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <Home />,
      errorElement: <Home />,
    },
    {
      path: '/spices/:id',
      element: <SpiceDetail />,
    },
    {
      path: '/blends/:id',
      element: <BlendDetail />,
    },
  ],
  {
    future: {
      v7_relativeSplatPath: true,
    },
  },
);

enableMocking()
  .then(() => Promise.all([prefetchSpices(), prefetchBlends()]))
  .then(() => {
    createRoot(document.getElementById('root')!).render(
      <StrictMode>
        <QueryClientProvider client={queryClient}>
          <RouterProvider
            router={router}
            future={{ v7_startTransition: true }}
          />
        </QueryClientProvider>
      </StrictMode>,
    );
  });
