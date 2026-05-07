'use client';

import dynamic from 'next/dynamic';
import { Card, CardContent } from '@/components/ui/card';
import { Scissors, Loader2 } from 'lucide-react';
import { ToolHeader } from '@/components/tools/tool-header';
import { RelatedTools } from '@/components/tools/related-tools';

const BackgroundRemoverForm = dynamic(
  () => import('@/components/tools/background-remover-form').then(mod => mod.BackgroundRemoverForm),
  { ssr: false, loading: () => <div className="h-80 flex items-center justify-center"><Loader2 className="animate-spin" /></div> }
);

export default function BackgroundRemoverPage() {
  const tool = {
    name: 'Background Remover',
    url: '/tools/background-remover',
  };

  return (
    <div className="container mx-auto py-8 md:py-16 px-0 md:px-4 tool-page-fade">
      <div className="max-w-[900px] mx-auto space-y-6 md:space-y-8">
        <ToolHeader 
          title="Background Remover"
          description="Instantly remove the background from any image with a single click using AI."
          icon={<Scissors />}
          category="Image"
        />

        <Card className="border-white/[0.08] bg-white/[0.02] md:bg-white/[0.03] rounded-none md:rounded-[24px] border-x-0 md:border-x">
          <CardContent className="p-5 md:p-12">
            <BackgroundRemoverForm />
          </CardContent>
        </Card>

        <RelatedTools currentToolHref={tool.url} />
      </div>
    </div>
  );
}
