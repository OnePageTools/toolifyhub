'use client';

import dynamic from 'next/dynamic';
import { Card, CardContent } from '@/components/ui/card';
import { FileArchive, Loader2 } from 'lucide-react';
import { ToolHeader } from '@/components/tools/tool-header';
import { RelatedTools } from '@/components/tools/related-tools';

const PdfCompressorForm = dynamic(
  () => import('@/components/tools/pdf-compressor-form').then(mod => mod.PdfCompressorForm),
  { ssr: false, loading: () => <div className="h-64 flex items-center justify-center"><Loader2 className="animate-spin" /></div> }
);

export default function PdfCompressorPage() {
  const tool = {
    name: 'PDF Compressor',
    url: '/tools/pdf-compressor',
  };

  return (
    <div className="container mx-auto py-8 md:py-16 px-0 md:px-4 tool-page-fade">
      <div className="max-w-[900px] mx-auto space-y-6 md:space-y-8">
        <ToolHeader 
          title="PDF Compressor"
          description="Reduce the file size of your PDF documents while maintaining the best possible quality."
          icon={<FileArchive />}
          category="PDF"
        />

        <Card className="border-white/[0.08] bg-white/[0.02] md:bg-white/[0.03] rounded-none md:rounded-[24px] border-x-0 md:border-x">
          <CardContent className="p-5 md:p-12">
            <PdfCompressorForm />
          </CardContent>
        </Card>

        <RelatedTools currentToolHref={tool.url} />
      </div>
    </div>
  );
}
