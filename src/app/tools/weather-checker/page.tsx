import type { Metadata } from 'next';
import { WeatherCheckerForm } from '@/components/tools/weather-checker-form';
import AIHelper from '@/components/ai-assistant';

const tool = {
  name: 'Weather Checker',
  url: '/tools/weather-checker',
  title: 'Live Weather Forecast - Real-Time Weather Conditions & 3-Day Forecast',
  description: 'Get instant, real-time weather updates and a 3-day forecast for any city. Check temperature, humidity, wind speed, and conditions with our beautifully designed weather app.',
  keywords: 'weather checker, live weather, weather forecast, temperature checker, city weather, online weather tool, 3-day forecast'
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
      <div className="w-full">
        <WeatherCheckerForm />
        <AIHelper toolName="Weather Checker" />
      </div>
    </>
  );
}
