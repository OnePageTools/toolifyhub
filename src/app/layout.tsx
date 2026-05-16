import type { Metadata } from 'next';
import './globals.css';
import { Analytics } from '@vercel/analytics/react';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import { Poppins, Inter, Playfair_Display, Noto_Nastaliq_Urdu } from 'next/font/google';
import Footer from '@/components/common/footer';
import Script from 'next/script';
import { SupportWidget } from '@/components/support-widget';

const siteConfig = {
  name: 'ToolifyHub',
  url: 'https://onepagetools.vercel.app',
  ogImage: 'https://placehold.co/1200x630/0F172A/FFFFFF?text=ToolifyHub+-+50+Free+Online+Tools',
  description: 'Your ultimate suite of 50+ free, professional online tools. Featuring AI-powered utilities like PDF converters, image compressors, text summarizers, and a resume builder. No sign-up required, 100% free.',
  title: 'ToolifyHub - Free All-in-One Tools for Productivity',
};

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.title,
    template: `%s`,
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

const notoUrdu = Noto_Nastaliq_Urdu({
  subsets: ['arabic'],
  display: 'swap',
  variable: '--font-noto-urdu',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${poppins.variable} ${inter.variable} ${playfair.variable} ${notoUrdu.variable} dark`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-EY46Z7XSVT"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-EY46Z7XSVT');
          `}
        </Script>
        {/* WebSite Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "ToolifyHub",
              "url": "https://onepagetools.vercel.app",
              "description": "50+ free online tools for productivity",
              "potentialAction": {
                "@type": "SearchAction",
                "target": {
                  "@type": "EntryPoint",
                  "urlTemplate": "https://onepagetools.vercel.app/?search={search_term_string}"
                },
                "query-input": "required name=search_term_string"
              }
            })
          }}
        />
        {/* Organization Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "ToolifyHub",
              "url": "https://onepagetools.vercel.app",
              "logo": "https://onepagetools.vercel.app/logo.png",
              "contactPoint": {
                "@type": "ContactPoint",
                "telephone": "+92-312-1374994",
                "contactType": "customer support",
                "availableLanguage": ["English", "Urdu"]
              }
            })
          }}
        />
      </head>
      <body className="font-body antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          forcedTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <div className="flex flex-col min-h-screen">
            <main className="flex-grow">{children}</main>
            <Footer />
          </div>
          <SupportWidget />
          <Toaster />
        </ThemeProvider>
      <Analytics />
</body>
    </html>
  );
}