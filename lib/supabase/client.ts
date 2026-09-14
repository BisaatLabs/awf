// lib/supabase/client.ts
// Browser-side Supabase client using @supabase/ssr.
// Cookie-aware so authentication syncs seamlessly with SSR middleware and Server Components.

import { createBrowserClient } from '@supabase/ssr';
import type { Database } from './types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnon) {
  throw new Error(
    'Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY. ' +
    'Add them to .env.local — see .env.example for the full list.'
  );
}

export const supabase = createBrowserClient<Database>(
  supabaseUrl,
  supabaseAnon
);
