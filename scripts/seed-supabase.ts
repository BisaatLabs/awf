/**
 * scripts/seed-supabase.ts
 *
 * Seeds Supabase from CLOUDINARY (not from local dummy data).
 *
 * What it does:
 *  1. Fetches ALL assets from "awf-assets/AWF Furnitures" via Cloudinary Admin API.
 *  2. Matches each asset to a product using the display_name field.
 *  3. Stores real cloudinary_public_id + secure_url in product_images table.
 *  4. Only products with a matched Cloudinary image are marked is_active=true.
 *
 * HOW TO RUN (from inside the awf/ folder):
 *   npm run seed
 *
 * .env.local must contain:
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 *   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
 *   CLOUDINARY_API_KEY
 *   CLOUDINARY_API_SECRET
 */

import { config } from 'dotenv';
config({ path: '.env.local' });

import { v2 as cloudinary } from 'cloudinary';
import { createClient } from '@supabase/supabase-js';
import { products as localProducts } from '../data/products';

// ─── Validate env ─────────────────────────────────────────────
const required = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'SUPABASE_SERVICE_ROLE_KEY',
  'NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME',
  'CLOUDINARY_API_KEY',
  'CLOUDINARY_API_SECRET',
];
for (const key of required) {
  if (!process.env[key]) {
    console.error(`❌  Missing env var: ${key}`);
    console.error('    Add it to .env.local (never commit that file).');
    process.exit(1);
  }
}

// ─── Configure Cloudinary ─────────────────────────────────────
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!,
  api_key:    process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
  secure:     true,
});

// ─── Supabase admin client (bypasses RLS) ────────────────────
const db = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false, autoRefreshToken: false } }
);

// ─── Cloudinary asset type ────────────────────────────────────
interface CldAsset {
  public_id:    string;   // random hash e.g. "k8rjl6r0ttmrgetmf0gg"
  secure_url:   string;   // full https://res.cloudinary.com/… URL
  display_name: string;   // human filename e.g. "04-walnut-scrollwork-faceted-panel-bed"
  asset_folder: string;   // e.g. "awf-assets/AWF Furnitures/bedroom-set-wooden"
}

// ─── Step 1: Fetch ALL assets from Cloudinary ────────────────
async function fetchAllAssets(): Promise<CldAsset[]> {
  const results: CldAsset[] = [];
  let nextCursor: string | undefined;

  console.log('\n☁️   Fetching all Cloudinary assets…');

  do {
    const params: Record<string, any> = {
      type:        'upload',
      max_results: 500,
    };
    if (nextCursor) params.next_cursor = nextCursor;

    const response: any = await cloudinary.api.resources(params);

    for (const r of response.resources ?? []) {
      results.push({
        public_id:    r.public_id,
        secure_url:   r.secure_url,
        display_name: r.display_name ?? '',
        asset_folder: r.asset_folder ?? '',
      });
    }

    nextCursor = response.next_cursor;
    console.log(`   ✓ Fetched ${results.length} assets…`);
  } while (nextCursor);

  // Filter to only our product assets folder
  const filtered = results.filter((r) =>
    r.asset_folder.startsWith('awf-assets/AWF Furnitures')
  );

  console.log(`   ✅ ${filtered.length} assets in "awf-assets/AWF Furnitures" (${results.length} total in account)`);
  return filtered;
}

// ─── Step 2: Match assets → products ─────────────────────────
/**
 * Matching uses display_name (e.g. "04-walnut-scrollwork-faceted-panel-bed")
 * which perfectly matches the product slug in our data file.
 * Secondary match: strip leading number prefix and match slug.
 */
function matchAssetsToProducts(assets: CldAsset[]): Map<string, CldAsset[]> {
  const map = new Map<string, CldAsset[]>();

  for (const asset of assets) {
    // display_name: "04-walnut-scrollwork-faceted-panel-bed"
    // product slug: "walnut-scrollwork-faceted-panel-bed"
    const displayName = asset.display_name.toLowerCase();

    // Try exact slug match
    let matched = localProducts.find((p) => p.slug === displayName);

    // Strip leading number prefix (e.g. "04-walnut-..." → "walnut-...")
    if (!matched) {
      const stripped = displayName.replace(/^\d+-/, '');
      matched = localProducts.find((p) => p.slug === stripped);
    }

    // Partial: slug contains display_name or vice versa
    if (!matched) {
      const stripped = displayName.replace(/^\d+-/, '');
      matched = localProducts.find(
        (p) => p.slug.includes(stripped) || stripped.includes(p.slug)
      );
    }

    if (matched) {
      const existing = map.get(matched.slug) ?? [];
      existing.push(asset);
      map.set(matched.slug, existing);
    } else {
      console.warn(`   ⚠  Unmatched: "${asset.display_name}" (folder: ${asset.asset_folder})`);
    }
  }

  return map;
}

// ─── Helpers ──────────────────────────────────────────────────
function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

// ─── Step 3: Upsert categories ────────────────────────────────
async function seedCategories() {
  const unique = [...new Set(localProducts.map((p) => p.category))];
  console.log(`\n📂  Upserting ${unique.length} categories…`);

  const rows = unique.map((name, i) => ({
    name,
    slug: slugify(name),
    sort_order: i,
    is_active: true,
  }));

  const { error } = await db.from('categories').upsert(rows, { onConflict: 'slug' });
  if (error) throw new Error(`Category upsert: ${error.message}`);

  const { data, error: fe } = await db.from('categories').select('id, name');
  if (fe) throw new Error(`Category fetch: ${fe.message}`);

  const catMap: Record<string, string> = {};
  for (const c of data ?? []) catMap[c.name] = c.id;
  console.log(`   ✓ ${unique.length} categories ready`);
  return catMap;
}

// ─── Step 4: Upsert products ──────────────────────────────────
async function seedProducts(
  categoryMap: Record<string, string>,
  assetMap: Map<string, CldAsset[]>
) {
  console.log(`\n🪑  Upserting ${localProducts.length} products…`);

  const rows = localProducts.map((p, i) => ({
    sku:               p.id,
    name:              p.name,
    slug:              p.slug,
    category_id:       categoryMap[p.category] ?? null,
    space:             p.space,
    description:       p.description,
    short_description: p.shortDescription,
    materials:         p.materials,
    finish:            p.finish,
    width_mm:          p.dimensions?.width  ?? null,
    depth_mm:          p.dimensions?.depth  ?? null,
    height_mm:         p.dimensions?.height ?? null,
    customizable:      p.customizable ?? true,
    featured:          p.featured && assetMap.has(p.slug),
    // Only active if we found a real Cloudinary image for it
    is_active:         assetMap.has(p.slug),
    sort_order:        i,
  }));

  const CHUNK = 50;
  for (let i = 0; i < rows.length; i += CHUNK) {
    const { error } = await db
      .from('products')
      .upsert(rows.slice(i, i + CHUNK), { onConflict: 'slug' });
    if (error) throw new Error(`Product upsert at chunk ${i}: ${error.message}`);
    console.log(`   ✓ Products ${i + 1}–${Math.min(i + CHUNK, rows.length)} upserted`);
  }

  const { data, error: fe } = await db.from('products').select('id, slug');
  if (fe) throw new Error(`Product fetch: ${fe.message}`);

  const prodMap: Record<string, string> = {};
  for (const r of data ?? []) prodMap[r.slug] = r.id;
  return prodMap;
}

// ─── Step 5: Insert product_images with real Cloudinary data ─
async function seedImages(
  prodMap: Record<string, string>,
  assetMap: Map<string, CldAsset[]>
) {
  console.log(`\n🖼   Inserting product images (bulk)…`);

  // Build ALL image rows in memory first
  const allImageRows: {
    product_id: string;
    cloudinary_public_id: string;
    secure_url: string;
    sort_order: number;
    is_primary: boolean;
    alt_text: string;
  }[] = [];

  for (const [slug, assets] of assetMap.entries()) {
    const productId = prodMap[slug];
    if (!productId) {
      console.warn(`   ⚠  No DB row for slug "${slug}" — skipping`);
      continue;
    }

    // Sort by display_name numerically
    const sorted = [...assets].sort((a, b) =>
      a.display_name.localeCompare(b.display_name, undefined, { numeric: true })
    );

    sorted.forEach((asset, idx) => {
      allImageRows.push({
        product_id:           productId,
        cloudinary_public_id: asset.public_id,
        secure_url:           asset.secure_url,
        sort_order:           idx,
        is_primary:           idx === 0,
        alt_text:             `${slug.replace(/-/g, ' ')}${idx > 0 ? ` view ${idx + 1}` : ''}`,
      });
    });
  }

  console.log(`   Building ${allImageRows.length} image records…`);

  // Single bulk delete of ALL existing image records (clean slate)
  const { error: delError } = await db
    .from('product_images')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000'); // delete all rows
  if (delError) console.warn(`   ⚠  Delete warning: ${delError.message}`);

  // Batch insert in chunks of 100
  const CHUNK = 100;
  for (let i = 0; i < allImageRows.length; i += CHUNK) {
    const chunk = allImageRows.slice(i, i + CHUNK);
    const { error } = await db.from('product_images').insert(chunk);
    if (error) throw new Error(`Image insert failed at chunk ${i}: ${error.message}`);
    console.log(`   ✓ Images ${i + 1}–${Math.min(i + CHUNK, allImageRows.length)} inserted`);
  }

  const productsWithImgs = new Set(allImageRows.map((r) => r.product_id)).size;
  console.log(`   ✅ ${allImageRows.length} images across ${productsWithImgs} products`);

  const noImage = localProducts.filter((p) => !assetMap.has(p.slug));
  if (noImage.length > 0) {
    console.warn(`\n   ⚠  ${noImage.length} products have no Cloudinary asset (is_active=false):`);
    noImage.forEach((p) => console.warn(`      - ${p.id}: ${p.name}`));
  }
}

// ─── Main ─────────────────────────────────────────────────────
async function main() {
  console.log('🚀  AWF Supabase Seed — Cloudinary Edition');
  console.log(`    Cloud:    ${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}`);
  console.log(`    Supabase: ${process.env.NEXT_PUBLIC_SUPABASE_URL}`);

  const assets      = await fetchAllAssets();
  console.log('\n🔗  Matching Cloudinary assets to products…');
  const assetMap    = matchAssetsToProducts(assets);
  console.log(`   ✓ ${assetMap.size} of ${localProducts.length} products matched`);

  const categoryMap = await seedCategories();
  const prodMap     = await seedProducts(categoryMap, assetMap);
  await seedImages(prodMap, assetMap);

  console.log('\n✅  Seed complete! Open Supabase Dashboard → Table Editor to verify.');
}

main().catch((err) => {
  console.error('\n❌  Fatal error:', err);
  process.exit(1);
});
