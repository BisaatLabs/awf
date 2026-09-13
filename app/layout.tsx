import './globals.css';
import type { Metadata } from 'next';
import { Cormorant_Garamond, Manrope } from 'next/font/google';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { SmoothScroll } from '@/components/layout/SmoothScroll';
import { WhatsAppFloat } from '@/components/layout/WhatsAppFloat';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['600'],
  variable: '--font-cormorant',
  display: 'swap',
});

const manrope = Manrope({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-manrope',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://alwahidfurnitures.com'),
  title: 'Al Wahid Furnitures | Bespoke Furniture Built for Every Space',
  description:
    'Discover bespoke furniture for modern homes, offices, and institutional spaces. Explore our catalogue or request a custom furniture quotation from Al Wahid Furnitures.',
  openGraph: {
    title: 'Al Wahid Furnitures | Built for Every Space',
    description:
      'Thoughtfully crafted furniture for modern homes, workplaces, and educational institutions.',
    images: ['/images/logo/logo.png'],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${cormorant.variable} ${manrope.variable}`}>
        <SmoothScroll />
        <Header />
        <main>{children}</main>
        <Footer />
        <WhatsAppFloat />
      </body>
    </html>
  );
}
