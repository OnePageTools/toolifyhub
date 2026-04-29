
import type { Metadata } from 'next';
import { GrammarCheckerForm } from '@/components/tools/grammar-checker-form';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import AIHelper from '@/components/ai-assistant';
import { SpellCheck } from 'lucide-react';

const tool = {
  name: 'Grammar and Spell Checker',
  url: '/tools/grammar-checker',
  title: 'Free Grammar and Spell Checker - AI Writing Assistant',
  description: 'Improve your writing with our free AI-powered grammar and spell checker. Corrects spelling, punctuation, and style errors instantly for flawless text.',
  keywords: 'grammar checker, spell checker, punctuation checker, proofreading tool, writing assistant, check grammar online',
};

export const metadata: Metadata = {
  title: tool.title,
  description: tool.description,
  keywords: tool.keywords.split(','),
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
      "applicationCategory": "TextApplication",
      "operatingSystem": "All",
      "url": `https://toolifyhub.com${tool.url}`,
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      }
    })}}
  />
);

export default function GrammarCheckerPage() {
  return (
    <>
      <WebAppSchema />
      <div className="container mx-auto py-10 px-4">
        <div className="max-w-5xl mx-auto">
          <Card className="shadow-lg border-primary/20">
            <CardHeader className="text-center bg-secondary/50 p-8">
              <div className="mx-auto w-fit p-4 bg-gradient-to-br from-primary/10 to-accent/10 rounded-full mb-4">
                <SpellCheck className="w-10 h-10 text-primary" />
              </div>
              <CardTitle className="font-headline text-3xl sm:text-4xl bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-primary/80">
                Grammar & Spell Checker
              </CardTitle>
              <CardDescription className="text-lg mt-2 max-w-2xl mx-auto">
                Paste your text below to get instant feedback on grammar, spelling, and punctuation.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 md:p-8">
              <GrammarCheckerForm />
            </CardContent>
          </Card>
        </div>
        <AIHelper toolName="Grammar Checker" />
      </div>
    </>
  );
}
