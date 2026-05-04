import { WeatherCheckerForm } from '@/components/tools/weather-checker-form';
import { CloudSun } from 'lucide-react';
import { ToolHeader } from '@/components/tools/tool-header';
import { RelatedTools } from '@/components/tools/related-tools';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Free Weather Checker Online — Check Weather Any City | ToolifyHub",
  description: "Check current weather for any city free online. Live updates. No signup needed.",
};

export default function WeatherCheckerPage() {
  const tool = {
    name: 'Weather Checker',
    url: '/tools/weather-checker',
  };

  return (
    <div className="container mx-auto py-8 md:py-16 px-0 md:px-4 tool-page-fade">
      <div className="max-w-[900px] mx-auto space-y-6 md:space-y-8">
        <ToolHeader 
          title="Weather Checker"
          description="Get instant, real-time weather updates and a 3-day forecast for any city."
          icon={<CloudSun className="w-6 h-6 md:w-8 md:h-8" />}
          category="Utilities"
        />

        <WeatherCheckerForm />

        <RelatedTools currentToolHref={tool.url} />
      </div>
    </div>
  );
}
