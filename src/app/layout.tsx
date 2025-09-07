import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { Header } from '@/components/common/header';
import { Toaster } from '@/components/ui/toaster';
import { Footer } from '@/components/common/footer';
import { Poppins, Roboto_Mono } from 'next/font/google';

export const metadata: Metadata = {
  title: 'Toolbox AI - Your All-in-One Free Toolkit',
  description:
    'A collection of 20+ free online tools including AI-powered utilities for text, images, and more. No sign-up required.',
};

const poppins = Poppins({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-poppins',
  weight: ['400', '500', '600', '700', '800', '900'],
});

const robotoMono = Roboto_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-roboto-mono',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${poppins.variable} ${robotoMono.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="relative flex min-h-screen flex-col bg-background">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
            >
              <div className="absolute left-[20%] top-[5%] h-32 w-32 rounded-full bg-primary/20 blur-3xl" />
              <div className="absolute right-[10%] top-[10%] h-48 w-48 rounded-full bg-accent/20 blur-3xl" />
              <div className="absolute bottom-[10%] left-[5%] h-40 w-40 rounded-full bg-primary/10 blur-3xl" />
            </div>
            <Header />
            <main className="flex-grow z-10">{children}</main>
            <Footer />
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
