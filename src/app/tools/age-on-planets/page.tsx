
import { AgeOnPlanetsForm } from '@/components/tools/age-on-planets-form';
import { Rocket } from 'lucide-react';
import { ToolHeader } from '@/components/tools/tool-header';
import { RelatedTools } from '@/components/tools/related-tools';
import type { Metadata } from 'next';

const tool = {
  name: 'Age on Planets',
  slug: 'age-on-planets',
  url: 'https://onepagetools.vercel.app/tools/age-on-planets',
};

export const metadata: Metadata = {
  title: "Age on Other Planets Calculator — How Old Are You on Mars? | ToolifyHub",
  description: "Calculate your age on Mercury Venus Mars Jupiter and all planets free online.",
  other: {
    'last-modified': '2026-05-16'
  }
};

export default function AgeOnPlanetsPage() {
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
          title="Age on Other Planets"
          description="Calculate your precise age across the entire solar system and discover fascinating planetary facts."
          icon={<Rocket className="w-6 h-6 md:w-8 md:h-8" />}
          category="Fun"
        />

        <AgeOnPlanetsForm />

        <RelatedTools currentToolHref={`/tools/${tool.slug}`} />
      </div>
    </div>
  );
}
