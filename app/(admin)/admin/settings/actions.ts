'use server';

import { createClient } from '@supabase/supabase-js';
import { requireAdmin } from '@/lib/supabase/ssr-client';
import { passwordChangeSchema } from '@/lib/admin-security';

export async function changeAdminPassword(input: unknown) {
  const parsed = passwordChangeSchema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  let db;
  try { db = await requireAdmin(); }
  catch { return { error: 'Your administrator session has expired. Sign in again.' }; }
  const { data: { user } } = await db.auth.getUser();
  if (!user?.email) return { error: 'Sign in with your email and password first.' };

  // A separate, non-persistent client verifies the password without replacing browser cookies.
  const verifier = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  });
  try {
    const { data, error } = await verifier.auth.signInWithPassword({ email: user.email, password: parsed.data.currentPassword });
    if (error || data.user?.id !== user.id) return { error: 'Current password could not be verified. Check it and try again.' };
    const { error: updateError } = await verifier.auth.updateUser({
      password: parsed.data.newPassword, current_password: parsed.data.currentPassword,
    });
    if (updateError) return { error: updateError.code === 'weak_password'
      ? 'Choose a stronger password that meets your account password policy.'
      : 'Password could not be changed. Try again, or sign in again if your session has expired.' };
    // Revoke refresh sessions after a credential change; expired access tokens may remain valid until expiry.
    const { error: signOutError } = await db.auth.signOut({ scope: 'global' }).catch(() => ({ error: new Error('Sign-out failed') }));
    return { success: true, warning: signOutError ? 'Password changed. Sign out of other devices manually.' : undefined };
  } catch {
    return { error: 'Unable to contact the authentication service. Please try again.' };
  } finally {
    await verifier.auth.signOut({ scope: 'local' }).catch(() => undefined);
  }
}
