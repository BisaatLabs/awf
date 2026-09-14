/**
 * scripts/diagnose-cloudinary.ts
 * Lists your actual Cloudinary folder structure so we can fix the seed script.
 * Run: npx tsx scripts/diagnose-cloudinary.ts
 */
import { config } from 'dotenv';
config({ path: '.env.local' });

import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!,
  api_key:    process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
  secure:     true,
});

async function diagnose() {
  console.log(`\n☁️  Cloud: ${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}\n`);

  // 1. List root folders
  console.log('── Root folders ─────────────────────────');
  try {
    const { folders } = await cloudinary.api.root_folders();
    if (folders.length === 0) {
      console.log('  (no folders found — assets may be at root level)');
    } else {
      folders.forEach((f: { name: string; path: string }) =>
        console.log(`  📁 ${f.path}`)
      );
    }
  } catch (e) {
    console.error('  Error listing folders:', e);
  }

  // 2. Sample up to 10 resources with NO prefix filter (root level)
  console.log('\n── Sample resources (no prefix) ─────────');
  try {
    const { resources } = await cloudinary.api.resources({
      type: 'upload',
      max_results: 10,
    });
    if (resources.length === 0) {
      console.log('  (no resources found at root)');
    } else {
      resources.forEach((r: { public_id: string }) =>
        console.log(`  🖼  ${r.public_id}`)
      );
    }
  } catch (e) {
    console.error('  Error listing resources:', e);
  }

  // 3. Try common prefix variations
  const prefixes = ['awf-assets', 'awf', 'products', 'furniture'];
  for (const prefix of prefixes) {
    try {
      const { resources } = await cloudinary.api.resources({
        type: 'upload',
        prefix: prefix + '/',
        max_results: 3,
      });
      if (resources.length > 0) {
        console.log(`\n  ✅ Found ${resources.length} resources under "${prefix}/"`);
        resources.forEach((r: { public_id: string }) =>
          console.log(`     🖼  ${r.public_id}`)
        );
      }
    } catch {
      // silent — just checking
    }
  }
}

diagnose().catch(console.error);
