import { BackgroundRemoverForm } from '@/components/tools/background-remover-form';
import { Card, CardContent } from '@/components/ui/card';
import { Scissors } from 'lucide-react';
import { ToolHeader } from '@/components/tools/tool-header';
import { RelatedTools } from '@/components/tools/related-tools';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Free Background Remover Online — Remove Image Background Instantly | ToolifyHub",
  description: "Remove image background free online in seconds. No Photoshop needed. No signup required.",
};

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
          icon={<Scissors className="w-6 h-6 md:w-8 md:h-8" />}
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
