// lib/supabase/admin.ts
// ⚠️  SERVER-ONLY — never import this in a 'use client' component.
// Uses the service-role key which BYPASSES Row Level Security.
// Only used for admin operations and the one-time seed migration.

import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const supabaseUrl         = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey      = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error(
    'Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY. ' +
    'These must be set in .env.local and are NEVER exposed to the browser.'
  );
}

/**
 * Admin Supabase client — bypasses RLS.
 * Use ONLY in server-side scripts and trusted server actions.
 */
export const supabaseAdmin = createClient<Database>(supabaseUrl, serviceRoleKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});
