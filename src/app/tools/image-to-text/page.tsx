'use client';

import { ImageToTextForm } from '@/components/tools/image-to-text-form';
import { Card, CardContent } from '@/components/ui/card';
import { Type, CheckCircle2, HelpCircle, ArrowRight } from 'lucide-react';
import { ToolHeader } from '@/components/tools/tool-header';
import { RelatedTools } from '@/components/tools/related-tools';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import Link from 'next/link';

const tool = {
  name: 'Image to Text (OCR)',
  url: 'https://onepagetools.vercel.app/tools/image-to-text',
};

const WebAppSchema = () => (
  <script
    type="application/ld+json"
    dangerouslySetInnerHTML={{ __html: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "Free Image to Text Converter Online",
      "url": "https://onepagetools.vercel.app/tools/image-to-text",
      "description": "Extract text from any image free online using AI OCR technology.",
      "applicationCategory": "UtilitiesApplication",
      "operatingSystem": "Any",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      },
      "featureList": [
        "Free image to text conversion",
        "AI OCR technology",
        "No signup required",
        "Download as TXT",
        "100% private (client-side)",
        "Supports JPG, PNG, WEBP"
      ]
    })}}
  />
);

export default function ImageToTextPage() {
  return (
    <div className="container mx-auto py-8 md:py-16 px-0 md:px-4 tool-page-fade">
      <title>Free Image to Text Converter Online — OCR Text Scanner | ToolifyHub</title>
      <meta name="description" content="Extract text from any image free online with our AI OCR tool. Convert JPG PNG to editable text instantly. No signup, 100% private." />
      <WebAppSchema />
       <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://onepagetools.vercel.app" },
              { "@type": "ListItem", "position": 2, "name": "Tools", "item": "https://onepagetools.vercel.app" },
              { "@type": "ListItem", "position": 3, "name": tool.name, "item": tool.url }
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
          <Link href="/tools/pdf-to-word" className="text-blue-400 hover:text-white transition-colors underline decoration-blue-400/30 underline-offset-4">PDF to Word</Link>
        </div>

        <ToolHeader 
          title="Image to Text (OCR)"
          description="Extract text from any image free online instantly. Our AI-powered OCR tool accurately scans and converts photos, screenshots, and scanned documents into editable text. No signup, no storage — 100% private."
          icon={<Type />}
          category="Image"
        />

        <Card className="border-white/[0.08] bg-white/[0.02] md:bg-white/[0.03] rounded-none md:rounded-[24px] border-x-0 md:border-x">
          <CardContent className="p-5 md:p-12">
            <ImageToTextForm />
          </CardContent>
        </Card>

        {/* Instructions */}
        <section className="space-y-6 px-4 md:px-0">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold text-slate-900 dark:text-foreground">How to Use Image to Text Converter</h2>
          </div>
          <Card className="bg-white dark:bg-card border-border">
            <CardContent className="p-6 md:p-8">
              <ol className="grid grid-cols-1 md:grid-cols-2 gap-6 list-none p-0">
                {[
                  "Upload your image — drag and drop or click to browse",
                  "Wait for our AI to scan and recognize the text content",
                  "Review and edit the extracted text in the result box",
                  "Copy or download as a text file — 100% free and private"
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
        <section className="space-y-6 px-4 md:px-0">
          <div className="flex items-center gap-3">
            <HelpCircle className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold text-slate-900 dark:text-foreground">Frequently Asked Questions</h2>
          </div>
          <Card className="bg-white dark:bg-card border-border">
            <CardContent className="p-0">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1" className="px-6 border-b-0">
                  <AccordionTrigger className="text-left font-semibold hover:no-underline">
                    Is this OCR tool really free?
                  </AccordionTrigger>
                  <AccordionContent className="text-slate-600 dark:text-muted-foreground pb-4">
                    Yes — completely free online image to text converter. No signup, no payment, and no limits. Extract text from as many images as you need.
                  </AccordionContent>
                </AccordionItem>
                <div className="mx-6 h-px bg-border" />
                <AccordionItem value="item-2" className="px-6 border-b-0">
                  <AccordionTrigger className="text-left font-semibold hover:no-underline">
                    Is my image data private?
                  </AccordionTrigger>
                  <AccordionContent className="text-slate-600 dark:text-muted-foreground pb-4">
                    Absolutely. The extraction process happens entirely in your browser using client-side JavaScript. Your images are never uploaded to any server.
                  </AccordionContent>
                </AccordionItem>
                <div className="mx-6 h-px bg-border" />
                <AccordionItem value="item-3" className="px-6 border-b-0">
                  <AccordionTrigger className="text-left font-semibold hover:no-underline">
                    Which image formats are supported?
                  </AccordionTrigger>
                  <AccordionContent className="text-slate-600 dark:text-muted-foreground pb-4">
                    We support JPG, JPEG, PNG, WEBP, BMP, and GIF. For best results, ensure the text in the image is clear and well-lit.
                  </AccordionContent>
                </AccordionItem>
                <div className="mx-6 h-px bg-border" />
                <AccordionItem value="item-4" className="px-6 border-b-0">
                  <AccordionTrigger className="text-left font-semibold hover:no-underline">
                    Can I download the extracted text?
                  </AccordionTrigger>
                  <AccordionContent className="text-slate-600 dark:text-muted-foreground pb-4">
                    Yes, you can copy the text to your clipboard with one click or download it as a .txt file for offline use.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </section>

        <RelatedTools currentToolHref="/tools/image-to-text" />
      </div>
    </div>
  );
}
