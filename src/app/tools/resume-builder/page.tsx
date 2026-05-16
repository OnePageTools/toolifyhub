
import type { Metadata } from 'next';
import { ResumeBuilderForm } from '@/components/tools/resume-builder/form';
import { ToolHeader } from '@/components/tools/tool-header';
import { RelatedTools } from '@/components/tools/related-tools';
import { FileUser, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const tool = {
  name: 'Resume Builder',
  url: 'https://onepagetools.vercel.app/tools/resume-builder',
  title: 'Free Resume Builder Online — Create Professional CV | ToolifyHub',
  description: 'Build professional resume free online. Download as PDF. No signup needed.',
};

export const metadata: Metadata = {
  title: tool.title,
  description: tool.description,
  alternates: {
    canonical: tool.url,
  },
  openGraph: {
    title: tool.title,
    description: tool.description,
    url: tool.url,
  },
  twitter: {
    title: tool.title,
    description: tool.description,
  },
};

const WebAppSchema = () => (
  <script
    type="application/ld+json"
    dangerouslySetInnerHTML={{ __html: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": tool.name,
      "description": tool.description,
      "applicationCategory": "BusinessApplication",
      "operatingSystem": "All",
      "url": tool.url,
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      }
    })}}
  />
);

export default function ResumeBuilderPage() {
  return (
    <>
      <WebAppSchema />
      <div className="container mx-auto py-8 md:py-16 px-0 md:px-4 tool-page-fade">
        <div className="max-w-[1200px] mx-auto space-y-6 md:space-y-8">
          <div className="flex flex-wrap gap-3 items-center text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 px-4 md:px-0">
            <span className="flex items-center gap-1.5"><ArrowRight className="w-3 h-3 text-primary" /> You might also need:</span>
            <Link href="/tools/grammar-checker" className="text-blue-400 hover:text-white transition-colors underline decoration-blue-400/30 underline-offset-4">Grammar Checker</Link>
            <span className="opacity-30">|</span>
            <Link href="/tools/passport-photo-maker" className="text-blue-400 hover:text-white transition-colors underline decoration-blue-400/30 underline-offset-4">Passport Photo Maker</Link>
            <span className="opacity-30">|</span>
            <Link href="/tools/background-remover" className="text-blue-400 hover:text-white transition-colors underline decoration-blue-400/30 underline-offset-4">Background Remover</Link>
          </div>

          <ToolHeader 
            title="Resume Builder"
            description="Create a job-winning CV in minutes with our professional templates. Ensure a perfect application by combining our builder with the Grammar Checker and Passport Photo Maker."
            icon={<FileUser />}
            category="Utilities"
          />

          <ResumeBuilderForm />

          <RelatedTools currentToolHref="/tools/resume-builder" />
        </div>
      </div>
    </>
  );
}
