import { PlagiarismCheckerForm } from '@/components/tools/plagiarism-checker-form';
import { Card, CardContent } from '@/components/ui/card';
import { CopyCheck } from 'lucide-react';
import { ToolHeader } from '@/components/tools/tool-header';
import { RelatedTools } from '@/components/tools/related-tools';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Free Plagiarism Checker Online — Check Content Originality | ToolifyHub",
  description: "Check your text for plagiarism free online. Instant results. No signup needed.",
};

export default function PlagiarismCheckerPage() {
  const tool = {
    name: 'Plagiarism Checker',
    url: '/tools/plagiarism-checker',
  };

  return (
    <div className="container mx-auto py-8 md:py-16 px-0 md:px-4 tool-page-fade">
      <div className="max-w-[900px] mx-auto space-y-6 md:space-y-8">
        <ToolHeader 
          title="Plagiarism Checker"
          description="Ensure the originality of your work. Paste your text below to check for potential plagiarism."
          icon={<CopyCheck className="w-6 h-6 md:w-8 md:h-8" />}
          category="Text"
        />

        <Card className="border-white/[0.08] bg-white/[0.02] md:bg-white/[0.03] rounded-none md:rounded-[24px] border-x-0 md:border-x">
          <CardContent className="p-5 md:p-12">
            <PlagiarismCheckerForm />
          </CardContent>
        </Card>

        <RelatedTools currentToolHref={tool.url} />
      </div>
    </div>
  );
}
