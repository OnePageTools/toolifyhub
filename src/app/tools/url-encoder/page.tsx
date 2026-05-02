import type { Metadata } from 'next';
import { UrlEncoderForm } from '@/components/tools/url-encoder-form';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { Link2 } from 'lucide-react';

const tool = {
  name: 'URL Encoder & Decoder',
  url: '/tools/url-encoder',
  title: 'URL Encoder Decoder Online Free — Encode & Decode URLs Instantly',
  description: 'Free online URL encoder and decoder. Encode or decode any URL or special characters instantly. No signup needed.',
  keywords: 'url encoder, url decoder, percent encoding, uri encoder, encode url string, decode url online, free dev tools',
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
      "applicationCategory": "DeveloperApplication",
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

export default function UrlEncoderPage() {
  return (
    <>
      <WebAppSchema />
      <div className="container mx-auto py-10 px-4 min-h-screen">
        <div className="max-w-5xl mx-auto">
          <Card className="shadow-2xl border-slate-700 bg-slate-900 rounded-[20px] overflow-hidden">
            <CardHeader className="text-center bg-slate-800/50 p-8 pb-10 relative">
               <div className="mx-auto w-fit p-5 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-4 shadow-lg shadow-blue-500/20">
                  <Link2 className="w-10 h-10 text-white" />
               </div>
              <CardTitle className="font-headline text-3xl sm:text-4xl font-bold text-slate-100 mb-2">
                URL Encoder & Decoder
              </CardTitle>
              <CardDescription className="text-slate-400 text-lg max-w-xl mx-auto">
                Safely transform URLs and special characters for web compatibility using standard Percent-Encoding.
              </CardDescription>
              {/* Animated decorative line */}
              <div className="absolute bottom-0 left-0 w-full h-[2px] bg-slate-700/50">
                <div className="h-full w-1/3 bg-gradient-to-r from-transparent via-blue-500 to-transparent animate-shimmer" style={{ backgroundSize: '200% 100%' }}></div>
              </div>
            </CardHeader>
            <CardContent className="p-6 md:p-10 bg-slate-900">
              <UrlEncoderForm />
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}