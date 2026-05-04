import { FaviconGeneratorForm } from '@/components/tools/favicon-generator-form';
import { Card, CardContent } from '@/components/ui/card';
import { Sparkles } from 'lucide-react';
import { ToolHeader } from '@/components/tools/tool-header';
import { RelatedTools } from '@/components/tools/related-tools';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Free Favicon Generator Online — Create Website Favicon | ToolifyHub",
  description: "Create custom favicons for your website free online. Download as ICO and PNG. No signup needed.",
};

export default function FaviconGeneratorPage() {
  const tool = {
    name: 'Favicon Generator',
    url: '/tools/favicon-generator',
  };

  return (
    <div className="container mx-auto py-8 md:py-16 px-0 md:px-4 tool-page-fade">
      <div className="max-w-[900px] mx-auto space-y-6 md:space-y-8">
        <ToolHeader 
          title="Favicon Generator"
          description="Design and export perfect favicons for your website using text or emojis."
          icon={<Sparkles className="w-6 h-6 md:w-8 md:h-8" />}
          category="Web"
        />

        <Card className="border-white/[0.08] bg-white/[0.02] md:bg-white/[0.03] rounded-none md:rounded-[24px] border-x-0 md:border-x">
          <CardContent className="p-5 md:p-12">
            <FaviconGeneratorForm />
          </CardContent>
        </Card>

        <RelatedTools currentToolHref={tool.url} />
      </div>
    </div>
  );
}
