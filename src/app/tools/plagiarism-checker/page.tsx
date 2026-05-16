import { PlagiarismCheckerForm } from '@/components/tools/plagiarism-checker-form';
import { Card, CardContent } from '@/components/ui/card';
import { CopyCheck, ArrowRight } from 'lucide-react';
import { ToolHeader } from '@/components/tools/tool-header';
import { RelatedTools } from '@/components/tools/related-tools';
import type { Metadata } from 'next';
import Link from 'next/link';

const tool = {
  name: 'Plagiarism Checker',
  url: 'https://onepagetools.vercel.app/tools/plagiarism-checker',
};

export const metadata: Metadata = {
  title: "Free Plagiarism Checker Online — Check Content Originality | ToolifyHub",
  description: "Check your text for plagiarism free online. Instant results. No signup needed.",
  other: {
    'last-modified': '2026-05-16'
  }
};

export default function PlagiarismCheckerPage() {
  return (
    <div className="container mx-auto py-8 md:py-16 px-0 md:px-4 tool-page-fade">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": "https://onepagetools.vercel.app"
              },
              {
                "@type": "ListItem", 
                "position": 2,
                "name": "Tools",
                "item": "https://onepagetools.vercel.app"
              },
              {
                "@type": "ListItem",
                "position": 3,
                "name": tool.name,
                "item": tool.url
              }
            ]
          })
        }}
      />
      <div className="max-w-[900px] mx-auto space-y-6 md:space-y-8">
        <div className="flex flex-wrap gap-3 items-center text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 px-4 md:px-0">
          <span className="flex items-center gap-1.5"><ArrowRight className="w-3 h-3 text-primary" /> You might also need:</span>
          <Link href="/tools/grammar-checker" className="text-blue-400 hover:text-white transition-colors underline decoration-blue-400/30 underline-offset-4">Grammar Checker</Link>
          <span className="opacity-30">|</span>
          <Link href="/tools/text-summarizer" className="text-blue-400 hover:text-white transition-colors underline decoration-blue-400/30 underline-offset-4">Text Summarizer</Link>
          <span className="opacity-30">|</span>
          <Link href="/tools/resume-builder" className="text-blue-400 hover:text-white transition-colors underline decoration-blue-400/30 underline-offset-4">Resume Builder</Link>
        </div>

        <ToolHeader 
          title="Plagiarism Checker"
          description="Ensure the originality of your work. After verifying your content, we recommend using our Grammar Checker to refine your prose or our Text Summarizer to create concise highlights for your audience."
          icon={<CopyCheck className="w-6 h-6 md:w-8 md:h-8" />}
          category="Text"
        />

        <Card className="border-white/[0.08] bg-white/[0.02] md:bg-white/[0.03] rounded-none md:rounded-[24px] border-x-0 md:border-x">
          <CardContent className="p-5 md:p-12">
            <PlagiarismCheckerForm />
          </CardContent>
        </Card>

        <RelatedTools currentToolHref="/tools/plagiarism-checker" />
      </div>
    </div>
  );
}
