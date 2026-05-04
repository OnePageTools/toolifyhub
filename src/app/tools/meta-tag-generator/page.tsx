import { MetaTagGeneratorForm } from '@/components/tools/meta-tag-generator-form';
import { Card, CardContent } from '@/components/ui/card';
import { Tag } from 'lucide-react';
import { ToolHeader } from '@/components/tools/tool-header';
import { RelatedTools } from '@/components/tools/related-tools';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Free Meta Tag Generator Online — Generate SEO Tags Instantly | ToolifyHub",
  description: "Generate SEO meta tags free online. Improve search rankings instantly. No signup needed.",
};

export default function MetaTagGeneratorPage() {
  const tool = {
    name: 'Meta Tag Generator',
    url: '/tools/meta-tag-generator',
  };

  return (
    <div className="container mx-auto py-8 md:py-16 px-0 md:px-4 tool-page-fade">
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

        <RelatedTools currentToolHref={tool.url} />
      </div>
    </div>
  );
}
