'use client';

import { ImageResizerForm } from '@/components/tools/image-resizer-form';
import { Card, CardContent } from '@/components/ui/card';
import { Expand } from 'lucide-react';
import { ToolHeader } from '@/components/tools/tool-header';
import { RelatedTools } from '@/components/tools/related-tools';

export default function ImageResizerPage() {
  const tool = {
    name: 'Image Resizer',
    url: '/tools/image-resizer',
  };

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
