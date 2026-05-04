import { ImageCompressorForm } from '@/components/tools/image-compressor-form';
import { Card, CardContent } from '@/components/ui/card';
import { ImageIcon } from 'lucide-react';
import { ToolHeader } from '@/components/tools/tool-header';
import { RelatedTools } from '@/components/tools/related-tools';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Free Image Compressor Online — Compress Images Without Quality Loss | ToolifyHub",
  description: "Compress JPG PNG WEBP images free online. Reduce file size instantly. No signup needed.",
};

export default function ImageCompressorPage() {
  const tool = {
    name: 'Image Compressor',
    url: '/tools/image-compressor',
  };

  return (
    <div className="container mx-auto py-8 md:py-16 px-0 md:px-4 tool-page-fade">
      <div className="max-w-[900px] mx-auto space-y-6 md:space-y-8">
        <ToolHeader 
          title="Image Compressor"
          description="Compress, resize, and convert multiple images (JPG, PNG, WEBP) at once without quality loss."
          icon={<ImageIcon className="w-6 h-6 md:w-8 md:h-8" />}
          category="Image"
        />

        <Card className="border-white/[0.08] bg-white/[0.02] md:bg-white/[0.03] rounded-none md:rounded-[24px] border-x-0 md:border-x">
          <CardContent className="p-5 md:p-12">
            <ImageCompressorForm />
          </CardContent>
        </Card>

        <RelatedTools currentToolHref={tool.url} />
      </div>
    </div>
  );
}
