import { z } from 'zod';

/**
 * Spice
 */
export const SpiceSchema = z.object({
  id: z.number(),
  name: z.string(),
  price: z.string(),
  color: z.string(),
  heat: z.number(),
});
export type Spice = z.infer<typeof SpiceSchema>;

/**
 * Spices
 */
export const SpicesSchema = z.array(SpiceSchema);
export type Spices = z.infer<typeof SpicesSchema>;

/**
 * Blend
 */
export const BlendSchema = z.object({
  id: z.number(),
  name: z.string(),
  blends: z.array(z.number()),
  spices: z.array(z.number()),
  description: z.string(),
});
export type Blend = z.infer<typeof BlendSchema>;

/**
 * Blends
 */
export const BlendsSchema = z.array(BlendSchema);
export type Blends = z.infer<typeof BlendsSchema>;
