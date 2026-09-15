// app/admin/actions.ts
// Server actions for all admin CRUD operations.
// Verifies admin role and uses the session client with RLS.

'use server';

import { revalidatePath } from 'next/cache';
import { redirect }       from 'next/navigation';
import { requireAdmin } from '@/lib/supabase/ssr-client';
import { productSchema, categorySchema, idSchema } from '@/lib/admin-validation';
import { z } from 'zod';

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
  const db = await requireAdmin();
  data = productSchema.parse(data);
  const slug = toSlug(data.name);

  const { data: product, error } = await db
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
    await db.from('product_images').insert(imageRows).throwOnError();
  }

  revalidatePath('/', 'layout');
  revalidatePath('/products');
  revalidatePath('/admin/products');
  redirect('/admin/products');
}

// ─── UPDATE product ───────────────────────────────────────────
export async function updateProduct(id: string, data: ProductFormData) {
  const db = await requireAdmin();
  id = idSchema.parse(id);
  data = productSchema.parse(data);
  const slug = toSlug(data.name);

  const { error } = await db
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
    await db
      .from('product_images')
      .delete()
      .eq('product_id', id)
      .in('id', toDelete.map((img) => img.id!))
      .throwOnError();
  }

  // Insert new images (those without an id and not marked for deletion)
  const toInsert = data.images.filter((img) => !img.id && !img._delete && img.secure_url);
  if (toInsert.length > 0) {
    await db.from('product_images').insert(
      toInsert.map((img, idx) => ({
        product_id:           id,
        cloudinary_public_id: img.cloudinary_public_id || `img_${idx}`,
        secure_url:           img.secure_url,
        is_primary:           img.is_primary,
        sort_order:           img.sort_order ?? idx,
      }))
    ).throwOnError();
  }

  // Update is_primary & sort_order for existing images
  const toUpdatePrimary = data.images.filter((img) => img.id && !img._delete);
  for (const img of toUpdatePrimary) {
    await db
      .from('product_images')
      .update({
        is_primary:           img.is_primary,
        sort_order:           img.sort_order,
        secure_url:           img.secure_url,
        cloudinary_public_id: img.cloudinary_public_id,
      })
      .eq('product_id', id)
      .eq('id', img.id!)
      .throwOnError();
  }

  revalidatePath('/', 'layout');
  revalidatePath('/products');
  revalidatePath(`/products/${slug}`);
  revalidatePath('/admin/products');
  redirect('/admin/products');
}

// ─── DELETE product ───────────────────────────────────────────
export async function deleteProduct(id: string) {
  const db = await requireAdmin();
  id = idSchema.parse(id);
  const { error } = await db.from('products').delete().eq('id', id);
  if (error) throw new Error(`Failed to delete product: ${error.message}`);

  revalidatePath('/', 'layout');
  revalidatePath('/products');
  revalidatePath('/admin/products');
}

// ─── TOGGLE product active status ────────────────────────────
export async function toggleProductActive(id: string, isActive: boolean) {
  const db = await requireAdmin();
  id = idSchema.parse(id);
  const { error } = await db
    .from('products')
    .update({ is_active: z.boolean().parse(isActive) })
    .eq('id', id);
  if (error) throw new Error(`Failed to toggle product: ${error.message}`);

  revalidatePath('/', 'layout');
  revalidatePath('/products');
  revalidatePath('/admin/products');
}

// ─── CATEGORY actions ─────────────────────────────────────────
export async function createCategory(input: { name: string; slug?: string; description?: string } | string, desc?: string) {
  const db = await requireAdmin();
  if (typeof input === 'string') input = { name: input, description: desc };
  input = categorySchema.parse(input);
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

  const { error } = await db.from('categories').insert({
    name, slug, description,
  });
  if (error) return { error: error.message };
  revalidatePath('/', 'layout');
  revalidatePath('/admin/categories');
  revalidatePath('/', 'layout');
  revalidatePath('/products');
  return { success: true };
}

export async function updateCategory(id: string, input: { name: string; slug?: string; description?: string } | string, desc?: string) {
  const db = await requireAdmin();
  if (typeof input === 'string') input = { name: input, description: desc };
  input = categorySchema.parse(input);
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

  const { error } = await db
    .from('categories')
    .update({ name, slug, description })
    .eq('id', id);
  if (error) return { error: error.message };
  revalidatePath('/', 'layout');
  revalidatePath('/admin/categories');
  revalidatePath('/', 'layout');
  revalidatePath('/products');
  return { success: true };
}

export async function deleteCategory(id: string) {
  const db = await requireAdmin();
  id = idSchema.parse(id);
  const { error } = await db.from('categories').delete().eq('id', id);
  if (error) return { error: error.message };
  revalidatePath('/', 'layout');
  revalidatePath('/admin/categories');
  return { success: true };
}

export async function toggleCategoryActive(id: string, isActive: boolean) {
  const db = await requireAdmin();
  id = idSchema.parse(id);
  const { error } = await db
    .from('categories')
    .update({ is_active: z.boolean().parse(isActive) })
    .eq('id', id);
  if (error) return { error: error.message };
  revalidatePath('/', 'layout');
  revalidatePath('/admin/categories');
  return { success: true };
}
