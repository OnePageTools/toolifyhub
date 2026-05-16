
import { RandomNameGeneratorForm } from '@/components/tools/random-name-generator-form';
import { Card, CardContent } from '@/components/ui/card';
import { User } from 'lucide-react';
import { ToolHeader } from '@/components/tools/tool-header';
import { RelatedTools } from '@/components/tools/related-tools';
import type { Metadata } from 'next';

const tool = {
  name: 'Random Name Generator',
  url: 'https://onepagetools.vercel.app/tools/random-name-generator',
};

export const metadata: Metadata = {
  title: "Free Random Name Generator Online — Generate Names Instantly | ToolifyHub",
  description: "Generate random names by gender and nationality free online. No signup needed.",
  other: {
    'last-modified': '2026-05-16'
  }
};

export default function RandomNameGeneratorPage() {
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
          title="Random Name Generator"
          description="Generate realistic names or full identities for characters, testing, or creative projects."
          icon={<User className="w-6 h-6 md:w-8 md:h-8" />}
          category="Fun"
        />

        <RandomNameGeneratorForm />

        <RelatedTools currentToolHref="/tools/random-name-generator" />
      </div>
    </div>
  );
}
