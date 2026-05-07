'use client';

import dynamic from 'next/dynamic';
import { SquarePen, Loader2 } from 'lucide-react';
import { ToolHeader } from '@/components/tools/tool-header';
import { RelatedTools } from '@/components/tools/related-tools';

const MarkdownEditorForm = dynamic(
  () => import('@/components/tools/markdown-editor-form').then(mod => mod.MarkdownEditorForm),
  { ssr: false, loading: () => <div className="h-[70vh] flex items-center justify-center"><Loader2 className="animate-spin" /></div> }
);

export default function MarkdownEditorPage() {
  const tool = {
    name: 'Markdown Editor',
    url: '/tools/markdown-editor',
  };

  return (
    <div className="container mx-auto py-8 md:py-16 px-0 md:px-4 tool-page-fade">
      <div className="max-w-[1200px] mx-auto space-y-6 md:space-y-8">
        <ToolHeader 
          title="Markdown Editor"
          description="The ultimate distraction-free writing environment. Format your text with Markdown and preview it live."
          icon={<SquarePen />}
          category="Dev"
        />

        <MarkdownEditorForm />

        <RelatedTools currentToolHref={tool.url} />
      </div>
    </div>
  );
}
