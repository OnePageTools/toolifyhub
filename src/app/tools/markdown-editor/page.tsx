import { MarkdownEditorForm } from '@/components/tools/markdown-editor-form';
import { Card, CardContent } from '@/components/ui/card';
import { SquarePen } from 'lucide-react';
import { ToolHeader } from '@/components/tools/tool-header';
import { RelatedTools } from '@/components/tools/related-tools';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Free Markdown Editor Online — Write & Preview Markdown | ToolifyHub",
  description: "Write markdown with live preview and download as MD or HTML free online. No signup needed.",
};

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
          icon={<SquarePen className="w-6 h-6 md:w-8 md:h-8" />}
          category="Dev"
        />

        <MarkdownEditorForm />

        <RelatedTools currentToolHref={tool.url} />
      </div>
    </div>
  );
}
