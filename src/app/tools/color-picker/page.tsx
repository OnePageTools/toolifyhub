
'use client';

import dynamic from 'next/dynamic';
import { Palette, Loader2 } from 'lucide-react';
import { ToolHeader } from '@/components/tools/tool-header';
import { RelatedTools } from '@/components/tools/related-tools';

const ColorPickerForm = dynamic(
  () => import('@/components/tools/color-picker-form').then(mod => mod.ColorPickerForm),
  { ssr: false, loading: () => <div className="h-[400px] flex items-center justify-center"><Loader2 className="animate-spin" /></div> }
);

export default function ColorPickerPage() {
  const tool = {
    name: 'Color Picker',
    url: 'https://onepagetools.vercel.app/tools/color-picker',
  };

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
      <div className="max-w-[1200px] mx-auto space-y-6 md:space-y-8">
        <ToolHeader 
          title="Color Picker & Palette Generator"
          description="Explore colors, extract codes, and build stunning palettes for your next creative project."
          icon={<Palette />}
          category="Design"
        />

        <ColorPickerForm />

        <RelatedTools currentToolHref="/tools/color-picker" />
      </div>
    </div>
  );
}
