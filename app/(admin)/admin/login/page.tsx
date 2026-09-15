// app/admin/login/page.tsx
// Standalone admin authentication page with minimal light architectural aesthetic

import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ShieldCheck } from 'lucide-react';
import { LoginForm } from '@/components/admin/LoginForm';

export const metadata = { title: 'Admin Portal — Al Wahid Furnitures' };

export default function LoginPage() {
  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-[#FAF7F2] px-4 py-12 text-[#111512] select-none">
      {/* 1. Subtle Ambient Lighting Glows */}
      <div className="pointer-events-none absolute inset-0">
        {/* Soft Emerald Glow in Top-Left */}
        <div className="absolute -left-[10%] -top-[10%] h-[550px] w-[550px] rounded-full bg-[radial-gradient(circle,rgba(41,72,58,0.08)_0%,transparent_70%)] blur-3xl" />

        {/* Soft Warm Walnut Glow in Bottom-Right */}
        <div className="absolute -bottom-[10%] -right-[10%] h-[600px] w-[600px] rounded-full bg-[radial-gradient(circle,rgba(123,81,53,0.06)_0%,transparent_70%)] blur-3xl" />
      </div>

      {/* 2. Minimal Precision Drafting Grid Pattern */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage: `
            linear-gradient(to right, #111512 1px, transparent 1px),
            linear-gradient(to bottom, #111512 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      />

      {/* 3. Subtle Concentric Architectural Geometric Rings */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-[0.03]">
        <div className="h-[760px] w-[760px] rounded-full border border-[#111512]" />
        <div className="absolute h-[540px] w-[540px] rounded-full border border-dashed border-[#111512]" />
        <div className="absolute h-[320px] w-[320px] rounded-full border border-[#111512]" />
      </div>

      {/* 4. Login Card Container */}
      <div className="relative z-10 w-full max-w-[420px]">
        {/* Card */}
        <div className="relative overflow-hidden rounded-3xl border border-[#111512]/8 bg-white/90 p-7 shadow-[0_20px_50px_rgba(27,51,40,0.07)] backdrop-blur-xl sm:p-9">
          {/* Subtle Top Green Accent Line */}
          <div className="pointer-events-none absolute inset-x-8 -top-px h-[2px] bg-gradient-to-r from-transparent via-[var(--green)]/40 to-transparent" />

          {/* Brand Emblem & Heading */}
          <div className="mb-8 text-center">
            <div className="mx-auto mb-3 flex items-center justify-center">
              <Image
                src="/images/logo/logo.png"
                alt="Al Wahid Furnitures"
                width={160}
                height={86}
                className="object-contain"
                priority
              />
            </div>
            <p className="mt-1 text-xs font-semibold uppercase tracking-[0.2em] text-[#6D7872]">
              Admin Portal
            </p>
          </div>

          {/* Form */}
          <LoginForm />

          {/* Security Notice */}
          <div className="mt-7 flex items-center justify-center gap-2 border-t border-[#111512]/6 pt-5 text-[11px] text-[#7A8880]">
            <ShieldCheck size={13} className="text-[var(--green)]" />
            <span>End-to-end encrypted session</span>
          </div>
        </div>

        {/* Return to website link */}
        <div className="mt-6 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#66756D] transition-colors hover:text-[var(--green)]"
          >
            <ArrowLeft size={13} />
            <span>Return to public website</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
