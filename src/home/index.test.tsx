import { render, screen } from '@testing-library/react';
import Home from './index';
import { MemoryRouter } from 'react-router-dom';

test('renders home page', async () => {
  render(
    <MemoryRouter future={{ v7_startTransition: true }}>
      <Home />
    </MemoryRouter>,
  );

  expect(
    screen.getByRole('heading', {
      name: /spice list/i,
    }),
  ).toBeInTheDocument();
});
