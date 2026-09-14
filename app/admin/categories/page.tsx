// app/admin/categories/page.tsx
// Categories management page for admin dashboard.

import { createSupabaseServerClient } from '@/lib/supabase/ssr-client';
import { CategoriesManager } from '@/components/admin/CategoriesManager';

export const revalidate = 0;

export default async function AdminCategoriesPage() {
  const supabase = await createSupabaseServerClient();

  // Fetch categories with product count
  const { data: categories } = await supabase
    .from('categories')
    .select(`
      *,
      products (id)
    `)
    .order('name');

  const categoriesWithCount = (categories || []).map((cat: any) => ({
    id: cat.id,
    name: cat.name,
    slug: cat.slug,
    description: cat.description || '',
    product_count: cat.products ? cat.products.length : 0,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-neutral-900">Categories</h1>
        <p className="text-sm text-neutral-500 mt-1">Manage furniture categories and organize your store catalog.</p>
      </div>

      <CategoriesManager initialCategories={categoriesWithCount} />
    </div>
  );
}
