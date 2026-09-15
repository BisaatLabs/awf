// app/admin/products/new/page.tsx
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { requireAdmin } from '@/lib/supabase/ssr-client';
import { ProductForm } from '@/components/admin/ProductForm';

async function getCategories() {
  const supabase = await requireAdmin();
  const { data } = await supabase.from('categories').select('id, name').order('name');
  return data ?? [];
}

export default async function NewProductPage() {
  const categories = await getCategories();

  return (
    <div className="max-w-3xl">
      <div className="mb-8">
        <Link
          href="/admin/products"
          className="inline-flex items-center gap-2 text-xs font-medium text-gray-500 hover:text-gray-900 transition mb-4"
        >
          <ArrowLeft size={14} /> Back to Products
        </Link>
        <h1 className="text-2xl font-semibold text-gray-900">Add Product</h1>
        <p className="mt-1 text-sm text-gray-500">Fill in the details below to add a new product to your catalogue.</p>
      </div>

      <ProductForm categories={categories} />
    </div>
  );
}
