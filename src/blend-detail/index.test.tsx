import { vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '../queries';
import { data as mockBlendsData } from '../mocks/data/blends';
import { data as mockSpicesData } from '../mocks/data/spices';
import { Blend } from '../types';
import BlendDetail from '.';

vi.mock('@tanstack/react-db', () => ({
  useLiveQuery: vi.fn(),
}));

// Import the mocked version of useLiveQuery after vi.mock
import { useLiveQuery } from '@tanstack/react-db';

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
  let callCount = 0;

  const allMockBlends = mockBlendsData();
  const allMockSpices = mockSpicesData();

  beforeEach(() => {
    vi.clearAllMocks();
    queryClient.clear();
    callCount = 0;

    const mockedUseLiveQuery = useLiveQuery as ReturnType<typeof vi.fn>;

    mockedUseLiveQuery.mockImplementation((_queryBuilder, deps) => {
      callCount++;
      if (callCount === 1) {
        const blendIdToFind = deps && deps.length > 0 ? deps[0] : undefined;
        if (typeof blendIdToFind === 'number') {
          const foundBlend = allMockBlends.find(
            (b: Blend) => b.id === blendIdToFind,
          );
          return { data: foundBlend ? [foundBlend] : [] };
        }
        return { data: [] };
      } else if (callCount === 2) {
        return { data: allMockSpices };
      } else if (callCount === 3) {
        return { data: allMockBlends };
      }
      return { data: [] };
    });
  });

  it('renders basic blend details correctly for different blend IDs', async () => {
    // Render the first blend
    renderBlendDetail('0');
    await waitFor(() => {
      const tastyBlendData = allMockBlends.find((b) => b.id === 0);
      expect(
        tastyBlendData,
        'Missing blend: Tasty Blend (id: 0)',
      ).toBeDefined();
      expect(screen.getByText(tastyBlendData!.name)).toBeInTheDocument();
    });

    // Render a different blend
    callCount = 0;
    renderBlendDetail('1');
    await waitFor(() => {
      const sweetBlendData = allMockBlends.find((b) => b.id === 1);
      expect(
        sweetBlendData,
        'Missing blend: Sweet Blend (id: 1)',
      ).toBeDefined();
      expect(screen.getByText(sweetBlendData!.name)).toBeInTheDocument();
    });
  });

  it('displays the correct spices for a given blend', async () => {
    const blendIdToTest = 0;
    renderBlendDetail(String(blendIdToTest));

    const targetBlend = allMockBlends.find((b) => b.id === blendIdToTest);
    expect(
      targetBlend,
      `Blend ID ${blendIdToTest} not found in data`,
    ).toBeDefined();
    expect(
      targetBlend!.spices,
      `Blend ID ${blendIdToTest} has no spices`,
    ).toBeDefined();
    expect(targetBlend!.spices.length).toBeGreaterThan(0);

    await waitFor(() => {
      for (const spiceId of targetBlend!.spices) {
        const spiceInfo = allMockSpices.find((s) => s.id === spiceId);
        expect(
          spiceInfo,
          `Spice ID ${spiceId} not found in data`,
        ).toBeDefined();
        expect(screen.getByText(spiceInfo!.name)).toBeInTheDocument();
      }
    });

    // test a *different* blend
    // callCount = 0;
    // const secondBlendIdToTest = 2;

    // renderBlendDetail(String(secondBlendIdToTest));
    // const secondTargetBlend = allMockBlends.find(
    //   (b) => b.id === secondBlendIdToTest,
    // );
    // expect(secondTargetBlend).toBeDefined();
    // await waitFor(() => {
    //   for (const spiceId of secondTargetBlend!.spices) {
    //     const spiceInfo = allMockSpices.find((s) => s.id === spiceId);
    //     expect(spiceInfo).toBeDefined();
    //     expect(screen.getByText(spiceInfo!.name)).toBeInTheDocument();
    //   }
    // });
  });
});
