import { createBrowserRouter } from 'react-router-dom';
import Home from './home';
import BlendDetail from './blend-detail';
import SpiceDetail from './spice-detail';

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
