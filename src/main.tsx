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
  try {
    await queryClient.prefetchQuery({
      queryKey: ['spices'],
      queryFn: async () => {
        const response = await fetch('/api/v1/spices');
        if (!response.ok) {
          console.error('Fetch spices failed with status:', response.status);
          throw new Error(`Status: ${response.status}`);
        }
        const data = await response.json();
        return data;
      },
    });
  } catch (error) {
    console.error('Error in prefetchSpices:', error);
    throw error;
  }
}

async function prefetchBlends() {
  try {
    await queryClient.prefetchQuery({
      queryKey: ['blends'],
      queryFn: async () => {
        const response = await fetch('/api/v1/blends');
        if (!response.ok) {
          console.error('Fetch blends failed with status:', response.status);
          throw new Error(`Status: ${response.status}`);
        }
        const data = await response.json();
        return data;
      },
    });
  } catch (error) {
    console.error('Error in prefetchBlends:', error);
    throw error;
  }
}

async function homeLoader() {
  try {
    await Promise.all([prefetchSpices(), prefetchBlends()]);
    return null;
  } catch (error) {
    console.error('Error in homeLoader:', error);
    throw error;
  }
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
      loader: homeLoader,
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

enableMocking().then(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} future={{ v7_startTransition: true }} />
      </QueryClientProvider>
    </StrictMode>,
  );
});
