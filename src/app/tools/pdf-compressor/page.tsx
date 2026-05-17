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

const WebAppSchema = () => (
  <script
    type="application/ld+json"
    dangerouslySetInnerHTML={{ __html: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "Free PDF Compressor Online",
      "url": "https://onepagetools.vercel.app/tools/pdf-compressor",
      "description": "Compress PDF file size online free without losing quality.",
      "applicationCategory": "UtilitiesApplication",
      "operatingSystem": "Any",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      },
      "featureList": [
        "Compress PDF online free",
        "No signup required",
        "No watermark",
        "Up to 90% size reduction",
        "Max 100MB file size"
      ]
    })}}
  />
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
          "name": "How to compress PDF file size online free?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Upload your PDF above, select compression level, and click Compress. Our free PDF compressor reduces file size instantly — no software download, no signup required."
          }
        },
        {
          "@type": "Question",
          "name": "Can I compress PDF below 1MB free?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes. Our free online PDF compressor can reduce PDF file size by up to 90%. Most files compress below 1MB easily."
          }
        },
        {
          "@type": "Question",
          "name": "Does compressing PDF reduce quality?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Our PDF size reducer online maintains the best possible quality. Choose low compression to keep high quality, or high compression for maximum size reduction."
          }
        },
        {
          "@type": "Question",
          "name": "Is this PDF compressor really free?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "100% free. No signup, no watermark, no hidden charges. Compress unlimited PDF files online free anytime."
          }
        },
        {
          "@type": "Question",
          "name": "What is the maximum PDF file size?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "You can compress PDF files up to 100MB completely free. No account needed."
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
      <WebAppSchema />
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
          description="Reduce PDF file size online free without losing quality. Perfect for email attachments, WhatsApp sharing, and file uploads. No signup, no watermark, instant download."
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
                  "Upload your PDF file — drag and drop or click to browse",
                  "Choose your compression level — low, medium, or high",
                  "Click Compress PDF to reduce your PDF file size online free",
                  "Download your compressed PDF — no watermark, no signup needed"
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
                    How to compress PDF file size online free?
                  </AccordionTrigger>
                  <AccordionContent className="text-slate-600 dark:text-muted-foreground pb-4">
                    Upload your PDF above, select compression level, and click Compress. Our free PDF compressor reduces file size instantly — no software download, no signup required.
                  </AccordionContent>
                </AccordionItem>
                <div className="mx-6 h-px bg-border" />
                <AccordionItem value="item-2" className="px-6 border-b-0">
                  <AccordionTrigger className="text-left font-semibold hover:no-underline">
                    Can I compress PDF below 1MB free?
                  </AccordionTrigger>
                  <AccordionContent className="text-slate-600 dark:text-muted-foreground pb-4">
                    Yes. Our free online PDF compressor can reduce PDF file size by up to 90%. Most files compress below 1MB easily.
                  </AccordionContent>
                </AccordionItem>
                <div className="mx-6 h-px bg-border" />
                <AccordionItem value="item-3" className="px-6 border-b-0">
                  <AccordionTrigger className="text-left font-semibold hover:no-underline">
                    Does compressing PDF reduce quality?
                  </AccordionTrigger>
                  <AccordionContent className="text-slate-600 dark:text-muted-foreground pb-4">
                    Our PDF size reducer online maintains the best possible quality. Choose low compression to keep high quality, or high compression for maximum size reduction.
                  </AccordionContent>
                </AccordionItem>
                <div className="mx-6 h-px bg-border" />
                <AccordionItem value="item-4" className="px-6 border-b-0">
                  <AccordionTrigger className="text-left font-semibold hover:no-underline">
                    Is this PDF compressor really free?
                  </AccordionTrigger>
                  <AccordionContent className="text-slate-600 dark:text-muted-foreground pb-4">
                    100% free. No signup, no watermark, no hidden charges. Compress unlimited PDF files online free anytime.
                  </AccordionContent>
                </AccordionItem>
                <div className="mx-6 h-px bg-border" />
                <AccordionItem value="item-5" className="px-6 border-b-0">
                  <AccordionTrigger className="text-left font-semibold hover:no-underline">
                    What is the maximum PDF file size?
                  </AccordionTrigger>
                  <AccordionContent className="text-slate-600 dark:text-muted-foreground pb-4">
                    You can compress PDF files up to 100MB completely free. No account needed.
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
