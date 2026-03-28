
import type { Metadata } from 'next';
import { UnitConverterForm } from '@/components/tools/unit-converter-form';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import AIHelper from '@/components/ai-assistant';
import { Ruler } from 'lucide-react';

const tool = {
  name: 'Unit Converter',
  url: '/tools/unit-converter',
  title: 'Unit Converter Online - Free & Instant Conversions',
  description: 'Instantly convert between various units for length, weight, temperature, volume, speed, time, area, and data with our free and easy-to-use online unit converter.',
  keywords: 'unit converter, conversion calculator, convert units, measurement converter, metric converter, imperial converter',
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

export default function UnitConverterPage() {
  return (
    <>
      <WebAppSchema />
      <div className="container mx-auto py-10 px-4">
        <div className="max-w-4xl mx-auto">
          <Card className="shadow-lg border-primary/20">
            <CardHeader className="text-center">
               <div className="mx-auto w-fit p-4 bg-gradient-to-br from-primary/10 to-accent/10 rounded-full mb-4">
                  <Ruler className="w-10 h-10 text-primary" />
               </div>
              <CardTitle className="font-headline text-3xl sm:text-4xl bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-primary/80">
                Unit Converter
              </CardTitle>
              <CardDescription className="text-lg mt-2">
                Instantly convert between various units for length, weight, temperature, and more.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 md:p-8">
              <UnitConverterForm />
            </CardContent>
          </Card>
        </div>
        <AIHelper toolName="Unit Converter" />
      </div>
    </>
  );
}
