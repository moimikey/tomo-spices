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
