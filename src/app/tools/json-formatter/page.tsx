import { JsonFormatterForm } from '@/components/tools/json-formatter-form';
import { Card, CardContent } from '@/components/ui/card';
import { Braces } from 'lucide-react';
import { ToolHeader } from '@/components/tools/tool-header';
import { RelatedTools } from '@/components/tools/related-tools';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Free JSON Formatter Online — Format & Validate JSON Instantly | ToolifyHub",
  description: "Format validate and beautify JSON free online. Instant results. No signup needed.",
};

export default function JsonFormatterPage() {
  const tool = {
    name: 'JSON Formatter',
    url: '/tools/json-formatter',
  };

  return (
    <div className="container mx-auto py-8 md:py-16 px-0 md:px-4 tool-page-fade">
      <div className="max-w-[900px] mx-auto space-y-6 md:space-y-8">
        <ToolHeader 
          title="JSON Formatter & Validator"
          description="A professional tool to format, validate, and beautify your JSON data with real-time feedback."
          icon={<Braces className="w-6 h-6 md:w-8 md:h-8" />}
          category="Dev"
        />

        <Card className="border-white/[0.08] bg-white/[0.02] md:bg-white/[0.03] rounded-none md:rounded-[24px] border-x-0 md:border-x">
          <CardContent className="p-5 md:p-12">
            <JsonFormatterForm />
          </CardContent>
        </Card>

        <RelatedTools currentToolHref={tool.url} />
      </div>
    </div>
  );
}
