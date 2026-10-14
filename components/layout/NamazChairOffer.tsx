'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, MessageCircle, X } from 'lucide-react';
import * as Dialog from '@radix-ui/react-dialog';
import chair from '@/data/namaz-chair.json';
import { createWhatsAppUrl } from '@/lib/whatsapp';

const DISMISSED_KEY = 'awf-namaz-chair-offer-18000';
const orderUrl = createWhatsAppUrl('Hello Al Wahid Furnitures, I would like to order the Namaz Chair at the advertised offer price of PKR 18,000. Please confirm availability and delivery charges.');

export function NamazChairOffer() {
  const [open, setOpen] = useState(false);
  const closeButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    try { if (sessionStorage.getItem(DISMISSED_KEY)) return; } catch { /* Storage may be disabled. */ }
    const timer = window.setTimeout(() => setOpen(true), 700);
    return () => window.clearTimeout(timer);
  }, []);

  const dismiss = () => {
    setOpen(false);
    try { sessionStorage.setItem(DISMISSED_KEY, '1'); } catch { /* Keep dismissal functional without storage. */ }
  };

  return (
    <Dialog.Root open={open} onOpenChange={(value) => value ? setOpen(true) : dismiss()}>
      <Dialog.Portal>
        <Dialog.Overlay className="chair-offer-overlay fixed inset-0 z-[60] bg-[var(--green-dark)]/70 backdrop-blur-sm" />
        <Dialog.Content
          className="chair-offer-panel fixed left-1/2 top-1/2 z-[61] w-[calc(100%_-_32px)] max-w-3xl -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-[28px] border border-[var(--walnut)]/20 bg-[var(--ivory-light)] shadow-2xl outline-none"
          onOpenAutoFocus={(event) => { event.preventDefault(); closeButton.current?.focus(); }}
          onCloseAutoFocus={(event) => {
            event.preventDefault();
            document.querySelector<HTMLAnchorElement>('a[aria-label="Al Wahid Furnitures home"]')?.focus({ preventScroll: true });
          }}
        >
          <Dialog.Close ref={closeButton} aria-label="Close offer" className="absolute right-3 top-3 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-[var(--walnut)]/20 bg-[var(--ivory-light)] text-[var(--green)] shadow-sm transition hover:bg-[var(--ivory)] active:scale-95">
            <X size={20} />
          </Dialog.Close>
          <div className="grid md:grid-cols-2">
            <div className="relative min-h-[220px] bg-white md:min-h-[460px]">
              <span className="absolute left-4 top-4 z-10 rounded-full bg-[var(--walnut)] px-4 py-2 text-[10px] font-bold uppercase tracking-[.15em] text-[var(--ivory-light)]">Special offer</span>
              <Image src={chair.images[0]} alt="Gold-tone folding Namaz chair with patterned upholstery and padded prayer support" fill sizes="(max-width: 767px) 90vw, 384px" className="object-contain p-5 pt-12" />
            </div>
            <div className="flex flex-col justify-center p-6 md:p-9">
              <p className="eyebrow">Comfort for your prayer space</p>
              <Dialog.Title className="mt-3 font-display text-4xl leading-tight text-[var(--green-dark)] md:text-5xl">Huge offer.<br />Namaz Chair.</Dialog.Title>
              <Dialog.Description className="mt-3 text-sm leading-6 text-[var(--charcoal)]/65">Upholstered comfort, a folding metal frame, and an attached padded prayer support.</Dialog.Description>
              <div className="my-5 rounded-2xl border border-[var(--walnut)]/20 bg-[var(--ivory)] px-5 py-4">
                <p className="text-[10px] font-bold uppercase tracking-[.16em] text-[var(--walnut)]">Now only</p>
                <p className="mt-1 text-4xl font-bold tracking-tight text-[var(--green)]"><span className="mr-2 text-sm font-semibold tracking-normal">PKR</span>18,000</p>
              </div>
              <a href={orderUrl} target="_blank" rel="noreferrer" onClick={dismiss} className="flex min-h-12 items-center justify-center gap-3 rounded-2xl border border-white/20 bg-gradient-to-br from-[var(--green)] to-[var(--green-dark)] px-5 py-3 text-sm font-semibold text-[var(--ivory-light)] shadow-lg transition hover:shadow-xl active:scale-[.98]">
                <MessageCircle size={18} /> Order on WhatsApp
              </a>
              <Link href={`/products/${chair.slug}`} onClick={dismiss} className="mt-2 flex min-h-11 items-center justify-center gap-2 text-xs font-bold text-[var(--green)]">View chair details <ArrowUpRight size={15} /></Link>
              <p className="mt-1 text-center text-[11px] leading-5 text-[var(--charcoal)]/55">Confirm availability and delivery charges on WhatsApp.</p>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
