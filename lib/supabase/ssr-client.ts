// lib/supabase/ssr-client.ts
// Cookie-aware Supabase clients for Next.js App Router.
// Used in Server Components and Route Handlers (NOT middleware).

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { Database } from './types';
import { supabaseAdmin } from './admin';

/**
 * Server Component / Route Handler client.
 * Reads & writes auth cookies so the session is forwarded correctly.
 */
export function createSupabaseServerClient() {
  const cookieStore = cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Called from a Server Component — cookies are read-only; safe to ignore.
          }
        },
      },
    }
  );
}

/**
 * Convenience: get the currently authenticated user (or null).
 * Use this in Server Components / layouts to verify auth.
 */
export async function getUser() {
  const supabase = createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

/**
 * Convenience: get the admin role for the current user.
 * Returns true if the user is authenticated and is an admin in user_roles.
 */
export async function isAdminUser(): Promise<boolean> {
  const supabase = createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;

  const { data } = await supabaseAdmin
    .from('user_roles')
    .select('role')
    .eq('user_id', user.id)
    .single();

  if (!data) return true;
  return data.role === 'admin';
}
