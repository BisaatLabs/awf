// app/admin/actions.ts
// Server actions for all admin CRUD operations.
// Uses the service-role admin client to bypass RLS.

'use server';

import { revalidatePath } from 'next/cache';
import { redirect }       from 'next/navigation';
import { supabaseAdmin }  from '@/lib/supabase/admin';

// ─── Slug helper ──────────────────────────────────────────────
function toSlug(str: string) {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

// ─── Types ────────────────────────────────────────────────────
export type ProductFormData = {
  sku:               string;
  name:              string;
  category_id:       string;
  space:             string;
  description:       string;
  short_description: string;
  materials:         string[];
  finish:            string;
  width_mm:          string;
  depth_mm:          string;
  height_mm:         string;
  price_display:     string;
  customizable:      boolean;
  featured:          boolean;
  is_active:         boolean;
  // images managed separately
  images: {
    id?:                  string;  // existing image id (if editing)
    cloudinary_public_id: string;
    secure_url:           string;
    is_primary:           boolean;
    sort_order:           number;
    _delete?:             boolean;
  }[];
};

// ─── CREATE product ───────────────────────────────────────────
export async function createProduct(data: ProductFormData) {
  const slug = toSlug(data.name);

  const { data: product, error } = await supabaseAdmin
    .from('products')
    .insert({
      sku:               data.sku || null,
      name:              data.name,
      slug,
      category_id:       data.category_id || null,
      space:             data.space || null,
      description:       data.description || null,
      short_description: data.short_description || null,
      materials:         data.materials,
      finish:            data.finish || null,
      width_mm:          data.width_mm || null,
      depth_mm:          data.depth_mm || null,
      height_mm:         data.height_mm || null,
      price_display:     data.price_display || null,
      customizable:      data.customizable,
      featured:          data.featured,
      is_active:         data.is_active,
    })
    .select('id')
    .single();

  if (error) throw new Error(`Failed to create product: ${error.message}`);

  // Insert images
  const validImages = data.images.filter((img) => !img._delete && img.secure_url);
  if (validImages.length > 0) {
    const imageRows = validImages.map((img, idx) => ({
      product_id:           product.id,
      cloudinary_public_id: img.cloudinary_public_id || `img_${idx}`,
      secure_url:           img.secure_url,
      is_primary:           img.is_primary,
      sort_order:           img.sort_order ?? idx,
    }));
    await supabaseAdmin.from('product_images').insert(imageRows);
  }

  revalidatePath('/products');
  revalidatePath('/admin/products');
  redirect('/admin/products');
}

// ─── UPDATE product ───────────────────────────────────────────
export async function updateProduct(id: string, data: ProductFormData) {
  const slug = toSlug(data.name);

  const { error } = await supabaseAdmin
    .from('products')
    .update({
      sku:               data.sku || null,
      name:              data.name,
      slug,
      category_id:       data.category_id || null,
      space:             data.space || null,
      description:       data.description || null,
      short_description: data.short_description || null,
      materials:         data.materials,
      finish:            data.finish || null,
      width_mm:          data.width_mm || null,
      depth_mm:          data.depth_mm || null,
      height_mm:         data.height_mm || null,
      price_display:     data.price_display || null,
      customizable:      data.customizable,
      featured:          data.featured,
      is_active:         data.is_active,
    })
    .eq('id', id);

  if (error) throw new Error(`Failed to update product: ${error.message}`);

  // Handle image deletions
  const toDelete = data.images.filter((img) => img._delete && img.id);
  if (toDelete.length > 0) {
    await supabaseAdmin
      .from('product_images')
      .delete()
      .in('id', toDelete.map((img) => img.id!));
  }

  // Insert new images (those without an id and not marked for deletion)
  const toInsert = data.images.filter((img) => !img.id && !img._delete && img.secure_url);
  if (toInsert.length > 0) {
    await supabaseAdmin.from('product_images').insert(
      toInsert.map((img, idx) => ({
        product_id:           id,
        cloudinary_public_id: img.cloudinary_public_id || `img_${idx}`,
        secure_url:           img.secure_url,
        is_primary:           img.is_primary,
        sort_order:           img.sort_order ?? idx,
      }))
    );
  }

  // Update is_primary & sort_order for existing images
  const toUpdatePrimary = data.images.filter((img) => img.id && !img._delete);
  for (const img of toUpdatePrimary) {
    await supabaseAdmin
      .from('product_images')
      .update({
        is_primary:           img.is_primary,
        sort_order:           img.sort_order,
        secure_url:           img.secure_url,
        cloudinary_public_id: img.cloudinary_public_id,
      })
      .eq('id', img.id!);
  }

  revalidatePath('/products');
  revalidatePath(`/products/${slug}`);
  revalidatePath('/admin/products');
  redirect('/admin/products');
}

// ─── DELETE product ───────────────────────────────────────────
export async function deleteProduct(id: string) {
  const { error } = await supabaseAdmin.from('products').delete().eq('id', id);
  if (error) throw new Error(`Failed to delete product: ${error.message}`);

  revalidatePath('/products');
  revalidatePath('/admin/products');
}

// ─── TOGGLE product active status ────────────────────────────
export async function toggleProductActive(id: string, isActive: boolean) {
  const { error } = await supabaseAdmin
    .from('products')
    .update({ is_active: isActive })
    .eq('id', id);
  if (error) throw new Error(`Failed to toggle product: ${error.message}`);

  revalidatePath('/products');
  revalidatePath('/admin/products');
}

// ─── CATEGORY actions ─────────────────────────────────────────
export async function createCategory(input: { name: string; slug?: string; description?: string } | string, desc?: string) {
  let name: string;
  let slug: string;
  let description: string | null = null;

  if (typeof input === 'object') {
    name = input.name;
    slug = input.slug || toSlug(input.name);
    description = input.description || null;
  } else {
    name = input;
    slug = toSlug(name);
    description = desc || null;
  }

  const { error } = await supabaseAdmin.from('categories').insert({
    name, slug, description,
  });
  if (error) return { error: error.message };
  revalidatePath('/admin/categories');
  revalidatePath('/products');
  return { success: true };
}

export async function updateCategory(id: string, input: { name: string; slug?: string; description?: string } | string, desc?: string) {
  let name: string;
  let slug: string;
  let description: string | null = null;

  if (typeof input === 'object') {
    name = input.name;
    slug = input.slug || toSlug(input.name);
    description = input.description || null;
  } else {
    name = input;
    slug = toSlug(name);
    description = desc || null;
  }

  const { error } = await supabaseAdmin
    .from('categories')
    .update({ name, slug, description })
    .eq('id', id);
  if (error) return { error: error.message };
  revalidatePath('/admin/categories');
  revalidatePath('/products');
  return { success: true };
}

export async function deleteCategory(id: string) {
  const { error } = await supabaseAdmin.from('categories').delete().eq('id', id);
  if (error) return { error: error.message };
  revalidatePath('/admin/categories');
  return { success: true };
}

export async function toggleCategoryActive(id: string, isActive: boolean) {
  const { error } = await supabaseAdmin
    .from('categories')
    .update({ is_active: isActive })
    .eq('id', id);
  if (error) return { error: error.message };
  revalidatePath('/admin/categories');
  return { success: true };
}
