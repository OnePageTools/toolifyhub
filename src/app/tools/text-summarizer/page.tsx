import { TextSummarizerForm } from '@/components/tools/text-summarizer-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, HelpCircle, CheckCircle2 } from 'lucide-react';
import { ToolHeader } from '@/components/tools/tool-header';
import { RelatedTools } from '@/components/tools/related-tools';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import type { Metadata } from 'next';

const tool = {
  name: 'Text Summarizer',
  url: '/tools/text-summarizer',
  title: "Free Text Summarizer Online — Summarize Any Text Instantly | ToolifyHub",
  description: "Summarize long articles, documents and text free online instantly. AI powered. No signup needed.",
};

export const metadata: Metadata = {
  title: tool.title,
  description: tool.description,
  openGraph: {
    title: tool.title,
    description: tool.description,
    url: `https://onepagetools.vercel.app${tool.url}`,
  },
  twitter: {
    title: "Free Text Summarizer Online — Summarize Any Text | ToolifyHub",
    description: tool.description,
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
          "name": "What is a free text summarizer?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "A free text summarizer is an online tool that automatically condenses long articles, documents, or any text into shorter, easy-to-read summaries without losing the key points."
          }
        },
        {
          "@type": "Question",
          "name": "How does this summarizer tool work?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Simply paste your text, choose summary length (short, medium, or detailed), and click Summarize. The tool analyzes your text and extracts the most important information instantly."
          }
        },
        {
          "@type": "Question",
          "name": "Is this text summarizer really free?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, completely free. No signup, no payment, no watermark. Use it unlimited times."
          }
        },
        {
          "@type": "Question",
          "name": "What types of text can I summarize?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "You can summarize articles, essays, research papers, blog posts, news articles, books chapters, emails, and any other text."
          }
        },
        {
          "@type": "Question",
          "name": "Is there a word limit?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Our tool handles texts of any length. For best results, paste text between 100 to 10,000 words."
          }
        }
      ]
    })}}
  />
);

export default function TextSummarizerPage() {
  return (
    <div className="container mx-auto py-8 md:py-16 px-4 tool-page-fade">
      <FAQSchema />
      <div className="max-w-[900px] mx-auto space-y-12">
        <ToolHeader 
          title="Text Summarizer"
          description="Quickly summarize long articles, documents, or any text into concise and easy-to-read points."
          icon={<BookOpen className="w-6 h-6 md:w-8 md:h-8" />}
          category="Text"
        />

        <Card className="bg-white dark:bg-card border-border shadow-sm dark:shadow-none overflow-hidden">
          <CardContent className="p-5 md:p-12">
            <TextSummarizerForm />
          </CardContent>
        </Card>

        {/* Content Section: How to Use */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold text-slate-900 dark:text-foreground">How to Summarize Text Online Free</h2>
          </div>
          <Card className="bg-white dark:bg-card border-border">
            <CardContent className="p-6 md:p-8">
              <ol className="grid grid-cols-1 md:grid-cols-2 gap-6 list-none p-0">
                {[
                  "Paste your article or text in the box above",
                  "Choose your summary length (Short, Medium, or Detailed)",
                  "Click the Summarize button to process instantly",
                  "Copy or download your summary for your work"
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
          <Card className="bg-white dark:bg-card border-border">
            <CardContent className="p-0">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1" className="px-6 border-b-0">
                  <AccordionTrigger className="text-left font-semibold text-slate-900 dark:text-foreground hover:no-underline">
                    What is a free text summarizer?
                  </AccordionTrigger>
                  <AccordionContent className="text-slate-600 dark:text-muted-foreground pb-4">
                    A free text summarizer is an online tool that automatically condenses long articles, documents, or any text into shorter, easy-to-read summaries without losing the key points.
                  </AccordionContent>
                </AccordionItem>
                <Separator className="mx-6" />
                <AccordionItem value="item-2" className="px-6 border-b-0">
                  <AccordionTrigger className="text-left font-semibold text-slate-900 dark:text-foreground hover:no-underline">
                    How does this summarizer tool work?
                  </AccordionTrigger>
                  <AccordionContent className="text-slate-600 dark:text-muted-foreground pb-4">
                    Simply paste your text, choose summary length (short, medium, or detailed), and click Summarize. The tool analyzes your text and extracts the most important information instantly.
                  </AccordionContent>
                </AccordionItem>
                <Separator className="mx-6" />
                <AccordionItem value="item-3" className="px-6 border-b-0">
                  <AccordionTrigger className="text-left font-semibold text-slate-900 dark:text-foreground hover:no-underline">
                    Is this text summarizer really free?
                  </AccordionTrigger>
                  <AccordionContent className="text-slate-600 dark:text-muted-foreground pb-4">
                    Yes, completely free. No signup, no payment, no watermark. Use it unlimited times.
                  </AccordionContent>
                </AccordionItem>
                <Separator className="mx-6" />
                <AccordionItem value="item-4" className="px-6 border-b-0">
                  <AccordionTrigger className="text-left font-semibold text-slate-900 dark:text-foreground hover:no-underline">
                    What types of text can I summarize?
                  </AccordionTrigger>
                  <AccordionContent className="text-slate-600 dark:text-muted-foreground pb-4">
                    You can summarize articles, essays, research papers, blog posts, news articles, books chapters, emails, and any other text.
                  </AccordionContent>
                </AccordionItem>
                <Separator className="mx-6" />
                <AccordionItem value="item-5" className="px-6 border-b-0">
                  <AccordionTrigger className="text-left font-semibold text-slate-900 dark:text-foreground hover:no-underline">
                    Is there a word limit?
                  </AccordionTrigger>
                  <AccordionContent className="text-slate-600 dark:text-muted-foreground pb-4">
                    Our tool handles texts of any length. For best results, paste text between 100 to 10,000 words.
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

const Separator = ({ className }: { className?: string }) => (
  <div className={cn("h-px bg-border", className)} />
);
