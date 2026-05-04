import { TextSummarizerForm } from '@/components/tools/text-summarizer-form';
import { Card, CardContent } from '@/components/ui/card';
import { BookOpen } from 'lucide-react';
import { ToolHeader } from '@/components/tools/tool-header';
import { RelatedTools } from '@/components/tools/related-tools';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Free Text Summarizer Online — Summarize Any Text Instantly | ToolifyHub",
  description: "Summarize long articles and documents free online. AI powered. No signup needed.",
};

export default function TextSummarizerPage() {
  const tool = {
    name: 'Text Summarizer',
    url: '/tools/text-summarizer',
  };

  return (
    <div className="container mx-auto py-8 md:py-16 px-0 md:px-4 tool-page-fade">
      <div className="max-w-[900px] mx-auto space-y-6 md:space-y-8">
        <ToolHeader 
          title="Text Summarizer"
          description="Quickly summarize long articles, documents, or any text into concise and easy-to-read points."
          icon={<BookOpen className="w-6 h-6 md:w-8 md:h-8" />}
          category="Text"
        />

        <Card className="border-white/[0.08] bg-white/[0.02] md:bg-white/[0.03] rounded-none md:rounded-[24px] border-x-0 md:border-x">
          <CardContent className="p-5 md:p-12">
            <TextSummarizerForm />
          </CardContent>
        </Card>

        <RelatedTools currentToolHref={tool.url} />
      </div>
    </div>
  );
}
