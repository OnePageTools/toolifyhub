
import { ImageCompressorForm } from '@/components/tools/image-compressor-form';
import { Card, CardContent } from '@/components/ui/card';
import { ImageIcon, ArrowRight, CheckCircle2, HelpCircle } from 'lucide-react';
import { ToolHeader } from '@/components/tools/tool-header';
import { RelatedTools } from '@/components/tools/related-tools';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import type { Metadata } from 'next';
import Link from 'next/link';

const tool = {
  name: 'Image Compressor',
  url: 'https://onepagetools.vercel.app/tools/image-compressor',
};

export const metadata: Metadata = {
  title: "Compress Image Online Free — Reduce Image Size Without Losing Quality | ToolifyHub",
  description: "Compress JPG PNG WEBP images free online. Reduce image file size without losing quality. No signup, no watermark, instant download.",
  alternates: {
    canonical: tool.url,
  },
  openGraph: {
    title: "Compress Image Online Free — Reduce Size Without Quality Loss | ToolifyHub",
    description: "Compress JPG PNG WEBP free online. Reduce image size without losing quality. No signup, instant download.",
    url: tool.url,
  },
  twitter: {
    title: "Compress Image Online Free — Reduce Size Without Quality Loss | ToolifyHub",
    description: "Compress JPG PNG WEBP free online. Reduce image size without losing quality. No signup, instant download.",
  },
  other: {
    'last-modified': '2026-05-16'
  }
};

const WebAppSchema = () => (
  <script
    type="application/ld+json"
    dangerouslySetInnerHTML={{ __html: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "Free Image Compressor Online",
      "url": "https://onepagetools.vercel.app/tools/image-compressor",
      "description": "Compress images online free without losing quality.",
      "applicationCategory": "MultimediaApplication",
      "operatingSystem": "Any",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      },
      "featureList": [
        "Compress image online free",
        "No quality loss",
        "No watermark",
        "No signup required",
        "JPG PNG WEBP support",
        "Up to 90% size reduction"
      ]
    })}}
  />
);

export default function ImageCompressorPage() {
  return (
    <div className="container mx-auto py-8 md:py-16 px-0 md:px-4 tool-page-fade">
      <WebAppSchema />
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
          <Link href="/tools/background-remover" className="text-blue-400 hover:text-white transition-colors underline decoration-blue-400/30 underline-offset-4">Background Remover</Link>
          <span className="opacity-30">|</span>
          <Link href="/tools/image-resizer" className="text-blue-400 hover:text-white transition-colors underline decoration-blue-400/30 underline-offset-4">Image Resizer</Link>
          <span className="opacity-30">|</span>
          <Link href="/tools/youtube-thumbnail-downloader" className="text-blue-400 hover:text-white transition-colors underline decoration-blue-400/30 underline-offset-4">YouTube Thumbnail Downloader</Link>
        </div>

        <ToolHeader 
          title="Image Compressor"
          description="Compress JPG, PNG, and WEBP images free online without losing quality. Reduce image file size for websites, social media, and email. No signup, no watermark ever."
          icon={<ImageIcon className="w-6 h-6 md:w-8 md:h-8" />}
          category="Image"
        />

        <Card className="border-white/[0.08] bg-white/[0.02] md:bg-white/[0.03] rounded-none md:rounded-[24px] border-x-0 md:border-x">
          <CardContent className="p-5 md:p-12">
            <ImageCompressorForm />
          </CardContent>
        </Card>

        {/* How to Use Section */}
        <section className="space-y-6 px-4 md:px-0">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold text-slate-900 dark:text-foreground">How to Use Image Compressor</h2>
          </div>
          <Card className="bg-white dark:bg-card border-border">
            <CardContent className="p-6 md:p-8">
              <ol className="grid grid-cols-1 md:grid-cols-2 gap-6 list-none p-0">
                {[
                  "Upload your image — JPG, PNG, WEBP or GIF supported",
                  "Adjust quality slider to control compression level",
                  "See original vs compressed size comparison instantly",
                  "Download compressed image free — no watermark, no signup needed"
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
                    How to compress image size online free?
                  </AccordionTrigger>
                  <AccordionContent className="text-slate-600 dark:text-muted-foreground pb-4">
                    Upload your image above, adjust the quality slider, and click Compress. Our free image compressor online reduces file size instantly — no signup, no watermark.
                  </AccordionContent>
                </AccordionItem>
                <div className="mx-6 h-px bg-border" />
                <AccordionItem value="item-2" className="px-6 border-b-0">
                  <AccordionTrigger className="text-left font-semibold hover:no-underline">
                    Can I compress image without losing quality?
                  </AccordionTrigger>
                  <AccordionContent className="text-slate-600 dark:text-muted-foreground pb-4">
                    Yes. Our free image size reducer online uses smart compression to maintain visual quality while reducing file size significantly. Choose higher quality setting for best results.
                  </AccordionContent>
                </AccordionItem>
                <div className="mx-6 h-px bg-border" />
                <AccordionItem value="item-3" className="px-6 border-b-0">
                  <AccordionTrigger className="text-left font-semibold hover:no-underline">
                    Which image formats can I compress?
                  </AccordionTrigger>
                  <AccordionContent className="text-slate-600 dark:text-muted-foreground pb-4">
                    Compress JPG, PNG, WEBP, and GIF images free online. Works on all image types without any signup or watermark.
                  </AccordionContent>
                </AccordionItem>
                <div className="mx-6 h-px bg-border" />
                <AccordionItem value="item-4" className="px-6 border-b-0">
                  <AccordionTrigger className="text-left font-semibold hover:no-underline">
                    How much can image size be reduced?
                  </AccordionTrigger>
                  <AccordionContent className="text-slate-600 dark:text-muted-foreground pb-4">
                    Our free image compressor can reduce image size by up to 90% without visible quality loss. Perfect for websites, emails, and social media uploads.
                  </AccordionContent>
                </AccordionItem>
                <div className="mx-6 h-px bg-border" />
                <AccordionItem value="item-5" className="px-6 border-b-0">
                  <AccordionTrigger className="text-left font-semibold hover:no-underline">
                    Does it work on mobile phones?
                  </AccordionTrigger>
                  <AccordionContent className="text-slate-600 dark:text-muted-foreground pb-4">
                    Yes — compress images on mobile free. Open in any mobile browser, upload image, compress, and download. No app needed, completely free.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </section>

        <RelatedTools currentToolHref="/tools/image-compressor" />
      </div>
    </div>
  );
}
