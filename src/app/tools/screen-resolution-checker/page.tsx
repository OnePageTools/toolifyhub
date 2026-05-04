import { ScreenResolutionCheckerForm } from '@/components/tools/screen-resolution-checker-form';
import { Monitor } from 'lucide-react';
import { ToolHeader } from '@/components/tools/tool-header';
import { RelatedTools } from '@/components/tools/related-tools';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Free Screen Resolution Checker — Check Your Screen Size | ToolifyHub",
  description: "Check your screen resolution width height and device type free online. No signup needed.",
};

export default function ScreenResolutionCheckerPage() {
  const tool = {
    name: 'Screen Resolution Checker',
    url: '/tools/screen-resolution-checker',
  };

  return (
    <div className="container mx-auto py-8 md:py-16 px-0 md:px-4 tool-page-fade">
      <div className="max-w-[900px] mx-auto space-y-6 md:space-y-8">
        <ToolHeader 
          title="Resolution Checker"
          description="Instantly audit your display parameters, viewport dimensions, and hardware capabilities."
          icon={<Monitor className="w-6 h-6 md:w-8 md:h-8" />}
          category="Web"
        />

        <ScreenResolutionCheckerForm />

        <RelatedTools currentToolHref={tool.url} />
      </div>
    </div>
  );
}
