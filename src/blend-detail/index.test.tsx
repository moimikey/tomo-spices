import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '../queries';
import { data as mockBlends } from '../mocks/data/blends';
import { data as mockSpices } from '../mocks/data/spices';
import BlendDetail from '.';

beforeEach(async () => {
  queryClient.clear();

  const blends = mockBlends();
  queryClient.setQueryData(['blend'], blends);

  const spices = mockSpices();
  queryClient.setQueryData(['spice'], spices);
  queryClient.refetchQueries();
});

const renderBlendDetail = (blendId: string) => {
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[`/blends/${blendId}`]}>
        <Routes>
          <Route path="/blends/:id" element={<BlendDetail />} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  );
};

describe('BlendDetail', () => {
  it('renders basic blend details correctly', async () => {
    renderBlendDetail('0');

    await waitFor(() => {
      const blendName = screen.getByText(/Blend Name:/);
      expect(blendName).toBeInTheDocument();
      // expect(blendName.textContent).toBe('Blend Name: Tasty Blend');
    });
  });

  it.skip('resolves and displays spices correctly', async () => {
    renderBlendDetail('0');

    // The first blend has spices [1, 5, 35, 52]
    await waitFor(() => {
      const spicesList = screen.getByText(/Spices:/);
      expect(spicesList).toBeInTheDocument();
    });

    // Check that all spice links are rendered
    // const spices = mockSpices();
    // const blend = mockBlends()[0];

    // for (const spiceId of blend.spices) {
    //   const spice = spices.find((s) => s.id === spiceId);
    //   if (spice) {
    //     expect(screen.getByText(spice.name)).toBeInTheDocument();
    //   }
    // }
  });

  it.skip('resolves and displays nested blends correctly', async () => {
    // Use blend ID 2 which has nested blends [0, 1]
    renderBlendDetail('2');

    await waitFor(() => {
      expect(screen.getByText('Child Blends:')).toBeInTheDocument();
    });

    // Check that nested blend links are rendered
    const blends = mockBlends();
    const metaBlend = blends.find((b) => b.id === 2);

    for (const nestedBlendId of metaBlend!.blends) {
      const nestedBlend = blends.find((b) => b.id === nestedBlendId);
      if (nestedBlend) {
        expect(screen.getByText(nestedBlend.name)).toBeInTheDocument();
      }
    }
  });

  it.skip('handles non-existent blend IDs gracefully', async () => {
    renderBlendDetail('999');

    // Since the blend doesn't exist, we should still see the header but no data
    expect(screen.getByText('Blend Detail Page')).toBeInTheDocument();

    // The blend name should not be visible since the data is undefined
    await waitFor(() => {
      expect(screen.queryByText(/Blend Name:/)).not.toBeInTheDocument();
    });
  });
});
