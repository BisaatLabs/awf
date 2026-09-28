import type { Metadata } from 'next';
import { Phone, Mail, MapPin, MessageCircle, ArrowUpRight, Instagram, Facebook } from 'lucide-react';
import { QuoteForm } from '@/components/forms/QuoteForm';
import { PaymentDetailsSection } from '@/components/contact/PaymentDetailsSection';
import { ShopMapCard } from '@/components/contact/ShopMapCard';
import { WHATSAPP_BASE_URL, WHATSAPP_NUMBER } from '@/lib/whatsapp';
import { COMPANY_INFO } from '@/data/company';

export const metadata: Metadata = {
  title: 'Contact & Location | Al Wahid Furnitures',
  description:
    'Visit our showroom at Shop #19 & 20, Zeenat Square, Liaquatabad, Karachi, Pakistan. Request a quote or get in touch on WhatsApp.',
};

export default function ContactPage() {
  return (
    <div className="pt-[82px]">
      {/* Hero Header */}
      <section className="section-pad">
        <div className="container-wide">
          <p className="eyebrow">Contact & Location</p>
          <h1 className="mt-4 max-w-3xl font-display text-5xl leading-[.95] tracking-[-.03em] text-[var(--green)] sm:text-6xl lg:text-7xl">
            Let’s build the right fit for your space.
          </h1>
          <p className="mt-6 max-w-xl text-sm leading-7 text-[var(--charcoal)]/65">
            Visit our showroom in Karachi, discuss your custom requirements with our master craftsmen, or request a quotation.
          </p>
        </div>
      </section>

      {/* Main Grid: Form (Left) + Contact Cards & Map (Right) */}
      <section className="section-pad pt-0">
        <div className="container-wide grid gap-12 lg:grid-cols-[1.3fr_1fr] lg:gap-16 items-start">
          {/* Quote Form */}
          <div>
            <p className="eyebrow">Request a Quote</p>
            <h2 className="mt-4 font-display text-3xl text-[var(--green)] sm:text-4xl">
              Quote & Enquiry Form.
            </h2>
            <div className="mt-10">
              <QuoteForm />
            </div>
          </div>

          {/* Quick Contact Cards & Embedded Map Below Follow Us */}
          <div className="lg:pt-16">
            <div className="grid gap-px bg-[var(--line)]">
              {/* WhatsApp */}
              <div className="bg-[var(--ivory)] p-6">
                <MessageCircle size={20} className="text-[var(--walnut)]" />
                <p className="mt-4 text-[10px] font-bold uppercase tracking-[.13em] text-[var(--walnut)]">
                  WhatsApp
                </p>
                <a
                  href={WHATSAPP_BASE_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-1 block font-display text-2xl text-[var(--charcoal)] hover:text-[var(--green)] transition"
                >
                  +{WHATSAPP_NUMBER}
                </a>
                <p className="mt-1 text-xs text-[var(--charcoal)]/50">
                  Quick responses for inquiries & quotes
                </p>
              </div>

              {/* Phone */}
              <div className="bg-[var(--ivory)] p-6">
                <Phone size={20} className="text-[var(--walnut)]" />
                <p className="mt-4 text-[10px] font-bold uppercase tracking-[.13em] text-[var(--walnut)]">
                  Call Us
                </p>
                <a
                  href={`tel:${COMPANY_INFO.contact.phoneRaw}`}
                  className="mt-1 block font-display text-2xl text-[var(--charcoal)] hover:text-[var(--green)] transition"
                >
                  {COMPANY_INFO.contact.phoneDisplay}
                </a>
              </div>

              {/* Email */}
              <div className="bg-[var(--ivory)] p-6">
                <Mail size={20} className="text-[var(--walnut)]" />
                <p className="mt-4 text-[10px] font-bold uppercase tracking-[.13em] text-[var(--walnut)]">
                  Email
                </p>
                <a
                  href={`mailto:${COMPANY_INFO.contact.email}`}
                  className="mt-1 block font-display text-xl sm:text-2xl text-[var(--charcoal)] hover:text-[var(--green)] transition break-all"
                >
                  {COMPANY_INFO.contact.email}
                </a>
              </div>

              {/* Showroom / Shop Location */}
              <div className="bg-[var(--ivory)] p-6">
                <MapPin size={20} className="text-[var(--walnut)]" />
                <p className="mt-4 text-[10px] font-bold uppercase tracking-[.13em] text-[var(--walnut)]">
                  Showroom & Workshop Location
                </p>
                <p className="mt-1 font-display text-xl text-[var(--charcoal)] leading-snug">
                  {COMPANY_INFO.address.full}
                </p>
                <a
                  href={COMPANY_INFO.address.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[var(--green)] hover:underline"
                >
                  Open in Google Maps <ArrowUpRight size={14} />
                </a>
              </div>

              {/* Social Channels (Instagram & Facebook) */}
              <div className="bg-[var(--ivory)] p-6">
                <p className="text-[10px] font-bold uppercase tracking-[.13em] text-[var(--walnut)]">
                  Follow Us
                </p>
                <div className="mt-3 flex items-center gap-3">
                  <a
                    href={COMPANY_INFO.social.instagram.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-sm bg-white px-3.5 py-2 text-xs font-semibold text-[var(--charcoal)] border border-[var(--line)] shadow-2xs hover:border-[var(--green)] hover:text-[var(--green)] transition"
                  >
                    <Instagram size={16} className="text-[#E1306C]" />
                    <span>Instagram</span>
                  </a>
                  <a
                    href={COMPANY_INFO.social.facebook.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-sm bg-white px-3.5 py-2 text-xs font-semibold text-[var(--charcoal)] border border-[var(--line)] shadow-2xs hover:border-[var(--green)] hover:text-[var(--green)] transition"
                  >
                    <Facebook size={16} className="text-[#1877F2]" />
                    <span>Facebook</span>
                  </a>
                </div>
              </div>

              {/* Compact Map Card Below Follow Us */}
              <div className="bg-[var(--ivory)] p-5">
                <p className="text-[10px] font-bold uppercase tracking-[.13em] text-[var(--walnut)] mb-3">
                  Interactive Location Map
                </p>
                <ShopMapCard heightClass="h-[185px] sm:h-[195px]" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Payment Details Section */}
      <section className="section-pad pt-0">
        <div className="container-wide">
          <PaymentDetailsSection />
        </div>
      </section>
    </div>
  );
}
