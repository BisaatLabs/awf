import { z } from 'zod';
export const idSchema = z.string().uuid();
const text = z.string().trim().max(10000);
export const categorySchema = z.object({
  name: z.string().trim().min(1).max(160).regex(/[a-zA-Z0-9]/),
  slug: z.string().max(160).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).or(z.literal('')).optional(),
  description: text.optional(),
});
export const productSchema = z.object({
  name: categorySchema.shape.name, sku: text, category_id: idSchema.or(z.literal('')),
  space: text, description: text, short_description: text, materials: z.array(z.string().trim().min(1).max(100)).max(30),
  finish: text, width_mm: text, depth_mm: text, height_mm: text, price_display: text,
  customizable: z.boolean(), featured: z.boolean(), is_active: z.boolean(),
  images: z.array(z.object({
    id: idSchema.optional(), cloudinary_public_id: text,
    secure_url: z.string().url().max(2048).refine(url => new URL(url).protocol === 'https:', 'Use an HTTPS image URL').or(z.literal('')),
    is_primary: z.boolean(), sort_order: z.number().int().min(0).max(10000), _delete: z.boolean().optional(),
  })).max(50),
});
