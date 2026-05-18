'use client';

import { EssayWriterForm } from '@/components/tools/essay-writer-form';
import { Card, CardContent } from '@/components/ui/card';
import { PenTool, ArrowRight } from 'lucide-react';
import { ToolHeader } from '@/components/tools/tool-header';
import { RelatedTools } from '@/components/tools/related-tools';
import Link from 'next/link';

export default function AIEssayWriterPage() {
  return (
    <div className="container mx-auto py-8 md:py-16 px-0 md:px-4 tool-page-fade max-w-full overflow-x-hidden box-border">
      <div className="max-w-[900px] mx-auto space-y-6 md:space-y-8 w-full">
        <div className="flex flex-wrap gap-3 items-center text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 px-4 md:px-0">
          <span className="flex items-center gap-1.5"><ArrowRight className="w-3 h-3 text-primary" /> You might also need:</span>
          <Link href="/tools/grammar-checker" className="text-blue-400 hover:text-white transition-colors underline decoration-blue-400/30 underline-offset-4">Grammar Checker</Link>
          <span className="opacity-30">|</span>
          <Link href="/tools/text-summarizer" className="text-blue-400 hover:text-white transition-colors underline decoration-blue-400/30 underline-offset-4">Text Summarizer</Link>
          <span className="opacity-30">|</span>
          <Link href="/tools/word-counter" className="text-blue-400 hover:text-white transition-colors underline decoration-blue-400/30 underline-offset-4">Word Counter</Link>
        </div>

        <ToolHeader 
          title="AI Essay Writer"
          description="Instantly generate structured essay drafts and creative content. For a polished final version, remember to run your draft through our Grammar Checker."
          icon={<PenTool />}
          category="Text"
        />

        <Card className="border-white/[0.08] bg-white/[0.02] md:bg-white/[0.03] rounded-none md:rounded-[24px] border-x-0 md:border-x w-full overflow-hidden">
          <CardContent className="p-0 md:p-12">
            <EssayWriterForm />
          </CardContent>
        </Card>

        <div className="px-4 md:px-0">
            <RelatedTools currentToolHref="/tools/ai-essay-writer" />
        </div>
      </div>
    </div>
  );
}
