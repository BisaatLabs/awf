'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { Eye, EyeOff, Loader2, Mail, Lock, AlertCircle } from 'lucide-react';

export function LoginForm() {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw]     = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (authError) {
        setError(authError.message || 'Invalid email or password. Please try again.');
        setLoading(false);
        return;
      }

      if (data?.session) {
        const { data: role, error: roleError } = await supabase.from('user_roles').select('role').eq('user_id', data.user.id).single();
        if (roleError || role?.role !== 'admin') {
          await supabase.auth.signOut();
          setError('This account does not have administrator access.');
          setLoading(false);
          return;
        }
        // Full page redirect ensures SSR cookies are immediately sent and evaluated
        window.location.href = '/admin';
      } else {
        setError('Login failed to initiate session. Please check your credentials.');
        setLoading(false);
      }
    } catch (err: any) {
      setError(err?.message || 'An unexpected error occurred during sign in.');
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Email input */}
      <div>
        <label htmlFor="admin-email" className="mb-1.5 block text-xs font-bold uppercase tracking-[0.14em] text-[#3D4D43]">
          Email address
        </label>
        <div className="relative">
          <input
            id="admin-email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@alwahidfurnitures.com"
            className="w-full rounded-xl border border-[#111512]/12 bg-[#FAF7F2]/80 px-4 py-3 pl-10 text-sm text-[#111512] placeholder:text-[#111512]/35 outline-none transition-all duration-200 focus:border-[var(--green)] focus:bg-white focus:ring-2 focus:ring-[var(--green)]/15"
          />
          <Mail
            size={16}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#111512]/40"
          />
        </div>
      </div>

      {/* Password input */}
      <div>
        <div className="mb-1.5 flex items-center justify-between">
          <label htmlFor="admin-password" className="block text-xs font-bold uppercase tracking-[0.14em] text-[#3D4D43]">
            Password
          </label>
        </div>
        <div className="relative">
          <input
            id="admin-password"
            type={showPw ? 'text' : 'password'}
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••••••"
            className="w-full rounded-xl border border-[#111512]/12 bg-[#FAF7F2]/80 px-4 py-3 pl-10 pr-11 text-sm text-[#111512] placeholder:text-[#111512]/35 outline-none transition-all duration-200 focus:border-[var(--green)] focus:bg-white focus:ring-2 focus:ring-[var(--green)]/15"
          />
          <Lock
            size={16}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#111512]/40"
          />
          <button
            type="button"
            onClick={() => setShowPw((v) => !v)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#111512]/40 transition hover:text-[#111512] focus:outline-none"

            aria-label={showPw ? 'Hide password' : 'Show password'}
          >
            {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
      </div>

      {/* Error notification */}
      {error && (
        <div className="flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 p-3.5 text-xs text-red-700 animate-fadeIn">
          <AlertCircle size={15} className="mt-0.5 shrink-0 text-red-600" />
          <span>{error}</span>
        </div>
      )}

      {/* Submit button */}
      <button
        type="submit"
        disabled={loading}
        className="group relative mt-2 flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-[var(--green)] py-3.5 text-xs font-bold uppercase tracking-[0.16em] text-[var(--ivory)] shadow-md transition-all duration-300 hover:bg-[#1C372A] hover:shadow-lg active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? (
          <>
            <Loader2 size={15} className="animate-spin text-[var(--ivory)]" />
            <span>Verifying…</span>
          </>
        ) : (
          <span>Sign In to Dashboard</span>
        )}
      </button>
    </form>
  );
}
