import type { Metadata } from 'next';
import { TextRepeaterForm } from '@/components/tools/text-repeater-form';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { Repeat } from 'lucide-react';

const tool = {
  name: 'Text Repeater',
  url: '/tools/text-repeater',
  title: 'Text Repeater Online Free — Repeat Any Text Instantly',
  description: 'Free online text repeater tool. Repeat any text, word or sentence multiple times with custom separators. No signup required.',
  keywords: 'text repeater, repeat text online, word repeater, sentence repeater, multiple text generator, free writing tool',
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
      "applicationCategory": "TextApplication",
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

export default function TextRepeaterPage() {
  return (
    <>
      <WebAppSchema />
      <div className="container mx-auto py-10 px-4">
        <div className="max-w-5xl mx-auto">
          <Card className="shadow-lg border-primary/20">
            <CardHeader className="text-center bg-secondary/50 p-8">
               <div className="mx-auto w-fit p-4 bg-gradient-to-br from-primary/10 to-accent/10 rounded-full mb-4">
                  <Repeat className="w-10 h-10 text-primary" />
               </div>
              <CardTitle className="font-headline text-3xl sm:text-4xl bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-primary/80">
                Text Repeater
              </CardTitle>
              <CardDescription className="text-lg mt-2">
                Repeat any text, word, or sentence multiple times instantly. Customize your separator for perfect formatting.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 md:p-8">
              <TextRepeaterForm />
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}