import { YoutubeTranscriptForm } from '@/components/tools/youtube-transcript-form';
import { Card, CardContent } from '@/components/ui/card';
import { Captions, CheckCircle2, HelpCircle } from 'lucide-react';
import { ToolHeader } from '@/components/tools/tool-header';
import { RelatedTools } from '@/components/tools/related-tools';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "YouTube Transcript Extractor Free — Clean & Copy Video Text | ToolifyHub",
  description: "Easily extract and clean YouTube transcripts. Automatically remove timestamps, music tags, and messy formatting for free. No signup required.",
  openGraph: {
    title: "YouTube Transcript Extractor Free — Clean & Copy Video Text | ToolifyHub",
    description: "Easily extract and clean YouTube transcripts. Automatically remove timestamps and formatting for free.",
    url: "https://onepagetools.vercel.app/tools/youtube-transcript",
  },
  twitter: {
    title: "YouTube Transcript Extractor Free — Clean & Copy Video Text | ToolifyHub",
    description: "Easily extract and clean YouTube transcripts. Automatically remove timestamps and formatting for free.",
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
          "name": "How do I get a transcript from a YouTube video?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Open any YouTube video, click the 'More (...)' button below the video, select 'Show Transcript', and copy the text. Paste it into our tool to clean it instantly."
          }
        },
        {
          "@type": "Question",
          "name": "Does this tool remove timestamps?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes! Our tool automatically detects and strips all timestamps (like 0:00 or 12:34) to leave you with only the spoken text."
          }
        },
        {
          "@type": "Question",
          "name": "Is this YouTube transcript extractor free?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, it is 100% free with no usage limits and no signup required."
          }
        },
        {
          "@type": "Question",
          "name": "Why can't I see the 'Show Transcript' option on YouTube?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "If the option is missing, it's likely because the video creator has disabled captions or the video is still processing its automatic subtitles."
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
          title="YouTube Transcript Extractor"
          description="The easiest way to extract, clean, and format text from any YouTube video without the technical mess."
          icon={<Captions className="w-6 h-6 md:w-8 md:h-8" />}
          category="Social Media"
        />

        <Card className="border-white/[0.08] bg-white/[0.02] md:bg-white/[0.03] rounded-none md:rounded-[24px] border-x-0 md:border-x shadow-2xl">
          <CardContent className="p-5 md:p-12">
            <YoutubeTranscriptForm />
          </CardContent>
        </Card>

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
                  <AccordionTrigger className="text-left font-semibold hover:no-underline text-foreground">
                    Is this tool safe to use?
                  </AccordionTrigger>
                  <AccordionContent className="text-slate-600 dark:text-muted-foreground pb-4">
                    Yes, absolutely. The text processing happens entirely inside your browser. We don't save your transcripts or track the videos you analyze.
                  </AccordionContent>
                </AccordionItem>
                <div className="mx-6 h-px bg-slate-800" />
                <AccordionItem value="item-2" className="px-6 border-b-0">
                  <AccordionTrigger className="text-left font-semibold hover:no-underline text-foreground">
                    What tags does the cleaner remove?
                  </AccordionTrigger>
                  <AccordionContent className="text-slate-600 dark:text-muted-foreground pb-4">
                    It strips out timestamps, speaker names (if in brackets), and common non-speech tags like [Music], [Applause], and (Laughter).
                  </AccordionContent>
                </AccordionItem>
                <div className="mx-6 h-px bg-slate-800" />
                <AccordionItem value="item-3" className="px-6 border-b-0">
                  <AccordionTrigger className="text-left font-semibold hover:no-underline text-foreground">
                    Can I use this for long videos?
                  </AccordionTrigger>
                  <AccordionContent className="text-slate-600 dark:text-muted-foreground pb-4">
                    Yes. There is no word limit. You can paste transcripts from 1-minute shorts or 3-hour podcasts and it will clean them just the same.
                  </AccordionContent>
                </AccordionItem>
                <div className="mx-6 h-px bg-slate-800" />
                <AccordionItem value="item-4" className="px-6 border-b-0">
                  <AccordionTrigger className="text-left font-semibold hover:no-underline text-foreground">
                    Does it work on mobile?
                  </AccordionTrigger>
                  <AccordionContent className="text-slate-600 dark:text-muted-foreground pb-4">
                    Yes, though copying the transcript on the YouTube mobile app can be tricky. We recommend using a desktop browser or opening YouTube in 'Desktop Mode' on your mobile browser.
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
