import type { Metadata } from 'next';
import { ImageResizerForm } from '@/components/tools/image-resizer-form';
import { Card, CardContent } from '@/components/ui/card';
import { Expand } from 'lucide-react';
import { ToolHeader } from '@/components/tools/tool-header';
import { RelatedTools } from '@/components/tools/related-tools';

const tool = {
  name: 'Image Resizer',
  url: '/tools/image-resizer',
  title: 'Image Resizer Online Free — Resize Images to Any Size Instantly',
  description: 'Free online image resizer. Resize any image to custom dimensions or preset sizes instantly. No signup needed.',
  keywords: 'image resizer, resize image online, change image dimensions, photo resizer, crop image, social media image sizes, free web tools',
};

export const metadata: Metadata = {
  title: tool.title,
  description: tool.description,
  keywords: tool.keywords.split(','),
  alternates: {
    canonical: tool.url,
  },
  openGraph: {
    title: tool.title,
    description: tool.description,
    url: tool.url,
  },
  twitter: {
    title: tool.title,
    description: tool.description,
  },
};

export default function ImageResizerPage() {
  return (
    <div className="container mx-auto py-8 md:py-16 px-0 md:px-4 tool-page-fade">
      <div className="max-w-[900px] mx-auto space-y-6 md:space-y-8">
        <ToolHeader 
          title="Image Resizer"
          description="Quickly resize your images for social media or custom requirements without quality loss."
          icon={Expand}
          category="Image"
        />

        <Card className="border-white/[0.08] bg-white/[0.02] md:bg-white/[0.03] rounded-none md:rounded-[24px] border-x-0 md:border-x">
          <CardContent className="p-5 md:p-12">
            <ImageResizerForm />
          </CardContent>
        </Card>

        <RelatedTools currentToolHref={tool.url} />
      </div>
    </div>
  );
}
