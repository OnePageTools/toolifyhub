
import type { Metadata } from 'next';
import { WebsiteScreenshotForm } from '@/components/tools/website-screenshot-form';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import AIHelper from '@/components/ai-assistant';
import { Camera } from 'lucide-react';

const tool = {
  name: 'Website Screenshot Generator',
  url: '/tools/website-screenshot',
  title: 'Website Screenshot Generator - Free Online Tool',
  description: 'Capture a full-page, high-resolution screenshot of any website online. Enter a URL to generate a PNG of the entire webpage. Free, fast, and easy.',
  keywords: 'website screenshot, screenshot generator, capture website, webpage screenshot, free screenshot tool, url to image',
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

export default function WebsiteScreenshotPage() {
  return (
    <>
      <WebAppSchema />
      <div className="container mx-auto py-10 px-4">
        <div className="max-w-4xl mx-auto">
          <Card className="shadow-lg border-primary/20">
            <CardHeader className="text-center bg-secondary/50 p-8">
               <div className="mx-auto w-fit p-4 bg-gradient-to-br from-primary/10 to-accent/10 rounded-full mb-4">
                  <Camera className="w-10 h-10 text-primary" />
               </div>
              <CardTitle className="font-headline text-3xl sm:text-4xl bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-primary/80">
                Website Screenshot Generator
              </CardTitle>
              <CardDescription className="text-lg mt-2">
                Enter any URL to capture a full-page screenshot in seconds.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 md:p-8">
              <WebsiteScreenshotForm />
            </CardContent>
          </Card>
        </div>
        <AIHelper toolName="Website Screenshot" />
      </div>
    </>
  );
}
