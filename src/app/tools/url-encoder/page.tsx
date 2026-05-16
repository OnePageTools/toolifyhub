
import { UrlEncoderForm } from '@/components/tools/url-encoder-form';
import { Card, CardContent } from '@/components/ui/card';
import { Link2 } from 'lucide-react';
import { ToolHeader } from '@/components/tools/tool-header';
import { RelatedTools } from '@/components/tools/related-tools';
import type { Metadata } from 'next';

const tool = {
  name: 'URL Encoder & Decoder',
  url: 'https://onepagetools.vercel.app/tools/url-encoder',
};

export const metadata: Metadata = {
  title: "Free URL Encoder Decoder Online — Encode & Decode URLs | ToolifyHub",
  description: "Encode and decode URLs and special characters free online. No signup needed.",
  other: {
    'last-modified': '2026-05-16'
  }
};

export default function UrlEncoderPage() {
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
          title="URL Encoder & Decoder"
          description="Safely transform URLs and special characters for web compatibility using standard Percent-Encoding."
          icon={<Link2 className="w-6 h-6 md:w-8 md:h-8" />}
          category="Dev"
        />

        <Card className="border-white/[0.08] bg-white/[0.02] md:bg-white/[0.03] rounded-none md:rounded-[24px] border-x-0 md:border-x">
          <CardContent className="p-5 md:p-12">
            <UrlEncoderForm />
          </CardContent>
        </Card>

        <RelatedTools currentToolHref="/tools/url-encoder" />
      </div>
    </div>
  );
}
