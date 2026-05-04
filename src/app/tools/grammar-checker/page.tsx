import { GrammarCheckerForm } from '@/components/tools/grammar-checker-form';
import { Card, CardContent } from '@/components/ui/card';
import { SpellCheck } from 'lucide-react';
import { ToolHeader } from '@/components/tools/tool-header';
import { RelatedTools } from '@/components/tools/related-tools';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Free Grammar Checker Online — Fix Grammar & Spelling Instantly | ToolifyHub",
  description: "Check grammar, spelling and punctuation free online. No signup needed. Instant results.",
};

export default function GrammarCheckerPage() {
  const tool = {
    name: 'Grammar Checker',
    url: '/tools/grammar-checker',
  };

  return (
    <div className="container mx-auto py-8 md:py-16 px-0 md:px-4 tool-page-fade">
      <div className="max-w-[900px] mx-auto space-y-6 md:space-y-8">
        <ToolHeader 
          title="Grammar & Spell Checker"
          description="Paste your text below to get instant feedback on grammar, spelling, and punctuation."
          icon={<SpellCheck className="w-6 h-6 md:w-8 md:h-8" />}
          category="Text"
        />

        <Card className="border-white/[0.08] bg-white/[0.02] md:bg-white/[0.03] rounded-none md:rounded-[24px] border-x-0 md:border-x">
          <CardContent className="p-5 md:p-12">
            <GrammarCheckerForm />
          </CardContent>
        </Card>

        <RelatedTools currentToolHref={tool.url} />
      </div>
    </div>
  );
}
