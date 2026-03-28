
import type { Metadata } from 'next';
import { CurrencyConverterForm } from '@/components/tools/currency-converter-form';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import AIHelper from '@/components/ai-assistant';
import { DollarSign } from 'lucide-react';

const tool = {
  name: 'Currency Converter',
  url: '/tools/currency-converter',
  title: 'Currency Converter - Live Exchange Rates for All Currencies',
  description: 'Get real-time exchange rates and convert all major world currencies with our free online currency converter. Includes a 7-day trend chart. Fast and accurate.',
  keywords: 'currency converter, exchange rate, money converter, currency exchange, fx rates, dollar to euro, pound to dollar',
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
      "applicationCategory": "FinanceApplication",
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

export default function CurrencyConverterPage() {
  return (
    <>
      <WebAppSchema />
      <div className="container mx-auto py-10 px-4">
        <div className="max-w-4xl mx-auto">
          <Card className="shadow-lg border-primary/20">
            <CardHeader className="text-center">
               <div className="mx-auto w-fit p-4 bg-gradient-to-br from-primary/10 to-accent/10 rounded-full mb-4">
                  <DollarSign className="w-10 h-10 text-primary" />
               </div>
              <CardTitle className="font-headline text-3xl sm:text-4xl bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-primary/80">
                Currency Converter
              </CardTitle>
              <CardDescription className="text-lg mt-2">
                Get the latest exchange rates and convert all major world currencies instantly.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 md:p-8">
              <CurrencyConverterForm />
            </CardContent>
          </Card>
        </div>
        <AIHelper toolName="Currency Converter" />
      </div>
    </>
  );
}
