import './globals.css';
import type { Metadata } from 'next';
import { Playfair_Display, Cormorant_Garamond, Special_Elite, Lora } from 'next/font/google';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { Toaster } from '@/components/ui/toaster';
import { CartDrawer } from '@/components/cart/cart-drawer';
import { site } from '@/data/site';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
});

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  variable: '--font-cormorant',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
});

const elite = Special_Elite({
  subsets: ['latin'],
  variable: '--font-elite',
  display: 'swap',
  weight: ['400'],
});

const lora = Lora({
  subsets: ['latin'],
  variable: '--font-lora',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
});

export const metadata: Metadata = {
  title: `${site.name} — ${site.tagline}`,
  description: `${site.name} is a vintage-styled cloud kitchen serving fire-cooked Indian cuisine. ${site.tagline}`,
  keywords: ['cloud kitchen', 'Indian food', 'biryani', 'tandoor', 'Bengaluru delivery', 'Hearth & Ember'],
  openGraph: {
    title: `${site.name} — ${site.tagline}`,
    description: `${site.name} is a vintage-styled cloud kitchen serving fire-cooked Indian cuisine.`,
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${playfair.variable} ${cormorant.variable} ${elite.variable} ${lora.variable}`}>
      <body className="vignette font-lora antialiased">
        <Navbar />
        <main className="relative z-10 pt-20 lg:pt-24">{children}</main>
        <Footer />
        <CartDrawer />
        <Toaster />
      </body>
    </html>
  );
}
