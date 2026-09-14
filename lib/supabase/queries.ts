// lib/supabase/queries.ts
// Central data-fetching functions for Supabase with pagination, caching, and strong types.

import { createServerClient } from './server';

// ─── Types ────────────────────────────────────────────────────
export interface DisplayProduct {
  id: string;
  sku: string;
  name: string;
  slug: string;
  category: string;
  space: string;
  description: string;
  shortDescription: string;
  materials: string[];
  finish: string;
  dimensions: {
    width: string;
    depth: string;
    height: string;
  };
  customizable: boolean;
  featured: boolean;
  is_active: boolean;
  primaryImage: string | null;
  images: string[];
}

export interface PaginatedProductsResult {
  products: DisplayProduct[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  hasMore: boolean;
}

export interface ProductFilterParams {
  page?: number;
  pageSize?: number;
  category?: string;
  space?: string;
  material?: string;
  search?: string;
}

interface RawProductCategory {
  name: string | null;
}

interface RawProductImage {
  secure_url: string | null;
  sort_order: number | null;
  is_primary: boolean | null;
}

interface RawProduct {
  id: string;
  sku: string | null;
  name: string;
  slug: string;
  space: string | null;
  description: string | null;
  short_description: string | null;
  materials: string[] | null;
  finish: string | null;
  width_mm: string | null;
  depth_mm: string | null;
  height_mm: string | null;
  customizable: boolean | null;
  featured: boolean | null;
  is_active: boolean | null;
  categories: RawProductCategory | null;
  product_images: RawProductImage[] | null;
}

// ─── Normalizer ───────────────────────────────────────────────
function toDisplayProduct(raw: RawProduct): DisplayProduct {
  const imagesList = raw.product_images ?? [];
  const sortedImages = [...imagesList].sort(
    (a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0)
  );

  // Pick primary image if flagged, else first image in order
  const primaryObj = sortedImages.find((img) => img.is_primary) ?? sortedImages[0];
  const primaryImage = primaryObj?.secure_url ?? null;

  const imageUrls = sortedImages
    .map((img) => img.secure_url)
    .filter((url): url is string => Boolean(url && url.trim() !== ''));

  return {
    id:               raw.id,
    sku:              raw.sku ?? '',
    name:             raw.name,
    slug:             raw.slug,
    category:         raw.categories?.name || 'Bespoke Collection',
    space:            raw.space ?? '',
    description:      raw.description ?? '',
    shortDescription: raw.short_description ?? '',
    materials:        raw.materials ?? [],
    finish:           raw.finish ?? '',
    dimensions: {
      width:  raw.width_mm  ?? '',
      depth:  raw.depth_mm  ?? '',
      height: raw.height_mm ?? '',
    },
    customizable:  raw.customizable ?? true,
    featured:      raw.featured ?? false,
    is_active:     raw.is_active ?? true,
    primaryImage,
    images:        imageUrls.length > 0 ? imageUrls : (primaryImage ? [primaryImage] : []),
  };
}

const PRODUCT_SELECT = `
  id, sku, name, slug, space, description, short_description,
  materials, finish, width_mm, depth_mm, height_mm,
  customizable, featured, is_active,
  categories ( name ),
  product_images ( secure_url, sort_order, is_primary )
` as const;

// ─── Fetch Categories List ────────────────────────────────────
export async function getCategoriesList(): Promise<{ id: string; name: string; slug: string }[]> {
  try {
    const supabase = createServerClient();
    const { data, error } = await supabase
      .from('categories')
      .select('id, name, slug')
      .order('name', { ascending: true });

    if (error) {
      console.error('[getCategoriesList] Error:', error.message);
      return [];
    }
    return data ?? [];
  } catch (err) {
    console.error('[getCategoriesList] Unexpected error:', err);
    return [];
  }
}

// ─── Fetch Paginated Products (with server-side filters) ───────
export async function getPaginatedProducts(
  params: ProductFilterParams = {}
): Promise<PaginatedProductsResult> {
  const {
    page = 1,
    pageSize = 18,
    category = 'All',
    space = 'All',
    material = 'All',
    search = '',
  } = params;

  const validPage = Math.max(1, page);
  const validPageSize = Math.max(1, Math.min(100, pageSize));
  const offset = (validPage - 1) * validPageSize;

  try {
    const supabase = createServerClient();

    let query = supabase
      .from('products')
      .select(PRODUCT_SELECT, { count: 'exact' })
      .eq('is_active', true);

    // Filter by category
    if (category && category !== 'All') {
      const { data: catData } = await supabase
        .from('categories')
        .select('id')
        .ilike('name', category)
        .single();

      if (catData?.id) {
        query = query.eq('category_id', catData.id);
      }
    }

    // Filter by space
    if (space && space !== 'All') {
      query = query.ilike('space', `%${space}%`);
    }

    // Filter by material (Postgres array contains)
    if (material && material !== 'All') {
      query = query.contains('materials', [material]);
    }

    // Search query across name, description, SKU
    if (search && search.trim()) {
      const clean = search.trim();
      query = query.or(`name.ilike.%${clean}%,description.ilike.%${clean}%,sku.ilike.%${clean}%`);
    }

    // Sort order & range
    query = query
      .order('sort_order', { ascending: true })
      .range(offset, offset + validPageSize - 1);

    const { data, count, error } = await query;

    if (error) {
      console.error('[getPaginatedProducts] Supabase error:', error.message);
      return {
        products: [],
        totalCount: 0,
        totalPages: 0,
        currentPage: validPage,
        pageSize: validPageSize,
        hasMore: false,
      };
    }

    const totalCount = count ?? 0;
    const totalPages = Math.ceil(totalCount / validPageSize);
    const products = ((data as unknown as RawProduct[]) || []).map(toDisplayProduct);

    return {
      products,
      totalCount,
      totalPages,
      currentPage: validPage,
      pageSize: validPageSize,
      hasMore: validPage < totalPages,
    };
  } catch (err) {
    console.error('[getPaginatedProducts] Unexpected failure:', err);
    return {
      products: [],
      totalCount: 0,
      totalPages: 0,
      currentPage: validPage,
      pageSize: validPageSize,
      hasMore: false,
    };
  }
}

// ─── Fetch All Active Products (Legacy / fallback helper) ─────
export async function getProducts(): Promise<DisplayProduct[]> {
  try {
    const res = await getPaginatedProducts({ page: 1, pageSize: 100 });
    return res.products;
  } catch (err) {
    console.error('[getProducts] Error:', err);
    return [];
  }
}

// ─── Fetch Single Product by Slug ─────────────────────────────
export async function getProductBySlug(slug: string): Promise<DisplayProduct | null> {
  if (!slug || typeof slug !== 'string') return null;

  try {
    const supabase = createServerClient();
    const { data, error } = await supabase
      .from('products')
      .select(PRODUCT_SELECT)
      .eq('slug', slug)
      .eq('is_active', true)
      .single();

    if (error || !data) {
      return null;
    }

    return toDisplayProduct(data as unknown as RawProduct);
  } catch (err) {
    console.error(`[getProductBySlug] Exception for "${slug}":`, err);
    return null;
  }
}

// ─── Fetch All Product Slugs for Static Generation ────────────
export async function getAllProductSlugs(): Promise<string[]> {
  try {
    const supabase = createServerClient();
    const { data, error } = await supabase
      .from('products')
      .select('slug')
      .eq('is_active', true);

    if (error || !data) return [];
    return data.map((r: { slug: string }) => r.slug);
  } catch (err) {
    console.error('[getAllProductSlugs] Error:', err);
    return [];
  }
}

// ─── Fetch Featured Products for Homepage ─────────────────────
export async function getFeaturedProducts(limit = 6): Promise<DisplayProduct[]> {
  try {
    const supabase = createServerClient();
    const { data, error } = await supabase
      .from('products')
      .select(PRODUCT_SELECT)
      .eq('is_active', true)
      .eq('featured', true)
      .order('sort_order', { ascending: true })
      .limit(limit);

    if (error || !data) return [];
    return (data as unknown as RawProduct[]).map(toDisplayProduct);
  } catch (err) {
    console.error('[getFeaturedProducts] Error:', err);
    return [];
  }
}

// ─── Fetch Products by Space ──────────────────────────────────
export async function getProductsBySpace(
  space: string,
  limit = 12
): Promise<DisplayProduct[]> {
  try {
    const supabase = createServerClient();
    const { data, error } = await supabase
      .from('products')
      .select(PRODUCT_SELECT)
      .eq('is_active', true)
      .ilike('space', `%${space}%`)
      .order('sort_order', { ascending: true })
      .limit(limit);

    if (error || !data) return [];
    return (data as unknown as RawProduct[]).map(toDisplayProduct);
  } catch (err) {
    console.error(`[getProductsBySpace] Error for space "${space}":`, err);
    return [];
  }
}

// ─── Fetch Related Products ───────────────────────────────────
export async function getRelatedProducts(
  categoryName: string,
  excludeSlug: string,
  limit = 3
): Promise<DisplayProduct[]> {
  try {
    const supabase = createServerClient();

    const { data: cat } = await supabase
      .from('categories')
      .select('id')
      .ilike('name', categoryName)
      .single();

    if (!cat) return [];

    const { data, error } = await supabase
      .from('products')
      .select(PRODUCT_SELECT)
      .eq('is_active', true)
      .eq('category_id', cat.id)
      .neq('slug', excludeSlug)
      .order('sort_order', { ascending: true })
      .limit(limit);

    if (error || !data) return [];
    return (data as unknown as RawProduct[]).map(toDisplayProduct);
  } catch (err) {
    console.error('[getRelatedProducts] Error:', err);
    return [];
  }
}
