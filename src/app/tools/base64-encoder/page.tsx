
import { Base64EncoderForm } from '@/components/tools/base64-encoder-form';
import { Card, CardContent } from '@/components/ui/card';
import { SquareCode } from 'lucide-react';
import { ToolHeader } from '@/components/tools/tool-header';
import { RelatedTools } from '@/components/tools/related-tools';
import type { Metadata } from 'next';

const tool = {
  name: 'Base64 Encoder',
  url: 'https://onepagetools.vercel.app/tools/base64-encoder',
};

export const metadata: Metadata = {
  title: "Free Base64 Encoder Decoder Online — Encode & Decode | ToolifyHub",
  description: "Encode and decode text and files to Base64 free online. No signup needed.",
  other: {
    'last-modified': '2026-05-16'
  }
};

export default function Base64EncoderPage() {
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
          title="Base64 Encoder & Decoder"
          description="Securely encode and decode text, files, and images to Base64 format directly in your browser."
          icon={<SquareCode className="w-6 h-6 md:w-8 md:h-8" />}
          category="Dev"
        />

        <Card className="border-white/[0.08] bg-white/[0.02] md:bg-white/[0.03] rounded-none md:rounded-[24px] border-x-0 md:border-x">
          <CardContent className="p-5 md:p-12">
            <Base64EncoderForm />
          </CardContent>
        </Card>

        <RelatedTools currentToolHref="/tools/base64-encoder" />
      </div>
    </div>
  );
}
