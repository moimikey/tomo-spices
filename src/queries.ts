import { createQueryCollection } from '@tanstack/db-collections';
import { QueryClient } from '@tanstack/react-query';
import { BlendSchema, Blend, Spice, SpiceSchema } from './types';

/**
 * Query client for the app - configured for SSR
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    },
  },
});

/**
 * Query functions
 */
export async function fetchSpicesQueryFn() {
  const response = await fetch('/api/v1/spices');
  if (!response.ok) {
    console.error('Fetch spices failed with status:', response.status);
    throw new Error(`Status: ${response.status}`);
  }
  return response.json();
}

export async function fetchBlendsQueryFn() {
  const response = await fetch('/api/v1/blends');
  if (!response.ok) {
    console.error('Fetch blends failed with status:', response.status);
    throw new Error(`Status: ${response.status}`);
  }
  return response.json();
}

export async function fetchBlendByIdQueryFn(id?: string) {
  if (!id) throw new Error('Blend ID is missing');

  const response = await fetch(`/api/v1/blends/${id}`);
  if (!response.ok) {
    console.error('Fetch blend failed with status:', response.status);
    throw new Error(`Status: ${response.status}`);
  }

  const data = await response.json();
  return data;
}

export async function fetchSpiceByIdQueryFn(id?: string) {
  if (!id) throw new Error('Spice ID is missing');

  const response = await fetch(`/api/v1/spices/${id}`);
  if (!response.ok) {
    console.error('Fetch spice failed with status:', response.status);
    throw new Error(`Status: ${response.status}`);
  }

  const data = await response.json();
  return data;
}

/**
 * Query collections
 */
export const spiceCollection = createQueryCollection<Spice, Error>({
  id: 'spice',
  queryClient,
  queryKey: ['spice'],
  queryFn: fetchSpicesQueryFn,
  getId: (spice) => spice.id.toString(),
  schema: SpiceSchema,
});

export const blendCollection = createQueryCollection<Blend, Error>({
  id: 'blend',
  queryClient,
  queryKey: ['blend'],
  queryFn: fetchBlendsQueryFn,
  getId: (blend) => blend.id.toString(),
  schema: BlendSchema,
});

/**
 * Prefetch functions with proper promise handling
 */
export async function prefetchSpices() {
  try {
    const data = await queryClient.fetchQuery({
      queryKey: ['spices'],
      queryFn: fetchSpicesQueryFn,
    });
    queryClient.setQueryData(['spices'], data);
    return data;
  } catch (error) {
    console.error('Error in prefetchSpices:', error);
    throw error;
  }
}

export async function prefetchBlends() {
  try {
    const data = await queryClient.fetchQuery({
      queryKey: ['blends'],
      queryFn: fetchBlendsQueryFn,
    });
    queryClient.setQueryData(['blends'], data);
    return data;
  } catch (error) {
    console.error('Error in prefetchBlends:', error);
    throw error;
  }
}

export async function prefetchBlendById(id?: string) {
  if (!id) throw new Error('Blend ID is missing');

  try {
    await queryClient.prefetchQuery({
      queryKey: ['blend', id],
      queryFn: async () => await fetchBlendByIdQueryFn(id),
    });
  } catch (error) {
    console.error('Error in prefetchBlendById:', error);
    throw error;
  }
}

export async function prefetchSpiceById(id?: string) {
  if (!id) throw new Error('Spice ID is missing');

  try {
    await queryClient.prefetchQuery({
      queryKey: ['spice', id],
      queryFn: async () => await fetchSpiceByIdQueryFn(id),
    });
  } catch (error) {
    console.error('Error in prefetchSpiceById:', error);
    throw error;
  }
}
