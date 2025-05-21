import { render, screen } from '@testing-library/react';
import Home from './index';
import { MemoryRouter } from 'react-router-dom';

test('renders home page with a list of spice blends', async () => {
  render(
    <MemoryRouter future={{ v7_startTransition: true }}>
      <Home />
    </MemoryRouter>,
  );

  expect(
    screen.getByRole('heading', {
      name: /a lovely list of spice blends!/i,
    }),
  ).toBeInTheDocument();
});
