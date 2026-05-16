
import { MetaTagGeneratorForm } from '@/components/tools/meta-tag-generator-form';
import { Card, CardContent } from '@/components/ui/card';
import { Tag } from 'lucide-react';
import { ToolHeader } from '@/components/tools/tool-header';
import { RelatedTools } from '@/components/tools/related-tools';
import type { Metadata } from 'next';

const tool = {
  name: 'Meta Tag Generator',
  url: 'https://onepagetools.vercel.app/tools/meta-tag-generator',
};

export const metadata: Metadata = {
  title: "Free Meta Tag Generator Online — Generate SEO Tags Instantly | ToolifyHub",
  description: "Generate SEO meta tags free online. Improve search rankings instantly. No signup needed.",
  other: {
    'last-modified': '2026-05-16'
  }
};

export default function MetaTagGeneratorPage() {
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
          title="Meta Tag Generator"
          description="Generate a full set of professional SEO and Social Media meta tags for your website."
          icon={<Tag className="w-6 h-6 md:w-8 md:h-8" />}
          category="Dev"
        />

        <Card className="border-white/[0.08] bg-white/[0.02] md:bg-white/[0.03] rounded-none md:rounded-[24px] border-x-0 md:border-x">
          <CardContent className="p-5 md:p-12">
            <MetaTagGeneratorForm />
          </CardContent>
        </Card>

        <RelatedTools currentToolHref="/tools/meta-tag-generator" />
      </div>
    </div>
  );
}
