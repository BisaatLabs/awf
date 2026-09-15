// app/actions/products.ts
// Server action for dynamic catalogue queries, pagination, and filter updates.

'use server';

import { z } from 'zod';

const filtersSchema = z.object({
  page: z.number().finite().int().min(1).max(100000).optional(),
  pageSize: z.number().finite().int().min(1).max(100).optional(),
  category: z.string().max(160).optional(),
  space: z.string().max(100).optional(),
  material: z.string().max(100).optional(),
  search: z.string().max(200).optional(),
});

import { getPaginatedProducts, type ProductFilterParams, type PaginatedProductsResult } from '@/lib/supabase/queries';

export async function fetchProductsAction(params: ProductFilterParams): Promise<PaginatedProductsResult> {
  return await getPaginatedProducts(filtersSchema.parse(params));
}
