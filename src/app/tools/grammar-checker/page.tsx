import { GrammarCheckerForm } from '@/components/tools/grammar-checker-form';
import { Card, CardContent } from '@/components/ui/card';
import { SpellCheck, ArrowRight, CheckCircle2, HelpCircle } from 'lucide-react';
import { ToolHeader } from '@/components/tools/tool-header';
import { RelatedTools } from '@/components/tools/related-tools';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import type { Metadata } from 'next';
import Link from 'next/link';

const tool = {
  name: 'Grammar Checker',
  url: 'https://onepagetools.vercel.app/tools/grammar-checker',
};

export const metadata: Metadata = {
  title: "Free Grammar Checker Online — Fix Grammar and Spelling Instantly | ToolifyHub",
  description: "Check and fix grammar mistakes free online instantly. Better than Grammarly — no signup, no payment, unlimited grammar and spell checks.",
  alternates: {
    canonical: tool.url,
  },
  openGraph: {
    title: "Free Grammar Checker Online — Fix Grammar Instantly | ToolifyHub",
    description: "Check grammar and spelling free online. No signup, unlimited checks, instant results. Better than Grammarly free.",
    url: tool.url,
  },
  twitter: {
    title: "Free Grammar Checker Online — Fix Grammar Instantly | ToolifyHub",
    description: "Check grammar and spelling free online. No signup, unlimited checks, instant results. Better than Grammarly free.",
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
      "name": "Free Grammar Checker Online",
      "url": "https://onepagetools.vercel.app/tools/grammar-checker",
      "description": "Free online grammar and spell checker. Fix errors instantly.",
      "applicationCategory": "UtilitiesApplication",
      "operatingSystem": "Any",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      },
      "featureList": [
        "Free grammar check online",
        "Spell checker free",
        "No signup required",
        "Unlimited checks",
        "Instant results"
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
          "name": "Is this grammar checker really free?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes — completely free online grammar checker. No signup, no payment, no limits. Check grammar as many times as you need."
          }
        },
        {
          "@type": "Question",
          "name": "How does this free grammar checker work?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Paste your text and click Check Grammar. Our free grammar and spell checker instantly scans for errors and shows corrections with clear explanations."
          }
        },
        {
          "@type": "Question",
          "name": "Is this better than Grammarly free?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Our free grammar checker online has no word limits, no account required, and no premium upsells. Check unlimited text completely free anytime."
          }
        },
        {
          "@type": "Question",
          "name": "Can it check spelling and punctuation too?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes. This free grammar spelling checker catches grammar mistakes, spelling errors, punctuation issues, and style problems all in one place."
          }
        },
        {
          "@type": "Question",
          "name": "Who should use this grammar checker?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Students checking essays, professionals writing emails, bloggers proofreading posts, and anyone who wants to write correctly in English — all for free, no signup."
          }
        }
      ]
    })}}
  />
);

export default function GrammarCheckerPage() {
  return (
    <div className="container mx-auto py-8 md:py-16 px-0 md:px-4 tool-page-fade">
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
      <div className="max-w-[900px] mx-auto space-y-6 md:space-y-8">
        <div className="flex flex-wrap gap-3 items-center text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 px-4 md:px-0">
          <span className="flex items-center gap-1.5"><ArrowRight className="w-3 h-3 text-primary" /> You might also need:</span>
          <Link href="/tools/text-summarizer" className="text-blue-400 hover:text-white transition-colors underline decoration-blue-400/30 underline-offset-4">Text Summarizer</Link>
          <span className="opacity-30">|</span>
          <Link href="/tools/resume-builder" className="text-blue-400 hover:text-white transition-colors underline decoration-blue-400/30 underline-offset-4">Resume Builder</Link>
          <span className="opacity-30">|</span>
          <Link href="/tools/plagiarism-checker" className="text-blue-400 hover:text-white transition-colors underline decoration-blue-400/30 underline-offset-4">Plagiarism Checker</Link>
        </div>

        <ToolHeader 
          title="Grammar & Spell Checker"
          description="Check grammar, spelling, and punctuation free online instantly. No signup required. Unlimited checks — perfect for students, writers, and professionals."
          icon={<SpellCheck className="w-6 h-6 md:w-8 md:h-8" />}
          category="Text"
        />

        <Card className="border-white/[0.08] bg-white/[0.02] md:bg-white/[0.03] rounded-none md:rounded-[24px] border-x-0 md:border-x">
          <CardContent className="p-5 md:p-12">
            <GrammarCheckerForm />
          </CardContent>
        </Card>

        {/* How to Use */}
        <section className="space-y-6 px-4 md:px-0">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold text-slate-900 dark:text-foreground">How to Use Grammar Checker</h2>
          </div>
          <Card className="bg-white dark:bg-card border-border">
            <CardContent className="p-6 md:p-8">
              <ol className="grid grid-cols-1 md:grid-cols-2 gap-6 list-none p-0">
                {[
                  "Type or paste your text into the grammar checker box above",
                  "Click Check Grammar to scan for errors instantly",
                  "Review suggestions — each error shown with correction and explanation",
                  "Apply fixes and copy your corrected text — free, no signup needed"
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
                  <AccordionTrigger className="text-left font-semibold text-slate-900 dark:text-foreground hover:no-underline">
                    Is this grammar checker really free?
                  </AccordionTrigger>
                  <AccordionContent className="text-slate-600 dark:text-muted-foreground pb-4">
                    Yes — completely free online grammar checker. No signup, no payment, no limits. Check grammar as many times as you need.
                  </AccordionContent>
                </AccordionItem>
                <div className="mx-6 h-px bg-border" />
                <AccordionItem value="item-2" className="px-6 border-b-0">
                  <AccordionTrigger className="text-left font-semibold text-slate-900 dark:text-foreground hover:no-underline">
                    How does this free grammar checker work?
                  </AccordionTrigger>
                  <AccordionContent className="text-slate-600 dark:text-muted-foreground pb-4">
                    Paste your text and click Check Grammar. Our free grammar and spell checker instantly scans for errors and shows corrections with clear explanations.
                  </AccordionContent>
                </AccordionItem>
                <div className="mx-6 h-px bg-border" />
                <AccordionItem value="item-3" className="px-6 border-b-0">
                  <AccordionTrigger className="text-left font-semibold text-slate-900 dark:text-foreground hover:no-underline">
                    Is this better than Grammarly free?
                  </AccordionTrigger>
                  <AccordionContent className="text-slate-600 dark:text-muted-foreground pb-4">
                    Our free grammar checker online has no word limits, no account required, and no premium upsells. Check unlimited text completely free anytime.
                  </AccordionContent>
                </AccordionItem>
                <div className="mx-6 h-px bg-border" />
                <AccordionItem value="item-4" className="px-6 border-b-0">
                  <AccordionTrigger className="text-left font-semibold text-slate-900 dark:text-foreground hover:no-underline">
                    Can it check spelling and punctuation too?
                  </AccordionTrigger>
                  <AccordionContent className="text-slate-600 dark:text-muted-foreground pb-4">
                    Yes. This free grammar spelling checker catches grammar mistakes, spelling errors, punctuation issues, and style problems all in one place.
                  </AccordionContent>
                </AccordionItem>
                <div className="mx-6 h-px bg-border" />
                <AccordionItem value="item-5" className="px-6 border-b-0">
                  <AccordionTrigger className="text-left font-semibold text-slate-900 dark:text-foreground hover:no-underline">
                    Who should use this grammar checker?
                  </AccordionTrigger>
                  <AccordionContent className="text-slate-600 dark:text-muted-foreground pb-4">
                    Students checking essays, professionals writing emails, bloggers proofreading posts, and anyone who wants to write correctly in English — all for free, no signup.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </section>

        <RelatedTools currentToolHref="/tools/grammar-checker" />
      </div>
    </div>
  );
}
