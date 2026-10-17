import './globals.css';
import type { Metadata, Viewport } from 'next';
import { Playfair_Display, Cormorant_Garamond, Special_Elite, Lora } from 'next/font/google';
import { MotionConfig } from 'framer-motion';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { Toaster } from '@/components/ui/toaster';
import { CartDrawer } from '@/components/cart/cart-drawer';
import { ScrollProgress } from '@/components/layout/scroll-progress';
import { BackToTop } from '@/components/layout/back-to-top';
import { IntroScreen } from '@/components/layout/intro-screen';
import { CustomCursor } from '@/components/layout/custom-cursor';
import { AnnouncementBar } from '@/components/layout/announcement-bar';
import { siteConfig } from '@/lib/siteConfig';

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
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} — ${siteConfig.tagline}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  openGraph: {
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.description,
    type: 'website',
    siteName: siteConfig.name,
    url: siteConfig.url,
  },
  twitter: {
    card: 'summary_large_image',
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.description,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: siteConfig.themeColor,
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${playfair.variable} ${cormorant.variable} ${elite.variable} ${lora.variable}`}>
      <body className="vignette font-lora antialiased">
        <MotionConfig reducedMotion="user">
          {/* Skip to content link */}
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[200] focus:bg-oxblood focus:text-cream focus:px-4 focus:py-2 focus:font-elite focus:text-xs focus:uppercase focus:tracking-wider focus:border-2 focus:border-brass"
          >
            Skip to main content
          </a>

          <IntroScreen />
          <ScrollProgress />
          <AnnouncementBar />
          <Navbar />
          <main id="main" className="relative z-10 pt-20 lg:pt-24">
            {children}
          </main>
          <Footer />
          <CartDrawer />
          <Toaster />
          <BackToTop />
          <CustomCursor />
        </MotionConfig>
      </body>
    </html>
  );
}
