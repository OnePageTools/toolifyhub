import { CodeMinifierForm } from '@/components/tools/code-minifier-form';
import { Card, CardContent } from '@/components/ui/card';
import { Code } from 'lucide-react';
import { ToolHeader } from '@/components/tools/tool-header';
import { RelatedTools } from '@/components/tools/related-tools';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Free Code Minifier Online — Minify JS CSS HTML Instantly | ToolifyHub",
  description: "Minify JavaScript CSS and HTML code free online. Reduce file size instantly. No signup needed.",
};

export default function CodeMinifierPage() {
  const tool = {
    name: 'Code Minifier',
    url: '/tools/code-minifier',
  };

  return (
    <div className="container mx-auto py-8 md:py-16 px-0 md:px-4 tool-page-fade">
      <div className="max-w-[900px] mx-auto space-y-6 md:space-y-8">
        <ToolHeader 
          title="Online Code Minifier"
          description="A fast, client-side tool to minify JavaScript, CSS, HTML, and JSON to reduce file size."
          icon={<Code className="w-6 h-6 md:w-8 md:h-8" />}
          category="Dev"
        />

        <Card className="border-white/[0.08] bg-white/[0.02] md:bg-white/[0.03] rounded-none md:rounded-[24px] border-x-0 md:border-x">
          <CardContent className="p-5 md:p-12">
            <CodeMinifierForm />
          </CardContent>
        </Card>

        <RelatedTools currentToolHref={tool.url} />
      </div>
    </div>
  );
}
