'use client';
import { useState } from 'react';
import Link from 'next/link';
import { changeAdminPassword } from '@/app/(admin)/admin/settings/actions';
import { passwordChangeSchema } from '@/lib/admin-security';
import { supabase } from '@/lib/supabase/client';

export function PasswordForm() {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [show, setShow] = useState(false);
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    const parsed = passwordChangeSchema.safeParse(data);
    if (!parsed.success) { setError(parsed.error.issues[0].message); return; }
    setBusy(true); setError('');
    try {
      const result = await changeAdminPassword(parsed.data);
      if (result.error) { setError(result.error); return; }
      form.reset();
      // Clear the browser's cached session as well as the server cookies.
      await supabase.auth.signOut({ scope: 'local' }).catch(() => undefined);
      setSuccess(result.warning || 'Password changed successfully. Sign in again with your new password.');
    } catch { setError('Unable to change your password. Please try again.'); }
    finally { setBusy(false); }
  }
  if (success) return <div role="status" className="rounded-xl border bg-white p-6"><p className="mb-4 text-sm text-green-800">{success}</p><Link href="/admin/login" className="text-sm font-semibold underline">Return to sign in</Link></div>;
  return <form onSubmit={submit} className="space-y-5 rounded-xl border bg-white p-6">
    <h2 className="text-lg font-semibold">Change password</h2>
    <p className="text-sm text-gray-500">Use at least 12 characters. You will need to sign in again after changing your password.</p>
    {[
      ['currentPassword', 'Current password', 'current-password'],
      ['newPassword', 'New password', 'new-password'],
      ['confirmPassword', 'Confirm new password', 'new-password'],
    ].map(([name, label, autoComplete]) => <label key={name} className="block text-sm font-medium">{label}<input name={name} type={show ? 'text' : 'password'} autoComplete={autoComplete} required disabled={busy} maxLength={name === 'currentPassword' ? 256 : 72} className="mt-2 block w-full rounded-lg border px-3 py-2" /></label>)}
    <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={show} onChange={e => setShow(e.target.checked)} />Show passwords</label>
    {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
    <button disabled={busy} className="rounded-lg bg-[#1B4332] px-5 py-3 text-sm font-semibold text-white disabled:opacity-60">{busy ? 'Updating…' : 'Change password'}</button>
  </form>;
}
