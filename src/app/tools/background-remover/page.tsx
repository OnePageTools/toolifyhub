
"use client";

import type { Metadata } from 'next';
import { BackgroundRemoverForm } from '@/components/tools/background-remover-form';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import AIHelper from '@/components/ai-assistant';
import { Wand2 } from 'lucide-react';

const tool = {
  name: 'AI Background Remover',
  url: '/tools/background-remover',
  title: 'Free AI Background Remover - Erase Background from Image Online',
  description: 'Instantly remove the background from any image with a single click using our free AI-powered tool. Get a clean, transparent background for your photos.',
  keywords: 'background remover, remove background, erase background, transparent background, image background remover, free background remover'
};

// Metadata can't be dynamically generated in a client component in this way,
// but we can set static metadata for the page.
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
      "applicationCategory": "MultimediaApplication",
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

export default function BackgroundRemoverPage() {
  return (
    <>
      <WebAppSchema />
      <div className="container mx-auto py-10 px-4">
        <div className="max-w-3xl mx-auto">
          <Card className="shadow-lg border-primary/20">
            <CardHeader className="text-center">
               <div className="mx-auto w-fit p-4 bg-gradient-to-br from-primary/10 to-accent/10 rounded-full mb-4">
                  <Wand2 className="w-10 h-10 text-primary" />
               </div>
              <CardTitle className="font-headline text-3xl sm:text-4xl bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-primary/80">
                AI Background Remover
              </CardTitle>
              <CardDescription className="text-lg mt-2">
                Instantly remove the background from any image with a single
                click.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <BackgroundRemoverForm />
            </CardContent>
          </Card>
        </div>
        <AIHelper toolName="Background Remover" />
      </div>
    </>
  );
}
