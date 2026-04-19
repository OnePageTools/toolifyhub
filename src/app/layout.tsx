
import type { Metadata } from 'next';
import './globals.css';
import { Analytics } from '@vercel/analytics/react';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import { Poppins, Inter, Playfair_Display } from 'next/font/google';
import Footer from '@/components/common/footer';

const siteConfig = {
  name: 'ToolifyHub',
  url: 'https://toolifyhub.com',
  ogImage: 'https://toolifyhub.com/og.png',
  description: 'Your ultimate suite of 20+ free, professional online tools. Featuring AI-powered utilities like PDF converters, image compressors, text summarizers, and a resume builder. No sign-up required, 100% free.',
  title: 'ToolifyHub - Free All-in-One Tools for Productivity',
};

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    "free online tools",
    "productivity tools",
    "pdf tools",
    "image tools",
    "developer tools",
    "text tools",
    "resume builder",
  ],
  authors: [{ name: 'ToolifyHub' }],
  creator: 'ToolifyHub',
  verification: {
    google: "rBMCQjItPptEmhBrwvazsrpiqZr3uTbw6UlH4iuvKl4",
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteConfig.url,
    title: siteConfig.title,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.title,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

const poppins = Poppins({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-poppins',
  weight: ['400', '500', '600', '700', '800', '900'],
});

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-playfair',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${poppins.variable} ${inter.variable} ${playfair.variable}`}>
      <head />
      <body className="font-body antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex flex-col min-h-screen">
            <main className="flex-grow">{children}</main>
            <Footer />
          </div>
          <Toaster />
        </ThemeProvider>
      <Analytics />
</body>
    </html>
  );
}
