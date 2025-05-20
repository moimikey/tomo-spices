import { createBrowserRouter } from 'react-router-dom';
import { prefetchBlends, prefetchSpices } from './queries';
import Home from './home';
import BlendDetail from './blend-detail';
import SpiceDetail from './spice-detail';

export async function homeLoader() {
  try {
    await Promise.all([prefetchSpices(), prefetchBlends()]);
    return null;
  } catch (error) {
    console.error('Error in homeLoader:', error);
    throw error;
  }
}

export const routeObjects = [
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/spices/:id',
    element: <SpiceDetail />,
  },
  {
    path: '/blends/:id',
    element: <BlendDetail />,
  },
];

export const router = createBrowserRouter(routeObjects, {
  future: {
    v7_relativeSplatPath: true,
  },
});
