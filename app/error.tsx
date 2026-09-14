'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { RotateCcw, Home } from 'lucide-react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Unhandled Application Error:', error);
  }, [error]);

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 pt-24 text-center">
      <span className="eyebrow text-[var(--walnut)]">Notice</span>
      <h1 className="mt-4 font-display text-4xl leading-tight text-[var(--green)] sm:text-5xl">
        Something went wrong
      </h1>
      <p className="mt-4 max-w-md text-sm leading-relaxed text-[var(--charcoal)]/60">
        We encountered a momentary issue while loading this page. Please try refreshing or return to the catalogue.
      </p>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
        <button
          onClick={() => reset()}
          className="inline-flex items-center gap-2 bg-[var(--green)] px-6 py-3.5 text-xs font-bold uppercase tracking-[.14em] text-[var(--ivory)] transition hover:bg-[var(--walnut)] cursor-pointer"
        >
          <RotateCcw size={14} /> Try Again
        </button>
        <Link
          href="/products"
          className="inline-flex items-center gap-2 border border-[var(--line)] px-6 py-3.5 text-xs font-bold uppercase tracking-[.14em] text-[var(--charcoal)] transition hover:border-[var(--green)]"
        >
          <Home size={14} /> View Catalogue
        </Link>
      </div>
    </div>
  );
}
