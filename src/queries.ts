import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
    },
  },
});

export async function prefetchSpices() {
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

export async function prefetchBlends() {
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

export async function prefetchSpice(id: string) {
  try {
    await queryClient.prefetchQuery({
      queryKey: ['spice', id],
      queryFn: async () => {
        const response = await fetch(`/api/v1/spices/${id}`);
        if (!response.ok) {
          console.error('Fetch spice failed with status:', response.status);
          throw new Error(`Status: ${response.status}`);
        }
        const data = await response.json();
        return data;
      },
    });
  } catch (error) {
    console.error('Error in prefetchSpice:', error);
    throw error;
  }
}
