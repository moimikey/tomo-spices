# Tomo Spice Blend Take Home Challenge

## SUBMISSON NOTES

Howdy!

Thanks for providing me the opportunity to take on this challenge. I had fun doing it and tried to not over-engineer the solution, but I'm sure there are some things I could have done better. I've included a few notes below about what I did and what I would do differently if I had more time. Please take a look at [SPECS.md](./SPECS.md) for the technical/shaping document to explain decisions and overall architecture.

-- Michael Hertzberg

## Overview

- Robust types with Zod (`types.ts`)
- Centralized routing in (`router.tsx`)
- React Query provider for fetching (`main.tsx`)
- Centralized queries in (`queries.tsx`)

### Improvement Opportunities

- Utilization of Next.js for file-based routing & SSR
- URL-based state
- Prefetching strategies to avoid content shifts
- Loading skeletons/states
- Better error handling/states; ErrorBoundary
- More tests
