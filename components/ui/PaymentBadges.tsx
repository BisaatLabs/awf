'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Check, Copy, Info, Sparkles } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { COMPANY_INFO } from '@/data/company';

interface PaymentBadgesProps {
  className?: string;
  showHelperText?: boolean;
}

export function PaymentBadges({ className = '', showHelperText = true }: PaymentBadgesProps) {
  const [selectedMethod, setSelectedMethod] = useState<(typeof COMPANY_INFO.paymentMethods)[number] | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  };

  return (
    <>
      <div className={`flex flex-col items-center justify-center gap-2.5 text-center ${className}`}>
        {/* Click for details hint label */}
        {showHelperText && (
          <div className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-[11px] font-medium text-[var(--ivory)]/85 backdrop-blur-xs transition hover:bg-white/15">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Click any logo for bank & transfer details</span>
          </div>
        )}

        {/* Larger Payment Logo Badges (MCB, Easypaisa, JazzCash) */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          {COMPANY_INFO.paymentMethods.map((method) => {
            const logoPath = `/images/payments/${method.id}.svg`;
            return (
              <button
                key={method.id}
                type="button"
                onClick={() => setSelectedMethod(method)}
                title={`Click for ${method.name} account details`}
                className="group relative flex h-[38px] w-[76px] sm:h-[42px] sm:w-[86px] cursor-pointer items-center justify-center rounded-md bg-white p-1.5 shadow-sm border border-black/10 sm:border-white/20 transition-all duration-200 hover:-translate-y-0.5 hover:scale-105 hover:shadow-md hover:ring-2 hover:ring-[var(--walnut)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--walnut)]"
              >
                <Image
                  src={logoPath}
                  alt={method.name}
                  width={80}
                  height={38}
                  className="h-full w-full object-contain transition-opacity group-hover:opacity-90"
                />
              </button>
            );
          })}
        </div>
      </div>

      {/* Payment Details Dialog */}
      <Dialog open={!!selectedMethod} onOpenChange={(open) => !open && setSelectedMethod(null)}>
        <DialogContent className="max-w-md bg-[#FAF7F2] border-[var(--line)] text-[var(--charcoal)] p-6 sm:p-8">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-16 items-center justify-center rounded-md bg-white p-1.5 border border-[var(--line)] shadow-2xs">
                {selectedMethod && (
                  <Image
                    src={`/images/payments/${selectedMethod.id}.svg`}
                    alt={selectedMethod.name}
                    width={56}
                    height={30}
                    className="h-full w-full object-contain"
                  />
                )}
              </div>
              <div>
                <DialogTitle className="font-display text-2xl text-[var(--green)]">
                  {selectedMethod?.name}
                </DialogTitle>
                <DialogDescription className="text-xs text-[var(--charcoal)]/60">
                  {selectedMethod?.note}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          {selectedMethod && (
            <div className="mt-4 space-y-3.5">
              <div className="rounded-md border border-[var(--line)] bg-white p-3.5 shadow-2xs">
                <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--walnut)]">
                  Account Title
                </span>
                <p className="mt-1 font-semibold text-sm text-[var(--charcoal)]">
                  {selectedMethod.accountTitle}
                </p>
              </div>

              <div className="rounded-md border border-[var(--line)] bg-white p-3.5 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--walnut)]">
                    {selectedMethod.id === 'mcb' ? 'Account Number (A/C)' : 'Mobile Account No'}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopy(selectedMethod.id, selectedMethod.accountNumber)}
                    className="inline-flex items-center gap-1 rounded bg-[#F5EFE6] px-2.5 py-1 text-xs font-semibold text-[var(--green)] transition hover:bg-[var(--green)] hover:text-white"
                  >
                    {copiedId === selectedMethod.id ? (
                      <>
                        <Check size={13} className="text-emerald-600" /> Copied!
                      </>
                    ) : (
                      <>
                        <Copy size={13} /> Copy
                      </>
                    )}
                  </button>
                </div>
                <p className="mt-1 font-mono text-lg font-bold tracking-wider text-[var(--charcoal)]">
                  {selectedMethod.accountNumber}
                </p>
              </div>

              <div className="pt-2 text-center text-xs text-[var(--charcoal)]/65">
                After making payment, please send screenshot on{' '}
                <a
                  href={COMPANY_INFO.contact.whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="font-bold text-[var(--green)] underline"
                >
                  WhatsApp
                </a>{' '}
                with your order or quote reference.
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
