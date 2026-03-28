
import type { Metadata } from 'next';
import { MetaTagGeneratorForm } from '@/components/tools/meta-tag-generator-form';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import AIHelper from '@/components/ai-assistant';
import { Tag } from 'lucide-react';

const tool = {
  name: 'Meta Tag Generator',
  url: '/tools/meta-tag-generator',
  title: 'Meta Tag Generator - Free SEO & Social Media Tool',
  description: 'Instantly generate a full suite of meta tags for SEO, Open Graph, and Twitter Cards with our free client-side tool. Boost your search visibility and social sharing.',
  keywords: 'meta tag generator, seo meta tags, open graph generator, twitter card generator, free seo tool',
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

export default function MetaTagGeneratorPage() {
  return (
    <>
      <WebAppSchema />
      <div className="container mx-auto py-10 px-4">
        <div className="max-w-4xl mx-auto">
          <Card className="shadow-lg border-primary/20">
            <CardHeader className="text-center">
               <div className="mx-auto w-fit p-4 bg-gradient-to-br from-primary/10 to-accent/10 rounded-full mb-4">
                  <Tag className="w-10 h-10 text-primary" />
               </div>
              <CardTitle className="font-headline text-3xl sm:text-4xl bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-primary/80">
                Meta Tag Generator
              </CardTitle>
              <CardDescription className="text-lg mt-2">
                Generate a full set of professional SEO and Social Media meta tags for your website.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 md:p-8">
              <MetaTagGeneratorForm />
            </CardContent>
          </Card>
        </div>
        <AIHelper toolName="Meta Tag Generator" />
      </div>
    </>
  );
}
