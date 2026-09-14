// app/admin/products/[id]/edit/page.tsx
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { createSupabaseServerClient } from '@/lib/supabase/ssr-client';
import { ProductForm } from '@/components/admin/ProductForm';

async function getProduct(id: string) {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from('products')
    .select(`
      id, sku, name, slug, space, description, short_description,
      materials, finish, width_mm, depth_mm, height_mm,
      price_display, customizable, featured, is_active, category_id,
      product_images ( id, cloudinary_public_id, secure_url, is_primary, sort_order )
    `)
    .eq('id', id)
    .single();

  if (error || !data) return null;
  return data;
}

async function getCategories() {
  const supabase = createSupabaseServerClient();
  const { data } = await supabase.from('categories').select('id, name').order('name');
  return data ?? [];
}

export default async function EditProductPage({ params }: { params: { id: string } }) {
  const [product, categories] = await Promise.all([
    getProduct(params.id),
    getCategories(),
  ]);

  if (!product) notFound();

  // Normalise nullable fields to strings for the form
  const normalised = {
    id:                product.id,
    sku:               product.sku               ?? '',
    name:              product.name,
    space:             product.space             ?? '',
    description:       product.description       ?? '',
    short_description: product.short_description ?? '',
    materials:         product.materials         ?? [],
    finish:            product.finish            ?? '',
    width_mm:          product.width_mm          ?? '',
    depth_mm:          product.depth_mm          ?? '',
    height_mm:         product.height_mm         ?? '',
    price_display:     product.price_display     ?? '',
    customizable:      product.customizable,
    featured:          product.featured,
    is_active:         product.is_active,
    category_id:       product.category_id       ?? '',
    product_images:    (product.product_images ?? []).map((img: any) => ({
      id:                   img.id,
      cloudinary_public_id: img.cloudinary_public_id ?? '',
      secure_url:           img.secure_url ?? '',
      is_primary:           img.is_primary,
      sort_order:           img.sort_order,
    })),
  };

  return (
    <div className="max-w-3xl">
      <div className="mb-8">
        <Link
          href="/admin/products"
          className="inline-flex items-center gap-2 text-xs font-medium text-gray-500 hover:text-gray-900 transition mb-4"
        >
          <ArrowLeft size={14} /> Back to Products
        </Link>
        <h1 className="text-2xl font-semibold text-gray-900">Edit Product</h1>
        <p className="mt-1 text-sm text-gray-500 font-mono">{normalised.sku || normalised.name}</p>
      </div>

      <ProductForm product={normalised} categories={categories} />
    </div>
  );
}
