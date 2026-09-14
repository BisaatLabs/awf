'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MessageCircle } from 'lucide-react';
import { WHATSAPP_BASE_URL } from '@/lib/whatsapp';

export function WhatsAppFloat() {
  const pathname = usePathname();

  if (pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <Link
      href={WHATSAPP_BASE_URL}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="fixed bottom-5 right-5 z-30 flex items-center gap-3 bg-[var(--green)] px-4 py-3 text-[var(--ivory)] shadow-lg transition-transform hover:-translate-y-1"
    >
      <MessageCircle size={18} />
      <span className="hidden text-[11px] font-bold uppercase tracking-[.13em] sm:inline">
        Chat with us
      </span>
    </Link>
  );
}
