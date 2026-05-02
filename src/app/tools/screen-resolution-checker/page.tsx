import type { Metadata } from 'next';
import { ScreenResolutionCheckerForm } from '@/components/tools/screen-resolution-checker-form';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { Monitor } from 'lucide-react';

const tool = {
  name: 'Screen Resolution Checker',
  url: '/tools/screen-resolution-checker',
  title: 'Screen Resolution Checker Online Free — Check Your Screen Size Instantly',
  description: 'Free online screen resolution checker. Check your screen width, height, pixel ratio and device type instantly. No signup needed.',
  keywords: 'screen resolution checker, screen size, monitor resolution, window size, available screen width, screen color depth, retina check, device pixel ratio',
};

export const metadata: Metadata = {
  title: tool.title,
  description: tool.description,
  keywords: tool.keywords.split(','),
  alternates: {
    canonical: tool.url,
  },
  openGraph: {
    title: tool.title,
    description: tool.description,
    url: tool.url,
  },
  twitter: {
    title: tool.title,
    description: tool.description,
  },
};

const WebAppSchema = () => (
  <script
    type="application/ld+json"
    dangerouslySetInnerHTML={{ __html: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": tool.name,
      "description": tool.description,
      "applicationCategory": "UtilitiesApplication",
      "operatingSystem": "All",
      "url": `https://toolifyhub.com${tool.url}`,
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      }
    })}}
  />
);

export default function ScreenResolutionCheckerPage() {
  return (
    <>
      <WebAppSchema />
      <div className="container mx-auto py-10 px-4 min-h-screen flex items-center justify-center">
        <div className="w-full max-w-5xl">
          <Card className="shadow-2xl border-slate-700 bg-slate-900 rounded-[32px] overflow-hidden">
            <CardHeader className="text-center bg-slate-800/50 p-8 pb-10 relative border-b border-slate-700/50">
               <div className="mx-auto w-fit p-5 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-4 shadow-lg shadow-blue-500/20">
                  <Monitor className="w-10 h-10 text-white" />
               </div>
              <CardTitle className="font-headline text-3xl sm:text-4xl font-black text-slate-100 mb-2">
                Resolution Checker
              </CardTitle>
              <CardDescription className="text-slate-400 text-lg max-w-xl mx-auto">
                Instantly audit your display parameters, viewport dimensions, and hardware capabilities.
              </CardDescription>
              {/* Animated decorative line */}
              <div className="absolute bottom-0 left-0 w-full h-[2px] bg-slate-700/50">
                <div className="h-full w-1/3 bg-gradient-to-r from-transparent via-blue-500 to-transparent animate-shimmer" style={{ backgroundSize: '200% 100%' }}></div>
              </div>
            </CardHeader>
            <CardContent className="p-6 md:p-12 bg-slate-900">
              <ScreenResolutionCheckerForm />
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
