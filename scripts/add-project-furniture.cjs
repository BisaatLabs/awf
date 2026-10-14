// Run: node --env-file=.env scripts/add-project-furniture.cjs [--apply]
// Adds only missing entries; never overwrites existing products or images.
const { createClient } = require('@supabase/supabase-js');
const products = require('../data/project-furniture.json');

async function main() {
  if (!process.argv.includes('--apply')) {
    console.log('Prepared ' + products.length + ' made-to-order furniture entries:');
    products.forEach((product) => console.log(product.space + ': ' + product.name));
    return;
  }
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('Supabase URL and service role key are required.');
  const db = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
  const names = [...new Set(products.map((product) => product.category))];
  const { data: existing, error: categoryError } = await db.from('categories').select('id,name').in('name', names);
  if (categoryError) throw new Error('Cannot read categories: ' + categoryError.message);
  const categories = new Map((existing || []).map((category) => [category.name, category.id]));
  for (const name of names) {
    if (categories.has(name)) continue;
    const { data, error } = await db.from('categories').insert({ name, slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'), is_active: true }).select('id').single();
    if (error) throw new Error('Cannot add category: ' + error.message);
    categories.set(name, data.id);
  }
  const rows = products.map((product, index) => ({
    sku: product.id, name: product.name, slug: product.slug,
    category_id: categories.get(product.category), space: product.space,
    description: product.description, short_description: product.shortDescription,
    materials: product.materials, finish: product.finish,
    customizable: true, featured: false, is_active: true, sort_order: 200 + index,
  }));
  const { error } = await db.from('products').upsert(rows, { onConflict: 'slug', ignoreDuplicates: true });
  if (error) throw new Error('Cannot add products: ' + error.message);
  const { data: saved, error: verifyError } = await db.from('products').select('slug,space,is_active').in('slug', products.map((product) => product.slug));
  if (verifyError) throw new Error('Cannot verify products: ' + verifyError.message);
  if (saved.length !== products.length || saved.some((product) => !product.is_active)) throw new Error('Some entries are missing or inactive.');
  console.log('Verified ' + saved.length + ' active Corporate / Institutional products. Images can be added in admin.');
}
main().catch((error) => { console.error(error.message); process.exitCode = 1; });
