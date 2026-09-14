// app/admin/products/page.tsx
// Products list with search, category filter, status filter, and actions.

import Link from 'next/link';
import { Plus } from 'lucide-react';
import { createSupabaseServerClient } from '@/lib/supabase/ssr-client';
import { ProductsTable } from '@/components/admin/ProductsTable';

interface Props {
  searchParams?: { q?: string; category?: string; status?: string };
}

async function getProducts(q?: string, category?: string, status?: string) {
  const supabase = createSupabaseServerClient();

  let query = supabase
    .from('products')
    .select(`
      id, sku, name, slug, space, price_display, customizable, featured, is_active,
      categories ( id, name ),
      product_images ( secure_url, is_primary, sort_order )
    `)
    .order('sort_order', { ascending: true });

  if (q) query = query.ilike('name', `%${q}%`);
  if (category && category !== 'all') query = query.eq('category_id', category);
  if (status === 'active')   query = query.eq('is_active', true);
  if (status === 'inactive') query = query.eq('is_active', false);

  const { data, error } = await query;
  if (error) {
    console.error('[admin/products]', error.message);
    return [];
  }
  return data ?? [];
}

async function getCategories() {
  const supabase = createSupabaseServerClient();
  const { data } = await supabase.from('categories').select('id, name').order('name');
  return data ?? [];
}

export default async function AdminProductsPage({ searchParams }: Props) {
  const q        = searchParams?.q        ?? '';
  const category = searchParams?.category ?? '';
  const status   = searchParams?.status   ?? '';

  const [products, categories] = await Promise.all([
    getProducts(q, category, status),
    getCategories(),
  ]);

  return (
    <div className="max-w-7xl">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Products</h1>
          <p className="mt-1 text-sm text-gray-500">{products.length} products</p>
        </div>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-2 rounded-lg bg-[#1B4332] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#14532d]"
        >
          <Plus size={16} /> Add Product
        </Link>
      </div>

      {/* Filters */}
      <form method="GET" className="mb-6 flex flex-wrap gap-3">
        <input
          name="q"
          defaultValue={q}
          placeholder="Search products…"
          className="rounded-lg border border-gray-200 px-3.5 py-2 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-[#1B4332] focus:ring-2 focus:ring-[#1B4332]/10 transition min-w-[220px]"
        />

        <select
          name="category"
          defaultValue={category}
          className="rounded-lg border border-gray-200 px-3.5 py-2 text-sm text-gray-700 outline-none focus:border-[#1B4332] focus:ring-2 focus:ring-[#1B4332]/10 transition"
        >
          <option value="all">All Categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>

        <select
          name="status"
          defaultValue={status}
          className="rounded-lg border border-gray-200 px-3.5 py-2 text-sm text-gray-700 outline-none focus:border-[#1B4332] focus:ring-2 focus:ring-[#1B4332]/10 transition"
        >
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>

        <button
          type="submit"
          className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:border-gray-300 hover:bg-gray-50"
        >
          Filter
        </button>
        {(q || category || status) && (
          <Link
            href="/admin/products"
            className="rounded-lg px-3 py-2 text-sm text-gray-500 hover:text-gray-700 transition"
          >
            Clear
          </Link>
        )}
      </form>

      {/* Table */}
      <div className="rounded-xl border border-gray-100 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden">
        <ProductsTable products={products as any} />
      </div>
    </div>
  );
}
