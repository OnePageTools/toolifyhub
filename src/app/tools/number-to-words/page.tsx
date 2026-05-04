import { NumberToWordsForm } from '@/components/tools/number-to-words-form';
import { Card, CardContent } from '@/components/ui/card';
import { Hash } from 'lucide-react';
import { ToolHeader } from '@/components/tools/tool-header';
import { RelatedTools } from '@/components/tools/related-tools';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Free Number to Words Converter — Convert Numbers Instantly | ToolifyHub",
  description: "Convert numbers to words in English and Urdu free online. Perfect for cheques. No signup needed.",
};

export default function NumberToWordsPage() {
  const tool = {
    name: 'Number to Words',
    url: '/tools/number-to-words',
  };

  return (
    <div className="container mx-auto py-8 md:py-16 px-0 md:px-4 tool-page-fade">
      <div className="max-w-[900px] mx-auto space-y-6 md:space-y-8">
        <ToolHeader 
          title="Number to Words"
          description="Instantly convert any numerical amount into professional written text in both English and Urdu."
          icon={<Hash className="w-6 h-6 md:w-8 md:h-8" />}
          category="Finance"
        />

        <Card className="border-white/[0.08] bg-white/[0.02] md:bg-white/[0.03] rounded-none md:rounded-[24px] border-x-0 md:border-x">
          <CardContent className="p-5 md:p-12">
            <NumberToWordsForm />
          </CardContent>
        </Card>

        <RelatedTools currentToolHref={tool.url} />
      </div>
    </div>
  );
}
