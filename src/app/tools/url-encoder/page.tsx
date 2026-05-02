import type { Metadata } from 'next';
import { UrlEncoderForm } from '@/components/tools/url-encoder-form';
import { Card, CardContent } from '@/components/ui/card';
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

export default function UrlEncoderPage() {
  return (
    <div className="container mx-auto py-12 px-4 page-transition">
      <div className="max-w-5xl mx-auto space-y-8">
        <header className="flex flex-col items-center text-center space-y-4 mb-8">
          <div className="w-[60px] h-[60px] rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-xl text-white">
            <Link2 className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl md:text-4xl font-black text-foreground">URL Encoder & Decoder</h1>
            <div className="w-[60px] h-[3px] bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mx-auto" />
          </div>
          <p className="text-muted-foreground text-lg max-w-xl">
            Safely transform URLs and special characters for web compatibility using standard Percent-Encoding.
          </p>
        </header>

        <Card className="border-border/50">
          <CardContent className="p-8 md:p-12">
            <UrlEncoderForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
