
import type { Metadata } from 'next';
import { AgeCalculatorForm } from '@/components/tools/age-calculator-form';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import AIHelper from '@/components/ai-assistant';
import { CalendarClock } from 'lucide-react';

const tool = {
  name: 'Age Calculator',
  url: '/tools/age-calculator',
  title: 'Age Calculator - Calculate Your Age in Years, Months, and Days',
  description: 'Instantly find your exact chronological age in years, months, and days with our free online age calculator. Fun, fast, and easy to use.',
  keywords: 'age calculator, calculate age, date of birth calculator, how old am i, chronological age calculator, age in days'
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

export default function AgeCalculatorPage() {
  return (
    <>
      <WebAppSchema />
      <div className="container mx-auto py-10 px-4">
        <div className="max-w-4xl mx-auto">
          <Card className="shadow-lg border-primary/20 overflow-hidden">
            <CardHeader className="text-center bg-secondary/50 p-8">
               <div className="mx-auto w-fit p-4 bg-gradient-to-br from-primary/10 to-accent/10 rounded-full mb-4">
                  <CalendarClock className="w-10 h-10 text-primary" />
               </div>
              <CardTitle className="font-headline text-3xl sm:text-4xl bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-primary/80">
                Age Calculator
              </CardTitle>
              <CardDescription className="text-lg mt-2">
                Instantly calculate your age and discover fun facts about your journey through time.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 md:p-8">
              <AgeCalculatorForm />
            </CardContent>
          </Card>
        </div>
        <AIHelper toolName="Age Calculator" />
      </div>
    </>
  );
}
