import type { Metadata } from 'next';
import { WeatherCheckerForm } from '@/components/tools/weather-checker-form';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import AIHelper from '@/components/ai-assistant';
import { Thermometer } from 'lucide-react';

const tool = {
  name: 'Weather Checker',
  url: '/tools/weather-checker',
  title: 'Live Weather Checker - Real-Time Weather Forecast & Conditions',
  description: 'Get instant, real-time weather updates for any city in the world. Check temperature, humidity, wind speed, and current conditions with our free online weather tool.',
  keywords: 'weather checker, live weather, weather forecast, temperature checker, city weather, online weather tool'
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

export default function WeatherCheckerPage() {
  return (
    <>
      <WebAppSchema />
      <div className="container mx-auto py-10 px-4">
        <div className="max-w-4xl mx-auto">
          <Card className="shadow-lg border-primary/20 overflow-hidden">
            <CardHeader className="text-center bg-secondary/50 p-8">
               <div className="mx-auto w-fit p-4 bg-gradient-to-br from-primary/10 to-accent/10 rounded-full mb-4">
                  <Thermometer className="w-10 h-10 text-primary" />
               </div>
              <CardTitle className="font-headline text-3xl sm:text-4xl bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-primary/80">
                Weather Checker
              </CardTitle>
              <CardDescription className="text-lg mt-2">
                Get live weather updates for any city around the world.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 md:p-8">
              <WeatherCheckerForm />
            </CardContent>
          </Card>
        </div>
        <AIHelper toolName="Weather Checker" />
      </div>
    </>
  );
}
