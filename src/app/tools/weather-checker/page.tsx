
import { WeatherCheckerForm } from '@/components/tools/weather-checker-form';
import { CloudSun } from 'lucide-react';
import { ToolHeader } from '@/components/tools/tool-header';
import { RelatedTools } from '@/components/tools/related-tools';
import type { Metadata } from 'next';

const tool = {
  name: 'Weather Checker',
  url: 'https://onepagetools.vercel.app/tools/weather-checker',
};

export const metadata: Metadata = {
  title: "Free Weather Checker Online — Check Weather Any City | ToolifyHub",
  description: "Check current weather for any city free online. Live updates. No signup needed.",
  other: {
    'last-modified': '2026-05-16'
  }
};

export default function WeatherCheckerPage() {
  return (
    <div className="container mx-auto py-8 md:py-16 px-0 md:px-4 tool-page-fade">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": "https://onepagetools.vercel.app"
              },
              {
                "@type": "ListItem", 
                "position": 2,
                "name": "Tools",
                "item": "https://onepagetools.vercel.app"
              },
              {
                "@type": "ListItem",
                "position": 3,
                "name": tool.name,
                "item": tool.url
              }
            ]
          })
        }}
      />
      <div className="max-w-[900px] mx-auto space-y-6 md:space-y-8">
        <ToolHeader 
          title="Weather Checker"
          description="Get instant, real-time weather updates and a 3-day forecast for any city."
          icon={<CloudSun className="w-6 h-6 md:w-8 md:h-8" />}
          category="Utilities"
        />

        <WeatherCheckerForm />

        <RelatedTools currentToolHref="/tools/weather-checker" />
      </div>
    </div>
  );
}
