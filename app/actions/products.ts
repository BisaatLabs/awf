// app/actions/products.ts
// Server action for dynamic catalogue queries, pagination, and filter updates.

'use server';

import { getPaginatedProducts, type ProductFilterParams, type PaginatedProductsResult } from '@/lib/supabase/queries';

export async function fetchProductsAction(params: ProductFilterParams): Promise<PaginatedProductsResult> {
  return await getPaginatedProducts(params);
}
