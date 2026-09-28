import { SiteShell } from '@/components/layout/SiteShell';
import './globals.css';
import type { Metadata } from 'next';
import { Cormorant_Garamond, Manrope } from 'next/font/google';

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
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://alwahidfurnitures.com'),
  title: 'Al Wahid Furnitures | Bespoke Furniture Built for Every Space',
  description:
    'Discover bespoke furniture for modern homes, offices, and institutional spaces. Explore our catalogue or request a custom furniture quotation from Al Wahid Furnitures.',
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icon.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
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
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
