# Technical Specs for Tomo Spice Blend Take Home Challenge

## Abstract

## Requirements

For **each** spice. We need to accomplish the following items:

### Goals

- [x] Blend details page correctly lists the name of all included spices on first load.
- [x] State management between pages, so as not to re-request data.
- [x] Load a "blend of blend" (2nd, or 3rd blend) listing all spices included in that blend and child blends.
- [x] Add new blend of blend to DB (form)
- [x] One new "feature" or "refactor" that shows what you consider to be your FE strengths
- [x] One new "architecture pattern", or least be prepared to talk about one you'd like to add.

### Non-Goals

- Building a backend API
- Server-side rendering (SSR)
- Maintaining state upon refresh
- Infinite scroll / Load more / Pagination

### User Journey

1. User navigates to the home page.
2. User sees a list of spices and spice blends.
3. User clicks on a spice or spice blend to view the details.
4. User sees the spice or spice blend details.
5. User can navigate back to the home page.

## Specification

### Types

```typescript
import { z } from 'zod';

export const SpiceSchema = z.object({
  id: z.number(),
  name: z.string(),
  price: z.string(),
  color: z.string(),
  heat: z.number(),
});

export const BlendSchema = z.object({
  id: z.number(),
  name: z.string(),
  blends: z.array(z.number()),
  spices: z.array(z.number()),
  description: z.string(),
});

export type Spice = z.infer<typeof SpiceSchema>;
export type Blend = z.infer<typeof BlendSchema>;
```

## Services

Using Tanstack DB to create client-side, type-safe, real-time, and transactional writes with local optimistic updates.

Queries can be pre-fetched to improve performance and cached automagically by React Query, which DB uses under the hood.

Caching is provided with a cache key (queryKey). For a larger codebase, using query keys in excess can lead to accidental cache invalidation, given the loose nature of the cache key (string). Ex. `spices`.

```typescript
async function prefetchSpices() {
  await queryClient.prefetchQuery({
    queryKey: ['spices'],
    queryFn: async () => {
      const response = await fetch('/api/v1/spices');
      return response.json();
    },
  });
}
```

### Spices

Spices are cached in the query client with a query key of `spices`. Notice the duplicate query key in the `spiceCollection` below. This is intentional to show the loose nature of the cache key (string).

The `useLiveQuery` hook is used to fetch spices from the query client and return JSX.

```typescript
import { createQueryCollection } from '@tanstack/db-collections';
import { useLiveQuery } from '@tanstack/react-db';
import { SpiceSchema } from './types';

export const spiceCollection = createQueryCollection<Spice>({
  queryKey: ['spices'],
  queryFn: async () => fetch('/api/spices'),
  getId: (spice) => spice.id,
  schema: SpiceSchema,
});

export const Spices = (props: SpiceProps) => {
  const spices = useLiveQuery(spiceCollection);
  return (
    <div>
      {spices.map((spice) => (
        <div key={spice.id}>{spice.name}</div>
      ))}
    </div>
  );
};
```

### Blends

Like `spices`, `blends` are cached in the query client with a query key of `blends` and a query function that fetches the data from the server:

```typescript
const Blends = ({ searchString }: { searchString?: string }) => {
  const { data: blends } = useQuery({
    queryKey: ['blends'],
    queryFn: async () => {
      const response = await fetch('/api/v1/blends');
      return response.json();
    },
  });

  return (
    <ul>
      {blends
        ?.filter((blend: Blend) =>
          blend.name.toLowerCase().includes(searchString?.toLowerCase() ?? ''),
        )
        .map((blend: Blend) => (
          <li key={blend.id}>
            <Link to={`/blends/${blend.id}`}>{blend.name}</Link>
          </li>
        ))}
    </ul>
  );
};
```

## References

1. https://github.com/TanStack/db/blob/main/docs/index.md
