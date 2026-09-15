// lib/supabase/server.ts
// Server-side Supabase client for Next.js Server Components and Route Handlers.
// Anonymous catalogue reads; this client does not forward user sessions.
// This file must only ever run on the server (no 'use client' directive here).

import 'server-only';
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const supabaseUrl  = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnon) {
  throw new Error(
    'Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY. ' +
    'Add them to .env.local — see .env.example for the full list.'
  );
}

/**
 * Creates a Supabase client for use in Server Components / Route Handlers.
 * Call this function once per request — do NOT share across requests.
 *
 * Example (Server Component):
 *   const supabase = createServerClient();
 *   const { data } = await supabase.from('products').select('*');
 */
export function createServerClient() {
  return createClient<Database>(supabaseUrl, supabaseAnon, {
    auth: {
      persistSession: false,   // no session storage on server
      autoRefreshToken: false,
    },
  });
}
