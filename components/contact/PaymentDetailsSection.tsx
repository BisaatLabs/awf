'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Check, Copy, CreditCard, ShieldCheck } from 'lucide-react';
import { COMPANY_INFO } from '@/data/company';

export function PaymentDetailsSection() {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  };

  return (
    <div className="border border-[var(--line)] bg-[var(--ivory)] p-6 sm:p-8">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck size={18} className="text-[var(--walnut)]" />
            <p className="text-[10px] font-bold uppercase tracking-[.14em] text-[var(--walnut)]">
              Payment & Bank Details
            </p>
          </div>
          <h3 className="mt-1 font-display text-2xl text-[var(--green)]">
            Direct Bank & Mobile Transfer
          </h3>
        </div>
        <p className="text-xs text-[var(--charcoal)]/60 max-w-xs">
          For advance payments, quotations & custom furniture orders.
        </p>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {COMPANY_INFO.paymentMethods.map((method) => (
          <div
            key={method.id}
            className="flex flex-col justify-between rounded-sm border border-[var(--line)] bg-white p-5 shadow-2xs transition-shadow hover:shadow-sm"
          >
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-[var(--line)]/50">
                <div className="flex h-7 w-20 items-center">
                  <Image
                    src={`/images/payments/${method.id}.svg`}
                    alt={method.name}
                    width={70}
                    height={28}
                    className="h-full w-auto object-contain"
                  />
                </div>
                <span className="text-[9px] font-bold uppercase tracking-wider text-[var(--stone)]">
                  {method.type}
                </span>
              </div>

              <div className="mt-4">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--walnut)]">
                  Account Title
                </span>
                <p className="mt-0.5 text-xs font-semibold text-[var(--charcoal)]">
                  {method.accountTitle}
                </p>
              </div>

              <div className="mt-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--walnut)]">
                  {method.id === 'mcb' ? 'Account Number' : 'Mobile Account No'}
                </span>
                <div className="mt-1 flex items-center justify-between gap-2 rounded bg-[#FAF7F2] px-2.5 py-1.5 border border-[var(--line)]/60">
                  <span className="font-mono text-xs font-bold tracking-wider text-[var(--charcoal)]">
                    {method.accountNumber}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopy(method.id, method.accountNumber)}
                    className="inline-flex shrink-0 items-center gap-1 rounded bg-white px-2 py-0.5 text-[10px] font-bold text-[var(--green)] shadow-2xs transition hover:bg-[var(--green)] hover:text-white"
                  >
                    {copiedId === method.id ? (
                      <>
                        <Check size={11} className="text-emerald-600" /> Done
                      </>
                    ) : (
                      <>
                        <Copy size={11} /> Copy
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            <p className="mt-4 text-[11px] text-[var(--charcoal)]/50 border-t border-[var(--line)]/40 pt-2">
              {method.note}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
