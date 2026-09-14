'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { Eye, EyeOff, Loader2 } from 'lucide-react';

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
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="mb-1.5 block text-xs font-medium text-gray-700">
          Email address
        </label>
        <input
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="admin@example.com"
          className="w-full rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm text-gray-900 outline-none placeholder:text-gray-400 transition focus:border-[#1B4332] focus:ring-2 focus:ring-[#1B4332]/10"
        />
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-medium text-gray-700">
          Password
        </label>
        <div className="relative">
          <input
            type={showPw ? 'text' : 'password'}
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full rounded-lg border border-gray-200 px-3.5 py-2.5 pr-10 text-sm text-gray-900 outline-none placeholder:text-gray-400 transition focus:border-[#1B4332] focus:ring-2 focus:ring-[#1B4332]/10"
          />
          <button
            type="button"
            onClick={() => setShowPw((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            tabIndex={-1}
          >
            {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
      </div>

      {error && (
        <p className="rounded-lg bg-red-50 px-3.5 py-2.5 text-xs text-red-600 border border-red-100">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#1B4332] py-2.5 text-sm font-medium text-white transition hover:bg-[#14532d] disabled:opacity-60 cursor-pointer shadow-sm"
      >
        {loading && <Loader2 size={15} className="animate-spin" />}
        {loading ? 'Signing in…' : 'Sign in'}
      </button>
    </form>
  );
}
