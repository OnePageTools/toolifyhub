
'use client';

import dynamic from 'next/dynamic';
import { Card, CardContent } from '@/components/ui/card';
import { FileArchive, Loader2, CheckCircle2, HelpCircle, ArrowRight } from 'lucide-react';
import { ToolHeader } from '@/components/tools/tool-header';
import { RelatedTools } from '@/components/tools/related-tools';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import Link from 'next/link';

const PdfCompressorForm = dynamic(
  () => import('@/components/tools/pdf-compressor-form').then(mod => mod.PdfCompressorForm),
  { ssr: false, loading: () => <div className="h-64 flex items-center justify-center"><Loader2 className="animate-spin" /></div> }
);

const FAQSchema = () => (
  <script
    type="application/ld+json"
    dangerouslySetInnerHTML={{ __html: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "Is this PDF compressor safe to use?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, our tool works entirely in your browser. Your files are never uploaded to a server, ensuring 100% privacy."
          }
        },
        {
          "@type": "Question",
          "name": "How much can I reduce my PDF size?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "You can often reduce PDF size by 50% to 90%, depending on the original content and the compression level you choose."
          }
        },
        {
          "@type": "Question",
          "name": "Will compression affect the quality of my images?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "High compression may slightly reduce image quality. For documents with many photos, we recommend using 'Medium' compression."
          }
        }
      ]
    })}}
  />
);

export default function PdfCompressorPage() {
  const tool = {
    name: 'PDF Compressor',
    url: 'https://onepagetools.vercel.app/tools/pdf-compressor',
  };

  return (
    <div className="container mx-auto py-8 md:py-16 px-4 tool-page-fade">
      <FAQSchema />
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
      <div className="max-w-[900px] mx-auto space-y-12">
        <div className="flex flex-wrap gap-3 items-center text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 px-4 md:px-0">
          <span className="flex items-center gap-1.5"><ArrowRight className="w-3 h-3 text-primary" /> You might also need:</span>
          <Link href="/tools/word-to-pdf" className="text-blue-400 hover:text-white transition-colors underline decoration-blue-400/30 underline-offset-4">Word to PDF</Link>
          <span className="opacity-30">|</span>
          <Link href="/tools/image-compressor" className="text-blue-400 hover:text-white transition-colors underline decoration-blue-400/30 underline-offset-4">Image Compressor</Link>
          <span className="opacity-30">|</span>
          <Link href="/tools/pdf-to-word" className="text-blue-400 hover:text-white transition-colors underline decoration-blue-400/30 underline-offset-4">PDF to Word</Link>
        </div>

        <ToolHeader 
          title="PDF Compressor"
          description="Reduce the file size of your PDF documents while maintaining the best possible quality. If you need to convert a Word document first, use our Word to PDF tool before compressing."
          icon={<FileArchive />}
          category="PDF"
        />

        <Card className="tool-card overflow-hidden">
          <CardContent className="p-5 md:p-12">
            <PdfCompressorForm />
          </CardContent>
        </Card>

        {/* How to Use */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold text-slate-900 dark:text-foreground">How to Use PDF Compressor</h2>
          </div>
          <Card className="tool-card">
            <CardContent className="p-6 md:p-8">
              <ol className="grid grid-cols-1 md:grid-cols-2 gap-6 list-none p-0">
                {[
                  "Drag and drop your PDF into the upload box",
                  "Choose your desired compression level",
                  "Wait a few seconds for the magic to happen",
                  "Download your perfectly optimized PDF file"
                ].map((step, i) => (
                  <li key={i} className="flex gap-4 items-start">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                      {i + 1}
                    </span>
                    <p className="text-slate-600 dark:text-muted-foreground pt-1">{step}</p>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>
        </section>

        {/* FAQ Section */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <HelpCircle className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold text-slate-900 dark:text-foreground">Frequently Asked Questions</h2>
          </div>
          <Card className="tool-card">
            <CardContent className="p-0">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1" className="px-6 border-b-0">
                  <AccordionTrigger className="text-left font-semibold hover:no-underline">
                    Is this PDF compressor safe to use?
                  </AccordionTrigger>
                  <AccordionContent className="text-slate-600 dark:text-muted-foreground pb-4">
                    Yes, it's 100% safe. The compression happens entirely inside your browser on your computer. Your sensitive files never reach any external server.
                  </AccordionContent>
                </AccordionItem>
                <div className="mx-6 h-px bg-border" />
                <AccordionItem value="item-2" className="px-6 border-b-0">
                  <AccordionTrigger className="text-left font-semibold hover:no-underline">
                    How much can I reduce my PDF size?
                  </AccordionTrigger>
                  <AccordionContent className="text-slate-600 dark:text-muted-foreground pb-4">
                    It depends on the original file. Text-heavy PDFs might shrink by 30-50%, while image-rich PDFs can often be reduced by 90% without visible loss in quality.
                  </AccordionContent>
                </AccordionItem>
                <div className="mx-6 h-px bg-border" />
                <AccordionItem value="item-3" className="px-6 border-b-0">
                  <AccordionTrigger className="text-left font-semibold hover:no-underline">
                    Is there a file size limit?
                  </AccordionTrigger>
                  <AccordionContent className="text-slate-600 dark:text-muted-foreground pb-4">
                    We currently support files up to 100MB. For larger files, we recommend splitting them or using our 'High' compression setting.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </section>

        <RelatedTools currentToolHref="/tools/pdf-compressor" />
      </div>
    </div>
  );
}
