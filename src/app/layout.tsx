
import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import { Poppins, Inter, Playfair_Display } from 'next/font/google';

export const metadata: Metadata = {
  verification: {
    google: "rBMCQjItPptEmhBrwvazsrpiqZr3uTbw6UlH4iuvKl4",
  },
  title: 'ToolifyHub - Free All-in-One Tools for Productivity',
  description:
    'Your ultimate suite of 20+ free, professional online tools. Featuring AI-powered utilities like PDF converters, image compressors, text summarizers, and a resume builder. No sign-up required, 100% free.',
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
          <main>{children}</main>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
