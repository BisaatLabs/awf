/**
 * scripts/inspect-cloudinary.ts
 * Prints the raw data of the first 5 assets from your Cloudinary folder.
 * Run: npx tsx scripts/inspect-cloudinary.ts
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

async function inspect() {
  console.log(`\n☁️  Cloud: ${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}\n`);

  // Fetch first 3 assets from the entire account — no filter
  const raw: any = await cloudinary.api.resources({
    type: 'upload',
    max_results: 3,
  });

  console.log(`Total assets in account: ${raw.rate_limit_remaining ?? 'unknown'}`);
  console.log('\n── First 3 assets (raw) ──────────────────────────────\n');
  for (const r of raw.resources ?? []) {
    console.log(JSON.stringify(r, null, 2));
    console.log('---');
  }

  // Also list root folders
  console.log('\n── Root folders ─────────────────────────────────────\n');
  try {
    const { folders } = await cloudinary.api.root_folders();
    console.log(JSON.stringify(folders, null, 2));
  } catch(e: any) {
    console.log('root_folders error:', e?.error?.message ?? e);
  }
}

inspect().catch(console.error);
