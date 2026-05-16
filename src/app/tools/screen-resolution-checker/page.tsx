
import { ScreenResolutionCheckerForm } from '@/components/tools/screen-resolution-checker-form';
import { Monitor } from 'lucide-react';
import { ToolHeader } from '@/components/tools/tool-header';
import { RelatedTools } from '@/components/tools/related-tools';
import type { Metadata } from 'next';

const tool = {
  name: 'Screen Resolution Checker',
  url: 'https://onepagetools.vercel.app/tools/screen-resolution-checker',
};

export const metadata: Metadata = {
  title: "Free Screen Resolution Checker — Check Your Screen Size | ToolifyHub",
  description: "Check your screen resolution width height and device type free online. No signup needed.",
  other: {
    'last-modified': '2026-05-16'
  }
};

export default function ScreenResolutionCheckerPage() {
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
          title="Resolution Checker"
          description="Instantly audit your display parameters, viewport dimensions, and hardware capabilities."
          icon={<Monitor className="w-6 h-6 md:w-8 md:h-8" />}
          category="Web"
        />

        <ScreenResolutionCheckerForm />

        <RelatedTools currentToolHref="/tools/screen-resolution-checker" />
      </div>
    </div>
  );
}
