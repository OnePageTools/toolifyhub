import { YoutubeTranscriptForm } from '@/components/tools/youtube-transcript-form';
import { Card, CardContent } from '@/components/ui/card';
import { Captions, CheckCircle2, HelpCircle } from 'lucide-react';
import { ToolHeader } from '@/components/tools/tool-header';
import { RelatedTools } from '@/components/tools/related-tools';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "YouTube Transcript Generator Free — Get Video Transcript Instantly | ToolifyHub",
  description: "Extract transcript from any YouTube video free online. Copy or download subtitles instantly. No signup needed.",
  openGraph: {
    title: "YouTube Transcript Generator Free — Get Video Transcript Instantly | ToolifyHub",
    description: "Extract transcript from any YouTube video free online. Copy or download subtitles instantly. No signup needed.",
    url: "https://onepagetools.vercel.app/tools/youtube-transcript",
  },
  twitter: {
    title: "YouTube Transcript Generator Free — Get Video Transcript Instantly | ToolifyHub",
    description: "Extract transcript from any YouTube video free online. Copy or download subtitles instantly. No signup needed.",
  }
};

const FAQSchema = () => (
  <script
    type="application/ld+json"
    dangerouslySetInnerHTML={{ __html: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "Is this YouTube transcript tool free?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, completely free. No signup needed."
          }
        },
        {
          "@type": "Question",
          "name": "Which videos work with this tool?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Any YouTube video that has captions or subtitles enabled works perfectly."
          }
        },
        {
          "@type": "Question",
          "name": "Can I download the transcript?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, you can download the full text as a .txt file or as an .srt file with timestamps."
          }
        },
        {
          "@type": "Question",
          "name": "Does it work with auto-generated captions?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, our tool supports both manual uploads and auto-generated YouTube captions."
          }
        }
      ]
    })}}
  />
);

export default function YoutubeTranscriptPage() {
  const tool = {
    name: 'YouTube Transcript',
    url: '/tools/youtube-transcript',
  };

  return (
    <div className="container mx-auto py-8 md:py-16 px-0 md:px-4 tool-page-fade">
      <FAQSchema />
      <div className="max-w-[900px] mx-auto space-y-12">
        <ToolHeader 
          title="YouTube Transcript Generator"
          description="Instantly extract and download the full text transcript from any YouTube video."
          icon={<Captions className="w-6 h-6 md:w-8 md:h-8" />}
          category="Social Media"
        />

        <Card className="border-white/[0.08] bg-white/[0.02] md:bg-white/[0.03] rounded-none md:rounded-[24px] border-x-0 md:border-x">
          <CardContent className="p-5 md:p-12">
            <YoutubeTranscriptForm />
          </CardContent>
        </Card>

        {/* How to Use */}
        <section className="space-y-6 px-4 md:px-0">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold text-slate-900 dark:text-foreground">How to Get YouTube Transcript</h2>
          </div>
          <Card className="tool-card border-slate-800 bg-slate-800/30">
            <CardContent className="p-6 md:p-8">
              <ol className="grid grid-cols-1 md:grid-cols-2 gap-6 list-none p-0">
                {[
                  "Copy the URL of your favorite YouTube video",
                  "Paste the link into the box above",
                  "Click the 'Get Transcript' button",
                  "Copy the text or download as .txt or .srt"
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
          <Card className="tool-card border-slate-800 bg-slate-800/30">
            <CardContent className="p-0">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1" className="px-6 border-b-0">
                  <AccordionTrigger className="text-left font-semibold hover:no-underline">
                    Is this YouTube transcript tool free?
                  </AccordionTrigger>
                  <AccordionContent className="text-slate-600 dark:text-muted-foreground pb-4">
                    Yes, it's 100% free. We don't ask for credit cards or signups. Just paste and extract.
                  </AccordionContent>
                </AccordionItem>
                <div className="mx-6 h-px bg-slate-800" />
                <AccordionItem value="item-2" className="px-6 border-b-0">
                  <AccordionTrigger className="text-left font-semibold hover:no-underline">
                    Which videos work with this tool?
                  </AccordionTrigger>
                  <AccordionContent className="text-slate-600 dark:text-muted-foreground pb-4">
                    Most videos work, provided they have Closed Captions (CC) enabled by the creator or auto-generated by YouTube.
                  </AccordionContent>
                </AccordionItem>
                <div className="mx-6 h-px bg-slate-800" />
                <AccordionItem value="item-3" className="px-6 border-b-0">
                  <AccordionTrigger className="text-left font-semibold hover:no-underline">
                    Can I download the transcript?
                  </AccordionTrigger>
                  <AccordionContent className="text-slate-600 dark:text-muted-foreground pb-4">
                    Yes! You can download it as a plain text (.txt) file or as a professional .srt file which includes all the timing data.
                  </AccordionContent>
                </AccordionItem>
                <div className="mx-6 h-px bg-slate-800" />
                <AccordionItem value="item-4" className="px-6 border-b-0">
                  <AccordionTrigger className="text-left font-semibold hover:no-underline">
                    Does it work on mobile?
                  </AccordionTrigger>
                  <AccordionContent className="text-slate-600 dark:text-muted-foreground pb-4">
                    Absolutely. The tool is fully responsive and works perfectly on iPhones, Android devices, and tablets.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </section>

        <RelatedTools currentToolHref={tool.url} />
      </div>
    </div>
  );
}
