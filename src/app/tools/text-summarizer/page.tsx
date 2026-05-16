import { TextSummarizerForm } from '@/components/tools/text-summarizer-form';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BookOpen, HelpCircle, CheckCircle2, ArrowRight } from 'lucide-react';
import { ToolHeader } from '@/components/tools/tool-header';
import { RelatedTools } from '@/components/tools/related-tools';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { cn } from '@/lib/utils';
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';

const tool = {
  name: 'Text Summarizer',
  url: '/tools/text-summarizer',
  fullUrl: 'https://onepagetools.vercel.app/tools/text-summarizer',
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
  },
  other: {
    'last-modified': '2026-05-16'
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
                "item": tool.fullUrl
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
          <Link href="/tools/word-counter" className="text-blue-400 hover:text-white transition-colors underline decoration-blue-400/30 underline-offset-4">Word Counter</Link>
          <span className="opacity-30">|</span>
          <Link href="/tools/ai-essay-writer" className="text-blue-400 hover:text-white transition-colors underline decoration-blue-400/30 underline-offset-4">AI Essay Writer</Link>
        </div>

        <ToolHeader 
          title="Text Summarizer"
          description="Condense long articles into concise points. After summarizing, use our Grammar Checker to ensure your key takeaways are written perfectly."
          icon={<BookOpen className="w-6 h-6 md:w-8 md:h-8" />}
          category="Text"
        />

        <div className="text-center space-y-2 mb-8 px-4 md:px-0">
          <p className="text-lg text-slate-600 dark:text-muted-foreground leading-relaxed">
            Paste any article, essay, or document below. Get a clear summary in seconds — 
            no account needed, no limits.
          </p>
        </div>

        <Card className="bg-white dark:bg-card border-border shadow-sm dark:shadow-none overflow-hidden">
          <CardContent className="p-5 md:p-12">
            <TextSummarizerForm />
          </CardContent>
        </Card>

        {/* Author Bio Section */}
        <div className="mt-12 p-8 bg-secondary/10 border border-border rounded-3xl flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white text-2xl font-black shrink-0 shadow-lg">
            TH
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-foreground">ToolifyHub Team</h3>
            <p className="text-slate-500 dark:text-muted-foreground leading-relaxed">
              We build free tools to make everyone's life easier. Our <Link href="/tools/text-summarizer" className="text-primary hover:underline">free text summarizer</Link> is designed to be fast, accurate, and respect your privacy. No signups, no payments, just results.
            </p>
          </div>
        </div>

        {/* Content Section: How to Use */}
        <section className="space-y-6 pt-8">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold text-slate-900 dark:text-foreground">How to Summarize Text Online Free</h2>
          </div>
          <Card className="bg-white dark:bg-card border-border">
            <CardContent className="p-6 md:p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-6">
                  <p className="text-slate-600 dark:text-muted-foreground leading-relaxed">
                    Our <strong>online summarizing tool</strong> is built for speed and simplicity. Whether you need to <strong>summarize paragraph free</strong> for a quick check or use an <strong>article summarizer free</strong> for long research papers, our tool delivers consistent quality.
                  </p>
                  <ol className="space-y-4 list-none p-0">
                    {[
                      "Paste your article or text in the box above to use our free text summarizer.",
                      "Choose your summary length (Short, Medium, or Detailed) to summarize text online free.",
                      "Click the Summarize button to process your document instantly.",
                      "Copy or download your summary for your academic or professional work."
                    ].map((step, i) => (
                      <li key={i} className="flex gap-4 items-start">
                        <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                          {i + 1}
                        </span>
                        <p className="text-slate-600 dark:text-muted-foreground pt-1">{step}</p>
                      </li>
                    ))}
                  </ol>
                </div>
                <div className="relative aspect-[4/3] md:aspect-square rounded-2xl overflow-hidden border border-border bg-slate-50 dark:bg-slate-900 group">
                   <Image 
                    src="https://picsum.photos/seed/summarize/800/800" 
                    alt="free text summarizer tool online" 
                    fill 
                    className="object-cover opacity-40 group-hover:opacity-60 transition-opacity"
                    data-ai-hint="summarization tool"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="p-6 bg-white/80 dark:bg-black/80 backdrop-blur-md rounded-2xl shadow-xl border border-white/20">
                      <BookOpen className="w-12 h-12 text-primary" />
                    </div>
                  </div>
                </div>
              </div>
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
                <AccordionItem value="item-wiki" className="px-6 border-b-0">
                  <AccordionTrigger className="text-left font-semibold text-slate-900 dark:text-foreground hover:no-underline">
                    Where can I learn more about how AI summarization works?
                  </AccordionTrigger>
                  <AccordionContent className="text-slate-600 dark:text-muted-foreground pb-4">
                    Our tool uses advanced algorithms to extract key information. <a href="https://en.wikipedia.org/wiki/Automatic_summarization" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-bold">Learn more about text summarization on Wikipedia</a> to understand the science behind automatic content condensation.
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

        <RelatedTools currentToolHref="/tools/text-summarizer" />
      </div>
    </div>
  );
}

const Separator = ({ className }: { className?: string }) => (
  <div className={cn("h-px bg-border", className)} />
);
