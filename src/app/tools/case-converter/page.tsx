import { CaseConverterForm } from '@/components/tools/case-converter-form';
import { Card, CardContent } from '@/components/ui/card';
import { CaseSensitive } from 'lucide-react';
import { ToolHeader } from '@/components/tools/tool-header';
import { RelatedTools } from '@/components/tools/related-tools';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Free Case Converter Online — Convert Text Case Instantly | ToolifyHub",
  description: "Convert text to uppercase lowercase camelCase and more free online. No signup needed.",
};

export default function CaseConverterPage() {
  const tool = {
    name: 'Case Converter',
    url: '/tools/case-converter',
  };

  return (
    <div className="container mx-auto py-8 md:py-16 px-0 md:px-4 tool-page-fade">
      <div className="max-w-[900px] mx-auto space-y-6 md:space-y-8">
        <ToolHeader 
          title="Case Converter"
          description="Instantly transform your text between common conventions for writing, programming, and design."
          icon={<CaseSensitive className="w-6 h-6 md:w-8 md:h-8" />}
          category="Text"
        />

        <Card className="border-white/[0.08] bg-white/[0.02] md:bg-white/[0.03] rounded-none md:rounded-[24px] border-x-0 md:border-x">
          <CardContent className="p-5 md:p-12">
            <CaseConverterForm />
          </CardContent>
        </Card>

        <RelatedTools currentToolHref={tool.url} />
      </div>
    </div>
  );
}
